# 2026-03-18 — SI interleave-control merge conflict resolution

## Context
- Branch: `parking/training/pudo_170326`
- Incoming branch: `zmurez/si_interleave_control`
- Merge was in progress with unresolved conflict in `wayve/ai/si/models/training.py`.

## What I checked
- Verified active merge state via `MERGE_HEAD`.
- Confirmed only one unresolved path remained: `wayve/ai/si/models/training.py`.
- Compared working copy against stage-2 (ours) and stage-3 (theirs) versions.

## Resolution
- Kept parking control keys in deployment config when `use_parking_mode` is enabled:
  - `INITIATE_AUTO_PARKING`
  - `PARKING_DIRECTION`
  - `ENABLE_SHIFT_BY_WIRE`
- Kept interleave-control key wiring:
  - `DILC_MODE` when `enable_behavior_control` is enabled.
- Final `driving_controls_keys` is the union of the two conditionally-enabled sets.

## Files touched
- `wayve/ai/si/models/training.py`

## Status
- Merge conflicts resolved (`git diff --name-only --diff-filter=U` is empty).
- Merge is still in progress (no merge commit created in this step).
