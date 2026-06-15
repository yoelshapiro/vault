# 2026-06-14 Parking/PUDO Events Dataset

- Branch: `boris/pudo_generic_materialization`
- Worktree: `/workspace/pudo_materialization_buckets`
- Change type: code change, tests, Flyte run
- PR: N/A

## Summary

Added a new generic materialisation dataset config, `parking_pudo/events`, for event-table-style PUDO and UnPUDO rows.

The dataset emits one bucket named `events` with no country suffix. It intentionally does not apply the normal DC-only autonomous filter, so DC and AV rows can be compared against the notebook event table.

## Implementation

- Added `wayve/ai/services/sampling/datasets/parking_pudo/event_table.py`.
  - Detects PUDO at smoothed gear-to-Park anchors when hazard/trip context is present.
  - Detects UnPUDO at first movement after a smoothed Park segment when the source parked segment has hazard/trip context.
  - Records:
    - `event_type`
    - `inferred_what`
    - `gear_change_timestamp_unixus`
    - `disengagement_timestamp_unixus`
    - `country`
    - `trip_detected`
    - `hazard_detected`
    - `trip_id`
  - For UnPUDO, searches for disengagement from 1s before the gear-leaves-Park frame until the first 5m displacement point after departure.
- Added `wayve/ai/services/sampling/datasets/parking_pudo/events/dataset.py`.
  - Registers one bucket, `events`.
  - Uses driving binary `3.0.68`.
  - Uses date range `2025-12-01` to `2026-06-07`.
- Registered `parking_pudo/events` in `datasets/store.py`.
- Added a narrow framework hook, `BucketedDataset.extra_output_columns`, so metadata columns produced by `post_process_batch` survive mask generation and bucket creation.

## Validation

Passed:

- `bazel test //wayve/ai/services/sampling:test_tasks_py_test //wayve/ai/services/sampling:test_datasets_py_test --test_filter='test_extra_output_columns_survive_masks_and_buckets|test_parking_pudo_events_dataset_uses_single_unsplit_bucket|test_parking_pudo_event_metadata_detects_pudo_unpudo_and_disengagement|test_parking_pudo_event_metadata_records_trip_id_without_hazards'`
- `bazel test //wayve/ai/services/sampling:test_datasets_py_lint_ruff //wayve/ai/services/sampling:test_tasks_py_lint_ruff //wayve/ai/services/sampling:test_datasets_ty //wayve/ai/services/sampling:test_tasks_ty`
- `bazel test //wayve/ai/services/sampling:test_datasets_py_lint_flake8 //wayve/ai/services/sampling:test_tasks_py_lint_flake8`
- `bazel build //wayve/ai/services/sampling:dataset_configs //wayve/ai/services/sampling:tasks`

## Flyte

- Image: `wayveacrprodflyte.azurecr.io/sampling:borisindel-tmp-build-0.1.125-boris-pudo_generic_materialization-59584`
- Flyte execution: https://flyte.data.wayve.ai/console/projects/ai-services-sampling/domains/production/executions/aqkssq4fckbcpgcswphx
- Command:

```bash
WAYVECODE_MAIN_COMMIT_META_OVERRIDE=244abae57524 bazel run //wayve/ai/services/sampling:workflow -- \
  remote run filter_and_bucket_stage \
  --dataset_name parking_pudo/events \
  --job_name parking_pudo_events_20260614
```

Used `filter_and_bucket_stage` for the first review run because the new dataset has no stable comparison root yet; a full `sample` run would likely reach compare and fail after materialisation.

## 2026-06-15 AV Mode Column

Added `av_mode` to the event metadata schema. It is a boolean copied from `ground_truth__state__vehicle__automation_active` at the emitted event anchor:

- PUDO: AV mode at the gear-to-Park anchor.
- UnPUDO: AV mode at the first-movement-after-Park anchor.

Validation passed:

- `bazel test //wayve/ai/services/sampling:test_tasks_py_test //wayve/ai/services/sampling:test_datasets_py_test --test_filter='test_extra_output_columns_survive_masks_and_buckets|test_parking_pudo_events_dataset_uses_single_unsplit_bucket|test_parking_pudo_event_metadata_detects_pudo_unpudo_and_disengagement|test_parking_pudo_event_metadata_records_trip_id_without_hazards'`
- `bazel test //wayve/ai/services/sampling:test_datasets_py_lint_ruff //wayve/ai/services/sampling:test_tasks_py_lint_ruff //wayve/ai/services/sampling:test_datasets_ty //wayve/ai/services/sampling:test_tasks_ty`
- `bazel test //wayve/ai/services/sampling:test_datasets_py_lint_flake8 //wayve/ai/services/sampling:test_tasks_py_lint_flake8`
- `bazel build //wayve/ai/services/sampling:dataset_configs //wayve/ai/services/sampling:tasks`

Published image:

- `wayveacrprodflyte.azurecr.io/sampling:borisindel-tmp-build-0.1.125-boris-pudo_generic_materialization-59584`
- Digest: `sha256:e442447224e561c91af60dc934cb7f0c30348972fc8444513764b0dc853e055a`

Flyte rerun:

- https://flyte.data.wayve.ai/console/projects/ai-services-sampling/domains/production/executions/asbcbg8m6s8g6c24qscc
- Command:

```bash
WAYVECODE_MAIN_COMMIT_META_OVERRIDE=244abae57524 bazel run //wayve/ai/services/sampling:workflow -- \
  remote run filter_and_bucket_stage \
  --dataset_name parking_pudo/events \
  --job_name parking_pudo_events_av_mode_20260615
```
