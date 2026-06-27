# 2026-06-27 Acrobatic No-Aug Gear75 Training

## Summary

Created and dispatched a Parking/PUDO training variant from `acrobatic-rose-cobra` to isolate the effect of removing generic gear-direction augmentation while increasing the gated standstill gear augmentation.

## Branch

- `boris/parking-past30-no-standstill-gear-aug/acrobatic-no-aug-gear75`
- Base model: `acrobatic-rose-cobra`
- Base commit: `949bb24ae3d485c2b35fb436f00d407139211761`
- Submitted commit: `bd3068a2908a97b2bc7670b5d1cc759ca06f5fda`

## Code Changes

- Added explicit ParkingDataConfig knobs for `augment_standstill_gear_prob` and `enable_clamp_policy_at_first_neutral`.
- Set `augment_gear_direction=False`.
- Disabled `clamp_policy_at_first_neutral` for this training config.
- Set standstill gear augmentation probability to `0.75`.
- Set `parked_unparking_prob=0.5` and `unparking_gear_augment_prob=0.5`.
- Adjusted PUDO/UnPUDO weights:
  - `dc_pudo_weight=0.08`
  - `dc_unpudo_weight=0.08`
  - `dc_pudo_gear_change_weight=0.06`
  - `dc_unpudo_gear_change_weight=0.06`
  - `dc_unpudo_pre_start_weight=0.10`
  - `ca_pudo_weight=0.01`
  - `pre_ca_pudo_weight=0.02`
  - `ca_unpudo_weight=0.01`
  - `pre_ca_unpudo_weight=0.08`
- Set parking deployment wrapper defaults for `enable_end_of_route_hazard_lights=False` and `enable_end_of_route_gear_latch=False`.

## Validation

- `git diff --check`
- `bazel test //wayve/ai/si/datamodules:py_test --test_arg='-k=augment_standstill_gear or clamp_policy_at_first_neutral' --test_arg='--no-cov'`

## Training

- Job: `185617`
- Surfboard name: `teal-ecstatic-magpie-185617`
- Session: `session_2026_06_27_21_39_49_noaug75c05`
- W&B: https://wandb.ai/wayve-ai/parking_bc/runs/session_2026_06_27_21_39_49_noaug75c05
- Datadog: https://app.datadoghq.eu/logs?query=job_name%3Ateal-ecstatic-magpie-185617&from_ts=1781386790248&cols=job_name%2Cnode_rank&live=true
- Command:

```bash
bazel run //wayve/ai/si/cli:cli -- --no-verify --experiment parking_bc --platform AKS --cluster dgx-h100 --num_nodes 4 --session_tag noaug75c05 --project Parking --priority P1 +mode=parking_bc_train_release_2026_5_11 +datamodule=parking_bc_datamodule num_steps=100000 num_gpus=32
```

## Monitoring

- Delegated 1K-step monitoring and up to three failure fix/resubmit attempts to subagent `Gibbs` (`019f0b06-9d90-7fd3-b5f6-de71cb1a8126`).

## Second Ablation

- Branch: `boris/parking-past30-no-standstill-gear-aug/acrobatic-no-standstill-aug`
- Submitted commit: `5a42369a6faa05c70573d1541e0dfef056d6dd12`
- Additional config changes on top of the first variant:
  - `enable_augment_standstill_gear=False`
  - `parked_unparking_prob=0.0`
  - `unparking_gear_augment_prob=0.0`
- Deployment defaults remain:
  - `enable_end_of_route_hazard_lights=False`
  - `enable_end_of_route_gear_latch=False`
- Validation:
  - `git diff --check`
  - `bazel test //wayve/ai/si:test_config_py_test_test_configs_utils_parking_release_2026_5_21_config_resolves`
- Job: `185618`
- Surfboard name: `fuchsia-vampire-bat-jubilant-185618`
- Session: `session_2026_06_27_21_58_32_nostaug0`
- W&B: https://wandb.ai/wayve-ai/parking_bc/runs/session_2026_06_27_21_58_32_nostaug0
- Datadog: https://app.datadoghq.eu/logs?query=job_name%3Afuchsia-vampire-bat-jubilant-185618&from_ts=1781387912954&cols=job_name%2Cnode_rank&live=true
- Monitoring delegated to subagent `Russell` (`019f0b17-c3fb-7e93-836b-bda4cd435cef`).
