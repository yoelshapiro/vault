# Agents Change Log

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
- PR: `https://github.com/wayveai/WayveCode/pull/115845`.
- Change type: Notebook code change, uncommitted.
- Areas: `/workspace/materialization/wayve/ai/parking/notebooks/pudo_unpudo_event_detection.ipynb`.
- Changes:
  - Added `ENABLE_GEAR_SMOOTHING`, `GEAR_SMOOTHING_MIN_SEGMENT_US`, and `SMOOTHED_GEAR_COL` config knobs.
  - Built `gear_change_to_park` and `gear_change_from_park` from smoothed per-frame gear context.
  - Switched PUDO and UnPUDO gear transition seeding to use the new booleans while preserving raw gear and output table schema.
  - Removed a stale trip-table helper join to `prod_analytics.analytics.robotaxi_disengagement` after a runtime failure on unavailable `episode_start_lat` / `episode_start_lon` columns; the join's `event_success` output was not consumed downstream.
  - Validated notebook JSON, code-cell AST parse, `git diff --check`, and static invariants.
- Task note: [[agent_tasks/2026/06/Week-1/2026-06-03-event-gear-smoothing|2026-06-03 Event Gear Smoothing]]
