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

- Added the interactive report bundle, then moved it from `wayve/ai/parking/model_comparison/` into the vault under `html_summaries/parking-model-comparison/`.
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
- Replaced the connected-module box lists with real SVG visual graphs for each solution, using positioned nodes and arrowed branch/merge edges: SI camera/context/parking/radar paths into `InputAdaptor`, `STTransformer`, and `OutputAdaptor`; Zak image-token and conditioning-token paths into positional encoding, `MCVSpaceTimeEncoder`, `RegressionDrivingHead`, and WTA heads.
- Fixed SVG graph contrast by setting explicit light node fills, dark label fills, no text stroke, and high-contrast arrow marker colors.
- Expanded the model diagrams to use shared comparison language (`Raw inputs`, `Input encoders / adaptors`, `Token groups`, `Token merge`, `Space-time backbone`, `Output head/adaptor`, `Predictions`) and added fuller input labels directly into the graph nodes.
- Added an implementation Q&A section explaining `MCVSpaceTimeEncoder` vs `STTransformer`, WTA mode-classifier inputs/training, separate weights for the 8 heads, and how SI behavior-control uses its internal `latent_action_module` during training versus inference.
- Added a deeper implementation section for the SI latent-action grid: `ActionsDiscretizerCfg` uses a 31x31 2-second waypoint grid with radial-exponent mapping, producing 961 latent-action cells used by behavior-control label generation.
- Clarified that current SI parking has `enable_latent_action=False` and `enable_behavior_control=True`, so inference uses a supplied/default behavior token while the latent-action grid and internal latent-action module are primarily training-time behavior-label machinery.
- Added a WFM preload explanation for Zak's `MCVSpaceTimeEncoder`: the same checkpoint is loaded through explicit key remapping and `strict=False`, with compatible WFM video/route/backbone tensors reused and new parking/WTA/multimodal heads initialized from scratch.
- Added a detailed 8-head WTA explanation covering aligned ego/indicator/gear `ModuleList` heads, the classifier token and MLP, annealed soft WTA gradient routing, soft classifier targets, and consistency losses that reduce frame-to-frame head identity swapping.
- Reorganized the report into a book-style chapter order: Start Here, Architecture Graphs, Data Recipe, Input Adaptors, Encoders, Output Adaptor, Latents & Multimodal, Losses & Preloads, BC vs RL, Config Evidence, Terminology, and Critique.
- Replaced the previous parchment theme with a high-contrast signal-lab visual design using ordered sidebar navigation, chapter cards, dark shell, and high-contrast diagram/table styling.
- Added `html_summaries/README.md` as the vault index for interactive HTML summaries and linked it from the vault root index.
- Added GitHub links pinned to the current commit and Zak branch commit.

## Verification

- Confirmed no `parking_config.py` diff between `HEAD` and `origin/zmurez/pudo`.
- Confirmed the generated files stay under 500 lines each.
- Ran `node --check` on all report JavaScript files.
- Evaluated the content scripts in a Node VM to verify all tabs register.
- Verified the new `content_model_blocks.js` asset is served from port 3005.
- Confirmed the `Model Blocks` HTML contains two SVG visual graphs and 37 arrowed edges. Attempted a Playwright screenshot, but browser binaries are not installed in the workspace cache.
- Verified the updated report JavaScript registers the Q&A section and refreshed graph labels.
- Re-ran `node --check` on all report JavaScript after the latent-action/WTA expansion.
- Verified the served `content_model_blocks.js` includes the new latent-action grid, WFM preload, and eight-head consistency sections.
- Re-ran JavaScript syntax checks from the vault copy and verified the page and stylesheet return HTTP 200 from port 3005.
- Served the report locally on port 3005 from `~/git/vault/html_summaries/parking-model-comparison`.
