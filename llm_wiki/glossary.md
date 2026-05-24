---
title: Glossary
type: map
owner: Boris Indelman
created: 2026-05-23
updated: 2026-05-24
status: active
tags:
  - llm-wiki
  - glossary
---

# Glossary

Use this as a quick decoder for wiki terms. If a term becomes central to a project, promote it into a dedicated page.

| Term | Working definition |
| --- | --- |
| AV | Autonomous vehicle or autonomous-driving system, depending on context. |
| BC | Behavioural cloning. SI-supported post-training stage that imitates expert or collected driving behavior. |
| RL | Reinforcement learning. In this wiki usually the offline RL stage after BC in driving model development. |
| WFM | Wayve Foundation Model. Pretraining/foundation-model layer used before downstream BC/RL or task-specific training. |
| SI | Scaled Intelligence code area under `/workspace/WayveCode/wayve/ai/si/`. |
| ST Transformer | Space-time transformer encoder used by the inspected SI/Zoo model path. |
| Input adaptor | Model module that turns a family of input keys into tokens for the space-time model. |
| Output adaptor | Module that attaches output heads such as waypoints, indicators, gear direction, and variance. |
| Head | A task-specific output module or branch. In multi-driving-head discussions, a mode-specific trajectory branch after a shared trunk. |
| Trajectory | The direct model output describing future ego motion. This is central because Wayve's stack is end-to-end. |
| DILC | Driver-initiated lane change: lane-change behavior triggered by the driver indicator/stalk request. |
| SILC | Software-initiated lane change: model-autonomous lane-change behavior controlled by `silc_mode` and `silc_level`; user-facing driving mode currently influences the level. |
| No-SILC | Evaluation or experiment setting where autonomous/SILC-style lane changes are suppressed or disabled, often to check whether the model avoids following an on-road lane-change intervention. |
| PUDO | Pick-up/drop-off. A short ride-hail-style stop behavior; it is not the same as parking. See [[llm_wiki/systems/parking-product-and-taxonomy]]. |
| UnPUDO | Leaving a PUDO stop and merging back into driving. Event pipeline pages use `unpudo` for starts that later have a PUDO in the same run. |
| Unparking | Leaving a parked or standstill state into driving. In the event pipeline, `unparking` is an UnPUDO-like start that does not later have a PUDO in the same run. |
| APA | Automatic Parking Assist: parking into a selected or inferred parking spot. |
| P2P | Park-to-park or parking-lot navigation behavior, including entry, search, exit, and destination-conditioned movement inside parking areas. |
| PSD | Parking Spot Detection, a perception-style capability for detecting parking spots. |
| MPA | Memory Parking Assist / memory parking. Repeated-route or visual-path parking behavior. |
| RMF | Risk Mitigation Function. Pull-over or stop-in-lane behavior for risk/fault mitigation; related to but not identical to PUDO. |
| Pull-over | Safe stopping or shoulder/curb pull-over behavior. In this wiki, still less sourced than PUDO and parking. |
| STOPPING_MODE | Current code enum: `0=UNAVAILABLE`, `1=PUDO`, `2=PARK`. Older notes may use legacy values. |
| PARKING_MODE | Conditioning key marking parking-style context. |
| Gear direction | Input/output signal for drive/reverse/park/neutral style behavior, important for parking deployment and shift-by-wire. |
| RouteMap | Raster/map-like route conditioning input used by the model. It can interact or conflict with navigation instructions. |
| Navigation instructions | Vectorized maneuver/lane/intersection guidance from MAR/route providers, used alongside RouteMap. |
| Route shortening | Parking/PUDO augmentation that truncates route context near a stop target so the map story matches the intended stop. |
| Datamodule | Training data configuration and loading component in SI. |
| Materialization | Process of producing dataset roots/buckets/tables used by training or evaluation. |
| Materialisation | UK spelling used by repo docs and Notion for the same concept as materialization. |
| OTF | On-the-fly loading. Training rows reference run/timestamp examples while tensors are fetched and assembled at load time. |
| Data key | Named tensor or value passed through dataloaders, model adaptors, and deployment interfaces. |
| DC | Data-collection or direct-control bucket family in parking materialization, generally non-AV event-window data. |
| CA | Corrective-action bucket family around interventions. |
| Pre-CA | Frames before a corrective action/intervention, usually still AV-owned. |
| Less-wrong | Counterfactual label/evaluation style that asks which model is less wrong on a known bad event. |
| Model Catalogue | Service that stores and resolves model sessions, nicknames, checkpoints, artifacts, notes, and related metadata. See [[llm_wiki/systems/deployment-and-model-catalogue]]. |
| Model CI | Automated evaluation/build pipeline attached to model artifacts. See [[llm_wiki/systems/evaluation-and-model-ci]]. |
| Eval Studio | Evaluation suite system used for scenario or suite executions. See [[llm_wiki/systems/evaluation-and-model-ci]]. |
| Shadow Gym | Open-loop replay/gym evaluation environment referenced in Model CI debugging workflows. It is not sufficient for latency or on-device risk by itself. |
| HiL | Hardware-in-the-loop testing, important for on-device behavior, latency, and deployment risk. |
| Interleaving | Deployment or experiment pattern where execution switches between models or policies by rule, group, or control assignment. |
| Interleave control | Model/experiment control mechanism for comparing or routing interleaved models. |
| Surfboard | Training job platform referenced by skills and task logs. |
| W&B | Weights & Biases, used for metrics and visualization. |
| Hydra | Configuration system used by SI and WFM training. |
| Hydra-zen | Python config construction layer used in WFM config. |
