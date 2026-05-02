# Parking training May 1 PUDO mix

## Summary
- Submitted the Parking BC training command from `/workspace/WayveCode` via a spawned Codex subagent, per repo runtime instructions.
- Branch: `boris/training/kangaroo_new_pudo_unpudo_unpark_root`
- Commit: `e74bc4067860367bb3e106a97180b88d3ecbb406`
- Surfboard job: `157805`
- Session: `session_2026_05_02_13_33_47_si_parking_bc_train_release_2026_5_11_may01_pudo_50_20_13_7_gc`
- Surfboard nickname: `precocious-scarlet-raccoon`
- Final observed state: `Running`
- Start time: `2026-05-02 13:36 UTC`
- Notion release row: https://www.notion.so/35403da5d69a81aa9301f2640fd961be

## Command
```bash
bazel run //wayve/ai/si/cli:cli -- \
  --project Parking \
  -ex parking_bc \
  -st may01_pudo_50_20_13_7_gc \
  --platform AKS \
  -nn 4 \
  --cluster dgx-h100 \
  --no-verify \
  +mode=parking_bc_train_release_2026_5_11 \
  datamodule=parking_bc_new_driving_2026_05_01_directional_unpudo_unpark_gear_change_datamodule \
  num_steps=80000 \
  --priority P1
```

## Prompt Handling
- Testing reason: `Train parking BC release config on May 1 PUDO/UNPUDO/unparking materialization with 50/20/13/7/10 mix.`
- Accepted generated session tag: `si_parking_bc_train_release_2026_5_11_may01_pudo_50_20_13_7_gc`
- No uncommitted-changes prompt appeared because the CLI reported `git_is_dirty: false`.
- Unrelated untracked files were left untouched.

## Links
- WandB: https://wandb.ai/wayve-ai/parking_bc/runs/session_2026_05_02_13_33_47_si_parking_bc_train_release_2026_5_11_may01_pudo_50_20_13_7_gc
- Datadog logs: https://app.datadoghq.eu/logs?query=job_name%3Aprecocious-scarlet-raccoon-157805&from_ts=1776519395407&cols=job_name%2Cnode_rank&live=true
- Datadog dashboard: https://app.datadoghq.eu/dashboard/6eg-vtz-9d5?fromUser=true&refresh_mode=paused&tpl_var_job_name=precocious-scarlet-raccoon-157805%2A&from_ts=1777124195408&to_ts=1777728995408&live=false

## Notes
- Model Catalogue lookup by session id and Surfboard nickname returned no rows immediately after submission.
- Created a Notion release row with status `In training`, owner Boris, and Model Version `M26.1.0`.
- Did not create commits or edit files in `/workspace/WayveCode`.
