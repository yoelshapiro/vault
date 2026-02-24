# Parking end-of-route map blackout augmentation

## Overview
- **What it is:** A new parking training augmentation project to simulate end-of-route by blacking out the route map inputs, instead of shortening route polylines.
- **Why it matters:** End-of-route stop quality is weaker than button-press stop quality; current training has a strong bias toward button-press behavior away from true route end.
- **Primary users:** Parking model training owners working on route-end stopping behavior.

## Status
- **Phase:** Phase 1
- **Status:** active
- **Last updated:** 2026-02-24
- **Branch:** boris/train/pudo_15_02_26
- **Current priorities:**
  - Capture exact reusable behavior from `boris/stopping_mode` PR history.
  - Port only blackout logic into current branch, without route-shortening stack.
  - Implement blackout as deterministic when parking mode is detected (no probability gate).
- **Blockers:**
  - None

## Requirements
- **Problem statement:** Route-end samples in training are underrepresented in the right form; stop behavior near true end-of-route underperforms vs simulated button-press stop.
- **Target users:** Training/inference owners of parking + PUDO stopping behavior.
- **Integrations:** `wayve/ai/si/datamodules/otf.py`, `wayve/ai/zoo/data/parking.py`, parking config in `wayve/ai/si/configs/parking/parking_config.py`.
- **Constraints:** Keep this variant scoped to map blackout only; do not add route polyline shortening for this project.
- **Success criteria:**
  - Train-only flag-gated map blackout is available in OTF parking path.
  - Blackout triggers whenever parking mode is detected and blackout flag is enabled.
  - `parking_mode` label is preserved (no forced override to `False`).
  - No `RouteMapFetcher` route-shortening logic is needed for this variant.

## Design
- **Approach:**
  - Reuse the earlier blackout implementation pattern from PR `#93171` commit `a912c7c`:
    - detect parking in `insert_parking_data*`,
    - after map tensors are present, zero out `DataKeys.MAP_ROUTE`,
    - keep behavior train-only and flag-gated.
  - Current OTF ordering is:
    - `insert_parking_data` first in `wayve/ai/si/datamodules/otf.py` (around line 887),
    - `insert_map_data` later in the same function (around line 1052).
  - Because map is inserted after parking, blackout must be applied in a post-map step in OTF (or parking must emit a blackout marker consumed after map insertion).
  - Explicitly avoid the later route-shortening stack introduced by `974ce33` and follow-up commits.
- **Key decisions:**
  - Reuse blackout semantics from early `boris/stopping_mode` history, not final route-shortening behavior.
  - Keep implementation minimal; avoid new route-shortening keys (`PARKING_ENTRY_DISTANCE_M`, stop route index/fraction) unless required later.
  - No probability gating: when parking mode is on, blackout is applied.
  - Keep `parking_mode=True` for blacked-out samples.
  - Keep `DataKeys.MAP_SPEED_LIMITS` unchanged for now (it is a scalar speed-limit input, not the route-map image).
- **Open questions:**
  - Whether to also drop/neutralize `DataKeys.MAP_SPEED_LIMITS` in a later ablation.

## Build Phases
- **Phase 1: PR archaeology and scope lock**
  - **Goal:** Freeze exact behavior to port from `boris/stopping_mode`.
  - **Work items:**
    - Confirm blackout commit (`a912c7c`) behavior and later replacement commits.
    - Document minimal file touch set for blackout-only path.
  - **Validation:** Written project scope and reuse map.
- **Phase 2: Blackout-only OTF port**
  - **Goal:** Add map blackout augmentation without polyline shortening.
  - **Work items:**
    - Wire/restore train-only blackout flag in datamodule + parking config.
    - Keep parking detection in `parking.py` (no random blackout probability, no parking_mode flip).
    - Add a post-map blackout step in `otf.py` right after `insert_map_data` using `DataKeys.PARKING_MODE`.
    - Blackout only `DataKeys.MAP_ROUTE`; leave `DataKeys.MAP_SPEED_LIMITS` unchanged.
  - **Validation:** Targeted OTF/parking tests or local sample inspection.
- **Phase 3: Guardrails + regression checks**
  - **Goal:** Ensure no accidental route-shortening behavior leaks in.
  - **Work items:**
    - Keep `routes.py` untouched for this variant.
    - Add/adjust tests around blackout gating and map tensor mutation.
  - **Validation:** Relevant Bazel tests pass; behavior-only diff confirmed.

## Decisions
- **2026-02-24:**
  - **Decision:** Start a new project dedicated to end-of-route augmentation via map blackout only.
  - **Rationale:** This isolates one hypothesis and avoids coupling with route-shortening complexity.
- **2026-02-24:**
  - **Decision:** Base reuse analysis on PR `#93171` (`boris/stopping_mode`) with commit-level split:
    - `a912c7c` = blackout version,
    - `974ce33` onward = route-shortening replacement.
  - **Rationale:** The user request is specifically to keep blackout and not shorten route polylines.
- **2026-02-24:**
  - **Decision:** Finalized blackout behavior for this project:
    - always blackout when parking mode is detected,
    - keep `parking_mode` unchanged,
    - leave `map_speed_limits` unchanged.
  - **Rationale:** This isolates the route-map visual blackout intervention without introducing additional label or speed-limit confounds.

## Notes
- Previous project context: [[projects/parking-stopping-mode-dilc]]
- Relevant previous branch: `boris/stopping_mode`
- PR reviewed: `#93171` (`Boris/stopping_mode`)
- PR history summary:
  - Early implementation added `enable_end_of_route_blackout` and `insert_parking_data_with_end_of_route_blackout`.
  - Later commits replaced blackout with route shortening (`enable_route_shortening_for_parking`) and route truncation in `wayve/ai/lib/data/pipes/routes.py`.
  - Final PR mixes stopping_mode, hazard, deployment wrapper, and route-shortening changes; blackout-only port should cherry-pick logic conceptually, not wholesale.
