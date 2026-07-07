# 2026-07-07 Parking Unparking-Mode Input Train

- Branch: `boris/parking-train-unparking-mode-input`
- Commit: `022e076ee315aff1ed8e314ba58c7b484c16416d`
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
- `bazel test //wayve/ai/lib:test_data_pipes_lib_py_test --test_arg=--ignore=wayve/ai/lib/test/data/pipes/test_lidar_cpp_converter.py --test_arg=-k --test_arg='route_shortening_jitter_applies_only_to_parking or route_location_at_distance_returns_integer_index or jitter_route_stop_moves_stop_location_in_meters' --test_arg=--no-cov --test_output=errors`
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
- W&B: <https://wandb.ai/wayve-ai/parking_bc/runs/session_2026_07_07_20_12_12_si_parking_bc_train_release_2026_5_21_unpmode1>
- Datadog: <https://app.datadoghq.eu/dashboard/6eg-vtz-9d5?fromUser=true&refresh_mode=paused&tpl_var_job_name=nautilus-silver-adventurous-189873%2A&from_ts=1782850357987&to_ts=1783455157987&live=false>
- Outcome: passed the 1K-step gate while Surfboard stayed `Running`.
- Observed gate evidence: W&B `trainer/global_step=1147`, `trainer/samples_seen=73408`, W&B state `running`.
- Later outcome: failed around 6.6K steps with `RuntimeError: Prefetch thread exited with an error`; rank logs pointed at `RouteMapFetcher(cache_must_exist=True, enable_route_shortening_for_parking=True, ...)` failing to cast a Python `float` to the C++ route-map index type.
- Fix: committed and pushed `022e076ee315aff1ed8e314ba58c7b484c16416d`, keeping route-map segment indices integral in `_route_location_at_distance`, `_jitter_route_stop`, and route-map generation args.
- Slack: Boris pass update sent at <https://wayve-ai.slack.com/archives/D09SNLZT7PA/p1783456451190459>.
- Notion: Parking/PUDO model-card row created at <https://app.notion.com/p/39603da5d69a819ea9afcfcad29cc449>.

### Attempt 3

- Tag: `unpmode2`
- Job: `189974`
- Nickname: `intrepid-cat-lime`
- Session: `session_2026_07_07_23_20_40_si_parking_bc_train_release_2026_5_21_unpmode2`
- W&B: <https://wandb.ai/wayve-ai/parking_bc/runs/session_2026_07_07_23_20_40_si_parking_bc_train_release_2026_5_21_unpmode2>
- Datadog: <https://app.datadoghq.eu/dashboard/6eg-vtz-9d5?fromUser=true&refresh_mode=paused&tpl_var_job_name=intrepid-cat-lime-189974%2A&from_ts=1782863006124&to_ts=1783467806124&live=false>
- Outcome: passed the 1K-step gate while Surfboard stayed `Running`.
- Observed gate evidence: W&B `trainer/global_step=1813`, `trainer/samples_seen=116032`, W&B state `running`, heartbeat `2026-07-07T23:43:25Z`.
- Slack: Boris failure/fix update sent at <https://wayve-ai.slack.com/archives/D09SNLZT7PA/p1783465611170259>; pass update sent at <https://wayve-ai.slack.com/archives/D09SNLZT7PA/p1783467594949339>.
- Notion: Parking/PUDO model-card row created at <https://app.notion.com/p/39603da5d69a81cba4d6c31bffe448bf>.

## Cleanup

- Bazel output base: `/workspace/.cache/bazel/e9498e7cde03652993798c17005b513e`
- Initial size before final cleanup: `47G`
- Process check: no process referenced this output base after `bazel shutdown`.
- Cleanup status: removed. A scoped `chmod -R u+rwX` was needed inside this output base before the final `rm -rf` succeeded.
