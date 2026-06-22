# Deployment wrapper gear output CI follow-up

- Branch: `boris/deployment-wrapper-default-gear`
- PR: `wayveai/WayveCode#120234`
- Change type: fix
- Areas: `wayve/ai/zoo/deployment`

## Summary

- Investigated failing PR checks after adding default gear output to deployment wrappers.
- Buildkite logs were not directly available from the local environment, but automated PR feedback pointed at interleaved wrapper coverage for gear output.
- Fixed `InterleavedModelWrapper` so `policy_gear_position` is part of `InterleavedDrivingOutput`, is cached during cache warmup, and is returned in warmup, cached, and normal output paths.
- Added regression assertions in `test_interleaved_wrapper.py` so the gear field cannot be silently dropped.
- Follow-up CI run still failed in GPU suites. A prepare-to-forward shift-by-wire regression test exposed that non-parking `ENABLE_SHIFT_BY_WIRE` reached `BehaviorCustomizer`, which rejected every driving control except `DILC_MODE`.
- Fixed `BehaviorCustomizer` to treat `ENABLE_SHIFT_BY_WIRE` as a no-op control; the deployment wrapper still owns the default DRIVE `policy_gear_position` output.

## Verification

- `python -m py_compile wayve/ai/zoo/deployment/interleaved_wrapper.py wayve/ai/zoo/deployment/test/test_interleaved_wrapper.py`
- `bazel test //wayve/ai/zoo/deployment:test_deployment_py_test --test_arg=-k --test_arg=interleaved --test_arg=--no-cov`
- `python -m py_compile wayve/ai/zoo/deployment/behavior_customization.py wayve/ai/si/test/interfaces/test_deployment_wrapper.py`
- `bazel test //wayve/ai/si:test_deployment_wrapper --test_arg=-k --test_arg=non_parking_shift_by_wire_outputs_default_drive --test_output=errors`
- `bazel test //wayve/ai/si:test_deployment_wrapper --test_output=errors`
- `bazel test //wayve/ai/zoo/deployment:test_deployment --test_output=errors`

## Commits

- `4e39d1f746d5 fix: preserve gear output in interleaved wrapper`
- `4d02e58c4a7e fix: allow shift-by-wire behavior control`
