# PUDO / UNPUDO Event Materialization: Speed, Gear, and Start Buckets

## Overview

We want to extend the base `parking/notebooks` flow so the generated parking buckets better train UNPUDO and unparking behavior, especially:

- shifting gear at the right time,
- starting to move after leaving park,
- preserving reverse / forward maneuver balance,
- keeping multi-gear-shift maneuvers represented,
- avoiding dead standstill samples that do not lead to motion.

Base branch: `parking/notebooks`

Working branch: `boris/parking-materialization-config-dry-run`

Relevant notebooks:

- `wayve/ai/parking/notebooks/PUDO and UnPUDO Event Detection.ipynb`
- `wayve/ai/parking/notebooks/PUDO and UNPUDO materilization.ipynb`

## Status

- Event notebook has been updated locally/branch-side to add UNPUDO/unparking gear-change summaries.
- Materialization notebook has been refactored with config, dry-run, future-speed filtering, forward/reverse buckets, and gear-change buckets.
- Databricks dry-run passed on 10 events.
- Latest local fix: `UNPUDO_MIN_DISTANCE_M` changed from `5.0` to `10.0` to match the agreed moved-enough threshold.

## Target Behavior

### Event Table

The event table should continue to define event anchors and maneuver windows. It should not do training-sample filtering.

For PUDO / park:

- `timestamp_unixus`: transition into park/neutral; this is the event end / stop anchor.
- `event_startOrEnd_timestampunixus`: estimated maneuver start.
- Keep current PUDO / park detection and start-estimation logic.
- Keep `uncategorised` PUDO/park disengagements; only blacklist clearly accidental AVSO intervention.

For UNPUDO / unparking:

- `gearchange_timestamp`: transition from park/neutral into drive/reverse.
- `timestamp_unixus`: existing acceleration-based motion-start anchor. Keep this unchanged for now.
- `event_startOrEnd_timestampunixus`: maneuver end, based on progress after movement. The moved-enough threshold should be `10m`, not `5m`.
- Add metadata columns for analysis / downstream logic:
  - `gear_change_timestamps`
  - `num_gear_changes`

The event notebook should not apply the future-speed `0.6s` filter. That belongs in materialization.

### Materialization

The materialization notebook should create additive buckets from the event table.

Shared rules:

- Use a centralized config object.
- Default to dry-run mode for development.
- Avoid full-table `display(...)` and repeated per-bucket Spark actions.
- Use bounded corpus reads by run/timestamp envelope.
- Use tagged DataFrames instead of separate per-bucket joins where possible.
- Keep final Azure writing in a separate guarded block.

PUDO / park DC buckets:

- Normal movement bucket window:
  - `event_startOrEnd_timestampunixus -> timestamp_unixus + 2s`
- No future-speed filter.
- Apply hard event-length removal only for PUDO / park DC events.
- Use `30s` cutoff for PUDO / park.

UNPUDO / unparking DC movement buckets:

- Window:
  - `gearchange_timestamp - 5s -> event_startOrEnd_timestampunixus`
- Do not hard-filter by event length.
- Apply future-speed filter per candidate timestamp:
  - find closest frame in `[t + 0.60s, t + 0.65s]`
  - keep if `abs(speed) >= 0.15 m/s` (`0.54 km/h`)
- Keep generic full buckets.
- Add directional variants:
  - `_forward` from future cleaned gear `1`
  - `_reverse` from future cleaned gear `-1`

Gear-change buckets:

- Add separate DC gear-change buckets for PUDO, park, UNPUDO, and unparking.
- Window:
  - `gear_change_ts - 1s -> gear_change_ts + 1s`
- Use cleaned gear transitions from the bounded corpus data.
- Explicitly include important event anchors:
  - PUDO / park final transition at `timestamp_unixus`
  - UNPUDO / unparking initial transition at `gearchange_timestamp`
- Do not future-speed-filter gear-change buckets.

CA / pre-CA buckets:

- Keep centered around disengagement anchors.
- Do not apply DC event-length filtering.
- Apply future-speed filtering for UNPUDO / unparking CA and pre-CA samples.
- No forward/reverse variants for CA/pre-CA for now.

## Why These Changes

UNPUDO / unparking failures often break into three phases:

```text
parked -> gear changes to D/R -> still stationary -> starts moving -> maneuver continues, possibly with more gear shifts
```

The bucket plan covers these phases separately:

- `gear_change` buckets cover the gear decision itself.
- Future-speed-filtered movement buckets keep standstill / near-standstill samples only when motion is imminent.
- Forward/reverse buckets rebalance reverse starts, which are underrepresented in raw UNPUDO data.
- Full windows to event end preserve multi-gear-shift maneuver context.

## Zach Comparison

Zach's `origin/zmurez/pudo` branch does this differently. His relevant logic is in `wayve/ai/experimental`, not the SI OTF datamodule.

Checked branch state:

- Branch: `origin/zmurez/pudo`
- Commit: `e6246ab7c722`
- Date: `2026-04-29`

### Zach's Key Mechanisms

Gear cleanup:

- Cleans short reverse segments.
- Cleans short park/neutral noise.
- Rewrites stopped-before-park frames to park after a short buffer.
- Applies cleanup before deriving parking / PUDO / unparking masks.

PUDO / park:

- Detects park transitions into gear `0`.
- Classifies PUDO from hazards near park moments, excluding office geofences.
- Uses PUDO pin-valid distances to split near/far and to extend route/parking context.

UNPARKING sampler:

- Finds park-to-nonpark gear transition.
- Finds the first later frame where `abs(speed) > 0`.
- Samples from first motion to `10s` after.
- This does not include the standstill between gear change and first motion.

GEAR_CHANGE sampler:

- Finds any cleaned gear transition.
- Samples around the transition.
- In his config this is `±1s`.

START_GEAR_CHANGE sampler:

- Finds gear changes.
- Expands each gear change by `±30s`.
- Finds starts from standstill inside that expanded window.
- Samples `0.9s` before the start and `0s` after.
- This captures “about to start moving after/near a gear decision.”

Route / parking request:

- Uses route dropout and parking-request augmentation.
- Parking request can black out the route during training.
- In inference, blackout is tied to explicit parking request / selected parking pose, not just event materialization.

Gear loss:

- Trains per-waypoint gear output.
- Heavily weights future gear changes.
- This is likely as important as the bucket selection.

### Difference From Our Plan

| Topic | Zach | Our notebook plan |
|---|---|---|
| Data creation | Dynamic sampler over run arrays | Materialized buckets from event table + corpus |
| Gear cleanup | Before label/sampler creation | During materialization for bucket decisions |
| UNPUDO/unpark movement | First moving frame + 10s after | `gearchange - 5s` to event end, then future-speed filter |
| Pre-motion standstill | Separate `START_GEAR_CHANGE` sampler | Kept only when future speed at +0.6s shows imminent motion |
| Gear transition | Separate `GEAR_CHANGE` sampler | Separate `_gear_change` materialized buckets |
| Reverse/forward balance | No explicit bucket split | Explicit `_forward` and `_reverse` variants |
| Multi-gear maneuvers | Later gear shifts caught by gear-change/start samplers | Full event window to event end plus gear-change buckets |
| Route blackout | Training input augmentation | Not part of materialization; handled separately in model/data config |
| Gear supervision | Per-waypoint gear with high change loss | Must be verified separately in SI training config |

### Interpretation

Our future-speed filter is a more direct way to keep standstill samples that have intent to move. Zach's `START_GEAR_CHANGE` is a proxy: start from standstill near a gear change.

The tradeoff:

- Our filter is cleaner for “about to move within 0.6s.”
- Zach's sampler is less tied to one fixed delay and may catch starts that happen several seconds after a gear shift.
- Our separate gear-change bucket is still needed because the gear decision can happen before future speed crosses the threshold.
- For multi-gear maneuvers, our full event window should be more complete if `event_startOrEnd_timestampunixus` is reliable.

## Open Checks

Before treating the notebook output as final:

- Confirm the full event notebook runs with `UNPUDO_MIN_DISTANCE_M=10.0` and the temporary table name.
- Confirm materialization summaries include expected UNPUDO/unparking counts after future-speed filtering.
- Inspect reverse/forward ratios after materialization.
- Confirm gear-change bucket counts are non-zero and plausible.
- Confirm the training datamodule can read the generated parquet layout.
- Separately verify SI training config has appropriate gear output/loss behavior; buckets alone do not recreate Zach's per-waypoint gear loss.
