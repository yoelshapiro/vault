---
title: Notion Discovery - Parking, Evaluation, and Pull-over Pointers
type: source
owner: Boris Indelman
created: 2026-05-23
updated: 2026-05-23
status: partial
tags:
  - llm-wiki
  - notion
  - parking
  - evaluation
source_type: notion
source_ref: workspace search snippets and timed-out fetch attempts
---

# Notion Discovery - Parking, Evaluation, and Pull-over Pointers

## Source Metadata

- Source type: Notion workspace search results.
- Retrieved: 2026-05-23.
- Confidence: low to medium. These are search-result highlights and page titles, not full page ingests.
- Fetch status: several high-value pages timed out via the Notion connector.

## Why This Matters

The user asked the wiki to use Notion as a prime knowledge source. The connector successfully fetched [[llm_wiki/sources/2026-05-23-notion-training-driving-model|Training a Driving Model]], but timed out on multiple parking and evaluation pages. This page preserves the discovered sources so future ingests do not repeat discovery.

## Discovered Pages

| Page | Page id | Use |
| --- | --- | --- |
| `Parking/PUDO Model Development and Deployment (SI)` | `2d303da5-d69a-800c-8956-cfd9ccaaa8dc` | Likely canonical parking/PUDO development and deployment workflow. Fetch timed out. |
| `[Documentation] Generic Materialisation` | `30a03da5-d69a-804c-8598-c64c193d287d` | Likely canonical materialisation workflow. Fetch timed out. |
| `Parking/PUDO model release page` | `30303da5-d69a-80da-92d5-e0a7f8fa38bf` | Release rows and model candidate tracking. |
| `Parking Model Handover` | `34503da5-d69a-801a-9999-d9a0e07da7eb` | Operational handover context. |
| `Stopping Mode Conditioning` | `31203da5-d69a-8181-bcca-f16aa0ff9316` | Pull-over/PUDO/PARK intent conditioning. Fetch timed out. |
| `PUDO (Pick-Up/Drop-Off) US SOP` | `31e03da5-d69a-8006-a0b4-dacd377021e0` | Product and operational PUDO definition. Fetch timed out. |
| `Shadow Gym` | `ca4a35ac-9463-4831-a16a-f035778fae48` | Shadow Gym docs and limitations. |
| `Eval Studio Intro user follow along doc` | `2b103da5-d69a-804d-b664-f115108fb9f1` | Eval Studio usage. |
| `How to interpret the Eval Studio Model Scorecard` | `34b03da5-d69a-8030-8f17-c5ad7dc595e9` | Model scorecard interpretation. |
| `Driving Model Baseline Release Process` | `1fc03da5-d69a-8027-8763-e76b4c228e50` | Baseline release gating process. |
| `Reward models for autonomous driving` | `11103da5-d69a-8063-b694-e30e5816b4e2` | RL reward context. |

## Search-Result Knowledge

- Parking/PUDO development snippets mention model deployment, model inspection, model licensing, Shadow Gym, RL baselines/candidates, and Console Model Search.
- Generic Materialisation snippets point to the SI materialisation command shape: `bazel run //wayve/ai/si/materialisation:workflow --`.
- Stopping-mode snippets mention `_enable_stopping_mode`, `cfg.training_module.model.input_config.stopping_mode = True`, dropout, and a naive heuristic that maps hazard to PUDO and no hazard to PARK.
- PUDO SOP snippets describe a robotaxi task where the vehicle safely pulls over to pick up a passenger, drives to the destination, and safely pulls over again.
- Shadow Gym snippets say it is open loop and not sensitive to inference latency; high-latency models may therefore look better in Shadow Gym than on device.
- Eval Studio snippets say model scorecards compare models against test suites.

## Affected Wiki Pages

- [[llm_wiki/systems/parking-and-pull-over|Parking and pull-over]]
- [[llm_wiki/systems/evaluation-and-model-ci|Evaluation and Model CI]]
- [[llm_wiki/systems/deployment-and-model-catalogue|Deployment and Model Catalogue]]
- [[llm_wiki/workflows/parking-development-workflow|Parking development workflow]]
- [[llm_wiki/questions/open-questions|Open questions]]

## Contradictions or Changes

- The search snippets are not enough to settle authoritative product definitions. Do not treat this page as proof of final PUDO or pull-over acceptance criteria.
- A legacy stopping-mode newsletter uses an older enum; current code should win for implementation facts. See [[llm_wiki/sources/2026-05-23-code-data-materialisation-and-parking|Code - Data Materialisation and Parking]].

## Open Questions

- Retry full Notion fetches for all pages above.
- Find the active release page data source schema and record the properties used by parking training/deploy workflows.
- Fetch the current PUDO SOP and use it to distinguish PUDO from robotaxi pull-over in product terms.
