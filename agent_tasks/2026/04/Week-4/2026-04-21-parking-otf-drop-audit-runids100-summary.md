# Parking OTF Drop Audit: 100 Run IDs per Bucket (Partial)

- Date: 2026-04-21
- Datamodule: `parking_bc_datamodule`
- Groups requested: `pudo`, `unpudo`, `unpark`
- Sampling mode: up to `100` random `run_id`s per bucket, then all samples from those selected runs
- Status: partial result; run exited after writing `17/24` bucket summaries
- Raw artifacts: `/home/borisindelman/tmp/parking_otf_drop_audit_runids100/parking_bc_datamodule_20260421_072220`

## Executive Summary

The drops are not uniformly small. Some buckets are low single-digit drop rates, but several are materially high, especially `dc_unparking_*` and `dc_unpudo_usa`.

Highest completed-bucket drop rates:
- `dc_unparking_uk`: `223 / 1101` = `20.3%`
- `dc_unparking_usa`: `237 / 1387` = `17.1%`
- `ca_short_unparking_uk`: `247 / 2136` = `11.6%`
- `dc_unpudo_usa`: `845 / 7974` = `10.6%`

Low-drop completed buckets:
- `ca_long_unpudo_usa`: `14 / 11004` = `0.13%`
- `pre_ca_unpudo_usa`: `21 / 3875` = `0.54%`
- `ca_short_unpudo_usa`: `44 / 4324` = `1.02%`
- `ca_long_unpudo_uk`: `70 / 5155` = `1.36%`

## Main Signals

1. `filter_bad_paths_path_pose_mismatch` remains a real drop mode in completed non-driving buckets, especially unparking-related ones.
2. `path_requested_distance_out_of_range` still occurs even when short-path clamping is active. That points to a clamp boundary/precision issue, not just a missing flag.
3. `parking_strip_leading_standstill_failed` is visible in PUDO buckets and explains a non-trivial share of drops there.
4. Some completed sections still have unattributed drops (`Drop Reasons: None`), so the harness is not yet fully exhaustive in attribution.

## Completed Buckets

| Bucket | Seen | Yielded | Dropped | Drop Rate |
| --- | ---: | ---: | ---: | ---: |
| ca_long_pudo_uk | 1880 | 1777 | 103 | 5.48% |
| ca_long_pudo_usa | 2988 | 2737 | 251 | 8.40% |
| ca_long_unpudo_uk | 5155 | 5085 | 70 | 1.36% |
| ca_long_unpudo_usa | 11004 | 10990 | 14 | 0.13% |
| ca_short_pudo_uk | 801 | 785 | 16 | 2.00% |
| ca_short_pudo_usa | 1274 | 1221 | 53 | 4.16% |
| ca_short_unparking_uk | 2136 | 1889 | 247 | 11.56% |
| ca_short_unpudo_uk | 2188 | 2159 | 29 | 1.33% |
| ca_short_unpudo_usa | 4324 | 4280 | 44 | 1.02% |
| dc_unparking_uk | 1101 | 878 | 223 | 20.25% |
| dc_unparking_usa | 1387 | 1150 | 237 | 17.09% |
| dc_unpudo_uk | 7864 | 7477 | 387 | 4.92% |
| dc_unpudo_usa | 7974 | 7129 | 845 | 10.60% |
| pre_ca_pudo_uk | 627 | 611 | 16 | 2.55% |
| pre_ca_pudo_usa | 995 | 952 | 43 | 4.32% |
| pre_ca_unpudo_uk | 1713 | 1674 | 39 | 2.28% |
| pre_ca_unpudo_usa | 3875 | 3854 | 21 | 0.54% |

## Missing Buckets

The run exited before writing these bucket summaries:
- `dc_pudo_usa`
- `dc_pudo_uk`
- `ca_long_unparking_usa`
- `ca_short_unparking_usa`
- `pre_ca_unparking_usa`
- `ca_long_unparking_uk`
- `pre_ca_unparking_uk`

## Interpretation

The current result does not support the blanket statement that only a small percentage is dropping. That is true for some buckets, but false for the worst completed buckets, which are in the `10%` to `20%` range. The most concerning completed results are the `dc_unparking_*` buckets and `dc_unpudo_usa`.
