const wonjoonFullGraph = `
  <svg class="full-arch-graph wide" viewBox="0 0 2400 1320" role="img" aria-label="Wonjoon full architecture graph with separated runtime and training target flows">
    ${svgDefs}
    <text class="fa-col" x="30" y="26">Runtime tensors</text>
    <text class="fa-col" x="325" y="26">Runtime adaptors</text>
    <text class="fa-col" x="662" y="26">Token bus</text>
    <text class="fa-col" x="760" y="26">Token merge</text>
    <text class="fa-col" x="1090" y="26">Space-time backbone</text>
    <text class="fa-col" x="1485" y="26">Output adaptor and heads</text>
    <text class="fa-col" x="1980" y="26">Predictions</text>
    ${[
      [24, 58, "CAMERA_PREPROCESSED_IMAGES", "6-frame image clip", "green", 320, 58, "VideoSTAdaptor", "Dec 2025 WFM video stack", "blue"],
      [24, 126, "route map", "SI route raster", "green", 320, 126, "RouteSTAdaptor", "route tokens", "blue"],
      [24, 194, "VEHICLE_SPEED", "speed scalar/history", "green", 320, 194, "SpeedSTAdaptor", "speed token", "blue"],
      [24, 262, "speed limit", "continuous scalar", "green", 320, 262, "SpeedLimitSTAdaptor", "speed-limit token", "blue"],
      [24, 330, "indicator state", "turn signal state", "green", 320, 330, "IndicatorSTAdaptor", "indicator token", "blue"],
      [24, 398, "VEHICLE_GEAR_DIRECTION", "gear input enabled", "green", 320, 398, "GearDirectionSTAdaptor", "gear token", "blue"],
      [24, 466, "PARKING_MODE", "parking mode input", "green", 320, 466, "ParkingModeSTAdaptor", "parking token", "blue"],
      [24, 534, "pose / curvature", "ego motion context", "green", 320, 534, "Pose/vehicle adaptors", "motion tokens", "blue"],
      [24, 602, "country / side / automation", "context ids", "green", 320, 602, "Context ST adaptors", "context tokens", "blue"],
      [24, 690, "radar / nav", "disabled for this train cfg", "inactive yellow", 320, 690, "Radar/Nav adaptors", "variant/off", "inactive yellow"],
    ]
      .map(
        ([rx, y, rt, rs, rc, ax, ay, at, as, ac]) => `
          ${smallNode(rx, y, rt, rs, rc, 250)}
          ${smallNode(ax, ay, at, as, ac, 280)}
          ${directEdge(rx + 250, y + 29, ax, ay + 29, rc.includes("inactive") ? "inactive" : "")}
          ${directEdge(ax + 280, ay + 29, 652, ay + 29, rc.includes("inactive") ? "inactive" : "")}`
      )
      .join("")}
    <path class="fa-inner-edge" d="M652 87 L652 631"></path>
    ${directEdge(652, 360, 760, 360)}
    ${svgNode({
      x: 760,
      y: 235,
      w: 285,
      h: 250,
      title: "InputAdaptor",
      sub: "runtime tokens only",
      items: ["ModuleDict adaptor outputs", "video + route + scalars", "gear_direction token", "parking_mode token", "concat token dimension", "time encoding", "INPUT_TOKENS"],
      cls: "blue",
    })}
    ${directEdge(1045, 360, 1100, 360)}
    ${svgNode({
      x: 1100,
      y: 205,
      w: 340,
      h: 320,
      title: "STTransformer",
      sub: "WFMStDecember2025Cfg",
      items: ["INPUT_TOKENS [B,T,N,D]", "Dec 2025 preprocess family", "STBlock stack", "spatial self-attention", "causal temporal attention", "clipped-SwiGLU MLP", "OUTPUT_TOKENS"],
      cls: "rust",
    })}
    ${directEdge(1440, 360, 1495, 360)}
    ${svgNode({
      x: 1495,
      y: 170,
      w: 355,
      h: 330,
      title: "DiffusionOutputAdaptor",
      sub: "learned pool-query cross-attn",
      items: ["flatten OUTPUT_TOKENS", "pool_queries + XBlock", "pool_mlp", "diffusion_cond [B,128,D]", "auxiliary_conds x2", "ordinary_cond"],
      cls: "blue",
    })}
    ${svgNode({
      x: 1495,
      y: 610,
      w: 355,
      h: 250,
      title: "Primary path diffusion",
      sub: "DiffusionHead + PathPosePrePostProcessor",
      items: ["x_t Fourier features", "MMDiTBlock x2", "DDIM velocity field", "10 inference steps", "decode generated POLICY_PATH"],
      cls: "purple",
    })}
    ${svgNode({
      x: 1985,
      y: 590,
      w: 300,
      h: 250,
      title: "Path outputs",
      sub: "first-stage generated plan",
      items: ["POLICY_PATH [B,50,7]", "POLICY_PATH_DISTANCE", "POSITION_FORWARD", "POSITION_LEFT", "parking goal proposal"],
      cls: "green",
      connectInner: false,
    })}
    ${svgNode({
      x: 1095,
      y: 890,
      w: 330,
      h: 185,
      title: "PolicyPathConditioner",
      sub: "path -> policy embedding",
      items: ["train: true POLICY_PATH", "inference: generated path", "delta xy Conv1d stack", "ego-proximity weighted pool", "projection + LayerNorm"],
      cls: "yellow",
    })}
    ${svgNode({
      x: 1495,
      y: 940,
      w: 355,
      h: 165,
      title: "OrdinaryHead",
      sub: "short-horizon policy",
      items: ["ordinary_cond + path embedding", "IndicatorOutputHead", "WaypointOutputHead", "GearDirectionOutputHead"],
      cls: "blue",
    })}
    ${svgNode({
      x: 1985,
      y: 930,
      w: 300,
      h: 230,
      title: "Ordinary policy outputs",
      sub: "path-conditioned short horizon",
      items: ["POLICY_WAYPOINTS", "INDICATOR_WEIGHTS", "GEAR_WEIGHTS", "POLICY_TIME_DELTA"],
      cls: "green",
      connectInner: false,
    })}
    ${directEdge(1672, 500, 1672, 610)}
    ${directEdge(1850, 735, 1985, 715, "inference")}
    ${bendEdge(1985, 825, 1425, 980, "inference")}
    ${directEdge(1425, 982, 1495, 1018)}
    ${directEdge(1850, 1022, 1985, 1045)}
    ${bendEdge(1672, 500, 1672, 940)}

    <text class="fa-col" x="30" y="850">Training targets and losses (not runtime adaptors)</text>
    ${svgNode({
      x: 24,
      y: 900,
      w: 260,
      h: 135,
      title: "POLICY_PATH label",
      sub: "training target only",
      items: ["[B,50,7]", "50 points @ 0.5m", "x,y,z,quaternion"],
      cls: "purple",
    })}
    ${svgNode({
      x: 320,
      y: 900,
      w: 285,
      h: 165,
      title: "Target processors",
      sub: "loss-space encoders",
      items: ["delta+polar path target", "absolute path aux target", "waypoint diffusion target", "ordinary BC targets"],
      cls: "purple",
    })}
    ${svgNode({
      x: 760,
      y: 920,
      w: 285,
      h: 135,
      title: "Training losses",
      sub: "supervised BC only",
      items: ["primary diffusion MSE", "aux diffusion losses", "waypoint / indicator / gear"],
      cls: "purple",
    })}
    ${directEdge(284, 967, 320, 982, "train-only")}
    ${directEdge(605, 982, 760, 988, "train-only")}
    ${bendEdge(1045, 988, 1495, 735, "train-only")}
    ${bendEdge(1045, 988, 1095, 982, "train-only")}
    ${bendEdge(1045, 988, 1495, 1028, "train-only")}
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
