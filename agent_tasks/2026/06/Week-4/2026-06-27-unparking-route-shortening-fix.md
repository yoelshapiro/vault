# 2026-06-27 Unparking Route Shortening Fix

- Branch: `boris/parking-past30-no-standstill-gear-aug/scarlet_full_gear_root_jitter_g50`
- Change type: code change, tests
- Areas: `wayve/ai/si/datamodules/parking.py`, `wayve/ai/zoo/data/parking.py`, `wayve/ai/si/datamodules/otf.py`

## Summary

- Changed route-shortening handoff from a lookahead-array index to an explicit table index.
- For parking samples, store the detected stop/parking segment start table index.
- For unparking samples, store the first movement table index after the parked segment.
- Updated the zoo parking route-position step to use that table index for both parking and unparking samples.
- Added focused regression coverage for unparking movement-start index storage and route-position propagation.

## Validation

- `bazel test //wayve/ai/zoo/data:test_zoo_data` passed.
- Focused SI datamodule test passed, but the filtered Bazel target failed coverage because only one test was selected.
- Full `//wayve/ai/si/datamodules:py_test` still has unrelated pre-existing failures in filesystem-dependent tests and parking-goal-dropout tests on this branch; the new regression itself passes.
