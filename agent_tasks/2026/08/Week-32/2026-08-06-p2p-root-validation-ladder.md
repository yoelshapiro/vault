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

## Stage 5 — Single-run filter-and-bucket canary

Run the production `parking_pudo/parking` filter graph against one known run
before another full materialisation:

```bash
RUN_ID='fme10010/2026-06-07--22-04-42--gen2-av-c1c185e6-31f7-42dd-8ef1-0a02779e53d0'
bazel run //wayve/ai/services/sampling:workflow -- remote run filter_and_bucket_stage \
  --dataset_name parking_pudo/parking \
  --job_name yoel-p2p-fp-park-canary-$(date +%Y%m%d-%H%M) \
  --run_ids_filter "[\"${RUN_ID}\"]" \
  --platforms '["gen2"]'
```

This canary must use a fresh image from the exact locally validated commit. It
executes every configured filter with the runtime dataframe argument, so it
would catch unbound filter parameters such as the 2026-08-07
`select_allowed_run_tags(..., allowed_tags)` failure. The candidate run also
historically had 22,101 confident P2P `other` frames; revalidate that source
evidence before relying on it for P2P behavior.

**Pass:** Flyte reaches terminal `SUCCEEDED`, filter-and-bucket output is
written to a new path, and no configured callable raises during mask creation.

## Stage 6 — PR gates

- Resolve P2P root layout review thread on #129730
- Record evidence table in PR body
- Confirm no `# FIXME` on `PARKING_P2P_DATA_ROOT_05_08_26`

## Post-ladder: full parking materialisation

If Stages 0–5 pass, launch on branch
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
- Do not launch full parking materialisation until the Stage 5 canary passes

## Results

*(Updated by agent run on 2026-08-06)*

### 2026-08-07 HEAD revalidation

PR #129730 was revalidated at commit `ad08a3a4b9354e938c6a703a7247289a43fa8d2b`
without adding validation-only code to the PR branch. Extra validation ran from
detached worktree `/tmp/WayveCode-materialization-fp-validation`.

| Gate | Result | Evidence |
|---|---|---|
| PR CI | **PASS** | All reported GitHub checks passed on repeated samples |
| P2P-focused tests | **PASS** | 10/10 selected tests passed; filtered invocation only tripped the expected aggregate coverage threshold |
| Owning sampling checks | **PASS** | `//wayve/ai/services/sampling:test_datasets`: 2,261 tests plus Ruff, Flake8, and type checks |
| SI config resolution | **PASS** | Exact split target `//wayve/ai/si:test_config_py_test_test_configs_utils_parking_release_2026_5_21_config_resolves` |
| Published validation image | **PASS** | `sampling@sha256:259a140627e8d2e219e5e2a03d2dc256fbd61f73ec2eff2e679eaac76c888813` |
| Single-run canary | **PASS** | [as8h4zwrqclkcfxzrgf6](https://flyte.data.wayve.ai/console/projects/ai-services-sampling/domains/production/executions/as8h4zwrqclkcfxzrgf6) succeeded in 21m28s; Spark and Ray nodes both succeeded |

The canary used dataset `parking_pudo/parking`, platform `gen2`, and run
`fme10010/2026-06-07--22-04-42--gen2-av-c1c185e6-31f7-42dd-8ef1-0a02779e53d0`.
Grafana MCP was unavailable in the workspace, so this revalidation has a Loki
data-plane monitoring gap; Flyte control-plane state showed no failed nodes.

| Stage | Result | Notes |
|---|---|---|
| 0 Preconditions | **PASS** | `buckets/`, `dataset/`, `comparison/`, `masks/` present; root `summary.yaml` exists |
| 1 Layout/buckets | **PASS** | All 12 SI buckets under `dataset/dataset_split=train/` have ≥1 parquet file |
| 2 Summary compare | **PASS** | Compare via `buckets/dataset_split=train/summary.yaml` vs baseline; all SI buckets non-zero; outdoor/street increases expected |
| 3 Parquet spot-check | **PASS** | `p2p_bc_outdoor_uk` readable: 836,013 rows; `run_id` present |
| 4 SI config | **PASS** | `PARKING_P2P_DATA_ROOT_05_08_26` → valid `/dataset` root; all 12 `BucketCfg.path` targets exist |
| 5 Single-run canary | **PASS** | [adsw5n7jkd72kgfgghpt](https://flyte.data.wayve.ai/console/projects/ai-services-sampling/domains/production/executions/adsw5n7jkd72kgfgghpt) succeeded with image `sampling@sha256:0e8a5feef69106e8cdd180a177c7dc3f6d85e6312deed647c6a83d7395eb32e8` |
| 6 PR gates | PENDING | After full parking materialisation |
| Full parking mat | **RELAUNCHED** | Fixed rerun: [Flyte execution awgcb99lsh4v6nfg6z55](https://flyte.data.wayve.ai/console/projects/ai-services-sampling/domains/production/executions/awgcb99lsh4v6nfg6z55) |

### 2026-08-07 fixed rerun

| Field | Value |
|---|---|
| Dataset | `parking_pudo/parking` |
| Job name | `yoel-p2p-fp-park-full-20260807-1012` |
| Commit | `11ca1c61e6cb4e83db56a7803ab6931850aa11da` |
| Image | `sampling@sha256:0e8a5feef69106e8cdd180a177c7dc3f6d85e6312deed647c6a83d7395eb32e8` |
| Canary | [adsw5n7jkd72kgfgghpt](https://flyte.data.wayve.ai/console/projects/ai-services-sampling/domains/production/executions/adsw5n7jkd72kgfgghpt) — `SUCCEEDED` |
| Flyte URL | https://flyte.data.wayve.ai/console/projects/ai-services-sampling/domains/production/executions/awgcb99lsh4v6nfg6z55 |
| Submitted | 2026-08-07 10:13 UTC |

### Full parking materialisation launch

| Field | Value |
|---|---|
| Dataset | `parking_pudo/parking` |
| Job name | `yoel-p2p-fp-park-full-20260806-1055` |
| Branch | `yoel/materialization_fp_filter_and_p2p_update` |
| Image | `sampling@sha256:003a93e76f61bccc6956d8296df31a28b6ecc53710d1b4aca0a45a8c39f64d3b` |
| Flyte URL | https://flyte.data.wayve.ai/console/projects/ai-services-sampling/domains/production/executions/aw8kb7z22p8n8w2f4wfx |
| Submitted | 2026-08-06 ~10:55 UTC |

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
