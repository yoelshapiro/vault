# 2026-06-12 Parking/PUDO Anchor Metadata

## Summary

Added lightweight metadata enrichment for `parking_pudo/anchors` generic materialisation. The design keeps bucket filters as pure masks and appends event-table-like columns in an anchor-only post-processing step.

## Branch

`boris/pudo_generic_materialization`

## Areas

- `/workspace/pudo_materialization_buckets/wayve/ai/services/sampling/datasets/parking_pudo/anchor_metadata.py`
- `/workspace/pudo_materialization_buckets/wayve/ai/services/sampling/datasets/parking_pudo/anchors/dataset.py`
- `/workspace/pudo_materialization_buckets/wayve/ai/services/sampling/test/datasets/parking_pudo/test_parking_pudo_filters.py`

## Changes

- Added `enrich_parking_pudo_anchor_metadata` as the `parking_pudo/anchors` `post_process_batch`.
- Added nullable event metadata columns: event type, event window timestamps, anchor telemetry, gear-change timestamp, PUDO context source, intervention-in-30s context, and trip-event context.
- Added shared event-record builders in `events.py`; filters convert those records into masks and anchor metadata converts the same records into columns.
- Reused the existing Parking/PUDO signal helpers so metadata follows the same anchor detection logic as the buckets without duplicating selector loops.
- Kept CA anchors unchanged for now; metadata is populated for park/PUDO/unpark/UnPUDO event anchors.
- Added focused regression coverage for hazard-source and trip-source anchor metadata.

## Validation

- `WAYVECODE_MAIN_COMMIT_META_OVERRIDE=244abae57524 bazel test //wayve/ai/services/sampling:test_datasets_py_lint_ruff //wayve/ai/services/sampling:test_datasets_py_lint_flake8 //wayve/ai/services/sampling:test_datasets_ty //wayve/ai/services/sampling:test_datasets_py_test`
