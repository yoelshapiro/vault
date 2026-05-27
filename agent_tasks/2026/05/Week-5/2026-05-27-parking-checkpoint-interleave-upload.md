# Parking checkpoint interleave upload

- Branch: `boris/05-21-updated-pudo-config`
- Change type: fix/test
- Areas: `wayve/ai/si/models/training.py`, `wayve/ai/si/test/models/test_training.py`

## Summary

Parking training checkpoint uploads were already creating a deployable wrapper with interleave control enabled, but the checkpoint upload `DeploymentConfig` did not carry the parking interleave group. Added `interleave_group="parking"` when `use_parking_mode` is enabled so uploaded checkpoints serialize the same DMI metadata that explicit deployment adds later.

## Verification

Tried to run:

```bash
bazel test //wayve/ai/si:py_test_test_training_core --test_arg=-k --test_arg=test_get_deployment_config_sets_parking_interleave_group
```

Bazel analysis failed before test execution because `wayve.azurecr.io/azure-storage/azurite` returned `401 Unauthorized`.


## Branch worktree update

Applied the same fix in worktree `/tmp/WayveCode-03-20-si-group-interleave-control-support` on branch `03-20-si-group-interleave-control-support`.

Verification in that worktree:

```bash
bazel test //wayve/ai/si:py_test_test_training_core --test_arg=-k --test_arg=test_get_deployment_config_sets_parking_interleave_group
```

Bazel analysis again failed before test execution because `wayve.azurecr.io/azure-storage/azurite` returned `401 Unauthorized`.
