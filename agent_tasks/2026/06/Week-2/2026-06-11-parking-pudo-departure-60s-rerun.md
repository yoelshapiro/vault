# 2026-06-11 Parking/PUDO Departure 60s Rerun

## Summary

Changed the generic Parking/PUDO departure movement verification window from 30s to 60s to better match the event notebook's UnPUDO/unparking transition logic.

## Code

- Branch: `boris/pudo_generic_materialization`
- Commit: `5f0b1777890e` (`fix: extend parking pudo departure lookahead`)
- Main files:
  - `wayve/ai/services/sampling/datasets/parking_pudo/signals.py`
  - `wayve/ai/services/sampling/datasets/parking_pudo/filters.py`
  - `wayve/ai/services/sampling/datasets/parking_pudo/intervention_filters.py`
  - `wayve/ai/services/sampling/datasets/parking_pudo/default/dataset.py`
  - `wayve/ai/services/sampling/datasets/parking_pudo/anchors/dataset.py`
  - `wayve/ai/services/sampling/datasets/parking_pudo/README.md`

## Flyte Runs

- Image: `wayveacrprodflyte.azurecr.io/sampling@sha256:765b61967577da92917bee3741704275d3002befe49cfbde27b53f91a9b81a57`
- Extra local tag required by pyflyte: `borisindel-tmp-build-0.1.125-5f0b1777890eeed635b16a430f98b5cd919b7c26-8cc9b`
- Stale first anchors attempt: `ar5nx4qnxxrgm7vtm9sm`
  - This resolved to released image `0.1.125` before the extra tag existed.
  - Terminated; status moved to `ABORTING`.
- Anchors sample run: `armqrmh7847nbmxv7f9z`
  - Dataset: `parking_pudo/anchors`
  - Job name: `parking_pudo_anchors_departure_60s_20260611`
  - Status at submission check: `RUNNING`
  - Image label: `wayve.docker.image.version=765b619`
- Default sample run: `ahp8gvv9z4v2tjcd4qqr`
  - Dataset: `parking_pudo/default`
  - Job name: `parking_pudo_default_departure_60s_20260611`
  - Status at submission check: `RUNNING`
  - Image label: `wayve.docker.image.version=765b619`

## Notes

- Local `.wayve/git_merge_base_hash` was empty in `/workspace/pudo_flyte_clean`, which caused Bazel's WayveMeta repository rule to fail with `argument --commit: expected one argument`.
- Used `WAYVECODE_MAIN_COMMIT_META_OVERRIDE=244abae57524` for the local Bazel/Flyte commands.
