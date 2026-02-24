# Parking end-of-route polyline shortening augmentation

## Overview
- **What it is:** Replace end-of-route map blackout augmentation with route polyline shortening so the route ends where the vehicle stops.
- **Why it matters:** Trains and deploys a more realistic end-of-route signal while preserving map context.
- **Primary users:** Parking BC training and deployment teams.

## Status
- **Phase:** Phase 1
- **Status:** active | paused | archived
- **Last updated:** 2026-02-24
- **Current priorities:**
  - Trace where stop location can be stored in parking augmentation.
  - Understand route/polyline generation and representation path in OTF.
  - Define deterministic algorithm for clipping route at stop location.
- **Blockers:**
  - None

## Requirements
- **Problem statement:** Blackout removes all route context; we need route to terminate near stop point instead.
- **Target users:** Model training/inference owners for parking end-of-route behavior.
- **Integrations:** parking.py augmentation, OTF map route wiring, route/polyline generation utilities, deployment parking wrapper.
- **Constraints:** Keep map speed limits intact; preserve current parking mode behavior; avoid regressions in OTF/deployment IO contracts.
- **Success criteria:**
  - Training route map is clipped at stop location for parking timestamps.
  - Deployment behavior aligns with training semantics.
  - Tests cover polyline clipping and route rendering correctness.

## Design
- **Approach:**
  - Capture stop location when parking mode is activated.
  - Propagate stop location to map-route augmentation step.
  - Clip route polylines to stop point by removing downstream segments and truncating closest segment at projected point.
- **Key decisions:**
  - Use geometric projection on nearest polyline segment to define clipping point.
  - Filter route by along-route ordering relative to clipped segment.
- **Open questions:**
  - Best coordinate frame for stop location vs route polylines at augmentation time.
  - Where to persist stop location key with minimal schema impact.

## Build Phases
- **Phase:** Phase 1
  - **Goal:** Confirm data flow and polyline geometry implementation points.
  - **Work items:**
    - Read parking augmentation stop-trigger logic.
    - Read OTF map route insertion and polyline rendering path.
    - Draft clipping algorithm and failure handling.
  - **Validation:**
    - Code walkthrough notes + candidate unit test plan.

## Decisions
- **2026-02-24:**
  - **Decision:** Start as a separate project from blackout augmentation.
  - **Rationale:** Keeps scope explicit while reusing prior understanding.

## Notes
- Initial investigation only. No implementation yet.
