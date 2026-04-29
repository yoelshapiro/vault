# Directional UNPUDO / Unpark Datamodule

Branch: `boris/training/kangaroo_with_50_and_route_shorten`
Status: pushed and training submitted

## Goal

Add a datamodule config that uses the derived future-speed-filtered DC UNPUDO / unparking materialization with separate forward and reverse buckets.

Source root:

`abfss://datasets@wayveproddatasetflat.dfs.core.windows.net/materialised/si/parking/dev/2026_04_29_07_52_36_root_parking_unpudo_unparking_future_speed_0p15_gear_change_dc_2026_03_23_ca_2026_04_13`

## Change

Updated `wayve/ai/si/configs/parking/parking_config.py`:

- added `PUDO_UNPARKING_FUTURE_SPEED_ROOT`
- copied the `parking_bc_new_driving_datamodule_cfg` structure into a new config
- split the train mix into explicit nested groups matching the base config: `driving=0.50`, `parking/pudo=0.25`, `unpudo=0.20`, `unparking=0.05`
- replaced only the DC `dc_unpudo_*` and `dc_unparking_*` training buckets inside the `unparking` group with derived `_forward` / `_reverse` buckets
- kept PUDO, CA UNPUDO/unparking, pre-CA UNPUDO/unparking, validation, and driving source partitions unchanged
- registered the new store entry as `parking_bc_new_driving_directional_unpudo_unpark_datamodule`
- updated the derived root to the fsspec-written materialization path and pushed commit `3566bbbe95d`
- intentionally does not use the low-count `_gear_change` derived buckets from the new materialization

## Weighting

The derived UNPUDO row counts are `240,240` forward and `74,607` reverse. The config assigns equal derived DC UNPUDO sampler mass to forward and reverse, so reverse UNPUDO rows are sampled about `3.22x` more often per row. The derived unparking row counts are `398,005` forward and `290,347` reverse; reverse unparking rows are sampled about `1.37x` more often per row. Within each direction, bucket weights follow the row-count distribution.

## Validation

- `python3 -m py_compile wayve/ai/si/configs/parking/parking_config.py`
- Static weight check: top-level nested budgets are `0.50 / 0.25 / 0.20 / 0.05`; derived DC UNPUDO forward/reverse mass is equal, and derived DC unparking forward/reverse mass is equal
- Azure CLI existence check confirmed the `2026_04_29_07_52_36...` materialization root and sampled bucket metadata/parquet files exist in both `wayveproddatasetflat` and `wayveproddatasetflatswe`

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

## Fsspec Materialization Retry

Submitted after pushing commit `3566bbbe95d`, which points `PUDO_UNPARKING_FUTURE_SPEED_ROOT` at the fsspec-written materialization:

`abfss://datasets@wayveproddatasetflat.dfs.core.windows.net/materialised/si/parking/dev/2026_04_29_06_36_32_root_parking_unpudo_unparking_future_speed_0p15_gear_change_dc_2026_03_23_ca_2026_04_13`

The datamodule still uses only the derived `_forward` and `_reverse` buckets. It does not use `_gear_change` buckets because the materialized gear-change counts are too small after future-speed filtering.

- Job id: `155829`
- Nickname: `courageous-harlequin-gecko`
- Session: `session_2026_04_29_07_31_55_si_parking_bc_train_release_2026_5_11_dir_unpudo_unpark_fsspec_50_25_20_5`
- Session path: `/mnt/remote/azure_session_dir/Parking/parking_bc/session_2026_04_29_07_31_55_si_parking_bc_train_release_2026_5_11_dir_unpudo_unpark_fsspec_50_25_20_5`
- Status at submission check: `Dispatched`
- WandB: `https://wandb.ai/wayve-ai/parking_bc/runs/session_2026_04_29_07_31_55_si_parking_bc_train_release_2026_5_11_dir_unpudo_unpark_fsspec_50_25_20_5`
- Datadog: `https://app.datadoghq.eu/logs?query=job_name%3Acourageous-harlequin-gecko-155829&from_ts=1776238380424&cols=job_name%2Cnode_rank&live=true`

Job `155829` failed with the same materialization availability class:

- concrete exception: `ValueError: No parquet files found in abfss://datasets@wayveproddatasetflatswe.dfs.core.windows.net/materialised/si/parking/dev/2026_04_29_06_36_32_root_parking_unpudo_unparking_future_speed_0p15_gear_change_dc_2026_03_23_ca_2026_04_13/dataset_split=train/dataset_bucket=dc_unpudo_uk_forward`
- confirmed with Azure CLI that the new materialization exists under `wayveproddatasetflat`
- confirmed the same prefix is empty under `wayveproddatasetflatswe`
- compared against the existing `2026_04_19_16_40_53...high_acc` materialization and confirmed that one exists in both primary and SWE accounts

Comparison with the original PUDO materialization notebook:

- both notebooks use direct fsspec parquet writes with `AsyncAzureCredentials`
- both write `dataset_split=<split>/dataset_bucket=<bucket>/part-00000.parquet.snappy`
- both write bucket-level, split-level, and root `_parquet_files_list.txt`
- original additionally writes `git.hash` / `git.diff`
- original `write_meta` opens metadata files without explicitly passing credentials; the new notebook uses credentialed fsspec for metadata too
- original root has no directory marker blobs in Azure listing; the new root currently has marker blobs for the root/split/bucket directories

Current conclusion: the failure is not a sampler/config issue and not that `_gear_change` buckets were used. The new output has not been copied/replicated to the SWE account used by AKS training.

## Replicated Materialization Retry

The materialization rerun with the exact original writer produced:

`abfss://datasets@wayveproddatasetflat.dfs.core.windows.net/materialised/si/parking/dev/2026_04_29_07_52_36_root_parking_unpudo_unparking_future_speed_0p15_gear_change_dc_2026_03_23_ca_2026_04_13`

Azure CLI checks confirmed this root exists in both:

- `wayveproddatasetflat`
- `wayveproddatasetflatswe`

Verified bucket metadata/parquet files in SWE for:

- `dc_unpudo_uk_forward`
- `dc_unpudo_usa_reverse`
- `dc_unparking_uk_reverse`
- `dc_unparking_usa_forward`

Updated `PUDO_UNPARKING_FUTURE_SPEED_ROOT` to this replicated root and pushed commit `66a3f487862`.

## Replicated Materialization Training

Submitted after pushing commit `66a3f487862`, which points `PUDO_UNPARKING_FUTURE_SPEED_ROOT` at the replicated fsspec materialization:

`abfss://datasets@wayveproddatasetflat.dfs.core.windows.net/materialised/si/parking/dev/2026_04_29_07_52_36_root_parking_unpudo_unparking_future_speed_0p15_gear_change_dc_2026_03_23_ca_2026_04_13`

Command:

```bash
bazel run //wayve/ai/si/cli:cli -- \
  --project Parking \
  -ex parking_bc \
  -st dir_unpudo_unpark_replicated_50_25_20_5 \
  --platform AKS \
  -nn 4 \
  --cluster dgx-h100 \
  --no-verify \
  +mode=parking_bc_train_release_2026_5_11 \
  +datamodule=parking_bc_new_driving_directional_unpudo_unpark_datamodule \
  num_steps=100000 \
  --priority P1
```

- Job id: `155836`
- Nickname: `unflappable-azure-sea-cucumber`
- Session: `session_2026_04_29_08_18_36_si_parking_bc_train_release_2026_5_11_dir_unpudo_unpark_replicated_50_25_20_5`
- Session path: `/mnt/remote/azure_session_dir/Parking/parking_bc/session_2026_04_29_08_18_36_si_parking_bc_train_release_2026_5_11_dir_unpudo_unpark_replicated_50_25_20_5`
- Status at submission check: `Dispatched`
- WandB: `https://wandb.ai/wayve-ai/parking_bc/runs/session_2026_04_29_08_18_36_si_parking_bc_train_release_2026_5_11_dir_unpudo_unpark_replicated_50_25_20_5`
- Datadog: `https://app.datadoghq.eu/logs?query=job_name%3Aunflappable-azure-sea-cucumber-155836&from_ts=1776241300305&cols=job_name%2Cnode_rank&live=true`
