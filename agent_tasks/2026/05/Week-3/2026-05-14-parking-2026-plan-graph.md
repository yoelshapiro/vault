# Parking 2026 Plan Graph

- Date: 2026-05-14
- Branch: `03-20-si-group-interleave-control-support`
- Source workbook: `/home/borisindelman/Parking_2026_Plan_-_WIP.xlsx`
- Output: `/workspace/WayveCode/tools/parking_2026_plan_graph/index.html`
- Server: `http://localhost:3002/`
- tmux session: `parking-2026-plan-graph`

## Summary

Created an interactive HTML capability graph from the Parking 2026 plan spreadsheet.

The visualization maps:
- X axis: product milestones from Q2, Q3, and Q4 gates.
- Y axis: feature fields such as WFM/pretrain, data curation, model/head work, training/RL, robot software, HMI, hardware/sensors, calibration, safety/control, evaluation, and simulation.
- Dots: interpreted feature capabilities, dependencies, and gates from the spreadsheet.

## Implementation

- Parsed the workbook structure directly from XLSX XML because `openpyxl` is not installed in the environment.
- Synthesized roadmap points from the `Plan`, `References`, `Legend & Resources`, and `Notes` sheets.
- Added product filters, field filter, quarter filter, text search, hover tooltips, selected-capability details, and cluster navigation.
- Served the app with `/usr/bin/python3 -m http.server 3002 --bind 0.0.0.0`.

## Notes

- Existing unrelated dirty repo changes were left untouched.
- The generated HTML is untracked under `tools/parking_2026_plan_graph/`.
