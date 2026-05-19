window.REPORT_SECTIONS = window.REPORT_SECTIONS || [];
window.REPORT_AFTER_RENDER = window.REPORT_AFTER_RENDER || {};

const gh = {
  cur: "https://github.com/wayveai/WayveCode/blob/6108f48568c534b097d10e38df969e7a466c2a4a/",
  zak: "https://github.com/wayveai/WayveCode/blob/f904a17d930e4184535568282c6f4e7962b31672/",
};
const link = (base, path, line, text = `${path}#L${line}`) => `<a href="${base}${path}#L${line}">${text}</a>`;

window.REPORT_SECTIONS.push(
  {
    id: "glossary",
    title: "Terminology",
    html: `
      <div class="callout blue book">
        <p><b>Purpose.</b> This tab defines shorthand used in the report. In particular, "MCV tokens" was too implicit in the previous version.</p>
      </div>
      <table class="compare dense">
        <tr><th>Term</th><th>Meaning in this report</th><th>Where it appears in code</th></tr>
        <tr><td>SI ST tokens</td><td>The current SI model's encoded token tensor. Raw inputs are converted by Zoo <code>InputAdaptor</code> into <code>INPUT_TOKENS</code>, then the <code>STTransformer</code> writes <code>OUTPUT_TOKENS</code>. These are the context tokens consumed by <code>OutputAdaptor</code>.</td><td>${link(gh.cur, "wayve/ai/zoo/st/models.py", 115, "MIMOSTTransformer.forward_encoder")}</td></tr>
        <tr><td>MCV tokens</td><td>Zak-side shorthand for <b>MCVPerceiver encoded context tokens</b>: image patch tokens plus route/parking/speed/gear/indicator/context tokens after positional encoding and the <code>MCVSpaceTimeEncoder</code>. These are the tokens the <code>RegressionDrivingHead</code> cross-attends to.</td><td>${link(gh.zak, "wayve/ai/experimental/models/mcv_perceiver.py", 1543, "x_mcv decode path")}</td></tr>
        <tr><td>Conditioning tokens</td><td>Non-image tokens built from scalar/map/context inputs: route, parking, speed, speed limit, gear, indicator, country, driving side, automation, navigation, etc.</td><td>${link(gh.zak, "wayve/ai/experimental/models/mcv_perceiver.py", 721, "Zak input adapters")} and ${link(gh.cur, "wayve/ai/zoo/st/models.py", 278, "SI input adapters")}</td></tr>
        <tr><td>Output latents</td><td>Learned query vectors in Zak's <code>RegressionDrivingHead</code>. They are not data inputs; they are trainable vectors that cross-attend into encoded MCV tokens to produce waypoint/indicator/gear outputs.</td><td>${link(gh.zak, "wayve/ai/experimental/models/mcv_perceiver.py", 3203, "self.latents")}</td></tr>
        <tr><td>WTA heads</td><td>Eight parallel output heads in Zak's multimodal configuration. Each head predicts a full future; WTA loss decides which heads receive most supervision for each example/context frame.</td><td>${link(gh.zak, "wayve/ai/experimental/models/mcv_perceiver.py", 3248, "WTA head construction")}</td></tr>
      </table>
      <pre><code># "MCV tokens" in one dataflow
image_tokens = stem(batch["image"])
conditioning_tokens = input_adapters(batch)
image_tokens, conditioning_tokens = positional_encoding(
    image_tokens,
    conditioning_tokens,
    timestamps,
)
mcv_tokens = MCVSpaceTimeEncoder(image_tokens, conditioning_tokens)
outputs = RegressionDrivingHead(mcv_tokens, speed, curvature, parking_request)</code></pre>
    `,
  },
  {
    id: "overview",
    title: "Start Here",
    html: `
      <div class="callout warn book">
        <p><b>Core conclusion.</b> The SI parking config is identical between this branch and <code>origin/zmurez/pudo</code>. The model-level comparison is the current SI <code>MIMOSTTransformer</code> parking BC stack versus Zak's experimental <code>MCVPerceiver</code> + WTA output-head stack.</p>
        <p><b>How to read the report.</b> Start with Architecture Graphs for the module wiring, then walk left-to-right through data, inputs, encoders, outputs, latent/multimodal behavior, losses, and training mode. Config evidence and terminology are now appendices.</p>
      </div>
      <div class="verdict-grid">
        <div class="verdict-card">
          <span class="verdict-label">Current SI</span>
          <b>Single policy stream with behavior-control conditioning.</b>
          <p>WFM-style ST backbone, radar late fusion, parking-mode input, behavior token added before output heads. No active final latent-action policy path.</p>
        </div>
        <div class="verdict-card hot">
          <span class="verdict-label">Zak MCV/WTA</span>
          <b>Explicit multimodal output bank.</b>
          <p>MCVPerceiver encoder, first-class parking/PUDO input token, eight aligned ego/indicator/gear heads, mode classifier, annealed WTA loss.</p>
        </div>
        <div class="verdict-card cold">
          <span class="verdict-label">Main caveat</span>
          <b>Branch-tip inference, not a launched-run proof.</b>
          <p>The code/config evidence points to <code>mcv_new_phase2x_wta.yml</code>; exact run metadata would be needed to prove the latest training command.</p>
        </div>
      </div>
      <div class="chapter-map">
        <a href="#modelblocks"><b>Architecture Graphs</b><span>Code-traced NN module wiring and visual graphs.</span></a>
        <a href="#data"><b>Data Recipe</b><span>Sampler, augmentations, parking/PUDO signals.</span></a>
        <a href="#inputs"><b>Input Adaptors</b><span>How raw signals become tokens.</span></a>
        <a href="#encoder"><b>Encoders</b><span>STTransformer versus MCVSpaceTimeEncoder.</span></a>
        <a href="#outputs"><b>Output Adaptor</b><span>SI output queries versus Zak WTA head bank.</span></a>
        <a href="#latent"><b>Latents & Multimodal</b><span>SI latent grid, behavior control, Zak WTA modes.</span></a>
        <a href="#losses"><b>Losses & Preloads</b><span>LRs, checkpoints, WTA routing and consistency.</span></a>
        <a href="#training"><b>BC vs RL</b><span>Why the compared paths are BC, and where RL lives.</span></a>
      </div>
      <table class="compare dense aligned">
        <tr><th>Question</th><th>SI parking answer</th><th>Zak MCV/WTA answer</th></tr>
        <tr><td>What is the model?</td><td><code>MIMOSTTransformer</code> using the Zoo ST stack and <code>WFMSt100xYoloCfg</code>.</td><td><code>MCVPerceiver</code> using an MCV space-time encoder and WTA driving head.</td></tr>
        <tr><td>What changes for parking?</td><td>Adds parking mode and gear-direction adaptors, PUDO/parking buckets, and latent-action output conditioning.</td><td>Adds a richer ParkingEncoder and an explicit multimodal output head for ambiguous parking/PUDO futures.</td></tr>
        <tr><td>What is not present?</td><td>No explicit multimodal output distribution; behavior control is model-level but gated by parent config; radar is disabled in the current parking path; no RL in active SI mode.</td><td>No evidence that WTA and RL are combined in the inferred active config; RL is separate in <code>mcv_new_rl.yml</code>.</td></tr>
      </table>
    `,
  },
  {
    id: "config",
    title: "Config Evidence",
    html: `
      <div class="callout">
        <p><b>Resolved from code inspection.</b> Current branch and Zak branch have the same <code>parking_config.py</code>. The latest registered SI mode is <code>parking_bc_train_release_2026_6_14</code>. Zak's new work is in <code>wayve/ai/experimental</code>, with <code>mcv_new_phase2x_wta.yml</code> as the relevant multimodal config.</p>
      </div>
      <table class="compare dense">
        <tr><th>Evidence</th><th>Current SI parking</th><th>Zak branch</th></tr>
        <tr><td>File diff</td><td colspan="2"><code>git diff HEAD..origin/zmurez/pudo -- wayve/ai/si/configs/parking/parking_config.py</code> is empty.</td></tr>
        <tr><td>Train mode</td><td><code>parking_bc</code> / <code>parking_bc_cfg</code>: ${link(gh.cur, "wayve/ai/si/configs/parking/parking_config.py", 218, "parking_bc_cfg")}.</td><td>No SI mode-store entry for the WTA path. Experimental config: ${link(gh.zak, "wayve/ai/experimental/configs/mcv_new_phase2x_wta.yml", 1, "mcv_new_phase2x_wta.yml#L1")}.</td></tr>
        <tr><td>Model cfg</td><td><code>ParkingModelCfg</code>: <code>WFMSt100xYoloCfg</code> base, <code>name="large"</code>, 11 ST blocks, gear + parking-mode adaptors, no active radar/nav: ${link(gh.cur, "wayve/ai/si/configs/parking/parking_config.py", 196, "ParkingModelCfg")}.</td><td><code>mcv_new_phase2x_wta</code> inherits <code>phase2x -> phase2 -> base -> base0</code>; <code>base0</code> sets <code>MODEL.NAME=MCVPerceiver</code>: ${link(gh.zak, "wayve/ai/experimental/configs/mcv_new_base0.yml", 57, "base0#L57")}.</td></tr>
        <tr><td>WTA enablement</td><td>Not present.</td><td><code>EGOPOSITION.WTA.ENABLED=True</code>, <code>NUM_HEADS=8</code>, multi-frame training, classifier soft target, consistency weights: ${link(gh.zak, "wayve/ai/experimental/configs/mcv_new_phase2x_wta.yml", 10, "WTA block")}.</td></tr>
        <tr><td>SI-like Zak variant</td><td>Current SI mode is the source of truth.</td><td><code>mcv_new_phase2_si_baseline.yml</code> is a separate bridge config: SI crop/undistort, SI candidate finetune checkpoint, radar/nav enabled, parking disabled: ${link(gh.zak, "wayve/ai/experimental/configs/mcv_new_phase2_si_baseline.yml", 15, "si baseline")}.</td></tr>
      </table>
      <pre><code># Mental model for config inheritance
SI:
  parking_bc
    -> parking_bc_cfg
      -> ParkingModelCfg
        -> WFMSt100xYoloCfg
      -> default_losses_parking
      -> ParkingOutputAdaptorCfg

Zak:
  mcv_new_phase2x_wta.yml
    -> mcv_new_phase2x.yml
      -> mcv_new_phase2.yml
        -> mcv_new_base.yml
          -> mcv_new_base0.yml</code></pre>
    `,
  },
  {
    id: "data",
    title: "Data Recipe",
    html: `
      <p class="section-lede">This tab compares data construction in aligned rows. The diagrams are per-solution so each flow is readable independently.</p>
      <div class="module-compare">
        <div class="card">
          <p class="mini-title">SI data flow into model</p>
          <div class="module-flow">
            <div class="module-step green"><b>Materialized SI roots</b><small>Driving root plus parking/PUDO bucket root from parking dev materialisations.</small></div>
            <div class="module-step"><b>NestedBucketCfg sampler</b><small>Top-level group budgets: driving, PUDO, park, UNPUDO, unpark.</small></div>
            <div class="module-step blue"><b>ParkingDataConfig</b><small>Delegates to zoo dataloader by default; SI-specific policy-path augmentation stays off.</small></div>
            <div class="module-step"><b>insert_parking_data</b><small>Detects parking-window context using gear/speed/time/distance thresholds; writes <code>PARKING_MODE</code>.</small></div>
            <div class="module-step rust"><b>BC datamodule runtime</b><small>6 camera frames, 6 radar frames, route map, gear-direction augmentation.</small></div>
            <div class="module-step yellow"><b>Zoo/ST batch</b><small>Feeds camera/radar/route/scalar tensors to SI adaptors.</small></div>
          </div>
        </div>
        <div class="card">
          <p class="mini-title">Zak exp-ai data flow into model</p>
          <div class="module-flow">
            <div class="module-step green"><b>train_gen2 split</b><small>Exp-ai split with Speed-IMU odometry and 5-camera image configuration.</small></div>
            <div class="module-step"><b>Heuristic sampler</b><small>Scenario-weighted sampling: driving, starts, interventions, gear/indicator change, parking, PUDO, unparking.</small></div>
            <div class="module-step blue"><b>Image/route augmentation</b><small>Blur/sharpen/color/temporal dropout/JPEG half-res; route dropout and end jitter.</small></div>
            <div class="module-step"><b>Parking fields</b><small>Provides <code>parking_request</code>, <code>parking_direction</code>, <code>parking_position_ui</code>, <code>stopping_type</code>.</small></div>
            <div class="module-step rust"><b>MCV batch slicing</b><small>Present/past timesteps, speed history, indicator/gear history, continuous speed-limit fields.</small></div>
            <div class="module-step yellow"><b>Exp-ai batch</b><small>Feeds image stem and MCV input adapters.</small></div>
          </div>
        </div>
      </div>
      <table class="compare dense aligned">
        <tr><th>Category</th><th>Current SI parking</th><th>Zak MCV/WTA</th></tr>
        <tr><td>Source</td><td>Materialized SI parking dev roots: driving root and parking/PUDO buckets root.</td><td>Exp-ai <code>train_gen2.txt</code> split with Speed-IMU odometry.</td></tr>
        <tr><td>Sampler</td><td><code>NestedBucketCfg</code> top-level group budgets: driving 0.81, PUDO 0.07, park 0.07, UNPUDO 0.02, unpark 0.02.</td><td>Heuristic sampler weights many scenario families: stopped/not-stopped DC, starts, gear/indicator changes, interventions, parking, PUDO near/far, unparking.</td></tr>
        <tr><td>Image context</td><td>Train mode uses 6 camera frames at 0.20s stride.</td><td>Base config uses 5 cameras with a longer temporal list; phase2x uses MCV temporal encoding and WTA multi-frame train.</td></tr>
        <tr><td>Radar</td><td>6 radar frames; radar late fusion enabled.</td><td>Not part of inferred WTA base path unless variant enables radar; SI-baseline variant explicitly enables radar.</td></tr>
        <tr><td>Parking signal</td><td>Zoo parking pass writes boolean <code>PARKING_MODE</code>.</td><td>Structured fields consumed by <code>ParkingEncoder</code>: request, direction, UI position, stopping/PUDO type.</td></tr>
        <tr><td>Route shortening / navigation</td><td>Current SI parking uses the route map as provided by the SI parking datamodule path; no comparable route-end jitter is enabled in this config.</td><td>Zak builds per-segment route polyline metadata after gear cleanup, extends the final polyline toward the real parking location, samples a jittered route endpoint around the park/PUDO point, truncates the route map at that endpoint, and writes <code>route_end_position</code>/<code>route_end_distance</code>. This is route-map augmentation, not the full <code>NAVIGATION</code> token adaptor in the inferred WTA base.</td></tr>
        <tr><td>Augmentations</td><td>Route dropout 0, indicator dropout 0, gear-direction augmentation enabled. <code>ParkingDataConfig</code> advanced SI augmentations remain off by default.</td><td>Image blur/sharpen/color 0.2, temporal dropout 0.1, JPEG half-res 0.9, route dropout 0.25, route black dropout 0.9, random route end jitter.</td></tr>
      </table>
      <p class="src">Sources: ${link(gh.cur, "wayve/ai/si/configs/parking/parking_config.py", 178, "SI D26.3 datamodule")}, ${link(gh.cur, "wayve/ai/si/datamodules/parking.py", 63, "ParkingDataConfig")}, ${link(gh.zak, "wayve/ai/experimental/configs/mcv_new_base0.yml", 177, "Zak route config")}, ${link(gh.zak, "wayve/ai/experimental/dataset/single_run.py", 748, "route polyline metadata")}, ${link(gh.zak, "wayve/ai/experimental/dataset/ipace.py", 1942, "rasterize_route")}, ${link(gh.zak, "wayve/ai/experimental/models/input_adapters.py", 517, "NavigationEncoder")}.</p>
      <pre><code># Pseudo-code: why SI and Zak see different parking signals
if si_parking:
    data["PARKING_MODE"] = detect_parking_window(gear, speed, time_threshold, distance_threshold)
    model_tokens += Embedding2(data["PARKING_MODE"])

if zak_mcv:
    parking_token = (
        Embedding2(parking_request)
      + Embedding3(parking_direction)
      + MLP(parking_position_ui_xy / 30.0)
      + Embedding2(stopping_type)      # PUDO/PARK type when enabled
    )
    model_tokens += parking_token

# Zak route shortening / endpoint jitter
polyline = extend_polyline_to_park(route_polyline, final_park_lonlat)
center = distance_at_park_or_route_end(segment)
jitter = sample_before_after_or_rand(valid_before_after_distances)
final_vertex, end_idx = interpolate(polyline, center + jitter)
route_map = rasterize(polyline[start_idx:end_idx] + final_vertex)
data["route_end_position"] = ego_relative(final_vertex)</code></pre>
    `,
  },
  {
    id: "inputs",
    title: "Input Adaptors",
    html: `
      <div class="callout blue book">
        <p><b>Important distinction.</b> SI input adaptors mostly preserve the general WFM contract and add a small parking bit. Zak's input adapters make parking intent first-class before the encoder. This matters because the MCV encoder can attend jointly over route, target UI position, direction preference, current speed, speed limit, gear, and image evidence.</p>
      </div>
      <table class="compare dense">
        <tr><th>Input</th><th>Current SI ST path</th><th>Zak MCV path</th></tr>
        <tr><td>Images</td><td><code>VideoSTAdaptor</code> uses the WFM vision encoder and returns image tokens to <code>InputAdaptor</code>.</td><td>ViT patch stem converts 5-camera images into MCV visual tokens.</td></tr>
        <tr><td>Route</td><td><code>RouteSTAdaptor</code> encodes the SI route map; dropout is configured at datamodule level but is 0.0 here.</td><td><code>RouteCNNEncoderMission100x</code>: normalize route pixels, strided conv/groupnorm/ReLU, flatten, positional encode. The dataset may shorten/jitter the route endpoint before rasterization.</td></tr>
        <tr><td>Parking</td><td><code>ParkingModeSTAdaptor</code>: 2-class embedding over <code>PARKING_MODE</code>.</td><td><code>ParkingEncoder</code>: request + direction + target UI MLP + stopping type. This is the largest parking-specific input change.</td></tr>
        <tr><td>Gear</td><td><code>GearDirectionSTAdaptor</code> is active because <code>parking_bc_cfg</code> sets <code>use_gear_direction=True</code>. It is a separate input token and gear is also predicted by the output head.</td><td><code>GearAdaptor</code> embeds reverse/park/drive as gear+1; variants can use dropout-only gear for SI compatibility.</td></tr>
        <tr><td>Indicator</td><td><code>IndicatorSTAdaptor</code> plus <code>use_indicator_memory=True</code>.</td><td>Separate stick and state adaptors; state can include history, unknown values are mapped.</td></tr>
        <tr><td>Speed</td><td><code>SpeedSTAdaptor</code> with vehicle-frame context.</td><td><code>VectorInputAdapter</code> slices present plus five past values in WTA, normalizes by 17.777..., no symlog in phase2x.</td></tr>
        <tr><td>Speed limit</td><td><code>SpeedLimitSTAdaptor</code> inherited from WFM Dec config with NaN/inf handling.</td><td><code>ContinuousSpeedLimitAdaptor</code> encodes relative speed-limit delta using sin/cos features and learned NaN/inf tokens.</td></tr>
        <tr><td>Navigation DMI tokens</td><td>Not active in the current <code>WFMSt100xYoloCfg</code> parking path; <code>StepAndLaneInfoSTAdaptor</code> is a variant/off adaptor unless enabled by config.</td><td><code>NavigationEncoder</code> wraps SI <code>StepAndLaneInfoSTAdaptor</code> and consumes grouped navigation tensors, but <code>NAVIGATION.ENABLED</code> is default-off in the inferred WTA base. The SI-baseline variant enables it.</td></tr>
        <tr><td>Other context</td><td>Country, driving side, automation, pose, and waypoint dropout are separate adaptor/token families. Radar is not active in this path.</td><td>Country is active. Driving side, automation, waypoint dropout, nav, radar, intrinsics, and pose are conditional/variant modules for this inferred WTA chain.</td></tr>
      </table>
      <div class="codegrid">
        <pre><code># SI adaptor pseudo-code
tokens = {}
tokens["video"] = VideoSTAdaptor(images)
tokens["route"] = RouteSTAdaptor(route_map)
tokens["speed"] = SpeedSTAdaptor(vehicle_speed)
tokens["speed_limit"] = SpeedLimitSTAdaptor(speed_limit)
tokens["gear_direction"] = GearDirectionSTAdaptor(gear_direction)
tokens["parking_mode"] = ParkingModeSTAdaptor(PARKING_MODE)
input_tokens = InputAdaptor(tokens).with_temporal_encoding()</code></pre>
        <pre><code># Zak adaptor pseudo-code
xs = MyModuleDict()
xs["route"] = RouteCNNEncoderMission100x(route)
xs["parking"] = ParkingEncoder(
    parking_request,
    parking_direction,
    parking_position_ui,
    stopping_type,
)
xs["speed"] = VectorInputAdapter(speed[-6:])
xs["speed_limit"] = ContinuousSpeedLimitAdaptor(speed_limit, speed)
x_mcv, xs = ContinuousPositionalEncoding(image_tokens, xs)</code></pre>
      </div>
      <p class="src">Sources: SI input assembly ${link(gh.cur, "wayve/ai/zoo/st/models.py", 278, "models.py#L278")}; SI parking/gear ${link(gh.cur, "wayve/ai/zoo/st/input_adaptors/parking_mode.py", 8, "parking_mode")} / ${link(gh.cur, "wayve/ai/zoo/st/input_adaptors/gear_direction.py", 13, "gear_direction")}; Zak input assembly ${link(gh.zak, "wayve/ai/experimental/models/mcv_perceiver.py", 721, "mcv_perceiver#L721")}; Zak adapters ${link(gh.zak, "wayve/ai/experimental/models/input_adapters.py", 86, "input_adapters#L86")}.</p>
    `,
  },
);
