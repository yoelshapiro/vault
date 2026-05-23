const wjEsc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const wjSvgNode = ({ x, y, w, h, title, sub, items, cls = "blue" }) => `
  <g class="wj-node ${cls}" transform="translate(${x},${y})">
    <rect class="wj-outer" width="${w}" height="${h}" rx="7"/>
    <text class="wj-title" x="14" y="24">${wjEsc(title)}</text>
    ${sub ? `<text class="wj-sub" x="14" y="44">${wjEsc(sub)}</text>` : ""}
    ${(items || [])
      .map((item, i) => `<text class="wj-item" x="16" y="${sub ? 70 + i * 19 : 52 + i * 19}">${wjEsc(item)}</text>`)
      .join("")}
  </g>`;
const wjEdge = (x1, y1, x2, y2, cls = "", label = "") => `
  <path class="wj-edge ${cls}" d="M ${x1} ${y1} L ${x2} ${y2}" marker-end="url(#wjArrow)"/>
  ${label ? `<text class="wj-edge-label" x="${(x1 + x2) / 2 - 42}" y="${(y1 + y2) / 2 - 8}">${wjEsc(label)}</text>` : ""}`;
const wjBend = (x1, y1, x2, y2, cls = "", label = "") => {
  const midX = Math.round((x1 + x2) / 2);
  return `
    <path class="wj-edge ${cls}" d="M ${x1} ${y1} H ${midX} V ${y2} H ${x2}" marker-end="url(#wjArrow)"/>
    ${label ? `<text class="wj-edge-label" x="${midX + 8}" y="${(y1 + y2) / 2 - 8}">${wjEsc(label)}</text>` : ""}`;
};

const wonjoonGraph = `
<div class="wide-diagram">
<svg class="full-arch-graph wide wonjoon-arch" viewBox="0 0 2240 1040" role="img" aria-label="Wonjoon full path diffusion architecture with training and inference flows">
  <defs>
    <marker id="wjArrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z"/>
    </marker>
  </defs>
  <style>
    .wonjoon-arch{min-width:1780px;background:#fbf8f1;border:1px solid #d6cab7}
    .wj-lane{fill:rgba(255,253,248,.74);stroke:#cdbf9f;stroke-width:1.5}
    .wj-lane-alt{fill:rgba(238,247,249,.55);stroke:#bdd0d3;stroke-width:1.5}
    .wj-lane-title{font:800 18px "IBM Plex Mono",ui-monospace,monospace;fill:#5d4630;text-transform:uppercase}
    .wj-outer{fill:#fffdf8;stroke:#56665a;stroke-width:2;filter:drop-shadow(0 7px 10px rgba(37,48,41,.12))}
    .wj-node.green .wj-outer{fill:#eef8ee;stroke:#5d9474}
    .wj-node.blue .wj-outer{fill:#eef7f9;stroke:#6f9db2}
    .wj-node.rust .wj-outer{fill:#fbefed;stroke:#b66b64}
    .wj-node.yellow .wj-outer{fill:#faf5df;stroke:#b79a54}
    .wj-node.purple .wj-outer{fill:#f3edf9;stroke:#8b6aa7}
    .wj-node.inactive .wj-outer{fill:#f5f1dc;stroke:#9f9568;stroke-dasharray:8 6;opacity:.82}
    .wj-title{font:850 15px "Space Grotesk","Aptos","Segoe UI",sans-serif;fill:#0b120e}
    .wj-sub{font:750 12px "Space Grotesk","Aptos","Segoe UI",sans-serif;fill:#4e5b52}
    .wj-item{font:720 12px "Space Grotesk","Aptos","Segoe UI",sans-serif;fill:#17251d}
    .wj-edge{fill:none;stroke:#9d625d;stroke-width:3;stroke-linecap:round;stroke-linejoin:round}
    .wj-edge.runtime{stroke:#2f7d72;stroke-width:3.4}
    .wj-edge.train{stroke:#8b6aa7;stroke-dasharray:7 7}
    .wj-edge.aux{stroke:#a98138;stroke-dasharray:9 7}
    .wj-edge.cond{stroke:#4d7891}
    .wj-edge-label{font:800 12px "IBM Plex Mono",ui-monospace,monospace;fill:#39473f}
    .wj-legend{font:800 12px "IBM Plex Mono",ui-monospace,monospace;fill:#4e5b52}
    .wonjoon-arch marker path{fill:#9d625d}
  </style>

  <rect class="wj-lane" x="20" y="34" width="2200" height="190" rx="8"/>
  <rect class="wj-lane-alt" x="20" y="250" width="2200" height="230" rx="8"/>
  <rect class="wj-lane" x="20" y="505" width="2200" height="230" rx="8"/>
  <rect class="wj-lane-alt" x="20" y="760" width="2200" height="245" rx="8"/>
  <text class="wj-lane-title" x="40" y="64">Training labels and target construction</text>
  <text class="wj-lane-title" x="40" y="280">Runtime encoder path</text>
  <text class="wj-lane-title" x="40" y="535">Long-horizon diffusion planner</text>
  <text class="wj-lane-title" x="40" y="790">Path-conditioned ordinary policy</text>

  ${wjSvgNode({
    x: 40,
    y: 92,
    w: 230,
    h: 105,
    title: "Train partitions",
    sub: "ParkingBcDiffusionTrainCfg",
    items: ["driving = 0.5", "parking = 0.5", "GC parking/unparking buckets"],
    cls: "green",
  })}
  ${wjSvgNode({
    x: 310,
    y: 82,
    w: 260,
    h: 125,
    title: "Parking datamodule",
    sub: "ParkingDataConfig",
    items: ["reconstruct gear from speed", "compute PARKING_MODE", "strip leading standstill", "clamp after P/N"],
    cls: "yellow",
  })}
  ${wjSvgNode({
    x: 610,
    y: 76,
    w: 285,
    h: 135,
    title: "Supervised labels",
    sub: "materialized per sample",
    items: ["POLICY_PATH [B,50,7]", "waypoints and time delta", "indicator labels", "gear direction labels"],
    cls: "green",
  })}
  ${wjSvgNode({
    x: 935,
    y: 76,
    w: 300,
    h: 135,
    title: "Target processors",
    sub: "diffusion.py",
    items: ["path: delta + polar + Welford", "chunk 50 points into 10 tokens", "aux absolute-path encoding", "aux 30-frame waypoint encoding"],
    cls: "purple",
  })}
  ${wjSvgNode({
    x: 1780,
    y: 76,
    w: 390,
    h: 135,
    title: "Training losses",
    sub: "BcLossModuleCfg",
    items: ["primary diffusion loss", "two auxiliary diffusion losses", "waypoint + log-likelihood", "indicator + gear direction"],
    cls: "rust",
  })}

  ${wjSvgNode({
    x: 40,
    y: 320,
    w: 230,
    h: 120,
    title: "Runtime inputs",
    sub: "normal SI sensors",
    items: ["6 camera frames", "route + vehicle scalars", "indicator / pose / speed"],
    cls: "green",
  })}
  ${wjSvgNode({
    x: 310,
    y: 305,
    w: 260,
    h: 150,
    title: "Input adaptors",
    sub: "ParkingDiffusionModelCfg",
    items: ["Dec 2025 video path", "route and scalar adaptors", "gear_direction adaptor", "parking_mode adaptor"],
    cls: "blue",
  })}
  ${wjSvgNode({
    x: 610,
    y: 320,
    w: 250,
    h: 120,
    title: "InputAdaptor",
    sub: "SI token merge",
    items: ["concatenate token groups", "add temporal metadata", "emit INPUT_TOKENS"],
    cls: "blue",
  })}
  ${wjSvgNode({
    x: 900,
    y: 300,
    w: 290,
    h: 160,
    title: "STTransformer",
    sub: "WFMStDecember2025Cfg",
    items: ["Dec 2025 WFM backbone", "flash attention v3", "space-time token mixing", "emit OUTPUT_TOKENS"],
    cls: "rust",
  })}
  ${wjSvgNode({
    x: 1230,
    y: 292,
    w: 300,
    h: 175,
    title: "DiffusionOutputAdaptor",
    sub: "learned pool-query cross-attn",
    items: ["flatten OUTPUT_TOKENS", "pool queries + XBlock", "pool_mlp", "split pooled conditions"],
    cls: "blue",
  })}
  ${wjSvgNode({
    x: 1570,
    y: 292,
    w: 300,
    h: 175,
    title: "Condition split",
    sub: "three consumers",
    items: ["diffusion_cond [B,128,D]", "auxiliary_conds x2", "ordinary_cond", "same encoder tokens"],
    cls: "yellow",
  })}
  ${wjSvgNode({
    x: 1910,
    y: 312,
    w: 250,
    h: 130,
    title: "Disabled in config",
    sub: "important boundary",
    items: ["radar input off", "nav instructions off", "behavior control off"],
    cls: "inactive",
  })}

  ${wjSvgNode({
    x: 935,
    y: 560,
    w: 260,
    h: 130,
    title: "Initial noise / x0",
    sub: "train vs inference",
    items: ["train: noisy encoded path", "robot: zero initial noise", "10 DDIM inference steps"],
    cls: "yellow",
  })}
  ${wjSvgNode({
    x: 1230,
    y: 550,
    w: 300,
    h: 150,
    title: "Primary DiffusionHead",
    sub: "path planner",
    items: ["Fourier timestep features", "MMDiTBlock x2", "velocity field prediction", "denoise path tokens"],
    cls: "purple",
  })}
  ${wjSvgNode({
    x: 1570,
    y: 550,
    w: 300,
    h: 150,
    title: "PathPosePrePostProcessor",
    sub: "decode generated path",
    items: ["recover x/y trajectory", "infer yaw from finite diff", "flip yaw for reverse motion", "pure-yaw quaternion"],
    cls: "purple",
  })}
  ${wjSvgNode({
    x: 1910,
    y: 540,
    w: 250,
    h: 170,
    title: "Planner outputs",
    sub: "visible deployment object",
    items: ["POLICY_PATH [B,50,7]", "POLICY_PATH_DISTANCE", "POSITION_FORWARD / LEFT", "final-point PARKING_POSE"],
    cls: "green",
  })}
  ${wjSvgNode({
    x: 610,
    y: 560,
    w: 250,
    h: 130,
    title: "Aux diffusion heads",
    sub: "training only",
    items: ["absolute path head", "30-frame waypoint head", "aux loss weight = 1.0"],
    cls: "purple",
  })}

  ${wjSvgNode({
    x: 935,
    y: 820,
    w: 260,
    h: 135,
    title: "PolicyPathConditioner",
    sub: "path -> policy embedding",
    items: ["delta xy Conv1d stack", "ego-proximity pooling", "dropout p = 0.5 in train"],
    cls: "yellow",
  })}
  ${wjSvgNode({
    x: 1230,
    y: 810,
    w: 300,
    h: 155,
    title: "OrdinaryHead",
    sub: "short-horizon controller",
    items: ["ordinary_cond + path embedding", "future_frames = 11", "waypoint head", "indicator + gear heads"],
    cls: "blue",
  })}
  ${wjSvgNode({
    x: 1570,
    y: 820,
    w: 300,
    h: 135,
    title: "Policy outputs",
    sub: "deployable control signals",
    items: ["POLICY_WAYPOINTS", "INDICATOR_WEIGHTS", "GEAR_WEIGHTS"],
    cls: "green",
  })}
  ${wjSvgNode({
    x: 1910,
    y: 815,
    w: 250,
    h: 145,
    title: "BC loss branch",
    sub: "training only",
    items: ["ordinary labels", "automation lateral mask", "waypoint + indicator + gear"],
    cls: "rust",
  })}

  ${wjEdge(270, 144, 310, 144, "train")}
  ${wjEdge(570, 144, 610, 144, "train")}
  ${wjEdge(895, 144, 935, 144, "train")}
  ${wjBend(1235, 144, 1780, 144, "train", "targets")}
  ${wjBend(760, 211, 760, 560, "train", "aux targets")}
  ${wjBend(760, 211, 1065, 560, "train", "path x0")}

  ${wjEdge(270, 380, 310, 380, "runtime")}
  ${wjEdge(570, 380, 610, 380, "runtime")}
  ${wjEdge(860, 380, 900, 380, "runtime")}
  ${wjEdge(1190, 380, 1230, 380, "runtime")}
  ${wjEdge(1530, 380, 1570, 380, "cond")}
  ${wjEdge(1870, 380, 1910, 380, "aux")}

  ${wjBend(1720, 467, 1380, 550, "cond", "diffusion_cond")}
  ${wjEdge(1195, 625, 1230, 625, "train")}
  ${wjEdge(1530, 625, 1570, 625, "runtime")}
  ${wjEdge(1870, 625, 1910, 625, "runtime")}
  ${wjBend(1720, 467, 735, 560, "aux", "aux_conds")}

  ${wjBend(2035, 710, 1065, 820, "runtime", "generated path")}
  ${wjEdge(1195, 888, 1230, 888, "runtime", "embedding")}
  ${wjBend(1720, 467, 1380, 810, "cond", "ordinary_cond")}
  ${wjEdge(1530, 888, 1570, 888, "runtime")}
  ${wjEdge(1870, 888, 1910, 888, "train")}

  <text class="wj-legend" x="40" y="1022">Legend: green solid = inference/runtime path, blue solid = pooled conditions, purple dashed = supervised training targets/losses, ochre dashed = auxiliary training-only heads.</text>
</svg>
</div>`;

window.REPORT_SECTIONS.push({
  id: "wonjoon",
  title: "Wonjoon Diffusion",
  html: `
    <div class="callout blue book">
      <p><b>Thesis.</b> Wonjoon's solution turns parking from a purely short-horizon waypoint prediction problem into a two-stage planner/controller. The model first predicts an inspectable long-horizon <code>POLICY_PATH</code>; then the ordinary short-horizon policy head predicts waypoints, indicators, and gear while conditioned on that path.</p>
      <p><b>Important boundary.</b> This is still SI/WFM supervised BC. It is not Zak's MCV/WTA stack, and it is not RL. Diffusion is used as the output head for a path target, while the deployable control outputs still come from an ordinary head.</p>
    </div>

    ${wonjoonGraph}

    <h2>How to Read the Solution</h2>
    <div class="module-flow">
      <div class="module-step green"><b>1. Keep the familiar SI encoder</b><small>The train mode uses <code>WFMStDecember2025Cfg</code>. Cameras, route, vehicle scalars, gear direction, and parking mode become tokens through the usual SI adaptor path.</small></div>
      <div class="module-step blue"><b>2. Add a planner inside the output adaptor</b><small><code>DiffusionOutputAdaptor</code> cross-attends over <code>OUTPUT_TOKENS</code> and splits pooled tokens into a primary path-diffusion condition, auxiliary diffusion conditions, and an ordinary-head condition.</small></div>
      <div class="module-step rust"><b>3. Predict a long-horizon path object</b><small>The primary diffusion head predicts <code>POLICY_PATH</code>: 50 poses sampled every 0.5m, so about 24.5m of future path after the current pose.</small></div>
      <div class="module-step yellow"><b>4. Use that path to steer the normal policy</b><small><code>PolicyPathConditioner</code> encodes the path and adds one embedding to all ordinary-head tokens. The ordinary head then predicts the usual short-horizon outputs.</small></div>
    </div>

    <h2>Concrete Config</h2>
    <table class="compare dense aligned">
      <tr><th>Question</th><th>Answer from <code>parking_config.py</code></th><th>Why it matters</th></tr>
      <tr><td>Which mode?</td><td><code>parking_bc_diffusion_train</code> using <code>ParkingBcDiffusionTrainCfg</code>.</td><td>This is the mode that wires the diffusion path output adaptor into SI training.</td></tr>
      <tr><td>Backbone</td><td><code>ParkingDiffusionModelCfg</code> inherits <code>WFMStDecember2025Cfg</code> and uses <code>December2025PreprocessCfg</code>.</td><td>Wonjoon keeps the SI/WFM lineage rather than moving to the experimental MCV codepath.</td></tr>
      <tr><td>Output adaptor</td><td><code>DiffusionPathOutputAdaptorCfg</code> builds <code>DiffusionOutputAdaptor</code> with one primary <code>DiffusionHead</code>, two auxiliary diffusion heads, and an <code>OrdinaryHead</code>.</td><td>The solution is concentrated in the output adaptor, not in a new backbone.</td></tr>
      <tr><td>Path target size</td><td><code>policy_path_num_points=50</code>, <code>policy_path_sample_step_m=0.5</code>.</td><td>The path covers 24.5m after the first point. It is a spatial horizon, not a fixed time horizon.</td></tr>
      <tr><td>Training data mix</td><td>Top-level train partitions are <code>driving=0.5</code> and <code>parking=0.5</code>.</td><td>Half the batches are normal driving to preserve general policy behavior; half are GC parking/unparking windows.</td></tr>
      <tr><td>Short policy horizon</td><td>The ordinary head predicts <code>future_frames=11</code> at <code>future_stride_sec=0.2</code>.</td><td>The controller is still short horizon, but it is guided by a long-horizon path embedding.</td></tr>
      <tr><td>Disabled inputs</td><td><code>enable_radar_input=False</code>, <code>use_indicator_memory=False</code>, <code>enable_behavior_control=False</code>, and nav instruction options are disabled in this config.</td><td>The PR chooses a smaller deployable surface while proving the path-planning idea.</td></tr>
      <tr><td>Optimization</td><td>Main LR <code>1e-5</code>, output adaptor LR <code>1e-4</code>, <code>num_steps=200_000</code>, <code>bf16-mixed</code>.</td><td>The new head learns faster than the reused WFM backbone.</td></tr>
    </table>

    <h2>Data Path and Label Construction</h2>
    <p>The datamodule part matters because diffusion can only learn a useful planner if the target path is clean. Wonjoon's config switches <code>ParkingDataConfig.use_zoo_dataloader=False</code>, which enables the SI-specific parking pipeline instead of the simpler zoo parking insert.</p>
    <table class="compare dense aligned">
      <tr><th>Stage</th><th>Code path</th><th>Behavior</th></tr>
      <tr><td>Gear reconstruction</td><td><code>fill_parking_scratch_table()</code> and <code>_reconstruct_gear_from_speed()</code>.</td><td>Derives D/R from signed speed, preserves validated P/N segments, expands P/N over adjacent stopped periods, and writes vehicle/policy gear labels when indices exist.</td></tr>
      <tr><td>Parking state</td><td><code>add_parking_mode()</code> and <code>_compute_parking_mode()</code>.</td><td>Detects entry parking, parked state, and reverse-out unparking around neutral-gear segments. Config thresholds are 50s and 30m, with 60s lookahead and 20s past.</td></tr>
      <tr><td>Parked augmentation</td><td><code>_augment_parked_mode()</code>.</td><td>If origin is inside a parked segment, it can become either a stay-parked example or an unparking example. Wonjoon's config uses <code>parked_unparking_prob=0.5</code>.</td></tr>
      <tr><td>Path target</td><td><code>compute_policy_path()</code> and <code>_sample_policy_path_from_poses()</code>.</td><td>Samples 50 seven-dimensional poses from additional parking poses, falling back to <code>PATH_POSE</code>. When the parking goal is closer than 24.5m, later path points repeat the goal pose.</td></tr>
      <tr><td>Standstill fix</td><td><code>strip_leading_standstill()</code>.</td><td>If a parking/unparking sample starts with D/R gear but near-zero speed, it shifts the policy speed/pose profile so the model sees movement sooner. This targets delayed acceleration caused by standstill-heavy parking data.</td></tr>
      <tr><td>Final policy cleanup</td><td><code>clamp_policy_at_first_neutral()</code>.</td><td>Once the policy gear becomes P/N, future policy pose, waypoints, curvature, speed, and gear are clamped to a stopped state.</td></tr>
    </table>

    <h2>The Path Diffusion Head</h2>
    <p>The primary diffusion head learns to denoise a compact representation of <code>POLICY_PATH</code>. The processor does not diffuse full 7D poses directly. It extracts x/y, transforms them, and reconstructs pose orientation later.</p>
    <table class="compare dense aligned">
      <tr><th>Piece</th><th>What the code does</th><th>Practical interpretation</th></tr>
      <tr><td><code>PathPosePrePostProcessor.encode()</code></td><td>Reads <code>POLICY_PATH [B,50,7]</code>, keeps x/y only, applies delta position, converts to polar, Welford-normalizes radius, clips, then chunks every 5 points.</td><td>The denoiser sees <code>[B,10,10]</code>: 10 spatial tokens, each holding 5 path segments worth of x/y representation.</td></tr>
      <tr><td><code>DiffusionHead</code></td><td>Projects condition tokens, Fourier-encodes timestep and noisy <code>x_t</code>, runs two <code>MMDiTBlock</code>s, and predicts a velocity field for DDIM.</td><td>This is a small conditional denoiser over path tokens.</td></tr>
      <tr><td>Training noise</td><td>Repeats each target <code>num_samples_during_training=50</code> times, samples Gaussian endpoint noise, samples a random train timestep, and minimizes velocity MSE.</td><td>The path distribution is learned through supervised denoising, not through a discrete head bank.</td></tr>
      <tr><td>Inference</td><td>Runs DDIM for <code>num_inference_steps=10</code>.</td><td>Inference cost is higher than a direct regression head, but bounded by a small denoising count.</td></tr>
      <tr><td><code>decode()</code></td><td>Decodes x/y, sets z to zero, infers yaw from finite differences, flips yaw for reverse longitudinal motion, and writes a pure-yaw quaternion.</td><td>The generated path is an inspectable path pose object, but roll/pitch/z are synthetic.</td></tr>
      <tr><td>Path outputs</td><td>Writes <code>POLICY_PATH</code>, <code>POLICY_PATH_DISTANCE</code>, <code>POLICY_PATH_POSITION_FORWARD</code>, <code>POLICY_PATH_POSITION_LEFT</code>, and a parking pose from the last point with confidence 1.</td><td>The planner is visible in deployment outputs rather than hidden as a latent.</td></tr>
    </table>

    <h2>Why There Are Auxiliary Diffusion Heads</h2>
    <p>The config adds two auxiliary heads with <code>auxiliary_diffusion_loss_weight=1.0</code>. They share the same encoder tokens but have separate pooled condition blocks and separate diffusion losses.</p>
    <table class="compare dense aligned">
      <tr><th>Head</th><th>Target / encoding</th><th>Role</th></tr>
      <tr><td>Primary</td><td><code>PathPosePrePostProcessor</code>, delta x/y, polar coordinates, chunk size 5.</td><td>The deployed long-horizon path generator.</td></tr>
      <tr><td>Aux A</td><td><code>PathPosePrePostProcessor</code>, absolute x/y, no polar, chunk size 5.</td><td>Regularizes path learning with a second representation.</td></tr>
      <tr><td>Aux B</td><td><code>DiffusionPrePostProcessor</code> over waypoints and indicators, <code>future_frames=30</code>, delta/polar/chunked.</td><td>Regularizes the representation against medium-horizon policy behavior, but is not the ordinary deployed policy head.</td></tr>
    </table>

    <h2>Path-Conditioned Ordinary Policy</h2>
    <p>The ordinary head is where the generated plan becomes deployable driving outputs. In the config, <code>OrdinaryHeadCfg</code> sets <code>policy_path_conditioning_enabled=True</code>, <code>enable_gear_direction=True</code>, <code>behavior_control_enabled=False</code>, and <code>policy_path_conditioning_dropout=0.5</code>.</p>
    <table class="compare dense aligned">
      <tr><th>Component</th><th>Mechanics</th><th>Why it matters</th></tr>
      <tr><td><code>PolicyPathConditioner</code></td><td>Computes consecutive x/y displacements, passes them through two Conv1d layers with GELU, weights segments by proximity to ego, then projects to the model token dimension.</td><td>The ordinary head is biased toward the nearby portion of the plan, which is the part most relevant for immediate control.</td></tr>
      <tr><td>Training source</td><td>During training, <code>OrdinaryHead.forward()</code> reads <code>inputs[POLICY_PATH]</code>.</td><td>The ordinary policy is trained with the ground-truth path label, not the imperfect generated path.</td></tr>
      <tr><td>Inference source</td><td>During inference, it reads <code>outputs[POLICY_PATH]</code>, produced by diffusion just before ordinary inference.</td><td>This creates a train/inference gap: policy quality depends on generated path quality at runtime.</td></tr>
      <tr><td>Dropout</td><td>Training randomly drops the path embedding with probability 0.5.</td><td>This prevents total dependence on the path label and gives some robustness when generated paths are noisy.</td></tr>
      <tr><td>Outputs</td><td>Indicator, waypoint, gear direction, time delta, and full-brake default.</td><td>Deployment still consumes familiar policy outputs, plus new path observability outputs.</td></tr>
    </table>

    <h2>Training Forward Pass</h2>
    <div class="codegrid">
      <pre><code># Conceptual flow from DiffusionOutputAdaptor._train
tokens = outputs[OUTPUT_TOKENS]
diff_cond, aux_conds, ordinary_cond = adaptor._pool_all(outputs)

# Primary long-horizon planner loss.
path_x0 = PathPosePrePostProcessor.encode(inputs)
diff_loss = primary_diffusion_head(diff_cond, inputs, outputs)

# Auxiliary losses: absolute path and 30-frame waypoint diffusion.
for aux_head, aux_cond in zip(auxiliary_heads, aux_conds):
    diff_loss += auxiliary_weight * aux_head(aux_cond, inputs, {})
outputs["_diffusion_loss"] = diff_loss

# Training also samples paths under no_grad for diagnostics / compatibility.
inputs["initial_noise"] = randn([B, num_samples, K, output_dim])
primary_diffusion_head.inference(diff_cond, inputs, outputs)

# Ordinary head uses the ground-truth path while training.
path_embedding = PolicyPathConditioner(inputs[POLICY_PATH])
path_embedding *= bernoulli_keep(p=0.5)
ordinary_cond = ordinary_cond + path_embedding[:, None, :]
outputs.update(ordinary_heads(ordinary_cond))</code></pre>
      <pre><code># Losses from parking_bc_diffusion_cfg
bc_losses = BcLossModuleCfg(
    w_diffusion=1.0,
    w_indicator=1.0,
    w_waypoints=1.0,
    w_waypoints_log_likelihood=1.0,
    w_gear_direction=1.0,
    enable_automation_state_mask=False,
    enable_automation_state_mask_lateral=True,
)

# Config-level training parameters
lr = 1e-5
output_adaptor_lr = 1e-4
num_steps = 200_000
precision = "bf16-mixed"</code></pre>
    </div>

    <h2>Robot Inference Pass</h2>
    <p>The on-car inference path is intentionally deterministic in this PR. <code>robot_inference()</code> uses zero initial noise with one sample. This means the current deployed-style behavior is "generate one canonical path, then condition ordinary policy on it", not "sample many candidates and rank them".</p>
    <pre><code># Conceptual flow from DiffusionOutputAdaptor.robot_inference
B = outputs[OUTPUT_TOKENS].shape[0]
inputs["initial_noise"] = zeros([B, 1, diffusion_head.K, output_dim])

sampled = adaptor.diffusion_inference(inputs, outputs)
for key, value in sampled.items():
    clean_key = strip_top_k_prefix(key)
    if clean_key == POLICY_PARKING_POSE:
        outputs[clean_key] = value       # keep sample axis [B,1,8]
    else:
        outputs[clean_key] = value[:, 0] # first and only sample

# OrdinaryHead.require_diffusion_inference is true, so this happens after path generation.
ordinary_cond = adaptor._pool_for_ordinary_head(outputs)
path_embedding = PolicyPathConditioner(outputs[POLICY_PATH])
ordinary_cond = ordinary_cond + path_embedding[:, None, :]
outputs.update(ordinary_heads(ordinary_cond))</code></pre>

    <h2>What This Buys You</h2>
    <table class="compare dense aligned">
      <tr><th>Benefit</th><th>Mechanism</th><th>Interpretation</th></tr>
      <tr><td>Longer parking intent horizon</td><td><code>POLICY_PATH</code> is spatially long, around 24.5m, while ordinary waypoints remain short horizon.</td><td>The model has an intermediate plan that can remain stable even when immediate waypoint predictions are reactive.</td></tr>
      <tr><td>Inspectability</td><td>Path tensors and parking pose proposal are exposed in outputs.</td><td>You can inspect the planned path directly rather than inferring intent from waypoints or latent actions.</td></tr>
      <tr><td>Planning/action alignment</td><td>The ordinary head consumes a path embedding.</td><td>Short-horizon actions should be easier to align with a committed parking path.</td></tr>
      <tr><td>Future multi-sample potential</td><td><code>DiffusionHead.inference()</code> already supports multiple <code>initial_noise</code> samples.</td><td>The architecture can support sampling and ranking several path proposals, though current robot inference uses one deterministic zero-noise proposal.</td></tr>
      <tr><td>Cleaner offline evaluation target</td><td>The path is a structured object with distances and forward/left coordinates.</td><td>Evaluation can compare long-horizon path adherence, not just short-horizon waypoint error.</td></tr>
    </table>

    <h2>Limitations and Code-Level Caveats</h2>
    <table class="compare dense aligned">
      <tr><th>Risk</th><th>Evidence in code</th><th>Consequence</th></tr>
      <tr><td>Train/inference gap for path conditioning</td><td>Training ordinary head uses ground-truth <code>inputs[POLICY_PATH]</code>; inference uses generated <code>outputs[POLICY_PATH]</code>.</td><td>If path diffusion is wrong, the ordinary head receives an out-of-distribution conditioning signal. The 0.5 path dropout helps but does not remove the gap.</td></tr>
      <tr><td>Single deterministic path at robot inference</td><td><code>robot_inference()</code> sets <code>initial_noise</code> to zeros with sample count 1.</td><td>Despite being a diffusion model, the current runtime path is not exploiting multimodal sampling/ranking.</td></tr>
      <tr><td>No separate goal-pose input adaptor in this config</td><td>The config enables parking mode and gear direction adaptors but does not wire an explicit goal-pose adaptor.</td><td>The generated path must infer parking intent from context, parking mode, route, and learned data priors rather than an explicit goal token.</td></tr>
      <tr><td>Path pose orientation is reconstructed</td><td><code>decode()</code> uses x/y finite differences, sets z to zero, and constructs a pure-yaw quaternion.</td><td>The generated path is best understood as an x/y trajectory with derived yaw, not a fully learned SE(3) pose sequence.</td></tr>
      <tr><td>Forward unparking detection gap</td><td><code>_compute_parking_mode()</code> notes that it currently detects reverse-out unparking and misses forward-unparking.</td><td>Some unparking cases may be absent or mislabeled until the data logic is extended.</td></tr>
      <tr><td>Latency-sensitive features disabled</td><td>Radar, nav options, behavior control, and indicator memory are disabled in <code>parking_bc_diffusion_cfg</code>.</td><td>This PR isolates the path planner idea, but it may not include all signals used by Boris' current parking config.</td></tr>
    </table>

    <h2>Compared to Boris and Zak</h2>
    <table class="compare dense aligned">
      <tr><th>Axis</th><th>Boris SI parking</th><th>Zak MCV/WTA</th><th>Wonjoon long-horizon diffusion</th></tr>
      <tr><td>Main abstraction</td><td>Rebalanced SI parking/PUDO curriculum plus ordinary BC heads and deployment wrapper logic.</td><td>Experimental MCV/Perceiver stack with WTA candidate heads and explicit mode routing.</td><td>Intermediate path plan generated by diffusion, then ordinary SI policy conditioned on that plan.</td></tr>
      <tr><td>Where complexity lives</td><td>Data mixture, parking mode/gear/stopping augmentations, radar/behavior-control config.</td><td>Architecture and output head: multi-head WTA, mode selection, MCV tokenization.</td><td>Output adaptor: path diffusion, path processor, auxiliary diffusion losses, path-conditioned ordinary head.</td></tr>
      <tr><td>Multimodality</td><td>Mostly implicit, via conditioning and behavior-control machinery.</td><td>Explicit deterministic head bank.</td><td>Implicit distribution over paths, although current robot inference collapses to one zero-noise sample.</td></tr>
      <tr><td>Best debugging object</td><td>Bucket-level behavior, gear/stopping/parking-mode outputs, wrapper interleave behavior.</td><td>Selected WTA head, head logits, per-head trajectories.</td><td><code>POLICY_PATH</code>, path distance, final pose proposal, and whether ordinary outputs follow the generated path.</td></tr>
    </table>

    <h2>Reading Map</h2>
    <table class="compare dense">
      <tr><th>To understand...</th><th>Read...</th></tr>
      <tr><td>Mode, data mix, and hyperparameters</td><td>${link(gh.wonjoon, "wayve/ai/si/configs/parking/parking_config.py", 691, "parking_diffusion_datamodule_cfg and ParkingBcDiffusionTrainCfg")}</td></tr>
      <tr><td>How <code>POLICY_PATH</code> labels are built</td><td>${link(gh.wonjoon, "wayve/ai/si/datamodules/parking.py", 1, "SI parking datamodule")}</td></tr>
      <tr><td>Path encoding and decoding</td><td>${link(gh.wonjoon, "wayve/ai/zoo/outputs/diffusion.py", 95, "PathPosePrePostProcessor")}</td></tr>
      <tr><td>The denoiser itself</td><td>${link(gh.wonjoon, "wayve/ai/zoo/outputs/diffusion.py", 214, "DiffusionHead")}</td></tr>
      <tr><td>Path conditioning into ordinary outputs</td><td>${link(gh.wonjoon, "wayve/ai/zoo/outputs/diffusion.py", 309, "PolicyPathConditioner and OrdinaryHead")}</td></tr>
      <tr><td>Training and robot inference flow</td><td>${link(gh.wonjoon, "wayve/ai/zoo/outputs/diffusion.py", 415, "DiffusionOutputAdaptor")}</td></tr>
    </table>

    <p class="src">Sources: Wonjoon branch code in PR 106346; Notion pages <a href="https://www.notion.so/wayve/Long-Horizon-Parking-Planning-2f103da5d69a80b8b5b8f2b292332cd6?source=copy_link">Long-Horizon Parking Planning</a> and Model Architecture. Re-read locally/through GitHub before this rewrite.</p>
  `,
});
