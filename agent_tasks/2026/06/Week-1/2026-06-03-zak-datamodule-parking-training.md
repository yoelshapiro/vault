# 2026-06-03 Zak Datamodule Parking Training

## Summary

Created local experiment branch `boris/zak_datamodule` from latest `origin/main` and wired a Parking SI training mode to use Zak Murez's experimental `mcv_new_phase2` datamodule approach from `/workspace/zak`.

## Context

- Zak branch inspected in `/workspace/zak` at `origin/zmurez/pudo`.
- Active Zak config chain: `wayve/ai/experimental/configs/mcv_new_phase2.yml` -> `mcv_new_base.yml` -> `mcv_new_base0.yml`.
- Goal: train the SI parking model with Zak's data, sampler, and augmentations without making a mainline-ready implementation.

## Changes

- Added `wayve/ai/si/datamodules/zak_experimental.py`.
  - Imports `wayve.ai.experimental` from `/workspace/zak` for this process.
  - Builds Zak's `mcv_new_phase2.yml` datamodule.
  - Preserves Zak's loader, sampler, transforms, PUDO sampling, and augmentations.
  - Maps Zak batch keys (`image`, `intrinsics`, `pose`, `speed`, `gear`, `indicator`, `egoposition`, `route`) into SI `DataKeys`.
- Registered `:zak_experimental` and a focused `test_zak_experimental` target in `wayve/ai/si/datamodules/BUILD`.
- Added parking config mode `parking_bc_train_zak_mcv_new_phase2`.
  - Uses the June 2026 parking model family.
  - Disables radar input because Zak's current datamodule does not emit SI radar tensors.
  - Disables behavior-control auxiliary loss because Zak's loader does not provide privileged latent-action labels.

## Verification

- `bazel test //wayve/ai/si/datamodules:test_zak_experimental`
- `bazel build //wayve/ai/si:train`

## Notes

- This is intentionally local and depends on `/workspace/zak` existing.
- It is suitable for a local experiment to see the training path run; it is not portable to Surfboard unless the relevant experimental files/configs/data annotations are vendored into the branch or otherwise made available in the training image.
