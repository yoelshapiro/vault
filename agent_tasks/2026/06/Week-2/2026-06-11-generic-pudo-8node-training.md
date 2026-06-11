# 2026-06-11 Generic PUDO 8-node Training

- Branch: `boris/training/main_cherrypick_generic_data`
- Commit: `4926993aefa80d1df1edbc1d5a10769ed274e86a`
- Workspace: `/workspace/WayveCode`

## Summary

Submitted a Parking BC training run from the generic PUDO training branch.

## Command Shape

```bash
bazel run //wayve/ai/si/cli:cli -- \
  --no-verify \
  --experiment parking_bc \
  --platform AKS \
  --cluster dgx-h100 \
  --num_nodes 8 \
  --session_tag genpudo8n100k \
  --project Parking \
  --control_model '' \
  +mode=parking_bc_train_release_2026_5_21 \
  +datamodule=pudo_bc_datamodule \
  num_steps=100000 \
  --priority P1
```

## Run

- Surfboard job: `178473`
- Surfboard nickname: `intricate-hatchetfish-crimson`
- Session: `session_2026_06_11_19_44_33_genpudo8n100k`
- Session path: `/mnt/remote/azure_session_dir/Parking/parking_bc/session_2026_06_11_19_44_33_genpudo8n100k`
- Image: `wayvetraining.azurecr.io/scaled-intelligence:4926993aefa80d1df1edbc1d5a10769ed274e86a`
- Nodes: 8 H100 nodes (`num_gpus=64`)
- Priority: `P1`
- Max restarts: `0`
- Final observed status in this task: `Dispatched`

## Links

- W&B: https://wandb.ai/wayve-ai/parking_bc/runs/session_2026_06_11_19_44_33_genpudo8n100k
- Datadog logs: https://app.datadoghq.eu/logs?query=job_name%3Aintricate-hatchetfish-crimson-178473&from_ts=1779997507682&cols=job_name%2Cnode_rank&live=true
- Datadog dashboard: https://app.datadoghq.eu/dashboard/6eg-vtz-9d5?fromUser=true&refresh_mode=paused&tpl_var_job_name=intricate-hatchetfish-crimson-178473%2A&from_ts=1780602307682&to_ts=1781207107682&live=false

## Notes

- The CLI-generated tag included the mode name; it was overridden to `genpudo8n100k`.
- Model Catalogue lookup by session id returned no rows immediately after submission.
