# Parking May 1 Datamodule

- Date: 2026-05-02
- Branch: `boris/training/kangaroo_new_pudo_unpudo_unpark_root`
- PR: none
- Change type: code/tests
- Areas: `wayve/ai/si/configs/parking/`, `wayve/ai/si/test/configs/`

## Summary

Added `parking_bc_new_driving_2026_05_01_directional_unpudo_unpark_gear_change_datamodule` on top of `boris/training/kangaroo_with_50_and_route_shorten`.

The new datamodule keeps the split-alpha2/alpha3 driving data and uses the May 1 PUDO/UNPUDO/unparking materialization root:

`abfss://datasets@wayveproddatasetflat.dfs.core.windows.net/materialised/si/parking/dev/2026_05_01_20_54_01_root_parking_pudo_unpudo_unparking_with_short_buckets_all_disengagements_high_acc/`

## Mix

- Driving: 50%
- PUDO: 20%
- UNPUDO: 13%
- Unparking: 7%
- Gear change: 10%

## Notes

- PUDO includes DC, CA long/short, and pre-CA buckets for USA/UK.
- UNPUDO and unparking include CA long/short and pre-CA buckets plus DC forward/reverse buckets.
- DC forward/reverse buckets are balanced 50/50 within each DC country aggregate, which upsamples reverse relative to raw row counts.
- Gear-change buckets use the May 1 DC PUDO/UNPUDO/unparking gear-change buckets.
- Kept the implementation in `parking_config.py` per Boris's request.

## Validation

- Passed: `bazel test //wayve/ai/si:test_config_py_test --test_arg=-k --test_arg=test_parking_bc_2026_05_01_datamodule_mix`
- Passed: `bazel test //wayve/ai/si:test_config_py_lint_pylint`
- Failed unrelated/pre-existing: `bazel test //wayve/ai/si:test_config_py_lint_flake8` on `wayve/ai/si/configs/versioning/bc_migrations.py:499 E303`.
