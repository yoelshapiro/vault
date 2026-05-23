---
title: Codebase Map
type: map
owner: Boris Indelman
created: 2026-05-23
updated: 2026-05-23
status: seed
tags:
  - llm-wiki
  - wayvecode
  - code-map
sources:
  - /workspace/WayveCode/wayve/ai/si/README.md
  - /workspace/WayveCode/wayve/ai/si/configs/parking/README.md
  - /workspace/WayveCode/wayve/ai/foundation/models/world_model/README.md
  - /workspace/WayveCode/wayve/ai/parking/README.md
---

# Codebase Map

This page is a living navigation map for the WayveCode areas most relevant to an MLE working on end-to-end driving, parking, and pull-over capabilities.

## Repository root

- `/workspace/WayveCode` - main code repository.
- `/workspace/WayveCode/AGENTS.md` - root coding-agent rules if present in a session context.
- `/workspace/WayveCode/.ai/skills/` - Wayve skill definitions.
- `/home/borisindelman/git/ParkingSkills/skills/` - parking-focused skill definitions.

## World model pre-training

- `/workspace/WayveCode/wayve/ai/foundation/models/world_model/README.md` - current WFM entry point. It states that this area contains WFM training modules, model components, losses, checkpoint utilities, Hydra/hydra-zen config, training commands, and development workflow.
- `/workspace/WayveCode/wayve/ai/foundation/models/world_model/train.py` - WFM training entry point.
- `/workspace/WayveCode/wayve/ai/foundation/models/world_model/training_module.py` - LightningModule for training step, optimizer, and visualization behavior.
- `/workspace/WayveCode/wayve/ai/foundation/models/world_model/config/` - WFM config system.
- `/workspace/WayveCode/wayve/ai/foundation/models/world_model/config/base_configs/releases/` - frozen WFM release YAMLs.
- `/workspace/WayveCode/wayve/ai/foundation/models/world_model/config/experiments/` - `@experiment` functions for composable WFM experiments.
- `/workspace/WayveCode/wayve/ai/foundation/models/world_model/components/` - backbone, heads, tokenizer, and model components.
- `/workspace/WayveCode/wayve/ai/foundation/models/world_model/latent_actions/` - Genie-style latent action path.
- `/workspace/WayveCode/wayve/ai/foundation/models/world_model/notebooks/how_does_the_model_work.ipynb` - WFM model explainer notebook.

Related page: [[llm_wiki/systems/world-model-pretraining|World model pre-training]].

## SI BC and RL

- `/workspace/WayveCode/wayve/ai/si/README.md` - SI onboarding, training, local debugging, remote submission, Model CI, interleaving, and Azure workflow.
- `/workspace/WayveCode/wayve/ai/si/training/train.py` - SI training path.
- `/workspace/WayveCode/wayve/ai/si/training/main.py` - SI training main entry point.
- `/workspace/WayveCode/wayve/ai/si/cli/` - cluster submission CLI entry point referenced by SI training docs.
- `/workspace/WayveCode/wayve/ai/si/configs/` - Hydra config store for modes, model configs, datamodules, baselines, BC/RL config migrations, and Model CI.
- `/workspace/WayveCode/wayve/ai/si/configs/baseline/` - baseline and release-oriented configs.
- `/workspace/WayveCode/wayve/ai/si/configs/store/offline_rl.py` - offline RL config area.
- `/workspace/WayveCode/wayve/ai/si/configs/store/asymmetric_offline_rl.py` - asymmetric offline RL config area.
- `/workspace/WayveCode/wayve/ai/si/configs/versioning/bc_migrations.py` - BC config migrations.
- `/workspace/WayveCode/wayve/ai/si/configs/versioning/rl_migrations.py` - RL config migrations.
- `/workspace/WayveCode/wayve/ai/si/configs/model_ci.py` - Model CI config object for SI training outputs.

Related page: [[llm_wiki/systems/bc-rl-training|BC and RL training]].

## Model architecture and outputs

- `/workspace/WayveCode/wayve/ai/zoo/st/models.py` - space-time model definitions.
- `/workspace/WayveCode/wayve/ai/zoo/st/input_adaptors/` - input adaptors, including route, speed, pose, indicator, gear direction, parking mode, stopping mode, radar, video, and temporal adaptors.
- `/workspace/WayveCode/wayve/ai/zoo/outputs/` - output adaptors and heads.
- `/workspace/WayveCode/wayve/ai/zoo/outputs/waypoints_heads.py` - waypoint output heads.
- `/workspace/WayveCode/wayve/ai/zoo/outputs/diffusion.py` - diffusion output path.
- `/workspace/WayveCode/wayve/ai/zoo/outputs/flow_head.py` - flow-based output path.
- `/workspace/WayveCode/wayve/ai/zoo/outputs/gear_direction_output_head.py` - gear-direction output head.
- `/workspace/WayveCode/wayve/ai/zoo/outputs/indicator_output_head.py` - indicator output head.
- `/workspace/WayveCode/wayve/ai/si/trajectory.py` - trajectory-related SI utilities.

## Parking, PUDO, UNPUDO, and unparking

- `/workspace/WayveCode/wayve/ai/parking/` - parking package, evaluation scripts, notebooks, and model-analysis utilities.
- `/workspace/WayveCode/wayve/ai/si/configs/parking/parking_config.py` - parking model configuration definitions.
- `/workspace/WayveCode/wayve/ai/si/configs/parking/README.md` - local and remote parking training commands.
- `/workspace/WayveCode/wayve/ai/si/datamodules/parking.py` - parking datamodule logic.
- `/workspace/WayveCode/wayve/ai/si/datamodules/test/test_parking.py` - parking datamodule tests.
- `/workspace/WayveCode/wayve/ai/si/datamodules/test/test_parking_unit.py` - parking unit tests.
- `/workspace/WayveCode/wayve/ai/zoo/data/parking.py` - parking data types and helpers.
- `/workspace/WayveCode/wayve/ai/zoo/data/test/test_parking.py` - parking data tests.
- `/workspace/WayveCode/wayve/ai/parking/notebooks/pudo_unpudo_materialization.ipynb` - PUDO/UNPUDO materialization notebook.
- `/workspace/WayveCode/wayve/ai/parking/notebooks/pudo_unpudo_event_detection.ipynb` - event detection notebook.
- `/workspace/WayveCode/wayve/ai/parking/model_analysis/` - model-analysis utilities for parking events.
- `/workspace/WayveCode/wayve/ai/parking/evaluation/` - parking evaluation scripts and tests.

Related page: [[llm_wiki/systems/parking-and-pull-over|Parking and pull-over]].

## Evaluation and data flywheel

- `/workspace/WayveCode/wayve/ai/parking/evaluation/run_evaluation_batch.py` - parking evaluation batch runner.
- `/workspace/WayveCode/wayve/ai/parking/evaluation/buckets_to_jsons.py` - conversion path for parking buckets to JSONs.
- `/workspace/WayveCode/wayve/ai/services/data_flywheel/eval_studio.py` - Eval Studio integration in the data flywheel service area.
- `/workspace/WayveCode/wayve/ai/services/data_flywheel/model_catalogue.py` - Model Catalogue integration in data flywheel.
- `/workspace/WayveCode/wayve/ai/services/data_flywheel/release_table.py` - release-table integration.

## Deployment and interleaving

- `/workspace/WayveCode/wayve/ai/si/README.md` - interleaving commands and Model CI options.
- `/workspace/WayveCode/wayve/ai/scripts/interleaved/` - interleaved model compile/upload path referenced by SI docs.
- `/workspace/WayveCode/wayve/ai/distillation/deployment/` - deployment package for distillation models.
- `/workspace/WayveCode/wayve/ai/safety/training/deployment/` - safety deployment examples.

## Existing vault artifacts to mine

- `/home/borisindelman/git/vault/agents-change-log.md` - chronological record of previous agent work, including many parking training/deploy/eval sessions.
- `/home/borisindelman/git/vault/agent_tasks/2026/05/` - recent detailed task notes.
- `/home/borisindelman/git/vault/html_summaries/parking-model-comparison/` - existing interactive parking model comparison.
- `/home/borisindelman/git/vault/parking_model_analysis/` - parking model report cards and model analyses.

## Source gaps

- Pull-over-specific code paths are not yet mapped. Start with searches for `pull over`, `pullover`, `stopping_mode`, `stopping mode`, and route/end-of-route logic.
- On-road experiment CLI paths need a dedicated ingest from the relevant skill and code.
- Model Catalogue, Eval Studio, and Shadow Gym deserve separate pages once sources are ingested.
