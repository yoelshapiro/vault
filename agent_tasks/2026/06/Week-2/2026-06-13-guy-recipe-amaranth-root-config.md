# 2026-06-13 Guy Recipe Amaranth Root Config

- Branch: `codex/guy-recipe-gear-root-amaranth-root`
- Base branch: `boris/parking-past30-no-standstill-gear-aug/guy_recipe_gear_root`
- Change type: Code change, config validation
- Areas: `wayve/ai/si/configs/parking/parking_config.py`

## Summary

- Added a dedicated `PARKING_BC_PUDO_BUCKETS_ROOT` for the amaranth/no-low-steering materialization root:
  `abfss://datasets@wayveproddatasetflat.dfs.core.windows.net/sampling_materialised/parking_pudo/default/dev/parking_pudo_default_no_low_steering_20260611__2026-06-11-13-23/dataset`
- Kept driving buckets and weights unchanged.
- Replaced the old parking BC non-driving mix with flattened groups:
  `dc_pudo`, `dc_unpudo`, `dc_pudo_gear_change`, `dc_unpudo_gear_change`, `dc_unpudo_pre_start`, `ca_pudo`, `pre_ca_pudo`, `ca_unpudo`, `pre_ca_unpudo`.
- Set the discussed weights: driving 50%, then 11/11/4/4/6/2/5/2/5% for the non-driving groups.
- Updated validation partitions and `parking_bc_new_driving_datamodule` non-driving filters to use the new dedicated PUDO root.
- Tried the amaranth `PUDOBucketCfg(track_tag=...)` helper first, but this base branch's `BucketCfg` does not support `track_tag`; kept plain `BucketCfg`.

## Validation

- `git diff --check -- wayve/ai/si/configs/parking/parking_config.py` passed.
- `bazel test //wayve/ai/si:test_config_py_test --test_arg=-k --test_arg='compare_model_configs_with_yaml or compare_model_configs_with_yml or test_configs_roughly_add_to_one or register_all_configs'` passed.
- Full `bazel test //wayve/ai/si:test_config_py_test` was also run and failed on pre-existing BC migration signature issues, plus the temporary `track_tag` issue before it was fixed. The relevant filtered config-registration and weight sanity tests pass after the fix.

## Training Submission

- Commit: `90be5f9f0ef6b375175d5968e2e0e67b98569d03`
- Branch push: `origin/codex/guy-recipe-gear-root-amaranth-root`
- Command:
  ```bash
  bazel run //wayve/ai/si/cli:cli -- \
    --no-verify \
    --experiment parking_bc \
    --platform AKS \
    --cluster dgx-h100 \
    --num_nodes 4 \
    --session_tag guyamr4n100k \
    --project Parking \
    --priority P1 \
    --control_model '' \
    +mode=parking_bc_train_release_2026_5_11 \
    +datamodule=parking_bc_datamodule \
    num_steps=100000
  ```
- Surfboard job: `179301`
- Surfboard nickname: `astonishing-chocolate-albatross`
- Session: `session_2026_06_13_20_16_20_guyamr4n100k`
- Image: `wayvetraining.azurecr.io/scaled-intelligence:90be5f9f0ef6b375175d5968e2e0e67b98569d03`
- Nodes: 4 H100 nodes (`num_gpus=32`)
- Priority: `P1`
- W&B: https://wandb.ai/wayve-ai/parking_bc/runs/session_2026_06_13_20_16_20_guyamr4n100k
- Datadog logs: https://app.datadoghq.eu/logs?query=job_name%3Aastonishing-chocolate-albatross-179301&from_ts=1780172350307&cols=job_name%2Cnode_rank&live=true
- Final observed state: `Dispatched` on `aks-prod-training-swe.nd96h100d`; no start time yet.
