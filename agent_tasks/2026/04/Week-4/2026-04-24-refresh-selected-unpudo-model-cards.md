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
  - packet export complete for `2026-04-15` through `2026-04-22`
  - chunked source export used `--source-chunk-size-runs 10`
  - model card regenerated
  - run reports regenerated
  - current regenerated counts: `450` recorded events, `443` scored, `96` pass, `347` fail, `7` accidental, `113` skipped `non-av`

Notes:
- this refresh is using the current route-change lookback scoring rules, so counts differ materially from earlier cards
- model-card `card` links were normalized to standard markdown relative links, so they resolve in both Obsidian and GitHub markdown rendering
- the selected model cards now have:
  - `sea-cucumber-spectacular-orange`: `5` GitHub-compatible `card` links
  - `mallard-plum-mysterious`: `12` GitHub-compatible `card` links
  - `pink-manta-ray-smooth`: `450` GitHub-compatible `card` links
- temporary packet/query cache data was removed from `/tmp` after the rewrite completed
- this refresh was vault-only; `parking.model_analysis` was not updated
