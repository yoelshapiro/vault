# 2026-06-14 Parking Deployment Gear Indicator Port

- Branch: `codex/guy-recipe-gear-root-amaranth-root`
- Source branch: `boris/training/main_cherrypick_generic_data`
- Change type: Code change, tests
- Areas: `wayve/ai/zoo/deployment/deployment_wrapper.py`, `wayve/ai/si/test/interfaces/test_deployment_wrapper.py`

## Summary

- Ported the parking-specific gear and indicator deployment handling from `boris/training/main_cherrypick_generic_data`.
- Added `DrivingOutputWithGearOutput` so parking deployment explicitly returns `policy_gear_position`.
- Added route-end hazard indicator forcing for parking deployment outputs, with `enable_end_of_route_hazard_lights`.
- Added route-end park gear latching through `PersistentStateBuffer`, with `enable_end_of_route_gear_latch`.
- Kept the existing gear-direction to DrivePositionV2 conversion and waypoint clamping path, now applying the latch before waypoint enforcement.

## Validation

- `git diff --check -- wayve/ai/zoo/deployment/deployment_wrapper.py wayve/ai/si/test/interfaces/test_deployment_wrapper.py` passed.
- `bazel test //wayve/ai/si:test_deployment_wrapper --test_arg=-k --test_arg='parking'` passed.

## Deployment follow-up

- Pushed commits:
  - `afca3080ab87` `fix: add parking deployment gear indicator handling`
  - `e7a29ee76203` `fix: make parking interleave thresholds scriptable`
  - `2612111c8e9d` `fix: script parking interleave gear outputs`
- Deployed source model `astonishing-chocolate-albatross` from checkpoint `model-checkpoint-000100000.ckpt`.
- Deployed nickname: `moccasin-vivid-caterpillar`.
- Deployed session: `session_2026_06_13_20_16_20_guyamr4n100k__astonishing-chocolate-albatross_interleave_control_v3`.
- Gen2 artefact id: `1f51293f-657d-4fc6-87ea-cf7544c2b6d7`.
- Verified Gen2 radar config includes X/Y/Z/range-rate/SNR with `points_per_scan=800` and `interleave_group=INTERLEAVE_GROUP_PARKING`.
- Triggered Alpha3 Model CI build `75970`; initial readback showed deployment archive and Eval Studio Alpha3 passed, HiL validation in progress.
- Updated the Parking/PUDO Notion model-card row/page for `moccasin-vivid-caterpillar`.
- Console lifecycle note is blocked until Console auth is refreshed: saved `_oauth2_proxy` redirected to login, internal note API returned `401 User authorisation required`.
