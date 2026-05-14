# Parking Roadmap Read-Only LAN Serve

- Date: 2026-05-14
- Branch: `boris/parking-roadmap-timeline-handoff`
- Commits: `66dd6088df7f`, `8a48dac24adf`
- PR: none
- Area: `/workspace/WayveCode/wayve/ai/parking/roadmap_timeline/`
- Server: `http://10.248.5.189:8765/?readonly=1`
- tmux session: `parking-roadmap-timeline`

## Summary

Added a read-only sharing mode to the standalone Parking 2026 roadmap timeline and served it on the local network.

## Implementation

- Added `?readonly=1`, `?mode=readonly`, and `#readonly` handling in `index.html`.
- In read-only mode, the page hides edit controls and disables box dragging, box resizing, box rename/delete, field rename, sub-milestone movement, and sub-milestone rename.
- Kept filtering, scrolling, hover tooltips, legend selection, and box selection available for review.
- Updated `README.md` with LAN serving commands and read-only URL examples.
- Added a Coder-specific note after confirming the raw `10.248.*` VM IP is reachable from inside the workspace but not a reliable laptop/team URL.
- Started `python3 -m http.server 8765 --bind 0.0.0.0` from `wayve/ai/parking/roadmap_timeline/`.

## Verification

- Ran a Node syntax check over the embedded script.
- Confirmed the static server listens on `0.0.0.0:8765`.
- Confirmed `curl -I 'http://127.0.0.1:8765/?readonly=1'` returns `HTTP/1.0 200 OK`.
- Confirmed `curl -I 'http://10.248.5.189:8765/?readonly=1'` returns `HTTP/1.0 200 OK` inside the workspace, so external failure is upstream routing/security group rather than the local server.

## Notes

- Read-only mode is client-side only. It is for sharing the view without editing affordances, not for security or access control.
- Existing unrelated workspace files were left untouched.
