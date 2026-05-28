# 2026-05-28 PUDO Buffer0 Parkmode 80k Train

- Branch: `boris/05-21-updated-pudo-config`
- Commit: `3987649fd43c7d0fc47c1ce594c087f883674972`
- Job: `170655`
- Nickname: `eagle-feisty-aqua`
- Session: `session_2026_05_28_13_30_04_si_parking_bc_train_release_2026_6_21_pudo_buffer0_parkmode_80k`
- Image: `wayvetraining.azurecr.io/scaled-intelligence:3987649fd43c7d0fc47c1ce594c087f883674972`

## Command

```bash
bazel run //wayve/ai/si/cli:cli -- \
  --no-verify \
  --experiment parking_bc \
  --platform AKS \
  --cluster dgx-h100 \
  --num_nodes 4 \
  --session_tag pudo_buffer0_parkmode_80k \
  --project Parking \
  --priority P1 \
  +mode=parking_bc_train_release_2026_6_21 \
  +datamodule=pudo_bc_datamodule \
  num_steps=80000
```

## Status

- Submitted and monitored through `Queued` and `Dispatched` to `Running`.
- Started on `aks-prod-training-2-swe.nd96h100` at `2026-05-28 13:37 UTC`.
- Model Catalogue lookup by session id had not indexed a model row yet immediately after start.
