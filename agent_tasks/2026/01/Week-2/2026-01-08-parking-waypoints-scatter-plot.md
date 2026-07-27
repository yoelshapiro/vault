# 2026-01-08 — Task Summary — Parking Waypoints Scatter Plot

## Scope
- Add a simple XY scatter plot for policy waypoints in the parking Bokeh plotter.
- Allow Bokeh visualiser to run as a server when no output path is provided.
- Pause the parking maneuver filter project while switching to the visualization task.

## Changes
- Added a new "Policy Waypoints" plot and rendered policy waypoints as an XY scatter graph.
- Added live Bokeh server mode (no file) when `--output_path` is omitted, with on-demand frame loading, index slider with timestamp display, and prev/next buttons (pre-sized using dataloader length or duration-based estimate).
- Wrapped visualisation models with the deployment wrapper (parking enabled) and routed wrapper forward calls with explicit inputs.
- Handle OnBoardDrivingOutput in visualiser unbatching (convert NamedTuple to dict; preserve None).
- Handle 0-d outputs in unbatching (use item instead of indexing).
- Fix camera_time_delta indexing to avoid out-of-bounds when time delta has camera dims.
- Add rear camera panel when an extra camera is present (hide otherwise).
- Add GT path scatter to waypoint plot (first ~2s of path based on current speed).
- Use policy speed when available, and fallback to a minimum speed to avoid zero-length GT path.
- Updated project registry/status to paused for the parking maneuver filter project.

## Files
- /workspace/WayveCode/wayve/ai/si/visualisation/bokeh/plotter/parking_plotter.py
- /workspace/WayveCode/wayve/ai/si/visualisation/bokeh/visualise.py
- /workspace/WayveCode/wayve/ai/si/visualisation/bokeh/README.md
- /workspace/WayveCode/wayve/ai/si/visualisation/inference_model.py
- /workspace/WayveCode/wayve/ai/si/visualisation/bokeh/plotter/input_plotter.py
- ${HOME}/git/vault/projects/zak-classifiers-parking-maneuver.md
- ${HOME}/git/vault/projects/projects.json
- ${HOME}/git/vault/projects/projects.md
- ${HOME}/git/vault/projects/active-project.txt

## Notes
- No tests run.
- Branch: boris/parking_fixed_reverse_acc.
