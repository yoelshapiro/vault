# 2026-06-29 Accelerate From Stopped Flyte Three Models

## Summary

Ran the Parking/PUDO accelerate-from-stopped timestamp evaluation path through Flyte development for three new Parking/PUDO model checkpoints, using Denis's controller branch source.

## Provenance

- Evaluation source: `/tmp/WayveCode-denis-pudo-start-stop-threshold`
- Source branch/commit: `origin/denis/pudo-start-stop-threshold@73ff920e58d9ff9deb6e125ff1559c7d02ee1140`
- Scenario collection version: `5700`
- Workflow version: `accelerate-from-stopped-timestamp-shadow@borisindel-tmp-build-382674be4fb7-73ff920e58d9ff9deb6e125ff1559c7d02ee1140_vylv0`
- Image: `wayveacrprodflyte.azurecr.io/av-test-pipeline-accelerate-from-stopped:borisindel-tmp-build-382674be4fb7-73ff920e58d9ff9deb6e125ff1559c7d02ee1140`
- Scratch/log dir: `/tmp/av_test_45fe_flyte_20260629`

## Run Ledger

- `harlequin-parrot-energetic` (`session_2026_06_28_21_38_07_marwfm50p2@10`, artefact `0ec7f3d1-b300-4aa2-82be-40613575c1d5`): 1,722 scenario segments fetched; 598 had existing inference; launched 3 Flyte batches. Status check immediately after submission showed all 3 executions `RUNNING`.
  - Batch executions: `av26zgrhbhbk6lxld6vk`, `a2hq2fhm9bghb2mpxn7r`, `ajtzxkhttdw52r7b5qpv`
  - Result path: `abfss://evaluation-studio-sandbox@wayveproddataset.dfs.core.windows.net/av_test_evaluation_results/accelerate_from_stopped__timestamp__simulation_shadow_mode--development--c14e41ce`
- `substantial-teal-cobra` (`session_2026_06_28_21_37_03_zkwrm50p1@10`, artefact `55a3b237-89c1-4284-8401-2eaada2c398a`): 1,722 scenario segments fetched; all 1,722 were missing inference; no Flyte batches submitted.
  - Empty result path suffix emitted by runner: `accelerate_from_stopped__timestamp__simulation_shadow_mode--development--516b0e2e`
- `magenta-watchful-ostrich` (`session_2026_06_29_05_23_16_mzwarm50p1@10`, artefact `82c4fa33-2779-4959-a377-691ad8f3ef45`): 1,722 scenario segments fetched; all 1,722 were missing inference; no Flyte batches submitted.
  - Empty result path suffix emitted by runner: `accelerate_from_stopped__timestamp__simulation_shadow_mode--development--8c566d73`

## Notes

- User-entered nicknames had truncation typos for harlequin and magenta; Model Catalogue resolved them as `harlequin-parrot-energetic` and `magenta-watchful-ostrich`.
- The Flyte runner used best-guess latest inference lookup with `--skip-missing-inference`. It does not create new inference; models with no existing inference on this scenario set produce zero runnable items.
- ACR auth needed refresh via `az acr login` for `wayve`, `wayveacrprodflyte`, and `wayvetraining`.
- The default `make register-dev` registration path hit a detached-head image tag mismatch after image push; direct registration with the exact pushed `--docker-image-ref` succeeded.
