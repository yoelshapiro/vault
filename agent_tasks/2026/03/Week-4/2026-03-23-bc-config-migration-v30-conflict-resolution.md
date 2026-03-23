# 2026-03-23 — BC config migration v30 conflict resolution

## Context
- Branch: `parking/training/pudo`
- Requested: `fix config migration`.
- Observed failure in migration tests: unresolved merge markers in BC migration code and BC sample snapshot.

## Root cause
- Two branches both introduced `migrate_to_v29` with different logic:
  - `origin/main`: `use_temporal_rope` migration.
  - branch-local: parking/gear fields migration.
- `wayve/ai/si/configs/versioning/bc_migrations.py` still contained conflict markers.
- `wayve/ai/si/test/data/sample_configs/bc/v29.yaml` still contained conflict markers.

## Changes made
- Kept `migrate_to_v29` aligned with `origin/main` (`use_temporal_rope`).
- Added `migrate_to_v30` containing parking/gear migration logic.
- Updated BC migration map to include `30: migrate_to_v30`.
- Bumped BC config version to `30` in `wayve/ai/si/config.py`.
- Updated BC reference config version fields to 30:
  - `wayve/ai/si/test/test_config_inputs/reference_bc.yaml`
  - `wayve/ai/si/test/test_config_inputs/reference_bc_alpha2.yaml`
- Restored `wayve/ai/si/test/data/sample_configs/bc/v29.yaml` from `origin/main` (clean snapshot for historical version).
- Generated new BC snapshot:
  - `wayve/ai/si/test/data/sample_configs/bc/v30.yaml`
- Removed trailing top-level `radar_features` and `max_radar_points_per_scan` from `v30.yaml` so the migration target-args validator passes with current `train(...)` signature.

## Validation
- Passed:
  - `bazel test //wayve/ai/si:test_config_py_test --test_output=errors --test_arg='-k=bc_migrations'`
  - `bazel test //wayve/ai/si:test_config_py_test --test_output=errors --test_arg='-k=rl_migrations'`
- Full `//wayve/ai/si:test_config` still fails in this branch for pre-existing non-migration issues:
  - flake8: `wayve/ai/si/datamodules/otf.py:1158:13: F841 local variable 'parking_origin' is assigned to but never used`
  - BC baseline regression snapshots differ from current config content beyond migration-version bump.

## Files touched
- `wayve/ai/si/config.py`
- `wayve/ai/si/configs/versioning/bc_migrations.py`
- `wayve/ai/si/test/data/sample_configs/bc/v29.yaml`
- `wayve/ai/si/test/data/sample_configs/bc/v30.yaml`
- `wayve/ai/si/test/test_config_inputs/reference_bc.yaml`
- `wayve/ai/si/test/test_config_inputs/reference_bc_alpha2.yaml`
