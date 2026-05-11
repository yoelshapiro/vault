# Interleave Understeer Helper

- Date: 2026-05-11
- Branch: `03-20-si-group-interleave-control-support`
- PR: 102398
- Change type: Refactor / Test
- Areas: `wayve/ai/zoo/deployment/deployment_wrapper.py`

## Summary

- Extracted deployment-wrapper default understeer lookup into `_default_understeer_coefficient`.
- Updated `_to_onboard_output` to use the helper.
- Updated `ParkingDeploymentWrapperImpl` to call the helper directly before `convert_si_output_to_onboard_driving_output`, so parking-specific waypoint postprocessing does not need to route through `_to_onboard_output`.

## Validation

- `bazel test //wayve/ai/si:test_deployment_wrapper --test_arg='-k=parking_wrapper or parking_deployment_wrapper'` passed.
- After merging `origin/main` at `2a760839c448`, `bazel test //wayve/ai/si:test_deployment_wrapper --test_arg='-k=enforce_gear_position_on_outputs'` passed.
- After merging `origin/main` at `2a760839c448`, `bazel test //wayve/ai/si:test_deployment_wrapper //wayve/ai/zoo/deployment:test_deployment` passed.

## Merge Notes

- Created merge commit `b411db0f47a6` with message `chore: merge origin/main into interleave control branch`.
- Resolved conflicts in `wayve/ai/si/deploy.py`, `wayve/ai/si/models/deployment.py`, `wayve/ai/si/models/offline_rl.py`, and `wayve/ai/zoo/deployment/deployment_wrapper.py`.
- Kept both main's `fill_default_understeer_coefficient_for_vehicle_platform` wiring and the branch's interleave-control deployment args.
- Updated the SI deployment wrapper gear-position test for main's merged contract where `DrivePositionV2.UNKNOWN` is a valid value; retained invalid-value validation coverage.
- A broader SI-core Bazel run was blocked during analysis by ACR auth: `GET returned 401 Unauthorized` for `wayve.azurecr.io/oauth2/token`.
