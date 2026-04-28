# PUDO Materialization Future-Speed Filter

Date: 2026-04-28
Branch: `boris/training/kangaroo_with_50_and_route_shorten`
PR: none

## Summary

Updated the PUDO / UNPUDO materialization notebook logic to replace the sample-level `0.734 m/s^2` acceleration filter for UNPUDO / unparking buckets with a future-speed criterion that mirrors the controller start/stop threshold discussion.

## Context

The previous notebook filter kept UNPUDO / unparking samples when:

```python
inferred__state__odometry__acceleration_mps2 >= 0.7341269935880388
```

The controller-side behavior discussed around PR #98250 depends on future speed rather than current acceleration. The relevant controller threshold is `0.15 m/s`, and the MachE config uses a future-speed window starting around `0.6s`.

## Change

File added/updated from `origin/parking/notebooks`:

- `wayve/ai/parking/notebooks/PUDO and UNPUDO materilization.ipynb`

Notebook changes:

- Replaced `UNPUDO_UNPARKING_ACCELERATION_FILTER_ENABLED` and acceleration constants with:
  - `UNPUDO_UNPARKING_FUTURE_SPEED_FILTER_ENABLED = True`
  - `UNPUDO_UNPARKING_FUTURE_SPEED_LOOKAHEAD_US = 600_000`
  - `UNPUDO_UNPARKING_MIN_FUTURE_SPEED_MPS = 0.15`
  - `UNPUDO_UNPARKING_MIN_FUTURE_SPEED_KMH = 0.54`
- Added `apply_unpudo_unparking_future_speed_filter(...)`.
- The filter joins each candidate sample to `all_data` at `timestamp_unixus + 600_000us` and keeps samples whose future odometry speed is at least `0.15 m/s`.
- Projected clean `(run_id, timestamp_unixus)` sample tables before the filter to avoid duplicate-column ambiguity after joining event windows to `all_data`.

## Verification

- Validated notebook JSON with `python -m json.tool`.
- Did not execute the Databricks notebook or validate Spark runtime behavior locally.

## Caveat

The notebook path did not exist on the current branch, so the file was created from `origin/parking/notebooks` and then modified. This should be reviewed as an added notebook file on this branch unless we decide to make the change directly on a notebook branch instead.
