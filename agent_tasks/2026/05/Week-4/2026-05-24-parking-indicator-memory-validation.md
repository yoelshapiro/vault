# 2026-05-24 Parking Indicator Memory Validation

- Branch: `boris/parking-past30-no-standstill-gear-aug/no_behave`
- Change type: Code fix / deployment validation
- Areas: `wayve/ai/si/configs/parking`, `wayve/ai/si/models`, `wayve/ai/si/test/models`

## Summary

Restored indicator memory for the parking training configs while keeping behavioral control disabled. The deployment feature-combination guard now allows the parking wrapper to deploy with navigation input and indicator memory enabled together, without re-enabling behavior-control input.

## Changes

- Set `use_indicator_memory=True` in both `parking_bc_cfg` and `parking_bc_release_2026_5_11_cfg`.
- Added a parking-only validation allowance for `navigation input + indicator memory` in `prepare_deployment_model`.
- Added a regression test that parking deployment accepts navigation and indicator memory with behavior control disabled.

## Validation

- `git diff --check` passed.
- `bazel test //wayve/ai/si:py_test --test_arg=-k --test_arg='parking_navigation_and_indicator_memory or other_invalid_combinations_raise_error or all_three_features_is_valid'` did not reach tests because Bazel analysis failed fetching `azure-storage/azurite` from ACR with `401 Unauthorized`.
- `bazel test //wayve/ai/si:test_deploy ...` was tried as a narrower target, but it does not own `test/models/test_deployment.py`; the pytest filter selected zero tests.
