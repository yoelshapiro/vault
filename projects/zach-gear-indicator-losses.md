# Zach gear and indicator losses

## Overview
- **What it is:** A project note for understanding Zach Murez's gear and indicator loss changes in `origin/zmurez/pudo` and deciding how to port them into the SI / zoo Parking implementation.
- **Why it matters:** PUDO / UNPUDO / unparking failures are strongly tied to delayed or missing gear shifts and weak indicator behavior. Zach's implementation explicitly trains those classifiers across the future horizon and upweights future frames where the class changes from the present state.
- **Primary users:** Parking model training owners working on PUDO, UNPUDO, unparking, and long-horizon parking.

## Status
- **Phase:** Implementation draft
- **Status:** active
- **Last updated:** 2026-04-30
- **Current priorities:**
  - Review the uncommitted implementation on `boris/pudo_w_route_path_fixes_and_new_data`.
  - Decide whether the query-count change for per-waypoint heads is acceptable for parking checkpoint loading.
  - If accepted, run a parking config construction / short train smoke test before committing.
- **Blockers:**
  - Full `//wayve/ai/zoo:test_outputs` / `test_losses` py_checks are blocked by an existing unrelated pylint failure in `wayve/ai/zoo/deployment/deployment_wrapper.py`.

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
- **Phase:** Implementation draft
  - **Goal:** Port Zach-like per-waypoint gear/indicator heads and future class-change loss weighting into SI / zoo, enabled only by Parking configs.
  - **Work items:**
    - Add opt-in per-waypoint indicator and gear output heads.
    - Add opt-in change-weighted future-horizon CE losses.
    - Wire Zach-like values into `parking_config.py` only.
    - Add tests for per-waypoint head behavior and change-weighted losses.
  - **Validation:** Targeted pytests, mypy, and flake8 pass. Pylint has unrelated pre-existing failure in deployment wrapper.

## Decisions
- **2026-04-30:**
  - **Decision:** Stop implementation and document the behavior first.
  - **Rationale:** User explicitly asked not to change anything; this feature changes model output semantics and should not be slipped in as a loss-only edit.
- **2026-04-30:**
  - **Decision:** Implement an uncommitted opt-in draft on `boris/pudo_w_route_path_fixes_and_new_data`.
  - **Rationale:** A loss-only port would supervise future frames without giving the classifier independent future-frame capacity. The draft therefore includes both per-waypoint output heads and per-waypoint change-weighted losses, but enables them only through the parking output adaptor / parking BC losses.

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

### Implementation Draft Added
- Branch: `boris/pudo_w_route_path_fixes_and_new_data`
- Commit status: uncommitted, per user request.
- Code changes:
  - `wayve/ai/zoo/outputs/indicator_output_head.py`: added optional `per_waypoint`; default remains one-token broadcast.
  - `wayve/ai/zoo/outputs/gear_direction_output_head.py`: added optional `per_waypoint`; default remains one-token broadcast.
  - `wayve/ai/zoo/outputs/output_adaptor.py`: added `indicator_per_waypoint` and `gear_direction_per_waypoint` constructor flags and passes them into the heads.
  - `wayve/ai/zoo/losses/imitation_losses.py`: added future-horizon CE with Zach-style class-change weighting, with dynamic indicator-class masking in the new per-waypoint path so hazard class `3` is not treated as invalid when the head has four classes. The legacy next-step path keeps its old hazard/Maxus ignore behavior.
  - `wayve/ai/si/losses/bc_loss_module.py`: added BC loss config knobs for per-waypoint indicator / gear losses and change weighting.
  - `wayve/ai/si/configs/parking/parking_config.py`: enabled per-waypoint heads/losses for parking models with Zach-like values:
    - indicator change weight `10.0`, decay `0.5`
    - gear change weight `20.0`, decay `0.5`
  - Tests updated for head behavior, weighted losses, and the branch's 4-class indicator output shape.
- Validation:
  - Passed: `bazel test //wayve/ai/zoo:test_outputs_py_test //wayve/ai/zoo:test_losses_py_test //wayve/ai/zoo:test_outputs_mypy //wayve/ai/zoo:test_losses_mypy //wayve/ai/zoo:test_outputs_py_lint_flake8 //wayve/ai/zoo:test_losses_py_lint_flake8`
  - Not passing due unrelated existing issue: full `//wayve/ai/zoo:test_outputs //wayve/ai/zoo:test_losses` because `pylint` reports `wayve/ai/zoo/deployment/deployment_wrapper.py:2611` has too many locals.
- Main risk:
  - True per-waypoint heads increase the `OutputAdaptor` driving query count for parking configs. This is semantically closer to Zach's implementation, but checkpoint loading should be smoke-tested because output-adaptor parameter shapes change.
