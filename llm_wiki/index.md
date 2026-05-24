---
title: LLM Wiki Index
type: index
owner: Boris Indelman
created: 2026-05-23
updated: 2026-05-24
status: active
tags:
  - llm-wiki
---

# LLM Wiki Index

Read this page first when navigating the wiki. It deliberately uses grouped bullet lists instead of Markdown tables because Obsidian link aliases use `|`, which can break table rendering.

## Core Route

Start here for most model-development questions:

1. [[llm_wiki/README|Home]] - front door and current caveats.
2. [[llm_wiki/systems/end-to-end-driving-stack|End-to-end driving stack]] - high-level model-development map.
3. [[llm_wiki/systems/model-vehicle-interface|Model-vehicle interface]] - robot/model input-output contract.
4. [[llm_wiki/systems/space-time-model-architecture|Space-time model architecture]] - adaptors, ST encoder, output adaptor, and heads.
5. [[llm_wiki/systems/data-and-materialisation|Data and materialisation]] - corpus rows, buckets, OTF loading, and training batches.
6. [[llm_wiki/systems/parking-and-pull-over|Parking and pull-over]] - Boris's main domain hub.
7. [[llm_wiki/workflows/parking-development-workflow|Parking development workflow]] - practical capability loop from failure to data/model/eval/on-road analysis.

## Home and Operations

- [[llm_wiki/README|Home]] - front door for the Wayve MLE LLM wiki.
- [[llm_wiki/AGENTS|Agent operating guide]] - Codex-facing maintenance rules, source discipline, and ingest/query/lint workflows.
- [[llm_wiki/index|Index]] - this navigation page.
- [[llm_wiki/log|Log]] - chronological record of ingests, queries, lint passes, and maintenance.
- [[llm_wiki/raw/README|Raw source guide]] - how immutable source drops and pointers should be stored.
- [[llm_wiki/sources/README|Source summaries guide]] - how source-summary pages are named and maintained.

## Raw Source Guides

- [[llm_wiki/raw/notion/README|Raw Notion guide]] - where Notion exports and pointers belong.
- [[llm_wiki/raw/github/README|Raw GitHub guide]] - where PR, issue, diff, and commit source drops belong.
- [[llm_wiki/raw/slack/README|Raw Slack guide]] - where Slack thread captures and pointers belong.
- [[llm_wiki/raw/skills/README|Raw skills guide]] - where skill-source pointers belong.
- [[llm_wiki/raw/assets/README|Raw assets guide]] - where local images, diagrams, and source attachments belong.

## Maps

- [[llm_wiki/maps/codebase-map|Codebase map]] - current entry points in WayveCode for WFM, SI, parking, evaluation, deployment, and data tools.
- [[llm_wiki/maps/knowledge-sources|Knowledge sources]] - how Notion, GitHub, Slack, skills, and vault notes should feed the wiki.

## Systems

- [[llm_wiki/systems/end-to-end-driving-stack|End-to-end driving stack]] - high-level Wayve driving-model stack from WFM pre-training through BC/RL and deployment.
- [[llm_wiki/systems/model-vehicle-interface|Model-vehicle interface]] - how robot/data inputs become model input keys, adaptors, outputs, and deployment wrapper expectations.
- [[llm_wiki/systems/space-time-model-architecture|Space-time model architecture]] - input adaptors, ST encoder, output adaptor, and heads used by the current SI/Zoo driving model path.
- [[llm_wiki/systems/data-and-materialisation|Data and materialisation]] - corpus rows, materialised roots, buckets, OTF loading, and training batch assembly.
- [[llm_wiki/systems/world-model-pretraining|World model pre-training]] - WFM code structure, config model, training workflow, experiments, and validation hooks.
- [[llm_wiki/systems/bc-rl-training|BC and RL training]] - SI training path, Hydra modes, datamodules, control-model checks, Model CI, and interleaving.
- [[llm_wiki/systems/parking-and-pull-over|Parking and pull-over]] - parking/PUDO/UNPUDO/unparking map plus robotaxi pull-over source gaps.
- [[llm_wiki/systems/parking-data-and-labels|Parking data and labels]] - event taxonomy, parking/PUDO labels, bucket families, and notebook/generic materialisation differences.
- [[llm_wiki/systems/parking-model-architecture|Parking model architecture]] - parking-specific model inputs, heads, losses, release alignment, and deployment checks.
- [[llm_wiki/systems/evaluation-and-model-ci|Evaluation and Model CI]] - Model CI, Eval Studio, Shadow Gym, AV test, HiL, on-road, and event-analysis roles.
- [[llm_wiki/systems/deployment-and-model-catalogue|Deployment and Model Catalogue]] - model identity chain from training checkpoint through deployed artifact, notes, CI, and on-road use.

## Workflows

- [[llm_wiki/workflows/model-development-cycle|Model development cycle]] - idea-to-on-road lifecycle for model work.
- [[llm_wiki/workflows/training-a-driving-model|Training a driving model]] - SI training preflight, local debug, remote submission, monitoring, and checkpoint handoff.
- [[llm_wiki/workflows/parking-development-workflow|Parking development workflow]] - parking/PUDO capability loop from failure definition to data, model, training, evaluation, road, and analysis.
- [[llm_wiki/workflows/on-road-experiment-workflow|On-road experiment workflow]] - requirements and guardrails for interleaved on-road and BRT experiments.
- [[llm_wiki/workflows/wiki-ingest-workflow|Wiki ingest workflow]] - step-by-step source import and synthesis procedure.
- [[llm_wiki/workflows/wiki-query-workflow|Wiki query workflow]] - how to answer questions from the wiki and file durable answers.
- [[llm_wiki/workflows/wiki-lint-workflow|Wiki lint workflow]] - health checks for stale, contradictory, or orphaned knowledge.
- [[llm_wiki/workflows/agent-skill-map|Agent skill map]] - relevant local skills for model lookup, training, deployment, evaluation, parking analysis, and PR work.
- [[llm_wiki/workflows/wiki-health-review-2026-05-23|Wiki health review - 2026-05-23]] - coverage review, remaining gaps, and next lint steps after the expansion pass.

## Questions and Glossary

- [[llm_wiki/questions/open-questions|Open questions]] - source gaps and research queue for the wiki.
- [[llm_wiki/glossary|Glossary]] - acronyms, systems, and terms used by the wiki.

## Source Summaries

- [[llm_wiki/sources/2026-05-23-notion-training-driving-model|Notion - Training a Driving Model]] - fetched Notion page covering end-to-end driving model basics, interface, data, BC training, and Console upload.
- [[llm_wiki/sources/2026-05-23-notion-discovery-parking-evaluation|Notion discovery - parking, evaluation, and pull-over pointers]] - search-result inventory of high-value Notion pages that still need full fetches.
- [[llm_wiki/sources/2026-05-23-code-model-interface-and-st-architecture|Code - model interface and ST architecture]] - inspected code for model inputs/outputs, ST model, output adaptor, training module, and deployment wrapper.
- [[llm_wiki/sources/2026-05-23-code-data-materialisation-and-parking|Code - data materialisation and parking]] - inspected SI materialisation, OTF datamodule, parking data config, and parking/stopping/gear adaptors.
- [[llm_wiki/sources/2026-05-23-vault-parking-newsletters|Vault parking newsletters]] - existing vault writeups on generic parking/PUDO materialisation, stopping mode, release deltas, and maneuver filters.
- [[llm_wiki/sources/2026-05-23-skill-workflows-parking-model-lifecycle|Skill workflows - parking model lifecycle]] - local skills for parking training, deployment, evaluation, model lookup, event analysis, and on-road experiments.

## Templates

- [[llm_wiki/templates/source-summary|Source summary template]] - template for one ingested source.
- [[llm_wiki/templates/entity-page|Entity page template]] - template for a model, dataset, tool, or component page.
- [[llm_wiki/templates/query-note|Query note template]] - template for durable answers generated from questions.
- [[llm_wiki/templates/run-ledger|Run ledger template]] - template for experiment-heavy debugging summaries.
