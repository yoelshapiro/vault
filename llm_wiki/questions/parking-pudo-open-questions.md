---
type: questions
date: 2026-05-24
evidence: working synthesis
tags:
  - parking
  - pudo
  - open-questions
---

# Parking PUDO Open Questions

## Model Architecture

- Should parking/PUDO remain a wrapper-interleaved specialist policy, become a true multi-head branch, or be folded into the unified multitask model?
- If using multi-heads, where should temporal state such as indicator memory live?
- Should parking/PUDO use latent actions for stop target and maneuver mode, or rely on explicit route/stopping inputs?
- Is `stopping_mode` enough to separate PARK and PUDO, or do we also need destination type, stop side, and target-pose conditioning?

## Data And Labels

- Which taxonomy is operationally current in Console: the spreadsheet, the Notion proposal, or another deployed version?
- Are PUDO event anchors biased toward hazard-compliant data, and does that miss realistic failed or partial PUDO attempts?
- Do UnPUDO/unparking anchors overrepresent gear-transition-plus-acceleration cases and underrepresent hesitation/failure-to-start?
- How much train/test leakage risk exists when using less-wrong examples created on train data?
- Are route-shortened samples and `stopping_mode` labels always consistent?

## Evaluation

- Which dashboard success rates are sensitive to changes in disengagement-window definitions?
- Should PUDO, UnPUDO, and unparking have separate promotion gates?
- How should normal driving regressions be weighted against PUDO improvements when the parking policy is interleaved and unused outside parking triggers?
- Are on-road leaderboard changes comparable across releases if taxonomy and event detection evolved?

## Deployment

- What is the canonical event signal for interleaved wrapper switches if `interleaved_id` and `interleaved_event` remain disabled?
- Which wrapper signatures are stable enough to support both radar and non-radar release lines?
- What is the embedded memory/latency budget if parking/PUDO becomes a real head rather than a separate interleaved wrapper?
- How do route-end threshold calibrations change with route-map config changes?

## Product

- What is the exact distinction between PUDO, double-parked PUDO, legal parking, no-parking curb stop, MRM pull-over, and stop-in-lane in the product taxonomy?
- Should RMF pull-over reuse PUDO/Park stopping machinery or remain a separate behavior-conditioning path?
- Which geographies have different legal PUDO rules that should affect labels, training, or evaluation?

## Source Pages To Revisit

- [[llm_wiki/sources/2026-05-24-notion-parking-product-data-eval|Parking product/data/eval source summary]]
- [[llm_wiki/sources/2026-05-24-notion-parking-newsletters-release|Parking newsletters/release source summary]]
- [[llm_wiki/sources/2026-05-24-drive-multitask-and-multi-heads|Multitask and multi-heads source summary]]
- [[llm_wiki/sources/2026-05-24-notion-latent-actions-navigation-behavior|Latent actions/navigation source summary]]
