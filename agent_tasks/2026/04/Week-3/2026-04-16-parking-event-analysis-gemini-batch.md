# Parking Event Analysis Gemini Batch

This ExecPlan is a living document. The sections `Progress`, `Surprises & Discoveries`, `Decision Log`, and `Outcomes & Retrospective` must be kept up to date as work proceeds.

This document must be maintained in accordance with `/home/borisindelman/.codex/PLANS.md`.

## Purpose / Big Picture

After this change, a user can point a script at Databricks table `parking.event_analysis`, fetch event rows, choose the Gemini parking prompt variant per event type, and materialize Gemini judgments for each row. The observable outcome is a runnable Bazel entrypoint that reads rows from Databricks, runs the existing run/timestamp media fetch plus Gemini classification, and writes structured per-row results.

## Progress

- [x] (2026-04-16 13:45Z) Read PLANS guidance and Databricks parking table skill.
- [in_progress] (2026-04-16 13:45Z) Inspect local parking analysis code and Databricks row shape to define the batch interface.
- [ ] Design the row-to-prompt mapping for `pudo/park` vs `unpudo/unpark` and decide output schema.
- [ ] Implement a batch script/library under `wayve/ai/parking/classifiers/`.
- [ ] Validate with focused tests and one real Databricks-backed sample run.

## Surprises & Discoveries

- Observation: none yet.
  Evidence: pending.

## Decision Log

- Decision: Use an ExecPlan because this is a significant new batch feature spanning Databricks access, prompt routing, and Gemini runtime behavior.
  Rationale: Root AGENTS and `PLANS.md` require an ExecPlan for complex features.
  Date/Author: 2026-04-16 / Codex

## Outcomes & Retrospective

Pending implementation.

## Context and Orientation

The existing runnable classifier lives in `wayve/ai/parking/classifiers/manual_gemini_from_run.py`. It already knows how to fetch media for one `(run_id, timestamp)` pair and how to run Gemini using different prompt variants. Databricks-backed parking analysis tables are documented in `/home/borisindelman/git/ParkingSkills/skills/databricks-parking-tables/SKILL.md`. We need to connect those two worlds by adding a batch tool that reads rows from `parking.event_analysis`, selects the correct Gemini prompt based on event semantics, and emits structured results.

## Plan of Work

First inspect the existing parking-event analysis code and the `parking.event_analysis` schema so the batch input is concrete rather than assumed. Then implement a small batch-oriented module that reuses the existing single-row classifier entrypoints instead of duplicating media fetch logic. The script should accept filters or limits, map event types to prompt variants, and write deterministic JSON/JSONL outputs. Tests should focus on prompt selection and row mapping. A live validation run should use a narrow Databricks sample.

## Concrete Steps

From `/workspace/WayveCode`, inspect code and schema, implement the batch script, run Bazel tests, then run a narrow sample command against Databricks-backed rows.

## Validation and Acceptance

Acceptance means a user can run one command that reads at least one row from `parking.event_analysis`, invokes Gemini classification with the correct prompt variant for that row, and writes a structured output file containing the event identity, the chosen prompt variant, and Gemini output. Unit tests must cover prompt routing.

## Idempotence and Recovery

The planned batch script should be read-only against Databricks by default and write outputs under a caller-provided local path. Re-running with the same filters should overwrite or append deterministically depending on an explicit flag.

## Artifacts and Notes

Pending.

## Interfaces and Dependencies

The batch tool should reuse `wayve.ai.parking.classifiers.manual_gemini_from_run` internals where practical, not shell out to another process per row. Databricks row loading can use existing repo utilities or a local query helper, but the output contract must stay local and JSON-based.
