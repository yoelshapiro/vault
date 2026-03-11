# 2026-03-11 — Route-shortening-only port onto fresh main branch

## Context
- User request: create a new branch from latest `main` and port only the route-shortening logic from commit `fc4d866506e851487bde7c0e7d11b76846db8eec`.
- New branch: `03-11-park-route-shortening-augmentation` (from `origin/main`).
- Scope explicitly excluded blackout/deployment wrapper behavior.

## What changed
- Added route-shortening map support in OTF:
  - `wayve/ai/si/datamodules/otf.py`
  - new flag wiring: `enable_route_shortening_for_parking`
  - parking hook now stores entry index and computes stop route index/fraction before map fetch.
- Added parking stop route metadata keys:
  - `wayve/ai/zoo/data/keys.py`
  - `PARKING_STOP_ROUTE_INDEX`, `PARKING_STOP_ROUTE_FRACTION`.
- Ported parking-side stop position extraction:
  - `wayve/ai/zoo/data/parking.py`
  - `_compute_parking_mode_and_entry_index`
  - `store_entry_index` in `insert_parking_data`
  - `insert_parking_stop_route_position` for route stop index/fraction.
- Route polyline shortening logic retained from source commit:
  - `wayve/ai/lib/data/pipes/routes.py`
  - deterministic clipping/interpolation in `_shorten_route_polyline_to_stop`.
- Added/updated tests:
  - `wayve/ai/lib/test/data/pipes/test_generate_route_map.py`
  - `wayve/ai/zoo/data/test/test_parking.py`
  - `wayve/ai/si/datamodules/test/test_otf.py`

## Validation
- `bazel build //wayve/ai/lib:lib //wayve/ai/zoo/data:parking //wayve/ai/si/datamodules:otf` ✅
- `bazel test //wayve/ai/zoo/data:test_zoo_data_py_test --test_arg=-k --test_arg='parking_stop_route_position or compute_parking_mode_and_entry_index'` ✅
- `bazel test //wayve/ai/si/datamodules:py_test --test_arg=-k --test_arg=route_shortening_hook`
  - test passed, but target failed due coverage threshold (expected with single-test filter).
- `bazel test //wayve/ai/lib:test_data_lib_py_test --test_arg=-k --test_arg='shorten_route_polyline_to_stop'`
  - blocked by external registry auth (`wayve.azurecr.io` 401 for azurite image fetch).

## Notes
- No commits were made.
- Working tree contains unrelated untracked items that pre-existed (`.ai/skills/obs-flyte-execution/`, `.claude/plugins/`, `wayve/ai/parking/test.ipynb`, `wayve/ai/si/configs/parking/`).
