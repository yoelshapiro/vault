# 2026-07-07 Parking Reverse-UnPUDO Train

## Summary

- Branch: `boris/parking-train-reverse-unpudo`
- Commit: `3b89565e6c538a9ae0a0362d6736938e62bb69c4`
- Base commit: `d3a297cd99516999980706bb0a6d1f4e39282ab9`
- Surfboard job: `189854` / `moccasin-impartial-koala-189854`
- Nickname: `moccasin-impartial-koala`
- Session: `session_2026_07_07_19_34_49_si_parking_bc_train_release_2026_5_21_revunp0`
- W&B: https://wandb.ai/wayve-ai/parking/runs/session_2026_07_07_19_34_49_si_parking_bc_train_release_2026_5_21_revunp0
- Datadog: https://app.datadoghq.eu/dashboard/6eg-vtz-9d5?fromUser=true&refresh_mode=paused&tpl_var_job_name=moccasin-impartial-koala-189854%2A&from_ts=1782848410195&to_ts=1783453210195&live=false

## Changes

- Created an isolated worktree from the requested code commit and branch.
- Replaced the `dc_unpudo_gear_change` training and validation buckets with `dc_unpudo_reverse` buckets.
- Sourced reverse buckets from the requested `parking_pudo_default_indicator_start_700_20260623` materialization root.
- Added config validation to fail if gear-change buckets remain, reverse buckets are missing, roots are wrong, or reverse train weight differs from `0.06`.
- Verified deployment-wrapper fixes remained present: EOR thresholds, corrected interleave polarity, EOR hazard and gear latch flags, and hazards only forced when gear latched to Park.

## Validation

- Verified exact reverse bucket names in Azure materialization for train and validation:
  - `dc_unpudo_reverse_deu`
  - `dc_unpudo_reverse_global`
  - `dc_unpudo_reverse_jpn`
  - `dc_unpudo_reverse_uk`
  - `dc_unpudo_reverse_usa`
- Passed focused parking config test:
  - `//wayve/ai/si:test_config_py_test_test_configs_utils_parking_release_2026_5_21_config_resolves`
- Passed config lint:
  - `//wayve/ai/si:test_config_py_lint_ruff`
  - `//wayve/ai/si:test_config_py_lint_flake8`
- Passed focused deployment-wrapper regression tests for route end, gear latch, hazards, and interleave polarity.
- Full `//wayve/ai/si:test_deployment_wrapper` still has unrelated stale tests calling the removed private helper `_clamp_waypoints_for_direction`.

## Training

```bash
env -u CODER -u CODER_AGENT_TOKEN -u CODER_AGENT_URL IN_WAYVE_META_UPDATE=1 WAYVECODE_MAIN_COMMIT_META_OVERRIDE=d3a297cd9951 \
bazel run //wayve/ai/si/cli:cli -- \
  --no-verify --force \
  --image wayvetraining.azurecr.io/scaled-intelligence:3b89565e6c538a9ae0a0362d6736938e62bb69c4 \
  --experiment parking --platform AKS --cluster dgx-h100 --num_nodes 4 \
  --session_tag revunp0 --project Parking --priority P1 --max_restarts 0 \
  --control_model '' \
  +mode=parking_bc_train_release_2026_5_21 \
  +datamodule=parking_bc_datamodule \
  num_steps=100000
```

## Monitoring

- W&B reached `trainer/global_step=1150` at `2026-07-07T19:53:29Z`.
- W&B state at the 1K gate: `running`.
- No retry-worthy training failure occurred before the 1K gate.
- Slack DM sent to Boris with the pass-1000 update.
- Parking/PUDO Notion model-card row created for `moccasin-impartial-koala (not interleaved)`.

## Follow-Up

- Bazel cache cleanup completed after final verification.
  - Output base: `/workspace/.cache/bazel/dd9e4acb3ee41551a2d97056409b60b7`
  - Pre-cleanup size: `72G`
  - Process check: no process referenced the exact output base.
  - Result: removed.
  - `/workspace` after cleanup: `804G` used, `220G` available, `79%`.
