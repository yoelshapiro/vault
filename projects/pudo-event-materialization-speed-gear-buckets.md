# PUDO Event + Materialization Speed/Gear Buckets

## Overview

Extend the base `parking/notebooks` notebooks with additive training buckets for gear decisions, reverse/forward UNPUDO/unparking, and near-disengagement corrective actions.

Base branch: `parking/notebooks`

Relevant notebooks:

- `wayve/ai/parking/notebooks/PUDO and UnPUDO Event Detection.ipynb`
- `wayve/ai/parking/notebooks/PUDO and UNPUDO materilization.ipynb`

## Current Status

- Date: `2026-04-30`
- Branch: `parking/notebooks`
- State: implemented in branch `boris/parking-materialization-config-dry-run`.
- One small event-notebook edit is already made: PUDO/park disengagement blacklist no longer excludes `uncategorised`; only `accidental_avso_intervention` remains blacklisted.
- Event notebook now adds UNPUDO/unparking `gear_change_timestamps` and `num_gear_changes`.
- Materialization notebook now builds future-speed-filtered UNPUDO/unparking buckets, forward/reverse variants, and gear-change buckets.

## Runtime Risks Found

- Full-table `display(df)` in the materialization load cell can trigger a large table scan just to inspect the events table.
- Event-length cutoff was applied globally before DC/AV splitting, so CA/pre-CA rows could inherit DC-only filtering work.
- `apply_event_length_cutoff` counted the input and filtered output by default, causing two full actions before materialization starts.
- DC bucket creation used `distinct().collect()` for event types and `limit(1).count()` for each event/country bucket.
- Optional short-bucket generation used `limit(1).count()` for each variant.
- DC timestamp expansion uses `sequence(..., 50ms)` and `explode`; this becomes expensive when UNPUDO/unparking windows are extended and event-length removal is disabled.
- DC expansion joins each bucket independently to `wayve_corpus.all_data`, so the same corpus ranges can be scanned many times.
- AV/CA buckets do separate range joins per bucket and use `distinct()`, which is expensive on large disengagement windows.
- Future-speed filtering would be very expensive if implemented as a separate per-bucket corpus join. It should be computed once on a tagged candidate dataframe.
- Gear-change buckets would be very expensive if each bucket re-detects gear transitions. Gear transitions should be computed once over a bounded corpus subset and joined back.
- The fsspec writer has unavoidable heavy actions: global per-bucket ordering for `_file_id`, repartitioning, `collect()` of written files, summary counts, and README generation. This should run only after dry-run validation.

## Materialization Refactor Already Applied

- Added `MaterializationConfig` at the top of the materialization notebook.
- Added default dry-run behavior:
  - `dry_run=True`
  - `dry_run_event_limit=10`
  - source event table is capped to 10 events
  - Azure writing is skipped even if `write_output=True`
- Added config knobs for country/date/run filters, output path/name, max count, verification, timestamp intervals, CA windows, cutoff thresholds, and legacy acceleration filter settings.
- Removed the eager full-table `display(df)` from the load cell.
- Made event-length cutoff counts optional behind `CONFIG.log_action_counts`.
- Removed per-bucket `limit(1).count()` checks from DC/AV bucket construction.
- Replaced dynamic event-type collection with fixed expected event types.
- Split final materialization into:
  - output configuration/reporting cell
  - separate guarded write cell

## Materialization Feature Implementation

- Replaced the old per-bucket DC/AV dictionary join flow with a tagged dataframe flow:
  - `dataset_bucket`
  - `window_start_timestamp`
  - `window_end_timestamp`
  - `requires_future_speed_filter`
  - `enable_directional_variants`
- Bounded corpus reads to selected event runs and a timestamp envelope around the event/disengagement/gearchange timestamps.
- Added cleaned gear computation on the bounded corpus frame.
- DC PUDO/park movement windows:
  - `event_startOrEnd_timestampunixus -> timestamp_unixus + 2s`
  - no future-speed filter
- DC UNPUDO/unparking movement windows:
  - `coalesce(gearchange_timestamp, timestamp_unixus) - 5s -> coalesce(event_startOrEnd_timestampunixus, timestamp_unixus + 10s)`
  - future-speed filter at closest frame in `[t + 0.60s, t + 0.65s]`
  - keeps samples where `abs(future_speed_kmh) >= 0.54`
- Added directional DC UNPUDO/unparking variants:
  - `_forward` when matched future cleaned gear is `1`
  - `_reverse` when matched future cleaned gear is `-1`
- Added DC gear-change buckets:
  - `dc_<event>_<country>_gear_change`
  - samples `±1s` around cleaned gear transitions inside the event maneuver window
  - explicitly includes PUDO/park final transition at `timestamp_unixus`
  - explicitly includes UNPUDO/unparking initial transition at `gearchange_timestamp`
  - not future-speed filtered
- AV/CA buckets:
  - still use selected disengagement anchors only
  - use `pre_ca`, `ca_short`, `ca_long`
  - apply future-speed filtering for UNPUDO/unparking
  - do not create directional CA variants
- Writer now accepts `materialized_keys_df` directly, avoiding the expensive per-bucket dictionary reconstruction before write.

## Guiding Decisions

- Do not change the UNPUDO/unparking event anchor for now.
- Keep the existing acceleration-based `timestamp_unixus` anchor in the event table.
- Use the future-speed threshold only in materialization for normal UNPUDO/unparking movement buckets.
- Keep gear-change buckets separate from movement buckets and do not future-speed-filter them.
- Keep CA/pre-CA buckets centered around disengagement anchors and do not apply DC movement filters to them.

## Current Timestamp Semantics

### PUDO / Park

- `timestamp_unixus`
  - Gear transition into park/neutral.
  - This is the PUDO/park endpoint.

- `event_startOrEnd_timestampunixus`
  - Estimated PUDO/park maneuver start.
  - Current logic looks backward from `timestamp_unixus` using 30m distance, 12s time cap, optional left/right indicator extension, and previous-event clamping.

- Indicator extension
  - Already used.
  - Uses left/right indicator ON edge, not hazard and not indicator-off as the start anchor.
  - Requires a later indicator OFF edge within 30m.
  - If active, start can become `latest_indicator_on_ts - 3s`.

- Hazard
  - Used to identify/confirm PUDO candidates: hazard within ±10s of the park transition.
  - Not currently used to extend the materialization window.

### UNPUDO / Unparking

- `gearchange_timestamp`
  - Park/neutral to drive/reverse transition.
  - This is the gear-decision anchor.

- `timestamp_unixus`
  - Existing acceleration-based movement-start anchor after leaving park.
  - Keep this unchanged for now.

- `event_startOrEnd_timestampunixus`
  - Event end for UNPUDO/unparking.
  - Current window enrichment uses the post-start maneuver endpoint, with 10m progress and speed conditions.

## Event Notebook Changes To Make

### PUDO / Park

- Keep detection unchanged.
- Keep start estimation unchanged.
- Keep indicator extension unchanged.
- Disengagement blacklist:
  - Keep `uncategorised` PUDO/park disengagements.
  - Continue blacklisting `accidental_avso_intervention`.

### UNPUDO / Unparking

- Keep existing acceleration-based `timestamp_unixus` anchor unchanged.
- Keep `gearchange_timestamp` unchanged.
- Keep `event_startOrEnd_timestampunixus` as current event-end logic.
- Add gear-change summary columns after event end is known:
  - `num_gear_changes`
  - `gear_change_timestamps`
- Gear changes should be based on cleaned gear where possible.

## Disengagement Logic

### PUDO / Park

- Main detector:
  - window: `[event_startOrEnd_timestampunixus, timestamp_unixus]`
  - selects latest disengagement
  - output: `disengagement_timestamp_unixus`

- Before-start detector:
  - window: `[event_startOrEnd_timestampunixus - 10s, event_startOrEnd_timestampunixus]`
  - selects latest disengagement
  - output: `disengagement_timestamp_unixus_before_event_start_10s`

- Fixed-window detector exists but should not be used by materialization unless explicitly needed:
  - `disengagement_timestamp_unixus_fixed_window`

### UNPUDO / Unparking

- Before-gearchange detector:
  - window: `[gearchange_timestamp - 10s, gearchange_timestamp]`
  - keep as 10s
  - output: `disengagement_timestamp_unixus_before_gearchange_10s`

- Gear-to-start detector:
  - window: `[gearchange_timestamp, timestamp_unixus]`
  - catches shifted-but-still-standstill failures before the acceleration anchor
  - output: `disengagement_timestamp_unixus_gear_to_start`

- Main maneuver detector:
  - window: `[timestamp_unixus, event_startOrEnd_timestampunixus]`
  - catches wrong/unsafe maneuver after movement begins
  - output: `disengagement_timestamp_unixus`

- Fixed-window detector exists but should not be used by materialization unless explicitly needed.

## Materialization Notebook Changes To Make

### Shared Rules

- Keep generic/full buckets and add variants additively.
- Use the original fsspec Azure writer style for final output.
- Add date filters / dry-run controls for fast validation.
- Avoid large raw `display(...)` calls and repeated per-bucket Spark actions.
- Prefer tagged DataFrames and bounded joins over many independent per-bucket joins.
- Do not apply event-length cutoff globally to CA/pre-CA buckets.
- Keep CA/pre-CA buckets centered on disengagement anchors only.
- Keep hard event-length cutoff only for PUDO/park DC events, with a 30s threshold.
- Apply the future-speed filter to UNPUDO/unparking CA/pre-CA materialized samples as well as UNPUDO/unparking DC movement samples.

### DC PUDO / Park Event-Length Cutoff

Use hard event-length removal only for PUDO/park DC events:

```text
pudo: 30s
park: 30s
```

Do not apply hard event-length removal to UNPUDO/unparking.

### DC PUDO / Park Normal Buckets

Keep current normal bucket window:

```text
event_startOrEnd_timestampunixus -> timestamp_unixus + 2s
```

- No speed filter.
- No future-speed filter.

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

- This filtering happens in materialization only.
- It does not change the event table `timestamp_unixus` anchor.
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

- Apply the future-speed filter to UNPUDO/unparking CA/pre-CA buckets.
- Do not apply the future-speed filter to PUDO/park CA/pre-CA buckets.
- Do not apply event-length cutoff to CA/pre-CA buckets.

## Validation Plan

- Parse notebook JSON and code cells locally after edits.
- Databricks dry-run validation:
  - Run ID: `729431122715074`
  - Notebook: `/Workspace/Users/boris.indelman@wayve.ai/WayveCode/wayve/ai/parking/notebooks/PUDO and UNPUDO materilization - Codex dry run`
  - Cluster: `0430-092826-g8yd3u76` (`shared_2.3.174`)
  - Result: `SUCCESS`
  - Execution duration: `92s`
  - Mode: `CONFIG.dry_run=True`, capped to 10 events and skipped Azure output writes
- Run event notebook on a bounded date range.
- Inspect event counts by type and country.
- Inspect PUDO/park `event_startOrEnd_method` distribution, especially `indicator_extension`.
- Inspect UNPUDO/unparking:
  - gear-to-anchor duration
  - anchor-to-end duration
  - gear-change count distribution
  - reverse/forward distribution from materialization
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

- Event notebook keeps the current UNPUDO/unparking acceleration anchor.
- PUDO/park normal buckets remain equivalent to current behavior except for additive gear-change buckets.
- PUDO/park gear-change buckets include the final transition into park.
- PUDO/park disengagement materialization can use uncategorised non-accidental interventions.
- UNPUDO/unparking normal materialization uses `[gearchange - 5s, event end]` plus future-speed filtering.
- UNPUDO/unparking forward and reverse buckets both have non-trivial counts.
- UNPUDO/unparking gear-change buckets include standstill decision frames and are not future-speed filtered.
- PUDO/park DC event-length cutoff is 30s.
- UNPUDO/unparking CA/pre-CA buckets are near disengagement and filtered by future speed.
- PUDO/park CA/pre-CA buckets are near disengagement and are not future-speed filtered.
- One-day dry-run finishes quickly enough to iterate.

## 2026-04-30 Zach `zmurez/pudo` Comparison

Checked `origin/zmurez/pudo` at `e6246ab7c722` (`2026-04-29 10:58:14 -0700`, Zak, `cleanup`). This branch is still active and the relevant PUDO/unparking implementation remains in `wayve/ai/experimental`, not in the SI OTF datamodule.

Key Zach mechanisms:
- `single_run.py` cleans gear before deriving parking labels: removes tiny reverse runs, removes short park/neutral runs, forces park around manual parked labels, and rewrites stopped-before-park frames to park after a short 0.5s buffer.
- `make_park_masks` creates parking/PUDO masks around shift-to-park, extends start by distance and indicator context, and uses PUDO pin-valid distances.
- PUDO is inferred as a park transition with hazards nearby, excluding office geofences. `stopping_type==2` is PUDO, `stopping_type==1` is park.
- UNPARKING sampler finds park-to-nonzero gear transition, then picks the first later moving frame (`abs(speed)>0`) and dilates 0s before / 10s after.
- START_GEAR_CHANGE sampler finds any gear change, expands ±30s, finds starts from standstill within that region, and samples 0.9s before / 0s after the start.
- GEAR_CHANGE sampler samples cleaned gear transitions with `GEAR_CHANGE_BEFORE=1.0s`, `GEAR_CHANGE_AFTER=1.0s` in `mcv_new_base0`.
- Route training uses route dropout and parking request: generic route dropout can black out routes; parking-request augmentation is low-probability (`0.025`) and blacks out route when active. In inference, route blackout is tied to explicit parking request / selected parking pose, not simply end-of-route.
- Gear head is per-waypoint, with strong change weighting (`GEAR.PER_WAYPOINT=True`, `LOSS_WEIGHT_CHANGE=20.0`, decay `0.5`).

Comparison to current notebook plan:
- Current notebook materializes deterministic buckets from the event table. Zach samples dynamically at training time from cleaned in-memory run signals.
- Our UNPUDO/unparking movement buckets use `gearchange_timestamp - 5s` to `event_startOrEnd_timestampunixus`, then filter by future speed at +0.60s to +0.65s. Zach does not apply this 0.6s future-speed criterion; he anchors to first actual movement after park exit and samples 10s after.
- Our gear-change buckets sample ±1s around cleaned gear transitions and explicit event anchors. This is close to Zach's `GEAR_CHANGE_*` sampler, but our explicit event gear anchors are materialized and Zach's are sampler-level.
- Our directional forward/reverse buckets are a new SI-side addition. Zach does not split UNPUDO/unparking into forward/reverse buckets; he relies on cleaned gear supervision and per-waypoint gear loss.
- Our event notebook now records `gear_change_timestamps`/`num_gear_changes`; Zach does not need that because the sampler sees the whole run arrays directly.

Likely gaps if we want to mimic Zach more closely:
- Add or preserve strong per-waypoint gear-change loss in the SI parking model path; buckets alone do not recreate this.
- Validate gear cleanup parity. Our materialization cleans gear locally for bucket decisions, but model supervision still depends on what the dataloader provides.
- Consider START_GEAR_CHANGE-style samples: standstill just before motion near any gear change. Our movement buckets with future-speed filtering may remove some of the pre-motion standstill; gear-change buckets keep transition context but are small.
- Consider route/parking-request augmentation parity separately from data materialization: Zach's route blackout and route-end jitter are training-time input augmentations, not just bucket selection.
