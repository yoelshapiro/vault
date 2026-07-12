# 2026-07-12 Buckets Config PR Comments

- Branch: `boris/pudo_generic_materialization`
- PR: `#117075`
- Areas:
  - `wayve/ai/services/sampling/datasets/parking_pudo/common.py`
  - `wayve/ai/services/sampling/datasets/parking_pudo/parking/buckets.py`
  - `wayve/ai/services/sampling/datasets/parking_pudo/pudo/buckets.py`

## Summary

Addressed review comments asking to converge repeated bucket constants in the Parking/PUDO bucket definitions.

## Changes

- Added a frozen `ParkingPudoBucketConfig` structure in `common.py`.
- Added `PARKING_BUCKET_CONFIG` and `PUDO_BUCKET_CONFIG` instances for shared timing and behavior values.
- Replaced repeated parking bucket literals for park window timing, pre-departure timing, gear-change windows, and CA offsets.
- Replaced repeated PUDO bucket literals for park window timing, pre-departure timing, PUDO hazard window, gear-change windows, CA offsets, and stopped-handover filtering.
- Kept event names and window labels inline because those are readable enum-like filter arguments rather than tuning constants.

## Verification

- `python -m py_compile wayve/ai/services/sampling/datasets/parking_pudo/common.py wayve/ai/services/sampling/datasets/parking_pudo/parking/buckets.py wayve/ai/services/sampling/datasets/parking_pudo/pudo/buckets.py`
- `tools/ruff check --config build_support/python/ruff.toml wayve/ai/services/sampling/datasets/parking_pudo/common.py wayve/ai/services/sampling/datasets/parking_pudo/parking/buckets.py wayve/ai/services/sampling/datasets/parking_pudo/pudo/buckets.py`
- `tools/ruff format --check --config build_support/python/ruff.toml wayve/ai/services/sampling/datasets/parking_pudo/common.py wayve/ai/services/sampling/datasets/parking_pudo/parking/buckets.py wayve/ai/services/sampling/datasets/parking_pudo/pudo/buckets.py`
- `bazel test //wayve/ai/services/sampling:test_datasets`
