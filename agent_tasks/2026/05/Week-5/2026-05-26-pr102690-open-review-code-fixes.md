# 2026-05-26 PR 102690 Open Review Code Fixes

## Context
- Branch: `boris/03-23-park-route-shortening-v2`
- PR: `wayveai/WayveCode#102690`
- Request: fix the open PR review comments in code and do not push.

## Changes
- Replaced the production `assert` for unsupported nav-instructions + missing-route-mask configuration with an early `ValueError` in `RouteMapImageGeneratorIterDataPipe.__init__`.
- Removed redundant route-shortening clips around `segment_idx` and `segment_fraction` after prior bounds checks.
- Added `_first_value` helper and used it for parking stop, parking state, and unparking state scalar extraction.
- Removed the over-defensive non-finite fallback for parking stop offset.
- Renamed deployment helper `_maybe_blackout_map_route` to `_apply_end_of_route_map_blackout` to avoid implying randomness.

## Verification
- Ran AST parse for touched Python files.
- Ran `git diff --check` for touched files.
- Did not run Bazel because `/workspace` was full and Bazel would likely fail writing outputs.

## Notes
- The GitHub review threads had already been resolved before the user clarified they meant code fixes; no push was performed.
