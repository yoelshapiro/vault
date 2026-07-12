# 2026-07-12 Parking/PUDO Events No Binary Index Run

## Summary

Submitted a fresh `parking_pudo/events` Flyte sampling workflow with the binary success-index table disabled.

## Command

```bash
bazel run //wayve/ai/services/sampling:workflow -- remote run sample \
  --dataset_name parking_pudo/events \
  --job_name parking_pudo_events_20260712_1042_nobin_codex \
  --end_date 2026-07-12 \
  --no_use_binary_success_index_table
```

## Parameters

- Dataset: `parking_pudo/events`
- Job name: `parking_pudo_events_20260712_1042_nobin_codex`
- End date: `2026-07-12`
- Binary success-index table: disabled
- Sampling image digest: `sha256:5c2225f2786e33ae23cd451b2363ca5cbddd1eb378eb894ff9e08ac7660a08b4`
- Flyte execution: <https://flyte.data.wayve.ai/console/projects/ai-services-sampling/domains/production/executions/ac7zzw4ftbwk6czgz72p>
- Last checked status: `RUNNING` at `2026-07-12T10:46:06Z`; execution started at `2026-07-12T10:45:42Z`.

## Notes

- Published the current sampling image first with `make -C wayve/ai/services/sampling publish-test` to avoid stale fallback-image registration.

