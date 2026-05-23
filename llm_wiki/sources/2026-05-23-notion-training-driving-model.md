---
title: Notion - Training a Driving Model
type: source
owner: Boris Indelman
created: 2026-05-23
updated: 2026-05-23
status: active
tags:
  - llm-wiki
  - notion
  - training
source_type: notion
source_ref: 18ec58b0-8122-409c-a3c6-b673bd8fe312
---

# Notion - Training a Driving Model

## Source Metadata

- Source type: Notion page.
- Source ref: `Training a Driving Model`, page id `18ec58b0-8122-409c-a3c6-b673bd8fe312`.
- Retrieved: 2026-05-23.
- Date of source: not inferred from fetch output.
- Confidence: high for facts in this page; medium for old code paths because some paths appear stale against the current checkout.

## Why This Matters

This page is the clearest Notion source found for the end-to-end driving model mental model. It explains the robot/model interface, training ingredients, Wayve Corpus, on-the-fly loading, BC training, and model upload path.

## Key Facts

- A driving model is a neural network integrated with Robot Software to predict driving plans and action them on vehicle platforms.
- Wayve's end-to-end approach is framed as one neural network taking raw sensor/context inputs and producing future trajectory outputs, rather than separately exposing object detection, lane detection, and planning modules.
- A deployable model forward pass takes a dictionary of driving inputs such as camera images, route map, and speed, and returns a dictionary of actions such as future waypoints and indicator state.
- The model/vehicle interface is tied to `/workspace/WayveCode/wayve/ai/lib/interfaces_v2.py`.
- Training requires three ingredients: dataset, model architecture/training objective, and compute/infrastructure.
- The source describes BC training as PyTorch Lightning plus distributed data parallel training.
- The Wayve Corpus is described as a large driving dataset with rows identified by `(run_id, timestamp_unixus)` and a table named `wayve_corpus.all_data`.
- Materialized training datasets are lightweight parquet roots keyed by run/timestamp and partitioned by `dataset_split` and `dataset_bucket`.
- On-the-fly loading uses run/timestamp rows to fetch serialized frame and run data from blob storage at training time.
- Frame-level data examples include speed, curvature, GPS, and image timestamps. Run-level examples include driver, route, run date, and calibration.
- The training page describes model checkpoints and scripted artifacts being uploaded to Console/Model Catalogue for off-road evaluation and on-road testing.

## Workflow Knowledge

Source-backed local debug command shape:

```bash
bazel run //wayve/ai/si:train -- +datamodule=baseline_bc +model=fast_st_debug_bc +mode=C5T4 dev=True
```

The source also describes SI CLI cluster submission with TrainO2/Surfboard style feedback, W&B metrics, Datadog logs, and later Console upload of model artifacts.

## Code References

- `/workspace/WayveCode/wayve/ai/lib/interfaces_v2.py`
- `/workspace/WayveCode/wayve/ai/si/`
- `/workspace/WayveCode/wayve/ai/lib/deploy.py`

## Affected Wiki Pages

- [[llm_wiki/systems/end-to-end-driving-stack|End-to-end driving stack]]
- [[llm_wiki/systems/model-vehicle-interface|Model-vehicle interface]]
- [[llm_wiki/systems/data-and-materialisation|Data and materialisation]]
- [[llm_wiki/workflows/training-a-driving-model|Training a driving model]]

## Contradictions or Changes

- The Notion page describes an older pretraining story using GAIA generative pretraining and contrastive pretraining. The current SI README describes the baseline recipe as WFM pre-training, BC, then RL. Treat the Notion wording as historical unless a current release doc confirms it.
- Some source code anchors in the page appear stale against the current checkout; the current wiki should cite inspected local paths when possible.

## Open Questions

- Which current Notion source supersedes the old GAIA/contrastive pretraining description?
- Which current release model is the best concrete example for tracing WFM to BC to RL?
