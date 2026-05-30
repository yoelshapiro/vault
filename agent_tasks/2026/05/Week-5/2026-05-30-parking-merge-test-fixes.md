# Parking merge test fixes

Branch: `boris/parking-past30-no-standstill-gear-aug/merge_main`

## Summary
- Resolved parking-related test failures after merging main into the parking branch.
- Fixed SI resolver registration to be idempotent for pytest re-imports.
- Restored main radar feature support in ST model construction.
- Aligned odometry imports to `wayve.ai.lib.data.odometry` and removed the stale zoo odometry dependency.
- Made parking goal dropout populate both `PARKING_POSE_GT` and `ORIGINAL_PARKING_GOAL_POSE`.
- Restored deployment wrapper interleave constants, gear-direction compatibility helper, and parking `DrivingOutputWithGearOutput` return.
- Removed stale `test_parking_plotter` BUILD target that referenced a missing file and is absent on main.

## Tests
- `bazel test //wayve/ai/si/datamodules:py_test --test_arg=--no-cov --test_arg=-k --test_arg='parking or test_otf'` passed.
- `bazel test //wayve/ai/zoo/data:test_zoo_data_py_test --test_arg=--no-cov --test_arg=-k --test_arg=parking` passed.
- `bazel test //wayve/ai/zoo/deployment:test_deployment_py_test --test_arg=--no-cov --test_arg=-k --test_arg='parking or interleave'` passed.
- `bazel test //wayve/ai/si:test_deploy //wayve/ai/si:test_deployment_wrapper //wayve/ai/si:test_parking_metrics --test_arg=--no-cov` passed after rerunning `test_deployment_wrapper` fix; deploy and metrics were already passing.
- `bazel test //wayve/ai/lib:test_data_pipes_lib_py_test --test_arg=--no-cov --test_arg=-k --test_arg='load_paths or generate_route_map'` blocked during analysis by ACR 401 fetching `azure-storage/azurite`.
