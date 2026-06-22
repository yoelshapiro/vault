# Merge Main Into PUDO Baseline

- Date: 2026-06-22
- Branch: `boris/26-06-22-pudo-baseline`
- PR: https://github.com/wayveai/WayveCode/pull/120214
- Commit: `8cb57a562b0e`

Merged `origin/main` (`0804b83a6bd5`) into the yellow Parking/PUDO baseline branch.

## Conflict Resolution

- Kept the baseline branch Parking/PUDO data config and scheduler override behavior while taking main import/API updates.
- Preserved parking interleave deployment support and the parking deployment combination allowance.
- Kept route-shortening support in routes/OTF conflict paths.
- Restored `INITIATE_AUTO_PARKING` behavior customization support after main marked it unsupported.
- Updated callback session handling so Bazel callback tests do not try to read git metadata from a sandboxed runfiles directory.

## Verification

- Passed: `bazel test //wayve/ai/zoo/deployment:test_deployment_py_test --test_output=errors`
- Passed: `bazel test //wayve/ai/si:test_config_py_test_test_configs_utils_parking_release_2026_5_21_config_resolves --test_output=errors`
- Focused callback tests passed, but Bazel returned failure because the filtered run hit target-wide coverage fail-under:
  - `test_parking_deployment_config_sets_interleave_group_and_driving_parameters`
  - `test_pruning_callback_in_configure_callbacks`
  - `test_sensitivity_callback_in_configure_callbacks`
- Full `//wayve/ai/si:py_test_test_training_core` remains locally blocked by an unhydrated LFS pointer for `wayve/ai/si/test/models/data/test_batch.pt`.
