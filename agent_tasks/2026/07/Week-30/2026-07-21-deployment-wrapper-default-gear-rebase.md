# Deployment Wrapper Default Gear Rebase

- Date: 2026-07-21
- Branch: `boris/deployment-wrapper-default-gear`
- PR: `#120234` - Add default gear output to deployment wrappers
- Base: `origin/main` at `400fe22d2faa`
- New head: `e8b53a634c58`

## Outcome

Rebased the branch's 11 commits onto current `origin/main` and force-pushed the rewritten history with lease protection.

## Conflict resolutions

- `wayve/ai/si/models/deployment.py`: removed the obsolete shift-by-wire rejection while retaining current SILC wrapper validation.
- `wayve/ai/si/test/interfaces/test_lss_wrapper.py`: retained device-aware tensors and used the `DrivePositionV2` constant for the default gear.
- `wayve/ai/zoo/deployment/deployment_wrapper.py`: retained current two-buffer understeer LUT handling and added the branch's four gear-position buffers.
- `wayve/ai/zoo/deployment/behavior_customization.py`: preserved SILC control handling and accepted the shift-by-wire control key.
- `wayve/ai/si/test/interfaces/test_deployment_wrapper.py`: retained both current ONNX helpers and the branch's deployment-model helper import.

## Verification

- A bounded `git range-diff --no-patch` mapped all 11 original commits to all 11 rebased commits in order.
- `git diff --check origin/main...HEAD` passed.
- `git rev-list --left-right --count origin/main...HEAD` reports `0 11`.
- Tests were not run because a separate unstaged edit appeared in `wayve/ai/zoo/deployment/deployment_wrapper.py` after the rebase; it was left untouched.

## Handoff

- Local and remote `boris/deployment-wrapper-default-gear` both point to `e8b53a634c58`.
- PR #120234 now uses the rebased history.
- Preserve or reconcile the unstaged wrapper edit before running tests or switching branches.
