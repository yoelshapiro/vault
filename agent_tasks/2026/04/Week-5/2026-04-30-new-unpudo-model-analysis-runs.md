# New UNPUDO Model Analysis Runs

## Summary

Analyzed newly detected UNPUDO / unparking events since 2026-04-27 for:

- `exotic-jellyfish-silver`
- `prismatic-teal-bird`
- `panther-white-intuitive`
- `tomato-toucan-gorgeous`

The workflow used detector-derived event JSON and 8-way single-run workers. Each worker processed one run ID, wrote `parking.model_analysis`, and cleaned its transient packet/cache/staged roots under `/tmp`.

## Results

| Model | Runs | Rows | Pass | Fail | Accidental | Scored success |
|---|---:|---:|---:|---:|---:|---:|
| `exotic-jellyfish-silver` | 2 | 19 | 16 | 3 | 0 | 84.2% |
| `panther-white-intuitive` | 4 | 32 | 29 | 2 | 1 | 93.5% |
| `prismatic-teal-bird` | 5 | 54 | 43 | 11 | 0 | 79.6% |
| `tomato-toucan-gorgeous` | 1 | 10 | 7 | 3 | 0 | 70.0% |

## Outputs

- Updated table: `parking.model_analysis`
- Rewrote model cards under `${HOME}/git/vault/parking_model_analysis/models`
- Rewrote 12 per-run report cards under `${HOME}/git/vault/parking_model_analysis/report_cards/2026/04/Week-5`
- Validated 115 model-card `card` links against GitHub-compatible report headings
- Validated model/run Foxglove links use event timestamp +/- 5 minutes

## Helper Changes

- Added JSON export support to `tools/databricks_queries/execute_query.py`
- Added `DATABRICKS_QUERIES_CACHE_DIR` override support in `tools/databricks_queries/lib/query.py`
- Added `tools/parking_model_analysis_writer` Bazel writer target used by incremental workers
