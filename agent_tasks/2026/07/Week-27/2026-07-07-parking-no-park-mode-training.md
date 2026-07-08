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

## 2026-07-08 Fix and Relaunch

- Fixed the follow-up issue by decoupling model-facing `use_parking_mode=False` from parking deployment/export behavior.
- Commits pushed to `origin/boris/parking-train-no-park-mode`:
  - `a8e4b2cfaece` - `fix: decouple parking deployment from park mode input`
  - `364bc2d1388b` - `fix: add parking deployment controls for no-park export`
- Kept `use_parking_mode=False` for training/model input and kept route shortening on `DataKeys.PARKING_ROUTE_SHORTENING_MODE`.
- Added `enable_parking_deployment=True` for the variant so export/deployment still uses `ParkingDeploymentWrapperImpl`, interleave control, `interleave_control_group="parking"`, and `DeploymentConfig.interleave_group="parking"`.
- Added parking deployment controls (`INITIATE_AUTO_PARKING`, `PARKING_DIRECTION`, `ENABLE_SHIFT_BY_WIRE`) to no-park export paths so the deployment wrapper has the required runtime inputs without re-enabling model-facing `PARKING_MODE`.
- Preserved the EOR/hazard fixes: enter threshold `3.75e4`, exit threshold `4.5e4`, corrected interleave polarity, gear latch and hazard defaults, and hazards only forced when gear is latched to Park.

### 2026-07-08 Verification

- Passed focused training/deployment regressions:
  - `bazel test --override_repository=_main~_repo_rules~WayveMeta=/tmp/fake_wayvemeta //wayve/ai/si:py_test_test_training_core //wayve/ai/si:py_test_test_deployment_core --test_arg=--no-cov --test_arg=-k --test_arg='no_park_mode_training_can_export_as_parking_deployment or parking_deployment_config_sets_interleave_group_and_driving_parameters or prepare_deployment_model_can_enable_parking_deployment_without_parking_mode_input or prepare_deployment_model_with_parking_wrapper'`
- Passed focused config regression:
  - `bazel test --override_repository=_main~_repo_rules~WayveMeta=/tmp/fake_wayvemeta //wayve/ai/si:test_config_py_test_test_configs_utils_parking_release_2026_5_21_config_resolves --test_arg=-k --test_arg=parking_release_2026_5_21_config_resolves`
- `git diff --check` passed before the follow-up commit.

### 2026-07-08 Relaunch Ledger

- `189988` / `session_2026_07_07_23_43_35_nopmfix0` failed during train-start export compile with `KeyError: 'enable_shift_by_wire'`; fixed by adding deployment control keys and pushed `364bc2d1388b`.
- `189992` / `session_2026_07_08_00_06_25_si_parking_bc_train_release_2026_5_21_nopmfix1` was canceled with reason `Incorrect configuration` because the generated long session tag was accepted accidentally.
- Active replacement:
  - Surfboard job: `190005`
  - Session id: `session_2026_07_08_00_15_00_nopmfix2`
  - Nickname: `amaranth-timely-gerbil`
  - W&B: <https://wandb.ai/wayve-ai/parking/runs/session_2026_07_08_00_15_00_nopmfix2>
  - Datadog: <https://app.datadoghq.eu/dashboard/6eg-vtz-9d5?fromUser=true&refresh_mode=paused&tpl_var_job_name=amaranth-timely-gerbil-190005%2A&from_ts=1782864901264&to_ts=1783469701264&live=false>
  - Observed W&B state at `2026-07-08T00:38:19Z`: `running`, `trainer/global_step=1525`, `trainer/train_step=1525`.
  - Slack: Boris was notified about the initial fix/relaunch, the `189988` failure, the follow-up fix/relaunch, the long-tag cancellation, the active short-tag replacement, and the pass-1000 gate.
  - Notion: created Parking/PUDO model-card row `amaranth-timely-gerbil (not interleaved)` at <https://app.notion.com/p/39703da5d69a81558ab4d3ad76d08aa1>.

## Operational Notes

- Initial image publish failed before dispatch due the worktree Bazel output base filling `/workspace`.
- Cleaned only this worktree's original output base, relaunched successfully, and removed the recreated worktree output base after final monitoring/documentation.
- Final Bazel cleanup:
  - `bazel info output_base`: `/workspace/.cache/bazel/fe94e528b23300c19c99d59bf4cc0196`
  - Confirmed no process referenced that exact output base after `bazel shutdown`.
  - Initial removal hit permission-denied generated files; fixed permissions only inside that output base with `chmod -R u+rwX` and retried.
  - Final status: removed `/workspace/.cache/bazel/fe94e528b23300c19c99d59bf4cc0196`.
