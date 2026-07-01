# 2026-07-01 PUDO Baseline Harlequin Fixes

- Branch: `boris/26-06-22-pudo-baseline`
- PR: `boris/26-06-22-pudo-baseline`
- Change type: Code change, uncommitted
- Areas: `wayve/ai/si/configs/parking/parking_config.py`, `wayve/ai/si/datamodules/parking.py`, `wayve/ai/si/datamodules/otf.py`, `wayve/ai/lib/data/pipes/routes.py`

## Summary

Ported selected parking/PUDO fixes from `boris/parking-past30-no-standstill-gear-aug/harlequin_outlr_binary_hysteresis` into the PUDO baseline PR branch.

## Changes

- Updated the parking BC PUDO root, bucket weights, binary version, gear augmentation settings, standstill-gear probability, and clamp/jitter config knobs.
- Added policy-target-aware standstill gear augmentation while preserving parking provenance outputs.
- Added `enable_clamp_policy_at_first_neutral` so the clamp step can be disabled from config.
- Threaded `route_shortening_jitter_m` from `ParkingDataConfig` through OTF route map options.
- Added route-distance-based parking stop jitter before route shortening.
- Preserved the PR branch's driving release partition construction, diffusion configs, mode registrations, and provenance fields.

## Validation

- `git diff --check` passed.
- `bazel test //wayve/ai/si/datamodules:py_lint_ruff //wayve/ai/si/datamodules:ty` passed.
- `bazel test //wayve/ai/lib:test_lib_py_lint_ruff //wayve/ai/lib:test_lib_ty` passed.
- `bazel test //wayve/ai/si/datamodules:py_test --test_arg=-k --test_arg=parking` ran 53 selected tests: 51 passed, 2 failed due local test environment frame loading hitting read-only `/home/nobody`.
- `bazel test //wayve/ai/lib:test_lib_py_test --test_arg=-k --test_arg=route` selected 10 route tests and all 10 passed, but the target failed the package coverage threshold because the filtered run only reached 11% coverage.
