# Parking training submit for Wonjoon GC PUDO r017 fix3

## Goal

Submit the requested Parking training run from `/workspace/WayveCode` for the migrated Wonjoon parking diffusion datamodule, monitor it until a concrete platform state, and capture the identifiers.

## Requested command

```bash
cd /workspace/WayveCode && bazel run //wayve/ai/si/cli:cli -- --project Parking -ex parking_bc -st wonjoon_gc_pudo_r017_fix3 --platform AKS -nn 4 --cluster dgx-h100 --no-verify +mode=parking_bc_train_release_2026_5_11 +datamodule=parking_diffusion_datamodule num_steps=80000 --priority P1
```

Prompt answers used:
- dirty worktree / continue: `y`
- testing reason: `verify the migrated Wonjoon parking diffusion datamodule after policy-path preflight fixes`
- session tag: accepted the proposed `si_parking_bc_train_release_2026_5_11_wonjoon_gc_pudo_r017_fix3`

## Result

- branch: `boris/training/kangaroo_with_50_and_route_shorten`
- commit provenance used: `82b56c60d401aeef4c92417c016f37286b8c2240`
- Surfboard job: `153682`
- session id: `session_2026_04_23_17_39_51_si_parking_bc_train_release_2026_5_11_wonjoon_gc_pudo_r017_fix3`
- nickname: `newt-mischievous-indigo`
- state at close-out: `Queued`
- queue position: `1`
- W&B: `https://wandb.ai/wayve-ai/parking_bc/runs/session_2026_04_23_17_39_51_si_parking_bc_train_release_2026_5_11_wonjoon_gc_pudo_r017_fix3`
- Datadog logs: `https://app.datadoghq.eu/logs?query=job_name%3Anewt-mischievous-indigo-153682&from_ts=1775756439769&cols=job_name%2Cnode_rank&live=true`
- release row / Notion: not created or updated

## Notes

- The submission prompt confirmed the dirty worktree and included the expected uncommitted files from the local repo.
- Provenance metadata in the submitted job confirmed commit `82b56c60d401aeef4c92417c016f37286b8c2240`.
- The job did not advance past `Queued` during the monitoring window.
