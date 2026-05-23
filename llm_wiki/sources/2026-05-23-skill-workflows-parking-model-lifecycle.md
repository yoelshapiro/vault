---
title: Skill Workflows - Parking Model Lifecycle
type: source
owner: Boris Indelman
created: 2026-05-23
updated: 2026-05-23
status: active
tags:
  - llm-wiki
  - skill
  - parking
  - workflow
source_type: skill
source_ref: /home/borisindelman/git/ParkingSkills/skills and /workspace/WayveCode/.ai/skills
---

# Skill Workflows - Parking Model Lifecycle

## Source Metadata

- Source type: local skill docs.
- Retrieved: 2026-05-23.
- Inspected skills:
  - `/home/borisindelman/git/ParkingSkills/skills/train-parking-model/SKILL.md`
  - `/home/borisindelman/git/ParkingSkills/skills/parking-deploy/SKILL.md`
  - `/home/borisindelman/git/ParkingSkills/skills/av-test-multi-model-stats/SKILL.md`
  - `/home/borisindelman/git/ParkingSkills/skills/model-info-finder/SKILL.md`
  - `/home/borisindelman/git/ParkingSkills/skills/parking-event-analysis/SKILL.md`
  - `/workspace/WayveCode/.ai/skills/create-on-road-experiment/SKILL.md`

## Why This Matters

Skills encode operational workflows that are easy to lose in source-code-only documentation. For an MLE and agent working on parking/PUDO, these skills define the expected training, deployment, evaluation, on-road, and event-analysis sequence.

## Key Facts

- `train-parking-model` is the recurring workflow for submitting Parking/PUDO training, answering interactive CLI prompts, monitoring the Surfboard job until a real state, resolving the model nickname, and creating/updating the release row in Notion.
- Stable parking training defaults include project `Parking`, experiment `parking_bc`, AKS on `dgx-h100`, 4 nodes, `+mode=parking_bc_train_release_2026_5_11`, `+datamodule=parking_bc_datamodule`, 100k steps, and priority `P1`, unless the user provides a newer command.
- Session tags should stay short because downstream W&B artifact names can exceed 128 characters.
- `parking-deploy` assumes training has finished, resolves the latest checkpoint, deploys an interleave-control parking model, updates Notion, adds a standard Console note, triggers Gen2 AV Mache Alpha 3 Model CI, and runs parking follow-up evaluations.
- `av-test-multi-model-stats` compares multiple model nicknames across scenario collections and aggregates pass/fail/error statistics at row and segment level.
- `model-info-finder` routes model lookup, checkpoint inspection, Model CI, Buildkite, Flyte, and observability debugging to more focused skills.
- `parking-event-analysis` analyzes PUDO/UNPUDO runs by loading event rows, resolving destination context, aligning driver transcript, classifying success/failure, and optionally writing to `parking.event_analysis`.
- `create-on-road-experiment` creates interleaved on-road experiments through Model Catalogue APIs, resolving templates, vehicle models, fleet themes, models, artifacts, and BRT conventions.

## Workflow Knowledge

The operational parking loop is:

1. Submit training and capture job/session/model identifiers.
2. Monitor training until it is actually running and later finished.
3. Resolve the candidate nickname and document the release row.
4. Deploy the checkpoint as an interleave-control parking model.
5. Add Console notes and trigger Model CI.
6. Run parking-specific evaluation summaries.
7. Create on-road/BRT experiment only after model identity, artifact, template, and theme are resolved.
8. Analyze event-level successes/failures and feed the next data/model change.

## Affected Wiki Pages

- [[llm_wiki/workflows/parking-development-workflow|Parking development workflow]]
- [[llm_wiki/systems/deployment-and-model-catalogue|Deployment and Model Catalogue]]
- [[llm_wiki/systems/evaluation-and-model-ci|Evaluation and Model CI]]
- [[llm_wiki/workflows/on-road-experiment-workflow|On-road experiment workflow]]

## Contradictions or Changes

- Skill defaults are useful starting points, not release guarantees. Always compare against the latest Notion release page and current config before launching a new run.
- The `parking-deploy` skill mentions using spawned sub-agents for deployment in `/workspace/WayveCode`, but this wiki maintenance pass did not deploy a model and did not use sub-agents.

## Open Questions

- Which Eval Studio or AV test scenario collection ids are mandatory for each parking release class?
- Which Notion release table properties are required for every candidate row today?
