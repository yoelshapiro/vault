# 2026-02-11 — Vault structure reorg

## Summary
- Removed the `codex/` and `WayveCode/` hierarchy layers from the notes layout.
- Moved dated task notes under `agent_tasks/YYYY/MM/Week-N/`.
- Kept `projects.md` at vault top level with per-project files in `projects/`.
- Updated global agent instructions and the `project-manager` skill to the new paths/layout.

## What changed
- Flattened hierarchy in two steps:
  - `${HOME}/git/vault/codex/WayveCode` -> `${HOME}/git/vault/WayveCode`
  - `${HOME}/git/vault/WayveCode/*` -> `${HOME}/git/vault/*`
- Moved date trees:
  - `${HOME}/git/vault/WayveCode/2025` -> `${HOME}/git/vault/agent_tasks/2025`
  - `${HOME}/git/vault/WayveCode/2026` -> `${HOME}/git/vault/agent_tasks/2026`
- Removed empty legacy folder:
  - `${HOME}/git/vault/codex`
- Removed empty intermediate folder:
  - `${HOME}/git/vault/WayveCode`
- Updated references:
  - `codex/WayveCode/...` -> `...` (vault top-level paths)
  - `WayveCode/...` -> `...` (vault top-level paths)
  - `[[2025/...]]` / `[[2026/...]]` -> `[[agent_tasks/2025/...]]` / `[[agent_tasks/2026/...]]`
  - `${HOME}/git/vault/codex/WayveCode/...` and `${HOME}/git/vault/WayveCode/...` -> `${HOME}/git/vault/...`
  - `newsletters/newsletter_index.md` -> `newsletter_index.md` (top-level index page)

## Instruction updates
- `~/.codex/AGENTS.md`
  - Vault root path now points to `~/git/vault/`.
  - Task structure now points to `agent_tasks/YYYY/MM/Week-N/`.
- `~/.codex/skills/project-manager/SKILL.md`
  - Storage layout paths updated to `${HOME}/git/vault/...`.
  - Continue workflow now reads `<slug>.md` (single-file project format).

## Validation
- Verified no remaining operational `codex/WayveCode` or `/git/vault/WayveCode` references in the active vault structure docs.
- Verified `projects/projects.json` now points to `${HOME}/git/vault/projects/*.md`.
