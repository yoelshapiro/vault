# Parking config PR: add missing parking-wrapper nav/radar wiring

## Scope
Branch: `boris/03-23-parking-config-updates-v2`
PR: #102691

## Request
Add missing navigation/radar handling to parking deployment wrapper in this branch.

## Changes (uncommitted)
- Updated `wayve/ai/zoo/deployment/deployment_wrapper.py` (`ParkingDeploymentWrapperImpl`):
  - added `behavior_customization` + `deployment_driving_parameters_keys` in init.
  - initialized `BehaviorCustomizerProcessor`, `GroupedNavigationInputProcessor`, `IndicatorMemoryProcessor`.
  - extended driving control map with `DILC_MODE` and handled it in `_add_driving_controls_inputs`.
  - expanded `_forward_with_additional_inputs` signature to accept grouped navigation tensors + `driving_parameters`.
  - added grouped-navigation + radar input wiring before model forward.
  - added behavior/customization, indicator-memory, and navigation preprocess flow.
  - added indicator-memory postprocess after model forward.

## PR description
- Updated PR #102691 summary to mention the wrapper runtime wiring changes.

## Validation
- Not run.
