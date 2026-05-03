# Parking Materialization Window Cap

## Summary
- Branch: `boris/parking-materialization-config-dry-run`
- Worktree: `/tmp/wayvecode-parking-materialization-config-dry-run`
- File: `wayve/ai/parking/notebooks/PUDO and UNPUDO materilization.ipynb`

## Changes
- Added `CONFIG.unpudo_unparking_max_after_last_gear_change_us = 30_000_000`.
- Added `CONFIG.disengagement_what_blacklist = ("uncategorised", "uncategorized")`.
- For DC UNPUDO/unparking movement buckets, capped `window_end_timestamp` to `min(event_startOrEnd_timestampunixus, last_gear_change_timestamp + 30s)`.
- For AV UNPUDO/unparking buckets, filtered disengagement anchors after `last_gear_change_timestamp + 30s` and capped the resulting AV window end to the same cap.
- Replaced AV timestamp array expansion with a valid-anchor array that removes anchors whose matching `disengagement_what*` column is blacklisted.
- Preserved fallback behavior for older event tables: if `gear_change_timestamps` is missing, `last_gear_change_timestamp` falls back to `gearchange_timestamp`.

## Validation
- Parsed notebook JSON and every code cell with Python `ast.parse` successfully.
