# 2026-06-04 UnPUDO Event Streamlit Viewer

## Summary
- Built a local Streamlit viewer for `hive_metastore.parking.pudo_unpudo_unpark_events_gear_fix`.
- The viewer runs from `/workspace/classifiers` on branch `boris/hari_pudo`.
- Local URL: `http://127.0.0.1:3001/`.

## What Changed
- Added Bazel target `//tools/databricks_queries/unpudo_event_viewer:viewer`.
- Added event filters for `event_type`, run ID substring, and row limit.
- Displays selected event metadata including `runID`, event timestamp, `event_type`, speed, gear-change timing, country, lat/lon, and source URL.
- Builds media-server clip URLs centered on the selected `timestamp_unixus`.
- Displays all five cameras by default and lets the user jump all videos back to the event timestamp.

## Verification
- `bazel test //tools/databricks_queries/unpudo_event_viewer:py_checks` passed.
- Streamlit server started in tmux session `unpudo-event-viewer`.
- `curl -sI http://127.0.0.1:3001/` returned HTTP 200.

## Notes
- The browser must be able to reach `https://media-handler.azr.internal.wayve.ai` for videos to play.
- The app infers `gen2` from the run ID when the table does not include an explicit platform column.
