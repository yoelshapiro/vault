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
- Added a generated-blob playback mode for precomputed MP4 collages under `flyte_remote/videos/borisindelman/unpudo_standstill/camera_present_drop_missing_20260602_095509_UTC/gen2`.
- Blob mode signs MP4 URLs with a one-day user-delegation SAS and matches clips by exact `runID + timestamp_unixus`.
- Live media-handler mode remains available for arbitrary timestamps that do not have a generated blob MP4.
- Added playlist mode for the currently loaded events. It can autoplay sequentially, loop until stopped, and exposes Play/Pause/Stop/Prev/Next controls.
- Changed the default live camera selection to `front_forward`; playlist mode uses the first selected camera for live media-handler playback.
- Added a sidebar playback-speed control, defaulting to `3x`.

## Verification
- `bazel test //tools/databricks_queries/unpudo_event_viewer:py_checks` passed.
- Streamlit server started in tmux session `unpudo-event-viewer`.
- `curl -sI http://127.0.0.1:3001/` returned HTTP 200.
- Azure blob listing for the generated MP4 prefix works from the current environment.
- Playlist update verified with `bazel test //tools/databricks_queries/unpudo_event_viewer:py_checks` and Streamlit restart on port `3001`.
- Playback-speed update verified with `bazel test //tools/databricks_queries/unpudo_event_viewer:py_checks` and Streamlit restart on port `3001`.

## Notes
- The browser must be able to reach `https://media-handler.azr.internal.wayve.ai` for videos to play.
- The app infers `gen2` from the run ID when the table does not include an explicit platform column.
- Generated blob MP4s are 32-second Flyte clips encoded at 3x speed, so the jump-to-event offset is `16 / 3 = 5.33s`.
