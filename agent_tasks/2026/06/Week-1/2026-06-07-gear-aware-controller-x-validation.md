# 2026-06-07 Gear-Aware Controller X Validation

- Branch: `codex/gear-aware-controller-x-validation`
- Base: `origin/main`
- PR: `https://github.com/wayveai/WayveCode/pull/117112`
- Change type: Controller validation fix
- Areas:
  - `/workspace/codex_gear_aware_controller_x_validation/wayve/robot/core/controller/src/trajectory_validation.cpp`
  - `/workspace/codex_gear_aware_controller_x_validation/wayve/robot/core/controller/test/test_trajectory_validation.cpp`

## Summary

- Made agent-to-controller x-position validation use the model-predicted `InterfaceAgentToController.drive_position`.
- Preserved the forward convention for non-reverse predictions and allowed reverse-signed x waypoints only when predicted gear is reverse.
- Moved `UNKNOWN` drive-position validation before x-position validation so gear-aware logic only runs on known predicted gear.
- Updated regression coverage so reverse-signed waypoints pass for reverse predictions and forward-signed waypoints fail for reverse predictions.

## Verification

- `bazel test //wayve/robot/core/controller:test_trajectory_validation`
