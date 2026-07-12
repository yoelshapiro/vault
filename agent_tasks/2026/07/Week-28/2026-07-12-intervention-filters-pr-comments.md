# 2026-07-12 Intervention Filters PR Comments

- Branch: `boris/pudo_generic_materialization`
- PR: `#117075`
- Area: `wayve/ai/services/sampling/datasets/parking_pudo/intervention_filters.py`
- Change type: Code cleanup, tests

## Summary

Addressed selected review comments in Parking/PUDO intervention filters:

- Renamed the remain-stopped helper to `_does_not_remain_stopped_filter`.
- Added `_RunSignals` timestamp-index helpers and reused them in intervention filters and timestamp-search call sites in `signals.py`.
- Split pre/post intervention window marking and frame-existence helpers.
- Centralised the repeated `anchor_only` versus full-window selection block.
- Moved the empty `gear_change_indices` check before the intervention loop.
- Simplified brake-override side-table parsing through `_as_list`, keeping only missing-column and mismatched-length checks.
- Did not change pre-window automation behavior.

## Verification

- `python -m py_compile wayve/ai/services/sampling/datasets/parking_pudo/signals.py wayve/ai/services/sampling/datasets/parking_pudo/intervention_filters.py`
- `tools/ruff check --config build_support/python/ruff.toml wayve/ai/services/sampling/datasets/parking_pudo/signals.py wayve/ai/services/sampling/datasets/parking_pudo/intervention_filters.py`
- `tools/ruff format --check --config build_support/python/ruff.toml wayve/ai/services/sampling/datasets/parking_pudo/signals.py wayve/ai/services/sampling/datasets/parking_pudo/intervention_filters.py`
- `bazel test //wayve/ai/services/sampling:test_datasets`
