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

## Update

- Updated the skill output contract to frame each segment as an event card.
- The event card now starts with metadata:
  - model
  - run id
  - date
  - time in UTC
  - event type
  - disengagement type
  - console link
  - Foxglove link
- After the metadata block, the required sections are:
  - pass/fail statement
  - event table
  - Mermaid timeline
  - metrics table
  - written summary

## Update: Databricks persistence

- Extended the skill so each analyzed event is also intended to be written to `parking.model_analysis`.
- Added a shared schema file at:
  - `/home/borisindelman/git/ParkingSkills/skills/unpudo-unpark-segment-investigation/references/parking_model_analysis_schema.sql`
- The schema is designed to be common across:
  - `park`
  - `pudo`
  - `unpudo`
  - `unparking`
- Required write fields now include:
  - `event_type`
  - `event_status`
  - `pass_fail_statement`
  - `written_summary`
  - `event_card_markdown`
  - `analysis_version`
  - `written_at_unixus`
- The schema also stores structured timing, gear, indicator, disengagement, pedal, and link fields so agents can later consume both the summary text and the underlying structured evidence.

## Update: AV-only scoring and resolution

- Tightened the skill so model evaluation is strictly AV-owned:
  - a maneuver cannot be labeled `pass` unless the credited UNPUDO or unpark segment stays AV-owned
  - if the vehicle completes the maneuver outside AV, the report must still label it `fail` for model-performance reporting
- Added a required `resolution` section to each event card with:
  - final outcome
  - agreement level
  - source disengagement type
  - resolved effective failure type
  - confidence
- Updated the event-card requirements so the event table and Mermaid timeline now include, when present:
  - DBW ownership changes
  - driver accelerator help during AV
  - indicator state at maneuver start and end
- Simplified `event_status` guidance to:
  - `pass`
  - `fail`
  with finer diagnosis carried by `effective_failure_type`

## Update: route-change status and exact event anchors

- Tightened the skill again so route-change search is a required part of every event investigation:
  - search at least the last `120s` before the event anchor
  - focus first on the stopped segment after the last PUDO and before first UNPUDO motion
  - every event card must explicitly report route-change status as:
    - `found`
    - `not found`
    - `unclear`
- Updated the event-card metadata block to include route-change status.
- Updated the event table and Mermaid timeline so the first row / first item must make the route-search outcome explicit.
- Updated the paired model-analysis skill so model-card links must target the exact run-file H2 anchor, including milliseconds when present.
