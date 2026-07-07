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
