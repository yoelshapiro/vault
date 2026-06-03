# 2026-06-03 Vampire Bat Driving Redeploy

## Summary
- Pushed `03-20-si-group-interleave-control-support` after merging main and adding deploy compatibility fixes.
- Redeployed `vampire-bat-ardent-emerald` as a driving model with interleave control enabled and empty interleave group.
- New deployed nickname: `falcon-orange-creative`.

## Source
- Requested model: `vampire-bat-ardent-emerald`.
- Catalogue session: `session_2026_05_22_08_58_12_baseline_rl_rmf_unified_wrapper_training_commit`.
- Source train session used for redeploy: `/mnt/remote/azure_session_dir/BaselineCandidates/candidate-structured-testing/session_2026_05_22_08_58_12_baseline_rl_rmf`.
- Checkpoint step: `150000`.

## Deployment
- Command suffix: `__vampire-bat-ardent-emerald_interleave_control_v3`.
- Deployed session: `session_2026_05_22_08_58_12_baseline_rl_rmf__vampire-bat-ardent-emerald_interleave_control_v3`.
- Console URL: `https://console.sso.wayve.ai/model/session_2026_05_22_08_58_12_baseline_rl_rmf__vampire-bat-ardent-emerald_interleave_control_v3`.
- Gen2 artefact id: `c28dd87d-d3c5-4131-8d55-4e955949eb24`.

## Fixes
- `ff51c2e0fab9`: support temporal cache deploy for wrapped TD3 configs.
- `70dfa77a6f3c`: set temporal cache in release overrides.

## Validation
- `bazel test //wayve/ai/si:test_deploy --test_arg=-k --test_arg=temporal_caching`: passed.
- `git diff --check`: passed before commits.
- Deployment uploaded successfully to Console.
- Gen2 config includes:
  - radar features X/Y/Z/range-rate/SNR
  - `points_per_scan: 800`
  - `interleave_control` output

## Notes
- Initial `v1` and `v2` deploy attempts failed before upload due old config compatibility. `v3` succeeded.
- Deploy logged a non-fatal ONNX artefact upload validation error because ONNX export was skipped; session upload still completed successfully.
