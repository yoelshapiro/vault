# Parking/Unparking Gear Augmentation Implementation

- Date: 2026-03-20
- Branch: `03-20-parking-unparking-gear-augmentation`
- Base branch untouched: `parking/training/pudo`
- Scope: port the reference-style parking standstill gear augmentation (park vs drive/unpark) into current OTF parking pipeline with config toggles and tests.

## What Changed

1. Added parking gear augmentation transform in `wayve/ai/zoo/data/parking.py`.
- New API: `insert_parking_gear_augmentation(...)`.
- Behavior:
  - applies only when `PARKING_MODE=True` and vehicle speed is near standstill.
  - samples parked branch vs drive/unpark branch using `parked_probability`.
  - parked branch: force neutral gear target, zero policy speed, freeze policy trajectory targets.
  - drive/unpark branch: optional leading-standstill stripping by left-shifting policy tensors.
- Includes parameter validation for probability and threshold.

2. Wired augmentation into OTF datapipe in `wayve/ai/si/datamodules/otf.py`.
- New datamodule args:
  - `enable_parking_gear_augmentation`
  - `parking_gear_augment_parked_probability`
  - `parking_gear_augment_standstill_threshold_mps`
  - `parking_gear_augment_strip_leading_standstill`
- New make-drivng-datapipe args with same names.
- Train-only enablement in `OtfDrivingDataModule.make_driving_pipe`.
- Safety guard: raises if augmentation is enabled without parking data.

3. Enabled the new augmentation in parking configs (`wayve/ai/si/configs/parking/parking_config.py`).
- Enabled for both parking datamodule configs in this file.
- Values set to reference-like defaults:
  - parked probability: `0.5`
  - standstill threshold: `0.5 / 3.6` m/s
  - strip leading standstill: `True`

4. Added tests.
- `wayve/ai/zoo/data/test/test_parking.py`
  - new tests for parked branch behavior
  - new tests for leading-standstill stripping behavior
- `wayve/ai/si/datamodules/test/test_otf.py`
  - updated parking/gear hook test to assert the new OTF hook wiring and arguments.

## Validation

### Passed
- `bazel test //wayve/ai/zoo/data:test_zoo_data_py_test --test_arg='-k=parking_gear_augmentation'`
- `bazel test //wayve/ai/si/datamodules:py_test --test_arg='--no-cov' --test_arg='-k=test_make_driving_datapipe_parking_and_gear_direction_hooks'`

### Known unrelated failures in full target
- `bazel test //wayve/ai/si/datamodules:py_test`
- Failing tests are in `wayve/ai/si/datamodules/test/test_restore.py` due local parquet fixture corruption (`Parquet magic bytes not found in footer`) and are unrelated to this change set.

## Notes

- Main workspace branch remains unchanged (`parking/training/pudo`).
- All implementation work was done in the separate worktree branch above.
