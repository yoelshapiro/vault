const wonjoonFullGraph = `
  <svg class="full-arch-graph wide" viewBox="0 0 2200 1120" role="img" aria-label="Wonjoon full architecture graph with explicit inputs adaptors diffusion planner and ordinary policy head">
    ${svgDefs}
    <text class="fa-col" x="30" y="26">Separate runtime tensors</text>
    <text class="fa-col" x="335" y="26">Per-input adaptor / tokenizer</text>
    <text class="fa-col" x="735" y="26">Token merge</text>
    <text class="fa-col" x="1085" y="26">Space-time backbone</text>
    <text class="fa-col" x="1500" y="26">Diffusion output adaptor</text>
    <text class="fa-col" x="1900" y="26">Predictions</text>
    ${[
      [24, 55, "CAMERA_PREPROCESSED_IMAGES", "6-frame image clip", "green", 330, 55, "VideoSTAdaptor", "Dec 2025 WFM video stack", "blue"],
      [24, 128, "route map", "SI route raster", "green", 330, 128, "RouteSTAdaptor", "route tokens", "blue"],
      [24, 201, "VEHICLE_SPEED", "speed scalar/history", "green", 330, 201, "SpeedSTAdaptor", "speed token", "blue"],
      [24, 274, "speed limit", "continuous scalar", "green", 330, 274, "SpeedLimitSTAdaptor", "speed-limit token", "blue"],
      [24, 347, "indicator state", "turn signal state", "green", 330, 347, "IndicatorSTAdaptor", "indicator token", "blue"],
      [24, 420, "VEHICLE_GEAR_DIRECTION", "gear input enabled", "green", 330, 420, "GearDirectionSTAdaptor", "gear token", "blue"],
      [24, 493, "PARKING_MODE", "parking mode input", "green", 330, 493, "ParkingModeSTAdaptor", "parking token", "blue"],
      [24, 566, "pose / curvature", "ego motion context", "green", 330, 566, "Pose/vehicle adaptors", "motion tokens", "blue"],
      [24, 639, "country / side / automation", "context ids", "green", 330, 639, "Context ST adaptors", "context tokens", "blue"],
      [24, 735, "radar / nav", "disabled for this train cfg", "inactive yellow", 330, 735, "Radar/Nav adaptors", "variant/off", "inactive yellow"],
    ]
      .map(
        ([rx, y, rt, rs, rc, ax, ay, at, as, ac]) => `
          ${smallNode(rx, y, rt, rs, rc, 260)}
          ${smallNode(ax, ay, at, as, ac, 300)}
          ${directEdge(rx + 260, y + 29, ax, ay + 29, rc.includes("inactive") ? "inactive" : "")}`
      )
      .join("")}
    ${[
      [630, 84],
      [630, 157],
      [630, 230],
      [630, 303],
      [630, 376],
      [630, 449],
      [630, 522],
      [630, 595],
      [630, 668],
    ]
      .map(([x, y]) => bendEdge(x, y, 735, 458))
      .join("")}
    ${svgNode({
      x: 735,
      y: 330,
      w: 300,
      h: 255,
      title: "InputAdaptor",
      sub: "same SI-facing token contract",
      items: ["ModuleDict adaptor outputs", "video + route + scalar tokens", "gear_direction token", "parking_mode token", "concat token dimension", "continuous time encoding", "INPUT_TOKENS"],
      cls: "blue",
    })}
    ${bendEdge(1035, 458, 1090, 458)}
    ${svgNode({
      x: 1090,
      y: 285,
      w: 350,
      h: 365,
      title: "STTransformer",
      sub: "WFMStDecember2025Cfg",
      items: ["INPUT_TOKENS [B,T,N,D]", "Dec 2025 preprocess family", "STBlock stack", "spatial self-attention", "causal temporal self-attention", "clipped-SwiGLU MLP", "final LayerNorm", "OUTPUT_TOKENS"],
      cls: "rust",
    })}
    ${bendEdge(1440, 458, 1505, 458)}
    ${svgNode({
      x: 1505,
      y: 255,
      w: 350,
      h: 365,
      title: "DiffusionOutputAdaptor",
      sub: "replaces regular OutputAdaptor",
      items: ["learned pool queries", "cross-attend OUTPUT_TOKENS", "split pooled sequence", "diffusion_cond [B,128,D]", "auxiliary_conds x2", "ordinary_cond", "run diffusion before ordinary head"],
      cls: "blue",
    })}
    ${svgNode({
      x: 1505,
      y: 710,
      w: 350,
      h: 255,
      title: "Primary path diffusion",
      sub: "DiffusionHead + PathPosePrePostProcessor",
      items: ["MMDiT-style denoiser", "embed=768, heads=8", "DiTBlock x2", "train samples=50", "inference steps=10", "decode to POLICY_PATH"],
      cls: "purple",
    })}
    ${svgNode({
      x: 1088,
      y: 740,
      w: 345,
      h: 220,
      title: "Auxiliary diffusion heads",
      sub: "training regularizers",
      items: ["Aux A: absolute path", "Aux B: 30-frame waypoints", "same pooled-token split", "aux loss weight=1.0", "not the main deployed policy"],
      cls: "purple",
    })}
    ${svgNode({
      x: 735,
      y: 755,
      w: 300,
      h: 185,
      title: "PolicyPathConditioner",
      sub: "path -> ordinary policy embedding",
      items: ["train: true POLICY_PATH", "inference: generated path", "delta xy sequence", "Conv1d -> GELU -> Conv1d", "ego-proximity weighted pool"],
      cls: "yellow",
    })}
    ${svgNode({
      x: 24,
      y: 882,
      w: 260,
      h: 135,
      title: "POLICY_PATH label",
      sub: "training target only",
      items: ["[B,50,7]", "50 points @ 0.5m", "x,y,z,quaternion"],
      cls: "purple",
    })}
    ${svgNode({
      x: 330,
      y: 868,
      w: 300,
      h: 165,
      title: "Target processors",
      sub: "not runtime input adaptors",
      items: ["PathPosePrePostProcessor", "delta+polar primary target", "absolute path aux target", "waypoint diffusion aux target"],
      cls: "purple",
    })}
    ${svgNode({
      x: 24,
      y: 1035,
      w: 260,
      h: 80,
      title: "ordinary BC labels",
      sub: "waypoint / indicator / gear",
      items: [],
      cls: "purple",
      connectInner: false,
    })}
    ${svgNode({
      x: 1505,
      y: 980,
      w: 350,
      h: 125,
      title: "OrdinaryHead",
      sub: "short-horizon policy, path-conditioned",
      items: ["ordinary_cond + path embedding", "waypoint / indicator / gear heads"],
      cls: "blue",
    })}
    ${svgNode({
      x: 1900,
      y: 110,
      w: 260,
      h: 245,
      title: "Path outputs",
      sub: "inspectable long-horizon plan",
      items: ["POLICY_PATH [B,50,7]", "POLICY_PATH_DISTANCE", "POSITION_FORWARD", "POSITION_LEFT", "parking goal proposals"],
      cls: "green",
      connectInner: false,
    })}
    ${svgNode({
      x: 1900,
      y: 505,
      w: 260,
      h: 310,
      title: "Ordinary policy outputs",
      sub: "path-conditioned short horizon",
      items: ["POLICY_WAYPOINTS", "INDICATOR_WEIGHTS", "GEAR_WEIGHTS", "POLICY_TIME_DELTA", "covariance / variance path"],
      cls: "green",
      connectInner: false,
    })}
    ${bendEdge(1678, 620, 1678, 710)}
    ${bendEdge(1505, 835, 1433, 850)}
    ${bendEdge(284, 950, 330, 950, "train-only")}
    ${bendEdge(630, 930, 1505, 805, "train-only")}
    ${bendEdge(630, 940, 1088, 850, "train-only")}
    ${bendEdge(630, 940, 735, 815, "train-only")}
    ${bendEdge(1855, 838, 1900, 232, "inference")}
    ${bendEdge(1855, 838, 735, 815, "inference")}
    ${bendEdge(1680, 620, 1680, 980)}
    ${bendEdge(1035, 840, 1505, 1038, "train-only")}
    ${bendEdge(284, 1075, 1505, 1038, "train-only")}
    ${bendEdge(1855, 1038, 1900, 675)}
  </svg>`;

const wonjoonFullCard = `
      <div class="card">
        <p class="mini-title">Wonjoon full architecture graph</p>
        ${wonjoonFullGraph}
        <p class="src">Wonjoon graph legend: solid red/brown arrows are normal model flow, green arrows are inference-only generated-path flow, and dashed purple arrows are training-only target/loss flow.</p>
      </div>`;

const fullArchSection = window.REPORT_SECTIONS.find((section) => section.id === "fullarch");
if (fullArchSection) {
  fullArchSection.html = fullArchSection.html
    .replace(
      "The large block names use the same SI-facing vocabulary on both sides.",
      "The large block names use the same SI-facing vocabulary across SI, Zak, and Wonjoon."
    )
    .replace(
      `      <div class="card">
        <p class="mini-title">Zak full architecture graph</p>
        ${zakFullGraph}
      </div>
    </div>`,
      `      <div class="card">
        <p class="mini-title">Zak full architecture graph</p>
        ${zakFullGraph}
      </div>
${wonjoonFullCard}
    </div>`
    )
    .replace(
      "<tr><th>Normalized block</th><th>Current SI implementation</th><th>Zak implementation</th></tr>",
      "<tr><th>Normalized block</th><th>Current SI implementation</th><th>Zak implementation</th><th>Wonjoon implementation</th></tr>"
    )
    .replace(
      "<tr><td>Video adaptor</td><td><code>VideoSTAdaptor(ViTImageEncoder vit:large)</code>: 12x ViT SA blocks, then patch downsample to 1536.</td><td><code>ViTStemWrapper(ViTImageEncoder vit:large)</code>: same general ViT stack, wrapped to emit MCV-style merged camera tokens.</td></tr>",
      "<tr><td>Video adaptor</td><td><code>VideoSTAdaptor(ViTImageEncoder vit:large)</code>: 12x ViT SA blocks, then patch downsample to 1536.</td><td><code>ViTStemWrapper(ViTImageEncoder vit:large)</code>: same general ViT stack, wrapped to emit MCV-style merged camera tokens.</td><td><code>VideoSTAdaptor</code> through the Dec 2025 WFM/ST stack; same SI-facing image-token contract as the current parking model family.</td></tr>"
    )
    .replace(
      "<tr><td>InputAdaptor equivalent</td><td>One explicit <code>InputAdaptor</code> concatenates all adaptor outputs and applies time encoding.</td><td>Split across <code>input_adapters</code>, <code>ContinuousPositionalEncoding</code>, and the concat logic inside <code>MCVSpaceTimeEncoder</code>.</td></tr>",
      "<tr><td>InputAdaptor equivalent</td><td>One explicit <code>InputAdaptor</code> concatenates all adaptor outputs and applies time encoding.</td><td>Split across <code>input_adapters</code>, <code>ContinuousPositionalEncoding</code>, and the concat logic inside <code>MCVSpaceTimeEncoder</code>.</td><td>Explicit SI <code>InputAdaptor</code> path with active gear-direction and parking-mode tokens; radar/navigation are disabled in the train config.</td></tr>"
    )
    .replace(
      "<tr><td>ST backbone equivalent</td><td><code>STTransformer</code>: 11x Zoo <code>STBlock</code>, then output norm.</td><td><code>MCVSpaceTimeEncoder</code>: 11x causal/factorized ST blocks, then output norm.</td></tr>",
      "<tr><td>ST backbone equivalent</td><td><code>STTransformer</code>: 11x Zoo <code>STBlock</code>, then output norm.</td><td><code>MCVSpaceTimeEncoder</code>: 11x causal/factorized ST blocks, then output norm.</td><td><code>WFMStDecember2025Cfg</code> ST backbone producing <code>OUTPUT_TOKENS</code> for the diffusion output adaptor.</td></tr>"
    )
    .replace(
      "<tr><td>OutputAdaptor equivalent</td><td><code>OutputAdaptor</code>: learned output queries -> cross-attn -> waypoint/indicator/gear/variance heads.</td><td><code>RegressionDrivingHead</code>: learned output queries (<code>self.latents</code>) -> cross-attn -> 8 WTA ego/indicator/gear head banks + mode selector.</td></tr>",
      "<tr><td>OutputAdaptor equivalent</td><td><code>OutputAdaptor</code>: learned output queries -> cross-attn -> waypoint/indicator/gear/variance heads.</td><td><code>RegressionDrivingHead</code>: learned output queries (<code>self.latents</code>) -> cross-attn -> 8 WTA ego/indicator/gear head banks + mode selector.</td><td><code>DiffusionOutputAdaptor</code>: learned pool queries -> primary path diffusion + auxiliary diffusion heads + path-conditioned <code>OrdinaryHead</code>.</td></tr>"
    )
    .replace(
      "</table>\n\n    <p class=\"src\">Sources:",
      "<tr><td>Intermediate plan object</td><td>None: direct short-horizon policy outputs plus latent-action auxiliary path.</td><td>None: multimodality is explicit candidate head bank plus mode selector.</td><td><code>POLICY_PATH [B,50,7]</code> is generated first and then used by <code>PolicyPathConditioner</code> for ordinary policy prediction.</td></tr></table>\n\n    <p class=\"src\">Sources:"
    );
}
