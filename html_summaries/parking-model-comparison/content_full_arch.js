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
const svgEdge = (d) => `<path class="fa-edge" marker-end="url(#faArrow)" d="${d}"></path>`;
const svgDefs = `
  <defs>
    <marker id="faArrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
      <path d="M0,0 L10,3 L0,6 Z"></path>
    </marker>
  </defs>`;

const siFullGraph = `
  <svg class="full-arch-graph wide" viewBox="0 0 1800 950" role="img" aria-label="SI full architecture graph with internal layers">
    ${svgDefs}
    <text class="fa-col" x="38" y="22">Inputs</text>
    <text class="fa-col" x="360" y="22">Adaptors</text>
    <text class="fa-col" x="735" y="122">ST Backbone</text>
    <text class="fa-col" x="1135" y="122">Output Adaptor</text>
    <text class="fa-col" x="1515" y="122">Outputs</text>
    ${svgEdge("M280 110 L340 110")}
    ${svgEdge("M280 285 C315 285 300 595 340 595")}
    ${svgEdge("M640 190 C685 190 680 280 710 300")}
    ${svgEdge("M640 610 C685 610 680 390 710 375")}
    ${svgEdge("M1040 350 L1110 350")}
    ${svgEdge("M1040 755 C1085 755 1080 500 1110 455")}
    ${svgEdge("M1420 350 L1510 350")}
    ${svgNode({
      x: 30,
      y: 50,
      w: 250,
      h: 365,
      title: "Raw inputs",
      sub: "SI parking tensors",
      items: ["camera frames", "route map", "vehicle speed", "speed limit", "pose/country/side", "indicator state", "PARKING_MODE"],
      cls: "green",
      connectInner: false,
    })}
    ${svgNode({
      x: 340,
      y: 45,
      w: 300,
      h: 330,
      title: "Video adaptor",
      sub: "VideoSTAdaptor + ViT",
      items: ["image tensor", "PatchEmbeddingStem", "2D positional enc", "ViTBlock x12", "LN -> SelfAttn -> Add", "LN -> MLP -> Add", "PatchStem -> video tokens"],
      cls: "blue",
    })}
    ${svgNode({
      x: 340,
      y: 470,
      w: 300,
      h: 300,
      title: "InputAdaptor",
      sub: "explicit SI merge",
      items: ["route/scalar/emb tokens", "dropout interface tokens", "ordered concat", "continuous time enc", "INPUT_TOKENS"],
      cls: "blue",
    })}
    ${svgNode({
      x: 710,
      y: 140,
      w: 330,
      h: 390,
      title: "STTransformer",
      sub: "large_l10, D=1536",
      items: ["INPUT_TOKENS", "STBlock x10", "reshape B*T,N,D", "LN -> spatial SA -> Add", "reshape B*N,T,D", "LN -> causal time SA -> Add", "LN -> MLP -> Add", "LayerNorm -> OUTPUT_TOKENS"],
      cls: "rust",
    })}
    ${svgNode({
      x: 710,
      y: 660,
      w: 330,
      h: 170,
      title: "Radar late fusion",
      sub: "after ST backbone",
      items: ["radar frames", "radar AE/encoder", "x-attn aggregator"],
      cls: "yellow",
    })}
    ${svgNode({
      x: 1110,
      y: 140,
      w: 310,
      h: 380,
      title: "OutputAdaptor",
      sub: "learned query decoder",
      items: ["OUTPUT_TOKENS + RADAR", "behavior token add", "self.queries", "CrossAttention", "decoded output tokens", "waypoint head", "indicator/gear/variance"],
      cls: "blue",
    })}
    ${svgNode({
      x: 1510,
      y: 140,
      w: 250,
      h: 330,
      title: "Policy outputs",
      sub: "single future",
      items: ["POLICY_WAYPOINTS", "POLICY_LOG_VARIANCE", "INDICATOR_WEIGHTS", "GEAR_WEIGHTS", "POLICY_TIME_DELTA", "CROSS_ATTN_TOKENS"],
      cls: "green",
      connectInner: false,
    })}
  </svg>`;

const zakFullGraph = `
  <svg class="full-arch-graph wide" viewBox="0 0 1800 950" role="img" aria-label="Zak full architecture graph with internal layers">
    ${svgDefs}
    <text class="fa-col" x="38" y="22">Inputs</text>
    <text class="fa-col" x="360" y="22">Adaptors</text>
    <text class="fa-col" x="735" y="122">ST Backbone Equiv.</text>
    <text class="fa-col" x="1135" y="122">OutputAdaptor Equiv.</text>
    <text class="fa-col" x="1515" y="122">Outputs</text>
    ${svgEdge("M280 110 L340 110")}
    ${svgEdge("M280 305 C315 305 300 595 340 595")}
    ${svgEdge("M640 190 C685 190 680 280 710 300")}
    ${svgEdge("M640 610 C685 610 680 390 710 375")}
    ${svgEdge("M1040 350 L1110 350")}
    ${svgEdge("M1420 350 L1510 350")}
    ${svgNode({
      x: 30,
      y: 50,
      w: 250,
      h: 365,
      title: "Raw inputs",
      sub: "PUDO tensors",
      items: ["5-camera frames", "route map", "speed history", "speed limit", "indicator stick/state", "gear + country", "PUDO request/target"],
      cls: "green",
      connectInner: false,
    })}
    ${svgNode({
      x: 340,
      y: 45,
      w: 300,
      h: 330,
      title: "Video adaptor",
      sub: "Zak: ViTStemWrapper",
      items: ["image tensor", "PatchEmbeddingStem", "2D positional enc", "ViTBlock x12", "LN -> SelfAttn -> Add", "LN -> MLP -> Add", "camera-token merge"],
      cls: "blue",
    })}
    ${svgNode({
      x: 340,
      y: 470,
      w: 300,
      h: 330,
      title: "InputAdaptor equiv.",
      sub: "split across modules",
      items: ["input_adapters dict", "route CNN tokens", "ParkingEncoder token", "scalar/context tokens", "continuous pos/time", "xs_dict token groups"],
      cls: "blue",
    })}
    ${svgNode({
      x: 710,
      y: 140,
      w: 330,
      h: 410,
      title: "STTransformer equiv.",
      sub: "Zak: MCVSpaceTimeEncoder",
      items: ["image tokens + xs_dict", "concat condition before image", "STBlock x11", "LN -> spatial SA -> Add", "LN -> causal time SA -> Add", "LN -> MLP -> Add", "LayerNorm", "encoder_context_tokens"],
      cls: "rust",
    })}
    ${svgNode({
      x: 1110,
      y: 140,
      w: 310,
      h: 390,
      title: "OutputAdaptor equiv.",
      sub: "Zak: RegressionDrivingHead",
      items: ["encoder_context_tokens", "behavior token add", "self.latents", "CrossAttention", "decoded output tokens", "waypoint query slice", "classifier query"],
      cls: "blue",
    })}
    ${svgNode({
      x: 1510,
      y: 140,
      w: 250,
      h: 430,
      title: "WTA policy outputs",
      sub: "8-mode future bank",
      items: ["egoposition_all_heads", "indicator_all_heads", "gear_all_heads", "mode_logits", "argmax/EMA selects k", "egoposition[k]", "indicator[k] + gear[k]"],
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
          <div class="arch-title">Video adaptor (<code>VideoSTAdaptor</code> + <code>ViTImageEncoder vit:large_l10</code>)</div>
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
            ${layer("Embedding adaptors", "indicator, parking mode, country, driving side, automation")}
            ${layer("Dropout-only adaptors", "waypoints/nav/gear interface tokens where inherited config keeps dropout active")}
            ${layer("Merge", "ordered concat over token dimension -> <code>INPUT_TOKENS</code>")}
            ${layer("Time encoding", "continuous time encoding applied at InputAdaptor level")}
          </div>
        </div>

        <div class="arch-block">
          <div class="arch-title">STTransformer equivalent (<code>STTransformer large_l10</code>)</div>
          <div class="layer-row">
            ${layer("STBlock", "reshape to <code>B*T</code> -> spatial self-attn over tokens -> residual", "repeat-badge")}
            ${layer("Temporal part", "reshape to <code>B*N</code> -> causal temporal self-attn per token slot -> residual", "repeat-badge")}
            ${layer("MLP part", "LayerNorm -> SwiGLU/clipped-SwiGLU MLP -> residual", "repeat-badge")}
            ${layer("Repeat", "<code>10x</code> STBlock, token dim 1536, 16 heads", "repeat-badge")}
            ${layer("Output norm", "final LayerNorm -> <code>OUTPUT_TOKENS</code>")}
          </div>
        </div>

        <div class="arch-block">
          <div class="arch-title">Radar late-fusion branch</div>
          <div class="layer-row">
            ${layer("Radar encoder", "masked radar / radar AE checkpoint path")}
            ${layer("Aggregator", "SA / cross-attn aggregation to fixed radar tokens")}
            ${layer("Late fusion", "radar tokens join after ST backbone, before output decoding")}
          </div>
        </div>

        <div class="arch-block">
          <div class="arch-title">OutputAdaptor equivalent (<code>OutputAdaptor</code>)</div>
          <div class="layer-row">
            ${layer("Behavior conditioning", "optional behavior label -> learned behavior token added to every encoder context token")}
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
      <tr><td>Video adaptor</td><td><code>VideoSTAdaptor(ViTImageEncoder vit:large_l10)</code>: 12x ViT SA blocks, then patch downsample to 1536.</td><td><code>ViTStemWrapper(ViTImageEncoder vit:large)</code>: same general ViT stack, wrapped to emit MCV-style merged camera tokens.</td></tr>
      <tr><td>InputAdaptor equivalent</td><td>One explicit <code>InputAdaptor</code> concatenates all adaptor outputs and applies time encoding.</td><td>Split across <code>input_adapters</code>, <code>ContinuousPositionalEncoding</code>, and the concat logic inside <code>MCVSpaceTimeEncoder</code>.</td></tr>
      <tr><td>ST backbone equivalent</td><td><code>STTransformer</code>: 10x Zoo <code>STBlock</code>, then output norm.</td><td><code>MCVSpaceTimeEncoder</code>: 11x causal/factorized ST blocks, then output norm.</td></tr>
      <tr><td>OutputAdaptor equivalent</td><td><code>OutputAdaptor</code>: learned output queries -> cross-attn -> waypoint/indicator/gear/variance heads.</td><td><code>RegressionDrivingHead</code>: learned output queries (<code>self.latents</code>) -> cross-attn -> 8 WTA ego/indicator/gear head banks + mode selector.</td></tr>
    </table>

    <p class="src">Sources: SI ViT ${link(gh.cur, "wayve/ai/zoo/vision/encoders/vit.py", 232, "ViTImageEncoder")}, SI ST ${link(gh.cur, "wayve/ai/zoo/st/st_transformer.py", 10, "STTransformer")}, SI STBlock ${link(gh.cur, "wayve/ai/zoo/attention/blocks.py", 134, "STBlock")}, SI output ${link(gh.cur, "wayve/ai/zoo/outputs/output_adaptor.py", 137, "OutputAdaptor heads")}; Zak ViT wrapper ${link(gh.zak, "wayve/ai/experimental/models/mcv_perceiver.py", 329, "ViTStemWrapper")}, Zak input adaptors ${link(gh.zak, "wayve/ai/experimental/models/mcv_perceiver.py", 391, "make_mcv_perceiver")}, Zak route/parking adaptors ${link(gh.zak, "wayve/ai/experimental/models/input_adapters.py", 314, "input_adapters")}, Zak MCV encoder ${link(gh.zak, "wayve/ai/experimental/models/mcv_perceiver.py", 2472, "MCVSpaceTimeEncoder")}, Zak output head ${link(gh.zak, "wayve/ai/experimental/models/mcv_perceiver.py", 3096, "RegressionDrivingHead")}.</p>
  `,
});
