# 2026-06-03 Driving Interleave-Control Deploys

- Branch: `03-20-si-group-interleave-control-support`
- Worktree: `/workspace/WayveCode`
- Output dir: `/workspace/parking-deploy-outputs`

## Summary

Deployed two driving RL models with interleave control enabled and empty interleave group.

## Commands

- `wallaby-compact-moccasin`: deployed source session `session_2026_05_12_02_34_19_baseline_rl_stage2_integration_wfm_eff` with suffix `__wallaby-compact-moccasin_interleave_control_v1`.
- `ibex-lime-meritorious`: deployed source session `session_2026_04_29_02_56_05_si_candidate_2026_6_19_combined_rl_tuned_driving_modes` with suffix `__ibex-lime-meritorious_interleave_control_v2`.

Both final deploys used:

```bash
bazel run //wayve/ai/si:deploy -- \
  --output_dir /workspace/parking-deploy-outputs \
  --upload \
  --enable_interleave_control \
  --interleave_control_group "" \
  --session_path <resolved /mnt/remote/azure_session_dir/... path>
```

## Results

- `wallaby-compact-moccasin` -> `zebra-aquamarine-reclusive`
  - Deployed session: `session_2026_05_12_02_34_19_baseline_rl_stage2_integration_wfm_eff__wallaby-compact-moccasin_interleave_control_v1`
  - Checkpoint step: `150000`
  - Console: https://console.sso.wayve.ai/model/session_2026_05_12_02_34_19_baseline_rl_stage2_integration_wfm_eff__wallaby-compact-moccasin_interleave_control_v1
  - Gen2 artefact id: `53f815b3-7014-4d3c-9715-bfc69f5d5add`
- `ibex-lime-meritorious` -> `anteater-harlequin-colorful`
  - Deployed session: `session_2026_04_29_02_56_05_si_candidate_2026_6_19_combined_rl_tuned_driving_modes__ibex-lime-meritorious_interleave_control_v2`
  - Checkpoint step: `160000`
  - Console: https://console.sso.wayve.ai/model/session_2026_04_29_02_56_05_si_candidate_2026_6_19_combined_rl_tuned_driving_modes__ibex-lime-meritorious_interleave_control_v2
  - Gen2 artefact id: `5d651f7b-93b0-44f4-93f9-32dab0b8553c`

## Notes

- Final deploys omitted `--with_temporal_caching True`; forcing it on these RL configs injects `video_enable_cache_at_inference` into checkpoint-loader configs and fails Hydra instantiation.
- `/tmp` was full, so local output was moved to `/workspace/parking-deploy-outputs`.
- Both generated Gen2 configs include `interleave_control`, radar X/Y/Z/range-rate/SNR, and `points_per_scan: 800`.
- Upload logs reported Console upload success. ONNX artefact upload logged a validation error because ONNX export was skipped.
