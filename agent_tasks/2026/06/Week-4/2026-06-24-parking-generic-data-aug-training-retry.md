# 2026-06-24 Parking Generic Data Aug Training Retry

## Context

- Branch/worktree: `/tmp/main_cherrypick_generic_data_aug_fixes`
- Branch: `boris/parking-past30-no-standstill-gear-aug/main_cherrypick_generic_data_aug_fixes`
- Initial commit: `73882d43f09e6bd5b4992bbd5afa6d1a5f926253`
- Fixed commit: `7d3b356add696f8499d71bf0e6f6221229393bf9`
- Initial image: `wayvetraining.azurecr.io/scaled-intelligence:73882d43f09e6bd5b4992bbd5afa6d1a5f926253`
- Fixed image: `wayvetraining.azurecr.io/scaled-intelligence:7d3b356add696f8499d71bf0e6f6221229393bf9`
- Goal: monitor the retry until it reaches 1000 training steps without failing. If it fails, diagnose, patch the smallest fix in this worktree, test, commit, push, publish a new image, and resubmit up to 3 retry attempts.

## Run Ledger

| Attempt | Job | Nickname | Session | Failure | Fix | Status |
| --- | --- | --- | --- | --- | --- | --- |
| 0 | `184174` | `chocolate-snowy-owl-astonishing` | `session_2026_06_24_20_03_22_g50lr5k2` | Failed at `trainer/global_step=0`; rank 0 hit TorchScript compile error: `base_mask` was inferred as `NoneType` then assigned a Tensor in `BaseModalityAdaptor._dropout`. | n/a | Failed. |
| 1 | `184180` | `aquamarine-quizzical-kingfisher` | `session_2026_06_24_20_21_51_g50lr5k3` | n/a | Added `base_mask: Optional[Tensor] = None` and a scripted `RouteSTAdaptor` regression for missing route inputs; committed `7d3b356add696f8499d71bf0e6f6221229393bf9`, pushed branch, published fixed SI training image. | Passed 1K-step gate: W&B `trainer/global_step=1112`, Surfboard `Running` at 2026-06-24 20:42 UTC. |

## Notes

- Submit command used P1, `dgx-h100`, 4 nodes, `+mode=parking_bc_train_release_2026_5_11`, `+datamodule=parking_bc_datamodule`, `num_steps=100000`, `num_gpus=32`, `session_tag=g50lr5k2`.
- Validation: `bazel test //wayve/ai/zoo/st:test_st` passed in `/tmp/main_cherrypick_generic_data_aug_fixes`.
- Slack notifications sent to Boris after failure/fix/resubmission and after the 1K-step pass.
- Parking/PUDO model-card row created: https://app.notion.com/p/38903da5d69a81258f97f007921ff4c8
