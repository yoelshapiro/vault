---
title: Wayve MLE LLM Wiki
type: home
owner: Boris Indelman
created: 2026-05-23
updated: 2026-05-23
status: active
tags:
  - llm-wiki
  - wayve
  - mle
---

# Wayve MLE LLM Wiki

This is a persistent, LLM-maintained wiki for understanding how Wayve develops end-to-end driving models, with a focus on parking and robotaxi pull-over capabilities.

The wiki is meant to compound across sessions. Raw sources stay immutable. The LLM-maintained pages synthesize them into a code-aware, source-cited map of model architecture, training, evaluation, deployment, on-road testing, and day-to-day development workflows.

## Start here

- [[llm_wiki/index|Index]] - catalog of maintained pages.
- [[llm_wiki/log|Log]] - chronological record of ingests, queries, and lint passes.
- [[llm_wiki/AGENTS|Agent operating guide]] - rules future Codex sessions should follow when maintaining this wiki.
- [[llm_wiki/maps/codebase-map|Codebase map]] - current WayveCode entry points for the model-development stack.
- [[llm_wiki/systems/end-to-end-driving-stack|End-to-end driving stack]] - high-level architecture narrative.
- [[llm_wiki/systems/model-vehicle-interface|Model-vehicle interface]] - robot/model input-output contract.
- [[llm_wiki/systems/space-time-model-architecture|Space-time model architecture]] - adaptors, ST encoder, and output heads.
- [[llm_wiki/systems/data-and-materialisation|Data and materialisation]] - corpus, buckets, materialised roots, and OTF loading.
- [[llm_wiki/systems/parking-and-pull-over|Parking and pull-over]] - focused working map for Boris's domain.
- [[llm_wiki/systems/parking-data-and-labels|Parking data and labels]] - event taxonomy and label semantics.
- [[llm_wiki/systems/evaluation-and-model-ci|Evaluation and Model CI]] - evaluation layers and limitations.
- [[llm_wiki/workflows/model-development-cycle|Model development cycle]] - idea-to-on-road workflow.
- [[llm_wiki/workflows/parking-development-workflow|Parking development workflow]] - capability loop for parking/PUDO work.

## Source layers

- `raw/` contains immutable source drops or pointers: Notion exports, GitHub diffs, Slack thread captures, skill docs, web clips, and assets.
- `sources/` contains one source-summary page per ingested source.
- `systems/`, `workflows/`, `maps/`, and `questions/` contain synthesized wiki pages that can be revised as new evidence arrives.

## Current scope

The current wiki covers:

- End-to-end trajectory-prediction framing.
- Robot/model interface and mandatory output keys.
- Space-time model architecture: input adaptors, ST encoder, output adaptor, and heads.
- Materialisation, bucket mixes, OTF data loading, and parking label insertion.
- World model pre-training.
- Behavioural cloning and offline RL in SI.
- Parking/PUDO/UNPUDO/unparking taxonomy, data, labels, model IO, and deployment checks.
- Model CI, Eval Studio, on-road experiment, and post-run analysis workflow hooks.
- How agents should ingest Notion, GitHub, Slack, and skill knowledge into durable wiki pages.

## Current caveats

- Several high-value Notion pages were discovered but timed out during fetch; they are tracked in [[llm_wiki/sources/2026-05-23-notion-discovery-parking-evaluation|Notion discovery - parking, evaluation, and pull-over pointers]].
- Slack public search also timed out in this pass, so no Slack thread has been source-summarized yet.
- Pull-over is in scope but remains under-specified until a product/SOP source is ingested. Do not treat PUDO evidence as automatically proving pull-over behavior.

## Maintenance rule

Every meaningful ingest or durable query answer should update:

1. The touched content pages.
2. [[llm_wiki/index|index.md]].
3. [[llm_wiki/log|log.md]].

If a claim is not source-backed yet, mark it as `working synthesis` or add it to [[llm_wiki/questions/open-questions|Open questions]].
