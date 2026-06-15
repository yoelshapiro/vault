# 2026-06-14 — PUDO On-Road Failure RCA

## Task
Boris shared two on-road test transcripts: Model A (trained on new materialization, flagged dangerous) and Model B (a previously-working model that regressed to 0/~20 after a "materialization-only" change). Asked to re-examine the materialization + training branches AND the deployment_wrapper for bugs explaining the failures (shift-by-wire stuck in park, hazards instead of indicator, reverse total failure, no slowing for PUDO, no motion even when manually shifted).

## Approach
5-agent verified workflow (wrapper / materialization / datamodule-glue / 2× adversarial verify). Then personally re-verified every load-bearing claim in code (the prior passes had over-claims, which the verifier + I corrected).

## Verdict (report: [[projects/pudo-onroad-failure-rca-2026-06-14]])
The catastrophic failures are **mostly not the materialization data**:
- **Shift-by-wire / no-motion / reverse (S1/S2/S6/S7):** NEUTRAL-biased gear head → wrapper maps NEUTRAL→PARK → zeroes all waypoints → shift-by-wire ignores the manual gear. Verified in `deployment_wrapper.py` (lookup :3323-3333, enforce :364-376, postprocess :3519-3550). The NEUTRAL bias was worsened by commit `2ad1c2d` disabling `augment_gear_direction` (a CONFIG change bundled with the clamp fix) — likely the real "made it worse" lever, not the materialization.
- **Hazards on approach (S3):** the wrapper forces hazards at end-of-route triggered by route-map sparsity (`:3382-3404`, mask `:3452-3456`), default ON. The model CANNOT emit hazard — 3-class head + hazard masked in the loss (`imitation_losses.py:488,495`). Corrects the on-road note's "VSO data" guess.
- **Stuck in park:** monotonic end-of-route PARK latch (`:3360-3378`), default ON.
- **Wrong directional indicator (S4):** PUDO frames (human hazard) are masked from the indicator loss → directional head untrained on PUDO + no curb-side grounding.
- **Materialization (secondary):** short PUDO approach window; PUDO recent-only (2025-12-01) + relaxed quality filters. Reverse is NOT structurally invisible (over-claim corrected); prior clamp/else-branch NEUTRAL-pinning already fixed/dormant.

## Critical caveats
- "Wrapper is constant across models" is UNVERIFIED — route-end hazard+latch were recently added (`0b5120975beb`); regression may be wrapper/config, not data. NEEDS-DATA: per-model wrapper commit, training commit (vs `2ad1c2d`), materialization version.
- Quick on-road isolation (no retrain): deploy with `enable_end_of_route_hazard_lights=False` + `enable_end_of_route_gear_latch=False` and confirm shift-by-wire falls back to manual gear.

## Recommended fixes (ranked)
1. W-B: don't zero waypoints on predicted NEUTRAL/PARK under shift-by-wire; fall back to manual gear.
2. C2: restore forward-looking gear supervision (re-enable augment_gear_direction WITH motion-forward coupling, or supervise gear over the full horizon).
3. W-A: gate hazard forcing on stationarity+park, not route sparsity.
4. W-C: release the PARK latch on driver intent.
5. C3: supervise directional indicator on PUDO frames; M1/M2 materialization (approach window, re-enable PUDO quality filters).

## Links
- Report: [[projects/pudo-onroad-failure-rca-2026-06-14]]
- Prior: [[projects/pudo-parking-py-critique-2026-06-14]], [[projects/pudo-data-bug-report-2026-06-13]]
- Workflow: wf_dd3c740c-982 (5 agents)
