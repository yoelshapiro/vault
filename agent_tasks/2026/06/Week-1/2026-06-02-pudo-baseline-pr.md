# 2026-06-02 PUDO Baseline PR

- Branch: `06-02-pudo-baseline`
- PR: https://github.com/wayveai/WayveCode/pull/116069
- Worktree: `/tmp/pudo-baseline-pr`
- Commit: `af0ec1ca8b8e`

## Summary

Created a clean PR branch from current `origin/main` for the Parking PUDO baseline.

## Changes

- Added active `parking_pudo_bc_datamodule_cfg` using the new PUDO/UNPUDO root.
- Removed old D26 datamodule aliases; kept diffusion datamodule.
- Added release `2026_5_21` parking BC model/mode.
- Removed parking interleave-control wrapper/training plumbing from the PR scope.
- Kept `wayve/ai/zoo/data/parking.py` untouched.
- Added parking datamodule/OTF route-processing capabilities and focused regressions.

## Validation

- `git diff --check`
- `bazel test //wayve/ai/si:test_config_py_test_test_configs_utils_parking_release_2026_5_21_config_resolves`
- `bazel test //wayve/ai/si:py_test_test_deployment --test_arg=--no-cov --test_arg=-k --test_arg=test_prepare_deployment_model_parking_with_driving_features_is_valid`
- `bazel test //wayve/ai/si:py_test_test_training --test_arg=--no-cov --test_arg=-k --test_arg=test_parking_deployment_config_sets_driving_parameters`
- `bazel test //wayve/ai/zoo/deployment:test_deployment_py_test --test_arg=--no-cov --test_arg=-k --test_arg="test_behavior_customizer_ignores_parking_control_keys or test_behavior_customizer_with_parking_control_keys_is_scriptable"`
