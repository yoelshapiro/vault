# Deployment Wrapper Default Gear Output

- Date: 2026-06-22
- Branch: `codex/deployment-wrapper-default-gear`
- PR: none
- Change type: Feature / deployment contract update
- Areas:
  - `wayve/ai/zoo/deployment/deployment_wrapper.py`
  - `wayve/ai/zoo/deployment/io.py`
  - `wayve/ai/si/models/deployment.py`
  - Safety wrapper tuple consumers and focused tests

## Summary

Added `policy_gear_position` to the common onboard driving output contract, defaulting to `DRIVE_POSITION_V2_DRIVE` for wrappers/models that do not emit gear. Parking-specific wrappers keep their existing gear prediction and shift-by-wire behavior.

## Changes

- Added common DRIVE defaulting in `convert_si_output_to_onboard_driving_output`.
- Replaced the base forward-only waypoint clamp with the shared gear-aware clamp.
- Preserved model-provided `POLICY_GEAR_POSITION` when present and synthesized DRIVE when absent.
- Threaded `policy_gear_position` through kinematic, safety, speed-sign, TSR, ODD, and LSS wrapper output tuples.
- Removed the stale non-parking shift-by-wire rejection in deployment model preparation.
- Updated direct output tuple constructors and regression tests for the new field.

## Verification

- `python -m py_compile wayve/ai/zoo/deployment/io.py wayve/ai/zoo/deployment/deployment_wrapper.py wayve/ai/si/models/deployment.py wayve/ai/si/test/interfaces/test_deployment_wrapper.py wayve/ai/si/test/models/test_deployment.py wayve/ai/safety/training/deployment/safety_wrapper.py wayve/ai/safety/training/deployment/occupancy_wrapper.py`
- `bazel test //wayve/ai/zoo/deployment:test_deployment`
- `bazel test //wayve/ai/si:test_deployment_wrapper --test_arg=-k --test_arg=postprocess_waypoints`
- `bazel test //wayve/ai/si:py_test_test_deployment_core --test_arg=--no-cov --test_arg=-k --test_arg=test_prepare_deployment_model_allows_shift_by_wire_without_parking`
- `bazel test //wayve/ai/safety/training:py_test --test_arg=--no-cov --test_arg=-k --test_arg='safety_wrapper or occupancy_wrapper'`

## Notes

- An initial filtered `bazel test //wayve/ai/zoo/deployment:test_deployment --test_arg=...` failed because pytest arguments were also passed to generated lint/type checks. The full unfiltered `test_deployment` target passed afterward.
- An initial filtered `//wayve/ai/si:py_test_test_deployment_core` run passed the selected pytest but failed target coverage because most tests were deselected; the `--no-cov` rerun passed.
