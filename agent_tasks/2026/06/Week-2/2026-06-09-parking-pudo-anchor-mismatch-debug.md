# 2026-06-09 Parking/PUDO Anchor Mismatch Debug

## Summary

Investigated `dc_pudo_uk` mismatches between the event notebook table and generic Parking/PUDO anchor materialization.

## Findings

- The Streamlit comparison cache was using the older root:
  - `abfss://datasets@wayveproddatasetflat.dfs.core.windows.net/sampling_materialised/parking_pudo/anchors/dev/parking_pudo_anchors_temp_compare_20260609_1402__2026-06-09-14-06`
- The new `3.0.68` anchors Flyte run is still running:
  - execution `ax4kdrxxjztvzvcxqxp2`
  - image `wayveacrprodflyte.azurecr.io/sampling:bpudo3068-20260609`
  - node `n1` is in the Ray stage
- A real code-side mismatch existed in `parking_pudo/signals.py`:
  - `_snap_park_to_stop` moved gear-to-park segments backward to stopped non-park frames.
  - This shifted `dc_pudo` anchors away from the event notebook's gear-to-park timestamp.

## Code Change

- Removed `_snap_park_to_stop` and its call from `/workspace/WayveCode/wayve/ai/services/sampling/datasets/parking_pudo/signals.py`.
- Gear smoothing remains active, but the park/PUDO event anchor is now the smoothed gear-to-park frame rather than a snapped stop frame.

## Evidence

- Example `fme20001/2026-03-01--09-18-12--gen2-av-a93a7c76-81b9-4b16-9d59-98e0293859f9 · 1772356782683312`:
  - before fix: nearest `select_pudo_anchor` was `-47.699999s`.
  - after fix: exact timestamp has `select_pudo_anchor=True` and matches `dc_pudo_uk`.
- Example `fme20018/2026-03-01--07-03-23--gen2-av-698d1ad0-5674-48f1-be39-239dadce474d · 1772350143433304`:
  - after fix: stopped-forward timestamp is no longer selected.
  - nearest `select_pudo_anchor` moves to raw gear-to-park at `+0.550003s`.

## Validation

- `bazel build //wayve/ai/services/sampling:debug_sampling`: passed.
- `git diff --check`: passed.
- Ran `debug_sampling` on the two representative examples above.

## 120s Comparison Follow-up

- Published a fresh sampling image from the current worktree with `_snap_park_to_stop` temporarily removed:
  - image digest `sha256:cb913f28e91c8ff258de411d040a9fef1b712ea5b7fefdf4dc7a443989dcf6e5`
- Submitted a new full anchors `sample` Flyte execution:
  - execution `amspk7tzzcgd9ds4tjvm`
  - console `https://flyte.data.wayve.ai/console/projects/ai-services-sampling/domains/production/executions/amspk7tzzcgd9ds4tjvm`
  - job name `parking_pudo_anchors_no_snap_compare_20260609`
  - status at check: setup succeeded, Ray materialization node `n1` running.
- Recomputed the cached `dc_pudo_uk` comparison with a 120s threshold:
  - event rows: `32,136`
  - anchor rows: `34,357`
  - matched: `30,061`
  - missing in anchors: `2,075`
  - missing in event table: `4,524`
  - March-May missing in anchors: `2,000`
  - March-May missing in event table: `3,769`
- Randomly sampled five March-May rows from each mismatch type:
  - sample list `/tmp/dc_pudo_uk_mismatch_samples_120s_2026_03_05.csv`
  - all debug outputs `/tmp/parking_pudo_120s_debug_outputs/`
  - nearby notebook events `/tmp/nearby_events_5_generic_extra.csv`

### Sample Findings

- Missing in anchors:
  - `fme20028/2026-03-28--16-44-57... · 1774719148283310`: still a real current-code mismatch. Generic classifies the event-table PUDO timestamp as `dc_park_uk` and `dc_parking_gear_change_uk`; `select_pudo_anchor=False`. At the park context frame indicator is off, geofence is not excluded, `pudo_trip=False`, and nearest cleaned hazard evidence is about `307s` later.
  - `fme20018/2026-04-25--14-22-45... · 1777128123033305`: current code selects exact `dc_pudo_uk`; cached materialized root is stale.
  - `fme20014/2026-05-07--11-56-24... · 1778157173333313`: current code selects exact `dc_pudo_uk`; cached materialized root is stale.
  - `fme20029/2026-05-16--08-43-38... · 1778922235533306`: current code selects exact `dc_pudo_uk`; cached materialized root is stale.
  - `fme20034/2026-05-07--14-21-02... · 1778166168833316`: current code selects exact `dc_pudo_uk`; cached materialized root is stale.
- Missing in event table:
  - `fme20018/2026-03-09--06-57-12... · 1773043161633310`: current code selects exact `dc_pudo_uk`; nearest notebook event is `unpudo` at `+99s`, so no notebook PUDO within 120s.
  - `fme20018/2026-04-17--13-36-50... · 1776434848383302`: current code selects PUDO at `+6.7s`; notebook has only an `unparking` row about `-576s`.
  - `fme20001/2026-05-02--17-00-52... · 1777743141133315`: current code selects PUDO at `+0.8s`; notebook PUDO/UnPUDO rows are outside 120s.
  - `fme20031/2026-05-10--11-42-03... · 1778425905983309`: current code selects exact `dc_pudo_uk`; notebook PUDO/Unparking rows are about `-453s` to `-466s`.
  - `fme20036/2026-05-03--06-06-41... · 1777790596733296`: current code selects exact `dc_pudo_uk`; notebook has a PUDO row at `-23.55s`, so it would match only if comparison threshold/anchor assignment accounts for this duplicate/shift behavior.

## March 30s Sample Audit

Root:
`abfss://datasets@wayveproddatasetflat.dfs.core.windows.net/sampling_materialised/parking_pudo/anchors/dev/parking_pudo_anchors_no_snap_compare_20260609__2026-06-09-21-43`

Comparison setup:
- Bucket: `dc_pudo_uk`
- Date range: `2025-12-01 <= run_date < 2026-05-17`
- Match threshold: `30s`
- March totals: `11,512` event rows, `12,401` anchor rows, `11,127` matched, `385` missing in anchors, `1,275` extra anchors.
- Debug outputs: `/tmp/parking_pudo_march_30s_debug_outputs/`
- Nearby notebook-event query: `/tmp/dc_pudo_uk_march_nearby_events.csv`

Important interpretation:
- "Missing in anchors" means the notebook event row had no generic anchor within 30s.
- "Missing in event table" in the Streamlit UI means an extra generic anchor was not used by any event-to-nearest-anchor match. It does not always mean there is no notebook row nearby; in repeated-anchor areas, another closer anchor may consume the notebook event.

### Missing in anchors

| # | Run | Timestamp | Generic result | Notebook row | Conclusion |
|---|---|---:|---|---|---|
| 1 | `fme20009/2026-03-12--13-38-39...` | `1773324731233307` | `select_pudo_anchor=False`; nearest generic PUDO `-35.85s` | exact PUDO row exists | Mostly threshold/timing: just outside 30s. |
| 2 | `fme20018/2026-03-17--10-19-49...` | `1773742943583306` | exact `select_pudo_anchor=True`, but bucket fails `exclude_runs_that_are_too_short` | exact PUDO row exists | Bucket-level run-length exclusion. |
| 3 | `fme20012/2026-03-19--15-02-29...` | `1773932578233305` | exact `select_pudo_anchor=True`, but bucket fails `exclude_runs_that_are_too_short` | exact PUDO row exists | Bucket-level run-length exclusion. |
| 4 | `fme20015/2026-03-26--15-39-42...` | `1774542030383311` | row is `dc_park_uk` + `dc_parking_gear_change_uk`; nearest generic PUDO `-301.15s` | exact PUDO row exists | Detector-policy difference: generic classifies the exact notebook PUDO timestamp as park/gear-change, not PUDO. |
| 5 | `fme20037/2026-03-27--10-55-45...` | `1774609381783314` | `select_pudo_anchor=False`; nearest generic PUDO `+332.05s` | exact PUDO row exists | Detector-policy/timing difference, not a global filter. |
| 6 | `fme20028/2026-03-28--16-44-57...` | `1774719148283310` | `select_pudo_anchor=False`; nearest generic PUDO `+330.85s` | exact PUDO row exists | Same class as #5. |
| 7 | `fme20028/2026-03-28--18-37-17...` | `1774727311533310` | `select_pudo_anchor=False`; nearest generic PUDO `-676.55s` | exact PUDO row exists | Same class as #5, larger shift. |
| 8 | `fme20039/2026-03-29--09-16-50...` | `1774780462633311` | `select_pudo_anchor=False`; nearest generic PUDO `-117.35s` | exact PUDO row exists | Would be recovered by 120s matching, but not by 30s. |
| 9 | `fme20027/2026-03-31--20-52-52...` | `1774992399983302` | exact `select_pudo_anchor=True`, but bucket fails `exclude_invalid_video_file_name` | exact PUDO row exists | Bucket-level video filename exclusion. |
| 10 | `fme20027/2026-03-31--20-52-52...` | `1774992579883319` | exact `select_pudo_anchor=True`, but bucket fails `exclude_invalid_video_file_name` | exact PUDO row exists | Same as #9. |

### Extra anchors

| # | Run | Timestamp | Generic result | Nearest notebook PUDO | Conclusion |
|---|---|---:|---|---|---|
| 11 | `fme20001/2026-03-01--08-35-30...` | `1772356527583311` | exact `dc_pudo_uk` | `-90.85s` | Extra generic anchor outside 30s. |
| 12 | `fme20012/2026-03-03--16-22-49...` | `1772556418583310` | exact `dc_pudo_uk` | `-18.95s` | Nearby notebook event exists, but another closer generic anchor likely consumes it; repeated-anchor/assignment effect. |
| 13 | `fme20014/2026-03-05--15-12-25...` | `1772725058833315` | exact `dc_pudo_uk` | `-105.05s` | Extra generic anchor outside 30s. |
| 14 | `fme20018/2026-03-12--11-02-31...` | `1773316533183307` | exact `dc_pudo_uk` | `-143.00s` | Extra generic anchor outside 30s. |
| 15 | `fme20027/2026-03-13--13-47-11...` | `1773414503433310` | exact `dc_pudo_uk` | `-139.55s` | Extra generic anchor outside 30s. |
| 16 | `fme20036/2026-03-19--21-39-53...` | `1773961402433311` | exact `dc_pudo_uk` | none within `900s` | Generic-only PUDO under notebook comparison filters. |
| 17 | `fme20014/2026-03-21--10-00-41...` | `1774090494533310` | exact `dc_pudo_uk` | `-360.30s` | Extra generic anchor outside 30s and 120s. |
| 18 | `fme20002/2026-03-24--21-03-33...` | `1774388745233308` | exact `dc_pudo_uk` | `-743.70s` | Extra generic anchor outside 30s and 120s. |
| 19 | `fme20036/2026-03-25--07-05-28...` | `1774426068283310` | exact `dc_pudo_uk` | `-46.95s` | Would be recovered by wider matching, but not 30s. |
| 20 | `fme20028/2026-03-28--22-01-59...` | `1774737965283305` | exact `dc_pudo_uk` | `-131.20s` | Extra generic anchor outside 30s. |

### Takeaway

The March 30s sample does not point to one broad missing-hazard bug. The sampled gap is a mix of:
- exact generic anchors dropped by generic validity filters (`exclude_runs_that_are_too_short`, `exclude_invalid_video_file_name`);
- notebook PUDO timestamps where generic deliberately selects a different PUDO anchor, or classifies the exact timestamp as `park`/gear-change;
- generic extra anchors that are not represented by the notebook event table at the same timestamp;
- comparison artifacts from multiple nearby generic anchors competing for a single notebook event.

## March Extra-Anchor Duplicate Check

Checked all `1,275` March `dc_pudo_uk` rows that Streamlit reports as
"missing in event table" / extra anchors.

Inputs:
- Anchor cache: `/tmp/event_clip_viewer_anchor_cache/a09ba8e909e1d367/anchors.parquet`
- Nearest event query: `/tmp/dc_pudo_uk_march_all_extra_nearest_events.csv`
- Duplicate check output: `/tmp/dc_pudo_uk_march_all_extra_duplicate_check.csv`

Results:
- `891 / 1,275` extra anchors have a nearest non-AV GBR PUDO event-table row
  within `900s`.
- `384 / 1,275` have no such event-table row within `900s`.
- Of the `891` with a different nearest event-table timestamp, `875`
  (`98.2%`) also have an exact `dc_pudo_uk` anchor at that event-table
  timestamp.
- `879 / 891` have another `dc_pudo_uk` anchor within `120s` of the nearest
  event-table timestamp.

Interpretation:
- The extra anchors are usually not exact duplicate rows at the same timestamp;
  each sampled extra anchor had one row at its own timestamp.
- Most are duplicate/extra generic anchors in the same run near an event-table
  PUDO that already has a generic anchor. The one-way event-to-nearest-anchor
  comparison matches the event to the closest anchor and leaves the other nearby
  anchors as "extra".
- This suggests the remaining large "extra anchors" count is mostly generic
  over-segmentation / repeated anchors around the same notebook event, not a
  missing-table join issue.

## Temporary Approach-Displacement Gate

Added a temporary park/PUDO anchor eligibility gate to test the duplicate-anchor
hypothesis. For each gear-to-park candidate, the selector looks back `30s` and
requires the point-to-point displacement from that lookback frame to the current
anchor to be more than `5m`. If another valid gear-to-park anchor appears inside
the lookback window, the displacement check starts from that previous anchor
instead of the full `30s` point. This is applied before the park/PUDO split, so it
can suppress repeated `dc_park_*` and `dc_pudo_*` candidates from the same
physical stop.

Also moved `exclude_runs_that_are_too_short` from active base exclusions into
the disabled data-quality exclusions list for event-table comparison.

Added the symmetric departure-side gate for unpark/UnPUDO anchors. For each
gear-leaves-park candidate, the selector now looks forward `30s`, clipped at the
next valid gear-to-park anchor, and requires the maximum point-to-point
displacement from the gear-change point to exceed `5m`. This filters departures
where the gear or speed signal twitches but the vehicle never meaningfully moves.
The gate is inside `_departure_events`, so it applies consistently to
`dc_unpark_*`, `dc_unpudo_*`, `dc_pre_unpark_*`, `dc_pre_unpudo_*`, anchor-only
buckets, and CA-near-departure buckets.

Validation:
- `git diff --check` passed.
- `bazel test //wayve/ai/services/sampling:test_datasets` and
  `bazel build //wayve/ai/services/sampling:debug_sampling` both failed before
  exercising code because WayveMeta invoked
  `get_wayve_meta_service_info.py --commit` with an empty commit argument.

## Flyte Run With Displacement Gates

Published a test sampling image from the dirty local
`boris/pudo_generic_materialization` worktree and submitted a full anchors
`sample` workflow.

Run details:
- Dataset: `parking_pudo/anchors`
- Workflow: `sample`
- Job name: `parking_pudo_anchors_gates_20260610`
- Date range: `2025-12-01` to `2026-06-07`
- Image tag: `wayveacrprodflyte.azurecr.io/sampling:bpudo-gates-20260610`
- Image digest: `sha256:9f648f4864c7eafdffcd70ce1aa8b7936a95fe353213490744530a039c5233d3`
- Flyte execution: `anlhtrggbm92jdvp5jd7`
- Console: `https://flyte.data.wayve.ai/console/projects/ai-services-sampling/domains/production/executions/anlhtrggbm92jdvp5jd7`

Command:

```bash
WAYVECODE_MAIN_COMMIT_META_OVERRIDE=$(git rev-parse --short=12 main) \
  bazel run //wayve/ai/services/sampling:workflow -- \
  remote --image wayveacrprodflyte.azurecr.io/sampling:bpudo-gates-20260610 \
  run sample \
  --dataset_name parking_pudo/anchors \
  --job_name parking_pudo_anchors_gates_20260610 \
  --start_date 2025-12-01 \
  --end_date 2026-06-07
```
