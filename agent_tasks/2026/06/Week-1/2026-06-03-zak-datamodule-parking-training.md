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

## 2026-06-04 Remote Debugging

- Current branch: `boris/zak_datamodule_parking_cherrypick`.
- Latest pushed commit: `9be51ff18772` (`chore: log Zak constructor stages`).
- Validated:
  - `bazel test //wayve/ai/experimental:test_single_run`
  - `bazel build //wayve/ai/si:train_docker.binary`
- Fixes added while monitoring:
  - `0ffd430727a`: handle non-finite Zak odometry distances in `SingleRunDataset` cumulative-distance setup.
  - `2a7fdcf3b`: compute cumulative distance from frame-to-frame motion rather than first-frame offset from origin, with a guard against absurd final distances.
  - `e2e1c684b`: bounded loader-stage logging for the first shard entries per rank.
  - `9be51ff18772`: bounded inner `SingleIpaceDataset` constructor-stage logging.
- Remote runs:
  - `174241` failed before step 1 on `ValueError: arange: cannot compute length` from non-finite `cumdist[-1]`; fixed by `0ffd430727a`.
  - `174252` and `174263` stalled before first loaded run (`Load runs: 0/2060`) and were canceled.
  - `174273` showed parquet and dataframe loading succeeded but no `dataset_done`; canceled to patch cumulative distance from initial offset.
  - `174280` still showed no `dataset_done`; canceled to add inner constructor-stage instrumentation.
  - Latest job `174286`, session `session_2026_06_04_03_44_45_si_parking_bc_train_zak_mcv_new_phase2_release_2026_5_21_z521t`, is submitted from `9be51ff18772`.
- Latest observed state for `174286`: `Dispatched` on AKS target `aks-prod-training-2-swe.nd96h100`, no `start_time` yet as of 2026-06-04 ~03:51 UTC.
- Notion/model-card update is still pending. Do not update until a run reaches the requested 5K-step monitoring threshold.

## 2026-06-04 No-Dev Local Investigation

- Latest failed remote job `174286` did not expose the underlying constructor issue because the new diagnostic logging crashed first:
  - Root cause: `WayveLogger.warn()` received duplicate `rows` kwargs from `SingleIpaceDataset` constructor context.
  - Local fix: renamed debug context fields to `dataframe_rows` / `parquet_rows` in `wayve/ai/experimental/dataset/ipace.py`.
- Local full no-dev attempt:
  - Command used mode `parking_bc_train_zak_mcv_new_phase2_release_2026_5_21` without `dev=true`.
  - First failure was local-only: config requested `num_gpus=8` while the machine has one GPU.
  - Retried with `num_gpus=1`; this tried to load `263,601` entries on one rank, reached ~13.6 GB RSS quickly, and was stopped as not representative of the sharded remote job.
- Bounded no-dev local attempt:
  - Command kept `dev=false` but set `datamodule.train_parquet_fraction=0.001`, `datamodule.val_parquet_fraction=0.001`, `num_gpus=1`, and `num_steps=1`.
  - Reproduced a real loader bug after constructor instrumentation: `NameError: name 'dist' is not defined` in `SingleRunDataset._post_init()` at the `make_park_masks(..., dist, ...)` call.
  - Cause: our earlier odometry fix replaced Zak's inline `dist = ...; self.cumdist = np.cumsum(dist)` with `compute_cumdist_from_egopose(...)` but left later code expecting the local `dist` variable.
  - Local fix: added `compute_dist_from_egopose(...)`, reused it to compute `cumdist`, and added a focused unit assertion.
  - Verified `bazel test //wayve/ai/experimental:test_single_run`.
- Bounded no-dev rerun after the `dist` fix:
  - Zak dataset construction completed: `loading_runs_done rank=0, loaded=264, total=264`.
  - Sampler construction completed and printed global sampled stats.
  - First train iteration started, then model forward failed with CUDA `indexSelectSmallIndex: srcIndex < srcSelectDimSize` / device-side assert.
  - The async stack ended in the pose adaptor, but the likely class of issue is an out-of-range categorical/index tensor or SI batch-shape mismatch from `ZakExperimentalDataModule._to_si_batch`, not Zak's datamodule construction.
- Recommendation:
  - Do not dispatch another remote job yet.
  - Commit the loader fixes only after deciding whether to keep the verbose constructor-stage diagnostics.
  - Add a pre-forward batch validation/debug path for the adapter fields (`camera_extrinsics`, `vehicle_indicator_state`, `vehicle_country`, `vehicle_model`, `vehicle_gear_direction`, `stopping_mode`, `parking_mode`) and rerun a local bounded no-dev smoke with `CUDA_LAUNCH_BLOCKING=1` if needed.
  - Once the mapped batch passes one local train step without `dev=true`, push and dispatch a new remote run.

## 2026-06-04 Adapter Validation and No-Dev Smoke

- Added explicit SI batch validation in `ZakExperimentalDataModule._to_si_batch` before the model sees the batch:
  - Checks finite pose/intrinsics/distortion/trajectory/speed/curvature tensors.
  - Checks categorical ranges for indicator, country, vehicle model, gear direction, stopping mode, parking mode, and unparking mode.
  - Keeps validation always-on while this branch is an experiment so failures are CPU-side and readable rather than CUDA embedding/index asserts.
- Bounded `dev=false` local smoke with `datamodule.train_parquet_fraction=0.001`, `datamodule.val_parquet_fraction=0.001`, `num_gpus=1`, `num_steps=1`, and batch size 4:
  - Loaded Zak dataset successfully: `loading_runs_done rank=0, loaded=264, total=264`.
  - Validation caught the actual adapter bug before forward: `vehicle_indicator_state` contained Zak value `-1`, while SI expects indicator categories `0..4`.
  - Fixed by mapping Zak unknown indicator `-1` to SI unknown indicator `4`, and by using Zak's `indicator_stick` for `vehicle_indicator_state` when present. This preserves Zak's indicator-stick dropout augmentation instead of silently using the unaugmented policy indicator everywhere.
- Bounded `dev=false` local smoke after indicator fix, batch size 4:
  - Passed dataset load, sampler creation, adapter validation, and reached first iteration.
  - Failed with local CUDA OOM during video encoder forward (`Tried to allocate 788.00 MiB`; ~77 GiB already allocated by PyTorch). Treated as local memory pressure, not a data-loader or adapter-value failure.
- Bounded `dev=false` local smoke after indicator fix, batch size 1:
  - Command kept Zak data/augmentations and release WFM mode, with `datamodule.batch_size=1` and `model.max_batch_size=1`.
  - Result: succeeded. Logs show train sampler creation, first iteration start/end, backward pass, and Lightning stopped at `max_steps=1`.
- Verification:
  - `bazel test //wayve/ai/experimental:test_single_run`
  - `bazel test //wayve/ai/si/datamodules:test_zak_experimental`
- Current conclusion:
  - Do not count the earlier remote failures as evidence that Zak's loader cannot train parking. The latest remote failure was self-inflicted diagnostic logging, and the next local bounded no-dev issue was an adapter categorical mapping bug that is now fixed.
  - The branch now has a real local no-dev smoke passing through Zak loader, Zak augmentations, SI adapter, release parking model forward/backward, and trainer stop at one step.
  - A remote dispatch still needs a fresh push first; no new remote train was started during this investigation.

## 2026-06-04 Local 1000-Step Run

- Ran a local 1000-step train from branch `boris/zak_datamodule_parking_cherrypick`.
- Command shape:
  - Mode: `parking_bc_train_zak_mcv_new_phase2_release_2026_5_21`.
  - `dev=false`, `num_gpus=1`, `num_steps=1000`, `limit_val_batches=0`.
  - Kept bounded local Zak data with `datamodule.train_parquet_fraction=0.001` and `datamodule.val_parquet_fraction=0.001`.
  - Used `datamodule.batch_size=1` and `model.max_batch_size=1` because the same local A100 OOMed at batch size 4.
  - Disabled logger/profiler/callback extras as in the previous smoke runs.
- Result: success.
  - Zak bounded train dataset loaded fully: `loading_runs_done rank=0, loaded=264, total=264`.
  - Train sampler built successfully and sampled `150,100` total / `132,611` unique examples.
  - First iteration started and ended successfully.
  - Lightning exited cleanly with ``Trainer.fit` stopped: `max_steps=1000` reached.`
- Observed warnings:
  - Repeated object-store `NotFoundError` warnings for camera video paths ending in `/nan`, for example `.../mcap_logger_camera_right_backward/nan`.
  - Zak's loader converted those to warnings at `wayve/ai/experimental/dataset/ipace.py:866`; they did not stop the local 1000-step run.
  - Final NCCL warning about `destroy_process_group()` not being called appeared on exit; process still exited with code 0.

## 2026-06-04 Remote Dispatch After Local Validation

- Committed and pushed branch `boris/zak_datamodule_parking_cherrypick`:
  - Commit: `bab774dcb5cd1391d30f9af9b7315a048e5b8489` (`fix: validate Zak parking datamodule batches`).
  - Image published by SI submit wrapper: `wayvetraining.azurecr.io/scaled-intelligence:bab774dcb5cd1391d30f9af9b7315a048e5b8489`.
- Submitted remote training:
  - Surfboard job: `174358`.
  - Surfboard nickname: `jade-musical-condor`.
  - Session: `session_2026_06_04_07_41_45_z521v`.
  - W&B: `https://wandb.ai/wayve-ai/parking_bc/runs/session_2026_06_04_07_41_45_z521v`.
  - Datadog logs: `https://app.datadoghq.eu/logs?query=job_name%3Ajade-musical-condor-174358&from_ts=1779349630958&cols=job_name%2Cnode_rank&live=true`.
  - Image: `wayvetraining.azurecr.io/scaled-intelligence:bab774dcb5cd1391d30f9af9b7315a048e5b8489`.
  - Command mode: `parking_bc_train_zak_mcv_new_phase2_release_2026_5_21`, `num_steps=100000`, `num_gpus=32`.
  - Cluster: AKS `aks-prod-training-2-swe.nd96h100`, 4 H100 nodes, priority `P1`.
  - Max restarts: `0`, because this is still an experimental Zak datamodule run.
- Final observed state:
  - `Running`.
  - Start time: `06-04 07:46 (UTC)`.

## 2026-06-04 Remote Monitoring

- Polled Surfboard job `174358` at `2026-06-04 07:58 UTC`.
- Job state remained `Running` on 4 H100 AKS nodes, with no termination reason and no queue position.
- Downloaded logs under `/tmp/zak174358_logs_monitor2/session_2026_06_04_07_41_45_z521v/174358`.
- Error logs were empty for downloaded rank groups:
  - `rank0-errors.log`: `0` lines.
  - `rank1-errors.log`: `0` lines.
  - `rank2-errors.log`: `0` lines.
  - `rank3-errors.log`: `0` lines.
- Positive signals:
  - Distributed setup completed far enough to initialize NCCL and all rank groups.
  - Zak's adapter loaded `mcv_new_phase2.yml` with `batch_size=4`, `data_workers=6`.
  - Train dataloader creation started across ranks.
  - Dataset construction is actively advancing through `parquet_loaded`, `dataframe_loaded`, `dataset_start`, `constructor_done`, and `dataset_done` stages.
- Caveat:
  - The run had not reached `loading_runs_done`, dataloader sampler completion, or first training iteration.
  - The full Zak loader is eagerly loading about `8238` runs per rank; refreshed progress lines showed only tens of runs completed per rank after roughly 7 minutes of loading.
  - Current status is therefore "alive and making data-load progress", not yet "proven training".
  - Repeated `datadog.dogstatsd` packet warnings appeared, but they were not fatal and did not populate the error logs.
