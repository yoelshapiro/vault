# Route Shortening PR - Added Test Coverage

- Date: 2026-04-14
- Branch: boris/03-23-park-route-shortening-v2
- Scope: add missing tests for OTF parking config gating and parking entry-index persistence.

## Code changes
- Added tests in `wayve/ai/si/datamodules/test/test_otf.py`:
  - `test_make_driving_datapipe_passes_store_entry_index_when_route_shortening_enabled`
  - `test_make_driving_pipe_disables_route_shortening_and_blackout_for_val`
  - `test_make_driving_pipe_keeps_route_shortening_and_blackout_for_train`
- Added tests in `wayve/ai/si/datamodules/test/test_parking_unit.py`:
  - `test_add_parking_mode_store_entry_index_for_si_path`
  - `test_add_parking_mode_store_entry_index_encodes_minus_one_when_entry_not_in_lookahead`
- Added tests in `wayve/ai/zoo/data/test/test_parking.py`:
  - `test_insert_parking_data_store_entry_index_for_route_shortening`
  - `test_insert_parking_stop_route_position_uses_stored_entry_index`
  - `test_insert_parking_stop_route_position_fallbacks_to_first_lookahead_when_entry_missing`
  - `test_insert_parking_stop_route_position_writes_nan_when_not_parking`

## Validation
- `bazel test //wayve/ai/zoo/data:test_zoo_data_py_test --test_arg="-k=store_entry_index or parking_stop_route_position"` ✅
- `bazel test //wayve/ai/si/datamodules:py_test --test_env=PYTEST_ADDOPTS=--no-cov --test_arg="-k=test_make_driving_pipe_disables_route_shortening_and_blackout_for_val or test_make_driving_pipe_keeps_route_shortening_and_blackout_for_train or test_make_driving_datapipe_passes_store_entry_index_when_route_shortening_enabled or test_add_parking_mode_store_entry_index"` ✅
- Attempted `bazel test //wayve/ai/lib:test_data_pipes_lib_py_test --test_arg="-k=shorten_route_polyline_to_stop"` blocked by ACR auth (401 on `azure-storage/azurite`).
