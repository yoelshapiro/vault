# Gemini CLI Photo Classifier Skill (Fox Mitten)

## Summary
- Added a new local Codex skill at `~/.codex/skills/gemini-cli-photo-classifier/SKILL.md`.
- The skill provides a basic, repeatable Gemini CLI workflow for photo classification with strict JSON output.
- Included two ready-to-use classification prompt templates:
  - parking quality / stop classification
  - robotaxi pull-over behavior classification

## Why
- Fox Mitten needs a lightweight workflow to classify PUDO-related photos quickly.
- This skill gives a consistent prompt/output contract before building deeper project-specific automation.

## What Changed
- Created skill: `/home/borisindelman/.codex/skills/gemini-cli-photo-classifier/SKILL.md`
- Added:
  - environment checks (`gemini` availability + `GEMINI_API_KEY`)
  - headless command templates (`--include-directories`, `--all-files`, `--output-format json`)
  - JSON extraction/validation via `jq`
  - low-confidence/unclear handling guidance

## Notes
- In this workspace session, `gemini` binary was not present (`gemini missing`), so the skill includes an `npx` fallback command.
- The skill is intentionally basic and scoped for immediate use; next iteration can add Fox Mitten-specific schema fields and scoring rubrics.

