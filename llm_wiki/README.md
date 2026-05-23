---
title: Wayve MLE LLM Wiki
type: home
owner: Boris Indelman
created: 2026-05-23
updated: 2026-05-23
status: seed
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
- [[llm_wiki/systems/parking-and-pull-over|Parking and pull-over]] - focused working map for Boris's domain.
- [[llm_wiki/workflows/model-development-cycle|Model development cycle]] - idea-to-on-road workflow.

## Source layers

- `raw/` contains immutable source drops or pointers: Notion exports, GitHub diffs, Slack thread captures, skill docs, web clips, and assets.
- `sources/` contains one source-summary page per ingested source.
- `systems/`, `workflows/`, `maps/`, and `questions/` contain synthesized wiki pages that can be revised as new evidence arrives.

## Current scope

The first seed covers:

- End-to-end trajectory-prediction framing.
- World model pre-training.
- Behavioural cloning and offline RL in SI.
- Parking/PUDO/UNPUDO/unparking source maps.
- Model CI, Eval Studio, on-road experiment, and post-run analysis workflow hooks.
- How agents should ingest Notion, GitHub, Slack, and skill knowledge into durable wiki pages.

## Maintenance rule

Every meaningful ingest or durable query answer should update:

1. The touched content pages.
2. [[llm_wiki/index|index.md]].
3. [[llm_wiki/log|log.md]].

If a claim is not source-backed yet, mark it as `working synthesis` or add it to [[llm_wiki/questions/open-questions|Open questions]].
