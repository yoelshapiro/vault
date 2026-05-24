---
title: Raw Source Guide
type: source
owner: Boris Indelman
created: 2026-05-23
updated: 2026-05-24
status: active
tags:
  - llm-wiki
  - raw-sources
---

# Raw Source Guide

`raw/` is for immutable source material and source pointers. The LLM can add new files here during ingestion, but should not rewrite the substance of an imported source.

## Folders

- `raw/notion/`: Notion exports, copied page text, or pointer files with page URLs and retrieval metadata.
- `raw/github/`: PR diffs, issue exports, branch notes, commit references, and `gh` output captures.
- `raw/slack/`: Slack thread exports or pointer files with channel, timestamp, permalink, and summary.
- `raw/skills/`: Copied or referenced skill docs used as workflow sources.
- `raw/assets/`: Images, diagrams, screenshots, PDFs, or downloaded attachments.

## Pointer file format

Use a small markdown file when the raw source is external:

```markdown
---
title: Source Title
source_type: notion | github | slack | skill | web | other
captured: YYYY-MM-DD
url: https://...
retrieved_by: codex
---

# Source Title

Pointer to the source. Include access notes, source owner, and why it matters.
```

Then create a separate synthesized summary under `sources/`.
