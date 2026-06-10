# 2026-06-10 Parking/PUDO PUDO Filter Tightening

- Branch: `boris/pudo_generic_materialization`
- Change type: Code change, tests
- Areas:
  - `wayve/ai/services/sampling/datasets/parking_pudo`
  - `wayve/ai/services/sampling/test/datasets/parking_pudo`

## Summary

Tightened PUDO/UnPUDO generic materialization filters after the event-table alignment pass:

- Switched PUDO/UnPUDO bucket exclusions back from event-notebook office-only geofence filtering to the shared full `exclude_geofenced` sampling filter.
- Updated PUDO hazard/trip context generation to ignore evidence inside the full sampling geofence list.
- Re-enabled `exclude_low_steering_bias_confidence` and `exclude_mache_without_wheel_odometery` for PUDO/UnPUDO event, CA, and pre-CA exclusions.
- Removed the obsolete `PARKING_PUDO_EVENT_NOTEBOOK_GEOFENCES` constant and `exclude_parking_pudo_event_notebook_office_geofenced` filter, then moved the remaining geofence helper into `signals.py` and deleted `geofences.py`.
- Left `select_allowed_run_tags`, `exclude_runs_that_are_too_short`, and `exclude_diversion_and_lens_obscured_interventions` disabled for PUDO/UnPUDO for now.

## Verification

- Passed:
  - `WAYVECODE_MAIN_COMMIT_META_OVERRIDE=$(git rev-parse --short=12 main) bazel test //wayve/ai/services/sampling:test_datasets_py_test --test_arg=-k --test_arg=parking_pudo --test_arg=--no-cov --test_output=errors`
