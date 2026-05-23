---
title: Glossary
type: map
owner: Boris Indelman
created: 2026-05-23
updated: 2026-05-23
status: active
tags:
  - llm-wiki
  - glossary
---

# Glossary

Seed glossary for terms used in the wiki. Expand each term into a dedicated page when it becomes central.

| Term | Working definition |
| --- | --- |
| BC | Behavioural cloning. SI-supported training stage after WFM pre-training. |
| RL | Reinforcement learning. In this wiki usually offline RL for driving model improvement after BC. |
| WFM | Wayve Foundation Model, trained in the world-model code area. |
| SI | Scaled Intelligence code area under `/workspace/WayveCode/wayve/ai/si/`. |
| PUDO | Pick-up/drop-off parking-related capability area. Exact operational definition should be sourced from Notion or code. |
| UNPUDO | Un-pick-up/drop-off or departure-from-PUDO capability area. Exact operational definition should be sourced. |
| Unparking | Leaving a parked or standstill state into driving. Exact event taxonomy should be sourced. |
| Pull-over | Robotaxi pull-over capability. Source gap in this seed. |
| Datamodule | Training data configuration and loading component in SI. |
| Materialization | Process of producing dataset roots/buckets/tables used by training or evaluation. |
| Materialisation | UK spelling used by repo docs and Notion for materialized dataset workflows. Same concept as Materialization. |
| OTF | On-the-fly loading. Training rows reference run/timestamp examples while tensors are fetched and assembled at load time. |
| Data key | Named tensor or value passed through dataloaders, model adaptors, and deployment interfaces. |
| Input adaptor | Model module that turns one family of input keys into tokens for the space-time model. |
| ST Transformer | Space-time transformer encoder used by the inspected SI/Zoo model path. |
| Output adaptor | Module that attaches output heads such as waypoints, indicators, gear direction, and variance. |
| STOPPING_MODE | Current code enum: `0=UNAVAILABLE`, `1=PUDO`, `2=PARK`. Older notes may use legacy values. |
| PARKING_MODE | Boolean-ish conditioning key marking parking-style context. |
| Gear direction | Input/output signal for drive/reverse/park/neutral style behavior, important for parking deployment. |
| DC | Direct-control data bucket family in parking materialisation. |
| CA | Corrective action bucket family around interventions. |
| Pre-CA | Frames before a corrective action/intervention, usually still AV-owned. |
| Model Catalogue | Service that stores and resolves model sessions, nicknames, checkpoints, artifacts, notes, and related metadata. See [[llm_wiki/systems/deployment-and-model-catalogue|Deployment and Model Catalogue]]. |
| Model CI | Automated evaluation/build pipeline attached to model artifacts. See [[llm_wiki/systems/evaluation-and-model-ci|Evaluation and Model CI]]. |
| Eval Studio | Evaluation suite system used for scenario or suite executions. See [[llm_wiki/systems/evaluation-and-model-ci|Evaluation and Model CI]]. |
| Shadow Gym | Open-loop replay/gym evaluation environment referenced in Model CI debugging workflows. It is not sufficient for latency risk by itself. |
| HiL | Hardware-in-the-loop testing, often important for on-device behavior and latency. |
| Interleave control | Deployment pattern where a variant model is interleaved with a control or routed by group/capability. |
| Surfboard | Training job platform referenced by skills and task logs. |
| W&B | Weights & Biases, used for metrics and visualization. |
| Hydra | Configuration system used by SI and WFM training. |
| Hydra-zen | Python config construction layer used in WFM config. |
