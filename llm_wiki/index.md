---
title: LLM Wiki Index
type: index
owner: Boris Indelman
created: 2026-05-23
updated: 2026-05-23
status: seed
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
| [[llm_wiki/systems/world-model-pretraining|World model pre-training]] | WFM code structure, config model, training workflow, experiments, and validation hooks. |
| [[llm_wiki/systems/bc-rl-training|BC and RL training]] | SI training path, Hydra modes, datamodules, control-model checks, Model CI, and interleaving. |
| [[llm_wiki/systems/parking-and-pull-over|Parking and pull-over]] | Parking/PUDO/UNPUDO/unparking map plus robotaxi pull-over source gaps. |

## Workflows

| Page | Summary |
| --- | --- |
| [[llm_wiki/workflows/model-development-cycle|Model development cycle]] | Idea-to-on-road lifecycle for model work. |
| [[llm_wiki/workflows/wiki-ingest-workflow|Wiki ingest workflow]] | Step-by-step source import and synthesis procedure. |
| [[llm_wiki/workflows/wiki-query-workflow|Wiki query workflow]] | How to answer questions from the wiki and file durable answers. |
| [[llm_wiki/workflows/wiki-lint-workflow|Wiki lint workflow]] | Health checks for stale, contradictory, or orphaned knowledge. |
| [[llm_wiki/workflows/agent-skill-map|Agent skill map]] | Relevant local skills for model lookup, training, deployment, evaluation, parking analysis, and PR work. |

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

No separate source-summary pages have been ingested yet. The seed pages currently cite local repo READMEs, user-provided context, existing vault logs, and local skill inventory directly. See [[llm_wiki/sources/README|Source summaries guide]] before adding the first source summary.
