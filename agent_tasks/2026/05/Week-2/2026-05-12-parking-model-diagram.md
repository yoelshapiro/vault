# Parking model diagram

- Date: 2026-05-12
- Branch: `03-20-si-group-interleave-control-support`
- PR: N/A
- Change type: Tooling / Visualization
- Areas: `wayve/ai/si/configs/parking/parking_config.py`, `tools/parking_model_diagram/index.html`

## Summary

Investigated `parking_config.py` and built a self-contained interactive HTML diagram for the Parking BC model and training configuration. The diagram defaults to the latest registered release mode in the file, `parking_bc_train_release_2026_6_14`, and includes variant tabs for the earlier registered releases.

## Findings Encoded In The Diagram

- Registered models: `parking_bc`, `parking_bc_release_2026_5_11`, `parking_bc_release_2026_6_12`, `parking_bc_release_2026_6_14`.
- Latest mode uses the December 2025 WFM base, `large_l10`, radar late fusion, gear direction, parking mode, behavior control, Flash Attention v3, and the D26.3 nested parking/PUDO datamodule.
- Output adaptor predicts delta waypoints, indicator, gear direction, behavior-conditioned output, and waypoint uncertainty through the configured BC losses.
- Data mix tabs summarize the registered `parking_pudo`, `parking_bc`, and `pudo_bc` D26.3 top-level nested bucket ratios.

## Changes

- Added `tools/parking_model_diagram/index.html`.
- Served the static app from `/workspace/WayveCode` with:
  - `tmux` session: `parking-model-diagram`
  - URL: `http://127.0.0.1:3001/`

## Validation

- Confirmed port `3001` was free before starting the server.
- Confirmed `curl -I http://127.0.0.1:3001/` returns HTTP 200.
- Confirmed the served HTML contains the latest variant, the space-time transformer node, and the D26.3 data mix.
