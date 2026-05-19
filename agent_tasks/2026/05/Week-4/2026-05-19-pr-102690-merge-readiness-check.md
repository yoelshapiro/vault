# PR 102690 Merge Readiness Check

- Date: 2026-05-19
- Branch: `boris/03-23-park-route-shortening-v2`
- PR: `102690`
- Change type: PR triage / test verification
- Areas: `wayve/ai/lib/data/pipes/`, `wayve/ai/si/datamodules/`, `wayve/ai/zoo/data/`, `wayve/ai/zoo/deployment/`

## Summary

Checked the active parking route-shortening PR after session loss. The PR is open, mergeable at the GitHub merge-base level, but was not ready to merge because required review was still missing and several required CI contexts were failing.

Follow-up blocker fixes were applied locally for the stale SI parking tests, unparking route speed-limit clipping, and `UNPARKING_STATE` / `UNPARKING_MODE` compatibility.

## Findings

- Local branch is one commit behind `origin/boris/03-23-park-route-shortening-v2`; the missing remote commit is a formatting commit.
- Tracked local tree has no modifications. Untracked local leftovers exist under `.claude/`, `tools/parking_model_diagram/`, and `wayve/ai/parking/model_analysis/`; these are not part of PR 102690.
- PR status:
  - `mergeable`: `MERGEABLE`
  - `reviewDecision`: `REVIEW_REQUIRED`
  - Buildkite presubmit contexts failing: `buildkite/presubmit`, `cpu suite`, `integration-cpu suite`, `integration-gpu suite`, `integration-heavy-gpu suite`
  - `coverage suite` was pending when checked
  - Codecov comment reports patch coverage `59.12409%`, below the `80.00%` target.
- Buildkite MCP log access failed with `Auth required`, so CI logs could not be fetched through MCP.

## Local Verification

Ran:

```bash
bazel test //wayve/ai/si/datamodules:py_test --test_arg=wayve/ai/si/datamodules/test/test_parking_unit.py
```

Result: failed during pytest collection.

Key error:

```text
ImportError: cannot import name 'ParkingModeResult' from 'wayve.ai.si.datamodules.parking'
```

This matches the diff: `wayve/ai/si/datamodules/parking.py` now exposes `ParkingStateResult` / `add_parking_state`, while `test/test_parking_unit.py` still imports and asserts against the old `ParkingModeResult` / `add_parking_mode` API.

## Code Review Notes

- `wayve/ai/lib/data/pipes/routes.py` has an unparking route-shortening bug in `_shorten_route_polyline_from_stop`: mid-segment clipping duplicates the next segment speed limit and drops the current segment speed. The speed limit tuple should preserve `speed_tuple[segment_idx]` for the partial segment.
- SI datapipe now writes `UNPARKING_STATE` but no longer writes `UNPARKING_MODE`; `wayve/ai/si/metrics/parking_metrics.py` still consumes `UNPARKING_MODE`, so unparking samples may disappear from parking metrics unless backward compatibility or metric migration is added.
- `ParkingDataConfig.use_zoo_dataloader` default changed from `True` to `False`, but the `insert_parking_data` docstring still says the zoo path is the default.

## Recommended Next Steps

- Update `test_parking_unit.py` for the new state API, or add compatibility aliases if the old API is still intended to be supported.
- Fix `_shorten_route_polyline_from_stop` speed-limit slicing and add a regression test for the unparking mid-segment case.
- Decide whether `UNPARKING_MODE` should remain as a compatibility output. If not, update parking metrics and downstream consumers to read `UNPARKING_STATE`.
- Resolve required reviews and rerun / inspect the failing Buildkite contexts after the deterministic local test blocker is fixed.

## Fixes Applied

- Updated `wayve/ai/si/datamodules/test/test_parking_unit.py` from the deleted `ParkingModeResult` / `add_parking_mode` API to the current `ParkingStateResult` / `add_parking_state` API.
- Fixed `_shorten_route_polyline_from_stop` in `wayve/ai/lib/data/pipes/routes.py` so a mid-segment unparking route clip preserves the current segment speed limit.
- Added a regression test for the partial-segment unparking speed-limit case in `wayve/ai/lib/test/data/pipes/test_generate_route_map.py`.
- Removed the stale `UNPARKING_MODE` compatibility path from the PR-side code and migrated route shortening, metrics, and SI tests to `UNPARKING_STATE`.
- Corrected the SI parking datapipe docstring that still claimed the zoo dataloader path was the default.

## Verification After Fixes

Ran:

```bash
git diff --check
bazel test //wayve/ai/si/datamodules:py_test --test_arg=wayve/ai/si/datamodules/test/test_parking_unit.py
bazel test //wayve/ai/si:test_parking_metrics
bazel test //wayve/ai/lib:test_data_pipes_lib_py_test --test_arg=wayve/ai/lib/test/data/pipes/test_generate_route_map.py::test_shorten_route_polyline_from_stop_preserves_partial_segment_speed_limit --test_arg=--no-cov
bazel test //wayve/ai/si:test_bokeh_visualise
```

Results: all passed.

One earlier aggregate route-map run without `--no-cov` executed all 39 selected pytest tests successfully, then failed the Bazel target's coverage threshold because only one file was selected from a larger coverage-enforced target.

The only remaining `UNPARKING_MODE` reference under `wayve/ai` is the global key constant in `wayve/ai/zoo/data/keys.py`; it is not emitted or consumed by this PR path.

## Main Merge Check

Merged latest `origin/main` into `boris/03-23-park-route-shortening-v2` on 2026-05-19. The merge completed cleanly with no conflicts.

Post-merge verification:

```bash
git diff --check
bazel test //wayve/ai/si/datamodules:py_test --test_arg=wayve/ai/si/datamodules/test/test_parking_unit.py
bazel test //wayve/ai/si:test_parking_metrics
bazel test //wayve/ai/lib:test_data_pipes_lib_py_test --test_arg=wayve/ai/lib/test/data/pipes/test_generate_route_map.py::test_shorten_route_polyline_from_stop_preserves_partial_segment_speed_limit --test_arg=--no-cov
bazel test //wayve/ai/si:test_bokeh_visualise
```

Results: all passed.

Pushed merge commit `a63d2c8c825a` to the PR branch. GitHub checks were pending after the new push, and the PR still required review.
