# 2026-03-20 — Interleave group export + TorchScript Optional gear fix

## Context
Zak reported deployed models had interleave control tensor but no `interleave_group` in `gen2_inference_config`, so parking-group interleaving was not applied at runtime. Deployment also failed to TorchScript-compile with:

`'Optional[Tensor]' object has no attribute or method 'to'` in `_wrap_with_interleave_control`.

## Changes
- Updated `prepare_deployment_model` to propagate interleave group into deployment config:
  - `wayve/ai/si/models/deployment.py`
  - Set `deployment_config.interleave_group = interleave_control_group` when interleave is enabled, else clear to `""`.
- Fixed TorchScript Optional handling for policy gear position:
  - `wayve/ai/zoo/deployment/deployment_wrapper.py`
  - Avoid calling `.to(...)` directly on an Optional by branching on a local variable first.
- Added regression test to lock interleave-group propagation:
  - `wayve/ai/zoo/deployment/test/test_interleave_control_wrapper.py`
  - `test_interleave_control_group_written_to_deployment_config`.

## Validation
- `bazel test //wayve/ai/zoo/deployment:test_deployment_py_test --test_arg='-k interleave_control_group_written_to_deployment_config or interleave_control'`
- `bazel test //wayve/ai/si:test_deployment_wrapper --test_arg='-k gear_position or interleave'`

Both passed.

## Notes
- No commits were made.
- Existing untracked workspace files were left untouched.
