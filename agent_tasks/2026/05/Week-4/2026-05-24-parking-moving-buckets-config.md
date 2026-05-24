# 2026-05-24 Parking Moving Buckets Config

## Summary

Created `boris/parking-moving-buckets-config` from `origin/guy/parking-past30-no-standstill-gear-aug` and updated the parking BC datamodule config to use the materialized PUDO/UNPUDO root that includes moving UnPUDO buckets.

## Changes

- Updated `PUDO_BUCKETS_ROOT` to `parking/dev/2026_05_19_20_07_34_root_parking_pudo_unpudo_unparking_fix_interventions_filter_by_smooth_additional_buckets`.
- Split effective UnPUDO budget into base `0.14` and moving `0.03` under the existing total UnPUDO weight `0.17`.
- Wrapped base UnPUDO buckets under `NestedBucketCfg(name="unpudo", weight=unpudo_weight, ...)`.
- Added `NestedBucketCfg(name="unpudo_moving", weight=unpudo_moving_weight, ...)` with six moving buckets:
  - `pre_ca_unpudo_moving_usa`
  - `ca_short_unpudo_moving_usa`
  - `ca_long_unpudo_moving_usa`
  - `pre_ca_unpudo_moving_uk`
  - `ca_short_unpudo_moving_uk`
  - `ca_long_unpudo_moving_uk`

## Verification

- `git diff --check -- wayve/ai/si/configs/parking/parking_config.py`
- `bazel build //wayve/ai/si:si`

Both completed successfully.
