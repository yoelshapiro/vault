# Add enable_end_of_route_parking to parking wrapper on route-shortening branch

## Scope
- Branch: `boris/03-23-park-route-shortening-v2`
- File: `wayve/ai/zoo/deployment/deployment_wrapper.py`

## Change
Ported end-of-route parking behavior from `parking/training/pudo` into `ParkingDeploymentWrapperImpl`:
- Added init arg `enable_end_of_route_parking: bool = True`
- Added wrapper state:
  - `self.enable_end_of_route_parking`
  - `self.end_of_route_sum_thresh = 2e4`
- Added `_end_of_route_mask(map_route)` helper
- Updated `_add_driving_controls_inputs(...)` to OR parking mode with end-of-route mask when enabled
- Updated forward call to pass `map_route` into `_add_driving_controls_inputs`

## Status
- Local change only, uncommitted.
