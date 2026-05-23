---
title: LLM Wiki Log
type: log
owner: Boris Indelman
created: 2026-05-23
updated: 2026-05-23
status: active
tags:
  - llm-wiki
---

# LLM Wiki Log

Append-only log for wiki work. Use consistent headings so simple shell tools can parse recent activity.

## [2026-05-23] ingest | Notion, code, vault, and skills expansion for Wayve MLE wiki

Expanded the seed wiki into a source-backed working base for Wayve model development, with emphasis on parking/PUDO and pull-over adjacent workflows.

Added source summaries:

- [[llm_wiki/sources/2026-05-23-notion-training-driving-model|Notion - Training a Driving Model]]
- [[llm_wiki/sources/2026-05-23-notion-discovery-parking-evaluation|Notion discovery - parking, evaluation, and pull-over pointers]]
- [[llm_wiki/sources/2026-05-23-code-model-interface-and-st-architecture|Code - model interface and ST architecture]]
- [[llm_wiki/sources/2026-05-23-code-data-materialisation-and-parking|Code - data materialisation and parking]]
- [[llm_wiki/sources/2026-05-23-vault-parking-newsletters|Vault parking newsletters]]
- [[llm_wiki/sources/2026-05-23-skill-workflows-parking-model-lifecycle|Skill workflows - parking model lifecycle]]

Added system/workflow pages:

- [[llm_wiki/systems/model-vehicle-interface|Model-vehicle interface]]
- [[llm_wiki/systems/space-time-model-architecture|Space-time model architecture]]
- [[llm_wiki/systems/data-and-materialisation|Data and materialisation]]
- [[llm_wiki/systems/parking-data-and-labels|Parking data and labels]]
- [[llm_wiki/systems/parking-model-architecture|Parking model architecture]]
- [[llm_wiki/systems/evaluation-and-model-ci|Evaluation and Model CI]]
- [[llm_wiki/systems/deployment-and-model-catalogue|Deployment and Model Catalogue]]
- [[llm_wiki/workflows/training-a-driving-model|Training a driving model]]
- [[llm_wiki/workflows/parking-development-workflow|Parking development workflow]]
- [[llm_wiki/workflows/on-road-experiment-workflow|On-road experiment workflow]]
- [[llm_wiki/workflows/wiki-health-review-2026-05-23|Wiki health review - 2026-05-23]]

Updated hubs:

- [[llm_wiki/README|Home]]
- [[llm_wiki/index|Index]]
- [[llm_wiki/systems/end-to-end-driving-stack|End-to-end driving stack]]
- [[llm_wiki/systems/parking-and-pull-over|Parking and pull-over]]
- [[llm_wiki/workflows/model-development-cycle|Model development cycle]]
- [[llm_wiki/questions/open-questions|Open questions]]
- [[llm_wiki/glossary|Glossary]]

Important caveats:

- Several Notion fetches timed out and were recorded as discovery pointers rather than full sources.
- Slack public search timed out, so Slack is still a pending source layer.
- Pull-over remains a source gap until an authoritative SOP/product source is ingested.

## [2026-05-23] maintenance | Initial Wayve MLE wiki scaffold

Created the first `llm_wiki` scaffold under the vault.

Changed pages:

- [[llm_wiki/README|Home]]
- [[llm_wiki/AGENTS|Agent operating guide]]
- [[llm_wiki/index|Index]]
- [[llm_wiki/sources/README|Source summaries guide]]
- [[llm_wiki/maps/codebase-map|Codebase map]]
- [[llm_wiki/maps/knowledge-sources|Knowledge sources]]
- [[llm_wiki/systems/end-to-end-driving-stack|End-to-end driving stack]]
- [[llm_wiki/systems/world-model-pretraining|World model pre-training]]
- [[llm_wiki/systems/bc-rl-training|BC and RL training]]
- [[llm_wiki/systems/parking-and-pull-over|Parking and pull-over]]
- [[llm_wiki/workflows/model-development-cycle|Model development cycle]]
- [[llm_wiki/workflows/wiki-ingest-workflow|Wiki ingest workflow]]
- [[llm_wiki/workflows/wiki-query-workflow|Wiki query workflow]]
- [[llm_wiki/workflows/wiki-lint-workflow|Wiki lint workflow]]
- [[llm_wiki/workflows/agent-skill-map|Agent skill map]]
- [[llm_wiki/questions/open-questions|Open questions]]
- [[llm_wiki/glossary|Glossary]]

Source anchors:

- User-provided LLM wiki idea file and Wayve MLE scope, 2026-05-23.
- `/workspace/WayveCode/wayve/ai/si/README.md`
- `/workspace/WayveCode/wayve/ai/si/configs/parking/README.md`
- `/workspace/WayveCode/wayve/ai/foundation/models/world_model/README.md`
- `/workspace/WayveCode/wayve/ai/foundation/models/world_model/AGENTS.md`
- Existing vault change log at `/home/borisindelman/git/vault/agents-change-log.md`
