# LLM Wiki Agent Guide

This directory is an LLM-maintained wiki. The human curates sources and asks questions. The agent reads, synthesizes, cross-links, and keeps the wiki consistent.

## First read order

For any task that touches this wiki:

1. Read `README.md`.
2. Read `index.md`.
3. Read the newest entries in `log.md`.
4. Read the relevant pages listed in the index.
5. Only then read raw sources or external systems needed for the request.

## Directory contract

- `raw/`: immutable source drops or source pointers. Do not rewrite source content except to add a small README/pointer file when importing a new source.
- `sources/`: one source-summary page per ingested source. These pages explain what the source says and what wiki pages it affects.
- `maps/`: navigation maps for code, teams, tools, data sources, and knowledge sources.
- `systems/`: durable explanations of Wayve systems and model-development concepts.
- `workflows/`: repeatable procedures, checklists, and lifecycle pages.
- `questions/`: open questions, contradictions, source gaps, and investigation queues.
- `templates/`: copyable page templates.

## Source discipline

Use these evidence levels explicitly:

- `source-backed`: cite the source page, code path, Notion URL, Slack permalink, PR/commit, or skill file.
- `working synthesis`: plausible synthesis from multiple sources, but not yet directly verified.
- `hypothesis`: a proposed explanation that needs validation.
- `open question`: something important that is not yet known.

Do not silently upgrade a claim from `working synthesis` to `source-backed`. Add the supporting source first.

## Page conventions

Use YAML frontmatter on maintained pages:

```yaml
---
title: Page Title
type: system | workflow | map | source | question | template | home | index | log
owner: Boris Indelman
created: YYYY-MM-DD
updated: YYYY-MM-DD
status: seed | active | stale | archived
tags:
  - llm-wiki
sources:
  - source-or-path
---
```

Use Obsidian links for wiki pages, for example `[[llm_wiki/systems/world-model-pretraining|World model pre-training]]`.

Use code paths in backticks. Prefer absolute paths for external code references when clarity matters, for example `/workspace/WayveCode/wayve/ai/si/README.md`.

Keep pages readable. A page should explain the shape of a topic, then point to deeper pages and sources.

## Ingest workflow

When ingesting a source:

1. Put the raw source or a pointer to it under `raw/<source-kind>/`.
2. Create a source summary under `sources/YYYY-MM-DD-<slug>.md` using `templates/source-summary.md`.
3. Extract durable facts, workflows, definitions, code paths, commands, and open questions.
4. Update every affected system, workflow, map, or question page.
5. Add backlinks from those pages to the source summary.
6. Update `index.md`.
7. Append a `log.md` entry with prefix `## [YYYY-MM-DD] ingest | <title>`.

If a new source contradicts older pages, do not hide the conflict. Add a `Contradictions or Changes` section to the relevant page and explain which source is newer or more authoritative.

## Query workflow

When answering a wiki-backed question:

1. Read `index.md` and search the wiki before searching raw sources.
2. Read the minimum relevant pages and source summaries.
3. Answer with citations to wiki pages and source anchors.
4. If the answer is durable, create or update a page for it.
5. Append a `log.md` entry with prefix `## [YYYY-MM-DD] query | <title>`.

Durable answers include comparisons, explanations, codebase maps, model lineage notes, evaluation recipes, and debugging playbooks.

## Lint workflow

For periodic health checks:

1. Search for `TODO`, `open question`, `working synthesis`, and `hypothesis`.
2. Find orphan pages not linked from `index.md`.
3. Find pages with stale `updated` dates or source gaps.
4. Check whether common concepts are mentioned repeatedly without a page.
5. Update links, add missing pages, and record source gaps.
6. Append a `log.md` entry with prefix `## [YYYY-MM-DD] lint | <scope>`.

## Wayve source workflow

Use these source priorities:

1. Local code in `/workspace/WayveCode`.
2. Notion docs supplied by Boris or found through an explicit Notion task.
3. GitHub PRs/issues through `gh pr view/diff` and `gh api`, not browser URLs.
4. Slack threads when Boris asks for Slack context or provides a thread/channel.
5. Wayve skills under `/workspace/WayveCode/.ai/skills` and `${HOME}/git/ParkingSkills/skills`.
6. Existing vault task notes and newsletters.

When working with code:

- Read applicable `AGENTS.md` files and relevant ADRs before making code claims.
- Use `rg` or `rg --files` for discovery.
- Cite files and symbols, not vague module names.
- For PRs, cite PR number, branch, commits, and changed files.

When working with the Wayve Skills Database specifically, follow the repository rule: use Notion MCP only when the user explicitly refers to the Wayve Skills Database, WSD, or wisdom.

## Parking and pull-over focus

This wiki is biased toward an MLE working on parking and robotaxi pull-over. When a source is relevant to PUDO, UNPUDO, unparking, stopping mode, route shortening, interleave control, model CI, Eval Studio, or on-road experiments, update [[llm_wiki/systems/parking-and-pull-over|Parking and pull-over]] and any related workflow pages.

## Log format

Append-only entries in `log.md` should start with:

```markdown
## [YYYY-MM-DD] ingest | Source title
## [YYYY-MM-DD] query | Question title
## [YYYY-MM-DD] lint | Scope
## [YYYY-MM-DD] maintenance | Change title
```

Keep entries short but include changed pages and source pointers.
