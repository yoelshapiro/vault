# Parking CODEOWNERS precedence and team update

- Date: 2026-04-15
- Branch: `boris/parking-codeowners-order`
- PR: #106396
- Areas:
  - `docs/CODEOWNERS`
  - `infrastructure/azure/terraform/github_org/teams/prod/team-members/parking-owners.csv`

## Scope
Create a PR that fixes CODEOWNERS rule precedence for Parking paths and expands parking team membership.

## Changes
1. Moved all Parking Team CODEOWNERS rows to be after the broader SI owner rule:
- `/wayve/ai/si @wayveai/driving-intelligence-owners`

2. Added new members to parking owners CSV:
- `ilai-wayve,member,ilai.giloh@wayve.ai`
- `kozdogru,member,kaan.ozdogru@wayve.ai`

3. Cross-checked prior context from PR #103687 (`Parking -- code owner update`) to align file-level intent.

## Validation
- Verified branch is clean and pushed.
- Verified PR creation against `main` with only the two intended files changed.

## Notes
- Commit: `ff9f57269fd`
- No additional code changes outside ownership metadata.
