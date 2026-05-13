# Ibex Lime Meritorious Interleave Deploy

Date: 2026-05-13

## Summary

Deployed source nickname `ibex-lime-meritorious` with suffix `__ibex-lime-meritorious_interleave_control_v1`, temporal caching enabled, upload enabled, and default empty interleave-control group.

## Source

- Source session path: `/mnt/remote/azure_session_dir/BaselineCandidates/candidate-structured-testing/session_2026_04_29_02_56_05_si_candidate_2026_6_19_combined_rl_tuned_driving_modes`
- Overlay path: `/tmp/session_2026_04_29_02_56_05_si_candidate_2026_6_19_combined_rl_tuned_driving_modes__ibex-lime-meritorious_interleave_control_v1_overlay`
- Overlay details: symlinked source session contents and copied `full_config.yml` with lines removed where stripped content started with `radar_features:` or `max_radar_points_per_scan:`.

## Deploy

- Command was run by a spawned Codex sub-agent from `/workspace/WayveCode`.
- Output session path: `/tmp/session_2026_04_29_02_56_05_si_candidate_2026_6_19_combined_rl_tuned_driving_modes__ibex-lime-meritorious_interleave_control_v1_overlay__ibex-lime-meritorious_interleave_control_v1`
- Console URL: `https://console.sso.wayve.ai/model/session_2026_04_29_02_56_05_si_candidate_2026_6_19_combined_rl_tuned_driving_modes__ibex-lime-meritorious_interleave_control_v1_overlay__ibex-lime-meritorious_interleave_control_v1`
- Assigned nickname: `unofficial-cyan-pigeon`

## Verification

- Checkpoint load observed for source checkpoint `model-checkpoint-000100000.ckpt`.
- Torchscript saved at `traces/model-000160000.torchscript`.
- Console upload succeeded.
- Radar verification passed in `gen2_model_inference_config.json`:
  - `tensor_name`: `radar_data`
  - `radar_features`: `RADAR_FEATURE_X_M`, `RADAR_FEATURE_Y_M`, `RADAR_FEATURE_Z_M`, `RADAR_FEATURE_RANGE_RATE_MPS`, `RADAR_FEATURE_SNR_DB`
  - `points_per_scan`: `800`

## Non-blocking warnings

- Existing unrelated worktree changes were present and left untouched.
- Another agent's Bazel deploy was already running, so this deploy queued behind it before starting.
- Datadog app/statsd environment was incomplete.
- `torchao` skipped C++ extensions due to torch version compatibility.
- Source session git hash differed from the running code.
- Data provenance parquet was missing.
- ONNX artefact upload hit the known `path=None` validation error after ONNX export was skipped; the console upload still succeeded and the deploy exited `0`.
