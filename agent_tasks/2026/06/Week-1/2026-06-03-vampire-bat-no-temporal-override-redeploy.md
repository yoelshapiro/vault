# 2026-06-03 Vampire Bat No Temporal Override Redeploy

## Summary
- Reverted the two temporal-cache deploy compatibility commits locally.
- Redeployed `vampire-bat-ardent-emerald` without `--with_temporal_caching True`.
- New deployed nickname: `cheeky-amethyst-caribou`.

## Reverts
- `8c5c4fb3d23d`: Revert `fix: set temporal cache in release overrides`.
- `394436d805a7`: Revert `fix: support temporal cache deploy for wrapped TD3 configs`.
- Branch is ahead of origin by these two commits; not pushed.

## Deployment
- Command suffix: `__vampire-bat-ardent-emerald_interleave_control_v4`.
- Source session: `/mnt/remote/azure_session_dir/BaselineCandidates/candidate-structured-testing/session_2026_05_22_08_58_12_baseline_rl_rmf`.
- Deployed session: `session_2026_05_22_08_58_12_baseline_rl_rmf__vampire-bat-ardent-emerald_interleave_control_v4`.
- Console URL: `https://console.sso.wayve.ai/model/session_2026_05_22_08_58_12_baseline_rl_rmf__vampire-bat-ardent-emerald_interleave_control_v4`.
- Checkpoint step: `150000`.
- Gen2 artefact id: `e98d65d3-b1a6-4896-a5e0-80e5b50f000f`.

## Validation
- `git diff --check`: passed before deploy.
- Deploy completed and uploaded to Console.
- Deploy summary showed temporal caching: `Same as trained model`.
- Runtime still logged temporal caching enabled for `RadarEncoderAdaptorV2` and `VideoSTAdaptor`, so the trained config already has it on.
- Gen2 config includes radar X/Y/Z/range-rate/SNR, `points_per_scan: 800`, and `interleave_control`.

## Notes
- Same non-fatal ONNX artefact upload validation error occurred because ONNX export was skipped.
