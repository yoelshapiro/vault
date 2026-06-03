# 2026-06-03 Zak Datamodule Parking Training

## Summary

Created local experiment branch `boris/zak_datamodule` from latest `origin/main` and wired a Parking SI training mode to use Zak Murez's experimental `mcv_new_phase2` datamodule approach. The first version referenced `/workspace/zak`; the current version vendors Zak's experimental code/config/data assets into `/workspace/default` so it can run from this branch.

## Context

- Zak branch inspected in `/workspace/zak` at `origin/zmurez/pudo`.
- Active Zak config chain: `wayve/ai/experimental/configs/mcv_new_phase2.yml` -> `mcv_new_base.yml` -> `mcv_new_base0.yml`.
- Goal: train the SI parking model with Zak's data, sampler, and augmentations without making a mainline-ready implementation.

## Changes

- Added `wayve/ai/si/datamodules/zak_experimental.py`.
  - Imports `wayve.ai.experimental` from the active checkout, defaulting to `get_wayve_root()`.
  - Builds Zak's `mcv_new_phase2.yml` datamodule.
  - Preserves Zak's loader, sampler, transforms, PUDO sampling, and augmentations.
  - Maps Zak batch keys (`image`, `intrinsics`, `pose`, `speed`, `gear`, `indicator`, `egoposition`, `route`) into SI `DataKeys`.
  - Applies dev-only parquet fractions so `dev=true` local smoke runs initialize against 0.1% of Zak's parquet list instead of the full run set.
- Imported Zak's selected experimental datamodule surface into the branch:
  - `wayve/ai/experimental/configs/mcv_new_phase2.yml` and base configs.
  - Experimental dataset, sampler, transform, annotation, prediction, utility, and split files needed by that config.
  - LFS-backed custom data and prediction `.npz` assets.
- Registered `:zak_experimental` and a focused `test_zak_experimental` target in `wayve/ai/si/datamodules/BUILD`.
  - Added `nuscenes-devkit` to satisfy Zak's experimental data imports.
- Added parking config mode `parking_bc_train_zak_mcv_new_phase2`.
  - Uses the June 2026 parking model family.
  - Disables radar input because Zak's current datamodule does not emit SI radar tensors.
  - Disables behavior-control auxiliary loss because Zak's loader does not provide privileged latent-action labels.
  - Sets `checkpoint_interval=0` because the deployment export callback rejects the scratch parking model combination (`navigation input`, `indicator memory`, and `parking`) before local training starts.

## Local fixes while running

- Ran `git lfs pull` for the imported experimental custom-data and prediction `.npz` files because local pointers caused NumPy unpickle failures.
- Added blank `wayve/ai/experimental/annotations/signs_gemini.txt`; Zak's annotation loader opens it unconditionally, and this mode has `SIGNS_GEMINI=0.0`.
- Disabled GPU video decoding in the Zak config from the adapter because the local worker path uses CPU tensors and this smoke mode only needs local functional training.
- Avoided a Bazel dependency cycle between SI datamodules and experimental world-model code by dynamically preferring the active checkout's experimental namespace rather than depending directly on `//wayve/ai/experimental/dataset:datasets`.

## Verification

- `bazel test //wayve/ai/si/datamodules:test_zak_experimental`
- `bazel build //wayve/ai/si:train`
- Short local train:
  - `bazel run //wayve/ai/si:train -- +mode=parking_bc_train_zak_mcv_new_phase2 dev=true num_steps=1 limit_val_batches=0 val_interval=1000 parent_dir=/workspace/default/tmp/zak_train_sessions tag=zak_datamodule_selfcontained_smoke_4 logger=null profiler=null use_callbacks=false enable_flop_computation=false compile_mode=null enable_progress_bar=false`
  - Result: succeeded from `/workspace/default`. Logs show `workspace_path=/workspace/default`, Zak's dev-sliced `mcv_new_phase2` config loaded 264 runs, Lightning completed forward/backward, and stopped with `max_steps=1`.
- `git diff --check`

## Notes

- This is intentionally scratch-quality and large; it is aimed at proving training with Zak's data path rather than producing a mainline-ready integration.
- It should be dispatchable after committing and pushing this branch, including the imported LFS-backed `.npz` assets. The current worktree has not been staged or committed.
- Current local branch is for experimentation only; no files were staged or committed.
