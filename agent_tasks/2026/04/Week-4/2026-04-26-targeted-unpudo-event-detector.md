# Targeted UNPUDO Event Detector

## Summary

Created a standalone PySpark detector for model-scoped PUDO / UNPUDO / unparking events when `parking.pudo_unpudo_unpark_events` is stale or still materializing.

## Changes

- Added `/home/borisindelman/git/ParkingSkills/skills/unpudo-unpark-model-analysis/scripts/find_model_events.py`.
- Ported the relevant event-detection notebook flow from `origin/parking/notebooks:wayve/ai/parking/notebooks/PUDO and UnPUDO Event Detection.ipynb`.
- Added CLI filters for model nicknames, inclusive date cutoffs, optional run-id allowlist, selected event types, and optional Delta path/table output.
- Added an early target-model run filter before reading `prod_data_pipeline.wayve_corpus.all_data`.
- Updated the UNPUDO model-analysis skill to document this script as the fallback event source while the global table catches up.

## Verification

- Ran `python -m py_compile /home/borisindelman/git/ParkingSkills/skills/unpudo-unpark-model-analysis/scripts/find_model_events.py`.
- Checked the CLI help path after deferring Spark imports; `--help` now works locally without PySpark installed.
- Sanity-checked `sea-cucumber-spectacular-orange` for `2026-04-22`:
  - `parking.pudo_unpudo_unpark_events` has `5` UNPUDO rows from `1` run.
  - A SQL mirror of the detector found `7` candidate UNPUDO rows.
  - The `5` rows already in the materialized table match exactly on event timestamp and gear-change timestamp.
  - The `2` extra candidates are from `fme20014/2026-04-22--07-59-33--gen2-av-4ac575f2-1bd2-44c9-b8fe-87ef1f2d9f95`; one is inside the `london_office` geofence, and the other is not present in the stale materialized table.

## Notes

- The script needs to run in an environment with Spark, Shapely, and Wayve geofence utilities available.
- The local Databricks CLI is not configured, so the full PySpark script was not submitted as a Databricks job from this shell. SQL warehouse checks were run through `tools/databricks_queries`.
