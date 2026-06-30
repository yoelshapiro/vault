# Agents Change Log

## 2026-06-30 - Accelerate From Stopped Flyte Three Models

- Topic: Run Parking/PUDO accelerate-from-stopped Flyte development evaluations for `substantial-teal-cobra`, `magenta-watchful-ostrich`, and `chameleon-sarcastic-silver` with Denis controller source.
- Labels: parking, pudo, av-test, flyte, accelerate-from-stopped, denis-controller.
- Branch: detached `origin/denis/pudo-start-stop-threshold@73ff920e58d9ff9deb6e125ff1559c7d02ee1140` in `/tmp/WayveCode-denis-pudo-start-stop-threshold`.
- PR: none.
- Change type: Evaluation run / Flyte execution / result aggregation.
- Areas: `wayve/services/av_test_pipeline/evaluation_methods/accelerate_from_stopped/timestamp`; Flyte development workflow `accelerate-from-stopped-timestamp-shadow`; scenario collection `5700`.
- Changes:
  - Reused the branch-built Denis Flyte workflow `accelerate-from-stopped-timestamp-shadow@borisindel-tmp-build-382674be4fb7-73ff920e58d9ff9deb6e125ff1559c7d02ee1140_vylv0`.
  - Launched `substantial-teal-cobra` checkpoint `10` on 598 available-inference items as 3 Flyte batches; all succeeded and produced result table suffix `967c8733`.
  - Launched `magenta-watchful-ostrich` checkpoint `10` on 598 available-inference items as 3 Flyte batches; all succeeded and produced result table suffix `81625f1f`.
  - Launched `chameleon-sarcastic-silver` checkpoint `1` on 597 available-inference items as 3 Flyte batches; all failed before writing results with `ValueError: combine_waypoints_and_vehicle_states: No valid segments remain after validation`.
  - Aggregated successful results: magenta row pass rate `57.469%` with 276 all-pass segments; substantial row pass rate `53.294%` with 247 all-pass segments over the common 597 segment set.
- Task note: [[agent_tasks/2026/06/Week-5/2026-06-30-accelerate-from-stopped-flyte-three-models|2026-06-30 Accelerate From Stopped Flyte Three Models]]

## 2026-06-29 - Accelerate From Stopped Flyte Three Models

- Topic: Run Parking/PUDO accelerate-from-stopped Flyte development evaluations for three new model checkpoints with Denis controller source.
- Labels: parking, pudo, av-test, flyte, accelerate-from-stopped, denis-controller.
- Branch: detached `origin/denis/pudo-start-stop-threshold@73ff920e58d9ff9deb6e125ff1559c7d02ee1140` in `/tmp/WayveCode-denis-pudo-start-stop-threshold`.
- PR: none.
- Change type: Evaluation run / Flyte workflow registration / run ledger.
- Areas: `wayve/services/av_test_pipeline/evaluation_methods/accelerate_from_stopped/timestamp`; Flyte development workflow `accelerate-from-stopped-timestamp-shadow`; scenario collection `5700`.
- Changes:
  - Registered the Denis-branch accelerate-from-stopped timestamp workflow as `accelerate-from-stopped-timestamp-shadow@borisindel-tmp-build-382674be4fb7-73ff920e58d9ff9deb6e125ff1559c7d02ee1140_vylv0`.
  - Launched `harlequin-parrot-energetic` checkpoint `10` on 598 available-inference items as 3 Flyte batches: `av26zgrhbhbk6lxld6vk`, `a2hq2fhm9bghb2mpxn7r`, and `ajtzxkhttdw52r7b5qpv`.
  - Checked the three harlequin batch executions after completion; all reached `SUCCEEDED`.
  - Queried the harlequin result Delta path: 6,132 rows across 597 evaluated segment names / inference items, 3,790 pass rows, 2,342 fail rows, row pass rate `61.807%`, and strict segment outcomes of 313 all-pass / 176 all-fail / 108 mixed.
  - Found one hidden retry in batch 2: `load_openloop_sim_driving_plans_task` attempt `a2hq2fhm9bghb2mpxn7r-n0-0` exited 137, then retry attempt `a2hq2fhm9bghb2mpxn7r-n0-1` succeeded.
  - Attempted `substantial-teal-cobra` and `magenta-watchful-ostrich` checkpoint `10`; both had zero runnable items because all 1,722 scenario segments were missing inference, so no Flyte batches were submitted.
- Task note: [[agent_tasks/2026/06/Week-5/2026-06-29-accelerate-from-stopped-flyte-three-models|2026-06-29 Accelerate From Stopped Flyte Three Models]]

## 2026-06-28 - Teal Zak Warmup Zero Init Training Monitor

- Topic: Monitor Teal Zak-style warmup / near-zero adaptor init Parking/PUDO training to the 1K-step gate and update the model card.
- Labels: parking, pudo, training, surfboard, wandb, notion, retry.
- Branch: `boris/parking-past30-no-standstill-gear-aug/teal_zak_warmup_zero_init`.
- PR: none.
- Change type: Training monitoring / retry handling / model-card update.
- Areas: Surfboard jobs `185913`, `185915`; W&B runs `session_2026_06_28_21_29_00_zkwrm50p1`, `session_2026_06_28_21_37_03_zkwrm50p1`; Parking/PUDO model-card table.
- Changes:
  - Diagnosed initial job `185913` failing before training with `AttributeError: 'str' object has no attribute 'log_datapipe_stat_interval'`.
  - Retried as job `185915` using `+datamodule=parking_bc_datamodule` instead of `datamodule=parking_bc_datamodule`.
  - Monitored retry `185915` to W&B `trainer/global_step=1078` while Surfboard still reported `Running`.
  - Created the Parking/PUDO model-card row for `substantial-teal-cobra (not interleaved)` with status `Training`.
- Task note: [[agent_tasks/2026/06/Week-4/2026-06-28-teal-zak-warmup-zero-init-training-monitor|2026-06-28 Teal Zak Warmup Zero Init Training Monitor]]

## 2026-06-28 - Teal March WFM G50 Training Monitor

- Topic: Monitor March/FEB WFM Parking/PUDO training with 50% gear token dropout to the 1K-step gate and update the model card.
- Labels: parking, pudo, training, surfboard, wandb, notion, retry.
- Branch: `boris/parking-past30-no-standstill-gear-aug/teal_march_wfm_g50`.
- PR: none.
- Change type: Training monitoring / retry handling / model-card update.
- Areas: Surfboard jobs `185914`, `185917`; W&B runs `session_2026_06_28_21_30_02_marwfm50p1`, `session_2026_06_28_21_38_07_marwfm50p2`; Parking/PUDO model-card table.
- Changes:
  - Diagnosed initial job `185914` failing before training with `AttributeError: 'str' object has no attribute 'log_datapipe_stat_interval'`.
  - Retried as job `185917` using `+datamodule=parking_bc_datamodule` instead of `datamodule=parking_bc_datamodule`.
  - Monitored retry `185917` to W&B `trainer/train_step=1064` while Surfboard still reported `Running`.
  - Created the Parking/PUDO model-card row for `harlequin-parrot-energetic (not interleaved)` with status `Training`.
- Task note: [[agent_tasks/2026/06/Week-4/2026-06-28-teal-march-wfm-g50-training-monitor|2026-06-28 Teal March WFM G50 Training Monitor]]

## 2026-06-28 - Teal/Fuchsia End-Route Hysteresis Redeploy

- Topic: Redeploy `teal-ecstatic-magpie` and `fuchsia-vampire-bat-jubilant` with parking interleave end-route hysteresis and end-route parking outputs enabled.
- Labels: parking, pudo, deploy, interleave-control, gear-latch, hazard-lights.
- Branch: detached historical worktrees at model training commits.
- PR: none.
- Change type: Deployment wrapper local change / model redeploy.
- Areas: `wayve/ai/zoo/deployment/deployment_wrapper.py`; `wayve/ai/inference/deployment/onnx_custom_layers/persistent_state.py`; Parking deploy; Console model upload.
- Changes:
  - Added parking interleave route hysteresis: switch to parking below `2.5e4`, release route handover at `3e4`, with speed handover unchanged.
  - Enabled `enable_end_of_route_hazard_lights` and `enable_end_of_route_gear_latch` by default in `ParkingDeploymentWrapperImpl`.
  - Fixed `PersistentStateBuffer.to_device()` TorchScript typing by making it side-effect-only.
  - Deployed checkpoint `100000` for both source sessions with temporal caching, interleave control, and group `parking`.
  - Uploaded Console sessions `session_2026_06_27_21_39_49_noaug75c05__teal-ecstatic-magpie_interleave_control_eor_hysteresis_latches_v1` and `session_2026_06_27_21_58_32_nostaug0__fuchsia-vampire-bat-jubilant_interleave_control_eor_hysteresis_latches_v1`.
- Task note: [[agent_tasks/2026/06/Week-4/2026-06-28-teal-fuchsia-end-route-hysteresis-redeploy|2026-06-28 Teal/Fuchsia End-Route Hysteresis Redeploy]]

## 2026-06-28 - Parking Lifecycle Dashboard Phase 2c

- Topic: Unified experiment-create form, configurable refresh, controller preset, and a richer dependency chart for the parking lifecycle dashboard.
- Labels: parking, pudo, tooling, dashboard, dependency-chart, controller, on-road-experiments.
- Branch: `boris/parking-lifecycle-dashboard` (commits `8790095f9329` + `44942b4041f1`, pushed; no PR). Running on :3007.
- Change type: Feature iteration of an internal tool.
- Areas: `wayve/ai/parking/tools/lifecycle_dashboard/` (lifecycle.py, app.py, config.py, templates/, static/).
- Changes:
  - Auto-refresh interval selector (off/30s/1m/5m/30m), default 30m; poller default cadence 30m.
  - Controller chooser = default / `prod@rawnam-robotaxi-pudo-v1abi-shim-12.3.1` / custom (open text); preset encoded as name@version.
  - Unified experiment creation into one shared modal form (geo + optional driving [default `anteater-harlequin-colorful`] + optional extra parking for licensing + controller for run), used identically from the overview table and the model page. Added a "Run exp" table column. Default note text "PUDO model".
  - Dependency chart: date-span filter (default 1 month) + more connections — resolve parents against the full polled set (out-of-window parents pulled in as external nodes) and add same-branch sequential "branch" fallback edges when no git-diff commit parent matches. Live: 49 nodes / 32 edges (2 fork, 15 branch, 15 interleave) at default span. Curated Notion-only lineage edges still not reproduced.
  - `bazel test ...:all` green; live smoke verified dependency edge breakdown + controller preset + note default.
- Task note: [[agent_tasks/2026/06/Week-4/2026-06-28-parking-lifecycle-dashboard-phase2|Phase 2 note]] (2b/2c appended).

## 2026-06-28 - Parking Lifecycle Dashboard Phase 2b

- Topic: Dependency chart, settable controller, create-note, and clickable overview write actions for the parking lifecycle dashboard.
- Labels: parking, pudo, tooling, dashboard, model-catalogue, dependency-chart, controller, on-road-experiments.
- Branch: `boris/parking-lifecycle-dashboard` (commit `807c473cd771`, pushed; no PR).
- Change type: Feature iteration of an internal tool.
- Areas: `wayve/ai/parking/tools/lifecycle_dashboard/` (lifecycle.py, clients/writes.py, app.py, poller.py, store/, templates/, static/).
- Changes:
  - Replaced the lineage-API DAG tab with a parking **Model Dependency Chart** (Mermaid) built from `metadata.run_command`: git-diff parent-commit "fork" edges + deploy "interleave" source edges + decoded short descriptions. Removed `/v2/model/{id}/lineage` plumbing + lineage store table.
  - On-road create switched to the **internal** `POST /v2/on_road_experiments` so a per-branch **controller** can be set (public endpoint rejects controllers); added a controller chooser (default/prod/prod_tunable/ddp/wdcr/custom+version) applied to all branches; branches now carry `branch_type`.
  - **Create model-change note** (`POST /v2/model/{id}/note`, Entra bearer) from clicking the note ✗ in the overview table.
  - Overview table interactive: click note ✗ / "missing" Model CI badge / missing geo chip → matching write flow with confirm + payload preview (shared modal in base.html).
  - Calendar gained a date-range filter (default last 3 weeks); Model column width-capped with ellipsis.
  - `bazel test ...:all` green; live smoke confirmed dependency fork chain (plum→coral→…), note/controller previews, no real writes; running on :3007.
- Task note: [[agent_tasks/2026/06/Week-4/2026-06-28-parking-lifecycle-dashboard-phase2|Phase 2 note]] (phase-2b appended).

## 2026-06-28 - Parking Lifecycle Dashboard Phase 2

- Topic: Extend the parking model lifecycle dashboard — date-range lookup, split Model-CI vs per-geo licensing, gated write actions, runs calendar, and a lineage tab.
- Labels: parking, pudo, tooling, dashboard, model-catalogue, model-ci, on-road-experiments, lineage.
- Branch: `boris/parking-lifecycle-dashboard` (commit `5879cf6afb2c`, pushed to origin; no PR yet).
- Change type: Feature expansion of an internal tool (reads + gated writes).
- Areas: `wayve/ai/parking/tools/lifecycle_dashboard/` (clients/, lifecycle.py, poller.py, store/, app.py, templates/, static/).
- Changes:
  - Overview date-range lookup (default last 3 weeks); `model_date` parsed from session id.
  - Split status: Model CI (per gen2 artefact via `…/modelci_builds`) + per-geo licensing UK/US/JPN/DEU (via `…/on_road_experiments?model_session_id=&checkpoint_num=&artefact_id=`, 'licens' heuristic, completed=passed) with experiment links.
  - Write actions (confirm + payload preview, ENABLE_WRITES, Entra bearer): trigger Model CI (anon `POST /v2/model/artefact/{id}/modelci`); create run + per-geo licensing experiments (`POST /v1/public/on_road_experiments`). Public API forbids per-branch controller → UI shows it disabled (flagged).
  - Calendar tab (runs/day across the user's models) and Lineage tab (merged WFM→BC→RL DAG via `/v2/model/{id}/lineage`, resolved once per new session, SVG render).
  - `bazel test ...:all` green (py_test, ruff, flake8, ty, eslint); live smoke incl. write previews resolving real themes/templates with no real writes; server running on :3007.
- Task note: [[agent_tasks/2026/06/Week-4/2026-06-28-parking-lifecycle-dashboard-phase2|2026-06-28 Parking Lifecycle Dashboard — Phase 2]]

## 2026-06-28 - Parking Accelerate From Stopped Skill

- Topic: Add a ParkingSkills child skill for Denis-controller PUDO/UnPUDO accelerate-from-stopped evaluations.
- Labels: parking, pudo, skills, eval-studio, flyte, accelerate-from-stopped.
- Branch: none.
- PR: none.
- Change type: Skill/workflow documentation.
- Areas: `skills/parking_model_lifecycle/parking-accelerate-from-stopped/`; `skills/parking_model_lifecycle/SKILL.md`.
- Changes:
  - Created `$parking-accelerate-from-stopped` with default scenario collection/version and Denis branch context.
  - Documented the preferred branch-built Flyte development workflow via `make run-dev`.
  - Kept the old `make run-simulation` plus local `run local` flow as a fallback/reproduction path.
  - Updated `$parking-model-lifecycle` routing to hand accelerate-from-stopped requests to the new child skill.
- Task note: [[agent_tasks/2026/06/Week-4/2026-06-28-parking-accelerate-from-stopped-skill|2026-06-28 Parking Accelerate From Stopped Skill]]

## 2026-06-28 - Parking Model Lifecycle Dashboard

- Topic: New per-user web tool showing all recent models and their parking lifecycle stage/status (training → trained → licensed → on-road).
- Labels: parking, pudo, tooling, dashboard, fastapi, model-catalogue, lifecycle.
- Branch: `boris/parking-lifecycle-dashboard` (worktree off `origin/main`).
- PR: none.
- Change type: New internal tool (read/monitor first).
- Areas: `wayve/ai/parking/tools/lifecycle_dashboard/` (new, 22 files).
- Changes:
  - FastAPI + Jinja2 + vanilla JS tool (mirrors `event_clip_viewer`), background asyncio poller into a SQLite snapshot the UI reads.
  - Pure `lifecycle.py`: stage derivation + license status (missing/waiting/finished/revoked) + commit/branch/W&B/BC-RL extraction; thin Model Catalogue I/O client; per-source errors surfaced, never faked.
  - Overview (per-user model table with stage/note/license/commit) + per-model detail (training, trained/note, licensing, on-road runs with Console/Foxglove/logs, redeploy commit+branch). No redeploy in-tool by design.
  - Resolved Phase-0 spikes via `/v2/models/list`, `/v3/model/{id}`, `/notes`, `/{ckpt}/{licenses,license_logs,runs}`; author handle = email local-part.
  - `bazel test ...:all` green (py_test, ruff, flake8, ty, eslint); live smoke against Model Catalogue fetched 6 of Boris's models in ~8s with zero source errors and correct commits/branches/stages.
- Task note: [[agent_tasks/2026/06/Week-4/2026-06-28-parking-lifecycle-dashboard|2026-06-28 Parking Model Lifecycle Dashboard]]

## 2026-06-28 - Aquamarine Gear Latch Redeploy

- Topic: Redeploy `aquamarine-quizzical-kingfisher` with parking end-of-route hazard lights and gear latch enabled.
- Labels: parking, pudo, deploy, gear-latch, hazard-lights.
- Branch: `boris/redeploy-aquamarine-gear-latch`.
- PR: none.
- Change type: Deployment wrapper default change / model redeploy.
- Areas: `wayve/ai/zoo/deployment/deployment_wrapper.py`; Parking deploy; Console model upload.
- Changes:
  - Checked out the `aquamarine-quizzical-kingfisher` training commit `7d3b356add696f8499d71bf0e6f6221229393bf9` in a separate worktree.
  - Set `enable_end_of_route_hazard_lights=True` and `enable_end_of_route_gear_latch=True` in `ParkingDeploymentWrapperImpl`.
  - Committed and pushed `fc28134404d8` on `boris/redeploy-aquamarine-gear-latch`.
  - Deployed checkpoint `100000` with temporal caching and parking interleave control.
  - Uploaded deployed model `magnetic-songbird-aquamarine`.
- Task note: [[agent_tasks/2026/06/Week-4/2026-06-28-aquamarine-gear-latch-redeploy|2026-06-28 Aquamarine Gear Latch Redeploy]]

## 2026-06-27 - Acrobatic No-Aug Gear75 Training

- Topic: Dispatch a Parking/PUDO training variant from `acrobatic-rose-cobra` with generic gear augmentation disabled and stronger gated standstill gear augmentation.
- Labels: parking, pudo, training, gear-augmentation, surfboard.
- Branch: `boris/parking-past30-no-standstill-gear-aug/acrobatic-no-aug-gear75`.
- PR: none.
- Change type: Training config / deployment defaults / Surfboard submission.
- Areas: `wayve/ai/si/configs/parking/parking_config.py`; `wayve/ai/si/datamodules/parking.py`; `wayve/ai/zoo/deployment/deployment_wrapper.py`; Surfboard job `185617`.
- Changes:
  - Forked from the `acrobatic-rose-cobra` commit and disabled `augment_gear_direction`.
  - Added config knobs for standstill gear augmentation probability and neutral-clamp gating, then set `augment_standstill_gear_prob=0.75` and `enable_clamp_policy_at_first_neutral=False`.
  - Set parked-unparking augmentation to `0.5/0.5` and updated the requested PUDO/UnPUDO bucket weights.
  - Disabled parking end-of-route hazard-light and gear-latch deployment defaults.
  - Submitted P1 training job `185617`, session `session_2026_06_27_21_39_49_noaug75c05`, and delegated monitoring to 1K steps.
  - Added a second ablation branch `boris/parking-past30-no-standstill-gear-aug/acrobatic-no-standstill-aug` with `enable_augment_standstill_gear=False`, `parked_unparking_prob=0.0`, and `unparking_gear_augment_prob=0.0`.
  - Verified the second ablation with the parking config resolve test, submitted P1 training job `185618`, session `session_2026_06_27_21_58_32_nostaug0`, and delegated monitoring to 1K steps.
  - Monitored job `185618` to W&B `trainer/global_step=1057` with zero retries, created the Parking/PUDO model-card row, and sent Boris the Slack update.
- Task note: [[agent_tasks/2026/06/Week-4/2026-06-27-acrobatic-no-aug-gear75-training|2026-06-27 Acrobatic No-Aug Gear75 Training]]

## 2026-06-25 - Port Augment Standstill Gear Fix

- Topic: Port the gated parking standstill gear augmentation fix into the Scarlet root-jitter G50 training branch.
- Labels: parking, pudo, datamodule, gear-augmentation.
- Branch: `boris/parking-past30-no-standstill-gear-aug/scarlet_full_gear_root_jitter_g50`.
- PR: none.
- Change type: Datamodule fix / unit test update.
- Areas: `wayve/ai/si/datamodules/parking.py`; `wayve/ai/si/datamodules/test/test_parking_unit.py`.
- Changes:
  - Ported source commit `92b6a52f4f5f` because the named branch tip still showed the older random standstill gear augmentation.
  - Changed `augment_standstill_gear` to apply a 50% gated input-gear change only when the policy gear target indicates an actual gear transition.
  - Added focused tests for parking previous-moving-gear, probability skip, parking no-op, unparking neutral input, and non-parking no-op behavior.
- Task note: [[agent_tasks/2026/06/Week-4/2026-06-25-port-augment-standstill-gear-fix]]

## 2026-06-25 - Scarlet Root Jitter G50 Training

- Topic: Create and dispatch a 50% gear-direction token dropout variant from the Scarlet full-gear root-jitter Parking/PUDO branch.
- Labels: parking, pudo, training, gear-dropout, surfboard.
- Branch: `boris/parking-past30-no-standstill-gear-aug/scarlet_full_gear_root_jitter_g50`.
- PR: none.
- Change type: Training config / image publish / Surfboard submission.
- Areas: `wayve/ai/si/configs/parking/parking_config.py`; `wayve/ai/zoo/st/input_adaptors`; `wayve/ai/zoo/st/models.py`; Surfboard job `184444`.
- Changes:
  - Forked the Lorentz-fixed scarlet root-jitter branch at `ea03fa86fb72` and added 50% gear-direction token dropout without pulling in the staged LR experiment.
  - Verified `bazel test //wayve/ai/zoo/st:test_st` and `bazel test //wayve/ai/si:test_config_py_test_test_configs_utils_parking_release_2026_5_21_config_resolves`.
  - Committed and pushed `df2b887a2bad`, published `wayvetraining.azurecr.io/scaled-intelligence:df2b887a2bad07dda31863dca920272eb57b97b1`, and submitted P1 training job `184444` (`coral-elaborate-chipmunk`) with session `session_2026_06_25_09_10_01_fgjitg50`.
  - Follow-up commit `949bb24ae3d4` added the gated standstill gear augmentation fix, enabled it in parking config, adjusted PUDO gear/pre-start weights, published `wayvetraining.azurecr.io/scaled-intelligence:949bb24ae3d485c2b35fb436f00d407139211761`, and submitted P1 training job `184565` (`acrobatic-rose-cobra`) with session `session_2026_06_25_12_30_21_fgjitg50af`.
- Task note: [[agent_tasks/2026/06/Week-4/2026-06-25-scarlet-root-jitter-g50-training]]

## 2026-06-25 - Safe/Unsafe HARI Databricks Upload

- Topic: Aggregate a HARI OpenLABEL safe/unsafe export into a Databricks-ready table and attempt upload to `hive_metastore.parking.safe_unsafe_hari_annotations`.
- Labels: parking, hari, databricks, openlabel, annotations.
- Branch: `codex/preserve-dirty-main-cherrypick-generic-data`.
- PR: none.
- Change type: Tooling / data aggregation / Databricks upload attempt.
- Areas: `wayve/ai/parking/classifiers/`; `/home/borisindelman/Downloads/olf_export_pilot_2026-06-24T12_16_36.095814+00_00.zip`; `/tmp/safe_unsafe_hari_annotations.csv`; `hive_metastore.parking.safe_unsafe_hari_annotations`.
- Changes:
  - Added a Bazel-run parser/uploader for the HARI export under `wayve/ai/parking/classifiers/` with regression tests around the OpenLABEL sample shape and category mapping.
  - Extracted 100 JSON files and wrote 100 rows to `/tmp/safe_unsafe_hari_annotations.csv`; category counts were 68 `[1]`, 31 `[2]`, and 1 `[1, 2]`.
  - Added safe Databricks upload modes: `create`, `replace`, and `append`, with explicit ADLS location support and optional key-vault auth.
  - Verified `bazel test //wayve/ai/parking/classifiers/...`.
  - Upload was blocked by Databricks permissions: no schema create on catalog, DBFS root disabled for managed Hive tables, no `SELECT ON ANY FILE` for the explicit ADLS location, and the shared-cluster service principal received HTTP 403 opening the SQL warehouse.
  - Submitted a one-off Databricks notebook run on cluster `0624-170917-6yh5w7tu`, which successfully created `hive_metastore.parking.safe_unsafe_hari_annotations` at the ADLS Delta location and loaded 100 rows; verified count and category distribution by SQL readback.
- Task note: [[agent_tasks/2026/06/Week-4/2026-06-25-safe-unsafe-hari-databricks-upload]]

## 2026-06-24 - Scarlet Root Jitter Training Retry

- Topic: Monitor the Scarlet full-gear root-jitter Parking/PUDO training run, fix the step-0 PUDO root failure, and resubmit.
- Labels: parking, pudo, training, surfboard, wandb, retry.
- Branch: `boris/parking-past30-no-standstill-gear-aug/scarlet_full_gear_root_jitter`.
- PR: none.
- Change type: Training monitoring / config fix / retry handling.
- Areas: `wayve/ai/si/configs/parking/parking_config.py`; Surfboard jobs `184193`, `184196`; W&B runs `session_2026_06_24_20_46_10_fgjit700`, `session_2026_06_24_21_04_24_fgjit7r1`; `/tmp/scarlet_full_gear_root_jitter`.
- Changes:
  - Diagnosed job `184193` failing before step 1 from `No parquet files found` under the new `parking_pudo_default_indicator_start_700_20260623__2026-06-23-19-25` PUDO materialization root; the visible `ConnectionResetError` was downstream of the prefetch failure.
  - Added the missing `/dataset` suffix to `PUDO_BUCKETS_ROOT`, keeping the branch's new PUDO root and route-jitter variant intact.
  - Verified `git diff --check`, `bazel build //wayve/ai/si:si`, and `bazel test //wayve/ai/si:test_config_py_test_test_configs_utils_parking_release_2026_5_21_config_resolves`.
  - Committed and pushed `ea03fa86fb72`, published `wayvetraining.azurecr.io/scaled-intelligence:ea03fa86fb72ce0f10668bc29a3453d09ee9760e`, and submitted retry job `184196` (`plum-hatchetfish-satisfied`) with session `session_2026_06_24_21_04_24_fgjit7r1`.
  - Monitored retry job `184196` to W&B `trainer/global_step=1039` with Surfboard still `Running`, then created the Parking/PUDO model-card row.
- Task note: [[agent_tasks/2026/06/Week-4/2026-06-24-scarlet-root-jitter-training-retry]]

## 2026-06-24 - Scarlet Root Jitter Variant

- Topic: Prepare a scarlet-source Parking/PUDO training variant with the new indicator-start materialization root and parking-only route-shortening jitter.
- Labels: parking, pudo, route-shortening, augmentation, training.
- Branch: `boris/parking-past30-no-standstill-gear-aug/scarlet_full_gear_root_jitter`.
- PR: none.
- Change type: Training config / datapipe augmentation.
- Areas: `wayve/ai/si/configs/parking/parking_config.py`; `wayve/ai/si/datamodules/parking.py`; `wayve/ai/si/datamodules/otf.py`; `wayve/ai/lib/data/pipes/routes.py`; route-map tests.
- Changes:
  - Switched the PUDO buckets root to the `parking_pudo_default_indicator_start_700_20260623__2026-06-23-19-25` materialization.
  - Added `route_shortening_jitter_m=30.0` and plumbed it into route-map options only when parking route shortening is enabled.
  - Added metre-based route stop jitter that is applied for `parking_mode` only, leaving unparking shortening exact.
  - Added focused route-map tests; Bazel execution was blocked by `No space left on device` while extracting external Python wheels.
  - Pushed commit `97d124ff5461`, published the matching training image, and submitted P1 training job `184193` (`avid-seahorse-aquamarine`) with session `session_2026_06_24_20_46_10_fgjit700`.
  - Delegated 1K-step monitoring and up to 3 fix/resubmit retries to the Lorentz subagent.
- Task note: [[agent_tasks/2026/06/Week-4/2026-06-24-scarlet-root-jitter-variant]]

## 2026-06-24 - Parking Generic Data Aug Training Retry

- Topic: Monitor retry `chocolate-snowy-owl-astonishing` until it passes the 1K-step gate, with fix/resubmit handling if it fails.
- Labels: parking, pudo, training, surfboard, wandb, retry.
- Branch: `boris/parking-past30-no-standstill-gear-aug/main_cherrypick_generic_data_aug_fixes`.
- PR: none.
- Change type: Training monitoring / retry handling.
- Areas: Surfboard jobs `184174`, `184180`; W&B runs `session_2026_06_24_20_03_22_g50lr5k2`, `session_2026_06_24_20_21_51_g50lr5k3`; `/tmp/main_cherrypick_generic_data_aug_fixes`; Parking/PUDO model-card table.
- Changes:
  - Diagnosed job `184174` failing at step 0 from a TorchScript type error in adaptor dropout: `base_mask` was inferred as `NoneType` before Tensor assignment.
  - Added the minimal `Optional[Tensor]` fix and scripted `RouteSTAdaptor` regression, verified `bazel test //wayve/ai/zoo/st:test_st`, committed and pushed `7d3b356add696f8499d71bf0e6f6221229393bf9`.
  - Published `wayvetraining.azurecr.io/scaled-intelligence:7d3b356add696f8499d71bf0e6f6221229393bf9` and resubmitted retry job `184180` (`aquamarine-quizzical-kingfisher`, session `session_2026_06_24_20_21_51_g50lr5k3`).
  - Monitored retry job `184180` to W&B `trainer/global_step=1112` with Surfboard still `Running`, sent Slack updates to Boris, and created the Parking/PUDO model-card row.
- Task note: [[agent_tasks/2026/06/Week-4/2026-06-24-parking-generic-data-aug-training-retry]]

## 2026-06-24 - Parking Generic Data Aug Fixes

- Topic: Fork the scarlet Parking/PUDO source commit and prepare 50% gear token-dropout plus staged input-adaptor LR changes.
- Labels: parking, pudo, training, augmentation, learning-rate, deployment.
- Branch: `boris/parking-past30-no-standstill-gear-aug/main_cherrypick_generic_data_aug_fixes`.
- PR: none.
- Change type: Training config / model wiring / deployment default update.
- Areas: `wayve/ai/si/configs/parking/parking_config.py`; `wayve/ai/si/models/training.py`; `wayve/ai/zoo/st/input_adaptors`; `wayve/ai/zoo/st/models.py`; `wayve/ai/zoo/deployment/deployment_wrapper.py`.
- Changes:
  - Created the aug-fixes branch at scarlet source commit `ce77a3fe2467` and reset `main_cherrypick_generic_data` locally to the same commit.
  - Added train-only token dropout for gear direction and configured `parking_bc_train_release_2026_5_11` to use 50% gear token dropout.
  - Added a temporary `parking_input_adaptors` LR group that runs at `1e-4` for 5k steps and scales back to `1e-5`.
  - Disabled default end-of-route hazard lights and gear latch in `ParkingDeploymentWrapperImpl`.
  - Added deterministic adaptor regression tests and verified the focused pytest plus ruff, flake8, and ty checks with `TMPDIR=/workspace/tmp`.
  - Pushed commit `cae7fb21c8bc` and submitted P1 H100 training job `184160` (`feisty-orange-eel`) with session `session_2026_06_24_19_35_50_g50lr5k`.
  - Fixed the step-0 failure from Lightning scheduler API validation by making `_PostBoostLRScheduler` a PyTorch `LRScheduler` and adding scheduler API regression coverage.
- Task note: [[agent_tasks/2026/06/Week-4/2026-06-24-parking-generic-data-aug-fixes]]

## 2026-06-22 - SI Group Interleave Control Support

- Topic: Add SI interleave-control output and group support on top of the default-gear deployment branch.
- Labels: si, deployment, parking, interleave, dmi, regression-test.
- Branch: `06-22-si-group-interleave-control-support`.
- PR: https://github.com/wayveai/WayveCode/pull/120390
- Change type: Deployment wrapper output / config update.
- Areas: `wayve/ai/si/deploy.py`; `wayve/ai/si/models/deployment.py`; `wayve/ai/si/models/training.py`; `wayve/ai/si/models/offline_rl.py`; `wayve/ai/si/offline_rl/bc_rl_combined.py`; `wayve/ai/si/test/models/test_training.py`; `wayve/ai/si/test/models/test_offline_rl.py`; `wayve/ai/zoo/deployment/deployment_wrapper.py`; `wayve/ai/zoo/deployment/deployment_wrapper_codegen.py`; `wayve/ai/zoo/deployment/test/test_deployment_wrapper_codegen.py`.
- Changes:
  - Added `enable_interleave_control=True` defaults to BC, TD3 offline-RL, BC+TD3 offline-RL, and deploy paths.
  - Set `DeploymentConfig.interleave_group="parking"` for parking deployments when interleave control is enabled.
  - Set `model.interleave_control_group` and added generated-wrapper support for the default `interleave_control` output tensor.
  - Added parking handover logic and baseline DRIVE-gear gating using the default gear output.
  - Avoided PR 102398 waypoint handling, behavior customization, and driving-control changes.
  - Added focused tests for wrapper output inference, parking handover logic, parking group defaults, offline-RL forwarding, and disabling interleave control.
  - Fixed deployment model matching for bool outputs such as `interleave_control` by comparing with exact equality instead of numeric diff math.
  - Added regression tests for bool output matching/mismatch and verified `//wayve/ai/lib:test_deploy`.
  - Pushed amended PR commit `ec7f3d5f9af2`; fresh Buildkite presubmit `515296` is still running.
- Task note: [[agent_tasks/2026/06/Week-4/2026-06-22-si-group-interleave-control-support]]

## 2026-06-22 - Interleaved Wrapper Gear Output CI Fix

- Topic: Preserve `policy_gear_position` through deployment wrappers and unblock non-parking shift-by-wire forwarding.
- Labels: deployment, interleaved-wrapper, gear, shift-by-wire, ci, regression-test.
- Branch: `boris/deployment-wrapper-default-gear`.
- PR: https://github.com/wayveai/WayveCode/pull/120234
- Change type: Bug fix.
- Areas: `wayve/ai/zoo/deployment/interleaved_wrapper.py`; `wayve/ai/zoo/deployment/behavior_customization.py`; `wayve/ai/zoo/deployment/test/test_interleaved_wrapper.py`; `wayve/ai/si/test/interfaces/test_deployment_wrapper.py`.
- Changes:
  - Added `policy_gear_position` to `InterleavedDrivingOutput`.
  - Cached and returned gear position in warmup, cache-reuse, and normal output paths.
  - Added focused assertions covering warmup and cache reuse so gear cannot be silently dropped.
  - Treated non-parking `ENABLE_SHIFT_BY_WIRE` as a no-op behavior control so wrappers can forward and emit default DRIVE gear.
  - Added eager and TorchScript prepare-to-forward regression coverage for non-parking shift-by-wire.
  - Verified focused interleaved, SI deployment wrapper, and zoo deployment Bazel tests.
- Task note: [[agent_tasks/2026/06/Week-4/2026-06-22-deployment-wrapper-gear-output-ci]]

## 2026-06-22 - Deployment Wrapper Default Gear Output

- Topic: Add a default DRIVE gear output to deployment wrappers that do not already emit gear.
- Labels: deployment, dmi, gear, waypoint-clamp, regression-test.
- Branch: `codex/deployment-wrapper-default-gear`.
- PR: none.
- Change type: Feature / deployment contract update.
- Areas: `wayve/ai/zoo/deployment/deployment_wrapper.py`; `wayve/ai/zoo/deployment/io.py`; `wayve/ai/si/models/deployment.py`; safety wrapper tuple consumers; deployment tests.
- Changes:
  - Added `policy_gear_position` to the common onboard driving output contract with a default `DRIVE_POSITION_V2_DRIVE` tensor when missing.
  - Replaced the base forward-only waypoint clamp with the shared gear-aware clamp and preserved parking wrapper gear behavior.
  - Threaded gear through kinematic, safety, speed-sign, TSR, ODD, and LSS custom output tuples plus direct test constructors.
  - Removed the stale non-parking shift-by-wire rejection now that non-parking wrappers emit default gear.
  - Verified deployment py_checks plus focused SI and safety wrapper tests.
- Task note: [[agent_tasks/2026/06/Week-4/2026-06-22-deployment-wrapper-default-gear]]

## 2026-06-22 - Merge Main Into PUDO Yellow Baseline

- Topic: Merge `origin/main` into the yellow Parking/PUDO baseline draft PR branch.
- Labels: parking, pudo, merge, main, pr.
- Branch: `boris/26-06-22-pudo-baseline`.
- PR: https://github.com/wayveai/WayveCode/pull/120214
- Change type: Merge / conflict resolution.
- Areas: `wayve/ai/si/configs/parking/parking_config.py`; `wayve/ai/si/models/training.py`; `wayve/ai/si/models/deployment.py`; `wayve/ai/zoo/deployment/behavior_customization.py`; route/OTF conflict paths.
- Changes:
  - Merged `origin/main` (`0804b83a6bd5`) into the baseline branch and committed merge `8cb57a562b0e`.
  - Preserved Parking/PUDO config, route-shortening, interleave deployment, and scheduler behavior from the branch while taking required main API/import changes.
  - Restored `INITIATE_AUTO_PARKING` behavior customization support after resolving the main-side unsupported-control test change.
  - Fixed sandbox-safe lazy `Session` handling in training callback configuration.
  - Verified focused zoo deployment and parking release config tests; focused callback tests pass but the filtered target fails its target-wide coverage threshold.
- Task note: [[agent_tasks/2026/06/Week-4/2026-06-22-merge-main-into-pudo-baseline]]

## 2026-06-22 - PUDO Yellow Baseline Draft PR

- Topic: Create a draft PR for the yellow Parking/PUDO baseline without later unified-LR training changes.
- Labels: parking, pudo, pr, baseline, model-catalogue.
- Branch: `boris/26-06-22-pudo-baseline`.
- PR: https://github.com/wayveai/WayveCode/pull/120214
- Change type: PR creation / branch curation.
- Areas: `wayve/ai/si/configs/parking/parking_config.py`; parking route-shortening and deployment-wrapper support; Parking/PUDO baseline branch history.
- Changes:
  - Resolved `yellow-cheetah-sparkling` to commit `b8703e56c2b7636b60da22e4d0d7e468f9f0217b`.
  - Created and pushed `boris/26-06-22-pudo-baseline` at the yellow commit.
  - Verified the later unified-LR change is excluded and opened draft PR `#120214` to `main`.
- Task note: [[agent_tasks/2026/06/Week-4/2026-06-22-pudo-yellow-baseline-draft-pr]]

## 2026-06-21 - Parking 5.11 Unified-LR Training Pair

- Topic: Submit and monitor two Parking/PUDO BC 5.11 training variants with unified learning rate.
- Labels: parking, pudo, training, surfboard, notion, learning-rate.
- Branch: `boris/training/main_cherrypick_generic_data`.
- PR: none.
- Change type: Training run / monitoring / documentation.
- Areas: `wayve/ai/si/configs/parking/parking_config.py`; Surfboard jobs `182491`, `182493`; Parking/PUDO Notion model cards.
- Changes:
  - Trained `salmon-multicolored-tapir` from commit `ce77a3fe2467` using `parking_bc_train_release_2026_5_11`, unified LR, and 50% driving / 50% PUDO-UNPUDO data.
  - Trained `red-cheetah-nonchalant` from commit `ad0508aa1cab` using the same mode and LR change with 0% driving / 100% PUDO-UNPUDO data.
  - Fixed the initial startup failure by adding the tele camera expected by `copy_tele_camera=True`.
  - Monitored both retry jobs past the 1K-step gate and created Notion model-card rows with descriptive short descriptions.
- Task note: [[agent_tasks/2026/06/Week-3/2026-06-21-parking-511-unified-lr-training-pair]]

## 2026-06-17 - Bokeh MIMOST Direct Inputs

- Topic: Fix ParkingPlotter `visualise_bokeh` inference dispatch and session-config OTF setup.
- Labels: parking, bokeh, visualisation, inference, otf, datamodule-config, regression-test.
- Branch: `boris/training/main_cherrypick_generic_data`.
- PR: none.
- Change type: Bug fix.
- Areas: `wayve/ai/si/visualisation/inference_model.py`; `wayve/ai/si/visualisation/inference_model_helpers.py`; `wayve/ai/si/visualisation/run_segment_picker.py`; `wayve/ai/si/visualisation/pack_model.py`; `wayve/ai/si/datamodules/otf.py`; `wayve/ai/lib/data/pipes/paths.py`; visualization tests.
- Changes:
  - Added signature-based detection for top-level models whose `forward` accepts a training-style `inputs` dict.
  - Routed MIMOST-style top-level models through `model(inputs)` before falling back to deployment-wrapper keyword adaptation.
  - Added helper and wrapper regression tests for the direct-input dispatch path.
  - Threaded session/package datamodule config into run-id OTF setup, filtered out training bucket/source fields, and kept the provided segment run/timestamps authoritative.
  - Added `--parking_datamodule` support for checked-in parking datamodule configs.
  - Supported multi-source odometry in run-id OTF and normalized numpy-array odometry-source values in `load_paths`.
  - Preserved integer/bool tensor dtypes in visualisation inference casting for categorical model inputs.
  - Verified `//wayve/ai/si:inference_debugger_py_checks`, focused `//wayve/ai/si:test_inference_model`, `//wayve/ai/si:test_pack_model`, `//wayve/ai/si:test_bokeh_visualise`, `//wayve/ai/si:test_run_segment_picker`, focused OTF/path-loader tests, and the reported `visualise_bokeh` session against `~/bokeh-outputs/test-codex-config-default-workers` (9 frames).
- Task note: [[agent_tasks/2026/06/Week-3/2026-06-17-bokeh-mimost-direct-inputs]]

## 2026-06-16 - PUDO BC pmprov Training and Retry

- Topic: Launch, debug, fix, and retry the PUDO BC training run from the generic-data branch.
- Labels: parking, pudo, training, surfboard, notion, dataloader.
- Branch: `boris/training/main_cherrypick_generic_data`.
- PR: none.
- Change type: Bug fix / training run / monitoring / documentation.
- Areas: `wayve/ai/lib/data/pipes/routes.py`; `wayve/ai/lib/test/data/pipes/test_generate_route_map.py`; Surfboard jobs `180668`, `180756`; Parking/PUDO Notion model cards.
- Changes:
  - Submitted `joyous-yellow-platypus` / `session_2026_06_16_21_48_57_pmprov` with `+mode=parking_bc_train_release_2026_5_21`, `+datamodule=pudo_bc_datamodule`, 4 H100 nodes, and `num_steps=100000`.
  - Monitored startup through distributed init, datamodule setup, first iteration, and W&B step reporting.
  - The original job later failed on a dataloader prefetch error in the parking route-shortening navigation path; the later NCCL timeout was downstream.
  - Fixed the navigation pybind boundary by casting `polyline_location_index` to `int` and the companion pybind inputs to explicit numeric types; added a regression assertion.
  - Verified targeted route-map tests and data-pipes lint, then pushed commit `4f306b5b8a90`.
  - Submitted retry `lime-wolverine-picturesque` / `session_2026_06_17_04_24_10_pmprov2`; confirmed W&B `trainer/global_step=1082`, passing the requested 1K-step retry gate.
  - The retry later failed at a second pybind boundary in `generate_route_map_from_config`; fixed `Mapper.setRouteLocation` by casting the route index to `int` and fraction to `float`, with regression coverage in `test_routes.py`.
  - Verified the focused AI Lib route-map test and lint, then pushed commit `300909d3f83f`.
  - Submitted third attempt `universal-pink-wrasse` / `session_2026_06_17_06_57_55_pmprov3`; confirmed W&B `trainer/global_step=1122`, passing the requested 1K-step retry gate.
  - Created Parking/PUDO Notion model-card rows with status `Training` and detailed run notes for the original, retry, and third-attempt runs.
- Task note: [[agent_tasks/2026/06/Week-3/2026-06-16-pudo-bc-pmprov-training|2026-06-16 PUDO BC pmprov training]]

## 2026-06-16 - Parking Mode Provenance Labels

- Topic: Record per-sample parking detector mode labels in training provenance without introducing `ParkingStage`.
- Labels: parking, pudo, datamodule, provenance, training.
- Branch: `boris/training/main_cherrypick_generic_data`.
- PR: none.
- Change type: Feature / data provenance.
- Areas: `wayve/ai/si/datamodules/parking.py`; `wayve/ai/lib/provenance.py`; `wayve/ai/zoo/data/keys.py`; related tests.
- Changes:
  - Added `parking_mode_gt`, `parked_mode_gt`, and `unparking_mode_gt` keys.
  - Wrote those labels from the final `ParkingModeResult` after parked-mode augmentation while preserving existing `PARKING_MODE` and `UNPARKING_MODE` model-input semantics.
  - Added the labels to the provenance batch whitelist and row extractor so they appear as parquet columns when present.
  - Added focused datamodule and provenance tests.
  - Verified `//wayve/ai/lib:test_provenance`, filtered parking-unit tests with `--no-cov`, and ruff lint targets for AI lib and SI datamodules.
- Task note: [[agent_tasks/2026/06/Week-3/2026-06-16-parking-mode-provenance-labels]]

## 2026-06-16 - Parking Pose NaN Output Shape

- Topic: Fix parking deployment wrapper output shape for missing `POLICY_PARKING_POSE`.
- Labels: parking, deployment, DMI, torchscript, regression-test.
- Branch: `boris/training/main_cherrypick_generic_data`.
- PR: none.
- Change type: Bug fix.
- Areas: `wayve/ai/zoo/deployment/deployment_wrapper.py`; `wayve/ai/si/test/interfaces/test_deployment_wrapper.py`.
- Changes:
  - Replaced the optional-none parking-pose output path with a shape-valid `[B, 1, 8]` float32 NaN fallback.
  - Promoted real `[B, 8]` parking pose model outputs to `[B, 1, 8]` for the DMI detensorizer contract.
  - Restored path-distance/position outputs with shape-valid `[B, 0]` no-op fallbacks for missing outputs and pass-through for real `[B, Fp]` tensors.
  - Added eager and TorchScript regression coverage for the missing-output case and eager coverage for real parking-pose/path outputs.
  - Redeployed `amaranth-kestrel-charming` as `adventurous-beaver-white` (`session_2026_06_11_20_44_02_gp8n100k4__amaranth-kestrel-charming_no_eor_latch_indicators_no_interleave_v2`) from pushed commit `0892f60b1ef6`; no interleave control; gen2 artefact `d75cc989-71ed-4c64-b70f-4562003add38`.
  - After DMI rejected zero-width `policy_path_distance`, removed the path-based outputs entirely and redeployed as `amber-llama-cautious` (`session_2026_06_11_20_44_02_gp8n100k4__amaranth-kestrel-charming_no_path_outputs_no_interleave_v1`) from pushed commit `12b4d67a`; gen2 artefact `279969c7-d2e7-498f-a858-5c999b6014a5`.
  - Verified `bazel test //wayve/ai/si:test_deployment_wrapper --test_arg=-k --test_arg=parking_deployment_wrapper --test_output=errors`.
- Task note: [[agent_tasks/2026/06/Week-3/2026-06-16-parking-pose-nan-output]]

## 2026-06-15 - Event Clip Viewer Rewrite (Streamlit -> FastAPI + vanilla JS) — implemented

- Topic: Ground-up rewrite of the parking event clip viewer. ExecPlan signed off; implemented and verified headlessly.
- Labels: parking, event-clip-viewer, tooling, fastapi, frontend, media-handler.
- Branch: `boris/event_clip_viewer_fastapi` (off `main`); reviewed old `boris/event_clip_viewer` (read-only).
- PR: none yet (not pushed).
- Change type: Feature / rewrite.
- Areas: new `wayve/ai/parking/tools/event_clip_viewer/` (FastAPI app, `sources/`, `static/`, `templates/`, tests); precedent `wayve/ai/ori/data/dashboard/`.
- Decisions (user-confirmed): FastAPI + Jinja + vanilla JS (Bazel-native via `js_checks`, no Node bundler); local-only on :3006; cache under `/tmp`; drop `compile_event_videos.py`; ONE video source.
- Video source: **media-handler only** (5-agent repo survey, `both_needed=false`). model-catalogue dropped — its flakiness is inherent (SAS expiry, no faststart/Range guarantee, all-or-nothing per-camera gating), not user misuse. media-handler server-cuts a faststart MP4 starting at 0 (no seek), guarantees 206/Range, clean error codes; URLs built client-side (no round-trip).
- Built: JSON API (`/api/config|buckets|event_types|events|compare|signals|cache/clear`); `/tmp` parquet+SQL disk cache (sha256-keyed, TTL, LRU); sources `databricks_sql`/`materialization`/`compare`/`signals` (+`parquet_fs`,`base`); SPA player with master-clock camera sync, green segment-vs-anchor box, prefetch pool, autoplay, keyboard (←/→/space/r/j/f/[ ]), hash state, dynamic per-source filters, random sampling.
- Telemetry charts (follow-up request): 4 synced SVG charts under the clip — speed / av mode / gear / indicator — from `prod_data_pipeline.wayve_corpus.all_data` (`inferred__state__odometry__speed_kmh`, `ground_truth__state__vehicle__automation_active`/`gear_direction`/`indicator_light`) by `run_id`+`timestamp_unixus`; white playhead tracks the clip via the player rAF loop; event green band + per-panel readout. `sources/signals.py`, `static/charts.js`, `GET /api/signals`.
- Playback fixes (follow-up): green box moved to rAF (timeupdate ~4Hz missed narrow windows at speed); prefetch now in browse mode too; patient skip (45s, error/stall only, delayed + "N skipped (no media)" counter); per-camera loading overlay.
- Round 2 fixes: duplicate charts were a stale-async render race → render `seq` guard in charts.js; autoplay skipping → retry-once on transient video error before counting no-media; telemetry slowness root-caused (~13s cold corpus point-lookup, no run_id clustering on `all_data`) → `run_date_iso` partition pruning + telemetry prefetch (1-2 ahead) + disk cache (13.0s cold → 0.006s cached). User decision: keep cache+prefetch, accept ~13s first-view; did not pursue raw-stream tables / bigger warehouse.
- Static-cache fix: per-startup `?v=<token>` on asset URLs + `Cache-Control: no-store` on /static (the "bucket dropdown still fixed" report was a stale cached filters.js, not a code bug — discovery was already working). Removed the hardcoded `KNOWN_ANCHOR_BUCKETS` fallback so buckets are purely discovered from the materialization root; UI re-discovers on path/split/source change.
- Moved to a git worktree: committed viewer (`e029e170d860`) on `boris/event_clip_viewer_fastapi`, restored `/workspace/WayveCode` to the training branch, worktree at `/workspace/event_clip_viewer_fastapi`; server in tmux `ecv` from the worktree.
- Bokeh feature: `Bokeh ▶` button runs `//wayve/ai/si:visualise_bokeh ParkingPlotter --run_segment ... --gap 10 --force` for the current event's clip segment as a tracked subprocess (`bokeh_runner.py`; `POST /api/bokeh` + status + `/view`), live running/finished/failed + Open link. GOTCHA: SI target build spills multi-GB tensorrt wheels into TMPDIR; from the worktree's fresh bazel output_base it hit `ENOSPC` (root `/` 97% full, /tmp small). Fix: run nested bazel from the warm main checkout (`ECV_BAZEL_WORKSPACE=/workspace/WayveCode`) + output/TMPDIR on the big disk (`ECV_BOKEH_OUTPUT_ROOT=/workspace/.cache/ecv-bokeh`). Verified end-to-end: finished ~86s, 13MB HTML served at /view. Bokeh feature + worktree move are uncommitted in the worktree.
- Verified: `bazel build :viewer`; `py_test` 24 pass; flake8 + ruff + ty + eslint green; server boots on :3006; `/`, `/api/config`, static assets 200; `/api/events` SQL returned real Databricks events end-to-end. Pending: human visual playback check (needs browser reach to media-handler).
- Task note: [[agent_tasks/2026/06/Week-3/2026-06-15-event-clip-viewer-rewrite-execplan]]

## 2026-06-15 - PUDO Detection: Generic Materialization vs Zak On-the-Fly

- Topic: Find generic-materialization PUDO/UnPUDO detection bugs + corrective actions, and compare thoroughly to Zak's on-the-fly detection in zmurez/pudo.
- Labels: parking, pudo, unpudo, materialization, zmurez, detection, comparison.
- Branches: `boris/pudo_generic_materialization` (32e3252) + `zmurez/pudo` (e45cf33), read-only.
- PR: N/A (investigation).
- Change type: RCA / comparison report.
- Key findings (verified in code):
  - Shared heuristics (gear==0 stop, hazard=PUDO, raw indicator incl. hazard, ~30m/12s window, unsigned speed) are NOT the regression — Zak's working model had them too.
  - Generic is worse than Zak in 3 ways → regression: (1) no gear-gap compensation (Zak back-dates park to speed≈0 via clean_up_gear_stopped + patches missing gear via pred_park_intention; generic does neither → misses held-in-drive PUDO stops); (2) run-wide PARK deletion if the run has ANY trip event (filters.py:89-90); (3) 100m spatial-only trip matching with unused timestamp (signals.py:314-360).
  - Plus ca_pudo over-broad (any gear change in ±30s context), reverse undifferentiated, short approach window, PUDO recent-only+relaxed filters.
  - Confirmed already-fixed: departure off-by-one, unpudo next-stop clip, approach/departure context reconciliation.
  - Top regression-repair priorities: port Zak's speed-back-date+intention compensation; per-stop park/PUDO split (drop run-wide suppression); temporal gate on trip match.
- Task note: [[agent_tasks/2026/06/Week-2/2026-06-15-pudo-materialization-vs-zmurez]]
- Report: [[projects/pudo-materialization-vs-zmurez-2026-06-15]]

## 2026-06-14 - PUDO On-Road Failure RCA (wrapper + gear-head + materialization)

- Topic: Root-cause the catastrophic on-road PUDO/UnPUDO runs (Model A flagged dangerous; Model B working-model regressed 0/~20) across deployment wrapper, datamodule/config, and materialization.
- Labels: parking, pudo, unpudo, deployment, shift-by-wire, indicator, rca.
- Branches: `boris/training/main_cherrypick_generic_data` + `boris/pudo_generic_materialization` (read-only).
- PR: N/A (investigation).
- Change type: RCA / report.
- Key verified findings:
  - Shift-by-wire/no-motion/reverse failures = a chain: NEUTRAL-biased gear head → wrapper maps NEUTRAL→PARK (`deployment_wrapper.py:3323-3333`) → zeroes all waypoints for PARK (`:364-376`) → shift-by-wire ignores manual gear (`:3519-3550`). NEUTRAL bias worsened by commit `2ad1c2d` disabling `augment_gear_direction` (config, not materialization).
  - Hazards-on-approach = wrapper forcing hazard at end-of-route on route-map sparsity (`:3382-3404`, `:3452-3456`), default ON; model CANNOT emit hazard (3-class head, hazard masked in loss `imitation_losses.py:488,495`). Corrects the "VSO data" theory.
  - Monotonic end-of-route PARK latch sticks in PARK (`:3360-3378`), default ON.
  - Wrong directional indicator = PUDO frames masked from indicator loss + no curb-side grounding.
  - Materialization (secondary): short PUDO approach window; PUDO recent-only + relaxed quality filters; reverse NOT structurally invisible (over-claims corrected).
  - "Wrapper constant" assumption is unverified: route-end hazard+latch were recently added (`0b5120975beb`) — regression may be wrapper/config, not data. NEEDS-DATA: per-model wrapper/training/materialization versions.
  - Quick on-road isolation: deploy with `enable_end_of_route_hazard_lights=False` + `enable_end_of_route_gear_latch=False`.
- Task note: [[agent_tasks/2026/06/Week-2/2026-06-14-pudo-onroad-rca]]
- Report: [[projects/pudo-onroad-failure-rca-2026-06-14]]

## 2026-06-14 - PUDO datamodule + materialization bug fixes (N1-N5, M1-M6)

- Topic: Implement the agreed fixes from the parking.py critique across the datamodule and materialization.
- Labels: parking, pudo, unpudo, datamodule, materialization, bugfix.
- Branches: `boris/pudo-parking-py-fixes` (new, off training branch; committed) + `boris/pudo_generic_materialization` (user's worktree; left uncommitted alongside their WIP).
- PR: none yet (not pushed).
- Change type: Bug fixes.
- Areas: `wayve/ai/si/datamodules/parking.py` (+ test); `wayve/ai/services/sampling/datasets/parking_pudo/{filters,signals,intervention_filters}.py`.
- Changes (datamodule, committed e1f598c):
  - N1: `_compute_parking_mode` detects forward pull-out (P/N->D) as unparking, not only reverse-out.
  - N2: added a min-neutral-duration gate (threaded `min_duration_sec` via `add_parking_mode`).
  - N3: arrivals clamp now guarded by `_pre_intervention_would_fire` (fixed in parking.py, not pre-intervention).
  - N5: clamp zeroes speed from `clamp_idx+1` (matches pose/waypoint freeze).
  - N4: NOT a bug — both index arrays are `arange(present, …)` from the same present, so positions resolve identically; skipped.
  - N6/N7: skipped per Boris.
  - Tests: forward-unpark, duration-gate, updated clamp-speed semantics. All 5 parking tests pass (`5 passed, 373 deselected`); 12 unrelated pre-existing suite failures (sarsa/restore/lazy_future/PARKING_POSE_GT keys) not caused by these changes.
  - Q1 answered: in the BC config the only trajectory mutation in parking.py is the arrivals clamp (POLICY_POSE/WAYPOINTS/SPEED/CURVATURE) + gear-target rewrite (gear cleanup + add_parking_mode); POLICY_PATH/PARKING_POSE/PARKING_POSE_GT are not produced in BC.
- Changes (materialization, uncommitted in worktree):
  - M1: `select_park_pudo_event` claims `assigned |= window` only inside the class-match gate (no cross-class frame theft).
  - M2: approach AND departure (incl. gear-change departures) classify PUDO/PARK over the parked-segment span `[neutral_onset-1 : neutral_end)`.
  - M3: `_departure_anchor` searches movement from `park_end_idx` (not `-1`), so the anchor can't land on the last park frame.
  - M4: `_departure_events` returns a `cap_idx`; the unpudo post-departure window is clipped at the next parked segment.
  - M6: `_trip_pudo_context` skips neutral segments shorter than `min_parking_duration_sec` (default 2 s).
  - M5: skipped per Boris.
  - Validation: all edited files py_compile clean; module filter test is entangled with the in-progress events/event_table refactor, so not run here.
- Task note: [[agent_tasks/2026/06/Week-2/2026-06-14-pudo-fixes-n-m]]
- Critique source: [[projects/pudo-parking-py-critique-2026-06-14]]

## 2026-06-14 - Parking/PUDO Events Dataset

- Topic: Add a generic materialisation `parking_pudo/events` dataset for event-table-style PUDO and UnPUDO anchors.
- Labels: parking, pudo, unpudo, generic-materialization, events, flyte.
- Branch: `boris/pudo_generic_materialization`.
- PR: N/A.
- Change type: Code change, tests, Flyte run.
- Areas: `wayve/ai/services/sampling/datasets/parking_pudo/events`, `event_table.py`, sampling mask output preservation.
- Changes:
  - Added `parking_pudo/events` with one unsplit `events` bucket and no AV/DC exclusion.
  - Added PUDO/UnPUDO event metadata columns: event type, inferred what, gear-change timestamp, disengagement timestamp, country, hazard/trip flags, and trip id.
  - Added a dataset-level `extra_output_columns` hook so post-process metadata survives mask and bucket creation.
  - Verified scoped tests, lint, type checks, and dataset/task imports.
  - Published a test sampling image and submitted the first `filter_and_bucket_stage` Flyte execution.
- Task note: [[agent_tasks/2026/06/Week-2/2026-06-14-parking-pudo-events-dataset]]

## 2026-06-14 - PUDO parking.py Deep Critique + Flags Guide

- Topic: Second-pass critique of the PUDO pipeline focused on datamodules/parking.py mechanics, a full flags guide, and new bugs (model + materialization) beyond the 2026-06-13 report.
- Labels: parking, pudo, unpudo, datamodule, debugging, materialization, flags.
- Branch: `boris/training/main_cherrypick_generic_data` + `boris/pudo_generic_materialization` (read-only, no code changes).
- PR: N/A.
- Change type: Investigation / report.
- Areas: `wayve/ai/si/datamodules/parking.py`, `otf.py`, `wayve/ai/si/configs/parking/parking_config.py`, `parking_pudo/*` materialization.
- Changes:
  - Confirmed the prior U-1 clamp fix landed and F4 (augment_gear_direction) is now inert.
  - Key framing: BC release runs with policy-path/stopping-mode/strip/augment machinery OFF; many candidate bugs are diffusion-only. Tagged every finding BC-LIVE vs DIFFUSION-ONLY.
  - New BC-LIVE findings: N1 forward-unpark still undetected (U1 blocker); N2 BC applies no min-neutral-duration gate (P1/U2); N3 clamp-NEUTRAL vs pre-intervention-motion contradiction on pre-CA/CA arrivals; N4 route-shortening clipped-vs-unclipped index; N5 clamp speed/pose off-by-one; N6 no goal-pose target in BC; N7 SI-vs-zoo parked-tail.
  - New materialization findings: M1 cross-class frame theft (assigned before class gate); M2 approach-vs-departure context window mismatch; M3 departure-anchor off-by-one; M4 unpudo window not clipped at next stop; M5 departure not skipping start<=0; M6 trip context on raw neutral segments.
  - Full flags guide (gear/mode/horizon/departure/stopping/goal/robustness) with current BC value + recommendation + motivation.
  - Config hygiene: modes bind parking_bc_datamodule; pudo_bc_datamodule + diffusion datamodule unused by any mode; inverted past/lookahead; dangling enable_end_of_route_blackout.
  - Verified load-bearing claims directly; refuted an earlier-pass "all-neutral gear on BC departures" claim.
- Task note: [[agent_tasks/2026/06/Week-2/2026-06-14-pudo-parking-py-critique]]
- Report: [[projects/pudo-parking-py-critique-2026-06-14]]

## 2026-06-14 - Parking Deployment Gear Indicator Port

- Topic: Port parking deployment gear and route-end indicator handling before interleave redeploy.
- Labels: parking, deployment, gear, indicator, interleave-control.
- Branch: `codex/guy-recipe-gear-root-amaranth-root`.
- PR: N/A.
- Change type: Code change, tests.
- Areas: `wayve/ai/zoo/deployment/deployment_wrapper.py`, `wayve/ai/si/test/interfaces/test_deployment_wrapper.py`.
- Changes:
  - Ported parking deployment output handling from `boris/training/main_cherrypick_generic_data`.
  - Added explicit parking `policy_gear_position` output, route-end hazard indicator forcing, and route-end park gear latching.
  - Added focused parking wrapper tests and verified `//wayve/ai/si:test_deployment_wrapper -k parking`.
- Task note: [[agent_tasks/2026/06/Week-2/2026-06-14-parking-deployment-gear-indicator-port|2026-06-14 Parking Deployment Gear Indicator Port]]

## 2026-06-16 - Parking Entry Table Index

- Topic: Fix route-shortening event index selection for parking/PUDO and unpark/UnPUDO samples.
- Labels: parking, pudo, datamodule, route-shortening.
- Branch: `boris/training/main_cherrypick_generic_data`.
- PR: n/a.
- Change type: Code change, tests.
- Areas: `wayve/ai/si/datamodules/parking.py`, `wayve/ai/zoo/data/parking.py`.
- Changes:
  - Replaced `_parking_entry_lookahead_index` with `_parking_entry_table_index`, storing one absolute table index for parking/PUDO stop position or unpark/UnPUDO movement-start position.
  - Added first-moving-frame selection for unpark/UnPUDO route shortening, including cases where movement started before the current origin.
  - Removed the old lookahead-index-to-table-index mapping from zoo route-position conversion.
  - Added parking/PUDO-only navigation shortening by clamping turn-by-turn navigation lookahead to the stored parking stop route position; unpark/UnPUDO navigation remains unchanged.
  - Added focused unit regressions for parking stop table index, unparking move-start table index, and unpark route-position conversion.
- Task note: [[agent_tasks/2026/06/Week-3/2026-06-16-parking-entry-lookahead-index|2026-06-16 Parking Entry Table Index]]

## 2026-06-16 - PUDO Window Caps Root

- Topic: Point Parking/PUDO BC data config at the window-capped materialization root.
- Labels: parking, pudo, config, materialization.
- Branch: `boris/training/main_cherrypick_generic_data`.
- PR: n/a.
- Change type: Config change.
- Areas: `wayve/ai/si/configs/parking/parking_config.py`.
- Changes:
  - Updated `PARKING_BC_PUDO_BUCKETS_ROOT` to the `parking_pudo_default_window_caps_20260616__2026-06-16-10-23` dataset root.
  - Renamed DC pre-start UnPUDO bucket references from `dc_pre_unpudo_*` to `dc_pre_start_unpudo_*`.
  - Verified all referenced US/UK PUDO buckets exist in the new materialization for the current config.
- Task note: [[agent_tasks/2026/06/Week-3/2026-06-16-pudo-window-caps-root|2026-06-16 PUDO Window Caps Root]]

## 2026-06-14 - Parking Hub publish_report Script + PR

- Topic: Parking-owned HTML report publishing (not semantic_understanding) via the parking hub + a copy/link helper script.
- Labels: parking, parking-hub, tooling, sso, pr.
- Branch: `boris/parking-hub-publish-report` (isolated worktree off origin/main at `/workspace/parking_hub_pr`).
- PR: https://github.com/wayveai/WayveCode/pull/118668
- Change type: Tooling / report publishing.
- Areas: `wayve/ai/parking/tools/parking_hub/` (publish_report.sh, BUILD, README, content/).
- Findings/changes:
  - Established that the parking hub (`parking-hub.sso.azr.wayve.ai`, FastAPI `hub_app.py`) ALREADY auto-discovers and serves any `*.html` or folder-with-`index.html` under `content/` at `/r/<path>` — and is intentionally static-only per its README (no workload identity/blob). So the requested "expose any html/folder" feature already exists, parking-namespaced.
  - Added `publish_report.sh` (sh_binary + shellcheck_test): copies a single self-contained .html or a folder-with-index.html into `content/` under a slug and prints the local + `parking-hub.sso.azr.wayve.ai/r/<slug>` links; `--name`, `--content-dir`, `--dev`.
  - Published `parking-capability-architecture-research.html` into `content/` (first hub report); README updated.
  - Clarified to Boris why the earlier link had `semantic_understanding` (that viewer is owned by another team and prefix-locked) and that the hub is the parking-owned equivalent. Static-by-design means publish = commit + CI redeploy (not instant blob); flagged blob as a separate option if instant links are wanted.
- Task note: [[agent_tasks/2026/06/Week-2/2026-06-14-publish-html-sso-viewer]] (extended)

## 2026-06-14 - Publish HTML Report to SSO Viewer + Reusable Script

- Topic: Publish the parking-capability HTML report as a browser-viewable Wayve SSO link, and create a reusable publish script.
- Labels: html-summary, publishing, azure-blob, sso, tooling.
- Branch: N/A (vault + Azure blob ops; read-only repo).
- PR: N/A.
- Change type: Tooling / publishing.
- Areas: `html_summaries/publish_report.sh`, `html_summaries/README.md`; Azure blob `datasets@wayveproddatasetflat`.
- Changes:
  - Found via `wayve/ai/semantic_understanding/auto_labeler/reports/{app.py,publish_html_report.sh}` (origin/main) that the SSO viewer `auto-labeler-reports.sso.azr.wayve.ai` is hard-bound to `datasets@wayveproddatasetflat/materialised/semantic_understanding/reports/auto_labeler/` and serves only self-contained `.html` (CSP blocks external assets; non-.html siblings 404). The earlier `databricks-users@wayveproddataset/parking` upload has no viewer → no SSO link.
  - Published `parking-capability-architecture-research.html` to `.../auto_labeler/borisindelman/parking/` (content-type text/html); confirmed the viewer returns 302→Wayve OneLogin (live). Link viewable after Wayve SSO from any networked machine.
  - Created `publish_report.sh`: accepts a single .html OR a folder with index.html (inlines CSS/JS/images into one self-contained file via an embedded Python inliner), uploads to the viewer store under `<user>/<subdir>/`, prints the SSO viewer URL. Verified inliner with assertions (css/js/img/url() folded, remote links preserved, no stray local refs).
- Task note: [[agent_tasks/2026/06/Week-2/2026-06-14-publish-html-sso-viewer|2026-06-14 Publish HTML to SSO Viewer]]

## 2026-06-13 - Guy Recipe Amaranth Root Config

- Topic: Fork the guy recipe gear-root branch and update parking BC PUDO buckets to the amaranth/no-low-steering materialization.
- Labels: parking, pudo, training-config, materialization, buckets.
- Branch: `codex/guy-recipe-gear-root-amaranth-root`.
- PR: N/A.
- Change type: Code change, config validation.
- Areas: `wayve/ai/si/configs/parking/parking_config.py`.
- Changes:
  - Added a dedicated parking BC PUDO root for `parking_pudo_default_no_low_steering_20260611__2026-06-11-13-23/dataset`.
  - Kept driving partitions unchanged and replaced only the parking BC non-driving PUDO mix.
  - Flattened non-driving groups into `dc_pudo`, `dc_unpudo`, `dc_pudo_gear_change`, `dc_unpudo_gear_change`, `dc_unpudo_pre_start`, `ca_pudo`, `pre_ca_pudo`, `ca_unpudo`, and `pre_ca_unpudo`.
  - Applied the discussed 50% driving / 50% PUDO-family split with 11/11/4/4/6/2/5/2/5% non-driving group weights.
  - Updated validation partitions and the new-driving datamodule non-driving root filters to match the new PUDO root.
  - Verified the relevant config registration and partition-weight slice after removing unsupported `track_tag` usage from this branch.
  - Committed and pushed `90be5f9f0ef6`, then submitted 4-node training job `179301` / `astonishing-chocolate-albatross` with session `session_2026_06_13_20_16_20_guyamr4n100k`; monitored until `trainer/global_step=1001` / `trainer/train_step=1000` with W&B still `running`.
- Task note: [[agent_tasks/2026/06/Week-2/2026-06-13-guy-recipe-amaranth-root-config|2026-06-13 Guy Recipe Amaranth Root Config]]

## 2026-06-13 - PUDO Data & Pipeline Bug Report

- Topic: Find bugs behind the PUDO/unpark training failures (won't pull out, unsafe pull-out, gear flicker, no-stop, suboptimal stop) by cross-referencing symptoms + bucket stats against materialization and training code.
- Labels: parking, pudo, unpudo, data, debugging, materialization, training.
- Branch: `boris/pudo_generic_materialization` (data) + `boris/training/main_cherrypick_generic_data` (training); read-only, no code changes.
- PR: N/A.
- Change type: Investigation / report.
- Areas: `wayve/ai/services/sampling/datasets/parking_pudo/*`, `wayve/ai/si/datamodules/parking.py`, `wayve/ai/zoo/augmentations/gear_direction.py`, `wayve/ai/si/configs/parking/parking_config.py`, gear schema.
- Changes:
  - Confirmed key bugs: neutral-clamp zeroes departure trajectories (U1); gear-direction augmentation moves gear to D without moving the path (U1/U3); no `failed_to_unpudo` negative + `unpudo_ca_unsafe_weight=0` (U2); `gear==0` = NEUTRAL not PARK so drive-through PUDO stops are missed (P1); 100 m trip-match radius + clamp bias the stop position (P2); `ca_pudo` and gear-change anchors are over-broad (P1/P2/U3).
  - Corrected an over-claim: the bucket stats are the `anchors` dataset (1 frame/anchor), so short==long / pre==window equalities are by-design artifacts, not training duplication (consistent with the 94.5%-unique warning).
  - Listed 3 cheap verification checks and a prioritized fix order; verified the load-bearing claims (gear schema, clamp logic, config weights) directly in code.
- Task note: [[agent_tasks/2026/06/Week-2/2026-06-13-pudo-data-bug-report|2026-06-13 PUDO Data Bug Report]]
- Report: [[projects/pudo-data-bug-report-2026-06-13]]

## 2026-06-12 - Parking Research Doc Rewrite + Interactive HTML

- Topic: Rewrite the parking research solutions section for readability (Mermaid + pseudo-code) and ship an interactive HTML report.
- Labels: parking, research, documentation, html-summary.
- Branch: `boris/training/main_cherrypick_generic_data` (vault-only changes).
- PR: N/A.
- Change type: Documentation / report.
- Areas: vault `projects/parking-capability-architecture-research.md` §8; `html_summaries/`.
- Changes:
  - §8 rewritten with full what/why/how prose per solution, 8 Mermaid diagrams + a phasing Gantt, 7 Python pseudo-code blocks, and decision/implementation tables.
  - New self-contained interactive report `html_summaries/parking-capability-architecture-research.html` (solution tabs, hand-authored SVG diagrams, interactive coverage matrix, requirements stepper, critique accordions, filterable risks/literature).
  - `html_summaries/README.md` row added; project doc references updated.
- Task note: [[agent_tasks/2026/06/Week-2/2026-06-12-parking-research-doc-rewrite-html|2026-06-12 Parking Research Doc Rewrite + HTML]]

## 2026-06-12 - Parking Capability Research Phases 1-3

- Topic: Execute the parking-capability research — branch/design-doc deep dive, 6-topic literature sweep, and adversarially-reviewed novel solution proposals.
- Labels: parking, pudo, research, architecture, diffusion, latent-actions, memory, literature.
- Branch: `boris/training/main_cherrypick_generic_data` (read-only; no code changes).
- PR: N/A.
- Change type: Research / documentation.
- Areas: vault project docs; read-only archaeology over `soham/*`, `wonjoongoo/*`, `sohamphade/*`, `zmurez/pudo`; Google Drive design docs; web literature.
- Changes:
  - Completed Phase 1 (§3.5 of the project doc): dynamic horizon + affinity guidance maturity, Wonjoon goal-conditioning drop-on-merge, real `AnnealedWTALoss` (≡ aWTA 2024), VLM annotation pipeline status, 4 design docs incl. Multiple Driving Heads constraints.
  - Completed Phase 2: [[projects/parking-capability-literature|literature digest]] across diffusion planners, multimodal prediction, E2E parking industry (memory-parking reference designs), external memory, hierarchy/latent actions, parking semantics.
  - Completed Phase 3: §8 of [[projects/parking-capability-architecture-research|the project doc]] — P0 representation prerequisites, PRX head, leg-codebook trajectories, memory-as-inputs, fleet data engine, critic-as-ranker, trunk/WFM riders, honest coverage matrix, rebuilt phasing, top-10 risks.
  - Ran a 4-lens adversarial critique (production/data/novelty/org-fit) with repo verification; all blockers folded in; log at [[projects/parking-capability-critique-2026-06-12]].
- Task note: [[agent_tasks/2026/06/Week-2/2026-06-12-parking-capability-research-phases1-3|2026-06-12 Parking Capability Research Phases 1-3]]

## 2026-06-12 - Parking/PUDO Anchor Metadata

- Topic: Add event-style metadata columns to `parking_pudo/anchors` output.
- Labels: parking, pudo, generic-materialization, anchors, metadata.
- Branch: `boris/pudo_generic_materialization`.
- PR: #117075 draft context; not pushed in this task.
- Change type: Materialisation anchor enrichment.
- Areas: `/workspace/pudo_materialization_buckets/wayve/ai/services/sampling/datasets/parking_pudo`.
- Changes:
  - Added an anchor-only post-processing hook that appends event metadata without changing bucket filters.
  - Added shared event-record builders so filters and metadata consume one park/PUDO and unpark/UnPUDO event construction path.
  - Populated event type, materialization window timestamps, anchor telemetry, gear-change timestamp, PUDO context source, 30s intervention context, and trip-event context.
  - Reused existing Parking/PUDO signal helpers so metadata follows the same park/PUDO/unpark/UnPUDO anchor logic.
  - Added focused regression coverage for hazard-source and trip-source metadata enrichment.
- Task note: [[agent_tasks/2026/06/Week-2/2026-06-12-parking-pudo-anchor-metadata|2026-06-12 Parking/PUDO Anchor Metadata]]

## 2026-06-12 - Parking Capability Research Kickoff

- Topic: Frame the parking-capability architecture research (longer horizon, multimodality, memory/ICL) and write the starting-point document.
- Labels: parking, pudo, research, architecture, latent-actions, diffusion, memory.
- Branch: `boris/training/main_cherrypick_generic_data` (read-only grounding; no code changes).
- PR: N/A.
- Change type: Research / documentation.
- Areas: vault project doc + grounding over `wayve/ai/si`, `wayve/ai/zoo`, `zmurez/pudo`, Notion parking docs.
- Changes:
  - Created project doc [[projects/parking-capability-architecture-research|Parking Capability — Architecture Research]]: problem definition, grounded release-model summary, status of the 4 existing approaches (latent actions, diffusion planner, zmurez WTA, AR spot-conditioning), production constraints from Notion, research plan, seed solution directions.
  - Established that latent actions are disabled in the parking adaptor, the diffusion path is distance-based (24.5 m) with single-proposal on-car inference, the WTA branch is really AR discrete-goal grids in the experimental stack, and no multi-candidate spot labels exist anywhere.
  - Asked Boris 7 clarification questions (scope tiers, architecture freedom, memory/ICL mandate, latency filters, controller contract, data leverage, deliverable home).
- Task note: [[agent_tasks/2026/06/Week-2/2026-06-12-parking-capability-research-kickoff|2026-06-12 Parking Capability Research Kickoff]]

## 2026-06-12 - Amaranth/Green PUDO Experiments

- Topic: Create amaranth-kestrel-charming Console note plus green-control UK PUDO licensing and Drift/PUDO experiments.
- Labels: parking, pudo, model-catalogue, on-road-experiment, licensing.
- Branch: `boris/training/main_cherrypick_generic_data`.
- PR: N/A.
- Change type: Model Catalogue operations.
- Areas: Model Catalogue model notes and on-road experiments.
- Changes:
  - Created model note `b7a72ce4-610d-461a-860f-dd5af35dd5b2` on `amaranth-kestrel-charming`.
  - Created pending UK PUDO licensing interleave `e701b80e-e179-41e9-830c-3f59f74940e0` with `green-stegosaurus-brave` control and `amaranth-kestrel-charming` variant.
  - Created pending UK Drift/PUDO interleave `a971f51e-d490-49f1-a624-02392781be9d` by copying the requested reference shape with default controller and PUDO/SBW config.
- Task note: [[agent_tasks/2026/06/Week-2/2026-06-12-amaranth-green-pudo-experiments|2026-06-12 Amaranth/Green PUDO Experiments]]

## 2026-06-11 - Anchor Table Upload Workflow

- Topic: Add a Flyte path to upload anchor buckets to a Databricks table.
- Labels: parking, pudo, generic-materialization, flyte, databricks.
- Branch: `boris/pudo_generic_materialization`.
- PR: #117075 draft context; not pushed in this task.
- Change type: Workflow utility.
- Areas: `/workspace/pudo_materialization_buckets/wayve/ai/services/sampling/common`, `/workspace/pudo_materialization_buckets/wayve/ai/services/sampling/datasets/parking_pudo`.
- Changes:
  - Added a Spark helper path that reads anchor `buckets/`, preserves bucket parquet rows, and prepares an external Delta table payload.
  - Added a Databricks-notebook upload task that imports a generated notebook, submits a one-time Databricks run, polls it, and returns the run URL.
  - Added `filter_bucket_and_upload_anchor_table_stage` so anchor bucket creation and table upload run in one Flyte execution.
  - Added `bucket_name` and `train_val_split` aliases from `dataset_bucket` and `dataset_split`.
  - Added validation to reject hyphenated table identifiers such as `parking.parking-pudo-anchors`.
  - Exposed a standalone `upload_anchor_table_stage` workflow and optional `sample` workflow inputs using the Databricks upload path.
  - Documented usage in the Parking/PUDO dataset README and added focused tests.
- Task note: [[agent_tasks/2026/06/Week-2/2026-06-11-anchor-table-upload-workflow|2026-06-11 Anchor Table Upload Workflow]]

## 2026-06-11 - Generic PUDO 8-node Training

- Topic: Submit a 100K-step 8-node Parking/PUDO training run from the generic data branch.
- Labels: parking, pudo, training, surfboard.
- Branch: `boris/training/main_cherrypick_generic_data`.
- PR: #118072 draft context.
- Change type: Training submission.
- Areas: `/workspace/WayveCode/wayve/ai/si/configs/parking/parking_config.py`.
- Changes:
  - Submitted Surfboard job `178473` / `intricate-hatchetfish-crimson`.
  - Used mode `parking_bc_train_release_2026_5_21`, datamodule `pudo_bc_datamodule`, `num_steps=100000`, 8 H100 nodes, `P1`.
  - Overrode the generated long session tag to `genpudo8n100k`.
  - Final observed status in this task was `Dispatched`; Model Catalogue indexing had not populated yet.
- Task note: [[agent_tasks/2026/06/Week-2/2026-06-11-generic-pudo-8node-training|2026-06-11 Generic PUDO 8-node Training]]

## 2026-06-11 - UnPUDO 15s Window

- Topic: Extend UnPUDO DC windows to 15s after first movement.
- Labels: parking, pudo, generic-materialization, buckets.
- Branch: `boris/pudo_generic_materialization`.
- PR: #117075 draft context; not pushed in this task.
- Change type: Materialisation bucket tuning.
- Areas: `/workspace/pudo_materialization_buckets/wayve/ai/services/sampling/datasets/parking_pudo`.
- Changes:
  - Set `dc_unpudo_*` and `dc_unpudo_trip_*` to use `after_movement_sec=15.0`.
  - Kept `dc_unpark_*` on the shared 10s default.
  - Left pre-departure and gear-change buckets unchanged.
  - Added a regression test checking the actual `dc_unpudo` bucket emits the 15s post-movement window.
  - Verified `git diff --check` and `bazel test //wayve/ai/services/sampling:test_datasets_py_test --test_arg=-k --test_arg=parking_pudo --test_arg=--no-cov`.
- Task note: [[agent_tasks/2026/06/Week-2/2026-06-11-unpudo-15s-window|2026-06-11 UnPUDO 15s Window]]

## 2026-06-11 - Generic PUDO 8-node Training Monitor

- Topic: Submit and monitor the generic PUDO 8-node 100K train through the 1K-step smoke gate.
- Labels: parking, pudo, training, surfboard, wandb, notion.
- Branch: `boris/training/main_cherrypick_generic_data`.
- PR: Draft PR to main exists for the branch.
- Change type: Code fixes, training run, monitoring, Notion update.
- Areas: `wayve/ai/lib/data/pipes/paths.py`, `wayve/ai/si/configs/parking/parking_config.py`, `wayve/ai/zoo/deployment/deployment_wrapper.py`.
- Changes:
  - Fixed array-like `odometry_source` handling after the first train failed in the path loader.
  - Added the missing `/dataset` suffix to the new PUDO materialization root after the next retry failed to find parquet files.
  - Fixed TorchScript export by using the initialized `forward_drive_position` wrapper attribute.
  - Cancelled a long-tag queued job before start and resubmitted with short session tag `gp8n100k4`.
  - Confirmed `amaranth-kestrel-charming` / job `178491` passed the 1K monitor gate at `trainer/global_step=1096`.
  - Created the Notion model-card row and posted Slack status updates for each fix/retrain milestone.
- Task note: [[agent_tasks/2026/06/Week-2/2026-06-11-generic-pudo-8node-training|2026-06-11 Generic PUDO 8-node Training]]

## 2026-06-11 - HARI UnPUDO Split-Native Video Batch

- Topic: Launch corrected train/validation UnPUDO clip generation in Flyte.
- Labels: parking, pudo, unpudo, hari, run-clips, flyte.
- Branch: `boris/hari_pudo`.
- PR: N/A.
- Change type: Workflow run.
- Areas: `/workspace/classifiers`, `hive_metastore.parking.pudo_unpudo_unpark_events_gear_fix`, `prod_data_pipeline.inferred__metadata.dataset_split`.
- Changes:
  - Corrected sampling to use canonical run-level `dataset_split` instead of assigning train/validation after random sampling.
  - Sampled 500 `speed_at_event` and 500 disjoint `duration_gt_10s` UnPUDO events, split as 400 train + 100 validation per bucket from existing split labels.
  - Generated corrected `run_clips_input.parquet` files under `trainval_splitnative_20260611_194255_UTC`.
  - Aborted wrong-split Flyte executions `aj6qf6s8ffmqlc7mn429` and `apvz2vlnrlbvl4vgrx5t`.
  - Launched corrected train Flyte execution `a7zj4hn9x7cqd4kfjzg2` and corrected validation Flyte execution `a6szfdb4jlhpvvtps2cs`.
- Task note: [[projects/hari-pudo-classifiers|HARI PUDO classifiers]]

## 2026-06-11 - Training Main Cherrypick Generic Data PR

- Topic: Open a draft PR for the parking training main-cherrypick generic data branch.
- Labels: parking, pudo, training, config, pr.
- Branch: `boris/training/main_cherrypick_generic_data`.
- PR: #118072 (draft) — https://github.com/wayveai/WayveCode/pull/118072
- Change type: PR creation / training config update.
- Areas: `/workspace/WayveCode/wayve/ai/si/configs/parking/parking_config.py` plus existing branch changes.
- Changes:
  - Pushed `boris/training/main_cherrypick_generic_data` to origin.
  - Created a draft PR targeting `main`.
  - Documented the new `parking_bc_datamodule_cfg` PUDO materialization root.
  - Captured the requested 50% driving and 50% PUDO/UNPUDO bucket mix in the PR description.
  - Included manual verification from py-compile, `git diff --check`, and bucket-name validation against the supplied stats.
  - Follow-up local update: moved to the no-low-steering materialization, added DC UnPUDO gear-change buckets, and split CA/pre-CA PUDO/UNPUDO into flat weighted groups.
- Task note: [[agent_tasks/2026/06/Week-2/2026-06-11-training-main-cherrypick-generic-data-pr|2026-06-11 Training Main Cherrypick Generic Data PR]]

## 2026-06-11 - Departure Gear Change Buckets

- Topic: Add departure-side gear-change buckets for UnPUDO and unpark.
- Labels: parking, pudo, generic-materialization, buckets.
- Branch: `boris/pudo_generic_materialization`.
- PR: #117075 draft context; not pushed in this task.
- Change type: Materialisation bucket update.
- Areas: `/workspace/pudo_materialization_buckets/wayve/ai/services/sampling/datasets/parking_pudo`.
- Changes:
  - Added `dc_unpudo_gear_change_*` and `dc_unpark_gear_change_*` bucket families.
  - Added a shared departure gear-change selector that anchors on smoothed gear-leaves-park frames.
  - Reused the existing first-movement and 5m departure displacement validation before emitting gear-change anchors.
  - Split unpark vs UnPUDO using the same parked-interval PUDO context as `dc_unpark_*` and `dc_unpudo_*`.
  - Added focused regression coverage and updated bucket docs.
  - Verified `git diff --check` and `bazel test //wayve/ai/services/sampling:test_datasets_py_test --test_arg=-k --test_arg=parking_pudo --test_arg=--no-cov`.
- Task note: [[agent_tasks/2026/06/Week-2/2026-06-11-departure-gear-change-buckets|2026-06-11 Departure Gear Change Buckets]]

## 2026-06-11 - Event Viewer Fast Bucket Discovery

- Topic: Make anchor-comparison bucket discovery list folders instead of scanning parquet files.
- Labels: parking, pudo, streamlit, event-viewer, performance.
- Branch: `boris/pudo_generic_materialization`.
- PR: Draft PR branch context; not pushed in this task.
- Change type: Tool performance/UI fix.
- Areas: `/workspace/WayveCode/wayve/ai/parking/tools/event_clip_viewer`.
- Changes:
  - Replaced recursive parquet traversal in `discover_anchor_buckets` with non-recursive directory listing.
  - Scoped bucket discovery by selected split and anchor source.
  - Preserved fallback to known buckets if root discovery fails.
  - Added a regression test proving bucket names are discovered from folder names without parquet files.
  - Verified `git diff --check`, `bazel test //wayve/ai/parking/tools/event_clip_viewer:py_checks`, and HTTP `200 OK` on port `3001`.
- Task note: [[agent_tasks/2026/06/Week-2/2026-06-11-event-viewer-fast-bucket-discovery|2026-06-11 Event Viewer Fast Bucket Discovery]]

## 2026-06-11 - Event Viewer Comparison Bucket Event Type Controls

- Topic: Let anchor comparison choose discovered materialization buckets and independent event-table event types.
- Labels: parking, pudo, streamlit, event-viewer, anchor-comparison.
- Branch: `boris/pudo_generic_materialization`.
- PR: Draft PR branch context; not pushed in this task.
- Change type: Tool UI/query control change.
- Areas: `/workspace/WayveCode/wayve/ai/parking/tools/event_clip_viewer`.
- Changes:
  - Replaced the hardcoded `KNOWN_ANCHOR_BUCKETS` compare selectbox with materialization-root bucket discovery.
  - Added a `Refresh bucket list` control for bucket discovery cache invalidation.
  - Added an independent `Event table event_type` selector with inferred, all-types, and table-backed event-type options.
  - Updated comparison event loading to use the selected event type instead of deriving it only from the bucket name.
  - Added focused regression tests for selected event-type and all-event-type comparison SQL filters.
  - Verified `git diff --check`, `bazel test //wayve/ai/parking/tools/event_clip_viewer:py_checks`, and HTTP `200 OK` on port `3001`.
- Task note: [[agent_tasks/2026/06/Week-2/2026-06-11-event-viewer-comparison-bucket-event-type-controls|2026-06-11 Event Viewer Comparison Bucket Event Type Controls]]

## 2026-06-11 - Event Viewer MP4 Frame Snap

- Topic: Default event viewer media-handler URLs to MP4 with `frame_snap=auto`.
- Labels: parking, pudo, streamlit, event-viewer, media-handler.
- Branch: `boris/pudo_generic_materialization`.
- PR: Draft PR branch context; not pushed in this task.
- Change type: Tool runtime/video URL change.
- Areas: `/workspace/WayveCode/wayve/ai/parking/tools/event_clip_viewer`.
- Changes:
  - Added `video_format` and `frame_snap` parameters to the shared event-viewer `media_url` helper.
  - Defaulted media-handler URLs to `.mp4?frame_snap=auto`, matching the materialization segment visualizer pattern from PR #117577.
  - Added a focused regression test for the default URL shape.
  - Verified `git diff --check`, `bazel test //wayve/ai/parking/tools/event_clip_viewer:py_checks`, and HTTP `200 OK` on port `3001`.
- Task note: [[agent_tasks/2026/06/Week-2/2026-06-11-event-viewer-mp4-frame-snap|2026-06-11 Event Viewer MP4 Frame Snap]]

## 2026-06-10 - Parking/PUDO Context Signal Flyte Runs

- Topic: Submit anchors and default materialisation sample runs after parking/PUDO context signal updates.
- Labels: parking, pudo, generic-materialization, flyte, anchors.
- Branch: `boris/pudo_generic_materialization`.
- PR: Draft PR branch context.
- Change type: Image publish / Flyte run.
- Areas: `/workspace/WayveCode/wayve/ai/services/sampling/datasets/parking_pudo`.
- Changes:
  - Published sampling image from clean commit `b2f7351b05892e1f899e9b53554e05ae2bb5959a`.
  - Initial `parking_pudo/anchors` run `a9wgjls2rgpc4wx96d8v` failed because Flyte resolved the released sampling image instead of the local branch image.
  - Retagged the published image digest with the exact local-build tag expected by Flyte.
  - Submitted corrected `parking_pudo/anchors` full `sample` workflow as execution `arxtjfq56rw2cpgdgpkc`.
  - Submitted corrected `parking_pudo/default` full `sample` workflow as execution `avhqj2wjj7v9577tl5nx`.
  - Used dataset binary `3.0.68` and date range `2025-12-01` to `2026-06-07`.
- Task note: [[agent_tasks/2026/06/Week-2/2026-06-10-parking-pudo-context-signal-flyte-runs|2026-06-10 Parking/PUDO Context Signal Flyte Runs]]

## 2026-06-10 - Event Viewer Materialization Segments

- Topic: Support materialization bucket events with continuous timestamp windows in the event clip viewer.
- Labels: parking, pudo, streamlit, event-viewer, materialization.
- Branch: `boris/pudo_generic_materialization`.
- PR: Draft PR branch context; not pushed in this task.
- Change type: Tool UI/data loading change.
- Areas: `/workspace/WayveCode/wayve/ai/parking/tools/event_clip_viewer`.
- Changes:
  - Added continuous timestamp bundling per `runID` for materialization bucket rows.
  - Added sidebar controls for bundled materialization events and the split gap threshold.
  - Added event start/end/duration/row-count metadata to materialization rows.
  - Updated live and model-catalogue selected playback/autoplay to use materialization start/end windows when present.
  - Added a focused regression test for segment bundling.
  - Verified `git diff --check`, `bazel test //wayve/ai/parking/tools/event_clip_viewer:py_checks`, and HTTP `200 OK` on port `3001`.
- Task note: [[agent_tasks/2026/06/Week-2/2026-06-10-event-viewer-materialization-segments|2026-06-10 Event Viewer Materialization Segments]]

## 2026-06-10 - Main Event Viewer Browser Preload PR

- Topic: Add browser-side selected-clip preloading to the `main` event clip viewer.
- Labels: parking, pudo, streamlit, event-viewer, video-preload.
- Branch: `codex/event-viewer-browser-preload`.
- PR: #117834 (draft) — https://github.com/wayveai/WayveCode/pull/117834
- Change type: Tool UI/runtime fix.
- Areas: `/workspace/event_viewer_preload_pr/wayve/ai/parking/tools/event_clip_viewer`.
- Changes:
  - Created a clean main-based worktree and branch for the PR.
  - Removed selected-clip use of the Python `VideoUrlWarmer` background thread.
  - Reused the existing preload slider to compute nearby selected-clip URLs.
  - Added hidden browser `<video preload="auto">` elements for live, model-catalogue, and generated MP4 selected clips.
  - Verified `git diff --check`, `py_compile`, and `bazel test //wayve/ai/parking/tools/event_clip_viewer:py_checks`.
- Task note: [[agent_tasks/2026/06/Week-2/2026-06-10-main-event-viewer-preload-pr|2026-06-10 Main Event Viewer Preload PR]]

## 2026-06-10 - Event Viewer Console Link

- Topic: Restore a Console link for selected event viewer rows.
- Labels: parking, pudo, streamlit, event-viewer.
- Branch: `boris/pudo_generic_materialization`.
- PR: Draft PR branch context; not pushed in this task.
- Change type: Tool UI fix.
- Areas: `/workspace/WayveCode/wayve/ai/parking/tools/event_clip_viewer`.
- Changes:
  - Added a Console URL helper based on `runID` and `timestamp_unixus`.
  - Added an always-present `Open Console` button to the selected event info panel.
  - Kept source-table `URL` as a separate optional source link.
  - Verified `git diff --check`, `py_compile`, `bazel test //wayve/ai/parking/tools/event_clip_viewer:py_checks`, and HTTP `200 OK` on port `3001`.
- Task note: [[agent_tasks/2026/06/Week-2/2026-06-10-event-viewer-console-link|2026-06-10 Event Viewer Console Link]]

## 2026-06-10 - Event Clip Viewer Branch Correction

- Topic: Apply event clip viewer date-filter removal and browser-side selected-clip preloading to `boris/pudo_generic_materialization`.
- Labels: parking, pudo, streamlit, event-viewer, video-preload.
- Branch: `boris/pudo_generic_materialization`.
- PR: Draft PR branch context; not pushed in this task.
- Change type: Tool UI/runtime fix.
- Areas: `/workspace/WayveCode/wayve/ai/parking/tools/event_clip_viewer`.
- Changes:
  - Removed date cutoff filtering from SQL, materialization anchors, and anchor comparison code paths.
  - Removed selected-clip use of the Python `VideoUrlWarmer` background thread.
  - Added hidden browser `<video preload="auto">` elements for nearby selected clips.
  - Updated the default anchors path to the `parking_pudo_anchors_gates_20260610__2026-06-10-08-16` materialization.
  - Verified `git diff --check`, `py_compile`, and `bazel test //wayve/ai/parking/tools/event_clip_viewer:py_checks`.
- Task note: [[agent_tasks/2026/06/Week-2/2026-06-10-event-viewer-branch-correction|2026-06-10 Event Viewer Branch Correction]]

## 2026-06-10 - Event Clip Viewer Browser Preload

- Topic: Remove date filtering and replace the selected-clip Python video warmer with browser-side preloading.
- Labels: parking, pudo, streamlit, event-viewer, video-preload.
- Branch: detached worktree at `/workspace/event_clip_viewer`.
- PR: N/A; inspected PR #117577 for the browser preload pattern.
- Change type: Tool UI/runtime fix.
- Areas: `/workspace/event_clip_viewer/wayve/ai/parking/tools/event_clip_viewer`.
- Changes:
  - Removed selected-clip use of the `VideoUrlWarmer` background thread.
  - Added hidden browser `<video preload="auto">` elements to single and multi-camera selected playback.
  - Reused the existing preload slider to warm nearby live, model-catalogue, and generated MP4 clips.
  - Confirmed no date-filter controls remain in the event clip viewer path.
  - Updated the default anchors path to the `parking_pudo_anchors_gates_20260610__2026-06-10-08-16` materialization.
  - Verified `git diff --check`, `py_compile`, and `bazel test //wayve/ai/parking/tools/event_clip_viewer:py_checks`.
- Task note: [[agent_tasks/2026/06/Week-2/2026-06-10-event-clip-viewer-browser-preload|2026-06-10 Event Clip Viewer Browser Preload]]

## 2026-06-10 - Parking/PUDO Dataset Split

- Topic: Split generic Parking/PUDO dataset assembly into park/unpark and PUDO/UnPUDO bucket modules.
- Labels: parking, pudo, generic-materialization, refactor.
- Branch: `boris/pudo_generic_materialization`.
- PR: Draft PR branch context; not pushed in this task.
- Change type: Refactor.
- Areas: `/workspace/WayveCode/wayve/ai/services/sampling/datasets/parking_pudo`.
- Changes:
  - Added shared country-split bucket builder helper in `common.py`.
  - Added `parking_pudo/parking/buckets.py` for non-PUDO park/unpark filter registries and bucket lists.
  - Added `parking_pudo/parking/dataset.py` for standalone non-PUDO park/unpark materialisation.
  - Added `parking_pudo/pudo/buckets.py` for PUDO/UnPUDO filter registries and bucket lists.
  - Added `parking_pudo/pudo/dataset.py` for standalone PUDO/UnPUDO materialisation.
  - Trimmed `common.py` back to shared platform filters, exclusions, exclusion-routing helpers, and bucket assembly helper.
  - Simplified default and anchors datasets to concatenate the semantic bucket lists.
  - Registered `parking_pudo/parking` and `parking_pudo/pudo` in `DATASET_STORE`.
  - Verified focused `parking_pudo` sampling test passes.
- Task note: [[agent_tasks/2026/06/Week-2/2026-06-10-parking-pudo-dataset-split|2026-06-10 Parking/PUDO Dataset Split]]

## 2026-06-10 - Parking Hub static landing page

- Topic: New lightweight landing page to discover/open parking HTML reports and tools, hosted behind the SSO ingress like data_insights.
- Labels: parking, tooling, streamlit, aks, frontend, brand.
- Branch: `boris/parking-hub` (forked from `origin/main`).
- PR: #117733 (draft) — https://github.com/wayveai/WayveCode/pull/117733
- Change type: new tool / service scaffold.
- Areas: `wayve/ai/parking/tools/parking_hub/**`, `wayve/ai/parking/tools/event_clip_viewer/**`, `build_support/docker/autopublish_yaml_image_dirs.bzl`.
- Changes:
  - Added a FastAPI + uvicorn static hub that auto-discovers HTML reports in `content/` and lists apps from `registry.yaml` (link-out model).
  - Branded landing page with Wayve press-kit palette + Karla/Work Sans + white wordmark, London hero photo, and a UK/USA/DEU/JPN country strip.
  - Seeded `pre_intervention_augmentation.html` report and `event_clip_viewer` + `data-insights` (hosted) cards.
  - Bazel `py_docker_binary` + `data_insights`-style deploy scaffold (Makefile/autopublish/kustomize), static-only (no SA/secrets), host `parking-hub.sso.azr.wayve.{dev,ai}`, namespace `ai--parking`.
  - Deployed `event_clip_viewer` as its own Streamlit AKS app (`event-clip-viewer.sso.azr.wayve.{dev,ai}`) in `ai--datasets`, reusing `team-datasets-tools` workload identity + `datasets-databricks-api-token` secret; env-gated auth (Databricks token + `DefaultAzureCredential` in-cluster, azure-cli locally).
  - Verified: py_checks (flake8/ruff/ty/pytest) pass for both apps; hub local server routes 200/404; kustomize overlays render. Docker image build not run in sandbox (ACR 401) — CI builds it.
  - Gating: `ai--parking` namespace + DNS/TLS/SSO for the hub; event_clip_viewer needs the datasets identity to have grants on the parking SQL warehouse + `wayveprodperceptiondata` storage (verify on dev deploy).
- Task note: [[agent_tasks/2026/06/Week-2/2026-06-10-parking-hub-static-landing|2026-06-10 Parking Hub static landing page]]

## 2026-06-10 - Teal/Zebra PUDO Experiments

- Topic: Create teal-elk-amused Console note plus zebra-control UK PUDO licensing and Drift/PUDO experiments.
- Labels: parking, pudo, model-catalogue, on-road-experiment, licensing.
- Branch: `boris/parking-past30-no-standstill-gear-aug/main_cherrypick_new_driving`.
- PR: N/A.
- Change type: Model Catalogue operations.
- Areas: Model Catalogue model notes and on-road experiments.
- Changes:
  - Created model note `8772c517-5f64-4be0-9442-56460fe36a7d` on `teal-elk-amused`.
  - Created pending UK PUDO licensing interleave `3d908711-b4a6-47ee-a750-d466414b2d72` with `zebra-aquamarine-reclusive` control and `teal-elk-amused` variant.
  - Created pending UK Drift/PUDO interleave `a0e64893-d8a2-4cdc-bdbc-6fffbc1d4384` with default controller and PUDO/SBW config copied from the recent zebra setup.
- Task note: [[agent_tasks/2026/06/Week-2/2026-06-10-teal-zebra-pudo-experiments|2026-06-10 Teal/Zebra PUDO Experiments]]

### Parking/PUDO anchor mismatch debug
- Labels: parking, pudo, generic-materialization, debugging
- Branch: `boris/pudo_generic_materialization`
- PR: draft PR in progress
- Change type: fix/debug
- Areas: `wayve/ai/services/sampling/datasets/parking_pudo/signals.py`, event viewer comparison
- Changes:
  - Investigated `dc_pudo_uk` mismatches between event-table rows and generic anchor output.
  - Found stale Streamlit comparison root versus the still-running `3.0.68` Flyte execution.
  - Removed backward stop-snapping from generic park/PUDO anchors so anchors stay at smoothed gear-to-park.
  - Verified representative shifted and generic-extra samples with `debug_sampling`.
  - Notes: [[agent_tasks/2026/06/Week-2/2026-06-09-parking-pudo-anchor-mismatch-debug]]

## 2026-06-09 - Parking PUDO Anchors Driving 3.0.68 Rerun

- Topic: Rerun generic parking/PUDO anchors with driving binary `3.0.68`.
- Labels: parking, pudo, generic-materialization, anchors, flyte, binary-data.
- Branch: `boris/pudo_generic_materialization`.
- PR: Draft PR branch context; not pushed in this task.
- Change type: Code config change / image publish / Flyte run.
- Areas: `/workspace/WayveCode/wayve/ai/services/sampling/datasets/parking_pudo`.
- Changes:
  - Updated `parking_pudo/default` and `parking_pudo/anchors` to `binary_version="3.0.68"`.
  - Updated both dataset configs to `start_date="2025-12-01"` and `end_date="2026-06-07"`.
  - Published sampling image `wayveacrprodflyte.azurecr.io/sampling:bpudo3068-20260609`.
  - Submitted full `sample` workflow for `parking_pudo/anchors`, execution `ax4kdrxxjztvzvcxqxp2`.
- Task note: [[agent_tasks/2026/06/Week-2/2026-06-09-parking-pudo-anchors-driving-3068-rerun|2026-06-09 Parking/PUDO Anchors Driving 3.0.68 Rerun]]

## 2026-06-09 - Event Viewer Date Range

- Topic: Filter parking event-viewer tables and anchor materialization rows to `2025-12-01 <= run_date < 2026-05-17`.
- Labels: parking, pudo, streamlit, anchors, event-table.
- Branch: `boris/pudo_generic_materialization`.
- PR: Draft PR branch context; not pushed in this task.
- Change type: Tool code change.
- Areas: `/workspace/WayveCode/wayve/ai/parking/tools/event_clip_viewer`.
- Changes:
  - Added `MIN_EVENT_RUN_DATE = "2025-12-01"` and `MAX_EVENT_RUN_DATE_EXCLUSIVE = "2026-05-17"` to the viewer config.
  - Applied the cutoff to event-table SQL, materialization anchor parquet loading, and app-level normalization.
  - Bumped the local anchor cache key version so older cached anchor reads are not reused.
  - Verified `git diff --check`, viewer `py_checks`, and HTTP 200 on port 3001.
- Task note: [[agent_tasks/2026/06/Week-2/2026-06-08-event-clip-viewer-anchor-comparison|2026-06-08 Event Clip Viewer Anchor Comparison]]

## 2026-06-09 - Parking PUDO Anchor Comparison Rerun

- Topic: Rerun generic parking/PUDO anchors with temporary event-table comparison filters.
- Labels: parking, pudo, generic-materialization, anchors, trip-events, flyte.
- Branch: `boris/pudo_generic_materialization`.
- PR: Draft PR branch context.
- Change type: Code implementation / data rerun.
- Areas: `/workspace/WayveCode/wayve/ai/services/sampling/datasets/parking_pudo`.
- Changes:
  - Documented that event-notebook-only geofences and relaxed DC `inferred__intervention__what` filtering are temporary comparison choices.
  - Changed trip-table matching to 100m and synthesized hazard context over matched parked segments for forgotten-hazard PUDO cases.
  - Kept trip-only overlap buckets for debugging and CA/pre-CA out-of-scope filtering unchanged.
  - Verified sampling py_checks, published sampling image `wayveacrprodflyte.azurecr.io/sampling:borisindel-tmp-build-0.1.125-boris-pudo_generic_materialization-59584`, and submitted full anchors `sample` execution `a6vp6f5srkrncnt8k4g7`.
- Task note: [[agent_tasks/2026/06/Week-2/2026-06-09-parking-pudo-anchor-comparison-rerun|2026-06-09 Parking PUDO Anchor Comparison Rerun]]

## 2026-06-09 - Event Viewer Debug Runner Removal

- Topic: Remove the slow inline `debug_sampling` runner from the parking event viewer.
- Labels: parking, pudo, streamlit, anchors, debug-sampling.
- Branch: `boris/pudo_generic_materialization`.
- PR: Draft PR branch context; not pushed in this task.
- Change type: Tool/UI code change.
- Areas: `/workspace/WayveCode/wayve/ai/parking/tools/event_clip_viewer`.
- Changes:
  - Removed missing-anchor `debug_sampling` buttons and subprocess execution from the Streamlit app.
  - Kept anchor comparison tables and clip-player browsing.
  - Verified viewer py_checks and restarted Streamlit on `http://127.0.0.1:3001`.
- Task note: [[agent_tasks/2026/06/Week-2/2026-06-08-event-clip-viewer-anchor-comparison|2026-06-08 Event Clip Viewer Anchor Comparison]]

## 2026-06-08 - Parking PUDO Trip Context Anchors

- Topic: Add trip-table PUDO context to generic parking/PUDO anchors and rerun full anchors materialisation.
- Labels: parking, pudo, generic-materialization, anchors, trip-events, flyte.
- Branch: `boris/pudo_generic_materialization`.
- PR: Draft PR branch context; not pushed in this task.
- Change type: Code implementation / data rerun.
- Areas: `/workspace/WayveCode/wayve/ai/services/sampling/datasets/parking_pudo`.
- Changes:
  - Removed the temporary `parking_pudo/anchors_dc_pudo_uk` debug-only dataset and registration.
  - Confirmed missing sample `fme20014/2026-05-29--05-57-48...` is a DC UK gear-to-park stop with indicator off and completed dropoff trip events at the same location.
  - Added trip-table context from `inferred__robotaxi.trip_events`, aggregated per run before joining to avoid duplicating corpus frames.
  - Main PUDO/UnPUDO selectors now use cleaned hazard OR completed pickup/dropoff trip context; trip-only debug overlap buckets were added for `dc_pudo`, `dc_unpudo`, and `dc_pre_unpudo`.
  - Verified formatting and scoped parking/PUDO sampling tests, published sampling image `sha256:640f413f20cb9b46b7e59b35f42342ff08c0edecfd4950e3294765dc9bc444b6`, and submitted full anchors `sample` execution `a4hm2jqk2m4ntvrjjggb`.
- Task note: [[agent_tasks/2026/06/Week-2/2026-06-08-parking-pudo-anchor-gap-debug|2026-06-08 Parking PUDO Anchor Gap Debug]]

## 2026-06-08 - PUDO Generic Materialization Viewer Port

- Topic: Rebase `boris/pudo_generic_materialization` to main and port anchor comparison/debug viewer support.
- Labels: parking, pudo, generic-materialization, streamlit, anchors, debug-sampling.
- Branch: `boris/pudo_generic_materialization`.
- PR: Draft PR branch context; not pushed in this task.
- Change type: Branch maintenance / tool UI code change.
- Areas: `/workspace/WayveCode/wayve/ai/parking/tools/event_clip_viewer`, `/workspace/WayveCode/wayve/ai/services/sampling/datasets/debug_sampling.py`.
- Changes:
  - Rebasing skipped generated autopublish `bump-versions` conflicts and preserved the `700` run-id partition cap.
  - Added the event-table vs anchor comparison source to the main-folder viewer, defaulting to `dc_pudo_uk`.
  - Ported missing-event `debug_sampling` controls so Streamlit can run single-run/timestamp sampling diagnostics.
  - Verified `py_compile`, `git diff --check`, `bazel test //wayve/ai/parking/tools/event_clip_viewer:py_checks`, and HTTP 200 on port 3001.
- Task note: [[agent_tasks/2026/06/Week-2/2026-06-08-event-clip-viewer-anchor-comparison|2026-06-08 Event Clip Viewer Anchor Comparison]]

## 2026-06-08 - Parking PUDO Anchor Gap Debug

- Topic: Investigate why generic `dc_pudo_uk` anchors are much lower than the event notebook table.
- Labels: parking, pudo, generic-materialization, anchors, databricks.
- Branch: `boris/pudo_generic_materialization`.
- PR: N/A.
- Change type: Debugging / data analysis.
- Areas: `/workspace/WayveCode/wayve/ai/services/sampling/datasets/parking_pudo`.
- Changes:
  - Compared `51,355` deduped UK PUDO event-table rows against `13,219` local generic `dc_pudo_uk` anchors.
  - Split missing rows into `30,827` from runs with no generic anchor and `12,906` from runs with a different generic anchor timestamp.
  - Sampled missing rows against Databricks quality inputs and found active `low_steering_bias_confidence` and allowed-run-tag filters explain many no-anchor misses.
  - Computed nearest-anchor deltas showing many same-run misses are small timestamp offsets rather than missing events.
  - Replayed generic signal logic on quality-passing examples and found true PUDO/park classification differences where `park_start - 1` hazard context is false.
- Task note: [[agent_tasks/2026/06/Week-2/2026-06-08-parking-pudo-anchor-gap-debug|2026-06-08 Parking PUDO Anchor Gap Debug]]

## 2026-06-07 - Bazel Cache Cleanup Script

- Topic: Add a safe helper for deleting unused Bazel cache folders across multiple worktrees.
- Labels: bazel, cleanup, tooling, worktrees.
- Branch: `boris/pudo_generic_materialization`.
- PR: N/A.
- Change type: Tooling script.
- Areas: `/workspace/WayveCode/tools/delete_unused_bazel_caches.sh`.
- Changes:
  - Added a standalone script that maps current Git worktrees to exact Bazel output bases with `bazel info output_base`.
  - Keeps output-base directories used by current worktrees or referenced by live process command lines.
  - Prints a deletion plan and requires typing `DELETE` before running `sudo rm -rf`.
  - Leaves the shared repository cache alone by default, with an explicit `--include-repository-cache` option.
  - Verified help output, Bash syntax, and an aborting dry run; `shellcheck` was unavailable locally.
- Task note: [[agent_tasks/2026/06/Week-1/2026-06-07-bazel-cache-cleanup-script|2026-06-07 Bazel Cache Cleanup Script]]

## 2026-06-07 - Event Clip Viewer Rebase Reset

- Topic: Rebase `boris/event_clip_viewer` onto main and reset the event viewer subtree to main.
- Labels: parking, pudo, streamlit, git, rebase.
- Branch: `boris/event_clip_viewer`.
- PR: `#116721` branch context; not pushed in this task.
- Change type: Branch maintenance.
- Areas: `/workspace/event_clip_viewer/wayve/ai/parking/tools/event_clip_viewer`.
- Changes:
  - Rebased the existing `/workspace/event_clip_viewer` worktree branch onto `origin/main`.
  - Resolved event viewer add/add conflicts by restoring `wayve/ai/parking/tools/event_clip_viewer` from `origin/main`.
  - Added local commit `39c5f4c3814d` (`fix: restore event clip viewer from main`) so the event viewer path has no net diff against `origin/main`.
  - Verified `origin/main` is an ancestor of `HEAD` and both branch-level and path-specific diffs against `origin/main` are empty.
- Task note: [[agent_tasks/2026/06/Week-1/2026-06-07-event-clip-viewer-rebase-reset|2026-06-07 Event Clip Viewer Rebase Reset]]

## 2026-06-07 - Gear-Aware Controller X Validation

- Topic: Clarify controller agent-input x-position validation using predicted gear and controller-frame x convention.
- Labels: parking, pudo, controller, validation, reverse-gear.
- Branch: `codex/gear-aware-controller-x-validation`.
- PR: `#117112`.
- Change type: Controller validation fix.
- Areas: `/workspace/codex_gear_aware_controller_x_validation/wayve/robot/core/controller`.
- Changes:
  - Forked from `origin/main` in a clean worktree.
  - Confirmed `checkAgentToControllerXPositions` runs on controller-frame waypoints after reverse preprocessing, so x-position validation remains forward/non-negative for all predicted gears.
  - Kept `UNKNOWN` drive position rejected before x-position validation.
  - Added regression coverage for reverse predicted gear passing with controller-frame forward x and failing with negative controller-frame x.
  - Updated the x-position violation message to include the predicted drive position and expected controller-frame x-position convention.
  - Verified `bazel test //wayve/robot/core/controller:test_trajectory_validation` and `bazel test //wayve/robot/controller:controller_prod_reverse_integration_tests`.
- Task note: [[agent_tasks/2026/06/Week-1/2026-06-07-gear-aware-controller-x-validation|2026-06-07 Gear-Aware Controller X Validation]]

## 2026-06-07 - Mercurial Interleave Redeploy

- Topic: Redeploy the Guy-recipe gear-root Parking/PUDO model with interleave control group parking.
- Labels: parking, pudo, deployment, interleave-control, model-card.
- Branch: `boris/parking-past30-no-standstill-gear-aug/guy_recipe_gear_root`.
- PR: N/A.
- Change type: Model redeploy.
- Areas: `/workspace/guy_recipe_gear_root`, Parking/PUDO model-card Notion table.
- Changes:
  - Resolved `mercurial-sapphire-jellyfish` to `session_2026_06_06_22_07_21_guyroot`.
  - Deployed latest/100K checkpoint with `--enable_interleave_control --interleave_control_group parking`.
  - Retried after `/mnt/remote` trace write I/O failure and `/tmp` space failure; successful output used `/workspace/parking_deploy_output`.
  - Uploaded deployed model `contemplative-gold-lion`, session `session_2026_06_06_22_07_21_guyroot__mercurial-sapphire-jellyfish_interleave_control_v3`.
  - Verified Gen2 radar config includes X/Y/Z/range-rate/SNR and `points_per_scan=800`.
  - Updated the Parking/PUDO Notion model-card row/page for the deployed model.
- Task note: [[agent_tasks/2026/06/Week-1/2026-06-07-mercurial-interleave-redeploy|2026-06-07 Mercurial Interleave Redeploy]]

## 2026-06-07 - Event Viewer Materialization Anchors

- Topic: Extend the parking event clip viewer to load generic materialisation anchor buckets.
- Labels: parking, pudo, unpudo, streamlit, materialization, anchors, video.
- Branch: `boris/event_clip_viewer`.
- PR: `#116721` branch context; viewer changes local/unpushed.
- Change type: Tool/UI code change.
- Areas: `/workspace/WayveCode/wayve/ai/parking/tools/event_clip_viewer`.
- Changes:
  - Added a sidebar data-source toggle between the existing Databricks event table and a generic materialisation anchors path.
  - Added materialisation split and bucket selection by listing `dataset/dataset_split=<split>/dataset_bucket=<bucket>/` Parquet outputs.
  - Loaded anchor rows from Parquet using `runID`/`run_id` and `timestamp_unixus`, exposing the selected bucket as `event_type` for the existing clip-player UI.
  - Preserved the improved `boris/event_clip_viewer` SQL editor, model-catalogue video source, URL warmer, and `back_backward` camera support.
  - Added the default current `parking_pudo/anchors` path, the `pyarrow` Bazel dependency, README documentation, and a small `materialization.py` UI/source helper.
  - Reapplied the previously fixed video containment pattern to selected-clip single/multi-player views so they use iframe scrolling, fixed 16:9 video boxes, `object-fit: contain`, and larger height budgets.
  - Verified syntax, diff whitespace, viewer Ruff/Flake8/type Bazel targets, and a running Streamlit endpoint on `http://127.0.0.1:3001`.
- Task note: [[agent_tasks/2026/06/Week-1/2026-06-07-event-viewer-materialization-anchors|2026-06-07 Event Viewer Materialization Anchors]]

## 2026-06-07 - Parking Interleave Clamp Redeploy

- Topic: Align parking interleave-control waypoint clamping with the 03-20 reference branch and redeploy the trained model.
- Labels: parking, pudo, deployment, interleave-control, waypoint-clamping.
- Branch: `boris/parking-past30-no-standstill-gear-aug/main_cherrypick_new_driving`.
- PR: N/A.
- Change type: Deployment-wrapper fix / model redeploy.
- Areas: `/workspace/main_cherrypick_new_driving/wayve/ai/zoo/deployment/deployment_wrapper.py`, Parking/PUDO model-card Notion table.
- Changes:
  - Ported the 03-20-style parking interleave-control waypoint clamping so policy waypoints are clamped from the effective predicted/postprocessed gear.
  - Removed the extra `POLICY_PATH_POSITION_FORWARD` clamp from this branch.
  - Verified `bazel test //wayve/ai/zoo/deployment:test_deployment_py_test`.
  - Committed and pushed `c39bd6c4d494`.
  - Redeployed `gorilla-tan-splendid` latest/100K checkpoint with interleave control group `parking`; deployed nickname is `crane-indigo-sleepy`.
  - Verified exported Gen2 radar config includes X/Y/Z/range-rate/SNR and `points_per_scan=800`.
  - Updated the Parking/PUDO Notion model-card row/page for the deployed model.
- Task note: [[agent_tasks/2026/06/Week-1/2026-06-07-parking-interleave-clamp-redeploy|2026-06-07 Parking Interleave Clamp Redeploy]]

## 2026-06-06 - Guy Recipe PUDO Root Train

- Topic: Fork Guy's parking/PUDO recipe, update only the PUDO materialized root, and submit training.
- Labels: parking, pudo, training, data-root.
- Branch: `boris/parking-past30-no-standstill-gear-aug/guy_recipe_gear_root`.
- PR: N/A.
- Change type: Config change / training run.
- Areas: `/workspace/guy_recipe_gear_root/wayve/ai/si/configs/parking/parking_config.py`.
- Changes:
  - Forked from `origin/guy/parking-past30-no-standstill-gear-aug`.
  - Changed only `PUDO_BUCKETS_ROOT` to `parking/dev/2026_06_04_11_13_51_root_parking_pudo_unpudo_unparking_gear_fix`.
  - Preserved the existing Guy recipe, including its existing `unpudo_moving` group, without adding unsafe/pre-departure bucket groups from the newer branch.
  - Committed and pushed `1b18c018e301`.
  - Submitted job `175628` / `mercurial-sapphire-jellyfish` with session `session_2026_06_06_22_07_21_guyroot`; final observed state was `Dispatched`.
  - Freed `/workspace` disk space by removing an inactive Bazel output root and the shared Bazel disk cache after local config validation hit `No space left on device`.
- Task note: [[agent_tasks/2026/06/Week-1/2026-06-06-guy-recipe-pudo-root-train|2026-06-06 Guy Recipe PUDO Root Train]]

## 2026-06-06 - Parking PUDO Generic Materialization

- Topic: Add Parking/PUDO/Unpark/UnPUDO buckets using the official generic materialisation framework.
- Labels: parking, pudo, unpudo, unpark, materialization, generic-materialisation, buckets.
- Branch: `boris/pudo_generic_materialization`.
- PR: `#117075`.
- Change type: Code implementation.
- Areas: `/workspace/materialization/wayve/ai/services/sampling/datasets/parking_pudo`, `/workspace/materialization/wayve/ai/services/sampling/datasets/store.py`, `/workspace/materialization/wayve/ai/services/sampling/BUILD`.
- Changes:
  - Added the `parking_pudo/default` dataset and registered it in the services/sampling dataset store.
  - Implemented corpus-derived `park`, `pudo`, `unpark`, `unpudo`, `pre_unpark`, `pre_unpudo`, parking/PUDO gear-change, parking/PUDO pre-CA, and parking/PUDO short/long CA buckets split by country.
  - Removed the generic all-context gear-change/CA selectors in favor of explicit parking and PUDO selector names.
  - Added programmable gear smoothing, hazard cleanup, hazard-based PUDO/UnPUDO splitting over the parked/pre-movement departure interval, movement anchors after gear leaves park, and near-gear-change CA filters with the remain-stopped speed filter.
  - Replaced inherited `datasets.parking` exclusions with a local `parking_pudo` exclusion policy; removed global stopped-segment, geofence, first/last-index, and run-level autonomous exclusions while keeping per-frame `exclude_autonomous` for DC/post-CA.
  - Kept office-geofence handling inside PUDO context classification by ignoring geofenced hazard evidence, matching Zak's stop-type logic instead of dropping every geofenced frame globally.
  - Pushed commit `39f906b30c2d`, published sampling image `sha256:696f65cfde1d549bace850cd416eb3822543b44835b13136fd7bba6ac4b09928`, and submitted full reruns for `parking_pudo/default` (`arjghbl5t57t24hmk8nb`) and `parking_pudo/anchors` (`arv78r4gprwflcv2wsdv`).
  - Diagnosed those reruns failing because partition 0 had `49,044,708` rows and requested `200.0 GiB`, above the Ray worker half-memory cap of `179.5 GiB`; reduced the Spark partition planner run-id cap from `1000` to `700`.
  - Pushed commit `6a64024b1f3a`, published sampling image `sha256:7f7836ccd4a15e2f4eecc6d88a25399566be666e4fd5f0b47dee5dd3d416906d`, and submitted full 700-cap reruns for `parking_pudo/default` (`a7pb56zxxprtxdxqftsr`) and `parking_pudo/anchors` (`afxkknqm2p7rn79sx2t8`).
  - The first 700-cap submissions failed before materialisation because `branch_name` was passed without `branch_version`; resubmitted without branch metadata as `parking_pudo/default` (`an6qkxt4x5bd252b8wk6`) and `parking_pudo/anchors` (`ahz6slkd8llpl4649rzk`), both initially `RUNNING`.
  - Added explanatory selector/helper docstrings and split the internal signal derivation helpers into `parking_pudo/signals.py`.
  - Aligned park/PUDO and unpark/UnPUDO context classification to Zak's `index_of_park - 1` convention and matched `make_park_masks` first-assignment behavior for overlapping approach windows.
  - Added separate `unpark` and `unpudo` pre/short/long CA buckets around first-movement departure anchors, with UnPUDO classification using the same parked/pre-departure hazard scan as the event buckets.
  - Added failed-to pre/short/long CA buckets for `failed_to_park`, `failed_to_pudo`, `failed_to_unpark`, and `failed_to_unpudo`; these skip nearby-gear filtering but keep the 1s remain-stopped speed filter.
  - Split parking/PUDO intervention selectors into `parking_pudo/intervention_filters.py` and added focused tests for departure CA and failed-to CA behavior.
  - Added `parking_pudo/anchors`, an anchor-only companion dataset that mirrors every default bucket name/country split and collapses each bucket to its detected anchor frame using the same filtering logic.
  - Guarded anchor-only selectors so they emit an anchor only when the corresponding expanded bucket window would contain frames.
  - Updated public bucket names to follow BC naming conventions: `dc_*` for DC windows, `pre_ca_*` for pre-CA, and scenario-specific `ca_<scenario>_short/long_*` names for CA buckets.
  - Removed the internal `PARKING_PUDO_*_BUCKET_NAMES` conversion maps; filter dictionaries now use the final emitted bucket stem directly, with no bucket-name behavior change.
  - Published BC-name sampling image `sha256:6cdf613116fd4ea5af9e44988a6f449c35dd8d05e798536f3710f6198b8d1123`, terminated the initial filter-only reruns, and submitted full `sample` workflows for `parking_pudo/default` (`altdzx8gtggm4dpfdr97`) and `parking_pudo/anchors` (`ad59w7rlsf2x8r269755`).
  - Validated both full `sample` workflows finished successfully: `parking_pudo/default` produced `130` train buckets / `67,773,809` samples and `124` validation buckets / `10,212,496` samples; `parking_pudo/anchors` produced `130` train buckets / `782,562` anchor samples and `124` validation buckets / `115,107` anchor samples.
  - Published the sampling workflow image and started Flyte `filter_and_bucket_stage` for `parking_pudo/default` as execution `a4x7v7qkfsg4hk9b52sr`.
  - Added focused pandas filter tests and verified the full `//wayve/ai/services/sampling:test_datasets` target.
- Task note: [[agent_tasks/2026/06/Week-1/2026-06-06-parking-pudo-generic-materialization|2026-06-06 Parking PUDO Generic Materialization]]

## 2026-06-05 - Zak PUDO Bucket Reimplementation Notes

- Topic: Document Zak Murez's `zmurez/pudo` bucket generation and augmentation behavior for reimplementation.
- Labels: parking, pudo, unpudo, data-mix, sampler, documentation.
- Branch: `boris/event_creation_gear_fix` local worktree; inspected `origin/zmurez/pudo`.
- PR: N/A.
- Change type: Vault documentation.
- Areas: `/home/borisindelman/git/vault/agent_tasks/2026/06/Week-1/2026-06-05-zak-pudo-bucket-reimplementation-notes.md`, `wayve/ai/experimental/configs`, `wayve/ai/experimental/samplers/sampler.py`.
- Changes:
  - Summarized heuristic bucket generation for DC, large-error, start, indicator, gear-change, CA, parking, PUDO, and unparking buckets.
  - Recorded active `mcv_new_phase2` weights and the `mcv_new_phase2x_wta` override that moves large-error weight into alpha3 CA buckets.
  - Documented shared validity masks, per-bucket temporal windows, pseudocode/SQL-style recipes, and global image/route/state/ego-pose augmentations.
  - Compared the heuristic bucket path with `mcv_new_phase2_otf.yml` materialized partitions.
- Task note: [[agent_tasks/2026/06/Week-1/2026-06-05-zak-pudo-bucket-reimplementation-notes|2026-06-05 Zak PUDO Bucket Reimplementation Notes]]

## 2026-06-04 - PUDO Gear-Fix Root Training

- Topic: Update parking PUDO config to the gear-fixed materialized root and submit training.
- Labels: parking, pudo, unpudo, training, data-root.
- Branch: `boris/parking-past30-no-standstill-gear-aug/main_cherrypick_new_driving`.
- PR: N/A.
- Change type: Config change / training run.
- Areas: `/workspace/WayveCode/wayve/ai/si/configs/parking/parking_config.py`, Parking/PUDO model-card Notion table.
- Changes:
  - Updated `PUDO_BUCKETS_ROOT` to `parking/dev/2026_06_04_11_13_51_root_parking_pudo_unpudo_unparking_gear_fix`.
  - Committed and pushed `fae5fe152e52`.
  - Submitted corrected training job `174503` / `immense-peach-jackal` with `parking_bc_train_release_2026_5_21` after the initial 5.11 attempt failed on the tele-camera mode mismatch.
  - Monitored the corrected job; it failed before 1K at `trainer/global_step=0` because the new root is missing expected UNPUDO bucket parquet lists such as `dc_unpudo_move_uk` and `dc_unpudo_departure_uk`.
  - Created Notion model-card row `immense-peach-jackal (not interleaved)` with the failure diagnosis in the page body.
  - Updated config bucket names to match the actual gear-fixed root: `dc_unpudo_move_*` -> `dc_unpudo_*`, and departure -> pre-departure.
  - Verified `bazel test //wayve/ai/si:test_config_py_test_test_configs_utils_parking_release_2026_5_21_config_resolves`.
- Task note: [[agent_tasks/2026/06/Week-1/2026-06-04-pudo-gear-fix-root-training|2026-06-04 PUDO Gear-Fix Root Training]]

## 2026-06-04 - UnPUDO Event Streamlit Viewer

- Topic: Build a local viewer for UnPUDO gear-fix table events and camera clips.
- Labels: parking, pudo, unpudo, streamlit, databricks, video.
- Branch: `boris/hari_pudo`; promoted PR branch `boris/event_clip_viewer`.
- PR: `https://github.com/wayveai/WayveCode/pull/116721` (draft).
- Change type: Local tool / viewer.
- Areas: `/workspace/classifiers/tools/databricks_queries/unpudo_event_viewer`, `/workspace/event_clip_viewer/wayve/ai/parking/tools/event_clip_viewer`, `/home/borisindelman/git/vault/projects/hari-pudo-classifiers.md`.
- Changes:
  - Added a Bazel-run Streamlit app for `hive_metastore.parking.pudo_unpudo_unpark_events_gear_fix`.
  - Added event-type filtering, run ID substring filtering, row limits, event selection, and metadata display.
  - Built media-handler URLs centered on the selected event timestamp with configurable before/after seconds.
  - Rendered the five camera videos by default with a shared jump-to-event-timestamp control.
  - Added generated-blob MP4 playback for exact event matches in the Flyte output prefix, signed with a one-day SAS.
  - Kept live media-handler playback as fallback for rows without precomputed blob clips.
  - Added playlist autoplay over the loaded event rows, with looping and Play/Pause/Stop/Prev/Next controls.
  - Changed the default live-camera selection to `front_forward`.
  - Added a playback-speed sidebar control, defaulting to `3x`.
  - Updated the event-loading query to dedupe source rows by `(runID, timestamp_unixus)`.
  - Added pending viewer changes, not restarted yet: dedupe toggle, start playback at beginning, green event-timestamp border, live-source default, autoplay on single-event selection, and random-sample loading.
  - Moved the viewer into `wayve/ai/parking/tools/event_clip_viewer` on clean branch `boris/event_clip_viewer`, split modules below line-count guidance, added a README, and opened draft PR #116721.
  - Removed the `tools/databricks_queries/lib/BUILD` visibility change from the PR; final PR diff only adds the viewer package.
  - Added `compile_event_videos` CLI for concatenated per-event-type review videos, defaulting to 100 random deduped events per type, `front_forward`, `-15s/+15s`, `10x`, and a green event-time border.
  - Verified the PR branch with `bazel test //wayve/ai/parking/tools/event_clip_viewer:py_checks` and a temporary Streamlit run on port `3002`.
  - Verified `bazel test //tools/databricks_queries/unpudo_event_viewer:py_checks` and started the app on `http://127.0.0.1:3001/` in tmux session `unpudo-event-viewer`.
- Task note: [[agent_tasks/2026/06/Week-1/2026-06-04-unpudo-event-streamlit-viewer|2026-06-04 UnPUDO Event Streamlit Viewer]]

## 2026-06-03 - Zak Datamodule Parking Training

- Topic: Run Parking SI training with Zak Murez's experimental PUDO datamodule approach.
- Labels: parking, pudo, training, datamodule, experimental.
- Branch: `boris/zak_datamodule_parking_cherrypick` from `boris/parking-past30-no-standstill-gear-aug/main_cherrypick_new_driving`; supersedes scratch branch `boris/zak_datamodule`.
- PR: N/A.
- Change type: Scratch code integration / local training smoke.
- Areas: `/workspace/default/wayve/ai/experimental`, `/workspace/default/wayve/ai/si/datamodules`, `/workspace/default/wayve/ai/si/configs/parking/parking_config.py`.
- Changes:
  - Imported Zak's selected `mcv_new_phase2` experimental config, dataset, sampler, transform, annotation, prediction, split, and utility files into the branch.
  - Added `ZakExperimentalDataModule` to adapt Zak batches into SI `DataKeys` while preserving Zak's dataloader, sampler, and augmentations.
  - Rebased the integration onto the working parking branch and wired `parking_bc_train_zak_mcv_new_phase2_release_2026_5_21` through the branch's `parking_config.py`.
  - Fixed missing experimental dependencies/assets (`nuscenes-devkit`, LFS `.npz` files, blank `signs_gemini.txt`) and avoided the SI/experimental Bazel dependency cycle.
  - Verified `bazel build //wayve/ai/si:train`, `bazel test //wayve/ai/si/datamodules:test_zak_experimental`, and a one-step local train from `/workspace/default` with release `WFM_v1.4.0.550M(1.5.0)`.
  - Recorded that the interrupted scratch-branch dispatch did not produce a job id and left no local submit process running.
  - Submitted Surfboard job `174118` / `proactive-mallard-jade` with session `session_2026_06_03_20_13_31_zak521`; final observed state was `Running` on AKS.
- 2026-06-04 update:
  - Investigated the failed follow-up batch without starting another remote run.
  - Identified job `174286` as failing on agent-added diagnostic logging (`WayveLogger.warn()` received duplicate `rows` kwargs), so it did not prove the underlying Zak loader state.
  - Tested local no-dev behavior: full no-dev on one local GPU attempts to construct all `263,601` train entries and is not representative of the 64-rank remote shard; bounded no-dev via parquet fractions is the practical local smoke path.
  - Reproduced and fixed the real local loader bug in bounded no-dev: `SingleRunDataset._post_init()` still needed per-frame `dist` after the cumulative-distance fix.
  - Verified `bazel test //wayve/ai/experimental:test_single_run`; bounded no-dev now constructs the Zak train dataset and sampler, then fails on the first SI model forward with a CUDA index assert likely caused by adapter categorical/shape mapping, not Zak dataloader construction.
  - Recommendation before the next dispatch: add pre-forward validation for the Zak-to-SI adapter fields (`camera_extrinsics`, `vehicle_indicator_state`, `vehicle_country`, `vehicle_model`, `vehicle_gear_direction`, `stopping_mode`, `parking_mode`) and rerun bounded no-dev locally with stricter CUDA diagnostics.
  - Confirmed from Zak's latest W&B/Surfboard runs that he uses `TRAIN_PARQUET_FRACTION=1` with `mcv_new_phase2x_wta.yml` on 16 H100 nodes; the 4-node SI run had roughly 4x more eager-loaded run parquets per rank.
  - Added cache-only parquet wiring: `DataModule` now forwards `parquet_fallback_delta_table`, the Zak SI adapter exposes `parquet_cache_only`, and parking's Zak datamodule config sets it true.
  - Verified the cache-only wiring with `bazel test //wayve/ai/si/datamodules:test_zak_experimental` and `bazel test //wayve/ai/si:test_config_py_test_test_configs_utils_parking_release_2026_5_21_config_resolves`.
  - Disabled optional parking visualization metrics only for the Zak datamodule mode after job `174492` failed on singleton Zak `POLICY_TIME_DELTA` shape `[1, 11]`.
  - Locally validated bounded non-dev Zak training for 2 steps after the metric bypass, then pushed `96a6a0e741c3` and dispatched 4-node P1 job `174514` / `perpetual-anteater-crimson` with cached parquets and `train_parquet_fraction=0.25`.
- Task note: [[agent_tasks/2026/06/Week-1/2026-06-03-zak-datamodule-parking-training|2026-06-03 Zak Datamodule Parking Training]]

## 2026-06-05 - Event Viewer Model-Catalogue Video Source

- Topic: Improve parking event Streamlit video loading with model-catalogue camera URLs.
- Labels: parking, pudo, unpudo, streamlit, model-catalogue.
- Branch: `boris/event_clip_viewer`.
- PR: `https://github.com/wayveai/WayveCode/pull/116721`.
- Change type: Code change, local.
- Areas: `/workspace/event_clip_viewer/wayve/ai/parking/tools/event_clip_viewer`.
- Changes:
  - Added model-catalogue API resolution for camera MP4 URLs and event seek offsets, with run-level Streamlit caching.
  - Added a `Model catalogue camera videos` source alongside existing media-handler and generated blob modes.
  - Updated video components to start catalogue playback at `event - before_seconds`, mark the event with the existing green border, and stop/advance at `event + after_seconds`.
  - Added `back_backward` camera support, a SQL text area as the source of loaded rows, event-type filtering derived from the query result, and multi-camera autoplay with current event metadata/source URL inside the player.
  - Restarted the local viewer on `http://127.0.0.1:3001/`.
  - Verified Ruff, Flake8, type checks, Streamlit health, and a direct catalogue API sample.
- Task note: [[projects/hari-pudo-classifiers#2026-06-05 Event Viewer Model-Catalogue Video Source|Hari PUDO classifiers project note]]

## 2026-06-05 - Anchor-Expanded UnPUDO Flyte Clips

- Topic: Dispatch anchor-expanded UnPUDO run clips with Flyte.
- Labels: parking, pudo, unpudo, flyte, video-generation.
- Branch: `boris/hari_pudo`.
- PR: N/A.
- Change type: Local code change and Flyte execution.
- Areas: `/workspace/classifiers/wayve/ai/datasets/annotation_operations_tools/scripts/generate_run_clips_input.py`, `/workspace/classifiers/wayve/ai/datasets/flyte`.
- Changes:
  - Preserved exact source anchor timestamps as output `timestamp_unixus` after nearest corpus matching in `generate_run_clips_input.py`.
  - Generated `2030` run-clips input rows from `hive_metastore.parking.pudo_unpudo_unpark_events_gear_fix`, expanding each selected UnPUDO event from `gearchange_timestamp` to `timestamp_unixus` every 5s plus exact end.
  - Input parquet: `abfss://databricks-users@wayveproddataset.dfs.core.windows.net/borisindelman/unpudo_standstill/anchors_20260605_201515_UTC/run_clips_input.parquet`.
  - Published/reused `datasets_flyte_workflow` image digest `sha256:74479ab9e03b6d604a5a7ea126f81615289f740d9946c6063c58f715e9e037da`.
  - Dispatched Flyte execution `anfr26csqwll76rf9m54` with 20s clips, 3x speed, green event marker, `drop_rows_with_missing_camera_video_files=true`, `chunk_size=1`, and `num_concurrent_tasks=50`.
  - Output prefix: `az://wayveprodperceptiondata/qualitymatch-data/flyte_remote/videos/borisindelman/unpudo_standstill/anchors_20260605_201515_UTC/gen2/`.
- Task note: [[projects/hari-pudo-classifiers|HARI PUDO Classifiers]]

## 2026-06-04 - PR 115840 LR Scheduler Test Comment

- Topic: Clarify LR scheduler test cases after PR review feedback.
- Labels: training, tests, pr-review.
- Branch: `boris/lr-scheduler-num-steps`.
- PR: `https://github.com/wayveai/WayveCode/pull/115840`.
- Change type: Test clarification, uncommitted.
- Areas: `/workspace/pr-115840/wayve/ai/si/test/models/test_training.py`.
- Changes:
  - Made `trainer_max_steps` explicit in the `test_configure_optimizers_uses_lr_scheduler_num_steps` parametrization.
  - Updated the `100 > 30` one-cycle and plateau cases to pass `100` as the override and `30` as trainer max steps.
  - Kept expected scheduler `total_steps` derived from the override when set, otherwise trainer max steps.
  - `git diff --check` passed; focused Bazel validation was blocked during analysis by Azure ACR `401 Unauthorized` for `wayve.azurecr.io/azure-storage/azurite`.
- Task note: [[agent_tasks/2026/06/Week-1/2026-06-04-pr-115840-lr-scheduler-test-comment|2026-06-04 PR 115840 LR Scheduler Test Comment]]

## 2026-06-08 - Event Creation Gear Dedup

- Topic: Deduplicate final PUDO/UnPUDO event keys after gear smoothing.
- Labels: parking, event-creation, gear-smoothing, notebook.
- Branch: `boris/event_creation_gear_fix`.
- PR: N/A.
- Change type: Notebook code change, uncommitted.
- Areas: `/workspace/WayveCode/wayve/ai/parking/notebooks/pudo_unpudo_event_detection.ipynb`.
- Changes:
  - Added one final event-key dedupe stage after event-type union and date filtering.
  - Dedupe key is `(runID, timestamp_unixus, event_type)`.
  - Tie-breaks prefer rows with coordinates, then gear-change metadata, then closest transition distance.
  - Removed the `ENABLE_GEAR_SMOOTHING` flag so gear smoothing is always applied.
  - Reviewed PR comments and added post-cast gear validation, leading-short-segment smoothing to next stable gear, trip-table candidate progress metrics, and a final event-key uniqueness guard.
  - Updated disengagement blacklist behavior so blacklisted PUDO/park main-window disengagements remove the event row; UnPUDO blacklist semantics remain separate.
  - Validated notebook JSON, extracted-code AST parse, and `git diff --check`.
- Task note: [[agent_tasks/2026/06/Week-2/2026-06-08-event-creation-gear-dedup|2026-06-08 Event Creation Gear Dedup]]

## 2026-06-03 - Zmurez PUDO Data Loading Investigation

- Topic: Inspect Zak Murez's `zmurez/pudo` experimental data loading and compare it with SI parking data modules.
- Labels: parking, pudo, data-loading, experimental, investigation.
- Branch: detached `origin/zmurez/pudo` in `/workspace/zak` at `563c88427a65`.
- PR: N/A.
- Change type: Worktree setup / investigation note.
- Areas: `/workspace/zak/wayve/ai/experimental`, `/workspace/WayveCode/wayve/ai/si/configs/parking/parking_config.py`.
- Changes:
  - Created `/workspace/zak` as a detached worktree on the latest fetched `origin/zmurez/pudo`.
  - Identified `mcv_new_phase2.yml -> mcv_new_base.yml -> mcv_new_base0.yml` as the relevant experimental training config chain.
  - Traced data loading through ExpAI `DataModule`, `IpaceDataset`, raw run-list splits, JSON/NPZ PUDO annotations, and heuristic sampler bins.
  - Compared against SI `BcDataModuleCfg` / materialized bucket usage in `parking_config.py`.
  - Concluded the experimental datamodule is not directly reusable as-is for SI training; the reproducible path is to port the selection predicates into SI-compatible buckets or datapipe filters.
- Task note: [[agent_tasks/2026/06/Week-1/2026-06-03-zmurez-pudo-data-loading-investigation|2026-06-03 Zmurez PUDO Data Loading Investigation]]

## 2026-06-01 - HARI PUDO Classifiers

- Topic: Create worktree and initial vault project page for Tom Boehling's HARI PUDO classifier workflow.
- Labels: parking, pudo, hari, classifiers, video-generation.
- Branch: `tomboehling/hari_pudo`.
- PR: N/A.
- Change type: Worktree setup / investigation note.
- Areas: `/workspace/classifiers`, `/home/borisindelman/git/vault/projects/hari-pudo-classifiers.md`.
- Changes:
  - Created `/workspace/classifiers` as a git worktree on `tomboehling/hari_pudo`.
  - Fast-forwarded the local branch to `origin/tomboehling/hari_pudo` at `09109967f05c`.
  - Read the linked video generation README and summarized the Spark, Flyte, HARI upload, annotation download, sampled-frame, train, and infer workflow.
  - Recorded Tom's HARI dataset and pipeline links plus initial risks before starting implementation work.
- Project note: [[projects/hari-pudo-classifiers|HARI PUDO classifiers]]

## 2026-06-01 - Parking PUDO Data Mix Train

- Topic: Rebalance parking PUDO/UNPUDO data mix and submit 30K training.
- Labels: parking, pudo, unpudo, training, data-mix.
- Branch: `boris/parking-past30-no-standstill-gear-aug/main_cherrypick`.
- PR: N/A.
- Change type: Config change / training run.
- Areas: `/workspace/default/wayve/ai/si/configs/parking/parking_config.py`.
- Changes:
  - Updated parking config to use the 2026-05-31 PUDO/UNPUDO materialized root.
  - Rebalanced weights to 50% driving, 20% PUDO, 22% UNPUDO, 8% gear shift, and 0% unparking.
  - Split active UNPUDO as 10% short DC, 6% CA moving, and 6% departure; kept long DC, general CA, unsafe CA, and unparking at 0%.
  - Committed `21bd35f8a9bf` and submitted job `172591` / `purple-steady-toucan` for 30k steps with a 100k LR scheduler horizon.
  - Monitored W&B to `trainer/global_step=5505` with state `running`; created Notion row `purple-steady-toucan (not interleaved)`.
- Task note: [[agent_tasks/2026/06/Week-1/2026-06-01-parking-pudo-data-mix-train|2026-06-01 Parking PUDO Data Mix Train]]

## 2026-05-31 - UnPUDO Materialization Buckets

- Topic: Update parking PUDO/UnPUDO materialization notebook bucket definitions.
- Labels: parking, pudo, unpudo, materialization, notebook.
- Branch: `alon/unpudo_unsafe_fix`.
- PR: N/A.
- Change type: Notebook code change.
- Areas: `/workspace/materialization/wayve/ai/parking/notebooks/pudo_unpudo_materialization.ipynb`.
- Changes:
  - Disabled future-speed filtering and long-UnPUDO event-length filtering.
  - Kept base UnPUDO CA buckets general, without unsafe/moving filters.
  - Added separate UnPUDO unsafe CA buckets using speed at CA and moving CA buckets using speed at CA or around CA+1s.
  - Split joined AV bucket dictionaries explicitly and preserved DC future gear annotation while disabling the speed filter.
  - Split unsafe/moving feature flags and scoped the moving-speed lookup to failed-to-UnPUDO candidate runs.
  - Wired future-speed flags together and added runtime guards for duplicate buckets plus unsafe pre-CA buckets.
  - Updated parking config consumption with `unpudo_dc`, zero-weight `unpudo_dc_long`, unsafe CA, moving pre-CA, and zero-weight general CA groups.
  - Added DC UnPUDO departure buckets from -1s to movement start and move buckets from movement start to +10s.
  - Changed DC gear-change bucket window to 0s through +0.5s.
  - Removed materialization-side GPS/10m/acceleration movement-start recomputation in favor of the event timestamp.
- Task note: [[agent_tasks/2026/05/Week-5/2026-05-31-unpudo-materialization-buckets|2026-05-31 UnPUDO Materialization Buckets]]

## 2026-05-31 - LR Scheduler Horizon

- Topic: Decouple BC LR scheduler horizon from trainer stop steps.
- Labels: parking, training, lr-schedule, bc.
- Branch: `boris/parking-past30-no-standstill-gear-aug/merge_main`.
- PR: N/A.
- Change type: Code change / regression test.
- Areas: `/workspace/WayveCode/wayve/ai/si/config.py`, `/workspace/WayveCode/wayve/ai/si/models/training.py`, `/workspace/WayveCode/wayve/ai/si/test/models/test_training.py`.
- Changes:
  - Added `lr_scheduler_num_steps` to configure scheduler `total_steps` independently of training `num_steps`.
  - Kept fallback behavior unchanged by using `trainer.max_steps` when the override is not set.
  - Added a focused regression test for the scheduler horizon override.
  - Pushed commit `7b291aee4b2e` and submitted job `172180` / `taciturn-gecko-peach` for 30k steps with a 100k LR scheduler horizon.
- Task note: [[agent_tasks/2026/05/Week-5/2026-05-31-lr-scheduler-horizon|2026-05-31 LR Scheduler Horizon]]

## 2026-05-30 - Parking Past30 Port

- Topic: Port selected parking PUDO route-shortening and deployment interleave changes onto main.
- Labels: parking, pudo, datamodule, deployment, route-shortening.
- Branch: `codex/parking-port-past30`.
- PR: N/A.
- Change type: Code port / merge.
- Areas: `/workspace/default/wayve/ai/si`, `/workspace/default/wayve/ai/zoo`, `/workspace/default/wayve/ai/lib/data/pipes`.
- Changes:
  - Copied parking datamodule and config content from `origin/guy/parking-past30-no-standstill-gear-aug` while excluding `allow_short_path` and `enable_early_path_gating`.
  - Added route-shortening data keys, parking helpers, OTF wiring, and route-map shortening.
  - Added parking deployment interleave control while preserving main deployment kwargs and checkpoint backfills.
  - Verified focused parking data, datamodule, deployment wrapper checks; route and parent SI checks blocked by ACR auth.
- Task note: [[agent_tasks/2026/05/Week-5/2026-05-30-parking-past30-port|2026-05-30 Parking Past30 Port]]

## 2026-05-28 - PUDO Buffer0 Parkmode 80k Training

- Topic: Submit PUDO BC 80k training after park-mode and gear-cleanup changes.
- Labels: parking, pudo, training, surfboard.
- Branch: `boris/05-21-updated-pudo-config`.
- PR: N/A.
- Change type: Training run.
- Areas: `/workspace/WayveCode/wayve/ai/si/configs/parking`, Surfboard job `170655`.
- Changes:
  - Submitted `parking_bc_train_release_2026_6_21` with `pudo_bc_datamodule` for 80k steps.
  - Used image `wayvetraining.azurecr.io/scaled-intelligence:3987649fd43c7d0fc47c1ce594c087f883674972`.
  - Monitored job `170655` / `eagle-feisty-aqua` until `Running` on AKS.
- Task note: [[agent_tasks/2026/05/Week-5/2026-05-28-pudo-buffer0-parkmode-80k-train|2026-05-28 PUDO Buffer0 Parkmode 80k Train]]

## 2026-05-28 - Parking Park-Mode Blackout Semantics

- Topic: Fix `park_mode_blackout_probability=0.0` to respect explicit park-mode enable flags.
- Labels: parking, datamodule, park-mode, tests.
- Branch: `boris/05-21-updated-pudo-config`.
- PR: N/A.
- Change type: Code fix / regression test.
- Areas: `/workspace/WayveCode/wayve/ai/si/datamodules/parking.py`, `/workspace/WayveCode/wayve/ai/si/datamodules/test/test_parking_unit.py`.
- Changes:
  - Preserved explicit parking/parked park-mode flags when blackout probability is 0.
  - Kept sampled park-mode+blackout versus route-shortening override for probabilities greater than 0.
  - Updated the unit test and verified the parking unit file plus package ruff lint.
  - Removed deployment emission of `PARKED_STATE`; deployment now keeps only derived `PARKING_MODE` for end-of-route parking.
  - Changed parking gear cleanup to release-style neutral shifting with `gear_label_cleanup_stop_buffer_sec=0.0` instead of symmetric standstill expansion.
- Task note: [[agent_tasks/2026/05/Week-5/2026-05-28-park-mode-blackout-semantics|2026-05-28 Park Mode Blackout Semantics]]

## 2026-05-27 - Parking PUDO 2026.6.21 Training Restart

- Topic: Push parking 2026.6.21 startup fixes and restart PUDO BC training.
- Labels: parking, pudo, training, surfboard, config.
- Branch: `boris/05-21-updated-pudo-config`.
- PR: N/A.
- Change type: Code fix / training run.
- Areas: `/workspace/WayveCode/wayve/ai/si/models`, `/workspace/WayveCode/wayve/ai/si/configs/parking`, Surfboard job `170265`, `/home/borisindelman/git/vault/agent_tasks`.
- Changes:
  - Pushed fixes for parking navigation plus indicator memory, deployment driving parameter keys, and 2026.6.21 behavior-control output heads.
  - Submitted `parking_bc_train_release_2026_6_21` with `pudo_bc_datamodule` for 80k steps.
  - Monitored W&B history until `trainer/global_step=5154` while the run remained `running`.
  - Followed up after completion: created the Notion model-card row and recorded Alpha3 `71.1%` plus current-latest PUDO/UNPUDO `7.0%`.
- Task note: [[agent_tasks/2026/05/Week-4/2026-05-27-parking-pudo-621-training-restart|2026-05-27 Parking PUDO 2026.6.21 Training Restart]]

## 2026-05-26 - Eval Studio Suite Scores Skill

- Topic: Create `eval-studio-suite-scores` ParkingSkills skill.
- Labels: eval-studio, codex-skill, model-scorecard, parking.
- Branch: `agents_day`.
- PR: N/A.
- Change type: Skill / helper script.
- Areas: `/home/borisindelman/git/ParkingSkills/skills/eval-studio-suite-scores`, `/home/borisindelman/git/vault/agent_tasks`.
- Changes:
  - Added a token-efficient skill for resolving model artefact IDs and fetching Eval Studio suite scores.
  - Added `scripts/get_scores.sh` to resolve executions by suite version or suite UUID and batch score lookups to match Scorecard semantics.
  - Validated the skill and helper against `armadillo-adaptable-maroon`.
  - Updated the helper to expose the Suite Results `less_wrong_score` category value separately from `scorecard_score`.
- Task note: [[agent_tasks/2026/05/Week-5/2026-05-26-eval-studio-suite-scores-skill|2026-05-26 Eval Studio Suite Scores Skill]]

## 2026-05-24 - Parking BC New Driving Training

- Topic: Submit Parking BC training with `parking_bc_new_driving_datamodule` and trimmed moving UnPUDO buckets.
- Labels: parking, training, surfboard, pudo, unpudo.
- Branch: `boris/parking-moving-buckets-config`.
- PR: N/A.
- Change type: Training run.
- Areas: `/workspace/.codex-borisindelman/worktrees/7992/WayveCode/wayve/ai/si/configs/parking`, Surfboard job `168353`.
- Changes:
  - Submitted training with `+mode=parking_bc_train_release_2026_5_11` and `+datamodule=parking_bc_new_driving_datamodule`.
  - Published image `wayvetraining.azurecr.io/scaled-intelligence:6e97857c4e9b3cebadfa432042deeb7a513ee23f`.
  - Monitored job `168353` until `Running`.
- Task note: [[agent_tasks/2026/05/Week-4/2026-05-24-parking-bc-new-driving-training|2026-05-24 Parking BC New Driving Training]]

## 2026-05-24 - Parking Moving Buckets Config

- Topic: Update parking BC config to consume moving UnPUDO buckets.
- Labels: parking, pudo, unpudo, config, training-data.
- Branch: `boris/parking-moving-buckets-config`.
- PR: N/A.
- Change type: Config change.
- Areas: `/workspace/.codex-borisindelman/worktrees/7992/WayveCode/wayve/ai/si/configs/parking`, `/home/borisindelman/git/vault/agent_tasks`.
- Changes:
  - Created branch from `origin/guy/parking-past30-no-standstill-gear-aug`.
  - Updated `PUDO_BUCKETS_ROOT` to the `2026_05_19_20_07_34` materialization with moving UnPUDO buckets.
  - Split UnPUDO weight into base and moving child budgets and added six `*_unpudo_moving_*` train buckets.
  - Verified with `git diff --check` and `bazel build //wayve/ai/si:si`.
- Task note: [[agent_tasks/2026/05/Week-4/2026-05-24-parking-moving-buckets-config|2026-05-24 Parking Moving Buckets Config]]

## 2026-05-24 - Parking Indicator Memory Validation

- Topic: Keep indicator memory enabled for parking without re-enabling behavioral control.
- Labels: parking, deployment, indicator-memory, behavior-control.
- Branch: `boris/parking-past30-no-standstill-gear-aug/no_behave`.
- PR: N/A.
- Change type: Code fix / deployment validation.
- Areas: `/workspace/WayveCode/wayve/ai/si/configs/parking`, `/workspace/WayveCode/wayve/ai/si/models`, `/workspace/WayveCode/wayve/ai/si/test/models`.
- Changes:
  - Restored `use_indicator_memory=True` in parking training configs while leaving behavior control disabled.
  - Allowed the parking deployment wrapper to use navigation input and indicator memory together.
  - Added a regression test for parking deployment with navigation and indicator memory enabled.
- Task note: [[agent_tasks/2026/05/Week-4/2026-05-24-parking-indicator-memory-validation|2026-05-24 Parking Indicator Memory Validation]]

## 2026-05-24 - Checkout PUDO/UNPUDO Materialization Notebook

- Topic: Check out the parking PUDO/UNPUDO materialization notebook from `origin/alon/unpudo_unsafe_fix`.
- Labels: parking, pudo, unpudo, notebook, git-checkout.
- Branch: detached `HEAD`; source `origin/alon/unpudo_unsafe_fix`.
- PR: N/A.
- Change type: Notebook checkout.
- Areas: `/workspace/.codex-borisindelman/worktrees/7992/WayveCode/wayve/ai/parking/notebooks`, `/home/borisindelman/git/vault/agent_tasks`.
- Changes:
  - Checked out `wayve/ai/parking/notebooks/pudo_unpudo_materialization.ipynb` from `origin/alon/unpudo_unsafe_fix`.
  - Verified the notebook matches the source branch.
  - Left the notebook staged as a result of the path checkout.
- Task note: [[agent_tasks/2026/05/Week-4/2026-05-24-checkout-pudo-unpudo-materialization-notebook|2026-05-24 Checkout PUDO/UNPUDO Materialization Notebook]]

## 2026-05-24 - Wayve LLM Wiki Deep Dive

- Topic: Wayve MLE LLM wiki extension for parking/PUDO, navigation, latent actions, and multitask/multi-head model development.
- Labels: llm_wiki, parking, pudo, navigation, latent-actions, multitask, model-architecture.
- Branch: N/A.
- PR: N/A.
- Change type: Documentation / knowledge-base ingest.
- Areas: `/home/borisindelman/git/vault/llm_wiki`, `/home/borisindelman/git/vault/agent_tasks`.
- Changes:
  - Added source summaries for Notion and Google Drive ingests.
  - Added system pages for parking/PUDO product, event pipeline, deployment/release, navigation conditioning, latent actions, and multi-driving heads.
  - Added parking/PUDO open questions.
  - Created wiki index/log entries for the ingest.
- Task note: [[agent_tasks/2026/05/Week-4/2026-05-24-wayve-llm-wiki-deep-dive|2026-05-24 Wayve LLM Wiki Deep Dive]]

## 2026-05-24 - LLM Wiki Newcomer Readiness

- Topic: Make the Wayve MLE LLM wiki ready and useful for a newcomer.
- Labels: llm_wiki, onboarding, parking, pudo, mle.
- Branch: N/A.
- PR: N/A.
- Change type: Documentation / knowledge-base maintenance.
- Areas: `/home/borisindelman/git/vault/llm_wiki`, `/home/borisindelman/git/vault/agent_tasks`.
- Changes:
  - Added newcomer onboarding path, MLE role map, and first parking/PUDO change checklist.
  - Reworked README and index around reading paths.
  - Expanded glossary and refreshed parking hub caveats.
- Task note: [[agent_tasks/2026/05/Week-4/2026-05-24-llm-wiki-newcomer-readiness|2026-05-24 LLM Wiki Newcomer Readiness]]

- Topic: Parking 2026.6.21 PUDO train startup failure
  - Labels: parking, training, config
  - Branch: `boris/05-21-updated-pudo-config`
  - PR: n/a
  - Change type: fix
  - Areas: `wayve/ai/si/configs/parking/parking_config.py`, `wayve/ai/si/test/configs/test_config.py`
  - Changes:
    - Fixed `ParkingModelRelease2026_6_21Cfg` output adaptor interpolation by setting explicit WFM Feb dimensions and output flags.
    - Added config regression coverage for `parking_bc_train_release_2026_6_21` with `pudo_bc_datamodule`.
    - Documented in [[agent_tasks/2026/05/Week-4/2026-05-24-parking-621-pudo-train-failure]].

## 2026-05-24 - Condor Fearless Ivory PUDO Licensing

- Topic: Add Parking/PUDO model note and create UK licensing experiment for `condor-fearless-ivory`.
- Labels: parking, pudo, licensing, on-road-experiment, model-catalogue.
- Branch: `boris/parking-past30-no-standstill-gear-aug/no_behave`.
- PR: N/A.
- Change type: Model Catalogue / Console operation.
- Areas: `https://console.sso.wayve.ai/model/session_2026_05_22_08_40_39_si_parking_bc_train_release_2026_5_11_no_behave_no_imem_params_80k__lavender-ferret-ubiquitous_interleave_control_v1`, `https://console.sso.wayve.ai/on-road-experiments/29332a9a-f91b-478d-83cd-e1bc58e9a2d6`, `/home/borisindelman/git/vault/agent_tasks`.
- Changes:
  - Checked out `/tmp/wayvecode-fuchsia-model-branch` to `boris/parking-past30-no-standstill-gear-aug/no_behave`.
  - Added the standard Parking/PUDO `model_change_note` to deployed model `condor-fearless-ivory`.
  - Created UK PUDO licensing on-road experiment `29332a9a-f91b-478d-83cd-e1bc58e9a2d6` in `pending_approval`.
- Task note: [[agent_tasks/2026/05/Week-4/2026-05-24-condor-fearless-ivory-pudo-licensing|2026-05-24 Condor Fearless Ivory PUDO Licensing]]

## 2026-05-24 - Condor / Unofficial Drift PUDO Interleave Experiment

- Topic: Create US Drift/PUDO interleave experiment for `unofficial-cyan-pigeon` vs `condor-fearless-ivory`.
- Labels: parking, pudo, drift, on-road-experiment, interleave, model-catalogue.
- Branch: `/tmp/wayvecode-fuchsia-model-branch` reported `binariser-autobump-driving-3.0.62` at final status check; branch changed outside this experiment creation step.
- PR: N/A.
- Change type: Model Catalogue / Console operation.
- Areas: `https://console.sso.wayve.ai/on-road-experiments/6b6dc929-76a1-48c4-a69d-7b2118d7dfbb`, `/home/borisindelman/git/vault/agent_tasks`.
- Changes:
  - Resolved both models' gen2 artefacts and verified `gen2_mache_alpha3` licences.
  - Reused the controller, route template, SBW-on driving feature config, tags, and theme from reference experiment `8685ed72-b127-456d-b272-7f6cf0a5dfa3`.
  - Created interleave experiment `6b6dc929-76a1-48c4-a69d-7b2118d7dfbb` in `pending_approval` with `unofficial-cyan-pigeon` as control and `condor-fearless-ivory` as variant.
- Task note: [[agent_tasks/2026/05/Week-4/2026-05-24-condor-unofficial-interleave-experiment|2026-05-24 Condor / Unofficial Drift PUDO Interleave Experiment]]


- Topic: Parking input adaptor LR fix
  - Labels: parking, training, optimizer, learning-rate
  - Branch: `boris/parking-past30-no-standstill-gear-aug/no_behave_lr_fix`
  - PR: N/A
  - Change type: fix
  - Areas: `wayve/ai/si/models/training.py`, `wayve/ai/si/configs/parking/parking_config.py`, `wayve/ai/si/test/models/test_training.py`
  - Changes:
    - Added dedicated optimizer LR groups for gear direction and parking mode input adaptors.
    - Set parking configs to train those fresh input adaptors at `1e-4` while keeping base LR at `1e-5`.
    - Documented validation and the current unrelated Bazel analysis blocker in [[agent_tasks/2026/05/Week-4/2026-05-24-parking-input-adaptor-lr-fix]].

- Topic: Parking WFM warmup freeze
  - Labels: parking, training, optimizer, warmup
  - Branch: boris/parking-past30-no-standstill-gear-aug/no_behave_lr_fix
  - PR: n/a
  - Change type: follow-up fix
  - Areas: wayve/ai/si/models/training.py, wayve/ai/si/configs/parking/parking_config.py, wayve/ai/zoo/lr_schedulers/one_cycle_lambda.py
  - Changes:
    - Added delayed OneCycle LR support for staged training.
    - Configured parking BC modes to hold WFM encoder/input adaptor LR at zero for 5000 steps.
    - Kept fresh gear and parking-mode input adaptors active from step 0.

- Topic: Parking no-behave LR warmup training run
  - Labels: parking, training, surfboard
  - Branch: boris/parking-past30-no-standstill-gear-aug/no_behave_lr_fix
  - PR: n/a
  - Change type: training run
  - Areas: Parking training, Notion release tracking
  - Changes:
    - Submitted 80k-step parking BC training job 168436 on 4x H100 nodes.
    - Created Notion release row for green-badger-sophisticated.
    - Observed job reach Running on AKS.

## 2026-05-25 - Parking Onboarding Skill

- Topic: Create `parking-onboarding` Codex skill for newcomer setup and Parking education.
- Labels: parking, onboarding, codex-skill, coder.
- Branch: N/A.
- PR: N/A.
- Change type: Skill / documentation.
- Areas: `/home/borisindelman/git/ParkingSkills/skills/parking-onboarding`, `/home/borisindelman/git/vault/agent_tasks`.
- Changes:
  - Added a Mac-to-Coder bootstrap flow that avoids local Mac Git setup.
  - Added Coder workspace bring-up, GitHub auth, WayveCode verification, ParkingSkills clone/update, and Codex symlink guidance.
  - Added Phase 5 general WayveCode onboarding and Phase 6 MLE/Parking walkthroughs for model config, data materialisation, OTF loading, deployment wrapper, Eval Studio, Console, Foxglove, and VSO context.
- Task note: [[agent_tasks/2026/05/Week-5/2026-05-25-parking-onboarding-skill|2026-05-25 Parking Onboarding Skill]]

## 2026-05-25 - Parking Onboarding Skill Follow-Up

- Topic: Remove `llm_wiki` dependency and copy `parking-onboarding` onto `main`.
- Labels: parking, onboarding, codex-skill, main-branch.
- Branch: `main` in `/tmp/ParkingSkills-main`; source checkout remained on `agents_day` due unrelated dirty files.
- PR: N/A.
- Change type: Skill maintenance.
- Areas: `/tmp/ParkingSkills-main/skills/parking-onboarding`, `/home/borisindelman/git/ParkingSkills/skills/parking-onboarding`, `/home/borisindelman/git/vault/agent_tasks`.
- Changes:
  - Removed all `llm_wiki` references from `parking-onboarding`.
  - Copied the skill into a clean `main` worktree because the original checkout could not switch branches without overwriting unrelated local edits.
  - Revalidated the skill in the `main` worktree.
- Task note: [[agent_tasks/2026/05/Week-5/2026-05-25-parking-onboarding-skill|2026-05-25 Parking Onboarding Skill]]

## 2026-05-26 - Parking Branch Signing Push Repair

- Topic: Repair origin tracking and pushes for signed parking branches.
- Labels: parking, git, signing, branch-tracking, push.
- Branch: Multiple; see task note.
- PR: N/A.
- Change type: Git branch maintenance.
- Areas: `origin/boris/parking-moving-buckets-config`, `origin/boris/parking-past30-no-standstill-gear-aug/no_behave`, `origin/boris/parking-past30-no-standstill-gear-aug/no_behave_lr_fix`, `origin/boris/parking-past30-no-standstill-gear-aug/no_park_mode_nv_behav`.
- Changes:
  - Fixed `boris/parking-moving-buckets-config` upstream to track `origin/boris/parking-moving-buckets-config`.
  - Created/pushed `origin/boris/parking-moving-buckets-config`.
  - Verified the three `parking-past30-no-standstill-gear-aug` branches were already current on matching origin refs.
  - Verified requested branch tips are SSH-signed.
- Task note: [[agent_tasks/2026/05/Week-5/2026-05-26-parking-branch-signing-push-repair|2026-05-26 Parking Branch Signing Push Repair]]

## 2026-05-26 - PR 102690 Open Review Code Fixes

- Topic: Fix open code-review comments for parking route shortening PR.
- Labels: parking, pudo, pr-review, route-shortening.
- Branch: `boris/03-23-park-route-shortening-v2`.
- PR: `wayveai/WayveCode#102690`.
- Change type: Review fixes.
- Areas: `wayve/ai/lib/data/pipes/routes.py`, `wayve/ai/zoo/deployment/deployment_wrapper.py`, `wayve/ai/zoo/data/keys.py`.
- Changes:
  - Replaced production `assert` with early `ValueError` validation.
  - Removed redundant clipping and over-defensive fallback code in parking route shortening.
  - Centralized repeated scalar extraction with `_first_value`.
  - Renamed the end-of-route map blackout helper to a deterministic action name.
- Task note: [[agent_tasks/2026/05/Week-5/2026-05-26-pr102690-open-review-code-fixes|2026-05-26 PR 102690 Open Review Code Fixes]]

## 2026-05-26 - Parking Model Card Suite Scores

- Topic: Fill Eval Studio score columns in the Parking/PUDO model cards Notion database.
- Labels: parking, eval-studio, notion, model-cards.
- Branch: N/A.
- PR: N/A.
- Change type: Notion content update.
- Areas: `Parking/PUDO Model Development` Notion page, `Parking/PUDO model cards` database.
- Changes:
  - Queried Pudo-Unpudo and Alpha3 LessWrong suite scores using only each row's `Model ` title column.
  - Filled `PUDO/UNPUDO Suite` and `Alpha3 Intervention Suite` where exact suite-version executions existed.
  - Left rows blank when Eval Studio had no execution for the exact model and suite version.
- Task note: [[agent_tasks/2026/05/Week-5/2026-05-26-parking-model-card-suite-scores|2026-05-26 Parking Model Card Suite Scores]]

## 2026-05-26 - Parking Model Card Suite Scores Follow-Up

- Topic: Fill remaining available Eval Studio scores from any suite version.
- Labels: parking, eval-studio, notion, model-cards.
- Branch: N/A.
- PR: N/A.
- Change type: Notion content update.
- Areas: `Parking/PUDO Model Development` Notion page, `Parking/PUDO model cards` database.
- Changes:
  - Resolved `proficient-centipede-indigo` via Model Catalogue gen2 artefact because license lookup had no rows.
  - Filled `proficient-centipede-indigo` with PUDO/UNPUDO `7.0%` and Alpha3 `72.0%`.
  - Swept remaining blanks against the Pudo-Unpudo and Alpha3 suite UUIDs; no other exact-model executions were found.
- Task note: [[agent_tasks/2026/05/Week-5/2026-05-26-parking-model-card-suite-scores|2026-05-26 Parking Model Card Suite Scores]]

## 2026-05-26 - Parking Model Card Lineage Fill

- Topic: Fill missing lineage values in the Parking/PUDO model cards Notion database.
- Labels: parking, notion, model-cards, lineage.
- Branch: N/A.
- PR: N/A.
- Change type: Notion content update.
- Areas: `Parking/PUDO Model Development` Notion page, `Parking/PUDO model cards` database.
- Changes:
  - Used direct edges from the Mermaid lineage graph to fill 13 blank `Lineage` cells.
  - Preserved existing lineage values.
  - Left roots and rows absent from the graph blank.
- Task note: [[agent_tasks/2026/05/Week-5/2026-05-26-parking-model-card-suite-scores|2026-05-26 Parking Model Card Suite Scores]]

## 2026-05-26 - Parking Eval Studio Score Skill Rename

- Topic: Rename and scope Eval Studio score skill for Parking/PUDO suite scores.
- Labels: parking, codex-skill, eval-studio.
- Branch: N/A.
- PR: N/A.
- Change type: Skill maintenance.
- Areas: `/home/borisindelman/git/ParkingSkills/skills/parking-eval-studio-suite-scores`.
- Changes:
  - Renamed `eval-studio-suite-scores` to `parking-eval-studio-suite-scores`.
  - Baked in the Pudo-Unpudo and Alpha3 Intervention suite/version IDs.
  - Removed user-specific fallback script paths by resolving sibling skills relative to the installed skills root.
  - Verified the script with `armadillo-adaptable-maroon`.
- Task note: [[agent_tasks/2026/05/Week-5/2026-05-26-parking-model-card-suite-scores|2026-05-26 Parking Model Card Suite Scores]]

## 2026-05-26 - ParkingSkills README Setup

- Topic: Add initial ParkingSkills setup instructions.
- Labels: parking, docs, codex-skill, claude-skill.
- Branch: N/A.
- PR: N/A.
- Change type: Documentation.
- Areas: `/home/borisindelman/git/ParkingSkills/README.md`.
- Changes:
  - Added a short setup section with `git clone` and symlink commands for `~/.codex/skills` and `~/.claude/skills`.
- Task note: [[agent_tasks/2026/05/Week-5/2026-05-26-parking-model-card-suite-scores|2026-05-26 Parking Model Card Suite Scores]]

- [[agent_tasks/2026/05/Week-5/2026-05-26-fold-parking-deploy-skills|Fold Parking Deploy Skills]]
  - Topic: ParkingSkills lifecycle simplification
  - Labels: parking, skills, lifecycle
  - Branch: main
  - PR: n/a
  - Change type: docs/skill refactor
  - Areas: ParkingSkills
  - Changes:
    - Folded interleave deployment and Console updates into parking-deploy.

- [[agent_tasks/2026/05/Week-5/2026-05-26-parking-deploy-console-pudo-experiments|Parking Deploy Console Auth And PUDO Experiments]]
  - Topic: ParkingSkills deploy skill update
  - Labels: parking, skills, console, on-road
  - Branch: main
  - PR: n/a
  - Change type: docs/skill update
  - Areas: ParkingSkills
  - Changes:
    - Added Console auth-cookie fallback instructions and PUDO experiment templates/controller rules.

## 2026-05-27 - Parking Lifecycle Pudo-Unpudo Suite Version

- Topic: Update Parking model lifecycle routing for the fixed Pudo-Unpudo Eval Studio suite/version.
- Labels: parking, pudo, eval-studio, skill, lifecycle.
- Branch: `main` in `/home/borisindelman/git/ParkingSkills`.
- PR: N/A.
- Change type: Skill documentation / routing update.
- Areas: `/home/borisindelman/git/ParkingSkills/skills/parking_model_lifecycle`, `/home/borisindelman/git/vault/agent_tasks`.
- Changes:
  - Added explicit Pudo-Unpudo suite id `ea663952-b914-47a3-8cc1-729db3683dce` and version id `86b2105d-3f72-4620-b020-0b10e445798d` to lifecycle eval routing.
  - Clarified suite id versus version id in `$parking-eval-studio-suite-scores` defaults.
  - Verified `get_scores.sh` already uses the requested IDs.
- Task note: [[agent_tasks/2026/05/Week-5/2026-05-27-parking-lifecycle-pudo-suite-version|2026-05-27 Parking Lifecycle Pudo-Unpudo Suite Version]]

## 2026-05-27 - Pudo-Unpudo Suite for May Models

- Topic: Run/query the latest Pudo-Unpudo Eval Studio suite version for Parking/PUDO model-card rows dated since 2026-05-06.
- Labels: parking, pudo, eval-studio, notion, model-cards.
- Branch: N/A.
- PR: N/A.
- Change type: Eval Studio execution/query.
- Areas: `Parking/PUDO Model Development` Notion page, Eval Studio Pudo-Unpudo suite.
- Changes:
  - Filtered the Notion model-card database to nine rows with `Date >= 2026-05-06`.
  - Targeted latest Pudo-Unpudo version `adf04489-bc65-492d-92e6-02bfff979c49`.
  - Found `reassured-red-sea-turtle` already completed on the latest version with score `0.7515`.
  - Launched missing latest-version executions for the remaining eight models.
  - Follow-up check updated Notion scores for completed latest-version rows: chocolate `46.9%`, reassured `75.2%`, circumspect `74.7%`, noncommittal `76.4%`.
  - Later check found the five remaining executions completed and updated Notion: armadillo `78.3%`, condor `77.6%`, dalmatian `8.6%`, fuchsia `10.8%`, proficient `7.5%`.
  - Resolved `proficient-centipede-indigo` via model-catalogue gen2 artefact because the licence helper had no rows.
- Task note: [[agent_tasks/2026/05/Week-5/2026-05-27-pudo-unpudo-suite-may-models|2026-05-27 Pudo-Unpudo Suite for May Models]]

## 2026-05-27 - Lime Leopard Interleave V2 Deploy

- Topic: Redeploy `lime-leopard-dreaming` with parking interleave control.
- Labels: parking, pudo, deploy, model-ci, notion.
- Branch: `boris/05-21-updated-pudo-config`.
- PR: N/A.
- Change type: Model deployment.
- Areas: Model Catalogue, Buildkite Model CI, Notion model cards.
- Changes:
  - Deployed checkpoint 80k with suffix `__lime-leopard-dreaming_interleave_control_v2`.
  - Produced deployed nickname `lavender-elegant-gerbil` and gen2 artefact `96a5914c-7edf-46e1-b7b4-618f155137ac`.
  - Added the standard Parking/PUDO Console note and created a Notion model-card row.
  - Triggered Model CI build `73445`; job-level status could not be read with the local token.
- Task note: [[agent_tasks/2026/05/Week-5/2026-05-27-lime-leopard-interleave-v2-deploy|2026-05-27 Lime Leopard Interleave V2 Deploy]]


- Topic: Parking checkpoint interleave upload
  - Labels: parking, deployment, training
  - Branch: `boris/05-21-updated-pudo-config`
  - PR: n/a
  - Change type: fix/test
  - Areas: `wayve/ai/si/models/training.py`, `wayve/ai/si/test/models/test_training.py`
  - Changes:
    - Set parking `DeploymentConfig.interleave_group` during training checkpoint upload config construction.
    - Added a regression test for parking vs non-parking interleave group config.
    - Verification blocked by ACR 401 during Bazel analysis.
  - Note: [[agent_tasks/2026/05/Week-5/2026-05-27-parking-checkpoint-interleave-upload]]

## 2026-05-28 - PUDO 2026.6.21 Beige Train Monitor

- Topic: Submit and monitor the PUDO BC 80k retry after disabling behavior-control loss.
- Labels: parking, pudo, training, notion, wandb.
- Branch: `boris/05-21-updated-pudo-config`.
- PR: N/A.
- Change type: Training run / monitoring.
- Areas: Surfboard, W&B, Loki, Parking/PUDO Notion model cards.
- Changes:
  - Submitted short-tag retry `beige-hornet-striped` / Surfboard job `170708`.
  - Updated the Notion model-card row to the new nickname.
  - Monitored W&B until `trainer/train_step=5069` with state `running`.
  - Confirmed no matching fatal/artifact-name errors in Loki around the 5k crossing.
- Task note: [[agent_tasks/2026/05/Week-5/2026-05-28-pudo-621-beige-train-monitor|2026-05-28 PUDO 2026.6.21 Beige Train Monitor]]

## 2026-05-28 - Parking Skills Session Tags And Notes

- Topic: Tighten Parking/PUDO lifecycle skill instructions for training session tags and Notion notes.
- Labels: parking, pudo, skills, notion, training.
- Branch: `main` in `/home/borisindelman/git/ParkingSkills`.
- PR: N/A.
- Change type: Skill documentation update.
- Areas: ParkingSkills lifecycle skills.
- Changes:
  - Required train submissions to use an explicit short session tag under 128 characters, normally under ~45 characters.
  - Instructed the training skill to override long generated/default CLI tags.
  - Made the model-card update skill leave any `Notes` table property untouched.
  - Clarified that detailed notes belong in the model-card page body.
- Task note: [[agent_tasks/2026/05/Week-5/2026-05-28-parking-skills-session-tags-notes|2026-05-28 Parking Skills Session Tags And Notes]]

- Topic: Parking merge test fixes
  - Labels: parking, merge, tests
  - Branch: `boris/parking-past30-no-standstill-gear-aug/merge_main`
  - PR: n/a
  - Change type: fix
  - Areas: `wayve/ai/si`, `wayve/ai/zoo`, parking datamodules, deployment wrapper
  - Changes:
    - [[agent_tasks/2026/05/Week-5/2026-05-30-parking-merge-test-fixes|Parking merge test fixes]]
    - Fixed parking/datamodule and deployment wrapper regressions surfaced by focused Bazel tests.

## 2026-05-31 - Merge Main Parking Retry Export Fix

- Topic: Retry merge-main parking training after fixing parking interleave TorchScript export.
- Labels: parking, training, deployment, interleave, torchscript.
- Branch: `boris/parking-past30-no-standstill-gear-aug/merge_main`.
- PR: N/A.
- Change type: Code fix / training run / monitoring.
- Areas: `/workspace/WayveCode/wayve/ai/zoo/deployment/deployment_wrapper.py`, `/workspace/WayveCode/wayve/ai/zoo/deployment/deployment_wrapper_codegen.py`, Parking/PUDO Notion model card.
- Changes:
  - Fixed parking interleave wrapper scripting by passing common output tensors field-by-field instead of a model-output NamedTuple.
  - Corrected parking deployment wrapper return annotation for `DrivingOutputWithGearOutput`.
  - Pushed commit `097878727cee8db9d5598872ffe194fa95b4192c`.
  - Submitted training job `172255` / `raven-orange-rejoicing`, session `session_2026_05_31_10_52_33_mmturtle4`.
  - Monitored to W&B `trainer/global_step=5102` with state `running`; updated Notion page body without touching the `Notes` property.
- Task note: [[agent_tasks/2026/05/Week-5/2026-05-31-lr-scheduler-horizon|2026-05-31 LR Scheduler Horizon]]

## 2026-05-31 - Parking Upload Interleave Group Fix

- Topic: Restore parking interleave group metadata on checkpoint upload config.
- Labels: parking, training, deployment, interleave.
- Branch: `boris/parking-past30-no-standstill-gear-aug/merge_main`.
- PR: N/A.
- Change type: Code fix / regression test.
- Areas: `/workspace/WayveCode/wayve/ai/si/models/training.py`, `/workspace/WayveCode/wayve/ai/si/test/models/test_training.py`.
- Changes:
  - Added `interleave_group="parking" if self.use_parking_mode else ""` to `BcTrainingModule.get_deployment_config()` so `CheckpointAndSubmit` upload metadata carries the parking group.
  - Added a focused regression test for parking and non-parking deployment config interleave groups.
  - Pushed commit `446463339cb0`.
  - Bazel verification remained blocked by existing missing target `//wayve/ai/si:run_inference`; syntax and whitespace checks passed.
- Task note: [[agent_tasks/2026/05/Week-5/2026-05-31-lr-scheduler-horizon|2026-05-31 LR Scheduler Horizon]]

## 2026-05-31 - Parking Deployment X Clamp Fix

- Topic: Fix parking deployment wrapper X-vector clamping for interleave and path outputs.
- Labels: parking, deployment, interleave, simulation.
- Branch: `boris/parking-past30-no-standstill-gear-aug/merge_main`.
- PR: N/A.
- Change type: Code fix / regression tests.
- Areas: `/workspace/WayveCode/wayve/ai/zoo/deployment/deployment_wrapper.py`, `/workspace/WayveCode/wayve/ai/zoo/deployment/deployment_wrapper_codegen.py`, deployment wrapper tests.
- Changes:
  - Restored generated interleave policy-gear source detection from `03-20-si-group-interleave-control-support` while preserving field-by-field output wrapping.
  - Enforced gear-conditioned waypoint clamping for parking interleave group as well as driving group.
  - Clamped `POLICY_PATH_POSITION_FORWARD` using predicted gear before returning parking deployment path outputs.
  - Added regression tests and verified focused deployment tests, ruff, and type checks.
- Task note: [[agent_tasks/2026/05/Week-5/2026-05-31-lr-scheduler-horizon|2026-05-31 LR Scheduler Horizon]]
  - Pushed commit `3ee09c365baf` (`fix: clamp parking deployment x outputs`).

## 2026-05-31 - Raven 30k X-Clamp Redeploy And 80k Continuation

- Topic: Redeploy promising 30k Parking checkpoint with X-clamp fix, then continue original model to 80k.
- Labels: parking, deployment, training, interleave.
- Branch: `boris/parking-past30-no-standstill-gear-aug/merge_main`.
- PR: N/A.
- Change type: Model deployment / training continuation.
- Areas: Model Catalogue, Surfboard, Parking/PUDO lifecycle.
- Changes:
  - Redeployed `raven-orange-rejoicing` checkpoint 30k with local deployment-wrapper X clamp fix and interleave group `parking`.
  - Produced deployed nickname `horse-tomato-magnificent`, session `session_2026_05_31_10_52_33_mmturtle4__raven-orange-rejoicing_interleave_control_xclamp_v1`.
  - Submitted continuation job `172394` / `distinctive-crocodile-azure` from original checkpoint 30k to 80k using the original training image and 100k LR schedule.
  - Final observed train status: `Dispatched` on `aks-prod-training-2-swe.nd96h100c`.
- Task note: [[agent_tasks/2026/05/Week-5/2026-05-31-lr-scheduler-horizon|2026-05-31 LR Scheduler Horizon]]

- [[agent_tasks/2026/05/Week-5/2026-05-31-parking-2026-5-21-baseline-config|Parking 2026.5.21 baseline config]]
  - Labels: parking, config, training
  - Branch: codex/parking-port-past30
  - PR: none
  - Change type: config
  - Areas: wayve/ai/si/configs/parking
  - Changes: binary_version 3.0.65; added parking_bc_train_release_2026_5_21.

## 2026-05-31 - Parking 2026.5.21 Copy Tele Retry

- Topic: Fix and retry Parking 2026.5.21 30K training after missing tele-camera startup failure.
- Labels: parking, config, training, notion
- Branch: `boris/parking-past30-no-standstill-gear-aug/main_cherrypick`
- PR: N/A
- Change type: Code fix / training run / monitoring / Notion update
- Areas: `/workspace/default/wayve/ai/si/configs/parking/parking_config.py`, `/workspace/default/wayve/ai/si/test/configs/test_configs_utils.py`, Parking/PUDO Notion model card
- Changes:
  - [[agent_tasks/2026/05/Week-5/2026-05-31-parking-2026-5-21-baseline-config|Parking 2026.5.21 baseline config]]
  - Pushed commit `99eaa3f4361e` to enable `copy_tele_camera=True` for six-camera parking release training and assert it in config resolution.
  - Submitted job `172457` / `hedgehog-modest-amaranth`, session `session_2026_05_31_21_12_58_p521tele30k`.
  - Monitored to `trainer/global_step=5074` with Surfboard and W&B still running.
  - Created Notion model-card row `hedgehog-modest-amaranth (not interleaved)`.

## 2026-06-01 - UnPUDO DC Fixed Window Buckets

- Topic: Fold DC UnPUDO move-window materialization into the base DC UnPUDO buckets.
- Labels: parking, pudo, unpudo, materialization, notebook.
- Branch: `boris/materialization_unsafe_moving_buckets`.
- PR: N/A.
- Change type: Notebook code change.
- Areas: `/workspace/materialization/wayve/ai/parking/notebooks/pudo_unpudo_materialization.ipynb`.
- Changes:
  - Added `USE_FIXED_UNPUDO_DC_EVENT_WINDOW` and `UNPUDO_DC_FIXED_WINDOW_AFTER_START_US`.
  - Made base `dc_unpudo_*` buckets use `timestamp_unixus..timestamp_unixus+10s` when the flag is enabled.
  - Removed separate `dc_unpudo_move_*` bucket generation and merge wiring.
  - Added unsafe pre-CA UnPUDO buckets from the same unsafe raw anchors.
  - Added comments for fixed DC UnPUDO, unsafe/moving UnPUDO, and forward/reverse derivation; renamed departure output to `dc_unpudo_pre_departure_*`.
  - Stripped stale notebook execution errors and a temporary test comment before PR creation.
- Task note: [[agent_tasks/2026/05/Week-5/2026-05-31-unpudo-materialization-buckets|2026-05-31 UnPUDO Materialization Buckets]]

## 2026-06-01 - LR Scheduler Num Steps PR

- Topic: Isolate BC LR scheduler horizon override from parking branch onto main.
- Labels: parking, training, lr-schedule, pull-request.
- Branch: `boris/lr-scheduler-num-steps`.
- PR: https://github.com/wayveai/WayveCode/pull/115840
- Change type: Code change / regression test / draft PR.
- Areas: `/workspace/WayveCode/wayve/ai/si/config.py`, `/workspace/WayveCode/wayve/ai/si/models/training.py`, `/workspace/WayveCode/wayve/ai/si/test/models/test_training.py`.
- Changes:
  - Added `lr_scheduler_num_steps` config and training-module plumbing.
  - Used the override as scheduler `total_steps` when set, preserving `trainer.max_steps` fallback.
  - Added focused regression coverage and opened draft PR #115840.
- Task note: [[agent_tasks/2026/06/Week-1/2026-06-01-lr-scheduler-num-steps-pr|2026-06-01 LR Scheduler Num Steps PR]]

## 2026-06-01 - UnPUDO Materialization Deep Review

- Topic: Review UnPUDO materialization notebook changes after fixed DC bucket and unsafe pre-CA updates.
- Labels: parking, pudo, unpudo, materialization, review.
- Branch: `boris/materialization_unsafe_moving_buckets`.
- PR: N/A.
- Change type: Review / validation.
- Areas: `/workspace/materialization/wayve/ai/parking/notebooks/pudo_unpudo_materialization.ipynb`, `/workspace/materialization/wayve/ai/si/configs/parking/parking_config.py`.
- Changes:
  - Confirmed notebook invariants for fixed base DC UnPUDO, removed `dc_unpudo_move_*`, directional forward/reverse, unsafe pre-CA, and final merge groups.
  - Noted downstream config still consumes `dc_unpudo_*_very_short` for train, not base `dc_unpudo_*`.
- Task note: [[agent_tasks/2026/05/Week-5/2026-05-31-unpudo-materialization-buckets|2026-05-31 UnPUDO Materialization Buckets]]

## 2026-06-01 - Parking PUDO Bucket Loss Tags

- Topic: Add grouped loss tracking metadata to Parking PUDO/UNPUDO train buckets.
- Labels: parking, pudo, unpudo, training, config.
- Branch: `boris/parking-past30-no-standstill-gear-aug/main_cherrypick`.
- PR: N/A.
- Change type: Config change.
- Areas: `/workspace/WayveCode/wayve/ai/si/configs/parking/parking_config.py`.
- Changes:
  - Added inline `track_tag=True` and `track_tag_group="pudo_unpudo"` to PUDO and UNPUDO train bucket definitions.
  - Left driving, unparking, gear-shift, and validation buckets unchanged.
- Task note: [[agent_tasks/2026/06/Week-1/2026-06-01-parking-pudo-data-mix-train|Parking PUDO Data Mix Train]]

## 2026-06-01 - LR Scheduler Num Steps PR CI Fix

- Topic: Fix PR #115840 baseline config snapshot CI failure.
- Labels: training, lr-schedule, ci, config-snapshot.
- Branch: `boris/lr-scheduler-num-steps`.
- PR: https://github.com/wayveai/WayveCode/pull/115840
- Change type: Test snapshot update.
- Areas: `/workspace/WayveCode/wayve/ai/si/test/test_config_inputs/reference_bc.yaml`.
- Changes:
  - Added `lr_scheduler_num_steps: null` to the BC baseline config reference snapshot.
  - Verified `test_regression` via `//wayve/ai/si:test_config_py_test_core`.
  - Pushed follow-up commit `8159e1b607d6`.
- Task note: [[agent_tasks/2026/06/Week-1/2026-06-01-lr-scheduler-num-steps-pr|2026-06-01 LR Scheduler Num Steps PR]]

## 2026-06-01 - LR Scheduler Num Steps PR Review Fixes

- Topic: Address PR #115840 agentic review comments.
- Labels: training, lr-schedule, ci, pull-request.
- Branch: `boris/lr-scheduler-num-steps`.
- PR: https://github.com/wayveai/WayveCode/pull/115840
- Change type: Code fix / regression tests.
- Areas: `/workspace/WayveCode/wayve/ai/si/models/training.py`, `/workspace/WayveCode/wayve/ai/si/test/models/test_training.py`.
- Changes:
  - Made `lr_scheduler_num_steps` fallback explicit and reject non-positive values.
  - Expanded regression coverage to `one-cycle`, `plateau`, and invalid override values.
  - Pushed commit `d908a40c3558`.
- Task note: [[agent_tasks/2026/06/Week-1/2026-06-01-lr-scheduler-num-steps-pr|2026-06-01 LR Scheduler Num Steps PR]]

## 2026-06-03 - LR Scheduler Num Steps Review Edge Cases

- Topic: Address PR #115840 human review comment on scheduler horizon edge cases.
- Labels: training, lr-schedule, review, pull-request.
- Branch: `boris/lr-scheduler-num-steps`.
- PR: https://github.com/wayveai/WayveCode/pull/115840
- Change type: Code fix / regression tests.
- Areas: `/workspace/WayveCode/wayve/ai/si/models/training.py`, `/workspace/WayveCode/wayve/ai/si/test/models/test_training.py`.
- Changes:
  - Accepted explicit scheduler horizons equal to or greater than `trainer.max_steps`.
  - Rejected positive `lr_scheduler_num_steps` values shorter than `trainer.max_steps` to avoid scheduler overrun during training.
  - Expanded optimizer scheduler regression coverage for equal, longer, and shorter-than-trainer cases across `one-cycle` and `plateau`.
  - Verified focused optimizer tests with coverage disabled for the pytest filter, plus package ruff and flake8 lint.
- Task note: [[agent_tasks/2026/06/Week-1/2026-06-01-lr-scheduler-num-steps-pr|2026-06-01 LR Scheduler Num Steps PR]]


## 2026-06-01 - HARI PUDO One-Sample Clip Input

- Topic: Allow one-sample UnPUDO standstill clip input generation directly from the event table.
- Labels: parking, pudo, unpudo, hari, run-clips.
- Branch: `tomboehling/hari_pudo`.
- PR: N/A.
- Change type: Script change / workflow prep.
- Areas: `/workspace/classifiers/wayve/ai/datasets/annotation_operations_tools/scripts/generate_run_clips_input.py`.
- Changes:
  - Added `--source-filter-expr`, `--limit`, and `--vehicle-platform-id` to avoid creating a separate one-row source table for smoke tests.
  - Parsed `--match-tolerance-seconds` as a float for CLI-specified tolerances.
  - Avoided eager imports of the full inference task registry and Databricks Connect during CLI startup.
  - Verified the script help via Bazel and recorded the one-sample command pattern.
- Task note: [[projects/hari-pudo-classifiers|HARI PUDO classifiers]]

## 2026-06-01 - HARI UnPUDO Smoke Clip

- Topic: Generate one UnPUDO standstill run_clips smoke video from the parking event table.
- Labels: parking, pudo, unpudo, hari, run-clips, flyte.
- Branch: `boris/hari_pudo`.
- PR: N/A.
- Change type: Script change / workflow run / smoke validation.
- Areas: `/workspace/classifiers/wayve/ai/datasets/annotation_operations_tools/scripts/generate_run_clips_input.py`, `/workspace/classifiers/wayve/ai/datasets/flyte/inference_tasks/__init__.py`, `/workspace/classifiers/wayve/ai/lib/calibration.py`.
- Changes:
  - Generated a one-row `run_clips` input parquet from `hive_metastore.parking.pudo_unpudo_unpark_events` using an exact `gen2` UnPUDO standstill event.
  - Ran remote Flyte execution `ac5pcvl8wsx79fj499f2`; setup succeeded but Spark node failed with a system error after scheduling latency.
  - Ran the documented local workflow, fixed an old-branch calibration API mismatch, encoded a 1920x1080 smoke MP4, and uploaded it to `wayveproddataset/databricks-users`.
- Task note: [[projects/hari-pudo-classifiers|HARI PUDO classifiers]]

## 2026-06-01 - HARI UnPUDO Mixed Source Query

- Topic: Support SQL source selection for mixed UnPUDO clip batches.
- Labels: parking, pudo, unpudo, hari, run-clips, databricks.
- Branch: `boris/hari_pudo`.
- PR: N/A.
- Change type: Script change.
- Areas: `/workspace/classifiers/wayve/ai/datasets/annotation_operations_tools/scripts/generate_run_clips_input.py`.
- Changes:
  - Added `--source-sql` so source rows can be generated by SQL unions and random sampling before the nearest-corpus join.
  - Verified the CLI help through Bazel.
- Task note: [[projects/hari-pudo-classifiers|HARI PUDO classifiers]]

## 2026-06-01 - HARI UnPUDO Mixed Flyte Batch

- Topic: Launch timestamped mixed UnPUDO clip generation batch in Flyte.
- Labels: parking, pudo, unpudo, hari, run-clips, flyte.
- Branch: `boris/hari_pudo`.
- PR: N/A.
- Change type: Workflow run.
- Areas: `/workspace/classifiers/wayve/ai/datasets/annotation_operations_tools/scripts/generate_run_clips_input.py`, Flyte `run_clips` workflow.
- Changes:
  - Generated 492 matched `run_clips` input rows from all moving UnPUDO events plus 250 random standstill rows.
  - Launched Flyte execution `a9n8glpdgt859n4l5kpz` with timestamped output prefix and `chunk_size=1`, `num_concurrent_tasks=50`.
- Task note: [[projects/hari-pudo-classifiers|HARI PUDO classifiers]]

## 2026-06-02 - Parking PUDO Baseline PR

- Topic: Create clean Parking PUDO baseline PR from current main.
- Labels: parking, pudo, baseline, pr, config, deployment.
- Branch: `06-02-pudo-baseline`.
- PR: https://github.com/wayveai/WayveCode/pull/116069.
- Change type: Code change / PR.
- Areas: `/tmp/pudo-baseline-pr/wayve/ai/si`, `/tmp/pudo-baseline-pr/wayve/ai/zoo/deployment`, `/tmp/pudo-baseline-pr/wayve/ai/lib`.
- Changes:
  - Added the active Parking PUDO datamodule config for the new root and release `2026_5_21` mode.
  - Removed the interleave-control wrapper/training plumbing from the PR scope.
  - Preserved `wayve/ai/zoo/data/parking.py` and kept the final diff to 17 intended files.
  - Verified config resolution plus focused deployment, training, and behavior-customization tests.
- Task note: [[agent_tasks/2026/06/Week-1/2026-06-02-pudo-baseline-pr|2026-06-02 PUDO Baseline PR]]

## 2026-06-02 - HARI UnPUDO Flyte Interface Fix

- Topic: Fix Flyte input-schema mismatch and rerun mixed UnPUDO clip generation.
- Labels: parking, pudo, unpudo, hari, run-clips, flyte.
- Branch: `boris/hari_pudo`.
- PR: N/A.
- Change type: Code fix / image publish / workflow run.
- Areas: `/workspace/classifiers/wayve/ai/datasets/flyte/workflow.py`, `/workspace/classifiers/wayve/ai/datasets/flyte/common/infra/orchestration.py`, Flyte `run_clips` workflow.
- Changes:
  - Diagnosed failed execution `a9n8glpdgt859n4l5kpz` as a FlyteKit input decoding mismatch, not a source query problem.
  - Removed stale `dataset_delta` from the workflow/task interface so the launched workflow matches the remote task input schema.
  - Built `//wayve/ai/datasets/flyte/...`, published a test workflow image, and relaunched execution `a9lgsnpj2mjz7ctlr6kl` with a fresh timestamped output prefix.
- Task note: [[projects/hari-pudo-classifiers|HARI PUDO classifiers]]

## 2026-06-02 - UnPUDO Run Clips Camera-Present Rerun

- Topic: Filter UnPUDO run_clips inputs for five-camera video availability and relaunch the Flyte batch.
- Labels: parking, unpudo, hari, flyte, video-generation.
- Branch: `boris/hari_pudo`.
- PR: N/A.
- Change type: Code change / Flyte experiment.
- Areas: `/workspace/classifiers/wayve/ai/datasets/annotation_operations_tools/scripts/generate_run_clips_input.py`, `/workspace/classifiers/wayve/ai/datasets/flyte`, `/home/borisindelman/git/vault/projects/hari-pudo-classifiers.md`.
- Changes:
  - Diagnosed latest worker failures as missing camera video data (`right_backward`, `video_path=None`) rather than a Flyte/query parallelization issue.
  - Added exact-row camera `video_file_name` validation to `generate_run_clips_input.py` via `--require-camera-video-files`; kept stricter full-window validation plumbing for future use.
  - Generated `camera_present_20260602_092236_UTC/run_clips_input.parquet` with 497 rows from all moving UnPUDO plus 250 random standstill UnPUDO candidates.
  - Launched Flyte execution `askdlss5f75w6tszggdr` with `chunk_size=1`, `num_concurrent_tasks=50`, 32s clips, 1s highlight, and 3x playback.
- Project note: [[projects/hari-pudo-classifiers|HARI PUDO classifiers]]

## 2026-06-02 - UnPUDO Run Clips Segment Cleanup Rerun

- Topic: Fix full-window missing-camera failures in UnPUDO run_clips and launch corrected Flyte batch.
- Labels: parking, unpudo, hari, flyte, video-generation, run-clips.
- Branch: `boris/hari_pudo`.
- PR: N/A.
- Change type: Code change / image publish / workflow run.
- Areas: `/workspace/classifiers/wayve/ai/datasets/flyte/inference_tasks/run_clips/run_clips.py`, Flyte `run_clips` workflow, `/home/borisindelman/git/vault/projects/hari-pudo-classifiers.md`.
- Changes:
  - Diagnosed remaining failures as full-window missing camera metadata despite valid center-row camera filenames.
  - Added guarded `drop_rows_with_missing_camera_video_files` support to filter unusable segment rows before dataloader decoding.
  - Verified with Flyte subtree build, Flyte lint, and direct `test_run_clips.py`; documented unrelated embedding-head collection failure in the project note.
  - Published corrected image digest `sha256:74479ab9e03b6d604a5a7ea126f81615289f740d9946c6063c58f715e9e037da` and launched execution `a97nqrpw2gb6rd2ljrn9` to `camera_present_drop_missing_20260602_095509_UTC`.
- Project note: [[projects/hari-pudo-classifiers|HARI PUDO classifiers]]

## 2026-06-02 - UnPUDO Run Clips Completion and Blob Viewer

- Topic: Confirm completed UnPUDO clip batch and serve blob-backed video browser.
- Labels: parking, unpudo, hari, flyte, video-generation.
- Branch: `boris/hari_pudo`.
- PR: N/A.
- Change type: Workflow status / local viewing setup.
- Areas: Flyte `run_clips` execution `a97nqrpw2gb6rd2ljrn9`, `/tmp/unpudo_clip_serve/index.html`.
- Changes:
  - Confirmed Flyte execution `a97nqrpw2gb6rd2ljrn9` succeeded, with `end-node` complete at 2026-06-02 12:55:24 UTC.
  - Counted 496 generated MP4 blobs in `camera_present_drop_missing_20260602_095509_UTC/gen2`.
  - Reused the existing port `3000` server and replaced the served index with a blob-backed viewer using signed Azure Blob URLs, avoiding local MP4 downloads.
- Project note: [[projects/hari-pudo-classifiers|HARI PUDO classifiers]]

## 2026-06-03 - Driving Interleave-Control Deploys

- Topic: Deploy driving models with interleave control and empty interleave group.
- Labels: parking, deployment, interleave-control, driving-models.
- Branch: `03-20-si-group-interleave-control-support`.
- PR: N/A.
- Change type: Deployment run.
- Areas: `/workspace/WayveCode`, `/workspace/parking-deploy-outputs`.
- Changes:
  - Deployed `wallaby-compact-moccasin` to `zebra-aquamarine-reclusive` with Gen2 artefact `53f815b3-7014-4d3c-9715-bfc69f5d5add`.
  - Deployed `ibex-lime-meritorious` to `anteater-harlequin-colorful` with Gen2 artefact `5d651f7b-93b0-44f4-93f9-32dab0b8553c`.
  - Used `--enable_interleave_control` with empty `--interleave_control_group` and local output under `/workspace/parking-deploy-outputs`.
  - Verified generated Gen2 configs include `interleave_control`, radar X/Y/Z/range-rate/SNR, and `points_per_scan: 800`.
- Task note: [[agent_tasks/2026/06/Week-1/2026-06-03-driving-interleave-control-deploys|2026-06-03 Driving Interleave-Control Deploys]]

## 2026-06-03 - Interleave-Control Main Merge

- Topic: Merge latest `origin/main` into the interleave-control deployment branch.
- Labels: parking, deployment, interleave-control, merge.
- Branch: `03-20-si-group-interleave-control-support`.
- PR: N/A.
- Change type: Merge / conflict resolution.
- Areas: `/workspace/WayveCode/wayve/ai/si`, `/workspace/WayveCode/wayve/ai/zoo/deployment`.
- Changes:
  - Resolved conflicts in deploy, deployment preparation, training deployment config, behavior customization, deployment wrapper, deployment tests, and RL reference config.
  - Kept branch interleave-control behavior while preserving main's `dynamo_export`, kinematic output, shift-by-wire fail-fast guard, mitigation request behavior, and shape-[1] understeer LUT indexing.
  - Completed merge commit `d7b14ed5a32d`.
  - Verified `git diff --check`, no conflict markers, and `//wayve/ai/zoo/deployment:test_deployment_py_test`; SI deployment test was blocked by ACR auth for `azure-storage/azurite`.
- Task note: [[agent_tasks/2026/06/Week-1/2026-06-03-interleave-control-main-merge|2026-06-03 Interleave Control Main Merge]]

## 2026-06-04 - PR 116069 Driving Data Update

- Topic: Port updated driving data config into PR 116069.
- Labels: parking, pudo, config, pr-116069.
- Branch: `06-02-pudo-baseline`.
- PR: `https://github.com/wayveai/WayveCode/pull/116069`.
- Change type: Code change, uncommitted.
- Areas: `/workspace/WayveCode/wayve/ai/si/configs/parking/parking_config.py`.
- Changes:
  - Restored D26_3_6 datamodule aliases/ratio variants on top of the updated `parking_pudo_bc_datamodule_cfg`.
  - Added `parking_pudo_bc_D26_3_6_datamodule`, `parking_bc_D26_3_6_datamodule`, and `pudo_bc_D26_3_6_datamodule`.
  - Adapted old aggregate `unpudo`/`unpark` ratio controls to the current granular `unpudo_*`, `unparking`, and `gear_shift` groups.
  - Kept diffusion config unchanged and did not keep unsupported `max_augmentation_errors=1000`.
  - Verified `git diff --check` and `//wayve/ai/si:py_lint_ruff`.
- Task note: [[agent_tasks/2026/06/Week-1/2026-06-04-pr116069-driving-data|2026-06-04 PR 116069 Driving Data Update]]

## 2026-06-03 - Vampire Bat Driving Redeploy

- Topic: Redeploy `vampire-bat-ardent-emerald` as a driving model with interleave control.
- Labels: parking, deployment, interleave-control, driving-models.
- Branch: `03-20-si-group-interleave-control-support`.
- PR: N/A.
- Change type: Code fix / deployment run.
- Areas: `/workspace/WayveCode/wayve/ai/si/deploy.py`, `/workspace/WayveCode/wayve/ai/si/test/test_deploy.py`, `/workspace/parking-deploy-outputs`.
- Changes:
  - Pushed merge branch and two deploy compatibility fixes: `ff51c2e0fab9`, `70dfa77a6f3c`.
  - Fixed temporal-cache config mutation for old TD3 checkpoint-loader configs and release-loader override configs.
  - Redeployed source session `session_2026_05_22_08_58_12_baseline_rl_rmf` at step `150000` with empty interleave group.
  - New deployed nickname is `falcon-orange-creative`; Gen2 artefact id is `c28dd87d-d3c5-4131-8d55-4e955949eb24`.
  - Verified Gen2 config has radar X/Y/Z/range-rate/SNR, `points_per_scan: 800`, and `interleave_control`.
- Task note: [[agent_tasks/2026/06/Week-1/2026-06-03-vampire-bat-driving-redeploy|2026-06-03 Vampire Bat Driving Redeploy]]

## 2026-06-03 - Vampire Bat No Temporal Override Redeploy

- Topic: Redeploy `vampire-bat-ardent-emerald` without forcing temporal caching.
- Labels: parking, deployment, interleave-control, driving-models.
- Branch: `03-20-si-group-interleave-control-support`.
- PR: N/A.
- Change type: Revert / deployment run.
- Areas: `/workspace/WayveCode/wayve/ai/si/deploy.py`, `/workspace/WayveCode/wayve/ai/si/test/test_deploy.py`, `/workspace/parking-deploy-outputs`.
- Changes:
  - Reverted local temporal-cache compatibility commits with `8c5c4fb3d23d` and `394436d805a7`; branch is ahead of origin by these commits and not pushed.
  - Redeployed source session `session_2026_05_22_08_58_12_baseline_rl_rmf` at step `150000` without `--with_temporal_caching True`.
  - New deployed nickname is `cheeky-amethyst-caribou`; Gen2 artefact id is `e98d65d3-b1a6-4896-a5e0-80e5b50f000f`.
  - Deploy summary showed temporal caching `Same as trained model`; runtime still enabled cache on radar/video adaptors from the trained config.
  - Verified Gen2 config has radar X/Y/Z/range-rate/SNR, `points_per_scan: 800`, and `interleave_control`.
- Task note: [[agent_tasks/2026/06/Week-1/2026-06-03-vampire-bat-no-temporal-override-redeploy|2026-06-03 Vampire Bat No Temporal Override Redeploy]]

## 2026-06-03 - Event Gear Smoothing

- Topic: Add configurable smoothed-gear transition columns to PUDO / UnPUDO event detection.
- Labels: parking, pudo, unpudo, materialization, notebook.
- Branch: `boris/materialization_unsafe_moving_buckets`.
- PR: `https://github.com/wayveai/WayveCode/pull/115845`; isolated event PR `https://github.com/wayveai/WayveCode/pull/116673`.
- Change type: Notebook code change, uncommitted.
- Areas: `/workspace/materialization/wayve/ai/parking/notebooks/pudo_unpudo_event_detection.ipynb`.
- Changes:
  - Added `ENABLE_GEAR_SMOOTHING`, `GEAR_SMOOTHING_MIN_SEGMENT_US`, and `SMOOTHED_GEAR_COL` config knobs.
  - Built `gear_change_to_park` and `gear_change_from_park` from smoothed per-frame gear context.
  - Switched PUDO and UnPUDO gear transition seeding to use the new booleans while preserving raw gear and output table schema.
  - Removed a stale trip-table helper join to `prod_analytics.analytics.robotaxi_disengagement` after a runtime failure on unavailable `episode_start_lat` / `episode_start_lon` columns; the join's `event_success` output was not consumed downstream.
  - Added deterministic event-key canonicalization after location dedup, after office-geofence filtering, and before final enrichment/write to prevent duplicate event rows introduced by smoothed-gear candidate paths.
  - Marked trip-summary PUDO candidates as `source = "trip_summary"` instead of inheriting the raw hazard source label.
  - Isolated the event notebook changes onto `boris/event_creation_gear_fix` from latest `main` and opened draft PR #116673.
  - Removed unused `prev2_gear_direction` and `next_gear_direction` context columns from the isolated PR branch.
  - Validated notebook JSON, code-cell AST parse, `git diff --check`, and static invariants.
- Task note: [[agent_tasks/2026/06/Week-1/2026-06-03-event-gear-smoothing|2026-06-03 Event Gear Smoothing]]

## 2026-06-03 - Zak Datamodule Parking Training

- Topic: Wire Zak Murez's experimental PUDO datamodule into SI parking training.
- Labels: parking, pudo, datamodule, training, experiment.
- Branch: `boris/zak_datamodule`.
- PR: N/A.
- Change type: Code change, local experiment.
- Areas: `/workspace/default/wayve/ai/si/datamodules`, `/workspace/default/wayve/ai/si/configs/parking`, `/workspace/zak/wayve/ai/experimental`.
- Changes:
  - Pushed experiment commit `ce48bec9325d` to `origin/boris/zak_datamodule`.
  - Added a local SI datamodule adapter that imports Zak's `wayve.ai.experimental` package from `/workspace/zak`, builds `mcv_new_phase2.yml`, and maps post-transform experimental batches into SI `DataKeys`.
  - Registered `parking_bc_train_zak_mcv_new_phase2` as an experiment mode using the June parking model family, with radar, behavior-control auxiliary losses, and checkpoint/export callbacks disabled for local scratch compatibility.
  - Added a focused unit test for the Zak-to-SI batch shape/key mapping.
  - Added dev-only Zak parquet fractioning so local `dev=true` smoke runs build 0.1% of the parquet list instead of the full dataset.
  - Fixed local smoke-run blockers: Zak package namespace import, local `mcap` dependency lookup, `nuscenes-devkit` dependency, Zak Git LFS data pointer, and missing blank `signs_gemini.txt` annotation file.
  - Ported the updated `WFM_v1.4.0.550M(1.5.0)` release model path from `boris/parking-past30-no-standstill-gear-aug/main_cherrypick_new_driving`, adding `parking_bc_train_release_2026_5_21` and Zak-specific `parking_bc_train_zak_mcv_new_phase2_release_2026_5_21`.
  - Verified `//wayve/ai/si/datamodules:test_zak_experimental`, `//wayve/ai/si:train`, and a one-step local train with Zak data/augmentations reaching `max_steps=1`.
  - Verified the updated release-WFM Zak mode with a one-step local train reaching `max_steps=1`.
- 2026-06-04 update:
  - Pushed parking-based branch through `9be51ff18772` with remote-train robustness fixes and bounded diagnostics for Zak loader/constructor startup.
  - Fixed non-finite cumulative-distance handling and frame-to-frame odometry distance computation, with focused regressions in `//wayve/ai/experimental:test_single_run`.
  - Monitored remote runs through job `174286`; it failed on agent-added diagnostic logging before proving the underlying constructor behavior.
  - Continued without starting a new remote run: fixed the diagnostic logger crash, added Zak-to-SI adapter validation, mapped Zak unknown indicator `-1` to SI unknown `4`, and preserved Zak's `indicator_stick` augmentation for vehicle conditioning.
  - Verified bounded local `dev=false` training reaches `max_steps=1` with Zak data/augmentations and the release WFM path at batch size 1; batch size 4 reaches first iteration but OOMs locally.
  - Ran bounded local `dev=false` training for 1000 steps at batch size 1; Zak dataset loaded 264/264 runs, sampler built, first iteration completed, and Lightning stopped at `max_steps=1000` with exit code 0.
  - Recorded repeated tolerated object-store warnings for sampled camera paths ending in `/nan`; they did not stop local training.
  - Committed and pushed `bab774dcb5cd` (`fix: validate Zak parking datamodule batches`) to `origin/boris/zak_datamodule_parking_cherrypick`.
  - Published image `wayvetraining.azurecr.io/scaled-intelligence:bab774dcb5cd1391d30f9af9b7315a048e5b8489` and submitted Surfboard job `174358` / session `session_2026_06_04_07_41_45_z521v` on 4 H100 AKS nodes; final observed state was `Running`.
  - Re-polled job `174358` at `2026-06-04 07:58 UTC`: still `Running`, no termination reason, empty downloaded error logs, and actively constructing Zak datasets, but not yet at `loading_runs_done` or first training iteration. Full Zak data loading is slow, with progress in the tens of runs out of roughly `8238` per rank after several minutes.
  - Stopped job `174358` on user request before first training step; terminal state became `Failed` with status reason `CancelRequested by user`, final logs still had empty downloaded error files and showed eager Zak data loading around `5200-6400` of `8237/8238` runs per rank.
  - Added cache-only parquet wiring for Zak's experimental parquet loader path, committed and pushed `fd04bc5c9ed5` (`fix: use cached Zak parquets for parking training`), then dispatched cached-parquet 0.25-fraction training.
  - Cancelled accidental P3 job `174468` before start and resubmitted as P1 job `174469` / session `session_2026_06_04_12_29_17_zcache25`; final observed state was `Running`.
  - Monitored job `174514` / session `session_2026_06_04_14_16_56_si_parking_bc_train_zak_mcv_new_phase2_release_2026_5_21_zcm25fix` through the requested 5K-sample threshold; W&B reached `trainer/samples_seen=5248`, `trainer/global_step=41`, and Surfboard still reported `Running` with no termination reason.
  - Investigated job `174514` after it later failed; rank logs pointed to CUDA/NCCL peer GPU memory over NVLink or hardware error, not data loading.
  - Resubmitted retry job `174548` / session `session_2026_06_04_15_55_54_zakzcm25r2` with the same config and `--max_restarts 0`; monitored through `trainer/samples_seen=10368`, `trainer/global_step=81`, with run state still `running`.
  - Investigated job `174548` after terminal failure; root cause was non-finite Zak `egopose` mapped to SI `VEHICLE_POSE`, then patched the Zak-to-SI adapter to repair non-finite pose, waypoint, scalar control, and camera-calibration fields with focused regression tests.
  - Reduced Zak datamodule non-dev per-rank batch size from `4` to `2` for the parking release mode, keeping dev at `1`; config and adapter tests pass.
  - Committed and pushed `9c4cee467c46`, published the matching scaled-intelligence image, and dispatched batch-2 cached-parquet retry job `174665` / session `session_2026_06_04_20_56_25_si_parking_bc_train_zak_mcv_new_phase2_release_2026_5_21_zcm25b2` at priority `P1`.
  - Monitored job `174665` to `Running`; logs showed cached-parquet `Load runs` completed at `2060/2060` and sampler construction started, while W&B still reported `trainer/global_step=0` / `trainer/samples_seen=0` at last check.
  - Cancelled job `174665` after confirming it trained too slowly versus Zak's latest native W&B runs; terminal Surfboard state `Canceled`, final W&B summary `trainer/global_step=496`, `trainer/samples_seen=31744`, throughput `5.92` samples/sec world.
  - Notion update remains pending unless requested for this experimental branch.
- Task note: [[agent_tasks/2026/06/Week-1/2026-06-03-zak-datamodule-parking-training|2026-06-03 Zak Datamodule Parking Training]]

## 2026-06-07 - Parking/PUDO Strict Filter Disable

- Topic: Disable overly aggressive strict data-quality filters from generic parking/PUDO materialisation.
- Labels: parking, pudo, materialization, generic-materialisation, filters.
- Branch: `boris/pudo_generic_materialization`.
- PR: Draft PR to main exists for the branch.
- Change type: Code change, local.
- Areas: `/workspace/WayveCode/wayve/ai/services/sampling/datasets/parking_pudo/common.py`.
- Changes:
  - Removed missing-wheel-odometry, diversion/lens-obscured, and broad out-of-scope filters from active parking/PUDO bucket exclusions.
  - Preserved those filters in `PARKING_PUDO_DISABLED_DATA_QUALITY_EXCLUSIONS` for a future stricter variant.
  - Added regression assertions for the disabled filters and verified the focused parking_pudo test slice with Bazel.
  - Pushed commit `916300d7c11c` and submitted full branch-release reruns:
    - `parking_pudo/default`: Flyte `ajknvcp7szpbd79b9672`.
    - `parking_pudo/anchors`: Flyte `agrhccqmg2dvtgmcjd88`.
- Task note: [[agent_tasks/2026/06/Week-1/2026-06-06-parking-pudo-generic-materialization|2026-06-06 Parking PUDO Generic Materialization]]

## 2026-06-08 - Parking/PUDO Anchor Gap Follow-Up

- Topic: Relax remaining generic Parking/PUDO strict filters and continue event-table vs anchor-gap diagnosis.
- Labels: parking, pudo, materialization, generic-materialisation, filters, anchors.
- Branch: `boris/pudo_generic_materialization`.
- PR: Draft PR to main exists for the branch.
- Change type: Code change, Flyte runs, data investigation.
- Areas: `/workspace/WayveCode/wayve/ai/services/sampling/datasets/parking_pudo`.
- Changes:
  - Removed `select_allowed_run_tags` and `exclude_low_steering_bias_confidence` from active Parking/PUDO bucket exclusions.
  - Preserved both filters in `PARKING_PUDO_DISABLED_DATA_QUALITY_EXCLUSIONS` for a stricter future dataset variant.
  - Updated README and regression assertions for the relaxed exclusion policy.
  - Pushed commit `a0fc5caa4984` and submitted full branch-release reruns:
    - `parking_pudo/default`: Flyte `a7v5p9b8vwfpdc74b8nx`.
    - `parking_pudo/anchors`: Flyte `ashhhp9w5wlvcg2gv9r8`.
  - Found additional non-filter root causes for missing `dc_pudo_uk` anchors: excluded-geofence hazard suppression and empty approach windows at some gear-to-park anchors.
- Task note: [[agent_tasks/2026/06/Week-2/2026-06-08-parking-pudo-anchor-gap-debug|2026-06-08 Parking PUDO Anchor Gap Debug]]

## 2026-06-08 - Parking/PUDO Global Geofence Exclusion

- Topic: Reintroduce global geofence exclusion for generic Parking/PUDO buckets.
- Labels: parking, pudo, materialization, generic-materialisation, geofence, filters.
- Branch: `boris/pudo_generic_materialization`.
- PR: Draft PR to main exists for the branch.
- Change type: Code change.
- Areas: `/workspace/WayveCode/wayve/ai/services/sampling/datasets/parking_pudo`.
- Changes:
  - Added `exclude_geofenced` back to `PARKING_PUDO_BASE_EXCLUSIONS`.
  - This applies to every default and anchor bucket so no samples are emitted from excluded offices/test tracks.
  - Kept PUDO hazard geofence suppression in `signals.py`.
  - Updated README and regression assertions; focused parking_pudo Bazel test passed.
- Task note: [[agent_tasks/2026/06/Week-2/2026-06-08-parking-pudo-anchor-gap-debug|2026-06-08 Parking PUDO Anchor Gap Debug]]

## 2026-06-08 - Parking/PUDO Out-of-Scope Filter Narrowing

- Topic: Keep out-of-scope intervention filtering except for diversion and lens-obscured.
- Labels: parking, pudo, materialization, generic-materialisation, filters, interventions.
- Branch: `boris/pudo_generic_materialization`.
- PR: Draft PR to main exists for the branch.
- Change type: Code change.
- Areas: `/workspace/WayveCode/wayve/ai/services/sampling/datasets/parking_pudo`.
- Changes:
  - Added a parking/PUDO-specific active filter that excludes `OUT_OF_SCOPE_INTERVENTION_WHATS` except `diversion` and `lens_obscured`.
  - Kept `exclude_diversion_and_lens_obscured_interventions` disabled.
  - Updated README and regression assertions; focused parking_pudo pytest and ruff lint passed.
- Task note: [[agent_tasks/2026/06/Week-2/2026-06-08-parking-pudo-anchor-gap-debug|2026-06-08 Parking PUDO Anchor Gap Debug]]

## 2026-06-08 - Parking/PUDO Event-vs-Anchor Recheck

- Topic: Recheck missing PUDO/UnPUDO event-table rows against completed generic anchor parquet.
- Labels: parking, pudo, materialization, anchors, databricks.
- Branch: `boris/pudo_generic_materialization`.
- PR: Draft PR to main exists for the branch.
- Change type: Data investigation.
- Areas: `parking.pudo_unpudo_unpark_events_gear_fix`, `sampling_materialised/parking_pudo/anchors`.
- Changes:
  - Exported deduped PUDO/UnPUDO event-table rows and compared them with local copies of `dc_pudo_*` and `dc_unpudo_*` anchor parquet.
  - Found exact timestamp matching overstates the UnPUDO gap because many generic movement anchors are within `~0.05s` to `1s` of the notebook timestamp.
  - Confirmed the remaining UK/USA event-vs-anchor gap is still large after tolerance checks.
  - Inspected a concrete missing `dc_pudo_uk` example and confirmed raw gear, hazard, speed, autonomy, skip-reason, and filtered-corpus signals are valid, leaving generic window/assignment or another base exclusion as the next trace target.
- Task note: [[agent_tasks/2026/06/Week-2/2026-06-08-parking-pudo-anchor-gap-debug|2026-06-08 Parking PUDO Anchor Gap Debug]]

## 2026-06-08 - Event Clip Viewer Anchor Comparison

- Topic: Add event-table vs materialization-anchor comparison to the Parking event clip viewer.
- Labels: parking, pudo, event-viewer, anchors, materialization.
- Branch: `boris/event_clip_viewer`.
- PR: n/a.
- Change type: Code change, local server.
- Areas: `/workspace/event_clip_viewer/wayve/ai/parking/tools/event_clip_viewer`.
- Changes:
  - Added an anchor-comparison mode defaulting to `dc_pudo_uk` and the latest parking/PUDO anchors root.
  - Loaded selected bucket anchors from parquet and matched them to event-table rows by nearest same-run timestamp within 30 seconds.
  - Added matched, missing-in-anchors, event rows, and anchor rows tables while preserving clip playback.
  - Verified scoped `py_checks`, ran a small matcher smoke check, and served the app on port 3001.
- Task note: [[agent_tasks/2026/06/Week-2/2026-06-08-event-clip-viewer-anchor-comparison|2026-06-08 Event Clip Viewer Anchor Comparison]]

## 2026-06-08 - Event Clip Viewer Anchor Cache Fix

- Topic: Correct event-viewer anchor root and avoid slow full-root scans.
- Labels: parking, pudo, event-viewer, anchors, materialization, cache.
- Branch: `boris/event_clip_viewer`.
- PR: n/a.
- Change type: Code change, local server.
- Areas: `/workspace/event_clip_viewer/wayve/ai/parking/tools/event_clip_viewer`.
- Changes:
  - Restored the default anchor root to `parking_pudo/anchors/boris-pudo-generic-materialization/2026-06-08-1`.
  - Replaced remote recursive bucket discovery with the known parking/PUDO bucket list.
  - Added selected-bucket local parquet caching under `/tmp/event_clip_viewer_anchor_cache`.
  - Added an `all` split default and fixed split-specific loading so absent splits no longer fall back to train.
  - Verified corrected `dc_pudo_uk` counts: `28,658` all-split anchors, `26,362` matched events within 30s, `24,993` missing events.
- Task note: [[agent_tasks/2026/06/Week-2/2026-06-08-event-clip-viewer-anchor-comparison|2026-06-08 Event Clip Viewer Anchor Comparison]]

## 2026-06-08 - Parking/PUDO Anchor Geofence Rerun

- Topic: Dispatch anchor materialization after global geofence reintroduction.
- Labels: parking, pudo, materialization, anchors, flyte, geofence.
- Branch: `boris/pudo_generic_materialization`.
- PR: Draft PR to main exists for the branch.
- Change type: Flyte run.
- Areas: `wayve/ai/services/sampling/datasets/parking_pudo`.
- Changes:
  - Published sampling image `wayveacrprodflyte.azurecr.io/sampling@sha256:b8d0012d96d563423fc346ba82e7f1fc32a81462b5d7b025b9a443a37a8b46d7`.
  - Pushed branch-release tag `sampling/parking_pudo/anchors/boris-pudo-generic-materialization/2026-06-08-2`.
  - Submitted `parking_pudo/anchors` Flyte execution `a6jn55f87zptzqkkdsv7`.
  - Expected output root: `sampling_materialised/parking_pudo/anchors/boris-pudo-generic-materialization/2026-06-08-2`.
- Task note: [[agent_tasks/2026/06/Week-2/2026-06-08-parking-pudo-anchor-gap-debug|2026-06-08 Parking PUDO Anchor Gap Debug]]

## 2026-06-09 - Parking/PUDO Anchors Current Rerun

- Topic: Dispatch full anchors materialization from current branch state.
- Labels: parking, pudo, materialization, anchors, flyte.
- Branch: `boris/pudo_generic_materialization`.
- PR: Draft PR to main exists for the branch.
- Change type: Flyte run.
- Areas: `wayve/ai/services/sampling/datasets/parking_pudo`.
- Changes:
  - Fast-forwarded local branch to `d8d061a38992b97e6d63e3acfb38a93db0335fe5`.
  - Refreshed ACR auth and published missing sampling image tag `borisindel-tmp-build-0.1.125-boris-pudo_generic_materialization-59584`.
  - Submitted full `parking_pudo/anchors` sample workflow execution `alfttk58xgtc5gdgwg7f`.
  - Expected output root: `sampling_materialised/parking_pudo/anchors/boris-pudo-generic-materialization/2026-06-09-1`.
- Task note: [[agent_tasks/2026/06/Week-2/2026-06-09-parking-pudo-anchors-current-rerun|2026-06-09 Parking/PUDO Anchors Current Rerun]]

## 2026-06-09 - Parking/PUDO Anchor 120s Mismatch Audit

- Topic: Audit `dc_pudo_uk` notebook/generic anchor mismatches with a 120s threshold and temporary no-snap code.
- Labels: parking, pudo, materialization, anchors, databricks, flyte.
- Branch: `boris/pudo_generic_materialization`.
- PR: Draft PR to main exists for the branch.
- Change type: Flyte run, data investigation.
- Areas: `wayve/ai/services/sampling/datasets/parking_pudo`, `wayve/ai/parking/tools/event_clip_viewer`.
- Changes:
  - Published sampling image digest `sha256:cb913f28e91c8ff258de411d040a9fef1b712ea5b7fefdf4dc7a443989dcf6e5` with `_snap_park_to_stop` temporarily removed.
  - Submitted full anchors sample workflow execution `amspk7tzzcgd9ds4tjvm`.
  - Recomputed cached `dc_pudo_uk` event-vs-anchor comparison at 120s: `30,061` matched, `2,075` missing in anchors, `4,524` missing in event table.
  - Debugged five March-May rows from each mismatch type with `debug_sampling`.
  - Found four of five sampled missing-in-anchor rows are selected by current code and are stale-root issues; one remains a real generic-vs-notebook PUDO context mismatch.
  - Found sampled missing-in-event-table rows are current generic PUDO anchors, while notebook rows are absent, shifted outside 120s, or classified as another event type.
- Task note: [[agent_tasks/2026/06/Week-2/2026-06-09-parking-pudo-anchor-mismatch-debug|2026-06-09 Parking/PUDO Anchor Mismatch Debug]]

## 2026-06-11 - Parking/PUDO Departure 60s Rerun

- Topic: Align generic unpark/UnPUDO movement verification with the event notebook's 60s transition search.
- Labels: parking, pudo, materialization, flyte, anchors.
- Branch: `boris/pudo_generic_materialization`.
- PR: Draft PR to main exists for the branch.
- Change type: Code change, Flyte run.
- Areas: `wayve/ai/services/sampling/datasets/parking_pudo`.
- Changes:
  - Changed the shared departure lookahead default from 30s to 60s for unpark/UnPUDO, pre-departure, and departure-near-CA bucket selection.
  - Updated Parking/PUDO dataset docs to describe the 60s displacement verification.
  - Published sampling image digest `sha256:765b61967577da92917bee3741704275d3002befe49cfbde27b53f91a9b81a57` for commit `5f0b1777890e`.
  - Terminated stale anchors execution `ar5nx4qnxxrgm7vtm9sm` after it resolved to released image `0.1.125`.
  - Submitted branch-image sample executions `armqrmh7847nbmxv7f9z` (`parking_pudo/anchors`) and `ahp8gvv9z4v2tjcd4qqr` (`parking_pudo/default`).
- Task note: [[agent_tasks/2026/06/Week-2/2026-06-11-parking-pudo-departure-60s-rerun|2026-06-11 Parking/PUDO Departure 60s Rerun]]

## 2026-06-09 - Event Viewer Reverse Anchor Mismatches

- Topic: Make event-viewer anchor rows missing from the event table visible and inspect one missing PUDO example.
- Labels: parking, pudo, event-viewer, anchors, databricks.
- Branch: `boris/pudo_generic_materialization`.
- PR: Draft PR to main exists for the branch.
- Change type: Code change, data investigation, local server.
- Areas: `wayve/ai/parking/tools/event_clip_viewer`.
- Changes:
  - Added a default-visible `Missing in event table` metric/table and clip-player row source.
  - Added raw-buckets vs balanced-dataset anchor parquet selection, defaulting to raw bucket semantics for event comparison.
  - Updated the default anchor root to the latest dev root.
  - Investigated `fme20036/... · 1774544581333311`: event-table PUDO/GBR/non-AV, but corpus has no hazard around the stop and trip events are empty, so generic has no PUDO context to emit `dc_pudo_uk`.
- Task note: [[agent_tasks/2026/06/Week-2/2026-06-08-event-clip-viewer-anchor-comparison|2026-06-08 Event Clip Viewer Anchor Comparison]]

## 2026-06-10 - Parking/PUDO Duplicate Anchor Gate

- Topic: Temporarily relax run-length filtering and add approach-displacement gate for park/PUDO anchors.
- Labels: parking, pudo, materialization, anchors, duplicate-filtering.
- Branch: `boris/pudo_generic_materialization`.
- PR: Draft PR to main exists for the branch.
- Change type: Code change, investigation.
- Areas: `wayve/ai/services/sampling/datasets/parking_pudo`.
- Changes:
  - Moved `exclude_runs_that_are_too_short` from active base exclusions to the disabled comparison-only exclusions list.
  - Added a programmable 30s lookback / 5m point-to-point displacement gate before the park-vs-PUDO split.
  - Added a matching 30s lookahead / 5m max-displacement gate for unpark/UnPUDO departure anchors.
  - Split exclusion routing so PUDO/UnPUDO buckets keep relaxed event-table comparison filters, while park/unpark buckets restore the stricter filters except `exclude_autonomous_runs`.
  - Documented the temporary filter state in the Parking/PUDO materialization README and mismatch-debug note.
  - Published test sampling image `wayveacrprodflyte.azurecr.io/sampling:bpudo-gates-20260610` and submitted full anchors sample execution `anlhtrggbm92jdvp5jd7`.
- Task note: [[agent_tasks/2026/06/Week-2/2026-06-09-parking-pudo-anchor-mismatch-debug|2026-06-09 Parking/PUDO Anchor Mismatch Debug]]

## 2026-06-09 - Parking Interleave Route-End Hazard

- Topic: Add parking deployment wrapper behavior for route-end hazards and park gear latching.
- Labels: parking, pudo, deployment, interleave-control, gear, hazards.
- Branch: `boris/parking-past30-no-standstill-gear-aug/main_cherrypick_new_driving`.
- PR: n/a.
- Change type: Code change, tests.
- Areas: `wayve/ai/zoo/deployment/deployment_wrapper.py`, `wayve/ai/si/test/interfaces/test_deployment_wrapper.py`.
- Changes:
  - Added the persistent parking route-end latch to `ParkingDeploymentWrapperImpl` so once policy gear reaches `PARK` under the close-to-route-end gate, later non-park gears are blocked until the gate clears.
  - Forced parking output indicator weights from `ParkingDeploymentWrapperImpl` to expose a hazard channel and select it when the route-end gate is true.
  - Added default-on flags `enable_end_of_route_hazard_lights` and `enable_end_of_route_gear_latch` to control these behaviors independently.
  - Reused parking's `_end_of_route_mask` for the hazard/latch gate instead of the base `_is_end_of_route`.
  - Kept `DeploymentWrapperBase` on the generic pre-existing interleave control behavior and avoided a parking `_wrap_with_interleave_control` override.
  - Added focused tests for hazard forcing, latch reset behavior, and disabled-flag behavior, plus ran deployment wrapper lint/type checks.
  - Fixed SI deploy temporal-cache config rewriting for release-loader backed BC models and added a focused regression test.
  - Aligned the Python deployment output validator with the DMI 4-channel indicator contract so hazard indicator weights can compile.
  - Moved the generic interleave end-of-route threshold to a base-wrapper instance attribute so generated TorchScript wrapper classes resolve it.
  - Moved the remaining generic interleave constants used by scripted methods to initialized attributes/buffers, covering handover speed, forward-drive position, and valid drive-position values.
  - Deployed `gorilla-tan-splendid` as `teal-elk-amused` with parking interleave control, verified Gen2 radar config, added Console lifecycle note, created the Notion model-card row, and triggered Model CI build `75365`.
- Task note: [[agent_tasks/2026/06/Week-2/2026-06-09-parking-interleave-route-end-hazard|2026-06-09 Parking Interleave Route-End Hazard]]

## 2026-06-10 - Parking/PUDO PUDO Filter Tightening

- Topic: Restore full geofence and selected data-quality filters for PUDO/UnPUDO generic materialization.
- Labels: parking, pudo, materialization, filters, geofence.
- Branch: `boris/pudo_generic_materialization`.
- PR: Draft PR to main exists for the branch.
- Change type: Code change, tests.
- Areas: `wayve/ai/services/sampling/datasets/parking_pudo`, `wayve/ai/services/sampling/test/datasets/parking_pudo`.
- Changes:
  - Switched PUDO/UnPUDO exclusions back to the shared full `exclude_geofenced` filter instead of event-notebook office-only geofencing.
  - Made PUDO hazard/trip context suppression use the full sampling geofence list.
  - Re-enabled `exclude_low_steering_bias_confidence` and `exclude_mache_without_wheel_odometery` for PUDO/UnPUDO bucket families.
  - Removed the obsolete event-notebook office-only geofence constant and filter, then moved the remaining geofence helper into `signals.py`.
  - Updated focused parking_pudo filter tests and verified the parking_pudo slice.
- Task note: [[agent_tasks/2026/06/Week-2/2026-06-10-parking-pudo-pudo-filter-tightening|2026-06-10 Parking/PUDO PUDO Filter Tightening]]

## 2026-06-11 - Parking/PUDO Low Steering Filter Relaxation

- Topic: Remove low steering-bias confidence exclusion from PUDO/UnPUDO buckets after mismatch analysis.
- Labels: parking, pudo, materialization, filters, anchors.
- Branch: `boris/pudo_generic_materialization`.
- PR: Draft PR to main exists for the branch.
- Change type: Code change, tests.
- Areas: `wayve/ai/services/sampling/datasets/parking_pudo`, `wayve/ai/services/sampling/test/datasets/parking_pudo`.
- Changes:
  - Removed `exclude_low_steering_bias_confidence` from the PUDO/UnPUDO base exclusion family.
  - Kept the same filter active for stricter park/unpark buckets.
  - Added the filter to the disabled/future PUDO/UnPUDO data-quality exclusion list and updated README wording.
  - Updated the focused filter-policy test and reran the parking_pudo sampling test slice.
  - Published a branch sampling image and submitted sample Flyte runs for `parking_pudo/default` and `parking_pudo/anchors`.
- Task note: [[agent_tasks/2026/06/Week-2/2026-06-11-unpudo-15s-window|2026-06-11 UnPUDO 15s Window]]

## 2026-06-14 - UnPUDO HARI Single Dataset Upload

- Topic: Upload corrected train/validation-native UnPUDO standstill clips to new HARI as one annotation dataset.
- Labels: parking, pudo, unpudo, hari, annotation-data.
- Branch: `boris/hari_pudo`.
- PR: n/a.
- Change type: Data upload, operational manifest.
- Areas: HARI, Azure Blob video outputs, vault documentation.
- Changes:
  - Registered 3962 blob-backed MP4 references into new HARI dataset `194350e6-1506-40e4-83c4-59a2d1593459`.
  - Kept train/validation hidden from annotators by creating only a single HARI dataset and `all_videos` subset.
  - Created local JSON manifest `/tmp/unpudo_trainval_splitnative_20260611_194255_UTC_manifest.json` with `video_file_path`, `split`, `run_id`, and `timestamp_unixus`.
  - Documented that uploading the JSON manifest back to `qualitymatch-data` was blocked by current Azure write/list-key permissions.
- Task note: [[agent_tasks/2026/06/Week-2/2026-06-14-unpudo-hari-single-dataset-upload|2026-06-14 UnPUDO HARI Single Dataset Upload]]

## 2026-06-14 - Parking Deployment Gear Indicator Port

- Topic: Port parking deployment gear/indicator handling and deploy the trained Guy-recipe PUDO model with parking interleave control.
- Labels: parking, pudo, deployment, interleave-control, gear, model-ci.
- Branch: `codex/guy-recipe-gear-root-amaranth-root`.
- PR: n/a.
- Change type: Code change, deployment, tests, Notion update.
- Areas: `wayve/ai/zoo/deployment/deployment_wrapper.py`, `wayve/ai/zoo/deployment/deployment_wrapper_codegen.py`, `wayve/ai/si/test/interfaces/test_deployment_wrapper.py`, `wayve/ai/zoo/deployment/test/test_deployment_wrapper_codegen.py`, Parking/PUDO Notion model cards.
- Changes:
  - Ported parking deployment gear output handling, route-end hazard forcing, and route-end park gear latching from `boris/training/main_cherrypick_generic_data`.
  - Made interleave thresholds scriptable for generated TorchScript wrapper classes.
  - Added a parking-specific interleave wrapper path for `DrivingOutputWithGearOutput` and a TorchScript regression test.
  - Deployed `astonishing-chocolate-albatross` checkpoint `100000` as `moccasin-vivid-caterpillar` with interleave control group `parking`.
  - Verified Gen2 radar config and triggered Alpha3 Model CI build `75970`.
  - Updated the Parking/PUDO Notion model-card row/page; Console lifecycle note remains blocked on refreshed Console auth.
- Task note: [[agent_tasks/2026/06/Week-2/2026-06-14-parking-deployment-gear-indicator-port|2026-06-14 Parking Deployment Gear Indicator Port]]

## 2026-06-17 - Astonishing No Route-End Latch Deploy

- Topic: Redeploy `astonishing-chocolate-albatross` with parking interleave control but route-end gear latch and hazard forcing disabled.
- Labels: parking, pudo, deployment, interleave-control, model-ci.
- Branch: `codex/guy-recipe-gear-root-amaranth-root`.
- PR: n/a.
- Change type: Local deploy plumbing, deployment, Model CI.
- Areas: `wayve/ai/si/deploy.py`, `wayve/ai/si/models/deployment.py`, Model Catalogue.
- Changes:
  - Added local deploy flags for `enable_end_of_route_hazard_lights` and `enable_end_of_route_gear_latch`, defaulting to existing true behavior.
  - Threaded those flags into `ParkingDeploymentWrapperImpl` wrapper kwargs.
  - Redeployed checkpoint `100000` as `coral-snake-substantial-bronze` with both route-end behaviors disabled and parking interleave group enabled.
  - Verified the Gen2 inference config retained parking interleave control and radar settings.
  - Triggered Model CI build `76415`; Gen2 archive and Eval Studio Gen2 Alpha3 jobs succeeded at last check.
  - Added a Model Catalogue note for the deployed model and created UK PUDO licensing plus UK Drift/PUDO follow-up experiments against `green-stegosaurus-brave`.
- Task note: [[agent_tasks/2026/06/Week-3/2026-06-17-astonishing-no-route-end-latch-deploy|2026-06-17 Astonishing No Route-End Latch Deploy]]

## 2026-06-27 - Unparking Route Shortening Fix

- Topic: Fix Parking/PUDO route-shortening handoff for unparking samples.
- Labels: parking, pudo, route-shortening, datamodule.
- Branch: `boris/parking-past30-no-standstill-gear-aug/scarlet_full_gear_root_jitter_g50`.
- PR: n/a.
- Change type: Code change, tests.
- Areas: `wayve/ai/si/datamodules/parking.py`.
- Changes:
  - Kept the existing `_parking_entry_lookahead_index` handoff contract.
  - Use the first movement after the parked segment as the unparking/pre-start route-shortening anchor.
  - Added focused regression coverage for SI lookahead-index storage.
- Task note: [[agent_tasks/2026/06/Week-4/2026-06-27-unparking-route-shortening-fix|2026-06-27 Unparking Route Shortening Fix]]

## 2026-06-28 - UnPUDO CA And Pre-Start Update

- Topic: Keep stopped UnPUDO CA handovers and widen UnPUDO pre-start context.
- Labels: parking, pudo, materialisation, sampling.
- Branch: `boris/pudo_generic_materialization`.
- PR: n/a.
- Change type: Code change, tests.
- Areas: `wayve/ai/services/sampling/datasets/parking_pudo`.
- Changes:
  - Added a `filter_remain_stopped` selector option while preserving the default stopped-handover rejection for existing callers.
  - Disabled that filter only for UnPUDO CA and `failed_to_unpudo` buckets, including anchor buckets.
  - Changed `dc_pre_start_unpudo` from 0.9s to 5s before first movement, still extending back to directional indicators.
  - Added focused regression tests for stopped UnPUDO CA bucket wiring and the 5s pre-start window.
- Task note: [[agent_tasks/2026/06/Week-4/2026-06-28-unpudo-ca-prestart-update|2026-06-28 UnPUDO CA And Pre-Start Update]]

## 2026-06-28 - Denis Controller Accelerate From Stopped

- Topic: Run Accelerate From Stopped PUDO/UnPUDO reproduction for three Parking/PUDO models with Denis's controller.
- Labels: parking, pudo, av-test, evaluation, denis-controller.
- Branch: `origin/denis/pudo-start-stop-threshold` at `73ff920e58d9`.
- PR: n/a.
- Change type: Evaluation run.
- Areas: AV Test Pipeline, Eval Studio, Model Catalogue, Databricks.
- Changes:
  - Resolved model sessions/checkpoints and Gen2 artefacts for `teal-ecstatic-magpie`, `fuchsia-vampire-bat-jubilant`, and `acrobatic-rose-cobra`.
  - Generated scenario-version `5700` inputs for collection `45fe8c12-859d-49c3-919b-d639bbbfea96`.
  - Ran simulation with Denis's controller branch, applied the guide's `+2,000,000 us` shifted segment starts, and ran local timestamp evaluation with `--skip-missing-inference`.
  - Wrote Delta result tables `--local--6351c1ca`, `--local--ce3fffbe`, and `--local--4581c6e9`.
  - Queried corrected row and segment pass rates; `acrobatic-rose-cobra` led the common-segment comparison at 65.051% row pass and 61.815% all-rows-pass segment rate.
- Task note: [[agent_tasks/2026/06/Week-4/2026-06-28-denis-controller-accelerate-from-stopped|2026-06-28 Denis Controller Accelerate From Stopped]]

## 2026-06-18 - Lime 100K Resume

- Topic: Resume `lime-theoretical-walrus` from 80K to 100K.
- Labels: parking, pudo, training, resume.
- Branch: `boris/parking-past30-no-standstill-gear-aug/main_cherrypick_generic_data`.
- PR: n/a.
- Change type: Training job submission.
- Areas: Surfboard, Parking BC training.
- Changes:
  - Verified `lime-theoretical-walrus` maps to `session_2026_06_03_14_19_48_p521r80`, completed at 80K.
  - Submitted restore job `181197` from `restart_step=80000` with `num_steps=100000` and `model.lr_scheduler_num_steps=100000`.
  - New run is `purple-mallard-proficient`, session `session_2026_06_18_07_38_05_p521r100`.
- Task note: [[agent_tasks/2026/06/Week-3/2026-06-18-lime-100k-resume|2026-06-18 Lime 100K Resume]]

## 2026-06-18 - Yellow Cheetah Alpha3 and UK Experiments

- Topic: Add lifecycle note, trigger Alpha3 Model CI, and create UK follow-up experiments for `yellow-cheetah-sparkling`.
- Labels: parking, pudo, model-ci, licensing, drift, on-road.
- Branch: `boris/parking-past30-no-standstill-gear-aug/main_cherrypick_generic_data`.
- PR: n/a.
- Change type: Model Catalogue note, Model CI trigger, Console experiments.
- Areas: Model Catalogue, Buildkite Model CI, Console on-road experiments.
- Changes:
  - Resolved `yellow-cheetah-sparkling` to checkpoint `10` / 100K and Gen2 artefact `d47f07fc-4ac3-4ab3-a693-8629000fdc00`.
  - Triggered Alpha3 Model CI build `76550` for `gen2-av-mache-alpha3`.
  - Added Model Catalogue note `c777d26a-ad27-4d73-afab-d9e8f218b94c`.
  - Created UK PUDO licensing experiment `bb5b0076-4d81-4546-b335-b557b66299fd` against `green-stegosaurus-brave`.
  - Created UK Drift/PUDO experiment `9765b6cf-11cf-4164-9b23-54760fff764e` against `green-stegosaurus-brave`, copying the reference PUDO/SBW config.
- Task note: [[agent_tasks/2026/06/Week-3/2026-06-18-yellow-cheetah-alpha3-and-uk-experiments|2026-06-18 Yellow Cheetah Alpha3 and UK Experiments]]

## 2026-06-17 - Bokeh Parking Wrapper Direct Inputs

- Topic: Make ParkingPlotter visualisation use session OTF config and actual parking deployment wrapper inference.
- Labels: parking, bokeh, visualisation, otf, deployment-wrapper.
- Branch: `boris/training/main_cherrypick_generic_data`.
- PR: n/a.
- Change type: Code change, tests, local verification.
- Areas: `wayve/ai/si/visualisation`, `wayve/ai/si/datamodules/otf.py`, `wayve/ai/lib/data/pipes/paths.py`.
- Changes:
  - Reused session/parking datamodule OTF settings while preserving explicit run-id/timestamp segment selection.
  - Fixed top-level direct-input MIMOST inference and preserved categorical tensor dtypes.
  - Forced `ParkingDeploymentWrapperImpl` visualisation through the top-level wrapper path so it represents actual deployment inference.
  - Added grouped-navigation stream and parking-mode adapter/default coverage for visualisation inputs.
  - Added a visible Parking / Navigation panel to `ParkingPlotter` with parking mode, unparking mode, stopping mode, nav timestamp, and grouped step/lane summaries.
  - Verified the reported ParkingPlotter command completes and renders 9 frames.
- Task note: [[agent_tasks/2026/06/Week-3/2026-06-17-bokeh-mimost-direct-inputs|2026-06-17 Bokeh MIMOST Direct Inputs]]

## 2026-06-18 - PUDO New Root Training Pair

- Topic: Submit and monitor paired Parking/PUDO training jobs for the updated PUDO data root.
- Labels: parking, pudo, training, notion.
- Branch: `boris/parking-past30-no-standstill-gear-aug/main_cherrypick_generic_data`, `boris/training/main_cherrypick_generic_data`.
- PR: n/a.
- Change type: Training job submission, monitoring, Notion update.
- Areas: Surfboard, W&B, Parking/PUDO Notion model cards.
- Changes:
  - Submitted `lionfish-copper-cautious` / job `181482` from `boris/parking-past30-no-standstill-gear-aug/main_cherrypick_generic_data`.
  - Submitted `lavender-centipede-strategic` / job `181488` from `boris/training/main_cherrypick_generic_data`.
  - Monitored both runs until they passed 1K training steps without terminal failure.
  - Created Notion model-card rows for both not-interleaved training nicknames.
- Task note: [[agent_tasks/2026/06/Week-3/2026-06-18-pudo-new-root-training-pair|2026-06-18 PUDO New Root Training Pair]]

## 2026-06-22 - Deployment Wrapper Default Gear CI Fix

- Topic: Add default policy gear output across deployment wrappers and fix CI contract gaps.
- Labels: deployment-wrapper, gear-output, torchscript, ci.
- Branch: `boris/deployment-wrapper-default-gear`.
- PR: `#120234`.
- Change type: Code change, CI fix.
- Areas: `wayve/ai/zoo/deployment`, `wayve/ai/slam/ooc_c2v/deployment`, `wayve/ai/slam/ooc_c2v/interfaces`.
- Changes:
  - Added default DRIVE `policy_gear_position` output handling for deployment wrappers and propagated it through interleaved outputs.
  - Kept parking wrapper predicted gear behavior while non-parking wrappers default to DRIVE.
  - Fixed the SLAM C2V calibration wrapper to keep `policy_gear_position` in both the positional output tuple and deployment output key list.
  - Verified focused deployment and calibration wrapper Bazel checks locally.
- Task note: [[agent_tasks/2026/06/Week-4/2026-06-22-deployment-wrapper-default-gear-ci-fix|2026-06-22 Deployment Wrapper Default Gear CI Fix]]

## 2026-06-29 - PUDO Harsh Brake Pre-CA

- Topic: Add a brake-override-backed UnPUDO pre-CA bucket to generic materialization.
- Labels: parking, pudo, materialization, flyte.
- Branch: `boris/pudo_generic_materialization`.
- PR: n/a.
- Change type: Code change, Flyte run.
- Areas: `wayve/ai/services/sampling/datasets/parking_pudo`.
- Changes:
  - Added raw DBW brake override timestamp aggregation from `BrakeReport1Mache.override_active`.
  - Added `pre_ca_unpudo_harsh_brake_*` bucket and anchor variant for interventions with brake override active within +/-1s.
  - Kept `dc_pre_start_unpudo` at 2s and submitted `parking_pudo/default` sample Flyte run `ad2q8cwvq5t4dj59gt6g`.
  - Fixed the brake override side-table join to preserve `vehicle_platform`, `run_date_iso`, and `run_id`, then submitted corrected Flyte run `avgcnlghmgkr2j4rjb4j`.
- Task note: [[agent_tasks/2026/06/Week-5/2026-06-29-pudo-harsh-brake-pre-ca|2026-06-29 PUDO Harsh Brake Pre-CA]]
