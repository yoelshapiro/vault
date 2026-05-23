---
title: Source Summaries Guide
type: source
owner: Boris Indelman
created: 2026-05-23
updated: 2026-05-23
status: seed
tags:
  - llm-wiki
  - sources
---

# Source Summaries Guide

This directory holds one synthesized summary per ingested source.

Use [[llm_wiki/templates/source-summary|Source summary template]] for new pages.

## Naming

Use date-prefixed filenames:

- `YYYY-MM-DD-<notion-page-slug>.md`
- `YYYY-MM-DD-pr-<number>-<topic>.md`
- `YYYY-MM-DD-slack-<channel>-<topic>.md`
- `YYYY-MM-DD-skill-<skill-name>.md`

## What belongs here

- What the source says.
- Why it matters.
- Durable facts and workflow knowledge.
- Code paths, commands, branches, PRs, model nicknames, sessions, and job IDs.
- Contradictions or changes relative to existing wiki pages.
- Open questions created by the source.

## What does not belong here

- Entire copied Notion pages.
- Entire Slack threads.
- Large code snippets.
- Unfiltered logs.

Keep raw material or pointers under [[llm_wiki/raw/README|raw/]].
