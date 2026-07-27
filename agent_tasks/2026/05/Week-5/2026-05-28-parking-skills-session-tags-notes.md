# 2026-05-28 Parking Skills Session Tags And Notes

## Summary
- Updated `train-parking-model` to enforce short manual session tags before accepting the training CLI prompt.
- Added a hard rule that the exact typed session tag must be under 128 characters, with a practical preference under ~45 characters because W&B adds run/table prefixes.
- Updated `parking-model-page-update` to make `Notes` a non-writable table property for model-card documentation.
- Clarified that run history, failure details, monitoring status, deploy details, and follow-ups belong in the model-card page body.

## Files
- `${HOME}/git/ParkingSkills/skills/parking_model_lifecycle/train-parking-model/SKILL.md`
- `${HOME}/git/ParkingSkills/skills/parking_model_lifecycle/parking-model-page-update/SKILL.md`

## Follow-up: W&B artifact-name budgeting
- Tightened `train-parking-model` after the observed failure:
  - Failed session id: `session_2026_05_28_13_56_11_si_parking_bc_train_release_2026_6_21_pudo_621_bcloss0_80k`
  - Failure artifact prefix: `run-<session-id>-gearparking_trainPinf_v_gtcm_table-...`
- Guidance now budgets the accepted CLI tag plus generated `session_YYYY_MM_DD_HH_MM_SS_` prefix and W&B table suffixes.
- Preferred accepted tag is now <=20 chars, capped at <=35 chars, with full generated session id under ~70 chars.
