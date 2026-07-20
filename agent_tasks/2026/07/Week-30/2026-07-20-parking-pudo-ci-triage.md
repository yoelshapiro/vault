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
