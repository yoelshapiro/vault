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
