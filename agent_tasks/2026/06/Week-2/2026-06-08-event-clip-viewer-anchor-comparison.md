# 2026-06-08 Event Clip Viewer Anchor Comparison

## Summary

Updated the Parking event clip viewer in `/workspace/event_clip_viewer` on branch
`boris/event_clip_viewer` to compare generic materialization anchors against the
gear-fix event table.

## Changes

- Added an `Anchor comparison` mode that starts by default on `dc_pudo_uk`.
- Added configurable materialization anchors root, bucket selector, event row
  limit, dedupe toggle, run-id filter, and 30 second match threshold.
- Loaded anchors from parquet via the repo pyarrow filesystem helper.
- Inferred comparable event-table filters from bucket names, including country
  suffixes such as `uk -> GBR`.
- Matched event rows to nearest same-run anchors and surfaced:
  - matched events,
  - event-table rows missing in anchors,
  - event rows,
  - anchor rows or unmatched extra anchors.
- Preserved existing live media-handler and generated blob clip playback.

## Verification

- `bazel test //wayve/ai/parking/tools/event_clip_viewer:py_checks`
- Synthetic matcher smoke check through `viewer_ipython`: one matched, two
  missing, one extra anchor.
- Served the updated viewer on `http://127.0.0.1:3001`.

## Follow-up Fix

- Restored the default anchors root to the branch-release path:
  `abfss://datasets@wayveproddatasetflat.dfs.core.windows.net/sampling_materialised/parking_pudo/anchors/boris-pudo-generic-materialization/2026-06-08-1`.
- Removed recursive bucket discovery from the Streamlit sidebar.
- Added local selected-bucket caching under `/tmp/event_clip_viewer_anchor_cache`.
- Added an `all` split default and fixed split handling so missing splits do not fall back to train.
- Verified `dc_pudo_uk` anchor loads:
  - `all`: `28,658`
  - `train`: `23,932`
  - `validation`: `4,726`
  - `test`: `0`
- Corrected 30s comparison with all anchors:
  - events: `51,355`
  - anchors: `28,658`
  - matched: `26,362`
  - missing: `24,993`

## Missing-Event Debug Button

- Added a `Debug Missing Event` control below the missing-events table.
- The control renders quick `Run` buttons for the first missing rows, capped to
  keep the Streamlit page responsive, plus a selectbox for choosing any missing
  row explicitly.
- Each selected event-table row that is missing from anchors runs:
  `bazel run //wayve/ai/services/sampling:debug_sampling -- --dataset parking_pudo/anchors --run-id ... --event-ts ... --skip-funnels`.
- The command runs from `/workspace/WayveCode` by default so it uses the current
  parking PUDO materialization implementation; this can be overridden with
  `EVENT_CLIP_VIEWER_DEBUG_REPO_ROOT`.
- The Streamlit UI shows the exact command, return code, stdout, and stderr so
  failures in the filter/debug path are visible from the viewer.
- Also ported the single-run/timestamp debug options into
  `wayve/ai/services/sampling/datasets/debug_sampling.py` in the event-viewer
  worktree for branch-local debugging.
- Verification:
  - `python -m py_compile wayve/ai/parking/tools/event_clip_viewer/app.py wayve/ai/services/sampling/datasets/debug_sampling.py`
  - `curl -I http://localhost:3001/`
  - Full Bazel build was blocked by workspace cache pressure:
    `OSError: [Errno 28] No space left on device: 'whl_file.json'`.

## Port To PUDO Generic Materialization

- Rebasing target: `/workspace/WayveCode`, branch
  `boris/pudo_generic_materialization`, onto `origin/main`.
- Skipped two generated `bump-versions` commits during rebase so main's
  autopublish metadata won.
- Resolved the sampling partition-cap conflict by preserving the current
  Spark-based partition planner and keeping the `700` run-id cap regression
  check.
- Ported the uncommitted comparison/debug viewer changes into the rebased main
  folder:
  - `wayve/ai/parking/tools/event_clip_viewer/anchor_compare.py`
  - comparison mode in `app.py`
  - default anchor comparison controls in `config.py`
  - BUILD deps and README usage note
  - single-run/timestamp debug support in `debug_sampling.py`
- Served the rebased `/workspace/WayveCode` viewer on `http://127.0.0.1:3001`.
- Verification:
  - `python -m py_compile wayve/ai/parking/tools/event_clip_viewer/app.py wayve/ai/parking/tools/event_clip_viewer/anchor_compare.py wayve/ai/services/sampling/datasets/debug_sampling.py`
  - `git diff --check`
  - `bazel test //wayve/ai/parking/tools/event_clip_viewer:py_checks`
  - `curl -I http://127.0.0.1:3001/`

## Remove Inline debug_sampling Runner

- Removed the Streamlit controls that launched
  `bazel run //wayve/ai/services/sampling:debug_sampling` from missing-anchor rows.
- Kept the event-table vs anchor comparison source, missing/matched tables, and
  clip-player row browsing.
- Reason: single-run debug sampling loads joined materialisation dependencies and
  can take long enough to make the viewer unusable.
- Served the viewer again on `http://127.0.0.1:3001`.
- Verification:
  - `make py-format`
  - `bazel test //wayve/ai/parking/tools/event_clip_viewer:py_checks --test_output=errors`
  - `git diff --check`
  - `curl -I http://localhost:3001/`

## Reverse Missing-Anchors View

- Updated `/workspace/WayveCode` on branch `boris/pudo_generic_materialization`.
- Made anchors with no matching event-table row a first-class comparison result:
  - added a `Missing in event table` metric,
  - added a default-visible table,
  - made those rows selectable in the clip player.
- Added an `Anchor parquet` control:
  - `Raw buckets` checks what materialization produced,
  - `Balanced dataset` checks sampled train/validation/test rows.
- Changed raw bucket loading to prefer `buckets/` parquet before `dataset/`
  parquet and bumped the local cache key version.
- Updated the default root to:
  `abfss://datasets@wayveproddatasetflat.dfs.core.windows.net/sampling_materialised/parking_pudo/anchors/dev/parking_pudo_anchors_temp_compare_20260609_1402__2026-06-09-14-06`.

### Sample investigation

- Sample:
  `fme20036/2026-03-26--15-41-18--gen2-av-9e2f4bbd-d3ca-4e67-be30-58c11cc21e09`
  at `1774544581333311`.
- Event table row is PUDO, GBR, non-AV, and appears four times because of the
  model-session join; the viewer dedupe setting collapses this by
  `(runID, timestamp_unixus)`.
- Exact corpus frame at the event timestamp:
  - `gear_direction = 0`
  - `indicator_light = off`
  - `automation_active = false`
  - `speed_kmh = 0.67`
  - `inferred__intervention__what = uncategorised`
- The +/-60s frame window showed right/left indicator spans but no hazard state.
- `prod_data_pipeline.inferred__robotaxi.trip_events` returned no rows for the
  run, so the generic trip-table PUDO synthesis cannot rescue this sample.
- Current conclusion: this is missing from `dc_pudo_uk` because generic PUDO
  requires cleaned real hazard evidence or matched trip-table context over the
  parked segment. This run has neither in corpus/trip tables, even though the
  event notebook classified it as PUDO.
- Verification:
  - `bazel test //wayve/ai/parking/tools/event_clip_viewer:py_checks`
  - served viewer on `http://127.0.0.1:3001`

## Date Cutoff

- Updated `/workspace/WayveCode` on branch `boris/pudo_generic_materialization`.
- Added a viewer-wide minimum run date cutoff: `2025-12-01`.
- Applied the cutoff in three places:
  - event-table SQL defaults and generated event queries filter `run_date_iso >= '2025-12-01'`,
  - materialization anchor parquet reads infer the date from `runID` when `run_date_iso` is absent,
  - app-level event normalization applies the same guard so custom SQL or cached anchor data cannot reintroduce older rows.
- Bumped the local anchor cache version to avoid reusing older unfiltered cache files.
- Verification:
  - `git diff --check`
  - `bazel test //wayve/ai/parking/tools/event_clip_viewer:py_checks`
  - restarted viewer on `http://127.0.0.1:3001`
