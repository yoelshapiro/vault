# Route-shortening PR CI failures fix

- Date: 2026-03-24
- Branch: `boris/03-23-park-route-shortening-v2`
- Buildkite: presubmit #434402
- Scope: investigate `$obs-buildkite-jobs` failures and patch branch-local issues.

## Failing signals identified
- CPU: `//wayve/ai/zoo/data:test_zoo_data_py_test`
  - `test_insert_parking_stop_route_position_falls_back_to_first_lookahead_when_entry_missing` failed (`PARKING_MODE` was `False` instead of `True`).
- CPU: `//wayve/ai/si:test_config_py_test`
  - `test_regression[bc]` and `test_regression[bc_alpha2]` failed due to new OTF keys not present in baseline snapshots.
- Lint: 6 `wayve/ai/lib:*_py_lint_pylint` targets failed from pylint complexity in `RouteMapFetcher._fetch_route_map`.
- integration-gpu: `//wayve/ai/drive/rl:py_checks_py_test` failed, but stdout was truncated in Buildkite log and no branch-specific stack trace surfaced.

## Code changes made
1. `wayve/ai/zoo/data/parking.py`
- In `_compute_parking_mode_and_entry_index`, changed boundary handling:
  - from `time_to_end <= min_parking_duration_sec`
  - to `time_to_end < min_parking_duration_sec`
- Rationale: keep parking active at exact minimum-duration boundary.

2. `wayve/ai/si/test/test_config_inputs/reference_bc.yaml`
3. `wayve/ai/si/test/test_config_inputs/reference_bc_alpha2.yaml`
- Added new OTF default keys under datamodule:
  - `enable_route_shortening_for_parking: false`
  - `route_shortening_stop_jitter_m: 20.0`
  - `route_shortening_apply_probability: 0.9`
- Also aligned key order around `persistent_workers`/`nvdec_threads` with generated config.

## Validation run locally
- `bazel test //wayve/ai/zoo/data:test_zoo_data_py_test --test_arg='-k=test_insert_parking_stop_route_position_falls_back_to_first_lookahead_when_entry_missing' --test_output=errors` ✅
- `bazel test //wayve/ai/si:test_config_py_test --test_arg='-k=test_regression[bc] or test_regression[bc_alpha2]' --test_output=errors` ✅
- `bazel test //wayve/ai/lib:test_benchmark_dataloading_py_lint_pylint //wayve/ai/lib:test_data_lib_py_lint_pylint //wayve/ai/lib:test_deploy_py_lint_pylint //wayve/ai/lib:test_inference_py_lint_pylint //wayve/ai/lib:test_lib_py_lint_pylint //wayve/ai/lib:test_on_dual_gpu_py_lint_pylint --test_output=errors` ✅

## Notes
- No commits were created in this step.
- integration-gpu failure may still need rerun/isolated artifact logs if it reproduces after these fixes.
