# 2026-06-10 Event Clip Viewer Browser Preload

- Branch/worktree: detached worktree at `/workspace/event_clip_viewer`.
- PR context: inspected `gh pr diff 117577 --repo wayveai/WayveCode` and copied the browser-side hidden-video preload approach from the fallback visualization tool.
- Change type: Tool UI/runtime fix.
- Areas: `/workspace/event_clip_viewer/wayve/ai/parking/tools/event_clip_viewer`.

## Changes

- Removed the selected-clip dependency on the Python `VideoUrlWarmer` thread in `app.py`.
- Added browser-side hidden `<video preload="auto">` elements to `render_players` and `render_single_player`.
- Compute nearby-event preload URLs for live media-handler, model-catalogue, and generated MP4 playback using the existing `Preload next autoplay clips` control.
- Confirmed there are no date-filter controls left in the event clip viewer path.
- Updated the default materialization anchors path to `abfss://datasets@wayveproddatasetflat.dfs.core.windows.net/sampling_materialised/parking_pudo/anchors/dev/parking_pudo_anchors_gates_20260610__2026-06-10-08-16`.

## Verification

- `rg -n "date_input|start_date|end_date|date filter|date_filter|Date range|lookback|since|until|start time|end time" wayve/ai/parking/tools/event_clip_viewer` returned no matches.
- `git diff --check -- wayve/ai/parking/tools/event_clip_viewer`
- `python -m py_compile wayve/ai/parking/tools/event_clip_viewer/app.py wayve/ai/parking/tools/event_clip_viewer/components.py wayve/ai/parking/tools/event_clip_viewer/data.py wayve/ai/parking/tools/event_clip_viewer/materialization.py wayve/ai/parking/tools/event_clip_viewer/model_catalogue.py wayve/ai/parking/tools/event_clip_viewer/video_urls.py wayve/ai/parking/tools/event_clip_viewer/warmer.py`
- `bazel test //wayve/ai/parking/tools/event_clip_viewer:py_checks`
