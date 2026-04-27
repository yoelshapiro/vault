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

## Parking Deploy Skill Live End-To-End Test

- Ran a fresh interleave-control deployment through a spawned sub-agent using suffix `__precious-peach-panda_interleave_control_v2`.
- Source model and checkpoint:
  - trained nickname: `precious-peach-panda`
  - source session id: `session_2026_04_26_11_58_12_si_parking_bc_train_release_2026_5_11_bc_new_driving_100k`
  - latest source checkpoint: `10`
  - deploy step: `100000`
- Deployment result:
  - output session id: `session_2026_04_26_11_58_12_si_parking_bc_train_release_2026_5_11_bc_new_driving_100k__precious-peach-panda_interleave_control_v2`
  - output session path: `/mnt/remote/azure_session_dir/Parking/parking_bc/session_2026_04_26_11_58_12_si_parking_bc_train_release_2026_5_11_bc_new_driving_100k__precious-peach-panda_interleave_control_v2`
  - deployed nickname: `yellow-iguana-healthy`
  - Console URL: `https://console.sso.wayve.ai/model/session_2026_04_26_11_58_12_si_parking_bc_train_release_2026_5_11_bc_new_driving_100k__precious-peach-panda_interleave_control_v2`
  - deployed checkpoint: `1`
  - deployed checkpoint hash: `6ec65bc7023ed6e58d8fa5e5e7260c2d`
  - deployed `gen2` artefact id: `720b60f1-9b70-40f0-9964-fdd71c19e54f`
  - TorchScript: `traces/model-000100000.torchscript`
  - deploy log: `/tmp/precious_peach_panda_interleave_deploy_v2.log`
- Radar config verification passed in `gen2_model_inference_config.json`:
  - tensor: `radar_data`
  - features: `RADAR_FEATURE_X_M`, `RADAR_FEATURE_Y_M`, `RADAR_FEATURE_Z_M`, `RADAR_FEATURE_RANGE_RATE_MPS`, `RADAR_FEATURE_SNR_DB`
  - `points_per_scan`: `800`
- Added the standard Console note:
  - note id: `a335a59d-a555-421a-ae93-57d1657f2b6a`
  - note: `Parking/PUDO model`, deployed with interleave control group `parking`, based on trained model `precious-peach-panda`
- Triggered Gen2 AV Mache Alpha 3 Model CI:
  - build number: `69079`
  - build id: `019dce2e-0976-43f0-b82f-74cbe5ae7e81`
  - current observed status: `Model Deployment Archive Gen2` is `success`; `Eval Studio (Gen 2 Alpha 3)` is `success`; `Gen2 Alpha3 HiL Model Validation` is `in_progress`; downstream `Targeted Suites` and `Gen 2 Alpha3 License` were not yet materialized at the last poll.
  - generic Alpha 3 Eval Studio suite execution: `261d44af-43cd-424c-b733-fdf3593a2ece`
- Triggered the required parking follow-up Eval Studio suites:
  - `Failed to Unpudo Standstill(No Indicator)`: execution `9a914afa-a1d0-4604-a2e1-629e74cedbc9`, `IN_PROGRESS`, `0/1274` completed, `0` errored at `2026-04-27T09:03:59.140Z`
  - `[MB] Failure to Accel from Stopped`: execution `75854d93-8e77-4c17-b270-894b44183349`, `IN_PROGRESS`, `0/581` completed, `0` errored at `2026-04-27T09:03:59.733Z`
- Created the UK licensing experiment:
  - experiment id: `45f938eb-3a3e-4708-9bb4-6c4cc24a5686`
  - experiment index: `25257`
  - Console URL: `https://console.sso.wayve.ai/on-road-experiments/45f938eb-3a3e-4708-9bb4-6c4cc24a5686`
  - template: `[UK] PUDO Licensing`
  - template id: `1faea8e5-b080-43b8-ab41-0ef364d57236`
  - vehicle model: `gen2-av-mache-alpha3`
  - status: `pending_approval`

## Warnings

- Codex model-backed sub-agent launch failed because the installed CLI/account rejected configured/tested models before running Bazel; the deploy was run in an isolated spawned bash process with logs in `/tmp/precious_peach_panda_interleave_deploy_v1.log`.
- ONNX artefact upload produced the known non-blocking `OnnxExportAsset path=None` validation error after main console upload succeeded.
- `data_provenance` asset was absent and logged as a warning.
- `stride_sec 0.04 is not a multiple of 0.05s (20Hz)` warning was emitted during inference-config generation.
