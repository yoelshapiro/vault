# 2026-02-24 — End-of-route polyline shortening investigation

## Summary
- Created and activated project page [[projects/parking-end-of-route-polyline-shortening-augmentation]].
- Traced current-branch parking -> OTF -> map rendering wiring to locate where route geometry is still available.
- Compared with `boris/stopping_mode` route-shortening implementation to identify reusable pieces.
- Defined a no-code implementation plan for clipping route polylines at stop point (instead of map blackout).

## Code Read Findings
- `wayve/ai/zoo/data/parking.py` currently sets only `parking_mode`; it does not persist stop-route metadata.
- `wayve/ai/si/datamodules/otf.py` applies map blackout after `insert_map_data`, which is too late for geometric clipping.
- `wayve/ai/zoo/data/driving.py` calls `dp.fetch_route_map(...)`; this is the pre-rasterization integration point.
- `wayve/ai/lib/data/pipes/routes.py` decodes `F.ROUTE_POLYLINE` and renders map with `generate_route_map_from_config(...)`; clipping should happen here.
- Route representation is a single polyline + route-location index/fraction, not multiple route polylines.

## Reuse From `boris/stopping_mode`
- Add parking metadata keys:
  - `PARKING_STOP_ROUTE_INDEX`
  - `PARKING_STOP_ROUTE_FRACTION`
  - (optional fallback) `PARKING_ENTRY_DISTANCE_M`
- Add route-map fetcher flag:
  - `enable_route_shortening_for_parking`
- Clip route and aligned speed-limit arrays before rendering.

## Proposed Implementation Direction
1. In parking augmentation, compute stop point from existing lookahead window and write stop route index/fraction into `data`.
2. Pass shortening flag through OTF `route_map_options` to `insert_map_data -> fetch_route_map`.
3. In `RouteMapFetcher._fetch_route_map`, when stop metadata is valid and ahead of current route position:
   - compute stop distance on polyline
   - truncate points after stop
   - interpolate stop point on the segment
   - truncate speed limits consistently
4. Keep `MAP_SPEED_LIMITS` gather unchanged (do not blackout).

## Working Context
- Current branch: `boris/train/pudo_15_02_26`
- References: `boris/stopping_mode`, `boris/train/parking_pudo_interleaving_w_radar`

## Next Steps
1. Implement minimal port in `parking.py`, `keys.py`, `routes.py`, and OTF wiring.
2. Add focused tests for polyline clipping edge cases and speed-limit alignment.
3. Remove/disable blackout path for this configuration.
