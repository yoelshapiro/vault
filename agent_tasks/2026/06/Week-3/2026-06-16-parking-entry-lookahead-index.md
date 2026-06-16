# 2026-06-16 Parking Entry Lookahead Index

## Summary

Fixed parking route-shortening event index selection in `wayve/ai/si/datamodules/parking.py`.

## Changes

- Confirmed `_PARKING_ENTRY_LOOKAHEAD_INDEX_KEY` previously stored `segment_start` for parking/PUDO and hardcoded `0` for unpark/UnPUDO.
- Added explicit helpers to choose the first stopped frame inside the cleaned parking/PUDO neutral segment and the first moving frame after the cleaned unpark/UnPUDO neutral segment.
- Mapped the selected table index into the current/future lookahead index array, falling back to `0` when the event is already before the current origin.
- Updated `wayve/ai/zoo/data/parking.py` so the stored route event index is consumed for both `PARKING_MODE` and `UNPARKING_MODE`.
- Added focused regressions for parking stop index, unparking move-start index, and unpark route-position conversion.

## Validation

- `bazel test //wayve/ai/si/datamodules:py_test --test_arg='-k=add_parking_mode_stores'`
  - New SI regressions passed; target failed coverage because pytest filtering deselected most tests.
- `bazel test //wayve/ai/zoo/data:test_zoo_data_py_test --test_arg='-k=add_parking_stop_route_position_uses_unparking_entry_index'`
  - Passed.
- `bazel test //wayve/ai/si/datamodules:py_lint_ruff`
  - Passed.
- `bazel test //wayve/ai/zoo/data:test_zoo_data_py_lint_ruff`
  - Passed.
- `bazel test //wayve/ai/zoo/data:test_zoo_data_py_test`
  - Passed.
- `bazel test //wayve/ai/si/datamodules:py_test`
  - New regressions passed, but the full target failed on pre-existing broader package issues: `/home/nobody` read-only frame metadata loads, existing lazy-future assertions, missing `DataKeys.PARKING_*`, and Sarsa datapipes producing no samples.
