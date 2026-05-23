---
title: Code - Model Interface and Space-Time Architecture
type: source
owner: Boris Indelman
created: 2026-05-23
updated: 2026-05-23
status: active
tags:
  - llm-wiki
  - code
  - model-interface
  - architecture
source_type: code
source_ref: /workspace/WayveCode/wayve/ai/lib and /workspace/WayveCode/wayve/ai/zoo
---

# Code - Model Interface and Space-Time Architecture

## Source Metadata

- Source type: local code in `/workspace/WayveCode`.
- Retrieved: 2026-05-23.
- Inspected paths:
  - `/workspace/WayveCode/wayve/ai/lib/interfaces_v2.py`
  - `/workspace/WayveCode/wayve/ai/zoo/st/models.py`
  - `/workspace/WayveCode/wayve/ai/zoo/outputs/output_adaptor.py`
  - `/workspace/WayveCode/wayve/ai/zoo/outputs/waypoints_heads.py`
  - `/workspace/WayveCode/wayve/ai/si/models/training.py`
  - `/workspace/WayveCode/wayve/ai/si/models/deployment.py`

## Why This Matters

These paths define the concrete implementation shape behind the wiki's end-to-end driving model story: valid robot inputs/outputs, model tokenization, space-time encoding, output heads, training module, and deployment wrapper.

## Key Facts

- `interfaces_v2.py` defines valid input and output keys for deployable models and describes the robot/model interface.
- Example inputs include camera images/timestamps/intrinsics/extrinsics/distortion, vehicle speed/curvature/pose, map route, and map speed limit.
- Mandatory output keys include policy time delta, indicator weights, waypoints, and waypoint covariances.
- `MIMOSTTransformer` in `zoo/st/models.py` is a multi-input multi-output space-time transformer that maps a dictionary of input tensors to a dictionary of output tensors.
- The high-level model flow is input adaptor to `[B, T, N, C]` tokens, ST encoder to output tokens, optional radar late-fusion tokens, then output adaptor heads.
- `build_space_time_model` wires input adaptors from config flags, including video, route, indicator, speed, curvature, speed limit, pose, country, driving side, waypoints, parking mode, gear direction, mitigation request, stopping mode, and radar/lidar variants.
- `OutputAdaptor` owns the driving heads. It always includes waypoint and indicator outputs, and can include gear direction, waypoint variance/covariance, behavior-control and latent-action heads, vehicle dynamics heads, and other auxiliary heads.
- `WaypointsViaRatesOutputHead` predicts rates and integrates them to poses/waypoints. `WaypointOutputHead` directly projects tokens to waypoints, with variants for delta/cumsum and limited outputs.
- `BcTrainingModule` is the SI PyTorch Lightning training module and includes callbacks for checkpoint upload, Console monitoring, Shadow Gym, data module checkpointing, visualization, radar missing checks, and parking metrics when configured.
- `prepare_deployment_model` wraps a trained module for deployment and selects parking deployment wrappers when requested.

## Workflow Knowledge

- When debugging whether a model can drive on robot, first inspect the deployed artifact's recorded input and output keys against `interfaces_v2.py`.
- When adding a new capability-specific condition, check whether it belongs as an input adaptor, an output head, a loss term, or deployment wrapper logic.
- Parking deployment paths validate gear-direction support when a wrapper requires gear prediction. This prevents silent deployment of a parking model that cannot provide expected gear behavior.

## Affected Wiki Pages

- [[llm_wiki/systems/model-vehicle-interface|Model-vehicle interface]]
- [[llm_wiki/systems/space-time-model-architecture|Space-time model architecture]]
- [[llm_wiki/systems/parking-model-architecture|Parking model architecture]]
- [[llm_wiki/systems/deployment-and-model-catalogue|Deployment and Model Catalogue]]

## Contradictions or Changes

- Some Notion training docs refer to older code paths. Prefer these inspected paths for current implementation facts.

## Open Questions

- Which exact release config should be used as the canonical architecture graph?
- Which outputs are required by each target platform artifact beyond the mandatory policy keys?
