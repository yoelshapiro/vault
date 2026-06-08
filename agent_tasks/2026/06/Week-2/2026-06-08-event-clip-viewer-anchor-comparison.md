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
