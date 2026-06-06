# 2026-06-06 PUDO Generic Zak Materialization

- Topic: Port the corpus-derivable parts of Zak Murez's PUDO/parking sampler into the parking materialization notebook.
- Labels: parking, pudo, zak, materialization, spark, buckets.
- Branch: `boris/pudo_generic_materialization`.
- PR: N/A.
- Change type: Notebook implementation.
- Areas:
  - `/workspace/materialization/wayve/ai/parking/notebooks/pudo_unpudo_materialization.ipynb`
  - `origin/zmurez/pudo:wayve/ai/experimental/dataset/single_run.py`
  - `origin/zmurez/pudo:wayve/ai/experimental/samplers/sampler.py`

## Changes

- Added a generic Zak-style bucket stage that runs directly over `wayve_corpus.all_data` for runs from the parking event table.
- Added per-run gear cleanup modeled on Zak's helper:
  - short reverse segments by distance,
  - short park segments by time,
  - stopped-before-park shift.
- Added Zak-style `cleanup_hazard` behavior before PUDO detection:
  - hazard approach segments above 5 mph become directional indicators,
  - hazard departure segments after movement become off,
  - office parking geofences are excluded from PUDO hazard evidence.
- Added country-split generic bucket outputs:
  - `zak_parking_*`
  - `zak_pudo_*`
  - `zak_unparking_*`
  - `zak_start_gear_change_*`
  - `zak_gear_change_*`
  - `zak_interventions_gear_change0_*`
  - `zak_interventions_gear_change1_*`
- Added the Zak near-gear-change CA filter:
  - AV-to-DC transition anchor,
  - gear change within +/-30s,
  - remove interventions stopped at the transition and still stopped 1s later,
  - pre window `-1.2s..0`,
  - post window `0..1s` constrained to DC frames.
- Defaulted final materialization to the new `zak_*` buckets only, with `INCLUDE_EXISTING_EVENT_DERIVED_BUCKETS` available for side-by-side comparison.
- Documented that Zak's `pred_pudo_pin_valid_*` near/far and `pred_park_type` splits are annotation-array buckets, not available from `wayve_corpus.all_data`, so this notebook materializes combined corpus-derived PUDO/parking buckets.

## Verification

- Parsed every notebook code cell with Python `ast.parse`.
- Ran `git diff --check`.
- Did not run the Databricks notebook locally; local Python lacks numpy/pandas/Spark and the actual execution needs Databricks.
