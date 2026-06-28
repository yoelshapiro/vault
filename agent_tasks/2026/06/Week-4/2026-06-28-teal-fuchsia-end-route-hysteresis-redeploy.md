# 2026-06-28 Teal/Fuchsia End-Route Hysteresis Redeploy

## Summary
- Redeployed `teal-ecstatic-magpie` and `fuchsia-vampire-bat-jubilant` from their training commits with parking interleave control and group `parking`.
- Added route-end hysteresis for parking interleave control: enter parking route handover below `END_OF_ROUTE_THRESHOLD = 2.5e4`; release route handover only at `END_OF_ROUTE_RELEASE_THRESHOLD = 3e4`. Speed handover behavior remained unchanged.
- Enabled parking end-of-route hazard lights and gear latch defaults.
- Fixed a TorchScript issue exposed by the additional persistent state by making `PersistentStateBuffer.to_device()` side-effect-only (`None` return).

## Worktrees
- `/tmp/redeploy-teal-ecstatic-magpie` at `bd3068a2908a97b2bc7670b5d1cc759ca06f5fda`
- `/tmp/redeploy-fuchsia-vampire-bat-jubilant` at `5a42369a6faa05c70573d1541e0dfef056d6dd12`

## Deployments
- `teal-ecstatic-magpie`
  - Source session: `session_2026_06_27_21_39_49_noaug75c05`
  - Output session: `session_2026_06_27_21_39_49_noaug75c05__teal-ecstatic-magpie_interleave_control_eor_hysteresis_latches_v1`
  - Console: https://console.sso.wayve.ai/model/session_2026_06_27_21_39_49_noaug75c05__teal-ecstatic-magpie_interleave_control_eor_hysteresis_latches_v1
- `fuchsia-vampire-bat-jubilant`
  - Source session: `session_2026_06_27_21_58_32_nostaug0`
  - Output session: `session_2026_06_27_21_58_32_nostaug0__fuchsia-vampire-bat-jubilant_interleave_control_eor_hysteresis_latches_v1`
  - Console: https://console.sso.wayve.ai/model/session_2026_06_27_21_58_32_nostaug0__fuchsia-vampire-bat-jubilant_interleave_control_eor_hysteresis_latches_v1

## Validation
- `python3 -m py_compile` passed for `deployment_wrapper.py` and `persistent_state.py` in both worktrees.
- Both deploys saved TorchScript traces and exited 0 after Console upload success.
- Both generated Gen2 configs contain `interleave_control`, `INTERLEAVE_GROUP_PARKING`, radar features `X/Y/Z/range_rate/SNR`, and `points_per_scan: 800`.

## Notes
- The deploy script emitted a non-fatal `/session:artefacts_upload` pydantic validation error for ONNX artefacts because ONNX export was disabled; both deploy commands still exited 0 and printed Console upload success.
- Local Azure CLI cache had a stale `msal_http_cache.bin` issue. Teal succeeded with an isolated Azure config copy; fuchsia additionally required seeding the local ai-lib checkpoint cache from the blobfuse mount.
