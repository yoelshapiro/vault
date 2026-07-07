# 2026-07-07 Parking Unparking-Mode Input Train

- Branch: `boris/parking-train-unparking-mode-input`
- Commit: `91e7485f7ece274bb54ca736b7ab7eb199bba1a4`
- Worktree: `/tmp/wayvecode-parking-train-unparking-mode-input`
- Change type: Code change, tests, training submission, monitoring, cleanup.

## Summary

Variant 3 separates model-facing parking mode from route-shortening parking mode:

- `DataKeys.PARKING_MODE` now uses `result.unparking_mode`.
- `DataKeys.UNPARKING_MODE` remains `result.unparking_mode`.
- `DataKeys.PARKING_ROUTE_SHORTENING_MODE` preserves `result.parking_mode` for route shortening.
- Parking deployment no longer forces model parking mode near the end of route; it adds an unparking latch driven by the gear latch and vehicle speed.

## Validation

- `git diff --check`
- Python compile check for changed files
- `bazel test //wayve/ai/si/datamodules:py_test --test_arg=-k --test_arg=test_add_parking_mode_splits_model_and_route_shortening_modes --test_arg=--no-cov --test_output=errors`
- `bazel test //wayve/ai/lib:test_data_pipes_lib_py_test --test_arg=--ignore=wayve/ai/lib/test/data/pipes/test_lidar_cpp_converter.py --test_arg=-k --test_arg=test_route_shortening_jitter_applies_only_to_parking --test_arg=--no-cov --test_output=errors`
- `bazel test //wayve/ai/si:test_deployment_wrapper --test_arg=-k --test_arg='parking_route_end_unparking_latch or add_driving_controls_does_not_force_parking_mode_at_route_end or hazard_indicator_requires_park_latch or parking_postprocess_latches_park_until_route_end_clears or parking_postprocess_gear_latch_flag_can_disable' --test_output=errors`
- `bazel test //wayve/ai/si:test_config_py_test_test_configs_utils_parking_release_2026_5_21_config_resolves --test_output=errors`

## Training Ledger

### Attempt 1

- Tag: `unpmode0`
- Job: `189857`
- Nickname: `joyous-gull-chocolate`
- Session: `session_2026_07_07_19_35_34_si_parking_bc_train_release_2026_5_21_unpmode0`
- Outcome: cancelled after W&B stayed at `trainer/global_step=176` and logs showed `Training hanging. Setting shared memory variable.`
- Slack: Boris was notified with the failure and investigation status.

### Attempt 2

- Tag: `unpmode1`
- Job: `189873`
- Nickname: `nautilus-silver-adventurous`
- Session: `session_2026_07_07_20_12_12_si_parking_bc_train_release_2026_5_21_unpmode1`
- Outcome: monitoring in progress.

