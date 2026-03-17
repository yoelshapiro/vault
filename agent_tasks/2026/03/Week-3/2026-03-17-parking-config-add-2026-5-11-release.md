# 2026-03-17 — Add parking BC release config aligned to 2026.5.11 baseline

## Context
- Requested to extend `wayve/ai/si/configs/parking/parking_config.py` with a new parking BC config aligned with baseline release `2026.5.11` (`wayve/ai/si/configs/baseline/release.py`).
- Constraint: no tests, no commit.

## What changed
- Added Dec 2025 base imports:
  - `WFMStDecember2025Cfg`
  - `BCWFMStDecember2025Cfg`
- Added a new parking model config:
  - `ParkingModelRelease2026_5_11Cfg` (Dec 2025 base)
  - Includes `use_flash_attention_v3=True`, `dropout_none_conditioning_probability=1.0`, radar late fusion, vectorized feature cache, parking mode adaptor, gear adaptor, and existing parking output adaptor.
- Added a new parking BC training config object:
  - `parking_bc_release_2026_5_11_cfg`.
- Registered the new model:
  - `model_store(..., name="parking_bc_release_2026_5_11")`.
- Added a new train mode:
  - `ParkingBcTrainRelease2026_5_11Cfg` with `BCWFMStDecember2025Cfg` base and release-like runtime fields (`profile_step`, `precision`, `strategy`, `version`).
- Registered mode:
  - `parking_bc_train_release_2026_5_11`.

## Notes
- Existing `parking_bc_train_release_2026_5_4` and debug mode were left intact.
- No tests were run per request.
