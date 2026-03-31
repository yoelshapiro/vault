# 2026-03-31 — Parking PUDO radar DMI defaults follow-up

## Context
Follow-up on `parking/training/pudo` for parking mode `parking_bc_train_release_2026_5_11` with data module `pudo_bc_D26_3_3_datamodule`, after radar config regressions related to revert PR #102602.

## Problem
Generated Gen2 inference config could carry empty radar feature list and `points_per_scan=0` for `radar_data`, which surfaced as missing radar features/points on deployed parking models.

## Root Cause
`wayve/ai/lib/interfaces_v2.py` no longer explicitly populated radar DMI tensor fields in `create_input_entries(...)` after the radar-feature revert, so serialized inference config could omit critical radar defaults.

## Changes
- `wayve/ai/lib/interfaces_v2.py`
  - Added explicit radar defaults aligned with C++ tensorizer defaults:
    - `DEFAULT_RADAR_POINTS_PER_SCAN = 800`
    - `LEGACY_RADAR_FEATURES = [X_M, Y_M, Z_M, RANGE_RATE_MPS, SNR_DB]`
  - Extended `DeploymentConfig` with:
    - `radar_features`
    - `max_radar_points_per_scan`
  - Updated `create_input_entries(...)` to always set for `radar_data`:
    - `entry.radar_data.radar_features`
    - `entry.radar_data.points_per_scan`
  - Updated `random_inputs(...)` to respect deployment radar shape instead of hardcoded `(800, 5)`.

- `wayve/ai/lib/test/test_interface_v2.py`
  - Added regression tests:
    - `test_create_input_entries_sets_default_radar_shape_and_features`
    - `test_create_input_entries_respects_custom_radar_shape_and_features`

- `wayve/ai/si/deploy.py`
  - Added deploy-time pruning of deprecated radar config keys for compatibility with pre-revert sessions:
    - `model.model.radar_features`
    - `model.model.max_radar_points_per_scan`
    - `model.radar_features`
    - `model.max_radar_points_per_scan`
    - `datamodule.radar_features`
    - `datamodule.max_radar_points_per_scan`

## Validation
- `python -m compileall wayve/ai/lib/interfaces_v2.py wayve/ai/lib/test/test_interface_v2.py wayve/ai/si/deploy.py` passed.
- `bazel test //wayve/ai/lib:test_lib_py_test --test_arg=--cov-fail-under=0 --test_arg=-k --test_arg="test_create_input_entries_sets_default_radar_shape_and_features or test_create_input_entries_respects_custom_radar_shape_and_features"` passed.
- Note: running the same target without `--cov-fail-under=0` fails the target-level coverage gate when only two tests are selected via `-k` (expected for narrow slices).
