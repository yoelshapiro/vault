# Scarlet Root Jitter G50 Training

- Branch: `boris/parking-past30-no-standstill-gear-aug/scarlet_full_gear_root_jitter_g50`
- Commit: `df2b887a2bad07dda31863dca920272eb57b97b1`
- Base: `ea03fa86fb72ce0f10668bc29a3453d09ee9760e`
- Change: added 50% gear-direction token dropout to the scarlet full-gear route-jitter PUDO root variant.
- Validation:
  - `bazel test //wayve/ai/zoo/st:test_st`
  - `bazel test //wayve/ai/si:test_config_py_test_test_configs_utils_parking_release_2026_5_21_config_resolves`
- Image: `wayvetraining.azurecr.io/scaled-intelligence:df2b887a2bad07dda31863dca920272eb57b97b1`
- Surfboard job: `184444`
- Nickname: `coral-elaborate-chipmunk`
- Session: `session_2026_06_25_09_10_01_fgjitg50`
- W&B: https://wandb.ai/wayve-ai/parking_bc/runs/session_2026_06_25_09_10_01_fgjitg50
- Status at handoff: `Dispatched`, awaiting platform start time.

## Follow-up Variant

- Commit: `949bb24ae3d485c2b35fb436f00d407139211761`
- Change: added the gated `augment_standstill_gear` fix and updated parking config defaults/weights:
  - enabled standstill gear augmentation,
  - disabled leading-standstill strip and parked/unparking gear augmentation probabilities,
  - set `dc_unpudo_gear_change_weight=0.0`,
  - set failed-to-PUDO train bucket weights to `0.0`,
  - set `dc_pudo_gear_change_weight=0.06` and `dc_unpudo_pre_start_weight=0.08`.
- Validation:
  - `git diff --check`
  - `bazel test //wayve/ai/si:test_config_py_test_test_configs_utils_parking_release_2026_5_21_config_resolves`
- Image: `wayvetraining.azurecr.io/scaled-intelligence:949bb24ae3d485c2b35fb436f00d407139211761`
- Surfboard job: `184565`
- Nickname: `acrobatic-rose-cobra`
- Session: `session_2026_06_25_12_30_21_fgjitg50af`
- W&B: https://wandb.ai/wayve-ai/parking_bc/runs/session_2026_06_25_12_30_21_fgjitg50af
