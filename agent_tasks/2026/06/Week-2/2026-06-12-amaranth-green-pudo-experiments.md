# 2026-06-12 Amaranth/Green PUDO Experiments

## Context

- Workspace: `/workspace/WayveCode`
- Branch context: `boris/training/main_cherrypick_generic_data`
- Target model: `amaranth-kestrel-charming`
- Target session: `session_2026_06_11_20_44_02_gp8n100k4`
- Target checkpoint/artefact: checkpoint `10`, Gen2 artefact `35436a8c-5db1-4d8f-857d-6097e3a26935`
- Driving control model: `green-stegosaurus-brave`
- Driving session: `session_2026_04_24_08_31_45_si_baseline_rl_time_gap_filter_no_spd_change_rl_robotaxi_driving2`
- Driving checkpoint/artefact: checkpoint `1`, artefact `a6597b4b-40ba-4645-a442-ba88bf7e7aad`

## Actions

- Created Console model note `b7a72ce4-610d-461a-860f-dd5af35dd5b2` on `amaranth-kestrel-charming`.
- Created UK PUDO licensing interleave:
  - Experiment: `e701b80e-e179-41e9-830c-3f59f74940e0`
  - URL: https://console.sso.wayve.ai/on-road-experiments/e701b80e-e179-41e9-830c-3f59f74940e0
  - Reference: `3d908711-b4a6-47ee-a750-d466414b2d72`
  - Template: `[UK] PUDO Licensing` (`1faea8e5-b080-43b8-ab41-0ef364d57236`)
  - Status: `pending_approval`
  - Control: `green-stegosaurus-brave`
  - Variant: `amaranth-kestrel-charming`
- Created UK Drift/PUDO interleave:
  - Experiment: `a971f51e-d490-49f1-a624-02392781be9d`
  - URL: https://console.sso.wayve.ai/on-road-experiments/a971f51e-d490-49f1-a624-02392781be9d
  - Reference: `a0e64893-d8a2-4cdc-bdbc-6fffbc1d4384`
  - Template: `[UK] Robotaxi - Drift - Testing Routes` (`55dfe72a-61af-4ae1-873e-251360100870`)
  - Status: `pending_approval`
  - Control: `green-stegosaurus-brave`
  - Variant: `amaranth-kestrel-charming`
  - Controller: default/no explicit controller
  - PUDO/SBW driving feature config copied from the reference.

## Notes

- The green model artefact `a6597b4b-40ba-4645-a442-ba88bf7e7aad` was selected because it is the artefact used by existing green-stegosaurus-brave on-road runs.
- Neither experiment was approved or started.
