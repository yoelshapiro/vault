# 2026-06-17 Astonishing No Route-End Latch Deploy

## Summary

Redeployed `astonishing-chocolate-albatross` from branch `codex/guy-recipe-gear-root-amaranth-root` with parking interleave control enabled, while disabling the parking route-end gear latch and route-end hazard-light forcing in the deployment wrapper.

## Worktree

- Worktree: `/workspace/parking_deploy_astonishing_chocolate_albatross`
- Branch: `codex/guy-recipe-gear-root-amaranth-root`
- Base commit: `2612111c8e9d7a3d954e7ff60d57e18ec04eb629`
- Local deploy plumbing changes:
  - `wayve/ai/si/deploy.py`
  - `wayve/ai/si/models/deployment.py`

## Deploy

- Source model: `astonishing-chocolate-albatross`
- Source session: `session_2026_06_13_20_16_20_guyamr4n100k`
- Checkpoint: `100000`
- Deploy suffix: `__astonishing-chocolate-albatross_interleave_control_no_eor_latch_hazards_v1`
- Deployed session: `session_2026_06_13_20_16_20_guyamr4n100k__astonishing-chocolate-albatross_interleave_control_no_eor_latch_hazards_v1`
- Deployed nickname: `coral-snake-substantial-bronze`
- Console: https://console.sso.wayve.ai/model/session_2026_06_13_20_16_20_guyamr4n100k__astonishing-chocolate-albatross_interleave_control_no_eor_latch_hazards_v1

Command flags:

```bash
--enable_interleave_control
--interleave_control_group parking
--enable_end_of_route_gear_latch false
--enable_end_of_route_hazard_lights false
```

Deploy log verification:

```text
wrapper_kwargs={..., 'enable_end_of_route_hazard_lights': False, 'enable_end_of_route_gear_latch': False}
```

Gen2 config verification:

- `INTERLEAVE_GROUP_PARKING` present.
- `interleave_control` present.
- Radar features present: X/Y/Z/range-rate/SNR.
- `points_per_scan` remains `800`.

## Model CI

- Gen2 artefact id: `0fb3b8a6-0d33-4981-9354-94a9d40f34b0`
- Gen1 artefact id: `a0722146-612c-4b98-a6be-9846183dab78`
- Buildkite build: `76415`
- Buildkite id: `019ed510-d97b-4e62-b299-40fbcb286dab`
- Buildkite URL: https://buildkite.com/wayve-dot-ai/model-ci/builds/76415
- Status at last check:
  - `Model Deployment Archive Gen2`: success, finished `2026-06-17T10:13:47`
  - `Eval Studio (Gen 2 Alpha 3)`: success, finished `2026-06-17T10:14:42`

## Notes

- ONNX artefact upload reported the known non-fatal validation path because ONNX export was disabled.
- Blob logging back to the source training session was disabled by Azure write permissions.
- The deploy-plumbing changes are local only; no commit or push was made in this task.
