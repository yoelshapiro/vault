---
title: BC and RL Training
type: system
owner: Boris Indelman
created: 2026-05-23
updated: 2026-05-23
status: active
tags:
  - llm-wiki
  - behavioural-cloning
  - offline-rl
  - si
sources:
  - /workspace/WayveCode/wayve/ai/si/README.md
  - /workspace/WayveCode/wayve/ai/si/configs/model_ci.py
  - [[llm_wiki/sources/2026-05-23-notion-training-driving-model|Notion - Training a Driving Model]]
---

# BC and RL Training

## What SI owns

The SI codebase supports behavioural cloning and reinforcement-learning stages for driving models. The SI README describes a baseline training recipe with three phases: WFM pre-training, BC, and RL. It also states that BC and RL are directly supported in the SI codebase.

Primary path:

- `/workspace/WayveCode/wayve/ai/si/`

## Main entry points

- `/workspace/WayveCode/wayve/ai/si/README.md` - onboarding and training workflow.
- `/workspace/WayveCode/wayve/ai/si/training/train.py` - training path.
- `/workspace/WayveCode/wayve/ai/si/training/main.py` - main training entry point.
- `/workspace/WayveCode/wayve/ai/si/configs/` - Hydra configs for modes, datamodules, models, baselines, versioning, and Model CI.
- `/workspace/WayveCode/wayve/ai/si/cli/` - remote job submission path referenced by SI README.

## Config concepts

- `+mode=` selects a composed training mode. Some modes include nested `model=` and `datamodule=` choices.
- `+model=` selects the LightningModule/model config when not already fixed by the mode.
- `+datamodule=` selects the data input configuration.
- `dev=True` switches to a local debug shape with reduced resources and logging suitable for sanity checks.
- `--control_model` compares a candidate config against a baseline model, session, checkpoint, or config file.

## BC

BC jobs are submitted through the SI CLI for remote training and through `//wayve/ai/si:train` for local checks.

Source-backed example shape:

```bash
bazel run //wayve/ai/si/cli:cli -- --no-verify --experiment si-gen2 --platform AKS --cluster dgx-h100 --num_nodes 4 --session_tag baseline_bc --project <project_name> +mode=baseline_bc --control_model <bc_baseline_nickname>
```

For local validation, use the same core mode/model/datamodule arguments through:

```bash
bazel run //wayve/ai/si:train -- <hydra-overrides> dev=True parent_dir=/mnt/cache/tmp
```

## Offline RL

RL is represented in SI config areas such as:

- `/workspace/WayveCode/wayve/ai/si/configs/store/offline_rl.py`
- `/workspace/WayveCode/wayve/ai/si/configs/store/asymmetric_offline_rl.py`
- `/workspace/WayveCode/wayve/ai/si/configs/versioning/rl_migrations.py`

Source-backed example shape:

```bash
bazel run //wayve/ai/si/cli:cli -- --no-verify --experiment di-offline-rl --platform AKS --cluster dgx-h100 --num_nodes 16 --session_tag baseline_rl --project <project_name> +mode=baseline_rl --control_model <rl_baseline_nickname>
```

## Model CI

SI training configs include a top-level `model_ci` block backed by:

- `/workspace/WayveCode/wayve/ai/si/configs/model_ci.py`

The SI README describes:

- `model_ci.enabled`
- `model_ci.is_off_road_eval_only`
- `model_ci.target_vehicle_models`

Default SI behavior described by the README: Model CI is enabled, targets `gen2-av-mache-alpha3`, and is not off-road-eval-only unless overridden.

## Interleaving

The SI README documents interleaved-model compilation and upload through:

- `/workspace/WayveCode/wayve/ai/scripts/interleaved/`

Important caveat from the README: models with temporal caching can have swap-time issues because the cache is empty at the swap instant. The documented mitigations are training with random masking of past timesteps and using `num_cache_warmup_frames` when interleaving.

## Parking connection

Parking BC modes and datamodules live under SI config and datamodule paths:

- `/workspace/WayveCode/wayve/ai/si/configs/parking/`
- `/workspace/WayveCode/wayve/ai/si/datamodules/parking.py`

Related pages:

- [[llm_wiki/systems/parking-and-pull-over|Parking and pull-over]]
- [[llm_wiki/workflows/training-a-driving-model|Training a driving model]]
- [[llm_wiki/workflows/parking-development-workflow|Parking development workflow]]

## Source gaps

- Need source-backed details for current baseline BC model architecture.
- Need source-backed details for the active RL reward/state/action design.
- Need an explicit page for config migrations and reproducibility checks.
