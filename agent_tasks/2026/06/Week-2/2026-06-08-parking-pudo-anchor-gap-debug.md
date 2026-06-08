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
