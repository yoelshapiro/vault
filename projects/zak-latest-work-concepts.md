# Zak Latest Work Concepts (Meeting on 2026-04-13)

## Overview
- **What it is:** A concept translation project for Zak Murez's latest multimodal waypoint-head research discussion.
- **Why it matters:** Converts a dense research conversation into a stable reference so implementation, review, and follow-up experiments are grounded in shared definitions.
- **Primary users:** Boris, Zak, and collaborators reviewing model architecture, training dynamics, and data debugging methods.

## Status
- **Phase:** Phase 1
- **Status:** active
- **Last updated:** 2026-04-14
- **Current priorities:**
  - Capture all concepts from the meeting in one place.
  - Separate "existing behavior conditioning" from Zak's new multimodal head design.
  - List concrete questions to validate in follow-up experiments.
- **Blockers:**
  - None

## Requirements
- **Problem statement:** "Understand all concepts Zak mentioned yesterday" without losing technical nuance.
- **Target users:** Engineers and researchers involved in parking/PUDO and multimodal planning behavior.
- **Integrations:** None.
- **Constraints:**
  - Must stay faithful to meeting language while clarifying ambiguous terms.
  - Must be easy to skim and use in later experiment planning.
- **Success criteria:**
  - Every major concept in the transcript is explained in plain technical language.
  - Differences between competing approaches are explicit.
  - Open questions are clear enough to drive next experiments.

## Design
- **Approach:** Parse the transcript into (1) model architecture concepts, (2) training dynamics and failure modes, (3) influence-analysis concepts, and (4) practical implications for experiments.
- **Key decisions:**
  - Keep terms from the meeting and add concise definitions.
  - Mark uncertain wording from speech-to-text (for example "Hessen" -> likely "Hessian"; "kneeling" -> likely "annealing").
  - Focus on concepts, not implementation details not present in the conversation.
- **Open questions:**
  - Exact loss formulation used for head selection + classifier supervision.
  - Exact EMA coefficient on mode logits and whether smoothing adds latency.
  - Whether influence signal quality materially improves in practice with this discrete mode-selection framing.

## Build Phases
- **Phase: Phase 1**
  - **Goal:** Produce a complete glossary and concept map from the meeting.
  - **Work items:**
    - Extract and normalize key concepts.
    - Clarify contrasts (old discrete-grid approach vs K-head approach vs latent actions).
    - Record hypotheses and risks mentioned by Zak.
  - **Validation:**
    - Reader can explain the architecture/training flow end-to-end.
    - Reader can name expected benefits and failure modes.

## Decisions
- **2026-04-14:**
  - **Decision:** Create a dedicated vault project (not a loose note) so concept definitions persist and can be extended with experiment outcomes.
  - **Rationale:** This topic is multi-threaded research work and benefits from a single source of truth.

## Notes
### Quick Model Summary
Zak switched from an autoregressive/discrete-grid style multimodal waypoint head to a simpler parallel `K`-head regression setup with a classifier that chooses which head to use at inference. The goal is easier multimodal learning, potentially better driving behavior, and better signal for influence analysis/debugging of bad data.

### Concept Glossary (From the Meeting)
1. **Multimodality (driving):** There can be multiple valid future trajectories from the same scene (for example stop vs go at yellow).
2. **Waypoint head:** Output head predicting future waypoints/trajectory.
3. **Autoregressive discrete grid (old direction):** Predicting trajectory decisions over discrete bins/tokens across steps.
4. **Latent actions (general idea):** Discrete learned codes (codebook) representing action intents; outputs are conditioned on selected latent code(s).
5. **Codebook size vs flexibility:** Large codebooks (for example ~512) can represent many behaviors; combining multiple tokens gives very high combinatorial capacity.
6. **K-head regression (new direction):** Predict `K` candidate trajectories in parallel (Zak mentioned values like 10 or 16).
7. **Winner-take-all training for K-heads:** During training, pick the head closest to ground truth and backprop only that regression head.
8. **Classifier/gating head:** Separate head predicts which regression head should win.
9. **Inference selection:** Use classifier `argmax` to choose one trajectory head at runtime.
10. **Mode switching artifact:** Rapid switching between heads can cause jerky accel/brake behavior.
11. **EMA on mode logits:** Exponential moving average smoothing of classifier logits to reduce rapid mode flips.
12. **Mode visualization:** Inspect each mode's trajectory behavior in scenarios (for example parking lots, yellow lights) to verify learned semantics.
13. **Dead head problem:** A poorly initialized head may never become closest to ground truth, so it receives little/no gradient and stays bad.
14. **Soft assignment variant (speech likely "annealing"):** Instead of hard winner-take-all, distribute regression loss across heads using soft weights by closeness to GT; start broad then anneal to sharper specialization.
15. **Relation to Mixture of Experts (MoE):** Similar in spirit (multiple experts + routing), but Zak's setup routes by GT proximity during training, not by learned router decisions.
16. **Load balancing/entropy regularization:** Mentioned as possible mechanism to avoid mode collapse or underused heads.
17. **Behavior conditioning (existing in model):** Current behavior conditioning was described as simpler/mostly 1D behavior signal (speed-like), distinct from this new multimodal selector setup.
18. **Discrete grid tradeoff:** Coarse bins lose detail; fine bins create huge class space and harder optimization.
19. **Cross-entropy structure issue on huge grids:** Nearby-but-not-exact bins are treated as fully negative, so geometry/ordinal proximity is poorly captured.
20. **Uncertainty imbalance example (red light):** One "stay" bin can dominate argmax while many "go" bins each get small probability; sampling may look okay but argmax may not.
21. **Influence analysis (goal):** Identify training samples that most affected a specific model decision.
22. **Naive influence baseline:** Retrain model with one sample removed and compare prediction change (accurate but prohibitively expensive).
23. **Approximate influence methods:** Use second-order approximations (speech said "Hessen", likely Hessian-based) to estimate effect of samples efficiently.
24. **Stop-sign example from colleague work:** Influence ranking surfaced data that encouraged rolling through stop signs; used to detect bad data and also supporting positive examples.
25. **Influence noise:** False positives/negatives remain; Zak expects stronger signal if target is discrete mode-classification choice rather than continuous waypoint output.
26. **Task-specific vs context-specific modes:** Modes are not explicitly tied to "parking vs driving"; they emerge from full context (scene + route + intent).
27. **Yellow-light mode separation example:** One mode stops harshly, another proceeds through; used as qualitative evidence multimodality can be represented.
28. **Parking-lot expectation:** Hoping heads map to distinct parking-spot trajectories instead of flickering between spots.
29. **Research-bet framing:** Combined experiments to save compute, with plan to revert architecture changes if overall results regress.

### What Zak Was Trying to Improve
- Better multimodal trajectory quality and mode separation.
- Better final selected behavior via classifier quality.
- Better data debugging leverage through influence analysis on discrete decisions.

### Risks Mentioned or Implied
- Architecture change may regress baseline behavior and need rollback.
- Classifier can choose wrong mode even when a correct mode exists.
- Some heads may be low-quality without balancing/annealing strategies.
- Smoothing can trade less jerk for potentially slower mode adaptation.

### Follow-up Questions For Next Meeting
- What exact `K` and horizon are currently used in training/inference?
- How is the classifier trained (target = closest head index, with what loss/weighting)?
- What is the EMA coefficient/window and how does it affect responsiveness?
- Are head usages balanced over dataset slices (urban, parking, yellow lights, PUDO)?
- Which influence method implementation is used and what metrics define "stronger signal"?
