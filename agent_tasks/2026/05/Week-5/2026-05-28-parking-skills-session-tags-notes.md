# 2026-05-28 Parking Skills Session Tags And Notes

## Summary
- Updated `train-parking-model` to enforce short manual session tags before accepting the training CLI prompt.
- Added a hard rule that the exact typed session tag must be under 128 characters, with a practical preference under ~45 characters because W&B adds run/table prefixes.
- Updated `parking-model-page-update` to make `Notes` a non-writable table property for model-card documentation.
- Clarified that run history, failure details, monitoring status, deploy details, and follow-ups belong in the model-card page body.

## Files
- `/home/borisindelman/git/ParkingSkills/skills/parking_model_lifecycle/train-parking-model/SKILL.md`
- `/home/borisindelman/git/ParkingSkills/skills/parking_model_lifecycle/parking-model-page-update/SKILL.md`
