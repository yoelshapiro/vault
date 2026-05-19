const wjColors = {
  input: "#f7efe5",
  adapter: "#dff3ee",
  encoder: "#d8e6fb",
  output: "#fbe5c6",
  train: "#eadff5",
  deploy: "#e8efdc",
  stroke: "#3e4a46",
};

const wjEsc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const wjLines = (lines) =>
  lines
    .map((line, i) => `<tspan x="18" dy="${i === 0 ? 0 : 19}">${wjEsc(line)}</tspan>`)
    .join("");
const wjBox = (x, y, w, h, title, lines, kind = "adapter") => `
  <g transform="translate(${x},${y})">
    <rect width="${w}" height="${h}" rx="12" fill="${wjColors[kind]}" stroke="${wjColors.stroke}" stroke-width="2"/>
    <text x="18" y="28" class="node-title">${wjEsc(title)}</text>
    <text x="18" y="56" class="node-copy">${wjLines(lines)}</text>
  </g>`;
const wjArrow = (x1, y1, x2, y2, label = "") => `
  <path d="M ${x1} ${y1} C ${(x1 + x2) / 2} ${y1}, ${(x1 + x2) / 2} ${y2}, ${x2} ${y2}"
        fill="none" stroke="#51625d" stroke-width="2.4" marker-end="url(#wjArrow)"/>
  ${label ? `<text x="${(x1 + x2) / 2 - 60}" y="${(y1 + y2) / 2 - 8}" class="edge-label">${wjEsc(label)}</text>` : ""}`;

const wonjoonGraph = `
<div class="wide-diagram">
<svg class="full-arch-graph wonjoon-graph" viewBox="0 0 2360 1320" role="img" aria-label="Wonjoon PR 106346 long horizon parking diffusion model graph">
  <defs>
    <marker id="wjArrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#51625d"/>
    </marker>
  </defs>
  <style>
    .wonjoon-graph{min-width:1500px;background:#fbf8f1;border:1px solid #d6cab7;border-radius:16px}
    .node-title{font:700 22px Fraunces, Georgia, serif;fill:#1d2a27}
    .node-copy{font:500 15px Atkinson Hyperlegible, Verdana, sans-serif;fill:#243531}
    .edge-label{font:700 14px Atkinson Hyperlegible, Verdana, sans-serif;fill:#34423e}
    .lane-label{font:800 26px Fraunces, Georgia, serif;fill:#4f3d29}
  </style>
  <text x="42" y="54" class="lane-label">Inputs and targets</text>
  ${wjBox(40, 90, 285, 142, "Camera frames", ["6 camera frames", "Dec 2025 WFM preprocess", "image tokens"], "input")}
  ${wjBox(40, 255, 285, 142, "Driving context", ["route map", "speed / curvature / pose", "indicator history"], "input")}
  ${wjBox(40, 420, 285, 142, "Parking context", ["gear_direction token", "parking_mode token", "optional goal pose"], "input")}
  ${wjBox(40, 585, 285, 168, "Training labels", ["POLICY_PATH [B,50,7]", "11-frame ordinary policy", "30-frame aux diffusion", "absolute path aux target"], "train")}

  <text x="392" y="54" class="lane-label">ST encoder</text>
  ${wjBox(385, 92, 305, 156, "VideoSTAdaptor", ["WFM/Dec 2025 video stack", "camera patches -> token stream", "image-only adapter"], "adapter")}
  ${wjBox(385, 280, 305, 176, "Scalar/map ST adaptors", ["RouteSTAdaptor", "Speed / indicator adaptors", "GearDirectionSTAdaptor", "ParkingModeSTAdaptor"], "adapter")}
  ${wjBox(760, 185, 345, 182, "InputAdaptor", ["concatenate named token groups", "add temporal / position metadata", "produce INPUT_TOKENS"], "adapter")}
  ${wjBox(1175, 185, 365, 182, "WFMStDecember2025Cfg", ["STTransformer backbone", "flash attention v3", "optional radar path disabled", "outputs OUTPUT_TOKENS"], "encoder")}

  <text x="1620" y="54" class="lane-label">Diffusion output adaptor</text>
  ${wjBox(1600, 112, 330, 174, "Cross-attn pool", ["learned pool queries", "attend over OUTPUT_TOKENS", "split pooled sequence"], "output")}
  ${wjBox(1995, 70, 315, 130, "diffusion_cond", ["[B,128,D]", "primary path planner condition"], "output")}
  ${wjBox(1995, 230, 315, 130, "auxiliary_conds x2", ["two [B,128,D] blocks", "training regularizers"], "train")}
  ${wjBox(1995, 390, 315, 130, "ordinary_cond", ["policy token queries", "ordinary head condition"], "output")}

  <text x="392" y="830" class="lane-label">Diffusion heads and ordinary policy</text>
  ${wjBox(385, 875, 385, 198, "Primary DiffusionHead", ["MMDiT-style denoiser", "embed_size=768, heads=8", "DiT blocks=2", "50 train samples / 10 inference steps"], "output")}
  ${wjBox(825, 875, 360, 198, "PathPosePrePostProcessor", ["target: POLICY_PATH", "50 poses -> x,y deltas", "polar + Welford norm", "chunk 5 => 10 tokens x 10 dims"], "output")}
  ${wjBox(1235, 850, 330, 248, "Generated path outputs", ["POLICY_PATH [B,50,7]", "POLICY_PATH_DISTANCE", "POSITION_FORWARD / LEFT", "parking goal pose proposals"], "deploy")}
  ${wjBox(1620, 730, 320, 168, "Aux head A", ["absolute path encoding", "delta_pos=false", "polar=false", "aux diffusion loss"], "train")}
  ${wjBox(1620, 925, 320, 168, "Aux head B", ["waypoint diffusion", "future_frames=30", "delta + polar + chunk 5", "aux diffusion loss"], "train")}
  ${wjBox(1620, 1135, 320, 142, "PolicyPathConditioner", ["input: true path at train", "input: generated path at inference", "delta xy Conv1d + ego-weighted pool"], "output")}
  ${wjBox(1995, 1060, 315, 188, "OrdinaryHead", ["ordinary_cond + path embedding", "predict 11 future frames", "waypoints + indicator + gear", "drop path embedding p=0.5"], "output")}

  ${wjArrow(325, 160, 385, 160, "")}
  ${wjArrow(325, 326, 385, 368, "")}
  ${wjArrow(325, 491, 385, 368, "")}
  ${wjArrow(690, 170, 760, 250, "")}
  ${wjArrow(690, 368, 760, 278, "")}
  ${wjArrow(1105, 276, 1175, 276, "INPUT_TOKENS")}
  ${wjArrow(1540, 276, 1600, 199, "OUTPUT_TOKENS")}
  ${wjArrow(1930, 188, 1995, 136, "split")}
  ${wjArrow(1930, 208, 1995, 292, "split")}
  ${wjArrow(1930, 226, 1995, 452, "split")}
  ${wjArrow(2152, 200, 580, 875, "primary cond")}
  ${wjArrow(770, 974, 825, 974, "x_t")}
  ${wjArrow(1185, 974, 1235, 974, "decode")}
  ${wjArrow(2152, 360, 1620, 805, "aux conds")}
  ${wjArrow(2152, 360, 1620, 1002, "aux conds")}
  ${wjArrow(1565, 1035, 1620, 1205, "path")}
  ${wjArrow(2152, 520, 1995, 1118, "ordinary cond")}
  ${wjArrow(1940, 1206, 1995, 1160, "path embedding")}
  ${wjArrow(325, 669, 825, 1044, "train targets")}
</svg>
</div>`;

window.REPORT_SECTIONS.push({
  id: "wonjoon",
  title: "Wonjoon Diffusion",
  html: `
    <div class="callout blue book">
      <p><b>What PR 106346 adds.</b> It turns parking into a two-stage long-horizon planner: first generate a structured <code>POLICY_PATH</code>, then condition the usual waypoint/indicator/gear policy head on that path. This is different from Zak's WTA head bank: Wonjoon's multimodality comes from diffusion sampling, not from eight explicit deterministic heads.</p>
      <p><b>Notion intent.</b> The linked Long-Horizon Parking Planning page frames this as a way to stabilize parking intent beyond the current short waypoint horizon, reduce plan switching, and create a path-level offline evaluation target.</p>
    </div>
    ${wonjoonGraph}
    <h2>Code-Backed Architecture</h2>
    <table class="compare dense aligned">
      <tr><th>Block</th><th>Implementation</th><th>Inputs</th><th>Outputs / role</th></tr>
      <tr><td>Backbone model</td><td><code>ParkingDiffusionModelCfg</code> inherits <code>WFMStDecember2025Cfg</code>.</td><td>Video, route, speed, indicator, gear direction, parking mode. Radar config exists but this train config sets <code>enable_radar_input=False</code>.</td><td><code>OUTPUT_TOKENS</code> consumed by the diffusion output adaptor.</td></tr>
      <tr><td>Output adaptor</td><td><code>DiffusionOutputAdaptor</code> with <code>pool_token_length=128</code>.</td><td><code>OUTPUT_TOKENS</code>.</td><td>Cross-attention pooled conditions split into primary diffusion, two auxiliary diffusion blocks, and ordinary policy condition.</td></tr>
      <tr><td>Primary path head</td><td><code>DiffusionHead</code> + <code>PathPosePrePostProcessor</code>.</td><td><code>diffusion_cond [B,128,D]</code> and path labels at train time.</td><td><code>POLICY_PATH [B,50,7]</code>, path distance, forward/left positions, parking-goal pose proposals.</td></tr>
      <tr><td>Auxiliary diffusion heads</td><td>Two extra <code>DiffusionHead</code> instances.</td><td>Aux cond blocks and labels.</td><td>Absolute path aux loss and waypoint diffusion aux loss. They regularize training; they are not the main deployed policy output path.</td></tr>
      <tr><td>PolicyPathConditioner</td><td>Delta-xy Conv1d stack + ego-proximity weighted pooling + projection + LayerNorm.</td><td>Training uses ground-truth <code>POLICY_PATH</code>; inference uses generated <code>POLICY_PATH</code>.</td><td>One path embedding added into <code>ordinary_cond</code>.</td></tr>
      <tr><td>OrdinaryHead</td><td>Ordinary waypoint/indicator/gear head with <code>policy_path_conditioning_enabled=True</code>.</td><td><code>ordinary_cond + path_embedding</code>.</td><td>11-frame waypoints, indicator weights, gear-direction weights.</td></tr>
    </table>
    <h2>Data Recipe and Labels</h2>
    <div class="module-flow">
      <div class="module-step green"><b>Raw parking windows</b><small>Uses gear direction and speed to identify neutral/parking windows: min duration 2s, 30s / 30m thresholds, 20s past and 60s lookahead.</small></div>
      <div class="module-step"><b>Parking mode and goal pose</b><small>Builds <code>PARKING_MODE</code>, goal distance, start/end deltas, and <code>PARKING_POSE</code> from additional parking pose or path pose fallback.</small></div>
      <div class="module-step blue"><b>Policy path sampling</b><small>Samples 50 poses every 0.5m along arc length, clamps by repeating the final goal pose when the goal is reached.</small></div>
      <div class="module-step rust"><b>Diffusion target encoding</b><small>Uses x,y only; delta position, polar transform, Welford normalization, chunk size 5.</small></div>
      <div class="module-step yellow"><b>Mixture</b><small>Training partitions split 0.5 driving and 0.5 parking/unparking buckets.</small></div>
    </div>
    <table class="compare dense">
      <tr><th>Setting</th><th>Value in PR 106346</th></tr>
      <tr><td>Materialization / binaries</td><td><code>bc/split_alpha2_alpha3/release/0.0.17</code>, binary <code>3.0.23</code>, Flyte binaries enabled.</td></tr>
      <tr><td>Train/val context</td><td>6 camera frames at 0.20s stride; future policy horizon 30 frames at 0.2s for diffusion auxiliary; ordinary head predicts 11 future frames.</td></tr>
      <tr><td>Parking labels</td><td><code>policy_path_num_points=50</code>, <code>policy_path_sample_step_m=0.5</code>, giving a 24.5m future path excluding the current point.</td></tr>
      <tr><td>Augmentations</td><td>Parking-data logic includes parking/unparking gear augmentation fields and standstill handling. In the shown train config, route dropout and indicator dropout are 0.0, parking goal dropout is 0.0, and radar is disabled for latency.</td></tr>
      <tr><td>Mixture weights</td><td>Top-level nested partition weights are 0.5 driving and 0.5 parking buckets.</td></tr>
    </table>
    <h2>Losses, LR, Preload, Training Mode</h2>
    <table class="compare dense aligned">
      <tr><th>Question</th><th>Wonjoon PR 106346</th><th>Contrast to SI / Zak</th></tr>
      <tr><td>Losses</td><td><code>w_diffusion=1.0</code>, <code>w_indicator=1.0</code>, <code>w_waypoints=1.0</code>, <code>w_waypoints_log_likelihood=1.0</code>, <code>w_gear_direction=1.0</code>. Auxiliary diffusion loss weight is 1.0.</td><td>SI uses ordinary BC output losses plus its behavior/latent machinery. Zak adds WTA winner routing and consistency losses for head identity stability.</td></tr>
      <tr><td>Learning rate</td><td>Main LR <code>1e-5</code>; output adaptor LR <code>1e-4</code>; 200k steps; bf16 mixed precision.</td><td>The output adaptor is intentionally trained faster than the inherited ST backbone.</td></tr>
      <tr><td>Preload</td><td>The model base is <code>WFMStDecember2025Cfg</code>; PR also adds checkpoint aliases including Dec 2025 pretraining entries. The config is a finetune-style BC config, not a from-scratch architecture.</td><td>Same family as SI more than Zak: it stays in the WFM/ST lineage rather than moving to <code>MCVSpaceTimeEncoder</code>.</td></tr>
      <tr><td>BC or RL?</td><td>BC only in this PR: <code>ParkingBcDiffusionTrainCfg</code> wraps <code>StBcCfg</code>. Diffusion is a generative supervised head, not reinforcement learning.</td><td>Zak WTA path is also supervised BC in the compared config; RL is a separate experimental config.</td></tr>
      <tr><td>Deployment outputs</td><td>Parking wrapper exposes <code>policy_parking_pose</code>, <code>policy_path_distance</code>, <code>policy_path_position_forward</code>, and <code>policy_path_position_left</code> in addition to regular policy outputs.</td><td>This makes the path planner observable on-car, unlike SI's latent behavior branch which is not a directly inspectable path object.</td></tr>
    </table>
    <h2>Pseudo-code</h2>
    <div class="codegrid">
      <pre><code># Training forward
tokens = st_backbone(input_adaptors(batch))
diff_cond, aux_conds, ordinary_cond = pool_all(tokens)

loss = primary_path_diffusion(
    diff_cond,
    target=batch["POLICY_PATH"],
)
loss += aux_weight * absolute_path_diffusion(aux_conds[0], batch["POLICY_PATH"])
loss += aux_weight * waypoint_diffusion(aux_conds[1], batch["WAYPOINTS_AND_INDICATOR"])

path_for_policy = batch["POLICY_PATH"]
path_embedding = PolicyPathConditioner(path_for_policy)
if random() < 0.5:
    path_embedding = 0
ordinary_outputs = OrdinaryHead(ordinary_cond + path_embedding)
loss += waypoint_loss + indicator_loss + gear_direction_loss</code></pre>
      <pre><code># Robot inference
tokens = st_backbone(input_adaptors(robot_inputs))
diff_cond, aux_conds, ordinary_cond = pool_all(tokens)

sampled_path = primary_path_diffusion.sample(
    diff_cond,
    steps=10,
)
outputs["POLICY_PATH"] = decode_path(sampled_path)
outputs["POLICY_PATH_DISTANCE"] = arc_length(outputs["POLICY_PATH"])
outputs["POLICY_PARKING_GOAL_POSE_PROPOSALS"] = final_pose(outputs["POLICY_PATH"])

path_embedding = PolicyPathConditioner(outputs["POLICY_PATH"])
outputs.update(OrdinaryHead(ordinary_cond + path_embedding))</code></pre>
    </div>
    <h2>Three-Way Comparison</h2>
    <table class="compare dense aligned">
      <tr><th>Axis</th><th>SI parking</th><th>Zak MCV/WTA</th><th>Wonjoon long-horizon diffusion</th></tr>
      <tr><td>Primary abstraction</td><td>Short-horizon policy with behavior-control conditioning.</td><td>Set of eight candidate short-horizon policies with winner-take-all routing.</td><td>Long-horizon path object used as an intermediate plan.</td></tr>
      <tr><td>Multimodality</td><td>Implicit through stochasticity/conditioning; no explicit mode bank.</td><td>Explicit 8-head bank plus mode classifier.</td><td>Implicit diffusion distribution over paths; ordinary policy follows the sampled/generated path.</td></tr>
      <tr><td>Inspectability</td><td>Inspect ordinary outputs and behavior inputs; latent actions are harder to read.</td><td>Inspect head identity, mode logits, per-head trajectories.</td><td>Inspect generated path, path distance, path-position tensors, and final parking-goal proposal.</td></tr>
      <tr><td>Main risk</td><td>Intent horizon remains short and behavior-control branch can be config-gated.</td><td>Mode/head identity must stay stable and trained enough for inference selection.</td><td>Ordinary policy quality depends on generated path quality; training uses ground-truth path conditioning while inference uses sampled path.</td></tr>
    </table>
    <p class="src">Sources: PR 106346 code ${link(gh.wonjoon, "wayve/ai/si/configs/parking/parking_config.py", 691, "parking diffusion config")}, ${link(gh.wonjoon, "wayve/ai/zoo/outputs/diffusion.py", 95, "PathPosePrePostProcessor")}, ${link(gh.wonjoon, "wayve/ai/zoo/outputs/diffusion.py", 309, "PolicyPathConditioner")}, ${link(gh.wonjoon, "wayve/ai/zoo/outputs/diffusion.py", 415, "DiffusionOutputAdaptor")}, ${link(gh.wonjoon, "wayve/ai/zoo/deployment/deployment_wrapper.py", 2767, "parking wrapper path outputs")}; Notion: <a href="https://www.notion.so/wayve/Long-Horizon-Parking-Planning-2f103da5d69a80b8b5b8f2b292332cd6?source=copy_link">Long-Horizon Parking Planning</a>.</p>
  `,
});
