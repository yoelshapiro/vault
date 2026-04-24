# Move Model Analysis To parking_model_analysis

Scope:
- move all current durable model-analysis artifacts from `vault/model_analysis/` into the new git repo at `vault/parking_model_analysis/`

Moved content:
- `models/`
- `report_cards/`
- `staged_rows/`

README handling:
- replaced the placeholder `parking_model_analysis/README.md` with the existing model-analysis README content
- expanded the README slightly to document `staged_rows/`

Result:
- `vault/parking_model_analysis/` now contains the full model-analysis corpus
- the old `vault/model_analysis/` directory was removed completely

Notes:
- this was a storage move only
- relative links from `models/*.md` to `report_cards/...` remain valid after the move because the internal directory structure stayed the same
- tooling and skill defaults were not updated in this step
