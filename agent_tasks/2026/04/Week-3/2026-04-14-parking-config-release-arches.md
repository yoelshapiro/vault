# Parking Config: Add 2026.6.x Release Architectures

- Date: 2026-04-14
- Branch: `parking/training/pudo`
- Area: `wayve/ai/si/configs/parking/parking_config.py`

## Scope
Updated parking SI config to add release-aligned model architectures for:
- `2026.6.14`
- `2026.6.12` (found from historical baseline release config commit `ddfd3e62c46`)

## Changes
1. Added import:
- `load_multi_input_sttransformer_from_wfm_october_pretraining`

2. Added model architecture configs:
- `ParkingModelRelease2026_6_12Cfg`
- `ParkingModelRelease2026_6_14Cfg`

Both are aligned to baseline Dec25 L10 release architecture pattern:
- Dec25 base
- `name="large_l10"`
- checkpoint load from Dec25 WFM ckpt with `remove_layer=10`
- radar late fusion + same radar AE adaptor
- `use_vectorized_feature_cache=True`
- `use_flash_attention_v3=True`
- `dropout_none_conditioning_probability=0.0`
- parking-specific adaptors + output adaptor retained

3. Added training model wrappers:
- `parking_bc_release_2026_6_12_cfg`
- `parking_bc_release_2026_6_14_cfg`

4. Added stores:
- `model_store(..., name="parking_bc_release_2026_6_12")`
- `model_store(..., name="parking_bc_release_2026_6_14")`

5. Added train modes:
- `ParkingBcTrainRelease2026_6_12Cfg` / `parking_bc_train_release_2026_6_12`
- `ParkingBcTrainRelease2026_6_14Cfg` / `parking_bc_train_release_2026_6_14`

## Validation
- `python -m py_compile wayve/ai/si/configs/parking/parking_config.py` passed.

## Notes
- No commit made.

## Additional Update
- Added derived datamodule alias `parking_bc_D26_3_6_datamodule` by reusing `parking_pudo_bc_datamodule_D26_3_cfg` and overriding top-level nested group ratios:
  - driving: 0.86
  - pudo: 0.0
  - park: 0.15
  - unpudo: 0.0
  - unpark: 0.10
- Implemented via `_override_nested_group_ratios(...)` in `parking_config.py` and registered with `data_store[type[OtfDrivingDataModule]](...)`.
