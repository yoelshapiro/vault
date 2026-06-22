# 2026-06-22 SI Group Interleave Control Support

- Branch: `06-22-si-group-interleave-control-support`
- Worktree: `/workspace/.codex-borisindelman/worktrees/06-22-si-group-interleave-control-support`
- Base: `origin/boris/deployment-wrapper-default-gear`
- PR: https://github.com/wayveai/WayveCode/pull/120390
- Change type: Deployment wrapper output / config update / regression tests

## Summary

Added SI-side grouped interleave-control support on top of `boris/deployment-wrapper-default-gear`,
including the default `interleave_control` output tensor and group metadata.

## Changes

- Added `enable_interleave_control=True` defaults to BC, TD3 offline-RL, BC+TD3 offline-RL, and deploy paths.
- Set `DeploymentConfig.interleave_group="parking"` for parking deployments when interleave control is enabled.
- Set `model.interleave_control_group` from the resolved deployment interleave group.
- Added generated-wrapper support to append `interleave_control` to the forward return `NamedTuple`.
- Preserved `policy_gear_position` from the default-gear output and used it for baseline interleave gating.
- Added parking-group handover logic: end-of-route or speed at/below 5 mph.
- Added baseline-group logic: not end-of-route and effective gear is DRIVE.
- Left waypoint handling, behavior customization, and driving controls untouched.
- Added focused tests for wrapper output inference, parking handover logic, parking group defaults, offline-RL forwarding, and the explicit disable path.
- Fixed `check_models_match` so bool outputs such as `interleave_control` compare by exact equality instead of entering numeric diff math.
- Added regression tests for matching and mismatching bool deployment outputs.

## Verification

- `PYTHONPYCACHEPREFIX=/tmp/codex_pycache python -m py_compile ...`: passed.
- `git diff --check`: passed.
- Stubbed codegen import/generation checks for interleave return-type mechanics: passed.
- `bazel test //wayve/ai/zoo/deployment:test_deployment --test_arg=-k --test_arg=interleave_control //wayve/ai/si:py_test_test_training_core --test_arg=-k --test_arg=interleave_group`: blocked during analysis by `No space left on device` under `/workspace/.cache/bazel`.
- Freed generated Bazel cache space/inodes after the workspace filled up during CI verification.
- `bazel test //wayve/ai/lib:test_deploy --test_output=errors`: passed.
- Pushed amended PR commit `ec7f3d5f9af2`; fresh Buildkite presubmit `515296` is still running.
