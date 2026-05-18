# Parking Model Comparison

## Summary

Created an interactive HTML report comparing the current branch's `parking_config.py` model against Zak Murez's `origin/zmurez/pudo` branch.

## Findings

- `parking_config.py` is identical between the current branch and `origin/zmurez/pudo`.
- The current parking config trains the SI/Zoo `MIMOSTTransformer` path with the Dec 2025 WFM checkpoint, radar late fusion, parking/gear/behavior adaptors, and standard BC losses.
- Zak's branch contains newer experimental MCV configs and code under `wayve/ai/experimental`, including an inferred active WTA multimodal config `mcv_new_phase2x_wta.yml`.
- Zak's multimodal approach uses an 8-head WTA driving head with per-head ego, indicator, and gear outputs, classifier routing, and consistency losses.
- Zak's branch also has an RL-capable config (`mcv_new_rl.yml`), but the inferred WTA parking work is BC training.

## Changes

- Added `wayve/ai/parking/model_comparison/index.html`.
- Included tabs for overview, config evidence, data, input adaptors, ST/MCV encoders, output adaptors, latent actions, losses/LR/preloads, BC vs RL, and critique.
- Added GitHub links pinned to the current commit and Zak branch commit.

## Verification

- Confirmed no `parking_config.py` diff between `HEAD` and `origin/zmurez/pudo`.
- Confirmed the generated HTML is 303 lines.
- Served the report locally on port 3005.
