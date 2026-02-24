# Import/check run for deploy_interleaved_models on updated PUDO branch

Date: 2026-02-19
Branch: `boris/interleaved/updated_pudo_15_02_26`

## Command run
```bash
bazel run //wayve/ai/si:deploy_interleaved_models -- \
  --baseline_model_session_path /mnt/remote/azure_session_dir/BaselineCandidates/candidate-structured-testing/session_2026_01_23_09_39_08_si_candidate_2026_5_4_baseline_rl_bl_45_65_85_flourishing-pink-roadrunner \
  --session_id session_2026_02_15_13_01_33_si_parking_bc_train_release_2026_5_4_pud_only_bc_release_2026_5_4_b3.0.1 \
  --suffix __interleaved_silver-harmonious-lark \
  --enable_parking \
  --with_temporal_caching true \
  --baseline_model_load_mode wrapper \
  --primary_model_load_mode wrapper \
  --dilc_on
```

## Result
Failed before runtime/import stage due missing Bazel target in `wayve/ai/si/BUILD`:
- `ERROR: ... no such target '//wayve/ai/si:deploy_interleaved_models'`

## Missing build wiring compared to source branch
- `wayve/ai/si/BUILD`: missing `py_binary(name = "deploy_interleaved_models", ...)` (and `deploy_interleaved` block)
- `wayve/ai/zoo/deployment/BUILD`: `interleaving_stopping_wrapper.py` missing from `py_library(name = "deployment", srcs=[...])`

## Follow-up debugging (radar baseline + radar parking)

### What changed
- Switched `wayve/ai/zoo/deployment/interleaving_stopping_wrapper.py` to a radar-only interleaving contract for both branches:
  - baseline call path always includes `driving_parameters` + radar tensors
  - parking call path always includes `driving_parameters` + radar tensors
- Removed conditional call paths that attempted non-radar signatures (TorchScript compiled all branches and failed).
- Added local timestamp formatter in interleaving wrapper (no dependency on private helper from `deployment_wrapper.py`).
- Normalized `policy_indicator_weights` to 4 channels (`[off, right, left, hazard]`) to satisfy deploy interface checks.

### Run ledger
- Run 1: failed with `ImportError` for `_format_timestamp_hhmmss_mmm` import from `deployment_wrapper`.
- Run 2: failed with `TypeError` missing radar args for `ParkingDeploymentWrapperWithRadar.forward`.
- Run 3: failed in TorchScript compile due branch path calling baseline wrapper without radar args.
- Run 4: failed deploy interface check: expected `policy_indicator_weights` shape `(1, 11, 4)`, got `(1, 11, 3)`.
- Run 5: failed TorchScript on closed-over global constant in indicator normalization helper.
- Run 6: **success**. Command completed with exit code 0 and saved TorchScript to:
  - `/mnt/remote/azure_session_dir/Parking/parking/session_2026_02_15_13_01_33_si_parking_bc_train_release_2026_5_4_pud_only_bc_release_2026_5_4_b3.0.1__interleaved_silver-harmonious-lark/traces/model-000100000.torchscript`

## Upload run (`--upload`) with fixed suffix

Command:
```bash
bazel run //wayve/ai/si:deploy_interleaved_models -- \
  --baseline_model_session_path /mnt/remote/azure_session_dir/BaselineCandidates/candidate-structured-testing/session_2026_01_23_09_39_08_si_candidate_2026_5_4_baseline_rl_bl_45_65_85_flourishing-pink-roadrunner \
  --session_id session_2026_02_15_13_01_33_si_parking_bc_train_release_2026_5_4_pud_only_bc_release_2026_5_4_b3.0.1 \
  --suffix __interleaved_silver-harmonious-lark \
  --enable_parking \
  --with_temporal_caching true \
  --baseline_model_load_mode wrapper \
  --primary_model_load_mode wrapper \
  --dilc_on \
  --upload
```

Outcome:
- Exit code: `0`
- Upload completed for session:
  - `session_2026_02_15_13_01_33_si_parking_bc_train_release_2026_5_4_pud_only_bc_release_2026_5_4_b3.0.1__interleaved_silver-harmonious-lark`
- Console URL:
  - `https://console.sso.wayve.ai/model/session_2026_02_15_13_01_33_si_parking_bc_train_release_2026_5_4_pud_only_bc_release_2026_5_4_b3.0.1__interleaved_silver-harmonious-lark`

Notes:
- Non-fatal warning in ONNX artefact upload path (`OnnxExportAsset.path=None`) because ONNX export is disabled.
- Core model trace + checkpoint + configs uploaded successfully.

## Notion newsletter update (default flow switch)
- Updated page: `Newsletter: Interleaving Models in the Parking Deployment Wrapper`
- Changes made:
  - Section 2: switched default branch to `boris/interleaved/updated_pudo_15_02_26` and marked old branch as historical reference.
  - Section 3: switched default deploy command to the M26.0.0 flow (`session_2026_02_15_13_01_33...`, wrapper/wrapper, `--upload`).
  - Kept meter-to-pixel conversion subsection unchanged.
  - Section 7: converted to historical context for M25.0.0 (`boris/train/parking_pudo_interleaving_w_radar` + old command/session).
