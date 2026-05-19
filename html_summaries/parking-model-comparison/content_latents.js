window.REPORT_SECTIONS = window.REPORT_SECTIONS || [];
window.REPORT_AFTER_RENDER = window.REPORT_AFTER_RENDER || {};

const latentDetails = {
  si_latent: {
    label: "SI latent action path",
    diagram: `
      <div class="flow-title">Current SI latent-action mechanism (enabled by parking losses)</div>
      <div class="diagram"><div class="lane" style="--cols:6">
        <div class="node green"><b>GT policy waypoints</b><small>Training inputs contain future policy waypoints.</small></div>
        <div class="node blue"><b>ActionsDiscretizer</b><small>2.0s target waypoint -> 31x31 radial-exponent action grid.</small></div>
        <div class="node"><b>Latent action class</b><small>Discrete action id and embedding are available.</small></div>
        <div class="node rust"><b>LatentActionModule</b><small>Predicts latent-action logits from a latent query.</small></div>
        <div class="node yellow"><b>Token injection</b><small>Adds the latent-action embedding to context tokens.</small></div>
        <div class="node"><b>Driving heads</b><small>Conditions waypoints/indicator/gear on the latent action.</small></div>
      </div></div>`,
    text: `
      <p><b>Status in current parking config:</b> enabled. <code>default_losses_parking</code> sets <code>w_latent_action=1.0</code>, and <code>ParkingOutputAdaptorCfg</code> derives <code>enable_latent_action=True</code> from that loss weight. This trains latent-action logits and injects a learned latent-action codebook vector before the final output-query decoder.</p>
      <pre><code># Pseudo-code for the active SI latent action path
if enable_latent_action:
    target_xy = policy_waypoints[..., -1, :2]
    if gear_direction_is_reverse:
        target_xy.x = -target_xy.x
    latent_id = ActionsDiscretizer.encode(target_xy)
    latent_logits = LatentActionModule(cross_attend(tokens))
    latent_token = Embedding(latent_id or argmax(latent_logits))
    tokens = tokens + latent_token
    outputs = output_heads(cross_attend(output_queries, tokens))</code></pre>
      <p>The important technical point is that this is still not multimodal in the same sense as Zak's WTA head. SI predicts one latent action class and conditions one final output stream; Zak predicts eight simultaneous output streams plus a classifier over them.</p>`,
  },
  si_behavior: {
    label: "SI behavior-control path",
    diagram: `
      <div class="flow-title">SI behavior-control mechanism (available, disabled in current parking config)</div>
      <div class="diagram"><div class="lane" style="--cols:7">
        <div class="node green"><b>Fused ST + radar tokens</b><small>OutputAdaptor fuses camera/ST and radar tokens first.</small></div>
        <div class="node blue"><b>Behavior-unconditioned branch</b><small>Internal latent-action module samples candidate outputs.</small></div>
        <div class="node"><b>Top-k latent actions</b><small>Top 10 action logits are decoded into candidate waypoint futures.</small></div>
        <div class="node rust"><b>Mean-speed percentile</b><small>Compare top-k candidate speeds to GT policy speed.</small></div>
        <div class="node yellow"><b>Behavior label</b><small>Scalar in [0,1], binned into learned 20-bin codebook.</small></div>
        <div class="node"><b>Token add</b><small>Behavior token is added to all fused tokens.</small></div>
        <div class="node"><b>Final outputs</b><small>Cross-attention output heads predict waypoints/indicator/gear.</small></div>
      </div></div>`,
    text: `
      <p><b>Status in current parking config:</b> disabled. <code>parking_bc_cfg</code> sets <code>enable_behavior_control=False</code>. The behavior-control implementation is still useful to understand because nearby SI configs use it, but this current parking config does not add a behavior token at train or inference time.</p>
      <pre><code># Pseudo-code for enabled SI behavior control
tokens = fuse_radar_tokens(output_tokens, radar_tokens)

if BEHAVIOR_LABEL not in inputs:
    latent_logits = latent_action_module(cross_attend(latent_query, tokens))
    topk_ids = topk(latent_logits, k=10)
    sampled_waypoints = []
    for action_id in topk_ids:
        candidate_token = latent_embedding(action_id)
        sampled_waypoints.append(decode_waypoints(tokens + candidate_token))
    behavior_label = percentile(
        mean_speed(gt_policy_waypoints),
        mean_speed(sampled_waypoints),
        topk_logits,
    )

behavior_token = behavior_codebook(bin20(behavior_label))
tokens = tokens + behavior_token
policy = output_heads(cross_attend(output_queries, tokens))</code></pre>
      <p>This is a controllability feature when enabled: it gives the output adaptor a coarse behavior intensity or assertiveness label. It is not an explicit eight-mode distribution, and it is not active in the current parking config being compared.</p>`,
  },
  zak_wta: {
    label: "Zak MCV/WTA multimodal path",
    diagram: `
      <div class="flow-title">Zak WTA multimodal output mechanism (enabled in inferred config)</div>
      <div class="diagram"><div class="lane" style="--cols:7">
        <div class="node green"><b>MCV tokens</b><small>Encoded image + route + parking + speed/context tokens.</small></div>
        <div class="node blue"><b>Learned output latents</b><small>Waypoint latents plus classifier token.</small></div>
        <div class="node"><b>Cross-attention</b><small>Latents attend to full MCV token context.</small></div>
        <div class="node rust"><b>8 ego heads</b><small>Each head predicts a full waypoint sequence.</small></div>
        <div class="node rust"><b>8 indicator/gear heads</b><small>Each mode has its own discrete future outputs.</small></div>
        <div class="node yellow"><b>Mode classifier</b><small>Predicts logits over the eight heads.</small></div>
        <div class="node"><b>Winner output</b><small>Inference picks argmax/EMA mode; training uses WTA routing.</small></div>
      </div></div>`,
    text: `
      <p><b>Status in inferred Zak config:</b> enabled. <code>mcv_new_phase2x_wta.yml</code> sets <code>EGOPOSITION.WTA.ENABLED=True</code> and <code>NUM_HEADS=8</code>. The head bottleneck is 256 and activation is GELU.</p>
      <pre><code># Pseudo-code for Zak WTA driving head
x = mcv_encoder(image_tokens, conditioning_tokens)
latents = learned_latents.expand(batch)
h = cross_attention(latents, x)
wp_tokens = h[:, :num_waypoints]

all_ego = stack([ego_head[k](wp_tokens) for k in range(8)])
all_ind = stack([indicator_head[k](wp_tokens) for k in range(8)])
all_gear = stack([gear_head[k](wp_tokens) for k in range(8)])
mode_logits = mode_classifier(h[:, classifier_token])

if training:
    loss = AnnealedWTALoss(all_ego, all_ind, all_gear, mode_logits, gt)
else:
    k = argmax(mode_logits)
    output = all_ego[k], all_ind[k], all_gear[k]</code></pre>
      <p>The WTA head is the new multimodal approach Zak added near the output adaptor equivalent. The multimodality lives in the output head: the backbone produces one representation, then the head fans out into eight alternative futures and learns a classifier over them.</p>`,
  },
};

window.REPORT_SECTIONS.push({
  id: "latent",
  title: "Latents & Multimodal",
  html: `
    <div class="callout warn book">
      <p><b>Clarification from the first draft.</b> The diagram on this tab must not be read as applying to both models. There are three different mechanisms and three different diagrams. Use the buttons below to switch between them.</p>
    </div>
    <div class="solution-switch">
      <button class="solution-btn active" data-solution="si_latent">SI latent action</button>
      <button class="solution-btn" data-solution="si_behavior">SI behavior control</button>
      <button class="solution-btn" data-solution="zak_wta">Zak WTA multimodal</button>
    </div>
    <div id="latent-diagram"></div>
    <div id="latent-text" class="card book"></div>
    <table class="compare dense">
      <tr><th>Mechanism</th><th>What it represents</th><th>Training status</th><th>Output impact</th></tr>
      <tr><td>SI latent action</td><td>A discretized target-action token derived from a future waypoint.</td><td>Enabled: <code>enable_latent_action=True</code>, <code>w_latent_action=1</code>.</td><td>Adds a learned latent-action codebook token before final output cross-attention.</td></tr>
      <tr><td>SI behavior control</td><td>A scalar behavior percentile computed from top-k latent-action candidate speeds.</td><td>Disabled in current parking config: <code>enable_behavior_control=False</code>.</td><td>No behavior token is added in this config.</td></tr>
      <tr><td>Zak WTA multimodal</td><td>Eight alternative future modes plus classifier logits.</td><td>Enabled in inferred WTA config: <code>NUM_HEADS=8</code>.</td><td>Final predicted trajectory/indicator/gear comes from selected head; all heads trained with WTA routing.</td></tr>
    </table>
    <p class="src">Sources: SI discretizer ${link(gh.cur, "wayve/ai/si/config.py", 1974, "ActionsDiscretizerCfg")}; SI behavior control ${link(gh.cur, "wayve/ai/zoo/outputs/behavior_control.py", 10, "BehaviorLabelCalculator")}; SI conditioning ${link(gh.cur, "wayve/ai/zoo/outputs/output_adaptor.py", 481, "OutputAdaptor conditioning")}; Zak WTA config ${link(gh.zak, "wayve/ai/experimental/configs/mcv_new_phase2x_wta.yml", 10, "WTA config")}; Zak WTA forward ${link(gh.zak, "wayve/ai/experimental/models/mcv_perceiver.py", 3381, "WTA head")}.</p>
  `,
});

window.REPORT_AFTER_RENDER.latent = () => {
  const diagram = document.getElementById("latent-diagram");
  const text = document.getElementById("latent-text");
  const renderSolution = (id) => {
    const item = latentDetails[id] || latentDetails.si_latent;
    diagram.innerHTML = item.diagram;
    text.innerHTML = `<h3>${item.label}</h3>${item.text}`;
    document.querySelectorAll(".solution-btn").forEach((btn) => btn.classList.toggle("active", btn.dataset.solution === id));
  };
  document.querySelectorAll(".solution-btn").forEach((btn) => {
    btn.addEventListener("click", () => renderSolution(btn.dataset.solution));
  });
  renderSolution("si_latent");
};
