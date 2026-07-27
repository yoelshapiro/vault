# Fold Parking Deploy Skills

- Topic: ParkingSkills lifecycle simplification
- Labels: parking, skills, lifecycle
- Branch: main
- PR: n/a
- Change type: docs/skill refactor
- Areas: ParkingSkills

## Changes

- Folded interleave deployment instructions into `parking-deploy`.
- Folded Console note, Model CI, licensing, and on-road experiment instructions into `parking-deploy`.
- Removed lifecycle router routes for `parking-interleave-deploy` and `parking-console-updates`.
- Updated onboarding deployment guidance to use `parking-deploy` only.

## Validation

- `rg "parking-interleave-deploy|parking-console-updates" ${HOME}/git/ParkingSkills` returned no matches.
- `git -C ${HOME}/git/ParkingSkills diff --check` passed.
