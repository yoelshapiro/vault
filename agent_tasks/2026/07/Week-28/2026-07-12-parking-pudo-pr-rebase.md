# 2026-07-12 Parking/PUDO PR Rebase

- Branch: `boris/pudo_generic_materialization`
- PR: `#117075`
- Change type: Git rebase / conflict resolution
- Areas: sampling dataset metadata, Parking/PUDO dataset files

## Summary

Rebased the PR branch onto `origin/main` with `git rebase --autostash origin/main`.

Conflict decisions:

- Kept both independent `BucketedDataset` fields in `common/api/dataset.py`: upstream `include_source_bucket` and PR `extra_output_columns`.
- Kept parking PUDO release metadata entries in `wayve/ai/services/sampling/BUILD`.
- Dropped stale `bc/split_alpha2_alpha3_hash_merged` release references while resolving old generated version-bump conflicts, because `origin/main` no longer contains that dataset path.
- Kept `origin/main`'s `.codecov.yml` deletion rather than resurrecting the old generated codecov update.

Verification:

- Rebase completed successfully.
- Checked final status: branch is rebased locally and diverges from the old remote PR head until force-pushed.
- Checked for conflict markers under `wayve/ai/services/sampling`.
- Checked the final PR diff does not include stale `.codecov.yml` or `bc/split_alpha2_alpha3_hash_merged` paths.
