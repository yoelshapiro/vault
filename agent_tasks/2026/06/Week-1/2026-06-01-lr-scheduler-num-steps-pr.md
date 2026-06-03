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

## CI Snapshot Fix

- CI failed `test_regression[bc]` because the baseline BC config snapshot did not include the new `lr_scheduler_num_steps: null` default.
- Updated `/workspace/WayveCode/wayve/ai/si/test/test_config_inputs/reference_bc.yaml`.
- Verification passed: `bazel test //wayve/ai/si:test_config_py_test_core --test_arg=-k --test_arg=test_regression`.
- Pushed follow-up commit `8159e1b607d6` (`test: update bc config snapshot for lr scheduler steps`).

## PR Review Comment Fixes

- Addressed agentic PR review comments on PR #115840.
- Replaced `self.lr_scheduler_num_steps or self.trainer.max_steps` with explicit `None` fallback and non-positive value validation.
- Expanded scheduler regression coverage to both `one-cycle` and `plateau` branches.
- Added regression coverage for `0` and negative `lr_scheduler_num_steps` raising `ValueError`.
- Verification passed:
  - `git diff --check`
  - `bazel test //wayve/ai/si:py_test_test_training --test_arg=--no-cov --test_arg=-k --test_arg='lr_scheduler_num_steps or non_positive_lr_scheduler_num_steps'`
  - `bazel test //wayve/ai/si:py_lint_ruff`
- Pushed follow-up commit `d908a40c3558` (`fix: validate lr scheduler step override`).

## Human Review Comment Fix

- Addressed Rollin's PR review comment asking for explicit behavior when `lr_scheduler_num_steps` is greater than or less than the trainer's expected step count.
- Kept the intended long-horizon behavior: explicit `lr_scheduler_num_steps >= trainer.max_steps` is accepted and passed to both scheduler branches.
- Rejected `lr_scheduler_num_steps < trainer.max_steps` when the trainer has a positive `max_steps`, because both scheduler implementations are step-count bounded and can fail if training continues past scheduler `total_steps`.
- Expanded regression coverage with explicit equal and longer accepted cases plus shorter-than-trainer rejection for both `one-cycle` and `plateau`.
- Verification:
  - `git diff --check`
  - `bazel test //wayve/ai/si:py_test_test_training_core --test_arg="-k=configure_optimizers" --test_arg="--no-cov"`
  - `bazel test //wayve/ai/si:py_lint_ruff`
  - `bazel test //wayve/ai/si:py_lint_flake8`
- Note: the same focused `py_test_test_training_core` run without `--no-cov` selected tests passed but failed the full-suite coverage gate (`total 21 < fail-under 44`) because the pytest `-k` filter deselected most tests.
