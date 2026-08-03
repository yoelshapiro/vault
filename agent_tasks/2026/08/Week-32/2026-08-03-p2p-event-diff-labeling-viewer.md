# P2P Event Diff Labeling Viewer

## Summary

Extended the parking event clip viewer's `P2P Events Diffs` mode into a
dedicated original-versus-odometry labeling workflow on branch
`yoel/label_events_diff`.

## Changes

- Added a resizable source panel and persisted P2P-specific source and clip
  defaults.
- Added `prod_user.p2p.events_w_gear_corrections_22k` as the default Original
  table.
- Exposed the shared-player timestamp threshold in the left panel.
- Re-evaluate that threshold from the current left-panel field whenever a clip
  loads, so navigation immediately uses the latest shared/split choice.
- Make a shared video span the full content width to match telemetry while
  preserving the side-by-side layout for split clips.
- Kept one source-colored legend above the clip grid and one map for both event
  locations.
- Added suffix-based result tables under
  `prod_annotations.registry.parking_labels_`, with validation, lookup, and
  idempotent merge APIs.
- Added the fixed P2P label values `orig`, `odo`, and `undecided`, keyed by run,
  original timestamp, odometry timestamp, and normalized event type.
- Added task-wide labeled-row counts for all five supported event types at the
  bottom of the right panel. Counts are scoped to the selected result-table
  suffix and refresh after table validation and successful label writes.
- Replaced screen-positioned map overlays with Leaflet geographic markers so
  the green and purple locations track pan and zoom correctly.
- Clear the previous clip's Leaflet map immediately on navigation and show a
  gray loading placeholder until enrichment for the current clip arrives;
  stale enrichment responses remain ignored.
- Restored timestamp-highlight frames in both P2P layouts: original events use
  green and modified events use purple for the same ±0.75-second point-event
  window as the standard viewer. The frame is an absolute overlay, so it does
  not change video layout, object-fit, or zoom.

## Verification

- `//wayve/ai/parking/tools/event_clip_viewer:static_checks`
- `//wayve/ai/parking/tools/event_clip_viewer:py_checks`
- Live viewer served on port `3001` with Leaflet assets and the updated P2P
  configuration.

## Labelable event-type decision

The result table intentionally supports exactly these five stored event types:

- `park_out_anchor`
- `park_out_stop`
- `p2p_nav_start`
- `park_in_start`
- `park_in_stop`

`park_out_start` is a special case introduced after Jack's original P2P
workflow. It may remain available for viewing and comparison, but it must not
be labelable or written to the P2P result table unless this decision is
explicitly revisited. If `park_out_start` appears during label lookup, skip it
without treating the event data as invalid; continue to reject any attempt to
write a label for it.

The earlier stored name `anchor_park_out` was corrected to
`park_out_anchor`. On 2026-08-03, all 19 existing affected rows in
`prod_annotations.registry.parking_labels_P2P_Odometry` were migrated; a
follow-up query confirmed that no `anchor_park_out` rows remained.

## Git

- Worktree: `/tmp/WayveCode-yoel-label_events_diff`
- Branch: `yoel/label_events_diff`
- Main workflow commit: `d478a81dc555`
- Map marker fix: `cb9bc55ad7c0`
- Per-clip layout and threshold fix: `a5b98adf47b9`
- Per-event-type task counts: `4124da2517da`
- Stale-map loading state: `639d8a4dc517`
- Timestamp highlight frames: `504663847048`
- Corrected `park_out_anchor` label schema: `53dc4cdb03d3`
- Remote: `origin/yoel/label_events_diff`
