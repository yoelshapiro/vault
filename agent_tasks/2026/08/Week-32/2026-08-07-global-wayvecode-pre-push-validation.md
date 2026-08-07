# Global WayveCode Pre-Push Validation

## Decision

Use Git's global `core.hooksPath` to enforce check-only validation before every
push from Codex, Cursor, or a normal terminal. The enforcement point is
`pre-push`, not `pre-commit`, because the requirement is to validate the exact
committed branch state immediately before it is published.

## Configuration

- Global hooks path: `/home/yoelshapiro/.config/git/hooks`
- Hook: `/home/yoelshapiro/.config/git/hooks/pre-push`
- Git setting:
  `git config --global core.hooksPath /home/yoelshapiro/.config/git/hooks`
- The hook invokes an executable repository-local `.git/hooks/pre-push` first,
  if one exists, so the global dispatcher does not discard repository policy.
- Global dispatchers for the other standard Git hook names forward arguments
  and stdin to executable repository-local hooks. This preserves WayveCode's
  merge-base maintenance hooks and any hooks added by other repositories.
- WayveCode repository hooks are authoritative and execute before any global
  validation. The lifecycle dispatcher explicitly identifies the delegated
  `merge_base_update.sh` responsibility so WayveCode's Bazel hook validation
  recognizes the global `core.hooksPath` setup as compliant.
- Non-WayveCode repositories pass through after their local hook.

## WayveCode checks

The hook compares committed changes with the available remote `main`, then:

1. Runs check-only formatters for the changed languages.
2. Runs version-bump and dangling-symlink checks.
3. Resolves the nearest Bazel package for every changed file.
4. Verifies every changed Python file is reachable from a lint-tagged target in
   the affected package scope.
5. Runs all Bazel lint, type, and unit-test targets beneath the affected package
   scopes with `--keep_going`.

It never rewrites files during `git push`. A one-off bypass remains available
through Git's standard `git push --no-verify`, but should be used only when the
failed check is understood and intentionally deferred.

## Validation

Validated against `yoel/p2p_event_backfill`, PR
[wayveai/WayveCode#129802](https://github.com/wayveai/WayveCode/pull/129802),
after fast-forwarding to remote commit `ecc2e242eebb`:

- Python and BUILD formatting passed with no changes.
- Version-bump and dangling-symlink checks passed.
- Scoped lint coverage passed.
- Eight materialisation lint, Ruff, Flake8, type, and unit-test targets passed.

After syncing to `a18037b37d58`, the dispatcher compatibility was revalidated:
the Wayve merge-base hook contract passed, all five Python files in PR #129802
were unchanged by Wayve isort and Black, the BUILD file passed Buildifier, and
all eight affected materialisation lint, type, and test targets passed.

The full local CI runner is not used by the hook because current `main` has two
local-only blockers:

- Catalyst attempts to execute `buildkite-agent`, which is not installed in the
  development environment.
- Repository-wide lint coverage fetches unrelated Valeo Artifactory
  dependencies and currently receives `401 Unauthorized` without
  `valeo-artifactory` credentials.

The package-scoped hook preserves the relevant guarantees without coupling
every push to those unrelated infrastructure prerequisites.

## Chat history

An active Codex task cannot erase its own conversation history. Start a new task
for a clean context; this note preserves the durable setup details needed for
that handoff.
