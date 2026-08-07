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
their absence was verified. The default unfiltered production backfill had not
been executed at the time of this initial validation; it was materialised later
and repaired as recorded below.

## 2026-08-07 attribute repair

Added the six missing parking-attribute columns to the existing 143,093-row
production Delta output without rerunning event detection or any correction
stage:

- `park_out_environment` / `park_in_environment`
- `park_out_geometry` / `park_in_geometry`
- `park_out_orientation` / `park_in_orientation`

The repair uses phase-v2 timestamps, WFM session `raven-salmon-hydraulic`, the
three immutable WFM-only attribute heads from historical build 1.0, and raw
Gen2 gear telemetry for parallel park-in orientation. Raw `PARK` and `NEUTRAL`
remain distinct and neither contributes a forward/reverse vote.

Validation results:

- Local pytest, Ruff, Flake8, ty, existing materialisation checks, formatting,
  and `git diff --check` passed.
- Ten-run smoke: 98/98 frame embeddings available; all structural invariants
  passed.
- One-day canary (2026-02-16): 499/499 rows, 4,819/4,819 frame embeddings, and
  all historical differences explained by corrected timestamps or raw gear.
- Full staging: 143,093 unique rows, all 27 existing columns value-equivalent,
  exactly six added strings, and zero frame/embedding loss in every chunk.
- Raw-gear audit: zero mismatches across 43,559 parallel park-ins; 80 had no
  forward/reverse vote and therefore a null orientation.
- Historical overlap: 41,241 rows. All differences were explained by corrected
  events, the raw-gear override, phase-frame provenance, or one persisted
  historical intermediate anomaly that fresh deterministic inference did not
  reproduce.

Production promotion succeeded from validated staging as Delta version 1 on
2026-08-07. Version 0 remains readable for rollback. The post-promotion Delta
and Spark read-back matched staging exactly at 143,093 rows. Temporary smoke,
canary, and staging Delta directories were deleted after successful validation.

## 2026-08-07 standard-run integration

Integrated the same attribute inference into the normal `p2p_event_backfill`
execution path after event/road/gear/odometry correction and before the final
Delta write. The corrected event table is passed to a reusable Spark Connect
attribute stage, whose run-scoped catalog output is validated before promotion
to the configured final path. The WFM session, three immutable model hashes,
and date chunk size are CLI-configurable; defaults match the validated repair.
Parallel park-out orientation remains null and parallel park-in orientation is
derived from raw gear telemetry. Focused Bazel unit, lint, and type checks all
passed (8/8). No smoke/canary/full-run harness was added to repository code,
and no new full materialisation was launched for this integration.

### PR 129802 CI investigation

After commit `7c2bb8cdf3c9`, GitHub Actions passed but Buildkite presubmit
reported two deterministic branch issues. Local `//tools:preflight
--fast-only` reproduced the static-check failure: `p2p_event_backfill.py` has
two import-order/format differences detected by `make py-format-check`.
Coveralls reported 69.45% patch coverage, below the repository's 80% gate.
Focused local Bazel coverage passed all eight test targets but independently
measured approximately 70.38% patch coverage, confirming that the new
orchestration/table-writer paths need more unit coverage. No fix was applied
during the investigation.

The CI fix was subsequently applied and pushed as rebased commit
`6a3207ad74b6`. The formatter bot had independently pushed the required import
formatting after merging current `main`; the local coverage commit was rebased
on top without overwriting those remote changes. Added hermetic tests cover
configuration, CLI parsing, chunked catalog/Delta writes, input identity/date
guards, and output identity/schema guards. Full `//tools:preflight` passed,
including 81.40% authoritative patch coverage (429/527; 80% required), all
affected unit tests, lint/type checks, formatting, PR quality, and secret scan.
PR CI build 560161 was pending after push.
