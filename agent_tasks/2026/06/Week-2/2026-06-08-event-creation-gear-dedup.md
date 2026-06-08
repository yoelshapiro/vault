# Event Creation Gear Dedup

- Branch: `boris/event_creation_gear_fix`
- Change type: Notebook code change, uncommitted
- Areas: `/workspace/WayveCode/wayve/ai/parking/notebooks/pudo_unpudo_event_detection.ipynb`

## Summary

- Investigated duplicate final event rows after gear smoothing.
- Added one final event-key dedupe stage after event-type union and date filtering.
- The dedupe key is `(runID, timestamp_unixus, event_type)`.
- Tie-breaks prefer rows with coordinates, then gear-change metadata, then closest transition distance.
- Removed the `ENABLE_GEAR_SMOOTHING` flag; smoothing is always applied.
- Reviewed PR comments on `116673`.
- Added post-cast gear validation, leading-short-segment smoothing to next stable gear, trip-table candidate progress metrics, and a final event-key uniqueness guard.
- Changed PUDO/park disengagement blacklist semantics so a blacklisted main-window disengagement removes the event instead of only suppressing metadata.
- Kept UnPUDO blacklist behavior separate; it still only controls selected disengagement metadata.

## Validation

- `jq empty wayve/ai/parking/notebooks/pudo_unpudo_event_detection.ipynb`
- Extracted notebook code parses with `ast.parse`.
- `git diff --check`
