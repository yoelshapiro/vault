# Parking Capability — Architecture Research

## Overview
- **What it is:** Research project to find novel, production-viable architecture extensions that give the end-to-end driving model full parking capability (street → lots → multi-story → gates → preferred → memory parking).
- **Why it matters:** Basic parking (e.g. parallel parking) is reachable with curated data, but the harder requirements expose three structural gaps in the release model: short horizon, unhandled multimodality, and no memory. The product is headed to production — ideas must be trainable, deployable, and compatible with the release/interleave strategy, not academic.
- **Owner:** Boris Indelman
- **Branch context:** `boris/training/main_cherrypick_generic_data` (WayveCode)

## Status
- **Phase:** Phase 0 — task acknowledged, problem framed, awaiting clarifications
- **Status:** active
- **Last updated:** 2026-06-12
- **Done so far:** grounding sweep over code (release model, `parking_config.py`, `zmurez/pudo`, AR-approach fragments) and Notion (architecture + parking roadmap docs). Findings below.
- **Next:** answer clarification questions (§7) → literature research → novel solution proposals (§8).

---

## 1. Task statement

Add parking capability to the existing end-to-end driving model. Requirements ladder, incrementally complex:

| # | Requirement | Notes |
|---|---|---|
| R1 | Street parking | incl. searching for an available spot |
| R2 | Parking lot parking | incl. searching for an available spot |
| R3 | Multi-story parking lots | ramps, level changes, GPS-denied |
| R4 | Parking lot gates | ticket/barrier interactions, stop-and-wait |
| R5 | Preferred parking | near elevator, handicapped, EV charger, etc. |
| R6 | Memory parking | park at a specific stored spot (home / office / mall) |

Three candidate architecture extensions, some solutions may cover several:

- **G1 — Longer horizon:** 2 s trajectory is too short for multi-leg maneuvers and search behavior.
- **G2 — Multimodality:** choice of spot, type of maneuver, where to start the maneuver.
- **G3 — Memory / in-context learning:** efficient search in streets/lots (don't revisit), persistent sign/rule constraints ("level 2 reserved", height limits), stored personal spots (R6).
- *(implicit)* **G4 — Sensing/data:** rear/fisheye cameras, USS, spot labels — tracked by the 2026 roadmap, not the focus of this research but constrains it.

Gap→requirement mapping: R1–R2 stress G1+G2; R3–R4 add G3 (rules/signs, level tracking) + G1; R5 adds preference conditioning (G2 + new input); R6 is mostly G3 + localization.

---

## 2. The model today (grounded in code, 2026-06-12)

Entry point [release.py](wayve/ai/si/configs/baseline/release.py) — one config for BC + RL; WFM pretrain lives in `wayve/ai/foundation/models/world_model`.

- **Backbone:** `MIMOSTTransformer` (`wayve/ai/zoo/st/models.py:49`): preprocess → InputAdaptor → STTransformer → OutputAdaptor, tokens `[B, T, N, 1536]`. Loaded from WFM release manifest `WFM_v1.4.0.550M(1.5.0)` ("Milano-Cortina", 550M, 500k steps, 16 frames × 6 cams @ 0.2 s pretrain).
- **ViT video encoder** (`wayve/ai/zoo/vision/encoders/vit.py:232`): 12 SA layers, 448×960 → 105 tokens/camera/frame; frozen during BC.
- **ST transformer** (`wayve/ai/zoo/st/st_transformer.py:10`): 11 layers, dim 1536; spatial attention per frame + causal temporal attention, temporal attention only every 2nd layer (latency).
- **Inputs (BC):** 6 cameras × 6 frames @ 0.2 s = **1.0 s context** (630 video tokens/frame); route raster 512² covering 1200 m → 64 tokens; nav instructions → 8 perceiver tokens; radar pillars → 16 tokens; scalars (speed, speed limit, indicator, country, driving side, automation state, pose). **Gear is an output, not an input** in release (`always_dropout_gear_direction=True`, `si/config.py:2203`). ~740 tokens/frame, ~4,440 total.
- **Output adaptor** (`wayve/ai/latent_actions/models/outputs_behavior_control.py:205`): learned queries cross-attend over all encoder tokens → **11 waypoints @ 0.2 s = 2.0 s horizon** (delta + cumsum), indicator (3-class), gear direction (3-class), waypoint log-variance.
- **Latent actions (approach A1, live in release):** `ActionsDiscretizer` 31×31 **radial-exponent grid over the 2 s GT endpoint** → 961-way CE ("privileged" hindsight target, teacher-forced embedding added to every token). Inference = argmax; top-k=10 decodable into candidate trajectories. No VQ/KL — fixed geometric grid. Plus 20-bin **behavior control** (assertiveness percentile, inference default 0.65).
- **Three stages:** (1) WFM pretrain — DINO-VQ future-token CE, 16-frame context; (2) BC — 100k steps, ~60 weighted buckets + 5% MRM; (3) offline RL — TD3-style, C51 distributional critic consuming action-as-waypoints, learned state reward model, BC-anchored actor. I/O unchanged across 2→3.
- **Statelessness confirmed:** no recurrent state crosses inference ticks; the only caches are sliding-window ViT/radar feature caches (pure compute saving) and a deployment-wrapper indicator memory **outside** the network (`deployment_wrapper.py:826`). Fixed-window policy: 1 s in / 2 s out.

---

## 3. Existing approaches — actual status in code

### A1. Latent actions (multimodality) — in release, **OFF for parking**
Implemented and on in the release baseline, but the parking output adaptor sets `enable_latent_action=False` ([parking_config.py:534-535](wayve/ai/si/configs/parking/parking_config.py)); the parking README claim that it uses latent actions is stale. Notion experiment logs (Novel action parametrization) show the LA grid is a **log-polar/radial-exponent grid tuned for forward driving** — dense near origin, sparse at range, no reverse semantics → exactly weakest where parking lives (low speed, reverse, multi-leg). A parking-capable LA space likely needs a different parametrization (gear-aware, maneuver-aware).

### A2. Diffusion path planner (horizon + multimodality) — most mature line
`wayve/ai/zoo/outputs/diffusion.py` (1,492 lines) + `parking_diffusion_datamodule` ([parking_config.py:291-514](wayve/ai/si/configs/parking/parking_config.py)).
- Diffuses **`POLICY_PATH`: 50 poses @ 0.5 m = 24.5 m of distance-parameterized geometry** (not time!) — at parking speeds this is a long effective horizon; yaw π-flip encodes reverse legs. DDIM v-prediction, 2 MMDiT blocks (d=768), 5–10 denoise steps on car.
- **Two-stage:** diffusion plans the path → `PolicyPathConditioner` → cheap `OrdinaryHead` decodes the executable 11-frame trajectory + gear + indicator tracking it.
- **Multimodality exists at training/eval only:** 10–50 noise samples, best-of-K coverage metrics; **on-car uses zero initial noise → deterministic single proposal** (`diffusion.py:1457`). `POLICY_PARKING_POSE` confidence is a placeholder 1.0 — "revisit when ranking multiple proposals" (`diffusion.py:415`).
- **No spot conditioning on this branch:** `PARKING_POSE` goal is computed in the datamodule (with CFG-style dropout plumbing) but no input adaptor consumes it; the model must infer the spot. Goal late-fusion + loss guidance exist on `wonjoongoo/diffusion-v4-parking-path-pred`.
- Note: the `parking_bc_diffusion` mode itself was removed from `parking_config.py` by `c1069f4c73a8`; datamodule + zoo head remain. Dynamic horizon (up to 180 m), 6 s buckets, and **energy-guided affinity-point sampling** (pull diffusion toward externally supplied candidate spots, `POLICY_AFFINITY_POINTS`) live on `soham/affinity-guided-diffusion` / `soham/dynamic-horizon-path`.

### A3. Multi-head WTA (`zmurez/pudo`) — actually AR discrete-goal heads, not min-over-heads
607 commits, all in the **experimental MCV Perceiver stack** (`wayve/ai/experimental/`), not the SI baseline. No literal K-hypothesis min-over-heads loss and no scoring head exists there. What it really is:
- `MultiStepARConv`: autoregressive **discrete goal classification over a 640×640 BEV grid** at horizons **8 s / 4 s / 2 s**, plus an extra first step predicting the **final parking spot**. Hindsight CE targets (GT future positions / GT park pose), teacher forcing with a self-forcing schedule.
- At inference each step is **argmax (= the "WTA")**; the winning cell's SinCos embedding is injected back as a token — i.e. the goal embeddings *are* latent actions conditioning a single regression trajectory head (40 waypoints @ 0.2 s = **8 s horizon**).
- Plus "winner-takes-control" deployment interleave (parking model ↔ baseline by hysteresis rule), park-type/stop-reason/intention/quality label heads from ~230k annotations, hazard-park/PUDO samplers, OSM synthetic PUDO route generator.

### A4. Autoregressive spots → latent action → trajectory — **idea only, but A3 is its closest living relative**
The full chain (predict candidate spots → condition LA on chosen spot → AR-decode trajectory) is implemented nowhere. Existing fragments:
- Single-proposal spot prediction (A2's `POLICY_PARKING_POSE`); candidate ranking explicitly TODO.
- Path/goal conditioning (`PolicyPathConditioner`; goal late-fusion on Wonjoon's branch).
- LA conditioning of the diffusion OrdinaryHead: `baa3912b39c0` on `soham/affinity-guided-diffusion` (spot-path → 2 s latent action → waypoints; decode still single-shot).
- Unused AR machinery: `AutoRegressiveActionHead` (`wayve/ai/zoo/autoregressive.py:13`, blockwise AR over discretized action tokens, no call sites) and VQ AR trajectory decode in the language-action model.
- **Key data gap:** in all pipelines an "anchor" is an event *frame* (gear-to-park, first-movement), not a spatial spot; `PARKING_POSE` is a single hindsight GT pose. **No multi-candidate spot label set exists anywhere.** (VLM spot-availability annotation exists on `sohamphade/parking-annotation-pipeline`.)

---

## 4. Production constraints (Notion, June 2026)

- **Multi-head architecture shift (May 5 weekly):** company moved from one unified driving model to freezing ~half the network and finetuning **mode-specific heads** (MRM, parking, …), each allowed its own perception head (e.g. PSD). Parking integration = finetune a parking/PUDO head on a well-trained driving checkpoint; **"parking merged into driving baseline via multi-head architecture" with deterministic mode switching is the MS5 productization gate.** Novel solutions should ideally live inside a parking head/branch.
- **Roadmap (Parking 2026 v2.0):** MS2 P2P basic + Valeo demo (Jun–Jul) → MS3 multi-leg maneuvers + limited PSD head + rear camera in BC/RL (Jul) → MS4 P2P F2, parking cameras, HMI, multi-level navigation F1 (Aug–Oct) → MS5 multi-spot APA E2E (Oct–Jan 27). New I/O explicitly planned: rear camera, fisheye SVC, **parking-preference input adaptor**, PSD I/Os, 4D occupancy (PA), USS safety shell. **Memory parking (MPA) out of 2026 scope — reassess end-Q2 (i.e. now)**; multi-story appears as MS4 "multi-level navigation F1" / MS5 "early multi-story ODD".
- **Recorded guidance to avoid in-context-learning research** (May 5 weekly) — in direct tension with G3; needs an explicit call (→ §7 Q3).
- **Latency/deployability:** diffusion head deliberately small, 5-step JIT denoising artifact exists; recurring TorchScript scriptability constraints (`torch.jit.Final`, instance-attr fixes like `209d1fc69c40`); temporal feature caches assume fixed sliding window.
- **Eval:** PUDO Eval Studio suite + LessWrong open-loop suite (binary, failure-point, negative-speed support); Databricks PUDO dashboards. Known empirical failure modes from MS2 street PUDO: reverse / gear-shift stability, end-of-route logic, standstill-in-drive.
- **History note:** the Jan 12 pivot bet "no architecture change needed — data balancing suffices" was made for PUDO only; this research is explicitly about where that bet stops holding.

---

## 5. Problem definition (synthesis)

The release model is a **stateless, fixed-window (1 s in / 2 s out) feed-forward policy** whose only multimodality device (961-way endpoint grid) is geometry-tuned for forward driving. Parking needs: (a) plans that span **multi-leg, gear-reversing maneuvers** well beyond 2 s; (b) an explicit, conditionable representation of **discrete choices** (which spot, which maneuver class, when to commit); and (c) **persistent task state** over minutes (searched area, lot rules, level, stored spot) that no current component can carry. The four existing approaches each cover a slice: A1 (choice, wrong geometry), A2 (horizon + implicit multimodality, no choice conditioning, single proposal on car), A3 (choice + horizon, wrong stack), A4 (the unifying idea, unbuilt). None addresses G3 (memory) at all.

---

## 6. Research plan

1. **Phase 0 — framing & clarifications** ← this doc.
2. **Phase 1 — deep knowledge consolidation:** finish tracing sibling branches (`soham/affinity-guided-diffusion`, `wonjoongoo/diffusion-v4-parking-path-pred`, annotation pipeline); pull the Google-Docs design artifacts (System Design Overview, Multiple Driving Heads pre-read, Parking_SW_tech_DRAFT_3) if shared.
3. **Phase 2 — literature research:** goal-conditioned & long-horizon planning (diffusion planners, hierarchical policies), multimodal trajectory prediction (anchor/goal-based, WTA/EWTA, GMM heads), memory for embodied agents (recurrent state spaces, token-memory/registers, retrieval, episodic maps), parking-specific E2E literature.
4. **Phase 3 — novel solutions:** concrete proposals per gap with: integration point in current code, training-data requirements, latency cost, deployment path (interleave → multi-head merge), and eval plan. Production-first filter.
5. **Phase 4 — review with Boris**, then socialize (Notion/newsletter per vault conventions).

---

## 7. Open clarification questions

1. **Scope/priority:** Which tiers are the target of *this* research — roadmap-aligned R1–R4, or also R5/R6? (Notion has MPA out of 2026 scope, reassess end-Q2 — is this research the reassessment?)
2. **Architecture freedom:** must solutions fit the frozen-backbone + parking-head paradigm, or can they touch WFM pretraining (e.g. parking-aware latent-action pretraining, memory tokens trained in pretrain)? Anything off-limits?
3. **Memory/ICL mandate:** May 5 weekly records guidance to avoid ICL research, but the task explicitly asks for memory / in-context learning solutions. Confirm memory IS in scope here, and whether network-internal state (recurrence/memory tokens) is acceptable for production vs only external memory (map layer, deployment wrapper, retrieval inputs).
4. **Deployment constraints as hard filters:** must every proposal run on current on-car compute at the current tick rate and be TorchScript/JIT-compatible from day one, or can parking mode tolerate higher latency (low-speed regime) / a phased path?
5. **Horizon interface:** is the 2 s executable-trajectory contract with the controller fixed (so longer horizons must be model-internal, like POLICY_PATH), or can the controller consume longer/sparser plans?
6. **Data leverage:** can we commission new data (multi-story lots, gates, spot-level labels / PSD campaigns), and is the VLM annotation pipeline available for spot candidates? Is sim/WFM-generated data admissible for rare cases (gates, multi-story)?
7. **Deliverable:** vault doc only, or also a Notion page for the parking team? Coordinate with Soham/Wonjoon's ongoing diffusion work?

---

## 8. Novel solution candidates

*Placeholder — to be developed in Phase 3 after clarifications and literature research.*

Seed directions captured during grounding (to be developed, not yet vetted):
- Parking-native latent-action space: gear-aware / maneuver-class-aware discretization replacing the forward-driving radial grid (fixes A1's geometry; unifies with A4 conditioning).
- Promote A3's AR discrete-goal-grid idea into the SI stack as the spot/maneuver chooser feeding A2's diffusion path (A3 ⊕ A2 = concrete A4).
- Candidate-spot set prediction + ranking head over PSD/VLM labels, with affinity-guided diffusion as the conditioning mechanism already prototyped.
- Memory as input, not state: rolling egocentric "search coverage / rules" raster layer composited into the existing 512² route-map channel (reuses a trained pathway; deployment-wrapper-maintained → stateless network preserved).
- Token-register memory: small set of read/write memory tokens carried across ticks in the ST transformer (cheap, but breaks statelessness — needs Q3 answer).
- Sign/rule persistence via the nav-instruction channel: inject lot rules as synthetic nav steps.

---

## References

- Code: [release.py](wayve/ai/si/configs/baseline/release.py) · [parking_config.py](wayve/ai/si/configs/parking/parking_config.py) · `wayve/ai/zoo/outputs/diffusion.py` · `wayve/ai/zoo/autoregressive.py` · `wayve/ai/latent_actions/models/outputs_behavior_control.py` · branches `zmurez/pudo`, `soham/affinity-guided-diffusion`, `wonjoongoo/diffusion-v4-parking-path-pred`, `boris/pudo_generic_materialization`
- Notion: The Very Big Picture (2a703da5d69a802298a8e1d922231ac3) · Latent Actions in WFM (21003da5d69a802d99f9d8133f3597bd) · Novel action parametrization (1a603da5d69a80fabb33c2e04ab30507) · WFM Codebase Deep Dive (27e03da5d69a8019b86bcc359b8155e0) · Parking model training (37b03da5d69a8071ba4cd5b312d2490e) · Long-Horizon Parking Planning ledger (30c03da5d69a8017adf7c47095a6874f) · Parking 2026 Milestones (36603da5d69a81b99449f6b26afefff9) · Parking 2026 plan v2.0 (36d03da5d69a803d9ca4ed58727a5107) · MS2 PUDO Street UK (2ef03da5d69a817da4c1c2da0be6e294) · May 5 parking weekly (35703da5d69a80949838e931f52d39b6) · Jan 12 pivot (2e603da5d69a8023acf1f8c97d367053)
- Related vault notes: [[parking-wfm-update]] · [[agent_tasks/2026/06/Week-2/2026-06-12-parking-capability-research-kickoff|kickoff task note]]
