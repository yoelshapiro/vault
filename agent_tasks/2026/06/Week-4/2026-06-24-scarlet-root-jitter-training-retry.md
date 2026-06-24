# 2026-06-24 Scarlet Root Jitter Training Retry

## Context

- Branch/worktree: `/tmp/scarlet_full_gear_root_jitter`
- Branch: `boris/parking-past30-no-standstill-gear-aug/scarlet_full_gear_root_jitter`
- Initial commit: `97d124ff546161d63a85707b94e67c9aa5d57292`
- Fixed commit: `ea03fa86fb72ce0f10668bc29a3453d09ee9760e`
- Initial image: `wayvetraining.azurecr.io/scaled-intelligence:97d124ff546161d63a85707b94e67c9aa5d57292`
- Fixed image: `wayvetraining.azurecr.io/scaled-intelligence:ea03fa86fb72ce0f10668bc29a3453d09ee9760e`
- Goal: monitor the Scarlet full-gear root-jitter Parking/PUDO run until it reaches 1000 training steps without failing. If it fails, diagnose, patch the smallest fix in this worktree, test, commit, push, publish a new image, and resubmit up to 3 retry attempts.

## Run Ledger

| Attempt | Job | Nickname | Session | Failure | Fix | Status |
| --- | --- | --- | --- | --- | --- | --- |
| 0 | `184193` | `avid-seahorse-aquamarine` | `session_2026_06_24_20_46_10_fgjit700` | Failed at `trainer/global_step=0`; rank 0 reported `No parquet files found` under the new PUDO root, with Surfboard surfacing downstream `RuntimeError: Prefetch thread exited with an error; ConnectionResetError: Connection lost`. | Added the missing `/dataset` suffix to `PUDO_BUCKETS_ROOT` in `wayve/ai/si/configs/parking/parking_config.py`; committed `ea03fa86fb72ce0f10668bc29a3453d09ee9760e`, pushed the branch, and published the fixed SI training image. | Failed; fixed and resubmitted. |
| 1 | `184196` | `plum-hatchetfish-satisfied` | `session_2026_06_24_21_04_24_fgjit7r1` | n/a | Uses fixed commit/image `ea03fa86fb72ce0f10668bc29a3453d09ee9760e`. | Passed 1K-step gate: W&B `trainer/global_step=1039`, Surfboard `Running` at 2026-06-24 21:24 UTC. |

## Notes

- Submit command kept the original shape: P1, `dgx-h100`, 4 nodes, `+mode=parking_bc_train_release_2026_5_11`, `+datamodule=parking_bc_datamodule`, `num_steps=100000`, `num_gpus=32`.
- Validation: `git diff --check`, `bazel build //wayve/ai/si:si`, and `bazel test //wayve/ai/si:test_config_py_test_test_configs_utils_parking_release_2026_5_21_config_resolves` passed in `/tmp/scarlet_full_gear_root_jitter`.
- Slack notification sent to Boris after the failure, fix, image publish, and retry submission.
- Parking/PUDO model-card row created: https://app.notion.com/p/38903da5d69a8199a2d3ea0b0879c0df
