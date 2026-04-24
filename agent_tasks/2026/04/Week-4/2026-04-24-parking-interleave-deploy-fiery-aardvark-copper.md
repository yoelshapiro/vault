# Parking Interleave Deploy: fiery-aardvark-copper

- Date: 2026-04-24
- Branch: `boris/training/kangaroo_with_50_and_route_shorten`
- Source nickname: `fiery-aardvark-copper`
- Source session path: `/mnt/remote/azure_session_dir/Parking/parking_bc/session_2026_04_23_13_18_45_si_parking_bc_train_release_2026_5_11_kangaroo_route_shorten_early_gating_fix_stop_anchor`
- Output session path: `/mnt/remote/azure_session_dir/Parking/parking_bc/session_2026_04_23_13_18_45_si_parking_bc_train_release_2026_5_11_kangaroo_route_shorten_early_gating_fix_stop_anchor__fiery-aardvark-copper_interleave_control_v1`
- Deployed session id: `session_2026_04_23_13_18_45_si_parking_bc_train_release_2026_5_11_kangaroo_route_shorten_early_gating_fix_stop_anchor__fiery-aardvark-copper_interleave_control_v1`
- Assigned deployed nickname: `exotic-jellyfish-silver`
- Console URL: https://console.sso.wayve.ai/model/session_2026_04_23_13_18_45_si_parking_bc_train_release_2026_5_11_kangaroo_route_shorten_early_gating_fix_stop_anchor__fiery-aardvark-copper_interleave_control_v1

## Command
```bash
bazel run //wayve/ai/si:deploy --   --suffix __fiery-aardvark-copper_interleave_control_v1   --with_temporal_caching True   --upload   --enable_interleave_control   --interleave_control_group parking   --session_path /mnt/remote/azure_session_dir/Parking/parking_bc/session_2026_04_23_13_18_45_si_parking_bc_train_release_2026_5_11_kangaroo_route_shorten_early_gating_fix_stop_anchor
```

## Outcome
- Deploy succeeded and uploaded to Console.
- Torchscript saved and uploaded for step `80000`.
- Interleave control enabled for group `parking`.
- Radar verification passed in `gen2_model_inference_config.json`.
- Release-page Notion row for `fiery-aardvark-copper` already contains:
  - `` `fiery-aardvark-copper` <br>Interleave control:<br>`exotic-jellyfish-silver` ``

## Radar verification
Confirmed in output `gen2_model_inference_config.json`:
- `tensor_name = radar_data`
- `radar_features = [RADAR_FEATURE_X_M, RADAR_FEATURE_Y_M, RADAR_FEATURE_Z_M, RADAR_FEATURE_RANGE_RATE_MPS, RADAR_FEATURE_SNR_DB]`
- `points_per_scan = 800`

## Non-blocking warning
The deploy log reported an ONNX artefact metadata validation error during `/session:artefacts_upload` because `onnx_export` was skipped and a `path=None` field was passed into `OnnxExportAsset`. This did not block the main console upload; the deploy still finished successfully.
