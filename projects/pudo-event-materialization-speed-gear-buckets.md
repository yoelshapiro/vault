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
- Do not hard-remove long UNPUDO / unparking events by default; long reverse/forward maneuvers are exactly the cases we care about.
- Keep generic buckets and add directional / gear-change buckets additively.
- Use the original fsspec Azure writer style for final output, not native Spark parquet output.
- Add fast dry-run and date-filter controls before running full materialization.

## Intended Behavior

- Event table should include enough event-level gear metadata:
  - `gear_direction` for the detected event transition.
  - `prev_gear_direction` for the gear before the detected transition.
  - `gearchange_timestamp` for UNPUDO / unparking park-exit decision time.
  - Existing `timestamp_unixus` remains the UNPUDO / unparking movement/acceleration anchor.
  - Existing `event_startOrEnd_timestampunixus` remains the maneuver end estimate.

- Event table should not try to store the `+0.6s` speed cutoff result:
  - The cutoff is sample-level, not event-level.
  - A single event expands into many candidate training samples, each with a different `sample_timestamp + 0.6s`.

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

## Design

- Event notebook changes:
  - Preserve the gear metadata that already exists in candidate DataFrames instead of dropping it during standardization.
  - Add `gear_direction` and `prev_gear_direction` to PUDO, park, UNPUDO, and unparking standardized output schemas.
  - Keep `gearchange_timestamp`, `gear_to_accel_sec`, and `accel_to_end_sec` as first-class debug columns.
  - Add a small summary section for UNPUDO / unparking counts by `gear_direction`, plus gear-to-accel and event-duration distributions.
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
  - Build bucket samples as one tagged DataFrame with columns like `run_id`, `timestamp_unixus`, `dataset_bucket`, and helper metadata.
  - Join to `wayve_corpus.all_data` once per logical need, after restricting by:
    - event run IDs
    - global min/max timestamp bounds
    - required columns only
  - Compute future-speed matches once for all generic UNPUDO / unparking samples, then derive full/forward/reverse variants from that result.
  - Compute cleaned gear transitions once for bounded event windows, then derive gear-change buckets from those boundaries.
  - Use the original fsspec materialization writer and metadata generation exactly, because Spark-native parquet output previously failed to appear in the SWE training storage account.

## Plan

- Inspect the base notebooks and confirm the current schema:
  - Confirm which gear columns are computed but dropped in the event notebook.
  - Confirm current materialization uses acceleration filtering, event-length removal, per-bucket actions, and repeated joins.

- Update the event notebook first:
  - Add gear metadata columns to the final event table schema.
  - Preserve compatibility with existing materialization columns.
  - Add lightweight summary displays only; avoid full `display(df)` on large event tables by default.

- Update the materialization notebook second:
  - Replace acceleration filtering with future-speed filtering for generic UNPUDO / unparking samples.
  - Refactor bucket construction toward one tagged DataFrame instead of many action-heavy bucket DataFrames.
  - Add forward/reverse variants from future matched gear direction.
  - Add gear-change buckets from event `gearchange_timestamp` and optional in-window cleaned corpus gear boundaries.
  - Keep gear-change buckets separate from the future-speed movement filter unless we explicitly decide otherwise.

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
  - Event table exposes `gear_direction`, `prev_gear_direction`, `gearchange_timestamp`, `gear_to_accel_sec`, and `accel_to_end_sec` for UNPUDO / unparking analysis.
  - Materialization creates generic, forward, reverse, and gear-change UNPUDO / unparking buckets.
  - Future-speed-filtered generic rows are lower than the old unfiltered rows but not unexpectedly tiny.
  - Reverse rows exist for both UNPUDO and unparking.
  - Gear-change rows are not almost all removed by the future-speed filter.
  - One-day dry-run finishes quickly enough to iterate.
  - Final Azure output has regular `dataset_split=.../dataset_bucket=.../part-00000.parquet.snappy` files and `_parquet_files_list.txt` metadata.

## Decisions

- Keep the `+0.6s` speed cutoff in materialization, not event detection.
- Do not default to event-length removal for UNPUDO / unparking.
- Do not apply the movement future-speed cutoff to gear-change buckets by default.
- Prefer one shared bounded corpus join per operation over per-bucket joins/actions.
- Use fsspec writer for final output.

## Notes

- The base event notebook already has stable park-to-nonzero detection using `prev_gear_direction`, `prev2_gear_direction`, and `next_gear_direction`, but the standardized output drops `gear_direction` / `prev_gear_direction`.
- The base materialization notebook currently filters UNPUDO / unparking samples by current acceleration `>= 0.7341269935880388 m/s^2` and uses hard event-length removal: `unpudo=10s`, `unparking=10s`.
- The previous gear-change materialization produced very small gear-change buckets because the speed/motion filter was downstream and removed many pre-decision samples.
