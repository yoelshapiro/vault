# Parking 2026.5.21 Baseline Config

- Branch: boris/parking-past30-no-standstill-gear-aug/main_cherrypick
- Change type: config
- Areas: wayve/ai/si/configs/parking/parking_config.py

## Changes
- Bumped parking datamodule binary_version to 3.0.65.
- Added parking_bc_release_2026_5_21 using the WFM Feb 2026 early-fusion baseline pattern from boris/05-21-updated-pudo-config.
- Added parking_bc_train_release_2026_5_21 mode registration.

## Validation
- bazel test //wayve/ai/si:py_lint_ruff --test_output=errors
- bazel test //wayve/ai/si:test_config_py_test_test_configs_utils_load_config_works_after_full_registration --test_output=errors
- git diff --check

## Run Ledger
- taciturn-violet-falcon / job 172426 / session_2026_05_31_20_12_04_p521-30k: 30K run with 100K LR scheduler, binary 3.0.65, 2026.5.21 baseline. Failed before training; config resolution raised `InterpolationKeyError: Interpolation key 'enable_behavior_control' not found`.
