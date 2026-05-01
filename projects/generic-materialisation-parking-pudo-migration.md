# Generic Materialisation Parking PUDO Migration

## Overview
- **What it is:** Knowledge-sharing and planning page for moving Parking PUDO / park / UNPUDO / unparking materialisation from notebooks into Wayve's Generic Sampling Platform.
- **Why it matters:** The notebook flow is slow to iterate, hard to reproduce, and easy to fork incorrectly. The generic framework gives standard release/dev paths, comparison jobs, metadata, debug runs, and a path to baseline-candidate compliance.
- **Primary users:** Parking training owners, SI datamodule/config owners, data/materialisation owners, and reviewers of future parking dataset PRs.
- **Source of truth for this plan:** Notion app fetch of `📖 [Documentation] Generic Materialisation` on 2026-04-30 plus main-branch code inspection.

## Status
- **Phase:** Initial implementation / validation.
- **Status:** active.
- **Last updated:** 2026-05-01.
- **Implementation:** started on `boris/generic-parking-pudo-materialisation`.
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
- **2026-04-30:** Started implementation by extending Wonjoon's existing generic parking filters rather than creating a notebook/pre-stage.
- **2026-04-30:** Preserve legacy default behavior for existing generic parking filters. Stricter future-gear/progress behavior is enabled only through explicit event-dataset options.

## Implementation Progress
- **Branch:** `boris/generic-parking-pudo-materialisation`.
- **Files changed:**
  - `wayve/ai/services/sampling/datasets/parking/filters.py`
  - `wayve/ai/services/sampling/datasets/parking/common.py`
  - `wayve/ai/services/sampling/datasets/parking/events/dataset.py`
  - `wayve/ai/services/sampling/datasets/store.py`
  - `wayve/ai/services/sampling/BUILD`
  - `wayve/ai/services/sampling/test/datasets/parking/test_parking_filters.py`
- **Implemented so far:**
  - Added explicit `pudo` / `park` split over cleaned long-P/N parking segments.
  - Added explicit `unpudo` / `unparking` split over the stopped segment being exited, not a later stopped segment.
  - Added forward/reverse direction filtering from cleaned gear direction.
  - Added optional 10m progress validation for UNPUDO/unparking, with rejection if the vehicle returns to P/N before reaching progress.
  - Added future-speed filter for samples whose first frame in `[t + 0.60s, t + 0.65s]` exceeds `0.15 m/s`.
  - Added a new registered `parking/events` dataset with DC, directional DC, gear-change, CA short/long, and pre-CA buckets.
  - Added tests for PUDO/park split, UNPUDO/unparking split, progress validation, direction split, and future-speed lookup.
- **Important semantic fix during implementation:**
  - Initial code incorrectly classified UNPUDO by looking for a later PUDO-like stopped segment. That was corrected to classify by the stopped segment being exited.
  - Existing legacy `unparking` behavior still returns anchors even without future nonzero gear unless the new direction/progress options are requested. This avoids breaking existing `parking/gc` semantics.
- **Validation run:**
  - `bazel test //wayve/ai/services/sampling:test_datasets_py_test --test_arg='-k=parking' --test_arg='--cov-fail-under=0' --test_output=errors`
  - Result: passed.
  - The same scoped pytest without `--cov-fail-under=0` had all assertions passing but failed aggregate coverage because most tests were deselected.
  - Ruff, Flake8, and type-check Bazel targets reported `PASSED`; the shell returned nonzero after each because `.bazelpostscript` hit `errors: unbound variable`.

## Databricks Sanity Check
- **Reference table:** `parking.pudo_unpudo_unpark_events`.
- **Sample:** `fme20031/2026-04-29--08-47-39--gen2-av-c38acf7d-2d3c-40d0-ac67-d483eaf1e45e`.
- **Future-speed result:** sampled UNPUDO rows all pass the planned filter:
  - first frame in `[timestamp + 0.60s, timestamp + 0.65s]`
  - `abs(speed_kmh) >= 0.54`
- **PUDO hazard result:** notebook PUDO is not strictly hazard-only in this sample.
  - Some PUDO rows had hazard frames in the notebook event window.
  - Some PUDO rows had zero hazard frames in the event window and zero hazard frames in +/-30s, but non-off left/right indicators.
  - One PUDO row had hazard within +/-30s but not inside the notebook event window.
- **Implication:**
  - The current generic hazard-only `pudo` split is aligned with the simplified design assumption but will not exactly reproduce `parking.pudo_unpudo_unpark_events`.
  - If exact parity with the notebook table matters, PUDO evidence needs to include the notebook's additional logic, not just hazard inside the long stopped segment.

## 2026-05-01 Comparison Date Run
- **Goal:** find a date present in the old Databricks parking BC materialisation and trigger a generic `parking/events` materialisation for comparison.
- **Reference table checked:** `hive_metastore.parking.2026_03_15_11_14_01_server_parking_pudo_buckets_bc`.
- **Chosen date:** `2026-03-14`.
- **Why this date:** it exists in the old table and is much smaller than adjacent available dates, so it is a practical single-day comparison.
- **Old-table signal for 2026-03-14:**
  - Driving rows exist across `dc`, `dc_high_jerk`, `dc_high_curvature`, `dc_indicator_on`, `dc_long`, `dc_pre_start`, and `dc_reduce_speed_to_speed_limit`.
  - Parking rows exist for `dc_parking_deu`, `dc_parking_uk`, `dc_parking_usa`, `dc_parking_long_deu`, `dc_parking_long_uk`, and `dc_parking_long_usa`.
  - The old table does not expose explicit `pudo`, `unpudo`, or `unparking` bucket names for this date, so comparison is semantic/count-based rather than exact bucket-name parity.
- **Submitted command:**
  - `bazel run //wayve/ai/services/sampling:workflow -- remote --force-prod-version-of-registered-images run sample --dataset_name parking/events --job_name parking_events_compare_2026_03_14 --start_date 2026-03-14 --end_date 2026-03-14 --dry_run`
- **Why the extra Flyte flag:** running without `--force-prod-version-of-registered-images` failed before Flyte execution creation because local `skopeo list-tags` could not authenticate to `wayveacrprodflyte.azurecr.io/sampling`.
- **Flyte execution:** `https://flyte.data.wayve.ai/console/projects/ai-services-sampling/domains/production/executions/amrldrsqz9kj7nq4r4qq`.
- **Initial status:** `RUNNING` in `wayve.ai.services.sampling.common.tasks.generate_bucketed_dataset_task`.

## Wonjoon Generic Parking vs Notebook Logic
- **High-level conclusion:** Wonjoon already ported a large part of the parking/unparking materialisation problem into `services/sampling`: reliable gear reconstruction, parking/unparking event anchors, maneuver windows, gear-change count buckets, and gear-change boundary buckets. The missing part is mostly the PUDO-specific semantics: hazard/trip evidence, PUDO vs park split, UNPUDO vs unparking split, notebook event-table validation columns, directional forward/reverse UNPUDO/unparking buckets, and the newer future-speed movement filter.
- **Wonjoon commits:**
  - `024de24343e` / PR #101525: added `parking/default`, `parking/gc`, shared parking filters, store registration, and tests.
  - `a49ea560644` / PR #106341: simplified/refined gear-based parking materialisation, especially gear-count and boundary logic.
- **Where his logic lives:**
  - `wayve/ai/services/sampling/datasets/parking/filters.py`: core gear reconstruction, P/N segment extraction, maneuver-window selection, gear-count filtering, hazard exclusion, gear-change boundary selection.
  - `wayve/ai/services/sampling/datasets/parking/common.py`: parking-specific exclusions, intervention windows, shared filter singletons.
  - `wayve/ai/services/sampling/datasets/parking/gc/dataset.py`: bucket definitions for parking/unparking window/timestamp/CA/nopudo/boundary buckets.
  - `wayve/ai/services/sampling/test/datasets/parking/test_parking_filters.py`: regression coverage.

### What Wonjoon Already Covers
- **Gear cleanup / reconstruction:**
  - Reconstructs gen2 Mache gear from signed speed when gear is unreliable.
  - Keeps only validated P/N segments with duration >= 2s.
  - Extends P/N into adjacent standstill unknowns.
  - Forward-fills remaining unknowns so gear changes land at movement start.
  - Smooths short transient gear states with `min_gear_dwell_sec=0.5`.
- **Parking anchors:**
  - Uses the first frame of a long gear-zero segment as the parking anchor.
  - Window goes backward by the longer of `25s` or `30m`.
  - Can return either the full window or a single timestamp at the maneuver start.
- **Unparking anchors:**
  - Uses the last frame of a long gear-zero segment as the unparking anchor.
  - Window goes forward by `15s` by default, with `0.5s` pre-event buffer into the parked segment.
  - Can return either the full window or the single departure timestamp.
- **Gear-change count:**
  - Counts gear changes in the maneuver window before pre-event buffer extension.
  - Supports `gc1`, `gc2`, `gc3`, `gc3plus`, and timestamp `gc0`.
  - This directly supports multi-point parking/unparking sampling.
- **Gear-change boundary sampling:**
  - Adds `gc_boundary` buckets as intersection of maneuver windows with +/-1s around each cleaned gear change.
  - This is close to the Zak/Wonjoon idea of sampling decision points around gear changes.
- **PUDO hazard exclusion:**
  - Has `parking_window_nopudo_*` and `parking_timestamp_nopudo_*` buckets that exclude parking segments with hazard active inside the long P/N segment.
  - This is only an exclusion, not a full PUDO positive bucket.
- **CA windows:**
  - Has CA-intersected parking/unparking buckets using generic intervention filters.
  - This is much cleaner than notebook-specific disengagement joins, but less semantically rich than the notebook event table.

### What The Notebooks Do Differently
- **PUDO detection:**
  - Detects nonzero gear -> park transitions with spike protection using previous/current/next gear context.
  - Keeps positive PUDO events if hazard is active within +/-10s of the transition.
  - Also adds PUDO events from robotaxi trip summary completion events, then matches them back to raw gear transitions by closest position within 5m.
  - Deduplicates nearby events by location and excludes office geofences.
  - Optional `park` events are raw park transitions without PUDO evidence.
- **UNPUDO/unparking detection:**
  - Detects park -> nonzero gear transitions with spike protection.
  - Looks forward until the vehicle moved at least `UNPUDO_MIN_DISTANCE_M` from the transition.
  - In the inspected notebook this threshold is still `5m`; our later agreed target was `10m`.
  - Looks backward from that moved-enough point to find the earliest acceleration frame above `0.1 m/s^2` and uses that as `timestamp_unixus`.
  - Splits UNPUDO vs unparking by whether a later PUDO exists in the same run.
- **Maneuver enrichment:**
  - Adds `event_startOrEnd_timestampunixus`, `gearchange_timestamp`, and derived timing columns.
  - PUDO/park windows include backward calibration by distance/time/indicator edges.
  - UNPUDO/unparking windows include gear-to-start and maneuver-end timestamps.
- **Disengagement handling:**
  - Adds several disengagement timestamp variants: main window, fixed window, gear-to-start, before gear change, before event start.
  - Temporarily relabels `unparking` as `unpudo` for shared disengagement processing, then restores it.
- **Training bucket materialisation:**
  - Expands DC windows at 50ms cadence, joins exact timestamps to `all_data`, and writes SI-style materialised buckets.
  - Builds `pre_ca`, `ca_short`, and `ca_long` buckets around selected disengagement anchors.
  - Applies optional event-length cutoffs and optional UNPUDO/unparking acceleration filtering.
  - Newer branch work added desired future-speed filtering and directional forward/reverse buckets, but that is not in Wonjoon's generic code yet.

### Direct Semantic Gaps To Port
- **Positive PUDO bucket:** Wonjoon's `nopudo` only removes hazard parking from parking buckets. We need the complementary positive PUDO buckets, ideally using the same common parking event calculation and hazard/trip evidence.
- **Park bucket:** We need raw park transitions not classified as PUDO if we still want separate `park` training buckets.
- **UNPUDO vs unparking split:** Wonjoon has generic `unparking`; notebook splits it into `unpudo` if a future PUDO exists, otherwise `unparking`.
- **Event-table validation semantics:** Generic sampling does not currently emit the notebook event table columns. For migration validation we should compare against `parking.pudo_unpudo_unpark_events`.
- **Future-speed movement filter:** Need the newer `timestamp + ~0.6s` speed > `0.15 m/s` condition for UNPUDO/unparking movement buckets if we keep that design.
- **Directional buckets:** Need `_forward` / `_reverse` variants for UNPUDO/unparking based on cleaned gear direction.
- **CA/pre-CA parity:** Wonjoon's CA support is generic intervention intersection. The notebook uses event-specific disengagement anchors and multiple timestamp variants. We need decide whether to keep the notebook-specific CA semantics or accept generic CA windows.
- **Bucket names:** Wonjoon's bucket names are `parking_window_gc*_...` and `unparking_window_gc*_...`; our training configs expect `dc_pudo_*`, `dc_unpudo_*`, `dc_unparking_*`, directional variants, etc.

### Practical Migration Implication
- Start from Wonjoon's `parking/filters.py` and `parking/common.py`.
- Add PUDO/park classification as a split over the existing parking event calculation rather than duplicating gear transition logic.
- Add UNPUDO/unparking classification as a split over the existing unparking event calculation.
- Reuse gear-boundary and gear-count code for decision-point buckets.
- Add focused tests for only the missing semantics: hazard-positive PUDO, trip-table PUDO if still required, future-PUDO split, future-speed filter, and directional forward/reverse buckets.

## 2026-05-01 Generic Run Count Check
- **Run scope:** single-day generic materialisation sanity run, compared against `hive_metastore.parking.pudo_unpudo_unpark_events` for `run_date_iso = '2026-04-29'`.
- **Generic output sample counts:** `44,514` train rows and `4,958` validation rows across all emitted buckets. These totals double-count samples that appear in both full buckets and additive directional / gear-change buckets.
- **Base generic buckets only:** excluding `_forward`, `_reverse`, and `_gear_change` variants:
  - Train: `38,207` rows (`park=11,689`, `pudo=16,426`, `unpudo=7,615`, `unparking=2,477`).
  - Validation: `4,032` rows (`park=2,318`, `pudo=721`, `unpudo=724`, `unparking=269`).
- **Reference event table count for 2026-04-29:** `pudo=212`, `unpudo=198`, `unparking=77`. The reference table has no `park` rows in this table version.
- **Comparison caveat:** generic counts are materialised frame/sample rows, while the Databricks table count is event rows. The rough sample-per-event ratio is plausible for the configured windows, but this is not exact parity validation.
- **Observed bucket sparsity:** some single-day DC directional buckets are absent or one-sided (for example only `dc_pudo_uk_reverse`, only `dc_unpudo_usa_reverse`, only `dc_unparking_uk_forward`). This may be a single-day/date effect, but it is a useful signal to inspect before trusting directional balancing.
