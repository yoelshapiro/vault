# Split Parking/PUDO Events Into a Stacked Draft PR

This ExecPlan is a living document. The sections `Progress`, `Surprises & Discoveries`, `Decision Log`, and `Outcomes & Retrospective` must be kept up to date as work proceeds. It is maintained in accordance with `/home/borisindelman/.codex/PLANS.md`.

## Purpose / Big Picture

Pull request #117075 currently combines the core Parking/PUDO generic materialisation with a compact event-table dataset, a Databricks publication script, shared sampling framework support, broad release-version bumps, and expanded debugging utilities. The split preserves the existing pull request and its accumulated reviews for the core materialisation, while moving the event-table capability into a new stacked draft pull request. A reviewer should be able to inspect #117075 and see only the core bucket materialisation, and inspect the draft follow-up to see only event creation and its supporting framework and tooling changes.

## Progress

- [x] (2026-07-20 20:54Z) Inspected the current PR file list, unresolved review context, and event dependency edges.
- [x] (2026-07-20 20:54Z) Agreed the split boundary with Boris.
- [x] (2026-07-20 20:58Z) Committed the CODEOWNERS additions on `boris/pudo_generic_materialization`.
- [x] (2026-07-20 21:00Z) Removed the deferred event scope from PR #117075 and updated its description.
- [x] (2026-07-20 21:02Z) Validated, committed, and pushed the narrowed current PR.
- [x] (2026-07-20 21:04Z) Created `boris/pudo_generic_events` from the narrowed head and reapplied the deferred scope.
- [x] (2026-07-20 21:15Z) Validated, committed, pushed, and opened draft PR #126237.
- [x] (2026-07-20 21:18Z) Updated this note and `agents-change-log.md`, then removed the temporary todo entry.

## Surprises & Discoveries

- Observation: `wayve/ai/services/sampling/test/datasets/parking_pudo/test_parking_pudo_filters.py` mixes core bucket tests with event-table tests.
  Evidence: the event-table block starts with `test_parking_pudo_events_dataset_uses_single_unsplit_bucket`, while most tests in the same file cover the core parking, PUDO, anchor, gear-change, and intervention filters.
- Observation: `wayve/ai/services/sampling/datasets/debug_sampling.py` is a general 346-line debugging expansion rather than a dependency of the core materialisation.
  Evidence: its diff adds materialised-mask inspection, timestamp lookup, parquet inspection, and CLI options; it can be deferred with the events work without changing core bucket behavior.
- Observation: the requested CODEOWNERS path `datasets/p2p` does not exist.
  Evidence: the tracked path is `wayve/ai/services/sampling/datasets/bc/p2p/dataset.py`, so the ownership rule uses `datasets/bc/p2p`.
- Observation: the new shared-column regression initially failed because its `SimpleNamespace` dataset fixture lacked the production `iter_buckets()` interface.
  Evidence: `test_extra_output_columns_survive_masks_and_buckets` raised `AttributeError`; adding the same fixture method used by the neighboring bucket test made the focused regression pass.

## Decision Log

- Decision: Keep PR #117075 and add a normal narrowing commit instead of rewriting its history.
  Rationale: the pull request already has comments and approvals; retaining its branch and review history is the user's explicit priority.
  Date/Author: 2026-07-20 / Codex with Boris.
- Decision: Create the follow-up as a stacked draft based on `boris/pudo_generic_materialization`.
  Rationale: the event implementation depends on the new Parking/PUDO signals, filters, and dataset definitions introduced by #117075.
  Date/Author: 2026-07-20 / Codex with Boris.
- Decision: Revert the current-PR narrowing commit on the stacked branch.
  Rationale: this recreates exactly the deferred changes, including mixed-file hunks, without manual duplication or destructive history edits.
  Date/Author: 2026-07-20 / Codex.
- Decision: Keep core Parking/PUDO tests in #117075 and defer only the event-table test block.
  Rationale: the core PR must retain regression coverage even though the test file lives outside `datasets/parking_pudo`.
  Date/Author: 2026-07-20 / Codex with Boris.

## Outcomes & Retrospective

PR #117075 was preserved and narrowed through normal commits, retaining its discussion history. Commit `951c9aa4d37f` adds the requested CODEOWNERS coverage, and commit `53e4f3021356` removes event creation and its supporting runtime/tooling scope. Its final 17-file diff contains the core Parking/PUDO datasets, store and BUILD registration, core tests, release metadata, README, and CODEOWNERS changes. GitHub currently reports `REVIEW_REQUIRED` after the new commits, so branch protection may require approvals to be refreshed even though the PR and comments were preserved.

Draft PR #126237, "Add Parking/PUDO generic event materialisation", is stacked on `boris/pudo_generic_materialization`. Commit `3b5c04a1657d` restores the exact 22-file deferred scope: compact event rows, shared extra-output-column propagation, event tests and documentation, the Databricks/Flyte publisher, debug-sampling expansion, registration, and related autopublish bumps.

Validation completed:

    bazel test //wayve/ai/services/sampling:test_datasets_py_test --test_arg=-k --test_arg=parking_pudo --test_arg=--no-cov
    bazel test //wayve/ai/services/sampling:test_datasets_py_test --test_arg=-k --test_arg='parking_pudo_events or parking_pudo_event_metadata' --test_arg=--no-cov
    bazel test //wayve/ai/services/sampling:test_tasks_py_test --test_arg=-k --test_arg=extra_output_columns --test_arg=--no-cov
    bazel test //wayve/ai/services/sampling:test_debug_sampling

All four commands passed. Both PR descriptions were updated to match the final split and cross-link the dependency.

## Context and Orientation

The working copy for PR #117075 is `/workspace/WayveCode-pr117075` on branch `boris/pudo_generic_materialization`. The unrelated primary worktree at `/workspace/WayveCode` contains other local changes and must not be modified. The PR base is `main`.

The core implementation lives under `wayve/ai/services/sampling/datasets/parking_pudo/`. The compact event dataset is implemented by `event_table.py` and `events/`. It requires `BucketedDataset.extra_output_columns` in `common/api/dataset.py`, propagation in `common/masks.py`, and a regression in `common/test/test_tasks.py`. The event dataset is registered through `datasets/store.py` and listed in `BUILD`. Event documentation is mixed into the shared Parking/PUDO README. Eleven existing dataset `autopublish.yaml` files contain version-only bumps associated with the shared sampling change.

## Plan of Work

First commit the pending `docs/CODEOWNERS` edit as an atomic ownership change. Then narrow #117075 by reverting the three shared extra-output-column files, the eleven external version-only autopublish bumps, and `datasets/debug_sampling.py` to the PR base. Delete the newly added event-only files. Edit the mixed `BUILD`, `datasets/store.py`, README, and Parking/PUDO test file so they retain core materialisation content but no event-table registration, documentation, imports, or tests.

Run focused Bazel tests for the remaining Parking/PUDO datasets and check the diff against the PR base. Commit the narrowing as one conventional commit and push `boris/pudo_generic_materialization`. Update the existing PR description so it no longer claims event output, extra output columns, external version bumps, Databricks upload support, or debug-tool changes.

Create `boris/pudo_generic_events` from the narrowed head. Revert the narrowing commit on this branch, which reintroduces only the deferred scope. Review the stacked diff against `boris/pudo_generic_materialization`, run the event-focused dataset test and the shared extra-output-column test, then push. Read `docs/pull_request_template.md`, fill every section, and open a draft pull request with base `boris/pudo_generic_materialization`.

## Concrete Steps

Run all repository commands from `/workspace/WayveCode-pr117075`.

    git status --short --branch
    git add docs/CODEOWNERS
    git commit -m "chore: expand parking CODEOWNERS"

Apply the narrowing edits using reviewable file-scoped patches, then inspect:

    git diff --check
    git diff --name-status 93b144b18c0a3b804971aea32039f0ca5a02db10...HEAD
    bazel test //wayve/ai/services/sampling:test_datasets_py_test --test_arg=-k --test_arg=parking_pudo --test_arg=--no-cov

After committing and pushing the narrowed PR, create the stacked branch and reapply the removal commit:

    git switch -c boris/pudo_generic_events
    git revert <narrowing-commit>
    git diff --check
    git diff --name-status boris/pudo_generic_materialization...HEAD

Run event-focused validation, push, and create the draft PR with `gh pr create --draft --base boris/pudo_generic_materialization`.

## Validation and Acceptance

The narrowed #117075 diff must contain core files under `datasets/parking_pudo/`, excluding `event_table.py` and `events/`; core registration in `datasets/store.py`; core source and test entries in `BUILD`; `docs/CODEOWNERS`; and the core Parking/PUDO regression test file. It must not contain shared extra-output-column changes, external dataset version bumps, or `debug_sampling.py`.

The stacked draft diff must contain the event-only files, shared extra-output-column support, event-specific README/BUILD/store/test hunks, external version bumps, and deferred debug tooling. Both diffs must pass `git diff --check`. Focused Bazel tests must pass or any environment-only blocker must be documented with the exact error.

## Idempotence and Recovery

No history rewrite, reset, clean, or force push is used. The narrowing commit is the exact inverse source for the stacked follow-up: if branch creation or validation fails, remain on the narrowed current branch and retry creating the stacked branch, then revert the same commit. The primary `/workspace/WayveCode` worktree and its unrelated modifications are never touched.

## Artifacts and Notes

PR #117075 head moved from `9ed1d77e70c85807508cab1194379281ad918257` to `53e4f302135672012dd8e08d65836cb9e8ea95cc`; base is `93b144b18c0a3b804971aea32039f0ca5a02db10`. Draft PR #126237 head is `3b5c04a1657dc2e9f16e5a7d52160659172595c9` and its base is `boris/pudo_generic_materialization`. The isolated worktree is clean and the unrelated primary worktree was not modified.

## Interfaces and Dependencies

The current PR retains the existing sampling dataset interfaces. The follow-up restores `BucketedDataset.extra_output_columns: Sequence[str]`, preserves configured Arrow columns in `run_filters_on_batch`, registers `parking_pudo/events`, and provides the Databricks/Flyte-compatible upload entrypoint. The follow-up draft depends on #117075 and therefore targets `boris/pudo_generic_materialization`, not `main`.
