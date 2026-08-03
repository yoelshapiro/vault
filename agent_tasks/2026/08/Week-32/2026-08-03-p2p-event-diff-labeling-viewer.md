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
- Added separate original and modified model-input route viewers beside the
  event-location map. They load the latest route state at each timestamp from
  `prod_data_pipeline.inferred__state.route_events`, combine it with that
  timestamp's pose, and render the production `si_medium` route-map raster:
  black background, blue streets, green near route, and red far route. The
  raster is 512x512 with the model preset's 50 m behind / 2 km ahead route
  window. At medium widths the event-location map moves above the two
  side-by-side rasters; on narrow screens all three panels stack.
- Added a `Show routes` switch above the route pair. Its state is retained
  across clip navigation and hides or restores both route rasters together.
- Replaced the latitude/longitude text above the event-location map with a
  persisted `Show map` switch. Re-enabling it invalidates and refits Leaflet so
  both source markers remain correctly positioned.
- Added an Event-info-style disclosure control for the P2P telemetry panel.
  Its state is persisted; while collapsed, standard signal requests are
  aborted and P2P enrichment is sent without telemetry windows, avoiding both
  telemetry-loading paths until the panel is expanded again.

## Verification

- `//wayve/ai/parking/tools/event_clip_viewer:static_checks`
- `//wayve/ai/parking/tools/event_clip_viewer:py_checks`
- Live viewer served on port `3001` with Leaflet assets and the updated P2P
  configuration.
- Live route-enrichment smoke test returned independent original and modified
  512x512 `si_medium` PNG rasters. Pixel inspection confirmed the blue street
  layer and green route overlay for the tested `park_in_start` pair. The native
  mapper requires decoded lakehouse `(lat, lon)` points to be reordered to
  `(lon, lat)`; otherwise the route is silently rendered off-canvas.
- A long synthetic route through the native mapper confirmed that the same
  raster can contain all expected layers: 574 red far-route pixels, 302 green
  near-route pixels, and 14,844 blue street pixels. Short parking routes may
  correctly contain green but no red when less than 350 m remains. The unit
  test locks the 50 m behind / 2 km ahead window, route colors, coordinate
  ordering, and lossless red/green PNG encoding.

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

Follow-up diagnosis found that the one-retry error policy can produce false
"media unavailable" results for `front_forward`: the browser may receive a
temporary media error while a cold cut is being generated, and the 900 ms
retry is too early. One affected 49.75-second front-camera cut was verified
immediately afterward as a healthy 13.1 MB MP4 (HTTP 206 in about 0.33 seconds).
Treat this message as transient unless a later direct check also fails; use a
longer/backoff retry policy before declaring a camera unavailable.

## Missing speed-line diagnosis

The telemetry API unions corpus samples with raw-gear-only samples. The old
speed SVG renderer treated every null speed on a gear-only row as a break in
the line instead of ignoring that unrelated row. In one affected clip, the
response contained 996 valid speed samples (0.0--30.06 km/h) and 2,487
gear-only rows, but zero consecutive speed rows in the combined stream. The
renderer therefore emitted isolated SVG move commands with no visible line
segments. This is not primarily a y-axis-range issue; the speed line should be
built from non-null speed samples independently of the gear rows.

The plotted AV-active, indicator, and gear step traces do not have the same
breakage: their renderer skips null rows while retaining the previous point.
The shared playhead readout does have a related bug, because it selects one
nearest row for every signal. When that row was gear-only, speed, AV, and
indicator could show `-` despite nearby valid corpus samples (and the converse
could affect gear).

Commit `9b38b67fd0ed` resolved both problems. Each chart now builds from its own
sorted non-null samples. Speed is linearly connected/interpolated and held at
the clip edges; step and categorical signals use last-value hold. Playhead
readouts interpolate or hold per signal and avoid redundant DOM writes, so
mixed null rows no longer make values alternate between numbers and blanks.

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

## Coverage verification

Commit `3c5ed32f3568` added request-level tests for validation and unexpected
backend failures across the P2P label-table check, lookup, counts, and sync
endpoints. The viewer suite passes with 153 tests, and targeted coverage of
`app.py` is 93%; all P2P labeling endpoint branches are covered.

The repository coverage config excludes `/tmp/**/*`, so coverage runs from the
feature worktree need `--cov-config=/dev/null` (or a non-`/tmp` checkout) for a
meaningful targeted report. The repository-wide local patch-coverage helper
also queried unrelated Bazel targets and was blocked locally by missing
Artifactory/ACR credentials; this did not affect the scoped viewer tests.

The map-and-route row now reallocates width when exactly one viewer type is
disabled: routes expand when the location map is hidden, and the map expands
when routes are hidden. The collapsed side retains a narrow toggle gutter. If
both are disabled, the normal two-column partition is retained so both
controls remain visible. This behavior is covered by the served-asset layout
contract test in commit `b1296cb3b54d`.

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
- P2P route viewer: `9f14f9b1b394`
- Split P2P route viewers: `648e7e159721`
- P2P route visibility control: `860d0996f221`
- P2P model-input route rasters: `8360ed1ddf0e`
- Uncropped square route-raster layout: `341db3ecc23d`
- P2P map visibility control: `019fa899549f`
- Aligned map and route graphic canvases: `d3fe1505df8a`
- Collapsible location-map column: `d8873aa8550c`
- Collapsible telemetry with request gating: `892bed7fcc15`
- Stable per-signal telemetry interpolation: `9b38b67fd0ed`
- P2P route-raster contract test: `d17a588d278c`
- P2P label endpoint failure coverage: `3c5ed32f3568`
- Responsive map/route visibility layout: `b1296cb3b54d`
- Remote: `origin/yoel/label_events_diff`
