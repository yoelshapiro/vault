# Derived UNPUDO / Unparking Future-Speed Materialization

Branch: `boris/pudo-materialization-fresh`
Worktree: `/tmp/wayvecode-pudo-materialization-fresh`
Base: `origin/parking/notebooks` at `22f0e900a7a`
Commits:
- `3b3ff14e783` - initial derived DC future-speed notebook
- `8a065c9dabf` - additive forward/reverse gear bucket variants and optional CA/pre-CA stage
- `bb6b7b3fd31` - restrict source reads and output metadata to explicit train bucket paths
- `755ba3af5ab` - load train bucket parquet files using Databricks file listing
- `9c9a5117eca` - read optional CA/pre-CA buckets from the April 13 all-disengagements materialization
- `fdb8126b1d1` - add additive DC gear-change buckets based on adjacent cleaned corpus gear transitions and legacy parquet file naming
- `d11068bfb1f` - fix gear-change union schema by dropping `future_gear_direction` from the gear-change branch
- `5741b14da2c` - replace Spark writer with the direct `fsspec` Azure writer used by the original notebook

## Goal

Avoid another expensive full event materialization pass. Instead, derive a smaller dataset from the existing March 23 parking materialization:

`abfss://datasets@wayveproddatasetflat.dfs.core.windows.net/materialised/si/parking/dev/2026_03_23_09_24_20_root_parking_pudo_unpudo_unparking_with_av_buckets`

The source already has the existing UNPUDO / unparking materialized samples and known bucket counts.

## Notebook Added

`wayve/ai/parking/notebooks/Filter existing UNPUDO unparking materialization by future speed.ipynb`

## Behavior

The notebook:

- reads only explicit `dataset_split=train/dataset_bucket=<bucket>` paths from the existing March 23 materialization
- avoids `spark.read.parquet(SOURCE_MATERIALIZATION_PATH)` so Spark does not discover validation and unrelated buckets
- lists files inside each bucket with `dbutils.fs.ls`, keeps `.parquet.snappy`, `.snappy.parquet`, and `.parquet` files, and loads those file paths directly
- keeps only train DC UNPUDO / unparking buckets:
  - `dc_unpudo_usa`
  - `dc_unpudo_uk`
  - `dc_unparking_usa`
  - `dc_unparking_uk`
- joins corpus to the first available row in `[timestamp_unixus + 0.60s, timestamp_unixus + 0.65s]`
- keeps samples where `abs(inferred__state__odometry__speed_kmh) >= 0.54`, equivalent to `0.15 m/s`
- keeps the full filtered DC buckets and adds additive `_forward` / `_reverse` variants using the gear direction on the matched future corpus row
- optionally adds additive DC `_gear_change`, `_gear_change_forward`, and `_gear_change_reverse` variants using cleaned current gear at the sample timestamp versus the next cleaned corpus gear sample; enabled by `ADD_DC_GEAR_CHANGE_BUCKETS = True`
- prints source vs filtered row counts per train bucket
- writes a new materialization with direct `fsspec` Azure writes when `DRY_RUN = False`, matching the original PUDO materialization notebook writer
- writes `_parquet_files_list.txt`, `README.md`, and `source_materialization.txt`
- includes a separate skipped-by-default final stage for train CA/pre-CA UNPUDO / unparking buckets from the April 13 all-disengagements materialization that keeps full buckets and appends `_forward` / `_reverse` variants using current gear at each sample timestamp

Default is `DRY_RUN = True` so the first run only computes counts and prints the intended output path.

`RUN_CA_PRE_CA_GEAR_SPLIT = False` by default. When enabled after DC output is written, it appends CA/pre-CA buckets to the same `output_path`; rerunning that append on the same output path will duplicate those rows unless the output is removed or rewritten first.

## Azure Layout

When writing is enabled, output goes under:

`abfss://datasets@wayveproddatasetflat.dfs.core.windows.net/materialised/si/parking/dev/<timestamp>_<user>_parking_unpudo_unparking_future_speed_0p15_gear_change_dc_2026_03_23_ca_2026_04_13`

It uses the regular train bucket layout:

- `dataset_split=train/dataset_bucket=<bucket>/part-00000.parquet.snappy`
- bucket-level, split-level, and root `_parquet_files_list.txt` metadata files

## Validation

- Notebook JSON validates.
- All `5` code cells parse with `ast.parse`.
- Checked the SI OTF `BucketStreamer` path: the loader accepts both Spark `*.snappy.parquet` names and legacy `*.parquet.snappy` names because it filters on `.parquet` or `.parquet.snappy`.

## 2026-04-29 Writer Correction

Training job `155826` (`elated-gray-toucan`) failed because the derived materialization written by native Spark parquet was not visible through the regional training storage account rewrite:

`wayveproddatasetflat` -> `wayveproddatasetflatswe`

Representative failure:

`ValueError: No parquet files found in abfss://datasets@wayveproddatasetflatswe.dfs.core.windows.net/materialised/si/parking/dev/2026_04_29_05_44_34_root_parking_unpudo_unparking_future_speed_0p15_from_2026_03_23/dataset_split=train/dataset_bucket=dc_unpudo_usa_forward`

This is the known issue that caused the original materialization notebook to avoid Spark-native parquet output. The new derived notebook now uses the same direct `fsspec` writer pattern:

- assigns `_file_id` per `dataset_split` / `dataset_bucket`
- repartitions by `dataset_split`, `dataset_bucket`, and `_file_id`
- writes `part-00000.parquet.snappy` files directly through `fsspec.open(..., credential=AsyncAzureCredentials(), anon=False)`
- writes bucket-level, split-level, and root `_parquet_files_list.txt` from the worker-reported paths
- writes `README.md` and `source_materialization.txt` through the same credentialed fsspec path
- uses the same fsspec writer for the optional CA/pre-CA stage and merges the existing root metadata list with newly written CA/pre-CA files

Next required step before retraining: rerun the notebook with `DRY_RUN = False`, then update the datamodule root to the new output path.
