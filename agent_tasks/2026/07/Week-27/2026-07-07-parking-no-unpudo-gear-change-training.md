# 2026-07-07 Parking No UnPUDO Gear-Change Training

## Summary

- Branch: `boris/parking-train-no-unpudo-gear-change`
- Worktree: `/tmp/wayvecode-parking-train-no-unpudo-gear-change`
- Base commit: `d3a297cd99516999980706bb0a6d1f4e39282ab9`
- Requested variant: remove `dc_unpudo_gear_change_*` buckets and redistribute its `0.06` train weight as `+0.03` to `dc_unpudo_pre_start` and `+0.03` to `pre_ca_unpudo`.

## Changes

- Removed `dc_unpudo_gear_change` from the parking BC train partitions.
- Removed `dc_unpudo_gear_change_usa` and `dc_unpudo_gear_change_uk` from validation partitions.
- Updated weights:
  - `dc_unpudo_pre_start_weight`: `0.10` -> `0.13`
  - `pre_ca_unpudo_weight`: `0.08` -> `0.11`
- Added config regression assertions to `test_parking_release_2026_5_21_config_resolves`.

## Verification

- Passed:
  - `IN_WAYVE_META_UPDATE=1 WAYVECODE_MAIN_COMMIT_META_OVERRIDE=000000000000 bazel test //wayve/ai/si:test_config_py_test_test_configs_utils_parking_release_2026_5_21_config_resolves`
- Checked deploy-wrapper code preserved:
  - `END_OF_ROUTE_THRESHOLD = 3.75e4`
  - `END_OF_ROUTE_EXIT_THRESHOLD = 4.5e4`
  - parking interleave polarity keeps current model when `True`, switches/interleaves when `False`
  - `enable_end_of_route_hazard_lights=True`
  - `enable_end_of_route_gear_latch=True`
  - hazards are forced only when gear is latched to Park
- `//wayve/ai/si:test_deployment_wrapper` failed on unrelated stale helper tests for `_clamp_waypoints_for_direction`; the route-end hazard/latch tests passed.

## Training

- Status: dispatched and passed the requested 1000-step gate.
- Branch pushed: `origin/boris/parking-train-no-unpudo-gear-change`
- Commit: `e09ae0cd885e40f9a2a8fa45bac99afeb5b2b708`
- Session tag: `unpdogc0`
- Surfboard job: `189848`
- Session id: `session_2026_07_07_19_24_31_unpdogc0`
- Nickname: `cyan-wallaby-scholarly`
- W&B: <https://wandb.ai/wayve-ai/parking_bc/runs/session_2026_07_07_19_24_31_unpdogc0>
- Datadog: <https://app.datadoghq.eu/dashboard/6eg-vtz-9d5?fromUser=true&refresh_mode=paused&tpl_var_job_name=cyan-wallaby-scholarly-189848%2A&from_ts=1782848121274&to_ts=1783452921274&live=false>
- Observed W&B state: `running`, `trainer/global_step=1086`, `trainer/samples_seen=69504`.
- Slack: sent pass-1000 DM to Boris.
- Notion: created Parking/PUDO model-card row `cyan-wallaby-scholarly (not interleaved)`.
