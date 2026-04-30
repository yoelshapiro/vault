# Parking training submission for gi_parking_aug_retry

## Goal

Run the requested Parking BC training command from `/workspace/WayveCode` on branch `boris/pudo_w_route_path_fixes_and_new_data`, preserve the existing worktree state, and monitor until the job reaches `Running`.

## Requested command

```bash
bazel run //wayve/ai/si/cli:cli -- \
  --project Parking \
  -ex parking_bc \
  -st gi_parking_aug_retry \
  --platform AKS \
  -nn 4 \
  --cluster dgx-h100 \
  --no-verify \
  +mode=parking_bc_train_gear_indicator \
  num_steps=100000 \
  --priority P1
```

Prompt handling:
- testing reason: `Retrain parking BC gear/indicator model after datamodule parking augmentation config updates.`
- dirty worktree confirmation: not prompted by the CLI for this run
- session tag confirmation: accepted the proposed tag `si_parking_bc_train_gear_indicator_gi_parking_aug_retry`

## Result

- branch: `boris/pudo_w_route_path_fixes_and_new_data`
- commit provenance: `da95609a7a4d9f74292c0d6e83976e97e5dd5be7`
- worktree state observed before submission:
  - `?? .claude/plugins/`
  - `?? tools/parking_model_analysis_writer/`
  - `?? ty.toml`
- CLI submission note reported `Contains uncommitted changes: False`
- final submission outcome: succeeded
- final observed state: `Running`
- Surfboard job: `156652`
- session id: `session_2026_04_30_19_00_22_si_parking_bc_train_gear_indicator_gi_parking_aug_retry`
- platform nickname: `pink-owl-vociferous`
- platform start time: `04-30 19:03 (UTC)`
- W&B: `https://wandb.ai/wayve-ai/parking_bc/runs/session_2026_04_30_19_00_22_si_parking_bc_train_gear_indicator_gi_parking_aug_retry`
- Datadog logs: `https://app.datadoghq.eu/logs?query=job_name%3Apink-owl-vociferous-156652&from_ts=1776366217281&cols=job_name%2Cnode_rank&live=true`
- Datadog dashboard: `https://app.datadoghq.eu/dashboard/6eg-vtz-9d5?fromUser=true&refresh_mode=paused&tpl_var_job_name=pink-owl-vociferous-156652%2A&from_ts=1776971017281&to_ts=1777575817281&live=false`
- Notion release row: not created or updated by this run

## Notes

- The training CLI spent extra time publishing and replicating the container image before submitting the Surfboard job.
- `wayvecli job get` showed the expected state progression: `Queued` (queue position `2`) -> `Dispatched` -> `Running`.
- I did not block on Model Catalogue indexing because Surfboard job metadata already exposed both the nickname and the session id.
