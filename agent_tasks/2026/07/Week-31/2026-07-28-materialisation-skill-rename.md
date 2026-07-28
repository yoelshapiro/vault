# Materialisation Skill Rename

## Summary

Renamed the ParkingSkills materialisation workflow skill from
`validate-materialisation-changes` to
`materialisation-dev-debug-and-monitoring` so its name reflects development,
debugging, validation, full-run execution, and ongoing monitoring.

## Approved full materialisation workflow

- Use `sample` as the default full-materialisation entrypoint after explicit
  user approval.
- Verify that the Flyte graph includes filtering and bucketing, balancing,
  comparison, and every applicable distribution step.
- When modular execution is required, run `filter_and_bucket_stage` to terminal
  success, pass its run root to `balance_stage`, and then run the remaining
  comparison and distribution steps.
- Never treat `filter_and_bucket_stage` alone as a completed full
  materialisation.
- Monitor all linked executions and required stages to terminal status.

## Validation

- The skill-creator `quick_validate.py` check passed.
- The bundled Git scope helper passed `bash -n` and remained executable.
- The renamed installed skill path resolves under
  `~/.codex/skills/ParkingSkills/`.
- No maintained ParkingSkills file still references the old skill name.
- `git diff --check` passed.
