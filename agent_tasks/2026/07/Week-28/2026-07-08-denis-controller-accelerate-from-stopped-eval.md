# 2026-07-08 Denis Controller Accelerate From Stopped Eval

## Summary

Ran Parking/PUDO `accelerate_from_stopped/timestamp` shadow evaluations for three model checkpoints using Denis's controller branch:

- Controller source: `origin/denis/pudo-start-stop-threshold@73ff920e58d9ff9deb6e125ff1559c7d02ee1140`
- Worktree: `/tmp/WayveCode-denis-pudo-start-stop-threshold`
- Workflow version: `accelerate-from-stopped-timestamp-shadow@borisindel-tmp-build-382674be4fb7-73ff920e58d9ff9deb6e125ff1559c7d02ee1140_py0ud`
- Controller image: `wayveacrprodflyte.azurecr.io/av-test-pipeline-accelerate-from-stopped:borisindel-tmp-build-382674be4fb7-73ff920e58d9ff9deb6e125ff1559c7d02ee1140`
- Scenario collection version: `5700`
- Input handling: `--batch-size 200 --skip-missing-inference`

## Run Ledger

| Model | Session | Checkpoint | Gen2 artifact | Runnable input | Result suffix | Result segments | Row pass % | All-pass segment % | Flyte executions |
| --- | --- | ---: | --- | ---: | --- | ---: | ---: | ---: | --- |
| `cyan-wallaby-scholarly@10` | `session_2026_07_07_19_24_31_unpdogc0` | 10 | `0a171f28-fff3-4f20-8f05-c153837c74a9` | 598 / 1722 | `ff831ad7` | 590 | 79.169 | 72.203 | `a79fl5lbbpq2tx5tmwkz`, `apnb7dhhx6mlr7tmr2kx`, `axgn5q7k52js9g75rsdh` |
| `moccasin-impartial-koala@9` | `session_2026_07_07_19_34_49_si_parking_bc_train_release_2026_5_21_revunp0` | 9 | `ba067a5a-84f2-41c4-80ee-edb61a3f70db` | 598 / 1722 | `9c7591d7` | 592 | 75.070 | 66.385 | `a929mn4dqbwftxjc8xrv`, `aszxr9d9kvc8d4l62gsr`, `aznhvfhj895h5pcx89dx` |
| `fierce-opossum-tomato@9` | `session_2026_07_07_19_34_54_revnopga0` | 9 | `aa48f914-a31f-41d4-a613-e1b140ea76c2` | 598 / 1722 | `7388b22f` | 591 | 79.252 | 72.589 | `a2nr7drj22tm9t5r2hhz`, `ad6ppp8vhqjjqtfj7wbd`, `as277skkbxgskj5dp2mt` |

All nine Flyte executions reached `end-node - SUCCEEDED` between `2026-07-08T07:33:25Z` and `2026-07-08T07:35:19Z`.

## Common Segment Results

On the 590 segment names present for all three models:

| Model | Rows | Passed rows | Failed rows | Row pass % | All-pass segments | Mixed segments | All-fail segments | All-pass segment % |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| `fierce-opossum-tomato@9` | 6063 | 4812 | 1251 | 79.367 | 429 | 71 | 90 | 72.712 |
| `cyan-wallaby-scholarly@10` | 6063 | 4800 | 1263 | 79.169 | 426 | 73 | 91 | 72.203 |
| `moccasin-impartial-koala@9` | 6063 | 4556 | 1507 | 75.144 | 392 | 100 | 98 | 66.441 |

## Output Paths

- `cyan-wallaby-scholarly@10`: `abfss://evaluation-studio-sandbox@wayveproddataset.dfs.core.windows.net/av_test_evaluation_results/accelerate_from_stopped__timestamp__simulation_shadow_mode--development--ff831ad7`
- `moccasin-impartial-koala@9`: `abfss://evaluation-studio-sandbox@wayveproddataset.dfs.core.windows.net/av_test_evaluation_results/accelerate_from_stopped__timestamp__simulation_shadow_mode--development--9c7591d7`
- `fierce-opossum-tomato@9`: `abfss://evaluation-studio-sandbox@wayveproddataset.dfs.core.windows.net/av_test_evaluation_results/accelerate_from_stopped__timestamp__simulation_shadow_mode--development--7388b22f`

## Caveats

- `moccasin-impartial-koala@9` and `fierce-opossum-tomato@9` resolved to Model Catalogue Gen2 artifacts with null deployment artifact URLs and empty license lists, but inference was available for 598 scenario items.
- The 598 runnable inputs produced 590-592 distinct `segment_name` values in the output tables, so common-segment comparison uses the 590 names shared by all three outputs.
- No local timestamp offset patch was applied; this used the pinned Denis controller workflow version.
