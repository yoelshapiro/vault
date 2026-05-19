# Parking Route-End Input Options

## Summary

Implemented opt-in parking route-end input controls on `boris/03-23-park-route-shortening-v2`.

## Changes

- Added train-time `ParkingDataConfig.enable_end_of_route_navigation_cleanup`.
- Renamed SI detection outputs to `PARKING_STATE`, `PARKED_STATE`, and `UNPARKING_STATE`; `PARKING_MODE` is now only the model-facing park-mode input.
- Added `ParkingDataConfig.enable_park_mode_in_parking_state` and `ParkingDataConfig.enable_park_mode_in_parked_state` so the emitted park-mode signal is derived from selected post-augmentation internal states.
- Added train-time navigation cleanup after map/nav insertion, only when `PARKING_MODE` or `PARKED_MODE` is true and `UNPARKING_MODE` is false.
- Exposed `PARKED_STATE` from the SI parking datamodule; left the older zoo parking datapipe untouched.
- Decoupled train-time route-map blackout from route shortening so blackout can run independently.
- Moved SI route-stop positioning into the SI OTF datapipe so unparking route shortening no longer requires editing `wayve/ai/zoo/data/parking.py`.
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
