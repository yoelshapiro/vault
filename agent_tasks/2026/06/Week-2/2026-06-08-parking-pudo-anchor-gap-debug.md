# 2026-06-08 Parking PUDO Anchor Gap Debug

- Branch: `boris/pudo_generic_materialization`
- Area: `wayve/ai/services/sampling/datasets/parking_pudo`
- Materialization root: `abfss://datasets@wayveproddatasetflat.dfs.core.windows.net/sampling_materialised/parking_pudo/anchors/boris-pudo-generic-materialization/2026-06-07-1`

## Question

Investigate why `dc_pudo_uk` generic materialization anchors are much lower than the event notebook table:

- Event table query: `hive_metastore.parking.pudo_unpudo_unpark_events_gear_fix`, `event_type='pudo'`, `ISO_country_code='GBR'`, dedup by `timestamp_unixus`.
- Generic anchors: `dataset_bucket='dc_pudo_uk'`.

## Findings

- Event rows: `51,355`.
- Local generic anchor rows: `13,219`.
- Exact missing rows: `43,733`.
- Missing rows whose run has no `dc_pudo_uk` generic anchor: `30,827`.
- Missing rows whose run has another `dc_pudo_uk` anchor but not the exact timestamp: `12,906`.

Sampled no-anchor-run misses:

- Many are still filtered by active generic exclusions:
  - `exclude_low_steering_bias_confidence`: 11 of 15 sampled.
  - `select_allowed_run_tags`: 2 of 15 sampled due tags like `RUN_TAG_V2_CANARY_SOFTWARE` / `RUN_TAG_V2_SYSTEM_EVALUATION`.
  - One sample had short-distance metadata.
- Some quality-passing no-anchor samples are not classified as PUDO by generic logic:
  - `colorado/2025-12-09--13-37-22--gen2-av-0af30585-f8b7-424a-ae55-08f23740f085`, `1765288974483310`.
  - Generic finds a park segment near the event (`start_ts=1765288972383309`, about `-2.1s`) but `context_hazard=False`, so it becomes `dc_park`, not `dc_pudo`.
  - `fme20016/2025-12-11--09-26-11--gen2-av-f087277f-6008-4e5c-9f92-b0305cfa42d9`, `1765445371833305`.
  - Generic finds park segments, but all have `context_hazard=False`, so no `dc_pudo` anchor.

Sampled same-run-anchor misses:

- Most pass the obvious active data-quality filters.
- Several are near misses where the generic anchor is slightly earlier than the event-table timestamp:
  - `fme20012/2025-12-04--10-05-41...`: generic anchor `-0.300s`.
  - `fme20007/2025-12-07--15-11-02...`: generic anchor `-0.400s`.
  - `colorado/2026-01-11--08-02-37...`: generic anchor `-0.050s`, `-1.000s`, `-0.400s` for sampled rows.
  - `fme20014/2026-01-11--11-28-19...`: generic anchor `-0.100s`.

## Interpretation

The count gap is not one bug:

- Active generic filters still remove many event-table rows, especially `exclude_low_steering_bias_confidence` and strict allowed-run-tags.
- Exact timestamp comparison overstates the mismatch because many anchors are within roughly `0.05-2s`.
- Some true logic differences remain: event notebook PUDO rows can have hazards in the video, but generic PUDO classification only checks the cleaned/dilated hazard at `park_start - 1`. If hazard evidence is not present after cleanup/geofence handling at that context frame, the same stop becomes `dc_park`, not `dc_pudo`.

## Temporary Artifacts

- `/tmp/event_table_dc_pudo_uk_keys.csv`
- `/tmp/parking_pudo_anchor_dc_pudo_uk_parts/`
- `/tmp/missing_no_anchor_run_30.csv`
- `/tmp/missing_same_run_anchor_30.csv`
- `/tmp/missing_dc_pudo_uk_reasons.csv`
- `/tmp/debug_pudo_anchor_logic_only.py`
- `/tmp/nearest_dc_pudo_uk_anchors.py`
