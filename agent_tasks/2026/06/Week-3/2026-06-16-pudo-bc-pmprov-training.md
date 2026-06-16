# 2026-06-16 PUDO BC pmprov training

## Summary

Submitted and monitored a PUDO BC training run from `boris/training/main_cherrypick_generic_data`.

## Run

- Surfboard job: `180668`
- Training nickname: `joyous-yellow-platypus`
- Session: `session_2026_06_16_21_48_57_pmprov`
- W&B: https://wandb.ai/wayve-ai/parking_bc/runs/session_2026_06_16_21_48_57_pmprov
- Branch: `boris/training/main_cherrypick_generic_data`
- Commit: `f4e1c8116d594fbc78762dc1de2ceddcedc5cedf`
- Mode: `parking_bc_train_release_2026_5_21`
- Datamodule: `pudo_bc_datamodule`
- Cluster: `dgx-h100`
- Nodes: 4
- Requested steps: 100000

## Monitoring

- Surfboard moved from queued to running on `aks-prod-training-2-swe.nd96h100c`.
- Startup, distributed init, datamodule setup, first iteration start, and first iteration end completed.
- W&B reported `trainer/global_step=1354`, so the run passed the requested 1K-step monitoring gate.
- No terminal failure or traceback observed during the monitor window.

## Notion

- Created Parking/PUDO model-card row: https://app.notion.com/p/38103da5d69a81bf9b9be05eeb713fc1
- Row model: `joyous-yellow-platypus (not interleaved)`
- Status: `Training`
