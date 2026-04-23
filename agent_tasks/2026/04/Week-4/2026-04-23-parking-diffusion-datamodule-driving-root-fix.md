# Parking Diffusion Datamodule Driving Root Fix

- Date: 2026-04-23
- Branch: `boris/training/kangaroo_with_50_and_route_shorten`
- PR: none

## Summary
Fixed the newly added `parking_diffusion_datamodule_cfg` so its driving data no longer depends on the baseline `materialisation_version` path that was missing in training.

## Root Cause
The datamodule mixed:
- explicit parking GC buckets rooted at `PARKING_GC_ROOT_26_04_15`
- driving buckets imported from `baseline_bc_datamodule.train_partitions`
- `materialisation_version="bc/split_alpha2_alpha3/release/0.0.17"`

At runtime, the driving buckets resolved into:
- `abfss://datasets@wayveproddatasetflat.../sampling_materialised/bc/split_alpha2_alpha3/release/0.0.17/...`

Those parquet files were not present for the training job, causing the dataloader prefetch thread to fail.

## Changes
- extracted the branch's known-good driving train buckets into `PARKING_BRANCH_DRIVING_TRAIN_PARTITIONS`
- extracted the branch's known-good driving validation buckets into `PARKING_BRANCH_DRIVING_VAL_PARTITIONS`
- updated `parking_bc_datamodule_cfg` to reuse those shared driving partition constants
- updated `parking_diffusion_datamodule_cfg` to use the shared driving partitions instead of `baseline_bc_datamodule`
- removed `materialisation_version` from `parking_diffusion_datamodule_cfg`
- removed the no-longer-needed `baseline_bc_datamodule` import

## Validation
- `python -m py_compile wayve/ai/si/configs/parking/parking_config.py`
- attempted direct Python import sanity check, but local shell lacked `hydra_zen`; compile validation still passed

## Files
- `/workspace/WayveCode/wayve/ai/si/configs/parking/parking_config.py`
