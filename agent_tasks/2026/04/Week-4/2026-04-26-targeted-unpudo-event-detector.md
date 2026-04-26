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

## Notes

- The script needs to run in an environment with Spark, Shapely, and Wayve geofence utilities available.
- Local verification covered Python syntax only; Databricks execution was not run in this turn.
