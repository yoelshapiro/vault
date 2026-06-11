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

## Verification

- `WAYVECODE_MAIN_COMMIT_META_OVERRIDE=244abae57524 bazel test //wayve/ai/services/sampling:test_spark_tasks_py_test --test_arg=-k --test_arg='anchor_table or delta_table_target or read_all_bucket' --test_arg=--no-cov`
- `WAYVECODE_MAIN_COMMIT_META_OVERRIDE=244abae57524 bazel build //wayve/ai/services/sampling:workflow`
