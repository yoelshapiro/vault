# 2026-06-16 Parking Gear Expansion And Entry Index

## Summary

Updated parking gear/mode preprocessing in `wayve/ai/si/datamodules/parking.py` after confirming that the policy clamp-at-neutral step was not the right mechanism.

## Changes

- Removed `clamp_policy_at_first_neutral` from the SI parking datapipe and deleted its focused unit tests.
- Changed `_build_expanded_gear` to expand P/N labels only backward over standstill frames, not forward after the P/N segment.
- Added `standstill_speed_threshold_kmh` to `ParkingDataConfig`, defaulting to the existing `0.5` km/h constant.
- Threaded the standstill threshold through gear reconstruction, gear cleanup, parking/unparking detection, route-entry selection, standstill stripping, and standstill gear augmentation.
- Set `standstill_speed_threshold_kmh=0.1` in `parking_bc_datamodule_cfg`.
- Kept parking/PUDO route shortening anchored on the detected neutral segment start; kept unpark/UnPUDO route shortening anchored on the first moving frame after the parked segment.
- Preserved `PARKING_MODE=True` for detected parking or parked samples before parked-mode augmentation, while keeping it false for unparking.
- Updated `wayve/ai/zoo/data/parking.py` so the stored route event index is consumed for both `PARKING_MODE` and `UNPARKING_MODE`.
- Added focused regressions for backward-only gear expansion, threshold-driven expansion, parking entry index, unpark move-start index, and parked input mode.

## Validation

- `bazel test //wayve/ai/si/datamodules:py_lint_ruff`
  - Passed.
- `bazel test //wayve/ai/si/datamodules:py_test --test_arg='-k=build_expanded_gear or add_parking_mode_stores or add_parking_mode_sets_parking_input'`
  - The 6 selected tests passed; target failed only because the package coverage gate drops to 20% when pytest filtering deselects most tests.
- `bazel test //wayve/ai/zoo/data:test_zoo_data_py_test --test_arg='-k=add_parking_stop_route_position_uses_unparking_entry_index'`
  - Passed.
- `bazel test //wayve/ai/zoo/data:test_zoo_data_py_lint_ruff`
  - Passed.
- `bazel test //wayve/ai/zoo/data:test_zoo_data_py_test`
  - Passed.
- `bazel test //wayve/ai/si/datamodules:py_test`
  - New regressions passed, but the full target failed on pre-existing broader package issues: `/home/nobody` read-only frame metadata loads, existing lazy-future assertions, missing `DataKeys.PARKING_*`, and Sarsa datapipes producing no samples.
