# 2026-07-12 Signals PR Comments

- Branch: `boris/pudo_generic_materialization`
- PR: `#117075`
- Area: `wayve/ai/services/sampling/datasets/parking_pudo/signals.py`
- Change type: Code cleanup, behavior fix, tests

## Summary

Addressed active review comments in Parking/PUDO `signals.py` and related call sites:

- Renamed `run_has_parking_pudo_trip_events` to `run_has_trip_events` and updated filters/event metadata imports.
- Added start-of-run gear smoothing behavior: short initial gear segments now use the next stable segment value.
- Kept exact-threshold gear segments stable with a tiny duration comparison tolerance.
- Moved parking-window lookback into `ParkingPudoBucketConfig` as `park_window_before_sec` and threaded it through parking and PUDO bucket definitions.
- Added a public filter regression covering short initial gear smoothing.
- Updated affected synthetic fixtures so their initial approach segment survives the default 2s gear smoothing threshold.

## Verification

- `python -m py_compile ...`
- `tools/ruff check --config build_support/python/ruff.toml ...`
- `tools/ruff format --check --config build_support/python/ruff.toml ...`
- `bazel test //wayve/ai/services/sampling:test_datasets`
