---
title: LLM wiki expansion for Wayve MLE
created: 2026-05-23
updated: 2026-05-23
labels:
  - llm-wiki
  - parking
  - model-architecture
  - data
  - evaluation
branch: main
pr: none
---

# LLM wiki expansion for Wayve MLE

## Goal

Build out `${HOME}/git/vault/llm_wiki` into a practical, source-backed wiki for an MLE working on Wayve end-to-end driving models, with emphasis on parking, PUDO, UNPUDO, unparking, pull-over adjacent workflows, and Codex agent operation.

## Sources Used

- Notion: fetched `Training a Driving Model`.
- Notion: discovered but did not fully fetch several parking/evaluation pages due connector timeouts.
- Local code: SI, Zoo ST model, model interface, deployment wrapper, materialisation, OTF datamodule, parking datamodule/configs, parking/stopping/gear adaptors.
- Vault newsletters: generic parking/PUDO materialisation, stopping-mode DILC, PUDO release update, parking maneuver filters.
- Skills: parking training, parking deployment, AV test stats, model info routing, parking event analysis, on-road experiment creation.
- Slack: public search attempted, but timed out; no Slack thread was ingested in this pass.

## Changes

- Added six source summaries under `llm_wiki/sources/`.
- Added system pages for model-vehicle interface, space-time architecture, data/materialisation, parking labels, parking model architecture, evaluation, and deployment.
- Added workflow pages for training, parking development, on-road experiments, and wiki health review.
- Updated the home page, index, end-to-end stack, parking hub, model development workflow, BC/RL page, codebase map, glossary, open questions, and wiki log.
- Added explicit caveats for stale Notion code anchors, old pretraining descriptions, stopping-mode enum drift, hazard-only PUDO labels, Shadow Gym latency limitations, Notion timeouts, and Slack timeout.

## Review Notes

- The wiki now has a navigable architecture/data/workflow graph rather than only seed hubs.
- Pull-over is still marked as a source gap; PUDO evidence should not be used as a full pull-over definition.
- Several Notion pages should be retried and ingested before marking the wiki "reviewed".

## Verification

- Obsidian link check over `llm_wiki` returned no missing `llm_wiki/*` targets.
- Markdown line-count check found all `llm_wiki` files under 500 lines; largest current file is `workflows/model-development-cycle.md` at 153 lines.
- Final vault git status showed this task note, `agents-change-log.md`, and a small set of `llm_wiki` status/wording updates as local changes.
