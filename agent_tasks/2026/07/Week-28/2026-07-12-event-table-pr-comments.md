# 2026-07-12 Event Table PR Comments

- Branch: `boris/pudo_generic_materialization`
- PR: `#117075`
- Areas:
  - `wayve/ai/services/sampling/datasets/parking_pudo/event_table.py`
  - `wayve/ai/services/sampling/test/datasets/parking_pudo/test_parking_pudo_filters.py`

## Summary

Addressed the agreed `event_table.py` review comments for Parking/PUDO generic events.

## Changes

- Renamed local event-table variables from generic `park_start` / `park_end` wording to `park_gear_*` to avoid ambiguity between the gear segment and semantic park/PUDO labels.
- Changed PUDO arrival classification to inspect the full parked gear segment context instead of only the single pre-park context frame.
- Changed UnPUDO departure classification to inspect only the parked gear segment context instead of extending through the departure anchor.
- Renamed the departure displacement helper result from `five_meter_idx` to `departure_displacement_idx`.
- Updated trip-id matching to scan the same event context span used for hazard/trip metadata.
- Added regression coverage for late PUDO evidence inside the parked segment and post-park/pre-departure evidence that must not relabel UnPUDO.
- Updated stale brake override test fixtures to use the branch's compressed start/end timestamp columns so the shared test target can collect and pass.

## Verification

- `python -m py_compile wayve/ai/services/sampling/datasets/parking_pudo/event_table.py wayve/ai/services/sampling/test/datasets/parking_pudo/test_parking_pudo_filters.py`
- `bazel test //wayve/ai/services/sampling:test_datasets`
