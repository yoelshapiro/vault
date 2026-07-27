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

Created a new `parking-onboarding` Codex skill under `${HOME}/git/ParkingSkills/skills/parking-onboarding`.

## Scope

- Clean-Mac bootstrap flow that avoids local Mac Git setup.
- Coder workspace bring-up with Parking defaults, including `/workspace/WayveCode` and `1024 GB` workspace disk guidance.
- GitHub auth inside Coder before cloning repositories.
- ParkingSkills clone/update under `~/git/ParkingSkills` and symlink into `~/.codex/skills/parking-onboarding`.
- General WayveCode onboarding phase for tools, repo layout, Bazel, CI, logging, docs, and existing helper skills.
- MLE and Parking-specific walkthrough phase for config, model architecture, data materialisation, Databricks, OTF loading, deployment wrapper, Eval Studio, Console, Foxglove, and VSO context.

## Files

- `${HOME}/git/ParkingSkills/skills/parking-onboarding/SKILL.md`
- `${HOME}/git/ParkingSkills/skills/parking-onboarding/agents/openai.yaml`
- `${HOME}/git/ParkingSkills/skills/parking-onboarding/references/bootstrap-prompt.md`

## Validation

- Ran `skills/.system/skill-creator/scripts/quick_validate.py skills/parking-onboarding`.
- Result: `Skill is valid!`
- Skill body length: 381 lines.

## Follow-up Update

- Removed all `llm_wiki` references from the skill. The skill now uses Notion as a map and live repo docs/code as the source of truth.
- Added the skill to a clean `main` worktree at `/tmp/ParkingSkills-main` because the original `${HOME}/git/ParkingSkills` checkout was on `agents_day` and checkout to `main` was blocked by unrelated dirty files.
- Revalidated the skill in the `main` worktree with `quick_validate.py`: `Skill is valid!`
