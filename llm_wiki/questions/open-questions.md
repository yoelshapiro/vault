---
title: Open Questions
type: question
owner: Boris Indelman
created: 2026-05-23
updated: 2026-05-23
status: active
tags:
  - llm-wiki
  - open-questions
---

# Open Questions

This page tracks source gaps and investigation candidates.

## Model architecture

- Which exact current production or candidate release config should be treated as the canonical architecture graph for [[llm_wiki/systems/space-time-model-architecture|Space-time model architecture]]?
- Which input adaptors are considered core versus experimental for parking and pull-over?
- Which outputs are primary driving outputs versus auxiliary heads?
- How are WFM checkpoints selected and loaded into SI BC?

## Training

- What is the current approved BC training recipe for parking/PUDO?
- What is the current approved RL recipe and reward/state/action structure?
- Which config comparison workflow is considered authoritative before submitting candidate training?
- Which W&B metrics are most predictive of parking/pull-over improvement?

## Parking and pull-over

- What is the current product definition of robotaxi pull-over versus PUDO?
- Which labels and event windows define pull-over success and failure?
- Which materialization tables are authoritative for PUDO, UNPUDO, unparking, and pull-over?
- Which source docs explain route-shortening, end-of-route blackout, and stopping-mode behavior?
- Which parking evaluation suites should be run for each candidate class?
- Should generic materialisation's hazard-only PUDO proxy be promoted to release usage, or should it incorporate destination/trip context first?
- Which workflow owns forward-unparking detection if that becomes a release requirement?

## Evaluation and on-road

- What is the canonical Model CI state machine for a trained SI candidate?
- How do Eval Studio, Shadow Gym, HiL, AV test, and on-road experiments relate?
- Which failures block model promotion versus only inform follow-up work?
- What is the standard report-card format for parking and pull-over candidates?
- Which Eval Studio suite ids and AV test scenario collection ids are mandatory for parking/PUDO release candidates?

## Wiki operations

- Should source summaries mirror Notion page hierarchy or stay flat by date?
- Should this wiki add a local search tool, or is `index.md` plus `rg` enough for now?
- Which existing vault notes should be ingested first?
- Retry full Notion fetches for the pages listed in [[llm_wiki/sources/2026-05-23-notion-discovery-parking-evaluation|Notion discovery - parking, evaluation, and pull-over pointers]].
- Retry Slack search once the connector is responsive and ingest any durable public threads on parking/PUDO release workflows.
