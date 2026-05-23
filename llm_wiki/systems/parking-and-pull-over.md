---
title: Parking and Pull-over
type: system
owner: Boris Indelman
created: 2026-05-23
updated: 2026-05-23
status: active
tags:
  - llm-wiki
  - parking
  - pudo
  - pull-over
sources:
  - user seed, 2026-05-23
  - /workspace/WayveCode/wayve/ai/si/configs/parking/README.md
  - /workspace/WayveCode/wayve/ai/parking/README.md
  - /home/borisindelman/git/vault/agents-change-log.md
  - [[llm_wiki/sources/2026-05-23-code-data-materialisation-and-parking|Code - Data Materialisation and Parking]]
  - [[llm_wiki/sources/2026-05-23-vault-parking-newsletters|Vault Parking Newsletters]]
  - [[llm_wiki/sources/2026-05-23-skill-workflows-parking-model-lifecycle|Skill Workflows - Parking Model Lifecycle]]
---

# Parking and Pull-over

## Scope

This page is the domain hub for Boris's work on:

- Parking.
- PUDO.
- UNPUDO.
- Unparking.
- Robotaxi pull-over.
- Related stopping, route, gear, indicator, and interleave-control behavior.

## Current source-backed anchors

Training config area:

- `/workspace/WayveCode/wayve/ai/si/configs/parking/parking_config.py`
- `/workspace/WayveCode/wayve/ai/si/configs/parking/README.md`

Datamodule area:

- `/workspace/WayveCode/wayve/ai/si/datamodules/parking.py`
- `/workspace/WayveCode/wayve/ai/si/datamodules/test/test_parking.py`
- `/workspace/WayveCode/wayve/ai/si/datamodules/test/test_parking_unit.py`

Parking package:

- `/workspace/WayveCode/wayve/ai/parking/`
- `/workspace/WayveCode/wayve/ai/parking/notebooks/`
- `/workspace/WayveCode/wayve/ai/parking/evaluation/`
- `/workspace/WayveCode/wayve/ai/parking/model_analysis/`

Input and output model hooks to inspect:

- `/workspace/WayveCode/wayve/ai/zoo/st/input_adaptors/parking_mode.py`
- `/workspace/WayveCode/wayve/ai/zoo/st/input_adaptors/stopping_mode.py`
- `/workspace/WayveCode/wayve/ai/zoo/st/input_adaptors/route.py`
- `/workspace/WayveCode/wayve/ai/zoo/st/input_adaptors/gear_direction.py`
- `/workspace/WayveCode/wayve/ai/zoo/st/input_adaptors/indicator.py`
- `/workspace/WayveCode/wayve/ai/zoo/outputs/gear_direction_output_head.py`
- `/workspace/WayveCode/wayve/ai/zoo/outputs/indicator_output_head.py`

## Training commands

The parking config README gives local and remote command shapes for parking training.

Local debug:

```bash
bazel run //wayve/ai/si:train -- +mode=parking_bc_debug datamodule.dataloader_workers=4 dev=True logger=wandb model.model.gear_direction_dropout_probability=0.1
```

Remote AKS training:

```bash
bazel run //wayve/ai/si/cli:cli -- --no-verify --experiment parking --platform AKS --cluster dgx-h100 --num_nodes 4 --session_tag parking --project <TEAM> --priority P2 +mode=parking_bc_train model.model.gear_direction_dropout_probability=0.1
```

## Workflow synthesis

Parking capability work usually touches several layers:

1. Define or refine event categories and windows.
2. Materialize or select data buckets.
3. Update datamodule mix, labels, or filtering.
4. Update model inputs/outputs if capability needs new conditioning or supervision.
5. Run local debug training and unit/config tests.
6. Submit remote BC training.
7. Deploy or interleave the trained checkpoint.
8. Trigger Model CI, Eval Studio suites, HiL, or on-road experiments.
9. Analyze events and update the next data/config/model change.

This synthesis is supported by the existing vault change log, which contains many prior parking training, deploy, evaluation, and PR-triage sessions.

## Current working model

Use these focused pages for implementation details:

- [[llm_wiki/systems/parking-data-and-labels|Parking data and labels]] - event taxonomy, bucket families, stopping-mode enum, and materialisation caveats.
- [[llm_wiki/systems/parking-model-architecture|Parking model architecture]] - parking input adaptors, output heads, losses, and release alignment.
- [[llm_wiki/workflows/parking-development-workflow|Parking development workflow]] - end-to-end loop from failure mode to on-road analysis.
- [[llm_wiki/systems/evaluation-and-model-ci|Evaluation and Model CI]] - evaluation layers and what each one can and cannot prove.

Key current caveats:

- Current code defines `STOPPING_MODE` as `0=UNAVAILABLE`, `1=PUDO`, `2=PARK`; older notes may use legacy values.
- Generic materialisation currently uses hazard presence in the parked segment as a PUDO proxy, while notebook/event-table workflows may use richer trip/destination context.
- Current inspected parking datamodule code detects reverse-out unparking but deliberately does not detect forward unparking in that path.
- Pull-over remains a source gap until product/SOP docs are ingested.

## Existing vault sources to ingest next

High-value historical notes:

- `/home/borisindelman/git/vault/agent_tasks/2026/05/Week-1/2026-05-02-parking-may01-datamodule.md`
- `/home/borisindelman/git/vault/agent_tasks/2026/05/Week-1/2026-05-03-parking-materialization-window-cap.md`
- `/home/borisindelman/git/vault/agent_tasks/2026/05/Week-2/2026-05-13-parking-py-gear-cleanup-deep-dive.md`
- `/home/borisindelman/git/vault/agent_tasks/2026/05/Week-4/2026-05-19-pr-102690-merge-readiness-check.md`
- `/home/borisindelman/git/vault/agent_tasks/2026/05/Week-4/2026-05-18-parking-model-comparison.md`

Existing generated artifacts:

- `/home/borisindelman/git/vault/html_summaries/parking-model-comparison/`
- `/home/borisindelman/git/vault/parking_model_analysis/`

## Pull-over Source Gap

Pull-over is explicitly in scope, but this wiki pass has not yet mapped its dedicated code paths or docs. Candidate search terms:

- `pull over`
- `pullover`
- `pull_over`
- `stopping_mode`
- `stopping mode`
- `end of route`
- `route shortening`
- `blackout`

Add a dedicated pull-over page once code and Notion sources are ingested.

## Open questions

- What is the current product definition of robotaxi pull-over versus PUDO?
- Which datasets and labels define a successful pull-over?
- Which evaluation suites are authoritative for pull-over progress?
- Which on-road experiment templates should be reused?
- Which model inputs/outputs are considered stable versus experimental for parking and pull-over?
