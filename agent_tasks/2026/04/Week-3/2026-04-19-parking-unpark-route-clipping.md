# Parking Unpark Route Clipping

## Context
Added the missing reverse-direction route shortening for unparking samples on `guy/training/pudo_only_bc_3.0.26_aug_cutoff_boris_unpudo_route_clamping`, while keeping the existing stop anchor convention instead of introducing a new parked-location anchor.

## Branch
- `guy/training/pudo_only_bc_3.0.26_aug_cutoff_boris_unpudo_route_clamping`

## What Changed
- Extended the route-map pipe so parking samples still clip the route suffix to the stop anchor, and unparking samples now clip the route prefix from the same anchor.
- Reset the route-location cursor to `(0, 0.0)` after prefix clipping so the cropped unparking route is rendered from its new start.
- Stored the existing stop-route anchor during `insert_parking_data(...)` using the resolved parking lookahead indices.
- Reused that anchor for `UNPARKING_MODE` by pointing it at the current lookahead sample, which preserves the current “small jitter is acceptable” assumption.
- Added focused regression tests for prefix clipping and unparking anchor emission.

## Files
- `wayve/ai/lib/data/pipes/routes.py`
- `wayve/ai/lib/test/data/pipes/test_generate_route_map.py`
- `wayve/ai/zoo/data/parking.py`
- `wayve/ai/zoo/data/test/test_parking.py`

## Validation
- `bazel test //wayve/ai/lib:test_data_lib_py_test --test_arg=wayve/ai/lib/test/data/pipes/test_generate_route_map.py --test_arg=-k --test_arg=test_shorten_route_polyline --test_arg=--cov-fail-under=0`
- `bazel test //wayve/ai/zoo/data:test_zoo_data_py_test --test_arg=wayve/ai/zoo/data/test/test_parking.py --test_arg=-k --test_arg=parking_stop_route_position or augment_parked_mode or compute_parking_mode_unparking`

## Notes
- A broader `//wayve/ai/lib:test_data_lib` run was not useful for this change because the `py_checks` target forwards pytest args into lint jobs, and the unfiltered pytest collection also hits an unrelated lidar test-data decode issue.
