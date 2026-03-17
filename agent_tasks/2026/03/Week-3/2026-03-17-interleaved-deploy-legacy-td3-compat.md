# 2026-03-17 — Interleaved deploy legacy TD3 compatibility fix

## Context
- User requested running:
  - `bazel run //wayve/ai/si:deploy_interleaved_models -- --baseline_model_session_id session_2026_03_03_12_32_27_si_candidate_2026_5_11_wfm_dec_25_fa3_rl --session_id session_2026_03_16_05_14_10_si_parking_bc_train_release_2026_5_4_pudo_only_bc_2026_5_4_b3.0.1_ro_aug_unpark_bckts --suffix __interleaved_chipmunk-methodical-orange --enable_parking --with_temporal_caching true --baseline_model_load_mode wrapper --primary_model_load_mode wrapper --dilc_on`
- Runtime failed on Hydra instantiation with:
  - `TypeError: _DeviceDtypeModuleMixin.__init__() got an unexpected keyword argument 'apply_activation_checkpointing'`

## What changed
- Updated:
  - `wayve/ai/si/deploy_interleaved_models.py`
- In `_maybe_migrate_offline_rl_td3_deploy_compat`:
  - added TD3 top-level unknown-kwarg stripping based on `inspect.signature(TD3TrainingModule.__init__)`
  - preserved Hydra meta keys (`_target_`, etc.) and removed non-explicit kwargs before `instantiate(cfg.model)`
  - added structured warning log event `offline_rl_td3_unknown_kwargs_removed`

## Validation
- Re-ran the exact `bazel run` command above.
- Command completed successfully (`exit code 0`).
- Output artifact confirmed:
  - `/mnt/remote/azure_session_dir/Parking/parking_bc/session_2026_03_16_05_14_10_si_parking_bc_train_release_2026_5_4_pudo_only_bc_2026_5_4_b3.0.1_ro_aug_unpark_bckts__interleaved_chipmunk-methodical-orange/traces/model-000100000.torchscript`

## Notes
- Deploy logs show expected compatibility pruning for legacy config keys and successful wrapper load for both primary and baseline models.
