# 2026-06-28 Teal March WFM G50 Training Monitor

## Summary

Monitored Parking/PUDO training job `185914` for the March/FEB WFM parking-mode experiment from commit `bd3068a2908a97b2bc7670b5d1cc759ca06f5fda`.

The initial job failed before training because the submitted Hydra override used `datamodule=parking_bc_datamodule`, which resolved as a string. Retried with `+datamodule=parking_bc_datamodule`.

## Runs

- Initial: `185914`, nickname `roadrunner-fortunate-pink`, session `session_2026_06_28_21_30_02_marwfm50p1`
  - Outcome: failed before 1K steps.
  - Signal: `AttributeError: 'str' object has no attribute 'log_datapipe_stat_interval'` in `wayve/ai/si/training/train.py`.
- Retry 1: `185917`, nickname `harlequin-parrot-energetic`, session `session_2026_06_28_21_38_07_marwfm50p2`
  - Fix: changed the override to `+datamodule=parking_bc_datamodule`.
  - Outcome: passed the 1K gate; W&B reported `trainer/train_step=1064` while Surfboard status was `Running`.

## Notion

Created Parking/PUDO model-card row:

- Model: `harlequin-parrot-energetic (not interleaved)`
- Status: `Training`
- Short Description: Teal baseline using parking_bc_train_release_2026_5_21 WFM with 50% gear token dropout.
- Row: https://app.notion.com/p/38d03da5d69a811ab1c9d1889b32e6d1

## Slack

Sent Boris a failure update for `185914` and a retry update for `185917`.
