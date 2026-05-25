---
title: Parking Onboarding Skill
date: 2026-05-25
tags:
  - parking
  - onboarding
  - codex-skill
  - coder
---

# Parking Onboarding Skill

Created a new `parking-onboarding` Codex skill under `/home/borisindelman/git/ParkingSkills/skills/parking-onboarding`.

## Scope

- Clean-Mac bootstrap flow that avoids local Mac Git setup.
- Coder workspace bring-up with Parking defaults, including `/workspace/WayveCode` and `1024 GB` workspace disk guidance.
- GitHub auth inside Coder before cloning repositories.
- ParkingSkills clone/update under `~/git/ParkingSkills` and symlink into `~/.codex/skills/parking-onboarding`.
- General WayveCode onboarding phase for tools, repo layout, Bazel, CI, logging, docs, and existing helper skills.
- MLE and Parking-specific walkthrough phase for config, model architecture, data materialisation, Databricks, OTF loading, deployment wrapper, Eval Studio, Console, Foxglove, and VSO context.

## Files

- `/home/borisindelman/git/ParkingSkills/skills/parking-onboarding/SKILL.md`
- `/home/borisindelman/git/ParkingSkills/skills/parking-onboarding/agents/openai.yaml`
- `/home/borisindelman/git/ParkingSkills/skills/parking-onboarding/references/bootstrap-prompt.md`

## Validation

- Ran `skills/.system/skill-creator/scripts/quick_validate.py skills/parking-onboarding`.
- Result: `Skill is valid!`
- Skill body length: 381 lines.
