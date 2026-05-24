# 2026-05-24 Parking BC New Driving Training

## Summary

Submitted a Parking BC training job from `boris/parking-moving-buckets-config` using `parking_bc_new_driving_datamodule` and `parking_bc_train_release_2026_5_11`.

## Command

```bash
bazel run //wayve/ai/si/cli:cli -- \
  --project Parking \
  -ex parking_bc \
  -st moving_unpudo_trimmed \
  --platform AKS \
  -nn 4 \
  --cluster dgx-h100 \
  --no-verify \
  +mode=parking_bc_train_release_2026_5_11 \
  +datamodule=parking_bc_new_driving_datamodule \
  num_steps=100000 \
  --priority P1
```

## Submission

- Branch: `boris/parking-moving-buckets-config`
- Commit: `6e97857c4e9b3cebadfa432042deeb7a513ee23f`
- Dirty state: `false`
- Job id: `168353`
- Nickname: `prototypical-mantis-crimson`
- Job name: `prototypical-mantis-crimson-168353`
- Session id: `session_2026_05_24_14_19_00_si_parking_bc_train_release_2026_5_11_moving_unpudo_trimmed`
- Image: `wayvetraining.azurecr.io/scaled-intelligence:6e97857c4e9b3cebadfa432042deeb7a513ee23f`
- W&B: https://wandb.ai/wayve-ai/parking_bc/runs/session_2026_05_24_14_19_00_si_parking_bc_train_release_2026_5_11_moving_unpudo_trimmed
- Datadog logs: https://app.datadoghq.eu/logs?query=job_name%3Aprototypical-mantis-crimson-168353&from_ts=1778423180874&cols=job_name%2Cnode_rank&live=true

## Status

- Initial queue position: `2`
- Later state: `Dispatched` on `aks-prod-training-2-swe.nd96h100c`
- Final observed state: `Running`
- Start time: `05-24 14:25 (UTC)`

## Notes

No Notion release row was created in this run. Recommend documenting this training run on the Parking/PUDO release page if it becomes a candidate.
