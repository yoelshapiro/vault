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
- replaced only the DC `dc_unpudo_*` and `dc_unparking_*` training buckets with derived `_forward` / `_reverse` buckets
- kept PUDO, CA UNPUDO/unparking, pre-CA UNPUDO/unparking, validation, and driving partitions unchanged
- registered the new store entry as `parking_bc_new_driving_directional_unpudo_unpark_datamodule`

## Weighting

Each original DC event/country effective weight is split 50/50 between forward and reverse variants. This preserves total DC UNPUDO / unpark mass while intentionally upsampling reverse relative to row-count share.

## Validation

- `python3 -m py_compile wayve/ai/si/configs/parking/parking_config.py`
