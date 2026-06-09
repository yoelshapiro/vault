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
