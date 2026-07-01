# 2026-07-01 Accelerate From Stopped Frog Bronze Tessellated

## Summary

Ran Parking/PUDO `accelerate_from_stopped/timestamp` for `frog-bronze-tessellated@10` with Denis controller source via the branch-built Flyte development workflow.

## Provenance

- Model: `frog-bronze-tessellated`
- Session: `session_2026_06_30_10_46_01_harqolr81wb2`
- Checkpoint: `10`
- Gen2 artefact: `a710ca23-1380-4b7b-bf65-64198100f25a`
- Controller source: `origin/denis/pudo-start-stop-threshold@73ff920e58d9ff9deb6e125ff1559c7d02ee1140`
- Flyte workflow version: `accelerate-from-stopped-timestamp-shadow@borisindel-tmp-build-382674be4fb7-73ff920e58d9ff9deb6e125ff1559c7d02ee1140_vylv0`
- Scenario collection version: `5700`
- Input YAML: `/tmp/av_test_45fe_flyte_20260701_frog/frog-bronze-tessellated__5700__input.yaml`

## Run Ledger

- `frog-bronze-tessellated@10`: Denis branch workflow, checkpoint 10 Gen2 artefact. Original scenario input had 1,722 artefact references; runner submitted 598 items after missing-inference filtering. All 3 Flyte batches succeeded. Result table suffix: `57392ced`.

## Flyte Executions

- Batch 1: `a945wxhb8g9hglpzc5rd` - `SUCCEEDED`
- Batch 2: `ap5fqdbhlgrmjmc88prw` - `SUCCEEDED`
- Batch 3: `a5dtscs7tjx4w7qfzppf` - `SUCCEEDED`

## Results

Delta path:

```text
abfss://evaluation-studio-sandbox@wayveproddataset.dfs.core.windows.net/av_test_evaluation_results/accelerate_from_stopped__timestamp__simulation_shadow_mode--development--57392ced
```

Aggregate across result rows:

| Model | Rows | Segments | Passed rows | Failed rows | Row pass % | All-pass / Mixed / All-fail segments | All-rows-pass segment % |
| --- | ---: | ---: | ---: | ---: | ---: | --- | ---: |
| `frog-bronze-tessellated@10` | 6,052 | 589 | 3,356 | 2,696 | 55.453 | 265 / 125 / 199 | 44.992 |

Per-batch result coverage:

| Execution | Segments | Rows | Passed rows | Failed rows |
| --- | ---: | ---: | ---: | ---: |
| `a945wxhb8g9hglpzc5rd` | 198 | 2,049 | 1,159 | 890 |
| `ap5fqdbhlgrmjmc88prw` | 196 | 2,010 | 1,074 | 936 |
| `a5dtscs7tjx4w7qfzppf` | 195 | 1,993 | 1,123 | 870 |

## Caveats

- This was a Flyte development run using Denis branch source, not a production controller tag.
- The runner submitted 598 items but the Delta table contains 589 result segments, so 9 submitted items did not produce result rows despite all Flyte batches succeeding.
- Details scan found no failed Flyte nodes; only stale `ContainerCreating` reasons retained on nodes that later succeeded.
