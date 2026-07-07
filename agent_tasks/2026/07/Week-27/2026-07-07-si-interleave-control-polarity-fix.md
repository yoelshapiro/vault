# 2026-07-07 SI Interleave Control Polarity Fix

## Summary

Fixed the SI group interleave-control PR branch so the driving model requests interleaving to PUDO when either the route is near end-of-route or the effective policy gear is not Drive.

## Details

- Branch: `06-22-si-group-interleave-control-support`
- Commit: `02afc5fc283b`
- PR: existing branch for `06-22-si-group-interleave-control-support`
- Files:
  - `wayve/ai/zoo/deployment/deployment_wrapper.py`
  - `wayve/ai/zoo/deployment/test/test_deployment_wrapper_codegen.py`

## Changes

- Preserved the existing stateless EOR threshold behavior:
  - driving side: route signal below `END_OF_ROUTE_THRESHOLD`
  - parking side: route signal above `END_OF_ROUTE_EXIT_THRESHOLD` and speed above `HANDOVER_SPEED_MS`
- Added the missing driving-side non-Drive gear trigger:
  - driving side now emits `interleave_control=True` when effective policy gear is not Drive.
- Added regression coverage in the interleave-control codegen test.

## Verification

```bash
bazel test //wayve/ai/zoo/deployment:test_deployment
```

Result: passed.

## Parrot Redeploy

- Source model: `parrot-turquoise-earnest`
- Source session: `session_2026_07_02_22_18_33_si_parking_bc_train_release_2026_5_21_frog-eor-raw`
- Redeploy branch: `boris/parking-frog-eor-fresh-rawgear`
- Redeploy commit: `c51b5baa241d`
- Deployed session: `session_2026_07_02_22_18_33_si_parking_bc_train_release_2026_5_21_frog-eor-raw__parrot-turquoise-earnest_interleave_control_v2`
- Deployed nickname: `flourishing-cormorant-amber`
- Console: `https://console.sso.wayve.ai/model/session_2026_07_02_22_18_33_si_parking_bc_train_release_2026_5_21_frog-eor-raw__parrot-turquoise-earnest_interleave_control_v2`
- Checkpoint: 100000 steps, checkpoint hash `094636662f6f50308bb6e83482c2aeae`
- Gen2 artefact: `b6864e4b-8b17-4f8c-b7f1-ac5e384224f5`

Redeploy branch changes:

- Applied the same interleave-control polarity fix to the training branch used for deployment.
- Gated forced hazard indicators on the end-of-route gear latch being enabled and producing Park.
- Kept deployment with `--enable_interleave_control --interleave_control_group parking`.

Deploy verification:

- Exported `policy_io_config.yml` contains `interleave_control`, `policy_gear_position`, and `policy_indicator_weights`.
- Exported `gen2_model_inference_config.json` has radar features `X/Y/Z/range_rate/SNR` and `points_per_scan=800`.
- Upload completed successfully. The deploy script emitted a non-fatal ONNX artefact upload warning because ONNX export was disabled.
- Console model note was not added because the local Console auth cookie redirected to OneLogin.
