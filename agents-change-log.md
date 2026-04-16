# Codex Change Log — WayveCode

## Table of Contents
- [2026-04](#2026-04)
- [2026-03](#2026-03)
- [2026-02](#2026-02)
- [2026-01](#2026-01)
- [2025-12](#2025-12)

## 2026-04
> [!note] 2026-04

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
