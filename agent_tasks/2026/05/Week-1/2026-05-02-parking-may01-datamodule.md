# Parking May 1 Datamodule

- Date: 2026-05-02
- Branch: `boris/training/kangaroo_new_pudo_unpudo_unpark_root`
- PR: none
- Change type: code/tests
- Areas: `wayve/ai/si/configs/parking/`, `wayve/ai/si/test/configs/`

## Summary

Added `parking_bc_new_driving_2026_05_01_directional_unpudo_unpark_gear_change_datamodule` on top of `boris/training/kangaroo_with_50_and_route_shorten`.

The new datamodule keeps the split-alpha2/alpha3 driving data and uses the May 1 PUDO/UNPUDO/unparking materialization root:

`abfss://datasets@wayveproddatasetflat.dfs.core.windows.net/materialised/si/parking/dev/2026_05_01_20_54_01_root_parking_pudo_unpudo_unparking_with_short_buckets_all_disengagements_high_acc/`

## Mix

- Driving: 50%
- PUDO: 20%
- UNPUDO: 13%
- Unparking: 7%
- Gear change: 10%

## Notes

- PUDO includes DC, CA long/short, and pre-CA buckets for USA/UK.
- UNPUDO and unparking include CA long/short and pre-CA buckets plus DC forward/reverse buckets.
- DC forward/reverse buckets are balanced 50/50 within each DC country aggregate, which upsamples reverse relative to raw row counts.
- Gear-change buckets use the May 1 DC PUDO/UNPUDO/unparking gear-change buckets.
- Kept the implementation in `parking_config.py` per Boris's request.

## Validation

- Passed: `bazel test //wayve/ai/si:test_config_py_test --test_arg=-k --test_arg=test_parking_bc_2026_05_01_datamodule_mix`
- Passed: `bazel test //wayve/ai/si:test_config_py_lint_pylint`
- Failed unrelated/pre-existing: `bazel test //wayve/ai/si:test_config_py_lint_flake8` on `wayve/ai/si/configs/versioning/bc_migrations.py:499 E303`.

## Training

Pushed commit `e74bc4067860367bb3e106a97180b88d3ecbb406`, then submitted an 80k-step AKS training run.

First submission used `datamodule=...` and failed quickly with:

`ConfigCompositionException: Could not override 'datamodule'. No match in the defaults list.`

Retry used `+datamodule=...` and submitted successfully:

- Surfboard job: `157814`
- Session: `session_2026_05_02_13_49_28_si_parking_bc_train_release_2026_5_11_may01_pudo_50_20_13_7_gc`
- Nickname: `butterfly-fuchsia-outgoing`
- Final observed state: `Dispatched`
- Compute: `aks-prod-training-2-swe.nd96h100`
- W&B: `https://wandb.ai/wayve-ai/parking_bc/runs/session_2026_05_02_13_49_28_si_parking_bc_train_release_2026_5_11_may01_pudo_50_20_13_7_gc`
- Datadog: `https://app.datadoghq.eu/logs?query=job_name%3Abutterfly-fuchsia-outgoing-157814&from_ts=1776520499765&cols=job_name%2Cnode_rank&live=true`
- Notion release row: `https://www.notion.so/35403da5d69a81aa9301f2640fd961be`
