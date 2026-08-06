# P2P materialisation comparison — run 2 (summary.yaml only)

**Execution:** `atn5dj6fxxgzvqkw2bsr` (`yoel-p2p-odo-full-20260806-1455`) — **SUCCEEDED** (~2h 41m)

[Flyte console](https://flyte.data.wayve.ai/console/projects/ai-services-sampling/domains/production/executions/atn5dj6fxxgzvqkw2bsr)

## Run roots

- **New:** `abfss://datasets@wayveproddatasetflat.dfs.core.windows.net/sampling_materialised/parking_pudo/p2p/dev/yoel-p2p-odo-full-20260806-1455__2026-08-06-15-05/`
- **Old (baseline):** `abfss://datasets@wayveproddatasetflat.dfs.core.windows.net/sampling_materialised/bc/p2p/dev/p2p__2026-06-18-14-55/`

**Methodology:** All figures derived solely from `summary.yaml` files — no Databricks, no parquet.

- **Old:** `dataset/dataset_split={train,validation}/summary.yaml` (`bucket_stats`)
- **New:** root `summary.yaml` `splits.*.buckets` + cross-check `buckets/dataset_split=*/summary.yaml`

### Run provenance (from root `summary.yaml`)

| Field | Old | New |
|---|---|---|
| `start_date` | 2019-10-28 | 2019-10-28 |
| `end_date` | 2026-02-14 | 2026-06-07 |
| `base_table` | *(not in root)* | wayve_corpus.all_data |
| `binary.version` | 3.0.58 | 3.0.68 |
| `created_at` | *(split summaries: 2026-06-18T15:21:17)* | *(not in root)* |

### Split totals (sample rows from `summary.yaml`)

| Split | Old samples | New samples | Δ (new − old) |
|---|---:|---:|---:|
| Train | 8,575,246 | 22,316,564 | +13,741,318 |
| Validation | 1,598,373 | 4,663,554 | +3,065,181 |
| **Total** | **10,173,619** | **26,980,118** | **+16,806,499** |

### Comparable buckets (present in both runs)

Sorted by Δ total (new − old), descending.

| Bucket | Old train | Old val | Old total | New train | New val | New total | Δ total |
|---|---:|---:|---:|---:|---:|---:|---:|
| p2p_bc_outdoor_usa | 740,591 | 53,300 | 793,891 | 1,149,926 | 108,601 | 1,258,527 | +464,636 |
| p2p_bc_outdoor_uk | 561,625 | 142,168 | 703,793 | 836,013 | 204,627 | 1,040,640 | +336,847 |
| p2p_bc_park_out_usa | 725,384 | 62,181 | 787,565 | 1,017,056 | 86,173 | 1,103,229 | +315,664 |
| p2p_bc_outdoor_deu | 429,848 | 50,322 | 480,170 | 699,406 | 79,473 | 778,879 | +298,709 |
| p2p_bc_park_out_deu | 707,742 | 92,393 | 800,135 | 892,705 | 101,317 | 994,022 | +193,887 |
| p2p_bc_park_out_uk | 812,232 | 359,259 | 1,171,491 | 959,902 | 351,863 | 1,311,765 | +140,274 |
| p2p_bc_park_in_usa | 786,304 | 58,271 | 844,575 | 867,838 | 80,696 | 948,534 | +103,959 |
| p2p_bc_outdoor_indicator_on_usa | 144,798 | 13,102 | 157,900 | 217,654 | 23,405 | 241,059 | +83,159 |
| p2p_bc_outdoor_indicator_on_uk | 136,635 | 27,211 | 163,846 | 203,257 | 35,427 | 238,684 | +74,838 |
| p2p_bc_outdoor_indicator_on_deu | 59,272 | 5,619 | 64,891 | 110,670 | 11,542 | 122,212 | +57,321 |
| p2p_bc_indoor_usa | 105,087 | 15,501 | 120,588 | 128,573 | 14,809 | 143,382 | +22,794 |
| p2p_bc_indoor_deu | 40,123 | 8,948 | 49,071 | 49,363 | 5,576 | 54,939 | +5,868 |
| p2p_bc_outdoor_indicator_on_global | 47,657 | 2,404 | 50,061 | 51,515 | 3,068 | 54,583 | +4,522 |
| p2p_bc_indoor_global | 50,421 | 2,673 | 53,094 | 44,984 | 4,338 | 49,322 | -3,772 |
| p2p_bc_park_in_uk | 989,445 | 432,432 | 1,421,877 | 976,146 | 430,232 | 1,406,378 | -15,499 |
| p2p_bc_park_in_deu | 497,071 | 58,169 | 555,240 | 486,915 | 49,222 | 536,137 | -19,103 |
| p2p_bc_park_out_global | 293,695 | 21,792 | 315,487 | 267,970 | 23,933 | 291,903 | -23,584 |
| p2p_bc_indoor_uk | 161,356 | 72,679 | 234,035 | 129,200 | 63,250 | 192,450 | -41,585 |
| p2p_bc_outdoor_global | 327,490 | 21,169 | 348,659 | 274,111 | 22,746 | 296,857 | -51,802 |
| p2p_bc_park_in_global | 269,196 | 23,206 | 292,402 | 206,453 | 18,515 | 224,968 | -67,434 |
| **Comparable subtotal (20 buckets)** | **7,885,972** | **1,522,799** | **9,408,771** | **9,569,657** | **1,718,813** | **11,288,470** | **+1,879,699** |

### Old-only buckets

| Bucket | Old train | Old val | Old total |
|---|---:|---:|---:|
| p2p_bc_indoor_jpn | 27,661 | 6,096 | 33,757 |
| p2p_bc_outdoor_indicator_on_jpn | 24,388 | 3,281 | 27,669 |
| p2p_bc_outdoor_jpn | 116,565 | 14,779 | 131,344 |
| p2p_bc_park_in_jpn | 242,493 | 24,595 | 267,088 |
| p2p_bc_park_out_jpn | 278,167 | 26,823 | 304,990 |
| **Old-only subtotal** | **689,274** | **75,574** | **764,848** |

### New-only buckets

| Bucket | New train | New val | New total |
|---|---:|---:|---:|
| p2p_bc_indoor | 307,136 | 83,635 | 390,771 |
| p2p_bc_outdoor | 2,685,345 | 392,701 | 3,078,046 |
| p2p_bc_park_in | 2,330,899 | 560,150 | 2,891,049 |
| p2p_bc_park_out | 2,869,663 | 539,353 | 3,409,016 |
| p2p_bc_street | 2,217,477 | 678,951 | 2,896,428 |
| p2p_bc_street_deu | 257,898 | 25,190 | 283,088 |
| p2p_bc_street_global | 118,910 | 11,000 | 129,910 |
| p2p_bc_street_uk | 1,182,086 | 594,764 | 1,776,850 |
| p2p_bc_street_usa | 777,493 | 58,997 | 836,490 |
| **New-only subtotal** | **12,746,907** | **2,944,741** | **15,691,648** |

### Comparison vs run 1 (20260805-2235)

| Metric | Run 1 (20260805) | Run 2 (20260806) | Δ run2 − run1 |
|---|---:|---:|---:|
| Train samples | 22,536,330 | 22,316,564 | -219,766 |
| Val samples | 4,864,850 | 4,663,554 | -201,296 |
| Total samples | 27,401,180 | 26,980,118 | -421,062 |

### `summary.yaml` paths read

| # | Path | Present |
|---|---|---|
| 1 | `abfss://datasets@wayveproddatasetflat.dfs.core.windows.net/sampling_materialised/bc/p2p/dev/p2p__2026-06-18-14-55/summary.yaml` | ✅ |
| 2 | `abfss://datasets@wayveproddatasetflat.dfs.core.windows.net/sampling_materialised/bc/p2p/dev/p2p__2026-06-18-14-55/dataset/dataset_split=train/summary.yaml` | ✅ |
| 3 | `abfss://datasets@wayveproddatasetflat.dfs.core.windows.net/sampling_materialised/bc/p2p/dev/p2p__2026-06-18-14-55/dataset/dataset_split=validation/summary.yaml` | ✅ |
| 4 | `abfss://datasets@wayveproddatasetflat.dfs.core.windows.net/sampling_materialised/parking_pudo/p2p/dev/yoel-p2p-odo-full-20260806-1455__2026-08-06-15-05/summary.yaml` | ✅ |
| 5 | `abfss://datasets@wayveproddatasetflat.dfs.core.windows.net/sampling_materialised/parking_pudo/p2p/dev/yoel-p2p-odo-full-20260806-1455__2026-08-06-15-05/buckets/dataset_split=train/summary.yaml` | ✅ |
| 6 | `abfss://datasets@wayveproddatasetflat.dfs.core.windows.net/sampling_materialised/parking_pudo/p2p/dev/yoel-p2p-odo-full-20260806-1455__2026-08-06-15-05/buckets/dataset_split=validation/summary.yaml` | ✅ |
| 7 | `abfss://datasets@wayveproddatasetflat.dfs.core.windows.net/sampling_materialised/parking_pudo/p2p/dev/yoel-p2p-odo-full-20260806-1455__2026-08-06-15-05/dataset/dataset_split=train/summary.yaml` | ❌ |
| 8 | `abfss://datasets@wayveproddatasetflat.dfs.core.windows.net/sampling_materialised/bc/p2p/dev/p2p__2026-06-18-14-55/buckets/dataset_split=train/summary.yaml` | ❌ |
| 9 | `abfss://datasets@wayveproddatasetflat.dfs.core.windows.net/sampling_materialised/parking_pudo/p2p/dev/yoel-p2p-odo-full-20260806-1455__2026-08-06-15-05/dataset/dataset_split=validation/summary.yaml` | ❌ |
| 10 | `abfss://datasets@wayveproddatasetflat.dfs.core.windows.net/sampling_materialised/bc/p2p/dev/p2p__2026-06-18-14-55/buckets/dataset_split=validation/summary.yaml` | ❌ |

---

*Sample-row counts from `summary.yaml` only. Do not sum across buckets for distinct run totals.*

See also: [2026-08-06-p2p-materialisation-comparison.md](./2026-08-06-p2p-materialisation-comparison.md) (run 1, 20260805-2235).