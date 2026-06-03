# 2026-06-03 Zmurez PUDO Data Loading Investigation

## Summary

- Created `/workspace/zak` as a detached worktree at `origin/zmurez/pudo` commit `563c88427a65`.
- Investigated Zak Murez's experimental PUDO training data path and compared it with our SI `parking_config.py` data modules.
- Conclusion: his experimental `DataModule` cannot be used as-is to load exact data into the SI parking model. It uses ExpAI/YACS config, `IpaceDataset`, raw run lists, global JSON/NPZ annotations, and frame-level heuristic sampling. Our SI configs use `BcDataModuleCfg`/`OtfDrivingDataModule` over materialised bucket roots and zoo/SI data keys.

## Findings

- Active experimental config chain is `mcv_new_phase2.yml -> mcv_new_base.yml -> mcv_new_base0.yml`.
- `mcv_new_base0.yml` uses:
  - `DATASET.WAYVE.TRAIN = wayve/ai/experimental/data/splits/train_gen2.txt`
  - `DATASET.WAYVE.VAL = wayve/ai/experimental/data/splits/auto_stable.txt`
  - `DATASET.WAYVE.ODOMETRY_SOURCE = Speed-IMU_v2`
  - `DATASET.GPU_VIDEO_DECODING = True`
  - `MODEL.NAME = MCVPerceiver`
  - parking/PUDO, gear, indicator, route, and navigation inputs enabled.
- `mcv_new_phase2.yml` adds PUDO sampler weights:
  - `PUDO_LDN_NEAR = 0.02`
  - `PUDO_LDN_FAR = 0.02`
  - `PUDO_USA_NEAR = 0.02`
  - `PUDO_USA_FAR = 0.02`
- PUDO bins are selected in `samplers/sampler.py` via `get_parking_indices(stop_type="pudo", ...)` using:
  - Gen2 Mach-E EU/USA vehicle sets
  - non-office geofence location `[-1]`
  - `stopping_type == 2`
  - `pin_proximity` near/far from predicted PUDO pin-valid labels.
- PUDO labels come from `annotations/pudo_pin_valid_{before,after}.json` and `predictions/pudo_pin_valid_{before,after}.npz`.
- Near/far uses encoded distance labels:
  - before labels: 10m, 20m, 30m, 40m, 50m, 60m, 80m, 100m
  - after labels: 10m, 25m, 50m
  - current near condition: before <= 20m and after <= 10m.

## Data Generation Path

1. `dataset_update.py --crawl` scans vehicle blob containers and updates `data/splits/all.json` with run IDs.
2. After materialization, `dataset_update.py --update --odometry_source Speed-IMU_v2` loads metadata with `ParquetLoader` and `label__metadata.run_metadata`, storing split, automation status, wheel-odometry availability, driver, and vehicle model.
3. `make_splits.py` filters known bad runs, VSO training runs, and time-sync exclusions.
4. `make_splits.py` writes `train_gen2.txt` for train-split Gen2/partner runs with WO-like odometry.
5. Training parses `train_gen2.txt`, builds `IpaceDataset`, enriches each run with parking/PUDO annotations, then uses a hierarchical heuristic sampler to allocate frames by the config weights.

## Import Recommendation

- Do not import the experimental datamodule directly into SI training.
- To reproduce the data in our model, port the selection logic into SI-compatible materialized buckets or add an SI datapipe/filter stage that computes the same PUDO predicates and bucket names:
  - `pudo_ldn_near`
  - `pudo_ldn_far`
  - `pudo_usa_near`
  - `pudo_usa_far`
- Use `train_gen2.txt` as the source run universe only if we also reproduce the same per-frame sampler predicates; the run list alone is not the exact training data exposure.

