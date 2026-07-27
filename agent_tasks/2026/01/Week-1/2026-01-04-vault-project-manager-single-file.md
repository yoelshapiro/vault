# Vault project manager (single-file + index)

## Summary
- Reworked the project-manager skill to use a single `project.md` per project.
- Added a vault-level `projects.md` index with Obsidian links and status columns.
- Updated prompts to reference `project.md` and the new layout.
- Converted the dummy project to the single-file format and removed legacy per-file docs.

## Details
- Source template: `/home/borisindelman/downloads/claude_project_creator.md` (GitHub tracker references removed).
- Registry stays in `${HOME}/git/vault/projects/`.

## Files
- `~/.codex/skills/project-manager/SKILL.md`
- `~/.codex/skills/project-manager/assets/templates/project.md`
- `~/.codex/prompts/project-*.md`
- `${HOME}/git/vault/projects.md`
- `${HOME}/git/vault/projects/dummy-project/project.md`
