# 2026-06-30 Accelerate From Stopped Flyte Three Models

## Summary

Ran the Parking/PUDO accelerate-from-stopped timestamp evaluation path through Flyte development for three requested models using the Denis controller source workflow registered from the prior run.

## Provenance

- Evaluation source: `/tmp/WayveCode-denis-pudo-start-stop-threshold`
- Source branch/commit: `origin/denis/pudo-start-stop-threshold@73ff920e58d9ff9deb6e125ff1559c7d02ee1140`
- Scenario collection version: `5700`
- Workflow version: `accelerate-from-stopped-timestamp-shadow@borisindel-tmp-build-382674be4fb7-73ff920e58d9ff9deb6e125ff1559c7d02ee1140_vylv0`
- Scratch/log dir: `/tmp/av_test_45fe_flyte_20260630`

## Run Ledger

- `substantial-teal-cobra` (`session_2026_06_28_21_37_03_zkwrm50p1@10`, artefact `55a3b237-89c1-4284-8401-2eaada2c398a`): 1,722 scenario segments fetched; 598 had existing inference; launched 3 Flyte batches. All 3 executions reached `SUCCEEDED`.
  - Batch executions: `a7w4888rtpm9bt475fmj`, `aqzgxxf65vgj9kmwjndh`, `ajr7qptj6797nw5bkqtf`
  - Result path: `abfss://evaluation-studio-sandbox@wayveproddataset.dfs.core.windows.net/av_test_evaluation_results/accelerate_from_stopped__timestamp__simulation_shadow_mode--development--967c8733`
  - Result aggregate: 6,132 rows across 597 segment names / inference items; 3,268 pass rows, 2,864 fail rows, row pass rate `53.294%`; strict segment outcomes: 247 all-pass, 218 all-fail, 132 mixed.
  - Detailed Flyte check found no hidden failed/aborted/timed-out attempts.
- `magenta-watchful-ostrich` (`session_2026_06_29_05_23_16_mzwarm50p1@10`, artefact `82c4fa33-2779-4959-a377-691ad8f3ef45`): 1,722 scenario segments fetched; 598 had existing inference; launched 3 Flyte batches. All 3 executions reached `SUCCEEDED`.
  - Batch executions: `axs2nqvhn7zndxrwg24k`, `a7z2f77xstvh6mlgk6wb`, `avd4bk2jfqbm56qxdphj`
  - Result path: `abfss://evaluation-studio-sandbox@wayveproddataset.dfs.core.windows.net/av_test_evaluation_results/accelerate_from_stopped__timestamp__simulation_shadow_mode--development--81625f1f`
  - Result aggregate: 6,132 rows across 597 segment names / inference items; 3,524 pass rows, 2,608 fail rows, row pass rate `57.469%`; strict segment outcomes: 276 all-pass, 193 all-fail, 128 mixed.
  - Detailed Flyte check found no hidden failed/aborted/timed-out attempts.
- `chameleon-sarcastic-silver` (`session_2026_06_26_00_34_33_host_zak_mcv_wfm_wta_nav-v2_ablate@1`, artefact `348390d2-07ee-43c1-9ed0-52365cc06efd`): 1,722 scenario segments fetched; 597 had existing inference; launched 3 Flyte batches. All 3 executions failed before writing a result table.
  - Batch executions: `arvt6z7vwmnc7rgp2l5j`, `ajngdh5mlrptk45xjxpp`, `acnpfc7kkgrkd9hbdgwv`
  - Intended result path suffix: `accelerate_from_stopped__timestamp__simulation_shadow_mode--development--cb1077bf`, but Databricks returned `PATH_NOT_FOUND`.
  - Failure: `ValueError: combine_waypoints_and_vehicle_states: No valid segments remain after validation` from `accelerate_from_stopped_metric_assert.py` via `combine_waypoints_and_vehicle_states`.

## Common-Segment Comparison

Common segment set for the two successful runs: 597 segment names.

| model | row pass rate | all-pass segments | all-fail segments | mixed segments |
|---|---:|---:|---:|---:|
| `magenta-watchful-ostrich` | `57.469%` | 276 | 193 | 128 |
| `substantial-teal-cobra` | `53.294%` | 247 | 218 | 132 |

## Notes

- User-entered `magenta-watchful-ostric` resolved to canonical `magenta-watchful-ostrich`.
- The Flyte runner used best-guess latest inference lookup with `--skip-missing-inference`; this is evaluation over existing inference, not a fresh inference generation workflow.
