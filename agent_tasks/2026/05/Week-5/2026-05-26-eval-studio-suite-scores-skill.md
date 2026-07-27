# Eval Studio Suite Scores Skill

- Date: 2026-05-26
- Labels: eval-studio, codex-skill, model-scorecard, parking
- Branch: `agents_day`
- PR: N/A
- Change type: Skill / helper script
- Areas: `${HOME}/git/ParkingSkills/skills/eval-studio-suite-scores`

## Summary

Created a compact ParkingSkills skill for fetching Eval Studio suite scores from a model nickname/session/artefact and suite version IDs.

## Changes

- Added `SKILL.md` with the artefact -> execution -> score workflow.
- Added `scripts/get_scores.sh` to resolve model artefact IDs, find suite executions, and batch score queries through `avTestSuiteExecutionResults`.
- Added `agents/openai.yaml` metadata.

## Validation

- Ran `quick_validate.py`: skill valid.
- Ran the helper for `armadillo-adaptable-maroon` against Pudo-Unpudo and Alpha3 version IDs; output matched the Scorecard-style batched query.

## Follow-up: Less Wrong Category Score

- Investigated why the Alpha3 suite page showed `Less Wrong 64.8%` while the initial helper reported `0.8233`.
- Found the website category card queries `avTestSuiteExecutionResults` with `includedTestUuids` for Less Wrong/other tests; the broad Scorecard-style query includes feasibility too.
- Updated `get_scores.sh` to emit `less_wrong_score` and `feasibility_score` alongside `scorecard_score`.
