# 2026-05-31 LR Scheduler Horizon

- Topic: Decouple BC LR scheduler horizon from trainer stop steps.
- Labels: parking, training, lr-schedule, bc.
- Branch: `boris/parking-past30-no-standstill-gear-aug/merge_main`.
- PR: N/A.
- Change type: Code change / regression test.
- Areas: `/workspace/WayveCode/wayve/ai/si/config.py`, `/workspace/WayveCode/wayve/ai/si/models/training.py`, `/workspace/WayveCode/wayve/ai/si/test/models/test_training.py`.

## Changes

- Added `lr_scheduler_num_steps` to the BC training module config surface.
- Used `lr_scheduler_num_steps` for one-cycle and plateau scheduler `total_steps` when set, while keeping `trainer.max_steps` as the fallback.
- Added a focused optimizer regression test that captures the scheduler `total_steps` for default and override cases.

## Verification

- Attempted `bazel test //wayve/ai/si:py_test_test_training_core --test_arg=--no-cov --test_arg=-k --test_arg=lr_scheduler_num_steps`.
- Blocked during Bazel analysis by existing missing target `//wayve/ai/si:run_inference` referenced from `//wayve/ai/si:__py_checks_lib`.

## Training Submission

- Submitted job `172180` / `taciturn-gecko-peach` from pushed commit `7b291aee4b2e0da254e73c8ff8dc27a817ddc88c`.
- Session: `session_2026_05_31_07_02_10_main-merge-to-sea-turtle`.
- Command overrides: `+mode=parking_bc_train_release_2026_5_11 +datamodule=parking_bc_datamodule num_steps=30000 model.lr_scheduler_num_steps=100000`.
- Image: `wayvetraining.azurecr.io/scaled-intelligence:7b291aee4b2e0da254e73c8ff8dc27a817ddc88c`.
- Initial submit failed because AKS could not see the newly published image tag yet; retry succeeded after replication.
- Final observed status: `Running` on `aks-prod-training-2-swe.nd96h100`, started `2026-05-31 07:05 UTC`.
- W&B: https://wandb.ai/wayve-ai/parking_bc/runs/session_2026_05_31_07_02_10_main-merge-to-sea-turtle
- Datadog logs: https://app.datadoghq.eu/logs?query=job_name%3Ataciturn-gecko-peach-172180&from_ts=1779001538646&cols=job_name%2Cnode_rank&live=true
