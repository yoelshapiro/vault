# Parking Event Analysis Gemini Batch

This ExecPlan is a living document. The sections `Progress`, `Surprises & Discoveries`, `Decision Log`, and `Outcomes & Retrospective` must be kept up to date as work proceeds.

This document must be maintained in accordance with `/home/borisindelman/.codex/PLANS.md`.

## Purpose / Big Picture

After this change, a user can point a script at Databricks table `parking.event_analysis`, fetch event rows, choose the Gemini parking prompt variant per event type, and materialize Gemini judgments for each row. The observable outcome is a runnable Bazel entrypoint that reads rows from Databricks, runs the existing run/timestamp media fetch plus Gemini classification, and writes structured per-row results.

## Progress

- [x] (2026-04-16 13:45Z) Read PLANS guidance and Databricks parking table skill.
- [x] (2026-04-16 13:45Z) Inspect local parking analysis code and Databricks row shape to define the batch interface.
- [x] (2026-04-16 14:29Z) Define prompt routing: `unpudo -> unparking`, `pudo -> parking_feasibility`.
- [ ] Implement a Databricks-reading batch script under `wayve/ai/parking/classifiers/`.
- [x] (2026-04-16 14:29Z) Validate the existing runner on a 20-row manually supplied batch using one shared output folder.

## Surprises & Discoveries

- Observation: Strict `back-surround` media fetch succeeded for 19/20 requested rows; one row had no temporal clip media for that camera at the requested timestamp.
  Evidence: `/tmp/parking_gemini_batch_20260416T140000Z/summary.tsv`, row 6.
- Observation: Large `back-surround` clips can materially dominate latency even after media fetch succeeds; row 19 wrote a 209 MB clip before waiting on Gemini.
  Evidence: `/tmp/parking_gemini_batch_20260416T140000Z/19_unpudo_1775349354733310/`.

## Decision Log

- Decision: Use an ExecPlan because this is a significant new batch feature spanning Databricks access, prompt routing, and Gemini runtime behavior.
  Rationale: Root AGENTS and `PLANS.md` require an ExecPlan for complex features.
  Date/Author: 2026-04-16 / Codex
- Decision: For the user-supplied batch, reuse the existing single-run classifier rather than introducing a new batch codepath before the prompt semantics were validated.
  Rationale: This isolates evaluation of prompt routing from implementation risk in a new Databricks integration path.
  Date/Author: 2026-04-16 / Codex

## Outcomes & Retrospective

Executed a 20-row batch using the existing standalone runner with strict `back-surround` camera selection and a single shared output folder:
- Batch folder: `/tmp/parking_gemini_batch_20260416T140000Z`
- Summary TSV: `/tmp/parking_gemini_batch_20260416T140000Z/summary.tsv`
- Successes: 19
- Failures: 1 (`fme20012/...38b8d662...` at `1772987900133306`, no temporal clip media on strict `back-surround`)
- `unpudo` rows: all 10 successful rows classified as `parking`
- `pudo` rows: 1 as `parking+feasible`, 8 as `driving_other` with 5 `feasible` and 4 `not_feasible`

This validated that the prompt routing works operationally on a multi-row batch and that the `parking_feasibility` prompt can distinguish "currently driving" from whether the location would be acceptable for parking.

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

- Batch output folder: `/tmp/parking_gemini_batch_20260416T140000Z`
- Batch summary: `/tmp/parking_gemini_batch_20260416T140000Z/summary.tsv`

## Interfaces and Dependencies

The batch tool should reuse `wayve.ai.parking.classifiers.manual_gemini_from_run` internals where practical, not shell out to another process per row. Databricks row loading can use existing repo utilities or a local query helper, but the output contract must stay local and JSON-based.
