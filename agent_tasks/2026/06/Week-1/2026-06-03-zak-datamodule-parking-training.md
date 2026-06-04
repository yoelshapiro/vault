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

## 2026-06-04 W&B Step Check

- Polled Surfboard job `174358` again at `2026-06-04 08:15 UTC`.
- Job state remained `Running`; no termination reason.
- Downloaded logs under `/tmp/zak174358_logs_wandb_check/session_2026_06_04_07_41_45_z521v/174358`.

## 2026-06-04 Parking Metrics Bypass and Redispatch

- Remote job `174492` reached first train batch after cached Zak parquet loading but failed in optional parking visualization metrics:
  - `ParkingBehaviorMetrics._update_standstill()` indexed singleton Zak `POLICY_TIME_DELTA` shape `[1, 11]` with a batch mask shape `[4]`.
  - Classified as SI parking metric incompatibility, not a Zak dataloader or augmentation failure.
- Added a scoped config flag:
  - `BcTrainingModule.enable_parking_metrics`, default `True`.
  - Parking metrics construction and train/val metric updates now require `use_parking_mode and enable_parking_metrics`.
  - `parking_bc_train_zak_mcv_new_phase2_release_2026_5_21` sets `enable_parking_metrics=False` while leaving `use_parking_mode=True`.
- Local validation:
  - Ran bounded non-dev local train with cached Zak data, `num_gpus=1`, `datamodule.batch_size=1`, `train_parquet_fraction=0.001`, `val_parquet_fraction=0.001`, and `num_steps=2`.
  - Loaded `264/264` cached Zak parquets, built the sampler, reached first iteration start/end, and exited cleanly at `max_steps=2`.
- Commit and image:
  - Commit: `96a6a0e741c3a760a327cdd2dc4a5d953535ab39` (`fix: disable optional parking metrics for Zak datamodule`).
  - Image: `wayvetraining.azurecr.io/scaled-intelligence:96a6a0e741c3a760a327cdd2dc4a5d953535ab39`.
- Redispatched remote training:
  - Surfboard job: `174514`.
  - Surfboard nickname: `perpetual-anteater-crimson`.
  - Session: `session_2026_06_04_14_16_56_si_parking_bc_train_zak_mcv_new_phase2_release_2026_5_21_zcm25fix`.
  - W&B: `https://wandb.ai/wayve-ai/parking_bc/runs/session_2026_06_04_14_16_56_si_parking_bc_train_zak_mcv_new_phase2_release_2026_5_21_zcm25fix`.
  - Datadog logs: `https://app.datadoghq.eu/logs?query=job_name%3Aperpetual-anteater-crimson-174514&from_ts=1779373039022&cols=job_name%2Cnode_rank&live=true`.
  - Command mode: `parking_bc_train_zak_mcv_new_phase2_release_2026_5_21`, `num_steps=80000`, `datamodule.train_parquet_fraction=0.25`, `datamodule.val_parquet_fraction=0.25`.
  - Cluster: 4 H100 nodes, priority `P1`, max restarts `0`.
  - Initial observed state: `Queued`, queue position `1`.
- Downloaded error logs remained empty for rank groups 0-3.
- No `loading_runs_done`, dataloader sampler completion, first-iteration success, step, or loss marker was present in the fresh logs.
- The absence of W&B steps is expected: the job has not entered the training loop yet.
- Latest per-rank `loading_runs_progress` maxima ranged from roughly `1800/8238` to `2600/8238`, so the full Zak eager dataset load is still underway.

## 2026-06-04 Job 174514 5K-Sample Monitor

- Monitored Surfboard job `174514` / session `session_2026_06_04_14_16_56_si_parking_bc_train_zak_mcv_new_phase2_release_2026_5_21_zcm25fix`.
- Final observed Surfboard state after the 5K-sample check:
  - Status: `Running`.
  - No `reason_for_termination`.
  - Branch/commit in job metadata: `boris/zak_datamodule_parking_cherrypick` / `96a6a0e741c3a760a327cdd2dc4a5d953535ab39`.
- Startup progression:
  - Cached Zak run loading used `train_parquet_fraction=0.25`, yielding about `2059-2060` selected parquet/run entries per rank.
  - All downloaded `rank*-errors.log` files stayed empty across snapshots.
  - `Load runs` reached 100% on all sampled ranks by about `14:38 UTC`.
  - All 32 ranks logged `train_dataloader_sampler_done` by about `14:46 UTC`.
  - First iteration start succeeded around `14:47 UTC`; first iteration end succeeded around `14:49:41 UTC`.
- Non-fatal warnings observed:
  - Some sampled camera paths ended in `/nan` and logged object-store `NotFoundError` warnings through Zak's loader path.
  - PyTorch emitted inductor/cudagraph and autograd stream-mismatch warnings during early compiled forward/backward.
  - These warnings did not populate the downloaded error logs and did not stop training.
- W&B training counter crossed the requested threshold:
  - `trainer/samples_seen=5248`.
  - `trainer/global_step=41`.
  - `trainer/train_step=41`.
  - W&B run: `https://wandb.ai/wayve-ai/parking_bc/runs/session_2026_06_04_14_16_56_si_parking_bc_train_zak_mcv_new_phase2_release_2026_5_21_zcm25fix`.

## 2026-06-04 Job 174548 Retry 10K-Sample Monitor

- Resubmitted the same cached-parquet Zak parking train after job `174514` failed later with a CUDA/NCCL peer-GPU/NVLink error.
- Retry job:
  - Surfboard job `174548`.
  - Session `session_2026_06_04_15_55_54_zakzcm25r2`.
  - Nickname `emerald-cognizant-cassowary`.
  - Branch/commit `boris/zak_datamodule_parking_cherrypick` / `96a6a0e741c3a760a327cdd2dc4a5d953535ab39`.
  - Same command shape: 4 H100 nodes, `--max_restarts 0`, `num_steps=80000`, `datamodule.train_parquet_fraction=0.25`, `datamodule.val_parquet_fraction=0.25`.
- Startup observations:
  - `Load runs` progressed from about `200/2060` at `16:04 UTC` to `2060/2060` by about `16:18 UTC`.
  - All downloaded `rank*-errors.log` files stayed empty across snapshots.
  - Rank 0 logged `train_dataloader_sampler_done` at `16:24:26 UTC`.
  - First W&B training samples appeared at `16:29:31 UTC` with `trainer/samples_seen=128`, `trainer/global_step=1`.
- W&B crossed the requested 10K-sample threshold:
  - `trainer/samples_seen=10368`.
  - `trainer/global_step=81`.
  - `trainer/train_step=81`.
  - Run state still `running` at threshold.
  - W&B run: `https://wandb.ai/wayve-ai/parking_bc/runs/session_2026_06_04_15_55_54_zakzcm25r2`.

## 2026-06-04 Job 174548 Post-Failure Fix

- Rechecked job `174548` after it later entered terminal `Failed`.
- Root cause was not the cached parquet path or the initial `Load runs` phase.
- First actionable traceback was rank 0 raising from the Zak-to-SI adapter:
  - `ValueError: Zak SI adapter produced non-finite vehicle_pose: shape=(4, 1, 4, 4), dtype=torch.float32, min=nan, max=nan`.
  - Stack: `_MappedLoader.__iter__ -> _to_si_batch -> _validate_si_batch -> _validate_pose(VEHICLE_POSE)`.
  - Later NCCL / peer-GPU / NVLink messages were downstream distributed teardown after the Python error.
- Inspected Zak's experimental path:
  - `SingleRunDataset` builds `egopose` from localization/odometry and sanitizes some derived parking fields, but does not globally guarantee every returned `egopose`, `egoposition`, scalar control, or camera calibration tensor is finite.
  - Zak model/input code tolerates NaNs in some conditioning paths; SI mandatory keys such as `VEHICLE_POSE`, `POLICY_POSE`, camera calibration, speed, curvature, and waypoints must be finite.
- Added Zak-to-SI boundary repairs in `/workspace/default/wayve/ai/si/datamodules/zak_experimental.py`:
  - Repair invalid temporal pose frames from neighboring finite frames when available, otherwise identity.
  - Repair invalid camera extrinsics to identity.
  - Repair invalid intrinsics, distortion, speed, and curvature to zero.
  - Repair invalid policy waypoints from the repaired `POLICY_POSE` translation fallback.
  - Preserve finite Zak values and log the first repair with `zak_experimental_repaired_nonfinite`.
- Added regression tests for non-finite `egopose`, camera extrinsics, `egoposition`, speed, curvature, intrinsics, and distortion in `test_zak_experimental`.
- Reduced the Zak experimental datamodule non-dev per-rank batch size from `model.max_batch_size` (`4` for the release mode) to `2`; dev remains `1`.
  - On 4 H100 nodes / 32 ranks, this changes global samples per optimizer step from `128` to `64`.
- Verification:
  - `bazel test //wayve/ai/si/datamodules:test_zak_experimental` passed.
  - `bazel test //wayve/ai/si:test_config_py_test_test_configs_utils_parking_release_2026_5_21_config_resolves` passed.

## 2026-06-04 Batch-2 Retry Dispatch

- Committed and pushed branch `boris/zak_datamodule_parking_cherrypick`:
  - Commit: `9c4cee467c46c9b4708ddbe2717fbca5527abc4d` (`fix: repair Zak datamodule non-finite inputs`).
  - Image: `wayvetraining.azurecr.io/scaled-intelligence:9c4cee467c46c9b4708ddbe2717fbca5527abc4d`.
- Submitted cached-parquet Zak datamodule training with:
  - Surfboard job `174665`.
  - Surfboard nickname `seahorse-scarlet-fierce`.
  - Session `session_2026_06_04_20_56_25_si_parking_bc_train_zak_mcv_new_phase2_release_2026_5_21_zcm25b2`.
  - Mode `parking_bc_train_zak_mcv_new_phase2_release_2026_5_21`.
  - `num_steps=80000`, `num_gpus=32`, 4 H100 AKS nodes.
  - `datamodule.train_parquet_fraction=0.25`, `datamodule.val_parquet_fraction=0.25`.
  - Effective non-dev Zak datamodule batch size is now 2, so global samples per step are expected to be 64.
  - Priority `P1`, `max_restarts=0`.
- Initial observed state:
  - Status `Queued`, queue position `1`.
  - W&B: `https://wandb.ai/wayve-ai/parking_bc/runs/session_2026_06_04_20_56_25_si_parking_bc_train_zak_mcv_new_phase2_release_2026_5_21_zcm25b2`.
  - Datadog logs: `https://app.datadoghq.eu/logs?query=job_name%3Aseahorse-scarlet-fierce-174665&from_ts=1779397007365&cols=job_name%2Cnode_rank&live=true`.
  - Efficiency dashboard: `https://app.datadoghq.eu/dashboard/6eg-vtz-9d5?fromUser=true&refresh_mode=paused&tpl_var_job_name=seahorse-scarlet-fierce-174665%2A&from_ts=1780001807365&to_ts=1780606607365&live=false`.

## 2026-06-04 Remote Stop

- User requested stopping Surfboard job `174358`.
- Issued:
  - `echo "y" | bazel run //tools/wayvecli:wayvecli -- job cancel 174358 --reason "Stopping Zak datamodule run before first training step"`
- Surfboard terminal state after the stop request:
  - Status: `Failed`.
  - End time: `06-04 08:47 (UTC)`.
  - Status reason: `CancelRequested by user: Stopping Zak datamodule run before first training step`.
- Downloaded final logs under `/tmp/zak174358_logs_after_failed_stop/session_2026_06_04_07_41_45_z521v/174358`.
- Downloaded `rank0-errors.log` through `rank3-errors.log` were all empty.
- No traceback, first-iteration success marker, step, or loss marker was present in the final logs.
- Final observed `loading_runs_progress` maxima ranged from roughly `5200/8238` to `6400/8237`, so the job was still in eager Zak dataset loading when stopped.
- Route parser messages about ferry travel mode appeared as parser errors plus `nav_instructions_parse_failed` warnings, but they did not populate the error logs and were not observed as a Python exception.

## 2026-06-04 Cached-Parquet Wiring

- Investigated Zak's actual recent W&B/Surfboard runs in `wayve-ai/zak_temporal1`.
  - Confirmed latest runs use `DATASET.WAYVE.TRAIN_PARQUET_FRACTION=1`, `DATASET.WAYVE.ODOMETRY_SOURCE=Speed-IMU_v2`, `train_gen2.txt`, `mcv_new_phase2x_wta.yml`, batch size 1, data workers 8, and 16 H100 nodes.
  - Concluded the 4-node SI run's slow startup came from per-rank eager loading: about `8238` cached run parquets per rank on 4 nodes versus about `2060` per rank on Zak's 16-node setup.
- Added cache-only parquet wiring for the Zak/SI parking datamodule path:
  - `wayve/ai/experimental/dataset/datasets.py` now accepts `parquet_fallback_delta_table` and passes it into `ParquetLoader`.
  - `wayve/ai/si/datamodules/zak_experimental.py` now accepts `parquet_cache_only`; when true, it disables Delta fallback and only uses existing local/Azure cached parquets.
  - `wayve/ai/si/configs/parking/parking_config.py` sets `parquet_cache_only=True` for `ZakExperimentalDataModuleCfg`.
- Resulting behavior:
  - Existing cached parquets still load from local cache or Azure `single-run-parquets`.
  - Missing cached parquets return `None` and are skipped by Zak's loader instead of being regenerated from Delta tables.
  - This keeps the branch aligned with "use Zak's latest cached parquets" and prevents accidental expensive parquet creation during training.
- Verification:
  - `bazel test //wayve/ai/si/datamodules:test_zak_experimental` passed.
  - `bazel test //wayve/ai/si:test_config_py_test_test_configs_utils_parking_release_2026_5_21_config_resolves` passed.

## 2026-06-04 Cached-Parquet 0.25 Remote Dispatch

- Committed and pushed branch `boris/zak_datamodule_parking_cherrypick`:
  - Commit: `fd04bc5c9ed5035f9cc30d7b395d432c68fcf92a` (`fix: use cached Zak parquets for parking training`).
  - Image: `wayvetraining.azurecr.io/scaled-intelligence:fd04bc5c9ed5035f9cc30d7b395d432c68fcf92a`.
- Submitted cached-parquet Zak datamodule training with:
  - Mode: `parking_bc_train_zak_mcv_new_phase2_release_2026_5_21`.
  - `num_steps=80000`, `num_gpus=32`, 4 H100 AKS nodes.
  - `datamodule.train_parquet_fraction=0.25`, `datamodule.val_parquet_fraction=0.25`.
  - `ZakExperimentalDataModuleCfg.parquet_cache_only=True`.
- Run ledger:
  - Job `174468` / session `session_2026_06_04_12_25_26_zcache25`: first submission accidentally omitted explicit priority, landed as `P3` at queue position 76, and was cancelled before start with reason `Incorrect configuration`.
  - Job `174469` / session `session_2026_06_04_12_29_17_zcache25`: resubmitted with explicit `--priority P1`, nickname `omnivorous-firefly-plum`, final observed state `Running`.
- Links:
  - W&B: `https://wandb.ai/wayve-ai/parking_bc/runs/session_2026_06_04_12_29_17_zcache25`.
  - Datadog logs: `https://app.datadoghq.eu/logs?query=job_name%3Aomnivorous-firefly-plum-174469&from_ts=1779366785871&cols=job_name%2Cnode_rank&live=true`.
  - Efficiency dashboard: `https://app.datadoghq.eu/dashboard/6eg-vtz-9d5?fromUser=true&refresh_mode=paused&tpl_var_job_name=omnivorous-firefly-plum-174469%2A&from_ts=1779971585871&to_ts=1780576385871&live=false`.
