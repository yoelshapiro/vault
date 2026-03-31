# 2026-03-31 — Radar inference config propagation fix (deploy path)

## Summary
Fixed a deploy-path regression where `radar_data` in generated Gen2 inference configs was emitted with default values (`points_per_scan = 0`, empty `radar_features`) even when training config had valid radar settings.

## Root Cause
`si/deploy.py` typically loads `DeploymentConfig` from legacy `policy_io_config.yml`. That path did not carry radar feature/point settings, and DMI `create_input_entries` did not populate those fields for `radar_data` unless explicitly set.

## Changes Made
- `wayve/ai/lib/interfaces_v2.py`
  - Added radar options to `DeploymentConfig`:
    - `radar_features`
    - `max_radar_points_per_scan`
  - Added normalization helpers for radar feature enum values.
  - Updated DMI `create_input_entries` to set:
    - `entry.radar_data.radar_features`
    - `entry.radar_data.points_per_scan`
  - Restored `DeploymentConfig.set_input_output_keys` as a class method (it had been accidentally displaced).

- `wayve/ai/lib/legacy.py`
  - Extended `load_deployment_config(...)` to read optional:
    - `radar_features`
    - `max_radar_points_per_scan`

- `wayve/ai/lib/deploy.py`
  - Extended `deployment_config_to_policy_io(...)` to persist:
    - `radar_features`
    - `max_radar_points_per_scan`

- `wayve/ai/si/deploy.py`
  - Added fallback hydration from `full_config.yml` datamodule when legacy policy_io is missing/invalid radar settings:
    - `datamodule.radar_features`
    - `datamodule.max_radar_points_per_scan`

## Tests
- Added coverage:
  - `wayve/ai/lib/test/test_interface_v2.py`
    - `test_create_input_entries_with_radar_config`
  - `wayve/ai/lib/test/test_legacy.py`
    - `test_legacy_models_with_radar_config`
  - `wayve/ai/lib/test/test_deploy.py`
    - extended `test_controller_options_roundtrip` to assert radar field roundtrip

## Validation Commands
- `bazel test //wayve/ai/lib:test_lib_py_test --test_arg=--cov-fail-under=0 --test_arg='-k=test_create_input_entries_with_radar_config or test_legacy_models_with_radar_config'`
- `bazel test //wayve/ai/lib:test_deploy_py_test --test_arg=--cov-fail-under=0 --test_arg=-k=test_controller_options_roundtrip`
- `bazel test //wayve/ai/lib:test_lib_py_lint_flake8 //wayve/ai/lib:test_lib_py_lint_pylint //wayve/ai/lib:test_lib_mypy`
  - flake8/pylint passed
  - mypy failed for a pre-existing unrelated issue in `wayve/ai/lib/data/pipes/routes.py`

