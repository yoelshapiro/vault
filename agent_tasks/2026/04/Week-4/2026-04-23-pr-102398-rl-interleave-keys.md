# PR 102398 RL interleave driving-controls parity

## Context
Follow-up to PR `#102398` (`03-20-si-group-interleave-control-support`) based on Becky Goldman's review feedback in Slack:

- RL behavior-control exports should include `DrivingControlKey.INITIATE_AUTO_PARKING` in `driving_controls_keys`
- this keeps deploy-time `driving_controls` layout aligned with BC parking interleave exports
- the goal is parity with the BC training path, even though the key is only consumed during deploy / interleave scenarios

Requested scope:
- add the missing RL deployment-config key in `wayve/ai/si/models/offline_rl.py`
- add focused regression coverage for the RL `get_deployment_config()` behavior

## Changes
- Updated [wayve/ai/si/models/offline_rl.py](/tmp/wayve-pr-102398/wayve/ai/si/models/offline_rl.py) so RL behavior-control exports now emit:
  - `DrivingControlKey.DILC_MODE`
  - `DrivingControlKey.INITIATE_AUTO_PARKING`
- Added a focused regression test in [wayve/ai/si/test/models/test_offline_rl.py](/tmp/wayve-pr-102398/wayve/ai/si/test/models/test_offline_rl.py) that asserts:
  - no behavior control -> no driving control keys
  - behavior control -> `(DILC_MODE, INITIATE_AUTO_PARKING)`
  - no duplicate keys are emitted

## Why this change
- PR `#102398` adds deploy-time interleave support for parking/driving model pairing.
- BC training already preserves the expected driving-controls layout for this pairing.
- RL training was still exporting only `DILC_MODE`, which would leave RL behavior-control deploy configs out of sync with the BC parking path Becky called out.

## Validation
- Attempted Bazel verification with:
  - `bazel test //wayve/ai/si:py_test --test_output=errors --test_arg='-k=test_offline_rl_get_deployment_config_driving_controls_keys'`
- Result:
  - Bazel repeatedly remained in large-package analysis for the broad SI `:py_test` target and did not reach test execution in a reasonable iteration window.
- Attempted direct pytest fallback:
  - `pytest ...` was unavailable in the shell
  - `python -m pytest ...` failed because `pytest` is not installed in the active Python environment
  - direct Python import fallback was blocked by missing third-party deps (`lightning`)

## Notes
- Work was done in isolated worktree `/tmp/wayve-pr-102398` to avoid touching the main dirty workspace branch.
- Main workspace changes under `/workspace/WayveCode` were left untouched.
