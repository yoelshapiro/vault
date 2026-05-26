# Agents Change Log

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
