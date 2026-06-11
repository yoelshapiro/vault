# 2026-06-11 Event Viewer MP4 Frame Snap

- Branch: `boris/pudo_generic_materialization`
- Area: `/workspace/WayveCode/wayve/ai/parking/tools/event_clip_viewer`
- Change type: tool runtime/video URL change

## Summary

Changed event clip viewer media-handler URLs to default to MP4 with `frame_snap=auto`, matching the materialization segment visualizer pattern.

## Changes

- Added `video_format` and `frame_snap` options to the shared `media_url` helper.
- Defaulted `media_url` to `mp4` and `frame_snap=auto`.
- Added a regression test covering the generated URL shape.

## Verification

- `bazel test //wayve/ai/parking/tools/event_clip_viewer:py_checks`
- `git diff --check -- wayve/ai/parking/tools/event_clip_viewer/video_urls.py wayve/ai/parking/tools/event_clip_viewer/test/test_data.py`
- Restarted local Streamlit server on `http://127.0.0.1:3001` and confirmed HTTP `200 OK`.
