---
title: Glossary
type: map
owner: Boris Indelman
created: 2026-05-23
updated: 2026-05-23
status: seed
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
| Model Catalogue | Service that stores and resolves model sessions, nicknames, checkpoints, artifacts, notes, and related metadata. Needs dedicated page. |
| Model CI | Automated evaluation/build pipeline attached to model artifacts. Needs dedicated page. |
| Eval Studio | Evaluation suite system used for scenario or suite executions. Needs dedicated page. |
| Shadow Gym | Evaluation environment referenced in Model CI debugging workflows. Needs dedicated page. |
| HiL | Hardware-in-the-loop testing, often important for on-device behavior and latency. |
| Interleave control | Deployment pattern where a variant model is interleaved with a control or routed by group/capability. |
| Surfboard | Training job platform referenced by skills and task logs. |
| W&B | Weights & Biases, used for metrics and visualization. |
| Hydra | Configuration system used by SI and WFM training. |
| Hydra-zen | Python config construction layer used in WFM config. |
