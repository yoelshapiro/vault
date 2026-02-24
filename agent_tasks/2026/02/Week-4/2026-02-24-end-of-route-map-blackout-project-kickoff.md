# 2026-02-24 — End-of-route map blackout project kickoff

## Summary
- Created project page [[projects/parking-end-of-route-map-blackout-augmentation]].
- Set active project to `parking-end-of-route-map-blackout-augmentation`.
- Reviewed previous project context from [[projects/parking-stopping-mode-dilc]].
- Reviewed `boris/stopping_mode` PR `#93171` and separated blackout vs route-shortening phases.

## What We Learned From `boris/stopping_mode`
- Blackout version existed first in commit `a912c7c` (`feat(parking): add end-of-route blackout in otf`):
  - Added `enable_end_of_route_blackout` config/datamodule flag.
  - Added `insert_parking_data_with_end_of_route_blackout` in `wayve/ai/zoo/data/parking.py`.
  - Applied blackout by zeroing `DataKeys.MAP_ROUTE` (and `DataKeys.MAP_SPEED_LIMITS` when present) on parking-detected samples.
- Route-shortening replaced blackout starting with commit `974ce33` and expanded in later commits:
  - New route-shortening flags + parking entry keys.
  - Truncation logic moved into `wayve/ai/lib/data/pipes/routes.py`.
  - Later additions include stop-route index/fraction, stopping_mode, hazard windows, and wrapper/model wiring.

## Blackout-Only Port Scope
- Keep only parking-path blackout augmentation logic.
- Avoid route-shortening implementation and route polyline truncation changes.
- Keep behavior train-only and flag-gated.

## Working Context
- Current branch: `boris/train/pudo_15_02_26`
- Reference branch: `boris/stopping_mode`
- Reference PR: `#93171`

## Next Steps
1. Port blackout-only OTF + parking changes (minimal touch set).
2. Add/adjust regression coverage for blackout gating and map tensor mutation.
3. Validate on targeted parking/OTF tests.
