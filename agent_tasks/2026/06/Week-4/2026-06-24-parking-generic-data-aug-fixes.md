# 2026-06-24 Parking Generic Data Aug Fixes

- Branch: `boris/parking-past30-no-standstill-gear-aug/main_cherrypick_generic_data_aug_fixes`
- Base commit: `ce77a3fe24679b3139327d74eb9a4129ba94bf91` (`scarlet-noble-cobra` source)
- Worktree: `/tmp/main_cherrypick_generic_data_aug_fixes`
- PR: none

## Summary

- Forked the scarlet source commit into a review branch for augmentation and LR changes.
- Added a train-only adaptor token-dropout path and configured the parking 5.11 release model to use 50% token dropout for gear direction and parking mode instead of always dropping gear.
- Added a temporary LR boost for the gear-direction and parking-mode input adaptors: `1e-4` for the first 5k scheduler steps, then scaled back to `1e-5`.
- Changed `ParkingDeploymentWrapperImpl` defaults so end-of-route hazard lights and gear latch are disabled by default while preserving end-of-route parking.

## Validation

- `git diff --check` passed.
- `bazel test //wayve/ai/zoo/st:test_st --test_arg=-k=dropout_token_probability --test_output=errors` did not execute tests because Bazel failed during dependency fetch with `OSError: [Errno 28] No space left on device`.
