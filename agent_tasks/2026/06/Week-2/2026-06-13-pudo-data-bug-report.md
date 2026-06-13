# 2026-06-13 — PUDO Data & Pipeline Bug Report

## Task
Boris is at the data+augmentation stage of making the driving model do PUDO (robotaxi pickup/drop-off = relaxed street parking). Reported failures: unpark (won't pull out after gear shift; pulls out when unsafe; gear flicker/no switch), PUDO (sometimes no stop; suboptimal stop position). He reworked data creation (`boris/pudo_generic_materialization`) and trains on `boris/training/main_cherrypick_generic_data`, and provided materialization bucket-count stats. Asked for a bug-finding report in the vault.

## What was done
Ran a 4-agent read-only investigation (materialization buckets / training-config consumption / datamodule label+augmentation logic / distribution analysis) cross-referencing the 5 symptoms and the bucket stats against both branches, then **verified the load-bearing claims directly in code** (gear schema, the neutral-clamp, config weights). Reconciled a genuine conflict between two agents and corrected an over-claim.

## Findings (report: [[projects/pudo-data-bug-report-2026-06-13]])
Confirmed bugs:
- **U-1** `clamp_policy_at_first_neutral` (parking.py:766-801) zeroes pose/waypoints/speed after the first NEUTRAL frame and fires on `unparking_mode` → departure trajectories trained as "stay still" → U1. (mechanism confirmed; trigger = check unpudo windows have a leading neutral.)
- **U-2** `augment_gear_direction=True` (active in BC) moves future gear to D without moving the path → "shift but don't move" (U1/U3).
- **U-3** no `failed_to_unpudo` bucket trained + `unpudo_ca_unsafe_weight=0` → zero "don't pull out, unsafe" signal → U2.
- **P-1** `gear==0` = NEUTRAL (schema has no PARK); PUDO requires a gear-0 segment → drive-through stops (held in Drive) produce no anchor → P1. Partial: dc_pudo_trip_uk=20124 shows ~58% of UK PUDO do hit gear-0, so it misses a subset; needs an empirical gear-encoding check.
- **P-2** 100 m trip-match radius (trip timestamp collected but unused) + clamp/gear-cleanup biasing the stop point → P2.
- **P-3/P-4** `ca_pudo` and gear-change anchors gated on "near any gear change in ±30 s context", not on a validated park/PUDO event → ca_pudo>dc_pudo; contaminated supervision (P1/P2/U3).

Corrected over-claim: the bucket stats are the `anchors` dataset (1 frame/anchor), so short==long / pre==window / failed-to triplets are by-design artifacts, NOT 4× training duplication (consistent with Boris's 94.5%-unique warning).

Taxonomy clarification: the reported "unpark" symptoms are operationally **unpudo** (trained 22%), not the 0%-weighted "unpark" family — so the bugs are in labelling/clamping/weighting, not a missing bucket.

Delivered: symptom→cause map, severity+confidence+file:line per finding, "don't chase" list, 3 cheap verification checks, prioritized fix order.

## Links
- Report: [[projects/pudo-data-bug-report-2026-06-13]]
- Related: [[projects/parking-capability-architecture-research]] (§8.0.3 reverse diagnostic, §8 data prerequisites)
- Workflow: wf_353f8552-b94 (4 agents)
