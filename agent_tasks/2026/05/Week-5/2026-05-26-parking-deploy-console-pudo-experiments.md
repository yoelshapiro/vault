# Parking Deploy Console Auth And PUDO Experiments

- Topic: ParkingSkills deploy skill update
- Labels: parking, skills, console, on-road
- Branch: main
- PR: n/a
- Change type: docs/skill update
- Areas: ParkingSkills

## Changes

- Added Console `_oauth2_proxy` fallback instructions for missing cookie or 401/403.
- Defined PUDO on-road experiment as interleaving deployed parking model with `unofficial-cyan-pigeon`.
- Added UK/US Console template IDs and controller requirement.
- Explicitly says to remove run assignments before create/save.

## Validation

- `git -C /home/borisindelman/git/ParkingSkills diff --check` passed.
