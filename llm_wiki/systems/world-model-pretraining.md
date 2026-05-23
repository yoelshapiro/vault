---
title: World Model Pre-training
type: system
owner: Boris Indelman
created: 2026-05-23
updated: 2026-05-23
status: seed
tags:
  - llm-wiki
  - world-model
  - pretraining
sources:
  - /workspace/WayveCode/wayve/ai/foundation/models/world_model/README.md
  - /workspace/WayveCode/wayve/ai/foundation/models/world_model/AGENTS.md
---

# World Model Pre-training

## What this area owns

The world-model area contains the building blocks for training the Wayve Foundation Model: training module, model components, losses, checkpoint loading utilities, and Hydra/hydra-zen configuration.

Primary code path:

- `/workspace/WayveCode/wayve/ai/foundation/models/world_model/`

Primary source:

- `/workspace/WayveCode/wayve/ai/foundation/models/world_model/README.md`

## Main components

- `train.py` - training entry point.
- `training_module.py` - LightningModule with training step, optimizer, and visualization behavior.
- `checkpoints.py` - checkpoint loading utilities.
- `loss_adaptors.py` - loss construction and adaptation.
- `config/train.py` - root config and current baseline base-config name.
- `config/base_configs/releases/` - frozen release configs.
- `config/base_configs/fast/` - smaller fast experiment configs.
- `config/experiments/` - `@experiment` functions for composable experiments.
- `components/backbone/` - MIMO space-time transformer components.
- `components/heads/` - world-model, action-flow, diffusion, radar, and language heads.
- `latent_actions/` - Genie-style latent action path.

## Config model

WFM training is config-first:

- `base_config=` is required and sets the full root config.
- Config group overrides can swap architecture, tokenizer, train data, validation data, IO spec, and deployment config.
- `experiment=` applies a Python `@experiment` function that mutates the composed config.
- Dotlist overrides then patch specific fields.

This is important for the wiki because source pages should distinguish:

- A released base config.
- A reusable experiment function.
- A one-off Hydra override.
- A branch-local code change.

## Development workflow from local guidance

The world-model `AGENTS.md` adds a stricter process for substantial WFM tasks:

1. Create an integration-guide markdown document before implementation.
2. Write a plan in the document and wait for approval before coding.
3. Maintain a progress log after every significant action.
4. Record learnings and command corrections.
5. For cluster jobs, poll status/logs, sleep, and repeat until healthy training or failure diagnosis.

This page should link to any WFM experiment guide imported into the wiki.

## Training paths

Local debug training uses the WFM Bazel target:

```bash
CUDA_VISIBLE_DEVICES=0 HYDRA_FULL_ERROR=1 bazel run //wayve/ai/foundation/models/world_model:train -- base_config=baseline debug=True
```

Cluster WFM training is submitted through `//tools/wayvecli` with a Hydra config, an image URI, a Surfboard project, node count, priority, session tag, base config, and experiment.

## Downstream connection

The world-model stage feeds later driving model stages. The SI README describes the baseline recipe as WFM pre-training followed by BC and RL. The exact handoff can vary by experiment:

- Fine-tune from a WFM checkpoint.
- Load WFM backbone weights into SI BC.
- Evaluate WFM checkpoints through downstream BC, RL, or evaluation workflows.

## Source gaps

- Need a page that explains the current baseline WFM architecture with code-backed module references.
- Need a page for checkpoint handoff from WFM to SI BC.
- Need a page for WFM evaluation workflows and what metrics decide promotion.
