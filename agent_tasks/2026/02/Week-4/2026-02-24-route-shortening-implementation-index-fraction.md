# 2026-02-24 — Route shortening implementation (index/fraction)

## Summary
- Implemented deterministic end-of-route shortening using stop route `index+fraction` (no jitter, no fallback heuristic).
- Replaced parking config default from blackout to route shortening flag in `route_map_options`.
- Added OTF wiring to compute stop route position before map rasterization and pass shortening flag to route-map fetcher.

## Code Changes
- `wayve/ai/zoo/data/parking.py`
  - Added `_compute_parking_mode_and_entry_index`.
  - Added `insert_parking_stop_route_position` to derive stop route index/fraction from lookahead entry timestamp.
- `wayve/ai/zoo/data/keys.py`
  - Added `PARKING_STOP_ROUTE_INDEX`, `PARKING_STOP_ROUTE_FRACTION`.
- `wayve/ai/si/datamodules/otf.py`
  - Added route-shortening wiring:
    - reads `enable_route_shortening_for_parking` from `route_map_options`
    - computes stop route position pre-map
    - disables blackout hook when shortening is enabled
- `wayve/ai/lib/data/pipes/routes.py`
  - Added `enable_route_shortening_for_parking` option to `RouteMapFetcher`.
  - Added `_shorten_route_polyline_to_stop` and applied it during route map generation.
- `wayve/ai/si/configs/parking/parking_config.py`
  - Switched to `route_map_options={"enable_route_shortening_for_parking": True}`
  - Set `enable_end_of_route_blackout=False`.

## Tests
- Passed:
  - `bazel test //wayve/ai/zoo/data:py_test --test_arg=-k --test_arg='parking_stop_route_position or compute_parking_mode_and_entry_index'`
- Verified selected OTF tests pass (inside target log):
  - `test_make_driving_datapipe_end_of_route_blackout_hook`
  - `test_make_driving_datapipe_route_shortening_hook`
- Blocked:
  - `//wayve/ai/lib:test_data_lib_py_test` fetch failed due private ACR auth (`azure-storage/azurite` 401), so route helper test target could not be executed in this environment.

## Notes
- Intentionally avoided fallback logic (`parking_entry_distance_m`) and random pullback/jitter.
- Clipping is deterministic and only activates when stop `index+fraction` is present and ahead of current route position.
