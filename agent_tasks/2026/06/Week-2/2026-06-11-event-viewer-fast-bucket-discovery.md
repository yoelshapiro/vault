# 2026-06-11 Event Viewer Fast Bucket Discovery

- Branch: `boris/pudo_generic_materialization`
- Area: `/workspace/WayveCode/wayve/ai/parking/tools/event_clip_viewer`
- Change type: tool performance/UI fix

## Summary

Made anchor-comparison bucket discovery fast by listing bucket directories instead of recursively scanning parquet files under the materialization root.

## Changes

- Replaced recursive parquet traversal in `discover_anchor_buckets` with non-recursive directory listing.
- Scoped bucket discovery by selected split and anchor source.
- Kept fallback to known buckets when discovery cannot find a root.
- Added a regression test that discovers bucket names from folder structure without parquet files.

## Verification

- `bazel test //wayve/ai/parking/tools/event_clip_viewer:py_checks`
- `git diff --check -- wayve/ai/parking/tools/event_clip_viewer/anchor_compare.py wayve/ai/parking/tools/event_clip_viewer/app.py wayve/ai/parking/tools/event_clip_viewer/test/test_data.py`
- Restarted local Streamlit server on `http://127.0.0.1:3001` and confirmed HTTP `200 OK`.
