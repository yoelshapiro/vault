# 2026-06-24 Parking Generic Data Aug Fixes

- Branch: `boris/parking-past30-no-standstill-gear-aug/main_cherrypick_generic_data_aug_fixes`
- Base commit: `ce77a3fe24679b3139327d74eb9a4129ba94bf91` (`scarlet-noble-cobra` source)
- Worktree: `/tmp/main_cherrypick_generic_data_aug_fixes`
- PR: none
- Code commit: `cae7fb21c8bc7ad51726ae3577ab249d232153fc`
- Training job: `184160` / `feisty-orange-eel`
- Session: `session_2026_06_24_19_35_50_g50lr5k`

## Summary

- Forked the scarlet source commit into a review branch for augmentation and LR changes.
- Added a train-only adaptor token-dropout path and configured the parking 5.11 release model to use 50% token dropout for gear direction instead of always dropping gear.
- Added a temporary LR boost for the gear-direction and parking-mode input adaptors: `1e-4` for the first 5k scheduler steps, then scaled back to `1e-5`.
- Changed `ParkingDeploymentWrapperImpl` defaults so end-of-route hazard lights and gear latch are disabled by default while preserving end-of-route parking.
- Submitted a 4-node H100 P1 training job with `parking_bc_train_release_2026_5_11`, `parking_bc_datamodule`, and `num_steps=100000`.
- Job `184160` failed at step 0 because Lightning rejected `_PostBoostLRScheduler` as a custom scheduler that did not follow the PyTorch `LRScheduler` API.
- Fixed `_PostBoostLRScheduler` to subclass `torch.optim.lr_scheduler.LRScheduler` and added regression coverage for both post-boost scaling and Lightning's scheduler API validation.

## Validation

- `git diff --check` passed.
- `TMPDIR=/workspace/tmp bazel test //wayve/ai/zoo/st:test_st_py_test --test_arg=-k=gear_direction_st_adaptor_dropout_token_probability --test_output=errors` passed.
- `TMPDIR=/workspace/tmp bazel test //wayve/ai/zoo/st:test_st_py_lint_ruff //wayve/ai/zoo/st:test_st_py_lint_flake8 //wayve/ai/zoo/st:test_st_ty --test_output=errors` passed.
- Submitted training with image `wayvetraining.azurecr.io/scaled-intelligence:cae7fb21c8bc7ad51726ae3577ab249d232153fc`; job was queued at position 1 after submission.
- `TMPDIR=/workspace/tmp bazel test //wayve/ai/si:py_test_test_training_core --test_arg=-k='post_boost or parking_input_adaptor_lr_boost' --test_arg=--no-cov --test_output=errors` passed.
- `TMPDIR=/workspace/tmp bazel test //wayve/ai/si:py_lint_ruff //wayve/ai/si:py_lint_flake8 --test_output=errors` passed.
- `TMPDIR=/workspace/tmp bazel test //wayve/ai/si:ty --test_output=errors` passed.
