# Parking Mode Provenance Labels

- Date: 2026-06-16
- Branch: `boris/training/main_cherrypick_generic_data`
- PR: none
- Type: code change
- Areas:
  - `wayve/ai/si/datamodules/parking.py`
  - `wayve/ai/lib/provenance.py`
  - `wayve/ai/zoo/data/keys.py`

## Context

`guy/parking-stage-gt` added a single `ParkingStage` label, but Boris asked not to use an enum. The desired provenance is the raw/final parking detector mode flags per training sample: `parking_mode`, `parked_mode`, and `unparking_mode`.

## Changes

- Added three data keys:
  - `parking_mode_gt`
  - `parked_mode_gt`
  - `unparking_mode_gt`
- Updated `add_parking_mode` to write those labels from the final `ParkingModeResult` after `_augment_parked_mode`.
- Kept model input semantics unchanged:
  - `PARKING_MODE` remains `parking_mode or parked_mode`, then forced false for unparking.
  - `UNPARKING_MODE` remains the effective unparking input flag.
- Updated `wayve.ai.lib.provenance` so `DataProvenance` whitelists and writes the three mode labels as parquet columns when present; non-parking batches get `None`.
- Added tests for:
  - datamodule labels for parking / parked / unparking samples.
  - provenance extraction with and without the optional parking-mode labels.

## Validation

- Passed: `bazel test //wayve/ai/lib:test_provenance`
- Passed: `bazel test //wayve/ai/si/datamodules:py_test --test_arg=wayve/ai/si/datamodules/test/test_parking_unit.py --test_arg='-k=add_parking_mode_records_final_mode_labels or add_parking_mode_sets_parking_input_for_parked_mode' --test_arg=--no-cov`
- Passed: `bazel test //wayve/ai/lib:test_lib_py_lint_ruff //wayve/ai/si/datamodules:py_lint_ruff`
- Note: the same filtered datamodule test without `--no-cov` selected 4 tests and all passed, but the target failed the package coverage threshold because the filter lowered total coverage to 21%.
