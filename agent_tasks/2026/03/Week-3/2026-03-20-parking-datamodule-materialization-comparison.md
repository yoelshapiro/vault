# 2026-03-20 — Parking datamodule/materialization comparison (Wonjoon vs ours)

## Summary
- Compared Wonjoon references (`d58617a...` for augmentation logic and `5aa61a5...` for datamodule wiring) against current local config (`2bd1f412149`).
- Verified which buckets are actually sampled by datamodule definitions (not all buckets present in the materialization tables).
- Found major training-mixture and gear-augmentation-toggle differences that can confound reverse/unparking outcomes.

## Relevant Findings
- `d58617a8993ebe3f2a38897a90765182fa45fdf7`:
  - Multi-file commit, but the parking-relevant logic is in `wayve/ai/zoo/data/parking.py`.
  - Includes gear reconstruction, standstill expansion, unparking gear augmentation, leading-standstill stripping, and standstill gear randomization.
  - For this logic, it matches the earlier baseline commit already referenced (`97769ac...`).

- `5aa61a51d5d8c999afd8a49b468dfd3010e5bd5f`:
  - Single-file config commit in `parking_config.py`.
  - Critical change: `augment_gear_direction=True` -> `False` (for the parking-window datamodule).

## Wonjoon Datamodule (from `5aa61a5...`)
- Mode uses `parking_window_bc_diffusion_with_driving_datamodule_cfg`.
- This datamodule builds train partitions as:
  - driving buckets (`*_DRIVING_TRAIN_BUCKETS`) +
  - `_parking_window_train_buckets(total_weight=0.5)`.
- Parking-window buckets come from materialization:
  - `2026_02_17_21_44_12_server_parking`
  - bucket families: `parking_window_gc*` and `unparking_window_gc*`.
- Weighting is formula-driven (gc/geo scalars), so tiny raw bucket counts can still be sampled non-trivially.

## Current Local Datamodule (at `2bd1f412149`)
- Release modes use `parking_bc_datamodule_cfg` (not parking-window datamodule).
- Roots are:
  - `parking/dev/2026_03_15_11_14_01_server_parking_pudo_buckets_bc` (driving)
  - `parking/dev/2026_03_17_11_14_18_root_parking_pudo_unpudo_with_av_buckets` (PUDO/UNPUDO/UNPARK)
- Includes substantial gen1 + gen2 driving mixture plus explicit PUDO/UNPUDO/UNPARK buckets.
- Keeps `augment_gear_direction=True`.

## Interpretation for Reverse/Unparking Issue
- Comparison is not apples-to-apples unless we align:
  1. datamodule mixture (parking-window vs current broad driving+pudo+unpudo+unpark), and
  2. `augment_gear_direction` toggle.
- Likely confounders:
  - data composition shift may dominate effects attributed to gear augmentation in `parking.py`.
  - disabling generic gear-direction augmentation in Wonjoon’s setup may change reliance on gear labels.

## Recommended Controlled Comparison
1. Hold datamodule fixed (current) and ablate only `parking.py` augmentation flags.
2. Hold augmentation fixed and swap datamodule mix to parking-window variant.
3. Explicitly include `augment_gear_direction` on/off in the matrix.
4. Evaluate reverse-start latency, unparking completion, and safety proxies together.
