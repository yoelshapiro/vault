# Codex Vault Integration

## Summary

Configured VM-based Codex sessions to use this synced Obsidian vault as durable
personal and project context.

## Paths

- VM working copy: `/home/yoelshapiro/git/vault`
- Mac mirror: `/Users/yoel.shapiro/Work/vault`
- Synchronization: external push/pull loop running every minute

## Codex configuration

- Added global guidance at `/workspace/.codex/AGENTS.md`.
- Added `/home/yoelshapiro/git/vault` to
  `sandbox_workspace_write.writable_roots` in `/workspace/.codex/config.toml`.

## Operating policy

- Search the vault selectively for project history, plans, prior decisions, and
  durable user-specific context.
- Follow `llm_wiki/AGENTS.md` for all LLM wiki work.
- Record meaningful durable outcomes in an existing relevant page or a dated
  task note, while skipping trivial command execution.
- Do not run Git pull/push or modify synchronization settings; the external sync
  loop owns transport between VM and Mac.
- Re-read files before focused edits and stop on concurrent changes or conflicts.

The global guidance and writable-root configuration apply to newly started Codex
tasks after configuration reload.
