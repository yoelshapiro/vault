# Parking Route-End Input Options

## Summary

Implemented opt-in parking route-end input controls on `boris/03-23-park-route-shortening-v2`.

## Changes

- Added train-time `ParkingDataConfig.enable_end_of_route_navigation_cleanup`.
- Added train-time navigation cleanup after map/nav insertion, only when `PARKING_MODE` or `PARKED_MODE` is true and `UNPARKING_MODE` is false.
- Exposed `PARKED_MODE` from both the SI parking datamodule and the simpler zoo parking datapipe; kept `PARKING_MODE` backward-compatible.
- Decoupled train-time route-map blackout from route shortening so blackout can run independently.
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
