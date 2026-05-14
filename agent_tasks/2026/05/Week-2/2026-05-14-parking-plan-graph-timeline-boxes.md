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

## Verification

- Ran an embedded-script syntax check with Node:
  - `node - <<'NODE' ... new Function(script) ... NODE`
- Browser screenshot verification was not possible in this environment because Playwright, jsdom/happy-dom, and Chromium were not installed.
