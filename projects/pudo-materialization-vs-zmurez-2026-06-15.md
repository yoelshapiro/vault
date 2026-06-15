# PUDO/UnPUDO Detection: Generic Materialization vs Zak's On-the-Fly (zmurez/pudo) — 2026-06-15

A thorough comparison of how the **generic materialization** (`boris/pudo_generic_materialization`, tip `32e3252`) detects/labels PUDO & UnPUDO vs how **Zak does it on the fly** in `zmurez/pudo` (tip `e45cf33`, experimental MCV stack), plus the generic-branch detection bugs and their corrective actions. Both branches were read directly; the load-bearing claims were re-verified. Companion to [[pudo-onroad-failure-rca-2026-06-14]], [[pudo-parking-py-critique-2026-06-14]].

> **Bottom line.** Both pipelines use the *same* core heuristics — stop = `gear==0`, PUDO = hazard lights near the stop, raw human indicator (hazard preserved) as the indicator target, a short ~30 m/12 s approach window, and unsigned speed. So those shared choices are **not** what regressed a working (Zak-trained) model. The regression is in **three things the generic branch does that Zak's does not**: (1) it drops Zak's *gear-gap compensation* (Zak back-dates park to where speed hits 0 **and** patches missing gear from a learned park-intention; generic does neither), (2) it **deletes every PARK event run-wide** as soon as the run has any robotaxi trip event, and (3) it adds **100 m spatial-only trip matching** (no time gate) to define PUDO. Net: the generic PUDO/park training signal is both **thinner** (misses real stops) and **noisier** (mislabels) than Zak's.

---

## 1. Side-by-side: how each decides PUDO / UnPUDO

| Axis | Zak on-the-fly (`zmurez/pudo`) | Generic materialization (`pudo_generic_materialization`) | Same? |
|---|---|---|---|
| **Where it runs** | live in `SingleRunDataset._post_init` per run (NumPy), sliced per-sample | batch Spark materialization → buckets | — |
| **Stop/park signal** | gear→Park (`gear==0`) **then** `clean_up_gear_stopped` back-dates Park to where `|speed|` hit 0; **and** `pred_park_intention` forces `gear=0` where humans labeled "parked" but CAN never logged it (`single_run.py:335-343`) | `gear==0` only + `_smooth_short_gear_segments`; **no** speed back-date, **no** intention patch (`signals.py:389-390,425`) | **NO — key delta** |
| **gear==0 meaning** | NEUTRAL in schema; Zak treats as Park but compensates (above) | NEUTRAL in schema; treated as Park with no compensation | partial |
| **PUDO vs PARK** | hazard (indicator==3) within ±10 s of the park moment, **minus office geofences** (`single_run.py:349-369`) | hazard **OR** robotaxi trip-table match within **100 m** (spatial only, timestamp unused), dilated ±10 s (`signals.py:314-360,748-754`) | **NO — generic adds trip-table** |
| **Office/depot handling** | office geofences forced to PARK (employees park w/o hazards) | no geofence carve-out; instead deletes parks run-wide on trip presence (see §2.2) | NO |
| **UnPUDO / departure** | gear-out-of-Park, anchored to **first moving frame** (`sampler.py:864`); no PUDO/unpark split on departure | gear-out-of-Park, anchored to first movement (off-by-one now fixed); no PUDO/unpark split | mostly same |
| **Reverse** | gear value `12` = reverse (distinct integer); motion via egopose geometry; reverse only *excluded from generic driving* and re-splits route | gear `-1` = reverse but **not differentiated** in stop/departure detection; unsigned `get_speed` (signed accessor exists, unused) | both weak; Zak slightly better (distinct gear value used downstream) |
| **Indicator target** | raw human indicator incl. **hazard=3**; hazard preserved (lead-time aug skips hazard) → model emits hazard for PUDO | raw human indicator; hazard is the PUDO context signal (but the BC indicator head is 3-class and **masks hazard in the loss**, so the model can't emit it — see RCA) | shared confound; differs in head |
| **Gear target** | raw CAN gear (0/1/12) after cleanup | raw CAN gear (-1/0/1) | same family |
| **Approach window** | 30 m or 12 s before (whichever closer), +1 s after, +3 s before indicator onset if indicator within 30 m (`single_run.py:158-212`) | 30 m or 12 s before (`max`→tighter), +1 s after, AND-ed with ±2 s "moving" mask; indicator extension capped at 30 m (`signals.py:571-589`) | **same short window** |
| **PUDO-vs-PARK authority** | live hazard heuristic (`pred_stop_type`); human/VLM JSONs only train aux classifiers (park_type→direction, park_intention→gear patch, stop_reason→true-park, park_quality→exclusion) | live hazard ∪ trip heuristic; no human/VLM labels | NO |
| **Date / quality filters** | full-history runs; quality via learned classifiers + geofences | PUDO/UnPUDO buckets **recent-only (≥2025-12-01)** + relaxed quality filters (`filters.py:52,114,161-166`) | NO — generic narrower |

**Reading of the table:** the rows marked "same" (gear==0 stop, hazard=PUDO, raw indicator, short window, unsigned speed) were all present in Zak's working pipeline too, so they cannot explain a *regression* from swapping to the generic data. The "NO — key delta" rows are where the generic branch is materially worse, and are the regression suspects.

---

## 2. Generic-branch detection bugs + corrective actions (ranked)

### 2.1 No gear-gap compensation → real stops are missed — **BLOCKER (regression vs Zak)**
You accept `gear==0` (neutral) as the stop signal. The problem is the generic branch uses it **raw**, while Zak makes it work by two compensations the generic branch lacks:
- **Speed back-dating** — Zak's `clean_up_gear_stopped(gear, speed, frame_rate)` moves the Park label back to where `|speed|` actually hit 0 (`single_run.py:343`). Generic only runs `_smooth_short_gear_segments` (duration smoothing), never anchors to speed.
- **Missing-gear patch** — Zak forces `gear=0` wherever the learned `pred_park_intention == "parked"` but the CAN log never recorded Park (`single_run.py:339-342`). Generic has nothing: if the driver held the brake in DRIVE (the common robotaxi curbside PUDO) and never shifted out of forward, **no `gear==0` segment exists → the stop is never detected**, never split into PUDO, never given approach/departure windows.
- **Symptom:** "doesn't slow / stop for the PUDO pin" — the behavior simply wasn't in the materialized data, where it *was* (recovered) in Zak's.
- **Corrective action:** add a speed-anchored stop detector before/alongside `gear==0` — detect `|speed_mps| ≈ 0` for ≥ `min_parking_duration_sec`, union it with the neutral segments, and (optionally) carry a "parked" signal analogous to `park_intention` so held-in-drive stops are recovered. At minimum port `clean_up_gear_stopped`'s speed back-dating so the anchor lands at the true stop. Add a regression test: a synthetic run holding gear=1 at speed 0 for 10 s must yield a stop.

### 2.2 Run-wide PARK deletion on any trip event — **MAJOR (generic-only)**
`select_park_pudo_event` (`filters.py:89-90`): `if event_type == "park" and run_has_parking_pudo_trip_events(df): return np.zeros(...)`. And `run_has_parking_pudo_trip_events` (`signals.py:187-191`) is True if the run has **any** trip event anywhere. So a robotaxi run that did one pickup has **all** its legitimate normal parks (depot, charging, traffic-stop-to-park) **deleted run-wide** — not just the PUDO stop. Zak has no such global suppression (it splits per-stop via geofence/hazard). This starves and biases the PARK class and removes valid park-approach windows.
- **Corrective action:** remove the run-level short-circuit; split park vs PUDO **per stop** using the existing per-segment `is_pudo` vote (already computed at `filters.py:111`). Let each segment fall into park or pudo by its own hazard/trip context.

### 2.3 PUDO defined by 100 m spatial-only trip match (timestamp unused) — **MAJOR (regression vs Zak)**
Generic adds trip-table matching that Zak doesn't use. `_trip_pudo_context` (`signals.py:314-360`) matches a stop to the nearest trip lat/lon within `PARKING_PUDO_TRIP_MATCH_DISTANCE_M = 100.0` (`:37`), and the trip-event **timestamp is aggregated but never compared to the stop time** — purely spatial. 100 m is a whole block. So a normal park later in the day, within 100 m of an earlier pickup waypoint, gets **mislabeled PUDO**; two distinct PUDO stops 60 m apart collapse. Zak's hazard window is temporally tight (±10 s of the actual stop) and has no trip table.
- **Corrective action:** add a temporal gate (`|stop_time − trip_time| ≤ tolerance`, reuse the hazard dilation window) **and** tighten the radius toward GPS error (~20–30 m). The timestamp column is already plumbed — wire it into the match.

### 2.4 `ca_pudo` gated on "any gear change in ±30 s dilated context", not a real PUDO stop — **MAJOR**
`select_intervention_near_gear_change` (`intervention_filters.py:185-190`) accepts an intervention within `gear_window_sec=30` of **any** `np.diff(gear)!=0` whose frame matches dilated PUDO context — e.g. a D→N→D coast at a light. So `ca_pudo`/`pre_ca_pudo` fire on non-PUDO interventions and can exceed `dc_pudo` (which requires a real ≥2 s segment + 5 m approach). The PUDO CA buckets use a looser PUDO definition than the DC buckets.
- **Corrective action:** gate `ca_pudo`/`pre_ca_pudo` on proximity to an actual detected park/PUDO *segment* (reuse `_parking_segments` + segment-span `_pudo_context`, as `select_intervention_near_departure_event` already does), not on any gear change.

### 2.5 Reverse not differentiated; unsigned speed — **MAJOR**
Stops are `gear==0` only, so a reverse-into-bay maneuver (gear `-1`) is not part of any park segment; movement/approach use `np.abs(speed_mps)` (`signals.py:588,629`) so reverse looks identical to forward, and `get_signed_speed` (`accessors.py:24`) is unused. Reverse PUDO/UnPUDO is silently dropped or mis-anchored. (Zak isn't much better here but at least carries reverse as the distinct gear value 12 downstream.)
- **Corrective action:** include reverse explicitly in stop/maneuver detection; carry `get_signed_speed`; emit a reverse flag so reverse PUDO/UnPUDO get correct window semantics.

### 2.6 Short approach window (30 m / 12 s, `max`→tighter) — **MAJOR (shared with Zak, but worth fixing)**
`_parking_window` (`signals.py:581-589`): `start = max(anchor−30m, anchor−12s)` (the *tighter* bound), then AND-ed with a ±2 s moving mask. At ~30 km/h that's ~3–4 s of approach — only the final crawl. The model never sees the decision-to-pull-over. Zak uses the same short window, so this isn't the regression, but it caps how well either model can learn good stop placement.
- **Corrective action:** make the approach the **union (earliest)** of larger distance/time caps (e.g. 60–80 m / 20–25 s) and let the indicator onset extend to that cap.

### 2.7 PUDO recent-only (≥2025-12-01) + relaxed quality filters — **MAJOR for recall**
`PARKING_PUDO_PUDO_START_DATE = "2025-12-01"` sits first in `PARKING_PUDO_BASE_EXCLUSIONS` (`filters.py:52,114`), inherited by all PUDO/UnPUDO DC/CA buckets; `PARKING_PUDO_DISABLED_DATA_QUALITY_EXCLUSIONS` (`:161-166`) relaxes tag/short-run/diversion/steering filters. So PUDO is ~6 months of noisier data. Combined with 2.1, very few true PUDO approach windows reach training. (Park/unpark keep full history — intentional per README, but it compounds the PUDO recall problem.)
- **Corrective action:** extend the PUDO start date back as far as hazard/trip context is reliable; re-enable quality filters once notebook parity is established (the code comments mark these as temporary).

### Confirmed already-fixed / reconciled (don't re-chase)
- Departure-anchor off-by-one → **fixed** (searches from `park_end_idx`, `signals.py:633-640`).
- UnPUDO window not clipped at next stop → **fixed** (`cap_idx`, `signals.py:695` / `filters.py:201-202`).
- Approach vs departure inconsistent PUDO-context window → **reconciled** on the parked-segment span (`filters.py:110-111`, `signals.py:691-692,743-744`). **Residual:** the gear-change buckets and per-frame `_context_matches` still classify on a single frame — route them through the same segment-span vote.

---

## 3. What this says about the regression ("materialization-only swap made a working model worse")

The working model used Zak-style data. Swapping to the generic materialization changed the PUDO/park training signal in exactly the ways that hurt:
1. **Fewer true stops** (2.1: no speed/intention gear compensation → held-in-drive PUDO stops vanish) → the model under-learns slowing/stopping → "passes the pin."
2. **Biased/contaminated PARK & PUDO classes** (2.2 run-wide park deletion + 2.3 100 m trip mislabeling) → the stop/PUDO supervision the model does get is noisier than Zak's hazard+geofence labels.
3. **Inflated, off-target CA buckets** (2.4) → intervention supervision tied to non-PUDO events.
4. Less PUDO data overall (2.7).

The shared weaknesses (short window, hazard-as-PUDO, unsigned speed, gear==0) are real but were tolerated by the working model, so fixing them is *improvement*, not *regression repair*. The regression-repair priorities are **2.1, 2.2, 2.3** (and 2.4).

## 4. Recommended port from Zak (cheapest high-value wins)
- Port `clean_up_gear_stopped` (speed back-dating of the park anchor) and a park-intention-style recovery into the generic stop detector (fixes 2.1) — this is the single biggest lever and directly mirrors what made Zak's detection robust.
- Replace the run-wide park suppression with Zak's per-stop geofence/hazard split (fixes 2.2).
- Add a temporal gate + tighter radius to the trip match, or drop the trip table in favor of Zak's hazard+office-geofence split (fixes 2.3).

## File index
- Generic: `boris/pudo_generic_materialization:wayve/ai/services/sampling/datasets/parking_pudo/{signals.py (stop `:389-390,425`; trip match `:314-360,37`; window `:571-589`; departure `:629-640,695`), filters.py (run-wide park suppression `:89-90`; start date `:52,114`; quality `:161-166`), intervention_filters.py (`:185-190`)}`; accessors `wayve/ai/zoo/sampling/accessors.py:19-26`; gear enum `wayve/core/data/schema/state/vehicle.py:13-23`.
- Zak: `zmurez/pudo:wayve/ai/experimental/dataset/single_run.py` (gear cleanup + intention patch `:335-343`; `pred_stop_type` hazard split `:349-374`; park window `:158-212`); `samplers/sampler.py` (`get_unparking_indices` `:864`; `get_parking_indices` pudo/park `:888-921`); `ipace.py` (gear `:1145`, indicator `:1110`); `ipace_constants.py` (`GEAR_REVERSE=12`, geofences, label maps).
