# Precious Peach Panda Interleave Deploy

- Date: 2026-04-27
- Labels: deploy, parking, interleave-control
- Branch: current workspace branch
- PR: none
- Change type: deployment
- Areas: `wayve/ai/si:deploy`, Model Catalogue, Notion release page

## Summary

Deployed source parking model `precious-peach-panda` with interleave control using suffix `__precious-peach-panda_interleave_control_v1`.

## Inputs

- Source nickname: `precious-peach-panda`
- Source job id: `154721`
- Source session id: `session_2026_04_26_11_58_12_si_parking_bc_train_release_2026_5_11_bc_new_driving_100k`
- Source session path: `/mnt/remote/azure_session_dir/Parking/parking_bc/session_2026_04_26_11_58_12_si_parking_bc_train_release_2026_5_11_bc_new_driving_100k`

## Results

- Output session path: `/mnt/remote/azure_session_dir/Parking/parking_bc/session_2026_04_26_11_58_12_si_parking_bc_train_release_2026_5_11_bc_new_driving_100k__precious-peach-panda_interleave_control_v1`
- Console URL: `https://console.sso.wayve.ai/model/session_2026_04_26_11_58_12_si_parking_bc_train_release_2026_5_11_bc_new_driving_100k__precious-peach-panda_interleave_control_v1`
- Assigned nickname: `tomato-toucan-gorgeous`
- Checkpoint: `model-checkpoint-000100000.ckpt`
- TorchScript: `traces/model-000100000.torchscript`

## Verification

- Source lookup confirmed `precious-peach-panda` maps to the provided source session id.
- Source `full_config.yml` had no `radar_features:` or `max_radar_points_per_scan:` keys, so no `/tmp` overlay was required.
- Radar config verification passed in `gen2_model_inference_config.json`:
  - tensor: `radar_data`
  - features: `RADAR_FEATURE_X_M`, `RADAR_FEATURE_Y_M`, `RADAR_FEATURE_Z_M`, `RADAR_FEATURE_RANGE_RATE_MPS`, `RADAR_FEATURE_SNR_DB`
  - `points_per_scan`: `800`
- Model Catalogue lookup by output session id resolved nickname `tomato-toucan-gorgeous`.
- Notion release row for `precious-peach-panda` updated with related model mapping.

## Warnings

- Codex model-backed sub-agent launch failed because the installed CLI/account rejected configured/tested models before running Bazel; the deploy was run in an isolated spawned bash process with logs in `/tmp/precious_peach_panda_interleave_deploy_v1.log`.
- ONNX artefact upload produced the known non-blocking `OnnxExportAsset path=None` validation error after main console upload succeeded.
- `data_provenance` asset was absent and logged as a warning.
- `stride_sec 0.04 is not a multiple of 0.05s (20Hz)` warning was emitted during inference-config generation.
