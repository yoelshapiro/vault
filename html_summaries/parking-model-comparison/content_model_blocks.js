window.REPORT_SECTIONS = window.REPORT_SECTIONS || [];

window.REPORT_SECTIONS.push({
  id: "modelblocks",
  title: "Architecture Graphs",
  html: `
    <div class="callout warn book">
      <p><b>Code-traced module diagrams.</b> This tab is built from the actual construction paths: SI <code>build_space_time_model</code> plus <code>ParkingModelCfg</code> / <code>WFMSt100xYoloCfg</code>, and Zak <code>make_mcv_perceiver</code> plus <code>mcv_new_phase2x_wta.yml</code>. The detailed Full Architecture tab now shows every raw input as a separate node, with images going through <code>VideoSTAdaptor</code> and non-image tensors going through their own tokenizer/adaptor before the token merge.</p>
    </div>
    <div class="visual-stack">
      <div class="card">
        <p class="mini-title">Current SI: visual architecture graph</p>
        <svg class="visual-graph" viewBox="0 0 1640 560" role="img" aria-label="Current SI parking model visual architecture graph">
          <defs>
            <marker id="siArrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto"><path d="M0,0 L10,3 L0,6 Z"></path></marker>
          </defs>
          <text class="vg-col-label" x="48" y="22">Raw inputs</text>
          <text class="vg-col-label" x="252" y="22">Input encoders / adaptors</text>
          <text class="vg-col-label" x="612" y="212">Token merge</text>
          <text class="vg-col-label" x="850" y="226">Space-time backbone</text>
          <text class="vg-col-label" x="1240" y="212">Output adaptor</text>
          <text class="vg-col-label" x="1470" y="62">Predictions</text>
          <path class="vg-edge" marker-end="url(#siArrow)" d="M200 72 L250 72"></path>
          <path class="vg-edge" marker-end="url(#siArrow)" d="M410 72 L460 72"></path>
          <path class="vg-edge" marker-end="url(#siArrow)" d="M620 72 C650 72 560 240 610 260"></path>
          <path class="vg-edge" marker-end="url(#siArrow)" d="M200 162 L250 162"></path>
          <path class="vg-edge" marker-end="url(#siArrow)" d="M410 162 C500 162 520 245 610 260"></path>
          <path class="vg-edge" marker-end="url(#siArrow)" d="M200 252 L250 252"></path>
          <path class="vg-edge" marker-end="url(#siArrow)" d="M410 252 L610 260"></path>
          <path class="vg-edge" marker-end="url(#siArrow)" d="M200 342 L250 342"></path>
          <path class="vg-edge" marker-end="url(#siArrow)" d="M410 342 C500 342 520 300 610 286"></path>
          <path class="vg-edge dashed" marker-end="url(#siArrow)" d="M200 432 L250 432"></path>
          <path class="vg-edge dashed" marker-end="url(#siArrow)" d="M410 432 C520 432 530 315 610 300"></path>
          <path class="vg-edge" marker-end="url(#siArrow)" d="M800 280 L850 280"></path>
          <path class="vg-edge" marker-end="url(#siArrow)" d="M1030 280 L1070 280"></path>
          <path class="vg-edge" marker-end="url(#siArrow)" d="M1220 280 L1240 280"></path>
          <path class="vg-edge dashed" marker-end="url(#siArrow)" d="M1030 454 L1070 454"></path>
          <path class="vg-edge dashed" marker-end="url(#siArrow)" d="M1220 454 C1270 454 1270 350 1240 315"></path>
          <path class="vg-edge" marker-end="url(#siArrow)" d="M1400 260 C1445 260 1445 112 1470 112"></path>
          <path class="vg-edge" marker-end="url(#siArrow)" d="M1400 275 C1445 275 1445 202 1470 202"></path>
          <path class="vg-edge" marker-end="url(#siArrow)" d="M1400 290 C1445 290 1445 292 1470 292"></path>
          <path class="vg-edge" marker-end="url(#siArrow)" d="M1400 305 C1445 305 1445 382 1470 382"></path>
          <g class="vg-node green" transform="translate(40 40)"><rect width="160" height="64"></rect><text><tspan x="12" y="24">Camera frames</tspan><tspan class="vg-sub" x="12" y="45">6-frame context</tspan></text></g>
          <g class="vg-node" transform="translate(250 40)"><rect width="160" height="64"></rect><text><tspan x="12" y="24">Preprocess</tspan><tspan class="vg-sub" x="12" y="45">ParkingPreprocessCfg</tspan></text></g>
          <g class="vg-node blue" transform="translate(460 40)"><rect width="160" height="64"></rect><text><tspan x="12" y="24">VideoSTAdaptor</tspan><tspan class="vg-sub" x="12" y="45">ViT large</tspan></text></g>
          <g class="vg-node" transform="translate(40 130)"><rect width="160" height="64"></rect><text><tspan x="12" y="24">Route map</tspan><tspan class="vg-sub" x="12" y="45">SI route raster</tspan></text></g>
          <g class="vg-node blue" transform="translate(250 130)"><rect width="160" height="64"></rect><text><tspan x="12" y="24">RouteSTAdaptor</tspan><tspan class="vg-sub" x="12" y="45">CNN route encoder</tspan></text></g>
          <g class="vg-node" transform="translate(40 220)"><rect width="160" height="64"></rect><text><tspan x="12" y="22">Speed, limit, pose</tspan><tspan class="vg-sub" x="12" y="42">separate tensors</tspan></text></g>
          <g class="vg-node blue" transform="translate(250 220)"><rect width="160" height="64"></rect><text><tspan x="12" y="20">Per-input ST</tspan><tspan x="12" y="38">adaptors</tspan><tspan class="vg-sub" x="12" y="55">one token family each</tspan></text></g>
          <g class="vg-node green" transform="translate(40 310)"><rect width="160" height="64"></rect><text><tspan x="12" y="24">PARKING_MODE</tspan><tspan class="vg-sub" x="12" y="45">boolean parking bit</tspan></text></g>
          <g class="vg-node green" transform="translate(250 310)"><rect width="160" height="64"></rect><text><tspan x="12" y="24">ParkingMode</tspan><tspan class="vg-sub" x="12" y="45">2-class embedding</tspan></text></g>
          <g class="vg-node yellow" transform="translate(40 400)"><rect width="160" height="64"></rect><text><tspan x="12" y="22">Gear, country, side</tspan><tspan class="vg-sub" x="12" y="42">plus waypoint slot</tspan></text></g>
          <g class="vg-node yellow" transform="translate(250 400)"><rect width="160" height="64"></rect><text><tspan x="12" y="22">Separate adaptors</tspan><tspan class="vg-sub" x="12" y="43">nav/radar variant-off</tspan></text></g>
          <g class="vg-node join" transform="translate(610 230)"><rect width="190" height="100"></rect><text><tspan x="16" y="32">InputAdaptor</tspan><tspan class="vg-sub" x="16" y="54">ordered concat</tspan><tspan class="vg-sub" x="16" y="74">+ time encoding</tspan></text></g>
          <g class="vg-node rust" transform="translate(850 242)"><rect width="180" height="76"></rect><text><tspan x="14" y="28">STTransformer</tspan><tspan class="vg-sub" x="14" y="50">11 STBlock layers</tspan></text></g>
          <g class="vg-node rust" transform="translate(1070 242)"><rect width="150" height="76"></rect><text><tspan x="13" y="29">OUTPUT_TOKENS</tspan></text></g>
          <g class="vg-node blue" transform="translate(1240 230)"><rect width="160" height="100"></rect><text><tspan x="13" y="31">OutputAdaptor</tspan><tspan class="vg-sub" x="13" y="53">behavior control</tspan><tspan class="vg-sub" x="13" y="73">+ output queries</tspan></text></g>
          <g class="vg-node yellow" transform="translate(850 422)"><rect width="180" height="64"></rect><text><tspan x="14" y="24">Radar frames</tspan><tspan class="vg-sub" x="14" y="45">late fusion path</tspan></text></g>
          <g class="vg-node yellow" transform="translate(1070 422)"><rect width="150" height="64"></rect><text><tspan x="12" y="24">RadarAdaptor</tspan><tspan class="vg-sub" x="12" y="45">RADAR_TOKENS</tspan></text></g>
          <g class="vg-node green" transform="translate(1470 82)"><rect width="140" height="60"></rect><text><tspan x="10" y="24">Waypoints</tspan><tspan class="vg-sub" x="10" y="43">delta path</tspan></text></g>
          <g class="vg-node green" transform="translate(1470 172)"><rect width="140" height="60"></rect><text><tspan x="10" y="24">Log variance</tspan></text></g>
          <g class="vg-node green" transform="translate(1470 262)"><rect width="140" height="60"></rect><text><tspan x="10" y="24">Indicator</tspan></text></g>
          <g class="vg-node green" transform="translate(1470 352)"><rect width="140" height="60"></rect><text><tspan x="10" y="24">Gear output</tspan></text></g>
        </svg>
      </div>
      <div class="card">
        <p class="mini-title">Zak MCV/WTA: visual architecture graph</p>
        <svg class="visual-graph" viewBox="0 0 1640 560" role="img" aria-label="Zak MCV WTA model visual architecture graph">
          <defs>
            <marker id="zakArrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto"><path d="M0,0 L10,3 L0,6 Z"></path></marker>
          </defs>
          <text class="vg-col-label" x="48" y="22">Raw inputs</text>
          <text class="vg-col-label" x="252" y="22">Input encoders / adaptors</text>
          <text class="vg-col-label" x="690" y="22">Adaptor tokens</text>
          <text class="vg-col-label" x="910" y="216">InputAdaptor equiv.</text>
          <text class="vg-col-label" x="1110" y="216">ST backbone equiv.</text>
          <text class="vg-col-label" x="1330" y="216">OutputAdaptor equiv.</text>
          <text class="vg-col-label" x="1530" y="62">Predictions</text>
          <path class="vg-edge" marker-end="url(#zakArrow)" d="M200 72 L250 72"></path>
          <path class="vg-edge" marker-end="url(#zakArrow)" d="M410 72 L460 72"></path>
          <path class="vg-edge" marker-end="url(#zakArrow)" d="M620 72 L690 72"></path>
          <path class="vg-edge" marker-end="url(#zakArrow)" d="M200 182 L250 182"></path>
          <path class="vg-edge" marker-end="url(#zakArrow)" d="M410 182 C505 182 560 242 690 264"></path>
          <path class="vg-edge" marker-end="url(#zakArrow)" d="M200 292 L250 292"></path>
          <path class="vg-edge" marker-end="url(#zakArrow)" d="M410 292 C505 292 560 278 690 276"></path>
          <path class="vg-edge" marker-end="url(#zakArrow)" d="M200 402 L250 402"></path>
          <path class="vg-edge" marker-end="url(#zakArrow)" d="M410 402 C510 402 560 315 690 290"></path>
          <path class="vg-edge" marker-end="url(#zakArrow)" d="M850 88 C900 88 885 238 910 252"></path>
          <path class="vg-edge" marker-end="url(#zakArrow)" d="M850 276 L910 276"></path>
          <path class="vg-edge" marker-end="url(#zakArrow)" d="M1070 276 L1110 276"></path>
          <path class="vg-edge" marker-end="url(#zakArrow)" d="M1290 276 L1330 276"></path>
          <path class="vg-edge" marker-end="url(#zakArrow)" d="M1490 276 C1520 276 1515 112 1530 112"></path>
          <path class="vg-edge" marker-end="url(#zakArrow)" d="M1490 276 C1520 276 1515 202 1530 202"></path>
          <path class="vg-edge" marker-end="url(#zakArrow)" d="M1490 276 C1520 276 1515 292 1530 292"></path>
          <path class="vg-edge" marker-end="url(#zakArrow)" d="M1490 276 C1520 276 1515 382 1530 382"></path>
          <path class="vg-edge dashed" marker-end="url(#zakArrow)" d="M1530 382 C1495 455 1450 455 1390 323"></path>
          <g class="vg-node green" transform="translate(40 40)"><rect width="160" height="64"></rect><text><tspan x="12" y="24">5-camera images</tspan><tspan class="vg-sub" x="12" y="45">temporal context</tspan></text></g>
          <g class="vg-node blue" transform="translate(250 40)"><rect width="160" height="64"></rect><text><tspan x="12" y="24">Preprocess</tspan><tspan class="vg-sub" x="12" y="45">Zak: _encode</tspan></text></g>
          <g class="vg-node blue" transform="translate(460 40)"><rect width="160" height="64"></rect><text><tspan x="12" y="20">Video adaptor</tspan><tspan class="vg-sub" x="12" y="40">Zak: ViTStemWrapper</tspan><tspan class="vg-sub" x="12" y="56">patch + downsample</tspan></text></g>
          <g class="vg-node join" transform="translate(690 40)"><rect width="160" height="64"></rect><text><tspan x="12" y="24">video tokens</tspan><tspan class="vg-sub" x="12" y="45">Zak: image tokens</tspan></text></g>
          <g class="vg-node" transform="translate(40 150)"><rect width="160" height="64"></rect><text><tspan x="12" y="22">Route, speed hist</tspan><tspan class="vg-sub" x="12" y="42">continuous speed-limit</tspan></text></g>
          <g class="vg-node blue" transform="translate(250 150)"><rect width="160" height="64"></rect><text><tspan x="12" y="20">Route/scalar</tspan><tspan x="12" y="38">adaptors</tspan><tspan class="vg-sub" x="12" y="55">Zak: RouteCNN + vector</tspan></text></g>
          <g class="vg-node green" transform="translate(40 260)"><rect width="160" height="64"></rect><text><tspan x="12" y="23">Parking fields</tspan><tspan class="vg-sub" x="12" y="44">request/dir/UI/type</tspan></text></g>
          <g class="vg-node green" transform="translate(250 260)"><rect width="160" height="64"></rect><text><tspan x="12" y="22">Parking adaptor</tspan><tspan class="vg-sub" x="12" y="42">Zak: ParkingEncoder</tspan><tspan class="vg-sub" x="12" y="57">PUDO token</tspan></text></g>
          <g class="vg-node" transform="translate(40 370)"><rect width="160" height="64"></rect><text><tspan x="12" y="21">Indicator stick/state</tspan><tspan class="vg-sub" x="12" y="41">gear state, country</tspan></text></g>
          <g class="vg-node blue" transform="translate(250 370)"><rect width="160" height="64"></rect><text><tspan x="12" y="20">Context adaptors</tspan><tspan class="vg-sub" x="12" y="40">Zak: MCV adaptors</tspan><tspan class="vg-sub" x="12" y="56">gear/country/nav opt.</tspan></text></g>
          <g class="vg-node join" transform="translate(690 230)"><rect width="160" height="92"></rect><text><tspan x="12" y="24">Adaptor token</tspan><tspan x="12" y="44">groups</tspan><tspan class="vg-sub" x="12" y="64">Zak: xs_dict</tspan><tspan class="vg-sub" x="12" y="80">named groups</tspan></text></g>
          <g class="vg-node rust" transform="translate(910 232)"><rect width="160" height="88"></rect><text><tspan x="12" y="25">InputAdaptor</tspan><tspan x="12" y="45">part 1</tspan><tspan class="vg-sub" x="12" y="64">Zak: positional</tspan><tspan class="vg-sub" x="12" y="80">encoding</tspan></text></g>
          <g class="vg-node rust" transform="translate(1110 232)"><rect width="180" height="88"></rect><text><tspan x="14" y="25">STTransformer</tspan><tspan x="14" y="45">equivalent</tspan><tspan class="vg-sub" x="14" y="64">Zak: MCVSpaceTime</tspan><tspan class="vg-sub" x="14" y="80">Encoder</tspan></text></g>
          <g class="vg-node blue" transform="translate(1330 232)"><rect width="160" height="88"></rect><text><tspan x="12" y="25">OutputAdaptor</tspan><tspan x="12" y="45">equivalent</tspan><tspan class="vg-sub" x="12" y="64">Zak: Regression</tspan><tspan class="vg-sub" x="12" y="80">DrivingHead</tspan></text></g>
          <g class="vg-node green" transform="translate(1530 82)"><rect width="90" height="60"></rect><text><tspan x="10" y="20">Waypts</tspan><tspan class="vg-sub" x="10" y="38">Zak: 8 ego</tspan><tspan class="vg-sub" x="10" y="54">heads</tspan></text></g>
          <g class="vg-node green" transform="translate(1530 172)"><rect width="90" height="60"></rect><text><tspan x="10" y="20">Indicator</tspan><tspan class="vg-sub" x="10" y="38">Zak: 8</tspan><tspan class="vg-sub" x="10" y="54">heads</tspan></text></g>
          <g class="vg-node green" transform="translate(1530 262)"><rect width="90" height="60"></rect><text><tspan x="10" y="20">Gear</tspan><tspan class="vg-sub" x="10" y="38">Zak: 8</tspan><tspan class="vg-sub" x="10" y="54">heads</tspan></text></g>
          <g class="vg-node green" transform="translate(1530 352)"><rect width="90" height="60"></rect><text><tspan x="10" y="18">Mode</tspan><tspan x="10" y="35">selector</tspan><tspan class="vg-sub" x="10" y="52">Zak: logits</tspan></text></g>
        </svg>
      </div>
    </div>
    <div class="module-compare">
      <div class="card">
        <p class="mini-title">Current SI ParkingModelCfg / WFMSt100xYoloCfg</p>
        <div class="module-flow">
          <div class="module-step green"><b>MIMOSTTransformer</b><small>Top-level module: <code>preprocess</code>, <code>input_adaptor</code>, <code>encoder</code>, <code>output_adaptor</code>. Radar is not enabled in the current <code>ParkingModelCfg</code> path.</small></div>
          <div class="module-step"><b>Preprocess</b><small>Inherited from <code>WFMSt100xYoloCfg</code> / <code>StPreprocessCfg</code>; images are the only tensor routed into <code>VideoSTAdaptor</code>.</small></div>
          <div class="module-step blue"><b>InputAdaptor(ModuleDict ordered by ADAPTOR_ORDER)</b><small>Concatenates all active adaptor outputs along token dimension. Images arrive from <code>VideoSTAdaptor</code>; every non-image source arrives from its own adaptor/tokenizer.</small></div>
          <div class="module-step"><b>RouteSTAdaptor</b><small>Route map tokens via <code>CNNRouteInputAdaptor</code> because downsampling is 64: NormZeroOne(128,256) -> strided Conv2d/GroupNorm/ReLU stack -> Flatten -> PositionalEncoding.</small></div>
          <div class="module-step"><b>IndicatorSTAdaptor</b><small>Indicator conditioning token from current indicator state; indicator dropout rate is 0.0 in the datamodule.</small></div>
          <div class="module-step"><b>SpeedSTAdaptor + SpeedLimitSTAdaptor + PoseSTAdaptor</b><small>Separate vehicle/context tokenizers. Parking enables NaN/inf speed-limit handling and uses <code>vehicle_frames=1</code>.</small></div>
          <div class="module-step"><b>CountrySTAdaptor + DrivingSideSTAdaptor + AutomationStateSTAdaptor</b><small>Separate context tokenizers inherited from the ST base and YOLO WFM config. Automation fills no-automation token when needed.</small></div>
          <div class="module-step yellow"><b>WaypointsSTAdaptor (always dropout)</b><small><code>WFMSt100xYoloCfg</code> sets <code>use_waypoints=True</code> and <code>always_dropout_waypoints=True</code>. It preserves the WFM token interface without conditioning on GT waypoints.</small></div>
          <div class="module-step yellow"><b>StepAndLaneInfoSTAdaptor</b><small>Not constructed in the current <code>WFMSt100xYoloCfg</code> parking path. Navigation is a variant/off adaptor unless <code>use_step_and_lane_info_adaptor</code> is enabled.</small></div>
          <div class="module-step"><b>GearDirectionSTAdaptor</b><small>Parking sets <code>use_gear_direction_adaptor=True</code>; gear is an active separate input token, not bundled with waypoints or parking mode.</small></div>
          <div class="module-step green"><b>ParkingModeSTAdaptor</b><small>Parking-specific active input: 2-class embedding over <code>PARKING_MODE</code>, expanded over the 6-frame context.</small></div>
          <div class="module-step"><b>VideoSTAdaptor</b><small>Vision encoder from <code>create_vision_encoder("vit:large")</code>, patch stem, qk_norm none, clipped SwiGLU, and camera positional handling. It only consumes image tensors.</small></div>
          <div class="module-step rust"><b>STTransformer</b><small><code>large</code>: token size 1536, 11 <code>STBlock</code>s, 16 heads, output norm. Checkpoint loader removes waypoint input weights when loading the YOLO WFM pretrain.</small></div>
          <div class="module-step yellow"><b>RadarInputAdaptor</b><small>Not active in this current config because <code>enable_radar_input</code> is false. If enabled, radar can be early-input or late-fusion depending on config.</small></div>
          <div class="module-step blue"><b>OutputAdaptor</b><small>Consumes ST context tokens, applies latent-action and/or behavior conditioning according to config, then cross-attends learned output queries.</small></div>
          <div class="module-step green"><b>Output heads</b><small>Active heads: <code>WaypointOutputHead</code> with delta waypoints, <code>IndicatorOutputHead</code>, <code>GearDirectionOutputHead</code>, <code>WaypointLogVarianceOutputHead</code>. Latent-action path is enabled by <code>w_latent_action=1.0</code>. Behavior control is a model-level branch gated by <code>${'${...enable_behavior_control}'}</code>; <code>parking_bc_cfg</code> resolves the gate to false for that train wrapper.</small></div>
        </div>
      </div>
      <div class="card">
        <p class="mini-title">Zak MCVPerceiver mcv_new_phase2x_wta</p>
        <div class="module-flow">
          <div class="module-step green"><b>MCVPerceiver</b><small>Top-level module: <code>stem</code>, optional bottleneck/heads, <code>input_adaptor</code>, <code>mcv_positional_encoding</code>, <code>mcv_encoder</code>, <code>driving_head</code>, optional label/reward/RL/radar heads.</small></div>
          <div class="module-step"><b>ViTStemWrapper</b><small>Because base config sets <code>STEM_NAME=vit</code>. Wraps <code>create_vision_encoder("vit:&lt;size&gt;")</code>; image batch is flattened to <code>[B*T*Cams,C,H,W]</code>, patch embedded, ViT-encoded, downsampled, and reshaped to <code>[B,T,S,D]</code>.</small></div>
          <div class="module-step yellow"><b>Variational/image/depth/dino/lidar heads</b><small>Inactive in inferred WTA base: <code>VARIATIONAL.ENABLED=False</code>, <code>IMAGE_AE=False</code>, <code>DEPTH=False</code>, <code>DINO=False</code>, <code>LIDAR=False</code>.</small></div>
          <div class="module-step blue"><b>MyModuleDict input_adapters</b><small>Constructed when egoposition/driving head is enabled. Emits named token groups consumed by positional encoding and MCV encoder.</small></div>
          <div class="module-step"><b>RouteCNNEncoderMission100x</b><small>Active route encoder: NormZeroOne(128,256) -> Conv2d/GroupNorm/ReLU downsampling stack -> Flatten -> Permute -> PositionalEncoding.</small></div>
          <div class="module-step green"><b>ParkingEncoder</b><small>Active parking input: <code>Embedding(parking_request)</code> + <code>Embedding(parking_direction)</code> + <code>MLP(parking_position_ui[:2]/30)</code> + <code>Embedding(stopping_type)</code> because PUDO is enabled.</small></div>
          <div class="module-step"><b>IndicatorAdaptor / GearAdaptor</b><small>Active indicator stick + indicator state + gear state tokenization. WTA outputs are per-waypoint for indicator and gear.</small></div>
          <div class="module-step"><b>VectorInputAdapter(speed) + ContinuousSpeedLimitAdaptor</b><small>WTA config sets <code>SPEED.PAST=5</code>, speed channels 64, normalization 17.777..., no symlog. Speed limit is continuous relative encoding with NaN/inf handling.</small></div>
          <div class="module-step"><b>CountryAdaptor + conditional context adaptors</b><small><code>COUNTRY_CODE.ENABLED=True</code> in <code>mcv_new_base0</code>. <code>DRIVING_SIDE</code>, automation, nav, radar, intrinsics, and pose are default-off or variant-only in the inferred WTA chain.</small></div>
          <div class="module-step rust"><b>ContinuousPositionalEncoding</b><small>Applies continuous time encoding and spatial camera encoding. Phase2x: <code>TEMPORAL_ENCODING_REF="first"</code>, <code>TEMPORAL_ENCODING_ALL_TOKENS=True</code>, max_t 3.4.</small></div>
          <div class="module-step rust"><b>MCVSpaceTimeEncoder</b><small>Active because <code>SPACE_TIME_FACTORIZED=True</code>: 11 layers, dim 1536, 16 heads, causal, qk_norm l2, clipped SwiGLU path. Concats conditioning tokens before image tokens; phase2x keeps conditioning tokens in the output.</small></div>
          <div class="module-step yellow"><b>World-model / label / reward / RL / radar modules</b><small>WTA BC path uses <code>driving_head</code>. Token reconstruction, label heads, reward, TwinQ RL, and radar encoder are optional/variant modules; <code>mcv_new_rl.yml</code> enables TwinQ separately.</small></div>
          <div class="module-step blue"><b>RegressionDrivingHead</b><small>Constructed with <code>one_step_ar=None</code> because phase2x disables one-step AR. <code>DRIVING_CROSS_ATTEND_PRESENT=True</code>, <code>multi_frame_train=True</code>, GELU head activation, bottleneck dim 256.</small></div>
          <div class="module-step green"><b>WTA output head bank</b><small><code>wta_num_heads=8</code>: eight ego-position MLP heads, eight indicator MLP heads, eight gear MLP heads, and one mode-classifier MLP. Outputs all heads during training and selected winner at inference.</small></div>
        </div>
      </div>
    </div>
    <table class="compare dense aligned">
      <tr><th>Implementation question</th><th>Current SI answer</th><th>Zak WTA answer</th></tr>
      <tr><td>Actual top-level class</td><td><code>MIMOSTTransformer</code>.</td><td><code>MCVPerceiver</code>.</td></tr>
      <tr><td>Image module</td><td><code>VideoSTAdaptor</code> wraps a Zoo ViT vision encoder built by <code>create_vision_encoder</code>.</td><td><code>ViTStemWrapper</code> wraps an exp-ai MCV-compatible ViT image encoder.</td></tr>
      <tr><td>Token merger</td><td><code>InputAdaptor</code> concatenates ordered adaptor outputs into one ST token tensor before the backbone.</td><td>Same conceptual block, but split: <code>MyModuleDict input_adapters</code> emits named token groups, <code>ContinuousPositionalEncoding</code> adds position/time, and <code>MCVSpaceTimeEncoder</code> performs the final condition-token merge internally.</td></tr>
      <tr><td>Backbone</td><td><code>STTransformer</code> with 11 blocks for <code>large</code>.</td><td>Same conceptual block, implemented as <code>MCVSpaceTimeEncoder</code> with 11 causal/factorized layers for <code>mcv_new_base0/phase2x</code>.</td></tr>
      <tr><td>Parking-specific module</td><td><code>ParkingModeSTAdaptor</code>: boolean parking-context token.</td><td><code>ParkingEncoder</code>: request + direction + UI position + PUDO/PARK type token.</td></tr>
      <tr><td>Multimodality</td><td>No WTA head. Behavior control is a conditioning token, not multiple output futures.</td><td><code>OutputAdaptor</code>-equivalent block is <code>RegressionDrivingHead</code>: learned output queries, 8 aligned WTA head banks, and a mode-selector query.</td></tr>
    </table>
    <h3>Output query-token breakdown</h3>
    <div class="callout book">
      <p><b>Important correction:</b> in Zak's WTA head, mode is not computed after the 8 trajectory heads as a function of their decoded outputs. It is computed in the output head from a separate learned classifier query token, in parallel with the waypoint query tokens. The resulting <code>mode_logits</code> then select which aligned head index <code>k</code> to use.</p>
    </div>
    <table class="compare dense aligned">
      <tr><th>Query/token family</th><th>Current SI <code>OutputAdaptor</code></th><th>Zak <code>RegressionDrivingHead</code></th></tr>
      <tr><td>Shared vocabulary for comparison</td><td><b>Encoder context tokens</b> are called <code>OUTPUT_TOKENS</code> / <code>tokens</code> in <code>OutputAdaptor</code>. <b>Learned output queries</b> are called <code>self.queries</code>. <b>Decoded output tokens</b> are the result of <code>cross_attention(self.queries, tokens)</code>.</td><td><b>Encoder context tokens</b> are called <code>encoded_mcv_tokens</code> or just <code>x</code> before the head cross-attention. <b>Learned output queries</b> are called <code>self.latents</code>. <b>Decoded output tokens</b> are also stored back into <code>x</code> after <code>xattend</code>.</td></tr>
      <tr><td>Context tokens consumed by the output module</td><td><code>OUTPUT_TOKENS</code> from <code>STTransformer</code>. Radar would only be concatenated/fused if separately enabled; it is not active in the current parking path. Latent-action conditioning adds a learned codebook vector to every context token before final output-query cross-attention.</td><td>Encoded tokens from <code>MCVSpaceTimeEncoder</code>. If behavior control is enabled, a behavior-codebook vector is added to every encoded token before the output latent cross-attention.</td></tr>
      <tr><td>Learned output queries</td><td><code>self.queries</code> is a learned parameter with one contiguous query slice per output head. The final queries cross-attend to the fused context tokens, and slices are then passed to each output head in configured order.</td><td><code>self.latents</code> is a learned parameter. The first <code>n</code> latents are waypoint query tokens. Conditional extra latents are appended for dedicated indicator/gear tokens, parking output, curvature, waypoint variance, and WTA classifier.</td></tr>
      <tr><td>Parking SI active query slices</td><td>With the current parking config path: waypoint head gets <code>future_frames - 1</code> queries because <code>enable_offset=False</code>; indicator gets <code>1</code>; gear gets <code>1</code>; waypoint log-variance gets <code>future_frames - 1</code> when log-likelihood loss enables auxiliary variance. With the default 11-frame train base that is <code>10 + 1 + 1 + 10 = 22</code> final output queries.</td><td>Not an <code>OutputAdaptor</code> class. Zak's WTA path uses <code>RegressionDrivingHead</code> latents instead of SI output-head slices.</td></tr>
      <tr><td>Zak WTA active query slices</td><td>No WTA mode queries in SI parking.</td><td>Phase2x WTA uses the first <code>n</code> waypoint latents for ego trajectory and, because indicator/gear are per-waypoint in this config, those same waypoint tokens also feed every indicator and gear head. One extra <code>wta_classifier_index</code> latent feeds <code>mode_classifier</code>. Dedicated indicator/gear query tokens only exist when <code>indicator_per_waypoint=False</code> or <code>gear_per_waypoint=False</code>.</td></tr>
      <tr><td>Where mode/behavior lives</td><td>Behavior control is a conditioning vector added to context tokens before final query cross-attention. It is not a per-head selector and it is not one of the final waypoint/indicator/gear queries.</td><td>Mode is a classifier-query output inside <code>RegressionDrivingHead</code>. It produces 8 logits over the aligned WTA head banks. It is not a ninth trajectory head and does not consume decoded 8-head outputs.</td></tr>
      <tr><td>Final selection</td><td>All final heads are decoded directly. There is no WTA winner selection in current SI parking.</td><td>Training emits <code>egoposition_all_heads</code>, <code>indicator_all_heads</code>, <code>gear_all_heads</code>, and <code>mode_logits</code>. Inference chooses <code>winner = argmax(mode_logits)</code> or EMA-smoothed logits, then returns ego/indicator/gear from the same head index.</td></tr>
    </table>
    <pre><code># Current SI OutputAdaptor, simplified with shared names
# "encoder_context_tokens" are produced before OutputAdaptor:
#   image/route/scalar/parking adaptors -> InputAdaptor concat -> STTransformer
# They are data-dependent encoder tokens, not learned output slots.
encoder_context_tokens = outputs[OUTPUT_TOKENS]        # SI code name: tokens
if radar_late_fusion:
    encoder_context_tokens = fuse(encoder_context_tokens, outputs[RADAR_TOKENS])

if enable_behavior_control:
    behavior_token = BehaviorLabelEncoder(label_or_inference_default)
    # behavior is conditioning on every context token, not an output query
    encoder_context_tokens = encoder_context_tokens + behavior_token[:, None, :]

# "learned_output_queries" are learned parameters owned by OutputAdaptor.
# They do not come from data; they are slots that cross-attend into encoder_context_tokens.
learned_output_queries = [                            # SI code name: self.queries
    waypoint_q_0, ..., waypoint_q_{future_frames-2},
    indicator_q,
    gear_q,
    waypoint_log_variance_q_0, ..., waypoint_log_variance_q_{future_frames-2},
]
decoded_output_tokens = cross_attention(
    query=learned_output_queries,
    key_value=encoder_context_tokens,
)
waypoints = WaypointOutputHead(decoded_output_tokens[waypoint_slice])
indicator = IndicatorOutputHead(decoded_output_tokens[indicator_slice])
gear = GearDirectionOutputHead(decoded_output_tokens[gear_slice])
variance = WaypointLogVarianceOutputHead(decoded_output_tokens[variance_slice])</code></pre>
    <pre><code># Zak OutputAdaptor equivalent, simplified with the same shared names
# Implementation name: RegressionDrivingHead
#
# "encoder_context_tokens" are produced before the output block:
#   ViT image tokens + xs_dict condition tokens -> ContinuousPositionalEncoding
#   -> MCVSpaceTimeEncoder
# They are data-dependent encoder tokens, same role as SI encoder_context_tokens.
encoder_context_tokens = MCVSpaceTimeEncoder(image_tokens, xs_dict)  # Zak code name: encoded_mcv_tokens / x

# "learned_output_queries" are learned parameters owned by RegressionDrivingHead.
# Same role as SI self.queries; Zak calls them self.latents.
learned_output_queries = [                            # Zak code name: self.latents
    wp_q_0, ..., wp_q_{n-1},
    maybe_parking_q,
    maybe_curvature_q,
    maybe_waypoint_variance_q_0, ..., maybe_waypoint_variance_q_{n-1},
    wta_classifier_q,
]
decoded_output_tokens = cross_attention(              # Zak code name: x = self.xattend(...)
    query=learned_output_queries,
    key_value=encoder_context_tokens,
)

wp_tokens = decoded_output_tokens[:, :n]
all_ego[k] = egoposition_heads[k](wp_tokens)      # k = 0..7
all_ind[k] = indicator_heads[k](wp_tokens)        # per-waypoint in phase2x WTA
all_gear[k] = gear_heads[k](wp_tokens)            # per-waypoint in phase2x WTA

classifier_token = decoded_output_tokens[:, wta_classifier_index]
mode_logits = mode_classifier(classifier_token)
winner = argmax(mode_logits)
output = {
    "egoposition": all_ego[winner],
    "indicator": all_ind[winner],
    "gear": all_gear[winner],
}</code></pre>
    <h3>Specific implementation answers</h3>
    <table class="compare dense aligned">
      <tr><th>Question</th><th>Answer</th><th>Code evidence</th></tr>
      <tr><td><code>MCVSpaceTimeEncoder</code> vs <code>STTransformer</code></td><td><code>STTransformer</code> is only the backbone after SI <code>InputAdaptor</code> has already made one <code>[B,T,N,D]</code> token tensor. Its <code>STBlock</code> does non-causal spatial attention within each time, causal temporal attention per token slot, then MLP. <code>MCVSpaceTimeEncoder</code> is both token merger and backbone: it receives image tokens plus an <code>xs_dict</code> of named condition-token groups, expands condition tokens over time, concatenates condition tokens before image tokens, runs 11 causal space-time blocks, and in phase2x keeps condition tokens in the output.</td><td>SI ${link(gh.cur, "wayve/ai/zoo/st/st_transformer.py", 10, "STTransformer")}; SI block ${link(gh.cur, "wayve/ai/zoo/attention/blocks.py", 127, "Zoo STBlock")}; Zak ${link(gh.zak, "wayve/ai/experimental/models/mcv_perceiver.py", 2472, "MCVSpaceTimeEncoder")}.</td></tr>
      <tr><td>Mode classifier input and structure</td><td>The mode classifier is inside <code>RegressionDrivingHead</code>. The head first cross-attends learned output latents into encoded MCV tokens. WTA adds one extra classifier latent at <code>wta_classifier_index</code>; after cross-attention, <code>x[:, wta_classifier_index]</code> feeds <code>mode_classifier</code>. With phase2x WTA settings, its MLP is <code>Linear(1536,256) -> GELU -> Linear(256,8)</code>.</td><td>${link(gh.zak, "wayve/ai/experimental/models/mcv_perceiver.py", 3203, "learned latents")}; ${link(gh.zak, "wayve/ai/experimental/models/mcv_perceiver.py", 3248, "WTA head construction")}; ${link(gh.zak, "wayve/ai/experimental/configs/mcv_new_phase2x_wta.yml", 4, "head bottleneck/activation")}.</td></tr>
      <tr><td>How mode classifier is trained</td><td><code>AnnealedWTALoss</code> computes per-head route score from weighted ego-position, cross-track, indicator, and gear losses. It builds soft aWTA weights <code>softmax(-score/tau)</code> and an oracle <code>argmin(score)</code>. This config sets <code>CLASSIFIER_SOFT_TARGET=True</code>, so classifier loss is soft cross entropy: <code>-(aWTA_weight * log_softmax(mode_logits)).sum</code>, ramped across context frames and weighted by <code>EGOPOSITION_WTA_CLASSIFIER</code>.</td><td>${link(gh.zak, "wayve/ai/experimental/losses_metrics/common.py", 1816, "AnnealedWTALoss")}; ${link(gh.zak, "wayve/ai/experimental/losses_metrics/common.py", 2149, "aWTA weights/oracle")}; ${link(gh.zak, "wayve/ai/experimental/losses_metrics/common.py", 2201, "classifier loss")}.</td></tr>
      <tr><td>Are the 8 heads different weights?</td><td>Yes. WTA creates separate <code>ModuleList</code>s: eight ego MLPs, eight indicator MLPs, and eight gear MLPs. They do not share final-head weights. Training sends gradients to all heads through the soft aWTA distribution early in training; as temperature anneals, gradient concentrates on the best matching head for each sample/frame. Consistency losses keep a head identity temporally coherent instead of letting heads swap meaning every frame.</td><td>${link(gh.zak, "wayve/ai/experimental/models/mcv_perceiver.py", 3248, "egoposition_heads / indicator_heads / gear_heads")}; ${link(gh.zak, "wayve/ai/experimental/losses_metrics/common.py", 2155, "soft WTA routing")}; ${link(gh.zak, "wayve/ai/experimental/losses_metrics/common.py", 2211, "consistency losses")}.</td></tr>
      <tr><td>What is SI behavior-control <code>latent_action_module</code>?</td><td>For behavior control, it is an internal helper used by <code>BehaviorLabelCalculator</code> to create behavior-unconditioned candidate futures. During training, if no behavior label is supplied and GT waypoints exist, it predicts latent-action logits, samples top-k latent-action embeddings, decodes top-k unconditioned waypoint futures, and computes the GT trajectory's speed percentile as <code>behavior_label</code>. That label is quantized by <code>BehaviorLabelEncoder</code> into a learned behavior token, which is added to all output tokens.</td><td>${link(gh.cur, "wayve/ai/zoo/outputs/behavior_control.py", 10, "BehaviorLabelCalculator")}; ${link(gh.cur, "wayve/ai/zoo/outputs/latent_action_module.py", 24, "LatentActionModule")}; ${link(gh.cur, "wayve/ai/zoo/outputs/output_adaptor.py", 504, "behavior conditioning")}.</td></tr>
      <tr><td>Latent action and behavior control at inference</td><td>In the model architecture, latent action and behavior control are orthogonal conditioning paths. <code>ParkingOutputAdaptorCfg</code> enables latent action from <code>w_latent_action=1.0</code> and defines behavior control as <code>${'${...enable_behavior_control}'}</code>. If behavior control is enabled by the parent config, inference uses the provided/default behavior label to add a behavior token; the <code>parking_bc_cfg</code> train wrapper resolves that gate to false.</td><td>Config ${link(gh.cur, "wayve/ai/si/configs/parking/parking_config.py", 186, "behavior gate")}; latent loss ${link(gh.cur, "wayve/ai/si/configs/parking/parking_config.py", 210, "w_latent_action=1")}; conditioning code ${link(gh.cur, "wayve/ai/zoo/outputs/output_adaptor.py", 465, "behavior and latent conditioning")}.</td></tr>
    </table>
    <pre><code># Zak WTA classifier training, simplified
per_head_score = (
    ego_weight * ego_loss_per_head
  + cross_track_weight * cross_track_loss_per_head
  + indicator_weight * indicator_loss_per_head
  + gear_weight * gear_loss_per_head
)
awta_weight = softmax(-stop_grad(per_head_score) / tau)
oracle_head = argmin(stop_grad(per_head_score))

# phase2x_wta has CLASSIFIER_SOFT_TARGET=True:
mode_classifier_loss = -sum(awta_weight * log_softmax(mode_logits))</code></pre>
    <h3>Latent-action grid and behavior control</h3>
    <table class="compare dense aligned">
      <tr><th>Question</th><th>Detailed answer</th><th>Code evidence</th></tr>
      <tr><td>Does SI's latent-action module have a grid?</td><td>Yes, but the grid lives in <code>ActionsDiscretizer</code>, not inside the embedding module itself. Parking uses <code>timesteps=(2.0,)</code>, <code>n=(31,31)</code>, <code>space="waypoints"</code>, <code>grid_shape="square"</code>, <code>mapping="radial-exponent"</code>, <code>rad_exp=1.7</code>, and <code>max_speed=36.0</code>. That creates <b>961 latent-action cells</b>. Each cell has a latent-action logit and a row in the learned latent-action codebook.</td><td>Grid config ${link(gh.cur, "wayve/ai/si/config.py", 1974, "ActionsDiscretizerCfg")}; implementation ${link(gh.cur, "wayve/ai/zoo/autoregressive.py", 386, "ActionsDiscretizer")}.</td></tr>
      <tr><td>What does the grid represent?</td><td>It bins the final future waypoint. For the 2-second parking config, raw <code>(x,y)</code> is scaled by roughly <code>[72m,36m]</code>, mapped into a radial-exponent polar-like coordinate system, centered laterally but not longitudinally, clamped to <code>[0,1]</code>, rounded to a 31x31 grid location, and flattened as <code>index = row * 31 + col</code>. The encoder also computes a residual, but the behavior-control path stores only the discrete latent index as <code>PRIVILEGED_LATENT_ACTION</code>.</td><td>Mapping ${link(gh.cur, "wayve/ai/zoo/autoregressive.py", 671, "inputs_to_indices")}; parking output adaptor ${link(gh.cur, "wayve/ai/si/configs/parking/parking_config.py", 404, "ParkingOutputAdaptorCfg")}.</td></tr>
      <tr><td>How is it used for behavior control during training?</td><td>When GT waypoints exist, <code>OutputAdaptor</code> encodes the final GT waypoint into the grid and writes <code>PRIVILEGED_LATENT_ACTION</code>. <code>BehaviorLabelCalculator</code> then runs a behavior-unconditioned latent-action branch: it predicts latent-action logits from fused output tokens, uses the privileged action embedding while forming behavior-unconditioned outputs, samples the top-k predicted latent actions, decodes those top-k embeddings into candidate waypoint futures, and compares their mean speeds to the GT trajectory. The GT speed percentile among those candidates becomes <code>BEHAVIOR_LABEL</code>.</td><td>${link(gh.cur, "wayve/ai/zoo/outputs/output_adaptor.py", 488, "target waypoint encoding")}; ${link(gh.cur, "wayve/ai/zoo/outputs/behavior_control.py", 35, "BehaviorLabelCalculator forward")}; ${link(gh.cur, "wayve/ai/zoo/outputs/behavior_control.py", 111, "top-k latent samples")}.</td></tr>
      <tr><td>Is latent action used at parking inference?</td><td>Yes. The current parking loss config enables latent action. At train time the latent id is privileged from GT waypoints; at inference the module predicts latent-action logits and uses the argmax codebook embedding as the conditioning token. Behavior control is the disabled path here.</td><td>Config ${link(gh.cur, "wayve/ai/si/configs/parking/parking_config.py", 188, "enable_latent_action from loss")}; losses ${link(gh.cur, "wayve/ai/si/configs/parking/parking_config.py", 210, "w_latent_action=1")}; inference branch ${link(gh.cur, "wayve/ai/zoo/outputs/latent_action_module.py", 48, "argmax latent action")}.</td></tr>
    </table>
    <pre><code># SI parking behavior-control label generation, simplified
target_xy = inputs[POLICY_WAYPOINTS][..., -1, :2]
if reverse_gear:
    target_xy[..., 0] *= -1

privileged_index, residual = ActionsDiscretizer(
    timesteps=(2.0,), n=(31,31), mapping="radial-exponent", rad_exp=1.7
).encode(target_xy)
outputs[PRIVILEGED_LATENT_ACTION] = privileged_index

latent_logits = latent_action_head(latent_action_query attends fused_tokens)
gt_latent_token = latent_action_codebook(privileged_index)
behavior_unconditioned_tokens = fused_tokens + gt_latent_token

topk_indices = topk(latent_logits, k=10)
topk_tokens = latent_action_codebook(topk_indices).detach()
topk_waypoints = output_heads(cross_attend(queries, fused_tokens + topk_tokens))
behavior_label = percentile(mean_speed(gt_waypoints), mean_speed(topk_waypoints), topk_logits)</code></pre>
    <h3>Why Zak can load the same WFM checkpoint</h3>
    <table class="compare dense aligned">
      <tr><th>Topic</th><th>Detailed answer</th><th>Code evidence</th></tr>
      <tr><td>Same pretrain?</td><td>Zak's config points at the same Dec WFM checkpoint family, but the load is <b>not</b> a strict whole-model restore. It is a remapped, partial initialization into <code>MCVPerceiver</code>.</td><td>Loader ${link(gh.zak, "wayve/ai/experimental/models/mcv_perceiver.py", 193, "load_wfm_pretrained_weights")}; checkpoint config ${link(gh.zak, "wayve/ai/experimental/configs/mcv_new_base.yml", 1, "WFM_CHECKPOINT")}.</td></tr>
      <tr><td>How can this work with <code>MCVSpaceTimeEncoder</code>?</td><td>The loader rewrites WFM key prefixes into MCV names: WFM video feature extractor becomes <code>stem.vit_encoder</code>, WFM video positional/time encodings become <code>mcv_positional_encoding</code>, WFM route tokenizer becomes <code>input_adaptor.route.layers</code>, and WFM <code>encoder.*</code> becomes <code>mcv_encoder.transformer.*</code>. Matching tensor names and shapes load; unmatched tensors stay newly initialized.</td><td>${link(gh.zak, "wayve/ai/experimental/models/mcv_perceiver.py", 193, "key remap comments")}; ${link(gh.zak, "wayve/ai/experimental/models/mcv_perceiver.py", 243, "encoder prefix remap")}.</td></tr>
      <tr><td>Is the encoder really different?</td><td>Architecturally yes: SI's <code>STTransformer</code> receives one already-concatenated token tensor from <code>InputAdaptor</code>; Zak's <code>MCVSpaceTimeEncoder</code> owns more of the token merge, condition-token expansion, positional encoding contract, and output-token policy. But the inner transformer weights can still be compatible when the layer implementation, dimension, heads, qk norm, and MLP settings align. The load function then skips/adapts only the tensors that do not align.</td><td>MCV encoder ${link(gh.zak, "wayve/ai/experimental/models/mcv_perceiver.py", 2472, "MCVSpaceTimeEncoder")}; shape handling ${link(gh.zak, "wayve/ai/experimental/models/mcv_perceiver.py", 252, "shape mismatch handling")}.</td></tr>
      <tr><td>What is random or adapted?</td><td>New modules such as <code>ParkingEncoder</code>, WTA ego/indicator/gear heads, mode classifier, behavior codebook, and any unmatched input adaptors are initialized from the new model code. Positional encodings and patch-stem kernels are adapted where the loader has explicit logic; other shape mismatches are skipped. This means Zak gets WFM visual/route/backbone initialization where compatible, then trains the new multimodal/PUDO pieces from scratch.</td><td>${link(gh.zak, "wayve/ai/experimental/models/mcv_perceiver.py", 259, "patch-stem adaptation")}; ${link(gh.zak, "wayve/ai/experimental/models/mcv_perceiver.py", 291, "strict=False load")}.</td></tr>
    </table>
    <pre><code># Zak WFM preload, simplified
for key, tensor in wfm_state_dict:
    if key.startswith("input_adaptor.adaptors.video.feature_extractor."):
        new_key = "stem.vit_encoder." + suffix(key)
    elif key.startswith("input_adaptor.adaptors.route.tokenise."):
        new_key = "input_adaptor.route.layers." + suffix(key)
    elif key.startswith("encoder."):
        new_key = "mcv_encoder.transformer." + suffix(key)

    if shape_matches(new_key, tensor):
        remapped_state_dict[new_key] = tensor
    elif is_known_positional_or_patch_stem_case(new_key):
        remapped_state_dict[new_key] = adapt(tensor)
    else:
        skip(tensor)

model.load_state_dict(remapped_state_dict, strict=False)</code></pre>
    <h3>Eight heads, annealing, and consistency</h3>
    <table class="compare dense aligned">
      <tr><th>Question</th><th>Detailed answer</th><th>Code evidence</th></tr>
      <tr><td>Are there eight separate heads?</td><td>Functionally yes, but the code implements them as aligned <code>ModuleList</code>s rather than eight wrapper objects. Head index <code>k</code> means: <code>egoposition_heads[k]</code>, <code>indicator_heads[k]</code>, and <code>gear_heads[k]</code>. These are separate MLPs with separate weights. The mode classifier predicts one index <code>k</code>; inference uses that same index to select the ego trajectory, indicator logits, and gear logits together.</td><td>${link(gh.zak, "wayve/ai/experimental/models/mcv_perceiver.py", 3248, "WTA ModuleLists")}; ${link(gh.zak, "wayve/ai/experimental/models/mcv_perceiver.py", 3380, "winner selection")}.</td></tr>
      <tr><td>What is the mode classifier?</td><td>WTA adds one extra learned output latent token, <code>wta_classifier_index</code>. After latent cross-attention, that token is passed through <code>mode_classifier</code>. With the inferred WTA settings it is a small MLP: <code>Linear(1536,256) -> GELU -> Linear(256,8)</code>. Its output is not an independent behavior label; it is a distribution over the eight aligned WTA head indices.</td><td>${link(gh.zak, "wayve/ai/experimental/models/mcv_perceiver.py", 3203, "WTA classifier latent")}; ${link(gh.zak, "wayve/ai/experimental/models/mcv_perceiver.py", 3256, "mode_classifier")}; ${link(gh.zak, "wayve/ai/experimental/configs/mcv_new_phase2x_wta.yml", 4, "head bottleneck config")}.</td></tr>
      <tr><td>How does annealing concentrate gradients?</td><td>For every batch item and context frame, the WTA loss computes each head's route score from ego, cross-track, indicator, and gear losses. It then computes <code>softmax(-score/tau)</code> with <code>score.detach()</code>. Early in training <code>tau</code> is high, so multiple heads receive non-trivial weighted gradients. As <code>tau</code> exponentially decays, the best lower-loss head receives almost all the weight. Because the routing weights are detached, the model is trained through each head's actual loss, not by backpropagating through the winner-selection score itself.</td><td>${link(gh.zak, "wayve/ai/experimental/losses_metrics/common.py", 1858, "temperature schedule")}; ${link(gh.zak, "wayve/ai/experimental/losses_metrics/common.py", 2144, "route score")}; ${link(gh.zak, "wayve/ai/experimental/losses_metrics/common.py", 2155, "soft WTA weights")}.</td></tr>
      <tr><td>How is the classifier trained?</td><td>With <code>CLASSIFIER_SOFT_TARGET=True</code>, the mode classifier is trained to match the same annealed WTA distribution used to weight the regression/discrete losses. Early, this gives soft targets across plausible heads. Late, as <code>tau</code> gets small, the target becomes close to a one-hot oracle head. If soft targets are disabled, the code falls back to cross entropy against <code>argmin(route_score)</code>.</td><td>${link(gh.zak, "wayve/ai/experimental/losses_metrics/common.py", 2192, "classifier comments")}; ${link(gh.zak, "wayve/ai/experimental/losses_metrics/common.py", 2201, "soft target classifier loss")}.</td></tr>
      <tr><td>How do consistency losses reduce head swapping?</td><td>Multi-frame training emits all heads for adjacent context frames. The consistency loss aligns frame <code>t+1</code> predictions into frame <code>t</code> using <code>relpose_multiframe</code>, then compares same-index predictions: head <code>k</code> at frame <code>t</code> should agree with head <code>k</code> at frame <code>t+1</code> over overlapping future waypoints. Indicator and gear consistency use KL to the detached next-frame class distribution. This discourages a mode from being called "head 2" in one frame and "head 5" in the next, because same-index heads are pulled toward temporal self-consistency.</td><td>${link(gh.zak, "wayve/ai/experimental/losses_metrics/common.py", 2211, "ego consistency")}; ${link(gh.zak, "wayve/ai/experimental/losses_metrics/common.py", 2240, "indicator/gear consistency")}.</td></tr>
    </table>
    <pre><code># Zak WTA forward and loss, simplified
# Forward: each mode index k has independent ego/indicator/gear MLPs.
all_ego[k]  = egoposition_heads[k](waypoint_tokens)   # [B,T,n,2]
all_ind[k]  = indicator_heads[k](waypoint_tokens)     # [B,T,n,C_ind]
all_gear[k] = gear_heads[k](waypoint_tokens)          # [B,T,n,3]
mode_logits = mode_classifier(classifier_token)       # [B,T,8]

# Loss routing: one route score per sample, frame, and head.
route_score[k] = 20 * ego_loss[k] + 5 * cross_track[k] + 2 * indicator[k] + 2 * gear[k]
tau = tau_init * (1 / tau_final_div) ** training_progress
wta_weight[k] = softmax(-stop_grad(route_score[k]) / tau)

loss = sum_k wta_weight[k] * (
    20 * ego_loss[k] + 5 * cross_track[k] + 2 * indicator[k] + 2 * gear[k]
)
classifier_loss = cross_entropy_soft_target(mode_logits, target=wta_weight)

# Consistency: compare the same head id across adjacent presents.
next_in_current_frame = se2_transform(stop_grad(all_ego[:, t+1, k]), relpose[t])
ego_consistency[k] = smooth_l1(all_ego[:, t, k, 1:], next_in_current_frame[:, :-1])
indicator_consistency[k] = KL(log_softmax(ind[:, t, k, 1:]), stop_grad(softmax(ind[:, t+1, k, :-1])))</code></pre>
    <pre><code># SI behavior-control path, simplified
if training and BEHAVIOR_LABEL not in inputs:
    latent_logits = behavior_unconditioned_latent_action_module(tokens)
    top_k_actions = topk(latent_logits)
    top_k_waypoints = decode_with_latent_action_embeddings(tokens, top_k_actions)
    behavior_label = percentile(gt_waypoint_speed, top_k_waypoint_speeds)

if inference and BEHAVIOR_LABEL not in inputs:
    behavior_label = inference_behavior_control_input

behavior_token = BehaviorLabelEncoder(behavior_label)
tokens = tokens + behavior_token</code></pre>
    <p class="src">Sources: SI builder ${link(gh.cur, "wayve/ai/zoo/st/models.py", 161, "build_space_time_model")}, SI InputAdaptor ${link(gh.cur, "wayve/ai/zoo/st/input_adaptors/_input_adaptor.py", 68, "InputAdaptor")}, SI VideoSTAdaptor ${link(gh.cur, "wayve/ai/zoo/st/input_adaptors/video.py", 14, "VideoSTAdaptor")}, SI output heads ${link(gh.cur, "wayve/ai/zoo/outputs/output_adaptor.py", 45, "OutputAdaptor")}; Zak builder ${link(gh.zak, "wayve/ai/experimental/models/mcv_perceiver.py", 391, "make_mcv_perceiver")}, Zak stem ${link(gh.zak, "wayve/ai/experimental/models/mcv_perceiver.py", 329, "ViTStemWrapper")}, Zak MCV encoder ${link(gh.zak, "wayve/ai/experimental/models/mcv_perceiver.py", 2472, "MCVSpaceTimeEncoder")}, Zak WTA head ${link(gh.zak, "wayve/ai/experimental/models/mcv_perceiver.py", 3096, "RegressionDrivingHead")}.</p>
  `,
});
