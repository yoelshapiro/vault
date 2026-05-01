# Parking Training Job Restores

## Context
Two Parking BC train jobs stopped again and were reported as failed in Surfboard.

## Jobs Checked
- `156963` / `violet-happy-dolphin`
  - Session: `session_2026_04_30_19_28_13_si_parking_bc_train_gear_indicator_wonjoon_full_aug`
  - Failed after reaching step `77692`.
  - Logs show coordinated `SIGTERM` across ranks followed by checkpoint save to `model-checkpoint-000077692.ckpt`.
- `156962` / `pink-owl-vociferous`
  - Session: `session_2026_04_30_19_00_22_si_parking_bc_train_gear_indicator_gi_parking_aug_retry`
  - Failed after reaching step `74781`.
  - Logs show coordinated `SIGTERM` across ranks followed by checkpoint save to `model-checkpoint-000074781.ckpt`.

## Assessment
- No deterministic Python traceback or model/data bug was visible at termination.
- Both jobs had normal data/augmentation warnings before termination, then external `SIGTERM` handling and checkpoint save.
- `job resume` cannot operate on failed jobs; Surfboard rejected it because both jobs were in `Failed` state.

## Action
- Restored `156963` as new job `157458`.
- Restored `156962` as new job `157457`.

## Current Status
- `157458`: queued, P1, queue position 2 at check time.
- `157457`: queued, P1, queue position 1 at check time.
