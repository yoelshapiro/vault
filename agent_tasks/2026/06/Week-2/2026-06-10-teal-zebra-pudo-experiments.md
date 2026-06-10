# 2026-06-10 Teal/Zebra PUDO Experiments

## Context

- Worktree: `/workspace/main_cherrypick_new_driving`
- Branch: `boris/parking-past30-no-standstill-gear-aug/main_cherrypick_new_driving`
- Target model: `teal-elk-amused`
- Target session: `session_2026_06_06_21_38_04_pgearfix2__gorilla-tan-splendid_interleave_control_v3`
- Target checkpoint/artefact: checkpoint `1`, artefact `31c66a8a-7719-4f95-9d18-0cff43dba71e`
- Zebra control model: `zebra-aquamarine-reclusive`
- Zebra session: `session_2026_05_12_02_34_19_baseline_rl_stage2_integration_wfm_eff__wallaby-compact-moccasin_interleave_control_v1`
- Zebra checkpoint/artefact: checkpoint `1`, artefact `53f815b3-7014-4d3c-9715-bfc69f5d5add`

## Actions

- Created Console model note `8772c517-5f64-4be0-9442-56460fe36a7d` on `teal-elk-amused`.
- Created UK PUDO licensing interleave:
  - Experiment: `3d908711-b4a6-47ee-a750-d466414b2d72`
  - URL: https://console.sso.wayve.ai/on-road-experiments/3d908711-b4a6-47ee-a750-d466414b2d72
  - Template: `[UK] PUDO Licensing` (`1faea8e5-b080-43b8-ab41-0ef364d57236`)
  - Status: `pending_approval`
  - Control: `zebra-aquamarine-reclusive`
  - Variant: `teal-elk-amused`
- Created UK Drift/PUDO interleave:
  - Experiment: `a0e64893-d8a2-4cdc-bdbc-6fffbc1d4384`
  - URL: https://console.sso.wayve.ai/on-road-experiments/a0e64893-d8a2-4cdc-bdbc-6fffbc1d4384
  - Template: `[UK] Robotaxi - Drift - Testing Routes` (`55dfe72a-61af-4ae1-873e-251360100870`)
  - Status: `pending_approval`
  - Control: `zebra-aquamarine-reclusive`
  - Variant: `teal-elk-amused`
  - Controller: default/no explicit controller
  - PUDO/SBW driving feature config copied from the recent zebra default-controller experiment `639bd3cb-2aa5-4c14-81f7-11ea8dc69906`.

## Notes

- The first create attempt used an expired cached token and returned `401`; refreshed the Azure token for `api://model-catalogue.wayve.ai` and retried successfully.
- Neither experiment was approved or started.
