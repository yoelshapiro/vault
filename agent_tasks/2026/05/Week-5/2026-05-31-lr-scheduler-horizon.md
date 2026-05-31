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
