# 2026-07-12 PUDO Baseline PR Comments

- Branch: `boris/26-06-22-pudo-baseline`
- PR: `#120214`
- Change type: PR review fixes, tests
- Areas:
  - `wayve/ai/lib/data/pipes/routes.py`
  - `wayve/ai/lib/test/data/pipes/test_generate_route_map.py`
  - `wayve/ai/si/configs/parking/parking_config.py`
  - `wayve/ai/si/datamodules/parking.py`
  - `wayve/ai/si/datamodules/test/test_parking_unit.py`
  - `wayve/ai/zoo/deployment/deployment_wrapper.py`
  - `wayve/ai/si/test/interfaces/test_deployment_wrapper.py`

## Summary

Addressed unresolved review feedback on the Parking/PUDO baseline PR:

- Kept end-of-route route masks per batch for hazard-light forcing and removed raw `DrivePositionV2` integer comparisons.
- Added regression coverage for per-sample hazard forcing and documented the current single-sample limitation of the persistent gear latch.
- Added route-shortening helper tests for interpolation, boundary, and speed-limit behavior.
- Strengthened the planned-route route-shortening test to assert the renderer receives a shortened polyline.
- Made `ParkingDataConfig.lookahead_sec=30.0` explicit in the parking BC config.
- Restored the prior `PATH_VALID` guard for parking goal-distance clamping and added a regression for all-invalid paths.

## Verification

- `bazel test //wayve/ai/lib:test_data_pipes_lib_py_test --test_arg=wayve/ai/lib/test/data/pipes/test_generate_route_map.py --test_arg=-k --test_arg='route_map_shorten_polyline or planned_route_fetch_route_map_with_parking_route_shortening' --test_arg=--no-cov`
- `bazel test //wayve/ai/si:test_deployment_wrapper --test_arg=-k --test_arg='parking_route_end_forces_hazard_indicator_channel or parking_postprocess_gear_latch' --test_arg=--no-cov`
- `bazel test //wayve/ai/si/datamodules:py_test --test_arg=wayve/ai/si/datamodules/test/test_parking_unit.py --test_arg=-k --test_arg='invalid_path or goal_distance_clamping' --test_arg=--no-cov`
- `bazel test //wayve/ai/lib:test_data_pipes_lib_py_lint_ruff //wayve/ai/lib:test_data_pipes_lib_py_lint_flake8 //wayve/ai/si/datamodules:py_lint_ruff //wayve/ai/si/datamodules:py_lint_flake8`
- `bazel test //wayve/ai/zoo/deployment:test_deployment_py_lint_ruff //wayve/ai/zoo/deployment:test_deployment_py_lint_flake8`
- `bazel test //wayve/ai/zoo/deployment:test_deployment_ty //wayve/ai/lib:test_data_pipes_lib_ty //wayve/ai/si/datamodules:ty`

Notes:

- Initial `//wayve/ai/lib:test_data_pipes_lib` run failed before useful signal because pytest args were passed to lint/typecheck wrappers and full collection hit an unrelated lidar sample decode error.
- ACR auth initially failed on `azure-storage/azurite` with `401 Unauthorized`; refreshed with `az acr login --name wayve` and reran.
