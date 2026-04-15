# Route-Shortening Jitter Config Wiring

## Context
Ported parking route-shortening jitter controls into `boris/03-23-park-route-shortening-v2` so they can be configured from `ParkingDataConfig` and applied through both parking data paths.

## Branch
- `boris/03-23-park-route-shortening-v2`

## What Changed
- Added parking detection distance jitter + stop-route jitter options to SI parking config model.
- Updated zoo parking pipeline to:
  - jitter parking distance threshold per sample,
  - sample/store stop-route jitter in data for route shortening.
- Updated SI parking datamodule path to:
  - expose/validate jitter config fields,
  - apply distance jitter in SI-native parking mode computation,
  - pass jitter through when delegating to zoo parking mode insertion.
- Updated OTF route-shortening wiring to pass stop-route jitter into `insert_parking_stop_route_position`.
- Updated route shortening in route-map pipe to consume jitter (meters) and convert to route-curve distance using haversine segment lengths.
- Added/updated parking unit tests for jitter validation and jitter key propagation.

## Files
- `wayve/ai/si/configs/parking/parking_config.py`
- `wayve/ai/si/datamodules/parking.py`
- `wayve/ai/si/datamodules/otf.py`
- `wayve/ai/zoo/data/parking.py`
- `wayve/ai/lib/data/pipes/routes.py`
- `wayve/ai/zoo/data/test/test_parking.py`

## Validation
- `bazel test //wayve/ai/zoo/data:test_zoo_data_py_test --test_arg=wayve/ai/zoo/data/test/test_parking.py`
- `bazel test //wayve/ai/lib:test_data_pipes_lib_py_test --test_arg=wayve/ai/lib/test/data/pipes/test_generate_route_map.py --test_arg=--cov-fail-under=0`
