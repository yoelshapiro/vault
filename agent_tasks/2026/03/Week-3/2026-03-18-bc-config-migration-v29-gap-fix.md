# 2026-03-18 — BC config migration v29 gap fix

## Context
- Branch: `parking/training/pudo_170326`
- Failure while deploying SI model config migration:
  - `ValueError: Don't have a migration function for the current config version 29.`

## Root cause
- `bc_version.version_number` in `wayve/ai/si/config.py` was `29`.
- `BC_CONFIG_MIGRATION_FUNCTIONS` in `wayve/ai/si/configs/versioning/bc_migrations.py` ended at `28`.
- `migrate_to_v29` had been removed in a later review commit, leaving version and migration map inconsistent.

## Changes made
- Restored `migrate_to_v29` in `wayve/ai/si/configs/versioning/bc_migrations.py`.
- Re-added mapping entry `29: migrate_to_v29` in `BC_CONFIG_MIGRATION_FUNCTIONS`.
- Regenerated BC migration sample snapshot:
  - `wayve/ai/si/test/data/sample_configs/bc/v29.yaml`

## Validation
- Ran:
  - `bazel test //wayve/ai/si:test_config_py_test --test_output=errors --test_arg='-k=bc_migrations'`
- Result: pass.

## Files touched
- `wayve/ai/si/configs/versioning/bc_migrations.py`
- `wayve/ai/si/test/data/sample_configs/bc/v29.yaml`
