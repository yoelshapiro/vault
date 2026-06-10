# 2026-06-10 Event Viewer Branch Correction

- Branch/worktree: `/workspace/WayveCode` on `boris/pudo_generic_materialization`.
- Change type: Tool UI/runtime fix.
- Areas: `/workspace/WayveCode/wayve/ai/parking/tools/event_clip_viewer`.

## Changes

- Applied the event clip viewer changes to the correct branch after the initial worktree mix-up.
- Removed date cutoff filtering from the default SQL, event type query, materialization anchor loading, anchor comparison queries, and anchor normalization.
- Removed selected-clip use of the Python `VideoUrlWarmer` thread.
- Added browser-side hidden `<video preload="auto">` elements for selected live, model-catalogue, and generated MP4 clips.
- Updated the default materialization anchors path to `abfss://datasets@wayveproddatasetflat.dfs.core.windows.net/sampling_materialised/parking_pudo/anchors/dev/parking_pudo_anchors_gates_20260610__2026-06-10-08-16`.

## Verification

- `rg -n "date_input|start_date|end_date|date filter|date_filter|Date range|lookback|since|until|MIN_EVENT_RUN_DATE|MAX_EVENT_RUN_DATE_EXCLUSIVE|_filter_run_date_range|VideoUrlWarmer|VideoWarmRequest|warm_video_urls|run_date_iso >=|run_date_iso <" wayve/ai/parking/tools/event_clip_viewer`
- `git diff --check -- wayve/ai/parking/tools/event_clip_viewer`
- `python -m py_compile wayve/ai/parking/tools/event_clip_viewer/app.py wayve/ai/parking/tools/event_clip_viewer/components.py wayve/ai/parking/tools/event_clip_viewer/data.py wayve/ai/parking/tools/event_clip_viewer/anchor_compare.py wayve/ai/parking/tools/event_clip_viewer/materialization.py wayve/ai/parking/tools/event_clip_viewer/model_catalogue.py wayve/ai/parking/tools/event_clip_viewer/video_urls.py`
- `bazel test //wayve/ai/parking/tools/event_clip_viewer:py_checks`
