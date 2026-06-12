# Parking Capability — Architecture Research

## Overview
- **What it is:** Research project to find novel, production-viable architecture extensions that give the end-to-end driving model full parking capability (street → lots → multi-story → gates → preferred → memory parking).
- **Why it matters:** Basic parking (e.g. parallel parking) is reachable with curated data, but the harder requirements expose three structural gaps in the release model: short horizon, unhandled multimodality, and no memory. The product is headed to production — ideas must be trainable, deployable, and compatible with the release/interleave strategy, not academic.
- **Owner:** Boris Indelman
- **Branch context:** `boris/training/main_cherrypick_generic_data` (WayveCode)

## Status
- **Phase:** Phases 0–3 complete — problem framed, branches + design docs deep-dived, literature swept, solutions proposed and adversarially reviewed (§8)
- **Status:** active — awaiting Boris review of §8
- **Last updated:** 2026-06-12
- **Done so far:** grounding sweep (code + Notion); scope decisions (§Decisions); Phase 1 deep-dive of `soham/*`, `wonjoongoo/*`, `sohamphade/parking-annotation-pipeline`, the real WTA implementation, and 4 Google-Drive design docs (§3.5, §4); Phase 2 literature sweep ([[parking-capability-literature]]); Phase 3 solution proposals stress-tested by a 4-lens adversarial review ([[parking-capability-critique-2026-06-12]]) and revised (§8).
- **Next:** Boris review → pick the "Now" items from §8.9 → socialize (Notion page for the parking team, pending Q7).

## Decisions (Boris, 2026-06-12)
- **Scope:** all 6 requirement tiers, prioritized by roadmap order (street/lots in depth; memory parking as forward-looking design).
- **Architecture freedom:** solutions live in the parking head/branch, but WFM-pretrain changes (parking-aware latent actions, etc.) may be proposed when the payoff is clear.
- **Memory/ICL:** **external memory only** — the network stays stateless; memory may enter only as inputs (e.g. search-coverage raster, stored-spot conditioning) maintained outside the model (map layer / deployment wrapper / retrieval). Internal recurrence and cross-tick memory tokens are out of scope.
- **Deployability:** soft filter — every proposal needs a credible production path, but parking mode (low speed) may tolerate higher latency or staged optimization.

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

### 3.5 Phase-1 addenda (sibling branches, WTA truth, design docs — 2026-06-12)

- **Soham's branches** (`soham/dynamic-horizon-path[-clean]`, `soham/affinity-guided-diffusion[-clean]`; clean PRs #114772/#114773 open, no reviews): **dynamic horizon** is the most mature item — speed-bucketed path horizon 30/60/120/180/240 m with horizon-normalized diffusion targets, a `PathHorizonSTAdaptor`, deployment-side mirror, Welford scale versioning, and a trained 100k-step checkpoint (`…dhla1`, which also trains **latent-action conditioning of the OrdinaryHead** — 2 s endpoint codebook added to cond tokens after path conditioning). **Affinity guidance** is training-free DDIM steering toward `POLICY_AFFINITY_POINTS [B,M≤8,2]`: v1 (gradients on noisy iterates) produced backwards/U-turn paths; v2 fixes it (gradient only on the predicted clean sample, L2-normalized, same displacement applied to iterate; scale 0.1–0.3). Unit-tested incl. bit-identical no-op; never trained/evaluated; "Option B" (learned conditioning) never implemented. bev_clicker base tool is merged; the guided-diffusion wiring is branch-only.
- **Wonjoon's branch** (`wonjoongoo/diffusion-v4-parking-path-pred`; the merged PR #106346 came from a separate clean re-implementation): built and then *dropped on merge*: `ParkingPoseSTAdaptor` (Fourier (x,y,yaw) → 1 token; **early fusion beat late fusion** — late fusion turned off twice; yaw conditioning abandoned via `yaw_dropout=1.0`), data-side 50% goal dropout (the de-facto CFG), and **analytic TorchScript-able endpoint loss-guidance** (closed-form gradient through decode, √ᾱ-scaled, deployable `--guidance_scale`, default off). Goal-set/unset metric splits survived to main separately (#102692). The merged model has **no goal input at all**; PR body confirms on-car single-proposal determinism is intentional pending ranking. (Branches preserved under `origin/aa/wonjoon_*` — author off-project; revival = reproduction spike, not merge.)
- **The real WTA** (`zmurez/pudo` only, not main): `AnnealedWTALoss` — K=8 parallel ego/indicator/gear head banks + a mode classifier on a dedicated query token, **annealed soft assignment** `softmax(−loss/τ)` with τ: 10→1e-5 (i.e. it converges to hard WTA; independently reproduces the 2024 aWTA paper), classifier trained to imitate the routing oracle (soft targets), per-context-frame routing, cross-frame consistency regularizers, EMA-smoothed mode logits at inference. Config `mcv_new_phase2x_wta.yml`. **No quantitative results recorded anywhere**; the parking-hub report itself flags "branch-tip evidence, not a launched-run proof".
- **VLM annotation pipeline** (`sohamphade/parking-annotation-pipeline`, PR #103667 open): 3-step CoT (Gemini 2.5 Flash) emitting per-frame **multi-spot lists** with type/availability/ego-size-fit/constraints (handicap yes, EV missing) — structurally the multi-candidate shape we need, but free-text fields, **no spatial grounding (no box/BEV coords)**, single front camera, 3-sample prototype, local JSON. Built for CoT SFT text, not detector supervision.
- **Design docs (Google Drive):** the System Design Overview (Boris, 2026-04) sets the I/O contract — spot selection input (pixel/bbox), maneuver/destination preference enums, PSD output `[N,4,3]`, **8 s trajectory-horizon target**, and flags that long-term parking conditioning "requires adding state (memory) to the model" as an open item, with MPA sketched as an external visual path encoder + cached encodings keyed by position. The **Multiple Driving Heads** pre-read (Andrew English, May 2026) fixes the deployment paradigm: shared trunk (≈half the ST transformer) + per-mode heads (~25% capacity each; 5-head setup fits Nissan AD2's 8 GB), one head/frame by deterministic rule, **heads must be stateless — caching lives in the trunk**; engine-swap alternatives rejected precisely because the temporal cache empties at switchover. Parking_SW_tech DRAFT_3 (Alon, Nov 2025): unified parking head with multi-channel output tensor (slot prob / occupancy / distance), USS as a small auxiliary branch; slot detection P>95%/R>90%, parking success >95% targets. Parking 2026 plan slides: scope/milestones as in §4; "parking model alignment into baseline (multi-head approach)" is the MS5 exit.

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

1. **Phase 0 — framing & clarifications** ✅ (this doc, §1–§5, §7).
2. **Phase 1 — deep knowledge consolidation** ✅ — sibling branches + WTA archaeology + VLM pipeline + all 4 Google-Drive design docs traced (§3.5).
3. **Phase 2 — literature research** ✅ — six-topic sweep digested in [[parking-capability-literature]].
4. **Phase 3 — novel solutions** ✅ — proposed, adversarially reviewed ([[parking-capability-critique-2026-06-12]]), revised (§8).
5. **Phase 4 — review with Boris** ← next, then socialize (Notion page for the parking team / newsletter per vault conventions, pending Q7).

---

## 7. Clarification questions

Q1–Q4 answered 2026-06-12 → see **Decisions** section above. Still open (proceeding with stated defaults until answered):

5. **Horizon interface:** is the 2 s executable-trajectory contract with the controller fixed (so longer horizons must be model-internal, like POLICY_PATH), or can the controller consume longer/sparser plans? *Default assumption: fixed — longer horizons stay model-internal, following the POLICY_PATH precedent.*
6. **Data leverage:** can we commission new data (multi-story lots, gates, spot-level labels / PSD campaigns), and is the VLM annotation pipeline available for spot candidates? Is sim/WFM-generated data admissible for rare cases (gates, multi-story)? *Default assumption: PSD labeling campaigns are roadmap-committed (MS3) and usable; new collection limited; sim admissible for rare cases if validated.*
7. **Deliverable:** vault doc only, or also a Notion page for the parking team? Coordinate with Soham/Wonjoon's ongoing diffusion work? *Default assumption: vault first, Notion after Boris reviews Phase 3.*

---

## 8. Proposed solutions (v1, post-adversarial review)

**How to read this.** These are mostly disciplined adoptions of production-proven mechanisms wired for our stack — by design: the brief is production, not publication. The defensible novel elements are (a) a single **gear-aware leg-code action vocabulary** designed to work under the frozen-trunk multi-head constraint, and (b) the **memory-as-input wiring with an explicit commitment layer**. A first draft was stress-tested by a 4-lens adversarial review (production/deployment, data realism, novelty/coherence, org fit) with repo verification; the fixes are folded in below and the surviving risks are in §8.10. Critique log: [[parking-capability-critique-2026-06-12]] · literature basis: [[parking-capability-literature]].

### 8.0 P0 — representation decisions & diagnostics that gate everything else

The three recorded street-PUDO failure modes (reverse/gear instability, end-of-route degeneracy, standstill-in-drive) are prerequisites, not afterthoughts:

1. **Time/dwell semantics.** Distance-parameterized `POLICY_PATH` cannot express "stop and hold N seconds" (gear-shift dwell, gate creep-wait, mid-maneuver yield) — at standstill the target degenerates to a point; plausibly the root of standstill-in-drive. Pick one: (a) **HOLD leg type with a duration scalar** in the leg representation (recommended — legs need first-class dwell at gear switches anyway); (b) a speed-profile output alongside the geometric path; (c) an intent=hold head + controller-side hold state.
2. **Termination semantics.** Parking is *always* end-of-route. Define what the path does after the goal pose (validity mask vs terminal-pose pinning + padding policy — today points beyond goal repeat the goal pose) as an explicit controller contract and a first-class eval slice. **Pre-req found in review:** end-of-route detection keys on route-raster pixel sums and auto-triggers `PARKING_MODE` (`deployment_wrapper.py:3452-3469`) — migrate it to nav-instruction distance inputs before anything else touches conditioning.
3. **Reverse diagnostic (~1 week).** Establish *why* reverse is unstable before building: probe frozen-trunk features on reverse segments (if the trunk never represented rearward motion, no head-side fix recovers it and the plan changes); replay recorded reverse failures against controller-only hypotheses (rear-axle-frame tracking); check signed-arc ambiguity at gear cusps. Output: a verdict memo assigning head- vs trunk- vs controller-side ownership.
4. **One action vocabulary.** A single **leg-code = (gear ∈ {F, R, HOLD}, endpoint cell, side)** is the unit everywhere: S1's maneuver mode is the first leg-code; S2 decodes sequences of them; any future WFM pretraining (S6) targets the same codebook. Facts to respect: the 961 radial grid cannot encode reverse (uncentered longitudinal axis, `autoregressive.py:430`), and `enable_latent_action=False` in every production parking config — re-enabling the latent-action pathway in the parking head is *scheduled work, not an assumption*.

### 8.1 S1 — PRX parking head: Propose → Rank → eXecute

Approach A4 made concrete from production-proven parts (TNT/MTR anchor-classification lineage + Hydra-MDP ranking + DiffusionDrive anchored truncation + MultiPark factorization), as one stateless parking head.

- **Propose.** Two-tier spot-candidate head: coarse candidates at range (centroid + free/occupied + type — corner-accurate PSD at 10–25 m from pinhole cams is unrealistic) and precise 4-corner polygons <10 m. **Consumes the MS3 PSD head** (roadmap-owned) rather than re-proposing it; rear camera (MS3) is a hard dependency for reverse-in polygons. The same candidate interface accepts external sources: UI tap (Tesla pattern; HMI budget needed), stored spots (S3), fleet priors (S4). Maneuver multimodality is factorized (MultiPark): gear × approach-side × longitudinal anchor ≈ 30–60 modes, with hierarchical fallback for rare cells and per-country mixing (mode priors are heavily skewed — per-cell count audit first).
- **Rank.** Multi-criteria scoring over (spot × maneuver) candidates: imitation likelihood + rule-compliance scores distilled from the rule layer (Hydra-MDP teacher-distillation pattern) + preference token (R5; the roadmap's parking-preference adaptor) + critic value (S5). Train with hindsight assignment but **listwise over the S4 feasible set with exposure debiasing** — the human picked the *easiest* spot; convenience entangles with feasibility. Post-hoc temperature scaling per deployment domain; ECE/Brier tracked in eval. Replaces the `confidence=1.0` placeholder on `POLICY_PARKING_POSE` (`diffusion.py:415`).
- **eXecute.** **Anchored-truncated diffusion — a retrain, not an inference trick** (training with anchor-centered noise on a truncated schedule, per DiffusionDrive): K candidate anchors → K distinct deterministic proposals in ~2 denoise steps each, restoring on-car multimodality that today collapses to one zero-noise sample. **One goal-injection stack, deliberately ordered:** anchor-init for mode selection + a trained early-fusion goal token for hard pinning (revive Wonjoon's `ParkingPoseSTAdaptor` — early fusion won on his branch; reproduction spike first, it's an unreproduced result vs a pre-diffusion-merge model) + the **already-deployed in-graph inpainting hook** (`diffusion.py:738-760`) for zero-retrain pinning experiments. **Affinity guidance is demoted to an offline experiment tool** (bev_clicker): with ~2 truncated steps there is no schedule room for gradient guidance, and it fights anchor-init.
- **Latency honesty.** K anchors × 2 steps + proposer + ranker is net *more* compute than today's single pass — the benefit is controllable multimodality, not speed. Street search (R1) runs under the *driving* latency contract, not parking-mode slack. A per-mode compute budget table is an MS4 exit artifact.

### 8.2 S2 — Leg-codebook trajectories (multi-leg long horizon)

- A maneuver = a sequence of signed-arc-distance-parameterized legs delimited by gear switches (MultiPark, production-deployed), each carrying a (gear/HOLD, duration) token. AR **at the leg level only** — OpenVLA-OFT shows per-step AR decode buys nothing; legs are genuinely sequential decisions.
- **New output key `POLICY_PARKING_LEGS` emitted by the parking head only.** Baseline `POLICY_PATH` is untouched — changing a deployed output's parameterization would gate the MS5 merge (review finding).
- **Data prerequisites surfaced by review:** (i) the **P→D forward-unparking detector gap poisons the heaviest unparking bucket** (`unparking_window_gc1`, weight 0.3, mostly forward pull-outs labeled `unparking_mode=False`) — fix first (the code comment at `parking.py:400-406` already sketches it), re-materialize, add a regression test; (ii) gen2 gear is *reconstructed from speed* — heuristics at near-zero speed are exactly where leg boundaries live; one canonical gear-reconstruction implementation (three exist today) + a leg-label validation pass; (iii) per-bucket gc-count audit (1 day, Databricks) before fixing vocabulary size — config upweighting (gc3plus 0.15 vs gc1 0.05) already betrays scarcity; (iv) the 25 s/30 m window clipping truncates long gc3plus maneuvers — extend for leg labeling.
- **aWTA is a contingency, not parallel work.** zmurez's `AnnealedWTALoss` (which independently reproduces the 2024 aWTA paper: K=8 head banks, oracle-imitating mode classifier with soft targets, EMA mode smoothing) is the fallback **behind a decision gate**: port it only if anchored diffusion fails to separate modes. Anchors and WTA-hypotheses-tied-to-the-vocabulary are the same multimodality device — shipping both is an unscheduled 2×2 ablation.
- **Multi-leg search:** preferred design is a **~1 Hz strategic loop outside the tick path** that selects the leg sequence (critic-scored), with the tick-rate head executing only the committed leg (requires §8.5 commitment state). Data-dependent beam search does not compile to the TensorRT path; the in-graph alternative is a fixed-width/depth unrolled beam.

### 8.3 S3 — Parking memory as inputs (head-side tokens, not raster repainting)

- **Route-raster repainting is dead** — review killed it three independent ways: the raster doubles as a control signal (end-of-route trigger sums its pixels); the route adaptor is a frozen `Conv2d(3,…)` upstream of the frozen trunk, so new semantics are either invisible or cost a trunk retrain + all-head revalidation; and a frozen trunk reads a coverage trail with *route* semantics — a re-search **attractor**, the exact opposite of the goal. Plus dual Python/C++ renderer-parity engineering priced as "free labels".
- **Memory enters via parking-head-side cross-attention over dedicated tokens** (fixed max-N + count, the existing `lane_info`/`step_info` deployment pattern): coverage tokens or a small head-side raster encoder, spot-entity tokens, rule tokens, committed-target token. Where a trunk-input is genuinely required, **reserve channels/token slots in the trunk training recipe before the MS4 freeze** (cheap with dropout) — a per-input decision logged against the freeze date.
- **Coverage layer (v0, in-process):** ego-anchored visited/observation-count raster computed in the deployment wrapper from **recent odometry only (~500 m window ≈ ≤7 m drift)**, drift-noise injected in training, **soft prior — never a hard "searched" bit** (5–30 m drift over a long search misregisters whole aisles). **The learning signal is the hard part, not the plumbing:** hindsight rendering from the run's own *past* odometry (strictly causal; never whole-run — that leaks the expert's future loop) validates plumbing only. Real search behavior comes from (a) **paired-contrast mining** (same lot, first-lap empty raster vs second-lap covered raster, divergent expert actions) and (b) **closed-loop RL in 3DGS lot gyms with an exploration reward consuming the coverage input** (§8.6) — fleet data alone is contradictory (drivers re-enter covered areas). Graduation gate: coverage on/off must move a closed-loop re-search metric; counterfactual eval (flip the raster → search direction must flip). Also fix the conditioning mismatch: search segments currently train with `parking_mode=False` (50 s/30 m window) but deploy with it ON.
- **Spot inventory (MS5):** decoded entities (id, pose, type, occupancy-at-last-sight, score, last-seen) maintained outside the net — decoded-outputs-not-latents (MapTracker/PrevPredMap lesson); entities survive retrains, score calibration doesn't (re-tune per release). Enables "go back to the spot we passed 80 m ago".
- **Rule layer:** offline VLM sign→rule extraction (MapDR schema; published online F1 ~0.65 / arrows 0.44 rules out unsupervised online parsing) + human QA, compiled per-zone. **Runtime semantics defined:** conservative veto — a detected restriction marking excludes the spot unless the cache affirms it AND cache age < threshold; unknown-rule areas = no-park. Consequence stated honestly: **R1 street-parking legality is scoped to mapped zones** until an online legality story exists.
- **Stored spots (R6):** demoted to a **one-page input to the end-Q2 MPA reassessment** (which is ~now; this research is that input). Design: Valeo/Xpeng production pattern — one demo run stores trajectory + semantic BEV landmarks + spot pose, keyed semantically (floor estimate + spot-number OCR + local geometry), refreshed per successful replay (Aptiv); runtime semantic re-anchoring (AVP-SLAM-class; VIPS-Odom couples slot detections into odometry — the PSD head doubles as the localizer); the stored route renders as a nav route + goal token. Honest gaps: **unparking has no goal-conditioned training data** (`goal_distance=NaN` on unparking samples) — the return leg of stored-spot replay needs new data; barometer availability on platform unverified; floor-estimate-low-confidence behavior = conservative abort.
- **PMS scoping:** v0 is **in-process wrapper state (coverage + commitment)** — the honest scale precedent is the navigation/route-renderer stack, not the 4-scalar in-graph indicator-memory buffer. The full service (inventory, rules, stored spots) is a vehicle-software workstream needing an owner and degraded-mode semantics (a stateless net cannot detect PMS outage — behavior changes silently). Deployment shape: **single multi-head engine with `PARKING_MODE`-flag head selection**; engine-swap interleaving is ruled out for MS5 (dual-engine warmup at the lot entrance; cold trunk cache on abort, in reverse, near pedestrians).

### 8.4 S4 — Fleet data engine (scoped to what survives scrutiny)

- **Cross-run aggregation at GPS resolution only**: lot existence, entrance heat, search-duration stats, density priors. GNSS error (5–20 m; absent in garages) exceeds spot pitch (~2.5 m) — spot-level cross-run maps come only from the stored-spot re-anchoring stack (MS5+, outdoor first). Fleet-distribution bias acknowledged: anchors cluster at depots/chargers/PUDO zones.
- **Counterfactual positives in weakened form only:** candidate-set (recall) supervision, never ranking positives; gated on the current run's own free-space check at the matched timestamp (occupancy is time-varying; the gate is circular with the perception being trained — hence recall-only + human QA sampling); filtered through the rule layer where present (humans park illegally: feasible ≠ permitted).
- **Anchor hygiene:** add unparking `nopudo` variants (today drop-off departures train as unparking — no PUDO exclusion exists on unparking filters); stricter park-anchor definition (parked duration ≫ 2 s, distance-from-lane checks).
- **HER/GCSL relabeling stands:** every achieved end pose is a goal label (turns the whole fleet log into goal-conditioned parking data); aborted/multi-attempt parks become ranking negatives (GCSL-NF).
- **VLM pipeline: attributes only.** Type/occupancy/restriction attributes + coarse existence — **geometry comes exclusively from the MS3 PSD campaign**; one schema serving proposer + attributes + adjacent signs (one labeling queue, not three — it competes with rear-camera enablement for the same people). Untaken-spot human-QA precision floor as a gate. Current pipeline reality: a 3-sample prototype, single camera, free-text fields, local JSON — the scale path is the async runner + Databricks mining + Delta keyed (run_id, ts, spot_idx).
- **Search-behavior mining** feeds §8.3's contrastive pairs and needs long-horizon odometry materialization (training rasters must match deployment raster statistics — current windows are 30–60 s, deployment accumulates minutes). Risk: organic search may be near-zero in chauffeur-style logs (drivers go to known destinations) — budget directed collection/teleop demos.

### 8.5 S5 — Critic-as-ranker + commitment layer (shadow first)

- **Symmetric critic head only** (the asymmetric config would put a second perception trunk on-car); **parking-reward training is a prerequisite** — today's critic is forward-driving-trained; its distribution tails on reverse multi-point maneuvers are exactly the offline-RL OOD-overestimation regime, and CVaR over a miscalibrated distribution is confidently wrong risk-aversion.
- **Rollout ladder:** (1) offline: rank existing top-K samples against PUDO outcomes — zero deployment risk, replaces the confidence placeholder, can start now; (2) shadow mode on-car logging rank-vs-outcome; (3) only then gate behavior. Scope honesty: ranks in-horizon/first-leg proposals; multi-leg sequence ranking is gated on a (state, leg-chunk) critic (Q-chunking) — **don't change the action vocabulary before its critic exists**.
- **Commitment layer** (the glue the first draft lacked): PMS-held current-target spot ID + chosen leg sequence + a hysteresis/switch-cost term in Rank; the previously-selected (spot, maneuver) is fed back as a token. Solves per-tick plan churn over a detection-noisy candidate set — the stateless constraint means this decision *must* live in external memory.
- **Abort/recovery state machine,** specified with the arbitration owner: search → approach → (spot occupied on approach) → re-rank → resume search; USS-shell veto ⇒ defined leg-replan semantics (the USS interim safety shell is an MS4 roadmap deliverable that bounds all of S2's execution). Disagreement-gated fallback (Centaur-style) is added only after hysteresis and calibrated against held-out intervention data — near ties, raw disagreement oscillates the fallback.

### 8.6 S6 — Trunk/WFM riders + sim gyms (re-scoped)

- **Gear-aware latent-action pretraining is OFF the 2026 critical path.** It forks the WFM→BC→RL chain for every capability and forces all-head revalidation under the frozen-trunk paradigm. It rides a named trunk release train with trunk-owners' buy-in, or it doesn't happen. The leg codebook is deliberately designed to work as BC-head output decomposition without it.
- **3DGS lot gyms are promoted, not demoted:** they are now the *training* substrate for search behavior (exploration reward consuming the coverage input — the only credible learning signal for §8.3), the closed-loop eval gate (time-to-park, re-search rate, leg-count match, abort-recovery success), and the rare-case data source (gates, multi-story ramps — also mine real ramp segments; tight steep spirals are OOD for a forward-driving trunk).
- **Gates (R4):** a thin **barrier-state head** (present + state ∈ {closed, moving, open}) + creep-wait behavior data + HOLD legs — specified here as real work, not a coverage-table token. A 1 s context window cannot observe "barrier rising slowly"; the wait state lives in the commitment layer. Operator ANPR agreements remove ticket machines for fleet lots (the Bosch/ISO-23374 production pattern); **ticket-pulling is explicitly descoped** — no technical fallback is claimed.

### 8.7 Explicitly NOT building now
WFM latent-action pretrain (S6.1) · PMS beyond in-process v0 · in-graph beam search · rule layer at scale · stored-spot/MPA implementation (one-pager only) · second/third annotation schemas · engine-swap interleaving at MS5 · remote-assist output channel (no contract exists — raise with ops) · UI-tap HMI flow (raise at MS4 planning).

### 8.8 Requirement coverage (honest version)

| Req | Mechanisms | Caveats that stay true |
|---|---|---|
| R1 street | S1 + S3 coverage + S4 priors | legality = mapped zones only; search runs at driving latency |
| R2 lots | + commitment/abort loop (S5) | organic search data scarce → 3DGS gym + directed collection |
| R3 multi-story | per-floor coverage on fused floor estimate; ramp mining; re-anchoring | gated on re-anchoring stack (MS5+); low-confidence floor ⇒ abort |
| R4 gates | barrier head + creep-wait data + HOLD legs + ops/ANPR track | ticket-pulling descoped |
| R5 preference | preference token in Rank + rule attributes + PSD types | EV/handicap marking legibility at range unproven |
| R6 memory | stored-spot one-pager → MPA reassessment | unpark return leg lacks goal-conditioned data; barometer TBD |

### 8.9 Phasing vs roadmap (rebuilt after org-fit review)

- **Now (Jun, alongside MS2):** P→D detector fix + re-materialization (cheapest item, unblocks the heaviest bucket); per-bucket count audit; reverse-diagnostic memo; critic offline-ranking prototype; end-of-route detection migration off raster sums; trunk channel/token-slot reservation decision (before freeze); support Soham's #114772 to merge (his PR — coordinate, don't annex); timeboxed Wonjoon goal-conditioning reproduction spike with kill criteria.
- **MS3 (Jul):** HOLD/termination representation decisions landed in datamodule + controller contract; consume PSD head I/Os; one labeling schema agreed across proposer/attributes/signs; leg-label pipeline prototype.
- **MS4 (Aug–Oct):** anchored-truncation retrain; `POLICY_PARKING_LEGS` in the parking head; coverage v0 in-process + paired-contrast data; S4 GPS-resolution priors; conditioning-dropout matrix (goal × path × preference × coverage × rules — 2^k states need a stated joint schedule); DRAM/parameter budget vs the ~25%-per-head limit + critic-ownership decision (shared module with version contract vs per-head copy); shadow-mode critic on-car.
- **MS5 (Oct–Jan 27):** multi-spot APA E2E = PRX complete with commitment layer + 1 Hz strategic loop; spot inventory; single-engine multi-head merge; 3DGS closed-loop eval gates.
- **2027 / MPA-gated:** stored spots, rule layer at scale, multi-story beyond F1.

### 8.10 Top surviving risks

1. **Reverse may be trunk-bound** — if the frozen trunk never represented rearward motion, everything acquires a trunk-release dependency. The diagnostic is first for a reason.
2. **Search behavior may not be learnable from fleet data** (expert coverage→behavior mapping is contradictory) — the 3DGS-gym RL bet becomes load-bearing for R1/R2.
3. **Commitment/abort state machine crosses team boundaries** (arbitration ownership) — political surface area at MS4/MS5.
4. **PSD-at-range precision from pinhole cameras unproven**; rear camera (MS3) is a hard dependency for reverse-in polygons.
5. **Near-field safety case** (last 30 cm, low obstacles below camera FOV, reversing near pedestrians) — the certification long pole; the USS interim shell is the only mitigation and the parking team doesn't own it.
6. **gc3plus volumes may be too small** for the rare modes that matter most (audit will tell).
7. **Labeling/Databricks contention** with MS2/MS3 deliverables — one schema, one queue.
8. **Goal-dropout × anchored-truncation interaction** — without the conditioning matrix, half the gradient budget can train a pathway deployment barely uses.
9. **Localization drift in long searches** (whole aisles) — coverage stays a soft prior; multi-story slips if re-anchoring slips.
10. **Spot-confidence calibration across domains** is an open literature gap — per-domain temperature scaling + ECE/Brier in eval is the mitigation.

---

## References

- Code: [release.py](wayve/ai/si/configs/baseline/release.py) · [parking_config.py](wayve/ai/si/configs/parking/parking_config.py) · `wayve/ai/zoo/outputs/diffusion.py` · `wayve/ai/zoo/autoregressive.py` · `wayve/ai/latent_actions/models/outputs_behavior_control.py` · branches `zmurez/pudo`, `soham/affinity-guided-diffusion`, `wonjoongoo/diffusion-v4-parking-path-pred`, `boris/pudo_generic_materialization`
- Notion: The Very Big Picture (2a703da5d69a802298a8e1d922231ac3) · Latent Actions in WFM (21003da5d69a802d99f9d8133f3597bd) · Novel action parametrization (1a603da5d69a80fabb33c2e04ab30507) · WFM Codebase Deep Dive (27e03da5d69a8019b86bcc359b8155e0) · Parking model training (37b03da5d69a8071ba4cd5b312d2490e) · Long-Horizon Parking Planning ledger (30c03da5d69a8017adf7c47095a6874f) · Parking 2026 Milestones (36603da5d69a81b99449f6b26afefff9) · Parking 2026 plan v2.0 (36d03da5d69a803d9ca4ed58727a5107) · MS2 PUDO Street UK (2ef03da5d69a817da4c1c2da0be6e294) · May 5 parking weekly (35703da5d69a80949838e931f52d39b6) · Jan 12 pivot (2e603da5d69a8023acf1f8c97d367053)
- Google Drive design docs: System Design Overview for Parking/PUDO (19S5azeFAIYO7Bnl5CaJXDGEY0wfieInHH4uC7qrxjvU) · Multiple Driving Heads pre-read (1mQs9dxxJ0VwUEAfsGHLwpwVgj3lvjcQE3Y0No7htHrc) + slides (12tpcS1qH9F9aPjF2qXzpmKeYtpA3KNw3tRDWYtqlJV0) · Parking_SW_tech DRAFT_3 (1CjjZWISK59xOYjMbuIh3zgnA6gvzWLoQu4oTjt14-so) · Parking_2026_Plan slides (12VILpNVvJfzANfUJG1Vq8SbsjoOu_fp54iK6G3U-3Wg)
- Companion notes: [[parking-capability-literature]] · [[parking-capability-critique-2026-06-12]]
- Related vault notes: [[parking-wfm-update]] · [[agent_tasks/2026/06/Week-2/2026-06-12-parking-capability-research-kickoff|kickoff task note]] · [[agent_tasks/2026/06/Week-2/2026-06-12-parking-capability-research-phases1-3|phases 1–3 task note]]
