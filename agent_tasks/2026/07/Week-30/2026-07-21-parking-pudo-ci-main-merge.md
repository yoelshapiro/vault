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

Draft merge commit: `40e1bd2f7ab7` (`Merge branch 'boris/pudo_generic_materialization' into boris/pudo_generic_events`). The final stacked diff is 23 files and contains event creation, output-column propagation, Databricks publication, debug tooling, tests, and related autopublish bumps.

## Validation

- `bazel test //wayve/ai/services/sampling:test_datasets --test_output=errors`: 4/4 targets passed on both the core and stacked branches.
- `bazel test //wayve/ai/services/sampling:test_tasks --test_output=errors`: 4/4 targets passed; pytest reported 231 passed.
- `bazel test //wayve/ai/services/sampling:test_debug_sampling --test_output=errors`: 3/3 targets passed.
- Scoped `git diff --check` and conflict-marker audits passed for both PR deltas.

## CI and tooling notes

- The documented automatic affected-target resolver no longer accepts the skill's arguments. Its compatible invocation then attempted global repository resolution and was blocked by unrelated registry credentials, so BUILD ownership was used to select the encompassing targets.
- Refreshed ACR authentication successfully for `wayve`, `wayvetraining`, and `wayveacrprodflyte`.
- After pushing #117075, `compile_protos` and the other completed GitHub checks passed; Buildkite presubmit was running.
- After pushing #126237, GitHub checks restarted and the PR remained a draft based on `boris/pudo_generic_materialization`.

## Outcome

Both branches were pushed with normal merge commits and no force push. The reviewed core PR remains open against `main`; the event work remains isolated in draft PR #126237.
