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
