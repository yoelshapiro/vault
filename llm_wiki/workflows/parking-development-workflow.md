---
title: Parking Development Workflow
type: workflow
owner: Boris Indelman
created: 2026-05-23
updated: 2026-05-23
status: active
tags:
  - llm-wiki
  - parking
  - workflow
sources:
  - [[llm_wiki/sources/2026-05-23-code-data-materialisation-and-parking|Code - Data Materialisation and Parking]]
  - [[llm_wiki/sources/2026-05-23-vault-parking-newsletters|Vault Parking Newsletters]]
  - [[llm_wiki/sources/2026-05-23-skill-workflows-parking-model-lifecycle|Skill Workflows - Parking Model Lifecycle]]
---

# Parking Development Workflow

## End-to-End Loop

```mermaid
flowchart TD
    failure["Parking/PUDO/pull-over failure mode"] --> source["Source review<br/>Notion, code, Slack, event tables, prior runs"]
    source --> taxonomy["Define event/taxonomy and success criteria"]
    taxonomy --> data["Materialisation and bucket mix"]
    data --> labels["Datamodule labels and OTF inserts"]
    labels --> model["Model inputs, heads, losses, checkpoint loading"]
    model --> train["Local debug then remote training"]
    train --> deploy["Interleave-control deployment"]
    deploy --> eval["Model CI, Shadow Gym, Eval Studio, AV test"]
    eval --> road["On-road / BRT if warranted"]
    road --> analysis["Event analysis and transcript/destination review"]
    analysis --> next["Next experiment"]
```

## Step 1: Define The Behavior

Do not start with a config edit. First write the behavior in operational terms:

- What should the car do?
- Is this park, PUDO, UNPUDO, unparking, or pull-over?
- What context tells the model the intent?
- What is the acceptable trajectory, stop point, gear behavior, and indicator behavior?
- What would count as a failure even without a disengagement?

For pull-over, keep a source-gap note unless a Notion SOP or product definition has been ingested.

## Step 2: Inspect Data Semantics

Use [[llm_wiki/systems/parking-data-and-labels|Parking data and labels]] to verify:

- Event family and bucket names.
- Direct-control versus CA/pre-CA source.
- Hazard, destination, and trip context assumptions.
- Progress checks and movement filters.
- Whether counts are event counts or timestamp rows.

Sampling changes are model changes. Review them with the same rigor as architecture changes.

## Step 3: Inspect Datamodule And Config

Check:

- Materialised root.
- Bucket group and weights.
- `ParkingDataConfig` flags.
- Whether `use_zoo_dataloader` delegates to a simpler insertion path.
- Whether stopping mode, parking mode, gear direction, route shortening, and goal dropout are actually enabled.
- Whether train and validation have comparable key coverage.

## Step 4: Inspect Model Architecture

Check:

- WFM or release checkpoint source.
- Input adaptors: `gear_direction`, `parking_mode`, `stopping_mode`.
- Output heads: waypoint, indicator, gear direction, variance/covariance.
- Loss weights and masks.
- Radar/video/cache settings.
- Deployment wrapper expectations.

## Step 5: Train

Use [[llm_wiki/workflows/training-a-driving-model|Training a driving model]] and the `train-parking-model` skill conventions:

- Keep session tag short.
- Capture job/session/nickname identifiers.
- Monitor until the job is actually running.
- Document the release row or explain why it was skipped.

## Step 6: Deploy And Evaluate

Use [[llm_wiki/systems/deployment-and-model-catalogue|Deployment and Model Catalogue]]:

- Resolve exact source checkpoint.
- Deploy interleave-control group `parking`.
- Resolve deployed nickname and artifact id.
- Add standard parking note.
- Trigger Model CI.
- Run parking follow-up evaluations.

## Step 7: Analyze Events

Use event analysis when aggregate metrics are ambiguous. For each run:

- Resolve destination/task context.
- Align driver transcript when relevant.
- Check gear, indicator, speed, acceleration, and route progress.
- Separate AV-owned behavior from setup/environment issues.
- Write the next data/model action, not only the failure label.

## Review Gates

Before calling a parking candidate healthy:

- Data source and bucket mix are explicit.
- Stopping-mode enum is current.
- Gear-direction head is present if deployment needs it.
- Evaluation covers both stop and departure behavior.
- Pull-over claims are not inferred from PUDO evidence unless product docs support it.
