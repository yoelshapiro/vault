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

## Verification

```bash
WAYVECODE_MAIN_COMMIT_META_OVERRIDE=244abae57524 bazel test //wayve/ai/services/sampling:test_datasets_py_test --test_arg=-k --test_arg=parking_pudo --test_arg=--no-cov
```

Result: passed.
