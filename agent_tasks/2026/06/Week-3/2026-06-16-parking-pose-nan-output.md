# 2026-06-16 - Parking Pose NaN Output Shape

- Topic: Fix parking deployment wrapper output shape for missing `POLICY_PARKING_POSE`.
- Labels: parking, deployment, DMI, torchscript, regression-test.
- Branch: `boris/training/main_cherrypick_generic_data`.
- PR: none.
- Change type: Bug fix.
- Areas:
  - `/workspace/WayveCode/wayve/ai/zoo/deployment/deployment_wrapper.py`
  - `/workspace/WayveCode/wayve/ai/si/test/interfaces/test_deployment_wrapper.py`

## Problem

The parking wrapper was returning the generic optional-none tensor token for missing `policy_parking_pose`. On car, `PolicyParkingPoseDetensorizer` received that as an empty tensor layout and failed shape validation:

```text
InferenceNodeAdapter::processInboxAndRunForwardPass: PolicyParkingPoseDetensorizer: Invalid tensor shape. Expected [B, N, 8], got [0, 0, 0]
```

The detensorizer already filters invalid parking proposals when the tensor has the correct `[B, N, 8]` shape and contains NaN values, so the producer should preserve the shape contract instead of emitting an empty optional token.

## Changes

- Restored `policy_parking_pose` in `DrivingOutputWithGearOutput`.
- Added `_parking_pose_or_nan`:
  - missing pose -> `[B, 1, 8]` float32 NaNs on the correct device.
  - model pose `[B, 8]` -> `[B, 1, 8]`.
  - model pose `[B, N, 8]` -> float32 pass-through.
- Restored the path outputs with `_path_output_or_empty`:
  - missing path tensor -> `[B, 0]` float32 no-op output, matching default `num_path_waypoints=0`.
  - model path tensor `[B]` -> `[B, 1]`.
  - model path tensor `[B, Fp]` -> float32 pass-through.
- Added wrapper regression coverage for missing parking pose and real `[B, 8]` parking pose output, including a TorchScript case.
- Added wrapper regression coverage for missing path outputs and real path tensor pass-through.

## Verification

```bash
bazel test //wayve/ai/si:test_deployment_wrapper --test_arg=-k --test_arg=parking_deployment_wrapper --test_output=errors
```

Result: passed.
