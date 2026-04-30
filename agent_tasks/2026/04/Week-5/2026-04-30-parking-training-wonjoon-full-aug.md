# Parking training submission for wonjoon_full_aug

## Goal

Run the requested Parking BC training command from `/workspace/WayveCode` on branch `boris/pudo_w_route_path_fixes_and_new_data`, preserve the existing worktree state, and monitor until the Surfboard job reaches `Running`.

## Requested command

```bash
bazel run //wayve/ai/si/cli:cli -- \
  --project Parking \
  -ex parking_bc \
  -st wonjoon_full_aug \
  --platform AKS \
  -nn 4 \
  --cluster dgx-h100 \
  --no-verify \
  +mode=parking_bc_train_gear_indicator \
  num_steps=100000 \
  --priority P1
```

Prompt handling:
- testing reason: `Retrain parking BC gear/indicator model with Wonjoon full parking augmentations enabled in the datamodule config.`
- dirty worktree confirmation: not prompted by the CLI for this run
- session tag confirmation: accepted the proposed tag `si_parking_bc_train_gear_indicator_wonjoon_full_aug`

## Result

- branch: `boris/pudo_w_route_path_fixes_and_new_data`
- commit provenance: `572153f43429f9bf8a8841007bee2cbdf55c4d3f`
- worktree state observed before submission:
  - `?? .claude/plugins/`
  - `?? tools/parking_model_analysis_writer/`
  - `?? ty.toml`
  - `?? wayve/ai/services/sampling/datasets/parking/events/`
- CLI submission note reported `Contains uncommitted changes: False`
- final submission outcome: succeeded
- latest observed state: `Dispatched`
- Surfboard job: `156658`
- session id: `session_2026_04_30_19_28_13_si_parking_bc_train_gear_indicator_wonjoon_full_aug`
- platform nickname: `violet-happy-dolphin`
- compute target after dispatch: `aks-prod-training-2-swe.nd96h100c`
- W&B: `https://wandb.ai/wayve-ai/parking_bc/runs/session_2026_04_30_19_28_13_si_parking_bc_train_gear_indicator_wonjoon_full_aug`
- Datadog logs: `https://app.datadoghq.eu/logs?query=job_name%3Aviolet-happy-dolphin-156658&from_ts=1776367805584&cols=job_name%2Cnode_rank&live=true`
- Datadog dashboard: `https://app.datadoghq.eu/dashboard/6eg-vtz-9d5?fromUser=true&refresh_mode=paused&tpl_var_job_name=violet-happy-dolphin-156658%2A&from_ts=1776972605584&to_ts=1777577405584&live=false`
- Notion release row: not created or updated by this run

## Notes

- The training CLI spent extra time publishing and replicating the container image before Surfboard submission.
- `wayvecli job get` showed the expected state progression so far: `Queued` (queue position `1`) -> `Dispatched`.
- Model Catalogue lookup by session id returned no rows during close-out, so I did not block on indexing.
- The workspace contained unrelated untracked files before submission; I preserved that state and did not clean or modify the worktree.
