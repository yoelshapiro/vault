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

