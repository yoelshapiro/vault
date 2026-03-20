# Parking unparking gear augmentation

## Overview
- **What it is:** A focused project to improve reverse and unparking behavior by augmenting training labels/features around parked standstill and gear transitions.
- **Why it matters:** The model currently sees many parked/reverse/forward standstill periods where movement is delayed for mixed reasons (unsafe to move vs driver delay), which can teach over-waiting before reverse/unpark.
- **Primary users:** Parking training owners, parking data pipeline owners, and on-road evaluation owners.

## Status
- **Phase:** Phase 1
- **Status:** active
- **Last updated:** 2026-03-20
- **Current priorities:**
  - Reproduce and document baseline behavior from commit `97769ac4b44b378645646934b9e0f901bfa13400` in `wayve/ai/zoo/data/parking.py`.
  - Run ablations to separate helpful gear augmentation from unsafe standstill stripping.
  - Define keep/remove criteria with safety and reverse success metrics.
- **Blockers:**
  - None

## Requirements
- **Problem statement:** Reverse/unparking can stall because training contains many standstill samples with D/R/P where waiting reasons are entangled. We need augmentation that improves intent-to-unpark without teaching unsafe early movement.
- **Target users:** Parking model training and deployment teams.
- **Integrations:** `wayve/ai/zoo/data/parking.py`, parking datamodule config wiring, offline evaluation metrics, on-road validation.
- **Constraints:**
  - Avoid introducing unsafe behavior by stripping legitimate wait-for-safety periods.
  - Keep augmentation interpretable and removable once data quality improves.
  - Preserve compatibility with existing parking data contracts.
- **Success criteria:**
  - Better reverse start rate and lower time-to-first-reverse in unparking episodes.
  - No regression in safety proxies (conflict rate, brake interventions, blocked-scene behavior).
  - Clear ablation evidence for each augmentation component.

## Design
- **Approach:**
  - Use the historical parking augmentation stack as baseline, then isolate each component with targeted ablations.
  - Prefer conditional augmentation using scene/safety context over unconditional stripping/randomization.
- **Key decisions:**
  - Baseline stack to evaluate (from `97769ac...`):
    - Gear reconstruction from speed + validated neutral segments.
    - P/N expansion across adjacent standstill.
    - `augment_unparking_gear` (P -> D/R in unparking context).
    - `strip_leading_standstill` (remove initial standstill when in D/R and resample policy path).
    - `augment_standstill_gear` (randomize input vehicle gear at standstill in parking mode).
    - `clamp_policy_at_goal` for parked stop behavior.
  - Evaluate `strip_leading_standstill` behind stricter gates first (only when low-risk-to-move), since this has the highest unsafe potential.
  - Keep gear randomization input-side only where possible; avoid noisy target rewrites unless backed by metrics.
- **Open questions:**
  - What safety proxy should gate standstill stripping (agent TTC, occupancy, map right-of-way, or combination)?
  - Should standstill randomization include `P` only vs `P/D/R` in parked context?
  - Do we need a dedicated label for "legitimate wait" episodes instead of augmentation-only handling?

## Build Phases
- **Phase:** Phase 1
  - **Goal:** Lock baseline and measurement framework.
  - **Work items:**
    - Reconstruct exact baseline toggles/behavior from the reference commit.
    - Define datasets and metrics for reverse-start, unparking completion, and safety proxies.
    - Add experiment ledger and naming convention for ablation runs.
  - **Validation:**
    - Metric dashboard with per-scenario slices (parked, unparking, blocked waits).
- **Phase:** Phase 2
  - **Goal:** Run controlled ablations and pick minimal effective set.
  - **Work items:**
    - A0: no augmentation (control).
    - A1: only gear reconstruction/cleanup.
    - A2: A1 + `augment_unparking_gear`.
    - A3: A2 + `augment_standstill_gear`.
    - A4: A2 + conditional `strip_leading_standstill` (strict gate).
    - A5: full historical stack.
  - **Validation:**
    - Compare reverse-start and safety metrics; keep only components that improve reverse without safety regression.

## Decisions
- **2026-03-20:**
  - **Decision:** Start a dedicated project for parking/unparking gear augmentation using `97769ac...` behavior as baseline reference.
  - **Rationale:** The thread describes multiple entangled hacks; a single project with explicit ablations is needed to isolate causal impact.
- **2026-03-20:**
  - **Decision:** Treat standstill stripping as high-risk and evaluate only with explicit safety gating.
  - **Rationale:** It can remove legitimate safety waits and bias the model toward moving too early.

## Notes
- Baseline reference commit:
  - `wayve/ai/zoo/data/parking.py` @ `97769ac4b44b378645646934b9e0f901bfa13400`
  - Pipeline sequence includes `augment_unparking_gear` and optional `strip_leading_standstill` around lines 1104-1119 in that revision.
- Data source + datamodule comparison (2026-03-20):
  - Wonjoon reference mode (`5aa61a5...` line ~589) uses `parking_window_bc_diffusion_with_driving_datamodule_cfg`.
  - That datamodule mixes driving buckets + generated parking-window buckets from `2026_02_17_21_44_12_server_parking` (`parking_window_gc*` and `unparking_window_gc*` families).
  - In that config, `augment_gear_direction=False` (explicitly changed in `5aa61a5...`).
  - Current local config at `2bd1f412149` does not use the parking-window datamodule for release modes; it uses `parking_bc_datamodule_cfg` with roots:
    - `parking/dev/2026_03_15_11_14_01_server_parking_pudo_buckets_bc` (driving)
    - `parking/dev/2026_03_17_11_14_18_root_parking_pudo_unpudo_with_av_buckets` (PUDO/UNPUDO/UNPARK)
  - Current local config keeps `augment_gear_direction=True`.
  - Conclusion: model behavior differences are confounded by both augmentation logic and a materially different training mixture.
- Experiment ledger template (update per run):
  - run name
  - what changed
  - target hypothesis
  - outcome (success/fail/inconclusive) + key signal
