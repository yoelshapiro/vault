# PUDO Materialization Future-Speed Filter

Date: 2026-04-28
Branch: `boris/pudo-materialization-future-speed-gear-buckets`
Worktree: `/tmp/wayvecode-parking-codeowners`
PR: none

## Summary

Updated the PUDO / UNPUDO materialization notebook on the notebook branch to replace the sample-level `0.734 m/s^2` acceleration filter for UNPUDO / unparking buckets with a future-speed criterion that mirrors the controller start/stop threshold discussion.

Also added additive gear-direction-specific bucket variants while keeping the existing generic PUDO / UNPUDO / parking / unparking buckets.

## Context

The previous notebook filter kept UNPUDO / unparking samples when:

```python
inferred__state__odometry__acceleration_mps2 >= 0.7341269935880388
```

The controller-side behavior discussed around PR #98250 depends on future speed rather than current acceleration. The relevant controller threshold is `0.15 m/s`, and the MachE config uses a future-speed window starting around `0.6s`.

## Change

File updated:

- `wayve/ai/parking/notebooks/PUDO and UNPUDO materilization.ipynb`

Notebook changes:

- Replaced `UNPUDO_UNPARKING_ACCELERATION_FILTER_ENABLED` and acceleration constants with:
  - `UNPUDO_UNPARKING_FUTURE_SPEED_FILTER_ENABLED = True`
  - `UNPUDO_UNPARKING_FUTURE_SPEED_LOOKAHEAD_US = 600_000`
  - `UNPUDO_UNPARKING_MIN_FUTURE_SPEED_MPS = 0.15`
  - `UNPUDO_UNPARKING_MIN_FUTURE_SPEED_KMH = 0.54`
- Added `apply_unpudo_unparking_future_speed_filter(...)`.
- The filter joins each candidate sample to `all_data` at `timestamp_unixus + 600_000us` and keeps samples whose future odometry speed is at least `0.15 m/s`.
- Projected clean `(run_id, timestamp_unixus)` sample tables before the filter to avoid duplicate-column ambiguity after joining event windows to `all_data`.
- Renamed output dataset suffix from `high_acc` to `future_speed_gear`.

## Gear Buckets

Added `GEAR_SPECIFIC_BUCKET_SPECS` with four additive bucket types:

- `unparking`, `gear_direction == 1`
- `unpudo`, `gear_direction == 1`
- `parking`, `prev_gear_direction == -1`, with source event aliases `park` and `parking`
- `unpudo`, `gear_direction == -1`

For park/parking events, the event gear itself is already `0`, so the direction before parking is captured via `prev_gear_direction`.

The existing generic buckets are unchanged. The gear-specific buckets are added for both DC and AV bucket generation paths.

## Verification

- Validated notebook JSON with `python -m json.tool`.
- Parsed modified Python cells with `ast.parse`.
- Did not execute the Databricks notebook or validate Spark runtime behavior locally.

## Caveat

The future-speed materialization filter is a proxy for the OTF trajectory: it uses odometry speed at `sample + 0.6s`, not direct `POLICY_WAYPOINTS`, because this materialization notebook only emits `(run_id, timestamp_unixus)` buckets from `wayve_corpus.all_data`. OTF later interpolates the same odometry speed column into `DataKeys.POLICY_SPEED`.

## Gear-Boundary Update

Commit: `02722ffcfcd9`

Follow-up change on the same branch added the agreed reverse and gear-change-window materialization changes:

- Added reverse `unparking` gear-specific buckets with `gear_direction == -1`.
- Expanded DC UNPUDO / unparking sample windows to cover from `gearchange_timestamp - 1s` through `event_startOrEnd_timestampunixus`, so reverse maneuvers can include park exit, reverse motion, optional reverse-to-drive transition, and the forward continuation.
- Added DC gear-boundary buckets for UNPUDO and unparking. These detect stabilized gear changes inside the maneuver window using `lag` / `lead` over `ground_truth__state__vehicle__gear_direction`, then materialize a local `[-0.9s, +0.5s]` window around each boundary.
- Added reverse-only gear-boundary bucket variants for `gear_direction == -1`.
- Kept the future-speed filter downstream for UNPUDO / unparking buckets, including the new boundary buckets.
- Renamed the materialized dataset suffix to `future_speed_gear_boundary`.

Verification:

- Validated notebook JSON with `python -m json.tool`.
- Parsed edited Python cells with `ast.parse`.
- Did not execute the Databricks notebook locally.

## Event-Length Cutoff Flag

Commit: `fe5e8120623a`

Disabled the event-length cutoff by setting `EVENT_LENGTH_CUTOFF_MODE = None`, while keeping the cutoff implementation and threshold config in the notebook. Rationale: for UNPUDO / unparking, the future-speed filter now removes standstill samples that do not lead to motion, while a hard event-level cutoff can drop valid longer reverse/forward maneuvers before good samples are extracted.

Verification:

- Validated notebook JSON with `python -m json.tool`.
- Parsed edited Python cells with `ast.parse`.

## Event-Table Gear Schema Fix And Cutoff Evidence

Commit: `db5c478824b4`
Superseded by commit: `ab34fae41a49`

The live `hive_metastore.parking.pudo_unpudo_unpark_events` table does not expose `gear_direction` or `prev_gear_direction`; it exposes `speed_kmh` and event timing fields.

Initial fix in `db5c478824b4` derived gear from signed `speed_kmh`. That was only a schema compatibility fallback and was replaced in `ab34fae41a49` with corpus-derived gear:

- `all_data = spark.table("wayve_corpus.all_data")` is now loaded before bucket construction.
- `enrich_event_gear_columns(...)` joins event rows to corpus at `(runID, timestamp_unixus)` to populate `gear_direction` from `ground_truth__state__vehicle__gear_direction`.
- `prev_gear_direction` is populated from corpus at `(runID, gearchange_timestamp - 50ms)`.
- The later materialization join reuses the same `all_data` variable.

Databricks checks:

- Initial query using `gear_direction` failed with `[UNRESOLVED_COLUMN.WITH_SUGGESTION]`.
- A row-level schema check confirmed the table has `speed_kmh`, `gearchange_timestamp`, `event_duration`, and `event_startOrEnd_timestampunixus`, but not `gear_direction` / `prev_gear_direction`.
- Re-ran duration analysis with speed-derived gear using `speed_kmh > 0.05 -> 1`, `speed_kmh < -0.05 -> -1`, otherwise `0`.

Reverse-duration result:

| event_type | duration bucket | events |
|---|---:|---:|
| unparking | 00-05s | 1836 |
| unparking | 05-10s | 14927 |
| unparking | 10-20s | 12905 |
| unparking | 20-30s | 4649 |
| unparking | 30s+ | 9048 |
| unpudo | 00-05s | 136 |
| unpudo | 05-10s | 2258 |
| unpudo | 10-20s | 2859 |
| unpudo | 20-30s | 1310 |
| unpudo | 30s+ | 1716 |

Conclusion: the old `10s` event-length cutoff would remove most reverse UNPUDO/unparking events. For speed-derived reverse gear, `61.34%` of unparking events and `71.08%` of UNPUDO events are longer than `10s`.

## Ambiguous Join Fix And Final Bucket Counts

Commit: `d21d3a773daf`

Fixed a Spark ambiguous-column failure in the DC bucket materialization path by explicitly aliasing:

- expanded event rows as `expanded`
- corpus rows as `corpus`
- future-speed join inputs as `samples` and `future_speed`

Also added a final notebook section based on `summary_df` only:

- prints final materialized UNPUDO / unparking rows per bucket
- groups bucket counts into `generic`, `forward_gear_specific`, `reverse_gear_specific`, and `gear_boundary`
- pivots forward vs reverse gear-specific bucket counts for quick upsampling decisions

This stats section intentionally does not rejoin corpus; it summarizes the bucket distribution that training will see.

## Quick Test Date Filters

Commit: `023674eac300`

Added optional event-table date filters to the first notebook cell:

- `event_start_date = None`
- `event_end_date = None`

When set to `YYYY-MM-DD`, these filter `run_date_iso` before downstream bucket construction, allowing quick materialization tests on a small date range without changing the rest of the notebook.

## Self-Join Ambiguity Fix

Commit: `a232267e0891`

The ambiguous `timestamp_unixus` error persisted in the AV expansion cell because Spark still saw multiple DataFrames with shared `all_data` lineage. Reworked all relevant joins to project unique key names before joining:

- event gear enrichment uses `event_gear_*` and `prev_gear_*` columns
- future-speed filtering uses `sample_*` and `future_speed_*` columns
- gear-boundary detection uses `corpus_gear.*` projected into unique names
- DC expansion joins `expanded_*` to `corpus_*`
- AV expansion joins `window_*` to `corpus_*`

Also added `from pyspark.sql import functions as F` to the first cell because date filters use `F` before the shared imports cell in a fresh top-to-bottom notebook run.

Validation:

- Notebook JSON validates with `/usr/bin/python3 -m json.tool`.
- All code cells parse with `ast.parse`.

## Dry-Run Materialization

Commit: `4a6d2f00d8d`

Added `DRY_RUN_MATERIALIZATION = True` and a `dry_run` argument to `materialize_joined_tables(...)`.

When dry-run is enabled, the notebook still:

- unions/caps bucket rows
- joins train/validation split
- builds `materialized_df`
- computes and displays `summary_df`
- returns `materialized_df`, `summary_df`, and `output_path`

But it skips:

- fsspec parquet writes
- filesystem verification
- metadata file generation
- README generation

This allows single-day notebook tests to validate bucket counts and final summaries without paying the slow Python/fsspec write cost.
