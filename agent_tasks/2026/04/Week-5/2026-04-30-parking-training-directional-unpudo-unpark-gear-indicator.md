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
