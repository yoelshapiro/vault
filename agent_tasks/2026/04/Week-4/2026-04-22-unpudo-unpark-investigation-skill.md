# UNPUDO / Unpark Investigation Skill

- Date: `2026-04-22`
- Skill path: `/home/borisindelman/git/ParkingSkills/skills/unpudo-unpark-segment-investigation`
- Discovery path: `~/.codex/skills/unpudo-unpark-segment-investigation`

## What I added

- Created a new Codex skill for investigating on-road `unpudo` and `unparking` segments.
- Added the main workflow in `SKILL.md`.
- Added `agents/openai.yaml` so the skill has UI metadata and a default prompt.

## What the skill covers

- Primary Databricks sources to use:
  - `parking.pudo_unpudo_unpark_events`
  - `prod_data_pipeline.raw__gen2.robot_navigation_instructions`
  - `prod_data_pipeline.raw__gen2.robot_control_controller_state`
  - `prod_data_pipeline.raw__gen2.robot_vehicle_driver_vehicle_state`
  - `prod_data_pipeline.raw__gen2.robot_inference_vehicle_driving_plan`
  - `prod_data_pipeline.inferred__state.trajectory_controller_state`
- AV-only evaluation using `is_drive_by_wire`
- Route-change, AV-engagement, motion, gear, indicator, brake, and pedal interpretation
- Distinction between:
  - meaningful success
  - meaningful failure
  - interrupted short-AV attempts
- Required event-summary format:
  - pass/fail bullet
  - event table
  - Mermaid timeline
  - metrics table
  - written summary

## Notes

- The skill explicitly treats pre-AV route change, gear change, and pedal input as setup rather than model performance.
- It also warns against overclaiming gear ownership when controller gear-command fields are `UNKNOWN`.
