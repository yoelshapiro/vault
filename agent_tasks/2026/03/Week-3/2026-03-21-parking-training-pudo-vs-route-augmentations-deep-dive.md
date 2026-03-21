# 2026-03-21 — Deep Dive: `parking/training/pudo` vs `boris/train/pudo_route_augmentations`

## Context
Goal: investigate why new parking training behavior may be off, using `boris/train/pudo_route_augmentations` as the reference implementation.

Compared branches:
- Reference: `boris/train/pudo_route_augmentations`
- Current: `parking/training/pudo`
- Merge-base: `60a50e255b607211a9829f58986ea98d9fa30682`

Note: total branch diff is very large (repo-wide), so this analysis is scoped to parking training/deploy pipeline files.

## Relevant File Inventory

### Core parking data + OTF wiring
- `wayve/ai/zoo/data/parking.py`
- `wayve/ai/si/datamodules/otf.py`
- `wayve/ai/zoo/data/driving.py`
- `wayve/ai/zoo/data/keys.py`
- `wayve/ai/lib/data/pipes/augmentations/pre_intervention.py`
- `wayve/ai/lib/data/factory/tensors/augmentor_loaders/pre_intervention.py`

### Route map creation / shortening
- `wayve/ai/lib/data/pipes/routes.py`
- `wayve/ai/lib/routes.py`

### Training + losses + metrics
- `wayve/ai/si/models/training.py`
- `wayve/ai/si/losses/bc_loss_module.py`
- `wayve/ai/si/metrics/bc_metrics.py`

### Model/output heads
- `wayve/ai/zoo/outputs/gear_direction_output_head.py`
- `wayve/ai/zoo/outputs/output_adaptor.py`
- `wayve/ai/zoo/outputs/indicator_output_head.py` (unchanged between these branches)

### Deployment preparation + wrappers + exported interface
- `wayve/ai/si/models/deployment.py`
- `wayve/ai/si/deploy.py`
- `wayve/ai/zoo/deployment/deployment_wrapper.py`
- `wayve/ai/lib/interfaces.py`
- `wayve/ai/lib/interfaces_v2.py`

### Parking model config
- `wayve/ai/si/configs/parking/parking_config.py`

## What changed materially vs reference

### 1) OTF speed-signing behavior changed (high-risk)
In reference branch, `augment_gear_direction=True` implied speed signing (`sign_speed_by_gear_direction`) for unsigned speed data.

In current branch:
- signing is gated by a separate flag: `sign_speed_by_gear` (default `False`), and
- applies only when `add_gear_direction and sign_speed_by_gear`.

Impact:
- If datamodule/config sets `augment_gear_direction=True` but does not set `sign_speed_by_gear=True`, reverse samples can keep unsigned positive speed.
- This changes both parking detection dynamics and gear-augmentation behavior relative to reference.

### 2) `parking.py` implementation refactor (medium-risk)
- Reference relied on temporary data keys (`additional_parking_*`) prepared in OTF.
- Current version gathers columns directly from table via `gather_columns(indices=...)`.
- Added optional `STOPPING_MODE` generation (hazard heuristic + random outside parking window), default off unless enabled.
- Entry-index fallback behavior remains (`None` encoded as `-1`, with fallback-to-0 for shortening anchor when in parking mode and entry unavailable).

Impact:
- Route-shortening anchor semantics are largely preserved.
- New stopping-mode path exists and should be considered if/when enabled (currently off by default in OTF callsite).

### 3) Route-shortening function still carries speed-limit cardinality hazard (known issue)
`_shorten_route_polyline_to_stop` in `wayve/ai/lib/data/pipes/routes.py` remains effectively the same shape logic as reference, including interpolated-branch speed-limit handling that can produce route/speed cardinality mismatch.

Impact:
- Same potential mismatch issue exists in both branches unless separately fixed.

### 4) Deployment/interleave stack changed significantly (medium/high-risk for inference parity)
Current branch adds explicit interleave control plumbing across:
- `deploy.py` CLI args (`--enable_interleave_control`, `--interleave_control_group`)
- `prepare_deployment_model(...)` interleave validation and wrapper generation
- export of `deployment_config.interleave_group` for interface config
- wrapper logic in `deployment_wrapper.py` for interleave control + gear pass-through/clamping.

Impact:
- Inference behavior is no longer a pure parking-wrapper path; interleave gating and handover logic can alter on-vehicle behavior compared to reference.

### 5) Training/loss surface has drifted beyond parking-specific deltas (medium-risk)
Current `training.py` / loss stack includes multiple additions unrelated to route shortening:
- new loss terms in `bc_loss_module.py` (e.g. `ACCELERATION_INTERVAL`, `BEHAVIOR_UNCONDITIONED_GEAR_DIRECTION`)
- additional metrics/callback paths
- parking mode now enabling interleave control in `to_deployable_model`.

Impact:
- Even with same data, optimization pressure differs from reference due to expanded loss terms / behavior-unconditioned gear path.

### 6) Parking config changed (data mix + new mode)
`parking_config.py` now includes:
- extra datamodule config (`parking_bc_datamodule_D26_1_0_cfg`)
- new model mode `parking_bc_train_release_2026_5_11`
- updated bucket roots/weights and additional release wiring.

Impact:
- Data composition differs from reference branch unless explicitly matched.

## Direct answer to “what’s relevant for parking training”
Beyond the original list (`parking.py`, `training.py`, `otf.py`, `parking_config.py`, `deployment_wrapper.py`, `deployment.py`, `deploy.py`, `routes.py`, gear/indicator/losses, pre-intervention), these are also required for complete parity debugging:
- `wayve/ai/zoo/data/driving.py` (gear insertion/signing path changed)
- `wayve/ai/zoo/data/keys.py` (new keys used by losses/outputs)
- `wayve/ai/lib/interfaces_v2.py` (interleave group export to gen2 interface)
- `wayve/ai/zoo/outputs/output_adaptor.py` and `gear_direction_output_head.py` (output wiring/head behavior)
- `wayve/ai/lib/routes.py` (route-map/rendering behavior)

## Most likely “something is off” candidates to check first
1. `sign_speed_by_gear` not enabled while expecting reference behavior from `augment_gear_direction`.
2. Data bucket/root mismatch vs reference run setup.
3. Interleave/deployment wrapper behavior differences affecting deployed eval vs training expectations.
4. Added loss terms (especially behavior-unconditioned gear) shifting optimization.

