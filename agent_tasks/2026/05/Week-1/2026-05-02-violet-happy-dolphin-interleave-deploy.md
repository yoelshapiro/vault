# Violet Happy Dolphin Interleave Deploy

## Summary

Ran the requested narrow interleave-control deploy for:

- Source session: `/mnt/remote/azure_session_dir/Parking/parking_bc/session_2026_04_30_19_28_13_si_parking_bc_train_gear_indicator_wonjoon_full_aug`
- Step: `100000`
- Suffix: `__violet-happy-dolphin_interleave_control_v1`

The deploy succeeded with the original `v1` suffix. No suffix-collision retry was needed.

## Result

- Output session path: `/mnt/remote/azure_session_dir/Parking/parking_bc/session_2026_04_30_19_28_13_si_parking_bc_train_gear_indicator_wonjoon_full_aug__violet-happy-dolphin_interleave_control_v1`
- Console URL: `https://console.sso.wayve.ai/model/session_2026_04_30_19_28_13_si_parking_bc_train_gear_indicator_wonjoon_full_aug__violet-happy-dolphin_interleave_control_v1`
- Session id: `session_2026_04_30_19_28_13_si_parking_bc_train_gear_indicator_wonjoon_full_aug__violet-happy-dolphin_interleave_control_v1`
- Assigned nickname: `goose-fierce-crimson`
- Deployed checkpoint: `100000` / `model-checkpoint-000100000.ckpt`

## Radar Verification

Checked:

```bash
rg -n -C 3 '"tensor_name": "radar_data"|"radar_features"|"points_per_scan"' /mnt/remote/azure_session_dir/Parking/parking_bc/session_2026_04_30_19_28_13_si_parking_bc_train_gear_indicator_wonjoon_full_aug__violet-happy-dolphin_interleave_control_v1/gen2_model_inference_config.json
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

## Warnings

- Non-blocking ONNX artefact upload error: `OnnxExportAsset path Input should be a valid string`.
- Main console upload still succeeded.
- `stride_sec 0.04 is not a multiple of 0.05s (20Hz)`.
- Missing data provenance asset: `provenance/all_ranks.snappy.parquet`.
- `gen2_model_trace` already uploaded warning.
- Startup/runtime warnings for Datadog setup, torchao C++ extension import, non-optimized attention projections, MonkeyType not installed, and TorchScript type annotations.

No CI, licensing, Notion, release notes, or repository edits were triggered.
