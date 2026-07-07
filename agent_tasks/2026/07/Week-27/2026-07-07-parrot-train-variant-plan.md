# 2026-07-07 Parrot Train Variant Plan

## Base

All train variants start from `origin/boris/parking-frog-eor-fresh-rawgear@c51b5baa`, which includes the recent end-of-route interleave and hazard latch fixes. Keep each train variant in its own branch/worktree with no uncommitted changes before launching.

## Variant 1 - Remove DC UnPUDO Gear-Change

- Remove `dc_unpudo_gear_change_*` from train and validation.
- Redistribute its `0.06` train weight:
  - `dc_unpudo_pre_start_weight: 0.10 -> 0.13`
  - `pre_ca_unpudo_weight: 0.08 -> 0.11`

## Variant 2 - Replace DC UnPUDO Gear-Change With Reverse UnPUDO

- Do not use `dc_unpudo_gear_change_*`.
- Use the removed `0.06` weight for reverse UnPUDO buckets.
- Reverse buckets come from:
  - `abfss://datasets@wayveproddatasetflat.dfs.core.windows.net/sampling_materialised/parking_pudo/default/dev/parking_pudo_default_indicator_start_700_20260623__2026-06-23-19-25/dataset`
- Verify exact bucket names before coding. Expected names are likely:
  - `dc_unpudo_reverse_usa`
  - `dc_unpudo_reverse_uk`
- Add matching validation buckets if present.
- Keep base `dc_unpudo` and `dc_unpudo_pre_start` unchanged.

## Variant 3 - Parking Mode Input Means Unparking Only

Training/data:

- Set model-facing `PARKING_MODE = result.unparking_mode`.
- Keep `UNPARKING_MODE = result.unparking_mode`.
- Add a separate key for real parking context:
  - `PARKING_ROUTE_SHORTENING_MODE = result.parking_mode`
- Route shortening should use:
  - `PARKING_ROUTE_SHORTENING_MODE` for parking-to-stop shortening
  - `UNPARKING_MODE` for unparking-from-stop shortening

Deployment:

- Stop using end-of-route to force `PARKING_MODE`.
- Add an unparking latch in `ParkingDeploymentWrapperImpl`:
  - turns on when gear latch is on and not end-of-route
  - turns off only when speed is above 5 kph
  - feeds `PARKING_MODE=True` only while the unparking latch is active
- Keep current gear latch and hazard gating behavior.

## Variant 4 - Do Not Use Park Mode

Training/data:

- Ensure model-facing `PARKING_MODE` is never true.
- Preserve route shortening via `PARKING_ROUTE_SHORTENING_MODE`, not model-facing `PARKING_MODE`.
- Keep `UNPARKING_MODE` for route/metrics as needed.

Model/deploy:

- Set `use_parking_mode=False` in the model config.
- Set or force `enable_end_of_route_parking=False` in deployment.
- Keep route shortening independent from the model parking-mode input.
