# 2026-06-14 Parking Deployment Gear Indicator Port

- Branch: `codex/guy-recipe-gear-root-amaranth-root`
- Source branch: `boris/training/main_cherrypick_generic_data`
- Change type: Code change, tests
- Areas: `wayve/ai/zoo/deployment/deployment_wrapper.py`, `wayve/ai/si/test/interfaces/test_deployment_wrapper.py`

## Summary

- Ported the parking-specific gear and indicator deployment handling from `boris/training/main_cherrypick_generic_data`.
- Added `DrivingOutputWithGearOutput` so parking deployment explicitly returns `policy_gear_position`.
- Added route-end hazard indicator forcing for parking deployment outputs, with `enable_end_of_route_hazard_lights`.
- Added route-end park gear latching through `PersistentStateBuffer`, with `enable_end_of_route_gear_latch`.
- Kept the existing gear-direction to DrivePositionV2 conversion and waypoint clamping path, now applying the latch before waypoint enforcement.

## Validation

- `git diff --check -- wayve/ai/zoo/deployment/deployment_wrapper.py wayve/ai/si/test/interfaces/test_deployment_wrapper.py` passed.
- `bazel test //wayve/ai/si:test_deployment_wrapper --test_arg=-k --test_arg='parking'` passed.
