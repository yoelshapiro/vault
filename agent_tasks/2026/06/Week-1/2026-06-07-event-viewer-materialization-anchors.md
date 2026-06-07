# 2026-06-07 Event Viewer Materialization Anchors

## Summary

Extended the parking event clip viewer so it can load clips from either the existing Databricks event table or a generic materialisation anchors output.

## Branch

- `/workspace/WayveCode`
- `boris/pudo_generic_materialization`

## Changes

- Added a sidebar `Data source` toggle:
  - `Event table SQL` keeps the existing event-table/event-type flow.
  - `Materialization anchors path` reads generic materialisation anchor parquet files.
- Added a default anchors path for the current `parking_pudo/anchors` run.
- Added materialisation bucket discovery from:
  - `dataset/dataset_split=<split>/dataset_bucket=<bucket>/`
- Added bucket selection for materialisation mode.
- Added anchor loading from Parquet using only:
  - `runID` or `run_id`
  - `timestamp_unixus`
- Reused the existing clip viewer contract by exposing the selected bucket as `event_type`.
- Updated the README and Bazel deps for the new `pyarrow` reader.

## Validation

- `python -m py_compile wayve/ai/parking/tools/event_clip_viewer/app.py wayve/ai/parking/tools/event_clip_viewer/data.py`
- `git diff --check -- wayve/ai/parking/tools/event_clip_viewer`
- `bazel test //wayve/ai/parking/tools/event_clip_viewer:py_lint_ruff //wayve/ai/parking/tools/event_clip_viewer:py_lint_flake8 //wayve/ai/parking/tools/event_clip_viewer:ty`
- Started the viewer on `http://127.0.0.1:3004` and verified HTTP 200.

## Notes

- Left the existing viewer process on port `3001` running and started this branch on port `3004`.
- `/workspace` was full during editing; freed space by truncating Codex logs and deleting old Bazel Java log files only.
- `wayve/ai/services/sampling/common/spark_tasks.py` already had an unrelated local change and was not modified for this task.
