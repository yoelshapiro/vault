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

## 2026-05-31 Retest

- Refreshed ACR auth with `az acr login --name wayve`.
- Fixed SI flake8 by removing unused `ActionsDiscretizer` import from parking config.
- Fixed route-map signature parity by adding `enable_route_shortening_for_parking` to `generate_route_map`.
- Passed: `//wayve/ai/si:py_lint_ruff`, `//wayve/ai/si:py_lint_flake8`, `//wayve/ai/si:ty`.
- Passed: `//wayve/ai/lib:test_data_pipes_lib_py_lint_ruff`, `//wayve/ai/lib:test_data_pipes_lib_py_lint_flake8`, `//wayve/ai/lib:test_data_pipes_lib_ty`.
- Passed: route-map focused pytest via `//wayve/ai/lib:test_data_pipes_lib_py_test --test_arg=wayve/ai/lib/test/data/pipes/test_generate_route_map.py --test_arg=--no-cov`.
- Passed: route generation focused pytest via `//wayve/ai/lib:test_lib_py_test --test_arg=wayve/ai/lib/test/test_routes.py --test_arg=--no-cov`.
- Full `//wayve/ai/lib:test_data_pipes_lib_py_test` still fails for unrelated fixture/auth issues: parquet/image fixtures are LFS pointer text and some ABFSS reads are unauthenticated.

### 2026-05-31 LR schedule override
- Added BcTrainingModule.lr_scheduler_num_steps so training can stop at 30k while LR scheduler uses 100k total steps.
- Fixed parking training config import/instantiation blockers: split_alpha2_alpha3_partitions helper, stale parking datamodule kwargs, and missing clean_parking_gear_labels helper.
- Validation: git diff --check; SI/datamodule/CLI/zoo affected Bazel checks; config full/selective registration targets.

### 2026-05-31 split helper cleanup
- Switched parking_config.py to import split_alpha2_alpha3_partitions from wayve.ai.si.config.
- Removed duplicate helper from baseline/candidate.py.
- Validation: git diff --check; config full/selective registration; SI CLI lint/type/pytest.
