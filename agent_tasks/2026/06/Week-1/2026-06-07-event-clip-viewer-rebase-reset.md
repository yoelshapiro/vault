# 2026-06-07 Event Clip Viewer Rebase Reset

## Summary

Rebased `boris/event_clip_viewer` onto `origin/main` in `/workspace/event_clip_viewer` and reset the parking event clip viewer subtree back to `origin/main`.

## Branch

- Worktree: `/workspace/event_clip_viewer`
- Branch: `boris/event_clip_viewer`
- New local head: `39c5f4c3814d`

## Changes

- Fetched `origin/main` and `origin/boris/event_clip_viewer`.
- Rebased `boris/event_clip_viewer` onto `origin/main`.
- Resolved the initial add/add conflicts under `wayve/ai/parking/tools/event_clip_viewer` by restoring the subtree from `origin/main`.
- Committed the final subtree reset as `fix: restore event clip viewer from main`.
- Did not push the rewritten branch.

## Validation

- `git merge-base --is-ancestor origin/main HEAD`
- `git diff --stat origin/main...HEAD`
- `git diff --stat origin/main -- wayve/ai/parking/tools/event_clip_viewer`

Both diff commands produced no output after the reset commit.
