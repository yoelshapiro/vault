# Portable Vault User Paths

## Summary

Replaced Boris-specific vault and ParkingSkills Git-root paths across the vault
with `${HOME}` and validated maintained wiki references for Yoel's VM account.

## Validation

- `USER=yoelshapiro`
- `HOME=/home/yoelshapiro`
- No hard-coded Boris `git/vault` or `git/ParkingSkills` roots remain in vault
  Markdown.
- All 27 maintained `llm_wiki` `${HOME}` filesystem references resolve to
  existing files or directories under Yoel's account.
- Unrelated historical Boris paths under `.codex`, `tmp`, and `Downloads` remain
  unchanged because those artifacts are not portable user-home references.

## Additional corrections

- Updated `parking-deploy` and `train-parking-model` to their current
  `ParkingSkills/skills/parking_model_lifecycle/` locations.
- Marked historical event-analysis and UNPUDO skills as unavailable in the
  current ParkingSkills checkout instead of retaining broken paths.
- Recorded the maintenance in `llm_wiki/log.md`.
