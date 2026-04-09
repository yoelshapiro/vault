# 2026-04-02 — Training export interleave defaults

## Context
PR #102398 introduced interleave-control wrapper behavior and narrowed gear passthrough to parking + interleave wrappers. Export defaults were already wired for deploy CLI, but training checkpoint ingestion paths were not explicitly passing interleave-control flags.

## Goal
Ensure training-produced deployable models set interleave control only for parking exports:
- parking model: `interleave_control_group="parking"`
- non-parking model: do not pass interleave-control kwargs (keep default behavior)

## Changes
- Updated `wayve/ai/si/models/training.py`:
  - `BcTrainingModule.to_deployable_model()` now computes parking mode from the actual export module (`model or self`) and conditionally passes interleave kwargs only when parking:
    - `enable_interleave_control=True`
    - `interleave_control_group="parking"`
- Updated `wayve/ai/si/models/offline_rl.py` callback export path:
  - conditionally adds parking-only interleave kwargs when calling `prepare_deployment_model`.
- Updated `wayve/ai/si/offline_rl/bc_rl_combined.py` callback export path:
  - conditionally adds parking-only interleave kwargs when calling `prepare_deployment_model`.
- Added regression tests in `wayve/ai/si/test/models/test_training.py`:
  - verifies driving exports do not pass interleave kwargs.
  - verifies parking export model sets interleave group to `"parking"`.
- Addressed Becky PR comments:
  - `wayve/ai/si/models/deployment.py`:
    - require `deployment_config` when `enable_interleave_control=True` (fail fast).
    - merged interleave-group/config synchronization into one readable conditional flow.
    - updated docstring to explicitly state `deployment_config` is required for interleave control.
  - `wayve/ai/si/models/training.py`:
    - replaced `dict.fromkeys(...)->tuple(...)` with explicit ordered list construction + dedupe.
  - Added focused tests:
    - `wayve/ai/si/test/models/test_deployment.py`: interleave requires deployment config.
    - `wayve/ai/si/test/models/test_training.py`: driving-controls key order + dedup for parking/behavior-control combinations.
- Added direct unit coverage for end-of-route helper in `wayve/ai/zoo/deployment/test/test_interleave_control_wrapper.py`:
  - threshold behavior around `END_OF_ROUTE_THRESHOLD` (below / boundary / above)
  - verifies `_is_end_of_route` ignores the third route-map channel.
- Follow-up: moved base-wrapper-only constants/helper coverage into existing deployment test suite `wayve/ai/si/test/models/test_deployment.py` and removed them from interleave-specific tests.

## Validation
- `python -m py_compile wayve/ai/si/models/training.py wayve/ai/si/models/offline_rl.py wayve/ai/si/offline_rl/bc_rl_combined.py wayve/ai/si/test/models/test_training.py` (pass)
- `python -m py_compile wayve/ai/zoo/deployment/test/test_interleave_control_wrapper.py` (pass)
- `python -m py_compile wayve/ai/si/models/deployment.py wayve/ai/si/models/training.py wayve/ai/si/test/models/test_deployment.py wayve/ai/si/test/models/test_training.py` (pass)
- Bazel test execution was blocked by registry auth while fetching Azurite image:
  - `https://wayve.azurecr.io/oauth2/token?... repository:azure-storage/azurite:pull ...` returned `401 Unauthorized`.

## Branch / PR
- Branch: `03-20-si-group-interleave-control-support`
- PR: #102398
