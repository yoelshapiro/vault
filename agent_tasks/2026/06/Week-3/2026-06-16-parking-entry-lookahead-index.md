# 2026-06-16 Parking Entry Table Index

## Summary

Fixed parking route-shortening event index selection in `wayve/ai/si/datamodules/parking.py` and removed the obsolete `_parking_entry_lookahead_index` path.

## Changes

- Confirmed `_PARKING_ENTRY_LOOKAHEAD_INDEX_KEY` previously stored a lookahead-relative event index, which could not represent past unpark/UnPUDO movement-start positions correctly.
- Added explicit helper logic to choose the first moving frame after the cleaned unpark/UnPUDO neutral segment.
- Replaced `_parking_entry_lookahead_index` with `_parking_entry_table_index`, storing the absolute table index for parking/PUDO stop position or unpark/UnPUDO movement-start position.
- Updated `PARKING_MODE` model input to stay true for detected parking or parked samples, while keeping it false when the sample is converted to unparking.
- Updated `wayve/ai/zoo/data/parking.py` so route-position conversion consumes only the absolute table index for both `PARKING_MODE` and `UNPARKING_MODE`.
- Added focused regressions for parking segment-start index, unparking move-start index, parked `PARKING_MODE` input, and unpark route-position conversion.
- Removed the `parking_indices` mapping argument from `insert_parking_stop_route_position`.
- Added parking/PUDO-only navigation shortening in `wayve/ai/lib/data/pipes/routes.py`: when route shortening is enabled and `PARKING_MODE` is true, turn-by-turn navigation lookahead is clamped to the distance from current route location to the stored parking stop.
- Left unpark/UnPUDO navigation unchanged by only passing the stop override when `PARKING_MODE` is true.

## Validation

- `bazel test //wayve/ai/si/datamodules:py_test --test_arg='-k=add_parking_mode_stores'`
  - New SI regressions passed; target failed coverage because pytest filtering deselected most tests.
- `bazel test //wayve/ai/si/datamodules:py_test --test_arg='-k=add_parking_mode_sets_parking_input_for_parked_mode or add_parking_mode_stores'`
  - The 3 selected tests passed; target failed only because pytest filtering deselected most tests and coverage fell below the package threshold.
- `bazel test //wayve/ai/zoo/data:test_zoo_data_py_test --test_arg='-k=add_parking_stop_route_position_uses_unparking_entry_index'`
  - Passed.
- `bazel test //wayve/ai/si/datamodules:py_lint_ruff`
  - Passed.
- `bazel test //wayve/ai/zoo/data:test_zoo_data_py_lint_ruff`
  - Passed.
- `bazel test //wayve/ai/zoo/data:test_zoo_data_py_test`
  - Passed.
- `bazel test //wayve/ai/zoo/data:test_zoo_data_py_test --test_arg='-k=parking_stop_route_position'`
  - Passed.
- `bazel test //wayve/ai/si/datamodules:py_test --test_arg='-k=add_parking_mode_stores_parking_segment_start_table_index or add_parking_mode_stores_unparking_first_moving_table_index or add_parking_mode_stores_unparking_past_move_start_table_index'`
  - The 3 selected tests passed; target failed only because pytest filtering deselected most tests and coverage fell below the package threshold.
- `bazel test //wayve/ai/si/datamodules:py_lint_ruff //wayve/ai/zoo/data:test_zoo_data_py_lint_ruff`
  - Passed.
- `make acr-login`
  - Refreshed ACR auth after Bazel hit `401 Unauthorized` pulling `azure-storage/azurite`.
- `bazel test //wayve/ai/lib:test_data_pipes_lib_py_test --test_arg=wayve/ai/lib/test/data/pipes/test_generate_route_map.py --test_arg='-k=route_map_fetcher_shortens_navigation_only_for_parking or fetch_navigation_instructions_clamps_lookahead_to_parking_stop'`
  - The 2 selected tests passed; target failed only because pytest filtering reduced package coverage below the 43% threshold.
- `bazel test //wayve/ai/lib:test_data_pipes_lib_py_lint_ruff`
  - Passed.
- `bazel test //wayve/ai/si/datamodules:py_test`
  - New regressions passed, but the full target failed on pre-existing broader package issues: `/home/nobody` read-only frame metadata loads, existing lazy-future assertions, missing `DataKeys.PARKING_*`, and Sarsa datapipes producing no samples.
