# Route shortening robustness update (uncommitted)

## Scope
Branch: `boris/03-23-park-route-shortening-v2`

## Requested updates
- Add jitter to route-shortening stop point (default 20m)
- Add probability to apply route shortening (default 90%)
- Add docstrings to methods introduced by the route-shortening PR
- Update PR summary

## Code changes (local, not committed)
- `wayve/ai/lib/data/pipes/routes.py`
  - Added `route_shortening_stop_jitter_m` (default 20.0)
  - Added `route_shortening_apply_probability` (default 0.9)
  - Updated `_shorten_route_polyline_to_stop` to support `stop_distance_jitter_m`
  - Added input validation and route-shortening docs in `RouteMapFetcher`
- `wayve/ai/si/datamodules/otf.py`
  - Wired both new parameters through OTF datamodule -> route map options
  - Added docs for new datapipe args
- `wayve/ai/lib/test/data/pipes/test_generate_route_map.py`
  - Updated helper-call signature
  - Added jitter behavior test
- `wayve/ai/zoo/data/parking.py`
  - Expanded docstrings for newly added route-shortening support helpers

## PR summary update
- Updated PR description for #102690 to describe jitter/probability defaults and added docstrings.

## Validation
- Attempted targeted Bazel tests, but blocked by ACR auth (`401 Unauthorized` fetching `azure-storage/azurite`).
