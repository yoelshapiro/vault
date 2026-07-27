# Portable Vault User Paths

## Summary

Replaced Boris-specific home-directory paths in `llm_wiki` with `${HOME}` and
validated the expanded references for Yoel's VM account.

## Validation

- `USER=yoelshapiro`
- `HOME=/home/yoelshapiro`
- No `/home/borisindelman` references remain under `llm_wiki`.
- Every remaining `${HOME}` filesystem reference resolves to an existing file or
  directory under Yoel's account.

## Additional corrections

- Updated `parking-deploy` and `train-parking-model` to their current
  `ParkingSkills/skills/parking_model_lifecycle/` locations.
- Marked historical event-analysis and UNPUDO skills as unavailable in the
  current ParkingSkills checkout instead of retaining broken paths.
- Recorded the maintenance in `llm_wiki/log.md`.
