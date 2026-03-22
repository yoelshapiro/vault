# 2026-03-22 — Parking wrapper selection + preprocess parity fix

## Context
Parking-capable deploys on `parking/training/pudo` were not consistently using `ParkingDeploymentWrapperImpl`, and the parking wrapper had lost behavior/navigation preprocessing parity with the previously validated branch.

## Branch
- Working branch: `parking/training/pudo`
- Compared against: `boris/train/pudo_route_augmentations`

## What changed
- Restored behavior/navigation preprocessing inside `ParkingDeploymentWrapperImpl`:
  - Added `BehaviorCustomizerProcessor`, `GroupedNavigationInputProcessor`, and `IndicatorMemoryProcessor` wiring in `__init__`.
  - Restored required parking forward inputs: `driving_parameters` + grouped navigation tensors.
  - Added grouped navigation tensor insertion and preprocess/postprocess calls around model forward.
  - Added `DILC_MODE` key handling as a no-op in parking controls parsing.
- Fixed wrapper selection precedence in `prepare_deployment_model`:
  - Prioritized `enable_parking` before the generic `use_behavior_control_input and use_navigation_instructions` branch.
  - Ensured parking wrapper receives behavior customization + driving parameter/control key metadata.

## Why bypass happened
`prepare_deployment_model` evaluated wrapper branches top-to-bottom. Since parking models also satisfy `use_behavior_control_input and use_navigation_instructions`, they matched that earlier branch and never reached `enable_parking`.

## Validation
- `python -m py_compile wayve/ai/zoo/deployment/deployment_wrapper.py wayve/ai/si/models/deployment.py` ✅
