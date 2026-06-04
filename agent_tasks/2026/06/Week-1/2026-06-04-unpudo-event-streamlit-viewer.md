# 2026-06-04 UnPUDO Event Streamlit Viewer

## Summary
- Built a local Streamlit viewer for `hive_metastore.parking.pudo_unpudo_unpark_events_gear_fix`.
- The viewer runs from `/workspace/classifiers` on branch `boris/hari_pudo`.
- Local URL: `http://127.0.0.1:3001/`.
- Promoted the viewer into `/workspace/event_clip_viewer` on branch `boris/event_clip_viewer`.
- Draft PR: https://github.com/wayveai/WayveCode/pull/116721.

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
- Updated the event-loading query to dedupe source rows by `(runID, timestamp_unixus)` after applying sidebar filters.
- Follow-up change, not restarted yet: made dedupe a sidebar toggle, changed videos/playlists to start from the beginning, and added a green border while playback is within 0.5s of the event timestamp.
- Follow-up change, not restarted yet: made live media-handler cameras the default video source and enabled autoplay for single-event video renders.
- Follow-up change, not restarted yet: added a random-sample toggle plus `Resample` button that changes the SQL `rand(seed)` ordering.
- Moved the viewer into `wayve/ai/parking/tools/event_clip_viewer` for PR review.
- Split the implementation into `app.py`, `components.py`, `config.py`, `data.py`, and `video_urls.py` so files remain below the repo line-count guidance.
- Added `README.md` with the Bazel run command and access requirements.
- Final PR version does not modify `tools/databricks_queries/lib/BUILD`; the viewer calls the existing Databricks SQL connection helper directly.
- Added `//wayve/ai/parking/tools/event_clip_viewer:compile_event_videos`, a CLI for generating one concatenated MP4 per event type.
- Compilation defaults: 100 random deduped events for each of `pudo`, `unpudo`, and `unparking`; `front_forward`; `-15s/+15s`; `10x`; green event-time border.

## Verification
- `bazel test //tools/databricks_queries/unpudo_event_viewer:py_checks` passed.
- Streamlit server started in tmux session `unpudo-event-viewer`.
- `curl -sI http://127.0.0.1:3001/` returned HTTP 200.
- Azure blob listing for the generated MP4 prefix works from the current environment.
- Playlist update verified with `bazel test //tools/databricks_queries/unpudo_event_viewer:py_checks` and Streamlit restart on port `3001`.
- Playback-speed update verified with `bazel test //tools/databricks_queries/unpudo_event_viewer:py_checks` and Streamlit restart on port `3001`.
- Dedupe-query update verified with `bazel test //tools/databricks_queries/unpudo_event_viewer:py_checks` and Streamlit restart on port `3001`.
- The follow-up toggle/start-from-beginning/green-border/live-default/autoplay/random-sample changes were intentionally not run or restarted.
- PR branch verification: `bazel test //wayve/ai/parking/tools/event_clip_viewer:py_checks` passed.
- PR branch runtime check: `EVENT_CLIP_VIEWER_PORT=3002 bazel run //wayve/ai/parking/tools/event_clip_viewer:viewer` served HTTP 200; temporary validation server was stopped.
- Compilation CLI check: `bazel run //wayve/ai/parking/tools/event_clip_viewer:compile_event_videos -- --help` passed. Full video generation was not run.
- Full compilation attempt at `2026-06-04T15:56:57Z`: `bazel run //wayve/ai/parking/tools/event_clip_viewer:compile_event_videos -- --event-type unpudo --event-type pudo --random-count 100 --seed 0 ... --overwrite` ran for `31:04.44` wall time and failed with exit status 1 on a media-handler HTTP 500 before starting `pudo`.

## Run Ledger
- `unpudo_pudo_100_seed0`: requested 100 random `unpudo` and 100 random `pudo` clips, `front_forward`, `-15s/+15s`, `10x`, green event marker. Outcome: failed after 68 rendered `unpudo` segments; no output concat MP4 and no `pudo` segments. Key failure: media-handler returned HTTP 500 for `fme20032/2026-05-15--05-41-43--gen2-av-bc82e12d-0554-4dfa-8e78-929db2cf322d` at event timestamp `2026-05-15 06:13:41.183315`.

## Notes
- The browser must be able to reach `https://media-handler.azr.internal.wayve.ai` for videos to play.
- The app infers `gen2` from the run ID when the table does not include an explicit platform column.
- Generated blob MP4s are 32-second Flyte clips encoded at 3x speed, so the jump-to-event offset is `16 / 3 = 5.33s`.
