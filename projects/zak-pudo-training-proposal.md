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
  - Capture the exact Slack-thread summary of Zak's proposal/actions once Slack access is restored.
  - Draft an implementation-ready initial plan on top of `parking/training/pudo`.
  - Keep the first proposal strictly consistent with existing `parking_config.py` train/release wiring.
- **Blockers:**
  - Slack MCP token currently invalid (`invalid_auth_token`) for reading `C0A75MMDC1M/p1774801827799209`.

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
  - Zak summary section is present (with clear source status and updates).
  - Initial proposal maps directly to current config objects and mode names.

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
  - Treat Slack thread summary as a required input artifact for final proposal sign-off.
- **Open questions:**
  - Which exact changes in Zak's thread should be ported first (data mix, augmentation policy, loss/head tweaks, or deployment-related controls)?
  - Should first run be single-variable ablation or a bundled "proposal candidate" config?

## Build Phases
- **Phase:** Phase 1
  - **Goal:** Produce an implementation-ready proposal tied to existing `parking_config.py` objects.
  - **Work items:**
    - Confirm and summarize Zak's thread proposals/actions.
    - Create `v1` proposal deltas on top of:
      - `pudo_bc_D26_3_3_datamodule_cfg`
      - `parking_bc_release_2026_5_11_cfg`
      - `ParkingBcTrainRelease2026_5_11Cfg`
    - Define first experiment matrix with minimal changes and expected signals.
  - **Validation:**
    - Static config checks via import/hydra config resolution.
    - Run config smoke checks in debug mode (`parking_bc_debug`) before long training runs.

## Decisions
- **2026-04-09:**
  - **Decision:** Create and activate new project from current thread request even before Slack context can be fetched.
  - **Rationale:** Unblocks planning and keeps context organized; thread-derived summary can be patched in once token access is restored.
- **2026-04-09:**
  - **Decision:** Baseline proposal against release `2026.5.11` parking train path and `pudo_bc_D26_3_3_datamodule_cfg`.
  - **Rationale:** Minimizes confounders and aligns with current branch training/deployment conventions.

## Notes
- **Slack thread status:** Fetch blocked by Slack auth token error (`invalid_auth_token`) for link `https://wayve-ai.slack.com/archives/C0A75MMDC1M/p1774801827799209`.
- **Provisional summary of Zak (from existing local project notes, pending exact thread sync):**
  - Zak has consistently pushed for conservative, evidence-backed changes (ablation-first, avoid aggressive blind state rewrites).
  - Zak's prior implementation guidance emphasized deployment compatibility details for interleaving (e.g., correct config plumbing and handover logic), and caution around train/deploy mismatch.
  - This section must be updated with exact thread quotes once Slack access is available.
- **Initial proposal draft (on `parking/training/pudo`, from `parking_config.py`):**
  - Keep `ParkingBcTrainRelease2026_5_11Cfg` as base mode and clone a `v1` mode variant.
  - In `v1`, keep model/loss unchanged; vary only one axis first:
    - Option A: adjust non-driving mix (`pudo_weight/unpudo_weight/unpark_weight`), preserving per-bucket proportions.
    - Option B: keep weights fixed and swap only bucket root to newer materialization if thread indicates data refresh.
  - Keep `non_driving_ca_pre_boost` explicit in the variant and log expected class exposure shift.
  - Add a short experiment ledger in this project page once runs start (run name, delta, hypothesis, outcome).
