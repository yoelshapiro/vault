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

- Added `wayve/ai/parking/model_comparison/index.html`, `style.css`, and `app.js`.
- Included tabs for overview, config evidence, data, input adaptors, ST/MCV encoders, output adaptors, latent actions, losses/LR/preloads, BC vs RL, and critique.
- Expanded the first draft into a denser deep dive with block diagrams on each major topic, detailed component tables, and fuller explanations of SI behavior control versus Zak's WTA multimodal head.
- Split content into `content_core.js`, `content_latents.js`, and `content_arch.js` to keep each file under 500 lines.
- Reworked the Latents & Multimodal section with selectable solution-specific diagrams for SI latent action, SI behavior control, and Zak WTA multimodal.
- Added pseudo-code blocks for data signal construction, input adaptors, encoder flow, output heads, WTA loss, and offline RL training.
- Added a Terminology tab and encoder callout defining "MCV tokens" as Zak's MCVPerceiver encoded context tokens.
- Reworked the overview into true neural-network module flow diagrams, separating datamodule/loss/training concerns into their own tabs.
- Reworked data, encoder, output, loss, and training tabs into per-solution vertical flows plus aligned comparison tables.
- Re-read the model construction code and added a dedicated `Model Blocks` tab with code-traced per-solution module graphs for SI `MIMOSTTransformer` and Zak `MCVPerceiver`.
- Corrected active versus conditional components in the diagrams: SI gear-direction input is constructed but inherited dropout-only, while Zak `COUNTRY_CODE` is active and `DRIVING_SIDE` is conditional/default-off in the inferred WTA config chain.
- Added explicit connected module graphs for each solution showing branch/merge structure: SI camera/context/parking/radar paths into `InputAdaptor`, `STTransformer`, and `OutputAdaptor`; Zak image-token and conditioning-token paths into positional encoding, `MCVSpaceTimeEncoder`, `RegressionDrivingHead`, and WTA heads.
- Added GitHub links pinned to the current commit and Zak branch commit.

## Verification

- Confirmed no `parking_config.py` diff between `HEAD` and `origin/zmurez/pudo`.
- Confirmed the generated files stay under 500 lines each.
- Ran `node --check` on all report JavaScript files.
- Evaluated the content scripts in a Node VM to verify all tabs register.
- Verified the new `content_model_blocks.js` asset is served from port 3005.
- Served the report locally on port 3005.
