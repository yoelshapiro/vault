# Parking D26_3_6 datamodule mix fix

- Date: 2026-04-15
- Branch: `boris/fix-parking-d26-naming-weights`
- PR: #106451
- Related PR: #102691
- Area: `wayve/ai/si/configs/parking/parking_config.py`

## Scope
Fix swapped naming/mix assignment between `parking_bc_datamodule_D26_3_6_cfg` and `pudo_bc_datamodule_D26_3_6_cfg`, and correct decimal typo in non-driving weights.

## Changes
1. Updated `parking_bc_datamodule_D26_3_6_cfg` override map to parking-focused values:
- `pudo: 0.0`
- `park: 0.15`
- `unpudo: 0.0`
- `unpark: 0.10`

2. Updated `pudo_bc_datamodule_D26_3_6_cfg` override map to pudo-focused values:
- `pudo: 0.7`
- `park: 0.0`
- `unpudo: 0.02` (from `0.2`)
- `unpark: 0.02` (from `0.2`)

## Validation
- `python -m py_compile wayve/ai/si/configs/parking/parking_config.py`
- Verified PR includes only the config file.

## Notes
- Commit: `8cc32aaec63`

## Follow-up update
- Commit: `0dba67afe8c`
- Normalized top-level override totals to `1.0` as requested:
  - `parking_bc_datamodule_D26_3_6_cfg`: driving set to `0.75` (`0.75 + 0.15 + 0.10 = 1.0`).
  - `pudo_bc_datamodule_D26_3_6_cfg`: driving set to `0.89` and pudo corrected to `0.07` (`0.89 + 0.07 + 0.02 + 0.02 = 1.0`).
