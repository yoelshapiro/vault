# 2026-06-07 Parking Interleave Clamp Redeploy

- Branch: `boris/parking-past30-no-standstill-gear-aug/main_cherrypick_new_driving`
- Commit: `c39bd6c4d494506580acf0110a09259d295486e6`
- Source model: `gorilla-tan-splendid`
- Source session: `session_2026_06_06_21_38_04_pgearfix2`
- Deployed model: `crane-indigo-sleepy`
- Deployed session: `session_2026_06_06_21_38_04_pgearfix2__gorilla-tan-splendid_interleave_control_v2`
- Gen2 artefact: `0a8d25b9-3d8d-4acf-b7f1-8729c6e70c67`
- Console: https://console.sso.wayve.ai/model/session_2026_06_06_21_38_04_pgearfix2__gorilla-tan-splendid_interleave_control_v2

## Changes

- Aligned parking interleave-control waypoint clamping with `03-20-si-group-interleave-control-support`.
- Parking interleave control now clamps policy waypoints using the effective predicted/postprocessed gear.
- Removed the extra `POLICY_PATH_POSITION_FORWARD` clamp from this branch because the simulation issue was on policy waypoints and the reference branch does not use that path-position-forward mutation.

## Verification

- Ran `bazel test //wayve/ai/zoo/deployment:test_deployment_py_test`.
- Deployed latest/100K checkpoint with `--enable_interleave_control --interleave_control_group parking`.
- Verified exported Gen2 radar config has X/Y/Z/range-rate/SNR and `points_per_scan=800`.

## Notes

- Explicit `--with_temporal_caching True` failed for this release-style config because it injects `video_enable_cache_at_inference` into `load_pretrained_backbone`; the successful deploy left temporal caching at the trained-model default.
- Console upload succeeded, but the deploy log emitted a non-fatal ONNX artefact upload validation warning after the successful model upload.
