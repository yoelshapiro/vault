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

## Databricks Upload

- Uploaded the completed anchor buckets root to `parking.parking_pudo_anchors`.
- Source root: `abfss://datasets@wayveproddatasetflat.dfs.core.windows.net/sampling_materialised/parking_pudo/anchors/dev/anchor_metadata_sorted_20260613__2026-06-13-19-40`.
- Databricks upload run: `393577664716791`.
- Run URL: `https://adb-7835963732836817.17.azuredatabricks.net/?o=7835963732836817#job/361376013964867/run/393577664716791`.
- Table path: `abfss://databricks-users@wayveproddataset.dfs.core.windows.net/parking/parking_pudo_anchors.table`.
- Validation: `1,381,954` rows, `152` buckets, `2` splits (`train`: `1,194,408`, `validation`: `187,546`).
- Finding: the materialised `buckets/` parquet contains only generic anchor columns (`run_id`, `timestamp_unixus`, `dataset_split`, `dataset_bucket`, etc.). The new event/trip/intervention metadata columns are not present in the root, so they were not uploaded to the table.

## Preserve Metadata In Buckets

- Root cause: `post_process_batch` runs before `run_filters_on_batch`, but `run_filters_on_batch` rebuilds the mask table from `DEFAULT_COLUMNS` and filter masks only. Appended metadata columns were dropped before `create_buckets`.
- Fix: added `BucketedDataset.extra_output_columns` so datasets can explicitly opt columns into the mask table and downstream bucket output.
- `parking_pudo/anchors` now opts in all `ANCHOR_METADATA_COLUMNS`.
- The framework preserves these extra columns as PyArrow arrays so nullable/all-null metadata columns keep their declared type across batches.
- Validation:
  - `WAYVECODE_MAIN_COMMIT_META_OVERRIDE=244abae57524 bazel test //wayve/ai/services/sampling:test_datasets_py_test --test_filter='test_extra_output_columns_survive_masks_and_buckets|test_parking_pudo_anchors_dataset_mirrors_default_bucket_names'`
  - `WAYVECODE_MAIN_COMMIT_META_OVERRIDE=244abae57524 bazel test //wayve/ai/services/sampling:test_datasets_py_lint_ruff //wayve/ai/services/sampling:test_datasets_py_lint_flake8 //wayve/ai/services/sampling:test_datasets_ty`

## Flyte Run With Preserved Metadata Columns

- Published sampling test image from the uncommitted worktree:
  `wayveacrprodflyte.azurecr.io/sampling:borisindel-tmp-build-0.1.125-boris-pudo_generic_materialization-59584`
- Digest: `sha256:7d5adeabf8efb7c4d9c997f1538adca96f84bd0a3bc850363c70c7d0eae6ddc7`.
- Started `sample` for `parking_pudo/anchors` with `job_name=anchor_metadata_preserve_columns_20260614`.
- Execution: `axpd8zm9x872cf7mj7fc`.
- Console: `https://flyte.data.wayve.ai/console/projects/ai-services-sampling/domains/production/executions/axpd8zm9x872cf7mj7fc`.
