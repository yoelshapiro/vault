# Parking Training: May 3 Materialization Cap

## Summary
- Branch: `boris/training/kangaroo_new_pudo_unpudo_unpark_root`
- Commit: `2da114f0915c7f437ee5b2c4ad7773eb87a856aa`
- Change: updated `parking_bc_may01_dir_unpudo_unpark_gc_datamodule` to use the May 3 capped-window materialization root and provided bucket-row stats.
- Materialization root: `abfss://datasets@wayveproddatasetflat.dfs.core.windows.net/materialised/si/parking/dev/2026_05_03_08_25_40_root_parking_pudo_unpudo_unparking_with_short_buckets_all_disengagements_high_acc`
- Data mix unchanged: driving `50%`, PUDO `20%`, UNPUDO `13%`, unparking `7%`, gear-change `10%`.

## Validation
- Passed: `bazel test //wayve/ai/si:test_config_py_test --test_arg=-k --test_arg=test_parking_bc_2026_05_01_datamodule_mix`
- Note: `bazel test //wayve/ai/si:test_config --test_arg=-k --test_arg=test_parking_bc_2026_05_01_datamodule_mix` also ran, but aggregate lint/mypy targets failed because `-k` was passed to non-pytest tools. The underlying pytest target passed.

## Train Command
```bash
bazel run //wayve/ai/si/cli:cli -- \
  --project Parking \
  -ex parking_bc \
  -st may03_matcap_gc_shortdm \
  --platform AKS \
  -nn 4 \
  --cluster dgx-h100 \
  --no-verify \
  +mode=parking_bc_train_release_2026_5_11 \
  +datamodule=parking_bc_may01_dir_unpudo_unpark_gc_datamodule \
  num_steps=80000 \
  --priority P1
```

## Submission
- Job id: `158202`
- Nickname: `flamingo-rose-avid`
- Session: `session_2026_05_03_12_28_51_si_parking_bc_train_release_2026_5_11_may03_matcap_gc_shortdm`
- Status at last check: `Dispatched`
- Compute target: `aks-prod-training-2-swe.nd96h100c`
- W&B: `https://wandb.ai/wayve-ai/parking_bc/runs/session_2026_05_03_12_28_51_si_parking_bc_train_release_2026_5_11_may03_matcap_gc_shortdm`
- Datadog logs: `https://app.datadoghq.eu/logs?query=job_name%3Aflamingo-rose-avid-158202&from_ts=1776601866469&cols=job_name%2Cnode_rank&live=true`
- Datadog dashboard: `https://app.datadoghq.eu/dashboard/6eg-vtz-9d5?fromUser=true&refresh_mode=paused&tpl_var_job_name=flamingo-rose-avid-158202%2A&from_ts=1777206666469&to_ts=1777811466469&live=false`

## Notes
- Training command was run by a worker subagent per repo runtime rules.
- Notion was not updated.
