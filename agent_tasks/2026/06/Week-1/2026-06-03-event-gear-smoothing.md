# 2026-06-03 Event Gear Smoothing

- Branch: `boris/materialization_unsafe_moving_buckets`
- Worktree: `/workspace/materialization`
- PR: `https://github.com/wayveai/WayveCode/pull/115845`
- Change type: Notebook code change, uncommitted
- Areas:
  - `/workspace/materialization/wayve/ai/parking/notebooks/pudo_unpudo_event_detection.ipynb`

## Summary

- Added configurable gear smoothing before PUDO / UnPUDO candidate generation.
- Short gear segments below `GEAR_SMOOTHING_MIN_SEGMENT_US` inherit the previous stable gear segment.
- Added per-frame `gear_change_to_park` and `gear_change_from_park` booleans from smoothed gear.
- Switched PUDO and UnPUDO gear-transition candidate seeds to use those booleans.
- Preserved the raw gear column and kept the output event table schema unchanged.

## Validation

- `python3 -m json.tool wayve/ai/parking/notebooks/pudo_unpudo_event_detection.ipynb`
- Parsed all notebook code cells with Python AST.
- `git diff --check`
- Static invariant checks for config flags, transition columns, and smoothed-gear candidate usage.

## Follow-up Runtime Fix

- Removed the trip-table helper's stale join to `prod_analytics.analytics.robotaxi_disengagement`.
- The join referenced unavailable `episode_start_lat` / `episode_start_lon` columns and its `event_success` output was not consumed by downstream candidate matching.
- Pushed commit `65736381549e` with the fix.

## Follow-up Duplicate Event Fix

- After the smoothed-gear change, the event notebook could emit duplicate rows for the same logical event key.
- Root cause:
  - PUDO candidates can enter through both hazard-window evidence and trip-summary evidence.
  - The geofence helper used unique keep keys but joined them back to the original candidate rows, preserving any duplicates for the same key.
  - The enrichment stage deduplicated anchors internally, but then joined enrichment back onto the original `all_candidates_final`, so duplicate event rows still reached the output table.
- Code change:
  - Added `dedup_rows_by_key(events_df, key_cols)` to keep one deterministic row per logical event key.
  - Applied it after location deduplication and after office-geofence filtering.
  - Applied it to the final candidate union before URL/relative-time/enrichment.
  - Marked trip-summary PUDO candidates as `source = "trip_summary"` instead of inheriting `source = "hazards"`.
  - Added an optional duplicate-key diagnostic under `ENABLE_PROGRESS_COUNTS`.
- Validation:
  - `jq empty wayve/ai/parking/notebooks/pudo_unpudo_event_detection.ipynb`
  - Parsed all notebook code cells with Python AST.
  - `git diff --check -- wayve/ai/parking/notebooks/pudo_unpudo_event_detection.ipynb`

## Isolated PR

- Created branch `boris/event_creation_gear_fix` from latest `origin/main`.
- Cherry-picked only the event notebook gear-smoothing and stale-trip-join commits.
- Resolved the notebook conflict by keeping the isolated behavior that removes the unused disengagement proximity join.
- Opened draft PR: `https://github.com/wayveai/WayveCode/pull/116673`.
- Removed unused `prev2_gear_direction` and `next_gear_direction` columns from the PR branch in commit `1f11d77ece53`.
