# 2026-06-16 PUDO BC pmprov training

## Summary

Submitted and monitored a PUDO BC training run from `boris/training/main_cherrypick_generic_data`, then debugged the later dataloader failure and launched a fixed retry.

## Run

- Surfboard job: `180668`
- Training nickname: `joyous-yellow-platypus`
- Session: `session_2026_06_16_21_48_57_pmprov`
- W&B: https://wandb.ai/wayve-ai/parking_bc/runs/session_2026_06_16_21_48_57_pmprov
- Branch: `boris/training/main_cherrypick_generic_data`
- Commit: `f4e1c8116d594fbc78762dc1de2ceddcedc5cedf`
- Mode: `parking_bc_train_release_2026_5_21`
- Datamodule: `pudo_bc_datamodule`
- Cluster: `dgx-h100`
- Nodes: 4
- Requested steps: 100000

## Monitoring

- Surfboard moved from queued to running on `aks-prod-training-2-swe.nd96h100c`.
- Startup, distributed init, datamodule setup, first iteration start, and first iteration end completed.
- W&B reported `trainer/global_step=1354`, so the run passed the requested 1K-step monitoring gate.
- No terminal failure or traceback observed during the initial monitor window.

## Failure and fix

- The original job later failed with `RuntimeError: Prefetch thread exited with an error`.
- First application error was in `RouteMapFetcher(cache_must_exist=True, enable_route_shortening_for_parking=True, ...)`, not the later NCCL timeout.
- Root cause: the parking route-shortening navigation path could pass a float `polyline_location_index` into `NAV_ROBOT.get_navigation_instructions_from_parsed`, while the pybind expects an `int`.
- Fix commit: `4f306b5b8a90ee1aed14703d2c3cba7d610c3fab` (`fix: cast parking navigation route index`).
- Verification:
  - `bazel test //wayve/ai/lib:test_data_pipes_lib_py_test --test_arg=wayve/ai/lib/test/data/pipes/test_generate_route_map.py --test_arg=-k --test_arg='route_map_fetcher_shortens_navigation_only_for_parking or fetch_navigation_instructions_clamps_lookahead_to_parking_stop' --test_arg=--no-cov --test_output=errors`
  - `bazel test //wayve/ai/lib:test_data_pipes_lib_py_lint`

## Retry

- Surfboard job: `180756`
- Training nickname: `lime-wolverine-picturesque`
- Session: `session_2026_06_17_04_24_10_pmprov2`
- W&B: https://wandb.ai/wayve-ai/parking_bc/runs/session_2026_06_17_04_24_10_pmprov2
- Branch: `boris/training/main_cherrypick_generic_data`
- Commit: `4f306b5b8a90ee1aed14703d2c3cba7d610c3fab`
- Command matched the original recipe: `parking_bc_train_release_2026_5_21`, `pudo_bc_datamodule`, 4 nodes, 100000 steps.
- Status: `Running`; passed `trainer/global_step=1082` at 2026-06-17 04:41 UTC.
- Notion row: https://app.notion.com/p/38203da5d69a81768955e62f2c97876f

## Notion

- Created Parking/PUDO model-card row: https://app.notion.com/p/38103da5d69a81bf9b9be05eeb713fc1
- Row model: `joyous-yellow-platypus (not interleaved)`
- Status: `Training`
- Created retry Parking/PUDO model-card row: https://app.notion.com/p/38203da5d69a81768955e62f2c97876f
- Retry row model: `lime-wolverine-picturesque (not interleaved)`
- Retry status: `Training`
