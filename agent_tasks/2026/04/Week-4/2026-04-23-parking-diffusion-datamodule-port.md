# Parking diffusion datamodule port

## Goal

Port the data-only part of PR `#106346` into `boris/training/kangaroo_with_50_and_route_shorten` as a second selectable parking datamodule config, without bringing over the diffusion model/output-adaptor/training-mode pieces.

## What changed

Updated [parking_config.py](/workspace/WayveCode/wayve/ai/si/configs/parking/parking_config.py) to add:

- import of `baseline_bc_datamodule` from baseline release config
- import of `NestedBucketCfg`
- new root constant:
  - `PARKING_GC_ROOT_26_04_15`
- new datamodule config:
  - `parking_diffusion_datamodule_cfg`
- new store registration:
  - `data_store(parking_diffusion_datamodule_cfg, name="parking_diffusion_datamodule")`

## Adaptation from PR

This was not a literal cherry-pick.

Reasons:
- the working tree is dirty, so cherry-picking the PR commit directly would have been unsafe
- the PR also included diffusion model / output adaptor / training mode additions, which were out of scope
- the PR referenced a baseline helper symbol that does not exist on this branch

Adjustment made:
- reused `baseline_bc_datamodule.train_partitions` directly instead of importing a missing helper
- omitted PR fields that are not part of this branch’s `BcDataModuleCfg` surface
- kept the parking GC bucket layout and the parking-specific `ParkingDataConfig`

## Validation

- `python -m py_compile wayve/ai/si/configs/parking/parking_config.py`

This only validates syntax, not full runtime config loading through Bazel/Hydra.
