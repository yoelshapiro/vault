---
title: Agent Skill Map
type: workflow
owner: Boris Indelman
created: 2026-05-23
updated: 2026-05-23
status: seed
tags:
  - llm-wiki
  - skills
  - agents
sources:
  - session skill inventory, 2026-05-23
---

# Agent Skill Map

This page maps local skills that are relevant to an MLE working on end-to-end driving, parking, pull-over, model lookup, training, deployment, evaluation, and PR workflows.

Before using a skill, open its `SKILL.md` and follow the instructions there. This page is a navigation map, not a substitute for the skill body.

## Model lookup and provenance

| Skill | Path | Use |
| --- | --- | --- |
| `model-info-finder` | `/home/borisindelman/git/ParkingSkills/skills/model-info-finder/SKILL.md` | Router for model lookup, checkpoint inspection, CI/debug, or observability tasks. |
| `model-lookup-basic` | `/home/borisindelman/git/ParkingSkills/skills/model-lookup-basic/SKILL.md` | Basic model-catalogue lookup by nickname or author. |
| `model-deep-summary` | `/home/borisindelman/git/ParkingSkills/skills/model-deep-summary/SKILL.md` | Expanded model summary by nickname or session ID. |
| `model-checkpoint-inspector` | `/home/borisindelman/git/ParkingSkills/skills/model-checkpoint-inspector/SKILL.md` | Checkpoint-level data, licenses, and run history. |
| `model-trace` | `/workspace/WayveCode/.ai/skills/model-trace/SKILL.md` | Trace training lineage from WFM to BC to RL and find checkpoints. |
| `compare-model-provenance` | `/workspace/WayveCode/.ai/skills/compare-model-provenance/SKILL.md` | Compare training data provenance and loss curves. |
| `explain-model-diff` | `/workspace/WayveCode/.ai/skills/explain-model-diff/SKILL.md` | Run SI config diff between models and group changes by theme. |

## Training and debugging

| Skill | Path | Use |
| --- | --- | --- |
| `train-parking-model` | `/home/borisindelman/git/ParkingSkills/skills/train-parking-model/SKILL.md` | Submit and monitor Parking/PUDO training runs. |
| `debug-training-job` | `/workspace/WayveCode/.ai/skills/debug-training-job/SKILL.md` | Debug failed Surfboard training jobs. |
| `debug-training-job-v2` | `/workspace/WayveCode/.ai/skills/debug-training-job-v2/SKILL.md` | Debug a training job from a numerical Surfboard job ID. |
| `manage-training-job` | `/workspace/WayveCode/.ai/skills/manage-training-job/SKILL.md` | Check status, queue position, and priority for training jobs. |
| `wandb-training-analysis` | `/workspace/WayveCode/.ai/skills/wandb-training-analysis/SKILL.md` | Retrieve and analyze W&B run metrics. |
| `training-job-insights` | `/workspace/WayveCode/.ai/skills/training-job-insights/SKILL.md` | Download and use training-job insight reports from blob storage. |

## Parking deployment and analysis

| Skill | Path | Use |
| --- | --- | --- |
| `parking-deploy` | `/home/borisindelman/git/ParkingSkills/skills/parking-deploy/SKILL.md` | Deploy a trained Parking/PUDO model. |
| `parking-interleave-deploy` | `/home/borisindelman/git/ParkingSkills/skills/parking-interleave-deploy/SKILL.md` | Deploy with interleave control and optional radar overlay. |
| `parking-event-analysis` | `/home/borisindelman/git/ParkingSkills/skills/parking-event-analysis/SKILL.md` | Analyze PUDO or UNPUDO events for run IDs. |
| `parking-event-fetcher` | `/home/borisindelman/git/ParkingSkills/skills/parking-event-fetcher/SKILL.md` | Load PUDO/UNPUDO events from parking materialization tables. |
| `parking-event-classifier` | `/home/borisindelman/git/ParkingSkills/skills/parking-event-classifier/SKILL.md` | Classify parking events as successful or unsuccessful with evidence. |
| `parking-destination-resolver` | `/home/borisindelman/git/ParkingSkills/skills/parking-destination-resolver/SKILL.md` | Resolve intended PUDO destination or task target. |
| `parking-transcript-aligner` | `/home/borisindelman/git/ParkingSkills/skills/parking-transcript-aligner/SKILL.md` | Align Whisper driver transcript rows to parking-event timestamps. |
| `parking-event-analysis-writer` | `/home/borisindelman/git/ParkingSkills/skills/parking-event-analysis-writer/SKILL.md` | Materialize enriched event-analysis rows. |
| `unpudo-unpark-model-analysis` | `/home/borisindelman/git/ParkingSkills/skills/unpudo-unpark-model-analysis/SKILL.md` | Analyze model UNPUDO/unparking events and generate report cards. |
| `unpudo-unpark-segment-investigation` | `/home/borisindelman/git/ParkingSkills/skills/unpudo-unpark-segment-investigation/SKILL.md` | Investigate on-road UNPUDO/unparking segments. |

## Evaluation, CI, and on-road

| Skill | Path | Use |
| --- | --- | --- |
| `av-test-multi-model-stats` | `/home/borisindelman/git/ParkingSkills/skills/av-test-multi-model-stats/SKILL.md` | Run or reuse AV test evaluation for multiple models. |
| `modelci-shadowgym-debug` | `/home/borisindelman/git/ParkingSkills/skills/modelci-shadowgym-debug/SKILL.md` | Inspect Model CI status and failed Buildkite/Shadow Gym logs. |
| `debug-eval-pipeline` | `/workspace/WayveCode/.ai/skills/debug-eval-pipeline/SKILL.md` | Debug Eval Studio and AV test evaluation pipeline issues. |
| `create-evaluation-task` | `/workspace/WayveCode/.ai/skills/create-evaluation-task/SKILL.md` | Add a new foundation evaluation task on an existing datapipe. |
| `create-on-road-experiment` | `/workspace/WayveCode/.ai/skills/create-on-road-experiment/SKILL.md` | Create on-road experiments with model interleavings. |
| `create-driving-feature-experiment` | `/workspace/WayveCode/.ai/skills/create-driving-feature-experiment/SKILL.md` | Create on-road feature-testing experiments for driving features. |
| `monitor-flyte-execution` | `/workspace/WayveCode/.ai/skills/monitor-flyte-execution/SKILL.md` | Monitor a Flyte workflow end to end. |
| `query-flyte-execution` | `/workspace/WayveCode/.ai/skills/query-flyte-execution/SKILL.md` | Query Flyte execution status and task logs. |

## PR and code workflows

| Skill | Path | Use |
| --- | --- | --- |
| `fix-ci-local` | `/workspace/WayveCode/.ai/skills/fix-ci-local/SKILL.md` | Run scoped CI checks locally and fix failures. |
| `fix-pr-ci-checks` | `/workspace/WayveCode/.ai/skills/fix-pr-ci-checks/SKILL.md` | Scope, rerun, and fix failing PR CI presubmit checks. |
| `create-pr` | `/workspace/WayveCode/.ai/skills/create-pr/SKILL.md` | Review branch changes, fill PR template, and open a PR. |
| `github:gh-address-comments` | `/workspace/.codex-borisindelman/plugins/cache/openai-curated/github/6188456f/skills/gh-address-comments/SKILL.md` | Address actionable GitHub PR feedback. |
| `github:gh-fix-ci` | `/workspace/.codex-borisindelman/plugins/cache/openai-curated/github/6188456f/skills/gh-fix-ci/SKILL.md` | Debug or fix GitHub Actions PR checks. |
| `github:github` | `/workspace/.codex-borisindelman/plugins/cache/openai-curated/github/6188456f/skills/github/SKILL.md` | Triage GitHub repo, PR, and issue work. |

## Wiki maintenance note

When a skill is used for real work, summarize the durable workflow knowledge into this wiki after the task. Do not paste entire skill bodies unless the user explicitly asks.
