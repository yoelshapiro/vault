# 2026-06-07 Gear-Aware Controller X Validation

- Branch: `codex/gear-aware-controller-x-validation`
- Base: `origin/main`
- PR: `https://github.com/wayveai/WayveCode/pull/117112`
- Change type: Controller validation fix
- Areas:
  - `/workspace/codex_gear_aware_controller_x_validation/wayve/robot/core/controller/src/trajectory_validation.cpp`
  - `/workspace/codex_gear_aware_controller_x_validation/wayve/robot/core/controller/test/test_trajectory_validation.cpp`

## Summary

- Kept agent-to-controller x-position validation in controller-frame coordinates, where x should be forward/non-negative after reverse preprocessing.
- Moved `UNKNOWN` drive-position validation before x-position validation so gear-aware logic only runs on known predicted gear.
- Updated regression coverage so reverse predictions with controller-frame forward x pass and negative controller-frame x fails.
- Updated the violation message to report the predicted drive position and the expected controller-frame x-position convention.

## Verification

- `bazel test //wayve/robot/core/controller:test_trajectory_validation`
- Re-ran after message update/rebase: `bazel test //wayve/robot/core/controller:test_trajectory_validation`
- `bazel test //wayve/robot/controller:controller_prod_reverse_integration_tests`
