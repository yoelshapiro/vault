# PUDO Event + Materialization Speed/Gear Buckets

## Overview

We want to extend the base `parking/notebooks` notebooks so the parking event table and materialized buckets support:

- UNPUDO / unparking sample filtering by future speed at about `+0.6s`, matching the controller threshold idea (`0.15 m/s`, `0.54 km/h`).
- Additive forward/reverse UNPUDO and unparking buckets.
- Additive gear-change / gear-decision buckets around park-exit and in-maneuver gear transitions.
- A workflow that runs fast enough on Databricks and writes Azure materializations in the format training can consume.

Base branch: `parking/notebooks`

Relevant notebooks:

- `wayve/ai/parking/notebooks/PUDO and UnPUDO Event Detection.ipynb`
- `wayve/ai/parking/notebooks/PUDO and UNPUDO materilization.ipynb`

## Status

- Date: `2026-04-30`
- Branch: `parking/notebooks`
- State: planning only; no notebook edits yet in this pass.
- Previous full-materialization attempt ran for roughly five hours and produced worse output. The likely causes were repeated Spark actions, repeated corpus joins, full-window expansion, expensive displays/counts, and mixing sample-level filtering with gear-change sampling in a way that removed useful gear-change rows.

## Requirements

- Start from the clean base notebooks on `parking/notebooks`.
- Keep the event notebook as the source of event-level truth.
- Keep the materialization notebook responsible for sample-level filtering after timestamp expansion.
- Only apply speed/gear extensions to UNPUDO and unparking materialization paths; PUDO and park buckets should stay on the existing path unless we identify a separate need.
- Do not hard-remove long UNPUDO / unparking events by default; long reverse/forward maneuvers are exactly the cases we care about.
- Keep generic buckets and add directional / gear-change buckets additively.
- Use the original fsspec Azure writer style for final output, not native Spark parquet output.
- Add fast dry-run and date-filter controls before running full materialization.

## Intended Behavior

- Event table should include event-window metadata, not sample-level gear:
  - `gearchange_timestamp` for UNPUDO / unparking park-exit decision time.
  - Existing `timestamp_unixus` remains the UNPUDO / unparking movement/acceleration anchor.
  - Existing `event_startOrEnd_timestampunixus` remains the maneuver end estimate.
  - `gear_to_accel_sec` and `accel_to_end_sec` should remain useful debug columns.
  - Optional: add explicit event window columns for materialization readability, for example `materialization_window_start_unixus` and `materialization_window_end_unixus`, but only if this simplifies the materialization notebook without duplicating logic.

- Event table should not store event-level `gear_direction` for this project:
  - Directional buckets need gear at each materialized sample/future timestamp, not just at the event anchor.
  - The materialization notebook already has to join corpus for future speed, so it should fetch sample-level gear in the same restricted corpus path.

- Generic DC UNPUDO / unparking buckets should represent samples that lead to motion:
  - Expand the normal movement window from movement anchor to event end.
  - Join each sample to the first/closest corpus frame in `[sample_ts + 0.60s, sample_ts + 0.65s]`.
  - Keep samples where `abs(future_speed_kmh) >= 0.54`.

- Forward/reverse UNPUDO / unparking buckets should be additive variants of the filtered generic samples:
  - Use cleaned future gear direction at the matched future-speed frame.
  - `_forward` means future gear direction is `1`.
  - `_reverse` means future gear direction is `-1`.
  - Keep the original generic bucket as well.

- Gear-change buckets should be separate from generic future-speed-filtered movement buckets:
  - They target the decision boundary, often while still standing still.
  - Applying the `+0.6s` speed filter to pre-change standstill samples can delete most of the bucket, which is what we observed before.
  - Build windows around gear boundaries, for example `[-0.9s, +0.5s]` from the boundary.
  - Directional gear-change variants should use the new gear after the boundary.

- Gear-change boundary sources:
  - Always include event-level UNPUDO / unparking `gearchange_timestamp` for the initial park-to-drive/reverse transition.
  - Optionally include additional cleaned in-maneuver gear transitions inside `[gearchange_timestamp, event_startOrEnd_timestampunixus]`, especially reverse-to-drive transitions in two/three-point maneuvers.
  - These boundary detections are only for UNPUDO / unparking.

## Design

- Event notebook changes:
  - Do not add `gear_direction` / `prev_gear_direction` just for materialization; those would be event-anchor values and not sufficient for per-sample directional buckets.
  - Keep `gearchange_timestamp`, `gear_to_accel_sec`, and `accel_to_end_sec` as first-class debug columns.
  - Consider adding explicit materialization window columns for UNPUDO / unparking if they make the materialization notebook simpler.
  - Add a small summary section for UNPUDO / unparking gear-to-accel and event-duration distributions.
  - Avoid changing the core event detection thresholds in the first implementation unless the output stats prove we need to.

- Materialization notebook changes:
  - Add explicit config flags:
    - `UNPUDO_UNPARKING_FUTURE_SPEED_FILTER_ENABLED`
    - `FUTURE_SPEED_LOOKAHEAD_MIN_US = 600_000`
    - `FUTURE_SPEED_LOOKAHEAD_MAX_US = 650_000`
    - `MIN_FUTURE_SPEED_KMH = 0.54`
    - `ENABLE_DIRECTIONAL_BUCKETS`
    - `ENABLE_GEAR_CHANGE_BUCKETS`
    - `DRY_RUN_MATERIALIZATION`
    - optional date filters for quick tests
  - Disable hard event-length removal for UNPUDO / unparking by default. Keep the code path as a flag, but do not use it as the default.
  - Stop doing per-bucket `limit(1).count()` checks. Empty buckets should naturally disappear from final summaries.
  - Leave PUDO and park bucket generation unchanged except for shared refactor mechanics.
  - Build bucket samples as one tagged DataFrame with columns like `run_id`, `timestamp_unixus`, `dataset_bucket`, and helper metadata.
  - Join to `wayve_corpus.all_data` once per logical need, after restricting by:
    - event run IDs
    - global min/max timestamp bounds
    - required columns only
  - Compute future-speed matches once for generic UNPUDO / unparking samples, then derive full/forward/reverse variants from that result.
  - Compute cleaned gear transitions once for bounded UNPUDO / unparking event windows, then derive gear-change buckets from those boundaries.
  - Use the original fsspec materialization writer and metadata generation exactly, because Spark-native parquet output previously failed to appear in the SWE training storage account.

## Plan

- Inspect the base notebooks and confirm the current schema:
  - Confirm the event notebook already emits the required window/timing columns for UNPUDO / unparking.
  - Confirm current materialization uses acceleration filtering, event-length removal, per-bucket actions, and repeated joins.

- Update the event notebook first:
  - Add only missing UNPUDO / unparking window/debug columns if needed.
  - Do not add event-level gear fields unless a separate analysis need appears.
  - Add lightweight summary displays only; avoid full `display(df)` on large event tables by default.

- Update the materialization notebook second:
  - Replace acceleration filtering with future-speed filtering for generic UNPUDO / unparking samples.
  - Refactor bucket construction toward one tagged DataFrame instead of many action-heavy bucket DataFrames.
  - Add forward/reverse variants from future matched gear direction.
  - Add gear-change buckets from event `gearchange_timestamp` and optional in-window cleaned corpus gear boundaries.
  - Keep gear-change buckets separate from the future-speed movement filter unless we explicitly decide otherwise.
  - Do not add speed/gear variants for PUDO or park.

- Add safe runtime controls:
  - `DRY_RUN_MATERIALIZATION = True` by default while validating.
  - Date filters for a one-day test.
  - Summary tables before write: source events, expanded samples, filtered samples, forward/reverse split, gear-change counts.
  - No large `display(...)` on raw event/materialized data by default.

- Validate in stages:
  - Parse notebook JSON and all code cells locally.
  - Run the event notebook on a bounded date range if needed.
  - Run materialization dry-run on one day and inspect counts.
  - Run materialization dry-run on a wider range and compare counts against the previous known buckets.
  - Only then run `DRY_RUN_MATERIALIZATION = False`.

- Acceptance criteria:
  - Event table exposes or preserves the timing/window columns needed for UNPUDO / unparking materialization: `gearchange_timestamp`, `timestamp_unixus`, `event_startOrEnd_timestampunixus`, `gear_to_accel_sec`, and `accel_to_end_sec`.
  - Materialization creates generic, forward, reverse, and gear-change UNPUDO / unparking buckets.
  - PUDO and park bucket outputs remain equivalent to the base materialization behavior unless explicitly changed later.
  - Future-speed-filtered generic rows are lower than the old unfiltered rows but not unexpectedly tiny.
  - Reverse rows exist for both UNPUDO and unparking.
  - Gear-change rows are not almost all removed by the future-speed filter.
  - One-day dry-run finishes quickly enough to iterate.
  - Final Azure output has regular `dataset_split=.../dataset_bucket=.../part-00000.parquet.snappy` files and `_parquet_files_list.txt` metadata.

## Decisions

- Keep the `+0.6s` speed cutoff in materialization, not event detection.
- Do not add event-level gear for this project; fetch gear per materialized timestamp in materialization.
- Limit speed/gear extensions to UNPUDO and unparking.
- Do not default to event-length removal for UNPUDO / unparking.
- Do not apply the movement future-speed cutoff to gear-change buckets by default.
- Prefer one shared bounded corpus join per operation over per-bucket joins/actions.
- Use fsspec writer for final output.

## Notes

- The base event notebook already has stable park-to-nonzero detection using `prev_gear_direction`, `prev2_gear_direction`, and `next_gear_direction`, but this project does not need to persist those event-anchor values into the event table.
- The base materialization notebook currently filters UNPUDO / unparking samples by current acceleration `>= 0.7341269935880388 m/s^2` and uses hard event-length removal: `unpudo=10s`, `unparking=10s`.
- The previous gear-change materialization produced very small gear-change buckets because the speed/motion filter was downstream and removed many pre-decision samples.
