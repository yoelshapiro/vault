---
title: Wiki Query Workflow
type: workflow
owner: Boris Indelman
created: 2026-05-23
updated: 2026-05-23
status: seed
tags:
  - llm-wiki
  - query
sources:
  - user seed, 2026-05-23
---

# Wiki Query Workflow

Use this when Boris asks a question that should be answered from the wiki and related sources.

## Checklist

1. Read [[llm_wiki/index|index.md]].
2. Search the wiki for key terms.
3. Read relevant maintained pages before raw sources.
4. Read source summaries and raw/code sources only as needed.
5. Answer with citations to pages, source summaries, code paths, PRs, or Slack/Notion pointers.
6. If the answer is durable, file it as:
   - a new topic page,
   - an update to an existing system/workflow page, or
   - a query note from [[llm_wiki/templates/query-note|Query note template]].
7. Append a query entry to [[llm_wiki/log|log.md]].

## Durable answer examples

File these back into the wiki:

- "How does parking datamodule mixing work?"
- "What changed between two models?"
- "How do I deploy a parking interleave-control model?"
- "Which Eval Studio suites should I run for UNPUDO?"
- "Where does stopping mode enter the model?"
- "What is the development cycle for a pull-over change?"

## Non-durable answer examples

Usually do not file:

- One-off shell command output.
- A quick path lookup.
- A temporary status update that is already logged elsewhere.

## Citation style

Use inline source anchors:

- `Source: /workspace/WayveCode/wayve/ai/si/README.md`
- `Source: [[llm_wiki/sources/2026-05-23-example|Example source summary]]`
- `Source: PR #12345, branch <branch>, file <path>`

For uncertain synthesis, say `working synthesis` or `hypothesis`.
