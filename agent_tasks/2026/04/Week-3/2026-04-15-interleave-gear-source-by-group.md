# 2026-04-15 — Interleave Gear Source by Group

## Context
On branch `03-20-si-group-interleave-control-support`, simplify interleave gear source selection:
- driving group (`interleave_control_group == ""`) should use input `vehicle_gear_position`
- parking group (`interleave_control_group == "parking"`) should use model output `policy_gear_position`

## Code changes
- `wayve/ai/zoo/deployment/deployment_wrapper.py`
  - Updated `_wrap_with_interleave_control(...)` signature to accept optional `policy_gear_position`.
  - Added group-based gear-source selection:
    - driving group uses latest validated input gear
    - parking group requires validated `policy_gear_position` (raises `ValueError` if missing).
- `wayve/ai/zoo/deployment/deployment_wrapper_codegen.py`
  - Generated wrappers now always pass input `vehicle_gear_position` to `_wrap_with_interleave_control(...)`.
  - For outputs typed as `DrivingOutputWithGearOutput`, generated wrappers also pass `policy_gear_position=_base_output.policy_gear_position`; otherwise `None`.
- `wayve/ai/zoo/deployment/test/test_interleave_control_wrapper.py`
  - Updated driving-group test expectations to verify input-gear precedence.
  - Updated parking-group tests to supply model gear output explicitly when invoking `_wrap_with_interleave_control(...)`.
  - Added regression test asserting parking-group fails fast when `policy_gear_position` is missing.
  - Updated unknown gear-position test to match current enum validation behavior (unknown is accepted).

## Validation
- Passed:
  - `bazel test //wayve/ai/zoo/deployment:test_deployment_py_test --test_arg="-k interleave_control_wrapper or deployment_wrapper_codegen" --test_output=errors`
  - `bazel test //wayve/ai/zoo/deployment:test_deployment_py_lint_flake8 --test_output=errors`
  - `bazel test //wayve/ai/zoo/deployment:test_deployment_py_lint_pylint --test_output=errors`
- Known unrelated branch issue observed:
  - `//wayve/ai/zoo/deployment:test_deployment_mypy` fails in `test_behavior_customization.py` due to existing typing mismatch for `driving_controls_keys=(999,)`.

## Follow-up alignment (same day)
- Aligned implementation to Boris' edited approach:
  - `_wrap_with_interleave_control` now uses `base_output` type directly:
    - parking group requires `DrivingOutputWithGearOutput` and takes `base_output.policy_gear_position`
    - driving group uses latest input `vehicle_gear_position`
  - `DrivingOutputWithGearOutput` moved from `deployment_wrapper.py` to `io.py` and imported where needed.
  - codegen interleave wrapper call fixed to avoid malformed call when `driving_controls` is absent.
- Validation:
  - `//wayve/ai/zoo/deployment:test_deployment_py_test` (filtered to interleave/codegen) passed.
  - `//wayve/ai/zoo/deployment:test_deployment_py_lint_flake8` passed.
  - `//wayve/ai/zoo/deployment:test_deployment_py_lint_pylint` passed.
- TorchScript compatibility follow-up:
  - Removed `isinstance(base_output, DrivingOutputWithGearOutput)` runtime check from `_wrap_with_interleave_control`.
  - Parking path now directly reads `base_output.policy_gear_position`.
  - Updated missing-gear regression test to assert `AttributeError` on missing `policy_gear_position`.
