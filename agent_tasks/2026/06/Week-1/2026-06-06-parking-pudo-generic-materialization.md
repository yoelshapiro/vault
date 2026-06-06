# 2026-06-06 Parking PUDO Generic Materialization

- Topic: Add Parking/PUDO/Unpark/UnPUDO buckets using the official generic materialisation framework.
- Labels: parking, pudo, unpudo, unpark, materialization, generic-materialisation, buckets.
- Branch: `boris/pudo_generic_materialization`.
- PR: N/A.
- Change type: Code implementation.
- Areas:
  - `/workspace/materialization/wayve/ai/services/sampling/datasets/parking_pudo`
  - `/workspace/materialization/wayve/ai/services/sampling/datasets/store.py`
  - `/workspace/materialization/wayve/ai/services/sampling/BUILD`
  - `/workspace/materialization/wayve/ai/services/sampling/test/datasets/parking_pudo`

## Changes

- Added a new `parking_pudo/default` dataset under `wayve/ai/services/sampling/datasets/parking_pudo`.
- Implemented per-run pandas filters that derive events directly from `wayve_corpus.all_data`, without relying on parking notebooks or the old event table.
- Added programmable gear smoothing for short gear segments, with the requested "replace with previous gear" behavior and corrected frame-covered duration accounting.
- Added Zak-style hazard cleanup before PUDO/UnPUDO splitting:
  - hazard approach above 5 mph becomes a side-dependent directional indicator,
  - hazard departure after movement becomes off,
  - office parking geofences are not considered PUDO hazard evidence.
- Added country-split and explicit office-geofence buckets named with the new terminology:
  - `park_*`
  - `pudo_*`
  - `unpark_*`
  - `unpudo_*`
  - `pre_unpark_*`
  - `pre_unpudo_*`
  - `gear_change_*`
  - `pudo_gear_change_*`
  - `pre_ca_*`
  - `pudo_pre_ca_*`
  - `ca_short_*`
  - `ca_long_*`
  - `pudo_ca_short_*`
  - `pudo_ca_long_*`
- Added office-geofence suffixes for `london_office`, `millbrook`, `mountain_view_office`, `sunnyvale_office`, `tokyo_trc_office`, and `yokohama_office`.
- Removed `exclude_geofenced` from the parking_pudo exclusion sets so explicit office buckets are not filtered empty upstream.
- Split `unpark` from `unpudo` using hazard evidence on the preceding parked segment and stopped departure tail up to the movement anchor.
- Implemented `pre_unpark` / `pre_unpudo` as the 0.9s pre-start window equivalent to Zak's `start_gear_change_*` bucket, but using the requested names.
- Implemented parking CA filters as general AV-to-DC interventions near a smoothed gear change, including short/long post-CA windows and the speed filter that removes interventions where the vehicle is stopped at handover and still stopped 1s later.
- Added PUDO-context variants for gear-change, pre-CA, short CA, and long CA using cleaned hazards dilated by 30s.
- Registered the dataset in the services/sampling store and BUILD target.

## Verification

- Verified there are no notebook edits in the branch.
- Verified the new dataset code has no leftover `zak`, `start_gear_change`, or old `unparking_*` bucket naming.
- Ran `git diff --check`.
- Ran `bazel test //wayve/ai/services/sampling:test_datasets`.
