# Interleaving Stopping Wrapper: Map Blackout On Park Mode

- Date: 2026-02-25
- Branch: `boris/interleaved/updated_pudo_15_02_26`
- PR: none
- Change type: code
- Areas: `wayve/ai/zoo/deployment/interleaving_stopping_wrapper.py`

## What changed
- Added TorchScript helper `_blackout_map_route_if_enabled(map_route, enabled)`.
- In inference forward pass, when `initiate_auto_park == 1`, set `map_route_for_model = torch.zeros_like(map_route)` and pass it to both baseline and primary model call paths (including first-pass warmup calls).
- Added logging for blackout state transitions:
  - `map_route_blackout changed: <bool>`
  - Included `map_blackout: <bool>` in model switch print.
- Updated existing force-autopark print to include blackout context:
  - `forcing initiate_auto_park due to no_route; map_route_blackout: True`

## Validation
- `bazel build //wayve/ai/zoo/deployment:deployment` passed.

## Notes
- No commit created.
