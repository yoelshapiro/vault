# Parking BC New Driving Data

- Date: 2026-04-26
- Branch: `boris/training/kangaroo_with_50_and_route_shorten`
- Change type: training config
- Area: `wayve/ai/si/configs/parking/parking_config.py`

## Summary

Added a new `parking_bc_new_driving_datamodule` option. The existing `parking_bc_datamodule` remains the `fiery-aardvark-copper` data mix, while the new datamodule keeps the same parking/PUDO behavior and swaps only the driving data to the newer split-alpha2/alpha3 partitions used by `parking_diffusion_datamodule_cfg`.

## Details

- Kept `parking_bc_datamodule_cfg` unchanged as the baseline fiery recipe.
- Added `parking_bc_new_driving_datamodule_cfg` derived from `parking_bc_datamodule_cfg`.
- Replaced the old flat driving buckets rooted at `DRIVING_ROOT` only in the new datamodule.
- `PARKING_BC_DRIVING_TRAIN_PARTITIONS` reuses `PARKING_DIFFUSION_DRIVING_TRAIN_PARTITIONS` and normalizes its total weight to `0.50`.
- The new datamodule uses `PARKING_DIFFUSION_DRIVING_VAL_PARTITIONS` for driving validation.
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
  - `parking_bc_datamodule_cfg` still uses `DRIVING_ROOT`
  - `parking_bc_new_driving_datamodule_cfg` uses `PARKING_BC_DRIVING_TRAIN_PARTITIONS` and `PARKING_DIFFUSION_DRIVING_VAL_PARTITIONS`

## Commit and Training

- Committed and pushed `feat(parking): add BC new-driving datamodule`.
- Commit: `7ec9c60b950e71331d395c7f221e9a25c6cfc702`
- Training command:
  - `bazel run //wayve/ai/si/cli:cli -- --project Parking -ex parking_bc -st bc_new_driving_100k --platform AKS -nn 4 --cluster dgx-h100 --no-verify +mode=parking_bc_train_release_2026_5_11 +datamodule=parking_bc_new_driving_datamodule num_steps=100000 --priority P1`
- Surfboard job: `154721`
- Job name: `precious-peach-panda-154721`
- Nickname: `precious-peach-panda`
- Session: `session_2026_04_26_11_58_12_si_parking_bc_train_release_2026_5_11_bc_new_driving_100k`
- State observed: `Running`
- Start time: `2026-04-26 12:01 UTC`
- W&B: `https://wandb.ai/wayve-ai/parking_bc/runs/session_2026_04_26_11_58_12_si_parking_bc_train_release_2026_5_11_bc_new_driving_100k`
- Datadog logs: `https://app.datadoghq.eu/logs?query=job_name%3Aprecious-peach-panda-154721&from_ts=1775995349367&cols=job_name%2Cnode_rank&live=true`
- Notion release row: `https://www.notion.so/34e03da5d69a8175bc92ea01f820b630`
