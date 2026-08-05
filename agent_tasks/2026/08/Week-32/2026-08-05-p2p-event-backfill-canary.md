# P2P Event Backfill Validation and PR

## Summary

Converted the `p2p_phase_2.0.ipynb` event-detection section into a standalone,
SQL-first Parking materialisation binary on branch `yoel/p2p_event_backfill`.
Published commit `d94b0a39807b` and opened draft PR
[WayveCode #129802](https://github.com/wayveai/WayveCode/pull/129802).

The default output is:

`abfss://datasets@wayveproddatasetflat.dfs.core.windows.net/sampling_materialised/parking_pudo/default/dev/p2p_events_backfill`

The default run has no date, country, or run-ID filters. Optional inclusive
date bounds and repeatable ISO alpha-3 country filters are available.

## Implementation decisions

- Use the Databricks SQL warehouse for frame scans, clustering, joins,
  corrections, validation, and table lifecycle rather than Spark Connect.
- Use canonical polygons from the shared geofilters/geofences modules with
  native `ST_CONTAINS` SQL.
- Keep a single local source for the sequential odometry kernel and the
  session-scoped SQL Python UDF.
- Process odometry in at most seven run dates per statement. A one-month batch
  produced an OOM because each run carried an average of 17,449 odometry
  samples (maximum 48,535); weekly chunks bounded memory reliably.
- Accept timestamp corrections atomically only when the whole tuple remains
  ordered and the candidate remains within 600 seconds of its initial event.
- Retain intermediate tables after failure and delete them after a successful
  final write by default.
- Fix the notebook gear bug where a normalized `PARK` value was compared with
  `DRIVE_POSITION_V2_PARK`.

## Validation ladder

- Local: formatter plus pytest, Ruff, Flake8, and ty all passed against current
  `origin/main`.
- Differential day (2026-05-25): 518/518 rows. Initial and road-class values
  matched overlapping notebook reference rows exactly; the one downstream
  difference was the intentional gear fix.
- Recent week (2026-07-27 through 2026-08-02): 3,529/3,529 unique valid rows,
  exact dates, no shift over 600 seconds, and zero geofence mismatches against
  the shared helper. Runtime was about 6m58s.
- Scale month (2026-07-01 through 2026-07-31): 15,846/15,846 unique valid rows,
  exact dates, zero invalid clusters/orderings, zero null countries, and a
  maximum correction of 585.25 seconds. Runtime was about 27m46s, including
  19m36s for five odometry chunks. Delta output was about 3.2 MB across 24
  Parquet files plus one transaction log.

The ladder found correction-induced row loss, an unbounded UDF OOM, and a
partial initial-timestamp fallback. Each was fixed and covered by regression
tests. All canary SQL tables and Delta paths were deleted after inspection and
their absence was verified. The default unfiltered production backfill was not
executed.
