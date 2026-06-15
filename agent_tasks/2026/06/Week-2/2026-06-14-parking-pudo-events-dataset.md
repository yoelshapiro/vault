# 2026-06-14 Parking/PUDO Events Dataset

- Branch: `boris/pudo_generic_materialization`
- Worktree: `/workspace/pudo_materialization_buckets`
- Change type: code change, tests, Flyte run
- PR: N/A

## Summary

Added a new generic materialisation dataset config, `parking_pudo/events`, for event-table-style PUDO and UnPUDO rows.

The dataset emits one bucket named `events` with no country suffix. It intentionally does not apply the normal DC-only autonomous filter, so DC and AV rows can be compared against the notebook event table.

## Implementation

- Added `wayve/ai/services/sampling/datasets/parking_pudo/event_table.py`.
  - Detects PUDO at smoothed gear-to-Park anchors when hazard/trip context is present.
  - Detects UnPUDO at first movement after a smoothed Park segment when the source parked segment has hazard/trip context.
  - Records:
    - `event_type`
    - `inferred_what`
    - `gear_change_timestamp_unixus`
    - `disengagement_timestamp_unixus`
    - `country`
    - `trip_detected`
    - `hazard_detected`
    - `trip_id`
  - For UnPUDO, searches for disengagement from 1s before the gear-leaves-Park frame until the first 5m displacement point after departure.
- Added `wayve/ai/services/sampling/datasets/parking_pudo/events/dataset.py`.
  - Registers one bucket, `events`.
  - Uses driving binary `3.0.68`.
  - Uses date range `2025-12-01` to `2026-06-07`.
- Registered `parking_pudo/events` in `datasets/store.py`.
- Added a narrow framework hook, `BucketedDataset.extra_output_columns`, so metadata columns produced by `post_process_batch` survive mask generation and bucket creation.

## Validation

Passed:

- `bazel test //wayve/ai/services/sampling:test_tasks_py_test //wayve/ai/services/sampling:test_datasets_py_test --test_filter='test_extra_output_columns_survive_masks_and_buckets|test_parking_pudo_events_dataset_uses_single_unsplit_bucket|test_parking_pudo_event_metadata_detects_pudo_unpudo_and_disengagement|test_parking_pudo_event_metadata_records_trip_id_without_hazards'`
- `bazel test //wayve/ai/services/sampling:test_datasets_py_lint_ruff //wayve/ai/services/sampling:test_tasks_py_lint_ruff //wayve/ai/services/sampling:test_datasets_ty //wayve/ai/services/sampling:test_tasks_ty`
- `bazel test //wayve/ai/services/sampling:test_datasets_py_lint_flake8 //wayve/ai/services/sampling:test_tasks_py_lint_flake8`
- `bazel build //wayve/ai/services/sampling:dataset_configs //wayve/ai/services/sampling:tasks`

## Flyte

- Image: `wayveacrprodflyte.azurecr.io/sampling:borisindel-tmp-build-0.1.125-boris-pudo_generic_materialization-59584`
- Flyte execution: https://flyte.data.wayve.ai/console/projects/ai-services-sampling/domains/production/executions/aqkssq4fckbcpgcswphx
- Command:

```bash
WAYVECODE_MAIN_COMMIT_META_OVERRIDE=244abae57524 bazel run //wayve/ai/services/sampling:workflow -- \
  remote run filter_and_bucket_stage \
  --dataset_name parking_pudo/events \
  --job_name parking_pudo_events_20260614
```

Used `filter_and_bucket_stage` for the first review run because the new dataset has no stable comparison root yet; a full `sample` run would likely reach compare and fail after materialisation.

## 2026-06-15 AV Mode Column

Added `av_mode` to the event metadata schema. It is a boolean copied from `ground_truth__state__vehicle__automation_active` at the emitted event anchor:

- PUDO: AV mode at the gear-to-Park anchor.
- UnPUDO: AV mode at the first-movement-after-Park anchor.

Validation passed:

- `bazel test //wayve/ai/services/sampling:test_tasks_py_test //wayve/ai/services/sampling:test_datasets_py_test --test_filter='test_extra_output_columns_survive_masks_and_buckets|test_parking_pudo_events_dataset_uses_single_unsplit_bucket|test_parking_pudo_event_metadata_detects_pudo_unpudo_and_disengagement|test_parking_pudo_event_metadata_records_trip_id_without_hazards'`
- `bazel test //wayve/ai/services/sampling:test_datasets_py_lint_ruff //wayve/ai/services/sampling:test_tasks_py_lint_ruff //wayve/ai/services/sampling:test_datasets_ty //wayve/ai/services/sampling:test_tasks_ty`
- `bazel test //wayve/ai/services/sampling:test_datasets_py_lint_flake8 //wayve/ai/services/sampling:test_tasks_py_lint_flake8`
- `bazel build //wayve/ai/services/sampling:dataset_configs //wayve/ai/services/sampling:tasks`

Published image:

- `wayveacrprodflyte.azurecr.io/sampling:borisindel-tmp-build-0.1.125-boris-pudo_generic_materialization-59584`
- Digest: `sha256:e442447224e561c91af60dc934cb7f0c30348972fc8444513764b0dc853e055a`

Flyte rerun:

- https://flyte.data.wayve.ai/console/projects/ai-services-sampling/domains/production/executions/asbcbg8m6s8g6c24qscc
- Output root: `abfss://datasets@wayveproddatasetflat.dfs.core.windows.net/sampling_materialised/parking_pudo/events/dev/parking_pudo_events_av_mode_20260615__2026-06-15-05-23`
- Command:

```bash
WAYVECODE_MAIN_COMMIT_META_OVERRIDE=244abae57524 bazel run //wayve/ai/services/sampling:workflow -- \
  remote run filter_and_bucket_stage \
  --dataset_name parking_pudo/events \
  --job_name parking_pudo_events_av_mode_20260615
```

## 2026-06-15 Databricks Upload

Added notebook-compatible upload script:

- `wayve/ai/services/sampling/datasets/parking_pudo/events/upload_generic_events_to_databricks.py`

The script reads the materialised `buckets` output, joins model attribution using the same sources as the event notebook, and overwrites:

- Table: `parking.parking_pudo_generic_events`
- Delta path: `abfss://databricks-users@wayveproddataset.dfs.core.windows.net/parking/parking_pudo_generic_events.table`

Model attribution logic:

- Prefer timestamp-scoped `prod_data_pipeline.raw__inference.model_episodes`.
- Fall back to run-scoped `prod_data_pipeline.raw__model_catalogue_sync.vehicle_run_models`.
- Add `model_nickname`, `model_session_id`, `model_mapping_source`, `author`, `tags`, `is_pudo_model`, `model_index`, and `model_artefact_id`.

Databricks upload:

- Job run: https://adb-7835963732836817.17.azuredatabricks.net/?o=7835963732836817#job/255678355932888/run/565698465815546
- Task run: https://adb-7835963732836817.17.azuredatabricks.net/?o=7835963732836817#job/255678355932888/run/1009115031533469
- Status: success

Verification query summary:

- Rows: `278608`
- Rows with model nickname: `268192`
- AV rows: `69980`
- PUDO rows: `137792`
- UnPUDO rows: `140816`
- Timestamp range: `1764547496033319` to `1780774159383295`

## 2026-06-15 Park/Unpark Events and Trip-Run Park Suppression

Updated the generic event dataset to emit all four event types:

- `pudo`
- `unpudo`
- `park`
- `unpark`

For normal `park`, added the requested trip-table guard: if the joined parking/PUDO trip side table has any event for the run, the park bucket returns no rows for that run. This is only applied to `park`, not `unpark`.

Implementation:

- Added `run_has_parking_pudo_trip_events` in `signals.py`.
- Applied it in `select_park_pudo_event(... event_type="park")`.
- Extended `event_table.py` so the event-row metadata builder emits `park`/`unpark` rows as well as PUDO/UnPUDO rows.
- Added focused tests for park/unpark emission and park suppression on trip runs.

Validation passed with `WAYVECODE_MAIN_COMMIT_META_OVERRIDE=244abae57524`:

- `bazel test //wayve/ai/services/sampling:test_datasets_py_test --test_filter='test_parking_pudo_event_metadata_detects_pudo_unpudo_and_disengagement|test_parking_pudo_event_metadata_detects_park_unpark_without_pudo_context|test_parking_pudo_event_metadata_records_trip_id_without_hazards|test_parking_pudo_event_metadata_excludes_park_for_trip_runs|test_parking_pudo_events_dataset_uses_single_unsplit_bucket'`
- `bazel test //wayve/ai/services/sampling:test_datasets_py_lint_ruff //wayve/ai/services/sampling:test_tasks_py_lint_ruff //wayve/ai/services/sampling:test_datasets_ty //wayve/ai/services/sampling:test_tasks_ty`
- `bazel test //wayve/ai/services/sampling:test_datasets_py_lint_flake8 //wayve/ai/services/sampling:test_tasks_py_lint_flake8`
- `bazel build //wayve/ai/services/sampling:dataset_configs //wayve/ai/services/sampling:tasks`

Published image:

- `wayveacrprodflyte.azurecr.io/sampling:borisindel-tmp-build-0.1.125-boris-pudo_generic_materialization-59584`
- Digest: `sha256:1408417c6b2eaf78cad2dc6e07588e386be173af98314f0df6877f0b7d3833f5`

Flyte run:

- Execution: https://flyte.data.wayve.ai/console/projects/ai-services-sampling/domains/production/executions/an7nqgxvhvdrc9p4pzlh
- Status: succeeded
- Output root: `abfss://datasets@wayveproddatasetflat.dfs.core.windows.net/sampling_materialised/parking_pudo/events/dev/parking_pudo_events_park_unpark_20260615__2026-06-15-08-14`
- Delta table stats: `{"wayve_corpus.all_data": [311911], "inferred__robotaxi.trip_events": [7241]}`

Databricks upload:

- Run: https://adb-7835963732836817.17.azuredatabricks.net/?o=7835963732836817#job/685889555757934/run/248929635966954
- Task run: https://adb-7835963732836817.17.azuredatabricks.net/?o=7835963732836817#job/685889555757934/run/991478778966077
- Status: success
- Table: `hive_metastore.parking.parking_pudo_generic_events`
- Rows: `513502`
- Root in table: `abfss://datasets@wayveproddatasetflat.dfs.core.windows.net/sampling_materialised/parking_pudo/events/dev/parking_pudo_events_park_unpark_20260615__2026-06-15-08-14`

Counts by event type:

| event_type | rows | av_rows | trip_rows | hazard_rows |
|---|---:|---:|---:|---:|
| park | 115134 | 2108 | 0 | 8 |
| pudo | 137792 | 30394 | 72932 | 120833 |
| unpark | 119760 | 9304 | 0 | 0 |
| unpudo | 140816 | 39586 | 73913 | 123121 |

## 2026-06-15 Event Dataset Safety Filters

Added the requested event-dataset exclusions while keeping event generation DC + AV and Gen2-only:

- filtered corpus membership
- geofence exclusion
- known bad runs/windows
- quarantined runs
- quarantined segments
- non-contiguous frames
- invalid video filename

Implementation:

- `parking_pudo/events` now applies `EVENT_EXCLUSIONS` before `select_parking_pudo_event_rows`.
- The dataset remains `platforms=["gen2"]`.
- No autonomous, vehicle-model, low-steering, wheel-odometry, country, speed, or allowed-run-tag filters were added for this change.

Validation:

- Event-focused pytest subset passed all 5 selected tests, but the Bazel target failed its coverage gate because the rest of the suite was deselected.
- Full `test_datasets_py_test` currently fails on unrelated `test_overlapping_park_windows_are_assigned_to_first_event`.
- Passed `bazel test //wayve/ai/services/sampling:test_datasets_py_lint_ruff //wayve/ai/services/sampling:test_datasets_ty`.

## 2026-06-15 Bucket Surface Cleanup

Removed the debug-only trip contribution buckets from the Parking/PUDO default
and anchor bucket lists:

- `dc_pudo_trip_*`
- `dc_unpudo_trip_*`
- `dc_pre_unpudo_trip_*`

Trip-table context is still used for normal PUDO/UnPUDO classification and
event metadata; only the separate debug buckets were removed.

Renamed the pre-departure bucket names to make the start-anchor semantics
explicit:

- `dc_pre_unpark_*` -> `dc_pre_start_unpark_*`
- `dc_pre_unpudo_*` -> `dc_pre_start_unpudo_*`

Validation:

- `bazel test //wayve/ai/services/sampling:test_datasets_py_test --test_arg='--no-cov' --test_arg='-k' --test_arg='parking_pudo_dataset_includes_departure_and_failed_to_ca_buckets or parking_pudo_events_dataset_uses_single_unsplit_bucket or parking_pudo_event_metadata_detects_pudo_unpudo_and_disengagement or parking_pudo_event_metadata_detects_park_unpark_without_pudo_context'`
- `bazel test //wayve/ai/services/sampling:test_datasets_py_lint_ruff //wayve/ai/services/sampling:test_datasets_ty`

## 2026-06-15 Push, Flyte Runs, and Events Upload

Pushed branch `boris/pudo_generic_materialization` at commit:

- `ebba0f6cc026f61b7dcc9515e31895e709385702`

Published sampling image:

- `wayveacrprodflyte.azurecr.io/sampling:borisindel-tmp-build-0.1.125-boris-pudo_generic_materialization-59584`
- Digest: `sha256:06e9553f2acb43eba972de69b2cdf7bf04147fb2a5ae5df3e1e3d127225a445f`

Submitted Flyte runs:

- Default sample: https://flyte.data.wayve.ai/console/projects/ai-services-sampling/domains/production/executions/adks6526j2dgwkwjmp4l
- Anchors sample: https://flyte.data.wayve.ai/console/projects/ai-services-sampling/domains/production/executions/awh28g4wfrktnvkfg6w5
- Events filter/bucket only: https://flyte.data.wayve.ai/console/projects/ai-services-sampling/domains/production/executions/a52wxkjd7jfnn45q745k

Events run completed successfully:

- Output root: `abfss://datasets@wayveproddatasetflat.dfs.core.windows.net/sampling_materialised/parking_pudo/events/dev/parking_pudo_events_filtered_gen2_20260615__2026-06-15-10-33`
- Delta table stats: `{"wayve_corpus.all_data": [311925, 311926], "wayve_corpus.filtered_corpus": [147524], "teams__datasets.quarantine_runs": [5249], "teams__datasets.quarantine_segments": [270], "inferred__robotaxi.trip_events": [7241]}`

Overwrote Databricks table:

- Table: `hive_metastore.parking.parking_pudo_generic_events`
- Databricks run: https://adb-7835963732836817.17.azuredatabricks.net/?o=7835963732836817#job/776173921928020/run/353481801601838
- Task run: https://adb-7835963732836817.17.azuredatabricks.net/?o=7835963732836817#job/776173921928020/run/878403626354422
- Rows: `363138`

Event table breakdown:

| event_type | rows | av_rows | non_av_rows | trip_rows | hazard_rows |
|---|---:|---:|---:|---:|---:|
| park | 73026 | 1528 | 71498 | 0 | 2 |
| pudo | 106912 | 29449 | 77463 | 69047 | 91456 |

## 2026-06-15 Date Split and Event Platform Scope

Implemented the requested date split:

- `parking_pudo/default` and `parking_pudo/anchors` now load from `2025-08-01`.
- `parking_pudo/parking` starts from `2025-08-01`.
- `parking_pudo/pudo` still starts from `2025-12-01`.
- PUDO/UnPUDO buckets also carry a bucket-level `run_date_iso >= 2025-12-01`
  filter so the wider combined default/anchor load range does not backfill
  PUDO buckets before December.

Updated `parking_pudo/events`:

- Removed the Gen2-only platform filter by setting `platforms=[]`, which means
  no Spark platform predicate is applied in the generic materialisation
  partitioner.
- The events dataset now loads from `2025-08-01`.
- Event post-processing still emits park/unpark from the loaded range but skips
  PUDO/UnPUDO event rows before `2025-12-01`.

Validation:

- Passed `bazel test //wayve/ai/services/sampling:test_datasets_py_test --test_arg=--no-cov --test_arg=-k --test_arg='pudo_start_date or events_dataset_uses_single_unsplit_bucket or default_dataset_combines_parking_and_pudo_datasets or does_not_emit_pudo_before_cutoff_date'`
- Passed `bazel test //wayve/ai/services/sampling:test_datasets_py_lint_ruff //wayve/ai/services/sampling:test_datasets_ty`
- The broader `-k parking_pudo` subset still fails on the existing
  `test_overlapping_park_windows_are_assigned_to_first_event`; this was not
  caused by the date/platform change and was not fixed in this scoped update.
| unpark | 75546 | 7456 | 68090 | 0 | 0 |
| unpudo | 107654 | 37916 | 69738 | 67845 | 92392 |
