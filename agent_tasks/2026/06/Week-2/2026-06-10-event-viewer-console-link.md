# 2026-06-10 Event Viewer Console Link

- Branch/worktree: `/workspace/WayveCode` on `boris/pudo_generic_materialization`.
- Change type: Tool UI fix.
- Areas: `/workspace/WayveCode/wayve/ai/parking/tools/event_clip_viewer`.

## Changes

- Added `console_url(run_id, timestamp_unixus)` in `video_urls.py`.
- Added an always-present `Open Console` button in the selected event info panel.
- Kept the existing source-table `URL` link as a separate `Open source URL` button when present.

## Verification

- `git diff --check -- wayve/ai/parking/tools/event_clip_viewer`
- `python -m py_compile wayve/ai/parking/tools/event_clip_viewer/app.py wayve/ai/parking/tools/event_clip_viewer/video_urls.py`
- `bazel test //wayve/ai/parking/tools/event_clip_viewer:py_checks`
- Restarted Streamlit on `http://127.0.0.1:3001` and verified HTTP `200 OK`.
