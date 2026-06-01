# Parking PUDO Data Mix Train

- Topic: Rebalance parking PUDO/UNPUDO data mix and submit 30K training.
- Labels: parking, pudo, unpudo, training, data-mix.
- Branch: `boris/parking-past30-no-standstill-gear-aug/main_cherrypick`.
- PR: N/A.
- Change type: Config change / training run.
- Areas: `/workspace/default/wayve/ai/si/configs/parking/parking_config.py`.

## Changes

- Updated `PUDO_BUCKETS_ROOT` to the 2026-05-31 materialized PUDO/UNPUDO root.
- Rebalanced train weights to 50% driving, 20% PUDO, 22% UNPUDO, 8% gear shift, 0% unparking.
- Split UNPUDO into `unpudo_dc_short=10%`, `unpudo_ca_moving=6%`, `unpudo_departure=6%`, with long DC, general CA, unsafe CA, and unparking wired at 0%.
- Added validation buckets for DC move and departure UNPUDO.

## Validation

- `git diff --check` passed.
- `bazel test //wayve/ai/si:test_config_py_test_test_configs_utils_parking_release_2026_5_21_config_resolves` passed before commit.

## Training

- Commit: `21bd35f8a9bf` (`feat: rebalance parking pudo data mix`).
- Command overrides: `+mode=parking_bc_train_release_2026_5_21 +datamodule=parking_bc_datamodule num_steps=30000 model.lr_scheduler_num_steps=100000`.
- Job: `172591` / `purple-steady-toucan`.
- Session: `session_2026_06_01_07_08_09_p531mix30k`.
- Image: `wayvetraining.azurecr.io/scaled-intelligence:21bd35f8a9bf2d60d8f1f8901053ec39bf47b9de`.
- Initial status: `Queued`, queue position 1.
- W&B: https://wandb.ai/wayve-ai/parking_bc/runs/session_2026_06_01_07_08_09_p531mix30k
- Datadog: https://app.datadoghq.eu/logs?query=job_name%3Apurple-steady-toucan-172591&from_ts=1779088117156&cols=job_name%2Cnode_rank&live=true

## 5K Monitor

- 2026-06-01T07:54:23Z: W&B state `running`, `trainer/global_step=5505`, `trainer/train_step=5505`.
- Passed requested 5K monitor gate.
- Notion model-card row created: https://www.notion.so/37203da5d69a816491fcfcb2710ec90c

## Track Tag Loss Groups

- Added inline `track_tag=True` / `track_tag_group="pudo_unpudo"` to PUDO and UNPUDO train bucket definitions in `/workspace/WayveCode/wayve/ai/si/configs/parking/parking_config.py`.
- Did not tag driving, unparking, gear-shift, or validation buckets.
- Validation: `git diff --check -- wayve/ai/si/configs/parking/parking_config.py` passed; `bazel test //wayve/ai/si:test_config_py_test_test_configs_utils_parking_release_2026_5_21_config_resolves` passed.
- Commit: pending.

## Nested Track Tag Config

- Converted train buckets to nested groups while preserving effective driving budget at 50%.
- Preserved previous PUDO leaf ratios inside nested `pudo_dc` / `pudo_ca`: DC total 0.6024, CA/pre-CA boosted total 0.3976.
- Added `pudo_unpudo` track tags through `PUDOBucketCfg` for PUDO, UNPUDO, and gear-change buckets.
- Added `park_unpark` track tags through `PARKBucketCfg` for unparking buckets.
- Validation: `git diff --check` passed; `bazel test //wayve/ai/si:test_config_py_test_test_configs_utils_parking_release_2026_5_21_config_resolves` passed.

## Release Driving Data Import

- Updated `/workspace/WayveCode/wayve/ai/si/configs/parking/parking_config.py` to derive driving train/validation partitions from `wayve.ai.si.configs.baseline.release`.
- Imported release base train partitions, Alpha2/Alpha3 ratios, and release materialisation version; excluded MRM buckets by rebuilding only driving partitions from `bc_base_train_partitions`.
- Kept parking/PUDO/UNPUDO/gear-shift/unparking non-driving mix unchanged.
- Validation: `git diff --check` passed; `bazel test //wayve/ai/si:test_config_py_test_test_configs_utils_parking_release_2026_5_21_config_resolves` passed.
- Commit: pending.

## Release Driving 30K Train

- Branch: `boris/parking-past30-no-standstill-gear-aug/main_cherrypick_new_driving`.
- Commit: `a4b3772c7895` (`feat: use release driving data for parking`).
- Command overrides: `+mode=parking_bc_train_release_2026_5_21 +datamodule=parking_bc_datamodule num_steps=30000 model.lr_scheduler_num_steps=100000`.
- Session tag: `p521reldrv30k`.
- Job: `172845` / `white-friendly-mastiff`.
- Session: `session_2026_06_01_16_58_00_p521reldrv30k`.
- Image: `wayvetraining.azurecr.io/scaled-intelligence:a4b3772c7895956a1ef29d997d3762eaadaf235f`.
- W&B: https://wandb.ai/wayve-ai/parking_bc/runs/session_2026_06_01_16_58_00_p521reldrv30k
- Datadog: https://app.datadoghq.eu/logs?query=job_name%3Awhite-friendly-mastiff-172845&from_ts=1779123480748&cols=job_name%2Cnode_rank&live=true
- Initial submission: queued, `max_restarts=0`.
