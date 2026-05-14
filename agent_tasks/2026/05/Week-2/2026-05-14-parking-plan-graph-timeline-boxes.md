# Parking Plan Graph Timeline Boxes

- Date: 2026-05-14
- Branch: `03-20-si-group-interleave-control-support`
- PR: none
- Change type: UI/code
- Areas: `tools/parking_2026_plan_graph/`

## Summary

Updated the parking 2026 capability graph from a milestone-column scatter plot into a continuous timeline view.

## Changes

- Added milestone dates and a continuous 2026 time axis with quarter bands, month ticks, and milestone markers.
- Replaced circular capability dots with product-colored timeline boxes that span inferred start/end dates.
- Added pointer dragging for capability boxes:
  - horizontal drag moves the box along the date axis while preserving duration.
  - vertical drag snaps the box to another feature-field row.
- Updated details, tooltip text, filtering, clustering, and stats to use the live date windows.
- Refined the boxes to show the feature name itself, removed product/date labels from the box face, widened the graph to a horizontally scrollable 3200px canvas, and changed initial box length to come from a rough complexity/time estimate.
- Replaced fixed modulo lanes with collision-aware lane assignment per feature field, added shaded horizontal field bands and lane guide paths, widened the canvas to 4200px, and made drag moves recompute lanes so moved boxes snap to non-overlapping positions.
- Added authoring controls for new sub-milestones and new feature boxes:
  - user-added sub-milestones have lighter visual weight than original milestones and can be dragged along the date axis.
  - user-added boxes prompt for feature name, project/product, field, start date, and estimated duration.
  - all boxes now have left/right resize handles; resizing recomputes collision-aware lanes and truncates the label within the box if it becomes short.
- Added editing controls:
  - removed the `Product Gate` field and associated boxes from the embedded data.
  - selected boxes can be renamed or deleted from the detail panel.
  - feature field names can be renamed, propagating to boxes assigned to that field.
  - user-added sub-milestones now require a product and render in that product color while remaining visually lighter than original milestones.
- Preloaded the 17 approved sub-milestones from the provided image, mapped to Robotaxi, P2P, PA, and APA in Q2/Q3/Q4 order, with approximate dates within each quarter and product-colored marker styling.
- Added double-click rename for sub-milestones, including changing their product/color.

## Verification

- Ran an embedded-script syntax check with Node:
  - `node - <<'NODE' ... new Function(script) ... NODE`
  - reran after the feature-label / wide-scroll refinement.
- Browser screenshot verification was not possible in this environment because Playwright, jsdom/happy-dom, and Chromium were not installed.
- Added a lightweight fake-DOM Node smoke test:
  - initial render: `91` capability boxes, `0` rectangle overlaps.
  - synthetic move into a crowded field: `0` candidate overlaps.
  - synthetic resize/move candidate: `0` candidate overlaps.
  - synthetic custom milestone and custom box insertion path rendered with `92` boxes.
  - latest render after removing `Product Gate`: `76` capability boxes, `0` rectangle overlaps.
  - smoke-tested add sub-milestone, add box, rename box, rename field, and delete box paths.
  - verified preloaded sub-milestones: `17` markers across `APA`, `P2P`, `PA`, and `Robotaxi`; double-click rename path updates title and product.
