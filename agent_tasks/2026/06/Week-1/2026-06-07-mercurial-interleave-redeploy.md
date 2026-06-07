# 2026-06-07 Mercurial Interleave Redeploy

- Branch/worktree: `boris/parking-past30-no-standstill-gear-aug/guy_recipe_gear_root` at `/workspace/guy_recipe_gear_root`
- Source model: `mercurial-sapphire-jellyfish`
- Source session: `session_2026_06_06_22_07_21_guyroot`
- Deployed model: `contemplative-gold-lion`
- Deployed session: `session_2026_06_06_22_07_21_guyroot__mercurial-sapphire-jellyfish_interleave_control_v3`
- Checkpoint: 100K / `model-checkpoint-000100000.ckpt`
- Gen2 artefact: `7d88122c-6532-47bd-8cf2-d8658ceb333b`
- Console: https://console.sso.wayve.ai/model/session_2026_06_06_22_07_21_guyroot__mercurial-sapphire-jellyfish_interleave_control_v3

## Result

- Deployed with `--enable_interleave_control --interleave_control_group parking`.
- Temporal caching was enabled.
- Verified Gen2 radar config has X/Y/Z/range-rate/SNR and `points_per_scan=800`.
- Updated the Parking/PUDO Notion model-card row from the source nickname to the deployed nickname and appended deployment details.

## Retry Notes

- `v1` failed while closing a trace file on `/mnt/remote` with `OSError: [Errno 5] Input/output error`.
- `v2` used `/tmp/parking_deploy_output` and failed with `OSError: [Errno 28] No space left on device`.
- Cleaned the generated failed `/tmp/parking_deploy_output`.
- `v3` used `/workspace/parking_deploy_output` and uploaded successfully.
- Deploy emitted the known non-fatal ONNX artefact validation warning after successful Console upload because ONNX export was skipped.
