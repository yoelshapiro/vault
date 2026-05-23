---
title: Knowledge Sources
type: map
owner: Boris Indelman
created: 2026-05-23
updated: 2026-05-23
status: seed
tags:
  - llm-wiki
  - sources
sources:
  - user seed, 2026-05-23
  - /home/borisindelman/git/vault/agents-change-log.md
---

# Knowledge Sources

This page tracks how different source systems should feed the wiki.

## Notion

Use Notion for design docs, training recipes, release notes, evaluation plans, and long-lived project knowledge.

Ingest pattern:

1. Capture page URL, title, owner, last edited date if available, and retrieval date.
2. Store a pointer or export under `raw/notion/`.
3. Create a source summary under `sources/`.
4. Update affected system/workflow pages.
5. Link unresolved claims into [[llm_wiki/questions/open-questions|Open questions]].

Important rule from WayveCode guidance: only use Notion MCP for the Wayve Skills Database when the user explicitly refers to WSD, wisdom, or the Wayve Skills Database.

## GitHub and local code

Use GitHub and the local repo for implementation truth.

Preferred sources:

- Local files under `/workspace/WayveCode`.
- `gh pr view`, `gh pr diff`, and `gh api` for PRs.
- Branch names, commit IDs, PR numbers, and exact file paths.

Ingest pattern:

1. Record branch/PR/commit context under `raw/github/` if useful.
2. Summarize changed behavior, tests, and review discussion under `sources/`.
3. Update code maps and system pages with exact file paths.
4. Mark any behavior inferred from code as source-backed only after reading the relevant code.

## Slack

Use Slack for decisions, debugging context, operational incidents, and informal tribal knowledge. Slack is useful but often less durable than code or docs.

Ingest pattern:

1. Capture channel, thread permalink, participants, date, and reason it matters.
2. Summarize decisions separately from discussion.
3. Mark Slack-sourced claims as time-sensitive unless confirmed by code, Notion, or a follow-up source.

## Skills

Skills encode operational workflows that agents can reuse. They are especially valuable for repeated Wayve tasks like model lookup, training job debugging, parking deployment, evaluation, and PR workflows.

Relevant skill directories:

- `/workspace/WayveCode/.ai/skills/`
- `/home/borisindelman/git/ParkingSkills/skills/`

See [[llm_wiki/workflows/agent-skill-map|Agent skill map]] for the current curated subset.

## Existing vault notes

The vault already contains many task notes from prior parking work. These are useful for reconstructing practical workflows and recurring failure modes.

Important sources:

- `/home/borisindelman/git/vault/agents-change-log.md`
- `/home/borisindelman/git/vault/agent_tasks/`
- `/home/borisindelman/git/vault/newsletters/`
- `/home/borisindelman/git/vault/html_summaries/`
- `/home/borisindelman/git/vault/parking_model_analysis/`

Ingest pattern:

1. Treat old task notes as historical operational evidence.
2. Extract recurring workflow steps and failure modes into workflow pages.
3. Avoid treating old run IDs, model nicknames, or branch-specific hacks as current unless reverified.

## Web

Use web sources only for external context, current external API behavior, or public references. Wayve-specific claims should be grounded in internal sources whenever possible.
