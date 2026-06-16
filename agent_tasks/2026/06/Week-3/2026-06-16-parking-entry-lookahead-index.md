# 2026-06-16 Parking Entry Lookahead Index

## Summary

Fixed parking route-shortening event index selection in `wayve/ai/si/datamodules/parking.py`.

## Changes

- Confirmed `_PARKING_ENTRY_LOOKAHEAD_INDEX_KEY` previously stored `segment_start` for parking/PUDO and hardcoded `0` for unpark/UnPUDO.
- Added explicit helpers to choose the cleaned parking/PUDO neutral segment start and the first moving frame after the cleaned unpark/UnPUDO neutral segment.
- Mapped the selected table index into the current/future lookahead index array, falling back to `0` when the event is already before the current origin.
- Updated `PARKING_MODE` model input to stay true for detected parking or parked samples, while keeping it false when the sample is converted to unparking.
- Updated `wayve/ai/zoo/data/parking.py` so the stored route event index is consumed for both `PARKING_MODE` and `UNPARKING_MODE`.
- Added focused regressions for parking segment-start index, unparking move-start index, parked `PARKING_MODE` input, and unpark route-position conversion.
- Refined unparking route shortening to also store the absolute table index for the first moving frame after P/N.
- Updated route-position conversion to prefer the absolute table index over the current/future lookahead index, so unparking samples after movement has already started still shorten the route from the original movement-start position rather than the current frame.

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
- `bazel test //wayve/ai/si/datamodules:py_test --test_arg='-k=add_parking_mode_stores_unparking_first_moving_lookahead_index or add_parking_mode_stores_unparking_past_move_start_table_index or add_parking_mode_stores_parking_segment_start_lookahead_index'`
  - The 3 selected tests passed; target failed only because pytest filtering deselected most tests and coverage fell below the package threshold.
- `bazel test //wayve/ai/si/datamodules:py_lint_ruff //wayve/ai/zoo/data:test_zoo_data_py_lint_ruff`
  - Passed.
- `bazel test //wayve/ai/si/datamodules:py_test`
  - New regressions passed, but the full target failed on pre-existing broader package issues: `/home/nobody` read-only frame metadata loads, existing lazy-future assertions, missing `DataKeys.PARKING_*`, and Sarsa datapipes producing no samples.
