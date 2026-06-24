# Scarlet Root Jitter Variant

- Branch: `boris/parking-past30-no-standstill-gear-aug/scarlet_full_gear_root_jitter`
- Worktree: `/tmp/scarlet_full_gear_root_jitter`
- Base commit: `ce77a3fe24679b3139327d74eb9a4129ba94bf91`
- Change type: Parking/PUDO training variant preparation

## Changes

- Switched `PUDO_BUCKETS_ROOT` to `abfss://datasets@wayveproddatasetflat.dfs.core.windows.net/sampling_materialised/parking_pudo/default/dev/parking_pudo_default_indicator_start_700_20260623__2026-06-23-19-25`.
- Kept scarlet-style full gear dropout behavior as-is via the existing datamodule gear-direction augmentation.
- Added `ParkingDataConfig.route_shortening_jitter_m`, set to `30.0` for `parking_bc_datamodule_cfg`.
- Plumbed the jitter value through `otf.py` into route-map options when parking route shortening is enabled.
- Added route stop jitter in `wayve/ai/lib/data/pipes/routes.py`; it samples a random +/- metre offset along the decoded route and applies it only for `parking_mode`, not `unparking_mode`.
- Added focused tests for the jitter helper and parking-only gating in `test_generate_route_map.py`.

## Validation

- `git diff --check` passed.
- AST parsing passed for all touched Python files.
- Bazel tests were attempted but blocked before execution by the shared Bazel cache running out of disk while extracting Python wheels (`OSError: [Errno 28] No space left on device`).
