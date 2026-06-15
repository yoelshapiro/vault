# 2026-06-15 — PUDO Detection: Generic Materialization vs Zak On-the-Fly

## Task
Boris: find issues in the materialization branch (`boris/pudo_generic_materialization`) that cause wrong PUDO/UnPUDO detection + corrective actions, and make a thorough comparison to how Zak does "materialization" on the fly in `zmurez/pudo`.

## Approach
Two parallel general-purpose Agent deep-dives (Zak detection in the experimental MCV stack; generic-materialization detection bugs), then I verified the load-bearing claims directly (run-wide park suppression; Zak's speed back-date + park-intention gear patch vs generic having neither).

## Outcome (report: [[projects/pudo-materialization-vs-zmurez-2026-06-15]])
- **Shared, not the regression:** both use gear==0 stop, hazard-defines-PUDO, raw indicator (hazard preserved), ~30m/12s window, unsigned speed.
- **Why the generic swap regressed a working (Zak) model — 3 deltas:**
  1. No gear-gap compensation. Zak: `clean_up_gear_stopped` back-dates park to where speed≈0 + `pred_park_intention` forces gear=0 where humans labeled "parked" but CAN didn't (single_run.py:335-343). Generic: raw gear==0 + smoothing only → held-in-drive PUDO stops never detected.
  2. Run-wide PARK deletion: `filters.py:89-90` zeroes ALL park events for a run if it has any trip event (run_has_parking_pudo_trip_events, signals.py:187-191).
  3. 100m spatial-only trip matching, timestamp unused (signals.py:314-360, PARKING_PUDO_TRIP_MATCH_DISTANCE_M=100).
- **Other generic detection bugs:** ca_pudo gated on any gear change in ±30s context (intervention_filters.py:185-190); reverse undifferentiated + unsigned speed; short approach window; PUDO recent-only (≥2025-12-01) + relaxed quality filters.
- **Already fixed (verified):** departure anchor off-by-one (M3), unpudo window next-stop clip (M4), approach/departure context reconciliation (M2). Residual: gear-change/per-frame context still single-frame.
- **Top fixes:** port Zak's speed-back-date + intention compensation (2.1); per-stop park/PUDO split instead of run-wide suppression (2.2); temporal gate + tighter radius on trip match (2.3).

## Links
- Report: [[projects/pudo-materialization-vs-zmurez-2026-06-15]]
- Related: [[projects/pudo-onroad-failure-rca-2026-06-14]], [[projects/pudo-parking-py-critique-2026-06-14]]
