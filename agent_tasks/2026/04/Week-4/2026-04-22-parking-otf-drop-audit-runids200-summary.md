# Parking OTF Drop Audit: 200 Run IDs per Bucket

- Date: 2026-04-22
- Datamodule: `parking_bc_datamodule`
- Groups: `pudo`, `unpudo`, `unpark`
- Sampling mode: up to `200` random `run_id`s per bucket, then all samples from those selected runs
- Status: complete; all `24/24` bucket summaries written
- Raw artifacts:
  - `/home/borisindelman/tmp/parking_otf_drop_audit_runids200/parking_bc_datamodule_20260421_140751/summary.md`
  - `/home/borisindelman/tmp/parking_otf_drop_audit_runids200/parking_bc_datamodule_20260421_140751/drop_records.jsonl`

## Executive Summary

This run is large enough to treat as directionally reliable for the migrated parking buckets.

Top-level totals:
- Source samples seen: `239,642`
- Output samples yielded: `212,359`
- Dropped samples: `27,283`
- Overall drop rate: `11.38%`

The main conclusion is that drop volume is not small. Several parking and unparking buckets are losing a material fraction of samples, especially UK/USA driving-context PUDO and the unparking families.

## Main Findings

1. The biggest confirmed training/data-quality failures are still:
   - `filter_bad_paths_path_pose_mismatch`
   - `path_requested_distance_out_of_range`
   - `parking_strip_leading_standstill_failed`
2. Infrastructure/data availability also contributes substantially through:
   - `load_frame_data_exception`
3. There is still a significant attribution gap:
   - `unattributed_drop = 8,964` (`32.86%` of all drops)
4. The worst drop rates are concentrated in:
   - `dc_pudo_uk`
   - `dc_pudo_usa`
   - `dc_unparking_uk`
   - `ca_long_unparking_usa`
   - `pre_ca_unparking_usa`

## Failure-Type Distribution

Percentages are shown both as a share of all dropped samples and as a share of all source samples.

| Failure type | Count | % of all failures | % of all samples |
| --- | ---: | ---: | ---: |
| unattributed_drop | 8,964 | 32.86% | 3.74% |
| load_frame_data_exception | 6,073 | 22.26% | 2.53% |
| filter_bad_paths_path_pose_mismatch | 5,392 | 19.76% | 2.25% |
| path_requested_distance_out_of_range | 4,208 | 15.42% | 1.76% |
| parking_strip_leading_standstill_failed | 2,315 | 8.49% | 0.97% |
| missing_video | 290 | 1.06% | 0.12% |
| parking_strip_leading_standstill_all_speeds_near_zero | 21 | 0.08% | 0.01% |
| parking_scratch_table_failed | 16 | 0.06% | 0.01% |
| bad_timestamps | 4 | 0.01% | 0.00% |

## Highest-Drop Buckets

| Bucket | Seen | Yielded | Dropped | Drop Rate |
| --- | ---: | ---: | ---: | ---: |
| dc_unparking_uk | 2,653 | 2,103 | 550 | 20.73% |
| dc_pudo_uk | 44,288 | 35,776 | 8,512 | 19.22% |
| ca_long_unparking_usa | 25,543 | 21,240 | 4,303 | 16.85% |
| dc_pudo_usa | 44,568 | 37,738 | 6,830 | 15.32% |
| ca_short_unparking_usa | 10,930 | 9,451 | 1,479 | 13.53% |
| pre_ca_unparking_uk | 1,671 | 1,445 | 226 | 13.52% |
| ca_long_unparking_uk | 5,008 | 4,398 | 610 | 12.18% |
| ca_short_unparking_uk | 2,136 | 1,889 | 247 | 11.56% |
| dc_unparking_usa | 3,290 | 2,911 | 379 | 11.52% |
| pre_ca_unparking_usa | 8,683 | 7,775 | 908 | 10.46% |

## Lowest-Drop Buckets

| Bucket | Seen | Yielded | Dropped | Drop Rate |
| --- | ---: | ---: | ---: | ---: |
| ca_long_unpudo_usa | 21,078 | 21,015 | 63 | 0.30% |
| ca_short_unpudo_usa | 9,237 | 9,200 | 37 | 0.40% |
| pre_ca_unpudo_usa | 6,872 | 6,843 | 29 | 0.42% |
| ca_short_unpudo_uk | 2,188 | 2,159 | 29 | 1.33% |
| ca_long_unpudo_uk | 5,155 | 5,085 | 70 | 1.36% |
| ca_short_pudo_uk | 801 | 783 | 18 | 2.25% |
| pre_ca_unpudo_uk | 1,713 | 1,674 | 39 | 2.28% |
| pre_ca_pudo_uk | 627 | 611 | 16 | 2.55% |
| ca_short_pudo_usa | 1,274 | 1,222 | 52 | 4.08% |
| dc_unpudo_uk | 20,159 | 19,301 | 858 | 4.26% |

## Representative Bucket Breakdowns

### `dc_pudo_uk`
- Seen: `44,288`
- Dropped: `8,512` (`19.22%`)
- Main attributed reasons:
  - `load_frame_data_exception`: `2,690`
  - `parking_strip_leading_standstill_failed`: `648`
  - `path_requested_distance_out_of_range`: `552`
  - `filter_bad_paths_path_pose_mismatch`: `95`

### `dc_pudo_usa`
- Seen: `44,568`
- Dropped: `6,830` (`15.32%`)
- Main attributed reasons:
  - `parking_strip_leading_standstill_failed`: `1,429`
  - `load_frame_data_exception`: `1,357`
  - `path_requested_distance_out_of_range`: `668`
  - `filter_bad_paths_path_pose_mismatch`: `112`

### `dc_unparking_uk`
- Seen: `2,653`
- Dropped: `550` (`20.73%`)
- Main attributed reasons:
  - `load_frame_data_exception`: `266`
  - `path_requested_distance_out_of_range`: `217`
  - `filter_bad_paths_path_pose_mismatch`: `56`

### `dc_unparking_usa`
- Seen: `3,290`
- Dropped: `379` (`11.52%`)
- Main attributed reasons:
  - `filter_bad_paths_path_pose_mismatch`: `163`
  - `load_frame_data_exception`: `93`
  - `path_requested_distance_out_of_range`: `67`

### `pre_ca_unparking_usa`
- Seen: `8,683`
- Dropped: `908` (`10.46%`)
- Main attributed reasons:
  - `path_requested_distance_out_of_range`: `410`
  - `filter_bad_paths_path_pose_mismatch`: `297`
  - `load_frame_data_exception`: `93`

### `pre_ca_unparking_uk`
- Seen: `1,671`
- Dropped: `226` (`13.52%`)
- Main attributed reasons:
  - `path_requested_distance_out_of_range`: `101`
  - `filter_bad_paths_path_pose_mismatch`: `49`
  - `load_frame_data_exception`: `23`
  - `missing_video`: `19`

## Interpretation

The `200`-run-id sample strengthens the earlier conclusion:
- dropping is not a small edge effect
- the most important training-logic losses are still short-path failures and path-pose mismatch
- the worst losses are concentrated in PUDO and especially UNPARK buckets

The result also makes the remaining gaps clearer:
- broad bucket-level short-path enablement did not eliminate `path_requested_distance_out_of_range`
- `filter_bad_paths_path_pose_mismatch` remains material, especially in unparking buckets
- a large unattributed remainder still needs harness improvement if we want a complete causal accounting

## Recommended Next Steps

1. Use the bucket-level parking flag for `filter_bad_paths` skipping, not only `_parking_related_early`.
2. Fix the short-path clamp boundary/precision issue so endpoint-equal path requests do not still raise.
3. Improve the harness to explain the remaining `unattributed_drop` population before drawing more detailed per-stage conclusions.
