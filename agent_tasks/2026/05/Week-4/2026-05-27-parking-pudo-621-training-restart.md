# 2026-05-27 Parking PUDO 2026.6.21 Training Restart

- Date: 2026-05-27
- Branch: `boris/05-21-updated-pudo-config`
- PR: N/A
- Change type: Code fix / training run
- Surfboard job: `170265`
- Session: `session_2026_05_27_22_59_20_si_parking_bc_train_release_2026_6_21_pudo_80k_0621_navind_bcoutputs`
- W&B: https://wandb.ai/wayve-ai/parking_bc/runs/session_2026_05_27_22_59_20_si_parking_bc_train_release_2026_6_21_pudo_80k_0621_navind_bcoutputs

## Summary

Restarted `parking_bc_train_release_2026_6_21` with `pudo_bc_datamodule` for 80k steps after fixing config/deployment startup blockers. The active run reached the requested 5000-step checkpoint and remained `running`.

## Changes

- Pushed `17035273848b`: allowed parking deployment to combine navigation input and indicator memory, with regression coverage.
- Pushed `f8e5c7f15ca3`: set parking deployment driving parameter keys when behavior control or parking mode is enabled.
- Pushed `566b47ecbff0`: enabled behavior-control outputs for `ParkingModelRelease2026_6_21Cfg` so behavior-control losses have matching heads.

## Validation

- `bazel test //wayve/ai/si:test_config_py_test_core --test_arg=-k --test_arg=parking_2026_6_21_pudo_datamodule_config_resolves --test_output=errors` passed.
- Focused model tests passed; aggregate focused test invocations failed only on filtered coverage threshold, not test assertions.
- Surfboard job `170265` reached `trainer/global_step=5154` at 2026-05-27T23:43:55Z; W&B state was still `running`.

## Run Ledger

- `170229`: failed before training on `AssertionError: driving_parameters_keys must be provided`; fixed by setting parking deployment driving parameter keys.
- `170244`: failed before optimizer steps on `KeyError: 'behavior_unconditioned_policy_waypoints'`; fixed by enabling behavior-control output heads for the 2026.6.21 parking config.
- `170265`: submitted from commit `566b47ecbff01485ddfef8382fab9bb494154cb3`; reached 5154 global steps and continued running.
