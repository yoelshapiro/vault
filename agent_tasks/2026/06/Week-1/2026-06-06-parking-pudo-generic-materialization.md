# 2026-06-06 Parking PUDO Generic Materialization

- Topic: Add Parking/PUDO/Unpark/UnPUDO buckets using the official generic materialisation framework.
- Labels: parking, pudo, unpudo, unpark, materialization, generic-materialisation, buckets.
- Branch: `boris/pudo_generic_materialization`.
- PR: `#117075`.
- Change type: Code implementation.
- Areas:
  - `/workspace/materialization/wayve/ai/services/sampling/datasets/parking_pudo`
  - `/workspace/materialization/wayve/ai/services/sampling/datasets/store.py`
  - `/workspace/materialization/wayve/ai/services/sampling/BUILD`
  - `/workspace/materialization/wayve/ai/services/sampling/test/datasets/parking_pudo`

## Changes

- Added a new `parking_pudo/default` dataset under `wayve/ai/services/sampling/datasets/parking_pudo`.
- Implemented per-run pandas filters that derive events directly from `wayve_corpus.all_data`, without relying on parking notebooks or the old event table.
- Added programmable gear smoothing for short gear segments, with the requested "replace with previous gear" behavior and corrected frame-covered duration accounting.
- Added Zak-style hazard cleanup before PUDO/UnPUDO splitting:
  - hazard approach above 5 mph becomes a side-dependent directional indicator,
  - hazard departure after movement becomes off,
  - hazard evidence inside the standard geofence exclusion list is ignored.
- Added country-split buckets named with the new terminology:
  - `dc_park_*`
  - `dc_pudo_*`
  - `dc_unpark_*`
  - `dc_unpudo_*`
  - `dc_pre_unpark_*`
  - `dc_pre_unpudo_*`
  - `dc_parking_gear_change_*`
  - `dc_pudo_gear_change_*`
  - `pre_ca_parking_*`
  - `pre_ca_pudo_*`
  - `ca_parking_short/long_*`
  - `ca_pudo_short/long_*`
  - `pre_ca_unpark_*`
  - `pre_ca_unpudo_*`
  - `ca_unpark_short/long_*`
  - `ca_unpudo_short/long_*`
  - `pre_ca_failed_to_park_*`
  - `pre_ca_failed_to_pudo_*`
  - `pre_ca_failed_to_unpark_*`
  - `pre_ca_failed_to_unpudo_*`
  - `ca_failed_to_park_short/long_*`
  - `ca_failed_to_pudo_short/long_*`
  - `ca_failed_to_unpark_short/long_*`
  - `ca_failed_to_unpudo_short/long_*`
- Kept the inherited parking/driving `exclude_geofenced` filter in every bucket, instead of creating explicit office-geofence buckets.
- Removed the incorrect office-geofence suffix buckets for `london_office`, `millbrook`, `mountain_view_office`, `sunnyvale_office`, `tokyo_trc_office`, and `yokohama_office`.
- Split `unpark` from `unpudo` using hazard evidence on the preceding parked segment and stopped departure tail up to the movement anchor.
- Implemented `pre_unpark` / `pre_unpudo` as the 0.9s pre-start window equivalent to Zak's `start_gear_change_*` bucket, but using the requested names.
- Implemented parking and PUDO CA filters as separate AV-to-DC intervention buckets near a smoothed gear change, including short/long post-CA windows and the speed filter that removes interventions where the vehicle is stopped at handover and still stopped 1s later.
- Added separate unpark and UnPUDO CA buckets around first-movement departure anchors:
  - `unpark_*` CA uses non-hazard departure context.
  - `unpudo_*` CA uses the same parked/pre-departure hazard scan as the `unpudo` event bucket, so hazard can be minutes before the intervention and still classify the departure correctly.
  - Both retain the same remain-stopped 1s speed filter.
- Added failed-to CA buckets for `failed_to_park`, `failed_to_pudo`, `failed_to_unpark`, and `failed_to_unpudo`:
  - These select AV-to-DC interventions by `inferred__intervention__what`.
  - They intentionally do not require a nearby gear change.
  - They still apply the remain-stopped 1s speed filter.
- Split intervention selector logic into `parking_pudo/intervention_filters.py` so `filters.py` stays under the line-count guideline and remains focused on event/gear masks.
- Removed the generic `event_type="all"` gear-change/CA path; selectors now explicitly use parking or PUDO context, with PUDO context using cleaned hazards dilated by 30s.
- Registered the dataset in the services/sampling store and BUILD target.
- Added explanatory docstrings for the Parking/PUDO selectors and signal helpers, and split internal signal derivation helpers into `signals.py` so `filters.py` stays focused on public masks.
- Reviewed `_signals` and `_parking_segments` against Zak's loader/sampler path:
  - Kept the shared signal path aligned on cleaned gear before hazard cleanup, hazard cleanup before PUDO splitting, and office/proving-ground hazard exclusion before dilation.
  - Added a `park_start - 1` context helper so park/PUDO and unpark/UnPUDO classification matches Zak's `pred_stop_type[index_of_park - 1]` convention.
  - Made overlapping park/PUDO approach windows assign frames to the first park event before applying the park/PUDO split, matching Zak's `make_park_masks` first-assignment behavior.
  - Left the configurable 2s "short gear segment -> previous gear" rule as an intentional difference from Zak's older gear cleanup, because it matches the requested smoothing behavior for this migration.
- Added regression coverage for the frame-before-park context, overlapping parking-window assignment, departure-context unpark/UnPUDO CA, failed-to label CA selection without nearby gear changes, and remain-stopped rejection for failed-to CA.
- Added `parking_pudo/anchors`, an anchor-only companion dataset for event analysis:
  - It mirrors every `parking_pudo/default` bucket name and country split.
  - It reuses the same detection, hazard cleanup, geofence exclusion, context split, failed-to label filtering, and remain-stopped speed filtering as the window buckets.
  - It selects only the bucket anchor frame:
    - park/PUDO at the smoothed gear-to-park frame,
    - unpark/UnPUDO and pre-departure at the first movement frame after leaving park,
    - gear-change buckets at the smoothed gear-change frame,
    - pre-CA, short-CA, long-CA, and failed-to CA buckets at the AV-to-DC intervention frame.
  - Anchor-only filters now require that the corresponding expanded bucket window would contain at least one frame, so the table is not a looser raw-event list.
  - Registered the dataset as `parking_pudo/anchors` and documented the `filter_and_bucket_stage` command in the README.

## Verification

- Verified there are no notebook edits in the branch.
- Verified the new dataset code has no leftover `zak`, `start_gear_change`, or old `unparking_*` bucket naming.
- Ran `git diff --check`.
- Ran `bazel test //wayve/ai/services/sampling:test_datasets`.
- Ran `bazel test //wayve/ai/services/sampling:test_datasets_py_test --test_arg=-k --test_arg=parking_pudo`; all 21 selected parking_pudo tests passed, but the filtered run fails the target-level coverage threshold because most tests are intentionally deselected.
- Ran `bazel test //wayve/ai/services/sampling:test_datasets_py_lint_ruff //wayve/ai/services/sampling:test_datasets_py_lint_flake8 //wayve/ai/services/sampling:test_datasets_ty`.
- Ran `bazel test //wayve/ai/services/sampling:test_datasets_py_test`.
- Re-ran `bazel test //wayve/ai/services/sampling:test_datasets`; aggregate target passed from cache after the full pytest run.
- For the anchor-only update, re-ran `git diff --check` and `bazel test //wayve/ai/services/sampling:test_datasets`; all four lint/type/pytest targets passed.

## 2026-06-06 Flyte Materialisation Run

- Published the sampling workflow image from `boris/pudo_generic_materialization`.
- Image tag: `wayveacrprodflyte.azurecr.io/sampling:borisindel-tmp-build-0.1.123-boris-pudo_generic_materialization-59584`.
- Image digest: `sha256:688cd9cd18630e920b07c6fbdd42cfeea3009fc7741dc3f9c7849c0c2950bd2c`.
- Started `filter_and_bucket_stage` for `parking_pudo/default`.
- Job name: `parking_pudo_generic_materialization`.
- Flyte execution: `a4x7v7qkfsg4hk9b52sr`.
- Console: https://flyte.data.wayve.ai/console/projects/ai-services-sampling/domains/production/executions/a4x7v7qkfsg4hk9b52sr
- Command:

```bash
bazel run //wayve/ai/services/sampling:workflow -- remote run filter_and_bucket_stage \
  --dataset_name parking_pudo/default \
  --job_name parking_pudo_generic_materialization
```

- Local status query note: `flytectl` is not installed in the current shell, so status should be checked from the Flyte console or another Flyte CLI environment.

## 2026-06-06 Flyte Rerun With 700 Run-Id Partitions

- Changed local generic sampling partition constant for an experiment:
  - `MAX_NUM_RUN_IDS_PER_PARTITION = 1000 -> 700`
  - File: `/workspace/WayveCode/wayve/ai/services/sampling/common/spark_tasks.py`
  - This keeps full run IDs intact; it only reduces the number of run IDs grouped into each Ray task.
- Published a fresh sampling image from the local branch after the constant change.
- Image tag: `wayveacrprodflyte.azurecr.io/sampling:borisindel-tmp-build-0.1.123-boris-pudo_generic_materialization-59584`.
- Image digest: `sha256:f310b139ef3223662ecd5938e0bc5e24130d139612da1e577b79f26cc1f6dba9`.
- Explicit `--image` submission was rejected because the branch image tag exceeded the Kubernetes label value length limit.
- Started the normal remote run without `--image`; the runner resolved the branch tag to the fresh digest above.
- Job name: `parking_pudo_generic_materialization_700`.
- Flyte execution: `a2pr4q8qqvwr45f65mmj`.
- Console: https://flyte.data.wayve.ai/console/projects/ai-services-sampling/domains/production/executions/a2pr4q8qqvwr45f65mmj
- Initial status query immediately after creation showed the execution exists but had not reported a phase yet.

## 2026-06-07 Output Validation For 700 Run

- Flyte execution `a2pr4q8qqvwr45f65mmj` finished successfully.
- Output path:
  - `abfss://datasets@wayveproddatasetflat.dfs.core.windows.net/sampling_materialised/parking_pudo/default/dev/parking_pudo_generic_materialization_700__2026-06-06-21-40`
- This run used `filter_and_bucket_stage`, so it produced Ray-stage `buckets/` output only.
- There is no final `dataset/` tree and no generated summary YAML:
  - `summary.yaml` returned `BlobNotFound`.
  - `dataset/dataset_split=train/summary.yaml` returned `BlobNotFound`.
  - `dataset/` returned `PathNotFound`.
- Azure file inventory for `buckets/`:
  - `33,401` parquet files.
  - `661,027,442` bytes total.
  - `254` split/bucket-country combinations with at least one file.
  - Train: `130` bucket-country combinations, `20,804` files, `563,041,969` bytes.
  - Validation: `124` bucket-country combinations, `12,597` files, `97,985,473` bytes.
- Configured `parking_pudo/default` has `160` bucket-country names per split.
- Missing output buckets are zero-sample buckets for that split; all missing buckets are failed-to intervention variants.
- `failed_to_unpark_{pre_ca,ca_short,ca_long}_*` produced no output in either split.
- Databricks SQL direct parquet validation was attempted but the session lacks file SELECT permission on the ADLS path:
  - `INSUFFICIENT_PERMISSIONS: User does not have permission SELECT on any file`.

## 2026-06-07 Balance Stage From Existing Buckets

- Reused the existing `filter_and_bucket_stage` output instead of recomputing filters.
- Input/output run root:
  - `abfss://datasets@wayveproddatasetflat.dfs.core.windows.net/sampling_materialised/parking_pudo/default/dev/parking_pudo_generic_materialization_700__2026-06-06-21-40`
- Workflow: `balance_stage`.
- Dataset: `parking_pudo/default`.
- Image override:
  - `wayveacrprodflyte.azurecr.io/sampling@sha256:f310b139ef3223662ecd5938e0bc5e24130d139612da1e577b79f26cc1f6dba9`
- First submission without an explicit image failed before execution creation because ACR tag listing required authentication.
- Retried with the explicit image digest to bypass tag discovery.
- Flyte execution: `axdbhpm6fpnvqqbqcdpx`.
- Console: https://flyte.data.wayve.ai/console/projects/ai-services-sampling/domains/production/executions/axdbhpm6fpnvqqbqcdpx
- Initial `flytectl` status query showed the execution exists but had not reported a phase yet.

## 2026-06-07 BC-Style Bucket Naming Update

- Updated the public Parking/PUDO bucket names to follow `bc/default/dataset.py` conventions:
  - DC windows use `dc_*`.
  - Pre-CA windows use `pre_ca_*`.
  - Scenario-specific CA windows use `ca_<scenario>_short/long_*`, matching patterns like `ca_diversion_short_*`.
- Kept the existing filter keys and selector names as implementation details; only the emitted bucket names changed.
- Applied the same display-name maps to `parking_pudo/default` and `parking_pudo/anchors` so anchor buckets still mirror default bucket names exactly.
- Updated the README and name-regression assertions for the new public names.
- Verification:
  - `git diff --check`
  - `bazel test //wayve/ai/services/sampling:test_datasets --test_output=errors`
  - A filtered parking-pudo pytest run selected 29 tests and all passed, but the generated pytest target failed coverage because most tests were deselected; the full `test_datasets` target passed.
