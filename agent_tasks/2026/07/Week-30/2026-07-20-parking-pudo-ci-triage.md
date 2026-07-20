# 2026-07-20 Parking/PUDO CI Triage

- Branch: `boris/26-06-22-pudo-baseline`
- PR: `#120214`
- Buildkite: presubmit build `533739` on commit `ada5b1e592f7`
- Scope: CI failure diagnosis only; no code changes made.

## Findings

- Direct PR config regression: `//wayve/ai/si:test_config_py_test_core` fails because `reference_bc.yaml` is missing newly materialized parking datamodule fields including `enable_end_of_route_blackout`, `enable_route_shortening_for_parking`, `augment_standstill_gear_prob`, `use_main_standstill_gear_augmentation`, and gear cleanup fields.
- Direct PR route-map signature regression: `//wayve/ai/lib:test_data_pipes_lib_py_test` fails `test_route_map_pipe_and_generate_route_map_signatures_match`; `generate_route_map` has parameters missing from the pipe signature comparison (`enable_route_shortening_for_parking`, `route_shortening_jitter_m`, `use_planned_route`).
- Deployment wrapper regressions: scripted wrapper tests fail because TorchScript cannot compile enum attribute lookups in `_enforce_gear_position_on_waypoints`, and tests still reference removed `_clamp_waypoints_for_direction` instead of `_clamp_waypoints_for_forward_drive`.
- Additional deploy/test failures are cascades of the same scripted wrapper issue across GPU and integration suites.

## PR Comment Follow-up

- Applied selected Wonjoon review-comment cleanups without changing the end-of-route route-map heuristic.
- Changed hazard indicator index to derive from `IndicatorsStateV2.INDICATORS_STATE_V2_HAZARD_ON`.
- Added a short explanation for the end-of-route PARK latch behavior.
- Registered a hazard indicator template buffer and reused it when forcing hazard indicator weights at route end.
- Simplified the redundant `parking_config is not None` check under `route_shortening_enabled` in `otf.py`.
- Left `from hydra_zen import MISSING, make_config` unchanged because both imported names are used in `parking_diffusion_config.py`.
- Verification: `bazel test //wayve/ai/si:test_deployment_wrapper --test_arg=-k --test_arg=parking_route_end`; `bazel test //wayve/ai/si/datamodules:ty`.

## Rebase and CI Fixes

- Rebased `boris/26-06-22-pudo-baseline` onto `origin/main`.
- Resolved deployment/config rebase conflicts in `wayve/ai/si/models/deployment.py`, `wayve/ai/services/binaries/datasets/ai_lib/autopublish.yaml`, and `wayve/ai/lib/test/test_provenance.py`.
- Fixed TorchScript enum lookup in deployment waypoint gear enforcement by moving gear enum values to wrapper constants.
- Updated stale deployment-wrapper tests for `_clamp_waypoints_for_forward_drive` behavior.
- Updated `reference_bc.yaml` with the generated parking config defaults.
- Updated the route-map signature test to exclude fetcher-only route shortening/planned-route controls.
- Updated temporal caching release-backbone test to match rebased main behavior.
- Refreshed ACR auth with `az acr login` for `wayve`, `wayvetraining`, and `wayveacrprodflyte` after local Bazel initially failed fetching `azure-storage/azurite` with `401 Unauthorized`.

## Verification

- Passed: `bazel test //wayve/ai/si:test_deploy --test_output=errors --test_arg=-k --test_arg=test_apply_temporal_caching_to_config_release_backbone`.
- Passed: `bazel test //wayve/ai/si:test_deployment_wrapper --test_output=errors`.
- Passed: `bazel test //wayve/ai/si:test_config_py_test_core --test_output=errors --test_arg=-k --test_arg=test_regression[bc]`.
- Passed: `bazel test //wayve/ai/lib:test_data_pipes_lib_py_lint_ruff --test_output=errors`.
- Passed: `bazel test //wayve/ai/lib:test_data_pipes_lib_ty --test_output=errors`.
- Passed: `bazel test //wayve/ai/si:test_config_py_lint_ruff --test_output=errors`.
- Blocked locally: `bazel test //wayve/ai/lib:test_data_pipes_lib_py_test --test_output=errors --test_arg=-k --test_arg=test_route_map_pipe_and_generate_route_map_signatures_match` failed during collection in unrelated `test_lidar_cpp_converter.py` with `google.protobuf.message.DecodeError` before running the selected route-map test.
