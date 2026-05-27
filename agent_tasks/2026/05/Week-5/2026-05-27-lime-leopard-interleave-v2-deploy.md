# 2026-05-27 Lime Leopard Interleave V2 Deploy

## Summary
- Source model: `lime-leopard-dreaming`
- Source session: `session_2026_05_24_16_00_04_si_parking_bc_train_release_2026_6_21_pudo621_fix2_80k`
- Source path: `/mnt/remote/azure_session_dir/Parking/parking_bc/session_2026_05_24_16_00_04_si_parking_bc_train_release_2026_6_21_pudo621_fix2_80k`
- Branch: `boris/05-21-updated-pudo-config`
- Commit used locally: `54073ad6f22a6fdd775d2a52286c45b98c1839cb`
- Checkpoint: latest checkpoint index `8`, deployed with `--step 80000`
- Deploy suffix: `__lime-leopard-dreaming_interleave_control_v2`
- Deployed session: `session_2026_05_24_16_00_04_si_parking_bc_train_release_2026_6_21_pudo621_fix2_80k__lime-leopard-dreaming_interleave_control_v2`
- Deployed nickname: `lavender-elegant-gerbil`
- Console URL: `https://console.sso.wayve.ai/model/session_2026_05_24_16_00_04_si_parking_bc_train_release_2026_6_21_pudo621_fix2_80k__lime-leopard-dreaming_interleave_control_v2`
- Deployed checkpoint: `1`
- Checkpoint hash: `3c692f75914f4b0a9f70da1f3efd4305`
- Gen2 artefact id: `96a5914c-7edf-46e1-b7b4-618f155137ac`

## Command
```bash
bazel run //wayve/ai/si:deploy --   --step 80000   --suffix __lime-leopard-dreaming_interleave_control_v2   --upload   --enable_interleave_control   --interleave_control_group parking   --output_dir /tmp/parking-deploy-lime-leopard-dreaming-2   --session_path /mnt/remote/azure_session_dir/Parking/parking_bc/session_2026_05_24_16_00_04_si_parking_bc_train_release_2026_6_21_pudo621_fix2_80k
```

## Results
- Deploy exit code: `0`
- Radar config verification: passed (`radar_data`, five radar features, `points_per_scan=800`)
- Added standard Parking/PUDO Console note: `9066d208-cb78-432f-8725-30dc56c2c411`
- Triggered Buildkite Model CI: `73445` (`https://buildkite.com/wayve-dot-ai/model-ci/builds/73445`)
- Model Catalogue `modelci_builds` did not show the build immediately after trigger.
- Local Buildkite token can create builds but cannot read them (`read_builds` scope missing), so job-level monitoring was blocked.
- Created Notion model-card row: `https://www.notion.so/36d03da5d69a81e48552e1a28baa8709`

## Notes
- First deploy attempt failed because current `deploy.py` converts `/mnt/remote/...` to ABFSS and requires `--output_dir` when suffixing.
- Second deploy attempt failed because forcing `--with_temporal_caching True` injected `video_enable_cache_at_inference` into `wayve.ai.releases.load_pretrained_backbone`. The trained config already has temporal caching enabled, so the successful run omitted the override.
- Non-blocking upload warnings: missing provenance parquet, ONNX artefact validation with skipped ONNX export, and duplicate gen2 model trace upload warning.
