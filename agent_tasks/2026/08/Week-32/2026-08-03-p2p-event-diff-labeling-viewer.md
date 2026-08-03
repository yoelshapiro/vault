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
- Replaced screen-positioned map overlays with Leaflet geographic markers so
  the green and purple locations track pan and zoom correctly.

## Verification

- `//wayve/ai/parking/tools/event_clip_viewer:static_checks`
- `//wayve/ai/parking/tools/event_clip_viewer:py_checks`
- Live viewer served on port `3001` with Leaflet assets and the updated P2P
  configuration.

## Git

- Worktree: `/tmp/WayveCode-yoel-label_events_diff`
- Branch: `yoel/label_events_diff`
- Main workflow commit: `d478a81dc555`
- Map marker fix: `cb9bc55ad7c0`
- Per-clip layout and threshold fix: `a5b98adf47b9`
- Remote: `origin/yoel/label_events_diff`
