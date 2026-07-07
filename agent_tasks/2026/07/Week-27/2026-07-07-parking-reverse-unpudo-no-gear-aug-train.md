# 2026-07-07 Parking Reverse-UnPUDO No Gear-Aug Train

## Summary

- Branch: `boris/parking-train-reverse-unpudo-no-gear-aug`
- Commit: `21090f07c920333c8500d6903440ffa7bf8f4bd6`
- Base commit: `d3a297cd99516999980706bb0a6d1f4e39282ab9`
- Surfboard job: `189855` / `fierce-opossum-tomato-189855`
- Nickname: `fierce-opossum-tomato`
- Session: `session_2026_07_07_19_34_54_revnopga0`
- W&B: https://wandb.ai/wayve-ai/parking_bc/runs/session_2026_07_07_19_34_54_revnopga0
- Datadog: https://app.datadoghq.eu/dashboard/6eg-vtz-9d5?fromUser=true&refresh_mode=paused&tpl_var_job_name=fierce-opossum-tomato-189855%2A&from_ts=1782849517751&to_ts=1783454317751&live=false
- Notion: https://app.notion.com/p/39603da5d69a81b1962ffa5532a56af0

## Changes

- Created an isolated worktree from the requested code commit and branch.
- Replaced `dc_unpudo_gear_change` training and validation buckets with `dc_unpudo_reverse` buckets.
- Sourced reverse buckets from the requested `parking_pudo_default_indicator_start_700_20260623` materialization root.
- Added config validation to fail if gear-change buckets remain, reverse buckets are missing, roots are wrong, or reverse train weight differs from `0.06`.
- Set `unparking_gear_augment_prob=0` for the parking BC train.
- Verified deployment-wrapper fixes remained present: EOR thresholds, corrected interleave polarity, EOR hazard and gear latch flags, and hazards only forced when gear latched to Park.

## Validation

- Verified exact reverse bucket names in Azure materialization for train and validation:
  - `dc_unpudo_reverse_deu`
  - `dc_unpudo_reverse_global`
  - `dc_unpudo_reverse_jpn`
  - `dc_unpudo_reverse_uk`
  - `dc_unpudo_reverse_usa`
- `git diff --check` passed.
- Focused Bazel config test was attempted but did not complete locally because the worktree WayveMeta service-info path hit a missing tag and hung while resolving service metadata.
- The live training session confirmed the submitted config contained the pushed clean commit and branch.

## Training

```bash
env -u CODER -u CODER_AGENT_TOKEN -u CODER_AGENT_URL IN_WAYVE_META_UPDATE=1 WAYVECODE_MAIN_COMMIT_META_OVERRIDE=d3a297cd9951 WAYVECODE_CURRENT_COMMIT_META_OVERRIDE=21090f07c920333c8500d6903440ffa7bf8f4bd6 \
bazel run //wayve/ai/si/cli:cli -- \
  --no-verify \
  --experiment parking_bc --platform AKS --cluster dgx-h100 --num_nodes 4 \
  --session_tag revnopga0 --project Parking --control_model "" \
  +mode=parking_bc_train_release_2026_5_21 \
  +datamodule=parking_bc_datamodule \
  num_steps=100000 \
  --priority P1
```

## Monitoring

- W&B reached `trainer/global_step=1092` while Surfboard remained `Running`; later snapshot showed `trainer/global_step=1859`, `_step=3189`, loss `1.4619`.
- Surfboard final observed state before cleanup: `Running`, MFU `14.425986201981164`, no termination reason.
- No retry-worthy training failure occurred before the 1K gate.
- Slack DM sent to Boris with the pass-1000 update.
- Parking/PUDO Notion model-card row created for `fierce-opossum-tomato (not interleaved)`.

## Cleanup

- Identified worktree Bazel output base with `bazel info output_base`: `/workspace/.cache/bazel/cf27e866e2c67ed5715cc5c1d50760bb`.
- Shut down Bazel for the worktree and confirmed no non-check process referenced that output base before deletion.
- Initial scoped delete hit permission-denied files inside the output base; repaired permissions with `chmod -R u+rwX` only inside the same output-base path.
- Retried scoped delete successfully and verified the output-base path no longer exists.
