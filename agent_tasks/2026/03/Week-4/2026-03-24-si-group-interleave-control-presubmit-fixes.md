# 2026-03-24 — SI group interleave control presubmit fixes

## Context
Presubmit build `434358` on branch `03-20-si-group-interleave-control-support` failed in GPU, integration-heavy GPU, and lint steps.

## What I changed
- Restored backward-compatible helper methods in deployment wrapper base/parking wrapper:
  - `_clamp_waypoints_for_direction`
  - `_postprocess_waypoints`
  - `_enforce_gear_direction_on_waypoints`
- Updated behavior customization test to use a truly unsupported control key (`999`) now that `SILC_MODE` is passthrough.
- Updated safety wrapper test fixture to include `vehicle_gear_position`, which is now required in wrapper forward signatures.
- Fixed deployment interleave wrapper lint warnings in tests:
  - disabled `redefined-outer-name` for fixture-driven tests
  - removed one unused fixture arg.

## Files
- `wayve/ai/zoo/deployment/deployment_wrapper.py`
- `wayve/ai/zoo/deployment/test/test_behavior_customization.py`
- `wayve/ai/zoo/deployment/test/test_safety_wrapper.py`
- `wayve/ai/zoo/deployment/test/test_interleave_control_wrapper.py`

## Validation run
- `bazel test //wayve/ai/si:test_deployment_wrapper --test_output=errors` ✅
- `bazel test //wayve/ai/zoo/deployment:test_deployment_py_test --test_output=errors` ✅
- `bazel test //wayve/ai/zoo/deployment:test_deployment_py_lint_pylint --test_output=errors` ✅

## Notes
- There were unrelated untracked workspace files present before this work:
  - `.ai/skills/obs-flyte-execution/`
  - `.claude/plugins/`
  - `databricks.yml`

## Follow-up (test-only, no wrapper fallback methods)
- User requested to keep removed legacy methods out of `deployment_wrapper.py`.
- Updated SI interface tests to validate the new API only:
  - switched from `_enforce_gear_direction_on_waypoints` to `_enforce_gear_position_on_waypoints`
  - replaced legacy `_clamp_waypoints_for_direction` / `_postprocess_waypoints` tests with `_enforce_gear_position_on_waypoints` and `_enforce_gear_position_on_outputs` coverage.
- Validation:
  - `bazel test //wayve/ai/si:test_deployment_wrapper --test_output=errors` ✅
  - `bazel test //wayve/ai/zoo/deployment:test_deployment_py_test //wayve/ai/zoo/deployment:test_deployment_py_lint_pylint --test_output=errors` ✅
