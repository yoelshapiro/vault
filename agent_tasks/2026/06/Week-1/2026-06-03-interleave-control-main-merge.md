# 2026-06-03 Interleave Control Main Merge

## Summary
- Merged latest `origin/main` into `03-20-si-group-interleave-control-support`.
- Resolved seven conflicts by keeping interleave-control support and taking main's newer deployment/training behavior.
- Commit: `d7b14ed5a32d`.

## Conflict Decisions
- `deploy.py`: kept `enable_interleave_control`, `interleave_control_group`, and main's `dynamo_export`.
- `deployment.py`: kept interleave validation and main's shift-by-wire fail-fast guard.
- `training.py`: kept parking `interleave_group`, main `num_path_waypoints`, and parking auto interleave deployment kwargs.
- `behavior_customization.py`: `INITIATE_AUTO_PARKING` now writes `MITIGATION_REQUEST`; parking direction, shift-by-wire, and SILC remain passthrough.
- `deployment_wrapper.py`: kept shared understeer helper with shape-[1] vehicle-model indexing; parking wrapper reuses it.
- `test_deployment.py`: kept both branch route-threshold tests and main MRM/shift-by-wire tests.
- `reference_rl.yaml`: kept main `use_mitigation_request: true` plus branch `enable_interleave_control: false`.

## Validation
- `git diff --check`: passed.
- `rg "^<<<<<<< |^>>>>>>> "`: no merge conflict markers.
- `bazel test //wayve/ai/zoo/deployment:test_deployment_py_test`: passed.
- `bazel test //wayve/ai/si:py_test_test_deployment_core`: blocked during analysis by ACR auth, `GET returned 401 Unauthorized` for `wayve.azurecr.io/azure-storage/azurite`.
