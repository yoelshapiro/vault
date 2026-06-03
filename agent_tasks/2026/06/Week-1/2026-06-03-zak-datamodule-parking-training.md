# 2026-06-03 Zak Datamodule Parking Training

## Summary

Created local experiment branch `boris/zak_datamodule` from latest `origin/main` and wired a Parking SI training mode to use Zak Murez's experimental `mcv_new_phase2` datamodule approach. After deciding that main was not the right base for this parking experiment, replaced it with `boris/zak_datamodule_parking_cherrypick` forked from the known-working parking branch `boris/parking-past30-no-standstill-gear-aug/main_cherrypick_new_driving`.

The current path is `boris/zak_datamodule_parking_cherrypick` at `83058f1909cb`, with Zak's experimental code/config/data assets vendored into `/workspace/default` and wired through the working parking `parking_config.py`.

## Context

- Zak branch inspected in `/workspace/zak` at `origin/zmurez/pudo`.
- Active Zak config chain: `wayve/ai/experimental/configs/mcv_new_phase2.yml` -> `mcv_new_base.yml` -> `mcv_new_base0.yml`.
- Goal: train the SI parking model with Zak's data, sampler, and augmentations without making a mainline-ready implementation.

## Changes

### Replacement branch from working parking base

- Created `boris/zak_datamodule_parking_cherrypick` from `origin/boris/parking-past30-no-standstill-gear-aug/main_cherrypick_new_driving` at `a4b3772c7895`.
- Cherry-picked the Zak experimental datamodule integration from scratch branch commit `ce48bec9325d` without taking the scratch `parking_config.py` wholesale.
- Resolved the `wayve/ai/experimental/config.py` conflict by preserving the parking branch's NVS validation while keeping Zak's/default `MASK_VEHICLE_MODELS` behavior.
- Reset `wayve/ai/si/configs/parking/parking_config.py` to the working parking branch version, then added only:
  - `ZakExperimentalDataModule` import and Hydra datamodule registration.
  - `zak_mcv_new_phase2_datamodule` data mode.
  - `parking_bc_release_2026_5_21_zak_datamodule` model config.
  - `parking_bc_train_zak_mcv_new_phase2_release_2026_5_21` training mode.
- Kept the working parking branch's 2026-05-21 release model/WFM path as the base and did not port unrelated scratch 2026-06 model modes.

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
- Ported the updated release model from branch `boris/parking-past30-no-standstill-gear-aug/main_cherrypick_new_driving`.
  - Added `parking_bc_release_2026_5_21` using `WFMFeb2026EarlyFusionCFG` / `WFM_v1.4.0.550M(1.5.0)`.
  - Added normal train mode `parking_bc_train_release_2026_5_21`.
  - Added Zak-specific mode `parking_bc_train_zak_mcv_new_phase2_release_2026_5_21` so the updated WFM can train through Zak's data and augmentations.
  - Kept the existing June scratch model modes intact; this is an additional release-WFM path, not a replacement.

## Local fixes while running

- Ran `git lfs pull` for the imported experimental custom-data and prediction `.npz` files because local pointers caused NumPy unpickle failures.
- Added blank `wayve/ai/experimental/annotations/signs_gemini.txt`; Zak's annotation loader opens it unconditionally, and this mode has `SIGNS_GEMINI=0.0`.
- Disabled GPU video decoding in the Zak config from the adapter because the local worker path uses CPU tensors and this smoke mode only needs local functional training.
- Avoided a Bazel dependency cycle between SI datamodules and experimental world-model code by dynamically preferring the active checkout's experimental namespace rather than depending directly on `//wayve/ai/experimental/dataset:datasets`.

## Verification

- Replacement branch verification on `boris/zak_datamodule_parking_cherrypick`:
  - `bazel build //wayve/ai/si:train`
  - `bazel test //wayve/ai/si/datamodules:test_zak_experimental`
  - `git diff --cached --check`
- Short local train on replacement branch:
  - `bazel run //wayve/ai/si:train -- +mode=parking_bc_train_zak_mcv_new_phase2_release_2026_5_21 dev=true num_steps=1 limit_val_batches=0 val_interval=1000 parent_dir=/workspace/default/tmp/zak_train_sessions tag=zak_parkingbase_521_smoke3 logger=null profiler=null use_callbacks=false enable_flop_computation=false compile_mode=null enable_progress_bar=false`
  - Result: succeeded from `/workspace/default`. Logs show release `WFM_v1.4.0.550M(1.5.0)`, cached checkpoint `azure://wayveprodmlexperiments/training-session-store/releases/WFM_v1.4.0.550M(1.5.0).consolidated.ckpt`, Zak's dev-sliced `mcv_new_phase2` config loaded 264 runs, `samples: 150100`, first train iteration completed, and Lightning stopped with `max_steps=1`.
- Smoke-run issue found on replacement branch:
  - The checkout initially had LFS pointer text in `wayve/ai/experimental/data/splits/train_gen2.txt` and the prediction `.npz` files, which caused Zak's loader to fail.
  - Fixed local working copy with `git lfs checkout wayve/ai/experimental/data/splits/train_gen2.txt` and `git lfs checkout wayve/ai/experimental/predictions`; commit still stores the files as LFS objects.

### Scratch branch verification

- `bazel test //wayve/ai/si/datamodules:test_zak_experimental`
- `bazel build //wayve/ai/si:train`
- Short local train:
  - `bazel run //wayve/ai/si:train -- +mode=parking_bc_train_zak_mcv_new_phase2 dev=true num_steps=1 limit_val_batches=0 val_interval=1000 parent_dir=/workspace/default/tmp/zak_train_sessions tag=zak_datamodule_selfcontained_smoke_4 logger=null profiler=null use_callbacks=false enable_flop_computation=false compile_mode=null enable_progress_bar=false`
  - Result: succeeded from `/workspace/default`. Logs show `workspace_path=/workspace/default`, Zak's dev-sliced `mcv_new_phase2` config loaded 264 runs, Lightning completed forward/backward, and stopped with `max_steps=1`.
- Short local train with the updated release WFM:
  - `bazel run //wayve/ai/si:train -- +mode=parking_bc_train_zak_mcv_new_phase2_release_2026_5_21 dev=true num_steps=1 limit_val_batches=0 val_interval=1000 parent_dir=/workspace/default/tmp/zak_train_sessions tag=zak_datamodule_521_smoke logger=null profiler=null use_callbacks=false enable_flop_computation=false compile_mode=null enable_progress_bar=false`
  - Result: succeeded from `/workspace/default`. Logs show release `WFM_v1.4.0.550M(1.5.0)`, cached checkpoint `azure://wayveprodmlexperiments/training-session-store/releases/WFM_v1.4.0.550M(1.5.0).consolidated.ckpt`, Zak's dev-sliced `mcv_new_phase2` config loaded 264 runs, and Lightning stopped with `max_steps=1`.
- `git diff --check`

## Notes

- This is intentionally scratch-quality and large; it is aimed at proving training with Zak's data path rather than producing a mainline-ready integration.
- The original main-based branch was committed and pushed as `ce48bec9325d` (`feat: train parking with Zak datamodule`) to `origin/boris/zak_datamodule`, but it is no longer the recommended base.
- The replacement parking-based branch is committed as `83058f1909cb` (`feat: train parking branch with Zak datamodule`) on `boris/zak_datamodule_parking_cherrypick`.
- Dispatch mode for updated release WFM plus Zak data is `parking_bc_train_zak_mcv_new_phase2_release_2026_5_21`. The plain `parking_bc_train_release_2026_5_21` uses the normal parking datamodule.
- LFS-backed prediction `.npz` assets and the large `train_gen2.txt` split were pushed as LFS objects.
- The earlier attempted dispatch from the scratch branch was interrupted before a job id/session id was printed; no local SI CLI or submit process remained afterward.

## Training Dispatch

- Submitted remote training on 2026-06-03 from branch `boris/zak_datamodule_parking_cherrypick` at `83058f1909cb`.
- Image: `wayvetraining.azurecr.io/scaled-intelligence:83058f1909cb98ad88c97d98e490bb926644707c`.
- Surfboard job: `174118`.
- Surfboard nickname: `proactive-mallard-jade`.
- Session: `session_2026_06_03_20_13_31_zak521`.
- W&B: `https://wandb.ai/wayve-ai/parking_bc/runs/session_2026_06_03_20_13_31_zak521`.
- Datadog logs: `https://app.datadoghq.eu/logs?query=job_name%3Aproactive-mallard-jade-174118&from_ts=1779308350958&cols=job_name%2Cnode_rank&live=true`.
- Final observed state: `Running` on AKS target `aks-prod-training-2-swe.nd96h100`, 4 H100 nodes, start time `06-03 20:18 (UTC)`.
- Submitted with direct `wayvecli job submit` after aborting the SI wrapper before acceptance, because the wrapper expanded `-st zak521` into a long default session tag. Direct submit kept the session tag short as `zak521`.
- Model Catalogue lookup immediately after start returned no row yet; catalogue indexing had not caught up.
