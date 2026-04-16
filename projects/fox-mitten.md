# Fox Mitten

## Overview
- **What it is:** A PUDO performance investigation project that uses LLM-assisted analysis (Codex + Gemini CLI/API) over Foxglove/MCAP data and Datadog logs.
- **Why it matters:** Pickup/drop-off quality is core to Robotaxi trust and operational efficiency; we need repeatable analysis of stop quality and pull-out behavior.
- **Primary users:** PUDO engineers, autonomy/perception/behavior owners, and operations analysts.

## Status
- **Phase:** Phase 1
- **Status:** active
- **Last updated:** 2026-03-11
- **Current priorities:**
  - Define a repeatable evaluation workflow for MCAP + Datadog correlation.
  - Establish baseline PUDO metrics for stop initiation, final stop quality, and pull-out behavior.
  - Validate indicator and gear-shift behavior around stop and depart events.
- **Blockers:**
  - None

## Requirements
- **Problem statement:** Current PUDO investigations are manual and fragmented; we need a structured way to evaluate how Robotaxi performs at pickup and drop-off, including legal/safe stopping behavior and departure quality.
- **Target users:** PUDO and parking behavior developers, QA/investigation engineers, and release triage owners.
- **Integrations:**
  - MCAP recordings (Foxglove-compatible)
  - Datadog logs/telemetry
  - LLM tooling (Codex, Gemini CLI/API)
- **Constraints:**
  - Must work on real-world Robotaxi behavior where double parking may be intentional.
  - Must evaluate both curbside and in-lane stops.
  - Must avoid overfitting to one site/map topology.
- **Success criteria:**
  - For each analyzed route-end PUDO event, report:
    - Stop initiation timing near route-end pin
    - Final stopping distance to pin and stop quality
    - Stop validity (acceptable vs better alternative)
    - Pull-out/unparking behavior quality
    - Indicator correctness and gear transitions (to/from park, forward/reverse)
  - Produce actionable failure categories and examples for engineering follow-up.

## Design
- **Approach:** Use LLM-guided workflows to inspect synchronized MCAP and Datadog evidence per event, classify outcomes with a shared rubric, and aggregate repeated failure patterns.
- **Key decisions:**
  - Do not require Foxglove as a hard dependency for all analysis paths.
  - Treat double parking as potentially valid in Robotaxi context, not automatically a failure.
  - Evaluate both stop placement and departure behavior as one PUDO lifecycle.
- **Open questions:**
  - What exact threshold defines acceptable pin proximity by scenario type?
  - How should we rank "valid but non-optimal" stopping points?
  - Which Datadog signals are mandatory for robust stop/gear/indicator inference?

## Build Phases
- **Phase 1:**
  - **Goal:** Build the initial evaluation rubric and first-pass analysis loop for PUDO events.
  - **Work items:**
    - Define per-event inputs (MCAP segments + Datadog query bundle).
    - Define scoring dimensions for stop initiation, stop quality, and pull-out.
    - Define rule set for indicator and gear-shift evaluation.
    - Run initial sample set and capture failure taxonomy.
  - **Validation:**
    - Review 10-20 representative PUDO events with consistent scoring.
    - Confirm rubric distinguishes acceptable double-park from true failures.

## Decisions
- **2026-03-11:**
  - **Decision:** Initialize Fox Mitten as an LLM-assisted PUDO investigation project using MCAP + Datadog.
  - **Rationale:** Fastest path to structured, repeatable diagnostics for route-end pickup/drop-off behavior.

## Notes
- Initial project scope provided by Boris on 2026-03-11.
- 2026-04-16 tooling update: added local Codex skill `gemini-cli-photo-classifier` under `~/.codex/skills/` for basic photo classification via Gemini CLI, including parking and pull-over JSON prompt templates.
- 2026-03-11 investigation: MCAP reading entry points and PUDO-relevant signals identified.
  - Topic listing/readers:
    - `wayve/robot/tools/mcap_utils/read_mcap_topics.py`
    - `wayve/robot/tools/mcap_utils/read_mcap.py`
    - `wayve/prototypes/robotics/vehicle_dynamics/datahub/mcap_loader/mcap_loader.py`
  - Likely PUDO control/vehicle topics in AV data logs:
    - `/robot/control/dbw_command` (`DriveByWireCommand`: `acceleration_mpss`, `gear_command`)
    - `/robot/control/controller_state` (`TrajectoryControllerStateV2`: internal acceleration-related fields)
    - `/robot/vehicle_driver/vehicle_state` (`VehicleStateV2`: `drive_position`, `accelerator_pedal_pct`)
- 2026-04-16 repo-native classifier update: added `wayve/ai/fallback/classifiers/slow_lane_classifier/manual_gemini_from_run.py` + bazel target `manual_gemini_from_run` to fetch run images with existing `auto_labeler.load_images` fallback and classify with Gemini.
- 2026-04-16 run test: `fme10010/2026-04-15--19-10-20--gen2-av-cd9496c5-ad6e-4dc5-a227-8d9a06b3e089` classified as `parking` (`confidence=0.95`) using side-camera frames at timestamps `1776280220000000` and `1776280230000000`.
