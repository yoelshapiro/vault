# Parking training submit for Wonjoon GC PUDO root017

## Goal

Submit the requested Parking training run from `boris/training/kangaroo_with_50_and_route_shorten` at commit `b774beee78de20642631523b355aa0b64acaebff`, monitor until at least `Running`, and record the resulting identifiers.

## Requested command

```bash
bazel run //wayve/ai/si/cli:cli -- --project Parking -ex parking_bc -st parking_gc_path_pred_2026_04_15_wonjoon_data_pudo_root017 --platform AKS -nn 4 --cluster dgx-h100 --no-verify +mode=parking_bc_train_release_2026_5_11 +datamodule=parking_diffusion_datamodule num_steps=80000 --priority P1
```

Prompt answers used:
- testing reason: `Validate Wonjoon GC parking datamodule with explicit 0.0.17 driving root and added PUDO mix.`
- dirty worktree / continue: `y`
- session tag: accepted only when it matched the requested tag exactly

## Result

Local verification before final submission:
- branch: `boris/training/kangaroo_with_50_and_route_shorten`
- commit: `b774beee78de20642631523b355aa0b64acaebff`

Final submitted run:
- Surfboard job: `153615`
- Session id: `session_2026_04_23_14_53_47_si_parking_bc_train_release_2026_5_11_parking_gc_path_pred_2026_04_15_wonjoon_data_pudo_root017`
- Platform nickname: `precocious-beagle-beige`
- W&B: `https://wandb.ai/wayve-ai/parking_bc/runs/session_2026_04_23_14_53_47_si_parking_bc_train_release_2026_5_11_parking_gc_path_pred_2026_04_15_wonjoon_data_pudo_root017`
- Datadog logs: `https://app.datadoghq.eu/logs?query=job_name%3Aprecocious-beagle-beige-153615&from_ts=1775746971182&cols=job_name%2Cnode_rank&live=true`

Monitoring outcome:
- the job reached `Running`
- a later `job get` showed current state `Failed`
- Surfboard `status_reason`: `Submitted to platform`
- Model Catalogue nickname lookup for the session returned no rows yet
- Notion release row: not created or updated in this task

## Run ledger

- `153590` / `session_2026_04_23_13_44_24_si_parking_bc_train_release_2026_5_11_parking_gc_path_pred_2026_04_15_wonjoon_data`
  - worker submitted an incorrect/truncated tag with wrong provenance commit metadata
  - failed with Surfboard `status_reason` `RuntimeError: Prefetch thread exited with an error`
- `153615` / `session_2026_04_23_14_53_47_si_parking_bc_train_release_2026_5_11_parking_gc_path_pred_2026_04_15_wonjoon_data_pudo_root017`
  - exact requested command and requested tag
  - reached `Running`, then later reported `Failed`; no more specific runtime error was available from local cached logs at close-out
