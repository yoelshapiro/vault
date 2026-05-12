# PR 102398 Commit Message Gate

- Date: 2026-05-12
- Branch: `03-20-si-group-interleave-control-support`
- PR: `102398`
- Change type: git history / CI

## Summary

PR 102398 was failing because several commit subjects matched the reserved release-bump conventional-commit pattern:

```text
^(feat|fix|perf|refactor|docs|test|chore|BREAKING CHANGE)(\([^)]*\))?: 
```

Rewrote the PR branch history to prefix matching subjects with `[no-release]`, preserving the original subject text while avoiding the reserved prefix pattern.

## Verification

- Old head: `6ac886be2292`
- New head: `9c7c7a50b271`
- Verified `bad_count=0` across `origin/main..HEAD` after rewrite.
- Verified `git diff 6ac886be2292..9c7c7a50b271` was empty, so only commit metadata changed.
- Force-pushed with an explicit lease against old head `6ac886be2292a5b09715d9bf5989b14df605b73b`.

## CI State

Fast GitHub checks restarted and passed through `compile_protos`, `protobuf_breaking_check`, `terraform-subgraph`, PR labeling, Atlantis, and presubmit trigger. Buildkite presubmit build `476026`, catalyst suite, and checklist were still pending at close-out.
