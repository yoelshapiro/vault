# 2026-06-28 Aquamarine Gear Latch Redeploy

## Summary

Redeployed `aquamarine-quizzical-kingfisher` from its training commit with parking end-of-route hazard lights and gear latch enabled.

## Source Model

- Source nickname: `aquamarine-quizzical-kingfisher`
- Source session: `session_2026_06_24_20_21_51_g50lr5k3`
- Source commit: `7d3b356add696f8499d71bf0e6f6221229393bf9`
- Checkpoint: `100000` (`model-checkpoint-000100000.ckpt`)

## Branch

- Branch: `boris/redeploy-aquamarine-gear-latch`
- Commit: `fc28134404d81f31753544b294fb1577b3c11a55`
- Change: set `ParkingDeploymentWrapperImpl` defaults:
  - `enable_end_of_route_hazard_lights=True`
  - `enable_end_of_route_gear_latch=True`

## Deploy

Command:

```bash
bazel run //wayve/ai/si:deploy -- --suffix __aquamarine_gear_latch_on_v1 --output_dir /tmp/aquamarine_gear_latch_on_v1 --with_temporal_caching True --upload --enable_interleave_control --interleave_control_group parking --session_path /mnt/remote/azure_session_dir/Parking/parking_bc/session_2026_06_24_20_21_51_g50lr5k3
```

Output:

- Deployed session: `session_2026_06_24_20_21_51_g50lr5k3__aquamarine_gear_latch_on_v1`
- Deployed nickname: `magnetic-songbird-aquamarine`
- Console: https://console.sso.wayve.ai/model/session_2026_06_24_20_21_51_g50lr5k3__aquamarine_gear_latch_on_v1
- Interleave group: `INTERLEAVE_GROUP_PARKING`
- Gen2 radar config verified:
  - `points_per_scan=800`
  - radar features: X/Y/Z/range-rate/SNR

## Validation

- `git diff --check` passed.
- `bazel test //wayve/ai/si:test_deployment_wrapper` failed in two pre-existing-looking tests that call missing `DeploymentWrapper._clamp_waypoints_for_direction`; 71 tests passed, including parking hazard/gear-latch tests.
- Deploy upload succeeded. The script emitted a non-fatal ONNX artefact validation error after upload because ONNX export was skipped, then logged successful Console upload.
