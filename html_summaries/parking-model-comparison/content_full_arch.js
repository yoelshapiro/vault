window.REPORT_SECTIONS = window.REPORT_SECTIONS || [];

const layer = (title, body, cls = "") => `<div class="layer-box ${cls}"><strong>${title}</strong>${body}</div>`;
const svgLineText = (lines, x, y, cls = "") =>
  lines.map((line, i) => `<tspan class="${cls}" x="${x}" y="${y + i * 17}">${line}</tspan>`).join("");
const svgNode = ({ x, y, w, h, title, sub = "", items, cls = "", connectInner = true }) => `
  <g class="fa-node ${cls}" transform="translate(${x} ${y})">
    <rect class="fa-outer" width="${w}" height="${h}"></rect>
    <text class="fa-title">${svgLineText([title], 12, 24)}</text>
    ${sub ? `<text class="fa-sub">${svgLineText([sub], 12, 43)}</text>` : ""}
    ${items
      .map(
        (item, i) => `
          ${connectInner && i > 0 ? `<path class="fa-inner-edge" marker-end="url(#faArrow)" d="M${w / 2} ${48 + i * 34} L${w / 2} ${56 + i * 34}"></path>` : ""}
          <g transform="translate(12 ${58 + i * 34})">
            <rect class="fa-inner" width="${w - 24}" height="24"></rect>
            <text class="fa-item" x="9" y="16">${item}</text>
          </g>`
      )
      .join("")}
  </g>`;
const svgEdge = (d, cls = "") => `<path class="fa-edge ${cls}" marker-end="url(#faArrow)" d="${d}"></path>`;
const svgDefs = `
  <defs>
    <marker id="faArrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
      <path d="M0,0 L10,3 L0,6 Z"></path>
    </marker>
  </defs>`;
const smallNode = (x, y, title, sub, cls = "green", w = 245) =>
  svgNode({ x, y, w, h: 58, title, sub, items: [], cls, connectInner: false });
const directEdge = (x1, y1, x2, y2, cls = "") => svgEdge(`M${x1} ${y1} L${x2} ${y2}`, cls);
const bendEdge = (x1, y1, x2, y2, cls = "") =>
  svgEdge(`M${x1} ${y1} C${x1 + 85} ${y1} ${x2 - 85} ${y2} ${x2} ${y2}`, cls);

const siFullGraph = `
  <svg class="full-arch-graph wide" viewBox="0 0 2200 1120" role="img" aria-label="SI full architecture graph with explicit inputs adaptors and internal layers">
    ${svgDefs}
    <text class="fa-col" x="30" y="26">Separate raw tensors</text>
    <text class="fa-col" x="335" y="26">Per-input adaptor / tokenizer</text>
    <text class="fa-col" x="735" y="26">Token merge</text>
    <text class="fa-col" x="1085" y="26">Space-time backbone</text>
    <text class="fa-col" x="1500" y="26">Output adaptor</text>
    <text class="fa-col" x="1900" y="26">Predictions</text>
    ${[
      [24, 55, "CAMERA_PREPROCESSED_IMAGES", "multi-camera image clip", "green", 330, 55, "VideoSTAdaptor", "ViT image encoder only", "blue"],
      [24, 128, "route map", "raster route image", "green", 330, 128, "RouteSTAdaptor", "route tokens", "blue"],
      [24, 201, "VEHICLE_SPEED", "present vehicle scalar", "green", 330, 201, "SpeedSTAdaptor", "speed token", "blue"],
      [24, 274, "speed limit", "continuous scalar", "green", 330, 274, "SpeedLimitSTAdaptor", "speed-limit token", "blue"],
      [24, 347, "indicator state", "turn signal state", "green", 330, 347, "IndicatorSTAdaptor", "indicator token", "blue"],
      [24, 420, "VEHICLE_GEAR_DIRECTION", "gear input", "green", 330, 420, "GearDirectionSTAdaptor", "gear token", "blue"],
      [24, 493, "automation state", "filled no-auto when absent", "green", 330, 493, "AutomationStateSTAdaptor", "automation token", "blue"],
      [24, 566, "PARKING_MODE", "parking context bit", "green", 330, 566, "ParkingModeSTAdaptor", "parking token", "blue"],
      [24, 639, "country code", "country id", "green", 330, 639, "CountrySTAdaptor", "country token", "blue"],
      [24, 712, "driving side", "left/right road side", "green", 330, 712, "DrivingSideSTAdaptor", "side token", "blue"],
      [24, 785, "pose", "ego pose context", "green", 330, 785, "PoseSTAdaptor", "pose token", "blue"],
      [24, 858, "waypoints interface", "always-dropout WFM slot", "yellow", 330, 858, "WaypointsSTAdaptor", "dropout token slot", "yellow"],
      [24, 955, "step/lane navigation", "not active in WFMSt100xYoloCfg", "inactive yellow", 330, 955, "StepAndLaneInfoSTAdaptor", "variant/off", "inactive yellow"],
      [24, 1028, "radar input", "not enabled in this config", "inactive yellow", 330, 1028, "RadarInputAdaptor", "variant/off", "inactive yellow"],
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
      [630, 741],
      [630, 814],
      [630, 887],
    ]
      .map(([x, y]) => bendEdge(x, y, 735, 458))
      .join("")}
    ${svgNode({
      x: 735,
      y: 330,
      w: 300,
      h: 255,
      title: "InputAdaptor",
      sub: "after every adaptor output",
      items: ["ModuleDict in ADAPTOR_ORDER", "video deliberately last", "call each adaptor(inputs)", "optional per-adaptor LN", "concat over token dimension", "continuous time encoding", "INPUT_TOKENS"],
      cls: "blue",
    })}
    ${bendEdge(1035, 458, 1090, 458)}
    ${svgNode({
      x: 1090,
      y: 285,
      w: 350,
      h: 365,
      title: "STTransformer",
      sub: "WFMSt100xYoloCfg: large, D=1536",
      items: ["INPUT_TOKENS [B,T,N,D]", "STBlock x11", "reshape B*T,N,D", "spatial self-attention", "reshape B*N,T,D", "causal temporal self-attention", "clipped-SwiGLU MLP", "LayerNorm -> OUTPUT_TOKENS"],
      cls: "rust",
    })}
    ${bendEdge(1440, 458, 1505, 458)}
    ${svgNode({
      x: 1505,
      y: 285,
      w: 340,
      h: 365,
      title: "OutputAdaptor",
      sub: "learned query decoder",
      items: ["context = OUTPUT_TOKENS", "latent-action path if enabled", "behavior token if enabled", "learned self.queries", "cross-attention decoder", "head-specific query slices", "waypoint/indicator/gear/variance heads"],
      cls: "blue",
    })}
    ${bendEdge(1845, 458, 1900, 190)}
    ${bendEdge(1845, 458, 1900, 315)}
    ${bendEdge(1845, 458, 1900, 440)}
    ${bendEdge(1845, 458, 1900, 565)}
    ${svgNode({
      x: 1900,
      y: 150,
      w: 260,
      h: 520,
      title: "Policy outputs",
      sub: "single decoded future",
      items: ["POLICY_WAYPOINTS", "POLICY_LOG_VARIANCE", "INDICATOR_WEIGHTS", "GEAR_WEIGHTS", "POLICY_TIME_DELTA", "CROSS_ATTN_TOKENS"],
      cls: "green",
      connectInner: false,
    })}
  </svg>`;

const zakFullGraph = `
  <svg class="full-arch-graph wide" viewBox="0 0 2200 1120" role="img" aria-label="Zak full architecture graph with explicit inputs adaptors and internal layers">
    ${svgDefs}
    <text class="fa-col" x="30" y="26">Separate raw tensors</text>
    <text class="fa-col" x="335" y="26">Per-input adaptor / tokenizer</text>
    <text class="fa-col" x="735" y="26">Named token groups</text>
    <text class="fa-col" x="1085" y="26">ST backbone equiv.</text>
    <text class="fa-col" x="1500" y="26">Output adaptor equiv.</text>
    <text class="fa-col" x="1900" y="26">Predictions</text>
    ${[
      [24, 55, "IMAGE", "5 cameras x temporal clip", "green", 330, 55, "ViTStemWrapper", "image-only video adaptor", "blue"],
      [24, 128, "route", "route raster", "green", 330, 128, "RouteCNNEncoderMission100x", "route tokens", "blue"],
      [24, 201, "speed", "present + 5 past", "green", 330, 201, "VectorInputAdapter", "speed token", "blue"],
      [24, 274, "speed_limit", "continuous limit scalar", "green", 330, 274, "ContinuousSpeedLimitAdaptor", "speed-limit token", "blue"],
      [24, 347, "indicator_stick", "driver stalk", "green", 330, 347, "IndicatorAdaptor", "stick token", "blue"],
      [24, 420, "indicator_state", "past state history", "green", 330, 420, "IndicatorAdaptor", "state token", "blue"],
      [24, 493, "gear_state", "current gear", "green", 330, 493, "GearAdaptor", "gear token", "blue"],
      [24, 566, "parking_request", "PUDO request flag", "green", 330, 566, "ParkingEncoder", "request embedding", "blue"],
      [24, 639, "parking_direction", "PUDO direction", "green", 330, 639, "ParkingEncoder", "direction embedding", "blue"],
      [24, 712, "parking_position_ui", "target UI xy", "green", 330, 712, "ParkingEncoder", "position MLP", "blue"],
      [24, 785, "stopping_type", "parking stop type", "green", 330, 785, "ParkingEncoder", "type embedding", "blue"],
      [24, 858, "country_code", "country id", "green", 330, 858, "CountryAdaptor", "country token", "blue"],
      [24, 955, "navigation", "default-off in WTA config", "inactive yellow", 330, 955, "NavigationEncoder", "variant/off", "inactive yellow"],
      [24, 1028, "radar", "default-off; late concat if enabled", "inactive yellow", 330, 1028, "RadarEncoder", "variant/off after MCV", "inactive yellow"],
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
      [630, 741],
      [630, 814],
      [630, 887],
    ]
      .map(([x, y]) => bendEdge(x, y, 735, 458))
      .join("")}
    ${svgNode({
      x: 735,
      y: 330,
      w: 300,
      h: 255,
      title: "InputAdaptor equivalent",
      sub: "MyModuleDict + positional encoding",
      items: ["input_adapters(batch) -> xs", "named token groups", "image tokens stay separate", "ContinuousPositionalEncoding", "time/spatial/camera encoding", "condition groups remain named", "to MCVSpaceTimeEncoder"],
      cls: "blue",
    })}
    ${bendEdge(630, 84, 1090, 335)}
    ${bendEdge(1035, 458, 1090, 458)}
    ${svgNode({
      x: 1090,
      y: 285,
      w: 350,
      h: 365,
      title: "STTransformer equivalent",
      sub: "MCVSpaceTimeEncoder, D=1536",
      items: ["image tokens + xs dict", "expand condition groups over T", "concat condition before image", "STBlock x11", "spatial self-attention", "causal temporal self-attention", "clipped-SwiGLU MLP", "encoder_context_tokens"],
      cls: "rust",
    })}
    ${bendEdge(1440, 458, 1505, 458)}
    ${svgNode({
      x: 1505,
      y: 285,
      w: 340,
      h: 365,
      title: "OutputAdaptor equivalent",
      sub: "RegressionDrivingHead",
      items: ["context = encoded MCV tokens", "optional behavior token", "learned self.latents", "cross-attention decoder", "waypoint query slice", "WTA classifier query", "8 aligned head banks"],
      cls: "blue",
    })}
    ${bendEdge(1845, 458, 1900, 170)}
    ${bendEdge(1845, 458, 1900, 305)}
    ${bendEdge(1845, 458, 1900, 440)}
    ${bendEdge(1845, 458, 1900, 575)}
    ${svgNode({
      x: 1900,
      y: 130,
      w: 260,
      h: 560,
      title: "WTA policy outputs",
      sub: "8-mode future bank",
      items: ["egoposition_all_heads", "indicator_all_heads", "gear_all_heads", "mode_logits", "argmax/EMA selects k", "egoposition[k]", "indicator[k]", "gear[k]"],
      cls: "green",
      connectInner: false,
    })}
  </svg>`;

window.REPORT_SECTIONS.push({
  id: "fullarch",
  title: "Full Architecture",
  html: `
    <div class="callout blue book">
      <p><b>Reading convention.</b> The large block names use the same SI-facing vocabulary on both sides. Zak implementation names are shown in parentheses. Repeated structures are drawn once and marked with their repeat count.</p>
    </div>
    <div class="visual-stack">
      <div class="card">
        <p class="mini-title">Current SI full architecture graph</p>
        ${siFullGraph}
      </div>
      <div class="card">
        <p class="mini-title">Zak full architecture graph</p>
        ${zakFullGraph}
      </div>
    </div>
    <div class="arch-grid">
      <div class="card">
        <p class="mini-title">Current SI full architecture: <code>MIMOSTTransformer</code></p>

        <div class="arch-block">
          <div class="arch-title">Preprocess and input tensors</div>
          <div class="layer-row">
            ${layer("Camera tensors", "multi-camera temporal clip -> platform focal/crop preprocessing")}
            ${layer("Route map", "SI route raster, normalized image-like map")}
            ${layer("Scalar/context", "speed, speed limit, pose, indicator, country, side, automation")}
            ${layer("Parking bit", "<code>PARKING_MODE</code> boolean -> parking context")}
          </div>
        </div>

        <div class="arch-block">
          <div class="arch-title">Video adaptor (<code>VideoSTAdaptor</code> + <code>ViTImageEncoder vit:large</code>)</div>
          <div class="layer-row">
            ${layer("Patch stem", "<code>PatchEmbeddingStem</code> / stem to ViT dim 768")}
            ${layer("2D pos enc", "<code>SinCosPositionalEncoding</code> over image patch grid")}
            ${layer("ViT SA block", "LayerNorm -> non-causal self-attn -> residual -> LayerNorm -> MLP -> residual", "repeat-badge")}
            ${layer("Repeat", "<code>12x</code> ViT blocks, 16 heads, dim 768", "repeat-badge")}
            ${layer("Patch downsample", "<code>PatchStem</code> to ST token dim 1536")}
            ${layer("Camera/time handling", "restore <code>[B,T,Cam,H,W,D]</code>, camera pos enc, optional cache/dropout")}
          </div>
        </div>

        <div class="arch-block">
          <div class="arch-title">InputAdaptor equivalent (<code>InputAdaptor</code>)</div>
          <div class="layer-row">
            ${layer("Route adaptor", "NormZeroOne -> Conv2d/GN/ReLU downsample stack -> Flatten -> PositionalEncoding")}
            ${layer("Scalar adaptors", "small MLP / sinusoidal or learned projections to <code>D=1536</code> tokens")}
            ${layer("Embedding adaptors", "indicator, gear direction, parking mode, country, driving side, automation")}
            ${layer("Dropout-only adaptor", "waypoints are present as an always-dropout WFM interface slot")}
            ${layer("Variant/off", "step/lane navigation and radar are not constructed in the current <code>WFMSt100xYoloCfg</code> parking path")}
            ${layer("Merge", "ordered concat over token dimension -> <code>INPUT_TOKENS</code>")}
            ${layer("Time encoding", "continuous time encoding applied at InputAdaptor level")}
          </div>
        </div>

        <div class="arch-block">
          <div class="arch-title">STTransformer equivalent (<code>STTransformer large</code>)</div>
          <div class="layer-row">
            ${layer("STBlock", "reshape to <code>B*T</code> -> spatial self-attn over tokens -> residual", "repeat-badge")}
            ${layer("Temporal part", "reshape to <code>B*N</code> -> causal temporal self-attn per token slot -> residual", "repeat-badge")}
            ${layer("MLP part", "LayerNorm -> SwiGLU/clipped-SwiGLU MLP -> residual", "repeat-badge")}
            ${layer("Repeat", "<code>11x</code> STBlock, token dim 1536, 16 heads", "repeat-badge")}
            ${layer("Output norm", "final LayerNorm -> <code>OUTPUT_TOKENS</code>")}
          </div>
        </div>

        <div class="arch-block">
          <div class="arch-title">Radar branch</div>
          <div class="layer-row">
            ${layer("Current state", "not enabled by <code>ParkingModelCfg</code> / <code>WFMSt100xYoloCfg</code>")}
            ${layer("If enabled", "early radar can enter <code>InputAdaptor</code>; late radar can concatenate after ST depending on config")}
            ${layer("Graph treatment", "shown as variant/off, not part of the active current-branch parking model")}
          </div>
        </div>

        <div class="arch-block">
          <div class="arch-title">OutputAdaptor equivalent (<code>OutputAdaptor</code>)</div>
          <div class="layer-row">
            ${layer("Behavior conditioning", "disabled in <code>parking_bc_cfg</code> because <code>enable_behavior_control=False</code>")}
            ${layer("Latent action", "enabled by <code>w_latent_action=1.0</code>; predicts/uses a discretized latent-action auxiliary path")}
            ${layer("Learned output queries", "<code>self.queries</code>: waypoint slice + indicator + gear + variance slice")}
            ${layer("Cross-attention decoder", "queries attend into encoder context tokens", "split-badge")}
            ${layer("Waypoint head", "Linear per waypoint token -> delta waypoints")}
            ${layer("Indicator head", "1 query -> Linear to 3 logits, expanded across future")}
            ${layer("Gear head", "1 query -> Linear to 3 gear-direction logits")}
            ${layer("Variance head", "per-waypoint query -> log variance when likelihood loss enabled")}
          </div>
        </div>
      </div>

      <div class="card">
        <p class="mini-title">Zak full architecture: <code>MCVPerceiver / mcv_new_phase2x_wta</code></p>

        <div class="arch-block">
          <div class="arch-title">Preprocess and input tensors</div>
          <div class="layer-row">
            ${layer("Camera tensors", "5-camera temporal context, flattened by <code>_encode</code>")}
            ${layer("Route map", "route raster with route-shortening / endpoint jitter augmentation")}
            ${layer("Scalar/context", "speed history, speed limit, indicator stick/state, gear state, country")}
            ${layer("PUDO parking fields", "parking request, direction, UI position, stopping type")}
          </div>
        </div>

        <div class="arch-block">
          <div class="arch-title">Video adaptor (<code>ViTStemWrapper</code> around <code>ViTImageEncoder vit:large</code>)</div>
          <div class="layer-row">
            ${layer("Patch stem", "<code>STEM_VIT_PATCH_STEM=True</code>; patch embed to ViT dim 768")}
            ${layer("2D pos enc", "same ViT positional encoding family, applied before encoder blocks")}
            ${layer("ViT SA block", "LayerNorm -> non-causal self-attn -> residual -> LayerNorm -> clipped-SwiGLU MLP -> residual", "repeat-badge")}
            ${layer("Repeat", "<code>12x</code> ViT blocks, 16 heads, qk_norm l2", "repeat-badge")}
            ${layer("Patch downsample", "downsample to MCV dim <code>D=1536</code>")}
            ${layer("Camera merge", "flatten spatial tokens and merge cameras -> <code>[B*T, N*H'*W', D]</code>")}
          </div>
        </div>

        <div class="arch-block">
          <div class="arch-title">InputAdaptor equivalent, split across Zak modules</div>
          <div class="layer-row">
            ${layer("Token group emitters", "<code>MyModuleDict input_adapters</code> returns named groups", "split-badge")}
            ${layer("Route adaptor", "<code>RouteCNNEncoderMission100x</code>: NormZeroOne -> Conv2d/GN/ReLU stack -> Flatten -> PositionalEncoding")}
            ${layer("Parking adaptor", "<code>ParkingEncoder</code>: request emb + direction emb + UI-position MLP + stopping-type emb")}
            ${layer("Scalar/context adaptors", "speed vector, continuous speed-limit, indicator, gear, country; nav/radar variants default-off here")}
            ${layer("Position/time", "<code>ContinuousPositionalEncoding</code> adds spatial camera and time encodings", "split-badge")}
            ${layer("Merge point", "<code>MCVSpaceTimeEncoder</code> expands condition groups over time and concats before image tokens", "split-badge")}
          </div>
        </div>

        <div class="arch-block">
          <div class="arch-title">STTransformer equivalent (<code>MCVSpaceTimeEncoder</code>)</div>
          <div class="layer-row">
            ${layer("Condition concat", "for each <code>xs_dict</code> group: expand to T if needed, count extra tokens, concat before image tokens")}
            ${layer("STBlock", "space attention over tokens -> time attention over frames -> MLP", "repeat-badge")}
            ${layer("Repeat", "<code>11x</code> causal factorized space-time block, D=1536, 16 heads", "repeat-badge")}
            ${layer("Output norm", "LayerNorm at end of transformer sequence")}
            ${layer("Condition output policy", "phase2x keeps conditioning tokens in output; strip can be disabled")}
          </div>
        </div>

        <div class="arch-block">
          <div class="arch-title">OutputAdaptor equivalent (<code>RegressionDrivingHead</code>)</div>
          <div class="layer-row">
            ${layer("Behavior conditioning", "if enabled: behavior codebook vector added to every encoder context token")}
            ${layer("Learned output queries", "<code>self.latents</code>: waypoint queries + optional aux queries + WTA classifier query")}
            ${layer("Cross-attention decoder", "<code>xattend(latents, encoder_context_tokens)</code>", "split-badge")}
            ${layer("Waypoint query slice", "first <code>n</code> decoded output tokens feed all WTA heads")}
            ${layer("8x ego heads", "8 independent MLPs, output 2D waypoint positions with time/speed normalization")}
            ${layer("8x indicator heads", "8 independent MLPs over waypoint tokens; per-waypoint in phase2x WTA")}
            ${layer("8x gear heads", "8 independent MLPs over waypoint tokens; per-waypoint in phase2x WTA")}
            ${layer("Mode selector", "classifier query token -> MLP -> 8 logits; argmax/EMA selects same head id for ego/indicator/gear")}
          </div>
        </div>
      </div>
    </div>

    <table class="compare dense aligned">
      <tr><th>Normalized block</th><th>Current SI implementation</th><th>Zak implementation</th></tr>
      <tr><td>Video adaptor</td><td><code>VideoSTAdaptor(ViTImageEncoder vit:large)</code>: 12x ViT SA blocks, then patch downsample to 1536.</td><td><code>ViTStemWrapper(ViTImageEncoder vit:large)</code>: same general ViT stack, wrapped to emit MCV-style merged camera tokens.</td></tr>
      <tr><td>InputAdaptor equivalent</td><td>One explicit <code>InputAdaptor</code> concatenates all adaptor outputs and applies time encoding.</td><td>Split across <code>input_adapters</code>, <code>ContinuousPositionalEncoding</code>, and the concat logic inside <code>MCVSpaceTimeEncoder</code>.</td></tr>
      <tr><td>ST backbone equivalent</td><td><code>STTransformer</code>: 11x Zoo <code>STBlock</code>, then output norm.</td><td><code>MCVSpaceTimeEncoder</code>: 11x causal/factorized ST blocks, then output norm.</td></tr>
      <tr><td>OutputAdaptor equivalent</td><td><code>OutputAdaptor</code>: learned output queries -> cross-attn -> waypoint/indicator/gear/variance heads.</td><td><code>RegressionDrivingHead</code>: learned output queries (<code>self.latents</code>) -> cross-attn -> 8 WTA ego/indicator/gear head banks + mode selector.</td></tr>
    </table>

    <p class="src">Sources: SI ViT ${link(gh.cur, "wayve/ai/zoo/vision/encoders/vit.py", 232, "ViTImageEncoder")}, SI ST ${link(gh.cur, "wayve/ai/zoo/st/st_transformer.py", 10, "STTransformer")}, SI STBlock ${link(gh.cur, "wayve/ai/zoo/attention/blocks.py", 134, "STBlock")}, SI output ${link(gh.cur, "wayve/ai/zoo/outputs/output_adaptor.py", 137, "OutputAdaptor heads")}; Zak ViT wrapper ${link(gh.zak, "wayve/ai/experimental/models/mcv_perceiver.py", 329, "ViTStemWrapper")}, Zak input adaptors ${link(gh.zak, "wayve/ai/experimental/models/mcv_perceiver.py", 391, "make_mcv_perceiver")}, Zak route/parking adaptors ${link(gh.zak, "wayve/ai/experimental/models/input_adapters.py", 314, "input_adapters")}, Zak MCV encoder ${link(gh.zak, "wayve/ai/experimental/models/mcv_perceiver.py", 2472, "MCVSpaceTimeEncoder")}, Zak output head ${link(gh.zak, "wayve/ai/experimental/models/mcv_perceiver.py", 3096, "RegressionDrivingHead")}.</p>
  `,
});
