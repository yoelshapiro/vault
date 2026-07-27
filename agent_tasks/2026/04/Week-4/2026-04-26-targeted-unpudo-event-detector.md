# Targeted UNPUDO Event Detector

## Summary

Created a standalone PySpark detector for model-scoped PUDO / UNPUDO / unparking events when `parking.pudo_unpudo_unpark_events` is stale or still materializing.

## Changes

- Added `${HOME}/git/ParkingSkills/skills/unpudo-unpark-model-analysis/scripts/find_model_events.py`.
- Ported the relevant event-detection notebook flow from `origin/parking/notebooks:wayve/ai/parking/notebooks/PUDO and UnPUDO Event Detection.ipynb`.
- Added CLI filters for model nicknames, inclusive date cutoffs, optional run-id allowlist, selected event types, and optional Delta path/table output.
- Added an early target-model run filter before reading `prod_data_pipeline.wayve_corpus.all_data`.
- Updated the UNPUDO model-analysis skill to document this script as the fallback event source while the global table catches up.

## Verification

- Ran `python -m py_compile ${HOME}/git/ParkingSkills/skills/unpudo-unpark-model-analysis/scripts/find_model_events.py`.
- Checked the CLI help path after deferring Spark imports; `--help` now works locally without PySpark installed.
- Sanity-checked `sea-cucumber-spectacular-orange` for `2026-04-22`:
  - `parking.pudo_unpudo_unpark_events` has `5` UNPUDO rows from `1` run.
  - A SQL mirror of the detector found `7` candidate UNPUDO rows.
  - The `5` rows already in the materialized table match exactly on event timestamp and gear-change timestamp.
  - The `2` extra candidates are from `fme20014/2026-04-22--07-59-33--gen2-av-4ac575f2-1bd2-44c9-b8fe-87ef1f2d9f95`; one is inside the `london_office` geofence, and the other is not present in the stale materialized table.

## Notes

- The script needs to run in an environment with Spark, Shapely, and Wayve geofence utilities available.
- The local Databricks CLI is not configured, so the full PySpark script was not submitted as a Databricks job from this shell. SQL warehouse checks were run through `tools/databricks_queries`.

## 2026-04-23/24 Sea-Cucumber Analysis

- Queried the model-catalogue 12-run window for `sea-cucumber-spectacular-orange`.
- Detector mirror found `56` raw candidates across `9` runs; `3` selected runs had no UNPUDO/unparking candidates.
- Ran four incremental workers against an enriched detector `events.json`, one run per export unit.
- Refreshed the model card after worker completion:
  - raw events: `56`
  - skipped non-AV events: `8`
  - scored events: `48`
  - scored run files: `8`
- Verified `parking.model_analysis` for `2026-04-23` through `2026-04-24`:
  - `unpudo pass`: `27`
  - `unpudo fail`: `19`
  - `unparking pass`: `2`
- One detector run, `fme10003/2026-04-23--01-38-56--gen2-av-5c3b5ba9-4e2b-48a0-844f-749dc76d4a6a`, produced no scored rows after model-analysis filters.

## 2026-04-23/24 Multi-Model Backfill

- Built a targeted detector inventory for model-catalogue runs since `2026-04-23`.
- Detector output had `400` candidate events across `81` event-bearing runs:
  - `blue-panther-solid`: `103` candidates across `27` runs
  - `pink-manta-ray-smooth`: `165` candidates across `34` runs
  - `mallard-plum-mysterious`: `101` candidates across `15` runs
  - `insightful-magenta-porcupine`: `31` candidates across `5` runs
- Ran four incremental workers per model, with each worker processing one run id at a time and writing run cards plus `parking.model_analysis` rows after each completed run.
- Recent rows now present in `parking.model_analysis`:
  - `blue-panther-solid`: `85` scored rows across `20` runs (`10` pass / `75` fail)
  - `pink-manta-ray-smooth`: `122` rows across `29` runs (`29` pass / `92` fail / `1` accidental)
  - `mallard-plum-mysterious`: `83` scored rows across `15` runs (`33` pass / `50` fail)
  - `insightful-magenta-porcupine`: `29` scored rows across `4` runs (`1` pass / `28` fail)
- Regenerated model cards from durable `parking.model_analysis` rows rather than packet manifests:
  - `${HOME}/git/vault/parking_model_analysis/models/blue-panther-solid.md`
  - `${HOME}/git/vault/parking_model_analysis/models/pink-manta-ray-smooth.md`
  - `${HOME}/git/vault/parking_model_analysis/models/mallard-plum-mysterious.md`
  - `${HOME}/git/vault/parking_model_analysis/models/insightful-magenta-porcupine.md`
- Added `scripts/generate_model_cards_from_table_rows.py` to make the final card refresh independent of temporary packet cache.
- Updated the skill instructions to document the stable four-worker, single-run-id workflow and the final table-backed model-card refresh.
- Cleaned completed per-model packet, incremental, and staged-row temp directories for this batch.

## Sea Dashboard Discrepancy

- Quantified why the dashboard query reports `81.61%` UNPUDO success for `sea-cucumber-spectacular-orange` while the model-analysis rows for the new `2026-04-23/24` cohort report `58.70%`.
- Dashboard logic only treats disengagement flags as UNPUDO failures: `87` eligible events, `16` flagged failures.
- Model-analysis logic also fails AV-owned attempts for behavior evidence without a source disengagement flag, including ownership ending, driver/outside-AV completion, gear/motion evidence, and route/AV timing failures.
- Added a `Dashboard-Success / Card-Fail Disagreements` section to `${HOME}/git/vault/parking_model_analysis/models/sea-cucumber-spectacular-orange.md` with links to the card-fail events that dashboard logic would count as success.

## Sea Scoring Review Corrections

- Reviewed `sea-cucumber-spectacular-orange` false failures with Boris.
- `av_mode_at_event` in the notebook is only the closest `all_data.ground_truth__state__vehicle__automation_active` sample within `±2s` of the detector timestamp, not a full segment label.
- Dashboard eligibility excludes `av_mode_at_event = 0` events unless they have relevant disengagement flags; some model-analysis failures were over-scored relative to that rule.
- Learned corrections to apply before rerun:
  - score UNPUDO success by distance travelled from the stopped/PUDO position under AV ownership
  - once AV passes the successful-UNPUDO distance, later disengagements are downstream issues and should not fail UNPUDO
  - process all UNPUDO/unparking rows in a run together to suppress later DC-only duplicate detections after a prior successful AV UNPUDO
  - exclude detector artifacts where there is no real route change and the route immediately before driving / the detected event is very short (`<50m`)
- Updated both `$unpudo-unpark-model-analysis` and `$unpudo-unpark-segment-investigation` skill docs with the new rules.
- Updated `generate_model_reports.py` so full model-card rewrites use the corrected scoring:
  - detector-anchor-under-DBW and integrated-speed fallback now count UNPUDO completion before downstream disengagements
  - no-route-change plus `<50m` route-distance cases are excluded as invalid UNPUDO candidates
  - later non-AV / DC-only UNPUDO duplicates within `120s` of a prior successful run-level UNPUDO are suppressed
  - event cards now report route distance, short-route exclusion, estimated AV distance, and UNPUDO completion evidence
- Updated `process_model_runs_incrementally.py` so one-run-at-a-time worker processing uses the same duplicate-suppression logic.
- Verified the updated scripts with `python -m py_compile`.
