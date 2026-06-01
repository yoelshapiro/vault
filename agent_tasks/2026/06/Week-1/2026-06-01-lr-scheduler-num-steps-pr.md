# 2026-06-01 LR Scheduler Num Steps PR

- Topic: Isolate the BC LR scheduler horizon override onto a main-based branch and PR.
- Labels: parking, training, lr-schedule, pull-request.
- Branch: `boris/lr-scheduler-num-steps`.
- PR: https://github.com/wayveai/WayveCode/pull/115840
- Change type: Code change / regression test / draft PR.
- Areas: `/workspace/WayveCode/wayve/ai/si/config.py`, `/workspace/WayveCode/wayve/ai/si/models/training.py`, `/workspace/WayveCode/wayve/ai/si/test/models/test_training.py`.

## Changes

- Created `boris/lr-scheduler-num-steps` from current `origin/main` and isolated only `feat: decouple lr scheduler horizon`.
- Added `lr_scheduler_num_steps` to SI config and `BcTrainingModule`.
- Used `lr_scheduler_num_steps` as scheduler `total_steps` for one-cycle and ramp-up/plateau/ramp-down when provided, falling back to `trainer.max_steps`.
- Added a regression test for fallback and override behavior; adjusted the lightweight test fixture for current `main`.
- Opened draft PR #115840.

## Verification

- `git diff --check` passed.
- `bazel test //wayve/ai/si:py_test_test_training --test_arg=--no-cov --test_arg=-k --test_arg=lr_scheduler_num_steps` passed.
- The same filtered test without `--no-cov` had selected tests pass but failed the suite coverage gate (`total 19 < fail-under 44`).
