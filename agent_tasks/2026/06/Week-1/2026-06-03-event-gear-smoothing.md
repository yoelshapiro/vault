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
