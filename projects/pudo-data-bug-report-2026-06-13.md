# PUDO/UnPUDO Data & Pipeline Bug Report — 2026-06-13

Investigation of the reported PUDO/unpark failures against the actual code on `boris/pudo_generic_materialization` (data creation) and `boris/training/main_cherrypick_generic_data` (training). Every finding below was cross-checked against the source; line references and confidence are stated. Companion to [[parking-capability-architecture-research]].

> **Reading note — taxonomy.** In the bucket taxonomy, **unpark** = leaving a *parked* spot, **unpudo** = leaving a *PUDO stop* (the robotaxi pulling away after a pickup/drop-off). Your reported "unpark" symptoms are operationally the **unpudo / departure** behavior. This matters: the BC mix trains **22% unpudo but 0% unpark** (`parking_config.py:54,64`), so the relevant signal *is* present — the bugs are in how it's labelled, clamped, and weighted, not (only) in a missing bucket.

> **Reading note — the stats are ANCHORS, not the trained dataset.** `/tmp/pudo_bucket_stats.yaml` is the `parking_pudo/anchors` dataset: **one frame per anchor**. The model trains on the `default` (windowed) dataset built *from* these anchors. This is why `ca_*_short == ca_*_long`, `dc_pre_* == dc_*`, and the failed-to triplets are exactly equal — **anchor-counting artifacts, BY-DESIGN, do not chase them**. (Your own "94.5% unique-sample" warning confirms training data is ~94.5% unique, not 4× duplicated.) The equalities that *do* signal real bugs are the ones driven by filter definitions, not windowing — Findings P-1 and P-3 below.

---

## Symptom → root-cause map

| Symptom | Primary cause (confidence) | Secondary |
|---|---|---|
| **U1** not pulling out after gear shift | **U-1** neutral-clamp zeroes the departure trajectory (CONFIRMED mechanism) · **U-2** gear-direction augmentation moves gear to D without moving the trajectory (CONFIRMED, active in BC) | U-4 |
| **U2** pulling out when unsafe | **U-3** no `failed_to_unpudo` negative + `unpudo_ca_unsafe_weight=0` → zero "don't pull out" signal (CONFIRMED) | P-1 (spurious neutral "parks") |
| **U3** gear not switching / flickering | **U-2** gear-vs-motion contradiction · **P-4** over-broad gear-change anchors (CONFIRMED) | U-5 (standstill gear aug — OFF in BC, watch) |
| **P1** sometimes not stopping | **P-1** PUDO requires a `gear==0` (NEUTRAL) segment → drive-through stops missed (CONFIRMED mechanism; partial — see caveat) · **P-3** `ca_pudo` over-broad | P-2 |
| **P2** stop not at optimal position | **P-2** 100 m trip-match radius + clamp-to-neutral biases the stop point (CONFIRMED/ SUSPECTED) | P-3 |

---

## BLOCKERS / MAJORS — Training side (`main_cherrypick_generic_data`)

### U-1 — `clamp_policy_at_first_neutral` zeroes the *departure* trajectory → U1 (BLOCKER, mechanism CONFIRMED; trigger SUSPECTED — check first)
`wayve/ai/si/datamodules/parking.py:766-801`. The clamp runs when `parking_mode OR unparking_mode` (`:778`), finds the **first** frame where `POLICY_GEAR_DIRECTION == NEUTRAL` (`:785`), and then:
```python
data[DataKeys.POLICY_GEAR_DIRECTION][clamp_idx + 1:] = NEUTRAL      # :795
data[DataKeys.POLICY_POSE][clamp_idx + 1:]      = pose[clamp_idx]   # :796  freeze pose
data[DataKeys.POLICY_WAYPOINTS][clamp_idx + 1:] = waypoints[clamp_idx]  # :797  freeze path
data[DataKeys.POLICY_SPEED][clamp_idx:]         = 0.0               # :798  zero speed
```
For an **arrival** (parking) this is correct — stop and hold. But it *also fires on `unparking_mode`*, and a departure window begins parked, i.e. in NEUTRAL. So `clamp_idx` lands at (or near) frame 0 and **the entire pull-out trajectory after it is frozen to a standstill with speed 0** — the supervision becomes "after the gear goes to N, stay still forever." That is precisely U1: the car has shifted but the target says don't move.
- **Why SUSPECTED on the trigger:** it depends on the unpudo/unpark window containing an early NEUTRAL frame in `POLICY_GEAR_DIRECTION`. Departures start parked, so this is very likely, but it's the one thing to confirm empirically.
- **Check (15 min):** for a handful of `unparking_mode=True` samples, print `POLICY_GEAR_DIRECTION`, `POLICY_SPEED`, `POLICY_WAYPOINTS` before/after `clamp_policy_at_first_neutral`. If the post-clamp speed is ~0 for the whole window, this is confirmed and is your #1 U1 bug.
- **Fix:** do not clamp on `unparking_mode`; clamp only the **terminal** stop of an arrival. For departures, if a leading neutral must be handled, clamp only frames *before* the first non-neutral gear, not after it.

### U-2 — `augment_gear_direction` brings gear forward to D but leaves speed/pose at standstill → U1 + U3 (MAJOR, CONFIRMED, ACTIVE in BC)
`augment_gear_direction=True, gear_direction_lookahead_sec=4.0` in the BC datamodule (`parking_config.py:117`). The augmentor (`wayve/ai/zoo/augmentations/gear_direction.py`, ~`:160-171`) overwrites **all future** `POLICY_GEAR_DIRECTION` to the upcoming gear (e.g. D) when stationary with a gear change up to 4 s ahead — **but never touches `POLICY_SPEED`/`POLICY_WAYPOINTS`**. Target becomes "predict gear=D for 4 s but stay still." Stacked with U-1 (clamp runs first in `insert_parking_data`, then this augmentation), you get the explicit contradiction *gear=D, speed=0, frozen pose* — a textbook "shift but don't move" (U1) and an ambiguous-at-standstill gear label (U3).
- **Fix:** when bringing the gear forward, also bring the motion forward (shift the speed/pose profile so motion starts at the change point), or exclude the still-standstill target frames from the gear overwrite. At minimum ensure it is not undone/contradicted by the clamp.

### U-3 — No "don't pull out, it's unsafe" signal → U2 (MAJOR, CONFIRMED)
Two confirmations in the config: `unpudo_ca_unsafe_weight = 0.0` ("at CA > speed limit", `parking_config.py:62`) and **no `failed_to_unpudo` bucket is referenced anywhere** in `train_partitions` (the `pre_ca_unpudo` nest contains only positive `pre_ca_unpudo_{usa,uk}`). The materialization *does* produce `ca_failed_to_unpudo_*` / `pre_ca_failed_to_unpudo_*` (≈5,564 uk + 4,450 usa unique) — they are simply discarded. Every trained departure example is a successful pull-out, so the policy's learned trigger is essentially "gear allows it → go," with no dependence on oncoming-traffic clearance. That is U2.
- **Fix:** wire `ca_failed_to_unpudo_{uk,usa}` (and/or `pre_ca_failed_to_unpudo`) into the unpudo nests, mirroring how `pre_ca_failed_to_pudo` is wired into `pre_ca_pudo`. Give it real weight (~3-4% of batch). Weight on **unique** events (anchors triplicate — see reading note).

### U-4 — `unparking_weight = 0.0`, no `unpark` buckets trained (MAJOR if true parking is in scope; otherwise BY-DESIGN)
`parking_config.py:64` `unparking_weight = 0.0`; comment `:53-54` "…and 0% unparking." No `dc_unpark*`/`ca_unpark*`/`pre_ca_unpark*` appears in `train_partitions`, though ~85 k unpark rows are materialized. For a **PUDO-first** model this is defensible (departures are unpudo, which *is* trained). Flagging so it's a conscious choice: if the ODD ever includes pulling out of a genuine parked spot, this is 0 signal.

### P-2 (training half) — stop position biased by clamp + gear-label cleanup → P2 (MAJOR/SUSPECTED)
With `policy_path_num_points=0` in BC, the stop target is just `POLICY_WAYPOINTS` clamped at the first NEUTRAL (U-1's `:797`). `enable_gear_label_cleanup` shifts the NEUTRAL onset **earlier** (`_shift_neutral_gear_after_stop`, `gear_label_cleanup_stop_buffer_sec=0.5`), so the clamped stop is biased to *before* the human's true stop, and `enable_route_shortening_for_parking` truncates the route map to the entry — both push the learned stop earlier/short. Net: systematic offset in stop position (P2).
- **Check:** compare clamped `POLICY_WAYPOINTS[clamp_idx]` against the raw human stop pose for PUDO samples; quantify the offset from the 0.5 s buffer + backward N shift.
- **Fix:** clamp at the true stationary point (speed≈0), not the cleanup-shifted N onset; or supervise an explicit goal pose.

---

## BLOCKERS / MAJORS — Materialization side (`pudo_generic_materialization`)

### P-1 — "parked" is detected as `gear == 0`, which is **NEUTRAL, not PARK** → P1, and spurious unpudo (BLOCKER, mechanism CONFIRMED; impact partial — caveat)
The gear field is *direction*: `VehicleGearDirection = {FORWARD=1, NEUTRAL=0, REVERSE=-1, UNAVAILABLE=None}` — **there is no PARK code** (`wayve/core/data/schema/state/vehicle.py:13-23`; field doc `:52`). The materializer keys every park/PUDO event off `gear == 0`:
```python
starts, ends = mask_to_segments(signals.gear == 0)   # signals.py:411 (_parking_segments) and :336 (_trip_pudo_context)
```
and `select_park_pudo_event` (`filters.py:87-111`) has **no path to an event without a `gear==0` segment** ≥ `min_parking_duration_sec=2.0`. Consequences:
1. A robotaxi that **rolls to a stop in Drive and holds the brake** (the common drop-off) never enters neutral → produces **no PUDO anchor** → undertrained "stop here" → **P1**.
2. A momentary **NEUTRAL coast** is mis-anchored as a "park," and its end as an unpudo/unpark departure → spurious departure exemplars, some unsafe → feeds **U2**.
- **Caveat / honest scoping:** `dc_pudo_trip_uk = 20124` exists, i.e. ~58% of UK PUDO anchors *do* coincide with a `gear==0` segment, so this does **not** zero out PUDO data — it misses the **subset** of stops that never leave Drive. Whether that subset is large depends on how the platform encodes a braked-in-Drive stop. **Check (highest priority for P1):** on several known robotaxi drop-off runs, plot `get_gear(df)` through the stop — does it reach 0? If many drop-offs never hit 0, this is the dominant P1 cause.
- **Fix:** define "stopped" from `speed_mps ≈ 0` over a minimum duration (already computed) — optionally AND a real standstill/park signal — instead of `gear == 0`. Keep `gear==0` as *sufficient*, not *necessary*. Also fix the "Park" docstrings (`signals.py:509-519`) which assert a Park state that doesn't exist.

### P-3 — `ca_pudo` selects "near *any* gear change in ±30 s PUDO context", not "near a PUDO stop" → P1/P2 (MAJOR, CONFIRMED)
`ca_pudo_usa (29355)` and `pre_ca_pudo_usa (29355)` **exceed** `dc_pudo_usa (28334)` — interventions outnumbering the events they intervene on, which is backwards. Root cause: `select_intervention_near_gear_change` (`intervention_filters.py:130`) gates only on `near_gear_change` within `gear_window_sec=30 s` plus a hazard/trip context **dilated ±30 s** (`signals.py:382-384,346`). So any disengagement within 30 s of *any* gear change inside a ±30 s hazard/trip halo becomes `ca_pudo`. Parking's CA buckets go through *strict* filters (hence the sane `pre_ca_parking_usa=2714 ≪ dc_park_usa=10579`), but PUDO's relaxed base does not — which is also why `pre_ca_pudo == ca_pudo_short == ca_pudo_long` (nothing distinguishes them at the anchor). The PUDO intervention head is therefore trained on frames that are not PUDO stops → diluted/contaminated stop signal (P1, P2).
- **Fix:** gate `ca_pudo`/`pre_ca_pudo` on proximity to an actual `dc_pudo` park anchor (as `ca_unpudo` already does via `select_intervention_near_departure_event`, `intervention_filters.py:240`), not "near any gear change in dilated context."

### P-2 (materialization half) — trip→anchor match radius is 100 m, timestamp unused → P2 (MAJOR, CONFIRMED)
`PARKING_PUDO_TRIP_MATCH_DISTANCE_M = 100.0` (`signals.py:37`). `_trip_pudo_context` (`signals.py:335-344`) tags a `gear==0` segment as PUDO if its entry frame is within **100 m** of any trip lat/lon — and the trip-event **timestamp column is collected but never used** for matching (`signals.py:322-323` reads only lats/lons). 100 m is huge for urban PUDO: the nearest gear-0 stop in a 100 m radius (a light, a double-park shuffle) can be tagged and its anchor used as the stop-position target → stop trained up to ~100 m off the real drop-off (P2).
- **Fix:** tighten to ~10-20 m **and** gate on temporal proximity using the already-collected trip timestamp.

### P-4 — gear-change anchors are over-broad (largest bucket, 80,184) → U3 (MAJOR, CONFIRMED mechanism)
`select_gear_change_event` (`filters.py:367-409`) anchors at **every** `np.diff(gear) != 0` transition in a ±30 s-dilated PUDO context, with **no tie to a validated park/PUDO event** and window `before=0.0, after=0.5 s`. A single parallel-park/PUDO shuffle (D→N→R→N→D) produces several separate anchors, so `dc_pudo_gear_change` (67 k usa / 80 k uk) exceeds `dc_pudo` itself by 2-3×. Densely sprinkling "change gear now" supervision around any PUDO-context maneuver is a mechanical driver of gear flicker (U3). It's held to 8% of the batch by weights (`dc_pudo_gear_change_weight=0.04` + `dc_unpudo_gear_change_weight=0.04`), which limits the damage — but the *unpark/unpudo* gear-change buckets are unevenly wired (the `dc_unpark_gear_change` family isn't trained at all).
- **Fix:** restrict gear-change anchors to transitions into/out of the parked state of a *validated* park/PUDO event (reuse `_parking_segments` starts/ends); add a min dwell between counted transitions.

---

## Things that look alarming but are NOT bugs (don't chase)

- **`ca_*_short == ca_*_long`, `dc_pre_* == dc_*`, failed-to triplets** — anchor-counting artifacts (one frame per anchor); they diverge in the windowed `default` dataset that's actually trained. *(This corrects an over-claim in the first analysis pass that read these as 4× training duplication; your 94.5%-unique warning confirms training data is not heavily duplicated.)*
- **`exclude_autonomous` absent from pre-CA** — intentional (pre-CA frames are AV-before-handover; per README).
- **Relaxed PUDO exclusions vs strict park/unpark exclusions** — intentional Zak-parity policy, flagged temporary in the README; explains most of the parking-vs-pudo count asymmetry.
- **`reconstruct_gear_from_speed=False` in BC, `enable_augment_standstill_gear=False` in BC** — already off in the shipping path; only a flicker risk if re-enabled (diffusion config has them on). If you ever enable standstill gear aug, mask the gear (input-dropout) rather than substituting a random valid gear.
- **deu/jpn/global materialized but usa+uk-only trained** — correct for a UK/US ODD; just don't pay to materialize regions you won't train.

---

## Verification checks before acting (cheapest first)

1. **U1 clamp (15 min):** dump `POLICY_GEAR_DIRECTION/SPEED/WAYPOINTS` for ~10 `unparking_mode` samples pre/post `clamp_policy_at_first_neutral`. Frozen-to-zero ⇒ U-1 confirmed.
2. **P1 gear encoding (30 min):** plot `get_gear(df)` across confirmed robotaxi drop-offs. If drop-offs stay at 1 (forward) ⇒ P-1 is the dominant P1 cause; if they hit 0 ⇒ P-1 is partial and U-1/U-3 dominate.
3. **Wired root sanity:** confirm BC trains `PUDO_BUCKETS_ROOT` (`..._gear_fix`, `parking_config.py:41`) vs `PARKING_BC_PUDO_BUCKETS_ROOT` (`..._no_low_steering`, `:42-46`) — and that these stats came from the trained root. Re-pull `default`-dataset counts (not anchors) for the actual weighting decision.

## Recommended fix order (impact × cost)
1. **U-1** (clamp on departures) and **U-2** (gear-forward without motion) — directly attack U1, cheap config/logic fixes.
2. **U-3** (wire `failed_to_unpudo` + non-zero unsafe weight) — the only structural fix for U2.
3. **P-1** (speed-based stop detection) — gated on check #2; the structural fix for P1.
4. **P-2** (tighten trip radius to ~15 m + use timestamp; clamp at true stop) — P2.
5. **P-3 / P-4** (tie `ca_pudo` and gear-change anchors to validated park/PUDO events) — cleans P1/P2/U3 supervision.

---

## File index (branch · path · line)
- Training: `main_cherrypick_generic_data:wayve/ai/si/datamodules/parking.py` (`clamp_policy_at_first_neutral` :766-801; `_compute_parking_mode` :295-440) · `wayve/ai/zoo/augmentations/gear_direction.py` (~:160-171) · `wayve/ai/si/configs/parking/parking_config.py` (weights :52-74; flags :117-134,305-319; roots :41-46) · `wayve/ai/si/datamodules/otf.py` (pipeline order)
- Materialization: `pudo_generic_materialization:wayve/ai/services/sampling/datasets/parking_pudo/signals.py` (gear==0 :336,411; trip match :37,322-344; "Park" docstrings :509-519) · `filters.py` (`select_park_pudo_event` :87-111; `select_gear_change_event` :367-409) · `intervention_filters.py` (`select_intervention_near_gear_change` :130-219; `select_intervention_near_departure_event` :240) · `wayve/core/data/schema/state/vehicle.py:13-23`
