# PUDO/UnPUDO On-Road Failure RCA — 2026-06-14

Root-cause analysis of the catastrophic on-road runs (Model A flagged for dangerous behavior; Model B = a previously-working model regressed to 0/~20 after a "materialization-only" change). Investigated the deployment wrapper, the materialization (`boris/pudo_generic_materialization`), and the training datamodule/config (`boris/training/main_cherrypick_generic_data`); every headline claim re-verified directly in code. Companion to [[pudo-parking-py-critique-2026-06-14]].

> **TL;DR — the failures are mostly NOT the materialization data.** The shift-by-wire / no-motion / reverse-never failures come from a **confirmed chain**: the gear head is biased toward NEUTRAL → the deployment wrapper maps NEUTRAL→PARK → it zeroes *all* waypoints for PARK → and under shift-by-wire it **ignores the manually selected gear**. The NEUTRAL bias was made worse by commit `2ad1c2d` which **disabled `augment_gear_direction`** (the only signal teaching the upcoming D/R). The hazards-instead-of-indicator failure is **100% the deployment wrapper forcing hazards on approach** — the model literally cannot emit hazard (it's masked out of the loss). Two default-ON wrapper end-of-route behaviors (a monotonic PARK latch and route-sparsity hazard forcing) turn a single stray PARK near the pin into a permanent lock.

---

## Symptom → confirmed cause map

| Symptom | Confirmed cause(s) | Type |
|---|---|---|
| **S1** no park→drive shift; **S2** no park→reverse; **S6** stops but won't shift to park; **S7** no motion even when manually in gear | **W-B** wrapper NEUTRAL→PARK→zero-waypoints + shift-by-wire ignores manual gear, fed by a **NEUTRAL-biased gear head** (**C1** single-frame gear target + **C2** `augment_gear_direction` disabled in `2ad1c2d`); amplified by **W-C** monotonic PARK latch | config × wrapper (data secondary) |
| **S3** hazards instead of indicator, hazards on approach | **W-A** wrapper forces hazard at end-of-route, triggered by route-map sparsity (fires on approach, not stationarity). Model **cannot** emit hazard (loss-masked) | **wrapper only** |
| **S4** wrong directional indicator | **C3** directional indicator never supervised on PUDO frames (hazard frames masked) + no curb-side grounding | data/arch |
| **S5** doesn't slow for the pin | **M1** short PUDO approach window (30 m / 12 s) + stop target = human neutral-onset, not the pin; **M2** PUDO bucket scarcity (recent-only + relaxed filters) | data |
| **S8** sharp steer toward oncoming on unpark | unpark steering/path targets + short-segment gear smoothing erasing reverse legs (NEEDS-DATA) | data |

---

## A. Deployment-wrapper bugs (the dominant, verified causes)

All in `boris/training/main_cherrypick_generic_data:wayve/ai/zoo/deployment/deployment_wrapper.py`. All three are **default-ON** and were **recently added** (commit `0b5120975beb` "add parking route-end hazard and gear latch") — see the "constant?" caveat in §D.

### W-A — Hazards forced on *approach*, not when stationary → S3 (CONFIRMED, blocker)
`_force_hazard_indicator_weights_at_route_end` (`:3382-3404`) sets `hazard_weight = max(weights)+1` so argmax always lands on a bolted-on 4th hazard channel — overriding the model's 3-class indicator. It is gated **only** on `close_to_route_end`, and `_end_of_route_mask` (`:3452-3456`) is pure route-map sparsity: `route_signal = map_route[:,:2].sum() < end_of_route_sum_thresh (2e4)`. That fires while the rendered route is short — i.e. **during the PUDO approach toward the pin, before the car is stationary or in park**. Exactly the reported "hazards too early, before stopping." Default `enable_end_of_route_hazard_lights=True` (`:3275`).
- **The on-road note's guess that this came from VSO data is wrong** — see C-fact below; the model can't emit hazard. This is the wrapper.
- **Fix:** gate hazard forcing on actual stationarity AND park: `close_to_route_end & (vehicle_speed≈0) & (gear==PARK)`; pass the model's directional indicator through on approach. Quick on-road mitigation: deploy with `enable_end_of_route_hazard_lights=False` to isolate.

### W-B — Gear→waypoint gating zeroes motion on NEUTRAL/PARK, and shift-by-wire ignores the manual gear → S1/S2/S7 (CONFIRMED, blocker)
`_postprocess_outputs` (`:3519-3550`): under shift-by-wire **ON**, `gear_direction_output = model_gear_direction` (`argmax(gear_logits)-1`), **discarding `input_gear_direction`** (the actual/manual vehicle gear). Then `_convert_gear_direction_to_position` uses the lookup `[REVERSE, PARK, DRIVE, UNKNOWN]` indexed by `gear+1` (`:3323-3333`), so **gear_direction 0 (NEUTRAL) → PARK**. Then `_enforce_gear_position_on_waypoints` (`:364-376`) sets **x=0 and y=0 for PARK/NEUTRAL** (and x≤0 for reverse).
- Net: if the gear head predicts NEUTRAL, the wrapper outputs PARK and **zeroes every waypoint** → no motion, no steer. Because shift-by-wire ON ignores the manual gear, **manually shifting to drive/reverse does nothing** while the model still predicts neutral. This is precisely S7 ("manually put in drive/reverse, no accel/steer/movement").
- Reverse (S2) additionally requires the head to emit class 0 (reverse); a neutral-biased head never does, so reverse motion is structurally zeroed.
- **Fix:** when shift-by-wire is ON but the model gear is NEUTRAL/uncertain, fall back to the actual `input_gear_direction` for the waypoint clamp; do not zero waypoints purely on the *predicted* gear. Longer term, fix the gear head bias (§B).

### W-C — Monotonic end-of-route PARK latch sticks in PARK → S1/S2/S6/S7 (CONFIRMED, blocker)
`_apply_end_of_route_parking_latch` (`:3360-3378`): `next_latch = where(close_to_route_end, max(prev, current_is_park), 0)`. Once the model predicts PARK for a *single* frame while `close_to_route_end`, the latch is monotonic (`torch.maximum`) and **forces PARK every frame** until the route map fills back above threshold. Near a PUDO pin (route stays "ended"), a subsequent UnPUDO can **never command DRIVE/REVERSE** — the latch holds PARK, and via W-B the waypoints stay zeroed. Default `enable_end_of_route_gear_latch=True` (`:3276`).
- **Fix:** release the latch on driver intent (`ENABLE_SHIFT_BY_WIRE` requesting non-PARK, `INITIATE_AUTO_PARKING` de-asserted, or the model predicting non-PARK for N frames), not solely on route-map fullness. Quick mitigation: `enable_end_of_route_gear_latch=False`.

### Refuted/■ down-ranked (don't chase)
- Base-class `_clamp_waypoints_for_forward_drive` forbidding reverse → **REFUTED for the parking path**: `ParkingDeploymentWrapperImpl` uses its own gear-aware enforcement, not the forward-only `_to_onboard_output`.
- `InterleavedModelWrapper` cache/stale-replay → **REFUTED**: it is deprecated; on-road interleaving is robot-side.

---

## B. Training/config: the NEUTRAL-biased gear head (feeds W-B/W-C)

### C1 — Gear supervised single-frame, target is the raw materialized gear → NEUTRAL bias (CONFIRMED)
`gear_direction_cross_entropy_loss` supervises only `POLICY_GEAR_DIRECTION[:, 1]` (t+1) (`imitation_losses.py:505`); the head broadcasts one prediction over the horizon. `add_parking_mode` sets the target = raw materialized gear at the policy index (`parking.py`), so at an unpark origin (still parked at t+1) the target ≈ NEUTRAL. The model is thus biased to predict NEUTRAL right when it must predict DRIVE/REVERSE → W-B zeroes motion.

### C2 — `augment_gear_direction` disabled in commit `2ad1c2d` → removed the only forward-looking gear signal (CONFIRMED — prime config regression)
Verified in the diff: `2ad1c2d` flips `augment_gear_direction=True → False` (`parking_config.py:117`, also `:305`). That augmentor was the only mechanism injecting the *upcoming* D/R gear at standstill (lookahead 4 s). With it off, nothing teaches the model to predict the gear it's about to engage → reinforces C1's NEUTRAL bias → S1/S2/S7.
- **Important nuance / honesty:** that same augmentor has the known flaw flagged in [[pudo-parking-py-critique-2026-06-14]] (it moved the *gear* forward without moving the *motion* forward → "shift to D but stay still"). So the fix is **not** a blind re-enable. Either (a) **re-enable it AND couple it with motion-forward** (shift speed/pose so the car starts moving at the gear change), or (b) **supervise gear over the full future horizon** (not just t+1) so the upcoming D/R is learned without the augmentor. (a)+(b) together is safest.
- **The likely true story of "materialization-only made it worse":** `2ad1c2d` bundled *two* things — disabling `augment_gear_direction` (config) and the clamp-arrivals-only fix. If Model B was retrained at/after `2ad1c2d`, the gear-augmentation disable is a strong regression candidate **independent of the materialization data**. NEEDS-DATA: which commit each model trained at.

### C-fact — the model cannot emit hazard (CONFIRMED — corrects the on-road note)
Indicator head is `nn.Linear(input_size, 3)` → off/right/left only (`indicator_output_head.py:15,24`). The loss masks hazard: `mask_ignore = (indicator_state > 2) | (indicator_state < 0)` → `loss = where(mask_ignore, 0, loss)` (`imitation_losses.py:488,495`). So hazard (=3) frames are never supervised and hazard is not an output class. **S3 hazards are entirely the wrapper (W-A), not VSO/data.**

### C3 — directional indicator unsupervised on exactly the PUDO frames → S4 (CONFIRMED)
On PUDO frames the human used hazards → those frames are masked out of the indicator loss → the directional (left/right) head is **never trained on PUDO scenarios**, and there's no curb-side grounding feature. So "indicated left while parked on the right" is expected: the indicator is undertrained precisely where it's used. Fix: derive a directional indicator target for PUDO frames (curb side / approach geometry), or stop masking and add a hazard class with the wrapper handling display.

---

## C. Materialization (secondary, real, but not the shift-by-wire cause)

The verifier corrected several over-claims (reverse is **not** structurally invisible — gear-change buckets carry raw `-1`; the prior clamp/else-branch NEUTRAL-pinning is already fixed/dormant). What stands:
- **M1 — short PUDO approach window** (`_parking_window`: max(30 m-back, 12 s-back) → tighter bound, end at +1 s, AND-ed with a ±2 s "moving" mask) under-teaches braking-from-cruise and the stop is anchored at the human neutral-onset (not the trip pin). → S5. (Regression magnitude vs the prior dataset is NEEDS-DATA.)
- **M2 — PUDO/UnPUDO buckets are recent-only (`PARKING_PUDO_PUDO_START_DATE=2025-12-01`) + relaxed quality filters** (`PARKING_PUDO_DISABLED_DATA_QUALITY_EXCLUSIONS`, flagged "temporary, revisit before promoting" in the README). Park/unpark buckets keep full history + strict filters, so this thins/skews only the PUDO side. Re-enabling the disabled quality exclusions is an available lever. → S5/S6 and overall PUDO quality.
- My earlier-merged datamodule fixes (N1 forward-unpark detection, N2 duration gate, N3 clamp guard, N5 clamp speed) are correct and still wanted — but they help the model *perceive/label* departures; they do **not** fix the gear-head bias or the wrapper gating, which is why they alone wouldn't rescue these runs.

---

## D. The "is the wrapper constant?" caveat (changes the regression story)

The on-road note assumed the wrapper is constant across Model A/B, so "materialization-only" pinned the regression on data. **That assumption is unverified and probably wrong:** W-A (hazard) and W-C (PARK latch) were added in `0b5120975beb`, and `2ad1c2d` changed the gear-augmentation config. If Model B's prior *working* deployment predated those commits, then the regression is the **wrapper + config changes**, not the materialization data. This reframes the whole "materialization made it worse" framing.
- **NEEDS-DATA (highest priority):** for each model, the exact (a) deployment-wrapper commit, (b) training commit (before/after `2ad1c2d`), (c) materialization version. This single table will separate wrapper-regression vs config-regression vs data-regression.

---

## E. Recommended actions (ranked)

**Immediate on-road isolation (no retrain):** redeploy with `enable_end_of_route_hazard_lights=False`, `enable_end_of_route_gear_latch=False`, and confirm shift-by-wire falls back to the manual gear. If the dangerous/stuck behavior largely disappears, the wrapper (W-A/W-B/W-C) is the dominant cause — fast, decisive signal.

1. **W-B fix** — under shift-by-wire ON, don't clamp waypoints to zero purely on the *predicted* NEUTRAL/PARK; fall back to the actual vehicle gear, and require a confident DRIVE/REVERSE before forcing forward/reverse-only. (blocker, S1/S2/S7)
2. **C2 fix** — restore forward-looking gear supervision: re-enable `augment_gear_direction` **with the motion-forward coupling** (or supervise gear over the full horizon). (blocker, S1/S2/S7)
3. **W-A fix** — gate hazard forcing on stationarity+park, not route sparsity. (blocker, S3)
4. **W-C fix** — release the PARK latch on driver intent. (blocker, S1/S2/S6)
5. **C3 fix** — supervise a directional indicator on PUDO frames (curb-side). (major, S4)
6. **M1/M2** — lengthen the PUDO approach window / anchor toward the pin; re-enable the disabled PUDO quality filters; audit per-bucket counts. (major, S5/S6)
7. Keep the merged N1–N5 datamodule fixes.

## F. NEEDS-DATA checklist
- Per-model: deployment-wrapper commit, training commit (vs `2ad1c2d`), materialization version. *(separates wrapper vs config vs data regression — do first)*
- Distribution of `POLICY_GEAR_DIRECTION[:, 1]` on unpark/reverse buckets (expect ~all NEUTRAL if C1/C2 dominate).
- Per-bucket row counts for `dc_unpudo*`, `dc_unpark_gear_change` (reverse), and PUDO deceleration buckets.
- Whether `enable_end_of_route_*` toggles were on for the failing runs.

## File index
- Wrapper (`…main_cherrypick_generic_data:wayve/ai/zoo/deployment/deployment_wrapper.py`): `_postprocess_outputs` :3519-3550 · `_enforce_gear_position_on_waypoints` :364-376 · gear→position lookup :3323-3333 · `_force_hazard_indicator_weights_at_route_end` :3382-3404 · `_apply_end_of_route_parking_latch` :3360-3378 · `_end_of_route_mask` :3452-3456 · toggles :3274-3290.
- Training: `wayve/ai/zoo/losses/imitation_losses.py:484-495,505` · `wayve/ai/zoo/outputs/indicator_output_head.py:15,24` · `wayve/ai/si/configs/parking/parking_config.py:117,305` (commit `2ad1c2d` diff) · `wayve/ai/si/datamodules/parking.py` (`add_parking_mode`).
- Materialization (`boris/pudo_generic_materialization`): `parking_pudo/{signals.py,filters.py,common.py}` (`_parking_window`, `PARKING_PUDO_PUDO_START_DATE`, `PARKING_PUDO_DISABLED_DATA_QUALITY_EXCLUSIONS`).
