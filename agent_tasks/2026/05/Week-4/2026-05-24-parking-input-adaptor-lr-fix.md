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


## Follow-up: 5000-step WFM warmup freeze
- Added delayed OneCycle LR support using a per-group LambdaLR multiplier based on Orens lr_delay_infra approach.
- Added zero_delay_lr_until_step=5000 and layers_to_delay=(model.encoder, model.input_adaptor) to both parking BC configs.
- Kept gear_direction_input_adaptor and parking_mode_input_adaptor trainable from step 0 even though their parent input_adaptor subtree is delayed.
- Added focused tests for delayed group routing and model-prefix matching.

### Follow-up Validation
- Passed Bazel runtime py_compile for edited training, test, parking config, and scheduler helper files.
- Passed config resolution for parking_bc_train_release_2026_5_11 with zero_delay_lr_until_step=5000 and delayed layers resolving as expected.
- Passed direct optimizer grouping smoke test showing other_delayed: 5000, gear_direction_input_adaptor: 0, and parking_mode_input_adaptor: 0.
- Passed scheduler smoke test showing the delayed group remains at LR 0 before step 5000 and becomes non-zero at step 5000.
- Focused bazel test //wayve/ai/si:py_test is still blocked by the existing analysis failure: missing rule //wayve/ai/si:run_inference from //wayve/ai/si:__py_checks_lib.
