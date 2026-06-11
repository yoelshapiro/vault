# 2026-06-11 Training Main Cherrypick Generic Data PR

- Branch: `boris/training/main_cherrypick_generic_data`
- PR: #118072, draft, targeting `main`
- Workspace: `/workspace/WayveCode`

## Summary

Opened a draft PR for the training main-cherrypick generic data branch.

## Changes Covered

- Branch includes the existing parking main-cherrypick changes across routes, parking datamodules, deployment, training, checkpoint handling, and tests.
- Updated `parking_bc_datamodule_cfg` to use the new PUDO materialization:
  `abfss://datasets@wayveproddatasetflat.dfs.core.windows.net/sampling_materialised/parking_pudo/default/dev/parking_pudo_default_indicator_lookback_20260611__2026-06-11-09-19`
- Kept release driving data at 50%.
- Set non-driving training weights:
  - `dc_pudo`: 11%
  - `dc_unpudo`: 11%
  - `dc_pudo_gear_change`: 7%
  - `dc_unpudo_pre_start`: 7%
  - `ca_pudo`: 7%
  - `ca_unpudo`: 7%
- Used UK/US bucket names present in the materialization stats.

## Verification

- `python3 -m py_compile wayve/ai/si/configs/parking/parking_config.py`
- `git diff --check -- wayve/ai/si/configs/parking/parking_config.py`
- Static bucket-name check against the provided materialization bucket stats.
- Pushed `boris/training/main_cherrypick_generic_data` and created draft PR #118072.

## Follow-up: no-low-steering materialization and CA pre split

- Updated `parking_bc_datamodule_cfg` locally to use the newer PUDO materialization:
  `abfss://datasets@wayveproddatasetflat.dfs.core.windows.net/sampling_materialised/parking_pudo/default/dev/parking_pudo_default_no_low_steering_20260611__2026-06-11-13-23`
- Added `dc_unpudo_gear_change_{usa,uk}` train/validation buckets.
- Split CA buckets into flat top-level groups:
  - `ca_pudo`: `ca_pudo_short_{usa,uk}`, `ca_pudo_long_{usa,uk}`
  - `pre_ca_pudo`: `pre_ca_pudo_{usa,uk}`, `pre_ca_failed_to_pudo_{usa,uk}`
  - `ca_unpudo`: `ca_unpudo_short_{usa,uk}`, `ca_unpudo_long_{usa,uk}`
  - `pre_ca_unpudo`: `pre_ca_unpudo_{usa,uk}`
- Revised requested top-level weights to sum to 1.0:
  - `driving`: 50%
  - `dc_pudo`: 11%
  - `dc_unpudo`: 11%
  - `dc_pudo_gear_change`: 4%
  - `dc_unpudo_gear_change`: 4%
  - `dc_unpudo_pre_start`: 6%
  - `ca_pudo`: 2%
  - `pre_ca_pudo`: 5%
  - `ca_unpudo`: 2%
  - `pre_ca_unpudo`: 5%
