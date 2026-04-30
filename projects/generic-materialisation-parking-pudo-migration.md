# Generic Materialisation Parking PUDO Migration

## Overview
- **What it is:** Knowledge-sharing and planning page for moving Parking PUDO / park / UNPUDO / unparking materialisation from notebooks into Wayve's Generic Sampling Platform.
- **Why it matters:** The notebook flow is slow to iterate, hard to reproduce, and easy to fork incorrectly. The generic framework gives standard release/dev paths, comparison jobs, metadata, debug runs, and a path to baseline-candidate compliance.
- **Primary users:** Parking training owners, SI datamodule/config owners, data/materialisation owners, and reviewers of future parking dataset PRs.
- **Source of truth for this plan:** Notion app fetch of `📖 [Documentation] Generic Materialisation` on 2026-04-30 plus main-branch code inspection.

## Status
- **Phase:** Research / planning.
- **Status:** active.
- **Last updated:** 2026-04-30.
- **Implementation:** not started.
- **Important correction:** The official Generic Materialisation framework from Notion is `wayve/ai/services/sampling`, not the older/local `wayve/ai/foundation/data/curation/materialization` path.

## Notion Findings
- **Documentation page:** `https://app.notion.com/p/30a03da5d69a804c8598c64c193d287d`.
- **Recommended code entry point:** `wayve/ai/services/sampling/README.md`.
- **Run shape:**
  - `make acr-login`
  - `make publish-test -C wayve/ai/services/sampling`
  - `bazel run //wayve/ai/services/sampling:workflow -- remote run sample --dataset_name <dataset> --job_name <job>`
- **Storage root:** `abfss://datasets@wayveproddatasetflat.dfs.core.windows.net/sampling_materialised/...`.
- **Comparison:** a comparison job runs automatically after materialisation; if `comparison_path` is not provided it compares against the relevant release dataset.
- **Research/dev rule:** branch/dev datasets can still use either old or new materialisation, but the generic framework is preferred when the dataset may become a baseline candidate.
- **Baseline/candidate rule:** use the new materialisation workflow, merge materialisation changes to `main`, use a release dataset, and preserve high overlap on unchanged buckets.
- **Ownership:** workflow support is Training Tech in `#training-tech-support`; filter/dataset support is Driving Performance in `#team-driving-performance`.

## Generic Sampling Platform Code Map
- **Workflow entry:** `wayve/ai/services/sampling/common/workflow.py`.
- **Dataset registry:** `wayve/ai/services/sampling/datasets/store.py`.
- **Dataset schema:** `wayve/ai/services/sampling/common/api/dataset.py`.
- **Bucket schema:** `wayve/ai/services/sampling/common/api/bucket.py`.
- **Filter API:** `wayve/ai/services/sampling/common/api/filters/dataframes.py`.
- **Ray materialisation stages:** `wayve/ai/services/sampling/common/ray_tasks.py`.
- **Path/metadata helpers:** `wayve/ai/services/sampling/common/utils.py`.
- **Existing parking datasets:**
  - `wayve/ai/services/sampling/datasets/parking/default/dataset.py`
  - `wayve/ai/services/sampling/datasets/parking/gc/dataset.py`
  - `wayve/ai/services/sampling/datasets/parking/common.py`
  - `wayve/ai/services/sampling/datasets/parking/filters.py`
  - `wayve/ai/services/sampling/test/datasets/parking/test_parking_filters.py`
- **Wonjoon context:** Wonjoon's parking materialisation work is already in this framework. `024de24343e` (`Parking materialise`, PR #101525) added the generic parking package, and `a49ea560644` (`simplify gear based parking materialisation`, PR #106341) refined the gear-count parking/unparking materialisation.

## How The Generic Pipeline Works
- **Dataset registration:** a `BucketedDataset` is added to `DATASET_STORE` under a name like `bc/split_alpha2_alpha3`, `parking/default`, or `parking/gc`.
- **Dataset config:** `BucketedDataset` defines `name`, `platforms`, `binary_dataset_name`, `start_date`, `end_date`, `base_table`, optional `attributes`, and a list of `Bucket` objects.
- **Bucket config:** each `Bucket` has a name, a list of composable filters, and an optional balancer.
- **Filter model:** filters are boolean masks over batches, usually implemented as `PandasFilter` functions and applied per run when temporal context is required.
- **Run command:** `sample(dataset_name, job_name, ...)` resolves the dataset from the store, chooses a dev or release path, creates masks, creates bucket assignments, balances/writes final buckets, and writes metadata.
- **Dev path:** `sampling_materialised/<dataset_name>/dev/<job_name>__<timestamp>`.
- **Release path:** `sampling_materialised/<dataset_name>/release/<version>` using `stable.yaml` / `autopublish.yaml` versioning.
- **Final output shape:** `dataset/dataset_split=<split>/dataset_bucket=<bucket.name>/part-00000.parquet`.
- **Final columns:** the final dataset writer keeps `run_id` and `timestamp_unixus`; bucket/split are encoded in the partition path.
- **Metadata:** `_parquet_files_list.txt`, `summary.yaml`, and comparison/distribution outputs are generated under the dataset root.
- **Debug support:** `--debug`, `--start_date`, `--end_date`, `--comparison_path`, `--run_ids_filter`, and stage-specific reruns exist.

## Existing Parking Support On Main
- **`parking/default`:** an existing registered dataset entry for legacy parking-window buckets using `select_parking_legacy` and parking-specific DC/CA/pre-CA exclusions.
- **`parking/gc`:** an existing registered dataset entry for gear-change-count parking/unparking buckets, close to Wonjoon's long-horizon parking materialisation.
- **Important interpretation:** `default` and `gc` are current dataset entry points, not a design reason to maintain separate parking implementations. New PUDO/park/UNPUDO/unparking work should reuse shared helpers in `parking/common.py` and `parking/filters.py` and split bucket membership from common event calculations.
- **Gear reconstruction:** `parking/filters.py` reconstructs gen2 Mache gear from signed speed, keeps validated P/N segments, extends P/N into adjacent standstill, and forward-fills unknown standstill so gear changes land at movement start.
- **Gear smoothing:** short transient gear states are removed with a minimum dwell threshold.
- **Parking windows:** parking uses a backwards maneuver window before first P frame.
- **Unparking windows:** unparking uses last P frame and a forward window, with a small pre-event buffer.
- **Gear-count buckets:** `gc1`, `gc2`, `gc3`, `gc3plus` encode number of gear changes inside the maneuver window.
- **Boundary buckets:** `gc_boundary` intersects maneuver windows with +/-1s around gear changes to sample pre-departure standstill and initial movement.
- **PUDO exclusion:** `nopudo` parking buckets exclude hazard-indicator PUDO-like segments.
- **Tests:** main already has unit tests for parking/unparking gear-count selection, pre-event buffer behavior, disjoint windows, hazard/PUDO exclusion, and gear-change boundary masks.

## What Main Does Not Yet Cover
- **PUDO vs park event semantics:** the existing `parking/gc` dataset primarily detects parking/unparking from P/N gear segments, not the notebook's PUDO/park classification using hazard/trip evidence.
- **UNPUDO vs unparking classification:** the existing dataset does not split park exit into UNPUDO vs generic unparking using future PUDO/event context.
- **Notebook event table semantics:** current notebooks generate event anchors and disengagement variants such as fixed window, gear-to-start, before gear change, and before event start.
- **Future-speed movement filter:** the planned notebook semantics filter UNPUDO/unparking samples by speed at approximately `timestamp + 0.6s` > `0.15 m/s`.
- **Directional buckets:** the existing generic parking datasets do not expose `_forward` and `_reverse` UNPUDO/unparking buckets based on cleaned gear direction.
- **PUDO/park gear-transition buckets:** the existing gear-boundary logic exists for parking/unparking maneuvers, but not specifically for the PUDO/park event table buckets.
- **Exact training bucket names:** our SI configs consume names like `dc_pudo_usa`, `dc_unpudo_usa`, `dc_unparking_usa_forward`, etc.; the generic dataset must preserve exact bucket names or update configs atomically.

## Notebook Semantics To Preserve
- **Event types:** `pudo`, `park`, `unpudo`, `unparking`.
- **Bucket groups:** DC, `pre_ca`, `ca_short`, `ca_long`.
- **Countries:** `usa`, `uk`.
- **Directional variants:** full, `_forward`, `_reverse` for UNPUDO/unparking.
- **Movement buckets:** UNPUDO/unparking DC and disengagement buckets should apply the future-speed condition where agreed.
- **Gear-change buckets:** should sample +/-1s around relevant gear transitions and should not be removed by the future-speed movement filter.
- **PUDO/park windows:** keep the start/end window semantics from the notebook, including increased event-length limit for PUDO/park if still needed.
- **UNPUDO/unparking windows:** use the park-exit gear transition minus pre-buffer to maneuver-end/progress time; do not drop long events merely because the full event is long.
- **Disengagement handling:** keep CA/pre-CA windows close to disengagements rather than materialising entire long maneuvers.

## Recommended Migration Direction
- **Use `services/sampling` as the target framework.** This matches Notion, release paths, comparison jobs, and existing main-branch parking support.
- **Do not port notebook logic into YAML-only filters blindly.** The PUDO event logic is event-generation plus frame expansion, not just row filtering.
- **Reuse shared parking calculations.** Gear reconstruction, gear smoothing, maneuver-window construction, gear-count labels, and gear-boundary tests are already implemented under `datasets/parking`; extend those helpers rather than creating a PUDO-specific implementation.
- **Do not add a notebook/local pre-stage as the default plan.** A pre-stage would either be slow or become a second optimized pipeline to maintain. The primary design should run inside the generic materialiser's distributed filter flow.
- **Treat `default` and `gc` as existing dataset entries, not separate architecture layers.** We can add another registered dataset entry if release/versioning needs it, but the calculation should stay shared in `parking/common.py` and `parking/filters.py`.
- **Use `parking.pudo_unpudo_unpark_events` for validation against notebook semantics.** It should be the comparison reference, not necessarily the production source unless we prove an event table is required.
- **Keep output names SI-compatible.** Final `dataset_bucket=<bucket.name>` paths should match the names used in `parking_config.py` unless we deliberately migrate configs.

## Implementation Plan
- **Step 1: Implement in-framework shared event masks first.**
  - Build parking/PUDO/UNPUDO/unparking event detection as shared `PandasFilter` logic over `wayve_corpus.all_data` batches.
  - Reuse the generic materialiser's existing distributed execution instead of adding a notebook/pre-stage.
  - Only revisit a normalized source table if we prove that required signals cannot be computed from the per-run batch or existing filter table joins.
- **Step 2: Extend the parking dataset area with shared event logic.**
  - Keep the calculation in `wayve/ai/services/sampling/datasets/parking/` and reuse existing gear reconstruction, maneuver-window, and gear-boundary helpers.
  - Compute the common parking event once, then split into `park` vs `pudo` by hazard/PUDO evidence.
  - Compute the common park-exit event once, then split into `unparking` vs `unpudo` by downstream PUDO/event semantics.
  - Add a new dataset entry only if we need separate release/versioning from existing `parking/default` and `parking/gc`; do not fork the underlying calculations.
- **Step 3: Build event filters / source columns.**
  - Implement PUDO/park transition detection with spike protection.
  - Implement UNPUDO/unparking park-exit detection.
  - Implement PUDO evidence from hazard/trip signal if available in the generic batch context.
  - Implement UNPUDO-vs-unparking split from future PUDO/event context.
  - Reuse gear cleanup from `parking/filters.py` or refactor it into shared helpers.
- **Step 4: Build bucket filters.**
  - DC: `dc_pudo_{country}`, `dc_park_{country}` if needed, `dc_unpudo_{country}`, `dc_unparking_{country}`.
  - Directional DC: `dc_unpudo_{country}_forward`, `dc_unpudo_{country}_reverse`, `dc_unparking_{country}_forward`, `dc_unparking_{country}_reverse`.
  - CA/pre-CA: `ca_short_*`, `ca_long_*`, `pre_ca_*` for PUDO/UNPUDO/unparking as required.
  - Gear-change: separate buckets around relevant gear transitions, not mixed into movement-filtered buckets.
- **Step 5: Add speed-at-0.6s filter.**
  - Implement an efficient per-run future-speed lookup against the nearest frame in a small window around `timestamp + 0.6s` or `0.65s` if that remains the chosen offset.
  - Apply only to UNPUDO/unparking movement buckets and relevant disengagement buckets.
  - Do not apply to PUDO/park or gear-change buckets unless explicitly decided.
- **Step 6: Add tests before full materialisation.**
  - Unit-test gear reconstruction and smoothing reuse.
  - Unit-test event classification on small synthetic runs.
  - Unit-test future-speed lookup with missing exact timestamps.
  - Unit-test directional bucket masks.
  - Unit-test gear-change boundary masks for multi-gear maneuvers.
  - Unit-test PUDO vs park hazard/trip evidence behavior.
- **Step 7: Run debug materialisation.**
  - Use `--debug` and/or `--start_date` / `--end_date` first.
  - Verify bucket counts and sample examples before running a broad range.
  - Use stage-specific reruns if create-buckets or balance-buckets needs iteration.
- **Step 8: Compare against notebook output.**
  - Use `parking.pudo_unpudo_unpark_events` as the notebook-derived event table reference.
  - Compare counts per bucket against buckets derived from that table.
  - Compare sample overlap for unchanged bucket definitions.
  - Manually inspect examples for reverse UNPUDO/unparking and long multi-gear maneuvers.
- **Step 9: Release integration.**
  - Decide whether training configs reference `dataset_root_path` directly or a generic `materialisation_version` such as `parking/pudo/release/<version>`.
  - If baseline-candidate, follow Notion migration rules: changes merged to `main`, release dataset, comparison artifacts, and overlap explanation.

## Performance Plan
- **Avoid notebook/pre-stage failure modes:** no production notebook execution, no local pre-stage, no global `display()` on event tables, no repeated wide joins per bucket, no repeated full `count()` during production runs.
- **Exploit per-run filters:** where possible, compute temporal masks once per run and reuse them across bucket definitions.
- **Use debug runs:** constrain date/run IDs for iteration rather than running multi-hour full materialisations.
- **Use stage reruns:** if masks are correct, rerun only bucketing or balancing stages.
- **Keep bucket names explicit:** avoid dynamically generating hundreds of low-count buckets until counts justify them.

## Open Questions
- Can all PUDO/UNPUDO classification be computed from `wayve_corpus.all_data` columns available to `services/sampling`, or do we need an existing side table only for validation/comparison?
- If a side table is required, can it be joined inside the generic framework without creating a separate notebook/pre-stage?
- Which exact future-speed offset do we standardize on: `0.60s`, `0.65s`, or nearest frame in a bounded window?
- Do we want to keep low-count gear-change buckets, or use only boundary sampling inside larger movement buckets?
- Should PUDO/park be included in the same dataset as UNPUDO/unparking, or split into separate datasets for easier release comparison?
- Who owns final filter review: Parking training owners, Driving Performance, or Training Tech?

## Decisions
- **2026-04-30:** Use Notion via the Codex Apps connector as the documentation source.
- **2026-04-30:** Treat `wayve/ai/services/sampling` as the target generic materialisation framework.
- **2026-04-30:** Do not implement yet; first document the framework, current main-branch parking support, gaps, and migration plan.
