# 2026-06-28 Teal Zak Warmup Zero Init Training Monitor

## Summary

Monitored Parking/PUDO training job `185913` for the Teal Zak-style warmup / near-zero adaptor init variant, diagnosed its pre-training failure, retried with the corrected Hydra datamodule override, and updated the Parking/PUDO Notion model card after the retry passed the 1K-step gate.

## Details

- Branch: `boris/parking-past30-no-standstill-gear-aug/teal_zak_warmup_zero_init`
- Worktree: `/workspace/.codex-borisindelman/worktrees/teal_zak_warmup_zero_init`
- Commit: `1a2f2a070ac7f7a6aa3555cc6179bd7608cca4ad`
- Purpose: Zak-style warmup / near-zero gear + park-mode input adaptor init, 50% gear token dropout.

## Run Ledger

- `185913` / `mandrill-smooth-tomato` / `session_2026_06_28_21_29_00_zkwrm50p1`: failed before W&B initialized and before training steps. Failure signal from `wayvecli job logs 185913 --tail=300`: `AttributeError: 'str' object has no attribute 'log_datapipe_stat_interval'` at `wayve/ai/si/training/train.py:325`. The submit command used `datamodule=parking_bc_datamodule`, which left `datamodule` as a string.
- `185915` / `substantial-teal-cobra` / `session_2026_06_28_21_37_03_zkwrm50p1`: retry using `+datamodule=parking_bc_datamodule` with the same commit/image/branch. Passed the early health gate with W&B `trainer/global_step=1078` at 2026-06-28 21:56 UTC while Surfboard still reported `Running`.

## External Updates

- Slack: sent Boris a failure update for `185913` and a retry-submitted update for `185915`.
- Notion: created Parking/PUDO model-card row `substantial-teal-cobra (not interleaved)` with status `Training`, date `2026-06-28`, short description "Teal baseline with Zak-style delayed WFM LR warmup, near-zero gear/park-mode input adaptor init, and 50% gear token dropout.", and a page-body run-history note.

