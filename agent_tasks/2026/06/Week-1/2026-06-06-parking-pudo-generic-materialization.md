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
- Replaced the inherited `datasets.parking` exclusion tuple with a local `parking_pudo` exclusion policy:
  - removed `exclude_stopped_segments`, which was stronger than Zak's CA-only remain-stopped rejection,
  - did not include run-level `exclude_autonomous_runs`,
  - removed the parking-specific first/last-index exclusion because Zak's `all_valid_masks2` omits `not_ends` for parking/PUDO buckets,
  - removed the global `exclude_geofenced` bucket exclusion and kept office-geofence handling in PUDO context classification only.
- Kept office-geofence hazards from creating PUDO/UnPUDO context by continuing to ignore hazard evidence inside configured office geofences before hazard dilation.
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

## 2026-06-07 BC-Name Materialisation Reruns

- Published a fresh sampling image from the local `boris/pudo_generic_materialization` checkout after the BC-style bucket-name commit.
- The local image build included the existing experimental partition change:
  - `MAX_NUM_RUN_IDS_PER_PARTITION = 700`
  - File: `/workspace/WayveCode/wayve/ai/services/sampling/common/spark_tasks.py`
- Image digest:
  - `wayveacrprodflyte.azurecr.io/sampling@sha256:6cdf613116fd4ea5af9e44988a6f449c35dd8d05e798536f3710f6198b8d1123`
- Started `filter_and_bucket_stage` for `parking_pudo/default`.
  - Job name: `parking_pudo_bc_names_700`
  - Flyte execution: `a6dnzj55wwfpz6552wws`
  - Console: https://flyte.data.wayve.ai/console/projects/ai-services-sampling/domains/production/executions/a6dnzj55wwfpz6552wws
- Started `filter_and_bucket_stage` for `parking_pudo/anchors`.
  - Job name: `parking_pudo_anchors_bc_names_700`
  - Flyte execution: `allr4wnws66dqdrgsgxm`
  - Console: https://flyte.data.wayve.ai/console/projects/ai-services-sampling/domains/production/executions/allr4wnws66dqdrgsgxm
- Submitted both executions with an explicit image digest to bypass ACR tag discovery.
- Terminated both filter-only executions after deciding to run the complete `sample` workflow instead:
  - `a6dnzj55wwfpz6552wws`
  - `allr4wnws66dqdrgsgxm`
- Submitted full `sample` workflow for `parking_pudo/default`, which runs filter/bucket, balance, compare, and distributions.
  - Job name: `parking_pudo_bc_names_700_full`
  - Flyte execution: `altdzx8gtggm4dpfdr97`
  - Console: https://flyte.data.wayve.ai/console/projects/ai-services-sampling/domains/production/executions/altdzx8gtggm4dpfdr97
- Submitted full `sample` workflow for `parking_pudo/anchors`, which runs filter/bucket, balance, compare, and distributions.
  - Job name: `parking_pudo_anchors_bc_names_700_full`
  - Flyte execution: `ad59w7rlsf2x8r269755`
  - Console: https://flyte.data.wayve.ai/console/projects/ai-services-sampling/domains/production/executions/ad59w7rlsf2x8r269755
- Local `flytectl` is not installed. Attempted the local `obs-flyte-execution` skill, but its Bazel wrapper depends on an older robotics Flyte package path missing in this checkout, so status validation should use the console links or another Flyte CLI environment.
- After submission, origin advanced by one `py-format` commit that only reorders two imports in `parking_pudo/anchors/dataset.py`; no runtime behavior change from the submitted image.

## 2026-06-07 Full Sample Workflow Results

- Both complete `sample` workflows finished successfully.
- `parking_pudo/default`:
  - Flyte execution: `altdzx8gtggm4dpfdr97`
  - Console: https://flyte.data.wayve.ai/console/projects/ai-services-sampling/domains/production/executions/altdzx8gtggm4dpfdr97
  - Output root: `abfss://datasets@wayveproddatasetflat.dfs.core.windows.net/sampling_materialised/parking_pudo/default/dev/parking_pudo_bc_names_700_full__2026-06-07-09-22`
  - Runtime: about `1:59`.
  - Train summary: `130` buckets, `67,773,809` samples.
  - Family totals:
    - `dc`: `40` buckets, `54,889,797` samples.
    - `pre_ca`: `30` buckets, `1,674,744` samples.
    - `ca`: `60` buckets, `11,209,268` samples.
  - Country totals:
    - `usa`: `29` buckets, `26,891,979` samples.
    - `uk`: `29` buckets, `19,686,523` samples.
    - `deu`: `26` buckets, `15,018,403` samples.
    - `jpn`: `26` buckets, `3,517,037` samples.
    - `global`: `20` buckets, `2,659,867` samples.
  - No zero-sample materialized train buckets; smallest train bucket is `pre_ca_failed_to_pudo_jpn` with `23` samples.
  - Validation summary: `124` buckets, `10,212,496` samples.
  - Validation family totals:
    - `dc`: `40` buckets, `8,372,056` samples.
    - `pre_ca`: `28` buckets, `243,237` samples.
    - `ca`: `56` buckets, `1,597,203` samples.
  - No zero-sample materialized validation buckets; smallest validation bucket is `pre_ca_failed_to_park_deu` with `23` samples.
- `parking_pudo/anchors`:
  - Flyte execution: `ad59w7rlsf2x8r269755`
  - Console: https://flyte.data.wayve.ai/console/projects/ai-services-sampling/domains/production/executions/ad59w7rlsf2x8r269755
  - Output root: `abfss://datasets@wayveproddatasetflat.dfs.core.windows.net/sampling_materialised/parking_pudo/anchors/dev/parking_pudo_anchors_bc_names_700_full__2026-06-07-09-19`
  - Runtime: about `1:54`.
  - Train summary: `130` buckets, `782,562` samples.
  - Family totals:
    - `dc`: `40` buckets, `484,241` samples.
    - `pre_ca`: `30` buckets, `71,392` samples.
    - `ca`: `60` buckets, `226,929` samples.
  - Country totals:
    - `usa`: `29` buckets, `338,672` samples.
    - `uk`: `29` buckets, `249,506` samples.
    - `deu`: `26` buckets, `137,729` samples.
    - `jpn`: `26` buckets, `33,985` samples.
    - `global`: `20` buckets, `22,670` samples.
  - No zero-sample materialized train buckets; smallest train bucket is `pre_ca_failed_to_pudo_jpn` with `1` sample.
  - Validation summary: `124` buckets, `115,107` samples.
  - Validation family totals:
    - `dc`: `40` buckets, `72,470` samples.
    - `pre_ca`: `28` buckets, `10,351` samples.
    - `ca`: `56` buckets, `32,286` samples.
  - No zero-sample materialized validation buckets; smallest validation bucket is `pre_ca_failed_to_park_deu` with `1` sample.
- Root summaries for both runs show:
  - `start_date: 2025-08-01`
  - `end_date: 2026-06-06`
  - `partition_source_type: binary_success_index_table`
  - binary source: `driving/stable/3.0.58`
- Post-balance workflow nodes:
  - Compare completed, but reported `No comparison results to aggregate`, expected for a new dataset with no stable comparison baseline.
  - Distributions completed, but `get_train_bucket_combinations` returned an empty list, so there is no saved `distributions/` tree for these runs.
- The local checkout is still dirty only because of the experimental generic framework constant used for this run:
  - `wayve/ai/services/sampling/common/spark_tasks.py`
  - `MAX_NUM_RUN_IDS_PER_PARTITION = 700`

## 2026-06-07 UK PUDO Event Table vs Anchor Check

- Compared event-table UK PUDO rows from `hive_metastore.parking.pudo_unpudo_unpark_events_gear_fix` using the dedupe query:
  - `event_type = 'pudo'`
  - `ISO_country_code = 'GBR'`
  - `ROW_NUMBER() OVER (PARTITION BY timestamp_unixus ORDER BY event_startOrEnd_timestampunixus DESC) = 1`
- Event table result: `51,355` unique timestamps.
- Generic anchors `dc_pudo_uk`:
  - train: `10,676`
  - validation: `2,252`
  - total: `12,928`
- Exact timestamp overlap between event table and anchors: `7,523`.
- Same-run tolerance overlap:
  - within `0.5s`: `8,675`
  - within `1s`: `9,424`
  - within `30s`: `11,534`
- `30,932` event-table rows are from runs with no `dc_pudo_uk` anchors at all.
- Example exact timestamp mismatch but same-run anchor exists:
  - event: `fme20012/2025-12-04--10-05-41--gen2-av-53df2e1f-0016-414d-85a9-70a9a75dff35`, `1764848211783310`
  - nearest anchor: `1764848211483310`, `-0.300s`
- Example missing run from the anchor bucket:
  - event: `fme20018/2025-12-03--06-50-52--gen2-av-bd51a1cf-5dea-43a9-9b18-380446dbe9ef`, `1764745076683307`
  - no `dc_pudo_uk` anchor in that run.

## 2026-06-07 Zak-Style Exclusion Policy Update

- Rechecked `origin/zmurez/pudo` before changing the generic materialisation filters:
  - Zak's PUDO/park buckets call `get_parking_indices(..., all_valid_masks2, ...)`.
  - `all_valid_masks2` includes `autonomous`, `autonomous_engage`, `bad_park`, `bad_park1`, `bad_stop`, `has_video`, and `dropped_frames`.
  - It does not include the sampler's global `geofence`, `reverse`, `uturn`, or `not_ends` masks.
  - PUDO/park separation still uses parking location / hazard logic: office-geofence hazards do not create PUDO context.
  - Zak's intervention speed filter is CA-specific via `remove_remain_stopped=True`, not a global stopped-segment exclusion for all parking/PUDO buckets.
- Updated `parking_pudo/common.py` to stop importing `PARKING_EXCLUSIONS_DC_CA` / `PARKING_EXCLUSIONS_PRE_CA` from `datasets.parking.common`.
- Added local `PARKING_PUDO_BASE_EXCLUSIONS`, `PARKING_PUDO_EVENT_EXCLUSIONS`, and `PARKING_PUDO_PRE_CA_EXCLUSIONS`.
- Removed these inherited filters from Parking/PUDO buckets:
  - global `exclude_stopped_segments`,
  - run-level `exclude_autonomous_runs`,
  - parking-specific `exclude_first_or_last_indices_parking`,
  - global `exclude_geofenced`.
- Kept per-frame `exclude_autonomous` for DC/post-CA buckets, and left pre-CA without `exclude_autonomous` because pre-CA is expected to be AV before handover.
- Kept the existing `signals.py` office-geofence hazard cleanup, so geofenced hazards are ignored before PUDO/UnPUDO classification without dropping all geofenced frames globally.
- Fixed an anchor dataset mismatch found by the focused test run: `parking_pudo/anchors` now uses the same country suffix set as `parking_pudo/default` instead of only UK/USA.
- Verification:
  - `bazel test //wayve/ai/services/sampling:test_datasets_py_test`
  - `bazel test //wayve/ai/services/sampling:test_datasets_py_lint_ruff`
  - `bazel test //wayve/ai/services/sampling:test_datasets_py_lint_flake8`
  - `bazel test //wayve/ai/services/sampling:test_datasets_ty`

## 2026-06-07 Zak-Style Exclusion Full Reruns

- Committed and pushed the exclusion update:
  - commit: `39f906b30c2d`
  - branch: `boris/pudo_generic_materialization`
- Initial default `sample` submission without an explicit image failed before execution creation because ACR tag listing required authentication.
- Ran `make acr-login`, then published a fresh sampling image from the pushed branch:
  - `wayveacrprodflyte.azurecr.io/sampling@sha256:696f65cfde1d549bace850cd416eb3822543b44835b13136fd7bba6ac4b09928`
- Submitted full `sample` workflow for `parking_pudo/default`:
  - job name: `parking_pudo_zak_exclusions_default_full`
  - Flyte execution: `arjghbl5t57t24hmk8nb`
  - Console: https://flyte.data.wayve.ai/console/projects/ai-services-sampling/domains/production/executions/arjghbl5t57t24hmk8nb
- Submitted full `sample` workflow for `parking_pudo/anchors`:
  - job name: `parking_pudo_zak_exclusions_anchors_full`
  - Flyte execution: `arv78r4gprwflcv2wsdv`
  - Console: https://flyte.data.wayve.ai/console/projects/ai-services-sampling/domains/production/executions/arv78r4gprwflcv2wsdv
- Local `flytectl` is not installed in this shell, so follow-up status should be checked from the console or another Flyte CLI environment.

## 2026-06-07 Bucket Name Refactor

- Removed the `PARKING_PUDO_*_BUCKET_NAMES` conversion maps from `parking_pudo/common.py`.
- Updated default and anchor filter dictionaries to use the final emitted bucket stem directly as the key, for example `dc_pudo`, `pre_ca_unpudo`, and `ca_failed_to_pudo_short`.
- Updated `parking_pudo/default/dataset.py` and `parking_pudo/anchors/dataset.py` to append the country suffix directly to each filter key.
- This is a readability refactor only; emitted bucket names remain unchanged.
- Verification:
  - `git diff --check`
  - `bazel test //wayve/ai/services/sampling:test_datasets_py_test //wayve/ai/services/sampling:test_datasets_py_lint_ruff //wayve/ai/services/sampling:test_datasets_py_lint_flake8 //wayve/ai/services/sampling:test_datasets_ty`

## 2026-06-07 Zak-Style Rerun Failure and Partition Fix

- Both reruns failed in the same place:
  - `parking_pudo/default`: Flyte `arjghbl5t57t24hmk8nb`
  - `parking_pudo/anchors`: Flyte `arv78r4gprwflcv2wsdv`
- Flyte details hit the known `unsupported literal scalar type *core.Scalar_Error` renderer issue, but `-o yaml` exposed the actual traceback:
  - `ValueError: Partition 0 requests 200.0 GiB (num_rows=49044708) which exceeds 50% of worker memory (179.5 GiB)`.
- Root cause:
  - The partition planner chunked by `MAX_NUM_RUN_IDS_PER_PARTITION = 1000`.
  - The Ray stage reserves memory by row count, so a dense date/platform group can create an oversized task even with a normal run-id count.
- Code fix:
  - Added `MAX_NUM_ROWS_PER_PARTITION = 40_000_000`.
  - Updated explicit-run-id and Spark-planned partitioning to respect both the run-id cap and the cumulative row-count cap.
  - Runs remain atomic; if a single run exceeds the cap, the Ray memory guard remains the final failure signal.
- Verification:
  - `git diff --check`
  - `bazel test //wayve/ai/services/sampling:test_spark_tasks_py_test //wayve/ai/services/sampling:test_spark_tasks_py_lint_ruff //wayve/ai/services/sampling:test_spark_tasks_py_lint_flake8 //wayve/ai/services/sampling:test_spark_tasks_ty //wayve/ai/services/sampling:test_datasets_py_test //wayve/ai/services/sampling:test_datasets_py_lint_ruff //wayve/ai/services/sampling:test_datasets_py_lint_flake8 //wayve/ai/services/sampling:test_datasets_ty`
