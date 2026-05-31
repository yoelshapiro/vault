# 2026-05-31 LR Scheduler Horizon

- Topic: Decouple BC LR scheduler horizon from trainer stop steps.
- Labels: parking, training, lr-schedule, bc.
- Branch: `boris/parking-past30-no-standstill-gear-aug/merge_main`.
- PR: N/A.
- Change type: Code change / regression test.
- Areas: `/workspace/WayveCode/wayve/ai/si/config.py`, `/workspace/WayveCode/wayve/ai/si/models/training.py`, `/workspace/WayveCode/wayve/ai/si/test/models/test_training.py`.

## Changes

- Added `lr_scheduler_num_steps` to the BC training module config surface.
- Used `lr_scheduler_num_steps` for one-cycle and plateau scheduler `total_steps` when set, while keeping `trainer.max_steps` as the fallback.
- Added a focused optimizer regression test that captures the scheduler `total_steps` for default and override cases.

## Verification

- Attempted `bazel test //wayve/ai/si:py_test_test_training_core --test_arg=--no-cov --test_arg=-k --test_arg=lr_scheduler_num_steps`.
- Blocked during Bazel analysis by existing missing target `//wayve/ai/si:run_inference` referenced from `//wayve/ai/si:__py_checks_lib`.

## Training Submission

- Submitted job `172180` / `taciturn-gecko-peach` from pushed commit `7b291aee4b2e0da254e73c8ff8dc27a817ddc88c`.
- Session: `session_2026_05_31_07_02_10_main-merge-to-sea-turtle`.
- Command overrides: `+mode=parking_bc_train_release_2026_5_11 +datamodule=parking_bc_datamodule num_steps=30000 model.lr_scheduler_num_steps=100000`.
- Image: `wayvetraining.azurecr.io/scaled-intelligence:7b291aee4b2e0da254e73c8ff8dc27a817ddc88c`.
- Initial submit failed because AKS could not see the newly published image tag yet; retry succeeded after replication.
- Final observed status: `Running` on `aks-prod-training-2-swe.nd96h100`, started `2026-05-31 07:05 UTC`.
- W&B: https://wandb.ai/wayve-ai/parking_bc/runs/session_2026_05_31_07_02_10_main-merge-to-sea-turtle
- Datadog logs: https://app.datadoghq.eu/logs?query=job_name%3Ataciturn-gecko-peach-172180&from_ts=1779001538646&cols=job_name%2Cnode_rank&live=true

## 5k Monitor Result

- Notion row created: https://www.notion.so/37103da5d69a8130af5eeb3776196b4d
- Job `172180` / `taciturn-gecko-peach` failed before training started, so it never reached 5k steps.
- Root cause from logs: `ImportError: cannot import name split_alpha2_alpha3_partitions from wayve.ai.si.configs.baseline.candidate`.
- Stack location: `wayve/ai/si/configs/parking/parking_config.py:20` during `register_all_configs`.
- Updated Notion status to `Canceled` because the table has no `Failed` status option, and appended the failure note to the model-card page body.

## Startup Fix

- Fixed `parking_config.py` startup compatibility after job `172180` failed.
- Changed `split_alpha2_alpha3_partitions` import to use `wayve.ai.si.config`, where the helper exists on this branch.
- Removed obsolete `use_flyte_binaries=True` kwargs from parking datamodule configs; current `OtfDrivingDataModule` no longer accepts that argument and resolves binary paths from `binary_version`/path fields.
- Validation: `bazel run //wayve/ai/si:train_ipython -- -c ...` composed `+mode=parking_bc_train_release_2026_5_11 +datamodule=parking_bc_datamodule num_steps=30000 model.lr_scheduler_num_steps=100000` and printed `3.0.36` plus `100000`.

## Parking Interleave Export Fix

- Fixed TorchScript export for parking interleave upload after job `172249` / `cormorant-dashing-salmon` failed at step 0 with an `OnBoardDrivingOutput` versus `DrivingOutputWithGearOutput` return-type mismatch.
- Updated `wayve/ai/zoo/deployment/deployment_wrapper.py` so `_wrap_with_interleave_control` accepts common output tensors field-by-field instead of a whole output NamedTuple.
- Corrected `ParkingDeploymentWrapperImpl._forward_with_additional_inputs` to return `DrivingOutputWithGearOutput`.
- Updated `wayve/ai/zoo/deployment/deployment_wrapper_codegen.py` so generated interleave forwards pass `_base_output.policy_*` fields.
- Updated `wayve/ai/zoo/deployment/test/test_interleave_control_wrapper.py` for the new helper signature.
- Verification passed:
- `bazel test //wayve/ai/zoo/deployment:test_deployment_py_test --test_arg=-k --test_arg="interleave_control or parking_deployment_wrapper"`
- `bazel test //wayve/ai/si:test_deployment_wrapper --test_arg=-k --test_arg="parking_deployment_wrapper or interleave"`
- `bazel test //wayve/ai/zoo/deployment:test_deployment_py_lint_ruff //wayve/ai/zoo/deployment:test_deployment_ty`
- Commit pushed: `097878727cee8db9d5598872ffe194fa95b4192c` (`fix: script parking interleave wrapper output`).

## Retry After Space Fix

- Submitted job `172255` / `raven-orange-rejoicing` from pushed commit `097878727cee8db9d5598872ffe194fa95b4192c`.
- Session: `session_2026_05_31_10_52_33_mmturtle4`.
- Command overrides: `+mode=parking_bc_train_release_2026_5_11 +datamodule=parking_bc_datamodule num_steps=30000 model.lr_scheduler_num_steps=100000`.
- Accepted short tag override: `mmturtle4`.
- Image: `wayvetraining.azurecr.io/scaled-intelligence:097878727cee8db9d5598872ffe194fa95b4192c`.
- W&B: https://wandb.ai/wayve-ai/parking_bc/runs/session_2026_05_31_10_52_33_mmturtle4
- Datadog logs: https://app.datadoghq.eu/logs?query=job_name%3Araven-orange-rejoicing-172255&from_ts=1779015154184&cols=job_name%2Cnode_rank&live=true
- Final monitored status: Surfboard `Running` on `aks-prod-training-2-swe.nd96h100`; W&B state `running`, `_step=8290`, `trainer/global_step=5102`.
- The run passed the requested 5k trainer-step monitoring gate without reproducing the previous startup/export failures.
- Updated Notion model-card page: https://www.notion.so/37103da5d69a8130af5eeb3776196b4d
