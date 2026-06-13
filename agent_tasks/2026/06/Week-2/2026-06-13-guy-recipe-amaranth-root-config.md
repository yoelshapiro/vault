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
