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
