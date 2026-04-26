# parking.model_analysis Table Sync And New Run Check

Scope:
- make `parking.model_analysis` reflect the kept vault model set
- check whether selected models have new run IDs since `2026-04-23`

Kept vault models:
- `eel-teal-outspoken`
- `insightful-magenta-porcupine`
- `mallard-plum-mysterious`
- `pink-manta-ray-smooth`
- `sea-cucumber-spectacular-orange`

Work completed:
- updated `tools/parking_model_analysis_writer/main.py` so it can rebuild rows from the durable vault cards when packet manifests are absent
- added writer support for `--delete-other-models` so a kept model set can replace stale table contents safely in one Databricks write path
- refreshed `insightful-magenta-porcupine` from source on `2026-04-22` because its old model card linked to a non-matching run report
- rewrote `parking.model_analysis` for the kept model set and removed non-kept models from the table

Current table verification:
- `eel-teal-outspoken`: `710` rows, `150` runs
- `insightful-magenta-porcupine`: `5` rows, `1` run
- `mallard-plum-mysterious`: `12` rows, `2` runs
- `pink-manta-ray-smooth`: `450` rows, `114` runs
- `sea-cucumber-spectacular-orange`: `5` rows, `1` run

Date check:
- checked for new run IDs on the requested model list since `2026-04-24 00:00 UTC`
- reran with inclusive cutoff `2026-04-23 00:00 UTC` to match the wording `since 23 April 2026`
- result to be filled from final query output

Cleanup:
- removed temporary staged JSON payloads from `/tmp`
- removed the temporary `insightful-magenta-porcupine` packet cache after the table sync
