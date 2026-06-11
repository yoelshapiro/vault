# 2026-06-11 Departure Gear Change Buckets

- Branch: `boris/pudo_generic_materialization`
- Worktree: `/workspace/pudo_materialization_buckets`
- PR: #117075 draft context
- Change type: Generic materialisation bucket update
- Areas:
  - `/workspace/pudo_materialization_buckets/wayve/ai/services/sampling/datasets/parking_pudo`
  - `/workspace/pudo_materialization_buckets/wayve/ai/services/sampling/test/datasets/parking_pudo`

## Summary

Added departure-side gear-change buckets for UnPUDO and unpark:

- `dc_unpudo_gear_change_*`
- `dc_unpark_gear_change_*`

The new selector anchors on the smoothed gear-leaves-park frame, validates that
the vehicle later starts moving and moves more than 5m, then splits the event
with the same parked-interval PUDO context used by `dc_unpudo_*` and
`dc_unpark_*`.

## Verification

```bash
WAYVECODE_MAIN_COMMIT_META_OVERRIDE=244abae57524 bazel test //wayve/ai/services/sampling:test_datasets_py_test --test_arg=-k --test_arg=parking_pudo --test_arg=--no-cov
```

Result: passed.
