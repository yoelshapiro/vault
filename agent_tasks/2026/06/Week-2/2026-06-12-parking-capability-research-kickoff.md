# 2026-06-12 — Parking Capability Research: Kickoff & Problem Framing

## Task
Boris asked for a research effort: find novel, production-viable solutions for adding parking capability (street → lots → multi-story → gates → preferred → memory parking) to the end-to-end driving model. Three architecture gaps framed up front: longer horizon, multimodality, memory/in-context learning. Step 1 (this session): acknowledge the task, ground in code + Notion, write the framing document, ask clarification questions.

## What was done
- Ran a 5-agent grounding sweep (read-only) over:
  - `wayve/ai/si/configs/baseline/release.py` → full architecture trace (MIMOSTTransformer, ViT, ST transformer, latent actions, output adaptor, BC/RL stages, statelessness confirmed).
  - `wayve/ai/si/configs/parking/parking_config.py` + `wayve/ai/zoo/outputs/diffusion.py` → diffusion path planner status (distance-based 24.5 m POLICY_PATH, two-stage with OrdinaryHead, deterministic single proposal on car, no spot conditioning on this branch).
  - `zmurez/pudo` branch → "multi-head WTA" is really AR discrete-goal grid heads (parking spot + 8/4/2 s) with hindsight CE + argmax, in the experimental MCV Perceiver stack.
  - AR spot→latent-action→trajectory approach → idea only; fragments on `soham/affinity-guided-diffusion`, `wonjoongoo/diffusion-v4-parking-path-pred`; no multi-candidate spot labels exist anywhere.
  - Notion → 11 pages summarized (architecture docs, Parking 2026 roadmap/milestones, May 5 multi-head shift, Jan 12 PUDO pivot).
- Wrote the project framing doc: [[projects/parking-capability-architecture-research|Parking Capability — Architecture Research]] (problem definition, grounded model summary, status of all 4 existing approaches, production constraints, research plan, open questions, seed solution directions).
- Asked Boris 7 clarification questions (scope tiers, architecture freedom, memory/ICL mandate vs May-5 guidance, latency hard-filters, 2 s controller contract, data leverage, deliverable home).

## Key findings worth remembering
- Latent actions are ON in the release baseline but `enable_latent_action=False` in the parking adaptor; LA grid geometry (radial-exponent, forward-tuned) is wrong for parking.
- The model is confirmed stateless: 1 s in / 2 s out fixed window; only sliding feature caches + wrapper-side indicator memory.
- A3 (zmurez WTA) ≈ A4 (AR latent-action approach) in spirit — closest living implementation of spot-conditioned planning, but in the wrong stack.
- Notion records guidance to avoid ICL research (May 5) while this task explicitly asks for memory/ICL — flagged for explicit decision.
- Memory parking (MPA) out of 2026 scope, "reassess end-Q2" — this research may be that reassessment.

## Links
- Project doc: [[projects/parking-capability-architecture-research]]
- Workflow run: wf_f8e07595-c1b (5 agents, ~890k subagent tokens)
