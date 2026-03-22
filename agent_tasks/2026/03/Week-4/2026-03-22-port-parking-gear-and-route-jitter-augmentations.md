# 2026-03-22 — Port parking gear + route jitter augmentations onto `pudo_route_augmentations`

## Context
Port the augmentation work from `boris/training/03-20-parking-unparking-gear-augmentation` onto a branch forked from `boris/train/pudo_route_augmentations`, while avoiding unrelated refactors/notebook changes.

## Branch
- Source base: `boris/train/pudo_route_augmentations`
- Working branch: `boris/train/pudo_route_augmentations_gear_park_aug`

## Commits
1. `ace24ca3f87` — `fix: update gear position initialization in output conversion`
2. `35a456168cc` — `feat(parking): add standstill gear augmentation for parking training`
3. `a6a37f744fb` — `feat(parking): introduce parking stop route jitter functionality`

## What was added
- Parking standstill gear augmentation wiring and tests.
- Parking distance-threshold jitter and parking stop-route jitter wiring.
- Route shortening support for stop jitter in `routes.py`.
- Config knobs for jitter + gear augmentation in `parking_config.py`.
- Targeted test coverage updates in `test_otf.py`, `test_parking.py`, `test_generate_route_map.py`.
- Explicitly excluded notebook file `wayve/ai/parking/test.ipynb`.

## Validation
- `bazel test //wayve/ai/zoo/data:py_test --test_arg=-k --test_arg=test_parking` ✅
- `bazel test //wayve/ai/si/datamodules:py_test --test_arg=-k --test_arg=test_otf`
  - Functional tests passed.
  - Target failed on coverage gate due filtered run (`-k`) lowering total coverage below configured threshold.
- `bazel test //wayve/ai/lib:test_data_lib_py_test --test_arg=-k --test_arg=test_generate_route_map`
  - Blocked in analysis by ACR auth (`401 Unauthorized` fetching `azure-storage/azurite`).
