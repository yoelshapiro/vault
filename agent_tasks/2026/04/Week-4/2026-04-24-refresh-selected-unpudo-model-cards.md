# Refresh Selected UNPUDO Model Cards

Scope:
- rewrite current model cards and run/event cards for:
  - `sea-cucumber-spectacular-orange`
  - `mallard-plum-mysterious`
  - `pink-manta-ray-smooth`

Workflow:
- use `unpudo-unpark-model-analysis`
- export fresh packets under `/tmp/model_analysis_event_packets`
- regenerate vault outputs from packet JSON using the current scorer
- do not hand-edit run cards or model cards

Status:
- `sea-cucumber-spectacular-orange`
  - packet export complete
  - model card regenerated
  - run report regenerated
  - current regenerated counts: `5` recorded events, `2` pass, `3` fail
- `mallard-plum-mysterious`
  - packet export complete
  - model card regenerated
  - run reports regenerated
  - current regenerated counts: `12` recorded events, `3` pass, `9` fail, `3` skipped `non-av`
- `pink-manta-ray-smooth`
  - packet export in progress from `2026-04-15` through `2026-04-22`
  - using chunked source export with `--source-chunk-size-runs 10`
  - model/report regeneration pending export completion

Notes:
- this refresh is using the current route-change lookback scoring rules, so counts differ materially from earlier cards
- temporary packet/cache data should be cleaned from `/tmp` after the rewrite is complete
