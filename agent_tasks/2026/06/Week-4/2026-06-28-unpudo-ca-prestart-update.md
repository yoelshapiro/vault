# 2026-06-28 UnPUDO CA And Pre-Start Update

Branch: `boris/pudo_generic_materialization`

## Summary

- Updated generic Parking/PUDO materialisation so UnPUDO CA buckets keep stopped handovers.
- Changed `dc_pre_start_unpudo` from 0.9s before first movement to 5s before first movement, while preserving the existing extension back to a directional-indicator start.

## Code Changes

- `wayve/ai/services/sampling/datasets/parking_pudo/intervention_filters.py`
  - Added `filter_remain_stopped` to the shared CA selectors.
  - The default remains `True`, so existing PUDO, park, and unpark behavior is unchanged unless a bucket opts out.
- `wayve/ai/services/sampling/datasets/parking_pudo/pudo/buckets.py`
  - Disabled the remain-stopped filter for `pre_ca_unpudo`, `ca_unpudo_short`, `ca_unpudo_long`, and their anchor variants.
  - Disabled the same filter for `pre_ca_failed_to_unpudo`, `ca_failed_to_unpudo_short`, `ca_failed_to_unpudo_long`, and their anchor variants.
  - Set `dc_pre_start_unpudo` and its anchor variant to `before_movement_sec=5.0`.
- `wayve/ai/services/sampling/test/datasets/parking_pudo/test_parking_pudo_filters.py`
  - Added regression coverage for the 5s UnPUDO pre-start window.
  - Added regression coverage that stopped UnPUDO and failed-to-UnPUDO CA bucket wiring keeps stopped handovers while the underlying selector default still filters them.

## Validation

- `git diff --check`: passed.
- `python -m py_compile ...`: passed for the changed Python files.
- `bazel build //wayve/ai/services/sampling:dataset_configs`: blocked by repository metadata genrule passing an empty `--commit`.
- `bazel test //wayve/ai/services/sampling:test_datasets --test_arg=-k --test_arg=parking_pudo`: blocked by the same metadata genrule before tests ran.
