---
title: Wiki Ingest Workflow
type: workflow
owner: Boris Indelman
created: 2026-05-23
updated: 2026-05-23
status: seed
tags:
  - llm-wiki
  - ingest
sources:
  - user seed, 2026-05-23
---

# Wiki Ingest Workflow

Use this when Boris provides a Notion page, PR, Slack thread, skill, notebook, report, or source file to ingest.

## Checklist

1. Read [[llm_wiki/index|index.md]] and recent [[llm_wiki/log|log.md]] entries.
2. Identify the source type and authority level.
3. Store the raw source or pointer under `raw/<source-kind>/`.
4. Create `sources/YYYY-MM-DD-<slug>.md` from [[llm_wiki/templates/source-summary|Source summary template]].
5. Extract:
   - durable facts
   - commands
   - code paths
   - model names and checkpoints
   - experiments and outcomes
   - contradictions
   - open questions
6. Update every affected map, system, workflow, glossary, or question page.
7. Add backlinks from updated pages to the source summary.
8. Update [[llm_wiki/index|index.md]] if pages were added or materially changed.
9. Append a log entry to [[llm_wiki/log|log.md]].

## Source authority

Prefer in this order:

1. Code and tests in `/workspace/WayveCode`.
2. Approved or current Notion design docs.
3. GitHub PRs and code review discussions.
4. Operational task notes and run logs.
5. Slack decisions, with date and context.
6. Personal synthesis, marked as such.

## Contradictions

If a new source contradicts an older page:

- Keep both facts visible.
- Record source dates.
- Note which source is more authoritative.
- Add an open question if the right answer is not obvious.

## Naming

Use date-prefixed source summaries:

- `sources/2026-05-23-training-a-driving-model.md`
- `sources/2026-05-23-pr-12345-parking-route-shortening.md`
- `sources/2026-05-23-slack-parking-eval-failure.md`

For durable topic pages, do not date-prefix:

- `systems/model-catalogue.md`
- `workflows/parking-deploy.md`
- `maps/evaluation-systems.md`
