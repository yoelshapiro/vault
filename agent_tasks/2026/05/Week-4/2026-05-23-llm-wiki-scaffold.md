---
title: LLM wiki scaffold
date: 2026-05-23
branch: none
tags:
  - llm-wiki
  - vault
  - wayve
  - parking
change_type: docs
---

# LLM Wiki Scaffold

## Request

Boris asked to build an LLM-maintained wiki under the vault at `llm_wiki/` for a Wayve MLE working on end-to-end autonomous-driving models, with a focus on parking and robotaxi pull-over. The wiki should use Notion as a prime knowledge source, GitHub/local WayveCode as code truth, Slack for operational context, and existing agent skills for workflow knowledge.

## Work Done

- Created `${HOME}/git/vault/llm_wiki/`.
- Added an agent operating guide in `llm_wiki/AGENTS.md`.
- Added `index.md`, `log.md`, a raw source guide, source directories, maps, system pages, workflow pages, templates, glossary, and open questions.
- Seeded the first codebase map from:
  - `/workspace/WayveCode/wayve/ai/si/README.md`
  - `/workspace/WayveCode/wayve/ai/si/configs/parking/README.md`
  - `/workspace/WayveCode/wayve/ai/foundation/models/world_model/README.md`
  - `/workspace/WayveCode/wayve/ai/foundation/models/world_model/AGENTS.md`
- Added a curated agent skill map for model lookup, training, parking deployment, event analysis, evaluation, and PR workflows.

## Key Files

- `llm_wiki/README.md`
- `llm_wiki/AGENTS.md`
- `llm_wiki/index.md`
- `llm_wiki/log.md`
- `llm_wiki/maps/codebase-map.md`
- `llm_wiki/maps/knowledge-sources.md`
- `llm_wiki/systems/end-to-end-driving-stack.md`
- `llm_wiki/systems/world-model-pretraining.md`
- `llm_wiki/systems/bc-rl-training.md`
- `llm_wiki/systems/parking-and-pull-over.md`
- `llm_wiki/workflows/model-development-cycle.md`
- `llm_wiki/workflows/agent-skill-map.md`

## Next Useful Ingests

- Current Notion page for training a driving model.
- Current Notion docs for generic materialisation.
- Current parking/PUDO design docs.
- Slack or Notion context defining robotaxi pull-over.
- Existing parking model comparison vault artifact.
- Recent parking training/deploy task notes from May 2026.
