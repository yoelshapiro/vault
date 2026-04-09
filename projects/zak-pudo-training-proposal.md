# Zak PUDO Training Proposal

## Overview
- **What it is:** A focused proposal to extend parking/PUDO training from `parking/training/pudo`, grounded in the current SI config in `wayve/ai/si/configs/parking/parking_config.py`.
- **Why it matters:** Keeps new work aligned with the known-good parking/PUDO training stack and avoids ad-hoc config drift during new experiments.
- **Primary users:** Boris, Parking/PUDO model owners, training/release engineers.

## Status
- **Phase:** Phase 1
- **Status:** active
- **Last updated:** 2026-04-09
- **Current priorities:**
  - Translate Zak's classifier-based pin-validity pipeline into SI/parking training path.
  - Keep first experiment on top of existing release mode wiring with minimal confounders.
  - Add clear data-quality checks for event count coverage and class skew before rollout.
- **Blockers:**
  - Need explicit paths for "class names are here and here" assets referenced in thread.

## Requirements
- **Problem statement:** We need a new project plan based on a specific Slack thread, and the plan must be consistent with existing parking/PUDO training config patterns.
- **Target users:** Parking training owners and collaborators reviewing/iterating the next experiment plan.
- **Integrations:** Slack thread context, `parking/training/pudo` branch, SI training configs in `wayve/ai/si/configs/parking/parking_config.py`.
- **Constraints:**
  - Follow current parking/PUDO model + datamodule mode wiring.
  - Avoid speculative rewrites before a minimal baseline proposal is agreed.
  - Preserve branch-local conventions used by existing parking release configs.
- **Success criteria:**
  - New project page exists and is active in the vault registry.
  - Zak summary section captures thread-provided facts and decisions.
  - Initial proposal maps directly to current config objects/mode names and defines first ablations.

## Design
- **Approach:**
  - Use existing release path as baseline:
    - datamodule: `pudo_bc_D26_3_3_datamodule_cfg` (`parking_config.py`)
    - model: `parking_bc_release_2026_5_11_cfg`
    - train mode: `parking_bc_train_release_2026_5_11`
  - Keep first proposal as an incremental variant, not a fresh stack.
  - Define explicit guardrails for data-root, bucket mix, and non-driving class weights.
- **Key decisions:**
  - Anchor proposal on `PARKING_PUDO_BUCKETS_D26_3_3_ROOT` and current PUDO/UNPUDO/UNPARK split (`0.09/0.03/0.02`) before introducing new knobs.
  - Retain current loss block defaults (`default_losses_parking`) unless a specific ablation hypothesis requires a change.
  - Port classifier-driven pin validity first as data/augmentation logic, not as broad model/loss rewrite.
- **Open questions:**
  - Are "class names" assets versioned in the same location as the `pudo_pin_valid_before/after.npz` outputs?
  - Should hazard-light cleanup be included in same experiment batch or isolated as separate change?

## Build Phases
- **Phase:** Phase 1
  - **Goal:** Produce an implementation-ready proposal tied to existing `parking_config.py` objects.
  - **Work items:**
    - Port thread summary into explicit SI implementation plan.
    - Create `v1` proposal deltas on top of:
      - `pudo_bc_D26_3_3_datamodule_cfg`
      - `parking_bc_release_2026_5_11_cfg`
      - `ParkingBcTrainRelease2026_5_11Cfg`
    - Define experiment matrix that isolates:
      - data/annotation coverage effects
      - pin-augmentation behavior effects
      - hazard-signal cleanup effects
  - **Validation:**
    - Static config checks via import/hydra config resolution.
    - Run config smoke checks in debug mode (`parking_bc_debug`) before long training runs.
    - Add dataset checks for total PUDO events and before/after class histograms.

## Decisions
- **2026-04-09:**
  - **Decision:** Create and activate new project from thread request before Slack MCP recovery.
  - **Rationale:** Unblocked planning immediately; user later provided full thread text.
- **2026-04-09:**
  - **Decision:** Baseline proposal against release `2026.5.11` parking train path and `pudo_bc_D26_3_3_datamodule_cfg`.
  - **Rationale:** Minimizes confounders and aligns with current branch training/deployment conventions.
- **2026-04-09:**
  - **Decision:** Keep first port focused on classifier-guided pin augmentation windows and data quality checks.
  - **Rationale:** Matches Zak's thread emphasis: first prove data quality/coverage and augmentation value before broader changes.

## Notes
- **Thread source:** user-provided text for `https://wayve-ai.slack.com/archives/C0A75MMDC1M/p1774801827799209`.
- **What Zak proposed and did (from thread):**
  - Built first classifier pipeline for PUDO pin-augmentation validity using human labels.
  - Produced two prediction artifacts over recent PUDO runs:
    - `pudo_pin_valid_before.npz` (how far before stop is still valid)
    - `pudo_pin_valid_after.npz` (how far after stop is still valid)
  - Wired this in experimental stack (references shared):
    - `experimental/dataset/annotations.py` (around L87)
    - `experimental/dataset/single_run.py` (around L527, L577)
    - `experimental/configs/mcv_new_phase2.yml` (around L133)
  - Started a model training run with this setup.
  - Flagged two concerns:
    - PUDO event count looked too low initially (~10,790) and might miss events.
    - Label distribution heavily concentrated in short ranges (<20m), uncertain if data, labeling, or model effect.
  - Ran a second classifier pass after new QM labels:
    - Total events increased to 13,272.
    - "After" class distribution shifted materially (25m bucket increased), indicating updated label coverage improved long-range representation.
  - Also noted hazard-light signal cleanup as potentially helpful.
- **Initial SI proposal (on `parking/training/pudo`, from `parking_config.py`):**
  - Keep base training path unchanged:
    - datamodule: `pudo_bc_D26_3_3_datamodule_cfg`
    - model: `parking_bc_release_2026_5_11_cfg`
    - mode: `parking_bc_train_release_2026_5_11`
  - Add a new experiment mode/config variant (`*_pudo_pin_v1`) that only introduces pin-valid augmentation gates:
    - read classifier class outputs (`before`, `after`) per event
    - convert classes to distance windows
    - constrain pin perturbation/jitter to predicted-valid window
  - Keep loss/model architecture unchanged for v1 (`default_losses_parking`) to isolate augmentation impact.
  - Keep existing bucket mixture constants initially (`pudo_weight=0.09`, `unpudo_weight=0.03`, `unpark_weight=0.02`), then ablate if needed.
  - Add mandatory data QC stage before/after each classifier refresh:
    - total PUDO event coverage
    - per-class histograms for before/after
    - drift checks versus previous classifier version
- **Experiment ledger (to populate as runs complete):**
  - `run_name` | `delta` | `hypothesis` | `result` | `key signal`
