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

## Parking Deploy Skill Test

- Confirmed the source model latest checkpoint is `10`; checkpoint 10 has hash `1dec7ef02e0abc9a5e270cf02cc71983`.
- Reused the existing interleave-control deployment instead of creating a duplicate deployment:
  - deployed session id: `session_2026_04_26_11_58_12_si_parking_bc_train_release_2026_5_11_bc_new_driving_100k__precious-peach-panda_interleave_control_v1`
  - deployed nickname: `tomato-toucan-gorgeous`
  - deployed checkpoint: `1`
  - deployed `gen2` artefact id: `2f40b527-2562-41c4-bf8c-e7e7ec7025bf`
- Added the standard Console note:
  - note id: `66650b51-8dff-45d2-8c5b-3b95eb5c91dc`
  - note: `Parking/PUDO model`, deployed with interleave control group `parking`, based on trained model `precious-peach-panda`
- Confirmed existing Gen2 AV Mache Alpha 3 Model CI build `69068` for the deployed artefact was already successful:
  - `Model Deployment Archive Gen2`: `success`
  - `Eval Studio (Gen 2 Alpha 3)`: `success`
  - `Gen2 Alpha3 HiL Model Validation`: `success`
  - `Gen 2 Alpha3 License`: `success`
  - No `Targeted Suites` job was present in the returned build metadata.
- Triggered the required parking follow-up Eval Studio suites:
  - `Failed to Unpudo Standstill(No Indicator)`: execution `2ec84534-e879-4550-8807-42b31959d029`, `IN_PROGRESS`, `0/1274` completed, `0` errored at `2026-04-27T08:44:26.935Z`
  - `[MB] Failure to Accel from Stopped`: execution `123f06b8-d2aa-4bb8-a0dc-2d23345a4673`, `IN_PROGRESS`, `0/581` completed, `73` errored at `2026-04-27T08:47:51.141Z`
- UK licensing experiment was not created because it was not requested.

## Warnings

- Codex model-backed sub-agent launch failed because the installed CLI/account rejected configured/tested models before running Bazel; the deploy was run in an isolated spawned bash process with logs in `/tmp/precious_peach_panda_interleave_deploy_v1.log`.
- ONNX artefact upload produced the known non-blocking `OnnxExportAsset path=None` validation error after main console upload succeeded.
- `data_provenance` asset was absent and logged as a warning.
- `stride_sec 0.04 is not a multiple of 0.05s (20Hz)` warning was emitted during inference-config generation.
