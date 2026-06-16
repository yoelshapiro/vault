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

## Redeploy

Redeployed `amaranth-kestrel-charming` from branch `boris/training/main_cherrypick_generic_data` after committing and pushing the fix:

- Commit: `0892f60b1ef6` (`fix: keep parking optional outputs shape-valid`)
- Source session: `session_2026_06_11_20_44_02_gp8n100k4`
- Source checkpoint step: `100000`
- Deploy suffix: `__amaranth-kestrel-charming_no_eor_latch_indicators_no_interleave_v2`
- Deployed session: `session_2026_06_11_20_44_02_gp8n100k4__amaranth-kestrel-charming_no_eor_latch_indicators_no_interleave_v2`
- Deployed nickname: `adventurous-beaver-white`
- Console: https://console.sso.wayve.ai/model/session_2026_06_11_20_44_02_gp8n100k4__amaranth-kestrel-charming_no_eor_latch_indicators_no_interleave_v2
- Gen2 artefact id: `d75cc989-71ed-4c64-b70f-4562003add38`
- Checkpoint hash: `b41ef5e54c36d6739ce2c7ec441815a8`

Deploy command:

```bash
bazel run //wayve/ai/si:deploy -- \
  --session_path abfss://training-session-store@wayveprodmlexperiments.dfs.core.windows.net/Parking/parking_bc/session_2026_06_11_20_44_02_gp8n100k4 \
  --output_dir /workspace/parking_deploy_outputs \
  --suffix __amaranth-kestrel-charming_no_eor_latch_indicators_no_interleave_v2 \
  --with_temporal_caching True \
  --upload \
  --target-vehicle-models gen2-av-mache-alpha3
```

Notes:

- No interleave control flag was passed.
- Wrapper kwargs did not include route-end hazard/gear-latch overrides, so the pushed defaults (`False`) apply.
- Verified `gen2_model_inference_config.json` has radar features X/Y/Z/range-rate/SNR and `points_per_scan=800`.
- Verified output entries include `policy_parking_pose`, `policy_path_distance`, `policy_path_position_forward`, and `policy_path_position_left`; path outputs have `num_path_waypoints=0`.
- Immediate Model CI polls returned no build records yet; upload request included `model_ci_config.enabled=true` for `gen2-av-mache-alpha3`.
