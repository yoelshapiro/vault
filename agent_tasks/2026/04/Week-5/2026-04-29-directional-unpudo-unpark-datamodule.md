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
- split the train mix into explicit nested groups: `driving=0.50`, `parking=0.25`, `unparking=0.25`
- replaced only the DC `dc_unpudo_*` and `dc_unparking_*` training buckets inside the `unparking` group with derived `_forward` / `_reverse` buckets
- kept PUDO, CA UNPUDO/unparking, pre-CA UNPUDO/unparking, validation, and driving source partitions unchanged
- registered the new store entry as `parking_bc_new_driving_directional_unpudo_unpark_datamodule`

## Weighting

The derived forward/reverse row counts are `638,245` forward and `364,954` reverse, so the raw source is `63.62%` forward and `36.38%` reverse. The config now assigns equal total sampler mass to the two directions: `forward=0.0663416430`, `reverse=0.0663416430`. Within each direction, bucket weights follow the row-count distribution, so reverse rows are sampled about `1.75x` more often per row than forward rows to produce a 50/50 directional stream.

## Validation

- `python3 -m py_compile wayve/ai/si/configs/parking/parking_config.py`
- Static weight check: directional DC rows are `638,245` forward / `364,954` reverse; sampler mass is `0.0663416430` forward / `0.0663416430` reverse; top-level nested budgets are `0.50 / 0.25 / 0.25`
