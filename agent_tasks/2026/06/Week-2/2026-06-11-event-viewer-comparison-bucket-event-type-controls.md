# 2026-06-11 Event Viewer Comparison Bucket Event Type Controls

- Branch: `boris/pudo_generic_materialization`
- Area: `/workspace/WayveCode/wayve/ai/parking/tools/event_clip_viewer`
- Change type: tool UI/query control change

## Summary

Updated the event viewer anchor-comparison source so users can choose any discovered materialization bucket and independently choose the event-table `event_type` used for the comparison.

## Changes

- Replaced the hardcoded compare bucket selectbox with bucket discovery from the selected materialization root.
- Added a `Refresh bucket list` control that clears the cached discovery result.
- Added an independent `Event table event_type` selectbox with inferred, all-types, and table-backed event-type options.
- Changed comparison SQL loading to use the selected event type rather than always inferring it from the bucket name.
- Added regression tests for selected event-type filtering and all-event-type comparison.

## Verification

- `bazel test //wayve/ai/parking/tools/event_clip_viewer:py_checks`
- `git diff --check -- wayve/ai/parking/tools/event_clip_viewer/anchor_compare.py wayve/ai/parking/tools/event_clip_viewer/app.py wayve/ai/parking/tools/event_clip_viewer/test/test_data.py`
- Restarted local Streamlit server on `http://127.0.0.1:3001` and confirmed HTTP `200 OK`.
