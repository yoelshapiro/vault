---
title: First Parking PUDO Change
type: workflow
owner: Boris Indelman
created: 2026-05-24
updated: 2026-05-24
status: active
tags:
  - llm-wiki
  - parking
  - pudo
  - workflow
sources:
  - [[llm_wiki/systems/parking-product-and-taxonomy|Parking Product And Taxonomy]]
  - [[llm_wiki/systems/parking-pudo-event-pipeline|Parking PUDO Event Pipeline]]
  - [[llm_wiki/systems/parking-pudo-deployment-and-release|Parking PUDO Deployment And Release]]
  - [[llm_wiki/workflows/parking-development-workflow|Parking Development Workflow]]
---

# First Parking PUDO Change

Use this checklist when making or reviewing a first parking/PUDO model change. The goal is to avoid the common trap of changing a config before the behavior, data, and evaluation are clear.

## 1. Name The Behavior

Write one sentence:

> The model should do X in context Y, and failure means Z.

Examples:

- The model should stop briefly at a safe curbside PUDO target and shift to park; failure means it overshoots, stops in an unsafe place, or does not stop.
- The model should leave a PUDO stop and merge back into traffic; failure means it hesitates despite a safe gap, uses the wrong gear, or merges unsafely.

Then classify the behavior using [[llm_wiki/systems/parking-product-and-taxonomy|Parking Product And Taxonomy]].

## 2. Identify The Event And Label Surface

Decide whether the change is about:

- `pudo`,
- `unpudo`,
- `unparking`,
- APA parking,
- P2P parking-lot navigation,
- RMF / pull-over,
- or general driving near a destination.

Check whether the event is represented in [[llm_wiki/systems/parking-pudo-event-pipeline|Parking PUDO Event Pipeline]]. If it is not represented, the first change may need to be data/evaluation work rather than model work.

## 3. Check Intent Inputs

Before changing training, inspect whether the intended behavior is visible to the model:

- route endpoint or route-shortening context,
- `stopping_mode`,
- `parking_mode`,
- destination preference,
- `INITIATE_AUTO_PARKING`,
- `PARKING_DIRECTION`,
- gear direction/state,
- indicator/hazard state,
- selected parking target or stop pose.

If the intent is not visible, more data may not fix the behavior.

## 4. Check Data And Buckets

Record:

- source table or materialized root,
- bucket names and weights,
- train/validation split,
- country/platform filters,
- binary version,
- event-duration cutoffs,
- DC versus AV bucket family,
- CA/pre-CA window semantics.

For PUDO/UnPUDO data, remember that event windows and dashboard metrics depend on anchor heuristics and disengagement windows.

## 5. Check Model Surface

Identify the exact model surface touched:

- input adaptor,
- output head,
- loss or mask,
- datamodule insert/augmentation,
- config mode,
- checkpoint loading,
- deployment wrapper,
- interleaving trigger.

If the change affects a shared model surface, read [[llm_wiki/systems/multi-task-and-multi-driving-heads|Multi-Task And Multi-Driving Heads]] before assuming the risk is local.

## 6. Define The Control

A useful comparison records:

- control model nickname/session/checkpoint,
- candidate model nickname/session/checkpoint,
- parent checkpoint,
- branch and commit,
- data root and binary version,
- bucket mix,
- important augmentation flags,
- wrapper/interleave partner.

Without this, the result is hard to interpret later.

## 7. Pick Evaluation Before Training

Choose the evaluation signal before launching the run:

- event-table dashboard metric,
- less-wrong / Shadow Gym suite,
- open-loop distance-to-expert metric,
- Model CI gate,
- on-road experiment success rate,
- manual event review.

For parking/PUDO, aggregate intervention/km is rarely enough by itself. Separate PUDO stop, UnPUDO departure, unparking, gear, signaling, and normal-driving regressions.

## 8. After The Result

File the durable learning:

- update the relevant system page,
- add a source summary if a Notion/Drive/Slack/PR source was used,
- update the release or experiment ledger,
- add unresolved gaps to [[llm_wiki/questions/parking-pudo-open-questions|Parking PUDO Open Questions]].

A useful final note says what changed, what signal moved, what did not move, and what the next experiment should test.
