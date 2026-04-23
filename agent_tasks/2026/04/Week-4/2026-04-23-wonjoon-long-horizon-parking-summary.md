# Wonjoon Long-Horizon Parking Summary

## Scope

Goal of this pass: reconstruct what Wonjoon actually built for long-horizon parking, what seems core to the approach, what was explicitly temporary or risky, and what was still unfinished when the work was handed over.

Sources used:
- Notion: `Long-Horizon Parking Planning`
- Notion: `Model Architecture`
- Notion: `Input Processing`
- Notion: `Parking Model Handover`
- Slack thread in `#pct-parking-general` on 2026-03-17 about gear augmentation
- Local git history / commits by Wonjoon Goo
- 2026-04-20 parking dev weekly transcript

## Executive Summary

Wonjoon’s long-horizon parking work was not "just a better parking dataloader". It was a full stack:

1. A parking-specific data curriculum and materialisation pipeline that tries to isolate parking / unparking windows from noisy real-world logs.
2. Aggressive parking-focused data cleanup and augmentation, especially around gear-state ambiguity and delayed acceleration from standstill.
3. A new long-horizon latent plan represented as `POLICY_PATH`, sampled in distance space rather than time space.
4. A diffusion head that predicts that path, plus a standard short-horizon driving head conditioned on the predicted path.
5. Early custom offline evaluation focused on parking-specific temporal decision points, especially gear-change correctness and path/waypoint consistency.

The essential idea is:

- short-horizon waypoint prediction alone is too local for parking
- parking should be treated as a long-horizon, multi-stage task
- the model should first commit to a structured future path / maneuver intent
- the ordinary policy should then react locally while remaining aligned with that longer-term plan

## What He Actually Built

### 1. Parking-mode and parking-window detection

The parking pipeline detects parking context from cleaned gear + motion history rather than from an explicit label in the logged data. The core detection logic is in:

- [parking.py](/workspace/WayveCode/wayve/ai/si/datamodules/parking.py:401)
- [parking.py](/workspace/WayveCode/wayve/ai/zoo/data/parking.py:225)

The model-side parking signal is derived from whether the current frame is near a parked segment or inside an unparking window. This is why Wonjoon kept emphasizing that the pipeline loads a larger temporal context around each sampled frame.

Important consequence:
- parking mode is mostly heuristic, inferred from future/past parking-related context
- it is not a direct logged button label from the raw dataset

### 2. POLICY_PATH as the long-horizon target

The core long-horizon supervision target is `POLICY_PATH`: a path sampled at equal arc-length intervals, not at equal timestamps.

Current code paths:
- [parking.py](/workspace/WayveCode/wayve/ai/si/datamodules/parking.py:556)
- [parking.py](/workspace/WayveCode/wayve/ai/si/datamodules/parking.py:1098)
- [parking.py](/workspace/WayveCode/wayve/ai/zoo/data/parking.py:382)

From the notes:
- 50 points
- 0.5 m spacing
- about 25 m horizon
- path is clamped at the goal if the goal is reached early

This is the main shift from normal driving. Instead of only predicting a ~2 second temporal future, the model gets a longer geometric plan in distance space.

### 3. Diffusion path head + path-conditioned ordinary policy

The architecture note shows the intended design clearly:

- ST backbone encodes the scene
- diffusion head predicts `POLICY_PATH`
- ordinary driving head consumes a path embedding and predicts waypoints, indicators, and gear

Current architecture entry points:
- [diffusion.py](/workspace/WayveCode/wayve/ai/zoo/outputs/diffusion.py:27)
- [models.py](/workspace/WayveCode/wayve/ai/zoo/st/models.py:160)
- [parking_config.py](/workspace/WayveCode/wayve/ai/si/configs/parking/parking_config.py:227)

Important design choices from the notes:
- path conditioning was meant to minimally perturb the existing model architecture
- the ordinary head still uses ordinary BC-style losses
- the long-horizon module is what should stabilize maneuver intent
- a key unresolved problem remained path/waypoint conformity

### 4. Parking-specific augmentations

This is the most practically important part for current parking performance.

Main augmentation/data-prep hooks:
- [parking.py](/workspace/WayveCode/wayve/ai/si/datamodules/parking.py:721)
- [parking.py](/workspace/WayveCode/wayve/ai/si/datamodules/parking.py:1050)
- [parking.py](/workspace/WayveCode/wayve/ai/si/datamodules/parking.py:1146)
- [parking.py](/workspace/WayveCode/wayve/ai/si/datamodules/parking.py:1220)
- [parking.py](/workspace/WayveCode/wayve/ai/si/datamodules/parking.py:1412)

The important augmentations were:

- gear rewrite / cleanup
- gear randomization at standstill to break causal confusion
- unparking gear augmentation
- stripping leading standstill from the future trajectory when the sample is already in D/R but motion starts later
- salvage / loading of near-start and near-end samples

The handover note is explicit that some of these were experimental and may be removable.

## What Mattered Most

The sources line up surprisingly well on the highest-leverage pieces.

### A. Salvaging near-end frames

Wonjoon repeatedly called this out as important. Parking often happens near the end of a run, but the standard pipeline was dropping those frames because future frames / future path were incomplete.

Commit cluster:
- partial path loading series around `b56c96184ae`, `d29765f6819`, `4d86c7268ac`, `2fa66cd6846`, `7dc9d6ee17e`

Handover note summary:
- salvage near-end frames
- near-end frame loading
- near-end path loading
- monitor retention rate carefully

This looks like a real enabling change, not a tuning detail.

### B. Filtering out PUDO

Wonjoon’s own interpretation was that including PUDO contaminated the model and caused "stop at the entrance" behavior in parking lots. He explicitly filtered PUDO out for the long-horizon parking model.

This matches the transcript and handover note.

### C. Gear cleanup / rewrite

This looks foundational, not optional.

Slack thread on 2026-03-17:
- Wonjoon was very confident in gear cleanup / rewrite
- his view: gear itself is not the real target; future motion matters more
- only `P` is special

This is consistent with the materialisation work and the commit history.

### D. Path-conditioned policy

The architectural centerpiece is not "diffusion for diffusion’s sake". It is:

- predict a stable long-horizon path
- condition the short-horizon driving policy on it

This is the core research claim and the part that differentiates the work from simple parking-specific data tuning.

## What Was Explicitly Risky or Temporary

### 1. Stripping leading standstill

This is the most important caution.

Slack thread:
- Wonjoon called it the "most effective (but dangerous augmentation)"
- it strips the initial standstill when the gear is already D/R but the logged future starts with delayed acceleration

Why risky:
- you can legitimately be stationary in parking because of traffic or occlusions
- forcing earlier motion can teach unsafe behavior

Wonjoon’s own stance later:
- this was a hack
- it should be ablated
- if enough corrective-action data exists, it should ideally go away

### 2. Random gear augmentation

This is weaker than gear cleanup.

Intent:
- break copycat / causal-confusion behavior where the model just copies the current gear

Concern raised by Zak:
- reverse lights and other visual cues may leak the real gear state
- random scalar corruption can be ignored or can create weird training incentives

Wonjoon’s defense:
- only used in standstill parking / unparking
- only on inputs
- meant to make the model ignore the scalar when it is misleading

Net assessment:
- plausible as a targeted anti-copycat trick
- not as foundational as gear cleanup
- should be treated as ablation-dependent

### 3. Parking-mode input dependence

Wonjoon clearly wanted to reduce dependence on the explicit parking button / parking-mode signal.

His direction was:
- the route map already carries strong information
- train the model so it can enter parking behavior near end-of-route even without the explicit input

This directly foreshadows later route-shortening / end-of-route-parking work on the parking branches.

## What Was Still Unfinished

### 1. Official evaluation integration

This was still immature at handover time.

What existed:
- local inference
- custom evaluation logic
- golden set
- early parking metrics

What was still needed:
- Eval Studio / ShadowGym support
- simulator support for parking-mode input and gear output
- larger evaluation set
- better conformity metrics

### 2. Plan consistency over time

Wonjoon called out consistency explicitly:
- once a plan is chosen, the model should keep doing that thing
- path flicker / plan switching remained a problem

This appears to be an unsolved research item rather than an implementation gap.

### 3. Large-lot roaming / multi-story / memory

He had not solved large parking-lot navigation or memory-like roaming behavior.

Transcript takeaway:
- the model could do parking maneuvers and some P2P-style parking-lot behavior
- but longer-horizon exploration / memory / "don’t loop around" reasoning was still future work

### 4. Production viability / latency / camera mix

At handover:
- model latency was already around 80 ms
- model did not yet use radar
- model did not yet use back camera
- robotics had reportedly disabled the back camera at runtime to stabilize 6-cam behavior

So the algorithmic idea worked ahead of the production integration story.

## Commit Map

The work clusters into a few clear phases:

### Data / materialisation
- `024de24343e` Parking materialise
- `52b2b4097d2` salvage more data, enlarge parking context
- `a49ea560644` simplify gear based parking materialisation

### Augmentation / gear handling
- `55d7e1132e8` massive data augmentation -- rewrite gears, remove leading zero speed traj
- `dde31a7413b` gear rewrite / leading-standstill related fixes
- `29ded63d6ee` gear prediction / break causality
- `44babc914e2` standstill was bad concept, gear change boundary is

### Long-horizon path model
- `0ebffc7da5b` path conditioned output head
- `bc6ea0fd6e3` parking path pred v2
- `1713d44df1f` action chunking in diffusion
- `485a1e4a97b` deployment changes for path tensor output / denoise steps

### Evaluation
- `54dbb41a861` parking metrics
- `f260087d484` parking eval golden set
- `2ca7f383105` parking eval
- `2bf5266d503` training metrics: prediction error, conformity

## My Read

If we strip the work to the essentials, Wonjoon’s real contribution was:

1. Make parking data loadable at all.
2. Make parking / unparking temporally identifiable from noisy logs.
3. Repair the gear signal enough that the model can learn parking transitions.
4. Replace pure short-horizon parking imitation with a longer geometric plan (`POLICY_PATH`).
5. Condition the short-horizon policy on that plan.

The things that look durable:
- near-end / short-path data salvage
- parking-specific materialisation
- gear cleanup / rewrite
- path-conditioned policy
- parking-specific evaluation

The things that look tactical and likely temporary:
- standstill stripping
- some gear randomization tricks
- parking-mode dependence before route-conditioned behavior is robust enough

## Recommended Reading Order

If we need to continue or port this work, I would read in this order:

1. `Parking Model Handover`
2. `Input Processing`
3. `Model Architecture`
4. `wayve/ai/si/datamodules/parking.py`
5. `wayve/ai/zoo/outputs/diffusion.py`
6. `parking metrics` PR / golden set / local eval logic

This order separates "what problem was being solved" from "which augmentation happened to be on at the time".

## Concrete Questions Worth Answering Next

1. Which of the parking augmentations still matter after the gear-boundary buckets and newer data retention changes?
2. How much of the observed gain came from better data selection versus the diffusion path head?
3. Is the path-conditioned policy still winning if we replace diffusion with a cheaper deterministic path head?
4. How much parking-mode input dependence remains once route-end conditioning and route blackout are handled cleanly?
5. Is there now enough CA / pre-CA parking data to retire standstill stripping completely?
