# Gear Wrapper Rollback (Parking + Interleave Only)

## Context
User requested rollback of broad `vehicle_gear_position` input/output propagation across deployment wrappers, keeping gear handling only for:
- `ParkingDeploymentWrapperImpl`
- interleave-control wrapper path (`enable_interleave_control=True`)

Also required:
- waypoint handling remains active for both parking and interleave paths
- invalid gear values remain rejected to prevent incident recurrence

## Code changes
- Restored legacy generic waypoint postprocessing path for non-parking wrappers:
  - `DeploymentWrapperBase._clamp_waypoints_for_direction`
  - `DeploymentWrapperBase._postprocess_waypoints`
- Removed broad gear dependency from non-parking wrapper `_forward_with_additional_inputs(...)` signatures and switched their waypoint postprocess back to `_postprocess_waypoints`.
- Kept and hardened interleave gear handling:
  - `_validate_drive_position_tensor`
  - `_latest_validated_vehicle_gear_position`
  - `_enforce_gear_position_on_waypoints`
  - `_wrap_with_interleave_control`
- Updated `_wrap_with_interleave_control` to:
  - clamp `policy_waypoints` using gear in interleave mode
  - preserve `base_output.policy_gear_position` when provided (parking-interleave path)
  - use predicted policy gear (when available) for driving interleave forward-gear gating as well
  - validate `policy_gear_position` values when present
  - otherwise fall back to latest validated `vehicle_gear_position`
- Preserved parking-wrapper gear input path (`vehicle_gear_position`) and parking-specific postprocessing.
- Restored `VehicleGearDirection` import required by parking wrapper conversions.

## Test updates
- Removed temporary `vehicle_gear_position` test fixture input from:
  - `wayve/ai/si/test/interfaces/test_lss_wrapper.py`
- Updated interleave test to construct a valid base output with gear field:
  - `wayve/ai/zoo/deployment/test/test_interleave_control_wrapper.py`
  - added regression test that driving interleave uses predicted gear for both handover decision and waypoint clamp
- Updated safety wrapper test fixture to stop passing removed gear kwarg:
  - `wayve/ai/zoo/deployment/test/test_safety_wrapper.py`

## Validation
Executed locally:
- `bazel test //wayve/ai/si:test_lss_wrapper` ✅
- `bazel test //wayve/ai/si:test_deployment_wrapper` ✅
- `bazel test //wayve/ai/zoo/deployment:test_deployment_py_test --test_arg='-k=parking_uses_policy_gear_position_from_base_output or initialization_and_forward'` ✅
- `bazel test //wayve/ai/zoo/deployment:test_deployment_py_test` ✅

## Result
Rollback is local and unpushed. Current state matches user intent: no global gear input/output requirement, parking and interleave still enforce gear-aware waypoint behavior, and invalid gear values are still rejected in active gear paths.
