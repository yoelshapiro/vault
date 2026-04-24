# Remove staged_rows And Move Write Payloads To /tmp

Scope:
- delete `parking_model_analysis/staged_rows/`
- update the UNPUDO model-analysis skill and supporting scripts so staged Databricks write payloads live under `/tmp`, not in the vault repo
- update the durable vault root from `model_analysis` to `parking_model_analysis`

Changes:
- removed `parking_model_analysis/staged_rows/`
- updated the skill to document:
  - durable outputs under `parking_model_analysis/`
  - packet caches under `/tmp`
  - staged table-write payloads under `/tmp/parking_model_analysis_staged_rows/`
  - single-run workers should delete staged payloads after a successful write
- updated scripts and tooling defaults:
  - `generate_model_reports.py`
  - `repair_model_card_links.py`
  - `process_model_runs_incrementally.py`
  - `tools/parking_model_analysis_writer/main.py`
  - `agents/openai.yaml`

Verification:
- `parking_model_analysis/staged_rows/` no longer exists
- old vault path `vault/model_analysis/` no longer exists
- modified Python files pass `py_compile`

Notes:
- this change affects future runs and reruns
- existing durable model cards and run reports remain in `parking_model_analysis/`
