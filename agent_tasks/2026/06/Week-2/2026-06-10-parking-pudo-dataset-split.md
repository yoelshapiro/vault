# 2026-06-10 Parking/PUDO Dataset Split

## Summary

Refactored the generic `parking_pudo` dataset assembly so the semantic bucket families are easier to work on independently.

## Branch

`boris/pudo_generic_materialization`

## Changes

- Added `parking_pudo/bucket_builders.py` to own the repeated country-split `Bucket` construction.
- Added `parking_pudo/parking/buckets.py` for non-PUDO park/unpark buckets and anchor buckets.
- Added `parking_pudo/pudo/buckets.py` for PUDO/UnPUDO buckets and anchor buckets.
- Reduced `parking_pudo/default/dataset.py` to compose `PARKING_BUCKETS + PUDO_BUCKETS`.
- Reduced `parking_pudo/anchors/dataset.py` to compose `PARKING_ANCHOR_BUCKETS + PUDO_ANCHOR_BUCKETS`.
- Updated `wayve/ai/services/sampling/BUILD` so the new dataset modules are included in `dataset_configs`.

## Validation

```bash
WAYVECODE_MAIN_COMMIT_META_OVERRIDE=$(git rev-parse --short=12 main) \
  bazel test //wayve/ai/services/sampling:test_datasets_py_test \
  --test_arg=-k --test_arg=parking_pudo --test_arg=--no-cov --test_output=errors
```

Result: passed.
