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

## Caveats

1. **Distinct runs vs sample rows:** A run can appear in multiple buckets (e.g. outdoor + street + park_in). Tables above deduplicate by `run_id` within each group. Sample-row totals in `summary.yaml` are much larger and must not be summed for run counts.
2. **Old reference is stale/partial:** Old materialisation used binary **3.0.58**, corpus end **2026-02-14**, and source table `users__jackmurphy.p2p_final`. New uses binary **3.0.68**, end **2026-06-07**, and pinned `prod_user.p2p.events_w_odometry_corrections_22k` (Delta v2). Old has **no street buckets** at all.
3. **Zero JPN in new:** Pinned source table has **0 JPN rows** — intentional upstream exclusion before table generation. All six JPN bucket partitions are empty in the new output. Old had **240** distinct JPN runs (outdoor/indoor only).
4. **Empty `p2p_bc_outdoor` (aggregate):** Shared bucket definition had sequential country filters (`USA` ∧ `GBR` ∧ `DEU` ∧ `JPN`) — logically impossible. Empty in both old and new output compared here. Fix exists in branch code (`5824c0f56904`) but **not** in this materialised output.
5. **AGGREGATE buckets new-only:** Multi-country buckets (`p2p_bc_street`, `p2p_bc_indoor`, etc.) contribute **5,815** distinct runs in new; old had no equivalent aggregate street/indoor partitions.

---

*Counts verified from parquet via Bazel; metadata from train/validation `summary.yaml` `created_at` fields. PR: [wayveai/WayveCode#129778](https://github.com/wayveai/WayveCode/pull/129778).*
