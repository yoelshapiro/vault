# Parking training submission for directional UNPUDO / unpark gear-indicator run

## Goal

Run the requested Parking BC training command from `/workspace/WayveCode` at branch `boris/pudo_w_route_path_fixes_and_new_data` and commit `c2a575154cb`, then monitor until `Running` if submission succeeds.

## Requested command

```bash
bazel run //wayve/ai/si/cli:cli -- \
  --project Parking \
  -ex parking_bc \
  -st split_alpha2_alpha3_driving_release_0_0_17_directional_unpudo_unpark_gear_indicator \
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
- submission outcome: failed before interactive prompts and before Surfboard job creation
- launcher exit code: `2`
- Surfboard job: not created
- session id: not created
- nickname: not available
- W&B: not created
- Datadog logs: not created
- release row / Notion: not created because no training run/session was submitted

Validation error returned by the CLI:

```text
Error: Invalid value for '--session_tag' / '-st': Full session name would be 146 chars (max 128). Shorten the session tag (currently 'si_parking_bc_train_gear_indicator_split_alpha2_alpha3_driving_release_0_0_17_directional_unpudo_unpark_gear_indicator', 118 chars).
```

## Notes

- The Bazel build and CLI launcher both started successfully; the failure happened during CLI argument validation.
- The model lookup helper exists locally, but there was no session id to resolve because submission failed before job creation.
