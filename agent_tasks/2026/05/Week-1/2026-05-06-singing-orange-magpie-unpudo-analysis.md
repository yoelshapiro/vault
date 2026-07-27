# Singing Orange Magpie UNPUDO Analysis

## Summary

Ran `$unpudo-unpark-model-analysis` for `singing-orange-magpie`.

The model had 9 active runs across 2026-05-04 and 2026-05-05. The materialized `parking.pudo_unpudo_unpark_events` table covered only 6 runs and disagreed with detector-derived counts, so the analysis used detector-derived events over all 9 runs.

## Execution

- Detector source: `${HOME}/git/ParkingSkills/skills/unpudo-unpark-model-analysis/scripts/build_detector_event_sql.py`
- Candidate detector rows: 68 events across 9 runs
- Workers: 4 incremental workers, one run at a time
- Durable outputs:
  - `parking.model_analysis`
  - `${HOME}/git/vault/parking_model_analysis/models/singing-orange-magpie.md`
  - 6 run report cards under `${HOME}/git/vault/parking_model_analysis/report_cards/2026/05/Week-2`

## Results

| Metric | Value |
|---|---:|
| Runs with scored output | 6 |
| Runs filtered as no scored model events | 3 |
| Persisted rows | 38 |
| Scored events | 32 |
| Pass | 24 |
| Fail | 8 |
| Accidental | 6 |
| Scored success rate | 75.0% |

Event split:

| Event type | Pass | Fail | Accidental |
|---|---:|---:|---:|
| `unpudo` | 22 | 7 | 4 |
| `unparking` | 2 | 1 | 2 |

## Validation

- Verified 38 model-card `card` links resolve to GitHub-compatible run-report headings.
- Verified all model/run Foxglove links use event timestamp ±5 minutes.
- Cleaned `/tmp` packet, incremental, staged-row, Databricks-cache, and log roots for this job after durable outputs landed.

## Code Support

The current checkout was missing helper support required by the skill, so this task restored:

- `tools/databricks_queries/execute_query.py` JSON export support via `--output-json`
- `tools/databricks_queries/lib/query.py` `DATABRICKS_QUERIES_CACHE_DIR` override
- `tools/parking_model_analysis_writer` Bazel writer source used by `process_model_runs_incrementally.py`
