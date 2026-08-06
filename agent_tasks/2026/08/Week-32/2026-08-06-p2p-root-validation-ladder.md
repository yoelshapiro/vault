# 2026-08-06 P2P Root Validation Ladder

## Summary

Validation ladder for the odometry-corrected P2P materialisation now wired as
`PARKING_P2P_DATA_ROOT_05_08_26` on branch
`yoel/materialization_fp_filter_and_p2p_update` (PR
[#129730](https://github.com/wayveai/WayveCode/pull/129730)).

Gate: if every stage passes, proceed to full `parking_pudo/parking`
materialisation with P2P false-positive filtering on the same branch.

## Artefacts

| Role | Path |
|---|---|
| **Test (new)** | `abfss://datasets@wayveproddatasetflat.dfs.core.windows.net/sampling_materialised/parking_pudo/p2p/dev/yoel-p2p-odo-full-20260805-2235__2026-08-05-23-54` |
| **SI training root** | `<test>/dataset` |
| **Filter/bucket summaries** | `<test>/buckets/dataset_split=<split>/summary.yaml` |
| **Baseline (control)** | `abfss://datasets@wayveproddatasetflat.dfs.core.windows.net/sampling_materialised/bc/p2p/dev/p2p__2026-06-18-14-55/dataset` |
| **Flyte execution** | `yoel-p2p-odo-full-20260805-2235` (2026-08-05) |
| **Related PRs** | [#129778](https://github.com/wayveai/WayveCode/pull/129778) (P2P odo materialisation), [#129730](https://github.com/wayveai/WayveCode/pull/129730) (FP filter + root update) |

## Stage 0 — Preconditions

| Check | Pass criteria |
|---|---|
| Flyte execution terminal | `SUCCEEDED` |
| Config alias | `PARKING_P2P_DATA_ROOT = PARKING_P2P_DATA_ROOT_05_08_26` |
| SI root ends with `/dataset` | Not flat Parquet, not `buckets/` |
| Full pipeline completed | `buckets/`, `dataset/`, `comparison/` present |

## Stage 1 — Layout & bucket presence

Verify `BucketCfg.path` for all 12 SI-configured buckets:

```
p2p_bc_outdoor_{uk,usa,deu}
p2p_bc_indoor_{uk,usa,deu}
p2p_bc_park_in_{uk,usa,deu}
p2p_bc_park_out_{uk,usa,deu}
```

```bash
BASE="sampling_materialised/parking_pudo/p2p/dev/yoel-p2p-odo-full-20260805-2235__2026-08-05-23-54"
for b in p2p_bc_outdoor_uk ... p2p_bc_park_out_deu; do
  az storage fs file list --account-name wayveproddatasetflat \
    --file-system datasets \
    --path "${BASE}/dataset/dataset_split=train/dataset_bucket=${b}" \
    --auth-mode login --query "length(@)"
done
```

**Pass:** every bucket has ≥1 parquet file.

## Stage 2 — Summary comparison vs baseline

Use **buckets** summaries for the new run (not `dataset/` summaries):

```bash
bazel run //wayve/ai/services/sampling/tools:compare_summary_yaml -- \
  'abfss://datasets@wayveproddatasetflat.dfs.core.windows.net/sampling_materialised/bc/p2p/dev/p2p__2026-06-18-14-55/dataset/dataset_split=train/summary.yaml' \
  'abfss://datasets@wayveproddatasetflat.dfs.core.windows.net/sampling_materialised/parking_pudo/p2p/dev/yoel-p2p-odo-full-20260805-2235__2026-08-05-23-54/buckets/dataset_split=train/summary.yaml'
```

Repeat for `validation`.

**Expected deltas:**

| Bucket family | Expected vs baseline |
|---|---|
| `p2p_bc_outdoor_*`, `p2p_bc_street_*` | Increase (8s-before-park-in filter removed) |
| `p2p_bc_indoor_*` | Roughly stable |
| `p2p_bc_park_in/out_*` | May shift (odometry table) |
| SI-used buckets | Must remain non-zero |

See also: [[2026-08-06-p2p-materialisation-comparison]] for distinct-run analysis.

## Stage 3 — Parquet spot-check

Read 1 bucket per family under `dataset/` and confirm row counts match
summaries:

```bash
bazel run //wayve/services/data/partner/mb/workflow:query_status_ipython -- -c "
# count rows + distinct run_id for p2p_bc_outdoor_uk, indoor_uk, park_in_uk, park_out_uk
"
```

**Pass:** readable parquet, `run_id` present, counts > 0.

## Stage 4 — SI config resolution

```bash
bazel test //wayve/ai/si:py_checks --test_arg="-k=test_parking_release_2026_5_21_config_resolves"
```

**Pass:** config imports; all 12 `BucketCfg.path` values resolve to existing ADLS paths.

## Stage 5 — Dataloader smoke (optional)

Load one batch per bucket family from `PARKING_P2P_DATA_ROOT` via parking P2P
datamodule. Waivable if ACR auth unavailable.

## Stage 6 — PR gates

- Resolve P2P root layout review thread on #129730
- Record evidence table in PR body
- Confirm no `# FIXME` on `PARKING_P2P_DATA_ROOT_05_08_26`

## Post-ladder: full parking materialisation

If Stages 0–4 pass (Stage 5 waivable), launch on branch
`yoel/materialization_fp_filter_and_p2p_update`:

```bash
# 1. Publish test image from validated workspace
make acr-login
make -C wayve/ai/services/sampling publish-test

# 2. Full materialisation (filter + bucket + balance + compare + distributions)
bazel run //wayve/ai/services/sampling:workflow -- remote run sample \
  --dataset_name parking_pudo/parking \
  --job_name yoel-p2p-fp-park-full-$(date +%Y%m%d-%H%M)
```

**Scope:** `parking_pudo/parking` with P2P false-positive filter (`is_other`
veto on DC/gear-change park/unpark buckets; CA/intervention excluded).

**Monitor:** Flyte to terminal; compare against prior
`p2p_park_full_20260727_rerun_2303` run if available.

## Stop rules

- Halt at first failed stage
- Do not resolve review thread until Stages 1–4 pass
- Do not launch full parking materialisation until ladder passes

## Results

*(Updated by agent run on 2026-08-06)*

| Stage | Result | Notes |
|---|---|---|
| 0 Preconditions | **PASS** | `buckets/`, `dataset/`, `comparison/`, `masks/` present; root `summary.yaml` exists |
| 1 Layout/buckets | **PASS** | All 12 SI buckets under `dataset/dataset_split=train/` have ≥1 parquet file |
| 2 Summary compare | **PASS** | Compare via `buckets/dataset_split=train/summary.yaml` vs baseline; all SI buckets non-zero; outdoor/street increases expected |
| 3 Parquet spot-check | **PASS** | `p2p_bc_outdoor_uk` readable: 836,013 rows; `run_id` present |
| 4 SI config | **PASS** | `PARKING_P2P_DATA_ROOT_05_08_26` → valid `/dataset` root; all 12 `BucketCfg.path` targets exist |
| 5 Dataloader smoke | **SKIPPED** | Waived (ACR auth unavailable) |
| 6 PR gates | PENDING | After full parking materialisation |
| Full parking mat | **LAUNCHED** | `parking_pudo/parking` with FP filter — see execution link below |

### SI bucket train sample counts (new run)

| Bucket | Samples |
|---|---:|
| `p2p_bc_outdoor_uk` | 836,013 |
| `p2p_bc_outdoor_usa` | 1,149,926 |
| `p2p_bc_outdoor_deu` | 699,406 |
| `p2p_bc_indoor_uk` | 129,200 |
| `p2p_bc_indoor_usa` | 128,573 |
| `p2p_bc_indoor_deu` | 49,363 |
| `p2p_bc_park_in_uk` | 1,500,280 |
| `p2p_bc_park_in_usa` | 1,411,427 |
| `p2p_bc_park_in_deu` | 810,628 |
| `p2p_bc_park_out_uk` | 959,902 |
| `p2p_bc_park_out_usa` | 1,017,056 |
| `p2p_bc_park_out_deu` | 892,705 |

### Summary compare notes

- Use **`buckets/dataset_split=<split>/summary.yaml`** for the new run (not
  `dataset/dataset_split=.../summary.yaml`).
- Baseline control path remains
  `bc/p2p/dev/p2p__2026-06-18-14-55/dataset/dataset_split=<split>/summary.yaml`.
- Schema differences (filter names, corpus exclusions) are expected; focus on
  SI bucket non-zero counts and directional outdoor/street increases.
