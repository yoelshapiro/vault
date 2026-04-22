# Relaunch UNPUDO Model Analysis With Cached Event Packets

This ExecPlan is a living document. The sections `Progress`, `Surprises & Discoveries`, `Decision Log`, and `Outcomes & Retrospective` must be kept up to date as work proceeds.

This document is maintained in accordance with `/home/borisindelman/.codex/PLANS.md`.

## Purpose / Big Picture

The current UNPUDO model-analysis batch is too slow and stalls because each event card re-queries Databricks telemetry independently. After this work, I will be able to export one cached telemetry packet per model or run, store it locally, and relaunch a larger worker pool that generates event cards from those cached packets. The user-visible proof is steady growth of files under `~/git/vault/model_analysis/report_cards/` and `~/git/vault/model_analysis/models/` without long pauses caused by stuck Databricks joins.

## Progress

- [x] (2026-04-22 22:17Z) Closed the two stalled sub-agents and preserved their completed card rewrites.
- [x] (2026-04-22 22:18Z) Confirmed the batch is stalled operationally: only 4 run report files and 3 model cards exist, with no new files after 21:54 UTC.
- [x] (2026-04-22 22:19Z) Confirmed the event-card contract is now AV-only, with `pass` / `fail`, `Resolution`, and DBW/pedal/indicator timeline requirements.
- [ ] Add machine-readable JSON export support to `//tools/databricks_queries:execute_query`.
- [ ] Add a cache-first exporter for UNPUDO model packets under the `unpudo-unpark-model-analysis` skill.
- [ ] Materialize the first cached packets for the remaining release-page models.
- [ ] Relaunch a larger worker set on disjoint cached model scopes.
- [ ] Verify steady output by landing new run report files and updating the batch ledger.

## Surprises & Discoveries

- Observation: the biggest bottleneck is not only parallel-worker count; it is the event-by-event Databricks workflow itself.
  Evidence: the batch produced only 4 run report files and 3 model cards before stalling, despite active sub-agent assignments.

- Observation: the existing Databricks CLI is human-readable only, which makes cache-first automation awkward.
  Evidence: `tools/databricks_queries/execute_query.py` renders Rich tables and prints only a lightweight batch summary, not row data in machine-readable form.

- Observation: the required telemetry sources can all be expressed in one tall export query with a `source_table` discriminator.
  Evidence: live schema checks confirmed the key tables and nested fields for `robot_navigation_instructions`, `robot_control_controller_state`, `robot_vehicle_driver_vehicle_state`, `robot_inference_vehicle_driving_plan`, and `trajectory_controller_state`.

## Decision Log

- Decision: replace the per-event raw-query workflow with cached per-model event packets.
  Rationale: fetching once and analyzing many times is the only way to get predictable throughput and make parallel workers useful.
  Date/Author: 2026-04-22 / Codex

- Decision: improve the existing Databricks CLI instead of creating a second unrelated query runner.
  Rationale: `//tools/databricks_queries:execute_query` already has auth, validation, and caching; adding machine-readable output is lower-risk than building another access path.
  Date/Author: 2026-04-22 / Codex

- Decision: keep worker write scopes disjoint by model and feed them pre-fetched local packet files.
  Rationale: this reduces Databricks contention and makes it easy to attribute progress and failures model by model.
  Date/Author: 2026-04-22 / Codex

## Outcomes & Retrospective

Not complete yet. The current outcome is a clear diagnosis of why the first batch stalled and a concrete relaunch strategy centered on cached event packets and higher worker parallelism.

## Context and Orientation

The user wants a durable batch workflow that analyzes UNPUDO events for the active release-page models and writes report cards into `~/git/vault/model_analysis/`. The existing event-card rules live in `~/git/ParkingSkills/skills/unpudo-unpark-segment-investigation/SKILL.md`, and the multi-model wrapper lives in `~/git/ParkingSkills/skills/unpudo-unpark-model-analysis/SKILL.md`. The current batch status is tracked in `~/git/vault/agent_tasks/2026/04/Week-4/2026-04-22-unpudo-model-analysis-batch.md`.

The main code bottleneck is the Databricks query utility in `/workspace/WayveCode/tools/databricks_queries/`. Right now `execute_query.py` can run SQL but only prints Rich tables. That is fine for a human, but not for a batch pipeline that needs to store exact row payloads on disk and hand them to workers.

In this task, a “cached event packet” means a local JSON file containing all relevant event-window telemetry for one model or one run. It should include repeated event metadata, a sample timestamp, and source-specific fields, with one row per raw sample and a `source_table` column indicating which telemetry stream the row came from.

## Plan of Work

First, update `/workspace/WayveCode/tools/databricks_queries/execute_query.py` so a single query can write its result rows to JSON on disk. Keep the current Rich-table behavior for interactive use, but add an explicit output flag for automation. Update the corresponding tests in `/workspace/WayveCode/tools/databricks_queries/test/test_execute_query.py` and run the existing Bazel test target so the change is covered.

Next, add a script under `~/git/ParkingSkills/skills/unpudo-unpark-model-analysis/` that builds the tall telemetry export SQL for one or more model nicknames, invokes the Databricks CLI with machine-readable output, and stores the resulting packet under a deterministic local cache directory. The script should accept model names and date bounds, produce one output file per model, and be safe to rerun.

Then, relaunch workers with disjoint model ownership. Each worker should read a local packet file rather than hitting Databricks for every event. Their responsibilities are only to interpret cached rows, update the relevant run report files, and update the matching model card. That should give a steady cadence of new cards.

Finally, update the batch ledger in the vault with the new execution strategy, packet locations, worker assignments, and actual output rate so the user can track progress without asking repeatedly.

## Concrete Steps

Work from `/workspace/WayveCode` for repository code changes and from the home directory for vault or skill-side files.

1. Update the Databricks CLI.

       cd /workspace/WayveCode
       edit tools/databricks_queries/execute_query.py
       edit tools/databricks_queries/test/test_execute_query.py
       bazel test //tools/databricks_queries:py_test

   Expected result: Bazel tests pass, and `execute_query.py` accepts a machine-readable output flag without regressing the current interactive mode.

2. Add the model-packet exporter.

       edit ~/git/ParkingSkills/skills/unpudo-unpark-model-analysis/scripts/...

   Expected result: there is a script that can be run with a model nickname list and date range to create local JSON packet files.

3. Build the first cached packets.

       run the exporter for the remaining release-page models

   Expected result: local packet files appear under a stable cache directory, one per model.

4. Relaunch workers.

       spawn more workers than before, each owning a disjoint model subset and reading only its assigned packet files

   Expected result: new run report files start landing in the vault at a steady cadence.

5. Update the vault.

       edit ~/git/vault/agent_tasks/2026/04/Week-4/2026-04-22-unpudo-model-analysis-batch.md
       edit ~/git/vault/agents-change-log.md

   Expected result: the new relaunch strategy and progress are documented.

## Validation and Acceptance

This work is acceptable when all of the following are true:

1. `bazel test //tools/databricks_queries:py_test` passes after the CLI changes.
2. The exporter can create at least one local cached packet file for a selected model without manual post-processing.
3. New run report files appear under `~/git/vault/model_analysis/report_cards/` after the relaunch, not just rewrites of the existing 4 files.
4. At least one new model beyond the current `harlequin-excited-greyhound`, `pink-manta-ray-smooth`, and `blue-panther-solid` set gets a model card or new run report content.
5. The batch ledger reflects the packet-based workflow and current worker ownership.

## Idempotence and Recovery

The Databricks CLI change is additive and safe to rerun. The exporter should write deterministic packet file names so reruns replace or refresh the same cache artifact instead of creating duplicates. Worker ownership must stay disjoint by model to avoid conflicting edits. If a packet looks bad, delete or replace only that packet file and rerun the exporter for that model; do not wipe the whole cache.

## Artifacts and Notes

Current stalled-output snapshot:

    report_cards:
    - Week-2/fme20040--2026-04-14--11-58-50--gen2-av-90560185-3296-43ba-9ec3-6a1693f1514a.md
    - Week-4/fme20031--2026-04-21--20-55-03--gen2-av-6012f067-7eac-4c54-af80-fe1b295980aa.md
    - Week-4/fme20012--2026-04-21--20-09-51--gen2-av-e0b70f5f-cb4d-4f8b-b0d7-af97a8834fb9.md
    - Week-4/fme20009--2026-04-21--20-53-31--gen2-av-c485ff0d-599e-495f-bee7-17c4a854ab52.md

    model cards:
    - harlequin-excited-greyhound.md
    - pink-manta-ray-smooth.md
    - blue-panther-solid.md

## Interfaces and Dependencies

In `/workspace/WayveCode/tools/databricks_queries/execute_query.py`, extend `main()` and the helper functions so a caller can request machine-readable JSON output for single-query runs. Preserve the existing `execute_query(sql, force=False, params=None)` API from `tools.databricks_queries.lib.query`.

In `~/git/ParkingSkills/skills/unpudo-unpark-model-analysis/`, add a script that depends on:

- `//tools/databricks_queries:execute_query` for Databricks access
- the tall telemetry export SQL used for UNPUDO event windows
- the vault output contract already defined by the two UNPUDO skills

The exporter should produce JSON rows containing at least:

- `event_key`
- `run_id`
- `model_nickname`
- `event_type`
- `event_timestamp_unixus`
- `sample_timestamp_unixus`
- `source_table`

plus the source-specific telemetry columns selected by the export SQL.
