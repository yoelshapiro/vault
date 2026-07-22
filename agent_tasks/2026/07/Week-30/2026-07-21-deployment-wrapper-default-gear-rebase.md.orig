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

## Parking wrapper follow-up

- Changed parking waypoint enforcement to use the converted `DrivePositionV2` value and the existing `_enforce_gear_position_on_waypoints` helper.
- Removed the now-unused `_enforce_gear_direction_on_waypoints` helper without changing the position helper's clamping implementation.
- Moved final gear selection into `convert_si_output_to_onboard_driving_output`: it emits DRIVE by default and only reads `POLICY_GEAR_POSITION` when `use_gear_position_from_output=True`.
- Enabled output-provided gear only for the parking wrapper and removed gear publication from `_postprocess_waypoints`.
- Updated converter and wrapper regression coverage for default DRIVE, parking opt-in, and waypoint clamping.

### Verification

- Focused converter, waypoint-postprocessing, and parking-wrapper Bazel tests passed.
- Deployment Ruff, Flake8, and type-check targets passed.
- The broader deployment Python test suite passed with the known unrelated stale unsupported-control-key case excluded.
