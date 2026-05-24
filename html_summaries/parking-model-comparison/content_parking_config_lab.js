window.REPORT_SECTIONS = window.REPORT_SECTIONS || [];
window.REPORT_AFTER_RENDER = window.REPORT_AFTER_RENDER || {};

window.REPORT_SECTIONS.push({
  id: "parkingconfiglab",
  title: "Parking Config Lab",
  html: `
    <style>
      .pcl-wrap { display: grid; grid-template-columns: 390px minmax(0, 1fr); gap: 18px; align-items: start; }
      .pcl-panel {
        background: #fffdf8;
        border: 1px solid #c5cec3;
        box-shadow: var(--shadow);
        padding: 14px;
      }
      .pcl-controls { position: sticky; top: 16px; max-height: calc(100vh - 32px); overflow: auto; }
      .pcl-group { border-top: 1px solid #d6ded4; padding-top: 12px; margin-top: 12px; }
      .pcl-group:first-child { border-top: 0; padding-top: 0; margin-top: 0; }
      .pcl-group-title {
        color: #9b5b52;
        display: block;
        font-family: "IBM Plex Mono", ui-monospace, monospace;
        font-size: 12px;
        font-weight: 800;
        margin-bottom: 9px;
        text-transform: uppercase;
      }
      .pcl-control {
        display: grid;
        grid-template-columns: minmax(0, 1fr) auto;
        gap: 10px;
        min-height: 42px;
        padding: 7px 0;
        border-bottom: 1px solid #eef2ec;
      }
      .pcl-control:last-child { border-bottom: 0; }
      .pcl-control label { color: #14231b; font-size: 13px; font-weight: 800; }
      .pcl-control small { color: #68726b; display: block; font-size: 12px; font-weight: 600; margin-top: 2px; }
      .pcl-control input[type="number"] {
        width: 82px;
        border: 1px solid #aebbae;
        background: #fbfff8;
        color: #202823;
        font: 700 13px "IBM Plex Mono", ui-monospace, monospace;
        padding: 5px 6px;
      }
      .pcl-control input[type="checkbox"] { width: 20px; height: 20px; align-self: center; accent-color: #3f7a5f; }
      .pcl-actions { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 12px; }
      .pcl-actions button {
        background: #eef7f1;
        border: 1px solid #8fa89a;
        color: #13261e;
        cursor: pointer;
        font: 800 12px "IBM Plex Mono", ui-monospace, monospace;
        padding: 8px 10px;
      }
      .pcl-actions button:hover { background: #fffdf8; }
      .pcl-summary-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; margin-bottom: 14px; }
      .pcl-kpi {
        background: #fffdf8;
        border: 1px solid #c5cec3;
        border-top: 5px solid #5f8fa7;
        padding: 12px;
        min-height: 105px;
      }
      .pcl-kpi.green { border-top-color: #3f7a5f; }
      .pcl-kpi.yellow { border-top-color: #b79a54; }
      .pcl-kpi.rust { border-top-color: #b66b64; }
      .pcl-kpi.purple { border-top-color: #8b86b5; }
      .pcl-kpi span {
        color: #68726b;
        display: block;
        font-family: "IBM Plex Mono", ui-monospace, monospace;
        font-size: 11px;
        font-weight: 800;
        text-transform: uppercase;
      }
      .pcl-kpi b { color: #13261e; display: block; font-size: 19px; line-height: 1.15; margin: 7px 0; }
      .pcl-kpi small { color: #526159; font-size: 12px; }
      .pcl-diagram {
        background: #eef3ec;
        border: 1px dashed #aebbae;
        margin: 12px 0 16px;
        padding: 14px;
      }
      .pcl-step-row { display: grid; gap: 7px; grid-template-columns: repeat(6, minmax(100px, 1fr)); align-items: stretch; }
      .pcl-step {
        background: #ffffff;
        border: 1px solid #aebbae;
        border-left: 5px solid #5f8fa7;
        min-height: 86px;
        padding: 9px;
        position: relative;
      }
      .pcl-step.off { opacity: .42; filter: grayscale(.4); }
      .pcl-step.warn { border-left-color: #b79a54; }
      .pcl-step.hot { border-left-color: #b66b64; }
      .pcl-step.good { border-left-color: #3f7a5f; }
      .pcl-step:not(:last-child)::after {
        color: #a8605a;
        content: ">";
        font-family: "IBM Plex Mono", ui-monospace, monospace;
        font-size: 18px;
        font-weight: 800;
        position: absolute;
        right: -14px;
        top: 38%;
        z-index: 1;
      }
      .pcl-step b { color: #13261e; display: block; font-size: 13px; }
      .pcl-step small { color: #68726b; display: block; font-size: 11px; margin-top: 4px; }
      .pcl-cols { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; }
      .pcl-list {
        background: #fffdf8;
        border: 1px solid #c5cec3;
        padding: 12px;
      }
      .pcl-list b { color: #13261e; display: block; margin-bottom: 8px; }
      .pcl-list ul { margin: 0; padding-left: 18px; }
      .pcl-list li { font-size: 13px; margin: 5px 0; }
      .pcl-chip-row { display: flex; flex-wrap: wrap; gap: 6px; }
      .pcl-chip {
        background: #e9efe7;
        border: 1px solid #cbd8cc;
        color: #0d3726;
        font-family: "IBM Plex Mono", ui-monospace, monospace;
        font-size: 12px;
        font-weight: 800;
        padding: 4px 7px;
      }
      .pcl-chip.off { background: #f5f1dc; border-style: dashed; color: #766b42; }
      .pcl-code {
        background: #293a32;
        color: #f2f7ef;
        font-family: "IBM Plex Mono", ui-monospace, monospace;
        font-size: 12px;
        line-height: 1.5;
        overflow: auto;
        padding: 12px;
        white-space: pre;
      }
      .pcl-alert {
        border-left: 7px solid #b79a54;
        background: #fffdf8;
        border-top: 1px solid #c5cec3;
        border-right: 1px solid #c5cec3;
        border-bottom: 1px solid #c5cec3;
        margin: 12px 0;
        padding: 12px;
      }
      .pcl-alert.error { border-left-color: #b66b64; }
      .pcl-alert.good { border-left-color: #3f7a5f; }

      .pcl-stage-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; margin-top: 12px; }
      .pcl-stage-card {
        background: #fffdf8;
        border: 1px solid #c5cec3;
        border-left: 6px solid #5f8fa7;
        padding: 12px;
        min-height: 170px;
      }
      .pcl-stage-card.off { opacity: .46; filter: grayscale(.35); }
      .pcl-stage-card.good { border-left-color: #3f7a5f; }
      .pcl-stage-card.warn { border-left-color: #b79a54; }
      .pcl-stage-card.hot { border-left-color: #b66b64; }
      .pcl-stage-card.purple { border-left-color: #8b86b5; }
      .pcl-stage-card small {
        color: #68726b;
        display: block;
        font-family: "IBM Plex Mono", ui-monospace, monospace;
        font-size: 11px;
        font-weight: 800;
        margin-bottom: 6px;
        text-transform: uppercase;
      }
      .pcl-stage-card b { color: #13261e; display: block; font-size: 15px; margin-bottom: 7px; }
      .pcl-stage-card p { color: #4f5d55; font-size: 13px; margin: 0 0 8px; }
      .pcl-stage-card ul { margin: 0; padding-left: 18px; }
      .pcl-stage-card li { font-size: 12px; margin: 4px 0; }
      .pcl-stage-card code { font-size: 11px; }
      .pcl-scenario-toolbar { display: flex; flex-wrap: wrap; gap: 8px; margin: 10px 0 12px; }
      .pcl-scenario-toolbar button {
        background: #eef7f1;
        border: 1px solid #8fa89a;
        color: #13261e;
        cursor: pointer;
        font: 800 12px "IBM Plex Mono", ui-monospace, monospace;
        padding: 8px 10px;
      }
      .pcl-scenario-toolbar button.active { background: #fffdf8; border-color: #a8605a; box-shadow: 0 6px 14px rgba(37,48,41,.08); }
      .pcl-scenario-layout { display: grid; grid-template-columns: minmax(0, 1.2fr) minmax(280px, .8fr); gap: 14px; align-items: start; }
      .pcl-chart-wrap { background: #fffdf8; border: 1px solid #c5cec3; padding: 10px; overflow: auto; }
      .pcl-chart { min-width: 740px; width: 100%; height: auto; display: block; }
      .pcl-chart .axis { stroke: #8da096; stroke-width: 1; }
      .pcl-chart .grid { stroke: #d6ded4; stroke-width: 1; }
      .pcl-chart .speed-original { fill: none; stroke: #6f9db2; stroke-width: 3; }
      .pcl-chart .speed-modified { fill: none; stroke: #b66b64; stroke-width: 3; }
      .pcl-chart .gear-original { fill: none; stroke: #3f7a5f; stroke-width: 3; stroke-linejoin: round; }
      .pcl-chart .gear-modified { fill: none; stroke: #8b86b5; stroke-width: 3; stroke-linejoin: round; }
      .pcl-chart .chart-label { font-size: 12px; }
      .pcl-chart .gear-state { fill: #fffdf8; stroke: #b8c5ba; stroke-width: 1; }
      .pcl-chart .gear-state-text { font-size: 10px; }
      .pcl-chart text { fill: #26362e; font-family: "IBM Plex Mono", ui-monospace, monospace; font-size: 11px; font-weight: 800; }
      .pcl-legend { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px; }
      .pcl-legend span { color: #37443d; font-family: "IBM Plex Mono", ui-monospace, monospace; font-size: 11px; font-weight: 800; }
      .pcl-swatch { display: inline-block; height: 3px; margin-right: 5px; vertical-align: middle; width: 22px; }
      .pcl-swatch.orig-speed { background: #6f9db2; }
      .pcl-swatch.mod-speed { background: #b66b64; }
      .pcl-swatch.orig-gear { background: #3f7a5f; }
      .pcl-swatch.mod-gear { background: #8b86b5; }
      @media (max-width: 1200px) {
        .pcl-wrap,
        .pcl-summary-grid,
        .pcl-cols,
        .pcl-step-row,
        .pcl-stage-grid,
        .pcl-scenario-layout { display: block; }
        .pcl-controls { position: static; max-height: none; }
        .pcl-kpi,
        .pcl-list,
        .pcl-step { margin-bottom: 10px; }
        .pcl-step:not(:last-child)::after { display: none; }
      }
    </style>

    <div class="callout blue book">
      <p><b>Purpose.</b> Flip <code>ParkingDataConfig</code> options and see which datapipe stages run, which keys are emitted, what route-map behavior changes, and which combinations are invalid.</p>
      <p><b>Scope.</b> This is a code-faithful mental model for the Boris branch. It does not execute the dataloader; it explains the consequences encoded in <code>parking.py</code> and <code>otf.py</code>.</p>
    </div>

    <div class="pcl-wrap" id="pcl-root">
      <aside class="pcl-panel pcl-controls">
        <div id="pcl-controls"></div>
        <div class="pcl-actions">
          <button type="button" data-preset="defaults">Defaults</button>
          <button type="button" data-preset="zoo">Zoo Path</button>
          <button type="button" data-preset="blackout">Blackout Mix</button>
          <button type="button" data-preset="policyPath">Policy Path On</button>
          <button type="button" data-preset="val">Validation</button>
        </div>
      </aside>
      <section>
        <div id="pcl-alerts"></div>
        <div class="pcl-summary-grid" id="pcl-summary"></div>
        <div class="pcl-panel">
          <span class="mini-title">Active pipeline</span>
          <div class="pcl-diagram"><div class="pcl-step-row" id="pcl-steps"></div></div>
          <div class="pcl-cols">
            <div class="pcl-list"><b>Emitted data keys</b><div class="pcl-chip-row" id="pcl-keys"></div></div>
            <div class="pcl-list"><b>What changes when this config runs</b><ul id="pcl-effects"></ul></div>
          </div>
        </div>

        <div class="pcl-panel" style="margin-top:14px">
          <span class="mini-title">Detailed pipeline stages</span>
          <div class="pcl-stage-grid" id="pcl-stage-detail"></div>
        </div>
        <div class="pcl-panel" style="margin-top:14px">
          <span class="mini-title">Worked examples</span>
          <div class="pcl-scenario-toolbar" id="pcl-scenario-toolbar">
            <button type="button" data-scenario="unpark_drive">Unpark P -> D</button>
            <button type="button" data-scenario="multi_maneuver">Drive / reverse maneuvers</button>
            <button type="button" data-scenario="delayed_park">Delayed shift to P</button>
            <button type="button" data-scenario="parking_correction">Parking correction</button>
          </div>
          <div class="pcl-scenario-layout">
            <div>
              <div class="pcl-chart-wrap" id="pcl-scenario-chart"></div>
              <div class="pcl-legend">
                <span><i class="pcl-swatch orig-speed"></i>original speed</span>
                <span><i class="pcl-swatch mod-speed"></i>after speed</span>
                <span><i class="pcl-swatch orig-gear"></i>original gear</span>
                <span><i class="pcl-swatch mod-gear"></i>after gear</span>
              </div>
            </div>
            <div class="pcl-list"><b id="pcl-scenario-title"></b><ul id="pcl-scenario-notes"></ul></div>
          </div>
        </div>
        <div class="pcl-cols" style="margin-top:14px">
          <div class="pcl-list"><b>Route and map behavior</b><ul id="pcl-route"></ul></div>
          <div class="pcl-list"><b>Sample drop / filtering risks</b><ul id="pcl-risks"></ul></div>
        </div>
        <div class="pcl-panel" style="margin-top:14px">
          <span class="mini-title">Equivalent config sketch</span>
          <div class="pcl-code" id="pcl-code"></div>
        </div>
      </section>
    </div>
  `,
});

const PCL_DEFAULTS = {
  datapipe_type_train: true,
  sign_speed_by_gear: false,
  use_zoo_dataloader: false,
  reconstruct_gear_from_speed: true,
  lookahead_sec: 30,
  past_sec: 30,
  time_threshold_sec: 20,
  distance_threshold_m: 30,
  distance_threshold_jitter_m: 10,
  min_duration_sec: 2,
  enable_gear_label_cleanup: true,
  parked_unparking_prob: 0.5,
  enable_park_mode_in_parking_state: true,
  enable_park_mode_in_parked_state: true,
  park_mode_blackout_probability: 0,
  enable_route_shortening_for_parking: true,
  enable_end_of_route_blackout: false,
  stop_route_offset_m: 20,
  enable_end_of_route_navigation_cleanup: false,
  parking_goal_dropout_probability: 0,
  unparking_gear_augment_prob: 1,
  enable_stopping_mode: false,
  enable_strip_leading_standstill: true,
  enable_augment_standstill_gear: false,
  policy_path_num_points: 0,
  policy_path_sample_step_m: 0.5,
};

const PCL_CONTROLS = [
  ["Context", [
    ["datapipe_type_train", "bool", "Training datapipe", "Val disables route shortening / blackout / nav cleanup in otf.py."],
    ["sign_speed_by_gear", "bool", "sign_speed_by_gear", "OTF argument. Mutually exclusive with reconstruct_gear_from_speed."],
  ]],
  ["Backend / Gear", [
    ["use_zoo_dataloader", "bool", "use_zoo_dataloader", "Delegate to zoo insert_parking_data; SI-specific stages are skipped."],
    ["reconstruct_gear_from_speed", "bool", "reconstruct_gear_from_speed", "Build D/R from signed speed and keep validated P/N segments."],
    ["min_duration_sec", "number", "min_duration_sec", "Minimum P/N duration for validated parking segments."],
    ["enable_gear_label_cleanup", "bool", "enable_gear_label_cleanup", "Remove short reverse and neutral gear glitches before detection."],
  ]],
  ["Detection Window", [
    ["lookahead_sec", "number", "lookahead_sec", "Future table context loaded for parking detection."],
    ["past_sec", "number", "past_sec", "Past table context requested in the OTF timeslicer."],
    ["time_threshold_sec", "number", "time_threshold_sec", "Future neutral segment accepted if reached within this time."],
    ["distance_threshold_m", "number", "distance_threshold_m", "Future neutral segment accepted if reached within this distance."],
    ["distance_threshold_jitter_m", "number", "distance_threshold_jitter_m", "Uniform per-sample jitter around distance threshold."],
  ]],
  ["Route Context", [
    ["enable_park_mode_in_parking_state", "bool", "park mode in parking state", "PARKING_MODE can be true for approaching parking samples."],
    ["enable_park_mode_in_parked_state", "bool", "park mode in parked state", "PARKING_MODE can be true for parked samples."],
    ["park_mode_blackout_probability", "number", "park_mode_blackout_probability", "Mixture between route-shortening and park-mode+blackout."],
    ["enable_route_shortening_for_parking", "bool", "enable_route_shortening_for_parking", "Store stop-route anchor for later map route shortening."],
    ["enable_end_of_route_blackout", "bool", "enable_end_of_route_blackout", "Zero MAP_ROUTE when parking mode is active."],
    ["stop_route_offset_m", "number", "stop_route_offset_m", "Jitter parking stop-route anchor by up to this many meters."],
    ["enable_end_of_route_navigation_cleanup", "bool", "navigation cleanup", "Zero navigation tensors when parking mode is active."],
  ]],
  ["Augmentation / Outputs", [
    ["parked_unparking_prob", "number", "parked_unparking_prob", "Chance to turn an origin-inside-parked sample into an unparking example."],
    ["unparking_gear_augment_prob", "number", "unparking_gear_augment_prob", "Chance to assign D/R when augmenting unparking from standstill."],
    ["enable_stopping_mode", "bool", "enable_stopping_mode", "Emit STOPPING_MODE using hazard lights for parking samples."],
    ["enable_strip_leading_standstill", "bool", "strip leading standstill", "Shift policy speed/pose so movement starts sooner after D/R gear."],
    ["enable_augment_standstill_gear", "bool", "augment standstill gear", "Randomize current vehicle gear at standstill during parking."],
    ["parking_goal_dropout_probability", "number", "parking_goal_dropout_probability", "Randomly replace PARKING_POSE with NaNs after preserving original."],
  ]],
  ["Policy Path", [
    ["policy_path_num_points", "number", "policy_path_num_points", "If positive, compute POLICY_PATH and PARKING_POSE."],
    ["policy_path_sample_step_m", "number", "policy_path_sample_step_m", "Distance between sampled POLICY_PATH poses."],
  ]],
];

function pclStateFromControls(root) {
  const state = { ...PCL_DEFAULTS };
  for (const key of Object.keys(state)) {
    const el = root.querySelector(`[data-pcl="${key}"]`);
    if (!el) continue;
    state[key] = el.type === "checkbox" ? el.checked : Number(el.value);
  }
  if (!state.datapipe_type_train) {
    state.enable_end_of_route_blackout = false;
    state.enable_end_of_route_navigation_cleanup = false;
    state.enable_route_shortening_for_parking = false;
    state.park_mode_blackout_probability = 0;
  }
  return state;
}

function pclApplyPreset(root, preset) {
  const next = { ...PCL_DEFAULTS };
  if (preset === "zoo") next.use_zoo_dataloader = true;
  if (preset === "blackout") {
    next.park_mode_blackout_probability = 1;
    next.enable_end_of_route_blackout = true;
  }
  if (preset === "policyPath") {
    next.policy_path_num_points = 50;
    next.policy_path_sample_step_m = 0.5;
  }
  if (preset === "val") next.datapipe_type_train = false;
  for (const [key, value] of Object.entries(next)) {
    const el = root.querySelector(`[data-pcl="${key}"]`);
    if (!el) continue;
    if (el.type === "checkbox") el.checked = Boolean(value);
    else el.value = String(value);
  }
}

function pclValidate(s) {
  const errors = [];
  const warnings = [];
  if (s.lookahead_sec <= 0) errors.push("otf.py requires parking_config.lookahead_sec > 0 when parking_config is enabled.");
  if (s.distance_threshold_jitter_m < 0) errors.push("distance_threshold_jitter_m must be >= 0.");
  if (s.stop_route_offset_m < 0) errors.push("stop_route_offset_m must be >= 0.");
  if (s.park_mode_blackout_probability < 0 || s.park_mode_blackout_probability > 1) {
    errors.push("park_mode_blackout_probability must be in [0, 1].");
  }
  if (s.reconstruct_gear_from_speed && s.sign_speed_by_gear) {
    errors.push("reconstruct_gear_from_speed and sign_speed_by_gear are mutually exclusive.");
  }
  if (s.sign_speed_by_gear && s.min_duration_sec !== 0) {
    warnings.push("ParkingDataConfig docstring says min_duration_sec must be 0 when sign_speed_by_gear is true.");
  }
  if (s.use_zoo_dataloader && s.park_mode_blackout_probability > 0) {
    errors.push("park_mode_blackout_probability is only supported by the SI parking dataloader, not the zoo path.");
  }
  if (!s.datapipe_type_train) {
    warnings.push("Validation replaces the config to disable route shortening, blackout, navigation cleanup, and blackout sampling.");
  }
  if (s.use_zoo_dataloader) {
    warnings.push("Zoo path skips SI-specific PARKED_STATE, UNPARKING_STATE, route-shortening metadata, standstill stripping, and policy-path logic.");
  }
  if (s.policy_path_num_points > 0) {
    const length = Math.max(0, s.policy_path_num_points - 1) * s.policy_path_sample_step_m;
    warnings.push(`POLICY_PATH requires future poses covering about ${length.toFixed(1)}m, otherwise samples can be dropped.`);
  }
  return { errors, warnings };
}

function pclDerived(s) {
  const si = !s.use_zoo_dataloader;
  const routeShortening = si && s.datapipe_type_train && s.enable_route_shortening_for_parking && s.park_mode_blackout_probability < 1;
  const blackout = si && s.datapipe_type_train && (s.enable_end_of_route_blackout || s.park_mode_blackout_probability > 0);
  const parkModeFromState = si && (s.park_mode_blackout_probability > 0 || s.enable_park_mode_in_parking_state || s.enable_park_mode_in_parked_state);
  const policyPath = si && s.policy_path_num_points > 0 && s.policy_path_sample_step_m > 0;
  const effectiveMode = s.use_zoo_dataloader ? "Zoo parking dataloader" : "SI parking dataloader";
  return { si, routeShortening, blackout, parkModeFromState, policyPath, effectiveMode };
}

function pclList(items) {
  return items.map((x) => `<li>${x}</li>`).join("");
}


const PCL_STAGE_DETAIL = [
  {
    cls: "good",
    active: (_s, d) => d.si,
    name: "1. Scratch setup",
    source: "insert_parking_data -> _init_scratch",
    reads: ["origin index", "(table, data) sample"],
    writes: ["scratch_table.origin_idx"],
    detail: "Wraps the normal sample as (table, scratch_table, data). Everything below shares this scratch table until the final drop step.",
  },
  {
    cls: "warn",
    active: (_s, d) => d.si,
    name: "2. Resolve parking context",
    source: "fill_parking_scratch_table",
    reads: ["vehicle/policy indices", "lookahead indices", "timestamps", "speed", "distance", "raw gear"],
    writes: ["scratch indices", "speed_kmh", "cumulative_dist", "original_gear"],
    detail: "Builds the full-resolution arrays used by detection, plus optional future parking poses and curvature when odometry support is available.",
  },
  {
    cls: "warn",
    active: (s, d) => d.si && (s.reconstruct_gear_from_speed || s.sign_speed_by_gear || s.enable_gear_label_cleanup),
    name: "3. Clean gear timeline",
    source: "_reconstruct_gear_from_speed / cleanup helpers",
    reads: ["signed speed", "raw gear", "P/N segment durations"],
    writes: ["scratch_table.gear"],
    detail: "Derives D/R from speed, keeps validated neutral segments, removes short gear glitches, and expands P/N over adjacent standstill.",
  },
  {
    cls: "hot",
    active: (_s, d) => d.si,
    name: "4. Detect parking state",
    source: "_compute_parking_state",
    reads: ["clean gear", "timestamps", "cumulative distance", "origin"],
    writes: ["ParkingStateResult"],
    detail: "Checks origin-inside-neutral first, then future neutral for parking, then past neutral followed by reverse/standstill for unparking.",
  },
  {
    cls: "purple",
    active: (_s, d) => d.si,
    name: "5. Emit state and gear keys",
    source: "add_parking_state",
    reads: ["ParkingStateResult", "vehicle/policy indices"],
    writes: ["PARKING_MODE", "PARKING_STATE", "UNPARKING_STATE", "VEHICLE_GEAR_DIRECTION", "POLICY_GEAR_DIRECTION"],
    detail: "Moves detector output into model-facing data keys and decides route-shortening vs park-mode/blackout behavior for this sample.",
  },
  {
    cls: "purple",
    active: (_s, d) => d.policyPath,
    name: "6. Optional path target",
    source: "compute_policy_path",
    reads: ["additional_parking_pose", "PATH_POSE fallback", "goal_distance"],
    writes: ["POLICY_PATH", "PARKING_POSE"],
    detail: "Samples a fixed-distance pose path. If poses do not cover the requested path length, the sample is dropped.",
  },
  {
    cls: "warn",
    active: (s, d) => d.si && (s.unparking_gear_augment_prob > 0 || s.enable_strip_leading_standstill || s.enable_augment_standstill_gear),
    name: "7. Parking-specific target rewrites",
    source: "augment_unparking_gear / strip_leading_standstill / clamp_policy_at_first_neutral",
    reads: ["ParkingStateResult", "clean gear", "policy pose/speed/curvature"],
    writes: ["policy gear", "policy speed", "policy pose", "policy waypoints"],
    detail: "Creates better parked/unparking examples, removes delayed movement from leading standstill, and freezes future targets after first neutral gear.",
  },
  {
    cls: "good",
    active: (_s, d) => d.si,
    name: "8. Drop scratch table",
    source: "_drop_scratch",
    reads: ["table", "scratch_table", "data"],
    writes: ["(table, data)"],
    detail: "Downstream OTF stages see a normal sample again, but with parking labels and target rewrites already applied.",
  },
];

const PCL_SCENARIOS = {
  unpark_drive: {
    title: "Unparking from P/N to drive with standstill before speed",
    origin: 0,
    times: [0, 1, 2, 3, 4, 5, 6, 7, 8],
    gear: ["P", "P", "D", "D", "D", "D", "D", "D", "D"],
    speed: [0, 0, 0, 0, 2, 5, 8, 9, 9],
    notes: [
      "The detector's real past-neutral unparking logic only catches P/N -> R, so forward P/N -> D is a known gap when detected from history.",
      "If the origin is treated as parked and _augment_parked_state selects unparking, augment_unparking_gear can make the current model-facing gear D/R instead of P/N.",
      "With strip_leading_standstill enabled, policy speed is shifted so movement starts shortly after origin instead of waiting through the full standstill.",
    ],
    transform: (s, base) => {
      const out = structuredClone(base);
      if (s.unparking_gear_augment_prob > 0) out.gear = out.gear.map((g, i) => (i < 2 ? "D" : g));
      if (s.enable_strip_leading_standstill) out.speed = [0, 1.5, 4, 7, 8.5, 9, 9, 9, 9];
      return out;
    },
  },
  multi_maneuver: {
    title: "Unparking with multiple drive / reverse maneuvers",
    origin: 0,
    times: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    gear: ["P", "R", "R", "R", "D", "D", "R", "R", "D", "D", "D", "D"],
    speed: [0, -1, -4, -3, 0, 2, -2, -2, 0, 3, 6, 8],
    notes: [
      "Reverse-out unparking is the case the detector handles: a prior/active neutral segment followed by reverse and standstill can become UNPARKING_STATE.",
      "Gear reconstruction preserves D/R from signed speed, so multi-maneuver direction changes survive when the speed sign is clear.",
      "Short gear-label cleanup can remove tiny isolated reverse or neutral glitches, but real sustained D/R maneuvers remain.",
    ],
    transform: (s, base) => {
      const out = structuredClone(base);
      if (s.enable_gear_label_cleanup) {
        out.gear = out.gear.map((g, i) => (i === 4 && Math.abs(out.speed[i]) < 0.5 ? "R" : g));
      }
      if (s.enable_strip_leading_standstill) out.speed = [0, -3, -4, -3, 1, 2, -2, -2, 2, 4, 7, 8];
      return out;
    },
  },
  delayed_park: {
    title: "Parking with delayed shift to P after stopping",
    origin: 0,
    times: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    gear: ["D", "D", "D", "D", "D", "D", "D", "P", "P", "P", "P"],
    speed: [8, 7, 5, 3, 1, 0, 0, 0, 0, 0, 0],
    notes: [
      "The clean P/N segment is the parking anchor, but drivers often stop before shifting to P/N.",
      "_expand_neutral_gear_over_standstill extends P/N backward over adjacent stopped frames, so the parking stop starts closer to the physical stop.",
      "clamp_policy_at_first_neutral freezes future policy pose/waypoints and zeroes speed once policy gear reaches P/N.",
    ],
    transform: (_s, base) => {
      const out = structuredClone(base);
      out.gear = out.gear.map((g, i) => (i >= 5 ? "P" : g));
      out.speed = out.speed.map((v, i) => (i >= 5 ? 0 : v));
      return out;
    },
  },
  parking_correction: {
    title: "Parking with reverse / forward position correction",
    origin: 0,
    times: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    gear: ["D", "D", "D", "R", "R", "R", "D", "D", "D", "P", "P", "P"],
    speed: [6, 4, 1, 0, -2, -2, 0, 1.5, 1, 0, 0, 0],
    notes: [
      "This is parking, not unparking: the future P/N segment is within the time/distance threshold, so PARKING_STATE is true.",
      "A real reverse correction segment should remain if it spans enough distance; only very short reverse glitches are cleaned away.",
      "When the final P/N is reached, policy targets after that point are clamped to the stopped pose and zero speed.",
    ],
    transform: (s, base) => {
      const out = structuredClone(base);
      if (s.enable_gear_label_cleanup) out.gear = out.gear.map((g, i) => (i === 3 && Math.abs(out.speed[i]) < 0.5 ? "D" : g));
      out.gear = out.gear.map((g, i) => (i >= 9 ? "P" : g));
      out.speed = out.speed.map((v, i) => (i >= 9 ? 0 : v));
      return out;
    },
  },
};

let pclScenarioId = "unpark_drive";

function pclGearY(gear, top, height) {
  const map = { D: 0.16, P: 0.46, N: 0.46, R: 0.78, U: 0.92 };
  return top + height * (map[gear] ?? map.U);
}

function pclSpeedY(speed, top, height, maxAbsSpeed) {
  const mid = top + height / 2;
  return mid - (speed / maxAbsSpeed) * (height * 0.42);
}

function pclPath(points) {
  return points.map(([x, y], i) => `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
}

function pclStepPath(points) {
  if (!points.length) return "";
  let d = `M ${points[0][0].toFixed(1)} ${points[0][1].toFixed(1)}`;
  for (let i = 1; i < points.length; i += 1) {
    d += ` H ${points[i][0].toFixed(1)} V ${points[i][1].toFixed(1)}`;
  }
  return d;
}

function pclScenarioAfter(s, scenario) {
  const base = { gear: [...scenario.gear], speed: [...scenario.speed] };
  if (!pclDerived(s).si) return base;
  if (s.reconstruct_gear_from_speed) {
    base.gear = pclReconstructScenarioGear(s, base);
  }
  return scenario.transform(s, base);
}

function pclReconstructScenarioGear(s, base) {
  const minStoppedRun = Math.max(1, Math.round(s.min_duration_sec));
  const neutral = new Array(base.gear.length).fill(false);
  let start = null;
  for (let i = 0; i <= base.gear.length; i += 1) {
    const isNeutral = i < base.gear.length && (base.gear[i] === "P" || base.gear[i] === "N") && Math.abs(base.speed[i]) < 0.5;
    if (isNeutral && start === null) start = i;
    if ((!isNeutral || i === base.gear.length) && start !== null) {
      if (i - start >= minStoppedRun) {
        for (let j = start; j < i; j += 1) neutral[j] = true;
      }
      start = null;
    }
  }
  return base.speed.map((v, i) => {
    if (neutral[i]) return base.gear[i] === "N" ? "N" : "P";
    if (v < -0.5) return "R";
    if (v > 0.5) return "D";
    if (base.gear[i] === "R") return "R";
    if (base.gear[i] === "P" || base.gear[i] === "N") return base.gear[i];
    return "D";
  });
}

function pclRenderScenario(s) {
  const scenario = PCL_SCENARIOS[pclScenarioId] || PCL_SCENARIOS.unpark_drive;
  const after = pclScenarioAfter(s, scenario);
  const times = scenario.times;
  const width = 820;
  const left = 52;
  const right = 22;
  const plotW = width - left - right;
  const rowH = 150;
  const row1 = 36;
  const row2 = 220;
  const maxAbsSpeed = Math.max(1, ...scenario.speed.map(Math.abs), ...after.speed.map(Math.abs));
  const xFor = (t) => left + ((t - times[0]) / (times[times.length - 1] - times[0])) * plotW;
  const speedOrig = times.map((t, i) => [xFor(t), pclSpeedY(scenario.speed[i], row1, rowH, maxAbsSpeed)]);
  const speedAfter = times.map((t, i) => [xFor(t), pclSpeedY(after.speed[i], row2, rowH, maxAbsSpeed)]);
  const gearOrig = times.map((t, i) => [xFor(t), pclGearY(scenario.gear[i], row1, rowH)]);
  const gearAfter = times.map((t, i) => [xFor(t), pclGearY(after.gear[i], row2, rowH)]);
  const grid = times.map((t) => `<line class="grid" x1="${xFor(t).toFixed(1)}" y1="20" x2="${xFor(t).toFixed(1)}" y2="392"/>`).join("");
  const stateBadges = (gears, rowTop) => gears.map((gear, i) => {
    const x = xFor(times[i]) - 9;
    const y = pclGearY(gear, rowTop, rowH) - 14;
    return `<rect class="gear-state" x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="18" height="14" rx="2"/><text class="gear-state-text" x="${(x + 5).toFixed(1)}" y="${(y + 10).toFixed(1)}">${gear}</text>`;
  }).join("");
  const labels = [
    `<text class="chart-label" x="8" y="${row1 + 16}">original</text>`,
    `<text class="chart-label" x="8" y="${row2 + 16}">after parking.py</text>`,
    `<text x="${left + 10}" y="${row1 + 18}">speed km/h</text>`,
    `<text x="${left + 10}" y="${row2 + 18}">speed km/h</text>`,
    `<text x="${left + plotW - 92}" y="${row1 + 18}">gear state</text>`,
    `<text x="${left + plotW - 92}" y="${row2 + 18}">gear state</text>`,
    `<text x="${left}" y="410">time (s)</text>`,
    ...times.map((t) => `<text x="${(xFor(t) - 4).toFixed(1)}" y="410">${t}</text>`),
    `<text x="${left + plotW + 5}" y="${pclGearY("D", row1, rowH).toFixed(1)}">D</text>`,
    `<text x="${left + plotW + 5}" y="${pclGearY("P", row1, rowH).toFixed(1)}">P/N</text>`,
    `<text x="${left + plotW + 5}" y="${pclGearY("R", row1, rowH).toFixed(1)}">R</text>`,
    `<text x="${left + plotW + 5}" y="${pclGearY("D", row2, rowH).toFixed(1)}">D</text>`,
    `<text x="${left + plotW + 5}" y="${pclGearY("P", row2, rowH).toFixed(1)}">P/N</text>`,
    `<text x="${left + plotW + 5}" y="${pclGearY("R", row2, rowH).toFixed(1)}">R</text>`,
  ].join("");
  document.getElementById("pcl-scenario-chart").innerHTML = `
    <svg class="pcl-chart" viewBox="0 0 ${width} 430" role="img" aria-label="${scenario.title} gear and speed timeline">
      ${grid}
      <line class="axis" x1="${left}" y1="${row1 + rowH / 2}" x2="${left + plotW}" y2="${row1 + rowH / 2}"/>
      <line class="axis" x1="${left}" y1="${row2 + rowH / 2}" x2="${left + plotW}" y2="${row2 + rowH / 2}"/>
      <path class="speed-original" d="${pclPath(speedOrig)}"/>
      <path class="gear-original" d="${pclStepPath(gearOrig)}"/>
      <path class="speed-modified" d="${pclPath(speedAfter)}"/>
      <path class="gear-modified" d="${pclStepPath(gearAfter)}"/>
      ${stateBadges(scenario.gear, row1)}
      ${stateBadges(after.gear, row2)}
      ${labels}
    </svg>`;
  document.getElementById("pcl-scenario-title").textContent = scenario.title;
  const configNotes = [];
  if (!pclDerived(s).si) configNotes.push("Current selection uses the zoo path, so SI-specific gear cleanup and target rewrites are shown as inactive.");
  if (s.reconstruct_gear_from_speed) configNotes.push("reconstruct_gear_from_speed is on: the after gear trace derives D/R from signed speed and preserves only long stopped P/N segments.");
  if (!s.reconstruct_gear_from_speed) configNotes.push("reconstruct_gear_from_speed is off: the after gear trace starts from the raw scenario labels, then only later cleanup/augmentation stages can change it.");
  if (!s.enable_strip_leading_standstill) configNotes.push("strip_leading_standstill is off, so speed is not shifted earlier in standstill-heavy examples.");
  if (!s.enable_gear_label_cleanup) configNotes.push("gear label cleanup is off, so short isolated gear glitches remain in the after timeline.");
  document.getElementById("pcl-scenario-notes").innerHTML = pclList([...scenario.notes, ...configNotes]);
  document.querySelectorAll("[data-scenario]").forEach((button) => button.classList.toggle("active", button.dataset.scenario === pclScenarioId));
}

function pclRender() {
  const root = document.getElementById("pcl-root");
  if (!root) return;
  const s = pclStateFromControls(root);
  const d = pclDerived(s);
  const { errors, warnings } = pclValidate(s);

  document.getElementById("pcl-alerts").innerHTML = [
    ...errors.map((x) => `<div class="pcl-alert error"><b>Invalid config.</b> ${x}</div>`),
    ...warnings.map((x) => `<div class="pcl-alert"><b>Watch out.</b> ${x}</div>`),
    errors.length === 0 ? `<div class="pcl-alert good"><b>Config accepted.</b> The selected options are consistent with the guardrails in parking.py and otf.py.</div>` : "",
  ].join("");

  document.getElementById("pcl-summary").innerHTML = [
    ["green", "Backend", d.effectiveMode, d.si ? "Scratch-table SI path runs." : "Delegates to zoo insert_parking_data."],
    ["yellow", "Route mode", d.routeShortening ? "Shorten route" : d.blackout ? "Blackout route" : "No route edit", d.routeShortening ? "Stores stop-route index/fraction." : d.blackout ? "MAP_ROUTE can be zeroed." : "Map route is left as normal."],
    ["purple", "Policy path", d.policyPath ? "Enabled" : "Disabled", d.policyPath ? `${s.policy_path_num_points} points every ${s.policy_path_sample_step_m}m.` : "No POLICY_PATH by default in Boris config."],
    ["rust", "Validation", s.datapipe_type_train ? "Train behavior" : "Val behavior", s.datapipe_type_train ? "Stochastic train augmentations can run." : "Route perturbation options are forced off."],
  ].map(([cls, label, value, note]) => `<div class="pcl-kpi ${cls}"><span>${label}</span><b>${value}</b><small>${note}</small></div>`).join("");

  const steps = [
    ["good", true, "load context", `lookahead ${s.lookahead_sec}s, past ${s.past_sec}s`],
    [d.si ? "good" : "off", d.si, "scratch table", "origin, indices, speed, distance, gear"],
    [d.si ? "warn" : "off", d.si, "gear timeline", s.reconstruct_gear_from_speed ? "reconstruct from speed + P/N" : s.sign_speed_by_gear ? "sign speed by gear" : "use original gear"],
    [d.si ? "hot" : "off", d.si, "state detection", "parking / parked / unparking"],
    [d.policyPath ? "good" : "off", d.policyPath, "policy path", "PARKING_POSE and POLICY_PATH"],
    [d.si ? "warn" : "off", d.si, "target cleanup", "gear aug, standstill strip, clamp at P/N"],
  ];
  document.getElementById("pcl-steps").innerHTML = steps
    .map(([cls, on, title, note]) => `<div class="pcl-step ${cls} ${on ? "" : "off"}"><b>${title}</b><small>${note}</small></div>`)
    .join("");

  const keys = ["PARKING_MODE"];
  if (d.si) keys.push("PARKING_STATE", "PARKED_STATE", "UNPARKING_STATE", "PARKING_START_TIME_DELTA", "PARKING_END_TIME_DELTA", "PARKING_GOAL_DISTANCE", "VEHICLE_GEAR_DIRECTION", "POLICY_GEAR_DIRECTION");
  if (s.enable_stopping_mode) keys.push("STOPPING_MODE");
  if (d.policyPath) keys.push("PARKING_POSE", "ORIGINAL_PARKING_GOAL_POSE", "POLICY_PATH");
  if (d.routeShortening) keys.push("PARKING_STOP_ROUTE_INDEX", "PARKING_STOP_ROUTE_FRACTION", "_parking_stop_route_offset_m");
  document.getElementById("pcl-keys").innerHTML = keys.map((k) => `<span class="pcl-chip">${k}</span>`).join("");

  const effects = [];
  if (d.si) effects.push("Gear labels used by vehicle and policy outputs come from the cleaned parking gear timeline.");
  if (s.enable_gear_label_cleanup && d.si) effects.push("Short reverse and neutral glitches are removed before state detection.");
  if (s.parked_unparking_prob > 0 && d.si) effects.push("Origins inside parked segments can become synthetic unparking examples when future path is long enough.");
  if (s.enable_strip_leading_standstill && d.si) effects.push("Parking/unparking samples can have policy speed, pose, curvature, and gear shifted to remove leading standstill.");
  if (s.enable_augment_standstill_gear && d.si) effects.push("Current vehicle gear can be randomized at standstill during parking.");
  if (s.parking_goal_dropout_probability > 0 && d.policyPath) effects.push("PARKING_POSE can be dropped to NaN after ORIGINAL_PARKING_GOAL_POSE is preserved.");
  if (!effects.length) effects.push("Only basic parking mode insertion remains active.");
  document.getElementById("pcl-effects").innerHTML = pclList(effects);

  const route = [];
  if (d.routeShortening) route.push("add_parking_state stores an entry lookahead index when a parking/unparking state is detected.");
  if (d.routeShortening) route.push("insert_parking_stop_route_position converts that entry into route polyline index/fraction.");
  if (d.routeShortening) route.push("Parking route maps are shortened to the stop; unparking route maps start from the stop.");
  if (d.routeShortening && s.stop_route_offset_m > 0) route.push(`Parking stop anchor is jittered by up to ${s.stop_route_offset_m}m; unparking is not jittered.`);
  if (d.blackout) route.push("insert_end_of_route_blackout can zero MAP_ROUTE when PARKING_MODE is true.");
  if (s.enable_end_of_route_navigation_cleanup && s.datapipe_type_train && d.si) route.push("Navigation tensors are zeroed when PARKING_MODE is true.");
  if (!route.length) route.push("No parking-specific route-map mutation runs for this selection.");
  document.getElementById("pcl-route").innerHTML = pclList(route);

  const risks = [];
  if (d.si && s.reconstruct_gear_from_speed) risks.push("Sample is filtered if gear reconstruction cannot produce any valid speed or P/N evidence.");
  if (d.policyPath) risks.push("Sample is filtered if neither additional_parking_pose nor PATH_POSE can produce a long enough POLICY_PATH.");
  if (s.enable_strip_leading_standstill && d.si) risks.push("Sample can be filtered if shifted standstill removal lacks POLICY_TIME_DELTA or path coverage.");
  if (s.lookahead_sec < s.time_threshold_sec) risks.push("Short lookahead may prevent seeing the future neutral segment needed for parking_state.");
  if (!d.si) risks.push("SI-specific filtering risks are skipped because the zoo path is active.");
  document.getElementById("pcl-risks").innerHTML = pclList(risks);

  document.getElementById("pcl-stage-detail").innerHTML = PCL_STAGE_DETAIL.map((stage) => {
    const active = stage.active(s, d);
    return `<div class="pcl-stage-card ${stage.cls} ${active ? "" : "off"}">
      <small>${active ? "active" : "inactive"} - ${stage.source}</small>
      <b>${stage.name}</b>
      <p>${stage.detail}</p>
      <ul>
        <li><b>Reads:</b> ${stage.reads.map((x) => `<code>${x}</code>`).join(", ")}</li>
        <li><b>Writes:</b> ${stage.writes.map((x) => `<code>${x}</code>`).join(", ")}</li>
      </ul>
    </div>`;
  }).join("");

  pclRenderScenario(s);

  const fields = Object.keys(PCL_DEFAULTS)
    .filter((k) => k !== "datapipe_type_train" && k !== "sign_speed_by_gear")
    .map((k) => `    ${k}=${JSON.stringify(s[k])},`)
    .join("\\n");
  document.getElementById("pcl-code").textContent =
`# Conceptual equivalent
make_driving_datapipe(
    datapipe_type="${s.datapipe_type_train ? "train" : "val"}",
    sign_speed_by_gear=${s.sign_speed_by_gear},
    parking_config=ParkingDataConfig(
${fields}
    ),
)`;
}

window.REPORT_AFTER_RENDER.parkingconfiglab = () => {
  const root = document.getElementById("pcl-root");
  const controls = document.getElementById("pcl-controls");
  if (!root || !controls) return;
  controls.innerHTML = PCL_CONTROLS.map(([group, items]) => `
    <div class="pcl-group">
      <span class="pcl-group-title">${group}</span>
      ${items.map(([key, type, label, help]) => `
        <div class="pcl-control">
          <div><label for="pcl-${key}">${label}</label><small>${help}</small></div>
          <input id="pcl-${key}" data-pcl="${key}" type="${type === "bool" ? "checkbox" : "number"}" ${type === "number" ? "step=\"0.1\"" : ""}>
        </div>
      `).join("")}
    </div>
  `).join("");
  pclApplyPreset(root, "defaults");
  root.querySelectorAll("[data-pcl]").forEach((el) => el.addEventListener("input", pclRender));
  root.querySelectorAll("[data-preset]").forEach((button) => {
    button.addEventListener("click", () => {
      pclApplyPreset(root, button.dataset.preset);
      pclRender();
    });
  });

  root.querySelectorAll("[data-scenario]").forEach((button) => {
    button.addEventListener("click", () => {
      pclScenarioId = button.dataset.scenario;
      pclRender();
    });
  });
  pclRender();
};
