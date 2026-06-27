# 2026-06-27 Unparking Route Shortening Fix

- Branch: `boris/parking-past30-no-standstill-gear-aug/scarlet_full_gear_root_jitter_g50`
- Change type: code change, tests
- Areas: `wayve/ai/si/datamodules/parking.py`

## Summary

- Kept the existing `_parking_entry_lookahead_index` handoff contract.
- For parking samples, continue storing the detected stop/parking segment as a lookahead index.
- For unparking/pre-start samples, find the first movement after the parked segment and store that as the lookahead index.
- Added focused regression coverage for unparking movement-start lookahead index storage.

## Validation

- Focused SI datamodule test passed, but the filtered Bazel target failed coverage because only one test was selected.
