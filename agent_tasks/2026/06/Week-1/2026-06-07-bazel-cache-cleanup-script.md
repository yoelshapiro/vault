# 2026-06-07 Bazel Cache Cleanup Script

## Summary

Added a standalone helper script for safely deleting unused Bazel output-base cache directories across multiple Git worktrees.

## Context

Boris has several `/workspace/WayveCode` worktrees that each map to different Bazel output bases under `/workspace/.cache/bazel`. Manual cleanup is error-prone because active worktree output bases and live `bazel run` processes must not be deleted.

## Changes

- Added `tools/delete_unused_bazel_caches.sh`.
- The script discovers current Git worktrees with `git worktree list --porcelain`.
- For each worktree, it resolves the exact Bazel output base with `bazel info output_base`.
- It scans top-level 32-character hex directories under `/workspace/.cache/bazel`.
- It keeps directories mapped to current worktrees or referenced by live process command lines.
- It prints a `KEEP` / `DELETE` plan and requires typing `DELETE` before running `sudo rm -rf`.
- It supports `--include-repository-cache` for explicitly deleting the shared Bazel repository cache.

## Validation

- Ran `./tools/delete_unused_bazel_caches.sh --help`.
- Ran `printf 'NO\n' | ./tools/delete_unused_bazel_caches.sh` and verified it printed the plan and aborted without deletion.
- Ran `bash -n tools/delete_unused_bazel_caches.sh`.
- `shellcheck` could not be run because it is not installed in the environment.

## Branch

`boris/pudo_generic_materialization`
