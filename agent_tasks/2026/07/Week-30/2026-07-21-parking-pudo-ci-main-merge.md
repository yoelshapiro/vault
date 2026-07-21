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
6. The checklist bot committed ten external autopublish bumps to the core branch. A normal revert proved this is policy-enforced: checklist immediately reapplied the same bumps as `3c9d58c1fbfe`. Kept that required commit so core CI can pass, merged it into the draft, and committed the draft's next versions as `09cd600121be` so the event PR still owns the subsequent publish step.

Primary draft merge commit: `40e1bd2f7ab7` (`Merge branch 'boris/pudo_generic_materialization' into boris/pudo_generic_events`). The final draft head is `09cd600121be`; its 23-file stacked diff contains event creation, output-column propagation, Databricks publication, debug tooling, tests, and the next autopublish bumps.

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
- Checklist always compares non-default branches with `main`, not the stacked PR base, and has no supported per-PR version-bump skip. Therefore core #117075 necessarily contains ten generated bumps; draft #126237 advances those same services again for its event changes.

## Outcome

Both branches were pushed with normal merge/revert commits and no force push. Core head is `3c9d58c1fbfe`: the tested 17-file source tree plus ten checklist-generated version bumps. Draft head is `09cd600121be`: the tested 23-file event tree with those services advanced to the next versions.
