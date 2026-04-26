# Parking BC New Driving Data

- Date: 2026-04-26
- Branch: `boris/training/kangaroo_with_50_and_route_shorten`
- Change type: training config
- Area: `wayve/ai/si/configs/parking/parking_config.py`

## Summary

Updated `parking_bc_datamodule_cfg` to keep the `fiery-aardvark-copper` parking/PUDO datamodule behavior while swapping the driving data to the newer split-alpha2/alpha3 driving partitions used by `parking_diffusion_datamodule_cfg`.

## Details

- Replaced the old flat driving buckets rooted at `DRIVING_ROOT` with `PARKING_BC_DRIVING_TRAIN_PARTITIONS`.
- `PARKING_BC_DRIVING_TRAIN_PARTITIONS` reuses `PARKING_DIFFUSION_DRIVING_TRAIN_PARTITIONS` and normalizes its total weight to `0.50`.
- Replaced the old driving validation buckets with `PARKING_DIFFUSION_DRIVING_VAL_PARTITIONS`.
- Left the PUDO, UNPUDO, and UNPARK bucket weights and roots unchanged from the fiery training recipe.
- Left the parking behavior config unchanged:
  - `reconstruct_gear_from_speed=True`
  - `enable_route_shortening_for_parking=True`
  - `allow_short_path=True`
  - `enable_early_path_gating=True`
  - `enable_strip_leading_standstill=True`
  - `enable_augment_standstill_gear=True`
  - `parked_unparking_prob=0.5`
  - `unparking_gear_augment_prob=1.0`

## Validation

- `python -m py_compile wayve/ai/si/configs/parking/parking_config.py`
- `bazel build //wayve/ai/si:train --nobuild`
- Source-level weight check:
  - new driving base sum: `1.0442`
  - normalized BC driving sum: `0.5`
  - old `DRIVING_ROOT` buckets removed from `parking_bc_datamodule_cfg` train/validation partitions
