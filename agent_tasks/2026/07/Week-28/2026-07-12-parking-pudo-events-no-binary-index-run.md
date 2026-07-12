# 2026-07-12 Parking/PUDO Events No Binary Index Run

## Summary

Submitted a fresh `parking_pudo/events` Flyte sampling workflow with the binary success-index table disabled, debugged its failure, and resubmitted with a local frequency fallback fix for an unregistered Gen2 vehicle model.

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
- Final status: `FAILED` at `2026-07-12T11:06:37Z`.

## Failure

- Root cause: `2/364 filter_and_bucket` tasks failed while building Parking/PUDO event metadata.
- Error: `ValueError: Invalid vehicle model string: gen2-maserati-grecale-alpha3`.
- Path: `parking_pudo/events` post-processing called `_signals()`, which called `get_frequency()`, which passed the unregistered vehicle model into `get_platform_frequency()`.
- The no-binary-index run admitted rows not present in the binary success-index subset, exposing this unregistered Gen2 model string.

## Fix

- Added `is_unregistered_vehicle_model_for_platform()` in `wayve/core/data/vehicles.py`.
- Gen2 non-Nissan unregistered vehicle-model strings now fall back to the platform default frame rate.
- Unknown Gen2 Nissan strings still fail loudly because registered Nissan proto models can override the default Gen2 frequency.
- Added regression coverage in:
  - `wayve/core/data/test/test_vehicles.py`
  - `wayve/ai/services/sampling/test/datasets/parking_pudo/test_parking_pudo_filters.py`

## Resubmission

```bash
bazel run //wayve/ai/services/sampling:workflow -- remote run sample \
  --dataset_name parking_pudo/events \
  --job_name parking_pudo_events_20260712_1150_nobin_fix_codex \
  --end_date 2026-07-12 \
  --no_use_binary_success_index_table
```

- Sampling image digest: `sha256:05fbeccc2dc81cc1a5a8c09c3e1a510a0c68416d7bf1547d42617a054058d48c`
- Flyte execution: <https://flyte.data.wayve.ai/console/projects/ai-services-sampling/domains/production/executions/apcv9qkl7zvhwnbcgnrx>
- Last checked status: `RUNNING` at `2026-07-12T12:13:23Z`; execution started at `2026-07-12T11:49:47Z`.

## Notes

- Published the current sampling image first with `make -C wayve/ai/services/sampling publish-test` to avoid stale fallback-image registration.
- The resubmitted run was still running past the previous failure time window, so the original Grecale model-string crash path appears cleared.
