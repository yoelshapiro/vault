# 2026-06-11 UnPUDO 15s Window

- Branch: `boris/pudo_generic_materialization`
- Worktree: `/workspace/pudo_materialization_buckets`
- PR: #117075 draft context
- Change type: Materialisation bucket tuning
- Areas:
  - `/workspace/pudo_materialization_buckets/wayve/ai/services/sampling/datasets/parking_pudo`
  - `/workspace/pudo_materialization_buckets/wayve/ai/services/sampling/test/datasets/parking_pudo`

## Summary

Changed `dc_unpudo_*` and `dc_unpudo_trip_*` to select 15s after the
first-movement anchor. `dc_unpark_*` still uses the shared selector default of
10s. Pre-departure and gear-change buckets are unchanged.

Follow-up: removed `exclude_low_steering_bias_confidence` from the PUDO/UnPUDO
exclusion family after the `dc_unpudo_uk` mismatch check showed that this filter
explained most event-table rows missing from anchors. Park/unpark buckets still
keep the stricter low steering-bias exclusion. The low steering-bias filter is
kept in the disabled/future data-quality exclusion list for PUDO/UnPUDO.

## Verification

```bash
WAYVECODE_MAIN_COMMIT_META_OVERRIDE=244abae57524 bazel test //wayve/ai/services/sampling:test_datasets_py_test --test_arg=-k --test_arg=parking_pudo --test_arg=--no-cov
```

Result: passed.

## Flyte Runs

- Published sampling image:
  `wayveacrprodflyte.azurecr.io/sampling:borisindel-tmp-build-0.1.125-boris-pudo_generic_materialization-59584`
  (`sha256:ff9affc5c67b498e213a9444e9bcfa65e793c696adc6d999025accf2684ef492`).
- `parking_pudo/default` sample run:
  `acbxxgcvxqqmxvnsctkb`, job name
  `parking_pudo_default_no_low_steering_20260611`.
- `parking_pudo/anchors` sample run:
  `ac9x9nd4shpqlk4db9p5`, job name
  `parking_pudo_anchors_no_low_steering_20260611`.
