
WITH ranked_events AS (
  SELECT
    concat(e.runID, '|', e.event_type, '|', cast(e.timestamp_unixus AS string)) AS event_key,
    e.runID AS run_id,
    e.run_date_iso,
    e.model_nickname,
    e.model_session_id,
    e.author,
    e.event_type,
    e.timestamp_unixus AS event_timestamp_unixus,
    e.event_startOrEnd_timestampunixus AS event_boundary_timestamp_unixus,
    e.event_duration,
    e.event_startOrEnd_method,
    e.gearchange_timestamp,
    e.gear_to_accel_sec,
    e.accel_to_end_sec,
    e.av_mode_at_event,
    e.URL AS console_url,
    e.has_disengagement,
    e.disengagement_what,
    e.disengagement_why,
    e.disengagement_timestamp_unixus,
    e.has_disengagement_gear_to_start,
    e.disengagement_what_gear_to_start,
    e.disengagement_why_gear_to_start,
    e.disengagement_timestamp_unixus_gear_to_start,
    e.has_disengagement_before_gearchange_10s,
    e.disengagement_what_before_gearchange_10s,
    e.disengagement_why_before_gearchange_10s,
    e.disengagement_timestamp_unixus_before_gearchange_10s,
    row_number() OVER (PARTITION BY lower(e.model_nickname) ORDER BY e.timestamp_unixus DESC) AS event_rank,
    array_min(
      filter(
        array(
          e.disengagement_timestamp_unixus_before_gearchange_10s,
          e.disengagement_timestamp_unixus_gear_to_start,
          e.disengagement_timestamp_unixus
        ),
        x -> x IS NOT NULL
      )
    ) AS relevant_disengagement_timestamp_unixus
  FROM hive_metastore.parking.pudo_unpudo_unpark_events e
  WHERE e.event_type IN ('unpudo', 'unparking')
    AND lower(e.model_nickname) = lower('satisfied-amber-moose')
    AND e.run_date_iso >= '2026-04-01'
    AND e.run_date_iso <= '2026-04-22'
),
events AS (
  SELECT *
  FROM ranked_events
  WHERE event_rank <= 5
),
events_with_diseng AS (
  SELECT
    e.*,
    CASE
      WHEN e.relevant_disengagement_timestamp_unixus = e.disengagement_timestamp_unixus_before_gearchange_10s
        THEN e.disengagement_what_before_gearchange_10s
      WHEN e.relevant_disengagement_timestamp_unixus = e.disengagement_timestamp_unixus_gear_to_start
        THEN e.disengagement_what_gear_to_start
      WHEN e.relevant_disengagement_timestamp_unixus = e.disengagement_timestamp_unixus
        THEN e.disengagement_what
      ELSE NULL
    END AS relevant_disengagement_what,
    CASE
      WHEN e.relevant_disengagement_timestamp_unixus = e.disengagement_timestamp_unixus_before_gearchange_10s
        THEN e.disengagement_why_before_gearchange_10s
      WHEN e.relevant_disengagement_timestamp_unixus = e.disengagement_timestamp_unixus_gear_to_start
        THEN e.disengagement_why_gear_to_start
      WHEN e.relevant_disengagement_timestamp_unixus = e.disengagement_timestamp_unixus
        THEN e.disengagement_why
      ELSE NULL
    END AS relevant_disengagement_why
  FROM events e
),
nav_samples AS (
  SELECT
    e.event_key,
    e.run_id,
    e.event_timestamp_unixus,
    cast(n.header.timestamp.seconds * 1000000L + cast(n.header.timestamp.nanos / 1000 AS bigint) AS bigint) AS nav_timestamp_unixus,
    size(n.steps) AS nav_step_count,
    element_at(n.steps, -1).maneuver.instruction AS nav_last_instruction,
    element_at(n.steps, -1).maneuver.distance_from_current_location_m AS nav_last_distance_m,
    n.route_state AS nav_route_state
  FROM events_with_diseng e
  JOIN prod_data_pipeline.raw__gen2.robot_navigation_instructions n
    ON n.run_id = e.run_id
   AND n.run_date_iso = e.run_date_iso
   AND cast(n.header.timestamp.seconds * 1000000L + cast(n.header.timestamp.nanos / 1000 AS bigint) AS bigint)
       BETWEEN e.event_timestamp_unixus - 600000000L
           AND e.event_timestamp_unixus + 5000000L
),
nav_change_candidates AS (
  SELECT
    s.*,
    lag(s.nav_last_distance_m) OVER (PARTITION BY s.event_key ORDER BY s.nav_timestamp_unixus) AS prev_nav_last_distance_m,
    lag(s.nav_step_count) OVER (PARTITION BY s.event_key ORDER BY s.nav_timestamp_unixus) AS prev_nav_step_count
  FROM nav_samples s
),
nav_change AS (
  SELECT
    event_key,
    max_by(nav_timestamp_unixus, nav_timestamp_unixus) AS nav_change_timestamp_unixus
  FROM nav_change_candidates
  WHERE nav_timestamp_unixus <= event_timestamp_unixus
    AND prev_nav_last_distance_m IS NOT NULL
    AND nav_last_distance_m IS NOT NULL
    AND prev_nav_last_distance_m <= 30
    AND (
      nav_last_distance_m >= prev_nav_last_distance_m + 50
      OR (
        prev_nav_step_count IS NOT NULL
        AND nav_step_count >= prev_nav_step_count + 2
        AND nav_last_distance_m >= prev_nav_last_distance_m + 25
      )
    )
  GROUP BY event_key
),
event_windows AS (
  SELECT
    e.*,
    n.nav_change_timestamp_unixus,
    CASE WHEN n.nav_change_timestamp_unixus IS NOT NULL THEN true ELSE false END AS nav_change_detected,
    coalesce(n.nav_change_timestamp_unixus, e.event_timestamp_unixus) - 20000000L AS window_start_unixus,
    coalesce(e.relevant_disengagement_timestamp_unixus + 20000000L, e.event_timestamp_unixus + 60000000L) AS window_end_unixus
  FROM events_with_diseng e
  LEFT JOIN nav_change n
    ON e.event_key = n.event_key
),
nav_stream AS (
  SELECT
    ew.event_key,
    ew.run_id,
    ew.run_date_iso,
    ew.model_nickname,
    ew.model_session_id,
    ew.author,
    ew.event_type,
    ew.event_timestamp_unixus,
    ew.event_boundary_timestamp_unixus,
    ew.gearchange_timestamp,
    ew.nav_change_timestamp_unixus,
    ew.nav_change_detected,
    ew.relevant_disengagement_timestamp_unixus,
    ew.relevant_disengagement_what,
    ew.relevant_disengagement_why,
    ew.window_start_unixus,
    ew.window_end_unixus,
    ew.console_url,
    'robot_navigation_instructions' AS source_table,
    ns.nav_timestamp_unixus AS sample_timestamp_unixus,
    timestamp_micros(ns.nav_timestamp_unixus) AS sample_timestamp_utc,
    ns.nav_step_count,
    ns.nav_last_instruction,
    ns.nav_last_distance_m,
    ns.nav_route_state,
    cast(null AS boolean) AS controller_is_dbw,
    cast(null AS string) AS controller_current_drive_position,
    cast(null AS double) AS controller_current_accel_pedal_pct,
    cast(null AS string) AS controller_output_indicators_state,
    cast(null AS string) AS controller_output_interface_indicators_state,
    cast(null AS double) AS controller_accelerator_command,
    cast(null AS double) AS controller_brake_command,
    cast(null AS double) AS controller_acceleration_command_mps2,
    cast(null AS string) AS vehicle_drive_position,
    cast(null AS string) AS vehicle_control_mode,
    cast(null AS double) AS vehicle_accelerator_pedal_pct,
    cast(null AS double) AS vehicle_brake_pedal_pct,
    cast(null AS double) AS vehicle_speed_mps,
    cast(null AS string) AS vehicle_indicators_switch,
    cast(null AS string) AS vehicle_indicators_light,
    cast(null AS string) AS plan_predicted_drive_position,
    cast(null AS string) AS plan_first_step_indicator,
    cast(null AS int) AS plan_step_count,
    cast(null AS boolean) AS trajectory_is_dbw,
    cast(null AS int) AS trajectory_waypoint_count,
    cast(null AS int) AS trajectory_plan_step_count
  FROM event_windows ew
  JOIN nav_samples ns
    ON ew.event_key = ns.event_key
   AND ns.nav_timestamp_unixus BETWEEN ew.window_start_unixus AND ew.window_end_unixus
),
controller_stream AS (
  SELECT
    ew.event_key,
    ew.run_id,
    ew.run_date_iso,
    ew.model_nickname,
    ew.model_session_id,
    ew.author,
    ew.event_type,
    ew.event_timestamp_unixus,
    ew.event_boundary_timestamp_unixus,
    ew.gearchange_timestamp,
    ew.nav_change_timestamp_unixus,
    ew.nav_change_detected,
    ew.relevant_disengagement_timestamp_unixus,
    ew.relevant_disengagement_what,
    ew.relevant_disengagement_why,
    ew.window_start_unixus,
    ew.window_end_unixus,
    ew.console_url,
    'robot_control_controller_state' AS source_table,
    cast(c.header.timestamp.seconds * 1000000L + cast(c.header.timestamp.nanos / 1000 AS bigint) AS bigint) AS sample_timestamp_unixus,
    timestamp_micros(cast(c.header.timestamp.seconds * 1000000L + cast(c.header.timestamp.nanos / 1000 AS bigint) AS bigint)) AS sample_timestamp_utc,
    cast(null AS int) AS nav_step_count,
    cast(null AS string) AS nav_last_instruction,
    cast(null AS double) AS nav_last_distance_m,
    cast(null AS string) AS nav_route_state,
    c.internal_state.input_vehicle_state.is_drive_by_wire AS controller_is_dbw,
    c.internal_state.input_vehicle_state.current_drive_position AS controller_current_drive_position,
    c.internal_state.input_vehicle_state.current_accelerator_pedal_input_pct AS controller_current_accel_pedal_pct,
    c.internal_state.output.indicators_state AS controller_output_indicators_state,
    c.internal_state.output_interface.indicators_state AS controller_output_interface_indicators_state,
    c.internal_state.output_interface.actuator_setpoint.accelerator_command AS controller_accelerator_command,
    c.internal_state.output_interface.actuator_setpoint.brake_command AS controller_brake_command,
    c.internal_state.output_interface.actuator_setpoint.acceleration_command_mps2 AS controller_acceleration_command_mps2,
    cast(null AS string) AS vehicle_drive_position,
    cast(null AS string) AS vehicle_control_mode,
    cast(null AS double) AS vehicle_accelerator_pedal_pct,
    cast(null AS double) AS vehicle_brake_pedal_pct,
    cast(null AS double) AS vehicle_speed_mps,
    cast(null AS string) AS vehicle_indicators_switch,
    cast(null AS string) AS vehicle_indicators_light,
    cast(null AS string) AS plan_predicted_drive_position,
    cast(null AS string) AS plan_first_step_indicator,
    cast(null AS int) AS plan_step_count,
    cast(null AS boolean) AS trajectory_is_dbw,
    cast(null AS int) AS trajectory_waypoint_count,
    cast(null AS int) AS trajectory_plan_step_count
  FROM event_windows ew
  JOIN prod_data_pipeline.raw__gen2.robot_control_controller_state c
    ON c.run_id = ew.run_id
   AND c.run_date_iso = ew.run_date_iso
   AND cast(c.header.timestamp.seconds * 1000000L + cast(c.header.timestamp.nanos / 1000 AS bigint) AS bigint)
       BETWEEN ew.window_start_unixus AND ew.window_end_unixus
),
vehicle_stream AS (
  SELECT
    ew.event_key,
    ew.run_id,
    ew.run_date_iso,
    ew.model_nickname,
    ew.model_session_id,
    ew.author,
    ew.event_type,
    ew.event_timestamp_unixus,
    ew.event_boundary_timestamp_unixus,
    ew.gearchange_timestamp,
    ew.nav_change_timestamp_unixus,
    ew.nav_change_detected,
    ew.relevant_disengagement_timestamp_unixus,
    ew.relevant_disengagement_what,
    ew.relevant_disengagement_why,
    ew.window_start_unixus,
    ew.window_end_unixus,
    ew.console_url,
    'robot_vehicle_driver_vehicle_state' AS source_table,
    cast(v.header.timestamp.seconds * 1000000L + cast(v.header.timestamp.nanos / 1000 AS bigint) AS bigint) AS sample_timestamp_unixus,
    timestamp_micros(cast(v.header.timestamp.seconds * 1000000L + cast(v.header.timestamp.nanos / 1000 AS bigint) AS bigint)) AS sample_timestamp_utc,
    cast(null AS int) AS nav_step_count,
    cast(null AS string) AS nav_last_instruction,
    cast(null AS double) AS nav_last_distance_m,
    cast(null AS string) AS nav_route_state,
    cast(null AS boolean) AS controller_is_dbw,
    cast(null AS string) AS controller_current_drive_position,
    cast(null AS double) AS controller_current_accel_pedal_pct,
    cast(null AS string) AS controller_output_indicators_state,
    cast(null AS string) AS controller_output_interface_indicators_state,
    cast(null AS double) AS controller_accelerator_command,
    cast(null AS double) AS controller_brake_command,
    cast(null AS double) AS controller_acceleration_command_mps2,
    v.drive_position AS vehicle_drive_position,
    v.control_mode AS vehicle_control_mode,
    v.accelerator_pedal_pct AS vehicle_accelerator_pedal_pct,
    v.brake_pedal_pct AS vehicle_brake_pedal_pct,
    v.speed_mps AS vehicle_speed_mps,
    v.indicators_switch AS vehicle_indicators_switch,
    v.indicators_light AS vehicle_indicators_light,
    cast(null AS string) AS plan_predicted_drive_position,
    cast(null AS string) AS plan_first_step_indicator,
    cast(null AS int) AS plan_step_count,
    cast(null AS boolean) AS trajectory_is_dbw,
    cast(null AS int) AS trajectory_waypoint_count,
    cast(null AS int) AS trajectory_plan_step_count
  FROM event_windows ew
  JOIN prod_data_pipeline.raw__gen2.robot_vehicle_driver_vehicle_state v
    ON v.run_id = ew.run_id
   AND v.run_date_iso = ew.run_date_iso
   AND cast(v.header.timestamp.seconds * 1000000L + cast(v.header.timestamp.nanos / 1000 AS bigint) AS bigint)
       BETWEEN ew.window_start_unixus AND ew.window_end_unixus
),
plan_stream AS (
  SELECT
    ew.event_key,
    ew.run_id,
    ew.run_date_iso,
    ew.model_nickname,
    ew.model_session_id,
    ew.author,
    ew.event_type,
    ew.event_timestamp_unixus,
    ew.event_boundary_timestamp_unixus,
    ew.gearchange_timestamp,
    ew.nav_change_timestamp_unixus,
    ew.nav_change_detected,
    ew.relevant_disengagement_timestamp_unixus,
    ew.relevant_disengagement_what,
    ew.relevant_disengagement_why,
    ew.window_start_unixus,
    ew.window_end_unixus,
    ew.console_url,
    'robot_inference_vehicle_driving_plan' AS source_table,
    cast(p.header.timestamp.seconds * 1000000L + cast(p.header.timestamp.nanos / 1000 AS bigint) AS bigint) AS sample_timestamp_unixus,
    timestamp_micros(cast(p.header.timestamp.seconds * 1000000L + cast(p.header.timestamp.nanos / 1000 AS bigint) AS bigint)) AS sample_timestamp_utc,
    cast(null AS int) AS nav_step_count,
    cast(null AS string) AS nav_last_instruction,
    cast(null AS double) AS nav_last_distance_m,
    cast(null AS string) AS nav_route_state,
    cast(null AS boolean) AS controller_is_dbw,
    cast(null AS string) AS controller_current_drive_position,
    cast(null AS double) AS controller_current_accel_pedal_pct,
    cast(null AS string) AS controller_output_indicators_state,
    cast(null AS string) AS controller_output_interface_indicators_state,
    cast(null AS double) AS controller_accelerator_command,
    cast(null AS double) AS controller_brake_command,
    cast(null AS double) AS controller_acceleration_command_mps2,
    cast(null AS string) AS vehicle_drive_position,
    cast(null AS string) AS vehicle_control_mode,
    cast(null AS double) AS vehicle_accelerator_pedal_pct,
    cast(null AS double) AS vehicle_brake_pedal_pct,
    cast(null AS double) AS vehicle_speed_mps,
    cast(null AS string) AS vehicle_indicators_switch,
    cast(null AS string) AS vehicle_indicators_light,
    p.drive_position AS plan_predicted_drive_position,
    element_at(p.driving_plan_steps, 1).indicators AS plan_first_step_indicator,
    size(p.driving_plan_steps) AS plan_step_count,
    cast(null AS boolean) AS trajectory_is_dbw,
    cast(null AS int) AS trajectory_waypoint_count,
    cast(null AS int) AS trajectory_plan_step_count
  FROM event_windows ew
  JOIN prod_data_pipeline.raw__gen2.robot_inference_vehicle_driving_plan p
    ON p.run_id = ew.run_id
   AND p.run_date_iso = ew.run_date_iso
   AND cast(p.header.timestamp.seconds * 1000000L + cast(p.header.timestamp.nanos / 1000 AS bigint) AS bigint)
       BETWEEN ew.window_start_unixus AND ew.window_end_unixus
),
trajectory_stream AS (
  SELECT
    ew.event_key,
    ew.run_id,
    ew.run_date_iso,
    ew.model_nickname,
    ew.model_session_id,
    ew.author,
    ew.event_type,
    ew.event_timestamp_unixus,
    ew.event_boundary_timestamp_unixus,
    ew.gearchange_timestamp,
    ew.nav_change_timestamp_unixus,
    ew.nav_change_detected,
    ew.relevant_disengagement_timestamp_unixus,
    ew.relevant_disengagement_what,
    ew.relevant_disengagement_why,
    ew.window_start_unixus,
    ew.window_end_unixus,
    ew.console_url,
    'trajectory_controller_state' AS source_table,
    t.timestamp_unixus AS sample_timestamp_unixus,
    timestamp_micros(t.timestamp_unixus) AS sample_timestamp_utc,
    cast(null AS int) AS nav_step_count,
    cast(null AS string) AS nav_last_instruction,
    cast(null AS double) AS nav_last_distance_m,
    cast(null AS string) AS nav_route_state,
    cast(null AS boolean) AS controller_is_dbw,
    cast(null AS string) AS controller_current_drive_position,
    cast(null AS double) AS controller_current_accel_pedal_pct,
    cast(null AS string) AS controller_output_indicators_state,
    cast(null AS string) AS controller_output_interface_indicators_state,
    cast(null AS double) AS controller_accelerator_command,
    cast(null AS double) AS controller_brake_command,
    cast(null AS double) AS controller_acceleration_command_mps2,
    cast(null AS string) AS vehicle_drive_position,
    cast(null AS string) AS vehicle_control_mode,
    cast(null AS double) AS vehicle_accelerator_pedal_pct,
    cast(null AS double) AS vehicle_brake_pedal_pct,
    cast(null AS double) AS vehicle_speed_mps,
    cast(null AS string) AS vehicle_indicators_switch,
    cast(null AS string) AS vehicle_indicators_light,
    cast(null AS string) AS plan_predicted_drive_position,
    cast(null AS string) AS plan_first_step_indicator,
    cast(null AS int) AS plan_step_count,
    t.is_drive_by_wire AS trajectory_is_dbw,
    size(t.trajectory.waypoints) AS trajectory_waypoint_count,
    size(t.driving_plan_steps) AS trajectory_plan_step_count
  FROM event_windows ew
  JOIN prod_data_pipeline.inferred__state.trajectory_controller_state t
    ON t.run_id = ew.run_id
   AND t.run_date_iso = ew.run_date_iso
   AND t.timestamp_unixus BETWEEN ew.window_start_unixus AND ew.window_end_unixus
)
SELECT *
FROM nav_stream
UNION ALL
SELECT * FROM controller_stream
UNION ALL
SELECT * FROM vehicle_stream
UNION ALL
SELECT * FROM plan_stream
UNION ALL
SELECT * FROM trajectory_stream
ORDER BY run_id, event_timestamp_unixus, sample_timestamp_unixus, source_table
