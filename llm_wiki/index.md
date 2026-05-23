---
title: LLM Wiki Index
type: index
owner: Boris Indelman
created: 2026-05-23
updated: 2026-05-23
status: active
tags:
  - llm-wiki
---

# LLM Wiki Index

Read this page first when navigating the wiki.

## Home and Operations

| Page | Summary |
| --- | --- |
| [[llm_wiki/README|Home]] | Front door for the Wayve MLE LLM wiki. |
| [[llm_wiki/AGENTS|Agent operating guide]] | Codex-facing maintenance rules, source discipline, ingest/query/lint workflows. |
| [[llm_wiki/log|Log]] | Chronological record of ingests, queries, lint passes, and maintenance. |
| [[llm_wiki/raw/README|Raw source guide]] | How immutable source drops and pointers should be stored. |
| [[llm_wiki/sources/README|Source summaries guide]] | How source-summary pages are named and maintained. |

## Maps

| Page | Summary |
| --- | --- |
| [[llm_wiki/maps/codebase-map|Codebase map]] | Current entry points in WayveCode for WFM, SI, parking, evaluation, deployment, and data tools. |
| [[llm_wiki/maps/knowledge-sources|Knowledge sources]] | How Notion, GitHub, Slack, skills, and vault notes should feed the wiki. |

## Systems

| Page | Summary |
| --- | --- |
| [[llm_wiki/systems/end-to-end-driving-stack|End-to-end driving stack]] | High-level Wayve driving-model stack from WFM pre-training through BC/RL and deployment. |
| [[llm_wiki/systems/model-vehicle-interface|Model-vehicle interface]] | How robot/data inputs become model input keys, adaptors, outputs, and deployment wrapper expectations. |
| [[llm_wiki/systems/space-time-model-architecture|Space-time model architecture]] | Input adaptors, ST encoder, output adaptor, and heads used by the current SI/Zoo driving model path. |
| [[llm_wiki/systems/data-and-materialisation|Data and materialisation]] | Corpus rows, materialised roots, buckets, OTF loading, and training batch assembly. |
| [[llm_wiki/systems/world-model-pretraining|World model pre-training]] | WFM code structure, config model, training workflow, experiments, and validation hooks. |
| [[llm_wiki/systems/bc-rl-training|BC and RL training]] | SI training path, Hydra modes, datamodules, control-model checks, Model CI, and interleaving. |
| [[llm_wiki/systems/parking-and-pull-over|Parking and pull-over]] | Parking/PUDO/UNPUDO/unparking map plus robotaxi pull-over source gaps. |
| [[llm_wiki/systems/parking-data-and-labels|Parking data and labels]] | Event taxonomy, parking/PUDO labels, bucket families, and notebook/generic materialisation differences. |
| [[llm_wiki/systems/parking-model-architecture|Parking model architecture]] | Parking-specific model inputs, heads, losses, release alignment, and deployment checks. |
| [[llm_wiki/systems/evaluation-and-model-ci|Evaluation and Model CI]] | Model CI, Eval Studio, Shadow Gym, AV test, HiL, on-road, and event-analysis roles. |
| [[llm_wiki/systems/deployment-and-model-catalogue|Deployment and Model Catalogue]] | Model identity chain from training checkpoint through deployed artifact, notes, CI, and on-road use. |

## Workflows

| Page | Summary |
| --- | --- |
| [[llm_wiki/workflows/model-development-cycle|Model development cycle]] | Idea-to-on-road lifecycle for model work. |
| [[llm_wiki/workflows/training-a-driving-model|Training a driving model]] | SI training preflight, local debug, remote submission, monitoring, and checkpoint handoff. |
| [[llm_wiki/workflows/parking-development-workflow|Parking development workflow]] | Parking/PUDO capability loop from failure definition to data, model, training, evaluation, road, and analysis. |
| [[llm_wiki/workflows/on-road-experiment-workflow|On-road experiment workflow]] | Requirements and guardrails for interleaved on-road and BRT experiments. |
| [[llm_wiki/workflows/wiki-ingest-workflow|Wiki ingest workflow]] | Step-by-step source import and synthesis procedure. |
| [[llm_wiki/workflows/wiki-query-workflow|Wiki query workflow]] | How to answer questions from the wiki and file durable answers. |
| [[llm_wiki/workflows/wiki-lint-workflow|Wiki lint workflow]] | Health checks for stale, contradictory, or orphaned knowledge. |
| [[llm_wiki/workflows/agent-skill-map|Agent skill map]] | Relevant local skills for model lookup, training, deployment, evaluation, parking analysis, and PR work. |
| [[llm_wiki/workflows/wiki-health-review-2026-05-23|Wiki health review - 2026-05-23]] | Review of coverage, remaining gaps, and next lint steps after the expansion pass. |

## Questions and Glossary

| Page | Summary |
| --- | --- |
| [[llm_wiki/questions/open-questions|Open questions]] | Source gaps and research queue for the wiki. |
| [[llm_wiki/glossary|Glossary]] | Acronyms, systems, and terms used by the wiki. |

## Templates

| Page | Summary |
| --- | --- |
| [[llm_wiki/templates/source-summary|Source summary template]] | Template for one ingested source. |
| [[llm_wiki/templates/entity-page|Entity page template]] | Template for a model, dataset, tool, or component page. |
| [[llm_wiki/templates/query-note|Query note template]] | Template for durable answers generated from questions. |
| [[llm_wiki/templates/run-ledger|Run ledger template]] | Template for experiment-heavy debugging summaries. |

## Source Summaries

| Page | Summary |
| --- | --- |
| [[llm_wiki/sources/2026-05-23-notion-training-driving-model|Notion - Training a Driving Model]] | Fetched Notion page covering end-to-end driving model basics, interface, data, BC training, and Console upload. |
| [[llm_wiki/sources/2026-05-23-notion-discovery-parking-evaluation|Notion discovery - parking, evaluation, and pull-over pointers]] | Search-result inventory of high-value Notion pages that still need full fetches. |
| [[llm_wiki/sources/2026-05-23-code-model-interface-and-st-architecture|Code - model interface and ST architecture]] | Inspected code for model inputs/outputs, ST model, output adaptor, training module, and deployment wrapper. |
| [[llm_wiki/sources/2026-05-23-code-data-materialisation-and-parking|Code - data materialisation and parking]] | Inspected SI materialisation, OTF datamodule, parking data config, and parking/stopping/gear adaptors. |
| [[llm_wiki/sources/2026-05-23-vault-parking-newsletters|Vault parking newsletters]] | Existing vault writeups on generic parking/PUDO materialisation, stopping mode, release deltas, and maneuver filters. |
| [[llm_wiki/sources/2026-05-23-skill-workflows-parking-model-lifecycle|Skill workflows - parking model lifecycle]] | Local skills for parking training, deployment, evaluation, model lookup, event analysis, and on-road experiments. |
