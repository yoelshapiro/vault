# Parking end-of-route polyline shortening augmentation

## Overview
- **What it is:** Replace end-of-route map blackout augmentation with route polyline shortening so the route ends where the vehicle stops.
- **Why it matters:** Trains and deploys a more realistic end-of-route signal while preserving map context.
- **Primary users:** Parking BC training and deployment teams.

## Status
- **Phase:** Phase 1
- **Status:** active
- **Last updated:** 2026-02-24
- **Current priorities:**
  - Finalize stop-point signal written from parking augmentation.
  - Add route clipping in route-map fetcher before rasterization.
  - Decide whether to use stop lat/lon projection or stop route index/fraction as primary signal.
- **Blockers:**
  - None

## Requirements
- **Problem statement:** Blackout removes all route context; we need route to terminate near stop point instead.
- **Target users:** Model training/inference owners for parking end-of-route behavior.
- **Integrations:** parking.py augmentation, OTF map route wiring, route/polyline generation utilities, deployment parking wrapper.
- **Constraints:** Keep map speed limits intact; preserve current parking mode behavior; avoid regressions in OTF/deployment IO contracts.
- **Success criteria:**
  - Training route map is clipped at stop location for parking timestamps.
  - Deployment behavior aligns with training semantics.
  - Tests cover polyline clipping and route rendering correctness.

## Design
- **Approach:**
  - Capture stop signal at parking augmentation time (currently available lookahead gear/speed; can be extended with stop route position).
  - Route shortening must run in `RouteMapFetcher._fetch_route_map` before `generate_route_map_from_config` (once map image is produced in OTF, polyline geometry is no longer available).
  - Clip route polyline and aligned speed-limits to a computed stop point, then render route map from the clipped polyline.
- **Key decisions:**
  - Route is represented as a single encoded polyline (`F.ROUTE_POLYLINE`) plus current location (`F.ROUTE_POLYLINE_LOCATION_INDEX`, `F.ROUTE_POLYLINE_LOCATION_DIST_TRAVELLED_PCT`), not multiple independent polylines.
  - Preferred robust stop representation is stop route index/fraction (already used in prior `boris/stopping_mode` implementation); fallback can project stop lat/lon onto nearest route segment.
- **Open questions:**
  - Whether to keep deterministic clipping or add bounded jitter near stop.
  - Whether to keep current parking mode active during route-shortened samples (for this project likely yes).

## Build Phases
- **Phase:** Phase 1
  - **Goal:** Confirm data flow and clipping algorithm insertion points.
  - **Work items:**
    - Parking: `insert_parking_data` currently uses additional lookahead gear/speed only; extend to store stop metadata.
    - OTF: `insert_map_data` calls `dp.fetch_route_map(...)`; augment `fetch_route_map` options to enable shortening.
    - Routes: implement clipping in `wayve/ai/lib/data/pipes/routes.py` using current route progress and stop point projection.
  - **Validation:**
    - Unit tests in `wayve/ai/lib/test/data/pipes/test_generate_route_map.py` for clipping behavior.
    - Datamodule tests verifying parking metadata and shortened route map integration.

## Decisions
- **2026-02-24:**
  - **Decision:** Start as a separate project from blackout augmentation.
  - **Rationale:** Keeps scope explicit while reusing prior understanding.
- **2026-02-24:**
  - **Decision:** Perform shortening in route-map fetcher (pre-rasterization), not in post-map OTF transform.
  - **Rationale:** Post-`MAP_ROUTE` stage only has pixels, while clipping requires route polyline geometry.
- **2026-02-24:**
  - **Decision:** Reuse prior stopping-mode pattern (`PARKING_STOP_ROUTE_INDEX/FRACTION`) as baseline.
  - **Rationale:** It aligns with existing route indexing fields and avoids noisy geodesic nearest-segment search.

## Notes
- Investigation summary:
  - `insert_map_data` -> `fetch_route_map` -> decode `F.ROUTE_POLYLINE` -> `generate_route_map_from_config`.
  - Current blackout path in OTF is after map generation and cannot support geometric clipping.
  - Prior `boris/stopping_mode` branch already implemented route shortening logic in `RouteMapFetcher` and parking metadata plumbing; this can be ported/adapted.
