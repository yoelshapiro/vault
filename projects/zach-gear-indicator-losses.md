# Zach gear and indicator losses

## Overview
- **What it is:** A project note for understanding Zach Murez's gear and indicator loss changes in `origin/zmurez/pudo` and deciding how to port them into the SI / zoo Parking implementation.
- **Why it matters:** PUDO / UNPUDO / unparking failures are strongly tied to delayed or missing gear shifts and weak indicator behavior. Zach's implementation explicitly trains those classifiers across the future horizon and upweights future frames where the class changes from the present state.
- **Primary users:** Parking model training owners working on PUDO, UNPUDO, unparking, and long-horizon parking.

## Status
- **Phase:** Investigation
- **Status:** active
- **Last updated:** 2026-04-30
- **Current priorities:**
  - Understand the exact behavior in Zach's branch before changing SI / zoo code.
  - Treat `mcv_new_phase2x_wta.yml` as the likely active config unless Zach confirms otherwise.
  - Decide whether to port only the loss weighting, or both the per-waypoint output heads and the loss weighting.
- **Blockers:**
  - None for analysis.
  - Implementation should wait for explicit approval because this changes output-head semantics, not just loss math.

## Requirements
- **Problem statement:** Import Zach's improved supervision for gear and indicator predictions into our Parking implementation without accidentally changing existing model behavior or deployment assumptions.
- **Target users:** Parking BC training configs that predict gear direction and indicator state.
- **Integrations:**
  - `wayve/ai/experimental/config.py` from `origin/zmurez/pudo`
  - `wayve/ai/experimental/configs/mcv_new_base0.yml` from `origin/zmurez/pudo`
  - `wayve/ai/experimental/losses_metrics/common.py` from `origin/zmurez/pudo`
  - `wayve/ai/experimental/models/mcv_perceiver.py` from `origin/zmurez/pudo`
  - Our likely targets: `wayve/ai/zoo/outputs/`, `wayve/ai/zoo/losses/imitation_losses.py`, `wayve/ai/si/losses/bc_loss_module.py`, and `wayve/ai/si/configs/parking/parking_config.py`
- **Constraints:**
  - Existing models should keep old behavior unless a config explicitly opts into the new behavior.
  - TorchScript/deploy compatibility must be preserved.
  - Per-waypoint heads change query allocation and training behavior; this is more invasive than adding a scalar loss weight.
- **Success criteria:**
  - Clear design decision on what to port.
  - Tests cover old next-step behavior and new per-waypoint/change-weight behavior.
  - Parking config can explicitly enable the new behavior with Zach-like values.

## Design
- **Approach:** Treat Zach's change as two coupled features: per-waypoint classifier heads and change-weighted per-waypoint losses.
- **Key decisions:**
  - Do not implement yet. This note is analysis only.
  - If implemented, keep it opt-in behind config flags.
- **Open questions:**
  - Confirm with Zach whether `mcv_new_phase2x_wta.yml` is the launch config used for the current PUDO model.
  - Whether we want Zach's WTA path behavior as well, or only the single-head losses.

## Build Phases
- **Phase:** Analysis
  - **Goal:** Document Zach's behavior and how it differs from ours.
  - **Work items:**
    - Inspect Zach config flags and loss code.
    - Compare to current SI / zoo heads and BC losses.
    - Identify minimal safe port path.
  - **Validation:** No code changes. Confirm local repo loss/head files remain unchanged.

## Decisions
- **2026-04-30:**
  - **Decision:** Stop implementation and document the behavior first.
  - **Rationale:** User explicitly asked not to change anything; this feature changes model output semantics and should not be slipped in as a loss-only edit.

## Notes

### What Zach Added
- **Per-waypoint indicator prediction:** `INDICATOR.PER_WAYPOINT=True` means the model predicts an indicator class for each future waypoint/frame instead of only a single next-step indicator prediction.
- **Per-waypoint gear prediction:** `GEAR.PER_WAYPOINT=True` means the model predicts gear direction for each future waypoint/frame instead of only one next-step gear prediction.
- **Change-weighted indicator loss:** future indicator frames where `future_indicator != present_indicator` get an extra multiplier.
- **Change-weighted gear loss:** future gear frames where `future_gear != present_gear` get an extra multiplier.
- **Exponential decay:** the multiplier is strongest at the first future waypoint and decays over the horizon:

```text
weight(t) = 1 + (change_weight - 1) * exp(-change_decay * t)
```

### Zach Config Values Found
- In `wayve/ai/experimental/config.py` defaults:
  - `INDICATOR.PER_WAYPOINT=False`
  - `INDICATOR.LOSS_WEIGHT_CHANGE=1.0`
  - `INDICATOR.LOSS_CHANGE_DECAY=0.0`
  - `GEAR.ENABLED=False`
  - `GEAR.PER_WAYPOINT=False`
  - `GEAR.LOSS_WEIGHT_CHANGE=3.0`
  - `GEAR.LOSS_CHANGE_DECAY=0.0`
- In `wayve/ai/experimental/configs/mcv_new_base0.yml`:
  - `INDICATOR.PER_WAYPOINT=True`
  - `INDICATOR.LOSS_WEIGHT_CHANGE=10.0`
  - `INDICATOR.LOSS_CHANGE_DECAY=0.5`
  - `GEAR.ENABLED=True`
  - `GEAR.PER_WAYPOINT=True`
  - `GEAR.LOSS_WEIGHT_CHANGE=20.0`
  - `GEAR.LOSS_CHANGE_DECAY=0.5`
- In `wayve/ai/experimental/configs/mcv_new_phase2_si_baseline.yml`:
  - `INDICATOR.PER_WAYPOINT=False`
  - `GEAR.ENABLED=False`

### Likely Active Config
- The likely active config on `origin/zmurez/pudo` is `wayve/ai/experimental/configs/mcv_new_phase2x_wta.yml`.
- Evidence:
  - Recent config commits repeatedly touched `mcv_new_phase2x_wta.yml` (`multi frame train`, `oracle per head and regression smoothness`, `jerk regularizer`, later cleanups).
  - `mcv_new_phase2x_wta.yml` inherits through `mcv_new_phase2x.yml` -> `mcv_new_phase2.yml` -> `mcv_new_base.yml` -> `mcv_new_base0.yml`.
  - Because `mcv_new_phase2x_wta.yml` does not override `INDICATOR` or `GEAR`, it inherits the `mcv_new_base0.yml` values:
    - `INDICATOR.PER_WAYPOINT=True`
    - `INDICATOR.LOSS_WEIGHT_CHANGE=10.0`
    - `INDICATOR.LOSS_CHANGE_DECAY=0.5`
    - `GEAR.ENABLED=True`
    - `GEAR.PER_WAYPOINT=True`
    - `GEAR.LOSS_WEIGHT_CHANGE=20.0`
    - `GEAR.LOSS_CHANGE_DECAY=0.5`
  - `mcv_new_phase2_si_baseline.yml` disables these paths, but it is referenced by `experimental/scripts/compare_si_mcv.py`, so it looks like a comparison/SI-baseline config, not the actively tuned PUDO training config.

### Zach Loss Behavior
- `IndicatorLoss` reads future targets from `batch["indicator"][:, present + 1 : present + 1 + n_waypoints]`.
- It masks invalid indicator labels, including Maxus `indicator == 7`, and uses either `bc_supervision_valid` or `auto` masking.
- It computes CE over all future waypoints by flattening `[B, n_waypoints, C]` to `[B * n_waypoints, C]`.
- It compares each future target to the present class and upweights only frames where the class differs.
- `GearLoss` does the same for `batch["gear"]`, after shifting classes by `+1` to map `{-1, 0, 1}` to `{0, 1, 2}`.
- Gear also uses `bc_supervision_valid` or `auto` masking.

### Zach Model Wiring
- In `mcv_perceiver.py`, Zach passes:
  - `indicator_per_waypoint=cfg.INDICATOR.PER_WAYPOINT`
  - `gear_per_waypoint=cfg.GEAR.PER_WAYPOINT`
- When per-waypoint is enabled, classifier heads run on `wp_tokens`, so each future waypoint has its own logits.
- When per-waypoint is disabled, classifier heads run on a single dedicated indicator/gear token.
- For WTA, Zach asserts per-waypoint indicator is enabled, and if gear is enabled, gear per-waypoint is also required.

### Our Current SI / Zoo Behavior
- `wayve/ai/zoo/outputs/indicator_output_head.py` uses one token and expands the same logits across all future frames.
- `wayve/ai/zoo/outputs/gear_direction_output_head.py` does the same for gear direction.
- `wayve/ai/zoo/losses/imitation_losses.py::indicator_cross_entropy_loss` trains only `[:, 1]`, i.e. next-step indicator state.
- `wayve/ai/zoo/losses/imitation_losses.py::gear_direction_cross_entropy_loss` trains only `[:, 1]`, i.e. next-step gear direction.
- `wayve/ai/si/losses/bc_loss_module.py` only forwards the basic CE losses; it has no per-waypoint or change-weight config.

### Important Implication
- Porting only Zach's loss weighting is not enough if our heads still expand one token's logits over the future horizon. The model would be penalized across multiple future frames but still would not have per-frame classifier capacity.
- A faithful port needs both:
  - output-head support for independent per-waypoint indicator/gear logits;
  - BC loss support for future-horizon CE with change weighting.

### Minimal Safe Port Plan If We Choose To Implement
- Add optional `per_waypoint` flags to `IndicatorOutputHead` and `GearDirectionOutputHead`.
- Add optional `indicator_per_waypoint` and `gear_direction_per_waypoint` arguments to `OutputAdaptor`.
- Add optional loss args to `BcLossModule`:
  - `indicator_per_waypoint_loss`
  - `indicator_change_weight`
  - `indicator_change_decay`
  - `gear_direction_per_waypoint_loss`
  - `gear_direction_change_weight`
  - `gear_direction_change_decay`
- Keep defaults equal to current behavior.
- Enable Zach-like values only in selected Parking configs.
- Add tests for:
  - old one-token expanded behavior remains unchanged;
  - per-waypoint heads consume future-frame tokens and produce non-identical logits;
  - change-weighted indicator loss upweights future indicator changes;
  - change-weighted gear loss upweights future gear changes;
  - invalid labels and automation masks still zero out supervision.
