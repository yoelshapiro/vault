# 2026-07-12 Parking Best Model Follow-Up

- Branch: `boris/26-06-22-pudo-baseline`
- PR: `#120214`
- Change type: config adjustment, feature flag, tests
- Areas:
  - `wayve/ai/si/configs/parking/parking_config.py`
  - `wayve/ai/si/datamodules/parking.py`
  - `wayve/ai/si/datamodules/test/test_parking_unit.py`

## Summary

- Compared the active PR branch against `origin/boris/parking-train-reverse-unpudo-no-gear-aug`.
- Updated the Parking BC PUDO root to the non-reverse best-model `raw_gear_window_20260617` materialisation while keeping the current non-reverse bucket set.
- Set `unparking_gear_augment_prob=0.0` for the Parking BC config.
- Added `use_main_standstill_gear_augmentation`, defaulting to `False`, so main's original standstill randomization remains available behind an opt-in flag.
- Added unit coverage for the default policy-target-aware standstill augmentation and the opt-in main randomization path.

## Verification

- `git diff --check` passed.
- `bazel test //wayve/ai/si/datamodules:py_test --test_arg=wayve/ai/si/datamodules/test/test_parking_unit.py --test_arg=--no-cov` failed in unrelated `test_restore.py` cases due corrupted local parquet fixture: `Parquet magic bytes not found in footer`.
- `bazel test //wayve/ai/si/datamodules:py_test --test_filter=augment_standstill_gear` also ran the full py_check target and failed on the same unrelated restore/parquet fixture.
- In both Bazel runs, `test_augment_standstill_gear_uses_policy_target_logic_by_default` and `test_augment_standstill_gear_can_use_main_randomization` passed.
