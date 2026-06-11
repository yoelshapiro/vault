# 2026-06-11 Generic PUDO 8-node Training

- Branch: `boris/training/main_cherrypick_generic_data`
- Latest commit: `209d1fc69c404d47129c5e38b71f01fa00f0cc3a`
- Workspace: `/workspace/WayveCode`

## Summary

Submitted a Parking BC training run from the generic PUDO training branch, fixed an early multi-odometry path-loader failure, and resubmitted the run.

## Command Shape

```bash
bazel run //wayve/ai/si/cli:cli -- \
  --no-verify \
  --experiment parking_bc \
  --platform AKS \
  --cluster dgx-h100 \
  --num_nodes 8 \
  --session_tag genpudo8n100k \
  --project Parking \
  --control_model '' \
  +mode=parking_bc_train_release_2026_5_21 \
  +datamodule=pudo_bc_datamodule \
  num_steps=100000 \
  --priority P1
```

## Run 1

- Surfboard job: `178473`
- Surfboard nickname: `intricate-hatchetfish-crimson`
- Session: `session_2026_06_11_19_44_33_genpudo8n100k`
- Session path: `/mnt/remote/azure_session_dir/Parking/parking_bc/session_2026_06_11_19_44_33_genpudo8n100k`
- Image: `wayvetraining.azurecr.io/scaled-intelligence:4926993aefa80d1df1edbc1d5a10769ed274e86a`
- Nodes: 8 H100 nodes (`num_gpus=64`)
- Priority: `P1`
- Max restarts: `0`
- Final status: `Failed` before W&B/global-step metrics

## Links

- W&B: https://wandb.ai/wayve-ai/parking_bc/runs/session_2026_06_11_19_44_33_genpudo8n100k
- Datadog logs: https://app.datadoghq.eu/logs?query=job_name%3Aintricate-hatchetfish-crimson-178473&from_ts=1779997507682&cols=job_name%2Cnode_rank&live=true
- Datadog dashboard: https://app.datadoghq.eu/dashboard/6eg-vtz-9d5?fromUser=true&refresh_mode=paused&tpl_var_job_name=intricate-hatchetfish-crimson-178473%2A&from_ts=1780602307682&to_ts=1781207107682&live=false

## Notes

- The CLI-generated tag included the mode name; it was overridden to `genpudo8n100k`.
- Model Catalogue lookup by session id returned no rows immediately after submission.
- Failure root cause: `PathTableLoader` received `odometry_source=np.array(["wheel_imu"])` and used it directly as a dict key, causing `TypeError: unhashable type: 'numpy.ndarray'`.

## Fix

- Commit: `4e50a883a74cfe047844793c4c5eef695dcec342`
- Change: normalized the selected odometry source in `wayve/ai/lib/data/pipes/paths.py` before indexing the multi-odometry path map.
- Regression: added `test_load_paths_data_async_uses_numpy_array_odometry_source`.
- Checks:
  - `bazel test //wayve/ai/lib:test_data_pipes_lib_py_lint_ruff //wayve/ai/lib:test_data_pipes_lib_ty`
  - `bazel test //wayve/ai/lib:test_data_pipes_lib_py_lint_flake8`
  - `bazel test //wayve/ai/lib:test_data_pipes_lib_py_test --test_arg=wayve/ai/lib/test/data/pipes/test_load_paths.py --test_arg='-k=test_load_paths_data_async_uses_numpy_array_odometry_source' --test_arg=--no-cov`

## Run 2

- Surfboard job: `178475`
- Surfboard nickname: `heron-harlequin-fortunate`
- Session: `session_2026_06_11_20_07_34_genpudo8n100k2`
- Image: `wayvetraining.azurecr.io/scaled-intelligence:4e50a883a74cfe047844793c4c5eef695dcec342`
- Nodes: 8 H100 nodes (`num_gpus=64`)
- Priority: `P1`
- Max restarts: `0`
- Initial observed status: `Dispatched`
- W&B: https://wandb.ai/wayve-ai/parking_bc/runs/session_2026_06_11_20_07_34_genpudo8n100k2
- Datadog logs: https://app.datadoghq.eu/logs?query=job_name%3Aheron-harlequin-fortunate-178475&from_ts=1779998854721&cols=job_name%2Cnode_rank&live=true

## Later Retries

### Root Suffix Fix

- Run `178475` failed before training because PUDO bucket paths were missing the `dataset/` segment under the new materialization root.
- Commit: `5048bad220eadbce0df4d6b2a5ce3ebaccfc3f37`
- Change: appended `/dataset` to `PARKING_BC_PUDO_BUCKETS_ROOT` in `parking_config.py`.

### TorchScript Export Fix

- Retry job: `178483`
- Surfboard nickname: `blue-scintillating-salmon`
- Session: `session_2026_06_11_20_26_41_genpudo8n100k3`
- Failure: TorchScript export failed because the generated wrapper could not resolve `FORWARD_DRIVE_POSITION` from `ParkingDeploymentWrapperWithRadarWithInterleaveControl`.
- Commit: `209d1fc69c404d47129c5e38b71f01fa00f0cc3a`
- Change: use the initialized `self.forward_drive_position` attribute in `_clamp_waypoints_for_forward_drive`.
- Checks:
  - `bazel test //wayve/ai/zoo/deployment:test_deployment_py_lint_ruff //wayve/ai/zoo/deployment:test_deployment_ty`
  - `bazel test //wayve/ai/zoo/deployment:test_deployment_py_test --test_arg=wayve/ai/zoo/deployment/test/test_deployment_wrapper_codegen.py --test_arg=-k --test_arg=test_interleave_codegen_scripts_with_gear_output_deployment_wrapper`

### Short Tag Correction

- Submitted job `178488` / `tomato-wren-mustachioed`, then cancelled it before start.
- Reason: the accepted CLI tag expanded to `si_parking_bc_train_release_2026_5_21_genpudo8n100k4`, which reintroduced artifact-name risk.
- Cancellation reason recorded in Surfboard: `Incorrect configuration`.

## Passing Run

- Surfboard job: `178491`
- Surfboard nickname: `amaranth-kestrel-charming`
- Session: `session_2026_06_11_20_44_02_gp8n100k4`
- Image: `wayvetraining.azurecr.io/scaled-intelligence:209d1fc69c404d47129c5e38b71f01fa00f0cc3a`
- Accepted tag: `gp8n100k4`
- Nodes: 8 H100 nodes (`num_gpus=64`)
- Priority: `P1`
- Max restarts: `0`
- W&B: https://wandb.ai/wayve-ai/parking_bc/runs/session_2026_06_11_20_44_02_gp8n100k4
- Notion row: https://app.notion.com/p/37c03da5d69a813d8328ce56ff8e0dc8

## 1K Monitor Result

- Result: passed.
- W&B state: `running`
- Checked at: `2026-06-11T21:04:07Z`
- Heartbeat: `2026-06-11T21:03:54Z`
- `trainer/global_step`: `1096`
- `trainer/samples_seen`: `140288`
- Throughput: `347.6888158463423` samples/sec world
- Loss: `4.38987922668457`
