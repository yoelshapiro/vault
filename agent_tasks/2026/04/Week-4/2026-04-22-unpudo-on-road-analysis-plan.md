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

## Validation examples
### Successful UNPUDO example
- Run: `fme20009/2026-04-21--20-53-31--gen2-av-c485ff0d-599e-495f-bee7-17c4a854ab52`
- Model: `eel-teal-outspoken`
- Event anchor timestamps:
  - route change: `2026-04-21T21:42:34.818Z`
  - gear change: `2026-04-21T21:43:08.833Z`
  - event start anchor: `2026-04-21T21:43:22.833Z`
  - event end anchor: `2026-04-21T21:43:29.133Z`
- Navigation evidence:
  - at `-59.965s` from gear change: `2` steps, destination distance `0.0m`
  - at `-34.015s`: `6` steps, destination distance `252.98m`
  - interpretation: clear route reassignment about `34s` before gear change
- Controller-state evidence:
  - remained in `PARK` until the gear change sequence
  - gear sequence near gear change: `PARK -> REVERSE -> NEUTRAL -> DRIVE` within ~`0.15s`
  - pedal input:
    - first pedal after route change: `2026-04-21T21:43:04.831Z` (`~4s` before gear change)
    - first pedal after gear change: `2026-04-21T21:43:17.842Z` (`~9s` after gear change)
    - max pedal after route change: `23.27%`
    - max pedal after gear change through event end: `5.10%`
- Trajectory proxy at event anchor:
  - `11` driving-plan steps
  - `36-38` trajectory waypoints
  - last driving-plan step around `x=1.4-1.74m`
- Interpretation:
  - this looks consistent with a successful UNPUDO
  - the route update is visible well before the maneuver
  - there is pedal usage after the reassignment and after the gear change

### Failed UNPUDO example
- Run: `fme20031/2026-04-21--06-19-02--gen2-av-be2ad99b-5967-471c-a413-80a21809f1a2`
- Model: `maroon-bulldog-sophisticated`
- Event anchor timestamps:
  - route change: `2026-04-21T07:15:33.418Z`
  - gear change: `2026-04-21T07:15:35.983Z`
  - event start anchor: `2026-04-21T07:15:55.083Z`
  - event end anchor: `2026-04-21T07:15:58.583Z`
- Failure flags from the event table:
  - `has_disengagement_before_gearchange_10s = 1`
  - `disengagement_what_any = failed_to_unpudo`
  - no main-window disengagement and no gear-to-start disengagement
- Navigation evidence:
  - at `-14.965s` from gear change: `2` steps, destination distance `40.31m`
  - at `-2.564s`: `2` steps, destination distance `388.37m`
  - interpretation: assignment changed only about `2.6s` before gear change, with a very abrupt destination-distance jump
- Controller-state evidence:
  - gear sequence before gear change is unstable:
    - `DRIVE` at `-29.992s`
    - pedal at `-20.471s` while still in `DRIVE`
    - then `REVERSE -> NEUTRAL -> DRIVE -> NEUTRAL -> PARK` around `-14.7s` to `-13.8s`
    - finally back to `DRIVE` at `-0.022s`
  - pedal input:
    - no pedal after route change
    - no pedal after gear change
    - max pedal after route change through event end: `0.0%`
    - max pedal after gear change through event end: `0.0%`
- Trajectory proxy at event anchor:
  - `11` driving-plan steps
  - `36-37` trajectory waypoints
  - last driving-plan step around `x=2.11m`
- Interpretation:
  - this does not look like a short-trajectory failure from the available trajectory proxy
  - the stronger signal is timing and control behavior:
    - reassignment happens extremely late
    - gear state churns before the gear-change anchor
    - there is no accelerator input after the reassignment or after gear change
  - for this example, the likely issue is not “trajectory too short” but “assignment came too late / maneuver never meaningfully started”

## Readable summary
I checked one recent successful UNPUDO and one recent failed UNPUDO against the raw navigation and controller-state tables.

**Successful**
- Run: `fme20009/2026-04-21--20-53-31--gen2-av-c485ff0d-599e-495f-bee7-17c4a854ab52`
- Model: `eel-teal-outspoken`
- Foxglove: [segment](https://app.foxglove.dev/wayve-on-prem/p/prj_0dX18KZdVHg1fmmI/view?ds=foxglove-stream&ds.deviceName=fme20009&ds.end=2026-04-21T21%3A43%3A39.133Z&ds.start=2026-04-21T21%3A42%3A24.818Z&layoutId=lay_0e7VD4WIKDQGU73Y&time=2026-04-21T21%3A42%3A34.818Z)
- Console: [run](https://console.sso.wayve.ai/run/fme20009/2026-04-21--20-53-31--gen2-av-c485ff0d-599e-495f-bee7-17c4a854ab52)
- Route-change signal is clear. At `2026-04-21T21:42:08.868Z` to `2026-04-21T21:42:34.818Z` relative to the maneuver, navigation goes from `2` steps and `0.0m` to destination to `6` steps and `252.98m` to destination. I’m using `2026-04-21T21:42:34.818Z` as the effective reassignment point.
- Gear change is at `2026-04-21T21:43:08.833Z`. The gear sequence around it is `PARK -> REVERSE -> NEUTRAL -> DRIVE`.
- Event anchor is at `2026-04-21T21:43:22.833Z`, about `14.0s` after gear change. Event end is `2026-04-21T21:43:29.133Z`.
- Pedal usage exists. First pedal after route change is about `4.0s` before gear change, and first pedal after gear change is about `9.0s` after gear change. Max pedal after route change is `23.27%`, and after gear change through event end it reaches `5.10%`.
- Trajectory proxy does not look obviously short: `11` driving-plan steps and `36-38` trajectory waypoints near the event anchor.

**Failed**
- Run: `fme20031/2026-04-21--06-19-02--gen2-av-be2ad99b-5967-471c-a413-80a21809f1a2`
- Model: `maroon-bulldog-sophisticated`
- Foxglove: [segment](https://app.foxglove.dev/wayve-on-prem/p/prj_0dX18KZdVHg1fmmI/view?ds=foxglove-stream&ds.deviceName=fme20031&ds.end=2026-04-21T07%3A16%3A08.583Z&ds.start=2026-04-21T07%3A15%3A23.418Z&layoutId=lay_0e7VD4WIKDQGU73Y&time=2026-04-21T07%3A15%3A33.418Z)
- Console: [run](https://console.sso.wayve.ai/run/fme20031/2026-04-21--06-19-02--gen2-av-be2ad99b-5967-471c-a413-80a21809f1a2)
- Event-table failure signal is `has_disengagement_before_gearchange_10s = 1` with `disengagement_what = failed_to_unpudo`.
- The navigation reassignment is extremely late. At `2026-04-21T07:15:21.018Z` it is still `40.31m` from destination with `2` steps; by `2026-04-21T07:15:33.418Z`, only `2.564s` before gear change, it jumps to `388.37m` with the same terminal instruction.
- Gear change is at `2026-04-21T07:15:35.983Z`. Before that, the gear state churns: `DRIVE` with pedal at `-20.5s`, then `REVERSE -> NEUTRAL -> DRIVE -> NEUTRAL -> PARK`, then back to `DRIVE` at `-0.022s`.
- Event anchor is at `2026-04-21T07:15:55.083Z`, about `19.1s` after gear change. Event end is `2026-04-21T07:15:58.583Z`.
- There is no accelerator input after the route change and no accelerator input after gear change. Max pedal is `0.0%` in both windows.
- Trajectory proxy is not obviously shorter than the successful case: `11` driving-plan steps and `36-37` trajectory waypoints near the event anchor.

**Takeaway**
- The success case is consistent with the intended story: route change first, then gear change, then pedal/motion.
- The failed case does not currently look like “trajectory too short” from this proxy. The stronger signal is that the route change comes only `2.6s` before gear change, the gear state is unstable before the maneuver, and there is no pedal input after reassignment or after gear change.
- So for these two examples, the heuristic looks directionally correct, but “late reassignment + no real maneuver initiation” is a stronger failure mode than “short trajectory.”

## AV-only rerun

### Success rerun
- Run: `fme20009/2026-04-21--20-53-31--gen2-av-c485ff0d-599e-495f-bee7-17c4a854ab52`
- Model: `eel-teal-outspoken`
- Foxglove: [segment](https://app.foxglove.dev/wayve-on-prem/p/prj_0dX18KZdVHg1fmmI/view?ds=foxglove-stream&ds.deviceName=fme20009&ds.end=2026-04-21T21%3A43%3A39.133Z&ds.start=2026-04-21T21%3A42%3A24.818Z&layoutId=lay_0e7VD4WIKDQGU73Y&time=2026-04-21T21%3A42%3A34.818Z)
- Console: [run](https://console.sso.wayve.ai/run/fme20009/2026-04-21--20-53-31--gen2-av-c485ff0d-599e-495f-bee7-17c4a854ab52)
- Route change is still `2026-04-21T21:42:34.818Z`.
- Actual gear change to `DRIVE` happens before AV at `2026-04-21T21:43:08.790Z`.
- AV engages at `2026-04-21T21:43:21.640Z`.
- UNPUDO event start is `2026-04-21T21:43:22.833Z`.
- First actual motion in AV is `2026-04-21T21:43:22.870Z`, about `1.24s` after AV engagement.
- Model predicted gear at AV start is `DRIVE`.
- Actual gear at AV start is already `DRIVE`.
- Indicator evidence:
  - actual indicator light is unavailable in this segment
  - actual indicator switch is `RIGHT_ON`
  - controller output indicator is `RIGHT_ON`
  - driving-plan indicators near AV start are `RIGHT_ON`
- Driver help evidence in AV:
  - accelerator pedal in AV: `0.0%` max
  - brake pedal in AV: up to `8.0%` while stationary at the handover
  - first motion occurs in AV without accelerator pedal input

### Failed rerun
- Run: `fme20031/2026-04-21--06-19-02--gen2-av-be2ad99b-5967-471c-a413-80a21809f1a2`
- Model: `maroon-bulldog-sophisticated`
- Foxglove: [segment](https://app.foxglove.dev/wayve-on-prem/p/prj_0dX18KZdVHg1fmmI/view?ds=foxglove-stream&ds.deviceName=fme20031&ds.end=2026-04-21T07%3A16%3A08.583Z&ds.start=2026-04-21T07%3A15%3A23.418Z&layoutId=lay_0e7VD4WIKDQGU73Y&time=2026-04-21T07%3A15%3A33.418Z)
- Console: [run](https://console.sso.wayve.ai/run/fme20031/2026-04-21--06-19-02--gen2-av-be2ad99b-5967-471c-a413-80a21809f1a2)
- Route change is still `2026-04-21T07:15:33.418Z`.
- AV engages at `2026-04-21T07:15:35.481Z`.
- Actual gear is still `PARK` at AV start and changes to `DRIVE` at `2026-04-21T07:15:35.953Z`.
- AV disengages at `2026-04-21T07:15:35.981Z`.
- That first AV stint lasts about `0.50s`, so this should be treated as a likely accidental or guarded intervention rather than a strong model failure by itself.
- Model predicted gear at AV start is already `DRIVE`.
- Actual gear lags the model prediction and only reaches `DRIVE` late in the short AV window.
- Indicator evidence during the short AV stint:
  - actual indicator light is unavailable
  - actual indicator switch is `OFF`
  - controller output indicator is `OFF`
  - driving-plan indicators near AV start are `OFF`
- Driver help / safety evidence during the short AV stint:
  - accelerator pedal in AV: `0.0%` max
  - brake pedal in AV: `8.0%` max
  - max speed in the AV stint: `0.0 m/s`
  - there is no actual motion before disengagement
- There is a later successful UNPUDO in the same run, and by the later event start the model still predicts `DRIVE` but now the plan indicators are `RIGHT_ON`.

### Updated takeaway
- We should score only the AV-owned portion.
- In the success example, route reassignment and actual gear change both happen before AV, so the correct expectation is that once AV engages it should start UNPUDO almost immediately. That is what happens.
- In the failed example, the first AV-owned attempt is too short to call a meaningful failure. It is better described as a short interrupted handover:
  - route change arrives only `2.06s` before AV engagement
  - AV lasts only `0.50s`
  - the vehicle does not move
  - brake remains applied
- For gear, the model-plan signal is useful:
  - success: model predicted `DRIVE`, actual gear was already `DRIVE` by AV start
  - failed short attempt: model predicted `DRIVE`, actual gear was still `PARK` at AV start
- For gear ownership, these samples do not provide a clean attribution between model-commanded gear and manual driver gear change:
  - the model plan clearly predicts `DRIVE`
  - the explicit controller gear-command field sampled here remains `UNKNOWN`
  - so we can compare model prediction vs actual gear, but not confidently assign who executed the shift
