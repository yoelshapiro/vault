# 2026-06-08 Parking PUDO Anchor Gap Debug

- Branch: `boris/pudo_generic_materialization`
- Area: `wayve/ai/services/sampling/datasets/parking_pudo`
- Materialization root: `abfss://datasets@wayveproddatasetflat.dfs.core.windows.net/sampling_materialised/parking_pudo/anchors/boris-pudo-generic-materialization/2026-06-07-1`

## Question

Investigate why `dc_pudo_uk` generic materialization anchors are much lower than the event notebook table:

- Event table query: `hive_metastore.parking.pudo_unpudo_unpark_events_gear_fix`, `event_type='pudo'`, `ISO_country_code='GBR'`, dedup by `timestamp_unixus`.
- Generic anchors: `dataset_bucket='dc_pudo_uk'`.

## Findings

- Event rows: `51,355`.
- Local generic anchor rows: `13,219`.
- Exact missing rows: `43,733`.
- Missing rows whose run has no `dc_pudo_uk` generic anchor: `30,827`.
- Missing rows whose run has another `dc_pudo_uk` anchor but not the exact timestamp: `12,906`.

Sampled no-anchor-run misses:

- Many are still filtered by active generic exclusions:
  - `exclude_low_steering_bias_confidence`: 11 of 15 sampled.
  - `select_allowed_run_tags`: 2 of 15 sampled due tags like `RUN_TAG_V2_CANARY_SOFTWARE` / `RUN_TAG_V2_SYSTEM_EVALUATION`.
  - One sample had short-distance metadata.
- Some quality-passing no-anchor samples are not classified as PUDO by generic logic:
  - `colorado/2025-12-09--13-37-22--gen2-av-0af30585-f8b7-424a-ae55-08f23740f085`, `1765288974483310`.
  - Generic finds a park segment near the event (`start_ts=1765288972383309`, about `-2.1s`) but `context_hazard=False`, so it becomes `dc_park`, not `dc_pudo`.
  - `fme20016/2025-12-11--09-26-11--gen2-av-f087277f-6008-4e5c-9f92-b0305cfa42d9`, `1765445371833305`.
  - Generic finds park segments, but all have `context_hazard=False`, so no `dc_pudo` anchor.

Sampled same-run-anchor misses:

- Most pass the obvious active data-quality filters.
- Several are near misses where the generic anchor is slightly earlier than the event-table timestamp:
  - `fme20012/2025-12-04--10-05-41...`: generic anchor `-0.300s`.
  - `fme20007/2025-12-07--15-11-02...`: generic anchor `-0.400s`.
  - `colorado/2026-01-11--08-02-37...`: generic anchor `-0.050s`, `-1.000s`, `-0.400s` for sampled rows.
  - `fme20014/2026-01-11--11-28-19...`: generic anchor `-0.100s`.

## Interpretation

The count gap is not one bug:

- Active generic filters still remove many event-table rows, especially `exclude_low_steering_bias_confidence` and strict allowed-run-tags.
- Exact timestamp comparison overstates the mismatch because many anchors are within roughly `0.05-2s`.
- Some true logic differences remain: event notebook PUDO rows can have hazards in the video, but generic PUDO classification only checks the cleaned/dilated hazard at `park_start - 1`. If hazard evidence is not present after cleanup/geofence handling at that context frame, the same stop becomes `dc_park`, not `dc_pudo`.

## Temporary Artifacts

- `/tmp/event_table_dc_pudo_uk_keys.csv`
- `/tmp/parking_pudo_anchor_dc_pudo_uk_parts/`
- `/tmp/missing_no_anchor_run_30.csv`
- `/tmp/missing_same_run_anchor_30.csv`
- `/tmp/missing_dc_pudo_uk_reasons.csv`
- `/tmp/debug_pudo_anchor_logic_only.py`
- `/tmp/nearest_dc_pudo_uk_anchors.py`

## 2026-06-08 Relaxed Filter Rerun

- Removed two more active generic filters from Parking/PUDO buckets:
  - `select_allowed_run_tags`
  - `exclude_low_steering_bias_confidence`
- Kept both filters in `PARKING_PUDO_DISABLED_DATA_QUALITY_EXCLUSIONS` with the other stricter future-variant filters.
- Updated the README to document that these filters are intentionally disabled for the current Zak-parity dataset.
- Verification:
  - `git diff --check`
  - `bazel test //wayve/ai/services/sampling:test_datasets_py_test --test_arg=-k=parking_pudo --test_arg=--no-cov`
- Committed and pushed:
  - commit: `a0fc5caa4984`
  - branch: `boris/pudo_generic_materialization`
- Published sampling image:
  - `wayveacrprodflyte.azurecr.io/sampling@sha256:f8171ace3aa8247978824f8b19a9b6f843ad5ee838e4041c4d2cdd2d17982040`
- Submitted full branch-release `sample` workflows:
  - `parking_pudo/default`
    - job name: `parking_pudo_relaxed_filters_default`
    - branch version: `2026-06-08-1`
    - Flyte execution: `a7v5p9b8vwfpdc74b8nx`
    - Console: https://flyte.data.wayve.ai/console/projects/ai-services-sampling/domains/production/executions/a7v5p9b8vwfpdc74b8nx
  - `parking_pudo/anchors`
    - job name: `parking_pudo_relaxed_filters_anchors`
    - branch version: `2026-06-08-1`
    - Flyte execution: `ashhhp9w5wlvcg2gv9r8`
    - Console: https://flyte.data.wayve.ai/console/projects/ai-services-sampling/domains/production/executions/ashhhp9w5wlvcg2gv9r8

## Additional Missing-Anchor Root Causes

- The previously sampled quality-passing no-anchor examples are explained by PUDO hazard geofence suppression, not by the removed data-quality filters:
  - `colorado/2025-12-09--13-37-22--gen2-av-0af30585-f8b7-424a-ae55-08f23740f085`, timestamp `1765288974483310`.
  - `fme20016/2025-12-11--09-26-11--gen2-av-f087277f-6008-4e5c-9f92-b0305cfa42d9`, timestamp `1765445371833305`.
  - Both have raw/cleaned hazard at the event frame, but `excluded_geofence_mask=True`, so `pudo_hazard=False`; generic classifies the nearby stop as `dc_park`, not `dc_pudo`.
  - Both are around latitude `52.56245`, longitude `-1.45825`, consistent with a proving-ground excluded geofence.
- Exact timestamp comparison still overstates the gap:
  - In the sampled same-run-anchor set, many generic anchors are within `0.05s` to `2s` of the event-table timestamp.
  - Example: `fme20012/2025-12-04--10-05-41...`, event timestamp `1764848211783310`, generic anchor `1764848211483310` (`-0.3s`).
- A separate real logic difference exists for event-table rows whose generic gear-to-park segment has no materializable approach window:
  - Example: `fme20007/2026-01-10--15-55-57--gen2-av-532346ee-0665-46a6-8f3e-093807a3236e`, event timestamp `1768060602233306`.
  - Generic detects a PUDO park segment at `1768060558183310` (`-44.05s`) with hazard context and DC state, but `_parking_window(...)` has `0` frames because the vehicle is already stopped around the gear-to-park anchor.
  - Anchor-only selection intentionally requires the corresponding expanded bucket window to be non-empty, so this segment is not emitted as `dc_pudo_uk`.
  - The same run has another emitted PUDO anchor at `1768061164683312`, which is why the nearest-anchor comparison showed a `+562.45s` nearest anchor for the event-table timestamp.

## 2026-06-08 Reintroduced Global Geofence Exclusion

- Decision: bring back global `exclude_geofenced` for the generic Parking/PUDO dataset.
- Rationale: the user observed that some materialized anchors were still inside excluded geofence areas; the desired behavior is no emitted samples from those geofences, not just hazard suppression.
- Code change:
  - Added `exclude_geofenced` to `PARKING_PUDO_BASE_EXCLUSIONS`.
  - This applies to every default and anchor bucket because all bucket families derive from the base exclusions.
  - Kept the existing `signals.py` geofence hazard suppression, so geofence remains both a global sample exclusion and a PUDO-context guard.
  - Updated README and regression assertions to require `exclude_geofenced` in every `parking_pudo/default` and `parking_pudo/anchors` bucket.
- Verification:
  - `git diff --check`
  - `bazel test //wayve/ai/services/sampling:test_datasets_py_test --test_arg=-k=parking_pudo --test_arg=--no-cov`

## 2026-06-08 Narrowed Out-of-Scope Exclusion

- Decision: keep excluding out-of-scope intervention labels, except for `diversion` and `lens_obscured`.
- Rationale: the intended policy was to stop dropping diversion/lens-obscured parking/PUDO examples, not to disable every out-of-scope intervention label.
- Code change:
  - Added `exclude_out_of_scope_except_diversion_and_lens_obscured`.
  - The active filter excludes `OUT_OF_SCOPE_INTERVENTION_WHATS` minus `diversion` and `lens_obscured`.
  - `end_of_run`, `emergency_service`, `accidental_avso_intervention`, `uncommanded_disengagement`, `uncategorised`, and `unprompted_manoeuvre` remain excluded.
  - Kept `exclude_diversion_and_lens_obscured_interventions` disabled.
  - Updated README and regression assertions to encode the exact allowed/excluded out-of-scope labels.
- Verification:
  - `git diff --check`
  - `bazel test //wayve/ai/services/sampling:test_datasets_py_test --test_arg=-k=parking_pudo --test_arg=--no-cov`
  - `bazel test //wayve/ai/services/sampling:test_datasets_py_lint_ruff`

## 2026-06-08 Full PUDO/UnPUDO Event-vs-Anchor Recheck

- Compared deduped `hive_metastore.parking.pudo_unpudo_unpark_events_gear_fix` PUDO/UnPUDO rows against the completed `parking_pudo/anchors` root:
  - `abfss://datasets@wayveproddatasetflat.dfs.core.windows.net/sampling_materialised/parking_pudo/anchors/boris-pudo-generic-materialization/2026-06-08-1`
  - This root was produced from commit `a0fc5caa4984`, before the later global geofence reintroduction and narrowed out-of-scope filter changes.
- Exact `(bucket, run_id, timestamp_unixus)` matching shows the event table is larger in UK/USA PUDO and UnPUDO, but exact matching is not enough:
  - `dc_pudo_uk`: event `51355`, anchors `23932`, exact-missing event rows `36445`.
  - `dc_pudo_usa`: event `40293`, anchors `23141`, exact-missing event rows `27242`.
  - `dc_unpudo_uk`: event `48646`, anchors `23610`, exact-missing event rows `48643`.
  - `dc_unpudo_usa`: event `37129`, anchors `21230`, exact-missing event rows `37126`.
- Timestamp-definition mismatch explains part of the apparent gap:
  - For `dc_unpudo_uk`, only `3` exact event timestamp matches exist, but `18501` event rows have a same-run anchor within `1s`.
  - For `dc_unpudo_usa`, only `3` exact matches exist, but `13783` event rows have a same-run anchor within `1s`.
  - Many UnPUDO anchors are offset by around `0.05s` because generic anchors use first movement frame after park while the notebook timestamp has slightly different frame alignment.
- The larger remaining gap is real and mixed:
  - `dc_pudo_uk`: `16863` event rows have no same-run PUDO anchor; `12853` have same-run PUDO anchors but nearest anchor is more than `10s` away.
  - `dc_unpudo_uk`: `15738` event rows have no same-run UnPUDO anchor; `13607` have same-run UnPUDO anchors but nearest anchor is more than `10s` away.
  - Similar pattern exists for USA.
- Concrete missing example inspected:
  - `colorado/2025-12-09--13-37-22--gen2-av-0af30585-f8b7-424a-ae55-08f23740f085`, timestamp `1765288974483310`.
  - Event table has `dc_pudo_uk`; anchor parquet has no same-run `dc_pudo_uk` anchor and no same-run `dc_park_uk` anchor.
  - Raw corpus frame window shows a clean `gear=-1 -> 0` transition exactly at the event timestamp, hazard throughout the inspected 60s window, low-speed approach, `automation_active=False`, `wo_skip_reason=NULL`, and filtered-corpus presence.
  - This means the event is not explained by autonomous filtering, low-steering-bias skip reason, empty tags, or missing filtered-corpus membership.
  - Remaining suspects for this example are generic window/assignment behavior or a base exclusion not yet traced in the focused materializer run; a heavy `debug_sampling_ipython` trace was attempted but stopped because it expanded into a large dependency build.
- Temporary artifacts:
  - `/tmp/pudo_unpudo_events.csv`
  - `/tmp/parking_pudo_event_anchors/`
  - `/tmp/pudo_unpudo_anchor_compare_summary.csv`
  - `/tmp/pudo_unpudo_missing_from_anchors.csv`
  - `/tmp/pudo_unpudo_missing_examples.csv`
  - `/tmp/pudo_unpudo_anchor_delta_analysis.csv`
  - `/tmp/pudo_unpudo_nearest_anchor_bucket_summary.csv`
  - `/tmp/missing_colorado_20251209_frames.csv`
  - `/tmp/missing_colorado_automation.csv`
  - `/tmp/missing_colorado_wo_skip.csv`

## 2026-06-08 Anchor Rerun After Geofence Reintroduction

- Dispatched a branch-release rerun for `parking_pudo/anchors` after the committed global geofence reintroduction.
- Release details:
  - Branch: `boris/pudo_generic_materialization`
  - Commit: `b3f697a68caf56ab22f5767303a680f93a547dc4`
  - Version: `2026-06-08-2`
  - Job name: `parking_pudo_geofence_anchors`
  - Flyte execution: `a6jn55f87zptzqkkdsv7`
  - Console: `https://flyte.data.wayve.ai/console/projects/ai-services-sampling/domains/production/executions/a6jn55f87zptzqkkdsv7`
  - Image: `wayveacrprodflyte.azurecr.io/sampling@sha256:b8d0012d96d563423fc346ba82e7f1fc32a81462b5d7b025b9a443a37a8b46d7`
  - Expected root: `abfss://datasets@wayveproddatasetflat.dfs.core.windows.net/sampling_materialised/parking_pudo/anchors/boris-pudo-generic-materialization/2026-06-08-2`
- Operational notes:
  - Used a temporary clean clone at `/workspace/pudo_generic_materialization_release` because the main materialization worktree had uncommitted out-of-scope filter narrowing edits.
  - This rerun includes the pushed geofence commit, but not the uncommitted local out-of-scope narrowing diff.
  - The release script pushed tag `sampling/parking_pudo/anchors/boris-pudo-generic-materialization/2026-06-08-2` before submitting Flyte.

## 2026-06-08 Focused 5K Anchor Investigation

- Investigated the concrete missing event:
  - `fme20005/2026-01-10--10-41-01--gen2-av-c6d55d4a-1b21-44e4-932f-c736271e6be1`
  - timestamp `1768043284433309`
- Current local branch state:
  - Branch: `boris/pudo_generic_materialization`
  - Commit: `d898b31869a8`
  - The branch is aligned with origin.
- Added temporary debug-helper support in `wayve/ai/services/sampling/datasets/debug_sampling.py`:
  - `--run-id` to load a single run instead of a full day/platform partition.
  - `--event-ts` to print per-filter truth for the closest row.
  - `--skip-funnels` to avoid huge per-bucket output.
  - `--parquet-path` to inspect local materialized parquet files.
- Current-code filter trace for the example:
  - Loaded the single run from `wayve_corpus.all_data` via generic materialization dependencies.
  - At the exact event timestamp, the row passes:
    - `exclude_geofenced`
    - `exclude_autonomous`
    - `select_platform_parking_pudo_mache`
    - `select_country_gbr`
    - `select_pudo_anchor`
  - The row matches `dc_pudo_uk` and `dc_pudo_gear_change_uk`.
  - Therefore this example is not filtered by the current local code.
- Produced-root checks:
  - `2026-06-08-1` sampled dataset `dc_pudo_uk` contains the exact example and has `23,932` sampled rows.
  - `2026-06-08-2` sampled dataset `dc_pudo_uk` does not contain the exact example and has `4,495` rows.
  - `dev/parking_pudo_anchors_bc_names_700_full__2026-06-07-09-19` sampled dataset `dc_pudo_uk` does not contain the exact example and has `10,676` rows.
- Raw bucket check for `2026-06-08-2`:
  - Downloaded all 51 raw `dc_pudo_uk` train bucket parquet parts under:
    - `sampling_materialised/parking_pudo/anchors/boris-pudo-generic-materialization/2026-06-08-2/buckets/dataset_split=train/dataset_bucket=dc_pudo_uk/balancing_attribute_joint_key=_no_group_/`
  - Raw bucket also has exactly `4,495` rows, so this is not a train-dataset post-sampling undercount.
  - The raw bucket has no `2026-01-10` rows at all.
- Interpretation:
  - The low `2026-06-08-2` artifact is not explained by the inspected row failing current filters.
  - The artifact was built from tag `sampling/parking_pudo/anchors/boris-pudo-generic-materialization/2026-06-08-2` at commit `b3f697a68caf`, not current commit `d898b31869a8`.

## 2026-06-08 Focused dc_pudo_uk Debug Sampling

- Investigated:
  - `fme20012/2026-01-15--16-27-00--gen2-av-f5fb5b5e-e2e8-45e0-971b-5e75bedebd06`
  - Event-table timestamp: `1768494744833312`
  - Event-table `event_startOrEnd_timestampunixus`: `1768494732833312`
- Ran `debug_sampling.py` on the single-run one-bucket anchors dataset:
  - Dataset: `parking_pudo/anchors_dc_pudo_uk`
  - Date/platform: `2026-01-15`, `gen2`
  - Cache: `/tmp/parking_pudo_debug/parking_pudo/anchors_dc_pudo_uk/2026-01-15_gen2_fme20012_2026-01-15--16-27-00--gen2-av-f5fb5b5e-e2e8-45e0-971b-5e75bedebd06.parquet`
- Result at `event_startOrEnd_timestampunixus=1768494732833312`:
  - Closest frame timestamp: `1768494732833311`.
  - Failing filters: `exclude_autonomous`, `select_pudo_anchor`.
  - Interpretation: this is not the comparable generic anchor for `dc_pudo_uk`; it is an earlier approach/window timestamp and is still autonomous.
- Result at `timestamp_unixus=1768494744833312`:
  - The exact frame passes every active filter:
    - base exclusions,
    - `exclude_autonomous`,
    - `select_platform_parking_pudo_mache`,
    - `select_country_gbr`,
    - `select_pudo_anchor`.
  - Bucket membership: `dc_pudo_uk`.
- Interpretation:
  - For this sample, current branch code accepts the event-table timestamp as a valid `dc_pudo_uk` anchor.
  - The earlier local anchor parquet cache had zero rows for this run, so that cache/artifact is stale or was produced from older code/config rather than the current local branch behavior.
  - This sample is not evidence of a current-code PUDO selector bug.

## 2026-06-08 Full Anchors Sample Rerun

- Submitted a full `sample` workflow for all anchor buckets, not the one-bucket debug dataset:
  - Dataset: `parking_pudo/anchors`
  - Job name: `parking_pudo_anchors_all_buckets_sample_20260608`
  - Flyte execution: `azz442g8r5hnmwc4267d`
  - Console: `https://flyte.data.wayve.ai/console/projects/ai-services-sampling/domains/production/executions/azz442g8r5hnmwc4267d`
  - Image: `wayveacrprodflyte.azurecr.io/sampling@sha256:d7daaf08884792ea699f5111f329848a8123c35cd6958746bd7920390c7d26d2`
- Submission payload confirmed:
  - `dataset_name="parking_pudo/anchors"`
  - Workflow: `sample`
  - `run_ids_filter=None`
  - No `dc_pudo_uk`-only filtering.

## 2026-06-08 Focused failed_to_pudo Timestamp Offset Example

- Investigated:
  - `fme20037/2026-04-14--13-01-08--gen2-av-f065aca7-a3ab-4239-acd6-f30a4f47f873`
  - Event-table timestamp: `1776174365383296`
  - Event-table `event_startOrEnd_timestampunixus`: `1776174353383296`
- Event table lookup:
  - The table returns two identical rows for the same timestamp.
  - `event_type="pudo"`, `ISO_country_code="GBR"`, `av_mode_at_event=0`.
  - `disengagement_what="failed_to_pudo"`, `gearchange_timestamp=NULL`, `speed_kmh=0.0`.
- One-bucket `dc_pudo_uk` debug:
  - At `timestamp_unixus=1776174365383296`, all global/base filters pass, including `exclude_autonomous`, but `select_pudo_anchor=False`.
  - At `event_startOrEnd_timestampunixus=1776174353383296`, `exclude_autonomous=False` and `select_pudo_anchor=False`.
  - The run has `dc_pudo_uk` selector hits, but the nearest pure `select_pudo_anchor` frame is `+283.25s`; this event timestamp is not a `dc_pudo_uk` gear-to-park anchor.
- Full-anchor debug:
  - At the event-table timestamp, the row matches no anchor bucket.
  - The nearest `select_failed_to_pudo_ca_short_anchor` frame is `1776174358383313`, about `-7.0s`.
  - At that earlier timestamp, the row matches:
    - `pre_ca_parking_uk`
    - `pre_ca_unpark_uk`
    - `pre_ca_failed_to_pudo_uk`
    - `ca_parking_short_uk`
    - `ca_parking_long_uk`
    - `ca_unpark_short_uk`
    - `ca_unpark_long_uk`
    - `ca_failed_to_pudo_short_uk`
    - `ca_failed_to_pudo_long_uk`
- Interpretation:
  - This is not accepted as `dc_pudo_uk` because generic `dc_pudo` anchors are gear-to-park/PUDO-stop anchors, and this notebook event row is a `failed_to_pudo` intervention event with no gear-change timestamp.
  - Current generic code does capture the event family, but at the actual AV-to-DC intervention anchor about 7 seconds earlier, in the failed-to-PUDO CA buckets.
  - Exact timestamp comparison between notebook PUDO rows and generic anchors will count this as missing even though the corresponding generic CA anchor exists nearby.
  - The current branch code needs a fresh anchor materialization before using the 5K count as evidence about current logic.
- Blocked check:
  - Tried reproducing the exact b3f tag in a temporary worktree, but the separate Bazel universe failed with `OSError: [Errno 28] No space left on device` while extracting `tensorrt_cu12_libs`.
  - Removed the temporary worktree afterward.
