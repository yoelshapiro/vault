# 2026-07-07 Parking No Park Mode Training

## Summary

- Branch: `boris/parking-train-no-park-mode`
- Worktree: `/tmp/wayvecode-parking-train-no-park-mode`
- Base commit: `d3a297cd99516999980706bb0a6d1f4e39282ab9`
- Commit: `baccabf54ae1d78f7b87a3b6adfc666a007d3cd8`
- Requested variant: disable model-facing parking mode while preserving route shortening behavior.

## Changes

- Added `DataKeys.PARKING_ROUTE_SHORTENING_MODE` for internal route-shortening control.
- Updated parking datamodule paths so `DataKeys.PARKING_MODE` is always false for model inputs, while route shortening still receives the parking-mode-derived signal.
- Updated route-map shortening code to read the dedicated route-shortening key before falling back to `DataKeys.PARKING_MODE`.
- Disabled `ParkingDeploymentWrapperImpl` end-of-route parking-mode switching by default for this variant, while keeping route shortening enabled.
- Preserved EOR deployment-wrapper fixes: enter threshold `3.75e4`, exit threshold `4.5e4`, corrected interleave polarity, gear latch and hazard defaults, and hazards forced only after gear is latched to Park.
- Set parking BC release configs to `use_parking_mode=False`.

## Verification

- Passed focused datamodule regression:
  - `bazel test //wayve/ai/si/datamodules:py_test --test_arg=--no-cov --test_arg=-k --test_arg='add_parking_mode_keeps_route_shortening_signal_without_model_parking_mode or set_stopping_mode_parking'`
- Passed focused deployment-wrapper regression:
  - `bazel test //wayve/ai/si:test_deployment_wrapper --test_arg=-k --test_arg='parking_wrapper_disables_end_of_route_parking_mode_by_default or parking_wrapper_can_enable_end_of_route_parking_mode or parking_route_end or parking_postprocess'`
- Passed focused config regression:
  - `bazel test //wayve/ai/si:test_config_py_test_test_configs_utils_parking_release_2026_5_21_config_resolves`
- `git diff --check` passed before commit.

## Training

- Status: canceled after passing the requested 1000-step gate.
- Branch pushed: `origin/boris/parking-train-no-park-mode`
- Commit: `baccabf54ae1d78f7b87a3b6adfc666a007d3cd8`
- Session tag: `nopmode0`
- Surfboard job: `189865`
- Session id: `session_2026_07_07_19_57_30_nopmode0`
- Nickname: `thriving-lime-grouse`
- W&B: <https://wandb.ai/wayve-ai/parking/runs/session_2026_07_07_19_57_30_nopmode0>
- Datadog: <https://app.datadoghq.eu/dashboard/6eg-vtz-9d5?fromUser=true&refresh_mode=paused&tpl_var_job_name=thriving-lime-grouse-189865%2A&from_ts=1782850065383&to_ts=1783454865383&live=false>
- Observed W&B state: `running`, `_step=2629` at `2026-07-07T20:18:13Z`.
- Slack: sent pre-dispatch failure/fix update and pass-1000 DM to Boris.
- Notion: created Parking/PUDO model-card row `thriving-lime-grouse (not interleaved)`, then marked it `Canceled`.

## Cancellation

- Surfboard job `189865` was canceled at `2026-07-07 23:15 UTC`.
- Cancellation reason: the no-park-mode variant disabled `use_parking_mode`, which also gated checkpoint ingestion/deployment metadata for parking interleave control and `interleave_group="parking"`.
- Follow-up needed before retraining: decouple model-facing parking-mode input from parking deployment wrapper/interleave metadata.

## Operational Notes

- Initial image publish failed before dispatch due the worktree Bazel output base filling `/workspace`.
- Cleaned only this worktree's output base, relaunched successfully, and will remove the recreated worktree output base after final monitoring/documentation.
