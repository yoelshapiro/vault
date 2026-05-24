# Parking Input Adaptor LR Fix

Branch: `boris/parking-past30-no-standstill-gear-aug/no_behave_lr_fix`

## Context
The parking mode and gear direction input adaptors are newly introduced relative to the pretrained WFM path used by this branch. They were being optimized with the base trunk LR (`1e-5`), which is too small for randomly initialized adaptor weights.

## Changes
- Added optional `gear_direction_input_adaptor_lr` and `parking_mode_input_adaptor_lr` knobs to `BcTrainingModule`.
- Routed `input_adaptor.adaptors.gear_direction` and `input_adaptor.adaptors.parking_mode` parameters into dedicated optimizer groups when those knobs are set.
- Set both parking training configs in `parking_config.py` to use `1e-4` for those input adaptor groups.
- Added a focused optimizer grouping regression test in `test_training.py`.

## Validation
- Passed direct Bazel runtime assertion via `//wayve/ai/si:train_ipython` confirming both parameter groups route the expected parameters at LR `1e-4`.
- Passed parking config resolution via `//wayve/ai/si:train_ipython` for `parking_bc_train_release_2026_5_11` with both LR fields resolving to `0.0001`.
- Passed Bazel runtime `py_compile` for edited test and parking config files.
- `bazel test //wayve/ai/si:py_test --test_arg=-k --test_arg=test_input_adaptor_lr_parameter_groups_route_fresh_parking_adaptors` and `bazel test //wayve/ai/si:py_lint_flake8` did not run because analysis fails before tests/lint with missing rule `//wayve/ai/si:run_inference` from `//wayve/ai/si:__py_checks_lib`.
