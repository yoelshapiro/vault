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
- Added an in-raster route-color legend driven by actual pixel counts. The
  native model raster does not encode past versus future by color: its window
  starts 50 m behind the projected vehicle pose, green covers the first 350 m
  of that window (approximately 50 m behind plus 300 m ahead), and red covers
  the farther-ahead remainder. If a color is absent, the legend says so. This
  preserves the exact model-input image without implying a false red-past /
  green-future split.
- Route-raster timing is aligned explicitly. The video event marker uses the
  exact selected event timestamp; both the Leaflet marker and raster pose use
  the same nearest navigation sample; the route polyline is the latest route
  plan at or before the event. The raster legend reports the navigation offset
  and route-plan age, since the map pose is normally closer to event/video time
  than an older route plan.
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
- Commit `972f2aa391dd` adds a hermetic native-mapper test using repository map
  tiles and asserts both near-green and far-red overlays for a sufficiently
  long route. A live default `park_in_start` event was 4--6 m from its decoded
  route and produced 39--46 green pixels but no red pixels because less than
  350 m remained; this was expected model behavior, not a coordinate failure.

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

## Telemetry/map/route toggle coupling

The P2P telemetry toggle is currently coupled to the complete enrichment
request. Every enable or disable change aborts the browser request and starts
another request containing navigation, event distance, active-route lookup,
two native 512x512 route-raster renders, and optionally telemetry. Disabling
telemetry removes only the telemetry windows; it still repeats all map and
route work. Browser cancellation does not guarantee cancellation of SQL that
is already running server-side, so rapid toggles can leave overlapping work.

Map and route controls themselves only hide/show existing DOM, but their data
and route rasters are fetched and rendered even when hidden. A robust fix
should split or independently gate telemetry, map, and route enrichment, cache
the non-telemetry result per clip, and avoid rebuilding map/routes when only
telemetry visibility changes.

On 2026-08-04, live server timings confirmed this is the main source of the
visible delay: `/api/p2p_diff/enrichment` took about 59 seconds, from 05:39:49
to 05:40:48. The final Databricks SQL session alone occupied about 26 seconds
immediately before the response. `load_pair_enrichment` runs navigation,
distance, active-route, and telemetry queries sequentially and only then
renders both route rasters; the browser does not render either the map or the
routes until that complete response arrives. Standard `/api/signals` and label
requests also open additional Databricks sessions during clip startup. This
confirms that the delay is dominated by coupled SQL work, especially telemetry,
rather than Leaflet or browser image drawing.

Prioritize splitting and visibility-gating the enrichment paths, caching
immutable per-clip navigation/routes/rasters, and removing duplicate telemetry
work. Add per-stage timing logs before considering connection pooling or
parallel SQL execution, since parallelism may increase warehouse contention.

Implemented and published in commit `fa60f9beba94` on 2026-08-04. Context,
route rasters, and P2P-only gear/prediction tracks now use independent API
requests and immutable per-clip JSON caches. Route requests are not started
while routes are collapsed, telemetry toggles no longer restart map/route
work, simultaneous context consumers are coalesced, and the P2P telemetry SQL
no longer duplicates the speed scan already performed by `/api/signals`.
Per-stage timing logs were added. Live validation on one `park_in_start` pair
measured 9.38 seconds for the first context/map response, 0.1 ms for the cached
repeat, 2.55 seconds for route SQL plus both rasters (109.5 ms raster work), and
17.24 seconds for P2P telemetry, which no longer blocks either viewer.

The map also has a separate, off-by-default `Path` control. Enabling it lazily
loads a cached one-Hz vehicle trajectory from navigation data, spanning the
earliest selected timestamp minus 15 minutes through the latest timestamp plus
15 minutes, limited naturally by available data. The live path query completed
in 3.91 seconds and returned valid coordinates; cached repeats avoid SQL.

On 2026-08-04, the fixed 15-minute path window became an editable extension in
seconds beside the `Path` control. It defaults to 900 seconds, accepts 0--86400,
participates in request validation and the cache key, and changing it reloads
only the optional path overlay. Route raster containment was also hardened:
each image is absolutely centered with a 6 px safety inset, so intrinsic grid
sizing or panel-width changes cannot crop the bottom or another image edge.

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

On 2026-08-04, 169 newer rows across 160 runs were found with null country
codes. Root cause: the event-list SQL projected `iso_country_code` only when a
country filter was active, so ordinary unfiltered labeling sent null. All 169
runs resolved unambiguously against
`prod_user.p2p.events_w_gear_corrections_22k` and were repaired with a
null-only MERGE. Verification found 199/199 labeled rows with valid uppercase
three-letter codes. Commit `16162ade4224` projects country independently of
filtering (including modified-only fallback) and rejects future P2P label
writes when the code is missing.

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

Leaflet must be explicitly notified when collapsing routes expands the map
column; changing only the CSS grid leaves its tile canvas at the old width and
produces a blank area on the right. Commit `385734649796` invalidates the map
size after the route layout settles, without panning or changing zoom/center.
Reopening a hidden map retains the existing bounds-refit behavior.

PR review follow-up added a DOM interaction test for the map/route controls,
including the remaining-viewer layout classes and Leaflet resize notification.
It also prevents label lookup/count responses from crossing P2P output-table
suffix changes, reloads the generic label schema after leaving P2P mode, and
makes browser preference storage best-effort so restricted `localStorage` does
not block viewer startup.

A subsequent bot review found the equivalent race in label writes: an
old-table sync completion could clear a new-table dirty flag. Commit
`722e81402903` guards sync responses by source and suffix and clears a dirty key
only if its submitted label object is still current. A DOM regression test
covers switching suffixes and editing the same pair before the old sync returns.

P2P video sizing is now manual and stable against label-panel resizing. Commit
`0e0eba39239c` adds one shared horizontal width slider for original/modified
viewer blocks, persists its pixel value, and locks camera viewports to 16:9.
The selected size only contracts when the available browser width requires it.

Commit `f08a07e6a993` originally made the modified-only telemetry source
explicit for dual video clips. This was superseded by commit `a88e6c2eb4bc`:
dual P2P clips now show two chart panels side by side, original on the left in
green and modified on the right in purple, each querying and tracking its own
timestamp window. Shared single-viewer clips retain one `Telemetry` panel.

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
- Dual-viewer telemetry source title: `f08a07e6a993`
- Refresh Leaflet after route-column resize: `385734649796`
- Clarify route-raster color visibility: `972f2aa391dd`
- PR review fixes and DOM interaction coverage: `a7cb2e9e5bf2`
- Guard stale label-sync completions: `722e81402903`
- Manual aspect-locked P2P video sizing: `0e0eba39239c`
- Side-by-side original/modified P2P telemetry: `a88e6c2eb4bc`
- Remote: `origin/yoel/label_events_diff`
