# Codex Vault Integration

## Summary

Configured VM-based Codex sessions to use this synced Obsidian vault as durable
personal and project context.

## Paths

- VM working copy: `/home/yoelshapiro/git/vault`
- Mac mirror: `/Users/yoel.shapiro/Work/vault`
- Synchronization: cron-driven push/pull loop running every minute

## VM synchronization

- Sync tooling: `/home/yoelshapiro/git/assets/git_sync/`
- User crontab entry:
  `* * * * * /home/yoelshapiro/git/assets/git_sync/git-sync-cron.sh /home/yoelshapiro/git/vault >/dev/null 2>&1`
- Service: `cron.service`, enabled and active.
- Restored and verified on 2026-08-03; the first run committed, merged, pushed,
  and left local `main` aligned with `origin/main`.

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
