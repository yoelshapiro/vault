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
- Deployed checkpoint: `1`
- Deployed checkpoint hash: `448986966b9a0223d97efe464660b284`
- Gen2 artefact id: `60a6ce13-b334-42e7-972f-95f182787b14`

## Post-Deploy Actions

- Added standard Parking/PUDO model note:
  - note id: `55054af1-79c8-4b1d-89fe-a3964cb95899`
  - note: `Parking/PUDO model`, deployed with interleave control group `parking`, based on trained model `unflappable-azure-sea-cucumber`
- Triggered Gen2 AV Mache Alpha 3 Model CI:
  - build number: `69400`
  - build id: `019ddab4-b748-43d6-92c9-4b8e6079c523`
  - initial observed job status: `Model Deployment Archive Gen2` was `in_progress`
- Triggered parking follow-up Eval Studio suites:
  - `Failed to Unpudo Standstill(No Indicator)`: execution `2f65b4c9-6cda-4fd5-97ad-927944a3413a`, `IN_PROGRESS`, `0/1274` completed, `0` errored at first poll
  - `[MB] Failure to Accel from Stopped`: execution `ba876483-f43b-4ad9-a609-d090d6446a6c`, `IN_PROGRESS`, `0/696` completed, `0` errored at first poll
  - Note: AI Lab also showed execution `bfe7d318-9625-4e18-a039-895b301b8075` for `Failed to Unpudo Standstill(No Indicator)` created around the same trigger window.
- Created the UK licensing experiment:
  - experiment id: `583c3265-aec3-465b-b1b6-1704db46daf9`
  - experiment index: `25576`
  - Console URL: `https://console.sso.wayve.ai/on-road-experiments/583c3265-aec3-465b-b1b6-1704db46daf9`
  - template: `[UK] PUDO Licensing`
  - template id: `1faea8e5-b080-43b8-ab41-0ef364d57236`
  - vehicle model: `gen2-av-mache-alpha3`
  - status: `pending_approval`

## Warnings

- Non-blocking ONNX artefact upload error at `/session:artefacts_upload`: `OnnxExportAsset.path` was `None`; deploy still reported console upload success.
- `data_provenance` asset was missing: `provenance/all_ranks.snappy.parquet` did not exist.
- `gen2_model_trace` was reported as already uploaded and was not reuploaded.
- Deploy warned: `stride_sec 0.04 is not a multiple of 0.05s (20Hz)`.
