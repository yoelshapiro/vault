# 2026-07-12 Debug Sampling PR Comments

## Summary

Addressed the active PR review comments on `wayve/ai/services/sampling/datasets/debug_sampling.py` for Parking/PUDO generic materialisation.

## Changes

- Added shared metadata column constants for event-row printing and filter-column detection.
- Extracted materialized masks partition path construction into local helpers, deriving the path from the same `DEFAULT_PARTITION` column list used by the Ray masks writer.
- Added a clear empty-result message when a materialized masks partition exists but the CLI query returns zero rows.

## Verification

```bash
bazel test //wayve/ai/services/sampling:test_debug_sampling
```

Result: passed (`test_debug_sampling_py_lint_flake8`, `test_debug_sampling_py_lint_ruff`, `test_debug_sampling_ty`).
