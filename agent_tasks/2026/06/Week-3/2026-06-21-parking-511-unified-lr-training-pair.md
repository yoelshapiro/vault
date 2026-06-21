# 2026-06-21 Parking 5.11 Unified-LR Training Pair

## Summary

Submitted two Parking/PUDO BC training variants from `boris/training/main_cherrypick_generic_data` using `parking_bc_train_release_2026_5_11`, P1 priority, 4 H100 nodes, and 100K steps:

- `salmon-multicolored-tapir` / job `182491` / `session_2026_06_21_21_45_05_y511lr2`
  - Commit: `ce77a3fe24679b3139327d74eb9a4129ba94bf91`
  - Variant: unified LR across WFM-loaded layers and output adaptor, 50% driving / 50% PUDO-UNPUDO mix.
  - Monitoring: reached step `2700/100000` after passing the 1K gate.
- `red-cheetah-nonchalant` / job `182493` / `session_2026_06_21_21_51_40_y511nodrv2`
  - Commit: `ad0508aa1cabc0b99494695052d2f08b16f342b0`
  - Variant: unified LR across WFM-loaded layers and output adaptor, 0% driving / 100% PUDO-UNPUDO mix.
  - Monitoring: reached step `1300/100000` after passing the 1K gate.

## Changes

- Set `parking_bc_release_2026_5_11_cfg.output_adaptor_lr=None` so the output adaptor no longer gets a separate LR group.
- Pointed the 5.11 training mode at the current new-driving parking datamodule.
- Added the tele camera to the 5.11 mode camera tuple after the first submissions failed on `copy_tele_camera=True` without `front-forward-tele`.
- Added the 0% driving variant by setting driving weight to `0.0` and scaling the PUDO/UNPUDO buckets to sum to `1.0`.

## Notion

Created Parking/PUDO model-card rows:

- `salmon-multicolored-tapir (not interleaved)`
- `red-cheetah-nonchalant (not interleaved)`

Both rows use status `Training`, owner Boris, branch `boris/training/main_cherrypick_generic_data`, and short descriptions that describe the model setup rather than run status.
