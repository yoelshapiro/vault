# 2026-03-25 — Route shortening / parking coverage fixes

## Summary
Raised patch coverage for recent route-shortening and parking-related changes by adding focused tests across route-map pipes, OTF datamodule plumbing, and parking deployment wrapper logic.

## Branch
`boris/03-23-park-route-shortening-v2`

## Areas changed
- `wayve/ai/lib/test/data/pipes/test_generate_route_map.py`
- `wayve/ai/si/datamodules/test/test_otf.py`
- `wayve/ai/zoo/deployment/test/test_safety_wrapper.py`

## What was added
- Route shortening tests for:
  - short-route passthrough
  - speed-limit/segment mismatch assertion
  - segment-boundary clipping behavior
  - no-extension past route end
  - fetcher arg validation (`jitter`, `probability`)
  - jitter sampling helper
  - `_fetch_route_map` parking-anchor apply/skip paths
- OTF tests for:
  - lookahead flag forwarding in `make_data_dict_timeslicer`
  - interpolation timeslicer parking/gear extra-context keys
  - train-vs-val forwarding of route-shortening options in `make_driving_pipe`
  - `make_driving_datapipe` parking-stop insertion and route-map options mutation
- Deployment wrapper test for:
  - 5D map-route end-of-route mask behavior in parking-mode derivation

## Verification run
- `bazel test //wayve/ai/lib:test_data_lib_py_test --test_arg=--no-cov --test_arg=wayve/ai/lib/test/data/pipes/test_generate_route_map.py --test_output=errors`
- `bazel test //wayve/ai/si/datamodules:py_test --test_arg=--no-cov --test_arg=wayve/ai/si/datamodules/test/test_otf.py --test_arg=-k --test_arg=route_shortening\ or\ lookahead_flags\ or\ adds_gear_and_parking_lookahead --test_output=errors`
- `bazel test //wayve/ai/zoo/deployment:test_deployment_py_test --test_arg=--no-cov --test_arg=wayve/ai/zoo/deployment/test/test_safety_wrapper.py --test_arg=-k --test_arg=end_of_route_mask --test_output=errors`

## Notes
- `--no-cov` was used for targeted execution under large `py_checks` targets to avoid whole-target coverage fail-under gating during focused validation.
