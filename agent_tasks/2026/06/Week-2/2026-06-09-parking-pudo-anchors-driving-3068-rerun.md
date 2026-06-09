# 2026-06-09 Parking/PUDO Anchors Driving 3.0.68 Rerun

## Summary

Updated the generic parking/PUDO default and anchor dataset configs to use driving binary `3.0.68` and the date range `2025-12-01` through `2026-06-07`, then submitted a fresh full `sample` Flyte run for `parking_pudo/anchors`.

## Code changes

- `/workspace/WayveCode/wayve/ai/services/sampling/datasets/parking_pudo/default/dataset.py`
  - `binary_version="3.0.68"`
  - `start_date="2025-12-01"`
  - `end_date="2026-06-07"`
- `/workspace/WayveCode/wayve/ai/services/sampling/datasets/parking_pudo/anchors/dataset.py`
  - `binary_version="3.0.68"`
  - `start_date="2025-12-01"`
  - `end_date="2026-06-07"`

Note: user wrote `2026-12-01 up to 2026-06-07`; treated this as `2025-12-01` because `2026-12-01` is after `2026-06-07` and would create an empty range.

## Validation and publish

- `git diff --check`: passed.
- `bazel build //wayve/ai/services/sampling:dataset_configs` initially failed because WayveMeta metadata received an empty commit from the missing merge-base path.
- Rerunning metadata-sensitive commands with `WAYVECODE_MAIN_COMMIT_META_OVERRIDE=$(git rev-parse --short=12 main)` fixed the metadata path.
- First image publish failed on `wayve.azurecr.io` 401; fixed with `az acr login --name wayve`.
- Published image:
  - long tag: `wayveacrprodflyte.azurecr.io/sampling:borisindel-tmp-build-0.1.125-boris-pudo_generic_materialization-59584`
  - short tag used for Flyte: `wayveacrprodflyte.azurecr.io/sampling:bpudo3068-20260609`
  - digest: `sha256:c4c2933e78429e1aeae6920bba17befc181ca26f79387cd7830d19748e3e9f50`
- The long tag was rejected by Flyte registration because label values must be at most 63 characters; the short tag fixed that.

## Flyte

- Dataset: `parking_pudo/anchors`
- Workflow: `sample`
- Job name: `parking_pudo_anchors_driving_3068_20260609`
- Start date: `2025-12-01`
- End date: `2026-06-07`
- Image: `wayveacrprodflyte.azurecr.io/sampling:bpudo3068-20260609`
- Execution: `ax4kdrxxjztvzvcxqxp2`
- Console: https://flyte.data.wayve.ai/console/projects/ai-services-sampling/domains/production/executions/ax4kdrxxjztvzvcxqxp2
