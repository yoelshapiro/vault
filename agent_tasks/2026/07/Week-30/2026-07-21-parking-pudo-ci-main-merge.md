# Repair Parking/PUDO PR CI After Main Drift

## Summary

Updated both Parking/PUDO branches to current `main` without rewriting history, fixed compatibility and test-fixture regressions, ran the encompassing sampling suites, and pushed both branches.

- Core PR: #117075, branch `boris/pudo_generic_materialization`.
- Draft follow-up: #126237, branch `boris/pudo_generic_events`, based on the core branch.
- Isolated worktree: `/workspace/WayveCode-pr117075`; the unrelated primary worktree was not modified.

## Failures and fixes

1. GitHub `compile_protos` rejected #117075 as stale. Merged current `origin/main` with merge commit `d32785710b28` to preserve the existing branch, comments, and approvals.
2. Current main removed `exclude_runs_not_in_filtered_corpus`. Removed the stale import and exclusion from the core Parking/PUDO bundles and from the event-only dataset. Core fix commit: `dcecb659b55a` (`fix: align Parking/PUDO filters with main`).
3. Core Flake8 found four event-only imports left in the narrowed PR test file. Removed them from the core branch and restored them only in the stacked event branch.
4. Merging the updated core into the draft produced additive conflicts. Kept both `BucketedDataset.extra_output_columns` and main's `source_tables`; combined main's bucket-debug options with the event/parquet debugging additions; advanced each affected autopublish version to current main plus one.
5. The task suite found partial `SimpleNamespace` dataset mocks missing the new interface. Added empty `extra_output_columns` values to five existing mocks and `all_referenced_attributes` to the new extra-output-column regression fixture.
6. The checklist bot committed ten external autopublish bumps to the core branch. Buildkite static-check then showed that newer main commits had consumed those versions, so they were unbumped in CI's merge tree. Merged latest main, ran `make bump-versions`, passed the exact `bazel run //build_support/suites/static_checks:versions_bumped` check, and advanced the draft versions one further step beyond the refreshed core.

Primary draft merge commit: `40e1bd2f7ab7` (`Merge branch 'boris/pudo_generic_materialization' into boris/pudo_generic_events`). The final draft head is `749c5ad65bdc`; its 23-file stacked diff contains event creation, output-column propagation, Databricks publication, debug tooling, tests, and the next autopublish bumps.

## Validation

- `bazel test //wayve/ai/services/sampling:test_datasets --test_output=errors`: 4/4 targets passed on both the core and stacked branches.
- `bazel test //wayve/ai/services/sampling:test_tasks --test_output=errors`: 4/4 targets passed; pytest reported 231 passed.
- `bazel test //wayve/ai/services/sampling:test_debug_sampling --test_output=errors`: 3/3 targets passed.
- Scoped `git diff --check` and conflict-marker audits passed for both PR deltas.
- After the final main merge, `test_datasets` passed 4/4 again on both branches and `versions_bumped` passed on both branches.

## CI and tooling notes

- The documented automatic affected-target resolver no longer accepts the skill's arguments. Its compatible invocation then attempted global repository resolution and was blocked by unrelated registry credentials, so BUILD ownership was used to select the encompassing targets.
- Refreshed ACR authentication successfully for `wayve`, `wayvetraining`, and `wayveacrprodflyte`.
- Buildkite build 542421 passed CPU, lint, catalyst, autopublish, and Black Duck but static-check detected the version baseline had moved with main.
- Merged current main and generated versions locally before pushing, eliminating the bot/race dependency for the replacement CI run.
- After pushing #126237, GitHub checks restarted and the PR remained a draft based on `boris/pudo_generic_materialization`.
- Checklist always compares non-default branches with `main`, not the stacked PR base, and has no supported per-PR version-bump skip. Therefore core #117075 necessarily contains ten generated bumps; draft #126237 advances those same services again for its event changes.
- Replacement Buildkite build 542435 passed all suites: catalyst, static-check, CPU, integration CPU, lint, autopublish, Black Duck, coverage, and result summary.
- Draft #126237 passed its GitHub compile/protobuf checks and remained draft/clean. Core #117075 was CI-green but returned to `REVIEW_REQUIRED` after the new commits.

## Outcome

Both branches were pushed with normal merge/revert commits and no force push. Core head is `5e6710e2f8d8`: the tested source tree on current main plus ten locally validated checklist-required version bumps. Draft head is `749c5ad65bdc`: the tested 23-file event tree with those services advanced to the next versions.
