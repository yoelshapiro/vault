# 2026-06-22 SI Group Interleave Control Support

- Branch: `06-22-si-group-interleave-control-support`
- Worktree: `/workspace/.codex-borisindelman/worktrees/06-22-si-group-interleave-control-support`
- Base: `origin/boris/deployment-wrapper-default-gear`
- PR: none
- Change type: Deployment config update / regression tests

## Summary

Added minimal SI-side grouped interleave-control support on top of `boris/deployment-wrapper-default-gear`.

## Changes

- Added `enable_interleave_control=True` defaults to BC training and deploy paths.
- Set `DeploymentConfig.interleave_group="parking"` for parking deployments when interleave control is enabled.
- Preserved existing wrapper selection and did not add the PR 102398 interleave wrapper.
- Left waypoint handling, behavior customization, and zoo deployment wrappers untouched.
- Added focused tests for parking interleave group defaults and the explicit disable path.

## Verification

- `python -c "import ast, pathlib; ..."` syntax check for changed Python files: passed.
- `git diff --check`: passed.
- `bazel test //wayve/ai/si:py_test_test_training_core --test_arg=-k --test_arg=interleave_group`: blocked during analysis by ACR `401 Unauthorized` for `azure-storage/azurite`.
