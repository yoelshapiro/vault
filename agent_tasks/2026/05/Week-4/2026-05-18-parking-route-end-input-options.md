# Parking Route-End Input Options

## Summary

Implemented opt-in parking route-end input controls on `boris/03-23-park-route-shortening-v2`.

## Changes

- Added train-time `ParkingDataConfig.enable_end_of_route_navigation_cleanup`.
- Added train-time navigation cleanup after map/nav insertion, only when `PARKING_MODE` is true and `UNPARKING_MODE` is false.
- Decoupled train-time route-map blackout from route shortening so blackout can run independently.
- Completed route shortening for unparking by clipping route polylines from the current/stop route anchor.
- Added deployment flags for parking models:
  - `enable_end_of_route_parking`
  - `enable_end_of_route_map_blackout`
  - `enable_end_of_route_navigation_cleanup`
- Added a navigation-aware parking deployment wrapper so grouped DMI navigation tensors can be cleaned before unpacking.
- Exposed the deployment flags in `wayve/ai/si/deploy.py`.
- Fixed an existing typo in `wayve/ai/si/models/deployment.py` that left `ta        return policy_outputs`.

## Verification

- Ran `git diff --check`.
- Did not run tests, per request.
