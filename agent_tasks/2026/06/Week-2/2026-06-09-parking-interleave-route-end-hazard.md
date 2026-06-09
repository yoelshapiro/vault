# 2026-06-09 Parking Interleave Route-End Hazard

## Summary

Added route-end behavior to the parking deployment wrapper on branch `boris/parking-past30-no-standstill-gear-aug/main_cherrypick_new_driving`.

## Changes

- Added a persistent parking route-end latch in `ParkingDeploymentWrapperImpl`.
- Added default-on flags `enable_end_of_route_hazard_lights` and `enable_end_of_route_gear_latch` to control the behavior.
- Reused parking's `_end_of_route_mask` for the hazard/latch gate so it matches the existing parking-mode route-end definition.
- When the parking wrapper is under the close-to-route-end gate:
  - expands indicator weights to 4 channels if needed,
  - forces the hazard channel so the inference-node detensorizer emits `INDICATORS_STATE_V2_HAZARD_ON`,
  - latches `PARK` once the policy selects park.
- The latch resets when the close-to-route-end gate becomes false, after which drive/reverse gear outputs are allowed again.
- Added CPU unit tests in `wayve/ai/si/test/interfaces/test_deployment_wrapper.py` for hazard forcing and park-latch reset behavior.
- Added tests for disabling the hazard and gear-latch behavior independently.
- Moved the hazard/latch behavior into the normal parking output path, not a parking `_wrap_with_interleave_control` override, so it applies regardless of whether interleave control is enabled.
- Fixed SI deploy temporal-cache config rewriting for release-loader backed BC models by setting `model.model.overrides.input_adaptor.adaptors.video.enable_cache_at_inference` instead of passing the training-time flag as a direct `load_pretrained_backbone`/`MIMOSTTransformer` kwarg.
- Updated the Python deployment output validator to allow the existing DMI 4-channel indicator contract `[off, right, left, hazard]`.

## Verification

- `bazel test //wayve/ai/si:test_deployment_wrapper --test_arg='-k=parking_interleave'`
- `bazel test //wayve/ai/si:test_deployment_wrapper --test_arg='-k=parking_wrapper or parking_interleave'`
- `bazel test //wayve/ai/zoo/deployment:test_deployment_py_test --test_arg='-k=interleave_codegen or parking_interleave'`
- `bazel test //wayve/ai/zoo/deployment:test_deployment_py_lint_ruff //wayve/ai/zoo/deployment:test_deployment_py_lint_flake8 //wayve/ai/zoo/deployment:test_deployment_ty`
- `bazel test //wayve/ai/si:test_deploy --test_arg='-k=apply_temporal_caching_to_config'`
- `SELECT= bazel test //wayve/ai/lib:test_lib_py_test --test_arg='-k=test_output_allows_hazard_indicator_channel' --test_arg='--no-cov'`
- `SELECT= bazel test //wayve/ai/lib:test_lib_py_lint_ruff //wayve/ai/lib:test_lib_py_lint_flake8 //wayve/ai/lib:test_lib_ty`
