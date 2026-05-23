const wjColors = {
  input: "#f7efe5",
  adapter: "#dff3ee",
  encoder: "#d8e6fb",
  output: "#fbe5c6",
  train: "#eadff5",
  deploy: "#e8efdc",
  risk: "#f6d6d6",
  stroke: "#3e4a46",
};

const wjEsc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const wjLines = (lines) =>
  lines.map((line, i) => `<tspan x="18" dy="${i === 0 ? 0 : 19}">${wjEsc(line)}</tspan>`).join("");
const wjBox = (x, y, w, h, title, lines, kind = "adapter") => `
  <g transform="translate(${x},${y})">
    <rect width="${w}" height="${h}" rx="12" fill="${wjColors[kind]}" stroke="${wjColors.stroke}" stroke-width="2"/>
    <text x="18" y="28" class="node-title">${wjEsc(title)}</text>
    <text x="18" y="56" class="node-copy">${wjLines(lines)}</text>
  </g>`;
const wjArrow = (x1, y1, x2, y2, label = "") => `
  <path d="M ${x1} ${y1} C ${(x1 + x2) / 2} ${y1}, ${(x1 + x2) / 2} ${y2}, ${x2} ${y2}"
        fill="none" stroke="#51625d" stroke-width="2.4" marker-end="url(#wjArrow)"/>
  ${label ? `<text x="${(x1 + x2) / 2 - 58}" y="${(y1 + y2) / 2 - 8}" class="edge-label">${wjEsc(label)}</text>` : ""}`;

const wonjoonGraph = `
<div class="wide-diagram">
<svg class="full-arch-graph wonjoon-graph" viewBox="0 0 2360 1320" role="img" aria-label="Wonjoon PR 106346 path diffusion architecture">
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

  <text x="42" y="54" class="lane-label">Data and labels</text>
  ${wjBox(40, 92, 305, 142, "Runtime inputs", ["6 camera frames", "route map", "speed / pose / indicator"], "input")}
  ${wjBox(40, 260, 305, 142, "Parking inputs", ["gear_direction adaptor", "parking_mode adaptor", "no separate goal-pose adaptor"], "input")}
  ${wjBox(40, 430, 305, 190, "Path labels", ["POLICY_PATH [B,50,7]", "sampled every 0.5m", "clamped at goal", "PARKING_POSE label"], "train")}
  ${wjBox(40, 650, 305, 166, "Ordinary labels", ["waypoints", "indicator state", "gear direction", "short horizon policy"], "train")}

  <text x="405" y="54" class="lane-label">SI / WFM encoder</text>
  ${wjBox(405, 120, 315, 172, "Input adaptors", ["Dec 2025 WFM video path", "route and scalar adaptors", "gear and parking tokens"], "adapter")}
  ${wjBox(790, 120, 365, 172, "InputAdaptor", ["concatenate token groups", "add temporal metadata", "emit INPUT_TOKENS"], "adapter")}
  ${wjBox(1225, 120, 380, 172, "STTransformer", ["WFMStDecember2025Cfg", "flash attention v3", "emit OUTPUT_TOKENS"], "encoder")}

  <text x="1670" y="54" class="lane-label">Output adaptor</text>
  ${wjBox(1665, 120, 350, 190, "DiffusionOutputAdaptor", ["learned pool queries", "XBlock cross-attn", "split pooled conditions"], "output")}
  ${wjBox(2055, 80, 260, 120, "diffusion_cond", ["[B,128,D]", "primary path head"], "output")}
  ${wjBox(2055, 235, 260, 120, "auxiliary_conds", ["two [B,128,D]", "training only"], "train")}
  ${wjBox(2055, 390, 260, 120, "ordinary_cond", ["policy output tokens", "ordinary head"], "output")}

  <text x="405" y="890" class="lane-label">Planner then controller</text>
  ${wjBox(405, 940, 380, 210, "Primary DiffusionHead", ["DDIM velocity denoiser", "embed=768, heads=8", "MMDiTBlock x2", "10 inference steps"], "output")}
  ${wjBox(850, 940, 380, 210, "PathPosePrePostProcessor", ["encode x/y only", "delta + polar + Welford", "chunk 50 points into 10 tokens", "decode yaw from xy"], "output")}
  ${wjBox(1300, 920, 340, 250, "Generated plan", ["POLICY_PATH [B,50,7]", "path distance", "forward / left tensors", "final point as pose proposal"], "deploy")}
  ${wjBox(1710, 865, 330, 160, "Aux head A", ["absolute path encoding", "aux diffusion loss", "not primary inference path"], "train")}
  ${wjBox(1710, 1055, 330, 160, "Aux head B", ["30-frame waypoint diffusion", "aux diffusion loss", "not deployed controller"], "train")}
  ${wjBox(1300, 1210, 340, 94, "PolicyPathConditioner", ["delta xy Conv1d + ego-proximity pool"], "output")}
  ${wjBox(1990, 1115, 320, 158, "OrdinaryHead", ["ordinary_cond + path embedding", "11-frame waypoints", "indicator + gear"], "deploy")}

  ${wjArrow(345, 162, 405, 185)}
  ${wjArrow(345, 331, 405, 207)}
  ${wjArrow(720, 206, 790, 206, "tokens")}
  ${wjArrow(1155, 206, 1225, 206, "INPUT_TOKENS")}
  ${wjArrow(1605, 206, 1665, 206, "OUTPUT_TOKENS")}
  ${wjArrow(2015, 196, 2055, 140)}
  ${wjArrow(2015, 215, 2055, 295)}
  ${wjArrow(2015, 235, 2055, 452)}
  ${wjArrow(2185, 200, 585, 940, "primary cond")}
  ${wjArrow(345, 525, 850, 1008, "path target")}
  ${wjArrow(785, 1045, 850, 1045, "x_t")}
  ${wjArrow(1230, 1045, 1300, 1045, "decode")}
  ${wjArrow(2185, 355, 1710, 945, "aux")}
  ${wjArrow(2185, 355, 1710, 1135, "aux")}
  ${wjArrow(1470, 1170, 1470, 1210, "path")}
  ${wjArrow(1640, 1255, 1990, 1194, "embedding")}
  ${wjArrow(2185, 510, 1990, 1165, "ordinary cond")}
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
