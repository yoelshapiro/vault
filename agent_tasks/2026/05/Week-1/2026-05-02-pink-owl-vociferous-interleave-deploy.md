# Pink Owl Vociferous Interleave Deploy

## Summary

Ran the requested narrow Parking/PUDO interleave-control deploy for:

- Source model: `pink-owl-vociferous`
- Source session: `/mnt/remote/azure_session_dir/Parking/parking_bc/session_2026_04_30_19_00_22_si_parking_bc_train_gear_indicator_gi_parking_aug_retry`
- Step: `100000`
- Suffix: `__pink-owl-vociferous_interleave_control_v1`
- Branch/commit: `boris/pudo_w_route_path_fixes_and_new_data` at `572153f43429f9bf8a8841007bee2cbdf55c4d3f`

The deploy succeeded with the original `v1` suffix. No suffix-collision retry was needed.

## Result

- Output session path: `/mnt/remote/azure_session_dir/Parking/parking_bc/session_2026_04_30_19_00_22_si_parking_bc_train_gear_indicator_gi_parking_aug_retry__pink-owl-vociferous_interleave_control_v1`
- Console URL: `https://console.sso.wayve.ai/model/session_2026_04_30_19_00_22_si_parking_bc_train_gear_indicator_gi_parking_aug_retry__pink-owl-vociferous_interleave_control_v1`
- Session id: `session_2026_04_30_19_00_22_si_parking_bc_train_gear_indicator_gi_parking_aug_retry__pink-owl-vociferous_interleave_control_v1`
- Assigned nickname: `observant-yak-silver`
- Deployed checkpoint: `100000` / `model-checkpoint-000100000.ckpt`

## Radar Verification

Checked:

```bash
rg -n -C 3 '"tensor_name": "radar_data"|"radar_features"|"points_per_scan"' /mnt/remote/azure_session_dir/Parking/parking_bc/session_2026_04_30_19_00_22_si_parking_bc_train_gear_indicator_gi_parking_aug_retry__pink-owl-vociferous_interleave_control_v1/gen2_model_inference_config.json
```

Result: passed.

The exported config contains:

- `"tensor_name": "radar_data"`
- `RADAR_FEATURE_X_M`
- `RADAR_FEATURE_Y_M`
- `RADAR_FEATURE_Z_M`
- `RADAR_FEATURE_RANGE_RATE_MPS`
- `RADAR_FEATURE_SNR_DB`
- `"points_per_scan": 800`

It also includes interleave control with `INTERLEAVE_GROUP_PARKING`.

## Warnings

- Non-fatal `git_hash_mismatch`; deploy continued.
- `stride_sec 0.04 is not a multiple of 0.05s`.
- Missing data provenance asset: `provenance/all_ranks.snappy.parquet`.
- `gen2_model_trace` already uploaded warning.
- Non-blocking ONNX artefact upload validation error because ONNX path was `None`.

The final deploy log reported successful console upload. No Model CI, licensing, Notion, release notes, or repository edits were triggered.
