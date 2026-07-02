# 2026-07-01 PUDO Baseline Harlequin Fixes

- Branch: `boris/26-06-22-pudo-baseline`
- PR: `boris/26-06-22-pudo-baseline`
- Change type: Code change, uncommitted
- Areas: `wayve/ai/lib/provenance.py`, `wayve/ai/lib/test/test_provenance.py`, `wayve/ai/si/BUILD`, `wayve/ai/si/configs/parking/parking_config.py`, `wayve/ai/si/configs/parking/parking_diffusion_config.py`, `wayve/ai/si/datamodules/parking.py`, `wayve/ai/si/datamodules/otf.py`, `wayve/ai/lib/data/pipes/routes.py`

## Summary

Ported selected parking/PUDO fixes from `boris/parking-past30-no-standstill-gear-aug/harlequin_outlr_binary_hysteresis` into the PUDO baseline PR branch.

## Changes

- Updated the parking BC PUDO root, bucket weights, binary version, gear augmentation settings, standstill-gear probability, and clamp/jitter config knobs.
- Added policy-target-aware standstill gear augmentation while preserving parking provenance outputs.
- Added `enable_clamp_policy_at_first_neutral` so the clamp step can be disabled from config.
- Threaded `route_shortening_jitter_m` from `ParkingDataConfig` through OTF route map options.
- Added route-distance-based parking stop jitter before route shortening.
- Preserved the PR branch's driving release partition construction and provenance fields.
- Moved Parking/PUDO diffusion datamodule, model, output adaptor, and mode registrations into `parking_diffusion_config.py`, and added that module to the `:si` Bazel source list.
- Compared PR provenance comments and Guy's `608e97771bcd` enum-metrics commit. Kept the PR's string `PROVENANCE_PARKING_STAGE` design instead of importing the full parking-stage metric/loss surface, but wired the parking provenance fields into `wayve/ai/lib/provenance.py` so they are copied/extracted into training provenance output.

## Validation

- `git diff --check` passed.
- `bazel test //wayve/ai/si/datamodules:py_lint_ruff //wayve/ai/si/datamodules:ty` passed.
- `bazel test //wayve/ai/lib:test_lib_py_lint_ruff //wayve/ai/lib:test_lib_ty` passed.
- `bazel test //wayve/ai/si/datamodules:py_test --test_arg=-k --test_arg=parking` ran 53 selected tests: 51 passed, 2 failed due local test environment frame loading hitting read-only `/home/nobody`.
- `bazel test //wayve/ai/lib:test_lib_py_test --test_arg=-k --test_arg=route` selected 10 route tests and all 10 passed, but the target failed the package coverage threshold because the filtered run only reached 11% coverage.
- `bazel test //wayve/ai/si:test_config_py_lint_ruff //wayve/ai/si:test_config_ty //wayve/ai/si:test_config_py_test_test_configs_utils_parking_release_2026_5_21_config_resolves` passed.
- Direct `parking_diffusion_config.py` import through `//wayve/ai/si:train_ipython` passed and printed diffusion binary version `3.0.23`, output adaptor target `wayve.ai.zoo.outputs.diffusion.DiffusionOutputAdaptor`, and diffusion loss weight `1.0`.
- `bazel test //wayve/ai/si:test_config_py_test_test_configs_utils_load_config_works_after_full_registration` failed before assertions with an OpenMP duplicate-runtime environment error.
- `bazel test //wayve/ai/lib:test_provenance //wayve/ai/lib:test_lib_py_lint_ruff //wayve/ai/lib:test_lib_ty` passed.

## 2026-07-02 PR Review Follow-Up

- Cleaned up the BehaviorCustomizer parking-control tests so parking controls remain ignored, including `INITIATE_AUTO_PARKING`, `PARKING_DIRECTION`, and `ENABLE_SHIFT_BY_WIRE`, with eager and TorchScript coverage.
- Rewrote `ParkingModelRelease2026_5_21Cfg` override construction to use a deep-copied `WFM_FEB_2026_EARLY_FUSION_BACKBONE_OVERRIDES` dict, preserving `WFMFeb2026EarlyFusionCFG(overrides=...)` behavior while removing nested dict unpacking.
- Fixed parked-origin route-shortening entry lookup by accepting parking segments with `segment_start >= 0` instead of requiring the segment to start after the current origin.
- Removed unused route-anchor arguments from parking route shortening so planned-route samples, which intentionally have `last_waypoint_index=None`, do not fail on `float(None)`.
- Added focused regressions for parked-origin entry lookup and planned-route parking route shortening.

## 2026-07-02 Validation

- `git diff --check` passed.
- `bazel test //wayve/ai/zoo/deployment:test_deployment_py_test --test_arg=-k --test_arg=behavior_customizer` passed.
- `bazel test //wayve/ai/zoo/deployment:test_deployment_py_lint_ruff //wayve/ai/si/datamodules:py_lint_ruff` passed.
- `bazel test //wayve/ai/si:test_config_py_lint_ruff //wayve/ai/si:test_config_ty //wayve/ai/si:test_config_py_test_test_configs_utils_parking_release_2026_5_21_config_resolves` passed.
- `bazel test //wayve/ai/si/datamodules:py_test --test_env=PYTEST_ADDOPTS=--no-cov --test_arg=-k --test_arg='add_parking_mode_stores_entry_index_for_parking_segment_started_before_origin or add_parking_mode_records_pre_augmentation_stage_and_gear'` passed.
- `bazel test //wayve/ai/lib:test_data_pipes_lib_py_test --test_arg=-k --test_arg='planned_route_fetch_route_map_with_parking_route_shortening or planned_route_fetch_route_map_happy_path'` and `//wayve/ai/lib:test_data_pipes_lib_py_lint_ruff` were blocked in analysis by ACR auth fetching `azure-storage/azurite` with `401 Unauthorized`.
- Full `bazel test //wayve/ai/si/datamodules:py_test` still fails on existing broader integration tests that try to load frame metadata under read-only `/home/nobody` and later produce empty SARSA pipes; the new parking unit regression passed in that run.
