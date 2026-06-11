# 2026-06-11 Anchor Table Upload Workflow

- Branch: `boris/pudo_generic_materialization`
- Worktree: `/workspace/pudo_materialization_buckets`
- PR: #117075 draft context
- Change type: Generic materialisation workflow utility

## Summary

Added an optional Flyte/Spark path to publish anchor bucket rows to a Databricks
Delta table for inspection/debugging.

## Changes

- Added `upload_anchor_buckets_to_databricks_table` Spark task.
  - Reads from `<dataset_path>/buckets`, not the balanced `<dataset_path>/dataset`.
  - Recovers Hive partition columns from `dataset_split=*/dataset_bucket=*`.
  - Adds `bucket_name` and `train_val_split` aliases.
  - Writes an external Delta table using caller-provided `table_name` and `table_path`.
  - Rejects hyphenated table names such as `parking.parking-pudo-anchors`.
- Added `upload_anchor_table_stage` standalone workflow for existing anchor roots.
- Added optional `sample` workflow inputs:
  - `upload_anchor_table`
  - `anchor_table_name`
  - `anchor_table_path`
- Updated `parking_pudo` README with example commands.
- Added focused Spark helper tests for:
  - all-bucket parquet read with `basePath`
  - target table validation
  - `bucket_name` / `train_val_split` aliasing
- Added Databricks-notebook backed upload automation after the Spark permission
  failure:
  - `upload_anchor_buckets_to_databricks_via_notebook` imports a generated
    Python notebook into the workspace.
  - The task resolves the running Databricks cluster by name (`shared_2.3.231`)
    unless a cluster id is passed explicitly.
  - The task submits a one-time Databricks notebook run and polls it to terminal
    state, returning the Databricks run URL.
  - The task maps Flyte's `AZURE_CLIENT_*` env vars to the Databricks SDK's
    `ARM_*` env vars for Azure service-principal auth.
- Added `filter_bucket_and_upload_anchor_table_stage` so anchor bucket creation
  and Databricks upload can run in a single Flyte execution without the
  balance/compare/distribution stages.
- Switched `upload_anchor_table_stage` and optional `sample --upload_anchor_table`
  to the Databricks-notebook upload path instead of direct Flyte Spark writes.

## Verification

- `WAYVECODE_MAIN_COMMIT_META_OVERRIDE=244abae57524 bazel test //wayve/ai/services/sampling:test_spark_tasks_py_test --test_arg=-k --test_arg='anchor_table or delta_table_target or read_all_bucket' --test_arg=--no-cov`
- `WAYVECODE_MAIN_COMMIT_META_OVERRIDE=244abae57524 bazel build //wayve/ai/services/sampling:workflow`
- `WAYVECODE_MAIN_COMMIT_META_OVERRIDE=244abae57524 bazel test //wayve/ai/services/sampling:test_spark_tasks_py_test //wayve/ai/services/sampling:test_tasks_py_test --test_arg=-k --test_arg='databricks or anchor_table or filter_bucket_and_upload_anchor_table' --test_arg=--no-cov`

## 2026-06-11 Upload Run

- Target table: `parking.parking_pudo_anchors_no_low_steering_20260611`
- Target path: `abfss://databricks-users@wayveproddataset.dfs.core.windows.net/parking/parking_pudo_anchors_no_low_steering_20260611.table`
- Source anchors root: `abfss://datasets@wayveproddatasetflat.dfs.core.windows.net/sampling_materialised/parking_pudo/anchors/dev/parking_pudo_anchors_no_low_steering_20260611__2026-06-11-13-18`
- Flyte attempt `arvxckwn84xqhrhjqppt` failed because the remote image was stale and did not contain `upload_anchor_buckets_to_databricks_table`.
- Published fresh sampling image digest `sha256:cba402cd484302722fe3a5893efbf6c6d7b5f2309b63c16cadc7877a2700c043`.
- Flyte attempt `a4szp48w8mcq8dld25ns` loaded the new task but failed with Azure `403` on the `databricks-users` target path. Flyte Spark can read the anchors root but does not have permission to write the Databricks-users container used by the event notebook.
- Successful upload used a Databricks notebook run on cluster `shared_2.3.231` (`0611-172359-yp81nb1e`) so it followed the same storage convention as the event notebook.
- Databricks run: `https://adb-7835963732836817.17.azuredatabricks.net/?o=7835963732836817#job/981232753790606/run/435103836940643`
- Verification query returned `1,381,950` rows, `152` buckets, and `2` train/validation splits.
