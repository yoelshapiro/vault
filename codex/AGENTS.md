# Personal knowledge vault

Use the user's GitHub-synced Obsidian vault as durable personal and project
context.

## Vault paths

- VM: `/home/yoelshapiro/git/vault`
- Mac: `/Users/yoel.shapiro/Work/vault`

Use the path for the machine running the Codex session.

## When to use it

- Consult the vault when a task involves ongoing projects, plans, prior
  decisions, personal notes, Parking/PUDO context, or other durable knowledge
  that could improve the answer.
- Search narrowly with `rg`; do not load the entire vault into context.
- Start with `README.md` and `index.md`, then read only relevant project or
  topic pages.
- For work under `llm_wiki/`, read and follow `llm_wiki/AGENTS.md` completely
  before reading or changing wiki content.

## Writing durable knowledge

- After meaningful work produces a durable decision, investigation result,
  workflow, or project update, update the most relevant existing vault page.
- If no page fits, create a dated task note using the structure in `README.md`
  and link it from `agents-change-log.md`.
- Do not create vault notes for trivial questions or routine command execution.
- Preserve Obsidian links and existing page conventions.

## Sync safety

- Do not run `git pull`, `git push`, or change sync configuration in the vault;
  the external sync loop owns synchronization.
- Before editing, re-read the target and check vault status.
- Keep writes focused. If a file changes concurrently or has unresolved
  conflicts, stop and report it.
