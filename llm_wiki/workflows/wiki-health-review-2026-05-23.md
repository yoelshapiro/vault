---
title: Wiki Health Review - 2026-05-23
type: workflow
owner: Boris Indelman
created: 2026-05-23
updated: 2026-05-23
status: active
tags:
  - llm-wiki
  - review
sources:
  - [[llm_wiki/index|Index]]
  - [[llm_wiki/log|Log]]
---

# Wiki Health Review - 2026-05-23

## Scope

This review checked whether the wiki can guide an MLE or Codex agent through the current Wayve model-development workflow for parking/PUDO and pull-over adjacent work.

## Improvements Made

- Added source summaries for fetched Notion, Notion discovery, inspected code, vault newsletters, and lifecycle skills.
- Split the architecture into model interface, space-time model, parking model, data/materialisation, deployment, and evaluation pages.
- Added workflow pages for training, parking development, and on-road experiments.
- Added explicit contradictions and risks around old pretraining descriptions, stopping-mode enums, hazard-only PUDO labeling, Shadow Gym latency limits, and pull-over source gaps.

## Current Strengths

- Agents can now start from [[llm_wiki/index|Index]] and navigate to source-backed pages for most parking model work.
- The model path is described from robot inputs through adaptors, ST encoder, output heads, deployment wrappers, and evaluation.
- The data path is described from corpus rows through materialisation, OTF loading, parking labels, buckets, and training batches.
- The parking lifecycle has a concrete training, deployment, evaluation, on-road, and event-analysis loop.

## Remaining Gaps

- Full Notion fetches are still needed for parking/PUDO deployment, generic materialisation, stopping-mode conditioning, PUDO SOP, Shadow Gym, Eval Studio, and baseline release process pages.
- Slack public search timed out during this pass, so no Slack thread has been ingested yet.
- Pull-over remains under-specified and should not be treated as solved by PUDO evidence alone.
- Current RL reward/state/action details are only mapped as a source gap.
- Canonical Eval Studio suite ids and AV test scenario collection ids are not yet captured.

## Next Lint Pass

Run a link check, line-count check, and stale-source review after the next Notion ingest. Then promote pages from `active` to `reviewed` only after the user confirms the structure matches day-to-day workflow.
