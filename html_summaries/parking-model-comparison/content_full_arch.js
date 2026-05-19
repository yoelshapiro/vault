window.REPORT_SECTIONS = window.REPORT_SECTIONS || [];

const layer = (title, body, cls = "") => `<div class="layer-box ${cls}"><strong>${title}</strong>${body}</div>`;

window.REPORT_SECTIONS.push({
  id: "fullarch",
  title: "Full Architecture",
  html: `
    <div class="callout blue book">
      <p><b>Reading convention.</b> The large block names use the same SI-facing vocabulary on both sides. Zak implementation names are shown in parentheses. Repeated structures are drawn once and marked with their repeat count.</p>
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
