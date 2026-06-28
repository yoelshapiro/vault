# 2026-06-28 Denis Controller Accelerate From Stopped

## Summary

Ran the Accelerate From Stopped PUDO/UnPUDO reproduction flow for three Parking/PUDO models using Denis's controller branch.

## Setup

- Controller branch: `origin/denis/pudo-start-stop-threshold`
- Controller commit: `73ff920e58d9`
- Worktree: `/tmp/WayveCode-denis-pudo-start-stop-threshold`
- Scenario collection: `45fe8c12-859d-49c3-919b-d639bbbfea96`
- Scenario version: `5700`
- Input/output scratch: `/tmp/av_test_45fe_den`
- Local evaluation target: `//wayve/services/av_test_pipeline/evaluation_methods/accelerate_from_stopped/timestamp:evaluation_method`

## Models

| Model | Session | Checkpoint | Gen2 artefact |
| --- | --- | --- | --- |
| `teal-ecstatic-magpie` | `session_2026_06_27_21_39_49_noaug75c05` | 10 | `47c1ff18-01ed-4ec6-9782-33f88341e86c` |
| `fuchsia-vampire-bat-jubilant` | `session_2026_06_27_21_58_32_nostaug0` | 9 | `2a70b9e4-b2fe-4f40-b04c-c74b0cd509e6` |
| `acrobatic-rose-cobra` | `session_2026_06_25_12_30_21_fgjitg50af` | 10 | `af74db40-82b0-4b04-8ec8-deb5812e2937` |

## Simulation And Local Eval

| Model | Simulation request | Inference items | Local successful items | Missing-data items | Delta table suffix |
| --- | --- | ---: | ---: | ---: | --- |
| `teal-ecstatic-magpie` | `2eef0e2b-1239-45a5-9bd1-f0915a72c965` | 1707 | 1706 | 1 | `accelerate_from_stopped__timestamp__simulation_shadow_mode--local--6351c1ca` |
| `fuchsia-vampire-bat-jubilant` | `a7ba23b6-fbfa-4458-86bd-a76718dd76d7` | 1707 | 1706 | 1 | `accelerate_from_stopped__timestamp__simulation_shadow_mode--local--ce3fffbe` |
| `acrobatic-rose-cobra` | `b282841c-5ff4-4a88-b7d6-5e425c5a3e8c` | 1707 | 1697 | 10 | `accelerate_from_stopped__timestamp__simulation_shadow_mode--local--4581c6e9` |

Applied the guide's local-only `+2,000,000 us` segment start shift before local evaluation and ran with `--skip-missing-inference`.

## Corrected Stats

All available rows:

| Model | Rows | Passed | Failed | Row pass % | Segments | All-pass segments | All-fail segments | Mixed segments | Segment pass % |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| `acrobatic-rose-cobra` | 3920 | 2550 | 1370 | 65.051 | 1697 | 1049 | 537 | 111 | 61.815 |
| `fuchsia-vampire-bat-jubilant` | 3940 | 2232 | 1708 | 56.650 | 1706 | 896 | 675 | 135 | 52.521 |
| `teal-ecstatic-magpie` | 3940 | 2393 | 1547 | 60.736 | 1706 | 967 | 608 | 131 | 56.682 |

Common 1697 segments:

| Model | Rows | Passed | Failed | Row pass % | All-pass segments | All-fail segments | Mixed segments | Segment pass % |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| `acrobatic-rose-cobra` | 3920 | 2550 | 1370 | 65.051 | 1049 | 537 | 111 | 61.815 |
| `fuchsia-vampire-bat-jubilant` | 3920 | 2230 | 1690 | 56.888 | 895 | 667 | 135 | 52.740 |
| `teal-ecstatic-magpie` | 3920 | 2385 | 1535 | 60.842 | 963 | 603 | 131 | 56.747 |

## Combined With Original Guide Results

Original guide result tables included:

| Controller | Model | Result table suffix |
| --- | --- | --- |
| Denis | `elated-jaguar-blush@1` | `--local--efbf0fec` |
| Denis | `reassured-red-sea-turtle@1` | `--local--e75acc02` |
| Naman | `elated-jaguar-blush@1` | `--local--eadd5149` |
| Naman | `reassured-red-sea-turtle@1` | `--local--baa8213a` |

Five-way Denis common comparison across the two original guide Denis runs and the three new Denis runs:

| Run | Common segments | Rows | Row pass % | Segment pass % | Failed rows | All-pass | Mixed | All-fail |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Denis / `reassured-red-sea-turtle@1` | 1575 | 16170 | 93.426 | 91.937 | 1063 | 1448 | 42 | 85 |
| Denis / `elated-jaguar-blush@1` | 1575 | 16170 | 80.210 | 77.079 | 3200 | 1214 | 102 | 259 |
| Denis / `acrobatic-rose-cobra` | 1575 | 3645 | 65.953 | 62.603 | 1241 | 986 | 105 | 484 |
| Denis / `teal-ecstatic-magpie` | 1575 | 3645 | 62.030 | 57.905 | 1384 | 912 | 124 | 539 |
| Denis / `fuchsia-vampire-bat-jubilant` | 1575 | 3645 | 59.314 | 55.175 | 1483 | 869 | 128 | 578 |

Seven-way common comparison including original Naman rows:

| Run | Common segments | Rows | Row pass % | Segment pass % | Failed rows |
| --- | ---: | ---: | ---: | ---: | ---: |
| Denis / `reassured-red-sea-turtle@1` | 1574 | 16159 | 93.422 | 91.931 | 1063 |
| Naman / `reassured-red-sea-turtle@1` | 1574 | 16159 | 89.610 | 87.294 | 1679 |
| Denis / `elated-jaguar-blush@1` | 1574 | 16159 | 80.197 | 77.065 | 3200 |
| Denis / `acrobatic-rose-cobra` | 1574 | 3642 | 65.925 | 62.579 | 1241 |
| Denis / `teal-ecstatic-magpie` | 1574 | 3642 | 61.999 | 57.878 | 1384 |
| Denis / `fuchsia-vampire-bat-jubilant` | 1574 | 3642 | 59.281 | 55.146 | 1483 |
| Naman / `elated-jaguar-blush@1` | 1574 | 16159 | 37.849 | 31.067 | 10043 |

Combined takeaway: on the shared Denis-only set, the original `reassured-red-sea-turtle@1` and `elated-jaguar-blush@1` still dominate the three new no/gear-aug style candidates. Among the three new Denis-controller runs, `acrobatic-rose-cobra` is best by both row pass rate and all-rows-pass segment rate.

## Caveats

- The simulation wrappers plateaued at `1707/1722`; local wait processes were interrupted after the output YAMLs were stable. The cloud simulation had already produced usable inference files.
- Simulation logs showed some invalid segments, including mixed `ROUTE_STATE_ROUTELESS` route-state values and `inputs not ready for reference timestamp` failures.
- The controller used the current fetched `origin/denis/pudo-start-stop-threshold` head, not the older merge commit named in the shared guide.
