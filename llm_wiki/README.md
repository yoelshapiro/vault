---
title: Wayve MLE LLM Wiki
type: home
owner: Boris Indelman
created: 2026-05-23
updated: 2026-05-24
status: active
tags:
  - llm-wiki
  - wayve
  - mle
---

# Wayve MLE LLM Wiki

This is a persistent, LLM-maintained wiki for understanding how Wayve develops end-to-end driving models, with a focus on parking, PUDO, UnPUDO, unparking, and robotaxi pull-over capabilities.

The wiki is meant to help both a human MLE and coding agents get oriented quickly. Raw sources stay immutable. Source summaries capture what a source says. System and workflow pages turn those sources into durable, cross-linked explanations.

## Newcomer Start

If you are new, do not start from the full index. Start here:

1. [[llm_wiki/workflows/newcomer-onboarding|Newcomer Onboarding]] - ordered first-hour, first-day, first-week path.
2. [[llm_wiki/maps/mle-role-map|MLE Role Map]] - what an MLE owns and where the handoffs are.
3. [[llm_wiki/glossary|Glossary]] - vocabulary for model, data, parking, and evaluation terms.
4. [[llm_wiki/systems/end-to-end-driving-stack|End-To-End Driving Stack]] - big-picture architecture.
5. [[llm_wiki/systems/parking-and-pull-over|Parking And Pull-Over]] - parking/PUDO domain hub.
6. [[llm_wiki/workflows/first-parking-pudo-change|First Parking PUDO Change]] - practical checklist for a first change.

## Main Catalogs

- [[llm_wiki/index|Index]] - full catalog of maintained pages.
- [[llm_wiki/log|Log]] - chronological record of ingests, queries, and lint passes.
- [[llm_wiki/AGENTS|Agent Operating Guide]] - rules future Codex sessions should follow when maintaining this wiki.
- [[llm_wiki/maps/codebase-map|Codebase Map]] - WayveCode entry points for model-development work.
- [[llm_wiki/maps/knowledge-sources|Knowledge Sources]] - Notion, Drive, Slack, GitHub, skills, and local vault sources.

## Core Reading Path

For general model development:

- [[llm_wiki/workflows/model-development-cycle|Model Development Cycle]]
- [[llm_wiki/systems/world-model-pretraining|World Model Pretraining]]
- [[llm_wiki/systems/bc-rl-training|BC And RL Training]]
- [[llm_wiki/systems/space-time-model-architecture|Space-Time Model Architecture]]
- [[llm_wiki/systems/model-vehicle-interface|Model Vehicle Interface]]
- [[llm_wiki/systems/evaluation-and-model-ci|Evaluation And Model CI]]
- [[llm_wiki/systems/deployment-and-model-catalogue|Deployment And Model Catalogue]]

For parking/PUDO work:

- [[llm_wiki/systems/parking-product-and-taxonomy|Parking Product And Taxonomy]]
- [[llm_wiki/systems/parking-pudo-event-pipeline|Parking PUDO Event Pipeline]]
- [[llm_wiki/systems/parking-data-and-labels|Parking Data And Labels]]
- [[llm_wiki/systems/parking-model-architecture|Parking Model Architecture]]
- [[llm_wiki/systems/parking-pudo-deployment-and-release|Parking PUDO Deployment And Release]]
- [[llm_wiki/workflows/parking-development-workflow|Parking Development Workflow]]

For newer architecture context:

- [[llm_wiki/systems/navigation-conditioning|Navigation Conditioning]]
- [[llm_wiki/systems/latent-actions-and-behavior-control|Latent Actions And Behavior Control]]
- [[llm_wiki/systems/multi-task-and-multi-driving-heads|Multi-Task And Multi-Driving Heads]]

## Source Layers

- `raw/` contains immutable source drops or pointers: Notion exports, GitHub diffs, Slack thread captures, skill docs, web clips, and assets.
- `sources/` contains one source-summary page per ingested source or source bundle.
- `systems/`, `workflows/`, `maps/`, and `questions/` contain synthesized wiki pages that can be revised as new evidence arrives.

## Current Caveats

- Pull-over/RMF is represented through parking/PUDO product docs and RMF integration notes, but still needs a dedicated pull-over SOP/design source before strong claims are made.
- Slack has not yet been systematically source-summarized into this wiki.
- Multi-driving-head pages are proposal/prototype synthesis unless tied to a specific code path, PR, or release.
- Taxonomy can change. Prefer the latest spreadsheet/source summary over older proposal pages marked outdated.

## Maintenance Rule

Every meaningful ingest or durable query answer should update:

1. The touched content pages.
2. [[llm_wiki/index|index.md]].
3. [[llm_wiki/log|log.md]].

If a claim is not source-backed yet, mark it as `working synthesis` or add it to [[llm_wiki/questions/open-questions|Open Questions]].
