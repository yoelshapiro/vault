# Exotic branch Zak gear cleanup

## Summary
- Branched from `origin/guy/training/exotic-jellyfish-silver-70-15-10-5_fix_wj_aug_params` into `boris/exotic-zak-gear-augmentations`.
- Added opt-in Zak-style parking gear-label cleanup to `wayve/ai/zoo/data/parking.py`.
- Enabled the cleanup in `parking_bc_datamodule_cfg`.
- Disabled `reconstruct_gear_from_speed` for this config so the cleanup operates on raw gear rather than speed-derived gear.
- Preserved the existing downstream parking augmentations: parked/unparking augmentation, strip leading standstill, and policy clamp at first neutral.
- Fixed a stale `F.*` reference in the existing route-stop helper by using `TableKeys.*`.

## Commit
- `33fd6278acfb` - `feat(parking): add gear label cleanup`

## Tests
- Passed: `bazel test //wayve/ai/zoo/data:test_zoo_data --test_filter='test_replace_short_gear_segments_prefers_following_label|test_clean_parking_gear_labels_shifts_neutral_after_stop_buffer'`
- Passed: `bazel test //wayve/ai/si/datamodules:py_lint_flake8 //wayve/ai/si/datamodules:py_lint_pylint`
- Passed: `git diff --check`

## Follow-up flag coverage
- Added `test_fill_parking_scratch_table_uses_gear_cleanup_flag` to verify the flag-on path uses Zak cleanup and the flag-off path preserves the previous expanded-gear behavior.
- Commit: `0223b792d4d6` - `test(parking): cover gear cleanup flag`
- Passed: `bazel test //wayve/ai/zoo/data:test_zoo_data --test_filter='test_fill_parking_scratch_table_uses_gear_cleanup_flag|test_replace_short_gear_segments_prefers_following_label|test_clean_parking_gear_labels_shifts_neutral_after_stop_buffer'`
