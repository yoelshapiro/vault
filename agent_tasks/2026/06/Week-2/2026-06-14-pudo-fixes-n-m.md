# 2026-06-14 — PUDO datamodule + materialization fixes (N1–N5, M1–M6)

## Task
Boris selected fixes from [[projects/pudo-parking-py-critique-2026-06-14]]: datamodule N1,N2,N3(in parking.py),N4,N5 (N6,N7 skip); materialization M1,M2,M3,M4,M6 (M5 skip). Plus Q1: does parking.py change the trajectory for the (non-diffusion) BC config?

## Q1 answer
Yes, narrowly. In the BC config the trajectory-affecting writes in parking.py are:
- **Arrivals clamp** (`clamp_policy_at_first_neutral`, parking_mode only): freezes `POLICY_POSE/WAYPOINTS/CURVATURE` and zeroes `POLICY_SPEED` after the first neutral (the stop), and sets `POLICY_GEAR_DIRECTION` to NEUTRAL after it. Departures (unparking_mode) are untouched (clamp guard).
- **Gear target rewrite**: gear cleanup (`clean_parking_gear_labels`) + `add_parking_mode` set `POLICY_GEAR_DIRECTION` / `VEHICLE_GEAR_DIRECTION` from the cleaned gear, for all parking/unparking samples.
- `POLICY_PATH` / `PARKING_POSE` / `PARKING_POSE_GT` are **not produced** in BC (`policy_path_num_points=0`, goal-dropout off) — diffusion-only. `strip_leading_standstill` and `augment_unparking_gear` are also off/no-op in BC.

## Implemented
**Datamodule** (`boris/pudo-parking-py-fixes`, off training branch, committed `e1f598c`):
- N1 forward pull-out detected as unparking; N2 min-neutral-duration gate; N3 clamp guarded by `_pre_intervention_would_fire`; N5 clamp speed from `clamp_idx+1`. Tests added; all 5 parking tests pass.
- N4 was found NOT to be a bug (both index arrays are `arange(present,…)` → identical positions); skipped.

**Materialization** (`boris/pudo_generic_materialization` worktree `/workspace/pudo_materialization_buckets`, left UNCOMMITTED alongside Boris's events/event_table WIP):
- M1 `assigned |= window` moved inside the class gate (filters.py).
- M2 approach + departure (+ gear-change departure) classify over the parked-segment span `[neutral_onset-1 : neutral_end)`; recommended approach window answered = that span.
- M3 `_departure_anchor` searches from `park_end_idx`.
- M4 `_departure_events` returns `cap_idx`; unpudo window clipped at next park.
- M6 `_trip_pudo_context` duration-gates neutral segments (default 2 s).
- M5 skipped. All edited files py_compile clean; filter test not run (entangled with in-progress events refactor).

## Notes / follow-ups
- Materialization changes are uncommitted in the user's worktree (their WIP includes new `event_table.py`/`events/`); Boris to commit alongside and run `test_parking_pudo_filters`.
- Recommended: regression tests for M1/M2/M4 in `test_parking_pudo_filters.py` once the events refactor settles.
- Pre-existing unrelated suite failures: sarsa (generator), restore (pyarrow), parking lazy_future, `test_apply_parking_goal_dropout` (`PARKING_POSE_GT` missing from zoo keys) — not caused by these changes.
- Freed disk by removing two obsolete session worktrees (`fix_unparking_clamp`, `parking_hub_pr`); bazel output base remains the disk hog (not cleaned per repo policy).

## Links
- Critique: [[projects/pudo-parking-py-critique-2026-06-14]]
- Branch: `boris/pudo-parking-py-fixes` (commit e1f598c)
