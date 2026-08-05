# P2P Event Backfill Canary

## Summary

Converted the `p2p_phase_2.0.ipynb` event-detection section into a standalone
Parking materialisation binary on branch `yoel/p2p_event_backfill`, then ran a
one-week high-verbosity canary for 2026-07-27 through 2026-08-02.

## Output

- Delta path: `abfss://datasets@wayveproddatasetflat.dfs.core.windows.net/sampling_materialised/parking_pudo/default/dev/p2p_event_backfill_canary_2026-07-27_2026-08-02`
- Delta version: 0
- Rows: 3,026
- Distinct runs: 3,026
- Date bounds: 2026-07-27 through 2026-08-02
- Invalid cluster counts: 0
- Invalid park-in ordering: 0
- Null country codes: 0

## Performance

- Event detection: 85.4s
- GPS anchors after warm-up: 59.6s
- Route metadata after optimization: 48.0s
- Geofencing: 5.4s
- Road class: 78.7s
- Gear after optimization: 39.1s
- Odometry: 18.0s
- Validation: 0.7s
- Delta write: 5.7s
- Cleanup: 4.3s
- Estimated clean optimized run: about 5m 46s, excluding connection/build startup

## Optimizations and findings

- Replaced broken Spark Connect execution with the Databricks SQL warehouse
  client, avoiding both the Spark server bottleneck and incompatible locked
  `pyspark` providers.
- Replaced frame-level run metadata ranking with an exact corpus lookup at the
  GPS origin timestamp. The original route query ran for over 207s without
  completing; the optimized stage completed in 48.0s.
- Added static week predicates to raw gear and corpus odometry scans. Gear
  improved from 145.5s to 39.1s; odometry completed in 18.0s.
- Used native Databricks geospatial SQL over canonical Wayve geofence polygons;
  the stage completed in 5.4s.
- SQL warehouse direct file tables lacked `SELECT ANY FILE`, so the final 3,026
  rows were fetched as Arrow and atomically written as Delta with `deltalake`
  using Azure CLI credentials.
- Intermediate tables were retained on failures and automatically removed only
  after the successful Delta commit and validation.

## Validation

- `bazel test //wayve/ai/parking/materialisation:py_checks` passed.
- The SQL candidate validation passed before writing.
- An independent `DeltaTable` read-back confirmed version, physical row count,
  distinct run count, and date bounds.
