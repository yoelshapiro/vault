# PR 102690 Route Shortening Review Fixes

- Branch: `boris/03-23-park-route-shortening-v2`
- PR: `102690`
- Change type: code/tests
- Areas: `wayve/ai/lib/data/pipes/routes.py`, `wayve/ai/zoo/data/parking.py`, `wayve/ai/si/datamodules/parking.py`

## Summary

Addressed PR review comments 2, 3, and 4, and also removed the now-unnecessary helper parameters from comment 1.

## Changes

- Renamed the parking stop route randomization surface from `jitter` to `offset` across zoo parking data, SI parking config, OTF route-shortening plumbing, and tests.
- Replaced route-shortening speed-limit `assert` checks with an early `ValueError`.
- Kept scalar extraction inline in `_fetch_route_map`, using finite checks for stop index/fraction and defaulting non-finite offset to `0.0`.
- Removed unused `_shorten_route_polyline_to_stop` parameters for `last_waypoint_index` and `fraction_to_next_waypoint`.
- Set planned-route speed limits to `None` before shortening, because planned routes do not have segment speed limits.

## Verification

- `bazel test //wayve/ai/lib:test_data_pipes_lib_py_test --test_arg=wayve/ai/lib/test/data/pipes/test_generate_route_map.py --test_arg=-k --test_arg='shorten_route_polyline_to_stop or planned_route_fetch_route_map_shortens_without_speed_limits' --test_arg=--no-cov --test_output=errors`
- `bazel test //wayve/ai/zoo/data:test_zoo_data_py_test --test_arg=wayve/ai/zoo/data/test/test_parking.py --test_arg=-k --test_arg='insert_parking_stop_route_position' --test_arg=--no-cov --test_output=errors`
- `bazel test //wayve/ai/si/datamodules:py_test --test_arg=wayve/ai/si/datamodules/test/test_otf.py --test_arg=-k --test_arg='route_shortening' --test_arg=--no-cov --test_output=errors`
- `bazel test //wayve/ai/lib:test_data_pipes_lib_py_lint_flake8 //wayve/ai/zoo/data:test_zoo_data_py_lint_flake8 //wayve/ai/si/datamodules:py_lint_flake8 --test_output=errors`
- `bazel test //wayve/ai/lib:test_data_pipes_lib_mypy`
- Earlier combined mypy run also passed `//wayve/ai/zoo/data:test_zoo_data_mypy` and `//wayve/ai/si/datamodules:mypy`; the lib target was rerun after a type fix and passed.

## Notes

- A broad `//wayve/ai/lib:test_data_pipes_lib_py_test -k ...` attempt failed during collection on unrelated `test_lidar_cpp_converter.py` fixture parsing (`OusterRawLidarScan` decode error), before selected route-map tests ran.
- A broad SI `-k` attempt ran the selected tests successfully but failed coverage because most tests were deselected.
