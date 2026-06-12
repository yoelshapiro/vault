# 2026-06-12 — Parking Capability Research: Phases 1–3 (Deep Dive, Literature, Solutions)

## Task
Continuation of [[2026-06-12-parking-capability-research-kickoff]] after Boris said "start": execute Phase 1 (sibling-branch + design-doc deep dive), Phase 2 (literature sweep), Phase 3 (novel solution proposals) into [[projects/parking-capability-architecture-research]].

## What was done
1. **Phase 1+2 workflow** (11 parallel agents, ~966k subagent tokens, run `wf_680411d8-f2b`):
   - Branch archaeology: `soham/dynamic-horizon-path[-clean]` + `soham/affinity-guided-diffusion[-clean]` (PRs #114772/#114773 open; trained dhla1 checkpoint; affinity-guidance v1→v2 failure analysis), `wonjoongoo/diffusion-v4-parking-path-pred` (goal conditioning built then dropped on merge of #106346; survives under `origin/aa/wonjoon_*`), `sohamphade/parking-annotation-pipeline` (3-sample CoT prototype, multi-spot lists, no spatial grounding), and the real WTA: `AnnealedWTALoss` on `zmurez/pudo` (≡ 2024 aWTA paper; K=8 banks + oracle-imitating mode classifier + EMA; no recorded results).
   - All 4 Google-Drive design docs read and summarized (System Design Overview, Multiple Driving Heads, Parking_SW_tech DRAFT_3, Parking_2026_Plan slides) — key constraints: frozen trunk + stateless heads + caching-in-trunk; 8 s horizon target; PSD `[N,4,3]`; ~25% DRAM per head; MPA as external visual path encoder.
   - Literature: 6-topic sweep (diffusion/flow planners, multimodal prediction, E2E parking academic+industry, external memory/mapping, hierarchy/latent actions/test-time search, parking semantics) → digested in [[projects/parking-capability-literature]].
2. **Phase 3:** drafted six solution families, then ran a **4-lens adversarial critique workflow** (production, data realism, novelty/coherence, org fit; run `wf_b4fa8e76-02d`, repo-verified findings) → folded all blockers/majors into the final §8 of the project doc; critique preserved in [[projects/parking-capability-critique-2026-06-12]].

## The solutions (final §8 summary)
- **§8.0 P0 prerequisites:** HOLD/dwell semantics (distance-parameterized paths can't express "wait" — likely root of standstill-in-drive); termination semantics + migrate end-of-route detection off raster pixel sums; 1-week reverse-capability diagnostic on the frozen trunk; ONE leg-code action vocabulary (gear ∈ {F,R,HOLD} × endpoint cell × side).
- **S1 PRX head:** Propose (two-tier spots, consumes MS3 PSD head) → Rank (rule-distilled + preference + critic; listwise hindsight w/ exposure debiasing) → eXecute (anchored-truncated diffusion retrain, K proposals @ ~2 steps; trained goal token + in-graph inpainting; affinity guidance demoted to offline tool).
- **S2 leg-codebook:** `POLICY_PARKING_LEGS` (parking head only); prerequisites: P→D detector fix (heaviest bucket trains mislabeled), canonical gear reconstruction, gc count audit; aWTA = contingency behind a gate; multi-leg via 1 Hz strategic loop.
- **S3 memory as head-side tokens** (raster repainting killed by review): in-process coverage v0 (~500 m window, soft prior, paired-contrast + 3DGS-gym RL for the learning signal), spot inventory MS5, rule layer with conservative veto (R1 legality scoped to mapped zones), stored spots → one-page MPA reassessment input.
- **S4 fleet data engine (scoped):** GPS-resolution priors; counterfactual positives recall-only + free-space gated; unparking nopudo + anchor hygiene; HER/GCSL relabeling; VLM = attributes only, geometry from PSD campaign.
- **S5 critic-as-ranker:** symmetric head, parking-reward retrain prerequisite, offline → shadow → gate ladder; commitment layer (target lock + hysteresis) in PMS; abort/recovery state machine; USS veto semantics.
- **S6:** WFM latent-action pretrain off 2026 critical path (trunk-release rider); 3DGS lot gyms promoted (search-behavior training + closed-loop eval + rare cases); barrier-state head + creep-wait data for gates; ticket-pulling descoped (operator ANPR track).
- Honest coverage matrix, rebuilt phasing vs MS2–MS5, top-10 surviving risks.

## Key decisions/corrections from critique
- Route-raster repainting would have corrupted the end-of-route → PARKING_MODE trigger and is invisible to the frozen trunk — replaced with head-side cross-attention tokens.
- "Coverage labels are free" was wrong: hindsight rasters validate plumbing only; search behavior needs contrastive pairs + sim-gym RL.
- Cross-run spot-level aggregation impossible at GNSS precision; scoped to lot-level priors.
- Novelty claims trimmed to two defensible items (unified gear-aware leg vocabulary under frozen-trunk; memory-as-input wiring + commitment layer); everything else framed as adoption.

## Links
- Project doc: [[projects/parking-capability-architecture-research]] (§8 = deliverable)
- Literature: [[projects/parking-capability-literature]]
- Critique log: [[projects/parking-capability-critique-2026-06-12]]
- Workflows: wf_680411d8-f2b (11 agents), wf_b4fa8e76-02d (4 critics)
