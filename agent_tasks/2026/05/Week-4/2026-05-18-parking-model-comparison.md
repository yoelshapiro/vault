# Parking Model Comparison

## Summary

Created an interactive HTML report comparing the current branch's `parking_config.py` model against Zak Murez's `origin/zmurez/pudo` branch.

## Findings

- `parking_config.py` is identical between the current branch and `origin/zmurez/pudo`.
- The current parking config trains the SI/Zoo `MIMOSTTransformer` path with `ParkingModelCfg -> WFMSt100xYoloCfg`: `large` ST backbone, 11 ST blocks, YOLO WFM pretrain, active parking/gear adaptors, active latent-action conditioning, behavior control disabled, radar/navigation disabled.
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
- Corrected active versus conditional components in the diagrams: SI gear-direction input is an active separate adaptor in `parking_bc_cfg`, SI step/lane navigation and radar are not active in the current `WFMSt100xYoloCfg` path, Zak `COUNTRY_CODE` is active, and Zak `DRIVING_SIDE` is conditional/default-off in the inferred WTA config chain.
- Replaced the connected-module box lists with real SVG visual graphs for each solution, using positioned nodes and arrowed branch/merge edges: SI camera/context/parking/radar paths into `InputAdaptor`, `STTransformer`, and `OutputAdaptor`; Zak image-token and conditioning-token paths into positional encoding, `MCVSpaceTimeEncoder`, `RegressionDrivingHead`, and WTA heads.
- Fixed SVG graph contrast by setting explicit light node fills, dark label fills, no text stroke, and high-contrast arrow marker colors.
- Expanded the model diagrams to use shared comparison language (`Raw inputs`, `Input encoders / adaptors`, `Token groups`, `Token merge`, `Space-time backbone`, `Output head/adaptor`, `Predictions`) and added fuller input labels directly into the graph nodes.
- Added an implementation Q&A section explaining `MCVSpaceTimeEncoder` vs `STTransformer`, WTA mode-classifier inputs/training, separate weights for the 8 heads, and how SI behavior-control uses its internal `latent_action_module` during training versus inference.
- Added a deeper implementation section for the SI latent-action grid: `ActionsDiscretizerCfg` uses a 31x31 2-second waypoint grid with radial-exponent mapping, producing 961 latent-action cells used by behavior-control label generation.
- Corrected the current SI latent/behavior status: `default_losses_parking` has `w_latent_action=1.0`, so `enable_latent_action=True`; `parking_bc_cfg` has `enable_behavior_control=False`, so inference uses the latent-action module's argmax/codebook token rather than a behavior-control token.
- Added a WFM preload explanation for Zak's `MCVSpaceTimeEncoder`: the same checkpoint is loaded through explicit key remapping and `strict=False`, with compatible WFM video/route/backbone tensors reused and new parking/WTA/multimodal heads initialized from scratch.
- Added a detailed 8-head WTA explanation covering aligned ego/indicator/gear `ModuleList` heads, the classifier token and MLP, annealed soft WTA gradient routing, soft classifier targets, and consistency losses that reduce frame-to-frame head identity swapping.
- Added route-shortening/navigation clarification: Zak's WTA base route-map augmentation extends the route polyline to the real parking point, samples a jittered endpoint around park/PUDO valid distances, truncates the route raster at that endpoint, emits `route_end_position` / `route_end_distance`, and keeps the full `NavigationEncoder`/DMI token path default-off outside the SI-baseline variant.
- Corrected the WTA output-head graph and explanation: Zak's mode classifier is a separate learned classifier query token inside `RegressionDrivingHead`, computed in parallel with waypoint-token head banks, then used to select the winning ego/indicator/gear head index.
- Added an output query-token breakdown contrasting SI `OutputAdaptor` query slices with Zak `RegressionDrivingHead` latents, including pseudo-code for both paths.
- Clarified pseudo-code naming: SI `context_tokens` are data-dependent `STTransformer`/radar/behavior-conditioned tokens and `output_queries` are learned output slots; Zak `encoded_mcv_tokens` are data-dependent `MCVSpaceTimeEncoder` outputs and `output_latents` are learned output slots in `RegressionDrivingHead`.
- Normalized Zak graph and pseudo-code vocabulary to SI-facing names: `Video adaptor`, `InputAdaptor equivalent`, `STTransformer equivalent`, `OutputAdaptor equivalent`, `encoder_context_tokens`, `learned_output_queries`, and `decoded_output_tokens`, with Zak implementation names kept in parentheses/comments.
- Added a new `Full Architecture` tab with nested layer-level block diagrams for SI and Zak. Repeated structures are shown once with counts: SI/Zak ViT blocks `12x`, SI `STTransformer` blocks `10x`, and Zak `MCVSpaceTimeEncoder` blocks `11x`.
- Added `arch_detail.css` for readable nested architecture boxes and wired `content_full_arch.js` into the report.
- Reworked the top of the `Full Architecture` tab into actual directed SVG graphs for SI and Zak. Each graph now has arrows between modules and nested layer boxes inside each module; the previous block lists remain below as supporting detail.
- Expanded the `Full Architecture` SVGs with explicit input and output node contents for both SI and Zak, including policy tensor names and WTA all-head/mode outputs.
- Replaced unconnected inner lists with connected inner subgraphs: every module now draws arrows between internal layer boxes, and repeated structures are named as the repeated block itself (`ViTBlock x12`, SI `STBlock x10`, Zak `STBlock x11`) followed by their internal layer sequence.
- Fixed graph semantics and spacing: raw input and output nodes are now independent tensor lists without fake sequential arrows, the misleading WTA-output back arrow was removed, and both graphs now use a wider canvas/min-width for more readable module spacing.
- Reorganized the report into a book-style chapter order: Start Here, Architecture Graphs, Data Recipe, Input Adaptors, Encoders, Output Adaptor, Latents & Multimodal, Losses & Preloads, BC vs RL, Config Evidence, Terminology, and Critique.
- Replaced the previous parchment theme with a high-contrast signal-lab visual design using ordered sidebar navigation, chapter cards, dark shell, and high-contrast diagram/table styling.
- Softened the theme after review: calmer field-notebook palette, lighter content surface, muted teal navigation, lower-contrast diagram strokes, softer table headers, and reduced card/code shadows.
- Added `html_summaries/README.md` as the vault index for interactive HTML summaries and linked it from the vault root index.
- Added GitHub links pinned to the current commit and Zak branch commit.
- Extended the report to include Wonjoon90's PR 106346 long-horizon parking planning model and the linked Notion design.
- Fetched and inspected PR 106346 with `gh pr view`, `gh pr view --comments`, and a local `pr/106346` ref.
- Added `content_wonjoon.js` with a dedicated visual graph for the path-diffusion architecture: WFM/ST encoder, cross-attention pool split, primary path diffusion head, two auxiliary diffusion heads, `PolicyPathConditioner`, and ordinary waypoint/indicator/gear head.
- Added `content_full_arch_wonjoon.js` so the existing `Full Architecture` tab now contains a third full graph for Wonjoon's model beside the SI and Zak graphs.
- The Wonjoon full-architecture graph uses the same SI-facing language as the other two graphs and explicitly shows raw input tensors, per-input adaptors, `InputAdaptor`, `STTransformer`, `DiffusionOutputAdaptor`, primary path diffusion, auxiliary diffusion heads, `PolicyPathConditioner`, `OrdinaryHead`, path outputs, and ordinary policy outputs.
- Updated the overview and architecture tabs to include a three-way SI vs Zak vs Wonjoon comparison and links to the new Wonjoon tab.
- Added details from the Notion architecture/data pages: optional goal pose, path sampling at 50 points with 0.5m spacing, delta/polar/chunked path encoding, guided diffusion intent, and path-conditioned ordinary policy prediction.
- Added PR-specific training details: 0.5 driving / 0.5 parking data mix, `w_diffusion=1.0`, ordinary policy losses, auxiliary diffusion loss, LR `1e-5`, output adaptor LR `1e-4`, 200k steps, bf16, BC-only training, and parking wrapper path outputs.

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
- Re-verified the softened stylesheet is served from port 3005 and all report JavaScript syntax checks still pass.
- Verified the updated Data Recipe/Input Adaptors content is served from port 3005 and `content_core.js` remains under 500 lines.
- Verified the updated `content_model_blocks.js` output-query section is served from port 3005 and passes `node --check`.
- Verified the revised token/latent naming pseudo-code is served from port 3005 and `content_model_blocks.js` remains under 500 lines.
- Verified the graph label normalization and shared-name pseudo-code are served from port 3005; `content_model_blocks.js` passes `node --check` and remains under 500 lines.
- Verified `content_full_arch.js` and `app.js` pass `node --check`, the new tab registers in the report script list, and the new CSS/JS assets return HTTP 200 from port 3005.
- Verified the `Full Architecture` tab renders two `full-arch-graph` SVGs with 14 directed edges total and the updated assets are served from port 3005.
- Verified the revised `Full Architecture` tab still renders two SVG graphs, now with 14 module-level directed edges, 72 inner directed layer edges, and 13 module nodes; `content_full_arch.js` passes `node --check`.
- Verified the widened full-architecture graphs render as two `1800x950` SVGs, the WTA back arrow is absent, raw-input boxes have no inner sequential edges, and the updated script passes `node --check`.
- Re-read the current `parking_config.py`, `WFMSt100xYoloCfg`, `build_space_time_model`, `InputAdaptor`, `OutputAdaptor`, and Zak `origin/zmurez/pudo` MCV builder/configs after graph feedback.
- Rebuilt the `Full Architecture` SVGs with separate raw input nodes for images, route, speed, speed limit, indicator, gear, automation, parking mode, country, driving side, pose, waypoint-slot, navigation, and radar.
- Corrected graph semantics: images alone feed `VideoSTAdaptor`; non-image tensors each feed their own adaptor/tokenizer; SI `InputAdaptor` sits after all active adaptor outputs and performs ordered concat/time encoding; Zak's equivalent is split across `input_adapters`, positional encoding, and `MCVSpaceTimeEncoder`.
- Updated surrounding text and tables to remove stale `large_l10`, Dec-WFM/radar-late-fusion, gear-dropout-only, and behavior-control-enabled claims.
- Cleaned the full-architecture graph wiring: SI now has one logical arrow from `OutputAdaptor` to policy outputs plus explicit `LatentActionModule` and disabled `Behavior control` side blocks; Zak no longer routes image tokens directly to both input and transformer, and WTA mode is an explicit classifier block feeding the selected output.
- Corrected the latest WTA selector semantics: the mode classifier is now a parallel classifier-query branch that feeds a `Select head k` mux after the eight ego/indicator/gear head banks, not a block feeding the trajectory heads.
- Corrected SI behavior-control graph semantics from code: behavior control is shown as a disabled branch inside `_apply_behavior_and_latent_conditioning`, while the active latent-action path conditions tokens before final output-query cross-attention.
- Corrected SI behavior-control graph semantics again to distinguish `ParkingOutputAdaptorCfg` from the `parking_bc_cfg` train wrapper: the model-level branch is now shown as present and gated by `${...enable_behavior_control}`, with the wrapper override kept as text detail rather than removing/marking the module disabled.
- Verified all report JS files with `node --check` and evaluated the content scripts in a Node VM; the `fullarch` section contains the corrected `VEHICLE_GEAR_DIRECTION` graph and no `large_l10` references remain.
- Served the report locally on port 3005 from `~/git/vault/html_summaries/parking-model-comparison`.
- Verified `content_wonjoon.js`, `content_core.js`, and `content_model_blocks.js` pass `node --check`.
- Evaluated all content scripts together in Node and confirmed 14 report tabs register, including `wonjoon`.
- Verified `http://localhost:3005/` returns HTTP 200 and the served `index.html` includes `content_wonjoon.js`.
- Could not run a Playwright screenshot because the local `playwright` package is not installed in this workspace.
- Verified all report JavaScript after adding the Full Architecture Wonjoon companion script; the `fullarch` section now evaluates to three `full-arch-graph` SVGs and includes the explicit `OrdinaryHead` node.
