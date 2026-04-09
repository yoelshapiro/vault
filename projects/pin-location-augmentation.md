# Pin Location Augmentation

## Overview
- **What it is:** A project to add classifier-guided pin-location augmentation windows for PUDO training on top of `parking/training/pudo`.
- **Why it matters:** Improves pin perturbation realism so augmentation stays within ranges that still correspond to valid stopping behavior.
- **Primary users:** Parking/PUDO model owners, training/release engineers.

## Status
- **Phase:** Phase 1
- **Status:** active
- **Last updated:** 2026-04-09
- **Current priorities:**
  - Convert thread guidance into SI-compatible augmentation plan.
  - Keep the first experiment on top of existing release training config with minimal confounders.
  - Add data-quality checks for event coverage and class distribution drift.
- **Blockers:**
  - Need explicit paths for class-name mapping assets referenced in thread.

## Requirements
- **Problem statement:** Current pin augmentation can be too unconstrained. We need distance windows for valid before/after pin movement so augmented stops remain behaviorally valid.
- **Target users:** Parking/PUDO training owners and collaborators reviewing experiment outcomes.
- **Integrations:** `parking/training/pudo`, SI parking config (`wayve/ai/si/configs/parking/parking_config.py`), classifier outputs (`pudo_pin_valid_before.npz`, `pudo_pin_valid_after.npz`).
- **Constraints:**
  - Preserve current release training path and avoid broad architectural changes in v1.
  - Separate pin-window augmentation effects from unrelated signal-cleanup effects.
  - Keep branch-local release conventions and naming patterns.
- **Success criteria:**
  - Active project with implementation-ready v1 plan.
  - Thread summary captured as actionable requirements.
  - First experiment matrix isolates data quality, augmentation behavior, and optional hazard-signal cleanup.

## Design
- **Approach:**
  - Use current release path as baseline:
    - datamodule: `pudo_bc_D26_3_3_datamodule_cfg`
    - model: `parking_bc_release_2026_5_11_cfg`
    - mode: `parking_bc_train_release_2026_5_11`
  - Add a targeted augmentation variant (`*_pin_location_v1`) that only constrains pin perturbation by classifier-predicted valid distance windows.
  - Keep model and loss structure unchanged in v1 (`default_losses_parking`) to isolate augmentation impact.
- **Key decisions:**
  - Keep current non-driving split constants first (`pudo_weight=0.09`, `unpudo_weight=0.03`, `unpark_weight=0.02`).
  - Treat classifier refreshes as data-version events and run QC each time.
  - Keep hazard-light cleanup as separate ablation unless explicitly bundled.
- **Open questions:**
  - Where are the class-name mapping files/version tags for before/after classifiers?
  - Should window classes map directly to hard meter thresholds or smoothed probability-weighted bounds?

## Build Phases
- **Phase:** Phase 1
  - **Goal:** Produce an SI-ready, low-risk first implementation plan for pin-location augmentation.
  - **Work items:**
    - Implement dataset/QC checks:
      - total PUDO event count coverage
      - before/after class histograms
      - drift vs previous classifier run
    - Create v1 config variant on top of current release mode/datamodule.
    - Add augmentation logic to read before/after class predictions and clamp pin perturbation window.
    - Define experiment matrix:
      - E0 baseline (no pin-window gating)
      - E1 pin-window gating only
      - E2 pin-window gating + hazard cleanup (optional separate run)
  - **Validation:**
    - Config resolve/smoke in `parking_bc_debug`.
    - Sanity checks for event counts and class distributions per run.
    - Compare key PUDO/UNPUDO/UNPARK signals against baseline.

## Decisions
- **2026-04-09:**
  - **Decision:** Rename project to neutral scope name `Pin Location Augmentation`.
  - **Rationale:** Keep project framing focused on feature intent, not person-centric naming.
- **2026-04-09:**
  - **Decision:** Base proposal on existing release path in `parking_config.py`.
  - **Rationale:** Reduces confounders and keeps first rollout compatible with current branch conventions.
- **2026-04-09:**
  - **Decision:** Port classifier-guided windowing first; defer broad model/loss changes.
  - **Rationale:** Enables clean measurement of augmentation benefit.

## Notes
- **Thread source:** user-provided thread text for `https://wayve-ai.slack.com/archives/C0A75MMDC1M/p1774801827799209`.
- **Thread summary (actionable):**
  - Classifier outputs were generated for valid pin movement windows:
    - `pudo_pin_valid_before.npz`
    - `pudo_pin_valid_after.npz`
  - Integration references were provided in experimental stack:
    - `wayve/ai/experimental/dataset/annotations.py` (near L87)
    - `wayve/ai/experimental/dataset/single_run.py` (near L527, L577)
    - `wayve/ai/experimental/configs/mcv_new_phase2.yml` (near L133)
  - Initial concern set:
    - total PUDO events appeared low (~10,790)
    - class distribution heavily weighted to short windows
  - After additional QM labels + retrain:
    - total increased to 13,272
    - after-window distribution shifted materially toward 25m class
  - Hazard-light signal cleanup was noted as a potentially helpful parallel improvement.
- **Experiment ledger (populate as runs complete):**
  - `run_name` | `delta` | `hypothesis` | `result` | `key signal`
