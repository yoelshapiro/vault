# Unflappable Azure Sea Cucumber Interleave Deploy

## Summary

Deployed the trained Parking/PUDO source model `unflappable-azure-sea-cucumber` as an interleave-control export from checkpoint 8 / step `80000`.

## Source

- Source nickname: `unflappable-azure-sea-cucumber`
- Source session id: `session_2026_04_29_08_18_36_si_parking_bc_train_release_2026_5_11_dir_unpudo_unpark_replicated_50_25_20_5`
- Source session path: `/mnt/remote/azure_session_dir/Parking/parking_bc/session_2026_04_29_08_18_36_si_parking_bc_train_release_2026_5_11_dir_unpudo_unpark_replicated_50_25_20_5`
- Checkpoint: Model Catalogue checkpoint `8`, file `model-checkpoint-000080000.ckpt`, deployed with `--step 80000`
- Radar overlay: not needed; source `full_config.yml` did not contain `radar_features:` or `max_radar_points_per_scan:`

## Command

```bash
bazel run //wayve/ai/si:deploy -- \
  --step 80000 \
  --suffix __unflappable-azure-sea-cucumber_interleave_control_checkpoint8_v1 \
  --with_temporal_caching True \
  --upload \
  --enable_interleave_control \
  --interleave_control_group parking \
  --session_path /mnt/remote/azure_session_dir/Parking/parking_bc/session_2026_04_29_08_18_36_si_parking_bc_train_release_2026_5_11_dir_unpudo_unpark_replicated_50_25_20_5
```

## Result

- Upload succeeded: yes
- Suffix collision: none; `_v1` succeeded and no retry was needed
- Output session path: `/mnt/remote/azure_session_dir/Parking/parking_bc/session_2026_04_29_08_18_36_si_parking_bc_train_release_2026_5_11_dir_unpudo_unpark_replicated_50_25_20_5__unflappable-azure-sea-cucumber_interleave_control_checkpoint8_v1`
- Output session id: `session_2026_04_29_08_18_36_si_parking_bc_train_release_2026_5_11_dir_unpudo_unpark_replicated_50_25_20_5__unflappable-azure-sea-cucumber_interleave_control_checkpoint8_v1`
- Actual assigned nickname: `mollusk-teal-terrestrial`
- Console URL: `https://console.sso.wayve.ai/model/session_2026_04_29_08_18_36_si_parking_bc_train_release_2026_5_11_dir_unpudo_unpark_replicated_50_25_20_5__unflappable-azure-sea-cucumber_interleave_control_checkpoint8_v1`

## Warnings

- Non-blocking ONNX artefact upload error at `/session:artefacts_upload`: `OnnxExportAsset.path` was `None`; deploy still reported console upload success.
- `data_provenance` asset was missing: `provenance/all_ranks.snappy.parquet` did not exist.
- `gen2_model_trace` was reported as already uploaded and was not reuploaded.
- Deploy warned: `stride_sec 0.04 is not a multiple of 0.05s (20Hz)`.

## Scope

No Model CI, notes, evals, experiments, Notion updates, commits, or PR actions were triggered.
