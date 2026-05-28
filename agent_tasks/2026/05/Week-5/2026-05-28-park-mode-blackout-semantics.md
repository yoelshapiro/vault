# 2026-05-28 Park Mode Blackout Semantics

- Branch: `boris/05-21-updated-pudo-config`
- PR: N/A
- Change type: Code fix / regression test
- Areas: `/workspace/WayveCode/wayve/ai/si/datamodules/parking.py`, `/workspace/WayveCode/wayve/ai/si/datamodules/test/test_parking_unit.py`

## Summary

- Changed `park_mode_blackout_probability=0.0` so it preserves the explicit `enable_park_mode_in_parking_state` and `enable_park_mode_in_parked_state` arguments.
- Kept the existing sampled override behavior for `park_mode_blackout_probability > 0.0`.
- Updated the parking unit regression test to verify `p=0` respects the configured park-mode flag while keeping route-shortening available.

## Verification

- `bazel test //wayve/ai/si/datamodules:py_test --test_arg=wayve/ai/si/datamodules/test/test_parking_unit.py --test_output=errors`
- `bazel test //wayve/ai/si/datamodules:py_lint_ruff --test_output=errors`
