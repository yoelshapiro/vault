# Deployment Wrapper Default Gear CI Fix

- Date: 2026-06-22
- Branch: `boris/deployment-wrapper-default-gear`
- PR: `#120234`
- Change type: Code change, CI fix
- Areas: `wayve/ai/zoo/deployment`, `wayve/ai/slam/ooc_c2v/deployment`, `wayve/ai/slam/ooc_c2v/interfaces`

## Summary

Added default `policy_gear_position` output coverage for deployment wrappers and fixed the follow-up CI contract issue where the SLAM C2V calibration deployment wrapper repackaged `OnBoardDrivingOutput` but dropped the new gear output.

## Changes

- Added `policy_gear_position` to `DrivingOutputWithCalibration` after `policy_curvature_offset`.
- Returned `onboard.policy_gear_position` from the calibration deployment wrapper.
- Added `DataKeys.POLICY_GEAR_POSITION` to the calibration deployment `MODEL_OUTPUT_KEYS` path via `DRIVING_MODEL_OUTPUT_KEYS`.
- Verified `bazel test //wayve/ai/slam/ooc_c2v/deployment:py_checks --test_output=errors` passed.

## CI

- Pushed fix commit `d2963789af2b` to `boris/deployment-wrapper-default-gear`.
- Fresh Buildkite presubmit run started as build `515231`.
