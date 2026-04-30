# Codex Change Log — WayveCode

## Table of Contents
- [2026-04](#2026-04)
- [2026-03](#2026-03)
- [2026-02](#2026-02)
- [2026-01](#2026-01)
- [2025-12](#2025-12)

## 2026-04
> [!note] 2026-04

> #### 2026-04-30 — Parking gear and indicator loss implementation draft
- Topic: add an uncommitted opt-in draft of Zach Murez's per-waypoint gear and indicator heads/losses to Parking configs.
- Labels: #parking #pudo #gear #indicator #losses #training #zoo #si
- Branch: `boris/pudo_w_route_path_fixes_and_new_data`
- PR: none
- Change type: code/tests/docs
- Areas: `wayve/ai/zoo/outputs/`, `wayve/ai/zoo/losses/`, `wayve/ai/si/losses/`, `wayve/ai/si/configs/parking/`, `projects/`
- Changes:
  - [[projects/zach-gear-indicator-losses]]: updated the active project with the implementation draft, validation results, and the checkpoint-loading risk from increasing parking output-adaptor query count.
  - Added opt-in per-waypoint indicator and gear output heads, future class-change-weighted CE losses, BC loss config knobs, and Zach-like Parking config values (`indicator=10.0/0.5`, `gear=20.0/0.5`).
  - Revised the draft to reuse waypoint output tokens for per-waypoint gear/indicator instead of adding separate gear/indicator query tokens, including the behavior-control helper path.
  - Added/updated tests for per-waypoint head behavior, change-weighted future losses, and the current branch's 4-class indicator output shape.

> #### 2026-04-30 — Zach gear and indicator loss investigation
- Topic: document Zach Murez's per-waypoint gear and indicator classifier losses from `origin/zmurez/pudo` before making implementation changes.
- Labels: #parking #pudo #gear #indicator #losses #training #planning
- Branch: `boris/parking-materialization-config-dry-run`
- PR: none
- Change type: planning/docs
- Areas: `projects/`, `wayve/ai/experimental/`, `wayve/ai/zoo/`, `wayve/ai/si/`
- Changes:
  - [[projects/zach-gear-indicator-losses]]: created a new active vault project summarizing Zach's `PER_WAYPOINT` gear/indicator heads, change-weighted future-horizon CE losses, config values from `mcv_new_base0.yml`, differences from our current SI / zoo next-step expanded-logit implementation, and a minimal opt-in port plan if we decide to implement it later.

> #### 2026-04-30 — PUDO event/materialization speed and gear bucket plan
- Topic: plan a clean retry for extending the PUDO event and materialization notebooks with future-speed filtering, forward/reverse buckets, and gear-change buckets without repeating the slow failed materialization path.
- Labels: #parking #pudo #unpudo #unparking #materialization #notebooks #planning
- Branch: `parking/notebooks`
- PR: none
- Change type: planning/docs
- Areas: `wayve/ai/parking/notebooks/`, `projects/`
- Changes:
  - [[projects/pudo-event-materialization-speed-gear-buckets]]: created the active vault project, summarized the desired event-table schema and materialization behavior, captured the decision to keep the `+0.6s` speed cutoff in materialization rather than event detection, separated gear-change buckets from movement speed filtering, and laid out a performance-focused implementation plan based on one tagged sample DataFrame and bounded shared corpus joins.

> #### 2026-04-29 — Unflappable Azure Sea Cucumber interleave-control deploy
- Topic: deploy checkpoint 8 of `unflappable-azure-sea-cucumber` as a Parking/PUDO interleave-control model.
- Labels: #parking #deploy #interleave-control #model-catalogue #console
- Branch: `boris/training/kangaroo_with_50_and_route_shorten`
- PR: none
- Change type: operations
- Areas: Model Catalogue, Console, `agent_tasks/2026/04/Week-5/`
- Changes:
  - [[agent_tasks/2026/04/Week-5/2026-04-29-unflappable-azure-sea-cucumber-interleave-deploy]]: ran the checkpoint-8 deploy with `--step 80000` and suffix `__unflappable-azure-sea-cucumber_interleave_control_checkpoint8_v1`, uploaded output session `session_2026_04_29_08_18_36_si_parking_bc_train_release_2026_5_11_dir_unpudo_unpark_replicated_50_25_20_5__unflappable-azure-sea-cucumber_interleave_control_checkpoint8_v1`, resolved assigned nickname `mollusk-teal-terrestrial`, added the standard Parking/PUDO note, triggered Model CI build `69400`, started Eval Studio executions `2f65b4c9-6cda-4fd5-97ad-927944a3413a` and `ba876483-f43b-4ad9-a609-d090d6446a6c`, and created pending UK licensing experiment `583c3265-aec3-465b-b1b6-1704db46daf9`.

> #### 2026-04-29 — Stork Aquamarine PUDO UK licensing experiment
- Topic: create a UK PUDO licensing on-road experiment for the deployed interleave-control model `stork-aquamarine-astonishing`.
- Labels: #parking #pudo #licensing #uk #console #on-road-experiment
- Branch: `boris/foxmitten`
- PR: none
- Change type: operations
- Areas: Model Catalogue, Console on-road experiments, `agent_tasks/2026/04/Week-5/`
- Changes:
  - [[agent_tasks/2026/04/Week-5/2026-04-29-stork-aquamarine-pudo-uk-licensing]]: resolved `stork-aquamarine-astonishing` to checkpoint `1` and Gen2 artefact `1f1b0ccc-0050-409c-8f5d-beb222304ead`, confirmed the artefact supports `gen2-av-mache-alpha3`, found existing model change notes, and created pending UK PUDO licensing experiment `d2210a1b-eba9-4154-ab1d-afafe1222e39` from template `[UK] PUDO Licensing`.

> #### 2026-04-29 — Directional UNPUDO / unparking datamodule training
- Topic: add and train a Parking BC datamodule that uses future-speed-filtered directional UNPUDO / unparking buckets with explicit forward/reverse balancing.
- Labels: #parking #training #datamodule #unpudo #unparking #materialization #aks
- Branch: `boris/training/kangaroo_with_50_and_route_shorten`
- PR: none
- Change type: code/data-config/operations
- Areas: `wayve/ai/si/configs/parking/`, `agent_tasks/2026/04/Week-5/`
- Changes:
  - [[agent_tasks/2026/04/Week-5/2026-04-29-directional-unpudo-unpark-datamodule]]: added `parking_bc_new_driving_directional_unpudo_unpark_datamodule`, configured the train mix as `driving=50%`, `parking/pudo=25%`, `unpudo=20%`, `unparking=5%`, balanced derived DC forward/reverse buckets within UNPUDO and unparking, switched the root to the replicated `2026_04_29_07_52_36...` materialization after verifying it exists in both primary and SWE storage accounts, pushed commit `66a3f487862`, and submitted AKS training job `155836` (`unflappable-azure-sea-cucumber`).

> #### 2026-04-28 — PUDO materialization future-speed filter
- Topic: switch the PUDO / UNPUDO materialization notebook's UNPUDO / unparking sample filter from current acceleration to future speed at 0.6 seconds, and add gear-direction-specific bucket variants.
- Labels: #parking #pudo #unpudo #materialization #controller #data #gear
- Branch: `parking/notebooks`
- PR: none
- Change type: code/data-notebook
- Areas: `wayve/ai/parking/notebooks/`, `agent_tasks/2026/04/Week-5/`
- Changes:
  - [[agent_tasks/2026/04/Week-5/2026-04-28-pudo-materialization-future-speed-filter]]: updated the materialization notebook in `/tmp/wayvecode-parking-codeowners`, replaced the `0.734 m/s^2` acceleration filter for UNPUDO / unparking buckets with a future-speed filter requiring `0.15 m/s` at `timestamp + 0.6s`, projected clean sample columns before the future-speed join to avoid Spark duplicate-column ambiguity, and added additive gear-specific DC/AV bucket variants for `unparking gear=1`, `unpudo gear=1`, `parking prev_gear=-1`, and `unpudo gear=-1` while keeping the existing generic buckets.

> #### 2026-04-27 — Parking deploy skill for post-training interleave release workflow
- Topic: create a reusable local Codex skill that turns a finished Parking/PUDO training run into a deployed interleave-control release candidate with the standard Console note, Model CI, follow-up evals, and optional UK licensing experiment.
- Labels: #parking #deploy #skills #interleave-control #console #model-ci #licensing
- Branch: `boris/training/kangaroo_with_50_and_route_shorten`
- PR: none
- Change type: docs/tooling
- Areas: `~/.codex/skills/parking-deploy/`, `agent_tasks/2026/04/Week-4/`
- Changes:
  - [[agent_tasks/2026/04/Week-4/2026-04-27-parking-deploy-skill]]: created/refined the new `parking-deploy` skill, wired it to `parking-interleave-deploy`, `model-info-finder`, and model-catalogue helpers, documented the authenticated Console write path for model notes and licensing experiments, encoded the standard Parking/PUDO note and Alpha 3 Model CI flow, captured conservative trigger rules for the two extra parking evals, corrected the UK licensing experiment payload after the live test, and validated the skill with the local validator.
  - Follow-up: switched the parking-specific follow-up evaluation path from `$train-parking-model` conventions to `$av-test-multi-model-stats`, including scenario collection version resolution and per-collection/aggregate result reporting.

> #### 2026-04-27 — Live parking deploy skill test for precious-peach-panda
- Topic: run the new `parking-deploy` flow end to end on `precious-peach-panda`, including a fresh interleave-control deploy, Console note, Model CI trigger, parking follow-up Eval Studio suites, and UK licensing experiment.
- Labels: #parking #deploy #skills #interleave-control #console #model-ci #eval-studio #licensing
- Branch: `boris/training/kangaroo_with_50_and_route_shorten`
- PR: none
- Change type: operations
- Areas: `agent_tasks/2026/04/Week-4/`, Model Catalogue, Eval Studio, Console on-road experiments
- Changes:
  - [[agent_tasks/2026/04/Week-4/2026-04-27-precious-peach-panda-interleave-deploy]]: deployed fresh interleave-control model `yellow-iguana-healthy` from source `precious-peach-panda` checkpoint `10`, added the standard Parking/PUDO Console note, triggered Model CI build `69079`, started Eval Studio executions `9a914afa-a1d0-4604-a2e1-629e74cedbc9` and `75854d93-8e77-4c17-b270-894b44183349`, and created UK licensing experiment `45f938eb-3a3e-4708-9bb4-6c4cc24a5686`.

> #### 2026-04-26 — Sync parking.model_analysis to kept vault models and check for new runs
- Topic: make `parking.model_analysis` match the currently kept UNPUDO model-analysis cards in `parking_model_analysis`, and check whether selected parking models have any new run IDs since April 23, 2026.
- Labels: #parking #unpudo #unpark #model-analysis #databricks #vault #table-sync
- Branch: `boris/training/kangaroo_with_50_and_route_shorten`
- PR: none
- Change type: tooling/analysis/operations
- Areas: `tools/parking_model_analysis_writer/`, `parking_model_analysis/`, `agent_tasks/2026/04/Week-4/`
- Changes:
  - [[agent_tasks/2026/04/Week-4/2026-04-26-parking-model-analysis-table-sync-and-new-run-check]]: updated the model-analysis writer to rebuild rows from durable vault cards when packet manifests are absent, added `--delete-other-models` so the kept vault model set can replace stale table contents in one write, refreshed `insightful-magenta-porcupine` from source because its previous card linked to a non-matching run report, rewrote `parking.model_analysis` for the kept models (`eel`, `insightful`, `mallard`, `pink`, `sea`), and confirmed there were no new run IDs for the requested model list from `2026-04-23 00:00 UTC` onward.

> #### 2026-04-24 — Remove staged_rows from parking_model_analysis and move write payloads to /tmp
- Topic: delete the staged-row payload folder from the new `parking_model_analysis` repo and align the UNPUDO model-analysis skill/tooling so temporary Databricks write payloads live under `/tmp` instead of a vault repo.
- Labels: #parking #unpudo #unpark #model-analysis #vault #tmp #cleanup #skills
- Branch: `boris/training/kangaroo_with_50_and_route_shorten`
- PR: none
- Change type: cleanup/tooling/docs
- Areas: `parking_model_analysis/`, `~/git/ParkingSkills/skills/unpudo-unpark-model-analysis/`, `tools/parking_model_analysis_writer/`, `agent_tasks/2026/04/Week-4/`
- Changes:
  - [[agent_tasks/2026/04/Week-4/2026-04-24-remove-staged-rows-and-temp-write-payloads]]: deleted `parking_model_analysis/staged_rows/`, switched the durable vault root defaults to `parking_model_analysis`, changed incremental table-write staging to `/tmp/parking_model_analysis_staged_rows/` with post-write cleanup, updated the writer to read model/run cards from the new repo root, and refreshed the skill docs and agent prompt accordingly.

> #### 2026-04-24 — Move model-analysis corpus into parking_model_analysis repo
- Topic: relocate the durable UNPUDO / unparking model-analysis artifacts from the vault's old `model_analysis` directory into the new dedicated git repo at `parking_model_analysis`.
- Labels: #parking #unpudo #unpark #model-analysis #vault #repo-move
- Branch: `boris/training/kangaroo_with_50_and_route_shorten`
- PR: none
- Change type: cleanup/reorg
- Areas: `parking_model_analysis/`, `agent_tasks/2026/04/Week-4/`
- Changes:
  - [[agent_tasks/2026/04/Week-4/2026-04-24-move-model-analysis-to-parking-model-analysis]]: moved `models/`, `report_cards/`, and `staged_rows/` into the new `parking_model_analysis` repo, replaced the placeholder README with the existing model-analysis README content plus `staged_rows/` documentation, and removed the old `model_analysis/` directory entirely.

> #### 2026-04-24 — Remove early UNPUDO model cards from vault
- Topic: remove the earliest UNPUDO model-analysis cards that are no longer wanted, while preserving any run-report files still referenced by the remaining model cards.
- Labels: #parking #unpudo #unpark #model-analysis #vault #cleanup
- Branch: `boris/training/kangaroo_with_50_and_route_shorten`
- PR: none
- Change type: cleanup
- Areas: `model_analysis/models/`, `model_analysis/report_cards/`, `agent_tasks/2026/04/Week-4/`
- Changes:
  - [[agent_tasks/2026/04/Week-4/2026-04-24-remove-early-unpudo-model-cards]]: removed `8` model cards (`harlequin-excited-greyhound`, `blue-panther-solid`, `alpaca-chocolate-fearless`, `apricot-crocodile-uproarious`, `armadillo-amethyst-squeaky`, `lively-orange-horse`, `plum-timeless-beaver`, `satisfied-amber-moose`), deleted `288` run report files that were exclusive to those models, preserved `28` shared run reports, and verified that all remaining model-card links still resolve.

> #### 2026-04-24 — Refresh selected UNPUDO model cards with GitHub-safe links
- Topic: refresh the current UNPUDO / unparking vault outputs for `sea-cucumber-spectacular-orange`, `mallard-plum-mysterious`, and `pink-manta-ray-smooth`, then normalize model-card event links so they work in GitHub markdown as well as Obsidian.
- Labels: #parking #unpudo #unpark #model-analysis #vault #github-markdown #skills
- Branch: `boris/training/kangaroo_with_50_and_route_shorten`
- PR: none
- Change type: tooling/analysis/docs
- Areas: `~/git/ParkingSkills/skills/unpudo-unpark-model-analysis/`, `agent_tasks/2026/04/Week-4/`
- Changes:
  - [[agent_tasks/2026/04/Week-4/2026-04-24-refresh-selected-unpudo-model-cards]]: re-exported and regenerated the selected model/run cards under the current scorer (`sea`: `5` events, `mallard`: `12`, `pink`: `450`), updated the report generator and repair utility so model-card `card` links use standard markdown relative links with GitHub heading anchors, verified the rewritten cards, and removed the temporary packet/query caches from `/tmp`.

> #### 2026-04-24 — Parking interleave deploy for fiery-aardvark-copper
- Topic: deploy `fiery-aardvark-copper` with interleave control enabled, verify the exported radar config, resolve the assigned deployed nickname, and update the Parking/PUDO release row.
- Labels: #parking #deploy #interleave-control #radar #notion #vault
- Branch: `boris/training/kangaroo_with_50_and_route_shorten`
- PR: none
- Change type: operations
- Areas: `agent_tasks/2026/04/Week-4/`
- Changes:
  - [[agent_tasks/2026/04/Week-4/2026-04-24-parking-interleave-deploy-fiery-aardvark-copper]]: resolved the source session path, confirmed no radar overlay was needed, deployed the interleave-control export to `session_2026_04_23_13_18_45_si_parking_bc_train_release_2026_5_11_kangaroo_route_shorten_early_gating_fix_stop_anchor__fiery-aardvark-copper_interleave_control_v1`, verified the exported radar shape (`5` features, `800` points per scan), resolved assigned nickname `exotic-jellyfish-silver`, and updated the Parking/PUDO release row's `Related models` field.

> #### 2026-04-23 — Parking training submission for Wonjoon GC PUDO r017 fix3
- Topic: submit the requested Parking training run for the migrated Wonjoon parking diffusion datamodule and monitor it to a concrete Surfboard state.
- Labels: #parking #training #aks #surfboard #wandb #vault
- Branch: `boris/training/kangaroo_with_50_and_route_shorten`
- PR: none
- Change type: operations
- Areas: `agent_tasks/2026/04/Week-4/`
- Changes:
  - [[agent_tasks/2026/04/Week-4/2026-04-23-parking-training-submit-wonjoon-gc-pudo-r017-fix3]]: recorded the exact training command and prompt answers, captured the submitted run (`153682`) with session id, nickname, W&B, and Datadog links, noted the final observed state as `Queued` at queue position `1`, and confirmed the submitted provenance commit `82b56c60d401aeef4c92417c016f37286b8c2240`.

> #### 2026-04-23 — Parking training submission for Wonjoon GC PUDO root017
- Topic: submit the requested Parking training run for the Wonjoon GC parking datamodule on `boris/training/kangaroo_with_50_and_route_shorten`, monitor it through startup, and record the resulting job identifiers.
- Labels: #parking #training #aks #surfboard #wandb #vault
- Branch: `boris/training/kangaroo_with_50_and_route_shorten`
- PR: none
- Change type: operations
- Areas: `agent_tasks/2026/04/Week-4/`
- Changes:
  - [[agent_tasks/2026/04/Week-4/2026-04-23-parking-training-submit-wonjoon-gc-pudo-root017]]: recorded the requested training command and prompt answers, verified the branch/commit, captured the exact submitted run (`153615`) plus W&B/Datadog links, noted that it reached `Running` before later flipping to `Failed`, and logged the earlier incorrect worker submission (`153590`) for traceability.

> #### 2026-04-23 — Port PR 106346 parking data as selectable datamodule
- Topic: port the data portion of PR `#106346` into the current parking route-shortening branch as a second selectable parking datamodule without bringing over the diffusion model stack.
- Labels: #parking #datamodule #config #path-prediction #data-port
- Branch: `boris/training/kangaroo_with_50_and_route_shorten`
- PR: none
- Change type: code
- Areas: `wayve/ai/si/configs/parking/`, `agent_tasks/2026/04/Week-4/`
- Changes:
  - [[agent_tasks/2026/04/Week-4/2026-04-23-parking-diffusion-datamodule-port]]: added `parking_diffusion_datamodule_cfg` and `parking_diffusion_datamodule` store entry, ported the GC parking bucket layout and parking-specific `ParkingDataConfig` from PR `#106346`, and adapted the baseline-driving half to this branch by reusing `baseline_bc_datamodule.train_partitions` instead of the missing helper used in the original PR.

> #### 2026-04-23 — Wonjoon long-horizon parking reconstruction
- Topic: reconstruct Wonjoon Goo's long-horizon parking work across Notion notes, Slack threads, git history, and the April 20 parking handover transcript.
- Labels: #parking #long-horizon #p2p #diffusion #policy-path #gear #evaluation #research-summary
- Branch: `main`
- PR: none
- Change type: analysis/docs
- Areas: `wayve/ai/si/datamodules/`, `wayve/ai/zoo/data/`, `wayve/ai/zoo/outputs/`, `wayve/ai/si/configs/parking/`, `agent_tasks/2026/04/Week-4/`
- Changes:
  - [[agent_tasks/2026/04/Week-4/2026-04-23-wonjoon-long-horizon-parking-summary]]: consolidated the project brief, architecture notes, input-processing design, handover doc, gear-augmentation Slack discussion, and local commit history into one summary explaining what Wonjoon actually built, which pieces look foundational, which augmentations were explicitly temporary or risky, and what remained unsolved at handover.

> #### 2026-04-23 — PR 102398 RL interleave driving-controls parity
- Topic: add the missing RL behavior-control driving key needed for deploy-time interleaving parity with BC parking exports in PR `#102398`.
- Labels: #si #offline-rl #interleaving #deployment #parking #tests #pr102398
- Branch: `03-20-si-group-interleave-control-support`
- PR: #102398
- Change type: code
- Areas: `wayve/ai/si/models/`, `wayve/ai/si/test/models/`, `agent_tasks/2026/04/Week-4/`
- Changes:
  - [[agent_tasks/2026/04/Week-4/2026-04-23-pr-102398-rl-interleave-keys]]: updated offline-RL `get_deployment_config()` to include `DrivingControlKey.INITIATE_AUTO_PARKING` alongside `DILC_MODE` for behavior-control exports, added focused regression coverage for the RL deployment-config key layout, and documented the blocked Bazel/pytest verification attempts.

> #### 2026-04-23 — UNPUDO model-analysis table write for pink + armadillo
- Topic: persist the corrected UNPUDO / unparking model-analysis rows for `pink-manta-ray-smooth` and `armadillo-amethyst-squeaky` into `parking.model_analysis`, while finishing the sampled `eel-teal-outspoken` packet export.
- Labels: #parking #unpudo #unpark #databricks #delta #model-analysis #vault
- Branch: `boris/training/kangaroo_with_50_and_route_shorten`
- PR: none
- Change type: tooling/analysis
- Areas: `tools/parking_model_analysis_writer/`, `~/git/ParkingSkills/skills/unpudo-unpark-model-analysis/`, `agent_tasks/2026/04/Week-4/`
- Changes:
  - [[agent_tasks/2026/04/Week-4/2026-04-22-unpudo-model-analysis-batch]]: finished the sampled `eel-teal-outspoken` packet export (`243` events / `76` runs), added a Bazel-runnable Databricks Connect writer for `parking.model_analysis`, corrected the writer to filter by current model-card rows instead of stale run-report sections, and wrote validated table rows for `pink-manta-ray-smooth` (`309` rows) and `armadillo-amethyst-squeaky` (`234` rows).

> #### 2026-04-23 — Port SI parking routing features into kangaroo route-shorten
- Topic: port the SI parking datamodule, parking/unparking route shortening, and short-path wiring from `boris/parking-training-pudo-unpark-routing` into `boris/training/kangaroo_with_50_and_route_shorten`.
- Labels: #parking #pudo #unpark #route-shortening #otf #datamodule #paths
- Branch: `boris/training/kangaroo_with_50_and_route_shorten`
- PR: none
- Commit: `1ea5c61bce81`
- Change type: code
- Areas: `wayve/ai/si/datamodules/`, `wayve/ai/lib/data/pipes/`, `wayve/ai/si/configs/parking/`, `agent_tasks/2026/04/Week-4/`
- Changes:
  - [[agent_tasks/2026/04/Week-4/2026-04-23-parking-routing-port-into-kangaroo-route-shorten]]: copied the SI parking datamodule into the target branch, rewired OTF to use `ParkingDataConfig`, added bucket-based short-path clamping support, ported parking and unparking route shortening, and updated the parking config to use `allow_short_path=True`, then validated a local `//wayve/ai/si:train` smoke run under `parking_bc_train_release_2026_5_11`, confirming successful startup and completion of 3 local train steps.
  - Follow-up: root-caused AKS training job `153523` to a deterministic `NameError` in `wayve/ai/zoo/data/parking.py` (`_add_parking_stop_route_position` missing `F` import), added the missing `//wayve/core/data/fields` dependency, and added focused regression coverage for parking stop-route anchoring, unparking route shortening, and short-path clamping before resubmitting training.

> #### 2026-04-22 — UNPUDO on-road analysis source discovery and plan
- Topic: identify the Databricks tables needed to analyze failed and successful UNPUDO on-road events, validate source viability for gear/pedal/navigation timing, and define the first-pass analysis plan.
- Labels: #parking #unpudo #on-road #databricks #analysis #planning
- Branch: `main`
- PR: none
- Change type: analysis/planning
- Areas: `parking.pudo_unpudo_unpark_events`, `prod_data_pipeline.raw__gen2`, `prod_data_pipeline.inferred__state`, `agent_tasks/2026/04/Week-4/`
- Changes:
  - [[agent_tasks/2026/04/Week-4/2026-04-22-unpudo-on-road-analysis-plan]]: confirmed the core event, navigation, controller-state, and trajectory tables; verified that `run_trace.pedal_pos_pct` is unusable for sampled UNPUDO runs; and documented a staged plan for failed-event RCA, route-change timing, and pedal-use analysis.

> #### 2026-04-22 — UNPUDO / Unpark investigation skill contract tightening
- Topic: tighten the UNPUDO/unpark event-card skill around AV-only scoring, add explicit resolution output, and require DBW/pedal/indicator state transitions in the event timeline.
- Labels: #parking #unpudo #unpark #skills #analysis #vault
- Branch: `main`
- PR: none
- Change type: docs/tooling
- Areas: `~/git/ParkingSkills/skills/unpudo-unpark-segment-investigation/`, `~/git/ParkingSkills/skills/unpudo-unpark-model-analysis/`, `agent_tasks/2026/04/Week-4/`
- Changes:
  - [[agent_tasks/2026/04/Week-4/2026-04-22-unpudo-unpark-investigation-skill]]: updated the skills so non-AV maneuver execution must be scored as `fail` for model performance, added a required `Resolution` section to each event card, simplified `event_status` guidance to `pass`/`fail`, and required DBW transitions, in-AV driver accelerator help, and indicator start/end state in the event table and Mermaid timeline.

> #### 2026-04-20 — Parking OTF drop audit for PUDO/UNPUDO/UNPARK buckets
- Topic: audit active parking/PUDO training buckets through the real OTF datapipe, attribute sample drops, and identify whether short future path or path-policy mismatch is removing useful non-driving data.
- Labels: #parking #pudo #unpudo #unpark #otf #data-audit #path-filtering
- Branch: none
- PR: none
- Change type: tooling/analysis
- Areas: `wayve/ai/si/scripts/`, `wayve/ai/si/datamodules/`, `wayve/ai/lib/data/pipes/`, `agent_tasks/2026/04/Week-4/`
- Changes:
  - [[agent_tasks/2026/04/Week-4/2026-04-20-parking-otf-drop-audit]]: added a temporary Bazel-runnable OTF audit harness, sampled `pudo`/`unpudo`/`unpark` leaf buckets through the real datamodule, confirmed hard short-path drops in `dc_pudo_uk`, confirmed `filter_bad_paths` drops in `dc_unpudo_usa_very_short`, `ca_short_unpudo_usa`, `pre_ca_unpudo_usa`, and `dc_unparking_uk_very_short`, and identified one still-unattributed silent drop path in `pre_ca_unpudo_uk`.

> #### 2026-04-19 — Parking training/pudo branch port with migrated bucket config
- Topic: create a new branch from `parking/training/pudo`, port unparking route clipping and early path gating, and migrate the full bucketed parking datamodule config from Boris's current branch onto the non-zoo parking path.
- Labels: #parking #pudo #unpudo #training #route-shortening #path-gating #config #tests
- Branch: `boris/parking-training-pudo-unpark-routing`
- PR: none
- Change type: code
- Areas: `wayve/ai/si/configs/parking/`, `wayve/ai/si/datamodules/`, `wayve/ai/lib/data/pipes/`, `wayve/ai/zoo/data/`, `agent_tasks/2026/04/Week-3/`
- Changes:
  - [[agent_tasks/2026/04/Week-3/2026-04-19-parking-training-pudo-unpark-routing]]: migrated the full `parking_bc_datamodule_cfg` bucket layout from `guy/training/pudo_only_bc_3.0.26_aug_cutoff_boris_unpudo_route_clamping`, kept `ParkingDataConfig` with `use_zoo_dataloader=False`, enabled route shortening and early path gating, added unparking prefix clipping, updated focused OTF/path/route regression tests, committed/pushed branch `boris/parking-training-pudo-unpark-routing`, root-caused training job `151595` to an invalid top-level `reconstruct_gear_from_speed` kwarg in `parking_bc_datamodule_cfg`, fixed that kwarg mismatch and added a config-load regression test in commit `1940697ea1a`, then submitted retry job `151669` which reached `Running` before later failing with `prepare_deployment_model()` keyword mismatch.

> #### 2026-04-19 — Parking unpark route clipping
- Topic: extend parking route shortening so unparking samples crop the route prefix from the existing stop anchor while keeping the current anchor semantics.
- Labels: #parking #unpudo #route-shortening #otf #tests
- Branch: `guy/training/pudo_only_bc_3.0.26_aug_cutoff_boris_unpudo_route_clamping`
- PR: none
- Change type: code
- Areas: `wayve/ai/lib/data/pipes/`, `wayve/ai/zoo/data/`, `agent_tasks/2026/04/Week-3/`
- Changes:
  - [[agent_tasks/2026/04/Week-3/2026-04-19-parking-unpark-route-clipping]]: added prefix clipping for `UNPARKING_MODE`, reset the cropped route cursor to the new start, emitted stop-route anchors during parking data insertion, and added focused route/parking regression tests.

> #### 2026-04-16 — Gemini CLI photo classifier skill for Fox Mitten
- Topic: add a reusable local Codex skill for Gemini CLI image classification with parking and robotaxi pull-over prompt templates.
- Labels: #fox-mitten #gemini-cli #skills #pudo #parking #classification
- Branch: none
- PR: none
- Change type: tooling/docs
- Areas: `~/.codex/skills/gemini-cli-photo-classifier/`, `agent_tasks/2026/04/Week-3/`
- Changes:
  - [[agent_tasks/2026/04/Week-3/2026-04-16-gemini-cli-photo-classifier-skill]]: created a new local skill with headless Gemini CLI workflow, strict JSON output schema, parking and pull-over classification templates, env checks, and `npx` fallback guidance.

> #### 2026-04-15 — Interleave gear source simplified by interleave group
- Topic: simplify interleave gear-source selection so driving uses input gear and parking uses model-output gear.
- Labels: #si #interleaving #deployment #parking #gear #codegen #tests
- Branch: `03-20-si-group-interleave-control-support`
- PR: none
- Change type: code
- Areas: `wayve/ai/zoo/deployment/`, `wayve/ai/zoo/deployment/test/`
- Changes:
  - [[agent_tasks/2026/04/Week-3/2026-04-15-interleave-gear-source-by-group]]: updated wrapper/runtime and codegen to select gear by interleave group (driving=input gear, parking=output gear), added fast-fail when parking output gear is missing, and aligned interleave wrapper tests to the new contract.

> #### 2026-04-14 — Zak latest work concepts project (meeting translation)
- Topic: create a new vault project to translate Zak's latest research meeting into a complete concept glossary and practical follow-up framing.
- Labels: #research #multimodality #latent-actions #influence-analysis #project-kickoff #docs
- Branch: none
- PR: none
- Change type: docs/planning
- Areas: `projects/`, `projects.md`, `projects/projects.json`, `projects/active-project.txt`, `agent_tasks/2026/04/Week-3/`
- Changes:
  - [[agent_tasks/2026/04/Week-3/2026-04-14-zak-latest-work-concepts-project]]: created and activated `zak-latest-work-concepts`, documented the full concept map from the 2026-04-13 discussion (K-head routing, mode smoothing, discrete-grid tradeoffs, influence-analysis link), and captured concrete validation questions.

> #### 2026-04-09 — Zak PUDO training proposal project kickoff
- Topic: create a new vault project from a Slack thread request and draft an initial parking/PUDO training proposal aligned to current `parking/training/pudo` config wiring.
- Labels: #parking #pudo #training #planning #project-kickoff
- Branch: `parking/training/pudo`
- PR: none
- Change type: docs/planning
- Areas: `projects/`, `projects.md`, `projects/projects.json`, `projects/active-project.txt`, `agent_tasks/2026/04/Week-2/`
- Changes:
  - [[agent_tasks/2026/04/Week-2/2026-04-09-zak-pudo-training-proposal-kickoff]]: created and activated project `zak-pudo-training-proposal`, drafted v1 proposal on top of `parking_config.py` release path (`pudo_bc_D26_3_3_datamodule_cfg` + `parking_bc_release_2026_5_11_cfg` + `parking_bc_train_release_2026_5_11`), initially recorded Slack thread access blocker (`invalid_auth_token`), then finalized Zak summary/proposal details from user-provided thread text.

> #### 2026-04-02 — Rollback global gear wrapper plumbing to parking + interleave only
- Topic: revert broad `vehicle_gear_position` input/output propagation from generic deployment wrappers while preserving incident-safe gear handling for parking and interleave control flows.
- Labels: #si #deployment #interleaving #parking #gear #incident-hardening #tests
- Branch: `03-20-si-group-interleave-control-support`
- PR: #102398
- Change type: code
- Areas: `wayve/ai/zoo/deployment/`, `wayve/ai/si/test/interfaces/`
- Changes:
  - [[agent_tasks/2026/04/Week-1/2026-04-02-gear-wrapper-rollback]]: restored legacy waypoint postprocessing for non-parking wrappers, kept/validated gear handling in parking and interleave paths, re-enabled interleave waypoint clamping with policy-gear precedence for parking outputs, and updated related tests (`lss`, interleave-control, safety wrapper).

> #### 2026-04-02 — Training export defaults for interleave control
- Topic: make training checkpoint export paths set interleave-control flags only for parking exports (not all models), avoiding deploy-CLI-only behavior.
- Labels: #si #training #deployment #interleaving #parking #ingestion #tests
- Branch: `03-20-si-group-interleave-control-support`
- PR: #102398
- Change type: code
- Areas: `wayve/ai/si/models/`, `wayve/ai/si/offline_rl/`, `wayve/ai/si/test/models/`
- Changes:
  - [[agent_tasks/2026/04/Week-1/2026-04-02-training-interleave-control-defaults]]: updated SI training and offline-RL callback export paths to pass interleave kwargs only when `use_parking_mode=True` (`enable_interleave_control=True`, `interleave_control_group="parking"`), and added regression tests covering parking vs non-parking `to_deployable_model()` behavior.

## 2026-03
> [!note] 2026-03

> #### 2026-03-31 — Parking augmentation design review doc for Wonjoon refactor PR
- Topic: produce a design-first review document for parking augmentation refactor (`wonjoongoo/parking-new-data-aug`, PR #101237) covering architecture, modes, data contracts, augmentations, and review concerns.
- Labels: #parking #design-review #augmentation #otf #wfm #pr-review
- Branch: `wonjoongoo/parking-new-data-aug`
- PR: #101237
- Change type: docs/analysis
- Areas: parking data pipeline design, config/migration design, visualization/readability for review
- Changes:
  - [[agent_tasks/2026/03/Week-5/2026-03-31-wonjoon-parking-augmentation-design-review]]: added a code-agnostic design review with Mermaid diagrams, existing-vs-proposed framing, required extended table contracts, mode/state logic, full augmentation catalog, and reviewer-style remarks for ambiguous decisions.

> #### 2026-03-31 — Radar inference config propagation fix for SI deploy
- Topic: fix radar inference config propagation so deployed Gen2 DMI input config preserves radar feature list and points-per-scan instead of defaulting to empty/zero.
- Labels: #parking #pudo #radar #deploy #si #dmi #inference-config
- Branch: `main`
- PR: none
- Change type: code
- Areas: `wayve/ai/lib/`, `wayve/ai/si/`
- Changes:
  - [[agent_tasks/2026/03/Week-5/2026-03-31-radar-inference-config-propagation-fix]]: extended `DeploymentConfig` and DMI input entry generation for radar fields, added policy_io load/save roundtrip support, added deploy-time fallback from `datamodule` radar settings for legacy sessions, and added focused regression tests.

> #### 2026-03-31 — Parking PUDO radar DMI defaults follow-up (parking/training/pudo)
- Topic: align parking training/deploy output with post-`#102602` radar expectations by restoring explicit radar defaults in generated Gen2 DMI input config.
- Labels: #parking #pudo #radar #dmi #inference-config #backward-compat
- Branch: `parking/training/pudo`
- PR: none
- Change type: code
- Areas: `wayve/ai/lib/`, `wayve/ai/si/`
- Changes:
  - [[agent_tasks/2026/03/Week-5/2026-03-31-parking-pudo-radar-dmi-defaults-followup]]: reintroduced radar defaults (`800` points + legacy feature order) in `interfaces_v2` input-entry generation, wired deployment config radar fields through random input generation, added focused interface tests, and added deploy-time pruning for deprecated radar config keys in legacy sessions.

> #### 2026-03-29 — Interleaved model visibility in Foxglove + Databricks timeline mapping
- Topic: trace Console active-model inference path for interleaved runs, identify Foxglove gap, and add transformed-MCAP support for interleaved event visibility.
- Labels: #interleaving #foxglove #console #databricks #inference #model-episodes
- Branch: `main`
- PR: none
- Change type: code + investigation
- Areas: `wayve/frontends/console/`, `wayve/services/databricks_api/`, `wayve/services/foxglove_adaptor/gen2/`, `wayve/services/data/lakehouse/`
- Changes:
  - [[agent_tasks/2026/03/Week-5/2026-03-29-foxglove-interleaved-model-topic]]: confirmed Console reads interleaved segments from Databricks-backed `raw__inference.model_episodes`, verified inference publishes `/robot/inference/interleaved_event`, added `InterleavedEventTransformer` so transformed MCAPs preserve model-switch events for Foxglove, and validated with `bazel test //wayve/services/foxglove_adaptor/gen2:py_test`.

> #### 2026-03-25 — Route-shortening patch coverage improvements
- Topic: increase patch coverage for route-shortening and parking-related code paths in routes, OTF datamodule plumbing, and parking deployment wrapper behavior.
- Labels: #parking #route-shortening #coverage #tests #otf #deployment
- Branch: `boris/03-23-park-route-shortening-v2`
- PR: none
- Change type: code
- Areas: `wayve/ai/lib/test/data/pipes/`, `wayve/ai/si/datamodules/test/`, `wayve/ai/zoo/deployment/test/`
- Changes:
  - [[agent_tasks/2026/03/Week-4/2026-03-25-route-shortening-coverage-fixes]]: added focused unit tests for route clipping boundaries and parking-anchor application, OTF train/val route-shortening forwarding and map-option mutation, interpolation lookahead keys, and parking end-of-route mask behavior in deployment wrapper controls.

> #### 2026-03-24 — SI group interleave control presubmit failure fixes
- Topic: fix deterministic test/lint regressions from presubmit build `434358` on `03-20-si-group-interleave-control-support`.
- Labels: #si #interleaving #deployment #tests #lint
- Branch: `03-20-si-group-interleave-control-support`
- PR: none
- Change type: code
- Areas: `wayve/ai/zoo/deployment/`, `wayve/ai/zoo/deployment/test/`
- Changes:
  - [[agent_tasks/2026/03/Week-4/2026-03-24-si-group-interleave-control-presubmit-fixes]]: restored backward-compatible wrapper helper methods used by SI tests, updated unsupported-control test expectation to use a truly unknown key, fixed safety-wrapper test inputs for required gear tensor, and cleaned interleave-control test lint warnings.

> #### 2026-03-23 — BC config migration v29 conflict resolution to v30
- Topic: resolve BC migration version collision and lingering merge markers in migration code/sample snapshots.
- Labels: #si #config #migrations #bc #merge-conflict
- Branch: `parking/training/pudo`
- PR: none
- Change type: code
- Areas: `wayve/ai/si/config.py`, `wayve/ai/si/configs/versioning/`, `wayve/ai/si/test/data/sample_configs/bc/`, `wayve/ai/si/test/test_config_inputs/`
- Changes:
  - [[agent_tasks/2026/03/Week-4/2026-03-23-bc-config-migration-v30-conflict-resolution]]: kept `v29` aligned with `origin/main` (`use_temporal_rope`), moved branch-local parking/gear migration logic to new `v30`, bumped BC version to 30, restored clean `v29.yaml` from `origin/main`, generated `v30.yaml`, and validated BC/RL migration test slices.

> #### 2026-03-22 — Parking wrapper selection + preprocess parity fix
- Topic: restore parking deployment-wrapper preprocess parity and ensure parking-capable models select the parking wrapper.
- Labels: #parking #pudo #deployment #interleaving #wrapper-selection
- Branch: `parking/training/pudo`
- PR: none
- Change type: code
- Areas: `wayve/ai/zoo/deployment/`, `wayve/ai/si/models/`
- Changes:
  - [[agent_tasks/2026/03/Week-4/2026-03-22-parking-wrapper-selection-and-preprocess-fix]]: restored behavior/customization + grouped-navigation + indicator-memory processing in `ParkingDeploymentWrapperImpl`, re-added parking-required inputs (`driving_parameters` + grouped nav tensors), and moved `enable_parking` wrapper selection ahead of generic behavior+navigation selection to prevent parking-wrapper bypass.

> #### 2026-03-22 — Port parking gear + route-jitter augmentations onto PUDO route-augmentation base
- Topic: apply the previously validated parking/unparking gear and route-jitter augmentations on top of `boris/train/pudo_route_augmentations` only.
- Labels: #parking #unparking #gear #route-shortening #augmentation #otf
- Branch: `boris/train/pudo_route_augmentations_gear_park_aug`
- PR: none
- Change type: code
- Areas: `wayve/ai/zoo/data/`, `wayve/ai/lib/data/pipes/`, `wayve/ai/si/datamodules/`, `wayve/ai/si/configs/parking/`
- Changes:
  - [[agent_tasks/2026/03/Week-4/2026-03-22-port-parking-gear-and-route-jitter-augmentations]]: cherry-picked and conflict-resolved augmentation commits (`ace24ca3f87`, `35a456168cc`, `a6a37f744fb`), excluded notebook payload, and validated focused parking/otf tests (with noted coverage/auth caveats).

> #### 2026-03-21 — Parking branch deep-dive comparison vs route-augmentation reference
- Topic: deep comparison of parking training/deployment pipeline between current branch and validated reference branch to isolate likely behavior drift.
- Labels: #parking #pudo #route-shortening #otf #deployment #interleaving #debugging
- Branch: parking/training/pudo
- PR: none
- Change type: docs/analysis
- Areas: `wayve/ai/zoo/data/`, `wayve/ai/si/datamodules/`, `wayve/ai/si/models/`, `wayve/ai/lib/data/pipes/`, `wayve/ai/lib/interfaces*`, `wayve/ai/si/configs/parking/`
- Changes:
  - [[agent_tasks/2026/03/Week-3/2026-03-21-parking-training-pudo-vs-route-augmentations-deep-dive]]: enumerated all relevant parking training files, compared core deltas against `boris/train/pudo_route_augmentations`, and highlighted the highest-risk mismatch candidates (`sign_speed_by_gear` gating, data-root drift, interleave/deploy behavior, and expanded loss surface).

> #### 2026-03-20 — Interleave group export + TorchScript Optional gear fix
- Topic: make parking interleave group appear in `gen2_inference_config` and fix TorchScript compile failure in interleave wrapper gear handling.
- Labels: #parking #pudo #interleaving #deployment #torchscript
- Branch: parking/training/pudo
- PR: none
- Change type: code
- Areas: `wayve/ai/si/models/`, `wayve/ai/zoo/deployment/`
- Changes:
  - [[agent_tasks/2026/03/Week-3/2026-03-20-interleave-group-export-and-torchscript-gear-optional-fix]]: propagated `interleave_control_group` into `DeploymentConfig.interleave_group` during deployment model preparation, fixed Optional tensor handling for `policy_gear_position` in `_wrap_with_interleave_control`, and added regression coverage for config propagation.

> #### 2026-03-20 — Parking datamodule/materialization comparison for gear-augmentation debugging
- Topic: compare Wonjoon reference setup vs current local parking setup to identify confounders in reverse/unparking behavior.
- Labels: #parking #unparking #datamodule #materialization #gear #ablation
- Branch: parking/training/pudo
- PR: none
- Change type: docs/analysis
- Areas: `wayve/ai/si/configs/parking/`, `projects/`, `agent_tasks/2026/03/Week-3/`
- Changes:
  - [[agent_tasks/2026/03/Week-3/2026-03-20-parking-datamodule-materialization-comparison]]: validated that Wonjoon used parking-window buckets (`2026_02_17_21_44_12_server_parking`) with `augment_gear_direction=False`, while current local release modes use different roots (`2026_03_15...` + `2026_03_17...`) and `augment_gear_direction=True`; documented this as a key confounder for reverse/unparking comparisons.

> #### 2026-03-20 — Parking/unparking gear augmentation project kickoff
- Topic: initialize a new project to improve reverse/unparking behavior via gear-focused augmentation with explicit safety-aware ablations.
- Labels: #parking #unparking #gear #augmentation #planning #ablation
- Branch: boris/train/pudo_route_augmentations
- PR: none
- Change type: docs/planning
- Areas: `projects/`, `projects.md`, `projects/projects.json`, `projects/active-project.txt`, `agent_tasks/2026/03/Week-3/`
- Changes:
  - [[agent_tasks/2026/03/Week-3/2026-03-20-parking-unparking-gear-augmentation-kickoff]]: created and activated project `parking-unparking-gear-augmentation`, summarized baseline behavior from `97769ac...` parking augmentation stack, and defined a controlled A0-A5 ablation plan with explicit keep/drop safety criteria.

> #### 2026-03-20 — Parking/unparking gear augmentation implementation (isolated worktree branch)
- Topic: implement reference-style standstill parking gear augmentation in current OTF pipeline, behind train-time toggles.
- Labels: #parking #unparking #gear #augmentation #otf #training
- Branch: 03-20-parking-unparking-gear-augmentation
- PR: none
- Change type: code
- Areas: `wayve/ai/zoo/data/`, `wayve/ai/si/datamodules/`, `wayve/ai/si/configs/parking/`
- Changes:
  - [[agent_tasks/2026/03/Week-3/2026-03-20-parking-unparking-gear-augmentation-implementation]]: added `insert_parking_gear_augmentation` (parked-vs-drive sampling + optional leading-standstill strip), wired new datamodule args through OTF make path, enabled config defaults for parking modes, and added targeted parking/OTF tests.

> #### 2026-03-18 — BC config migration v29 gap fix
- Topic: fix SI deploy failure caused by BC config version/migration map mismatch at v29.
- Labels: #si #config #migrations #bc #deployment
- Branch: parking/training/pudo_170326
- PR: none
- Change type: code
- Areas: `wayve/ai/si/configs/versioning/`, `wayve/ai/si/test/data/sample_configs/bc/`
- Changes:
  - [[agent_tasks/2026/03/Week-3/2026-03-18-bc-config-migration-v29-gap-fix]]: restored `migrate_to_v29` and map entry `29` in `bc_migrations.py`, regenerated `bc/v29.yaml`, and validated with `//wayve/ai/si:test_config_py_test -k=bc_migrations`.

> #### 2026-03-18 — Merge conflict resolution for `zmurez/si_interleave_control`
- Topic: resolve in-progress merge conflict into parking training branch while preserving parking and interleave control wiring.
- Labels: #parking #pudo #interleaving #merge-conflict #si
- Branch: parking/training/pudo_170326
- PR: none
- Change type: code
- Areas: `wayve/ai/si/models/`
- Changes:
  - [[agent_tasks/2026/03/Week-3/2026-03-18-si-interleave-control-merge-conflict-resolution]]: resolved the only unmerged file (`training.py`) and kept `driving_controls_keys` as the union of parking controls (`INITIATE_AUTO_PARKING`, `PARKING_DIRECTION`, `ENABLE_SHIFT_BY_WIRE`) plus `DILC_MODE` for interleave behavior control.

> #### 2026-03-17 — Interleaved deploy TD3 legacy kwargs compatibility
- Topic: make `deploy_interleaved_models` tolerate legacy TD3 config kwargs and complete deployment for parking interleaving run.
- Labels: #parking #pudo #interleaving #deployment #td3 #compatibility
- Branch: boris/interleaved/updated_pudo_15_02_26
- PR: none
- Change type: code
- Areas: `wayve/ai/si/`
- Changes:
  - [[agent_tasks/2026/03/Week-3/2026-03-17-interleaved-deploy-legacy-td3-compat]]: added deploy-time TD3 top-level unknown-kwarg pruning in `deploy_interleaved_models.py` (including `apply_activation_checkpointing`-style legacy fields), reran the exact Bazel command successfully, and verified `model-000100000.torchscript` under the suffixed session directory.

> #### 2026-03-11 — Port interleaved wrapper onto soham parking-training branch
- Topic: fork from `soham/parking-training` and add only the interleaved deploy/wrapper code from `boris/interleaved/updated_pudo_15_02_26`
- Labels: #parking #pudo #interleaving #deployment #radar
- Branch: 03-11-parking-interleaved-wrapper
- PR: none
- Change type: code
- Areas: `wayve/ai/si/`, `wayve/ai/zoo/deployment/`
- Changes:
  - [[agent_tasks/2026/03/Week-2/2026-03-11-parking-interleaved-wrapper-port]]: added `deploy_interleaved_models.py` and `interleaving_stopping_wrapper.py`, wired corresponding BUILD targets only, validated with Bazel build, and pushed upstream branch without opening a PR.

> #### 2026-03-11 — Route-shortening-only port on fresh main branch
- Topic: create fresh branch from latest main and port only parking route-shortening logic from `fc4d866506e851487bde7c0e7d11b76846db8eec`
- Labels: #parking #route-shortening #otf #route-map #augmentation
- Branch: 03-11-park-route-shortening-augmentation
- PR: #100620
- Change type: code
- Areas: `wayve/ai/si/datamodules/`, `wayve/ai/zoo/data/`, `wayve/ai/lib/data/pipes/`, tests
- Changes:
  - [[agent_tasks/2026/03/Week-2/2026-03-11-park-route-shortening-augmentation-port]]: ported route-shortening wiring only (no blackout), added parking stop route metadata extraction (`index`/`fraction`), enabled route clipping in route-map fetch, and added focused tests for parking and OTF hooks on top of current `main` architecture.

## 2026-02
> [!note] 2026-02


> #### 2026-02-25 — Interleaving stopping wrapper map blackout on park mode
- Topic: blackout `map_route` in interleaving stopping deployment wrapper whenever park mode is active at inference
- Labels: #parking #pudo #deployment #interleaving #map-route #blackout
- Branch: boris/interleaved/updated_pudo_15_02_26
- PR: none
- Change type: code
- Areas: `wayve/ai/zoo/deployment/interleaving_stopping_wrapper.py`
- Changes:
  - [[agent_tasks/2026/02/Week-4/2026-02-25-interleaving-stopping-wrapper-map-blackout-on-park-mode]]: added TorchScript map blackout helper and wired blackout when `initiate_auto_park` is on for both baseline/primary model calls (including warmup), plus timestamped blackout logging and switch-print visibility.

> #### 2026-02-24 — End-of-route route-shortening implementation (index/fraction path)
- Topic: replace blackout-first parking augmentation with deterministic route polyline shortening
- Labels: #parking #end-of-route #route-shortening #otf #route-map #implementation
- Branch: boris/train/pudo_15_02_26
- PR: none
- Change type: code
- Areas: `wayve/ai/zoo/data/`, `wayve/ai/lib/data/pipes/`, `wayve/ai/si/datamodules/`, `wayve/ai/si/configs/parking/`, `wayve/ai/*/test/`
- Changes:
  - [[agent_tasks/2026/02/Week-4/2026-02-24-route-shortening-implementation-index-fraction]]: added parking stop route metadata keys and extraction logic, wired OTF pre-map stop-position computation with `route_map_options.enable_route_shortening_for_parking`, added deterministic route clipping/interpolation in `RouteMapFetcher` (no jitter/fallback), updated parking config to shortening-on blackout-off, and added focused tests for parking and OTF hooks.

> #### 2026-02-24 — End-of-route polyline shortening project + wiring investigation
- Topic: kick off route-shortening augmentation project and trace exact pre-rasterization insertion points
- Labels: #parking #end-of-route #route-shortening #augmentation #otf #planning
- Branch: boris/train/pudo_15_02_26
- PR: none
- Change type: docs/planning
- Areas: `projects/`, `projects.md`, `projects/projects.json`, `projects/active-project.txt`, `agent_tasks/2026/02/Week-4/`
- Changes:
  - [[agent_tasks/2026/02/Week-4/2026-02-24-end-of-route-polyline-shortening-investigation]]: created/activated project `parking-end-of-route-polyline-shortening-augmentation`, validated that clipping must happen in `RouteMapFetcher._fetch_route_map` (not post-`MAP_ROUTE` blackout), mapped required parking metadata (`PARKING_STOP_ROUTE_INDEX/FRACTION`) and route clipping behavior by comparing current branch with `boris/stopping_mode`.

> #### 2026-02-24 — End-of-route map blackout project kickoff
- Topic: initialize a new project for parking end-of-route augmentation using blackout-only map mutation
- Labels: #parking #end-of-route #augmentation #otf #planning
- Branch: boris/train/pudo_15_02_26
- PR: none
- Change type: docs/planning
- Areas: `projects/`, `projects.md`, `projects/projects.json`, `projects/active-project.txt`, `agent_tasks/2026/02/Week-4/`
- Changes:
  - [[agent_tasks/2026/02/Week-4/2026-02-24-end-of-route-map-blackout-project-kickoff]]: created project page `parking-end-of-route-map-blackout-augmentation`, set it active, reviewed previous `parking-stopping-mode-dilc` context, and extracted blackout-vs-route-shortening split from `boris/stopping_mode` PR `#93171` (`a912c7c` vs `974ce33+`) to define a blackout-only port plan.

> #### 2026-02-22 — Obs Flyte runtime install layout for Bazel target
- Topic: keep skill source in `~/.codex` and install only runtime `BUILD` + Python into `WayveCode/.ai/skills` for `bazel run`
- Labels: #skill #flyte #bazel #tooling
- Branch: 02-12-park-pudo-stopping-mode-heuristic
- PR: none
- Change type: tooling
- Areas: `~/.codex/skills/obs-flyte-execution/`, `WayveCode/.ai/skills/obs-flyte-execution/`
- Changes:
  - [[agent_tasks/2026/02/Week-4/2026-02-22-obs-flyte-bazel-runtime-install-layout]]: moved runtime files (`BUILD`, `inspect_execution_logs_cli.py`) into skill source, rewired wrapper to `//.ai/skills/obs-flyte-execution:inspect_execution_logs_cli`, made `install.sh` copy only runtime files, and validated Bazel query/run end-to-end.

> #### 2026-02-22 — SI config migration conflict resolution after main merge
- Topic: resolve BC migration version collision from merge and restore config test consistency
- Labels: #si #config #migrations #bc #rl #merge-conflict
- Branch: 02-12-park-pudo-stopping-mode-heuristic
- PR: none
- Change type: code
- Areas: `wayve/ai/si/config.py`, `wayve/ai/si/configs/versioning/bc_migrations.py`, `wayve/ai/si/test/data/sample_configs/bc/`, `wayve/ai/si/test/test_config_inputs/`
- Changes:
  - [[agent_tasks/2026/02/Week-4/2026-02-22-si-config-migration-merge-main-conflict]]: kept `origin/main` BC `v17` migration/snapshot, moved stopping-mode migration logic to BC `v18`, bumped BC refs and generated `bc/v18.yaml`; then fixed pre-existing RL baseline reference mismatch (`21` -> `22`) uncovered by full config tests.

> #### 2026-02-22 — Model skill tree foundations (model + observability)
- Topic: add foundational Flyte/Datadog/Buildkite/model-catalogue skills and rewire model skills to depend on them
- Labels: #skill #model-catalogue #observability #refactor #tooling
- Branch: 02-12-park-pudo-stopping-mode-heuristic
- PR: none
- Change type: docs/tooling
- Areas: `~/.codex/skills/model-catalogue-core/`, `~/.codex/skills/obs-flyte-execution/`, `~/.codex/skills/obs-buildkite-jobs/`, `~/.codex/skills/obs-datadog-logs/`, `~/.codex/skills/model-info-finder/`, `~/.codex/skills/modelci-shadowgym-debug/`
- Changes:
  - [[agent_tasks/2026/02/Week-4/2026-02-22-model-skill-tree-foundations]]: created foundational skills for model primitives and observability, removed duplicated model helper copies from composite skills, rewired modelci Buildkite log extraction to shared observability scripts, converted `model-info-finder` to explicit tree routing, and kept `flyte-status-logs` as a compatibility alias to the new Flyte foundation.

> #### 2026-02-22 — Split model-info-finder into focused skills
- Topic: decompose monolithic model-info-finder into dedicated model lookup/summary/checkpoint/modelci skills
- Labels: #skill #model-catalogue #refactor #tooling
- Branch: 02-12-park-pudo-stopping-mode-heuristic
- PR: none
- Change type: docs/tooling
- Areas: `~/.codex/skills/model-info-finder/`, `~/.codex/skills/model-lookup-basic/`, `~/.codex/skills/model-deep-summary/`, `~/.codex/skills/model-checkpoint-inspector/`, `~/.codex/skills/modelci-shadowgym-debug/`
- Changes:
  - [[agent_tasks/2026/02/Week-4/2026-02-22-model-info-finder-skill-split]]: created four focused skills with self-contained scripts and dedicated trigger descriptions, fixed generated `default_prompt` values to include `$skill-name`, converted `model-info-finder` into a router/deprecation bridge, and validated/smoke-tested all split skills.

> #### 2026-02-22 — Flyte status + task-log skill
- Topic: add a reusable skill and CLI to inspect Flyte execution status and task log URIs from a Flyte console URL
- Labels: #flyte #logs #skill #tooling #observability
- Branch: 02-12-park-pudo-stopping-mode-heuristic
- PR: none
- Change type: code/tooling
- Areas: `wayve/prototypes/robotics/vehicle_dynamics/tools/flyte_status_logs/`, `.ai/skills/flyte-status-logs/`
- Changes:
  - [[agent_tasks/2026/02/Week-4/2026-02-22-flyte-status-logs-skill]]: added `inspect_execution_logs_cli` Bazel target using existing Flyte inspection code paths, created `flyte-status-logs` skill with wrapper script and troubleshooting reference, validated skill and CLI, and confirmed the provided execution returns status plus log links.

> #### 2026-02-21 — Config migration skill (BC/RL)
- Topic: add a reusable skill for BC/RL migration version conflicts and fresh migrate-method creation
- Labels: #si #config #migrations #bc #rl #skill #docs
- Branch: 02-12-park-pudo-stopping-mode-heuristic
- PR: none
- Change type: docs/tooling
- Areas: `.ai/skills/`, `wayve/ai/si/configs/versioning/`, `wayve/ai/si/test/data/sample_configs/`
- Changes:
  - [[agent_tasks/2026/02/Week-4/2026-02-21-si-config-migration-conflict-skill]]: created `config-migration` skill with explicit BC/RL source-of-truth paths, migration-map update steps, incoming-snapshot handling rules, new migrate-method creation flow, sample-regeneration commands, and BC vs RL test differences.

> #### 2026-02-17 — Remove interleaving id/event outputs from stopping wrapper
- Topic: remove `interleaved_id` and `interleaved_event` outputs from route interleaving stopping wrapper
- Labels: #parking #pudo #deployment #interleaving #cleanup
- Branch: boris/train/parking_pudo_interleaving
- PR: none
- Change type: code
- Areas: `wayve/ai/zoo/deployment/`
- Changes:
  - [[agent_tasks/2026/02/Week-3/2026-02-17-remove-interleaving-id-event-from-stopping-wrapper]]: removed interleaving id/event from `RouteInterleavingOutput`, stopped forcing these keys into deployment config outputs, and kept switching diagnostics via print logs.

> #### 2026-02-17 — Remove legacy route interleaving codegen module
- Topic: remove unused codegen path for route interleaving deployment wrapper
- Labels: #parking #pudo #deployment #interleaving #cleanup
- Branch: boris/train/parking_pudo_interleaving
- PR: none
- Change type: code
- Areas: `wayve/ai/zoo/deployment/`
- Changes:
  - [[agent_tasks/2026/02/Week-3/2026-02-17-remove-interleaving-stopping-codegen]]: deleted `interleaving_stopping_codegen.py` after confirming no deploy/runtime references remained.

> #### 2026-02-17 — Naive stopping_mode hazard heuristic before otf-gear-input
- Topic: scope naive stopping-mode hazard diff to stack on `02-11` and precede `#94961`
- Labels: #parking #stopping-mode #hazard #otf #stacked-pr #tests
- Branch: boris/stopping_mode_hazard_stack
- PR: pending
- Change type: code
- Areas: `wayve/ai/zoo/data/`, `wayve/ai/zoo/st/`
- Changes:
  - [[agent_tasks/2026/02/Week-3/2026-02-17-naive-stopping-mode-hazard-stacked-pr]]: rebased hazard-only naive stopping-mode changes onto `origin/02-11-parking_mode_heuristic` (before `#94961`), updated parking stopping-mode assignment to be parking-window-based, and added `stopping_mode` ST adaptor wiring/tests/checkpoint compatibility.
> #### 2026-02-17 — Naive stopping_mode docs refresh (project + newsletter)
- Topic: document exact naive stopping-mode rules and enum values
- Labels: #parking #stopping-mode #docs #newsletter
- Branch: 02-12-park-pudo-stopping-mode-heuristic
- PR: #96911
- Change type: docs
- Areas: `projects/`, `newsletters/`
- Changes:
  - [[agent_tasks/2026/02/Week-3/2026-02-17-naive-stopping-mode-project-page-and-newsletter]]: updated active project page with explicit stopping-mode assignment logic (`0=PUDO`, `1=PARK`), synced project registry metadata, added newsletter issue for the naive heuristic context/design, and linked it from `newsletter_index.md`.

> #### 2026-02-12 — PUDO train fix: path/frame binary compatibility
- Topic: fix master-side path data failures caused by incompatible binary version
- Labels: #parking #pudo #training #datamodule #binary-version #data-compat
- Branch: boris/train/pudo_11_02_26
- PR: draft #96219
- Change type: code
- Areas: `wayve/ai/si/configs/parking/`
- Changes:
  - [[agent_tasks/2026/02/Week-2/2026-02-12-pudo-path-binary-compatibility-fix]]: diagnosed run `125607` master failure (`DistanceOutOfRangeException` + `bad_path` compatibility warnings on `driving/release/2.7.93/wo_path_data`) and reverted parking datamodule `binary_version` to release-compatible `2.7.73`.
> #### 2026-02-12 — PUDO train fix: Parking wrapper TorchScript continue
- Topic: fix TorchScript compile failure caused by `continue` in parking wrapper driving-controls loop
- Labels: #parking #pudo #training #deployment #wrapper #torchscript
- Branch: boris/train/pudo_11_02_26
- PR: draft #96219
- Change type: code
- Areas: `wayve/ai/zoo/deployment/`
- Changes:
  - [[agent_tasks/2026/02/Week-2/2026-02-12-pudo-parking-wrapper-torchscript-continue-fix]]: diagnosed run `125575` failure in `ParkingDeploymentWrapperWithRadar._add_driving_controls_inputs`, replaced `continue` with a no-op branch to keep semantics and TorchScript compatibility, and validated on `//wayve/ai/zoo/deployment:test_deployment_py_test`.
> #### 2026-02-12 — PUDO train fix: BehaviorCustomizer TorchScript continue
- Topic: fix TorchScript compile failure caused by `continue` in behavior-customizer control loop
- Labels: #parking #pudo #training #deployment #behavior-control #torchscript
- Branch: boris/train/pudo_11_02_26
- PR: draft #96219
- Change type: code
- Areas: `wayve/ai/zoo/deployment/`
- Changes:
  - [[agent_tasks/2026/02/Week-2/2026-02-12-pudo-behavior-customizer-torchscript-continue-fix]]: diagnosed run `125547` failure (TorchScript loop-unroll restriction on `continue`), removed `continue` from `BehaviorCustomizer.forward` control-loop while preserving DILC-only behavior customization, and validated on `//wayve/ai/zoo/deployment:test_deployment_py_test`.
> #### 2026-02-12 — PUDO train fix: Indicator output head TorchScript int capture
- Topic: fix TorchScript compile failure in parking/PUDO indicator output head
- Labels: #parking #pudo #training #torchscript #outputs
- Branch: boris/train/pudo_11_02_26
- PR: draft #96219
- Change type: code
- Areas: `wayve/ai/zoo/outputs/`
- Changes:
  - [[agent_tasks/2026/02/Week-2/2026-02-12-pudo-indicator-output-head-torchscript-fix]]: diagnosed run `125532` failure (`python value of type 'int' cannot be used as a value` in `IndicatorOutputHead._forward`), replaced constant-based expand with shape-preserving `expand(-1, self.future_frames, -1)`, and validated on `//wayve/ai/zoo:test_outputs_py_test`.
> #### 2026-02-12 — Naive stopping_mode project planning kickoff
- Topic: initialize scoped project for naive parking stopping_mode heuristic
- Labels: #parking #stopping-mode #planning #otf #input-adaptor
- Branch: 02-12-park-pudo-stopping-mode-heuristic
- PR: none
- Change type: docs/planning
- Areas: `projects/`, `projects.md`, `projects/projects.json`, `projects/active-project.txt`, `agent_tasks/2026/02/Week-2/`
- Changes:
  - [[agent_tasks/2026/02/Week-2/2026-02-12-naive-stopping-mode-project-plan]]: created project page `parking-stopping-mode-naive-heuristic`, set it active, summarized required scoped behavior, and mapped minimal files to reuse from `boris/stopping_mode`.
> #### 2026-02-12 — Naive stopping_mode Phase 2 adaptor plumbing
- Topic: add `stopping_mode` model input plumbing behind default-off flags
- Labels: #parking #stopping-mode #input-adaptor #config-migrations #tests
- Branch: 02-12-park-pudo-stopping-mode-heuristic
- PR: none
- Change type: code
- Areas: `wayve/ai/zoo/st/`, `wayve/ai/zoo/data/`, `wayve/ai/si/configs/versioning/`, `wayve/ai/si/test/`
- Changes:
  - [[agent_tasks/2026/02/Week-2/2026-02-12-naive-stopping-mode-phase2-adaptor-plumbing]]: added `STOPPING_MODE` key + adaptor wiring and ST model flags, bumped BC/RL config versions with migration functions, regenerated migration sample configs (`bc/v14`, `rl/v17`), updated baseline reference config snapshots, and validated with `bazel test //wayve/ai/si:test_config_py_test`.
> #### 2026-02-12 — PUDO release-alignment newsletter
- Topic: publish project newsletter for PUDO update to January driving release 2026.5.4
- Labels: #parking #pudo #release #newsletter #docs
- Branch: boris/train/pudo_11_02_26
- PR: none
- Change type: docs
- Areas: `newsletters/`, `newsletter_index.md`
- Changes:
  - [[agent_tasks/2026/02/Week-2/2026-02-12-pudo-release-newsletter]]: added `newsletter_pudo-update-january-driving-release-2026-5-4.md` with release-vs-PUDO architecture flow, key code references, and commit highlights; updated newsletter index entry.
> #### 2026-02-12 — PUDO parking wrapper DILC control-key crash fix
- Topic: fix parking wrapper export crash on `DrivingControlKey.DILC_MODE`
- Labels: #parking #pudo #deployment #wrapper #dilc #training
- Branch: boris/train/pudo_11_02_26
- PR: draft #96219
- Change type: code
- Areas: `wayve/ai/zoo/deployment/`, `wayve/ai/si/test/interfaces/`
- Changes:
  - [[agent_tasks/2026/02/Week-2/2026-02-12-pudo-dilc-control-key-wrapper-fix]]: diagnosed run `125420` failure (`Unsupported driving control key: 2`), updated `ParkingDeploymentWrapperImpl` to accept `DILC_MODE` in driving controls (no parking-specific tensor derivation there), and added regression coverage for parking wrappers configured with DILC.
> #### 2026-02-12 — PUDO checkpoint load fix for parking adaptors
- Topic: fix strict checkpoint loading mismatch after enabling parking adaptors
- Labels: #parking #pudo #checkpoint #input-adaptor #training
- Branch: boris/train/pudo_11_02_26
- PR: none
- Change type: code
- Areas: `wayve/ai/zoo/st/checkpoints.py`
- Changes:
  - [[agent_tasks/2026/02/Week-2/2026-02-12-pudo-input-adaptor-checkpoint-load-fix]]: updated October pretraining loader to seed missing `gear_direction`/`parking_mode` input-adaptor weights from model defaults before strict load, resolving `InputAdaptor` missing-key failures while preserving strict checks for existing checkpointed components.
> #### 2026-02-12 — PUDO train fix: BehaviorCustomizer non-DILC control keys
- Topic: fix training crash caused by parking/PUDO control keys in behavior customization
- Labels: #parking #pudo #training #deployment #behavior-control #dilc
- Branch: boris/train/pudo_11_02_26
- PR: draft #96219
- Change type: code
- Areas: `wayve/ai/zoo/deployment/`, `wayve/ai/zoo/deployment/test/`
- Changes:
  - [[agent_tasks/2026/02/Week-2/2026-02-12-pudo-behavior-customizer-control-key-fix]]: investigated run `125494` failure (`Unsupported driving control key: 0`), updated `BehaviorCustomizer` to ignore non-DILC keys while preserving DILC indicator masking, and added mixed-key regression tests.
> #### 2026-02-12 — PUDO train fix: OutputAdaptor behavior-control init
- Topic: fix `parking_bc_train_release_2026_5_4` startup failure in OutputAdaptor construction
- Labels: #parking #pudo #training #config #output-adaptor
- Branch: boris/train/pudo_11_02_26
- PR: none
- Change type: code
- Areas: `wayve/ai/si/configs/parking/`
- Changes:
  - [[agent_tasks/2026/02/Week-2/2026-02-12-pudo-train-output-adaptor-fix]]: investigated Datadog logs for `black-flamingo-fiery-125307`, fixed missing `latent_action_encoder` in `ParkingOutputAdaptorCfg` while keeping `enable_latent_action=False`, and validated with `bazel test //wayve/ai/si:test_config`.
> #### 2026-02-11 — PUDO hazard indicator enablement
- Topic: enable hazard as an indicator class in parking/PUDO model outputs
- Labels: #parking #pudo #indicator #losses #outputs #tests
- Branch: boris/train/pudo_11_02_26
- PR: none
- Change type: code
- Areas: `wayve/ai/si/configs/parking/`, `wayve/ai/zoo/outputs/`, `wayve/ai/zoo/losses/`, `wayve/ai/zoo/outputs/test/`
- Changes:
  - [[agent_tasks/2026/02/Week-2/2026-02-11-pudo-hazard-indicator-enable]]: set parking output adaptor indicator classes to 4 (hazard enabled), made indicator CE losses class-count aware in BC/KD paths, kept default non-parking behavior at 3 classes, and added output-head regression coverage.
> #### 2026-02-11 — PUDO parking wrapper parity (single wrapper)
- Topic: keep parking deployment in a single wrapper while adding driving-parity + end-of-route behavior
- Labels: #parking #pudo #deployment #wrapper #tests
- Branch: boris/train/pudo_11_02_26
- PR: none
- Change type: code
- Areas: `wayve/ai/zoo/deployment/`, `wayve/ai/si/models/`, `wayve/ai/si/test/`, `wayve/ai/si/configs/parking/`
- Changes:
  - [[agent_tasks/2026/02/Week-2/2026-02-11-pudo-parking-wrapper-parity]]: merged behavior-control/navigation/indicator support into `ParkingDeploymentWrapperImpl` (no new wrapper class), ported end-of-route parking trigger with `5.5e2` threshold (~5m), updated deployment selection logic and regression tests, hardened wrapper codegen default-arg handling, renamed parking train mode alias for release visibility, and enforced parking deployment defaults to behavior-control + navigation (rejecting explicit parking-only config).
> #### 2026-02-11 — PUDO bucket root and binary update
- Topic: align parking/PUDO data roots and binary with current migration plan
- Labels: #parking #pudo #datamodule #config
- Branch: boris/train/pudo_11_02_26
- PR: none
- Change type: code
- Areas: `wayve/ai/si/configs/parking/`, `projects/`
- Changes:
  - [[agent_tasks/2026/02/Week-2/2026-02-11-pudo-bucket-root-and-binary-update]]: set `materialised/si/parking/dev/2026_02_03_10_30_34_server_parking_pudo_buckets_bc` as root for legacy driving/PUDO/parking-validation buckets, kept `DS_26_01_06_SERVER_GEN2_IPACE` only for `dc_high_lateral_acceleration_uk`, `dc_high_lateral_acceleration_usa`, and `pre_ca_all_gen1`, bumped `binary_version` to `3.0.1`, and re-normalized driving scale to keep 93% driving target.
> #### 2026-02-11 — Vault structure reorg
- Topic: remove `codex/` and `WayveCode/` layers and normalize task/project layout
- Labels: #vault #structure #docs #migration
- Branch: none
- PR: none
- Change type: docs
- Areas: `~/.codex/AGENTS.md`, `~/.codex/skills/project-manager/SKILL.md`, `agent_tasks/`, `projects/`, `projects.md`
- Changes:
  - [[agent_tasks/2026/02/Week-2/2026-02-11-vault-structure-reorg]]: flattened `vault/codex/WayveCode` into `vault/`, relocated date-based notes under `agent_tasks/YYYY/MM/Week-N/`, moved `newsletter_index.md` to vault top-level, updated instruction/skill path contracts, and rewrote vault links/paths to the top-level layout.
> #### 2026-02-10 — Model info finder script extraction in repo skill
- Topic: split inline skill commands into reusable shell scripts
- Labels: #skill #model-catalogue #refactor #docs
- Branch: skill/model-info-finder
- PR: none
- Change type: code
- Areas: `.ai/skills/model-info-finder/`, `agent_tasks/2026/02/Week-2/`
- Changes:
  - [[agent_tasks/2026/02/Week-2/2026-02-10-model-info-finder-skill-script-extraction]]: added helper + per-workflow `.sh` entrypoints, renamed helper to `model_catalogue_api_helpers.sh` for clearer discoverability, rewrote `SKILL.md` to use script calls instead of inlined command blocks, removed `MODEL_CATALOGUE_TOKEN` handling, and added explicit missing dependency prompts plus script-evolution guidance.
> #### 2026-02-09 — Model info finder skill cleanup
- Topic: simplify and harden model lookup skill commands
- Labels: #skill #model-catalogue #model-ci #refactor
- Branch: current
- PR: none
- Change type: code
- Areas: `~/.codex/skills/model-info-finder/`, `agent_tasks/2026/02/Week-2/`
- Changes:
  - [[agent_tasks/2026/02/Week-2/2026-02-09-model-info-finder-skill-cleanup]]: rewrote skill into helper-based workflows, reduced duplicated command blocks, added explicit no-match/ambiguous/no-build handling, and validated nickname->Model CI->Buildkite logs->Shadow Gym flow.
> #### 2026-02-09 — Model info finder: Model CI + Shadow Gym debug flow
- Topic: expand model lookup skill for build status and failure triage
- Labels: #skill #model-catalogue #model-ci #buildkite #shadow-gym
- Branch: current
- PR: none
- Change type: code
- Areas: `~/.codex/skills/model-info-finder/`, `agent_tasks/2026/02/Week-2/`
- Changes:
  - [[agent_tasks/2026/02/Week-2/2026-02-09-model-info-finder-modelci-shadowgym]]: added nickname/full-id model resolution, latest Model CI build summary, failed-job Buildkite log retrieval, Eval Studio execution-id check, and Shadow Gym execution/metadata lookup (with robust empty/non-array handling and zsh-safe job-id iteration).
> #### 2026-02-09 — How-to to newsletter migration
- Topic: vault docs migration from `how_to` chapters to newsletter issues
- Labels: #docs #vault #newsletter #migration
- Branch: none
- PR: none
- Change type: docs
- Areas: `newsletters/`, `agent_tasks/2026/02/Week-2/`
- Changes:
  - [[agent_tasks/2026/02/Week-2/2026-02-09-how-to-newsletter-migration]]: moved and renamed all `how_to` pages to `newsletter` pages, updated index and internal links, and removed the old `how_to` directory.
> #### 2026-02-08 — Interleaving production-docs refresh
- Topic: interleaving deployment docs aligned to intended production design
- Labels: #parking #deployment #interleaving #docs
- Branch: current
- PR: none
- Change type: docs
- Areas: `projects/`, `newsletters/`, `agent_tasks/2026/02/Week-2/`
- Changes:
  - [[agent_tasks/2026/02/Week-2/2026-02-08-interleaving-load-modes-and-switch-debug]]: updated project and newsletter docs to keep `zmurez/pudo` and `main interleaved_wrapper.py` reference notes, restored switching-flow mermaid diagrams, and focused content on intended production switching behavior (not temporary debug variants).
> #### 2026-02-08 — Interleaved compile vs Zak comparison
- Topic: route interleaving compile parity with `zmurez/pudo`
- Labels: #parking #deployment #interleaving #torchscript #debug
- Branch: current
- PR: none
- Change type: code
- Areas: `wayve/ai/zoo/deployment/`, `wayve/ai/si/`
- Changes:
  - [[agent_tasks/2026/02/Week-2/2026-02-08-interleaved-compile-vs-zak]]: compared wrapper/compile flow with Zak’s `compile_with_baseline.py`, replaced `torch.jit.Attribute` routing state with plain Python attributes to match eager+script behavior, and validated deploy compile success with `__interleaved4_check2`.
> #### 2026-02-08 — Model info finder skill
- Topic: codex skill for model-catalogue lookup
- Labels: #skill #model-catalogue #cli #automation
- Branch: none
- PR: none
- Change type: code
- Areas: `~/.codex/skills/model-info-finder/`
- Changes:
  - [[agent_tasks/2026/02/Week-2/2026-02-08-model-info-finder-skill]]: created and simplified `model-info-finder` into a curl-only skill with nickname/author lookup, basic/deep flows, mandatory `console_url`, table-formatted summaries, `commit_id` extraction from `session_path/git.hash`, mandatory licensing fields (`license_count`, `licenses`) in deep summaries, and per-run console links (`run_url`) for checkpoint runs.
> #### 2026-02-05 — Interleaved deploy wrapper
- Topic: route interleaving deploy wrapper + session-id resolution
- Labels: #parking #deployment #interleaving #torchscript
- Branch: current
- PR: none
- Change type: code
- Areas: `wayve/ai/si/`, `wayve/ai/zoo/deployment/`
- Changes:
  - [[agent_tasks/2026/02/Week-1/2026-02-05-interleaved-deploy-wrapper]]: generated TorchScript-friendly route wrapper, updated deploy script to use it, added switching heuristics (latched near‑end‑of‑route, auto‑park, reverse gear, 5 mph hysteresis), wired parking nav inputs, defined end‑of‑route as no‑route for parking mode, disabled parking wrapper end‑of‑route triggering, emitted `interleaved_id`/`interleaved_event` debug outputs, and validated `_retrace13` output.
> #### 2026-02-05 — Route map signal thresholds
- Topic: route map signal thresholds + map span interpretation
- Labels: #route-map #docs #thresholds
- Branch: none
- PR: none
- Change type: docs
- Areas: `newsletters/`
- Changes:
  - [[agent_tasks/2026/02/Week-1/2026-02-05-route-map-signal-thresholds]]: added newsletter-style how-to explaining map span, route signal sums, and `5e4` threshold intuition; updated how-to index.
> #### 2026-02-05 — Bokeh visualise interleaving wrapper
- Topic: bokeh visualise uses route-interleaving wrapper
- Labels: #visualisation #interleaving #parking
- Branch: current
- PR: none
- Change type: code
- Areas: `wayve/ai/si/visualisation/`
- Changes:
  - [[agent_tasks/2026/02/Week-1/2026-02-05-visualise-interleaving-wrapper]]: added baseline session support and route thresholds for interleaved visualisation, disabled parking end-of-route trigger, and ensured driving parameters/controls are supplied when missing.
> #### 2026-02-04 — Interleaving wrapper debug signals
- Topic: interleaving wrapper debug outputs + radar arg fix
- Labels: #parking #deployment #interleaving #torchscript
- Branch: current
- PR: none
- Change type: code
- Areas: `wayve/ai/zoo/deployment/`, `wayve/ai/si/`
- Changes:
  - [[agent_tasks/2026/02/Week-1/2026-02-04-interleaving-wrapper-debug-signals]]: added interleaving debug outputs, split radar and baseline-input wrapper variants, and refreshed output keys.
> #### 2026-02-04 — Deploy interleaved run
- Topic: deploy interleaved for parking/baseline session
- Labels: #parking #deployment #interleaving #run
- Branch: current
- PR: none
- Change type: run
- Areas: `wayve/ai/si/`
- Changes:
  - [[agent_tasks/2026/02/Week-1/2026-02-04-deploy-interleaved-run]]: ran `deploy_interleaved` to generate the interleaved TorchScript model under `/tmp/interleaved_sessions`.
> #### 2026-02-03 — Interleaving models project docs
> - Topic: interleaving baseline + parking/PUDA models
> - Labels: #parking #deployment #interleaving #docs
> - Branch: none
> - PR: none
> - Change type: docs
> - Areas: `projects/`, `newsletters/`
> - Changes:
>   - [[agent_tasks/2026/02/Week-1/2026-02-03-interleaving-models-project]]: added project deep dive, mermaid update, and new how-to chapter.

## 2026-01
#### 2026-01-25 — How-to project writeups
- Topic: project how-to writeups and index
- Labels: #docs #how-to #projects
- Branch: none
- PR: none
- Change type: docs
- Areas: `newsletters/`
- Changes:
  - [[agent_tasks/2026/01/Week-4/2026-01-25-how-to-writeups]]: added how-to index and writeups for active/paused projects.

#### 2026-01-22 — Timestamp offset conversion (Zak branch)
- Topic: timestamp offset → timestamp_unixus
- Labels: #timestamp #data #zak
- Branch: none
- PR: none
- Change type: analysis
- Areas: `agent_tasks/2026/01/Week-4/`
- Changes:
  - [[agent_tasks/2026/01/Week-4/2026-01-22-timestamp-offset-conversion]]: documented Zak-branch conversion logic and microsecond offset note.

#### 2026-01-21 — Parking route shortening
- Topic: parking route shortening
- Labels: #parking #otf #route-map
- Branch: boris/stopping_mode
- PR: none
- Change type: update
- Areas: `wayve/ai/lib/data/pipes/`, `wayve/ai/zoo/data/`, `wayve/ai/si/datamodules/`, `wayve/ai/si/configs/parking/`, `projects/`
- Changes:
  - [[agent_tasks/2026/01/Week-4/2026-01-21-parking-route-shortening]]: truncate route polyline near parking entry before map generation.

#### 2026-01-21 — Parking OTF end-of-route blackout
- Topic: parking OTF augmentation
- Labels: #parking #otf #augmentation
- Branch: boris/stopping_mode
- PR: none
- Change type: update
- Areas: `wayve/ai/zoo/data/`, `wayve/ai/si/datamodules/`, `wayve/ai/si/configs/parking/`, `projects/`
- Changes:
  - [[agent_tasks/2026/01/Week-4/2026-01-21-parking-otf-eor-blackout]]: added end-of-route blackout augmentation for parking frames.

#### 2026-01-21 — stopping_mode adaptor (Stage 1)
- Topic: stopping_mode input adaptor
- Labels: #parking #model #input #stopping_mode
- Branch: boris/stopping_mode
- PR: none
- Change type: update
- Areas: `wayve/ai/zoo/st/`, `wayve/ai/zoo/data/`, `wayve/ai/si/configs/parking/`, `wayve/ai/si/models/`, `projects/`
- Changes:
  - [[agent_tasks/2026/01/Week-4/2026-01-21-stopping-mode-adaptor-stage1]]: implemented the new stopping_mode adaptor and wired it through configs/tests.

#### 2026-01-17 — WFM→BC→RL mermaid diagrams
- Topic: WFM/BC/RL architecture and losses
- Labels: #model #wfm #bc #rl #mermaid #analysis
- Branch: none
- PR: none
- Change type: analysis
- Areas: `wayve/ai/foundation/models/world_model/`, `wayve/ai/zoo/`, `wayve/ai/si/`, `agent_tasks/2026/01/Week-3/`
- Changes:
  - [[agent_tasks/2026/01/Week-3/2026-01-17-wfm-bc-rl-mermaid-diagrams]]: added mermaid diagrams for WFM→BC→RL flow, layer reuse, losses, and WFM model comparison (Oct 0.5B vs 7B vs Dec 2025 vs YOLO), plus Excalidraw link.

#### 2026-01-13 — Parking hazard filter updates
- Topic: Parking maneuver hazard filter
- Labels: #parking #sampling #filters #tests
- Branch: boris/2025-12-30/zak-classifiers-parking-maneuver
- PR: none
- Change type: update
- Areas: `wayve/ai/zoo/sampling/`, `wayve/ai/zoo/test/sampling/`
- Changes:
  - [[agent_tasks/2026/01/Week-3/2026-01-13-parking-hazard-filter-updates]]: added hazard indicator light filter, cleaned gear in parking indices, and aligned default hazard masking.

#### 2026-01-13 — Inference model design (MVC)
- Topic: New inference visualization tool
- Labels: #viz #inference #design
- Branch: none
- PR: none
- Change type: docs
- Areas: `projects/`
- Project: [[projects/new-inference-vis-tool]]
- Changes:
  - [[agent_tasks/2026/01/Week-3/2026-01-13-inference-model-design]]: documented InferenceModel plan and smoke test.

#### 2026-01-13 — New inference vis tool mapping
- Topic: New inference visualization tool
- Labels: #viz #inference #planning
- Branch: none
- PR: none
- Change type: analysis
- Areas: `wayve/ai/si/visualisation/`, `projects/`
- Project: [[projects/new-inference-vis-tool]]
- Changes:
  - [[agent_tasks/2026/01/Week-3/2026-01-13-new-inference-vis-tool-initial-mapping]]: mapped current visualisation flow and proposed MVC reuse plan.

#### 2026-01-08 — Parking waypoints scatter plot
- Topic: Parking waypoint plot
- Labels: #parking #viz #bokeh
- Branch: boris/parking_fixed_reverse_acc
- PR: none
- Change type: update
- Areas: `wayve/ai/si/visualisation/bokeh/plotter/`, `wayve/ai/si/visualisation/bokeh/`, `projects/`
- Changes:
  - [[agent_tasks/2026/01/Week-2/2026-01-08-parking-waypoints-scatter-plot]]: added XY scatter plot for policy waypoints, live on-demand server mode with slider/timestamps/buttons, wrapped models with parking deployment wrapper, and paused the parking maneuver filter project.

#### 2026-01-06 — Parking WFM Update closed
- Topic: Parking WFM Update closure
- Labels: #parking #project
- Branch: soham/12-18-Parking-model
- PR: none
- Change type: update
- Areas: `projects/`
- Project: [[projects/parking-wfm-update]]
- Changes:
  - Closed the project pending formal December WFM release and added re-creation checklist.

#### 2026-01-06 — Parking WFM December 2025 modes
- Topic: Parking WFM December 2025 modes
- Labels: #parking #model #config
- Branch: soham/12-18-Parking-model
- PR: none
- Change type: update
- Areas: `wayve/ai/si/config.py`, `wayve/ai/si/configs/parking/`
- Project: [[projects/parking-wfm-update]]
- Changes:
  - [[agent_tasks/2026/01/Week-1/2026-01-06-parking-wfm-december-2025-mode]]: added December 2025 WFM base and parking modes.

#### 2026-01-06 — Parking reverse constant-accel waypoints
- Topic: Parking reverse waypoint override
- Labels: #parking #deployment #inference
- Branch: soham/12-18-Parking-model
- PR: none
- Change type: update
- Areas: `wayve/ai/zoo/deployment/`
- Changes:
  - [[agent_tasks/2026/01/Week-1/2026-01-06-parking-reverse-constant-accel-waypoints]]: override reverse-to-reverse waypoints with constant acceleration.

#### 2026-01-06 — Parking WFM October 2025 modes
- Topic: Parking WFM October 2025 modes
- Labels: #parking #model #config
- Branch: soham/12-18-Parking-model
- PR: none
- Change type: update
- Areas: `wayve/ai/si/configs/parking/`
- Project: [[projects/parking-wfm-update]]
- Changes:
  - [[agent_tasks/2026/01/Week-1/2026-01-06-parking-wfm-october-2025-mode]]: added October 2025 WFM parking configs and modes.

#### 2026-01-05 — Parking BC vs release BC latent actions
- Topic: Parking BC vs release BC
- Labels: #parking #model #latent-actions #analysis #mermaid
- Branch: soham/12-18-Parking-model
- PR: none
- Change type: analysis
- Areas: `wayve/ai/si/configs/parking/`, `wayve/ai/si/configs/baseline/`, `wayve/ai/zoo/outputs/`, `wayve/ai/latent_actions/models/`
- Changes:
  - [[agent_tasks/2026/01/Week-1/2026-01-05-parking-bc-vs-release-bc-latent-actions]]: compare latent action pathways and add mermaid diagrams.

## 2025-12
#### 2025-12-30 — Parking maneuver filter (pred_park_type)
- Topic: Parking maneuver filter
- Labels: #parking #sampling #tests
- Branch: unknown
- PR: none
- Change type: docs/move
- Areas: `wayve/ai/zoo/sampling/`, `wayve/ai/zoo/test/sampling/`
- Changes:
  - [[agent_tasks/2025/12/Week-5/2025-12-30-parking-maneuver-filter-task-summary]]: moved task summary into the vault.

#### 2025-12-29 — Trace BC release model
- Topic: Release BC model trace
- Labels: #model #config #data
- Branch: unknown
- PR: none
- Change type: analysis
- Areas: `wayve/ai/si/`
- Changes:
  - Read configs and datamodule implementation for baseline BC release.
- Files:
  - /workspace/WayveCode/wayve/ai/si/configs/baseline/release.py
  - /workspace/WayveCode/wayve/ai/si/config.py
  - /workspace/WayveCode/wayve/ai/si/datamodules/otf.py

#### 2025-12-29 — Add release BC mermaid summary
- Topic: Model diagram
- Labels: #docs #mermaid #model
- Branch: unknown
- PR: none
- Change type: add
- Areas: `agent_tasks/2025/12/Week-5/`
- Changes:
  - [[agent_tasks/2025/12/Week-5/2025-12-29-release-bc-model-mermaid-summary]]: added task summary.

#### 2025-12-29 — Add ST transformer diagram
- Topic: Model diagram
- Labels: #mermaid #docs
- Branch: unknown
- PR: none
- Change type: update
- Areas: `agent_tasks/2025/12/Week-5/`
- Changes:
  - [[agent_tasks/2025/12/Week-5/2025-12-29-release-bc-model-mermaid-summary]]: appended ST transformer components diagram.

#### 2026-02-18 — Interleaved RL baseline deploy hotfix (temporary)
- Topic: Interleaved deploy debugging (RL baseline + parking primary)
- Labels: #deploy #offline-rl #interleaving #torchscript #debug
- Branch: `zmurez/pudo`
- PR: none
- Change type: temporary code/debug
- Areas: `wayve/ai/si/deploy_interleaved_models.py`, `wayve/ai/zoo/deployment/interleaving_stopping_wrapper.py`
- Changes:
  - [[agent_tasks/2026/02/Week-3/2026-02-18-interleaved-rl-baseline-deploy-hotfix]]: added debugging summary and run ledger; final run compiled and saved TorchScript locally.

#### 2026-02-18 — Notion newsletter radar baseline section
- Topic: Interleaving newsletter update
- Labels: #docs #notion #deploy #offline-rl
- Branch: `boris/train/parking_pudo_interleaving_w_radar`
- PR: none
- Change type: content update
- Areas: Notion newsletter page
- Changes:
  - [[agent_tasks/2026/02/Week-3/2026-02-18-notion-radar-baseline-deploy-section]]: added section on radar RL baseline deploy and corrupted-config remediation.

#### 2026-02-18 — Notion top warning for TorchScript contract
- Topic: Interleaving newsletter safety note
- Labels: #docs #notion #torchscript #interleaving
- Branch: `boris/train/parking_pudo_interleaving_w_radar`
- PR: none
- Change type: content update
- Areas: Notion newsletter page
- Changes:
  - [[agent_tasks/2026/02/Week-3/2026-02-18-notion-add-top-warning]]: added warning at start about fixed wrapper/input/output contract for TorchScript.

#### 2026-02-18 — Notion update: interleaved id/event usage status
- Topic: Interleaving telemetry contract clarification
- Labels: #docs #notion #structured-testing #metrics
- Branch: `boris/train/parking_pudo_interleaving_w_radar`
- PR: none
- Change type: content update
- Areas: Notion newsletter page
- Changes:
  - [[agent_tasks/2026/02/Week-3/2026-02-18-notion-remove-interleaved-id-event-usage]]: updated section to explain removal of active interleaved id/event outputs and structured-testing metric interference rationale.

#### 2026-02-18 — Notion mermaid alignment for no-event output
- Topic: Interleaving state machine docs consistency
- Labels: #docs #notion #interleaving #torchscript
- Branch: `boris/train/parking_pudo_interleaving_w_radar`
- PR: none
- Change type: content update
- Areas: Notion newsletter page
- Changes:
  - [[agent_tasks/2026/02/Week-3/2026-02-18-notion-mermaid-align-no-event-output]]: updated Mermaid and nearby text to match removal of active interleaved event/id outputs.

#### 2026-02-18 — Merge planning: interleaving branch vs latest PUDO
- Topic: Branch divergence and conflict assessment
- Labels: #git #merge #interleaving #pudo
- Branch: `boris/train/parking_pudo_interleaving_w_radar`
- PR: none
- Change type: analysis
- Areas: git history / branch planning
- Changes:
  - [[agent_tasks/2026/02/Week-3/2026-02-18-branch-merge-planning-interleaving-vs-pudo]]: recorded ahead/behind counts and simulated conflicts.

#### 2026-02-18 — Copy interleaving files to updated PUDO branch
- Topic: Bring interleaving deploy code onto latest PUDO branch
- Labels: #git #branching #interleaving #deploy
- Branch: `boris/interleaved/updated_pudo_15_02_26`
- PR: none
- Change type: code import/copy
- Areas: `wayve/ai/si/`, `wayve/ai/zoo/deployment/`
- Changes:
  - [[agent_tasks/2026/02/Week-3/2026-02-18-copy-interleaving-files-to-updated-pudo-branch]]: copied `deploy_interleaved_models.py` and `interleaving_stopping_wrapper.py` from `boris/train/parking_pudo_interleaving_w_radar`.

#### 2026-02-19 — Import check blocked by missing Bazel target
- Topic: Validate interleaved deploy entrypoint on updated PUDO branch
- Labels: #build #bazel #interleaving #debug
- Branch: `boris/interleaved/updated_pudo_15_02_26`
- PR: none
- Change type: validation
- Areas: `wayve/ai/si/BUILD`, `wayve/ai/zoo/deployment/BUILD`
- Changes:
  - [[agent_tasks/2026/02/Week-3/2026-02-19-import-check-deploy-interleaved-target-missing]]: ran requested command; identified missing BUILD wiring for deploy target and deployment library srcs.

#### 2026-02-19 — Radar-only interleaving deploy fix (updated PUDO branch)
- Topic: Make interleaved deploy work with radar baseline + radar parking
- Labels: #deploy #interleaving #radar #torchscript #debug
- Branch: `boris/interleaved/updated_pudo_15_02_26`
- PR: none
- Change type: bugfix + validation
- Areas: `wayve/ai/zoo/deployment/interleaving_stopping_wrapper.py`
- Changes:
  - [[agent_tasks/2026/02/Week-3/2026-02-19-import-check-deploy-interleaved-target-missing]]: enforced radar-only call contract for both branches, fixed TorchScript/import/interface errors, and verified deploy command exits successfully.

#### 2026-02-19 — Uploaded interleaved radar-only model session
- Topic: Upload interleaved model session with fixed suffix
- Labels: #deploy #upload #interleaving #radar
- Branch: `boris/interleaved/updated_pudo_15_02_26`
- PR: none
- Change type: validation/runtime
- Areas: deployment runtime + Training API upload
- Changes:
  - [[agent_tasks/2026/02/Week-3/2026-02-19-import-check-deploy-interleaved-target-missing]]: executed `--upload` run, confirmed successful model upload and session registration.

#### 2026-02-24 — Notion default flow update (M26.0.0)
- Topic: Newsletter alignment to new default interleaving workflow
- Labels: #docs #notion #interleaving #parking #pudo
- Branch: `boris/interleaved/updated_pudo_15_02_26`
- PR: none
- Change type: content update
- Areas: Notion newsletter page
- Changes:
  - [[agent_tasks/2026/02/Week-3/2026-02-19-import-check-deploy-interleaved-target-missing]]: set Sections 2/3 to M26.0.0 default branch/command, preserved conversion section, and moved previous M25.0.0 flow to historical Section 7.

#### 2026-03-17 — Parking BC config: add 2026.5.11-aligned release mode
- Topic: Parking training config update
- Labels: #parking #si #config #bc
- Branch: current working branch
- PR: none
- Change type: config update
- Areas: `wayve/ai/si/configs/parking/parking_config.py`
- Changes:
  - [[agent_tasks/2026/03/Week-3/2026-03-17-parking-config-add-2026-5-11-release]]: added Dec-2025/FA3 parking model config and new mode `parking_bc_train_release_2026_5_11` while keeping `parking_bc_train_release_2026_5_4` unchanged.

#### 2026-03-17 — Route-shortening merge audit across branches
- Topic: Merge correctness review (`pudo_route_augmentations` into `pudo_170326`)
- Labels: #parking #pudo #route-shortening #deployment #merge
- Branch: `parking/training/pudo_170326`
- PR: none
- Change type: analysis/audit
- Areas: `wayve/ai/si/datamodules/otf.py`, `wayve/ai/zoo/data/parking.py`, `wayve/ai/lib/data/pipes/routes.py`, `wayve/ai/zoo/deployment/deployment_wrapper.py`
- Changes:
  - [[agent_tasks/2026/03/Week-3/2026-03-17-route-shortening-merge-audit]]: compared old validated branch against merged branch and flagged deployment blackout regression.

#### 2026-03-23 — Remove end-of-route blackout option
- Topic: Parking route augmentation cleanup
- Labels: #parking #pudo #route-shortening #cleanup
- Branch: `parking/training/pudo`
- PR: none
- Change type: code cleanup
- Areas: `wayve/ai/si/datamodules/otf.py`, `wayve/ai/zoo/data/parking.py`, `wayve/ai/si/configs/parking/parking_config.py`, `wayve/ai/si/test/data/sample_configs/bc/v30.yaml`
- Changes:
  - [[agent_tasks/2026/03/Week-4/2026-03-23-remove-end-of-route-blackout-option]]: removed `enable_end_of_route_blackout` option/wiring and deleted unused blackout datapipe helpers.

#### 2026-03-23 — Split parking work into route-shortening PR + config PR
- Topic: PR split for parking workstream
- Labels: #parking #pudo #route-shortening #config #pr
- Branch: `boris/03-23-park-route-shortening-v2`, `boris/03-23-parking-config-updates-v2`
- PR: #102690, #102691
- Change type: code split / PR preparation
- Areas: `wayve/ai/lib/data/pipes/routes.py`, `wayve/ai/si/datamodules/otf.py`, `wayve/ai/zoo/data/parking.py`, `wayve/ai/zoo/data/keys.py`, `wayve/ai/si/configs/parking/parking_config.py`
- Changes:
  - [[agent_tasks/2026/03/Week-4/2026-03-23-split-parking-prs-route-shortening-and-config]]: created two focused branches from main and opened separate PRs for route logic vs config updates.

#### 2026-03-23 — Route-shortening robustness update (jitter + apply probability)
- Topic: Parking route-shortening robustness controls
- Labels: #parking #pudo #route-shortening #augmentation
- Branch: `boris/03-23-park-route-shortening-v2`
- PR: #102690
- Change type: code update + PR description update
- Areas: `wayve/ai/lib/data/pipes/routes.py`, `wayve/ai/si/datamodules/otf.py`, `wayve/ai/lib/test/data/pipes/test_generate_route_map.py`, `wayve/ai/zoo/data/parking.py`
- Changes:
  - [[agent_tasks/2026/03/Week-4/2026-03-23-route-shortening-jitter-probability-update]]: added route-shortening jitter/probability defaults and improved docstrings; left changes uncommitted for review.

#### 2026-03-23 — Parking wrapper nav/radar wiring added to config PR branch
- Topic: Parking deployment wrapper parity fix
- Labels: #parking #deployment #wrapper #navigation #radar
- Branch: `boris/03-23-parking-config-updates-v2`
- PR: #102691
- Change type: code fix + PR description update
- Areas: `wayve/ai/zoo/deployment/deployment_wrapper.py`
- Changes:
  - [[agent_tasks/2026/03/Week-4/2026-03-23-parking-config-pr-add-wrapper-nav-radar-wiring]]: added missing grouped-nav/radar/behavior wiring in `ParkingDeploymentWrapperImpl`.

#### 2026-03-23 — Route branch: add end-of-route parking wrapper support
- Topic: Parking wrapper end-of-route activation
- Labels: #parking #deployment #wrapper #route-shortening
- Branch: `boris/03-23-park-route-shortening-v2`
- PR: #102690
- Change type: code fix
- Areas: `wayve/ai/zoo/deployment/deployment_wrapper.py`
- Changes:
  - [[agent_tasks/2026/03/Week-4/2026-03-23-route-shortening-branch-add-end-of-route-parking-wrapper]]: added `enable_end_of_route_parking` wiring and end-of-route parking mask logic to `ParkingDeploymentWrapperImpl`.

#### 2026-03-24 — Route-shortening PR CI failures triage/fix
- Topic: Presubmit failures on route-shortening branch
- Labels: #parking #pudo #route-shortening #ci #buildkite
- Branch: `boris/03-23-park-route-shortening-v2`
- PR: #102690
- Change type: bug fix + baseline snapshot update
- Areas: `wayve/ai/zoo/data/parking.py`, `wayve/ai/si/test/test_config_inputs/reference_bc.yaml`, `wayve/ai/si/test/test_config_inputs/reference_bc_alpha2.yaml`
- Changes:
  - [[agent_tasks/2026/03/Week-4/2026-03-24-route-shortening-pr-ci-failures-fix]]: debugged Buildkite #434402 failures with `$obs-buildkite-jobs`, fixed parking boundary logic, and updated baseline BC config snapshots for new route-shortening OTF defaults.

#### 2026-04-14 — SI parking path route-shortening compatibility
- Topic: SI parking route-shortening entry-index wiring
- Labels: #parking #si #route-shortening #datapipe
- Branch: `parking/training/pudo`
- PR: none
- Change type: code fix + unit tests
- Areas: `wayve/ai/si/datamodules/parking.py`, `wayve/ai/si/datamodules/test/test_parking_unit.py`
- Changes:
  - [[agent_tasks/2026/04/Week-3/2026-04-14-si-parking-route-shortening-entry-index]]: store parking entry lookahead index in SI path so route-shortening anchor works consistently.

#### 2026-04-14 — Parking config: add 2026.6.x release architectures
- Topic: Parking BC release architecture parity with baseline release configs
- Labels: #parking #si #config #release
- Branch: `parking/training/pudo`
- PR: none
- Change type: config update
- Areas: `wayve/ai/si/configs/parking/parking_config.py`
- Changes:
  - [[agent_tasks/2026/04/Week-3/2026-04-14-parking-config-release-arches]]: added parking model/mode variants for `2026.6.12` and `2026.6.14` based on baseline release architecture pattern; validated config compiles.

- 2026-04-14 | Route shortening PR test coverage | branch: boris/03-23-park-route-shortening-v2 | note: agent_tasks/2026/04/Week-3/2026-04-14-route-shortening-test-coverage.md

#### 2026-04-15 — Parking CODEOWNERS precedence and membership update
- Topic: Move parking CODEOWNERS rules below broad SI rule and add parking owners
- Labels: #parking #codeowners #ownership
- Branch: `boris/parking-codeowners-order`
- PR: #106396
- Change type: metadata/config update
- Areas: `docs/CODEOWNERS`, `infrastructure/azure/terraform/github_org/teams/prod/team-members/parking-owners.csv`
- Changes:
  - [[agent_tasks/2026/04/Week-3/2026-04-15-parking-codeowners-precedence-and-team-update]]: moved parking CODEOWNERS block after broad SI rule and added `ilai-wayve` + `kozdogru` to parking owners.

#### 2026-04-15 — Parking D26_3_6 datamodule naming/weight fix
- Topic: Fix swapped parking/pudo D26_3_6 datamodule mixes and decimal typo
- Labels: #parking #si #config #bugfix
- Branch: `boris/fix-parking-d26-naming-weights`
- PR: #106451
- Change type: config bug fix
- Areas: `wayve/ai/si/configs/parking/parking_config.py`
- Changes:
  - [[agent_tasks/2026/04/Week-3/2026-04-15-parking-d26-3-6-datamodule-mix-fix]]: corrected mapping between parking/pudo D26_3_6 datamodule aliases and fixed `0.2 -> 0.02` for `unpudo`/`unpark` in the pudo-focused config.

#### 2026-04-15 — Route-shortening jitter options wired through parking config
- Topic: Add parking distance/stop jitter controls for route-shortening robustness
- Labels: #parking #si #route-shortening #augmentation
- Branch: `boris/03-23-park-route-shortening-v2`
- PR: #102690
- Change type: code update + tests
- Areas: `wayve/ai/si/configs/parking/parking_config.py`, `wayve/ai/si/datamodules/parking.py`, `wayve/ai/si/datamodules/otf.py`, `wayve/ai/zoo/data/parking.py`, `wayve/ai/lib/data/pipes/routes.py`, `wayve/ai/zoo/data/test/test_parking.py`
- Changes:
  - [[agent_tasks/2026/04/Week-3/2026-04-15-route-shortening-jitter-config-wiring]]: added config knobs for detection/stop jitter and wired them end-to-end into route shortening.

#### 2026-04-16 — Fallback classifiers Gemini run classification utility
- Topic: Reuse `fallback/classifiers` tooling for run-id image fetch + Gemini classification
- Labels: #fallback-classifiers #gemini #vision #robotaxi #debug
- Branch: `parking/training/pudo`
- PR: none
- Change type: tooling + run validation
- Areas: `wayve/ai/fallback/classifiers/slow_lane_classifier/BUILD`, `wayve/ai/fallback/classifiers/slow_lane_classifier/manual_gemini_from_run.py`
- Changes:
  - [[agent_tasks/2026/04/Week-3/2026-04-16-fallback-classifier-gemini-run-test]]: added `manual_gemini_from_run` bazel target and validated classification on run `fme10010/2026-04-15--19-10-20--gen2-av-cd9496c5-ad6e-4dc5-a227-8d9a06b3e089`.
- Update: extended `manual_gemini_from_run` to support 5-second MP4 clip generation and Gemini video classification (`mode=video|both`), validated on `fme10010/...cd9496c5...` with `parking` output from both image and video paths.
- Update: added multimodal `image_with_temporal_clip` mode (single Gemini query with timestamp image + centered `-5s/+5s` clip context) and validated on run `fme10010/...cd9496c5...` (`parking`, confidence `0.99`).
- Update: moved `manual_gemini_from_run` to standalone package `//wayve/ai/parking/classifiers:manual_gemini_from_run` and validated multimodal image+temporal-clip run on `fme10010/...cd9496c5...`.
- Update: exported reusable skill bundle to `/home/borisindelman/git/ParingSkills/skills/parking-gemini-run-classifier/` with script copy + usage docs; measured end-to-end runtime `63.00s`.
- Update: fixed exact-timestamp retrieval in `manual_gemini_from_run` by using MCAP range fetch (`fetch_video_between_timestamps`) for `image_with_temporal_clip`; validated exact timestamp `1776196459133289` for run `fme10003/...96f7e596...`.
- Update: changed temporal-context image fallback to closest available frame within threshold (`--closest-image-threshold-ms`, default 300ms) and validated on `fme10003/...96f7e596...` at `1776196452713317` with selected frame delta `19.976ms`.
- Update: added `--image-with-clip-prompt-variant general|unparking` to `manual_gemini_from_run`, with a frame-anchored unparking prompt that forces motion reasoning relative to the queried frame; validated on `fme10003/...96f7e596...` at `1776196452713317`, changing the multimodal result to `parking` with `motion_relative_to_frame=after`.
- Update: added strict single-camera clip mode via `--no-allow-video-camera-fallback`; validated that `back-backward` for run `fme20018/...8ed0bb08...` at `1772994892945000` fails explicitly instead of silently switching cameras.
- Update: fixed shared dataset camera-name resolution so `manual_gemini_from_run` can fetch `ReferenceFrame`-only cameras such as `back-surround`; validated strict `back-surround` multimodal illegal-parking classification on `fme20018/...8ed0bb08...` at `1772994892945000` (`illegal_parked`, `zigzag`).
- Update: added `parking_feasibility` Gemini prompt variant for `manual_gemini_from_run`, refactored prompts into `manual_gemini_prompts.py`, added unit coverage for prompt selection, and validated `back-surround` feasibility outputs on `fme20018/...50a81282...` and `fme20009/...2c601596...`.
- Update: validated prompt routing on a 20-row manual batch with strict `back-surround` output under `/tmp/parking_gemini_batch_20260416T140000Z`; 19 rows succeeded, 1 failed on missing temporal clip media for that camera, and the batch confirmed `unpudo -> unparking` / `pudo -> parking_feasibility` behavior.

#### 2026-04-19 — Parking OTF sample-drop risk review
- Topic: Inspect parking BC datapipe for train-time filters and augmentations that can remove or weaken parking/PUDO/unparking supervision.
- Labels: #parking #si #datapipe #augmentation #data-quality
- Branch: `guy/training/pudo_only_bc_3.0.26_aug_cutoff_boris_unpudo_route_clamping`
- PR: none
- Change type: investigation
- Areas: `wayve/ai/si/datamodules/otf.py`, `wayve/ai/zoo/data/parking.py`, `wayve/ai/zoo/data/driving.py`, `wayve/ai/si/configs/parking/parking_config.py`
- Changes:
  - [[agent_tasks/2026/04/Week-3/2026-04-19-parking-otf-drop-risk-review]]: mapped active parking training augmentations, identified true sample-drop points, and ranked likely risks to parking/PUDO/unparking coverage.
- Update: implemented early parking-related path gating in `otf.py` / `parking.py` / `paths.py` / `driving.py` so parking/parked/unparking samples skip `filter_bad_paths` and clamp short future paths instead of dropping; added focused tests in `test_load_paths.py` and `test_otf.py`.
- Update: added explicit `ParkingConfig.enable_early_path_gating` flag (default off) and enabled it in `parking_bc_datamodule_cfg` to preserve current parking branch behavior while allowing ablation.
- Update: fixed `prepare_deployment_model(...)` signature in `wayve/ai/si/models/deployment.py` to accept `fill_default_understeer_coefficient_for_vehicle_platform`, matching the existing training export call and unblocking startup for parking BC jobs on `boris/parking-training-pudo-unpark-routing`.
- Update: retriggered parking training as job `151697` / session `session_2026_04_20_06_55_51_si_parking_bc_train_release_2026_5_11_parking_bc_cfg_port_unpark_clip_fix_deployment_signature`; the job reached `Running` with nickname `prudent-blue-sea-cucumber`.
- Update: created new release row `https://www.notion.so/34803da5d69a81e8a50efa0d731d6162` and moved the two canceled rows into archive page `https://www.notion.so/34803da5d69a8184a537d57cf173f4a4` so the active run stays at the top of the release table.
- Update: confirmed job `151697` failed on WandB artifact-name length (`>128 chars`) caused by the long session tag, then retriggered as job `151708` with short tag `sigfix2`.
- Update: created active release row `https://www.notion.so/34803da5d69a810298ccc1046419cdaa` for `151708` and moved the failed long-name row into archive page `https://www.notion.so/34803da5d69a8174ab60c83d075ed6e2`.
- Update: fixed the parking deployment wrapper contract in `wayve/ai/zoo/deployment/deployment_wrapper.py` so it accepts the generic deployment builder kwargs (`behavior_customization`, `deployment_driving_parameters_keys`, `navigation_version_number`) and correctly preprocesses only the supported behavior-control subset while preserving full parking controls for the model.
- Update: validated the parking startup path locally with `//wayve/ai/zoo/deployment:test_deployment_py_test`, `//wayve/ai/si:test_deployment_wrapper`, and `//wayve/ai/si:test_config_py_test_core` filtered to the parking path, then pushed commit `a2464581b5e8b75bd9201ada976d15b9863cb5e1` to `boris/parking-training-pudo-unpark-routing`.
- Update: retriggered parking training as job `151738` / session `session_2026_04_20_09_27_54_si_parking_bc_train_release_2026_5_11_parkwrapfix`; the run reached `Running` with nickname `anteater-rose-heroic`.
- Update: moved the failed `151708` release row out of the live table into archive page `https://www.notion.so/34803da5d69a81a1a69dc45b9cca1f50` and created the new active release row `https://www.notion.so/34803da5d69a8139abdfd3e5b8813806` for job `151738`.

- Update: downloaded logs for failed job `151738`, confirmed the true crash was `KeyError: 'enable_shift_by_wire'` in parking deployment postprocessing, and fixed `ParkingDeploymentWrapperImpl` to default the missing input to `False` while adding a regression test in `wayve/ai/zoo/deployment/test/test_parking_deployment_wrapper.py`.
- Update: validated the fix locally with the parking slices of `//wayve/ai/zoo/deployment:test_deployment_py_test`, `//wayve/ai/si:test_deployment_wrapper`, and `//wayve/ai/si:test_config_py_test_core`, then pushed commit `92b1f5417cdcf5777f99f2dc9af09a6fc88fa0c1` to `boris/parking-training-pudo-unpark-routing`.
- Update: marked failed row `151738` as canceled, moved it out of the live release table into archive page `https://www.notion.so/34803da5d69a81a1a69dc45b9cca1f50`, retriggered as job `151763` / session `session_2026_04_20_10_24_37_si_parking_bc_train_release_2026_5_11_shiftwirefix`, and created the new active row `https://www.notion.so/34803da5d69a81e1986af27896203024`.
- Update: monitored job `151763` through `Queued -> Dispatched -> Running`; current nickname is `ivory-mallard-invaluable` and the run remained `Running` on an early follow-up poll.

- 2026-04-21 — Parking interleave deploy for `magenta-turtle-bright`
  - Labels: deploy, parking, interleave-control
  - Branch: `boris/parking-training-pudo-unpark-routing`
  - PR: none
  - Change type: deployment + local hotfix
  - Areas: `wayve/ai/si/deploy.py`, `wayve/ai/si/models/deployment.py`
  - Changes:
    - deployed source session `session_2026_04_20_11_08_37_si_parking_bc_train_release_2026_5_11_jitfix1` with parking interleave control
    - uploaded output session `session_2026_04_20_11_08_37_si_parking_bc_train_release_2026_5_11_jitfix1__magenta-turtle-bright_interleave_control_v1`
    - resolved assigned nickname `insightful-magenta-porcupine`
    - restored missing `get_video_temporal_cache(...)` helper to unblock local deploy path
  - Note: [[agent_tasks/2026/04/Week-4/2026-04-21-parking-interleave-deploy-magenta-turtle-bright]]

- 2026-04-21: [Parking OTF Drop Audit: 100 Run IDs per Bucket (Partial)](agent_tasks/2026/04/Week-4/2026-04-21-parking-otf-drop-audit-runids100-summary.md)
  - Labels: parking, otf, audit, buckets, runid-sampling
  - Branch: current workspace branch
  - PR: none
  - Change type: analysis
  - Areas: `wayve/ai/si/scripts/parking_otf_drop_audit.py`, parking datamodule buckets
  - Changes:
    - summarized partial `100`-run-id-per-bucket audit in readable form
    - recorded completed vs missing bucket coverage
    - highlighted highest drop-rate completed buckets and main drop signals

- 2026-04-22: [Parking OTF Drop Audit: 200 Run IDs per Bucket](agent_tasks/2026/04/Week-4/2026-04-22-parking-otf-drop-audit-runids200-summary.md)
  - Labels: parking, otf, audit, buckets, runid-sampling
  - Branch: current workspace branch
  - PR: none
  - Change type: analysis
  - Areas: `wayve/ai/si/scripts/parking_otf_drop_audit.py`, parking datamodule buckets
  - Changes:
    - summarized completed `200`-run-id-per-bucket audit in readable form
    - recorded aggregate failure distribution and worst buckets
    - highlighted remaining attribution gap and next code changes to consider

- 2026-04-22: [UNPUDO / Unpark Investigation Skill](agent_tasks/2026/04/Week-4/2026-04-22-unpudo-unpark-investigation-skill.md)
  - Labels: skills, parking, unpudo, unparking, databricks
  - Branch: current workspace branch
  - PR: none
  - Change type: tooling + workflow documentation
  - Areas: `~/.codex/skills/unpudo-unpark-segment-investigation`, `ParkingSkills/skills/unpudo-unpark-segment-investigation`
  - Changes:
    - created a new Codex skill for investigating AV-owned UNPUDO and unparking segments from Databricks
    - documented the authoritative tables and signals for route change, AV ownership, actual gear, predicted gear, indicators, pedals, and trajectory context
    - defined the evaluation rules for meaningful success, meaningful failure, and short interrupted AV attempts
    - standardized the per-event output format as pass/fail bullet, event table, Mermaid timeline, metrics table, and written summary
  - Update:
    - reframed the required per-event output as an event card with metadata first, including model, run id, UTC date/time, event type, disengagement type, console link, and Foxglove link
  - Update:
    - extended the skill to persist each analyzed segment into `parking.model_analysis` and added a shared cross-event schema with `event_type`, `written_summary`, and `event_card_markdown` for later agent use
  - Update:
    - tightened AV-only scoring, added a required `resolution` section, required DBW / in-AV pedal help / indicator state in the timeline, and made route-change status mandatory as `found`, `not found`, or `unclear`

- 2026-04-22: [UNPUDO / Unpark Model Analysis Skill](agent_tasks/2026/04/Week-4/2026-04-22-unpudo-unpark-model-analysis-skill.md)
  - Labels: skills, vault, parking, unpudo, unparking, model-analysis
  - Branch: current workspace branch
  - PR: none
  - Change type: tooling + vault workflow documentation
  - Areas: `~/.codex/skills/unpudo-unpark-model-analysis`, `ParkingSkills/skills/unpudo-unpark-model-analysis`, `vault/model_analysis`
  - Changes:
    - created a new skill that analyzes one or many models and persists UNPUDO / unparking event cards into the vault
    - defined the vault layout as per-model index cards under `model_analysis/models` and per-run report files under `model_analysis/report_cards/YYYY/MM/Week-N`
    - specified that run files hold the full event cards and model cards link to those event-card headers

- 2026-04-22: [UNPUDO Model Analysis Batch](agent_tasks/2026/04/Week-4/2026-04-22-unpudo-model-analysis-batch.md)
  - Labels: parking, unpudo, model-analysis, vault, batch
  - Branch: current workspace branch
  - PR: none
  - Change type: analysis + workflow execution
  - Areas: `vault/model_analysis`, `tools/databricks_queries`
  - Changes:
    - built the release-page-derived UNPUDO batch queue in most-recent-model-first order
    - created the first run report card and model card for `harlequin-excited-greyhound`
    - fixed `tools/databricks_queries` to allow per-worker cache isolation via `DATABRICKS_QUERIES_CACHE_DIR`
  - Update:
    - corrected the first event card so Console deep-links to the event timestamp, Foxglove centers on the event/disengagement window, and route change is only mentioned when a reassignment signal is actually validated
  - Update:
    - relaunched the batch with a cache-first exporter that writes per-model event packets locally, then assigns workers against cached JSON with exact event-section anchors in model-card links
  - Update:
    - moved the Databricks packet-cache location out of the vault into `~/tmp/model_analysis_databricks_cache` and patched the exporter so future runs do not leave `cache.db` files under `vault/model_analysis`
  - Update:
    - refreshed `eel-teal-outspoken` on a fixed cohort of `76` runs, regenerated the full run-complete vault outputs for those runs, and wrote `448` validated rows into `parking.model_analysis`
    - final table counts for `eel-teal-outspoken`: `unpudo` `248` pass / `183` fail / `3` accidental, `unparking` `11` pass / `1` fail / `2` accidental
  - Update:
    - added a new incremental `eel-teal-outspoken` expansion workflow that processes one run at a time across `4` workers, merges each completed run into the main packet store, and rewrites the vault outputs after every merged run
    - fixed worker-level cache contention by isolating both the Databricks disk-cache root and the run-discovery output path per worker
  - Update:
    - made run-by-run processing the documented default for this skill, added per-run `parking.model_analysis` writes via `--run-ids` support in the writer, and restarted the live `eel-teal-outspoken` workers on that updated contract
  - Update:
    - completed the full `eel-teal-outspoken` cleanup: refreshed the model card against the completed `232`-run packet store, confirmed `221` runs / `1086` recorded events in the vault, and rewrote `parking.model_analysis` to the matching final counts
  - Update:
    - tightened the incremental per-run workflow so successful runs now clean their worker-local `/tmp` caches automatically
    - patched `process_model_runs_incrementally.py` to delete queue-discovery cache after sharding, remove per-worker Databricks cache after each successful run, and prune merged per-run packet JSON from `/tmp` when periodic full model-card refresh is disabled

- 2026-04-23: [Parking Diffusion Datamodule Driving Root Fix](agent_tasks/2026/04/Week-4/2026-04-23-parking-diffusion-datamodule-driving-root-fix.md)
  - Labels: parking, datamodule, training, data-config, wonjoon
  - Branch: `boris/training/kangaroo_with_50_and_route_shorten`
  - PR: none
  - Change type: bug fix
  - Areas: `wayve/ai/si/configs/parking/parking_config.py`
  - Changes:
    - replaced the borrowed baseline driving partitions in `parking_diffusion_datamodule_cfg` with explicit branch-local driving partitions rooted at the known-good `DRIVING_ROOT`
    - removed the stale `materialisation_version` dependency that resolved driving buckets into a missing `sampling_materialised/bc/split_alpha2_alpha3/release/0.0.17` path
    - extracted shared driving train and validation partition constants so both parking datamodules reuse the same explicit driving source

  - Update:
    - removed unsupported top-level datamodule args from `parking_diffusion_datamodule_cfg` after constructor failure during training submission
    - aligned `wayve/ai/si/datamodules/parking.py` with this branch's parking key names (`PARKING_POSE`, `PARKING_POSE_GT`) to fix the deterministic prefetch-thread crash
  - Update:
    - added local preflight coverage for the migrated parking policy-path flow after repeated AKS failures
    - fixed the uncaught epsilon-offset path interpolation in `wayve/ai/si/datamodules/parking.py` and ported Wonjoon's later goal-distance clamp
    - aligned the OTF parking hook test to the SI `ParkingDataConfig` path and verified the targeted parking/OTF regression set locally (`5 passed`)
    - attempted a Bazel-backed smoke on `parking_diffusion_datamodule`; the remaining blocker on this machine is Azure storage authentication, not another deterministic migration error

- 2026-04-24: [Parking interleave deploy for fiery-aardvark-copper](agent_tasks/2026/04/Week-4/2026-04-24-parking-interleave-deploy-fiery-aardvark-copper.md)
  - Labels: deploy, parking, interleave-control
  - Branch: `boris/training/kangaroo_with_50_and_route_shorten`
  - PR: none
  - Change type: deployment
  - Areas: `wayve/ai/si:deploy`, Model Catalogue, Notion release page
  - Changes:
    - Deployed interleave-control variant for `fiery-aardvark-copper`
    - Resolved deployed nickname `exotic-jellyfish-silver`
    - Verified radar config shape in output inference config
    - Confirmed release-page row contains the deployed related-model mapping

- 2026-04-26: [Targeted UNPUDO Event Detector](agent_tasks/2026/04/Week-4/2026-04-26-targeted-unpudo-event-detector.md)
  - Labels: parking, unpudo, databricks, event-detection, tooling
  - Branch: current workspace branch
  - PR: none
  - Change type: tooling
  - Areas: `ParkingSkills/skills/unpudo-unpark-model-analysis`
  - Changes:
    - added `scripts/find_model_events.py` to detect model-scoped PUDO / UNPUDO / unparking events directly from source tables while `parking.pudo_unpudo_unpark_events` is stale
    - ported the notebook event-detection flow with early model/run/date filtering before reading `prod_data_pipeline.wayve_corpus.all_data`
    - updated the UNPUDO model-analysis skill to use the detector as the event-source fallback
    - sanity-checked `sea-cucumber-spectacular-orange`: existing table has `5` UNPUDO rows, the detector SQL mirror found those exact `5` plus `2` extra candidates from a run not present in the stale table
    - analyzed the `2026-04-23`/`2026-04-24` `sea-cucumber-spectacular-orange` model-catalogue run window with four run-by-run workers, writing `48` scored rows across `8` run files and refreshing the model card
    - extended the exporter/incremental runner to accept detector-derived `--events-json-file` input and handle no-scored-event runs without a worker failure
  - Update:
    - ran the detector-derived four-worker backfill for `blue-panther-solid`, `pink-manta-ray-smooth`, `mallard-plum-mysterious`, and `insightful-magenta-porcupine`, processing one run id per worker unit and writing run cards plus `parking.model_analysis` rows after each run
    - verified recent `parking.model_analysis` rows for the batch: blue `85`, pink `122`, mallard `83`, insightful `29`
    - added a table-backed model-card generator so final cards are regenerated from durable `parking.model_analysis` rows after temporary packet cache is cleaned
    - refreshed model cards for blue, pink, mallard, and insightful with GitHub-compatible `[card](relative.md#anchor)` links
    - added a sea dashboard-discrepancy section listing dashboard-success / model-card-fail events and reasons
- 2026-04-26: [Parking BC new driving data](agent_tasks/2026/04/Week-4/2026-04-26-parking-bc-new-driving-data.md)
  - Labels: parking, training-config, data-mix
  - Branch: `boris/training/kangaroo_with_50_and_route_shorten`
  - PR: none
  - Change type: config
  - Areas: `wayve/ai/si/configs/parking/parking_config.py`
  - Changes:
    - Added `parking_bc_new_driving_datamodule_cfg` while keeping `parking_bc_datamodule_cfg` as the fiery-aardvark-copper data mix
    - Reused newer diffusion driving train/validation partitions in the new datamodule
    - Normalized reused driving train partition weights to preserve 50% driving mass
    - Kept fiery-aardvark-copper PUDO/UNPUDO/UNPARK mix and parking behavior flags in the new datamodule
    - Committed and pushed `7ec9c60b950e71331d395c7f221e9a25c6cfc702`, then started 100000-step training job `154721` / `precious-peach-panda` with `+datamodule=parking_bc_new_driving_datamodule`; observed state `Running`
    - Deployed `precious-peach-panda` with parking interleave control as `tomato-toucan-gorgeous`, verified Gen2 radar config (`points_per_scan=800`), and updated the release row's `Related models` field

- 2026-04-26: [zmurez/pudo Data Research](agent_tasks/2026/04/Week-4/2026-04-26-zmurez-pudo-data-research.md)
  - Labels: parking, pudo, unpudo, research
  - Branch: `boris/training/kangaroo_with_50_and_route_shorten`
  - PR: `#91997`
  - Change type: research
  - Areas: parking data, samplers, route augmentation
  - Changes:
    - Logged findings from `origin/zmurez/pudo` around parking/PUDO sampler weights, gear cleanup, PUDO labels, route-end jitter, and parking request conditioning
    - Captured the conclusion that Zak's parking/PUDO behavior comes from the experimental `Wayve`/Ipace loader with heuristic samplers rather than SI OTF parking defaults
    - Identified portable ideas for SI parking work: PUDO near/far split, start/gear-change sampling, gear cleanup before parking-mode derivation, route-end jitter, route blackout, and per-waypoint gear-change loss weighting
  - Update:
    - expanded the data-weight table with side-by-side `mcv_new.yml` and `mcv_new_phase2.yml` columns
    - clarified that `~18%` gear-decision sampling applies to `mcv_new_phase2`, while `mcv_new` has `17.5%` generic parking and `9.5%` gear-decision sampling

- 2026-04-26: [Wonjoon Parking GC Materialisation Research](agent_tasks/2026/04/Week-4/2026-04-26-wonjoon-parking-gc-materialisation.md)
  - Labels: parking, materialisation, pudo, unpudo, research
  - Branch: `boris/training/kangaroo_with_50_and_route_shorten`
  - PR: `#106341`
  - Change type: research
  - Areas: parking sampling datasets, PUDO materialization notebook design
  - Changes:
    - Investigated Wonjoon's merged `parking_gc` materialisation PR and bucket taxonomy
    - Documented the gear reconstruction, long P/N segment detection, maneuver windowing, gear-count bucketing, and PUDO-exclusion heuristics
    - Identified the concrete parts worth porting into the PUDO/UNPUDO materialization notebook

- 2026-04-27: [Parking interleave deploy for precious-peach-panda](agent_tasks/2026/04/Week-4/2026-04-27-precious-peach-panda-interleave-deploy.md)
  - Labels: deploy, parking, interleave-control
  - Branch: current workspace branch
  - PR: none
  - Change type: deployment
  - Areas: `wayve/ai/si:deploy`, Model Catalogue, Notion release page
  - Changes:
    - Deployed interleave-control variant for `precious-peach-panda`
    - Resolved deployed nickname `tomato-toucan-gorgeous`
    - Verified radar config shape in output inference config
    - Updated the Parking/PUDO release-page row with the interleave-control related model

- 2026-04-28: [PUDO Materialization Future-Speed Filter](agent_tasks/2026/04/Week-5/2026-04-28-pudo-materialization-future-speed-filter.md)
  - Labels: parking, pudo, unpudo, materialization
  - Branch: `boris/pudo-materialization-future-speed-gear-buckets`
  - PR: none
  - Change type: notebook
  - Areas: `wayve/ai/parking/notebooks/PUDO and UNPUDO materilization.ipynb`
  - Changes:
    - Replaced the UNPUDO / unparking acceleration filter with a future-speed filter at `+0.6s` using the `0.15 m/s` controller threshold
    - Added gear-specific parking / PUDO / UNPUDO / unparking bucket variants, including reverse `unparking`
    - Expanded DC UNPUDO / unparking windows from `gearchange_timestamp - 1s` through event end to retain full reverse/forward maneuvers
    - Added DC gear-boundary buckets around stabilized gear changes inside UNPUDO / unparking windows, including reverse-only variants
    - Pushed commit `02722ffcfcd9` to `origin/boris/pudo-materialization-future-speed-gear-buckets`
    - Disabled event-length cutoff through `EVENT_LENGTH_CUTOFF_MODE = None` while leaving the implementation and thresholds in place; pushed commit `fe5e8120623a`
    - Fixed current event-table schema compatibility by deriving `gear_direction` from signed `speed_kmh` when gear columns are absent; pushed commit `db5c478824b4`
    - Replaced the speed-derived fallback with early corpus enrichment from `wayve_corpus.all_data` for `gear_direction` and `prev_gear_direction`; pushed commit `ab34fae41a49`
    - Queried the events table and confirmed the old `10s` cutoff would remove most speed-derived reverse events: `61.34%` of reverse unparking and `71.08%` of reverse UNPUDO are longer than `10s`
    - Removed unused worktrees to free `/workspace` disk space, fixed ambiguous Spark joins with explicit aliases, and added final `summary_df`-based UNPUDO/unparking bucket-count stats; pushed commit `d21d3a773daf`
    - Added optional `event_start_date` / `event_end_date` filters on `run_date_iso` for quick notebook tests; pushed commit `023674eac300`
    - Fixed persistent Spark self-join ambiguity in AV/DC expansion by projecting unique key names before joins; pushed commit `a232267e0891`
    - Added `DRY_RUN_MATERIALIZATION` to compute final materialized counts while skipping fsspec parquet/meta/README writes; pushed commit `4a6d2f00d8d`
    - Delayed corpus gear enrichment to gear-specific paths and removed per-bucket `limit(1).count()` probes to speed up one-day notebook tests; pushed commit `b5dc63a5cdd`
    - Added cached `all_data_for_events` restricted to filtered event run IDs and switched downstream corpus joins to use it; pushed commit `050ce54b527`
    - Added standalone `Spark native ABFSS parquet write test.ipynb` to validate native Spark partitioned parquet writes to the parking dev ABFSS path; pushed commit `c13ebb8ec06`
    - Disabled gear-specific and gear-boundary bucket experiments by default, removed the active `parking prev_gear_direction == -1` spec, and added `MATERIALIZATION_WRITE_MODE` to choose native Spark or fsspec writes; pushed commit `fa3101165e9`
    - Removed expensive startup actions from the materialization notebook by guarding full-table display, startup counts, and event-type collection; pushed commit `b31d5b80d15`

- 2026-04-29: [Derived UNPUDO / Unparking Future-Speed Materialization](agent_tasks/2026/04/Week-5/2026-04-29-derived-unpudo-unparking-future-speed-materialization.md)
  - Labels: parking, materialization, unpudo, unparking, notebook
  - Branch: `boris/pudo-materialization-fresh`
  - PR: none
  - Change type: notebook
  - Areas: `wayve/ai/parking/notebooks`
  - Changes:
    - added a standalone notebook that derives DC UNPUDO / unparking buckets from the existing March 23 materialization
    - filters samples by the first available future odometry speed in `[timestamp_unixus + 0.60s, timestamp_unixus + 0.65s]` using the `0.15 m/s` controller threshold
    - keeps full filtered DC buckets and adds additive `_forward` / `_reverse` variants using the matched future gear direction
    - added default-enabled additive DC `_gear_change`, `_gear_change_forward`, and `_gear_change_reverse` buckets from current-vs-future gear direction
    - added a skipped-by-default CA/pre-CA stage that appends full plus `_forward` / `_reverse` UNPUDO / unparking variants after the DC output is checkpointed
    - replaced the source-root parquet read with explicit `dataset_split=train/dataset_bucket=<bucket>` reads for DC and optional CA/pre-CA stages
    - aligned train bucket loading with `Materialisation Buckets - upload to databricks` by listing parquet files with `dbutils.fs.ls` before loading
    - split source materialization paths so DC buckets use the March 23 materialization and optional CA/pre-CA buckets use `2026_04_13_14_25_02_root_parking_pudo_unpudo_unparking_with_short_buckets_all_disengagements`
    - changed generated README/source metadata to reflect train-only output
    - keeps the first run dry by default and writes Spark parquet plus `_parquet_files_list.txt` metadata when enabled
    - pushed commit `3b3ff14e783`
    - pushed commit `8a065c9dabf`
    - pushed commit `bb6b7b3fd31`
    - pushed commit `755ba3af5ab`
    - pushed commit `9c9a5117eca`
    - added pending legacy output renaming so Spark-written files are moved to `part-00000.parquet.snappy` naming before metadata files are regenerated
    - checked the SI OTF dataloader path and confirmed both Spark `*.snappy.parquet` and legacy `*.parquet.snappy` names are accepted
    - pushed commit `fdb8126b1d1` with DC gear-change bucket variants and legacy parquet filename canonicalization
    - pushed commit `d11068bfb1f` to fix the gear-change union schema mismatch by dropping `future_gear_direction` from that branch
    - after training job `155826` failed to find the Spark-written derived buckets through the regional `wayveproddatasetflatswe` account, replaced the notebook output path with the original direct `fsspec` Azure writer pattern and pushed commit `5741b14da2c`
    - after job `155829` confirmed the new output still existed only in `wayveproddatasetflat`, replaced the custom fsspec writer with the original PUDO materialization notebook writer implementation and pushed commit `1c713e52451`

- 2026-04-29: [Directional UNPUDO / Unpark Datamodule](agent_tasks/2026/04/Week-5/2026-04-29-directional-unpudo-unpark-datamodule.md)
  - Labels: parking, training, datamodule, unpudo, unparking
  - Branch: `boris/training/kangaroo_with_50_and_route_shorten`
  - PR: none
  - Change type: config
  - Areas: `wayve/ai/si/configs/parking`
  - Changes:
    - added an uncommitted datamodule config using derived DC UNPUDO / unparking `_forward` and `_reverse` buckets from the 2026-04-29 future-speed materialization
    - split each replaced DC event/country weight 50/50 across forward and reverse to preserve total mass while upsampling reverse relative to row counts
    - registered `parking_bc_new_driving_directional_unpudo_unpark_datamodule`
    - updated the config to use nested train groups matching the base split: `driving=0.50`, `parking/pudo=0.25`, `unpudo=0.20`, and `unparking=0.05`
    - recalculated directional bucket weights from materialized row counts separately for UNPUDO and unparking
    - assigned equal total sampler mass to forward and reverse inside each derived DC subset, implying about `3.22x` UNPUDO reverse and `1.37x` unparking reverse per-row upsampling
    - pushed commit `d88cf875ee4` to `boris/training/kangaroo_with_50_and_route_shorten`
    - submitted training job `155826` with session `session_2026_04_29_06_38_50_si_parking_bc_train_release_2026_5_11_dir_unpudo_unpark_50_25_20_5`; initial state `Queued`
    - updated `PUDO_UNPARKING_FUTURE_SPEED_ROOT` to the fsspec-written `2026_04_29_06_36_32...` materialization, kept gear-change buckets unused, and pushed commit `3566bbbe95d`
    - after rerunning materialization with the exact original writer, verified the `2026_04_29_07_52_36...` root exists in both primary and SWE storage accounts, updated the datamodule root, and pushed commit `66a3f487862`

- 2026-04-30: [New UNPUDO Model Analysis Runs](agent_tasks/2026/04/Week-5/2026-04-30-new-unpudo-model-analysis-runs.md)
  - Labels: parking, unpudo, model-analysis, databricks
  - Branch: `parking/notebooks`
  - PR: none
  - Change type: analysis
  - Areas: `parking.model_analysis`, `parking_model_analysis`, `tools/databricks_queries`, `tools/parking_model_analysis_writer`
  - Changes:
    - analyzed 12 new run IDs since 2026-04-27 for `exotic-jellyfish-silver`, `prismatic-teal-bird`, `panther-white-intuitive`, and `tomato-toucan-gorgeous`
    - used 8-way single-run workers with detector-derived event JSON and per-worker `/tmp` packet/cache/staged roots
    - wrote 115 scored rows into `parking.model_analysis`
    - regenerated four model cards and 12 per-run report cards from table rows
    - validated GitHub-compatible `card` links and Foxglove event windows at +/- 5 minutes
    - added helper support for Databricks JSON export, cache directory override, and a Bazel `parking_model_analysis_writer` target

- 2026-04-30: [PUDO Event + Materialization Speed/Gear Buckets](projects/pudo-event-materialization-speed-gear-buckets.md)
  - Labels: parking, materialization, notebooks, dry-run
  - Branch: `boris/parking-materialization-config-dry-run`
  - PR: none
  - Change type: notebook
  - Areas: `wayve/ai/parking/notebooks`
  - Changes:
    - added a `MaterializationConfig` cell to centralize materialization knobs
    - added default `dry_run=True` behavior that limits source events to 10 rows and always skips Azure writes
    - split output configuration from the guarded write block
    - removed eager full-table display from the materialization load cell
    - made cutoff count actions optional behind `CONFIG.log_action_counts`
    - removed per-bucket `limit(1).count()` checks from DC/AV bucket construction
    - moved event-length cutoff to the DC path so CA/pre-CA bucket construction is not cut by DC-only thresholds
    - kept the event-notebook change that retains non-accidental `uncategorised` PUDO/park disengagements
    - pushed commit `41c54f00bf31` to `origin/boris/parking-materialization-config-dry-run`
    - added UNPUDO/unparking event-table `gear_change_timestamps` and `num_gear_changes`
    - replaced materialization middle flow with tagged window specs and bounded corpus reads
    - added future-speed-filtered UNPUDO/unparking movement buckets using closest frame in `[t + 0.60s, t + 0.65s]` and `abs(speed) >= 0.54 km/h`
    - added DC UNPUDO/unparking `_forward` and `_reverse` bucket variants from matched future cleaned gear
    - added DC `*_gear_change` buckets around cleaned gear transitions and explicit initial/final gear anchors
    - applied future-speed filtering to UNPUDO/unparking CA/pre-CA buckets without creating directional CA variants
    - updated writer to consume `materialized_keys_df` directly instead of reconstructing per-bucket dataframes before writing
    - pushed commit `10879af6c9f8` to `origin/boris/parking-materialization-config-dry-run`
    - imported a dry-run copy of the materialization notebook to Databricks and ran it on cluster `shared_2.3.174`
    - Databricks run `729431122715074` completed successfully in `92s` with `CONFIG.dry_run=True`, 10 source events, and no Azure writes


- Topic: Zach PUDO/unparking data comparison
  - Labels: parking, pudo, unpudo, materialization, research
  - Branch: boris/parking-materialization-config-dry-run
  - PR: N/A
  - Change type: Research
  - Areas: wayve/ai/experimental, parking materialization notebooks
  - Changes:
    - Re-checked `origin/zmurez/pudo` at `e6246ab7c722` and compared Zach's dynamic sampler-based UNPUDO/unparking setup against the current notebook materialization plan.
    - Documented gear cleanup, UNPARKING, START_GEAR_CHANGE, GEAR_CHANGE, route blackout/request, and per-waypoint gear-loss differences in [[projects/pudo-event-materialization-speed-gear-buckets]].


- Topic: UNPUDO distance threshold correction
  - Labels: parking, unpudo, event-detection
  - Branch: boris/parking-materialization-config-dry-run
  - PR: N/A
  - Change type: Fix
  - Areas: wayve/ai/parking/notebooks
  - Changes:
    - Updated `UNPUDO_MIN_DISTANCE_M` from `5.0` to `10.0` in the PUDO/UNPUDO event detection notebook to match the agreed moved-enough threshold.


- Topic: Rewrite PUDO materialization project page
  - Labels: parking, pudo, unpudo, materialization, vault
  - Branch: boris/parking-materialization-config-dry-run
  - PR: N/A
  - Change type: Docs
  - Areas: vault/projects
  - Changes:
    - Rewrote `projects/pudo-event-materialization-speed-gear-buckets.md` as a clean project note focused on desired notebook changes and how Zach's `zmurez/pudo` approach differs.
