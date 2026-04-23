# Parking routing port into kangaroo route-shorten

## Context
Port selected parking-training features from `boris/parking-training-pudo-unpark-routing` into `boris/training/kangaroo_with_50_and_route_shorten` without wholesale branch cherry-picking.

Requested scope:
- copy the full SI parking datamodule implementation from `wayve/ai/si/datamodules/parking.py`
- bring over route shortening changes in `wayve/ai/lib/data/pipes/routes.py`, including extended unparking shortening
- wire the feature set through `wayve/ai/si/datamodules/otf.py`
- keep the SI parking config surface for:
  - `reconstruct_gear_from_speed`
  - `parking_goal_dropout_probability`
  - `parked_unparking_prob`
  - `unparking_gear_augment_prob`
  - `enable_stopping_mode`
  - `enable_end_of_route_blackout`
  - `enable_route_shortening_for_parking`
  - `enable_early_path_gating`
  - `enable_strip_leading_standstill`
  - `enable_augment_standstill_gear`
- enable short-path handling with `allow_short_path=True`

## Changes
- Added the SI parking datamodule implementation at [wayve/ai/si/datamodules/parking.py](/workspace/WayveCode/wayve/ai/si/datamodules/parking.py), including `ParkingDataConfig`, SI parking augmentation flow, route-shortening helpers, and short-path bucket flagging.
- Added a dedicated Bazel target for the SI parking datamodule in [wayve/ai/si/datamodules/BUILD](/workspace/WayveCode/wayve/ai/si/datamodules/BUILD).
- Rewired [wayve/ai/si/datamodules/otf.py](/workspace/WayveCode/wayve/ai/si/datamodules/otf.py) to use the SI parking datamodule path, pass `ParkingDataConfig`, enable optional early-path gating, wire short-path clamping, and emit route-shortening stop anchors before map generation.
- Extended [wayve/ai/lib/data/pipes/routes.py](/workspace/WayveCode/wayve/ai/lib/data/pipes/routes.py) to shorten route polylines both:
  - to the stop point for parking
  - from the stop point for unparking
- Extended [wayve/ai/lib/data/pipes/paths.py](/workspace/WayveCode/wayve/ai/lib/data/pipes/paths.py) with `clamp_out_of_range_data_key` so parking buckets can clamp short paths instead of failing immediately on out-of-range path interpolation.
- Updated [wayve/ai/si/configs/parking/parking_config.py](/workspace/WayveCode/wayve/ai/si/configs/parking/parking_config.py) to instantiate `ParkingDataConfig`, keep SI parking capabilities enabled, and set `allow_short_path=True`.

## Key wiring details
- `ParkingDataConfig` now exposes the requested SI parking knobs with defaults preserved in the dataclass.
- The active parking config sets:
  - `use_zoo_dataloader=False`
  - `reconstruct_gear_from_speed=True`
  - `enable_route_shortening_for_parking=True`
  - `allow_short_path=True`
  - `enable_strip_leading_standstill=True`
  - `enable_augment_standstill_gear=True`
  - `parked_unparking_prob=0.5`
  - `unparking_gear_augment_prob=1.0`
- OTF now applies bucket-based short-path clamping before path loading and computes stop-route anchors before route-map generation.
- Route generation now supports both parking suffix clipping and unparking prefix clipping.

## Validation
- `python -m py_compile` passed for:
  - `wayve/ai/si/datamodules/parking.py`
  - `wayve/ai/lib/data/pipes/paths.py`
  - `wayve/ai/lib/data/pipes/routes.py`
  - `wayve/ai/si/datamodules/otf.py`
  - `wayve/ai/si/configs/parking/parking_config.py`
- Started `bazel build //wayve/ai/si/datamodules:parking //wayve/ai/si/datamodules:otf` on the target branch. At note time the build was still progressing through the transitive graph and had not failed fast on the ported code.

## Notes
- The copied SI parking module needed one compatibility patch against this branch's older zoo fallback API: removed `store_entry_index` from the zoo delegation call because the local zoo `insert_parking_data` signature does not accept it.
- Unrelated local workspace changes existed before the port and were left untouched.
