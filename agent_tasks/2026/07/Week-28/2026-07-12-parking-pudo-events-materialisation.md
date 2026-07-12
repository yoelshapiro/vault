# 2026-07-12 Parking/PUDO Events Materialisation

## Summary

Submitted a Flyte sampling workflow for the generic Parking/PUDO events dataset from branch `boris/pudo_generic_materialization`.

## Command

```bash
bazel run //wayve/ai/services/sampling:workflow -- remote run sample \
  --dataset_name parking_pudo/events \
  --job_name parking_pudo_events_20260712_0851_codex \
  --end_date 2026-07-12
```

## Parameters

- Dataset: `parking_pudo/events`
- Job name: `parking_pudo_events_20260712_0851_codex`
- Binary dataset version: `3.0.84`
- End date: `2026-07-12`
- Flyte execution: <https://flyte.data.wayve.ai/console/projects/ai-services-sampling/domains/production/executions/acgjrnc5dtv8rzwg9665>

## Changes

- Updated `wayve/ai/services/sampling/datasets/parking_pudo/events/dataset.py` so `parking_pudo_events_dataset` uses `binary_version="3.0.84"` and `end_date="2026-07-12"`.
- Refreshed ACR credentials after the first submission failed before execution creation with `unable to retrieve auth token: invalid username/password: authentication required`.
- Retried the same command and successfully submitted Flyte execution `acgjrnc5dtv8rzwg9665`.

