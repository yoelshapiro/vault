# 2026-06-10 Event Viewer Materialization Segments

- Branch: `boris/pudo_generic_materialization`
- Area: `/workspace/WayveCode/wayve/ai/parking/tools/event_clip_viewer`
- Change type: tool UI/data loading change

## Summary

Updated the event clip viewer materialization source to support bucket outputs where each event contains many timestamp rows rather than a single anchor timestamp.

## Changes

- Added continuous materialization timestamp bundling per `runID`.
- Added a sidebar toggle for bundled rows and a `Max gap within event (s)` split threshold.
- Returned event-window metadata: start timestamp, end timestamp, duration, and source row count.
- Changed live media-handler playback/preload URL generation to use the materialization start/end window when present.
- Changed model-catalogue playback/autoplay to seek from segment start to segment end when present.
- Added a regression test for timestamp bundling.

## Verification

- `bazel test //wayve/ai/parking/tools/event_clip_viewer:py_checks`
- `git diff --check -- wayve/ai/parking/tools/event_clip_viewer/BUILD wayve/ai/parking/tools/event_clip_viewer/app.py wayve/ai/parking/tools/event_clip_viewer/data.py wayve/ai/parking/tools/event_clip_viewer/materialization.py wayve/ai/parking/tools/event_clip_viewer/test/test_data.py`
- Restarted local Streamlit server on `http://127.0.0.1:3001` and confirmed HTTP `200 OK`.
