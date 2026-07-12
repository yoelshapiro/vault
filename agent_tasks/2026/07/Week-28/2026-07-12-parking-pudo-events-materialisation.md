# 2026-07-12 Parking/PUDO Events Materialisation

## Summary

Submitted a Flyte sampling workflow for the generic Parking/PUDO events dataset from branch `boris/pudo_generic_materialization`.

## Command

```bash
bazel run //wayve/ai/services/sampling:workflow -- remote run sample \
  --dataset_name parking_pudo/events \
  --job_name parking_pudo_events_20260712_0904_codex \
  --end_date 2026-07-12
```

## Parameters

- Dataset: `parking_pudo/events`
- Job name: `parking_pudo_events_20260712_0904_codex`
- Binary dataset version: `3.0.84`
- End date: `2026-07-12`
- Branch image: `wayveacrprodflyte.azurecr.io/sampling:borisindel-tmp-build-9bb01c6956b6-boris-pudo_generic_materialization-59584`
- Branch image digest: `sha256:b883758b7d27945bcf401ec53fede6ecc8da59f7ead76e45dbe33b5402b8fedc`
- Flyte execution: <https://flyte.data.wayve.ai/console/projects/ai-services-sampling/domains/production/executions/afn8fd4kkvhzvhjxlxmx>
- Last checked status: `RUNNING` at `2026-07-12T09:05:39Z`; execution started at `2026-07-12T09:04:49Z`.

## Changes

- Updated `wayve/ai/services/sampling/datasets/parking_pudo/events/dataset.py` so `parking_pudo_events_dataset` uses `binary_version="3.0.84"` and `end_date="2026-07-12"`.
- Refreshed ACR credentials after the first submission attempt failed before execution creation with `unable to retrieve auth token: invalid username/password: authentication required`.
- Submitted `acgjrnc5dtv8rzwg9665` after the credential refresh, but it used the stale fallback `sampling:9bb01c6956b6` image and failed because that image predates `parking_pudo/events`.
- Published the branch-local sampling image with `make -C wayve/ai/services/sampling publish-test`.
- Submitted corrected Flyte execution `afn8fd4kkvhzvhjxlxmx`, which mapped to the branch image digest `sha256:b883758b7d27945bcf401ec53fede6ecc8da59f7ead76e45dbe33b5402b8fedc`.
