# Parking training - osprey root retry

## Summary
- Submitted Parking BC training retry for the current branch using the checked-in `PUDO_BUCKETS_ROOT` already present in `wayve/ai/si/configs/parking/parking_config.py`.
- Intent: retry exotic Zak gear augmentation training using the `osprey-aqua-cautious` materialization root.
- No repository code changes were made.

## Repo State
- Workspace: `/workspace/WayveCode`
- Branch: `boris/exotic-zak-gear-augmentations`
- Commit: `0223b792d4d6b671e51f4b38dcdc4d0ae8e8a0c8`
- Tracked dirty files: none
- Existing untracked local artifacts: `.claude/*`, `ty.toml`

## Command
```bash
bazel run //wayve/ai/si/cli:cli -- \
  --project Parking \
  -ex parking_bc \
  -st exotic_zak_gear_cleanup_osprey_root_80k \
  --platform AKS \
  -nn 4 \
  --cluster dgx-h100 \
  --no-verify \
  +mode=parking_bc_train_release_2026_5_11 \
  +datamodule=parking_bc_datamodule \
  num_steps=80000 \
  --priority P1
```

## Prompt Answers
- Testing reason: `Retry exotic Zak gear augmentation training using osprey-aqua-cautious materialization root.`
- Uncommitted changes: CLI reported `Contains uncommitted changes: False`; no override was needed.
- Session tag prompt accepted: `si_parking_bc_train_release_2026_5_11_exotic_zak_gear_cleanup_osprey_root_80k`.

## Submission
- Surfboard job id: `159284`
- Nickname: `magenta-perceptive-crane`
- Job name: `magenta-perceptive-crane-159284`
- Session id: `session_2026_05_06_07_15_01_si_parking_bc_train_release_2026_5_11_exotic_zak_gear_cleanup_osprey_root_80k`
- Session path: `/mnt/remote/azure_session_dir/Parking/parking_bc/session_2026_05_06_07_15_01_si_parking_bc_train_release_2026_5_11_exotic_zak_gear_cleanup_osprey_root_80k`
- Platform: AKS
- Cluster/node: `dgx-h100` / `aks-prod-training-swe.nd96h100d`
- Nodes: 4
- Priority: P1
- Submission time: May 6, 2026 07:15 UTC
- Start time: May 6, 2026 07:20 UTC
- Final observed state: `Running`

## Links
- WandB: https://wandb.ai/wayve-ai/parking_bc/runs/session_2026_05_06_07_15_01_si_parking_bc_train_release_2026_5_11_exotic_zak_gear_cleanup_osprey_root_80k
- Datadog logs: https://app.datadoghq.eu/logs?query=job_name%3Amagenta-perceptive-crane-159284&from_ts=1776842487954&cols=job_name%2Cnode_rank&live=true
- Datadog dashboard: https://app.datadoghq.eu/dashboard/6eg-vtz-9d5?fromUser=true&refresh_mode=paused&tpl_var_job_name=magenta-perceptive-crane-159284%2A&from_ts=1777447287954&to_ts=1778052087954&live=false
- Sentry: https://wayve.sentry.io/discover/results/?project=4507901039869953&query=job_name%3Amagenta-perceptive-crane-159284&statsPeriod=90d
- Surfboard UI: `web_ui_url` was null in `wayvecli job get`.
- Notion release row: https://www.notion.so/35803da5d69a81eda639dd23bc5f3ef3

## Notion Action
- Created Parking/PUDO release row for `magenta-perceptive-crane`.
- Status: `In training`.
- Owner: Boris Indelman.
- Copied Data Version and Model Version relations from `osprey-aqua-cautious`.
- Notes include job id, session id, branch, commit, WandB URL, and final observed Running state.
