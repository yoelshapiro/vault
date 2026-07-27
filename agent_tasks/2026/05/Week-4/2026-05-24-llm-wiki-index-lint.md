---
title: LLM wiki index lint and render fix
created: 2026-05-24
updated: 2026-05-24
labels:
  - llm-wiki
  - obsidian
  - lint
  - navigation
branch: main
pr: none
---

# LLM wiki index lint and render fix

## Goal

Re-audit `${HOME}/git/vault/llm_wiki` after Boris reported the index was broken.

## Root Cause

`index.md` used Obsidian aliased links such as `[[path|Label]]` inside Markdown tables. The alias separator `|` can be parsed as a table column separator, which breaks rendering in plain Markdown and can render badly in Obsidian contexts.

The same table-alias pattern appeared in a few glossary rows.

## Changes

- Rewrote `llm_wiki/index.md` as grouped bullet navigation instead of Markdown tables.
- Added a `Core Route` section for the common MLE/agent path.
- Added a `Raw Source Guides` section so all raw guide pages are reachable from the index.
- Removed aliased wiki links from glossary table rows.
- Marked raw source guide pages active and updated their dates.
- Appended a lint entry to `llm_wiki/log.md`.

## Verification

- No unresolved `llm_wiki/*` Obsidian links.
- No aliased Obsidian links inside Markdown table rows.
- Every `llm_wiki/*.md` page is reachable from `llm_wiki/index.md`.
- No unexpected `status: seed` remains except the allowed schema example in `llm_wiki/AGENTS.md`.
- All wiki markdown files are under 500 lines; largest current file is 153 lines.
