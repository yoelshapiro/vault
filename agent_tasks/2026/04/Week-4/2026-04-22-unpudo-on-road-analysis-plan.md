# UNPUDO On-Road Analysis Plan

## Scope
Investigate on-road UNPUDO performance from Databricks-backed event data and define the minimal table set needed to analyze:

1. failed UNPUDO events with disengagements
2. successful UNPUDO events with timing from route change to maneuver completion
3. driver pedal usage during the maneuver

The user-provided anchor table is `parking.pudo_unpudo_unpark_events`.

## Confirmed tables
### Required
- `parking.pudo_unpudo_unpark_events`
  - queried directly and confirmed available
  - contains event-level anchors, durations, gear-change timestamp, model metadata, and precomputed disengagement window columns
- `prod_data_pipeline.raw__gen2.robot_navigation_instructions`
  - confirmed in Databricks metadata
  - key fields confirmed: `run_id`, `run_date_iso`, `header`, `steps`, `route_state`, `route_timestamp`
  - the last step commonly carries `You have arrived at your destination.` plus `distance_from_current_location_m`
- `prod_data_pipeline.raw__gen2.robot_control_controller_state`
  - confirmed in Databricks metadata
  - confirmed usable nested fields:
    - `internal_state.input_vehicle_state.current_drive_position`
    - `internal_state.input_vehicle_state.current_accelerator_pedal_input_pct`
- `prod_data_pipeline.inferred__state.trajectory_controller_state`
  - confirmed in Databricks metadata
  - useful standardized source for trajectory shape / length features
  - confirmed relevant columns: `run_id`, `timestamp_unixus`, `trajectory`, `driving_plan_steps`

### Optional enrichments
- `prod_data_pipeline.raw__model_catalogue_sync.vehicle_run_models`
- `prod_data_pipeline.raw__model_catalogue_sync.model_training_sessions`
  - only needed if the materialized parking table has missing / stale model metadata
- `analytics.disengagements`
  - optional if deeper disengagement inspection is needed beyond the copied fields already present in the parking event table

### Ruled out for pedal analysis
- `prod_data_pipeline.inferred__state.run_trace`
  - metadata confirms columns `pedal_pos_pct` and `pedal_pos_ub`
  - tested on a 100-run UNPUDO sample from `parking.pudo_unpudo_unpark_events`
  - result: `6,380,007` rows scanned, `0` non-null `pedal_pos_pct`, `0` runs with any non-null pedal
  - conclusion: do not use `run_trace` as the pedal source for this task

## Notes from validation queries
- `parking.pudo_unpudo_unpark_events` contains the expected UNPUDO timing fields, including:
  - `timestamp_unixus`
  - `event_startOrEnd_timestampunixus`
  - `gearchange_timestamp`
  - `gear_to_accel_sec`
  - `accel_to_end_sec`
  - disengagement summary columns
- `robot_navigation_instructions` samples showed:
  - `steps` is populated
  - the last instruction is often `You have arrived at your destination.`
  - the last-step distance is directly available as `steps[-1].maneuver.distance_from_current_location_m`
- `robot_control_controller_state` samples confirmed the pedal and gear fields exist and can be non-null

## Proposed analysis plan
### Phase 1: Build the UNPUDO candidate set
- Start from `parking.pudo_unpudo_unpark_events`
- Filter to `event_type = 'unpudo'`
- Keep the existing failure logic from the user query:
  - main-window disengagement
  - `gear_to_start`
  - `before_gearchange_10s`
- Preserve `model_nickname`, `author`, `runID`, `run_date_iso`, and the anchor timestamps

### Phase 2: Failed UNPUDO RCA
- For each failed event:
  - classify which disengagement window triggered failure
  - record disengagement `what` / `why`
  - join controller-state samples around `gearchange_timestamp` and `timestamp_unixus`
  - extract gear state progression around the failure (`D` / `R` / null / changes)
  - join `trajectory_controller_state` in the same window and compute trajectory-size proxies:
    - number of `driving_plan_steps`
    - number of `trajectory.points`
    - optionally approximate path length from those points if needed
- Output: one RCA row per failed UNPUDO event with concise failure evidence

### Phase 3: Successful UNPUDO timing
- Detect route reassignment from `raw__gen2.robot_navigation_instructions`
- Operational definition for the first pass:
  - before reassignment, the terminal step is still `You have arrived at your destination.` and the distance is near zero / small
  - at reassignment, either:
    - the terminal-step distance jumps materially upward, and/or
    - the number/content of steps changes from the parked-state navigation trace
- Define `route_change_timestamp_unixus` from the first such transition after the PUDO / parked state and before or near UNPUDO
- Measure:
  - `unpudo_start_after_route_change_sec = (timestamp_unixus - route_change_timestamp_unixus) / 1e6`
  - `unpudo_end_after_route_change_sec = (event_startOrEnd_timestampunixus - route_change_timestamp_unixus) / 1e6`

### Phase 4: Driver pedal usage
- Use `raw__gen2.robot_control_controller_state`
- For each successful UNPUDO event, inspect pedal input between:
  - `route_change_timestamp_unixus` and `event_startOrEnd_timestampunixus`
  - and separately `gearchange_timestamp` to `event_startOrEnd_timestampunixus`
- Derive:
  - whether the driver touched the pedal at all
  - first pedal timestamp
  - max pedal percentage
  - pedal-before-motion / pedal-after-motion ordering if useful

## Practical query strategy
- Use `run_date_iso` and week filters early for pruning
- Work from a sampled week / model subset first to validate the route-change heuristic
- Materialize intermediate CTEs or temp result sets in SQL notebooks only after the heuristic is stable
- Expect the navigation-change heuristic to need one iteration on real runs before scaling to all events

## Current conclusion
The minimal working source set for this task is:
- `parking.pudo_unpudo_unpark_events`
- `prod_data_pipeline.raw__gen2.robot_navigation_instructions`
- `prod_data_pipeline.raw__gen2.robot_control_controller_state`
- `prod_data_pipeline.inferred__state.trajectory_controller_state`

`prod_data_pipeline.inferred__state.run_trace` should not be used for pedal detection on these UNPUDO runs.
