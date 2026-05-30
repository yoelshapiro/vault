# Parking Past30 Port

- Date: 2026-05-30
- Branch: `codex/parking-port-past30`
- PR: N/A
- Change type: Code port / merge
- Areas: `/workspace/default/wayve/ai/si`, `/workspace/default/wayve/ai/zoo`, `/workspace/default/wayve/ai/lib/data/pipes`

## Summary

Ported selected parking/PUDO changes from `origin/guy/parking-past30-no-standstill-gear-aug` onto `origin/main`.

## Changes

- Copied parking datamodule/config contents while excluding `allow_short_path` and `enable_early_path_gating` additions.
- Added parking route-shortening data flow through OTF, parking helpers, data keys, and route-map fetching.
- Added parking deployment interleave control and kept main deployment kwargs.
- Kept checkpoint backfills for `gear_direction`, `parking_mode`, and main's `mitigation_request` backfill.

## Validation

- `git diff --check` passed.
- `bazel test //wayve/ai/zoo/data:test_zoo_data` passed.
- `bazel test //wayve/ai/si/datamodules:py_lint_ruff //wayve/ai/si/datamodules:py_lint_flake8 //wayve/ai/si/datamodules:ty //wayve/ai/zoo/deployment:test_deployment_py_lint_ruff //wayve/ai/zoo/deployment:test_deployment_py_lint_flake8 //wayve/ai/zoo/deployment:test_deployment_ty` passed.
- `bazel test //wayve/ai/zoo/deployment:test_deployment_py_test` passed.
- `//wayve/ai/lib:test_data_pipes_lib` and parent `//wayve/ai/si` lint/type checks were blocked by ACR auth: `wayve.azurecr.io` returned `401 Unauthorized` for `azure-storage/azurite`.
