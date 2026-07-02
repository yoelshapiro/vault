# 2026-07-02 PR 120390 Stateless EOR Hysteresis

## Summary

Updated PR `wayveai/WayveCode#120390` (`06-22-si-group-interleave-control-support`) to use stateless end-of-route hysteresis for SI interleave control.

## Change

- Added `END_OF_ROUTE_EXIT_THRESHOLD = 4.5e4`.
- Kept `END_OF_ROUTE_THRESHOLD = 3.75e4`.
- For driving/default interleave group, `interleave_control` is true when route signal is below the enter threshold.
- For parking interleave group, `interleave_control` is true only when route signal is above the exit threshold and speed is above `HANDOVER_SPEED_MS`.
- Removed the previous parking-group polarity of `end_of_route OR low_speed`.
- Updated regression coverage in `test_deployment_wrapper_codegen.py`.

## Branch

- PR: `#120390`
- Branch: `06-22-si-group-interleave-control-support`
- Commit: `1ed05d9ec195`

## Validation

Passed:

```bash
IN_WAYVE_META_UPDATE=1 WAYVECODE_MAIN_COMMIT_META_OVERRIDE=$(git rev-parse --short=12 HEAD) \
  bazel test //wayve/ai/zoo/deployment:test_deployment_py_test \
  --test_arg='-k=test_interleave_control_uses_stateless_end_of_route_hysteresis or test_make_wrapper_class_adds_interleave_control_output_and_preserves_fields'
```

Notes:

- The first Bazel attempt failed during repository setup with `OSError: [Errno 28] No space left on device` while extracting `pyspark`.
- Freed space by deleting task-owned old Bazel output bases from previous stateless EOR redeploy worktrees, then reran successfully.
- PR checks were queued after push.

