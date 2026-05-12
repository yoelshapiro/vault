# Chocolate Narwhal Adaptable UNPUDO Analysis

## Summary

- Model: `chocolate-narwhal-adaptable`
- Date window: `2026-05-11` to `2026-05-11`
- Source run IDs: 5 model-episode runs from `av_model_episodes`
- Scored runs: 3 runs with unique UNPUDO events
- Persisted table: `parking.model_analysis`
- Model card: `/home/borisindelman/git/vault/parking_model_analysis/models/chocolate-narwhal-adaptable.md`

## Outputs

- Final table-backed rows: `10`
- Outcomes: `9` pass, `1` fail
- Event type: `unpudo` only
- Overall scored success rate: `90.0% (9/10)`
- Report cards:
  - `/home/borisindelman/git/vault/parking_model_analysis/report_cards/2026/05/Week-3/fme20034--2026-05-11--12-00-47--gen2-av-a01190c7-c0dd-4d8c-b48d-cc015fdf9947.md`
  - `/home/borisindelman/git/vault/parking_model_analysis/report_cards/2026/05/Week-3/fme20034--2026-05-11--12-59-22--gen2-av-74e43933-6e3b-42c8-b5ea-cc021431a02e.md`
  - `/home/borisindelman/git/vault/parking_model_analysis/report_cards/2026/05/Week-3/fme20036--2026-05-11--13-11-47--gen2-av-26a1b5c6-1554-4a48-8fe1-553b2bce33d4.md`

## Run Ledger

- `fme20034/2026-05-11--12-00-47--gen2-av-a01190c7-c0dd-4d8c-b48d-cc015fdf9947`: 4 scored events, 3 pass, 1 fail. Failure category: `uncategorised`; route change not found.
- `fme20034/2026-05-11--12-59-22--gen2-av-74e43933-6e3b-42c8-b5ea-cc021431a02e`: 4 scored events, 4 pass.
- `fme20036/2026-05-11--13-11-47--gen2-av-26a1b5c6-1554-4a48-8fe1-553b2bce33d4`: 2 scored events, 2 pass.
- `fme20034/2026-05-11--12-43-39--gen2-av-a239dbd1-e920-40fe-b00c-5f7f50204ae2`: no UNPUDO/unparking candidates in the model interval.
- `fme20034/2026-05-11--12-55-09--gen2-av-50440fbd-2f1e-421a-90b0-6787657da764`: no scored rows after event/model-episode filtering.

## Notes

- The materialized parking event table did not contain rows for `chocolate-narwhal-adaptable`, so candidate events were derived from `all_data` gear transitions joined to model episodes and disengagements.
- The first direct SQL candidate query produced duplicate event rows because multiple model-episode rows matched the same event. The final run used `/tmp/chocolate_narwhal_events_deduped.json`, deduped by `event_key`.
- The skill's Spark detector was wrapped in a Bazel target at `//tools/parking_model_analysis_writer:find_model_events`; it builds and starts with Azure CLI auth, but the full Spark detector remained too slow for this run, so the final analysis used the faster Bazel SQL export path plus the skill exporter/report/writer flow.

## Verification

- `bazel run //tools/parking_model_analysis_writer:run_writer -- --help`
- `bazel run //tools/parking_model_analysis_writer:find_model_events -- --help`
- `bazel run //tools/databricks_queries:execute_query -- --force --output-json /tmp/chocolate_model_analysis_rows_deduped.json < /tmp/chocolate_model_analysis_rows.sql`
- Verified no duplicate `(run_id, event_timestamp_unixus)` pairs in `/tmp/chocolate_model_analysis_rows_deduped.json`.
