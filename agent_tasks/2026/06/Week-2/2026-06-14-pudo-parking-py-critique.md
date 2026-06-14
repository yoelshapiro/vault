# 2026-06-14 — PUDO parking.py Deep Critique + Flags Guide

## Task
After fixing some of the 2026-06-13 critique (gear==0 now = park OR neutral; failed_to safe/unsafe buckets can't be reproduced), Boris asked to: continue the model+materialization critique (more bugs remain), deep-dive how `datamodules/parking.py` works and is utilised, write a NEW findings doc, and give a full answer on how to use the flags in parking.py with motivation. Same branches.

## Approach
6-agent workflow (Ultracode): mechanics map of parking.py + pipeline order; full flag inventory (BC vs diffusion values); new datamodule bug hunt; new materialization bug hunt; then adversarial verification of both bug lists. I personally re-verified the load-bearing claims (clamp fix present; augment_unparking_gear gating; forward-unpark gap; datamodule wiring).

## Key outcome
Report: [[projects/pudo-parking-py-critique-2026-06-14]].
- **Framing that governs everything:** the shipping BC datamodule has policy-path, stopping-mode, strip-leading-standstill, parked→unpark, and unpark-gear augmentation all OFF. So many bugs are diffusion-only; the BC pipeline is essentially gear-cleanup → mode-detection → arrivals-only-clamp. Tagged findings BC-LIVE vs DIFFUSION-ONLY.
- **Prior fixes confirmed:** clamp U-1 fixed (`parking.py:786`), augment_gear_direction (F4) inert.
- **New BC-LIVE bugs:** N1 forward-unpark still undetected (U1 blocker; the fix needs its own duration gate because min_duration is inert in BC); N2 BC applies no min-neutral-duration filter at all (P1/U2); N3 clamp-NEUTRAL vs pre-intervention-restores-motion contradiction on pre-CA/CA PUDO arrivals (scoped); N4 route-shortening clipped-vs-unclipped index (P2 boundary); N5 clamp speed/pose off-by-one (P2); N6 no goal-pose target in BC (P2 ceiling); N7 SI-vs-zoo parked-tail mismatch.
- **New materialization bugs:** M1 cross-class frame theft (`filters.py:104` assigned-before-gate); M2 approach single-frame vs departure range context; M3 departure-anchor off-by-one; M4 unpudo window not clipped at next stop; M5 departure not skipping start<=0; M6 trip context on raw neutral segments.
- **Flags guide:** every ParkingDataConfig knob + the interacting loss/adaptor flags, with current BC value, recommendation, and motivation tied to U1/U2/U3/P1/P2.
- **Config hygiene:** modes bind `parking_bc_datamodule`; `pudo_bc_datamodule` + diffusion datamodule unused by any mode (CLI-override only) — confirm which mix actually trains; inverted past/lookahead; dangling `enable_end_of_route_blackout`.
- **Refuted:** an earlier-pass claim that BC departures get all-neutral gear via augment_unparking_gear's else-branch (gated on gear[origin]==NEUTRAL; dormant in BC).

## Links
- Report: [[projects/pudo-parking-py-critique-2026-06-14]]
- Prior: [[projects/pudo-data-bug-report-2026-06-13]]
- Workflow: wf_9aedb282-cb9 (6 agents)
