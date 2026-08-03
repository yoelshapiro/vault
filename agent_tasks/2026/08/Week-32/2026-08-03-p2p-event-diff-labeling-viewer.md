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
  suffix and refresh after table validation and successful label writes. The
  section's top edge is draggable, and its height is persisted in the browser.
- Replaced screen-positioned map overlays with Leaflet geographic markers so
  the green and purple locations track pan and zoom correctly.
- Clear the previous clip's Leaflet map immediately on navigation and show a
  gray loading placeholder until enrichment for the current clip arrives;
  stale enrichment responses remain ignored.
- Restored timestamp-highlight frames in both P2P layouts: original events use
  green and modified events use purple for the same ±0.75-second point-event
  window as the standard viewer. The frame is an absolute overlay, so it does
  not change video layout, object-fit, or zoom.
- Abort superseded telemetry requests in every viewer mode and the combined
  P2P enrichment request when navigating to another clip. Removed video
  elements also release their source to stop stale media downloads.
- Added camera-specific media error displays after one retry. P2P cameras now
  warm serially, while eager loading and prefetch behavior in other modes is
  unchanged.

## Verification

- `//wayve/ai/parking/tools/event_clip_viewer:static_checks`
- `//wayve/ai/parking/tools/event_clip_viewer:py_checks`
- Live viewer served on port `3001` with Leaflet assets and the updated P2P
  configuration.

## Clip-loading diagnosis

On 2026-08-03, a slow current shared clip was traced to a combination of
media-generation latency and two viewer lifecycle issues:

- The shared window was about 42.4 seconds because it covered both event
  timestamps plus padding. Exact media-handler range requests for cold camera
  cuts took about 29.6 and 30.4 seconds to return their first byte; warmed cuts
  returned in about 0.33 seconds.
- The `back_backward` cut returned HTTP 404. The viewer only clears its loading
  state on `canplay` and has no video `error` handler, so an unavailable camera
  appears to load forever.
- Clip navigation invalidates stale enrichment responses in the browser but
  does not cancel their requests. Live logs showed overlapping enrichment SQL
  requests continuing for roughly 30--80 seconds, adding avoidable contention.

Video elements are created before enrichment starts, so enrichment is not a
direct prerequisite for playback. Commit `3bbdf46a0f71` implemented the
recommended viewer-side follow-up: camera errors are surfaced, superseded
browser requests and media sources are aborted, and P2P camera cuts are queued
instead of being started concurrently. A Databricks query already executing
server-side may still run to completion after its HTTP client disconnects.

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

The labeling-table country-code column is `iso_country_code`. On 2026-08-03,
the active `P2P_Odometry` Delta table enabled name-based column mapping and
renamed the erroneous `country_iso_code` column in place. All 31 rows were
preserved. The 31 initially null values were then backfilled by joining
`run_id` to `prod_user.p2p.events_w_gear_corrections_22k`. Every run resolved
to exactly one non-null country code; verification found zero nulls and zero
mismatches afterward.

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
- Corrected `iso_country_code` label schema: `ec91438a8bbb`
- Clip loading lifecycle and resizable counts: `3bbdf46a0f71`
- Remote: `origin/yoel/label_events_diff`
