"""Interactive lab for Boris parking.py using mocked scenarios.

Run with:
    streamlit run app.py

The app imports the real parking.py module from WAYVECODE_PATH, then calls its
pipeline helpers directly on synthetic tables so the displayed outputs come from
actual Boris-branch code rather than a hand-written reimplementation.
"""

from __future__ import annotations

import copy
import os
import sys
from dataclasses import asdict, replace
from pathlib import Path
from typing import Any

import numpy as np
import pandas as pd
import plotly.graph_objects as go
from plotly.subplots import make_subplots
import streamlit as st

DEFAULT_WAYVECODE = Path("/workspace/.codex-borisindelman/worktrees/7992/WayveCode")
GEAR_TO_INT = {"R": -1, "P/N": 0, "D": 1, "U": 2}
INT_TO_GEAR = {-1: "R", 0: "P/N", 1: "D", 2: "U"}


SCENARIOS: dict[str, dict[str, Any]] = {
    "Forward unpark: P/N -> D with standstill": {
        "description": "Starts in P/N, selects D, waits at standstill, then drives forward. This exposes the known forward-unpark detection gap unless the origin is inside the parked segment and is augmented.",
        "speed": [0, 0, 0, 0, 2, 5, 8, 9, 9, 9, 9, 9],
        "gear": ["P/N", "P/N", "D", "D", "D", "D", "D", "D", "D", "D", "D", "D"],
        "default_origin": 0,
    },
    "Reverse unpark with D/R corrections": {
        "description": "Reverse-out unparking with multiple direction changes. This is the case _compute_parking_state explicitly handles after a P/N segment.",
        "speed": [0, 0, -1, -4, -3, 0, 2, 3, 0, -2, -2, 0, 3, 6, 8],
        "gear": ["P/N", "P/N", "R", "R", "R", "D", "D", "D", "R", "R", "R", "D", "D", "D", "D"],
        "default_origin": 2,
    },
    "Delayed shift to P after stopping": {
        "description": "Parking approach where the vehicle stops before the driver shifts to P/N. Neutral expansion and clamping should be visible.",
        "speed": [9, 8, 7, 5, 3, 1, 0, 0, 0, 0, 0, 0],
        "gear": ["D", "D", "D", "D", "D", "D", "D", "P/N", "P/N", "P/N", "P/N", "P/N"],
        "default_origin": 2,
    },
    "Parking correction: forward/reverse/forward": {
        "description": "Parking approach with a reverse correction before the final P/N segment.",
        "speed": [7, 5, 2, 0, -2, -2, 0, 1, 1, 0, 0, 0, 0],
        "gear": ["D", "D", "D", "D", "R", "R", "D", "D", "D", "P/N", "P/N", "P/N", "P/N"],
        "default_origin": 6,
    },
}


@st.cache_resource(show_spinner=False)
def load_parking_module(wayvecode_path: str):
    path = Path(wayvecode_path).expanduser().resolve()
    if not path.exists():
        raise FileNotFoundError(f"WAYVECODE_PATH does not exist: {path}")
    if str(path) not in sys.path:
        sys.path.insert(0, str(path))
    import wayve.ai.si.datamodules.parking as parking  # pylint: disable=import-outside-toplevel

    return parking


def cumulative_distance_m(speed_kmh: np.ndarray, dt_sec: float) -> np.ndarray:
    return np.cumsum(np.abs(speed_kmh) / 3.6 * dt_sec).astype(np.float32)


def make_pose_path(distance_m: np.ndarray) -> np.ndarray:
    poses = np.tile(np.eye(4, dtype=np.float32), (len(distance_m), 1, 1))
    poses[:, 0, 3] = distance_m.astype(np.float32)
    return poses


def pad_indices(indices: np.ndarray, length: int) -> np.ndarray:
    if len(indices) >= length:
        return indices[:length]
    if len(indices) == 0:
        return np.zeros(length, dtype=np.int64)
    pad = np.full(length - len(indices), indices[-1], dtype=np.int64)
    return np.concatenate([indices, pad])


def build_mock_table_and_data(parking, scenario: dict[str, Any], origin: int, horizon: int) -> tuple[dict[str, np.ndarray], dict[str, np.ndarray], np.ndarray, np.ndarray]:
    speed = np.asarray(scenario["speed"], dtype=np.float32)
    gear = np.asarray([GEAR_TO_INT[x] for x in scenario["gear"]], dtype=np.float32)
    n = len(speed)
    dt = 1.0
    timestamps_us = (1_700_000_000_000_000 + np.arange(n, dtype=np.int64) * int(dt * 1e6)).astype(np.int64)
    dist = cumulative_distance_m(speed, dt)
    poses = make_pose_path(dist - dist[min(origin, n - 1)])

    table = {
        parking.TableKeys.RUN_ID: np.asarray(["mock_run"] * n),
        parking.TableKeys.TIMESTAMP_UNIXUS: timestamps_us,
        parking.TableKeys.SPEED_KMH: speed,
        parking.TableKeys.DISTANCE_TRAVELLED_M: dist,
        parking.TableKeys.GEAR_DIRECTION: gear,
        parking.F.ROUTE_POLYLINE_LOCATION_INDEX: np.arange(n, dtype=np.float32),
        parking.F.ROUTE_POLYLINE_LOCATION_DIST_TRAVELLED_PCT: np.linspace(0, 1, n, dtype=np.float32),
    }

    full_forward = np.arange(origin, n, dtype=np.int64)
    policy_idx = pad_indices(full_forward, horizon)
    policy_time_delta = ((timestamps_us[policy_idx] - timestamps_us[origin]) / 1e6).astype(np.float32)

    data = {
        parking.DataKeys.PATH_POSE: poses,
        parking.DataKeys.PATH_VALID: np.ones(n, dtype=np.bool_),
        parking.DataKeys.PATH_CURVATURE: np.zeros(n, dtype=np.float32),
        parking.DataKeys.POLICY_TIME_DELTA: policy_time_delta,
        parking.DataKeys.POLICY_POSE: poses[policy_idx].copy(),
        parking.DataKeys.POLICY_WAYPOINTS: poses[policy_idx, :2, 3].copy(),
        parking.DataKeys.POLICY_CURVATURE: np.zeros(len(policy_idx), dtype=np.float32),
        parking.DataKeys.POLICY_SPEED: speed[policy_idx].copy(),
        parking.DataKeys.MAP_ROUTE: np.ones((8, 4), dtype=np.float32),
    }
    return table, data, full_forward, policy_idx


def snapshot_value(value: Any) -> Any:
    if isinstance(value, np.ndarray):
        arr = value
        if arr.ndim == 0:
            return arr.item()
        if arr.size <= 12:
            return arr.tolist()
        return {"shape": list(arr.shape), "head": arr.reshape(-1)[:8].tolist()}
    return value


def data_snapshot(data: dict[str, Any]) -> dict[str, Any]:
    return {k: snapshot_value(v) for k, v in sorted(data.items(), key=lambda kv: kv[0])}


def bool_key(data: dict[str, np.ndarray], key: str) -> bool:
    return bool(np.atleast_1d(data.get(key, np.asarray([False])))[0])


def run_actual_pipeline_for_origin(
    parking,
    scenario: dict[str, Any],
    cfg,
    origin: int,
    horizon: int,
    seed: int,
    sign_speed_by_gear: bool,
    store_entry_index: bool,
    run_route_steps: bool,
) -> dict[str, Any]:
    np.random.seed(seed + origin)
    table, data, additional_indices, policy_idx = build_mock_table_and_data(parking, scenario, origin, horizon)
    scratch = {parking._SK_ORIGIN_IDX: origin}  # Intentionally using parking.py scratch key.
    vehicle_idx = np.asarray([origin], dtype=np.int64)

    stage = "fill_parking_scratch_table"
    x = parking.fill_parking_scratch_table(
        (table, scratch, data),
        policy_indices=policy_idx,
        vehicle_indices=vehicle_idx,
        additional_table_indices=lambda _table, _data: additional_indices,
        min_parking_duration_sec=cfg.min_duration_sec,
        sign_speed_by_gear=sign_speed_by_gear,
        reconstruct_gear_from_speed=cfg.reconstruct_gear_from_speed,
        enable_gear_label_cleanup=cfg.enable_gear_label_cleanup,
        gear_label_cleanup_reverse_max_distance_m=cfg.gear_label_cleanup_reverse_max_distance_m,
        gear_label_cleanup_neutral_max_duration_sec=cfg.gear_label_cleanup_neutral_max_duration_sec,
    )
    if x is None:
        return {"origin": origin, "dropped": True, "drop_stage": stage}
    table, scratch, data = x

    stage = "add_parking_state"
    table, scratch, data = parking.add_parking_state(
        (table, scratch, data),
        time_threshold_sec=cfg.time_threshold_sec,
        distance_threshold_m=cfg.distance_threshold_m,
        distance_threshold_jitter_m=cfg.distance_threshold_jitter_m,
        enable_park_mode_in_parking_state=cfg.enable_park_mode_in_parking_state,
        enable_park_mode_in_parked_state=cfg.enable_park_mode_in_parked_state,
        policy_path_num_points=cfg.policy_path_num_points,
        policy_path_sample_step_m=cfg.policy_path_sample_step_m,
        parked_unparking_prob=cfg.parked_unparking_prob,
        store_entry_index=store_entry_index,
        park_mode_blackout_probability=cfg.park_mode_blackout_probability,
    )

    if cfg.enable_stopping_mode:
        table, scratch, data = parking.set_stopping_mode((table, scratch, data))

    if cfg.policy_path_num_points > 0 and cfg.policy_path_sample_step_m > 0:
        stage = "compute_policy_path"
        x = parking.compute_policy_path(
            (table, scratch, data),
            policy_path_num_points=cfg.policy_path_num_points,
            policy_path_sample_step_m=cfg.policy_path_sample_step_m,
        )
        if x is None:
            return {"origin": origin, "dropped": True, "drop_stage": stage}
        table, scratch, data = x

    table, scratch, data = parking.augment_unparking_gear(
        (table, scratch, data),
        unparking_gear_augment_prob=cfg.unparking_gear_augment_prob,
    )

    if cfg.enable_strip_leading_standstill:
        stage = "strip_leading_standstill"
        x = parking.strip_leading_standstill((table, scratch, data))
        if x is None:
            return {"origin": origin, "dropped": True, "drop_stage": stage}
        table, scratch, data = x

    table, scratch, data = parking.clamp_policy_at_first_neutral((table, scratch, data))

    if cfg.enable_augment_standstill_gear:
        table, scratch, data = parking.augment_standstill_gear((table, scratch, data))

    if cfg.parking_goal_dropout_probability > 0:
        table, scratch, data = parking.apply_parking_goal_dropout(
            (table, scratch, data),
            parking_goal_dropout_probability=cfg.parking_goal_dropout_probability,
        )

    route_before_sum = float(np.sum(data.get(parking.DataKeys.MAP_ROUTE, np.asarray([np.nan]))))
    if run_route_steps and cfg.can_enable_route_shortening_for_parking():
        table, data = parking._add_parking_stop_route_position((table, data), additional_indices, cfg.stop_route_offset_m)
    if run_route_steps and cfg.can_enable_end_of_route_blackout():
        table, data = parking._blackout_route_when_parking((table, data))
    route_after_sum = float(np.sum(data.get(parking.DataKeys.MAP_ROUTE, np.asarray([np.nan]))))

    result = scratch.get(parking._SK_RESULT)
    clean_gear = scratch.get(parking._SK_GEAR)
    original_gear = scratch.get(parking._SK_ORIGINAL_GEAR)
    policy_gear = data.get(parking.DataKeys.POLICY_GEAR_DIRECTION)
    vehicle_gear = data.get(parking.DataKeys.VEHICLE_GEAR_DIRECTION)

    return {
        "origin": origin,
        "dropped": False,
        "time_s": origin,
        "speed_kmh": float(scenario["speed"][origin]),
        "raw_gear": INT_TO_GEAR[int(original_gear[origin])] if original_gear is not None else "?",
        "clean_gear": INT_TO_GEAR[int(clean_gear[origin])] if clean_gear is not None else "?",
        "vehicle_gear": INT_TO_GEAR[int(np.atleast_1d(vehicle_gear)[-1])] if vehicle_gear is not None else "missing",
        "policy_gear_0": INT_TO_GEAR[int(np.atleast_1d(policy_gear)[0])] if policy_gear is not None else "missing",
        "parking_state": bool_key(data, parking.DataKeys.PARKING_STATE),
        "parked_state": bool_key(data, parking.DataKeys.PARKED_STATE),
        "unparking_state": bool_key(data, parking.DataKeys.UNPARKING_STATE),
        "parking_mode": bool_key(data, parking.DataKeys.PARKING_MODE),
        "start_dt": float(np.atleast_1d(data[parking.DataKeys.PARKING_START_TIME_DELTA])[0]),
        "end_dt": float(np.atleast_1d(data[parking.DataKeys.PARKING_END_TIME_DELTA])[0]),
        "goal_distance_m": float(np.atleast_1d(data[parking.DataKeys.PARKING_GOAL_DISTANCE])[0]),
        "segment_start": getattr(result, "segment_start", np.nan),
        "segment_end": getattr(result, "segment_end", np.nan),
        "route_stop_idx": snapshot_value(data.get(parking.DataKeys.PARKING_STOP_ROUTE_INDEX, np.asarray([np.nan]))),
        "route_stop_fraction": snapshot_value(data.get(parking.DataKeys.PARKING_STOP_ROUTE_FRACTION, np.asarray([np.nan]))),
        "route_offset_m": snapshot_value(data.get(parking._PARKING_STOP_ROUTE_OFFSET_M_KEY, np.asarray([np.nan]))),
        "map_route_sum_before": route_before_sum,
        "map_route_sum_after": route_after_sum,
        "map_route_blackout": route_after_sum == 0.0 and route_before_sum > 0.0,
        "data": copy.deepcopy(data),
        "scratch": copy.deepcopy(scratch),
    }


def output_state_label(row: pd.Series) -> str:
    if bool(row.get("dropped", False)):
        return "DROPPED"
    states = []
    if row.parking_state:
        states.append("PARKING")
    if row.parked_state:
        states.append("PARKED")
    if row.unparking_state:
        states.append("UNPARKING")
    return "+".join(states) if states else "NONE"


def route_label(row: pd.Series) -> str:
    if bool(row.get("dropped", False)):
        return "dropped"
    if row.map_route_blackout:
        return "blackout"
    idx = row.route_stop_idx[0] if isinstance(row.route_stop_idx, list) else row.route_stop_idx
    if pd.notna(idx):
        if row.unparking_state:
            return "from stop"
        if row.parking_state or row.parked_state:
            return "to stop"
    return "normal"


def make_summary_plot(df: pd.DataFrame) -> go.Figure:
    state_code = {"NONE": 0, "PARKING": 1, "PARKED": 2, "UNPARKING": 3, "PARKING+UNPARKING": 4, "DROPPED": -1}
    gear_code = {"R": -1, "P/N": 0, "D": 1, "U": 2, "missing": np.nan, "?": np.nan}
    park_code = {False: 0, True: 1}
    route_code = {"normal": 0, "to stop": 1, "from stop": 2, "blackout": 3, "dropped": -1}

    fig = make_subplots(
        rows=5,
        cols=1,
        shared_xaxes=True,
        vertical_spacing=0.04,
        row_heights=[0.34, 0.18, 0.18, 0.15, 0.15],
        subplot_titles=["speed and gear", "parking state", "PARKING_MODE", "route effect", "policy gear[0]"],
    )
    fig.add_trace(go.Scatter(x=df.origin, y=df.speed_kmh, name="speed km/h", mode="lines+markers"), row=1, col=1)
    fig.add_trace(go.Scatter(x=df.origin, y=df.raw_gear.map(gear_code), name="raw gear", mode="lines+markers"), row=1, col=1)
    fig.add_trace(go.Scatter(x=df.origin, y=df.clean_gear.map(gear_code), name="clean gear", mode="lines+markers"), row=1, col=1)
    fig.add_trace(go.Scatter(x=df.origin, y=df.state_label.map(state_code), name="state", mode="lines+markers"), row=2, col=1)
    fig.add_trace(go.Scatter(x=df.origin, y=df.parking_mode.map(park_code), name="PARKING_MODE", mode="lines+markers"), row=3, col=1)
    fig.add_trace(go.Scatter(x=df.origin, y=df.route_label.map(route_code), name="route", mode="lines+markers"), row=4, col=1)
    fig.add_trace(go.Scatter(x=df.origin, y=df.policy_gear_0.map(gear_code), name="policy gear[0]", mode="lines+markers"), row=5, col=1)
    fig.update_yaxes(row=1, col=1, tickmode="array", tickvals=[-1, 0, 1, 2], ticktext=["R", "P/N", "D", "U"])
    fig.update_yaxes(row=2, col=1, tickmode="array", tickvals=[-1, 0, 1, 2, 3, 4], ticktext=["drop", "none", "parking", "parked", "unpark", "mixed"])
    fig.update_yaxes(row=3, col=1, tickmode="array", tickvals=[0, 1], ticktext=["false", "true"])
    fig.update_yaxes(row=4, col=1, tickmode="array", tickvals=[-1, 0, 1, 2, 3], ticktext=["drop", "normal", "to stop", "from stop", "blackout"])
    fig.update_yaxes(row=5, col=1, tickmode="array", tickvals=[-1, 0, 1, 2], ticktext=["R", "P/N", "D", "U"])
    fig.update_layout(height=820, legend_orientation="h", margin=dict(l=40, r=20, t=60, b=30))
    return fig


def sidebar_config(parking):
    st.sidebar.header("ParkingDataConfig")
    cfg = parking.ParkingDataConfig()
    cfg = replace(
        cfg,
        reconstruct_gear_from_speed=st.sidebar.checkbox("reconstruct_gear_from_speed", cfg.reconstruct_gear_from_speed),
        enable_gear_label_cleanup=st.sidebar.checkbox("enable_gear_label_cleanup", cfg.enable_gear_label_cleanup),
        min_duration_sec=st.sidebar.number_input("min_duration_sec", 0.0, 10.0, float(cfg.min_duration_sec), 0.5),
        time_threshold_sec=st.sidebar.number_input("time_threshold_sec", 0.0, 60.0, float(cfg.time_threshold_sec), 1.0),
        distance_threshold_m=st.sidebar.number_input("distance_threshold_m", 0.0, 100.0, float(cfg.distance_threshold_m), 1.0),
        distance_threshold_jitter_m=st.sidebar.number_input("distance_threshold_jitter_m", 0.0, 50.0, float(cfg.distance_threshold_jitter_m), 1.0),
        parked_unparking_prob=st.sidebar.slider("parked_unparking_prob", 0.0, 1.0, float(cfg.parked_unparking_prob), 0.05),
        unparking_gear_augment_prob=st.sidebar.slider("unparking_gear_augment_prob", 0.0, 1.0, float(cfg.unparking_gear_augment_prob), 0.05),
        park_mode_blackout_probability=st.sidebar.slider("park_mode_blackout_probability", 0.0, 1.0, float(cfg.park_mode_blackout_probability), 0.05),
        enable_route_shortening_for_parking=st.sidebar.checkbox("enable_route_shortening_for_parking", cfg.enable_route_shortening_for_parking),
        enable_end_of_route_blackout=st.sidebar.checkbox("enable_end_of_route_blackout", cfg.enable_end_of_route_blackout),
        stop_route_offset_m=st.sidebar.number_input("stop_route_offset_m", 0.0, 100.0, float(cfg.stop_route_offset_m), 1.0),
        enable_strip_leading_standstill=st.sidebar.checkbox("enable_strip_leading_standstill", cfg.enable_strip_leading_standstill),
        enable_augment_standstill_gear=st.sidebar.checkbox("enable_augment_standstill_gear", cfg.enable_augment_standstill_gear),
        policy_path_num_points=st.sidebar.number_input("policy_path_num_points", 0, 100, int(cfg.policy_path_num_points), 5),
        policy_path_sample_step_m=st.sidebar.number_input("policy_path_sample_step_m", 0.1, 5.0, float(cfg.policy_path_sample_step_m), 0.1),
    )
    return cfg


def main() -> None:
    st.set_page_config(page_title="parking.py lab", layout="wide")
    st.title("parking.py Streamlit Lab")
    st.caption("Mocks table/data inputs, then runs the real Boris-branch parking.py helpers for each origin.")

    with st.sidebar:
        st.header("Runtime")
        wayvecode = st.text_input("WAYVECODE_PATH", os.environ.get("WAYVECODE_PATH", str(DEFAULT_WAYVECODE)))
        seed = st.number_input("random seed", 0, 10_000, 7, 1)
        horizon = st.number_input("policy horizon", 2, 50, 10, 1)
        sign_speed_by_gear = st.checkbox("sign_speed_by_gear", False)
        run_route_steps = st.checkbox("run route post-steps", True)

    try:
        parking = load_parking_module(wayvecode)
    except Exception as exc:  # noqa: BLE001 - show import failure in UI
        st.error("Could not import wayve.ai.si.datamodules.parking from the selected WayveCode path.")
        st.exception(exc)
        st.stop()

    scenario_name = st.selectbox("Scenario", list(SCENARIOS.keys()))
    scenario = SCENARIOS[scenario_name]
    st.write(scenario["description"])

    cfg = sidebar_config(parking)
    if cfg.reconstruct_gear_from_speed and sign_speed_by_gear:
        st.error("reconstruct_gear_from_speed and sign_speed_by_gear are mutually exclusive in parking.py.")
        st.stop()

    default_origin = int(scenario.get("default_origin", 0))
    origin = st.slider("Selected origin", 0, len(scenario["speed"]) - 1, default_origin)

    rows = []
    full_outputs = []
    for i in range(len(scenario["speed"])):
        out = run_actual_pipeline_for_origin(
            parking=parking,
            scenario=scenario,
            cfg=cfg,
            origin=i,
            horizon=int(horizon),
            seed=int(seed),
            sign_speed_by_gear=sign_speed_by_gear,
            store_entry_index=cfg.enable_route_shortening_for_parking,
            run_route_steps=run_route_steps,
        )
        full_outputs.append(out)
        row = {k: v for k, v in out.items() if k not in {"data", "scratch"}}
        rows.append(row)

    df = pd.DataFrame(rows)
    if "parking_state" in df:
        df["state_label"] = df.apply(output_state_label, axis=1)
        df["route_label"] = df.apply(route_label, axis=1)

    st.plotly_chart(make_summary_plot(df), use_container_width=True)

    st.subheader("Per-origin outputs")
    display_cols = [
        "origin", "speed_kmh", "raw_gear", "clean_gear", "vehicle_gear", "policy_gear_0",
        "state_label", "parking_mode", "route_label", "start_dt", "end_dt", "goal_distance_m",
        "segment_start", "segment_end", "route_stop_idx", "route_stop_fraction", "route_offset_m",
        "map_route_sum_after", "dropped", "drop_stage",
    ]
    st.dataframe(df[[c for c in display_cols if c in df.columns]], use_container_width=True, hide_index=True)

    selected = full_outputs[origin]
    st.subheader(f"Selected origin {origin}: actual output dictionaries")
    if selected.get("dropped"):
        st.warning(f"Sample dropped at stage: {selected.get('drop_stage')}")
    else:
        c1, c2 = st.columns(2)
        with c1:
            st.markdown("**ParkingStateResult / scratch**")
            scratch = selected.get("scratch", {})
            result = scratch.get(parking._SK_RESULT)
            st.json(asdict(result) if result is not None else {})
            st.markdown("**Cleaned gear timeline from scratch**")
            clean = scratch.get(parking._SK_GEAR)
            raw = scratch.get(parking._SK_ORIGINAL_GEAR)
            if clean is not None:
                st.dataframe(pd.DataFrame({"t": range(len(clean)), "raw": [INT_TO_GEAR[int(x)] for x in raw], "clean": [INT_TO_GEAR[int(x)] for x in clean]}), hide_index=True)
        with c2:
            st.markdown("**Data keys after parking.py steps**")
            st.json(data_snapshot(selected.get("data", {})))

    with st.expander("Scenario input table"):
        input_df = pd.DataFrame({
            "t": range(len(scenario["speed"])),
            "speed_kmh": scenario["speed"],
            "gear": scenario["gear"],
        })
        input_df["selected_origin"] = input_df["t"] == origin
        st.dataframe(input_df, hide_index=True, use_container_width=True)

    with st.expander("Current config"):
        st.json(asdict(cfg))


if __name__ == "__main__":
    main()
