# Generic Materialisation Parking PUDO Migration

## Overview
- **What it is:** Knowledge-sharing and planning page for moving the Parking PUDO / park / UNPUDO / unparking event and bucket materialization notebooks into Wayve's generic materialisation framework.
- **Why it matters:** The current notebook flow is hard to reproduce, slow to iterate, and easy to fork incorrectly. The generic materialisation framework gives us typed YAML configs, reusable Databricks execution, standard output metadata, and a clearer path to release-style datasets.
- **Primary users:** Parking training owners, data/materialization owners, SI datamodule/config owners.

## Status
- **Phase:** Planning
- **Status:** active
- **Last updated:** 2026-04-30
- **Current priorities:**
  - Understand main-branch generic materialisation primitives and where parking-specific logic should live.
  - Compare existing generic parking support (`label`, `is_pudo`, `gear_change_segments`) with our notebook semantics.
  - Produce a migration plan before implementation.
- **Blockers:**
  - Notion documentation page could not be fetched by the connector in this session: `Auth required` for `Documentation - Generic Materialisation`.
  - `wayve/ai/parking/notebooks/` is not present on `main`; notebook logic was inspected from branch `parking/notebooks` using `git show` without switching branches.

## Requirements
- **Problem statement:**
  - Port notebook-based PUDO / park / UNPUDO / unparking event detection and bucket writing into the generic materialisation ecosystem without losing the training semantics we rely on.
- **Target users:**
  - Parking model training configs that consume `dc_pudo_*`, `dc_unpudo_*`, `dc_unparking_*`, `ca_short_*`, `ca_long_*`, `pre_ca_*`, directional buckets, and future-speed-filtered movement buckets.
- **Integrations:**
  - Databricks source tables: `wayve_corpus.all_data`, `analytics.disengagements`, parking event Delta tables, optional trip/model metadata tables.
  - Generic materialisation config code under `wayve/ai/foundation/data/curation/materialization/`.
  - SI datamodule consumption via `BucketCfg` and `materialisation_version`/`dataset_root_path`.
- **Constraints:**
  - Keep this first step to research/planning only. Do not implement yet.
  - Preserve existing bucket names consumed by Parking configs unless we explicitly migrate SI configs and dataset roots together.
  - Avoid repeating notebook performance failures: no repeated wide `all_data` joins per bucket, no expensive `display()`/global `count()` in production path, and keep dry-run/debug modes explicit.
- **Success criteria:**
  - A clear owner-readable plan that separates event detection, frame expansion/filtering, bucket naming, writing, validation, and SI release consumption.
  - Identified gaps in main's generic framework before coding.

## Generic Materialisation: Main-Branch Findings
- **Entry point:** `wayve/ai/foundation/data/curation/materialization/run_materialization.py`.
- **Command shape:**
  - `bazel run //wayve/ai/foundation/data/curation:run_materialization -- --config_name <name> --cluster_regexp <cluster> --analyse`
- **Config root:**
  - `wayve/ai/foundation/data/curation/materialization/configs/`
  - Loaded by `get_materialization_configs()` in `wayve/ai/foundation/data/curation/config.py`.
- **Config inheritance:**
  - YAML supports one-level `base_config` inheritance.
  - Bucket overrides merge by `name`.
  - Nested dicts are shallow-merged; lists/scalars replace; `null` removes keys.
- **Core config types:**
  - `MaterializationConfig`: `name`, `buckets_configs`, partition/write flags.
  - `BucketConfig`: `name`, `input_df`, optional date filters, bucketing config, binning/sampling config, enrichment flags, striding/random/sample/upsample controls.
  - `BucketingConfig`: run type, split, platform, country, geofence, vehicle model, min speed, interventions, traffic density, parking labels, reverse data, gear change segments, and `include_pudo`.
- **Bucket construction:**
  - `get_buckets()` reads each `input_df` as a Databricks table.
  - It applies optional `start_date_iso` / `end_date_iso`, adds `month`, optionally requires a driving plan, then builds a `Bucket`.
  - `Bucket` drops configured nulls/run IDs, checks `(run_id, timestamp_unixus)` uniqueness, adds `dataset_split` if missing, applies bucketing filters, then sets `dataset_bucket` to `{vehicle_platform}_{bucket_config.name}`.
- **Sampling/output variants:**
  - `default`: no sampling; writes filtered dataframe as-is.
  - `sampled`: binning + sampling, `sample_fraction`, or `upsample_factor`.
  - `random`: uniform random sample by row count.
  - `strided`: temporal striding by seconds.
- **Write path:**
  - Generic runner writes to `abfss://databricks-users@wayveproddataset.dfs.core.windows.net/datasets/wfm/<config_name>/<timestamp>/...`.
  - `write_materialised_dataset()` writes partitioned parquet under `dataset_split=<split>/dataset_bucket=<bucket>/`.
  - It writes only `[run_id, timestamp_unixus, dataset_bucket, dataset_split]` by default.
  - Runner then writes parquet file lists, `raw_counts.csv`, and the config YAML.

## Existing Generic Parking Support
- **Parking labels:**
  - `include_parking_labels` filters on column `label`.
  - Existing WFM configs use Zak-style parking classifier labels, for example `include_parking_labels: [1, 2, 3, 4, 5, 6, 7, 8, 9]`.
- **PUDO flag:**
  - `include_pudo` filters on `is_pudo`.
  - When combined with parking labels or gear-change segments it is OR-ed into the parking/gear filter.
- **Gear-change segments:**
  - Filtering enrichment can create `gear_change_segments`.
  - The current enrichment detects valid gear changes where gear remains stable for at least `100 ms`, and can range-join around distance travelled, e.g. `10 m` before/after.
- **Current limitation:**
  - This generic support is WFM-style broad parking coverage, not our four-event PUDO/park/UNPUDO/unparking training materialization.
  - It does not encode our event table, disengagement windows, future-speed movement filter, directional forward/reverse buckets, or named CA/pre-CA bucket structure.

## SI Release Usage
- **Release config pattern:**
  - `wayve/ai/si/configs/baseline/release.py` uses `materialisation_version`, e.g. `bc/split_alpha2_alpha3/release/0.0.17` and `rmrl/split_alpha2_alpha3/release/0.0.15`.
  - `wayve/ai/si/configs/baseline/jetson_orin/candidate.py` uses versions like `bc/default/release/0.2.29`.
- **Path resolution:**
  - `wayve/ai/si/datamodules/materialisation_path_parser.py` maps `dataset_name/type/release_type/version` to:
  - `abfss://datasets@wayveproddatasetflat.dfs.core.windows.net/sampling_materialised/<dataset_name>/<type>/<release_type>/<version>/dataset`
- **Datamodule behavior:**
  - `add_root_if_missing()` in `wayve/ai/si/datamodules/base.py` fills each `BucketCfg.root` from `materialisation_version` or `dataset_root_path`.
  - `BucketCfg.path` expects `root/dataset_split=<split>/dataset_bucket=<bucket.name>`.
- **Compatibility question:**
  - Generic materialisation currently prefixes bucket names with platform (`{vehicle_platform}_{bucket_name}`), while many Parking/SI `BucketCfg` names are unprefixed (`dc_pudo_usa`, `dc_unpudo_usa`, etc.).
  - Before implementation we need to confirm whether generic outputs are later transformed for SI release roots, or whether we need a config/code option to preserve exact bucket names for Parking datasets.

## Notebook Semantics To Preserve
- **Event detection notebook source:** inspected from branch `parking/notebooks`, file `wayve/ai/parking/notebooks/PUDO and UnPUDO Event Detection.ipynb`.
- **Materialization notebook source:** inspected from branch `parking/notebooks`, file `wayve/ai/parking/notebooks/PUDO and UNPUDO materilization.ipynb`.
- **PUDO candidate detection:**
  - Detects drive/reverse to park transitions with spike protection.
  - Requires hazard evidence in a `+/-10s` window or trip-table evidence for PUDO.
  - Optional `park` events are raw park transitions without positive PUDO evidence.
  - Deduplicates nearby events by location and excludes office geofences.
- **UNPUDO / unparking candidate detection:**
  - Detects park to nonzero gear transitions with spike protection.
  - Finds when the vehicle has moved enough after transition.
  - Current inspected branch uses `UNPUDO_MIN_DISTANCE_M = 5.0` and acceleration threshold `0.1 m/s^2` for the event timestamp.
  - Later discussion for the target notebook plan prefers `10 m` for maneuver end and a materialization-time future-speed filter at `timestamp + 0.6s`.
  - Separates UNPUDO vs unparking by whether a future PUDO exists after the candidate.
- **Maneuver windows:**
  - PUDO/park start is estimated backwards using distance/time/indicator context.
  - UNPUDO/unparking end is estimated forward using progress/speed, bounded by next event and lookahead guards.
- **Disengagement enrichment:**
  - Adds main disengagement, fixed-window disengagement, gear-to-start disengagement, before-gear-change, and before-event-start timestamps.
  - Unparking is temporarily relabeled as UNPUDO for shared disengagement processing, then restored.
- **Current notebook materialization:**
  - Loads the parking events table.
  - Builds DC buckets by event type and country.
  - Builds AV buckets by event type/country/window: `pre_ca`, `ca_short`, `ca_long`.
  - Expands DC timestamp ranges at `50 ms` cadence.
  - Joins expanded/ranged windows to `all_data` to get real frame timestamps.
  - Applies optional event-length cutoffs and optional movement filtering for UNPUDO/unparking.
  - Writes SI-style materialized buckets and metadata using fsspec-based Azure writes.

## Target Migration Shape
- **Recommended separation:**
  - Event/window generation should become tested Spark/Python code that creates a normalized parking event/frame-source table.
  - Generic materialisation should then consume that table and write standard materialized datasets.
- **Reasoning:**
  - The existing generic `BucketingConfig` is good for filtering rows already present in a table.
  - Our notebook does more than filtering: it derives event anchors, creates time windows, explodes/range-joins frames, creates CA/pre-CA windows, applies future-frame speed conditions, and creates directional bucket variants.
  - Forcing all of that into YAML-only `BucketingConfig` would either be impossible or would hide core parking semantics in fragile source tables.

## Detailed Plan
- **Documentation intake:**
  - Re-fetch/read the Notion documentation once auth is available.
  - Add its official terminology and recommended extension points to this page.
  - Verify whether generic materialisation has a sanctioned custom source/preprocessor mechanism not visible from local code alone.
- **Inventory current notebook behavior:**
  - Extract the event-detection notebook into a readable module outline.
  - Extract the materialization notebook into a source-table construction outline.
  - List all output bucket names and map each to its event/window/filter definition.
- **Define canonical output semantics:**
  - Keep exact bucket groups: DC, `pre_ca`, `ca_short`, `ca_long`.
  - Keep event types: `pudo`, `park`, `unpudo`, `unparking`.
  - Keep country suffixes: `usa`, `uk`.
  - Keep directional variants for UNPUDO/unparking: full, `_forward`, `_reverse`.
  - Keep gear-change variants as separate buckets if we still want them, but do not mix them with the future-speed movement filter.
- **Build the normalized source table design:**
  - Minimum columns: `run_id`, `timestamp_unixus`, `dataset_split`, target bucket name, event type, country, source mode (`dc`, `pre_ca`, `ca_short`, `ca_long`), and diagnostic columns needed for validation.
  - Include only frame rows that should be materialized, not raw event rows.
  - For UNPUDO/unparking movement buckets, apply future-speed filter at materialization-source construction time.
  - For gear-change buckets, use the gear-change window without the future-speed movement filter.
- **Resolve generic materialisation bucket-name compatibility:**
  - Confirm expected bucket folder names for SI consumers.
  - Decide whether to add a generic framework option like `preserve_dataset_bucket_column`, `bucket_name_col`, or `dataset_bucket_prefix_platform: false`.
  - Alternative: generate one temporary input table/view per bucket and set `BucketConfig.name` to the exact desired name, but only if platform prefixing is resolved.
- **Integrate with generic configs:**
  - Add a parking materialisation YAML under `wayve/ai/foundation/data/curation/materialization/configs/parking/` or another agreed directory.
  - Use `default` variant unless we intentionally need generic sampling/upsampling.
  - Configure `num_partitions` and write flags explicitly.
  - Use date filters/dry-run controls in the source-table job, not as ad hoc notebook cells.
- **Implement source-table job after design approval:**
  - Convert event detection and frame expansion to importable Spark code with unit tests for window semantics.
  - Provide a CLI/Bazel entry point for creating the source table.
  - Keep expensive joins shared: tag all needed bucket memberships in one dataframe, then write once.
  - Avoid display/count-heavy notebook behavior in production.
- **Validation plan:**
  - Unit tests for gear transition spike protection, PUDO hazard matching, UNPUDO/unparking split, maneuver-window clipping, disengagement window selection, future-speed matching, forward/reverse bucketing, and duplicate handling.
  - Small Databricks dry run on a constrained date range with bucket counts compared to notebook output.
  - Full run count comparison against the latest notebook materialization.
  - SI dataloader smoke test using generated bucket paths and `BucketCfg` names.
- **Release plan:**
  - Decide whether parking datasets stay as explicit `dataset_root_path` roots or get promoted to `sampling_materialised/...` with a `materialisation_version`.
  - If using `materialisation_version`, add/reuse a promotion/copy step from generic WFM-style output to SI `sampling_materialised` root.
  - Update `parking_config.py` only after the generated paths and bucket names are validated.

## Open Questions
- Does the Notion documentation define a custom materializer/source-step API that should replace the source-table job proposed here?
- Should Parking outputs follow generic WFM bucket naming with platform prefixes, or preserve current SI bucket names exactly?
- Should the final framework own event detection, or should event detection remain a separate scheduled Delta-table generation step?
- What is the desired release root: generic `datasets/wfm/...`, SI `materialised/si/parking/...`, or `sampling_materialised/bc/...`?
- Do we still want gear-change buckets given the very low counts observed in the notebook-derived materialization?

## Code References
- Generic runner: `wayve/ai/foundation/data/curation/materialization/run_materialization.py`
- Generic config schema: `wayve/ai/foundation/data/curation/config.py`
- Bucket implementation: `wayve/ai/foundation/data/curation/materialization/bucket.py`
- Bucketing filters: `wayve/ai/foundation/data/curation/bucketing/bucketing.py`
- Bucketing config: `wayve/ai/foundation/data/curation/bucketing/config.py`
- Parking/gear enrichment: `wayve/ai/foundation/data/curation/filtering/filters/enrichment.py`
- Materialized dataset I/O: `wayve/ai/foundation/data/curation/io.py`
- SI materialisation version parser: `wayve/ai/si/datamodules/materialisation_path_parser.py`
- SI bucket root fill: `wayve/ai/si/datamodules/base.py`
- Baseline release usage: `wayve/ai/si/configs/baseline/release.py`

## Decisions
- **2026-04-30:**
  - **Decision:** Do not implement yet; first create a knowledge-sharing project and migration plan.
  - **Rationale:** The generic framework has useful primitives, but bucket naming and event/window construction semantics need explicit design before porting notebook logic.
