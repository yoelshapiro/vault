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

## Flyte Run

- Published test image `wayveacrprodflyte.azurecr.io/sampling:borisindel-tmp-build-0.1.125-boris-pudo_generic_materialization-59584` from the uncommitted worktree.
- Started `sample` for `parking_pudo/anchors` with `job_name=anchor_metadata_20260612`.
- Execution: `acpbf99n26hsgjcgw9bv`.
- Console: `https://flyte.data.wayve.ai/console/projects/ai-services-sampling/domains/production/executions/acpbf99n26hsgjcgw9bv`.
- Failure: `IndexError: index ... is out of bounds` in anchor metadata enrichment because `post_process_batch` receives run rows that are not guaranteed to be timestamp-sorted.
- Fix: sort each run's row indices by `timestamp_unixus` before building metadata signals, then write metadata back to original batch row positions. Added shuffled-frame regression coverage.
- Published replacement image digest `sha256:5edbc01402b3d2feba9646d55813ea61b2fdcaaa763a6b301965bd3d3887918c`.
- Restarted `sample` for `parking_pudo/anchors` with `job_name=anchor_metadata_sorted_20260613`.
- Execution: `abldw24rd2s9f9kd27j6`.
- Console: `https://flyte.data.wayve.ai/console/projects/ai-services-sampling/domains/production/executions/abldw24rd2s9f9kd27j6`.
