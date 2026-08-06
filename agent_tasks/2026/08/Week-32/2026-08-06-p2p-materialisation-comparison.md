# P2P materialisation comparison — distinct run counts

Counts are **distinct `run_id` only**, computed from parquet dataset paths (not sample rows, not per-bucket sums). Country/environment tables **exclude `park_in` / `park_out` buckets** and **union runs across all buckets** in each group (a run counted once even if it appears in multiple buckets).

## Overview

| Label | Dataset | Output path | Materialisation time (UTC) | Train runs | Validation runs | Total distinct runs | Intersection with other |
|---|---|---|---|---:|---:|---:|---:|
| **New** | `parking_pudo/p2p` | `…/parking_pudo/p2p/dev/yoel-p2p-odo-full-20260805-2235__2026-08-05-23-54` | Flyte start **2026-08-05 22:36:50**; output suffix **2026-08-05-23-54**; `created_at` **2026-08-06 00:38:00** | 11,454 | 2,157 | **13,611** | **6,974** |
| **Old (reference)** | `bc/p2p` (same `bc_p2p` bucket defs) | `…/bc/p2p/dev/p2p__2026-06-18-14-55/dataset` | Path suffix **2026-06-18-14-55**; `created_at` **2026-06-18 15:21:17** | 9,782 | 1,957 | **11,739** | **6,974** |

### Full paths

- **New:** `abfss://datasets@wayveproddatasetflat.dfs.core.windows.net/sampling_materialised/parking_pudo/p2p/dev/yoel-p2p-odo-full-20260805-2235__2026-08-05-23-54`
- **Old:** `abfss://datasets@wayveproddatasetflat.dfs.core.windows.net/sampling_materialised/bc/p2p/dev/p2p__2026-06-18-14-55/dataset`

## By split (all buckets)

| Split | New runs | Old runs | Δ (new − old) |
|---|---:|---:|---:|
| Train | 11,454 | 9,782 | +1,672 |
| Validation | 2,157 | 1,957 | +200 |
| **Total** | **13,611** | **11,739** | **+1,872** |

## By split — outdoor / indoor / street only

*(Excludes `park_in` / `park_out`; unions runs across all buckets in each split.)*

| Split | New runs | Old runs | Δ (new − old) |
|---|---:|---:|---:|
| Train | 10,019 | 4,867 | +5,152 |
| Validation | 1,939 | 679 | +1,260 |
| **Total** | **11,958** | **5,546** | **+6,412** |

**Intersection (outdoor/indoor/street only):** 3,670 runs

## By country — outdoor / indoor / street only

Bucket mapping: `_uk`→GBR, `_usa`→USA, `_deu`→DEU, `_jpn`→JPN, `_global`→GLOBAL; aggregate buckets (`p2p_bc_outdoor`, `p2p_bc_indoor`, `p2p_bc_street`) → **AGGREGATE**. `outdoor_indicator_on_*` counted as **outdoor**.

| Country | New train | New val | New total | Old train | Old val | Old total | Intersection |
|---|---:|---:|---:|---:|---:|---:|---:|
| GBR | 3,329 | 1,311 | **4,640** | 1,169 | 333 | **1,502** | 1,000 |
| USA | 3,741 | 327 | **4,068** | 1,619 | 124 | **1,743** | 1,178 |
| DEU | 2,204 | 234 | **2,438** | 1,285 | 152 | **1,437** | 1,001 |
| GLOBAL | 745 | 67 | **812** | 580 | 44 | **624** | 491 |
| AGGREGATE | 4,588 | 1,227 | **5,815** | 0 | 0 | **0** | 0 |
| JPN | 0 | 0 | **0** | 214 | 26 | **240** | 0 |

## By environment — outdoor / indoor / street only

| Environment | New train | New val | New total | Old train | Old val | Old total | Intersection |
|---|---:|---:|---:|---:|---:|---:|---:|
| Outdoor *(incl. indicator_on)* | 5,150 | 682 | **5,832** | 4,325 | 568 | **4,893** | 3,160 |
| Indoor | 523 | 100 | **623** | 542 | 111 | **653** | 354 |
| Street | 4,346 | 1,157 | **5,503** | 0 | 0 | **0** | 0 |

---

## Per-bucket comparison

> **Data source:** exclusively `summary.yaml` files from the materialisation run roots (no Databricks, no parquet reads, no dataset scanning). Metrics are **sample-row counts** (`num_samples`) as recorded in YAML — **not** distinct `run_id` counts. Do not sum sample rows across buckets for run totals (runs can appear in multiple buckets).

### `summary.yaml` layout discovered

| Path pattern | Old run | New run | Used for comparison |
|---|---|---|---|
| `{root}/summary.yaml` | ✅ provenance only (no `splits`) | ✅ provenance + `splits.{train,validation}.buckets` | New: per-bucket counts |
| `{root}/buckets/dataset_split={split}/summary.yaml` | ❌ not found | ✅ `bucket_stats` list | Cross-check only (matches new root `splits`) |
| `{root}/dataset/dataset_split={split}/summary.yaml` | ✅ `bucket_stats` list | ❌ not found | Old: per-bucket counts |

**New run has no `dataset/` split summaries** (balance stage wrote measured counts to root `summary.yaml` only). **Old run has no `buckets/` split summaries** (Ray-stage artifacts not retained or not written for that run).

### Split totals (sample rows from `summary.yaml`)

| Split | Old samples | New samples | Δ (new − old) |
|---|---:|---:|---:|
| Train | 8,575,246 | 22,536,330 | +13,961,084 |
| Validation | 1,598,373 | 4,864,850 | +3,266,477 |
| **Total** | **10,173,619** | **27,401,180** | **+17,227,561** |

### Comparable buckets (present in both runs)

| Bucket                             | Old train | Old val | Old total | New train | New val | New total |  Δ total |
| ---------------------------------- | --------: | ------: | --------: | --------: | ------: | --------: | -------: |
| p2p_bc_indoor_deu                  |    40,123 |   8,948 |    49,071 |    49,363 |   5,576 |    54,939 |   +5,868 |
| p2p_bc_indoor_global               |    50,421 |   2,673 |    53,094 |    44,984 |   4,338 |    49,322 |   −3,772 |
| p2p_bc_indoor_uk                   |   161,356 |  72,679 |   234,035 |   129,200 |  63,250 |   192,450 |  −41,585 |
| p2p_bc_indoor_usa                  |   105,087 |  15,501 |   120,588 |   128,573 |  14,809 |   143,382 |  +22,794 |
| p2p_bc_outdoor_deu                 |   429,848 |  50,322 |   480,170 |   699,406 |  79,473 |   778,879 | +298,709 |
| p2p_bc_outdoor_global              |   327,490 |  21,169 |   348,659 |   274,111 |  22,746 |   296,857 |  −51,802 |
| p2p_bc_outdoor_indicator_on_deu    |    59,272 |   5,619 |    64,891 |   110,670 |  11,542 |   122,212 |  +57,321 |
| p2p_bc_outdoor_indicator_on_global |    47,657 |   2,404 |    50,061 |    51,515 |   3,068 |    54,583 |   +4,522 |
| p2p_bc_outdoor_indicator_on_uk     |   136,635 |  27,211 |   163,846 |   203,257 |  35,427 |   238,684 |  +74,838 |
| p2p_bc_outdoor_indicator_on_usa    |   144,798 |  13,102 |   157,900 |   217,654 |  23,405 |   241,059 |  +83,159 |
| p2p_bc_outdoor_uk                  |   561,625 | 142,168 |   703,793 |   836,013 | 204,627 | 1,040,640 | +336,847 |
| p2p_bc_outdoor_usa                 |   740,591 |  53,300 |   793,891 | 1,149,926 | 108,601 | 1,258,527 | +464,636 |
| p2p_bc_park_in_deu                 |   497,071 |  58,169 |   555,240 |   810,628 |  84,126 |   894,754 | +339,514 |
| p2p_bc_park_in_global              |   269,196 |  23,206 |   292,402 |   328,692 |  29,796 |   358,488 |  +66,086 |
| p2p_bc_park_in_uk                  |   989,445 | 432,432 | 1,421,877 | 1,500,280 | 638,521 | 2,138,801 | +716,924 |
| p2p_bc_park_in_usa                 |   786,304 |  58,271 |   844,575 | 1,411,427 | 128,861 | 1,540,288 | +695,713 |
| p2p_bc_park_out_deu                |   707,742 |  92,393 |   800,135 |   892,705 | 101,317 |   994,022 | +193,887 |
| p2p_bc_park_out_global             |   293,695 |  21,792 |   315,487 |   267,970 |  23,933 |   291,903 |  −23,584 |
| p2p_bc_park_out_uk                 |   812,232 | 359,259 | 1,171,491 |   959,902 | 351,863 | 1,311,765 | +140,274 |
| p2p_bc_park_out_usa                |   725,384 |  62,181 |   787,565 | 1,017,056 |  86,173 | 1,103,229 | +315,664 |

### Old-only buckets (JPN — absent from new `summary.yaml`)

| Bucket                          |   Old train |    Old val |   Old total |
| ------------------------------- | ----------: | ---------: | ----------: |
| p2p_bc_indoor_jpn               |      27,661 |      6,096 |      33,757 |
| p2p_bc_outdoor_indicator_on_jpn |      24,388 |      3,281 |      27,669 |
| p2p_bc_outdoor_jpn              |     116,565 |     14,779 |     131,344 |
| p2p_bc_park_in_jpn              |     242,493 |     24,595 |     267,088 |
| p2p_bc_park_out_jpn             |     278,167 |     26,823 |     304,990 |
| **JPN subtotal**                | **689,274** | **75,574** | **764,848** |

### New-only buckets (street + aggregate partitions — absent from old `summary.yaml`)

| Bucket                        |      New train |       New val |      New total |
| ----------------------------- | -------------: | ------------: | -------------: |
| p2p_bc_indoor *(aggregate)*   |        307,136 |        83,635 |        390,771 |
| p2p_bc_park_in *(aggregate)*  |      3,722,335 |       851,508 |      4,573,843 |
| p2p_bc_park_out *(aggregate)* |      2,869,663 |       539,353 |      3,409,016 |
| p2p_bc_street *(aggregate)*   |      2,217,477 |       678,951 |      2,896,428 |
| p2p_bc_street_deu             |        257,898 |        25,190 |        283,088 |
| p2p_bc_street_global          |        118,910 |        11,000 |        129,910 |
| p2p_bc_street_uk              |      1,182,086 |       594,764 |      1,776,850 |
| p2p_bc_street_usa             |        777,493 |        58,997 |        836,490 |
| **New-only subtotal**         | **11,452,998** | **2,843,398** | **14,296,396** |

### Buckets with no entry in old `summary.yaml`

These bucket definitions exist in `dataset.py` but had **zero samples** (no row in `bucket_stats` / `splits`) in the old materialisation:

| Bucket                 | Notes                                                            |
| ---------------------- | ---------------------------------------------------------------- |
| `p2p_bc_outdoor`       | Aggregate outdoor — logically empty (sequential country filters) |
| `p2p_bc_indoor`        | Aggregate indoor — not materialised in old run                   |
| `p2p_bc_street`        | Street environment — **new run only**                            |
| `p2p_bc_street_uk`     | Street environment — **new run only**                            |
| `p2p_bc_street_usa`    | Street environment — **new run only**                            |
| `p2p_bc_street_deu`    | Street environment — **new run only**                            |
| `p2p_bc_street_jpn`    | Street environment — empty in both runs                          |
| `p2p_bc_street_global` | Street environment — **new run only**                            |
| `p2p_bc_park_in`       | Aggregate park-in — not materialised in old run                  |
| `p2p_bc_park_out`      | Aggregate park-out — not materialised in old run                 |

Also absent from **new** `summary.yaml`: all six JPN per-country buckets above plus `p2p_bc_outdoor`, `p2p_bc_outdoor_indicator_on_jpn`, `p2p_bc_street_jpn` (upstream source table has 0 JPN rows).

### `summary.yaml` paths read

| # | Path |
|---|---|
| 1 | `abfss://datasets@…/bc/p2p/dev/p2p__2026-06-18-14-55/summary.yaml` |
| 2 | `abfss://datasets@…/bc/p2p/dev/p2p__2026-06-18-14-55/dataset/dataset_split=train/summary.yaml` |
| 3 | `abfss://datasets@…/bc/p2p/dev/p2p__2026-06-18-14-55/dataset/dataset_split=validation/summary.yaml` |
| 4 | `abfss://datasets@…/parking_pudo/p2p/dev/yoel-p2p-odo-full-20260805-2235__2026-08-05-23-54/summary.yaml` |
| 5 | `abfss://datasets@…/parking_pudo/p2p/dev/yoel-p2p-odo-full-20260805-2235__2026-08-05-23-54/buckets/dataset_split=train/summary.yaml` |
| 6 | `abfss://datasets@…/parking_pudo/p2p/dev/yoel-p2p-odo-full-20260805-2235__2026-08-05-23-54/buckets/dataset_split=validation/summary.yaml` |

Paths confirmed **not present** (attempted): old `buckets/dataset_split=*/summary.yaml`; new `dataset/dataset_split=*/summary.yaml`.

---

## Caveats

1. **Distinct runs vs sample rows:** A run can appear in multiple buckets (e.g. outdoor + street + park_in). Tables above deduplicate by `run_id` within each group. Sample-row totals in `summary.yaml` are much larger and must not be summed for run counts.
2. **Old reference is stale/partial:** Old materialisation used binary **3.0.58**, corpus end **2026-02-14**, and source table `users__jackmurphy.p2p_final`. New uses binary **3.0.68**, end **2026-06-07**, and pinned `prod_user.p2p.events_w_odometry_corrections_22k` (Delta v2). Old has **no street buckets** at all.
3. **Zero JPN in new:** Pinned source table has **0 JPN rows** — intentional upstream exclusion before table generation. All six JPN bucket partitions are empty in the new output. Old had **240** distinct JPN runs (outdoor/indoor only).
4. **Empty `p2p_bc_outdoor` (aggregate):** Shared bucket definition had sequential country filters (`USA` ∧ `GBR` ∧ `DEU` ∧ `JPN`) — logically impossible. Empty in both old and new output compared here. Fix exists in branch code (`5824c0f56904`) but **not** in this materialised output.
5. **AGGREGATE buckets new-only:** Multi-country buckets (`p2p_bc_street`, `p2p_bc_indoor`, etc.) contribute **5,815** distinct runs in new; old had no equivalent aggregate street/indoor partitions.
6. **Per-bucket YAML asymmetry:** Old per-bucket counts come from `dataset/dataset_split=*/summary.yaml` (`bucket_stats`); new counts come from root `summary.yaml` (`splits.*.buckets`). Both represent post-balance measured sample counts, but the files live at different paths due to pipeline/version differences.

---

*Run-level counts verified from parquet via Bazel; per-bucket sample counts from `summary.yaml` only (see Per-bucket comparison). Metadata from train/validation `summary.yaml` `created_at` fields. PR: [wayveai/WayveCode#129778](https://github.com/wayveai/WayveCode/pull/129778).*
