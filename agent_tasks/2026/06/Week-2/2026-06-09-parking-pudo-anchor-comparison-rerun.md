# 2026-06-09 Parking PUDO Anchor Comparison Rerun

## Summary

Updated the generic `parking_pudo` anchor materialisation for event-table comparison and launched a full anchors `sample` Flyte run.

## Changes

- Marked the event-notebook-only geofence list and relaxed DC `inferred__intervention__what` filtering as temporary comparison choices in code and README.
- Switched DC buckets to use the event notebook office geofence names and to skip the inferred intervention `what` exclusion.
- Kept CA/pre-CA on the parking/PUDO out-of-scope intervention filter.
- Changed trip-table PUDO context to match completed pickup/dropoff events within 100m and synthesize hazard context across the matched parked segment.
- Kept `*_trip_*` buckets as trip-table-only debug overlap buckets.
- Added regression coverage for 100m trip matching and synthetic hazard context.

## Validation

- `bazel test //wayve/ai/services/sampling:test_datasets //wayve/ai/services/sampling:test_datasets_py_lint_ruff //wayve/ai/services/sampling:test_datasets_py_lint_flake8 //wayve/ai/services/sampling:test_datasets_ty`
- Published sampling image: `wayveacrprodflyte.azurecr.io/sampling:borisindel-tmp-build-0.1.125-boris-pudo_generic_materialization-59584`

## Flyte

- Dataset: `parking_pudo/anchors`
- Workflow: `sample`
- Job name: `parking_pudo_anchors_temp_compare_20260609_1402`
- Execution: `a6vp6f5srkrncnt8k4g7`
- Console: https://flyte.data.wayve.ai/console/projects/ai-services-sampling/domains/production/executions/a6vp6f5srkrncnt8k4g7

## Git

- Branch: `boris/pudo_generic_materialization`
- Commit: `7c8abb4c024f`
