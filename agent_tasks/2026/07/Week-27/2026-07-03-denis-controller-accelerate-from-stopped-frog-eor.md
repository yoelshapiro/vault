# 2026-07-03 Denis Controller Accelerate From Stopped Frog EOR

## Summary

Submitted Parking/PUDO `accelerate_from_stopped/timestamp` Flyte development evaluations for three frog EOR models with Denis controller source.

## Provenance

- Controller source: `origin/denis/pudo-start-stop-threshold@73ff920e58d9ff9deb6e125ff1559c7d02ee1140`
- Worktree: `/tmp/WayveCode-denis-pudo-start-stop-threshold`
- Flyte workflow version: `accelerate-from-stopped-timestamp-shadow@borisindel-tmp-build-382674be4fb7-73ff920e58d9ff9deb6e125ff1559c7d02ee1140_py0ud`
- Docker image: `wayveacrprodflyte.azurecr.io/av-test-pipeline-accelerate-from-stopped:borisindel-tmp-build-382674be4fb7-73ff920e58d9ff9deb6e125ff1559c7d02ee1140`
- Scenario collection version: `5700`
- Path: Flyte development, branch-built Denis evaluation workflow.

## Run Ledger

- `vigorous-lime-caterpillar`: session `session_2026_07_02_21_48_15_si_parking_bc_train_release_2026_5_21_frog-eor-n8`, checkpoint `10`, Gen2 artefact `cef6220c-ec21-4327-9802-25a45401c5b6`. Requested 1,722 scenario items; submitted 598 after missing-inference filtering; skipped 1,124. Result suffix emitted: `315aa475`.
- `salmon-silver-prototypical`: session `session_2026_07_02_22_01_25_si_parking_bc_train_release_2026_5_21_frog-eor-d70`, checkpoint `10`, Gen2 artefact `87dfcb14-9746-4ff2-badd-f0f905a477b3`. Requested 1,722 scenario items; submitted 598 after missing-inference filtering; skipped 1,124. Result suffix emitted: `79539e4c`.
- `parrot-turquoise-earnest`: session `session_2026_07_02_22_18_33_si_parking_bc_train_release_2026_5_21_frog-eor-raw`, checkpoint `10`, Gen2 artefact `bb4e4584-35dc-4b8b-ab84-6a296205e6d5`. Requested 1,722 scenario items; submitted 598 after missing-inference filtering; skipped 1,124. Result suffix emitted: `244ca8fa`.

## Flyte Executions

### `vigorous-lime-caterpillar`

- Batch 1: `ah4lbdzmw8h82vxnztr7`
- Batch 2: `apwzlwncftwkxssswkjc`
- Batch 3: `alrrdbw5fsc7zmcnjtbc`

### `salmon-silver-prototypical`

- Batch 1: `argbrkhjjm9rcb6pzs9b`
- Batch 2: `aklhcmdhbznvgkcgh7bq`
- Batch 3: `am4ncrkh7c2zdmsn9wjs`

### `parrot-turquoise-earnest`

- Batch 1: `ahk597dmg8mh6674l467`
- Batch 2: `at99mdv4d8j69nsl6g7d`
- Batch 3: `armfl8mtmfzn4z4b4qts`

## Result Paths

```text
abfss://evaluation-studio-sandbox@wayveproddataset.dfs.core.windows.net/av_test_evaluation_results/accelerate_from_stopped__timestamp__simulation_shadow_mode--development--315aa475
abfss://evaluation-studio-sandbox@wayveproddataset.dfs.core.windows.net/av_test_evaluation_results/accelerate_from_stopped__timestamp__simulation_shadow_mode--development--79539e4c
abfss://evaluation-studio-sandbox@wayveproddataset.dfs.core.windows.net/av_test_evaluation_results/accelerate_from_stopped__timestamp__simulation_shadow_mode--development--244ca8fa
```

## Results

Result tables were readable at approximately 2026-07-03 16:05 UTC.

All available result rows:

| Model | Rows | Segments | Passed rows | Failed rows | Row pass % | All-pass / Mixed / All-fail segments | All-rows-pass segment % |
| --- | ---: | ---: | ---: | ---: | ---: | --- | ---: |
| `parrot-turquoise-earnest` | 6,052 | 589 | 4,202 | 1,850 | 69.432 | 346 / 117 / 126 | 58.744 |
| `vigorous-lime-caterpillar` | 6,031 | 587 | 3,496 | 2,535 | 57.967 | 276 / 122 / 189 | 47.019 |
| `salmon-silver-prototypical` | 6,052 | 589 | 3,130 | 2,922 | 51.718 | 231 / 144 / 214 | 39.219 |

Common-segment comparison across 587 segment names:

| Model | Rows | Segments | Passed rows | Failed rows | Row pass % | All-pass / Mixed / All-fail segments | All-rows-pass segment % |
| --- | ---: | ---: | ---: | ---: | ---: | --- | ---: |
| `parrot-turquoise-earnest` | 6,031 | 587 | 4,183 | 1,848 | 69.358 | 345 / 116 / 126 | 58.773 |
| `vigorous-lime-caterpillar` | 6,031 | 587 | 3,496 | 2,535 | 57.967 | 276 / 122 / 189 | 47.019 |
| `salmon-silver-prototypical` | 6,031 | 587 | 3,119 | 2,912 | 51.716 | 230 / 144 / 213 | 39.182 |

## Operational Notes

- Initial `make run-dev` hit Azure Container Registry `401 Unauthorized`; fixed with `az acr login --name wayve`, `az acr login --name wayvetraining`, and `az acr login --name wayveacrprodflyte`.
- `make run-dev` then published the image but registration looked for a sanitized detached-commit tag that did not exist. Registered manually with explicit `--docker-image-ref` using the published image tag.
- Flyte status check via `obs-flyte-execution` was blocked because the helper target depends on missing package `wayve/prototypes/robotics/vehicle_dynamics/common/flyte` in this checkout.
- Result aggregation queries at approximately 2026-07-03 15:18-15:19 UTC returned `PATH_NOT_FOUND` while reading the emitted Delta paths, but the tables were readable by 2026-07-03 16:05 UTC.
- Each run submitted 598 items; result coverage is 587-589 segment names depending on model, so some submitted items did not produce result rows.
