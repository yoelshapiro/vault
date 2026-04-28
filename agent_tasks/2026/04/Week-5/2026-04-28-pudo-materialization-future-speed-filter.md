# PUDO Materialization Future-Speed Filter

Date: 2026-04-28
Branch: `parking/notebooks`
Worktree: `/tmp/wayvecode-parking-codeowners`
PR: none

## Summary

Updated the PUDO / UNPUDO materialization notebook on the notebook branch to replace the sample-level `0.734 m/s^2` acceleration filter for UNPUDO / unparking buckets with a future-speed criterion that mirrors the controller start/stop threshold discussion.

Also added additive gear-direction-specific bucket variants while keeping the existing generic PUDO / UNPUDO / parking / unparking buckets.

## Context

The previous notebook filter kept UNPUDO / unparking samples when:

```python
inferred__state__odometry__acceleration_mps2 >= 0.7341269935880388
```

The controller-side behavior discussed around PR #98250 depends on future speed rather than current acceleration. The relevant controller threshold is `0.15 m/s`, and the MachE config uses a future-speed window starting around `0.6s`.

## Change

File updated:

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
- Renamed output dataset suffix from `high_acc` to `future_speed_gear`.

## Gear Buckets

Added `GEAR_SPECIFIC_BUCKET_SPECS` with four additive bucket types:

- `unparking`, `gear_direction == 1`
- `unpudo`, `gear_direction == 1`
- `parking`, `prev_gear_direction == -1`, with source event aliases `park` and `parking`
- `unpudo`, `gear_direction == -1`

For park/parking events, the event gear itself is already `0`, so the direction before parking is captured via `prev_gear_direction`.

The existing generic buckets are unchanged. The gear-specific buckets are added for both DC and AV bucket generation paths.

## Verification

- Validated notebook JSON with `python -m json.tool`.
- Parsed modified Python cells with `ast.parse`.
- Did not execute the Databricks notebook or validate Spark runtime behavior locally.

## Caveat

The future-speed materialization filter is a proxy for the OTF trajectory: it uses odometry speed at `sample + 0.6s`, not direct `POLICY_WAYPOINTS`, because this materialization notebook only emits `(run_id, timestamp_unixus)` buckets from `wayve_corpus.all_data`. OTF later interpolates the same odometry speed column into `DataKeys.POLICY_SPEED`.
