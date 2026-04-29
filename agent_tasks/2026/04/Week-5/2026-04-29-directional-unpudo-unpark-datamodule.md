# Directional UNPUDO / Unpark Datamodule

Branch: `boris/training/kangaroo_with_50_and_route_shorten`
Status: uncommitted local change

## Goal

Add a datamodule config that uses the derived future-speed-filtered DC UNPUDO / unparking materialization with separate forward and reverse buckets.

Source root:

`abfss://datasets@wayveproddatasetflat.dfs.core.windows.net/materialised/si/parking/dev/2026_04_29_05_44_34_root_parking_unpudo_unparking_future_speed_0p15_from_2026_03_23`

## Change

Updated `wayve/ai/si/configs/parking/parking_config.py`:

- added `PUDO_UNPARKING_FUTURE_SPEED_ROOT`
- copied the `parking_bc_new_driving_datamodule_cfg` structure into a new config
- split the train mix into explicit nested groups matching the base config: `driving=0.50`, `parking/pudo=0.25`, `unpudo=0.20`, `unparking=0.05`
- replaced only the DC `dc_unpudo_*` and `dc_unparking_*` training buckets inside the `unparking` group with derived `_forward` / `_reverse` buckets
- kept PUDO, CA UNPUDO/unparking, pre-CA UNPUDO/unparking, validation, and driving source partitions unchanged
- registered the new store entry as `parking_bc_new_driving_directional_unpudo_unpark_datamodule`

## Weighting

The derived UNPUDO row counts are `240,240` forward and `74,607` reverse. The config assigns equal derived DC UNPUDO sampler mass to forward and reverse, so reverse UNPUDO rows are sampled about `3.22x` more often per row. The derived unparking row counts are `398,005` forward and `290,347` reverse; reverse unparking rows are sampled about `1.37x` more often per row. Within each direction, bucket weights follow the row-count distribution.

## Validation

- `python3 -m py_compile wayve/ai/si/configs/parking/parking_config.py`
- Static weight check: top-level nested budgets are `0.50 / 0.25 / 0.20 / 0.05`; derived DC UNPUDO forward/reverse mass is equal, and derived DC unparking forward/reverse mass is equal

## Training Run

Submitted after pushing commit `d88cf875ee4` on `boris/training/kangaroo_with_50_and_route_shorten`.

- Job id: `155826`
- Session: `session_2026_04_29_06_38_50_si_parking_bc_train_release_2026_5_11_dir_unpudo_unpark_50_25_20_5`
- Status at submission: `Queued`
- WandB: `https://wandb.ai/wayve-ai/parking_bc/runs/session_2026_04_29_06_38_50_si_parking_bc_train_release_2026_5_11_dir_unpudo_unpark_50_25_20_5`
- Datadog: `https://app.datadoghq.eu/logs?query=job_name%3Aelated-gray-toucan-155826&from_ts=1776235156392&cols=job_name%2Cnode_rank&live=true`
- Model nickname: `elated-gray-toucan`

First submission attempt used a longer session tag and failed before job creation because the generated full session name was `145` chars, above the `128` char limit. The successful retry used `dir_unpudo_unpark_50_25_20_5`.

Job `155826` then failed before training because the derived Spark-written materialization was not visible through the regional training storage account. The OTF loader rewrote `wayveproddatasetflat` to `wayveproddatasetflatswe` and then failed to find files such as:

`.../dataset_split=train/dataset_bucket=dc_unpudo_usa_forward`

This is a data availability / materialization write issue, not a datamodule weighting issue. Do not resubmit until the materialization is regenerated with the fsspec writer and this config root is updated to the new output path.
