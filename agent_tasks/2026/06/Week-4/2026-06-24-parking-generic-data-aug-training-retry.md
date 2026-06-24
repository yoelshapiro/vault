# 2026-06-24 Parking Generic Data Aug Training Retry

## Context

- Branch/worktree: `/tmp/main_cherrypick_generic_data_aug_fixes`
- Branch: `boris/parking-past30-no-standstill-gear-aug/main_cherrypick_generic_data_aug_fixes`
- Commit: `73882d43f09e6bd5b4992bbd5afa6d1a5f926253`
- Image: `wayvetraining.azurecr.io/scaled-intelligence:73882d43f09e6bd5b4992bbd5afa6d1a5f926253`
- Goal: monitor the retry until it reaches 1000 training steps without failing. If it fails, diagnose, patch the smallest fix in this worktree, test, commit, push, publish a new image, and resubmit up to 3 retry attempts.

## Run Ledger

| Attempt | Job | Nickname | Session | Failure | Fix | Status |
| --- | --- | --- | --- | --- | --- | --- |
| Current | `184174` | `chocolate-snowy-owl-astonishing` | `session_2026_06_24_20_03_22_g50lr5k2` | n/a | n/a | Running; Surfboard and W&B active, W&B `trainer/global_step=0` at 2026-06-24 20:10 UTC. |

## Notes

- Submit command used P1, `dgx-h100`, 4 nodes, `+mode=parking_bc_train_release_2026_5_11`, `+datamodule=parking_bc_datamodule`, `num_steps=100000`, `num_gpus=32`, `session_tag=g50lr5k2`.
- Initial log tail shows data loading/training activity with missing frame metadata and insufficient-frame warnings, but no terminal failure yet.
