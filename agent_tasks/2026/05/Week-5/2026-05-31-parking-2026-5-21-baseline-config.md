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

## Fix
- Fixed 2026.5.21 release config after job 172426 failed before training with `InterpolationKeyError: Interpolation key 'enable_behavior_control' not found`.
- Set WFM Feb output-adaptor behavior-control/gear flags explicitly and disabled behavior-control input for the parking release baseline, matching the reference release pattern while keeping parking mode enabled.
- Added targeted config-resolution regression test for `parking_bc_train_release_2026_5_21` with 30K steps and 100K scheduler override.

## Fix Validation
- bazel test //wayve/ai/si:test_config_py_test_test_configs_utils_parking_release_2026_5_21_config_resolves --test_output=errors
- bazel test //wayve/ai/si:py_lint_ruff --test_output=errors
- bazel test //wayve/ai/si:test_config_py_lint_ruff --test_output=errors
- tools/buildifier --mode=check wayve/ai/si/BUILD
- git diff --check -- wayve/ai/si/BUILD wayve/ai/si/configs/parking/parking_config.py wayve/ai/si/test/configs/test_configs_utils.py

## Additional Run Ledger
- quail-maroon-modest / job 172445 / session_2026_05_31_20_51_13_p521fix30k: retry after release.py-style behavior-control adaptor fix. Failed before 5K during dataloader startup: missing camera at position [5] with copy_tele_camera disabled.
- hedgehog-modest-amaranth / job 172457 / session_2026_05_31_21_12_58_p521tele30k: retry after enabling copy_tele_camera for the 2026.5.21 parking datamodule. Passed 5K trainer-step monitor at trainer/global_step 5074 while Surfboard and W&B were still running. Notion model-card row created: https://www.notion.so/37103da5d69a81708d52e890709b151a

## Additional Fix Validation
- bazel test //wayve/ai/si:test_config_py_test_test_configs_utils_parking_release_2026_5_21_config_resolves --test_output=errors
- bazel test //wayve/ai/si:py_lint_ruff //wayve/ai/si:test_config_py_lint_ruff --test_output=errors
- tools/buildifier --mode=check wayve/ai/si/BUILD
- git diff --check
