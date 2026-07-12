# 2026-07-12 Parking/PUDO CI Rerun

- Branch: `boris/pudo_generic_materialization`
- PR: `#117075`
- Change type: CI triage / rerun
- Areas: Buildkite presubmit, sampling dataset tests

## Summary

Investigated failing PR CI after the rebase and vehicle-cleanup push.

Findings:

- GitHub showed failing Buildkite presubmit build `533713` for `static-check suite` and `integration-cpu suite`.
- Buildkite MCP log tools were not available in the session.
- The available Buildkite token lacks `read_builds`, so logs could not be fetched via REST API.
- Used isolated worktree `/workspace/WayveCode-pr117075` because `/workspace/WayveCode` was on a different branch checkout.

Local verification:

- `/workspace/WayveCode/tools/ruff check --config build_support/python/ruff.toml wayve/ai/services/sampling`
- `./tools/ty check --config-file build_support/python/ty.toml wayve/ai/services/sampling`
- `bazel test //wayve/ai/services/sampling:test_datasets_py_lint_ruff --test_output=errors`
- `bazel test //wayve/ai/services/sampling:test_datasets_ty --test_output=errors`
- `bazel test //wayve/ai/services/sampling:test_debug_sampling_py_lint_ruff //wayve/ai/services/sampling:test_debug_sampling_ty //wayve/ai/services/sampling:test_tasks_py_lint_ruff //wayve/ai/services/sampling:test_tasks_ty --test_output=errors`
- `bazel test //wayve/ai/services/sampling:test_datasets_py_test --test_output=errors --test_arg=wayve/ai/services/sampling/test/datasets/parking_pudo/test_parking_pudo_filters.py`
- `bazel test //wayve/ai/services/sampling:test_datasets_py_test --test_output=errors`

All Bazel checks listed above passed locally.

Action:

- Triggered fresh Buildkite presubmit build `533726` for the current PR head with `build_support/tools/bkbuild.sh`.
- At last check, GitHub had attached build `533726` and `catalyst suite` was pending; old build `533713` failures were still visible.
