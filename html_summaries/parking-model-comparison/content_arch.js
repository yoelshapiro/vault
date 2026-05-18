window.REPORT_SECTIONS = window.REPORT_SECTIONS || [];

window.REPORT_SECTIONS.push(
  {
    id: "encoder",
    title: "Encoders",
    html: `
      <div class="grid">
        <div class="card">
          <h3>Current SI encoder</h3>
          <div class="module-flow">
            <div class="module-step green"><b>Preprocess module</b><small>Reduced blind-spot image preprocessing and focal mapping.</small></div>
            <div class="module-step blue"><b>InputAdaptor</b><small>Builds a single <code>[B,T,N,C]</code> token tensor from video and conditioning adaptors.</small></div>
            <div class="module-step rust"><b>STTransformer.blocks</b><small>Sequential <code>STBlock</code> stack. Each block applies space/time attention and MLP transformation over the token tensor.</small></div>
            <div class="module-step"><b>STTransformer.output_norm</b><small>Final norm produces <code>OUTPUT_TOKENS</code>.</small></div>
            <div class="module-step yellow"><b>Radar late-fusion adaptor</b><small>Separate radar branch produces <code>RADAR_TOKENS</code> after the ST backbone.</small></div>
          </div>
          <ul>
            <li><code>MIMOSTTransformer.forward_encoder</code> preprocesses images, calls the input adaptor, runs <code>STTransformer</code>, then optionally computes radar tokens.</li>
            <li><code>STTransformer</code> is a list of <code>STBlock</code>s followed by a final norm. It preserves the token tensor shape.</li>
            <li>Parking latest release uses Dec 2025 WFM, <code>large_l10</code>, layer-10 removal, flash attention v3, and vectorized feature cache.</li>
            <li>The radar path uses <code>msa-sa5-tok10-dim512-ae-sa2</code> with an AE checkpoint and is fused later, not inside the ST backbone.</li>
          </ul>
        </div>
        <div class="card">
          <h3>Zak MCV encoder</h3>
          <div class="module-flow">
            <div class="module-step green"><b>MCVPerceiver.stem</b><small>ViT patch stem maps images to visual tokens.</small></div>
            <div class="module-step blue"><b>MCVPerceiver.input_adaptor</b><small>ModuleDict emits named conditioning token groups.</small></div>
            <div class="module-step rust"><b>ContinuousPositionalEncoding</b><small>Adds spatial camera encoding and continuous time encoding to visual/conditioning tokens.</small></div>
            <div class="module-step yellow"><b>MCVSpaceTimeEncoder</b><small>Causal factorized space/time transformer over image and conditioning tokens.</small></div>
            <div class="module-step"><b>Encoded <code>x_mcv</code></b><small>Context token set consumed by world-model heads, label heads, reward heads, or driving head.</small></div>
          </div>
          <ul>
            <li>Base config sets <code>DIM=1536</code>, <code>HEADS=16</code>, <code>MCV_LAYERS=11</code>, <code>SPACE_TIME_FACTORIZED=True</code>, <code>CAUSAL=True</code>.</li>
            <li>Phase2x disables one-step autoregression and changes temporal encoding to reference the first frame.</li>
            <li>The decode path slices past/future tensors, handles deployment temporal cache, builds adapter tokens, adds positional encoding, runs MCV encoder, appends radar tokens if configured, then calls <code>driving_head</code>.</li>
          </ul>
        </div>
      </div>
      <table class="compare dense aligned">
        <tr><th>Encoder concept</th><th>Current SI parking</th><th>Zak MCV/WTA</th></tr>
        <tr><td>Tensor entering encoder</td><td><code>INPUT_TOKENS</code>, already merged by Zoo <code>InputAdaptor</code>.</td><td>Image-stem tokens plus separate adapter token dict <code>xs</code>.</td></tr>
        <tr><td>Position/time treatment</td><td>Handled by the ST input/video adaptor and optional temporal machinery in the ST stack.</td><td><code>ContinuousPositionalEncoding</code> explicitly adds time encoding, with phase2x applying temporal encoding to all tokens.</td></tr>
        <tr><td>Backbone module</td><td><code>STTransformer</code>: list of <code>STBlock</code>s plus output norm.</td><td><code>MCVSpaceTimeEncoder</code>: 11-layer factorized space/time transformer.</td></tr>
        <tr><td>Radar interaction</td><td>Radar tokens are produced after the ST encoder.</td><td>Radar can be concatenated after MCV encoding when enabled; inferred WTA base path is primarily camera/conditioning.</td></tr>
      </table>
      <div class="callout blue book">
        <p><b>What "MCV tokens" means.</b> In this report, MCV tokens are the <code>x_mcv</code> encoded context tokens in Zak's <code>MCVPerceiver</code>. They start as image-stem patch tokens, get joined with route/parking/speed/gear/indicator/context tokens from input adapters, receive continuous positional/time encoding, and then pass through <code>MCVSpaceTimeEncoder</code>. The WTA driving head cross-attends to this encoded token set.</p>
      </div>
      <div class="codegrid">
        <pre><code># SI forward shape sketch
outputs = {}
inputs = preprocess(inputs)
input_tokens = input_adaptor(inputs)     # [B, T, N, C]
output_tokens = st_transformer(input_tokens)
radar_tokens = radar_adaptor(inputs)     # optional [B, T, Kr, C]
outputs = output_adaptor(inputs, {output_tokens, radar_tokens})</code></pre>
        <pre><code># Zak MCV forward shape sketch
x = stem(images)                         # [B, T, visual_tokens, C]
xs = input_adaptor(batch)                # named condition-token groups
x, xs = continuous_positional_encoding(x, xs, timestamps)
x_mcv = mcv_encoder(x, xs)
if radar: x_mcv = concat(x_mcv, radar_tokens)
outputs = driving_head(x_mcv, speed, curvature, parking_request)</code></pre>
      </div>
      <p class="src">Sources: SI model flow ${link(gh.cur, "wayve/ai/zoo/st/models.py", 49, "MIMOSTTransformer")}; ST blocks ${link(gh.cur, "wayve/ai/zoo/st/st_transformer.py", 10, "STTransformer")}; Zak construction ${link(gh.zak, "wayve/ai/experimental/models/mcv_perceiver.py", 888, "MCV build")}; Zak decode ${link(gh.zak, "wayve/ai/experimental/models/mcv_perceiver.py", 1382, "encode/decode")}.</p>
    `,
  },
  {
    id: "outputs",
    title: "Output Adaptor",
    html: `
      <table class="compare dense">
        <tr><th>Stage</th><th>Current SI OutputAdaptor</th><th>Zak RegressionDrivingHead</th></tr>
        <tr><td>Input</td><td>ST output tokens plus optional radar tokens.</td><td>MCV encoder tokens plus optional radar tokens concatenated before head.</td></tr>
        <tr><td>Conditioning</td><td>Behavior-control token is added to all tokens; latent-action token path is disabled.</td><td>Behavior codebook support exists, but WTA config is centered on learned output latents and mode heads.</td></tr>
        <tr><td>Query layer</td><td>Learned output queries cross-attend to fused tokens.</td><td>Learned <code>self.latents</code> cross-attend to MCV tokens.</td></tr>
        <tr><td>Heads</td><td>Waypoint, indicator, gear direction, waypoint log variance.</td><td>Eight ego heads, eight indicator heads, eight gear heads, one mode classifier.</td></tr>
        <tr><td>Final selection</td><td>Single decoded output stream.</td><td>Training keeps all heads; inference picks classifier winner, optionally EMA-smoothed.</td></tr>
      </table>
      <div class="module-compare">
        <div class="card">
          <p class="mini-title">SI output module flow</p>
          <div class="module-flow">
            <div class="module-step green"><b><code>fuse_radar_tokens</code></b><small>Combines ST output tokens and radar tokens.</small></div>
            <div class="module-step blue"><b>BehaviorLabelCalculator</b><small>During training, computes a behavior label from top-k latent-action candidate waypoint speeds.</small></div>
            <div class="module-step"><b>BehaviorLabelEncoder</b><small>Maps scalar label to learned codebook token and adds it to all context tokens.</small></div>
            <div class="module-step rust"><b>Output cross-attention</b><small>Learned output queries attend to fused/conditioned context tokens.</small></div>
            <div class="module-step yellow"><b>Output heads</b><small>Waypoint, indicator, gear-direction, waypoint variance.</small></div>
          </div>
        </div>
        <div class="card">
          <p class="mini-title">Zak output module flow</p>
          <div class="module-flow">
            <div class="module-step green"><b>Encoded <code>x_mcv</code></b><small>MCVPerceiver context tokens after MCVSpaceTimeEncoder.</small></div>
            <div class="module-step blue"><b><code>RegressionDrivingHead.latents</code></b><small>Learned output query/latent vectors, including waypoint and classifier slots.</small></div>
            <div class="module-step rust"><b>Driving-head cross-attention</b><small>Latents attend to encoded MCV context.</small></div>
            <div class="module-step yellow"><b>WTA ModuleLists</b><small>Eight ego-position heads, eight indicator heads, eight gear heads.</small></div>
            <div class="module-step"><b>Mode classifier</b><small>Predicts logits over the eight modes and selects the inference head.</small></div>
          </div>
        </div>
      </div>
      <pre><code># SI output pseudo-code
tokens = fuse_radar_tokens(st_tokens, radar_tokens)
tokens = maybe_add_behavior_token(tokens)
queries = learned_output_queries.expand(B)
out_tokens = cross_attention(queries, tokens)
waypoints = WaypointOutputHead(out_tokens[wp_span])
indicator = IndicatorOutputHead(out_tokens[ind_span])
gear = GearDirectionOutputHead(out_tokens[gear_span])
waypoint_var = WaypointVarianceHead(out_tokens[var_span])</code></pre>
      <pre><code># Zak WTA output pseudo-code
h = cross_attention(learned_latents.expand(B), mcv_tokens)
wp_tokens = h[:, :num_waypoints]
all_ego[k] = ego_head[k](wp_tokens)
all_indicator[k] = indicator_head[k](wp_tokens)
all_gear[k] = gear_head[k](wp_tokens)
mode_logits = mode_classifier(h[:, classifier_idx])
winner = argmax(mode_logits)</code></pre>
      <p class="src">Sources: SI OutputAdaptor ${link(gh.cur, "wayve/ai/zoo/outputs/output_adaptor.py", 45, "setup")} / ${link(gh.cur, "wayve/ai/zoo/outputs/output_adaptor.py", 427, "forward")}; Zak head ${link(gh.zak, "wayve/ai/experimental/models/mcv_perceiver.py", 3096, "RegressionDrivingHead")} / ${link(gh.zak, "wayve/ai/experimental/models/mcv_perceiver.py", 3381, "WTA forward")}.</p>
    `,
  },
  {
    id: "losses",
    title: "Losses & Preloads",
    html: `
      <table class="compare dense">
        <tr><th>Area</th><th>Current SI parking</th><th>Zak MCV/WTA</th></tr>
        <tr><td>Supervised losses</td><td><code>w_waypoints=1</code>, <code>w_waypoints_log_likelihood=1</code>, <code>w_indicator=1</code>, <code>w_behavior_control=1</code>, <code>w_gear_direction=1</code>.</td><td>WTA loss supervises ego, cross-track, indicator, gear, mode classifier, optional delta, jerk, and consistency terms.</td></tr>
        <tr><td>Disabled terms</td><td><code>w_latent_action=0</code>, <code>w_cross_track=0</code>.</td><td>Standalone indicator/gear losses are skipped when WTA is enabled; they are absorbed into WTA.</td></tr>
        <tr><td>LR</td><td><code>lr=1e-5</code>, <code>output_adaptor_lr=1e-5</code>.</td><td>AdamW base <code>LR=1e-4</code>, <code>FINETUNE_LR=1e-5</code>, phase2 finetune delay 5k.</td></tr>
        <tr><td>Steps</td><td>100k, checkpoint interval 10k.</td><td>150k in phase2/WTA, checkpoint interval 5k.</td></tr>
        <tr><td>Preload</td><td>Dec 2025 WFM 500k; remove waypoint input weights and layer 10; radar AE 20k.</td><td>Dec 2025 WFM 500k through <code>mcv_new_base.yml</code>; separate SI-baseline variant finetunes from SI 2026.5.11 candidate.</td></tr>
      </table>
      <div class="module-compare">
        <div class="card">
          <p class="mini-title">SI loss aggregation</p>
          <div class="module-flow">
            <div class="module-step green"><b>Single output stream</b><small>Waypoints, indicator, gear direction, waypoint variance, behavior label.</small></div>
            <div class="module-step blue"><b>Fixed weighted losses</b><small>Waypoint, log-likelihood, indicator, behavior-control, gear-direction.</small></div>
            <div class="module-step"><b>Automation mask</b><small>Loss module can mask by automation state.</small></div>
            <div class="module-step rust"><b>Scalar BC loss</b><small>Weighted sum optimized with LR 1e-5.</small></div>
          </div>
        </div>
        <div class="card">
          <p class="mini-title">Zak WTA loss aggregation</p>
          <div class="module-flow">
            <div class="module-step green"><b>All eight heads</b><small>Every example has eight ego/indicator/gear candidate futures.</small></div>
            <div class="module-step blue"><b>Per-head supervised terms</b><small>Ego, cross-track, indicator, gear; optional delta and jerk.</small></div>
            <div class="module-step rust"><b>aWTA routing</b><small>Softmax over negative per-head joint loss with annealed temperature; also exposes hard oracle.</small></div>
            <div class="module-step yellow"><b>Classifier + consistency</b><small>Mode classifier target and cross-present consistency terms.</small></div>
            <div class="module-step"><b>Scalar WTA loss</b><small>Weighted aggregate optimized by AdamW schedule.</small></div>
          </div>
        </div>
      </div>
      <pre><code># Zak AnnealedWTALoss pseudo-code
for each context frame t:
    per_head_ego[k] = loss(all_ego[k], gt_ego)
    per_head_ind[k] = CE(all_indicator[k], gt_indicator)
    per_head_gear[k] = CE(all_gear[k], gt_gear)
    per_head_route[k] = (
        ego_w * per_head_ego[k]
      + indicator_w * per_head_ind[k]
      + gear_w * per_head_gear[k]
      + cross_track_w * per_head_cross_track[k]
    )

temperature = anneal(global_step)
awta_weight = softmax(-stop_grad(per_head_route) / temperature)
oracle = argmin(stop_grad(per_head_route))
loss = weighted_sum(awta_weight, per_head_losses)
loss += classifier_loss(mode_logits, awta_weight or oracle)
loss += cross_present_consistency</code></pre>
      <p class="src">Sources: SI losses ${link(gh.cur, "wayve/ai/si/configs/parking/parking_config.py", 464, "default_losses_parking")}; SI LR/preload ${link(gh.cur, "wayve/ai/si/configs/parking/parking_config.py", 531, "model cfg")} / ${link(gh.cur, "wayve/ai/si/configs/parking/parking_config.py", 582, "BC wrapper")}; Zak WTA wiring ${link(gh.zak, "wayve/ai/experimental/model.py", 747, "model.py#L747")}; WTA internals ${link(gh.zak, "wayve/ai/experimental/losses_metrics/common.py", 1816, "AnnealedWTALoss")}.</p>
    `,
  },
  {
    id: "training",
    title: "BC vs RL",
    html: `
      <div class="grid">
        <div class="card">
          <h3>BC path</h3>
          <p>Both the current SI parking config and the inferred Zak WTA config are behavior-cloning paths. They consume supervised driving targets and optimize supervised prediction losses. SI is conventional single-future BC; Zak WTA is still BC, but the target assignment across heads is learned by WTA routing.</p>
        </div>
        <div class="card">
          <h3>RL path</h3>
          <p>Zak's branch separately includes <code>mcv_new_rl.yml</code>. That config enables offline RL, future image loading, reward checkpoint loading, Bellman TD, CQL, and actor-Q losses. It is not the same as the inferred WTA config.</p>
        </div>
      </div>
      <div class="module-flow">
        <div class="module-step green"><b>Offline RL config gate</b><small>Only active for <code>mcv_new_rl.yml</code>; not active in SI parking config or inferred Zak WTA BC config.</small></div>
        <div class="module-step blue"><b>Encode state <code>s</code></b><small><code>model._encode(batch, extra_context=DT_FRAMES)</code> gives current-state context.</small></div>
        <div class="module-step"><b>Encode shifted state <code>s'</code></b><small>Slice future context and shift scalar batch fields by <code>DT_FRAMES</code>.</small></div>
        <div class="module-step rust"><b>Actor/critic decode</b><small>Current decode gives actor outputs and Q estimates; target decode gives next-state Q targets.</small></div>
        <div class="module-step yellow"><b>Losses</b><small>Bellman TD, optional CQL, actor-Q with warmup/ramp schedule.</small></div>
        <div class="module-step"><b>Target update</b><small>Soft update of twin Q target head.</small></div>
      </div>
      <pre><code># Zak offline RL training-step sketch
if OFFLINE_RL.ENABLED:
    x_all = model._encode(batch, extra_context=DT_FRAMES)
    x_s = x_all[:, :T]
    x_sp = x_all[:, DT_FRAMES:DT_FRAMES + T]

    output_s = model._decode(x_s, batch)
    with no_grad():
        batch_sp = shift_batch_scalars(batch, DT_FRAMES)
        output_sp = model._decode(x_sp, batch_sp, use_target_q=True)

    loss = BellmanTD(output_s, output_sp)
    loss += CQL(output_s)
    loss += ramp(global_step) * ActorQ(output_s)
    twin_q_head.soft_update(target_ema)</code></pre>
      <p class="src">Sources: RL config ${link(gh.zak, "wayve/ai/experimental/configs/mcv_new_rl.yml", 21, "mcv_new_rl.yml#L21")}; RL losses ${link(gh.zak, "wayve/ai/experimental/model.py", 964, "model.py#L964")}; RL training step ${link(gh.zak, "wayve/ai/experimental/model.py", 1409, "model.py#L1409")}.</p>
    `,
  },
  {
    id: "critique",
    title: "Critique",
    html: `
      <div class="callout warn book">
        <p><b>Coverage critique.</b> This is now closer to a technical note than a dashboard: it includes architecture block diagrams, solution-specific latent/multimodal diagrams, pseudo-code, config evidence, code links, and detailed comparison tables. The main residual gap is not presentation, but provenance: I still need Zak's exact launched command or run metadata to prove the WTA config is the current live run rather than the best branch-tip inference.</p>
      </div>
      <table class="compare dense">
        <tr><th>Need</th><th>Included?</th><th>Remaining risk</th></tr>
        <tr><td>Both model architectures</td><td>Yes: SI ST and Zak MCV/WTA diagrams and pseudo-code.</td><td>Not an auto-generated torch module graph from a checkpoint.</td></tr>
        <tr><td>Inputs/adaptors</td><td>Yes: image, route, parking, gear, indicator, speed, speed limit, context tokens.</td><td>Some inherited WFM defaults are summarized rather than fully resolved.</td></tr>
        <tr><td>ST / encoder</td><td>Yes: SI STTransformer and Zak MCVSpaceTimeEncoder.</td><td>Layer-by-layer parameter counts are not included.</td></tr>
        <tr><td>Output adaptor/head</td><td>Yes: SI OutputAdaptor and Zak RegressionDrivingHead/WTA.</td><td>Exact tensor sizes depend on resolved config/runtime shape.</td></tr>
        <tr><td>Latent actions / behavior latent actions</td><td>Yes: now split into three separate selectable diagrams.</td><td>Terminology remains overloaded in code; the tab explicitly disambiguates it.</td></tr>
        <tr><td>Data, augmentations, losses, LR, preloads, BC/RL</td><td>Yes.</td><td>Fully resolved Zak YAML would require running the exp-ai config resolver.</td></tr>
      </table>
    `,
  },
);
