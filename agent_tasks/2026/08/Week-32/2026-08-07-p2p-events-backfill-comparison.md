# P2P materialisation comparison — event backfill vs run 2

## Summary

The event-backfill materialisation produced **97,327,513 bucket sample rows**,
versus **26,980,118** in the previous odometry-corrected materialisation:
**+70,347,395 (+260.7%, 3.61×)**.

- Train increased from 22,316,564 to 82,664,870 (+270.4%).
- Validation increased from 4,663,554 to 14,662,643 (+214.4%).
- 34 of 35 output buckets increased.
- Six JPN buckets are present in the backfill output but absent from run 2.
- The only decrease was `p2p_bc_park_out_global`: -6,934 (-2.4%).

Both root summaries report the same corpus date range, base table, partition
source type, and driving binary version. The much larger output therefore is
not explained by a corpus-range or binary-version change visible in
`summary.yaml`; it is consistent with broader event coverage in the backfilled
events table.

## Runs

### Event backfill

- Execution:
  [`a7xdcgxgnl6bvw95gpn7`](https://flyte.data.wayve.ai/console/projects/ai-services-sampling/domains/production/executions/a7xdcgxgnl6bvw95gpn7)
  (`yoel-p2p-events-backfill-20260807-1048`) — **SUCCEEDED** (~72m)
- Root:
  `abfss://datasets@wayveproddatasetflat.dfs.core.windows.net/sampling_materialised/parking_pudo/p2p/dev/yoel-p2p-events-backfill-20260807-1048__2026-08-07-11-12/`
- Events input:
  `abfss://datasets@wayveproddatasetflat.dfs.core.windows.net/sampling_materialised/parking_pudo/default/dev/p2p_events_backfill/`

### Previous materialisation (run 2)

- Execution:
  [`atn5dj6fxxgzvqkw2bsr`](https://flyte.data.wayve.ai/console/projects/ai-services-sampling/domains/production/executions/atn5dj6fxxgzvqkw2bsr)
  (`yoel-p2p-odo-full-20260806-1455`) — **SUCCEEDED** (~2h 41m)
- Root:
  `abfss://datasets@wayveproddatasetflat.dfs.core.windows.net/sampling_materialised/parking_pudo/p2p/dev/yoel-p2p-odo-full-20260806-1455__2026-08-06-15-05/`
- Events input:
  `prod_user.p2p.events_w_odometry_corrections_22k`

## Methodology

All sample counts below come only from each run's:

- root `summary.yaml` (`splits.*.total_num_samples` and
  `splits.*.buckets`);
- `buckets/dataset_split=train/summary.yaml`;
- `buckets/dataset_split=validation/summary.yaml`.

For both runs and splits, root bucket counts exactly matched the corresponding
split summary's `bucket_stats`.

Execution IDs, durations, roots, and events inputs are execution provenance,
not fields in `summary.yaml`.

## Summary provenance

| Field | Run 2 | Event backfill |
|---|---|---|
| `start_date` | 2019-10-28 | 2019-10-28 |
| `end_date` | 2026-06-07 | 2026-06-07 |
| `base_table` | `wayve_corpus.all_data` | `wayve_corpus.all_data` |
| `partition_source_type` | `binary_success_index_table` | `binary_success_index_table` |
| `binary.dataset_name` | `driving` | `driving` |
| `binary.version_type` | `stable` | `stable` |
| `binary.version` | 3.0.68 | 3.0.68 |

## Split totals

| Split | Run 2 | Event backfill | Δ | Change |
|---|---:|---:|---:|---:|
| Train | 22,316,564 | 82,664,870 | +60,348,306 | +270.4% |
| Validation | 4,663,554 | 14,662,643 | +9,999,089 | +214.4% |
| **Total** | **26,980,118** | **97,327,513** | **+70,347,395** | **+260.7%** |

## Bucket totals

Train and validation are combined below. Rows are sorted by absolute increase.

| Bucket | Run 2 | Event backfill | Δ | Change |
|---|---:|---:|---:|---:|
| `p2p_bc_outdoor` | 3,078,046 | 14,928,885 | +11,850,839 | +385.0% |
| `p2p_bc_park_out` | 3,409,016 | 11,481,296 | +8,072,280 | +236.8% |
| `p2p_bc_park_in` | 2,891,049 | 9,580,170 | +6,689,121 | +231.4% |
| `p2p_bc_street` | 2,896,428 | 8,195,991 | +5,299,563 | +183.0% |
| `p2p_bc_outdoor_uk` | 1,040,640 | 5,723,272 | +4,682,632 | +450.0% |
| `p2p_bc_outdoor_usa` | 1,258,527 | 4,811,890 | +3,553,363 | +282.3% |
| `p2p_bc_outdoor_deu` | 778,879 | 3,928,727 | +3,149,848 | +404.4% |
| `p2p_bc_park_in_uk` | 1,406,378 | 4,451,612 | +3,045,234 | +216.5% |
| `p2p_bc_park_out_usa` | 1,103,229 | 4,068,298 | +2,965,069 | +268.8% |
| `p2p_bc_street_uk` | 1,776,850 | 4,609,530 | +2,832,680 | +159.4% |
| `p2p_bc_park_out_uk` | 1,311,765 | 4,078,198 | +2,766,433 | +210.9% |
| `p2p_bc_indoor` | 390,771 | 2,281,866 | +1,891,095 | +483.9% |
| `p2p_bc_park_in_deu` | 536,137 | 2,327,758 | +1,791,621 | +334.2% |
| `p2p_bc_park_out_deu` | 994,022 | 2,744,169 | +1,750,147 | +176.1% |
| `p2p_bc_indoor_uk` | 192,450 | 1,714,851 | +1,522,401 | +791.1% |
| `p2p_bc_park_in_usa` | 948,534 | 2,378,484 | +1,429,950 | +150.8% |
| `p2p_bc_outdoor_indicator_on_uk` | 238,684 | 1,300,864 | +1,062,180 | +445.0% |
| `p2p_bc_street_deu` | 283,088 | 1,227,613 | +944,525 | +333.7% |
| `p2p_bc_street_jpn` | 0 | 896,422 | +896,422 | New |
| `p2p_bc_outdoor_indicator_on_usa` | 241,059 | 976,159 | +735,100 | +304.9% |
| `p2p_bc_outdoor_indicator_on_deu` | 122,212 | 798,882 | +676,670 | +553.7% |
| `p2p_bc_street_usa` | 836,490 | 1,462,426 | +625,936 | +74.8% |
| `p2p_bc_park_out_jpn` | 0 | 590,631 | +590,631 | New |
| `p2p_bc_outdoor_jpn` | 0 | 464,996 | +464,996 | New |
| `p2p_bc_park_in_jpn` | 0 | 422,316 | +422,316 | New |
| `p2p_bc_indoor_deu` | 54,939 | 313,100 | +258,161 | +469.9% |
| `p2p_bc_outdoor_indicator_on_jpn` | 0 | 154,697 | +154,697 | New |
| `p2p_bc_indoor_jpn` | 0 | 61,597 | +61,597 | New |
| `p2p_bc_outdoor_global` | 296,857 | 358,007 | +61,150 | +20.6% |
| `p2p_bc_indoor_usa` | 143,382 | 192,318 | +48,936 | +34.1% |
| `p2p_bc_park_in_global` | 224,968 | 259,259 | +34,291 | +15.2% |
| `p2p_bc_outdoor_indicator_on_global` | 54,583 | 66,133 | +11,550 | +21.2% |
| `p2p_bc_indoor_global` | 49,322 | 57,471 | +8,149 | +16.5% |
| `p2p_bc_street_global` | 129,910 | 134,656 | +4,746 | +3.7% |
| `p2p_bc_park_out_global` | 291,903 | 284,969 | -6,934 | -2.4% |

## Interpretation

The increase is broad rather than isolated to one bucket family. Aggregate,
country-specific, street, indoor, park-in, park-out, and indicator-on outputs
all gain data. The six new JPN buckets account for 2,590,659 bucket sample rows,
but most of the total increase comes from buckets already present in run 2.

The split summaries also show much larger counts at the P2P-specific filter
checkpoints, while the general corpus filters remain on a similar scale. This
supports the interpretation that the changed event-table coverage, rather than
the unchanged corpus scope, drives the increase.

## Caveats

1. These are bucket sample rows, not distinct `run_id` counts. A source sample
   can contribute to multiple buckets, so totals must not be interpreted as
   unique corpus rows or runs.
2. `summary.yaml` does not record the events-table path or event-level timing
   values. It can establish output-count changes, but cannot by itself prove
   event-time accuracy or identify which event rows caused a difference.
3. The JPN change is a source-coverage change: run 2's pinned 22k events table
   intentionally excluded JPN, while the backfill output now produces all six
   configured JPN bucket families.
4. The small `p2p_bc_park_out_global` decrease is the only bucket regression in
   sample-row count and is not enough, from summaries alone, to distinguish
   expected event-boundary movement from missing coverage.

## `summary.yaml` paths read

All six paths were present:

1. `<event-backfill-root>/summary.yaml`
2. `<event-backfill-root>/buckets/dataset_split=train/summary.yaml`
3. `<event-backfill-root>/buckets/dataset_split=validation/summary.yaml`
4. `<run-2-root>/summary.yaml`
5. `<run-2-root>/buckets/dataset_split=train/summary.yaml`
6. `<run-2-root>/buckets/dataset_split=validation/summary.yaml`

See also:
[[2026-08-06-p2p-materialisation-comparison-run2|P2P materialisation comparison — run 2]].
