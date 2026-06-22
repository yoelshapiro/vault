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

## Verification

- `python -m py_compile wayve/ai/zoo/deployment/interleaved_wrapper.py wayve/ai/zoo/deployment/test/test_interleaved_wrapper.py`
- `bazel test //wayve/ai/zoo/deployment:test_deployment_py_test --test_arg=-k --test_arg=interleaved --test_arg=--no-cov`

## Commits

- `4e39d1f746d5 fix: preserve gear output in interleaved wrapper`
