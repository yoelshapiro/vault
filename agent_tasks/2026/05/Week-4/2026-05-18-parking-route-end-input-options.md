# Parking Route-End Input Options

## Summary

Implemented opt-in parking route-end input controls on `boris/03-23-park-route-shortening-v2`.

## Changes

- Added train-time `ParkingDataConfig.enable_end_of_route_navigation_cleanup`.
- Renamed SI detection outputs to `PARKING_STATE`, `PARKED_STATE`, and `UNPARKING_STATE`; `PARKING_MODE` is now only the model-facing park-mode input.
- Added `ParkingDataConfig.enable_park_mode_in_parking_state` and `ParkingDataConfig.enable_park_mode_in_parked_state` so the emitted park-mode signal is derived from selected post-augmentation internal states.
- Added SI-local `ParkingDataConfig.enable_gear_label_cleanup` with thresholds for removing short reverse/neutral gear label glitches before always expanding neutral gear over adjacent standstill frames.
- Added train-time navigation cleanup after map/nav insertion, using the model-facing `PARKING_MODE` signal.
- Added a datamodule-level `allow_short_path` option and enabled it in the parking BC datamodule config.
- Exposed `PARKED_STATE` from the SI parking datamodule; left the older zoo parking datapipe untouched.
- Decoupled train-time route-map blackout from route shortening so blackout can run independently.
- Moved SI route-stop positioning, route-map blackout, and navigation cleanup helpers into `wayve/ai/si/datamodules/parking.py` so parking-specific train-time transforms live with the SI parking state logic.
- Changed train-time route-map blackout and navigation cleanup to use the model-facing `PARKING_MODE` signal directly.
- Completed route shortening for unparking by clipping route polylines from the current/stop route anchor.
- Added programmatic deployment options for parking models:
  - `enable_end_of_route_park_mode`
  - `enable_end_of_route_map_blackout`
  - `enable_end_of_route_navigation_cleanup`
- Removed the navigation-aware parking deployment wrapper and kept parking deployment on `ParkingDeploymentWrapperImpl`.
- Kept the route-end deployment options out of `wayve/ai/si/deploy.py`; there is no deploy CLI diff.
- Fixed an existing typo in `wayve/ai/si/models/deployment.py` that left `ta        return policy_outputs`.

## Verification

- Ran `git diff --check`.
- Did not run tests, per request.
