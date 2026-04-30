# Parking training submission for directional UNPUDO / unpark gear-indicator run

## Goal

Run the requested Parking BC training command from `/workspace/WayveCode` at branch `boris/pudo_w_route_path_fixes_and_new_data` and commit `c2a575154cb`, then monitor until `Running` if submission succeeds.

## Requested command

```bash
bazel run //wayve/ai/si/cli:cli -- \
  --project Parking \
  -ex parking_bc \
  -st dir_unpudo_unpark_gi \
  --platform AKS \
  -nn 4 \
  --cluster dgx-h100 \
  --no-verify \
  +mode=parking_bc_train_gear_indicator \
  num_steps=100000 \
  --priority P1
```

Requested prompt handling:
- testing reason: `Train parking BC with directional UNPUDO/unpark data and shared waypoint-token per-waypoint gear/indicator losses.`
- dirty worktree / continue: `y`
- session tag confirmation: accept the proposed tag only if it matched the intended command

## Result

- branch: `boris/pudo_w_route_path_fixes_and_new_data`
- commit provenance requested: `c2a575154cb`
- dirty worktree present and left untouched:
  - `tools/databricks_queries/execute_query.py`
  - `tools/databricks_queries/lib/query.py`
  - `.claude/plugins/`
  - `tools/parking_model_analysis_writer/`
  - `ty.toml`
- final submission outcome: succeeded
- final observed state: `Running`
- Surfboard job: `156540`
- session id: `session_2026_04_30_14_41_35_si_parking_bc_train_gear_indicator_dir_unpudo_unpark_gi`
- platform nickname: `aqua-inimitable-grasshopper`
- W&B: `https://wandb.ai/wayve-ai/parking_bc/runs/session_2026_04_30_14_41_35_si_parking_bc_train_gear_indicator_dir_unpudo_unpark_gi`
- Datadog logs: `https://app.datadoghq.eu/logs?query=job_name%3Aaqua-inimitable-grasshopper-156540&from_ts=1776350688605&cols=job_name%2Cnode_rank&live=true`
- Notion release row: `https://app.notion.com/p/35203da5d69a81fbad76c4a55ea94da7`
- Model Catalogue lookup:
  - session-id search: no indexed rows yet
  - nickname search: no indexed rows yet
- platform start time: `04-30 14:44 (UTC)`

## Notes

- The retry used the shortened session tag `dir_unpudo_unpark_gi`, which produced the accepted full tag `si_parking_bc_train_gear_indicator_dir_unpudo_unpark_gi`.
- The submission recorded the requested experiment-purpose text and proceeded with the allowed unrelated dirty worktree after explicit confirmation.
- A release row was created because Notion tools were available; it is marked `In training` under model `aqua-inimitable-grasshopper`.

## Run ledger

- pre-retry validation failure
  - command used the longer `split_alpha2_alpha3_driving_release_0_0_17_directional_unpudo_unpark_gear_indicator` session tag
  - CLI rejected it before job creation because the derived full session name was `146` chars, above the `128`-char limit
- final retry
  - exact command above with `-st dir_unpudo_unpark_gi`
  - submitted job `156540`, reached `Dispatched`, then `Running`

## Failure follow-up: job 156540

- job: `156540`
- nickname: `aqua-inimitable-grasshopper`
- available logs: only worker/rank group log `rank3.log` and `rank3-errors.log`; Surfboard did not return logs for ranks 0-2.
- failure signal:
  - repeated data-loading warnings were present, but no fatal dataloader traceback was visible in the available logs.
  - main failure was NCCL watchdog timeout after 30 minutes:
    - `WorkNCCL(SeqNum=22, OpType=BROADCAST, NumelIn=16234296, NumelOut=16234296, Timeout(ms)=1800000)`
    - training watchdog reported `Training hanging. Setting shared memory variable.`
  - rank stack traces showed the training thread inside `torch._dynamo` compilation during the first optimizer/training step.
- root-cause assessment:
  - this is most consistent with a TorchDynamo/DDP compile hang for the new shared waypoint-token gear/indicator training mode, not a materialization or checkpoint-load failure.
  - the base parking modes still use `compile_mode="reduce-overhead"`; the risky path is the new `parking_bc_train_gear_indicator` mode.
- local fix applied:
  - changed `ParkingBcTrainGearIndicatorCfg.compile_mode` from `"reduce-overhead"` to `None`.
  - validation passed: `bazel test //wayve/ai/si:test_config_py_test --test_output=errors`.
- status:
  - fix is local and uncommitted at the time of this note.

## Compile-hang follow-up correction

The initial local workaround that disabled `ParkingBcTrainGearIndicatorCfg.compile_mode` was reverted. That workaround would have avoided the symptom but would not have tested the same path as the failed training job.

Final local fix:
- Removed the hidden `_policy_waypoint_tokens` side channel from the mutable `outputs` dict.
- Routed waypoint tokens explicitly inside `OutputAdaptor`, `process_behavior_unconditioned_outputs`, and `sample_top_k_outputs`.
- `IndicatorOutputHead` and `GearDirectionOutputHead` now consume the tokens passed to them directly; when `*_from_waypoint_tokens=True`, the adaptor supplies the waypoint tokens.
- `ParkingBcTrainGearIndicatorCfg.compile_mode` remains `"reduce-overhead"`.

Validation:
- `bazel test //wayve/ai/zoo:test_outputs_py_test //wayve/ai/zoo:test_losses_py_test //wayve/ai/zoo:test_outputs_mypy //wayve/ai/zoo:test_losses_mypy --test_output=errors` passed.
- Local one-step train smoke passed:

```bash
bazel run //wayve/ai/si:train -- \
  +mode=parking_bc_train_gear_indicator \
  dev=True \
  logger=None \
  profiler=null \
  use_callbacks=False \
  num_gpus=1 \
  num_steps=1 \
  limit_val_batches=0 \
  num_overfit_batches=1 \
  datamodule.dataloader_workers=0 \
  enable_flop_computation=False
```

Smoke result:
- exit code: `0`
- session: `session_2026_04_30_15_58_01_si_parking_bc_train_gear_indicator`
- confirmed `compile_mode: reduce-overhead` in the resolved config
- completed one compiled training step and saved `model-checkpoint-000000001.ckpt`
- exported TorchScript traces at steps `0` and `1`

Residual risk:
- The local smoke is single-node / one GPU. It validates model construction, OTF datapipe, checkpoint load, TorchDynamo compile, backward, checkpoint save, and export. It does not fully reproduce the original 4-node/32-GPU DDP environment.
