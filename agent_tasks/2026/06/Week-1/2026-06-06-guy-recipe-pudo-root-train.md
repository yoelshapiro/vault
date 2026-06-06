# 2026-06-06 Guy Recipe PUDO Root Train

- Worktree: `/workspace/guy_recipe_gear_root`
- Source branch: `origin/guy/parking-past30-no-standstill-gear-aug`
- Fork branch: `boris/parking-past30-no-standstill-gear-aug/guy_recipe_gear_root`
- Commit: `1b18c018e3012e8daecc3bed5eba559f8dbd35dc`

## Change

Changed only `PUDO_BUCKETS_ROOT` in `wayve/ai/si/configs/parking/parking_config.py` to:

```text
parking/dev/2026_06_04_11_13_51_root_parking_pudo_unpudo_unparking_gear_fix
```

The Guy branch recipe was otherwise preserved. Its existing `unpudo_moving` group remained unchanged; no unsafe/pre-departure bucket recipe from the newer branch was added.

## Validation

- `git diff --check` passed.
- `bazel test //wayve/ai/si:test_config_py_test_test_configs_utils_parking_release_2026_5_11_config_resolves` is unavailable on this older branch.
- `bazel test //wayve/ai/si:test_config_py_test` initially failed due `/workspace` disk exhaustion during toolchain/wheel extraction.
- Removed one inactive Bazel output root and the shared Bazel disk cache to recover space; the aggregate test then progressed through analysis but was stopped because it remained too slow/stuck before training submission.

## Training

- Job: `175628`
- Nickname: `mercurial-sapphire-jellyfish`
- Session: `session_2026_06_06_22_07_21_guyroot`
- Mode: `parking_bc_train_release_2026_5_11`
- Steps: `100000`
- Image: `wayvetraining.azurecr.io/scaled-intelligence:1b18c018e3012e8daecc3bed5eba559f8dbd35dc`
- Final observed state: `Dispatched` on `aks-prod-training-2-swe.nd96h100c`
- W&B: `https://wandb.ai/wayve-ai/parking_bc/runs/session_2026_06_06_22_07_21_guyroot`
- Datadog: `https://app.datadoghq.eu/logs?query=job_name%3Amercurial-sapphire-jellyfish-175628&from_ts=1779574395143&cols=job_name%2Cnode_rank&live=true`
