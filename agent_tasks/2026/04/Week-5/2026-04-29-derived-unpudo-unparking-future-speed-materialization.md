# Derived UNPUDO / Unparking Future-Speed Materialization

Branch: `boris/pudo-materialization-fresh`
Worktree: `/tmp/wayvecode-pudo-materialization-fresh`
Base: `origin/parking/notebooks` at `22f0e900a7a`
Commit: `3b3ff14e783`

## Goal

Avoid another expensive full event materialization pass. Instead, derive a smaller dataset from the existing March 23 parking materialization:

`abfss://datasets@wayveproddatasetflat.dfs.core.windows.net/materialised/si/parking/dev/2026_03_23_09_24_20_root_parking_pudo_unpudo_unparking_with_av_buckets`

The source already has the existing UNPUDO / unparking materialized samples and known bucket counts.

## Notebook Added

`wayve/ai/parking/notebooks/Filter existing UNPUDO unparking materialization by future speed.ipynb`

## Behavior

The notebook:

- reads the existing March 23 materialization
- keeps only DC UNPUDO / unparking buckets:
  - `dc_unpudo_usa`
  - `dc_unpudo_uk`
  - `dc_unparking_usa`
  - `dc_unparking_uk`
- joins corpus to the first available row in `[timestamp_unixus + 0.60s, timestamp_unixus + 0.65s]`
- keeps samples where `abs(inferred__state__odometry__speed_kmh) >= 0.54`, equivalent to `0.15 m/s`
- prints source vs filtered row counts per split/bucket
- writes a new Spark parquet materialization when `DRY_RUN = False`
- writes `_parquet_files_list.txt`, `README.md`, and `source_materialization.txt`

Default is `DRY_RUN = True` so the first run only computes counts and prints the intended output path.

## Azure Layout

When writing is enabled, output goes under:

`abfss://datasets@wayveproddatasetflat.dfs.core.windows.net/materialised/si/parking/dev/<timestamp>_<user>_parking_unpudo_unparking_future_speed_0p15_from_2026_03_23`

It uses the regular bucket layout:

- `dataset_split=train/dataset_bucket=<bucket>/part-*.parquet`
- `dataset_split=validation/dataset_bucket=<bucket>/part-*.parquet`
- bucket-level, split-level, and root `_parquet_files_list.txt` metadata files

## Validation

- Notebook JSON validates.
- All `4` code cells parse with `ast.parse`.
