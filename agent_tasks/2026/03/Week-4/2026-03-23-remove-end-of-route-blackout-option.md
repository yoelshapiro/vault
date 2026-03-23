# Remove `enable_end_of_route_blackout` Option

## Summary
Removed the `enable_end_of_route_blackout` option from the current branch so parking route behavior is controlled only via route shortening, not blackout.

## Branch
- `parking/training/pudo`

## Changes
- `wayve/ai/si/datamodules/otf.py`
  - Removed `enable_end_of_route_blackout` from:
    - `OtfDrivingDataModule.__init__`
    - `make_driving_datapipe(...)`
    - `make_driving_datapipe_for_run_id(...)`
  - Removed assignment/forwarding of this flag.
  - Removed blackout branch after `insert_map_data(...)`.
  - Removed `insert_end_of_route_blackout` import.
- `wayve/ai/zoo/data/parking.py`
  - Deleted dead blackout helpers:
    - `_blackout_map_route_if_parking`
    - `insert_end_of_route_blackout`
- `wayve/ai/si/configs/parking/parking_config.py`
  - Removed `enable_end_of_route_blackout=False` from parking datamodule configs.
- `wayve/ai/si/test/data/sample_configs/bc/v30.yaml`
  - Removed `enable_end_of_route_blackout: false`.

## Validation
- Repo-wide search confirms no remaining references to:
  - `enable_end_of_route_blackout`
  - `insert_end_of_route_blackout`
