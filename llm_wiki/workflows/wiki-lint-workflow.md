---
title: Wiki Lint Workflow
type: workflow
owner: Boris Indelman
created: 2026-05-23
updated: 2026-05-23
status: active
tags:
  - llm-wiki
  - lint
sources:
  - user seed, 2026-05-23
---

# Wiki Lint Workflow

Use this periodically to keep the wiki useful as it grows.

## Checks

1. Orphans: pages not linked from [[llm_wiki/index|index.md]].
2. Stale pages: old `updated` dates on active topics.
3. Weak claims: `working synthesis`, `hypothesis`, or uncited claims that should be sourced.
4. Contradictions: old pages that conflict with newer source summaries.
5. Missing concepts: terms that appear repeatedly but have no page.
6. Dead links: broken Obsidian links or stale source paths.
7. Source gaps: important workflows that rely on memory rather than source summaries.

## Useful shell patterns

From the vault root:

```bash
rg "working synthesis|hypothesis|open question|TODO" llm_wiki
rg "\\[\\[" llm_wiki
find llm_wiki -name "*.md" | sort
```

## Output

At the end of a lint pass:

- Update pages directly when the fix is obvious.
- Add non-obvious work to [[llm_wiki/questions/open-questions|Open questions]].
- Append `## [YYYY-MM-DD] lint | <scope>` to [[llm_wiki/log|log.md]].

## Early lint priorities

- Split pull-over into its own source-backed system page.
- Ingest the current parking model comparison artifact.
- Ingest the most useful parking deploy/training task notes from May 2026.
- Create dedicated pages for Model Catalogue, Model CI, Eval Studio, Shadow Gym, and on-road experiments.
