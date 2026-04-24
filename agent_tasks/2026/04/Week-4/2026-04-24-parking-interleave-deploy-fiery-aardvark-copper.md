# Parking interleave deploy for fiery-aardvark-copper

- Date: 2026-04-24
- Branch: `boris/training/kangaroo_with_50_and_route_shorten`
- Change type: operations
- Source nickname: `fiery-aardvark-copper`
- Source session id: `session_2026_04_23_13_18_45_si_parking_bc_train_release_2026_5_11_kangaroo_route_shorten_early_gating_fix_stop_anchor`
- Source session path: `/mnt/remote/azure_session_dir/Parking/parking_bc/session_2026_04_23_13_18_45_si_parking_bc_train_release_2026_5_11_kangaroo_route_shorten_early_gating_fix_stop_anchor`
- Source console URL: `https://console.sso.wayve.ai/model/session_2026_04_23_13_18_45_si_parking_bc_train_release_2026_5_11_kangaroo_route_shorten_early_gating_fix_stop_anchor`
- Checked config keys: `radar_features`, `max_radar_points_per_scan`
- Overlay needed: no
- Deploy suffix: `__fiery-aardvark-copper_interleave_control_v1`
- Output session path: `/mnt/remote/azure_session_dir/Parking/parking_bc/session_2026_04_23_13_18_45_si_parking_bc_train_release_2026_5_11_kangaroo_route_shorten_early_gating_fix_stop_anchor__fiery-aardvark-copper_interleave_control_v1`
- Output session id: `session_2026_04_23_13_18_45_si_parking_bc_train_release_2026_5_11_kangaroo_route_shorten_early_gating_fix_stop_anchor__fiery-aardvark-copper_interleave_control_v1`
- Assigned interleave nickname: `exotic-jellyfish-silver`
- Output console URL: `https://console.sso.wayve.ai/model/session_2026_04_23_13_18_45_si_parking_bc_train_release_2026_5_11_kangaroo_route_shorten_early_gating_fix_stop_anchor__fiery-aardvark-copper_interleave_control_v1`
- Radar verification: passed
- Notion updated: yes

## Notes

- Source `full_config.yml` did not contain `radar_features` or `max_radar_points_per_scan`, so the source session was deployed directly without a `/tmp` overlay.
- Deploy completed successfully through checkpoint load, torchscript save, and console upload.
- The expected non-blocking ONNX artefact validation error occurred during `/session:artefacts_upload` because `path=None` for `OnnxExportAsset`; the main model upload still succeeded.
- `gen2_model_inference_config.json` in the output session includes radar input with features `[X_M, Y_M, Z_M, RANGE_RATE_MPS, SNR_DB]` and `points_per_scan: 800`.
- Parking/PUDO release row for `fiery-aardvark-copper` was updated so `Related models` is exactly ``fiery-aardvark-copper` <br>Interleave control:<br>`exotic-jellyfish-silver` ``.
