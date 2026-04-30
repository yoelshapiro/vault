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

- Event table should include event-window metadata, not sample-level directional-bucket gear:
  - `gearchange_timestamp` for UNPUDO / unparking park-exit decision time.
  - Existing `timestamp_unixus` should become the UNPUDO / unparking movement-start anchor selected by future speed, not current acceleration.
  - Existing `event_startOrEnd_timestampunixus` remains the maneuver end estimate.
  - `gear_to_accel_sec` and `accel_to_end_sec` should remain useful debug columns.
  - Add UNPUDO / unparking gear-change summary columns after the event end is known:
    - `num_gear_changes`
    - `gear_change_timestamps`
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
  - Replace the current UNPUDO / unparking event-anchor rule from `acceleration >= 0.1 m/s^2` to future speed:
    - candidate frame `t` is valid if the first/closest corpus frame in `[t + 0.60s, t + 0.65s]` has speed magnitude at least `0.15 m/s` (`0.54 km/h`)
    - use speed magnitude so reverse movement is not dropped if the speed signal is signed
  - Keep `gearchange_timestamp`, `gear_to_accel_sec`, and `accel_to_end_sec` as first-class debug columns.
  - Add UNPUDO / unparking `num_gear_changes` and `gear_change_timestamps` by scanning cleaned gear transitions between `gearchange_timestamp` and `event_startOrEnd_timestampunixus`.
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
  - Replace the UNPUDO / unparking movement-start selection with future-speed-at-0.6s instead of acceleration.
  - Add UNPUDO / unparking gear-change summary columns after `event_startOrEnd_timestampunixus` is available.
  - Add only other missing UNPUDO / unparking window/debug columns if needed.
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
  - Event table exposes `num_gear_changes` and `gear_change_timestamps` for UNPUDO / unparking.
  - UNPUDO / unparking `timestamp_unixus` is selected by future speed at `+0.6s`, not by current acceleration.
  - Materialization creates generic, forward, reverse, and gear-change UNPUDO / unparking buckets.
  - PUDO and park bucket outputs remain equivalent to the base materialization behavior unless explicitly changed later.
  - Future-speed-filtered generic rows are lower than the old unfiltered rows but not unexpectedly tiny.
  - Reverse rows exist for both UNPUDO and unparking.
  - Gear-change rows are not almost all removed by the future-speed filter.
  - One-day dry-run finishes quickly enough to iterate.
  - Final Azure output has regular `dataset_split=.../dataset_bucket=.../part-00000.parquet.snappy` files and `_parquet_files_list.txt` metadata.

## Decisions

- Use the `+0.6s` future-speed threshold in event detection for selecting the UNPUDO / unparking movement-start anchor, and in materialization for filtering individual expanded movement samples.
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

## Event Timestamp Semantics

- `timestamp_unixus`:
  - PUDO / park: the event anchor at the park transition. This is effectively the PUDO/park maneuver end.
  - UNPUDO / unparking: the movement/acceleration anchor after a park-to-nonzero gear transition. The event notebook detects park exit, finds the first frame that later moved enough, then picks the earliest acceleration frame between gear transition and that moved-enough frame.
  - In the current event notebook, "moved enough" means the haversine distance from the park-exit transition point reaches `UNPUDO_MIN_DISTANCE_M = 5.0m` within a `60s` lookahead. The chosen event timestamp is then the earliest frame between the gear transition and that first `5m` frame where odometry acceleration is at least `UNPUDO_MIN_ACCEL_MPS2 = 0.1 m/s^2`.
  - Planned change: keep the `5m` validation, but replace the acceleration predicate with future speed. The chosen event timestamp should be the earliest frame `t` between the gear transition and first `5m` frame where speed magnitude at the first/closest frame in `[t + 0.60s, t + 0.65s]` is at least `0.15 m/s`.

- `gearchange_timestamp`:
  - UNPUDO / unparking only.
  - The last detected gear shift from park to nonzero before or at `timestamp_unixus`.
  - Null for PUDO / park.

- `event_startOrEnd_timestampunixus`:
  - PUDO / park: estimated maneuver start, found by looking backward from `timestamp_unixus` using distance/time/indicator rules and clamped after the previous event.
  - UNPUDO / unparking: estimated maneuver end, found by looking forward from `timestamp_unixus` until both distance and speed conditions are satisfied, bounded by max lookahead/distance and before the next event.

- `disengagement_timestamp_unixus`:
  - Selected disengagement in the main event window.
  - PUDO / park main window is `[event_startOrEnd_timestampunixus, timestamp_unixus]`; selection prefers the latest disengagement in that window.
  - UNPUDO / unparking main window is `[timestamp_unixus, event_startOrEnd_timestampunixus]`; selection prefers the earliest disengagement in that window.

- `disengagement_timestamp_unixus_fixed_window`:
  - Selected disengagement in a fixed `time_window_seconds` window.
  - PUDO / park: `[timestamp_unixus - time_window_seconds, timestamp_unixus]`.
  - UNPUDO / unparking: `[timestamp_unixus, timestamp_unixus + time_window_seconds]`.
  - Uses the same selection direction as the main window: latest for PUDO/park, earliest for UNPUDO/unparking.

- `disengagement_timestamp_unixus_gear_to_start`:
  - UNPUDO / unparking only.
  - Window is `[gearchange_timestamp, timestamp_unixus]`.
  - Selection prefers the latest disengagement in the window.

- `disengagement_timestamp_unixus_before_gearchange_10s`:
  - UNPUDO / unparking only.
  - Window is `[gearchange_timestamp - 10s, gearchange_timestamp]`.
  - Selection prefers the latest disengagement in the window.

- `disengagement_timestamp_unixus_before_event_start_10s`:
  - PUDO / park only.
  - Window is `[event_startOrEnd_timestampunixus - 10s, event_startOrEnd_timestampunixus]`.
  - Selection prefers the latest disengagement in the window.

For `unparking`, the notebook temporarily relabels it as `unpudo` before disengagement processing, then restores the original event type, so all UNPUDO disengagement-window semantics above apply to unparking too.

## 2026-04-30 Window Semantics Update
- `first_progress_timestamp` / proposed `progress_timestamp_unixus` should mean the first frame after the park-to-D/R transition where the vehicle has made enough post-transition progress.
- Current notebook equivalent is `first_distance_frame`: first frame within 60s after the transition whose haversine distance from the transition point exceeds `UNPUDO_MIN_DISTANCE_M`.
- Rename the config to `UNPUDO_MIN_PROGRESS_DISTANCE_M`; use `10.0m` instead of the current `5.0m` for complex reverse/forward unparks.
- This timestamp is a validation/progress bound, not the maneuver start. It should be used as the end of the materialization window for unpudo/unparking samples.

## 2026-04-30 Sampling Window Decision
- Base unpudo/unparking movement bucket should use `[gearchange_timestamp - 5s, progress_timestamp_unixus]`.
- The base movement bucket should still apply the future-speed filter: closest frame in `[t + 0.60s, t + 0.65s]` must have `abs(speed) >= 0.15m/s`.
- A larger pre-gear window is acceptable here because the future-speed filter prunes long parked/standstill dwell frames; it preserves slack for gear-to-pedal delay.
- Do not include multi-second post-gear standstill unfiltered. That risks teaching the model that shifted-but-waiting is the target behavior, including unsafe-to-move waits.
- Gear-change buckets should be separate from movement buckets.
- Zak reference: `GEAR_CHANGE_BEFORE = 0.0`, `GEAR_CHANGE_AFTER = 0.5`, so his explicit gear-change oversampling is tight and post-change only.
- Wonjoon reference: `select_gear_change_boundary_parking` uses `boundary_sec=1.0`, symmetric around each cleaned gear change, intersected with the parking/unparking maneuver window.
- Proposed first implementation: use a separate gear-change bucket with a tight window, either Zak-like `[gc, gc + 0.5s]` or Wonjoon-like `[gc - 1.0s, gc + 1.0s]`; keep it independent from the future-speed-filtered movement bucket.

## 2026-04-30 Correction: Progress Anchor
- Corrected definition: `first_progress_timestamp` should be based only on the future-speed heuristic, not on distance travelled.
- For UNPUDO/unparking, find the first candidate timestamp after the park-to-D/R transition where the closest frame in `[t + 0.60s, t + 0.65s]` has `abs(speed) >= 0.15m/s`.
- This replaces the current acceleration-based anchor and does not require a 5m/10m distance validation for the materialization anchor.
- Main materialization window: `[gearchange_timestamp - 5s, first_progress_timestamp]` or, if keeping movement samples after start, `[gearchange_timestamp - 5s, event_end]` with the future-speed filter applied per sample.
- Gear-change bucket window: `±1s` around each cleaned gear change, matching the Wonjoon-style symmetric boundary approach.

## 2026-04-30 Finalized Materialization Split
- `first_progress_timestamp` is useful in the event table for downstream analysis/debugging, but it should not bound the materialization window.
- Materialization window for UNPUDO/unparking should be `[gearchange_timestamp - 5s, event_end_10m_timestamp]`.
- The window intentionally includes post-gear-change standstill and the early maneuver; the movement buckets then apply the future-speed filter per candidate timestamp.
- Movement buckets: all timestamps in the materialization window where closest frame in `[t + 0.60s, t + 0.65s]` has `abs(speed) >= 0.15m/s`.
- Gear-change buckets: timestamps within `±1s` around each cleaned gear change inside the event window, without the future-speed filter.
- This produces two distinct signals:
  - speed-filtered UNPUDO/unparking buckets for actual start/progress behavior
  - unfiltered gear-change buckets for gear-decision learning around transitions

## 2026-04-30 Current Disengagement Bucket Behavior
- Event notebook computes several disengagement timestamp columns per event:
  - `disengagement_timestamp_unixus`: selected within the main event window.
  - `disengagement_timestamp_unixus_fixed_window`: selected within a fixed 30s window, but materialization intentionally does not use it.
  - `disengagement_timestamp_unixus_gear_to_start`: UNPUDO/unparking only, selected between gear change and movement anchor.
  - `disengagement_timestamp_unixus_before_gearchange_10s`: UNPUDO/unparking only, selected in the 10s before gear change.
  - `disengagement_timestamp_unixus_before_event_start_10s`: PUDO/park only, selected in the 10s before event start.
- Materialization currently explodes all non-null anchors except `_fixed_window`, then creates three CA windows around each anchor:
  - `pre_ca`: [-1.2s, -0.04s]
  - `ca_short`: [0.0s, 1.48s]
  - `ca_long`: [1.52s, 5.0s]
- Current materialization applies `df_filtered = apply_event_length_cutoff(df_filtered)` before both DC and AV buckets, so AV/disengagement buckets are also affected by event-length filtering.
- Current materialization also applies the unpudo/unparking acceleration filter to AV buckets after the range join.
- Proposed simplification: CA/pre-CA buckets should be driven directly by selected disengagement anchors and should not need the DC movement-window filters. Keep near-disengagement windows; avoid event-length and speed/future-speed filters for those buckets unless we explicitly want to train only accelerating CA samples.
