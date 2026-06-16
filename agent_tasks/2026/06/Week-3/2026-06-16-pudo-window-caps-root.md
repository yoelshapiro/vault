# 2026-06-16 PUDO Window Caps Root

## Summary

Updated `wayve/ai/si/configs/parking/parking_config.py` to point the Parking/PUDO BC datamodule at the new `parking_pudo_default_window_caps_20260616__2026-06-16-10-23` materialization root.

## Changes

- Changed `PARKING_BC_PUDO_BUCKETS_ROOT` to:
  - `abfss://datasets@wayveproddatasetflat.dfs.core.windows.net/sampling_materialised/parking_pudo/default/dev/parking_pudo_default_window_caps_20260616__2026-06-16-10-23/dataset`
- Updated renamed DC pre-start UnPUDO buckets:
  - `dc_pre_unpudo_usa` -> `dc_pre_start_unpudo_usa`
  - `dc_pre_unpudo_uk` -> `dc_pre_start_unpudo_uk`
- Applied the rename in both train and validation partitions.

## Validation

- Listed the new materialization via Azure CLI and extracted train/validation bucket names.
- Verified every `PARKING_BC_PUDO_BUCKETS_ROOT` bucket referenced in `parking_config.py` exists in the new materialization.
- Ran `git diff --check -- wayve/ai/si/configs/parking/parking_config.py`.
- Checked for a targeted Bazel test under `//wayve/ai/si/configs/parking/...`; none exists.
