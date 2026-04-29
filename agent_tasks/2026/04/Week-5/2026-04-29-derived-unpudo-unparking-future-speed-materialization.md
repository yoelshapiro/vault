# Derived UNPUDO / Unparking Future-Speed Materialization

Branch: `boris/pudo-materialization-fresh`
Worktree: `/tmp/wayvecode-pudo-materialization-fresh`
Base: `origin/parking/notebooks` at `22f0e900a7a`

## Goal

Avoid another expensive full event materialization pass. Instead, derive a smaller dataset from the existing March 23 parking materialization:

`abfss://datasets@wayveproddatasetflat.dfs.core.windows.net/materialised/si/parking/dev/2026_03_23_09_24_20_root_parking_pudo_unpudo_unparking_with_av_buckets`

The source already has long UNPUDO / unparking windows and known bucket counts.

## Notebook Added

`wayve/ai/parking/notebooks/Filter existing UNPUDO unparking materialization by future speed.ipynb`

## Behavior

The notebook:

- reads the existing materialization
- keeps only DC UNPUDO / unparking buckets:
  - `dc_unpudo_usa`
  - `dc_unpudo_uk`
  - `dc_unparking_usa`
  - `dc_unparking_uk`
- joins corpus at `timestamp_unixus + 600_000`
- keeps samples where `abs(inferred__state__odometry__speed_kmh) >= 0.54`, equivalent to `0.15 m/s`
- prints source vs filtered row counts per split/bucket
- writes a new Spark parquet materialization when `DRY_RUN = False`
- writes `_parquet_files_list.txt`, `README.md`, and `source_materialization.txt`

Default is `DRY_RUN = True` so the first run only computes counts and prints the intended output path.

## Validation

- Notebook JSON validates.
- All `4` code cells parse with `ast.parse`.
