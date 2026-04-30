# PUDO Event + Materialization Speed/Gear Buckets

## Overview

Extend the base `parking/notebooks` event and materialization notebooks so PUDO/park and UNPUDO/unparking training buckets better cover:

- starting from parked state
- gear-decision points
- reverse/forward unparking and UNPUDO
- corrective-action windows around disengagements

Base branch: `parking/notebooks`

Relevant notebooks:

- `wayve/ai/parking/notebooks/PUDO and UnPUDO Event Detection.ipynb`
- `wayve/ai/parking/notebooks/PUDO and UNPUDO materilization.ipynb`

## Current Status

- Date: `2026-04-30`
- Branch: `parking/notebooks`
- State: design finalized; one small event-notebook edit already made to stop blacklisting `uncategorised` for PUDO/park disengagements.
- Previous full-materialization attempt was too slow and produced worse output. Avoid repeating it by separating event-level logic from materialization filtering and by keeping CA windows independent from DC movement filters.

## Current Timestamp Semantics

### PUDO / Park

- `timestamp_unixus`
  - The gear transition into park/neutral.
  - This is the PUDO/park event endpoint.

- `event_startOrEnd_timestampunixus`
  - Bad name, but for PUDO/park it means estimated maneuver start.
  - Current estimation looks backward from `timestamp_unixus` using:
    - 30m backward distance rule
    - 12s backward time cap
    - optional left/right indicator extension
    - clamp after previous event

- Indicator extension
  - Currently used.
  - Uses left/right indicator ON edge, not hazard and not indicator-off as the start anchor.
  - Requires a later indicator OFF edge within 30m.
  - If active, start can become `latest_indicator_on_ts - 3s`.

- Hazard
  - Used to identify PUDO candidates: hazard within ±10s of the park transition.
  - Not currently used to extend the materialization window.

### UNPUDO / Unparking

- `gearchange_timestamp`
  - Park/neutral to drive/reverse transition.
  - This is the gear-decision anchor.

- `timestamp_unixus`
  - Movement/progress anchor after leaving park.
  - Planned update: choose it using future speed, not current acceleration.

- `first_progress_timestamp`
  - New/explicit analysis column.
  - Same logical anchor as the future-speed movement/progress timestamp.
  - Defined as first candidate timestamp after park-to-D/R where the closest frame in `[t + 0.60s, t + 0.65s]` has `abs(speed) >= 0.15 m/s`.
  - Useful for analysis and disengagement windows, but not the materialization window end.

- `event_startOrEnd_timestampunixus`
  - Bad name, but for UNPUDO/unparking it means event end.
  - Should represent the post-start maneuver endpoint, based on moving enough after gear exit.
  - Use 10m progress for this endpoint.

## Event Notebook Changes

### PUDO / Park

- Keep PUDO/park detection as-is:
  - drive/reverse to park/neutral transition
  - PUDO evidence from hazard and/or trip table
  - otherwise `park` when park events are enabled

- Keep PUDO/park start estimation as-is:
  - `event_startOrEnd_timestampunixus` remains estimated maneuver start
  - keep indicator extension enabled

- Disengagement blacklist:
  - Do not blacklist `uncategorised` for PUDO/park.
  - Continue blacklisting `accidental_avso_intervention`.
  - Rationale: if it is not accidental, an uncategorised intervention near a PUDO/park event is probably related enough to keep for now.

### UNPUDO / Unparking

- Replace acceleration-based movement-anchor selection with future-speed selection:
  - candidate timestamp `t`
  - find closest corpus frame in `[t + 0.60s, t + 0.65s]`
  - require `abs(speed) >= 0.15 m/s` (`0.54 km/h`)
  - use speed magnitude so reverse movement is retained if speed is signed

- Keep/emit:
  - `gearchange_timestamp`
  - `timestamp_unixus` as the movement/progress anchor
  - `first_progress_timestamp` for explicit analysis readability
  - `event_startOrEnd_timestampunixus` as the 10m event-end endpoint
  - `gear_to_accel_sec` / renamed equivalent if we rename the anchor from accel to progress
  - `accel_to_end_sec` / renamed equivalent if needed

- Add gear-change summary columns for UNPUDO/unparking after event end is known:
  - `num_gear_changes`
  - `gear_change_timestamps`

- Gear changes should be based on cleaned gear, not raw noisy gear where possible.

## Disengagement Logic

### PUDO / Park

- Main detector:
  - window: `[event_startOrEnd_timestampunixus, timestamp_unixus]`
  - selection: latest disengagement in the maneuver window
  - output: `disengagement_timestamp_unixus`

- Before-start detector:
  - window: `[event_startOrEnd_timestampunixus - 10s, event_startOrEnd_timestampunixus]`
  - selection: latest disengagement
  - output: `disengagement_timestamp_unixus_before_event_start_10s`

- Fixed-window detector exists but should not be used by materialization unless explicitly needed:
  - `disengagement_timestamp_unixus_fixed_window`

### UNPUDO / Unparking

- Before-gearchange detector:
  - window: `[gearchange_timestamp - 10s, gearchange_timestamp]`
  - keep as 10s
  - rationale: if the correction was much earlier than gear change, it is likely less related because the driver later drove away
  - output: `disengagement_timestamp_unixus_before_gearchange_10s`

- Gear-to-start detector:
  - window: `[gearchange_timestamp, first_progress_timestamp]`
  - catches shifted-but-still-standstill failures
  - output: `disengagement_timestamp_unixus_gear_to_start`

- Main maneuver detector:
  - window: `[first_progress_timestamp, event_startOrEnd_timestampunixus]`
  - catches wrong/unsafe maneuver after movement begins
  - output: `disengagement_timestamp_unixus`

- Fixed-window detector exists but should not be used by materialization unless explicitly needed.

## Materialization Notebook Changes

### Shared Runtime/Implementation Rules

- Keep generic/full buckets and add new variants additively.
- Use the original fsspec Azure writer style for final output.
- Add date filters / dry-run controls for fast validation.
- Avoid large raw `display(...)` calls and repeated per-bucket Spark actions.
- Prefer tagged DataFrames and bounded joins over many independent per-bucket joins.
- Do not apply event-length cutoff globally to CA/pre-CA buckets.
- Keep CA/pre-CA buckets centered on disengagement anchors only.

### DC PUDO / Park Normal Buckets

Keep current normal bucket window:

```text
event_startOrEnd_timestampunixus -> timestamp_unixus + 2s
```

- No speed filter.
- No future-speed filter.
- This samples estimated approach/maneuver through the final park transition and a short tail after park.

### DC PUDO / Park Gear-Change Buckets

Add separate gear-change buckets:

```text
gear_change_ts - 1s -> gear_change_ts + 1s
```

- Sample around cleaned gear transitions inside the PUDO/park maneuver window.
- Explicitly include the final transition into park:

```text
timestamp_unixus - 1s -> timestamp_unixus + 1s
```

- No speed filter.
- Keep separate from normal PUDO/park buckets.

### DC UNPUDO / Unparking Normal Buckets

Use full event materialization window:

```text
gearchange_timestamp - 5s -> event_startOrEnd_timestampunixus
```

Then apply future-speed filtering per candidate timestamp:

```text
closest frame in [t + 0.60s, t + 0.65s]
abs(speed) >= 0.15 m/s
```

- This keeps samples that are close to actual movement/progress.
- Times between gear change and first movement are naturally filtered out in normal movement buckets.
- Keep full generic buckets.

### DC UNPUDO / Unparking Forward/Reverse Buckets

Add directional variants from the future-speed matched frame:

- `_forward`: matched/cleaned future gear is `1`
- `_reverse`: matched/cleaned future gear is `-1`

Keep the full generic bucket as well.

### DC UNPUDO / Unparking Gear-Change Buckets

Add separate gear-change buckets:

```text
gear_change_ts - 1s -> gear_change_ts + 1s
```

- Include initial park-to-D/R transition at `gearchange_timestamp`.
- Include cleaned in-maneuver gear transitions between `gearchange_timestamp` and `event_startOrEnd_timestampunixus`.
- Do not apply future-speed filtering.
- These buckets are for gear-decision learning, including standstill frames around the transition.

### AV / CA Buckets

Use selected disengagement anchors only:

- `disengagement_timestamp_unixus`
- `disengagement_timestamp_unixus_gear_to_start`
- `disengagement_timestamp_unixus_before_gearchange_10s`
- `disengagement_timestamp_unixus_before_event_start_10s`

Do not use `_fixed_window` by default.

Materialize windows around each selected anchor:

```text
pre_ca:   [-1.2s, -0.04s]
ca_short: [0.0s, 1.48s]
ca_long:  [1.52s, 5.0s]
```

- Do not apply DC movement/future-speed filters by default.
- Do not apply event-length cutoff by default.
- If we later want accelerating-only CA buckets, create explicit separate bucket names.

## Validation Plan

- Parse notebook JSON and code cells locally after edits.
- Run event notebook on a bounded date range.
- Inspect event counts by type and country.
- Inspect PUDO/park `event_startOrEnd_method` distribution, especially `indicator_extension`.
- Inspect UNPUDO/unparking:
  - gear-to-progress duration
  - progress-to-end duration
  - gear-change count distribution
  - reverse/forward distribution
- Run materialization dry-run on one day.
- Check bucket counts:
  - full PUDO/park buckets
  - PUDO/park gear-change buckets
  - full UNPUDO/unparking buckets
  - UNPUDO/unparking forward/reverse buckets
  - UNPUDO/unparking gear-change buckets
  - CA/pre-CA buckets
- Confirm gear-change buckets are not accidentally filtered by future speed.
- Confirm final output layout matches training expectations:

```text
dataset_split=train/dataset_bucket=<bucket>/part-00000.parquet.snappy
_parquet_files_list.txt
```

## Acceptance Criteria

- PUDO/park normal buckets remain equivalent to current behavior except for additive gear-change buckets.
- PUDO/park gear-change buckets include the final transition into park.
- PUDO/park disengagement materialization can use uncategorised non-accidental interventions.
- UNPUDO/unparking movement anchor uses future-speed threshold instead of acceleration.
- UNPUDO/unparking normal materialization uses `[gearchange - 5s, event end]` plus future-speed filtering.
- UNPUDO/unparking forward and reverse buckets both have non-trivial counts.
- UNPUDO/unparking gear-change buckets include standstill decision frames and are not future-speed filtered.
- CA/pre-CA buckets are near disengagement and are not reduced by DC movement filters.
- One-day dry-run finishes quickly enough to iterate.
