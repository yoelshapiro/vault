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

## Short Path Config

Enabled `allow_short_path=True` on `parking_pudo_bc_datamodule_D26_3_cfg` in `wayve/ai/si/configs/parking/parking_config.py`. The derived D26.3 parking/PUDO datamodule variants inherit this setting.

Also set `odometry_source="wheel_imu"` on the same D26.3 parking datamodule config so the parking/PUDO training config uses IMU odometry supervision explicitly instead of inheriting the generic wheel-odometry default.

## Unparking Route Jitter Guard

Confirmed that route-stop jitter is sampled only for parking route shortening, not for unparking:

- `wayve/ai/si/datamodules/parking.py` emits `_parking_stop_route_offset_m = 0.0` for `UNPARKING_STATE`.
- `wayve/ai/lib/data/pipes/routes.py` uses `_shorten_route_polyline_from_stop` for `UNPARKING_STATE` and only passes `stop_route_offset_m` to the parking `_shorten_route_polyline_to_stop` path.

Added regression coverage:

- `test_parking_stop_route_position_does_not_jitter_unparking`
- `test_planned_route_fetch_route_map_ignores_offset_for_unparking`

Verification:

```bash
git diff --check
bazel test //wayve/ai/si:test_config_py_test_test_configs_utils_load_config_works_after_full_registration
bazel test //wayve/ai/si/datamodules:py_test --test_arg=wayve/ai/si/datamodules/test/test_parking_unit.py
bazel test //wayve/ai/lib:test_data_pipes_lib_py_test --test_arg=wayve/ai/lib/test/data/pipes/test_generate_route_map.py::test_planned_route_fetch_route_map_ignores_offset_for_unparking --test_arg=--no-cov
```

Results: passed.

Note: a one-test SI datamodule run for `test_parking_stop_route_position_does_not_jitter_unparking` passed the selected pytest test but failed the target-level coverage gate because only one test was selected. The full parking unit file passed.

## AI Lib Key Dependency Follow-Up

Addressed PR feedback on `wayve/ai/lib/data/pipes/routes.py`: `wayve.ai.lib` should not depend on `wayve.ai.zoo` just for data-key constants.

Changes:

- Removed `from wayve.ai.zoo.data import keys as DataKeys` from `routes.py`.
- Re-declared the small set of route-shortening string keys locally in `routes.py`.
- Removed the same zoo key import from `wayve/ai/lib/test/data/pipes/test_generate_route_map.py` and used local string constants in the tests.

Verification:

```bash
rg -n "wayve\\.ai\\.zoo|DataKeys" wayve/ai/lib/data/pipes/routes.py wayve/ai/lib/test/data/pipes/test_generate_route_map.py
git diff --check
bazel test //wayve/ai/lib:test_data_pipes_lib_py_test --test_arg=wayve/ai/lib/test/data/pipes/test_generate_route_map.py::test_planned_route_fetch_route_map_ignores_offset_for_unparking --test_arg=wayve/ai/lib/test/data/pipes/test_generate_route_map.py::test_planned_route_fetch_route_map_shortens_without_speed_limits --test_arg=--no-cov
```

Results: grep found no matches; diff check and Bazel test passed.

## CI Monitoring

Monitored PR 102690 presubmit in tmux after pushing merge commit `add3a4e791ae`.

Initial Buildkite build `482695` had failed in lint on an out-of-scope generated OpenAPI path under `wayve/services/fleet360/generated`, while also reporting high disk usage on the agent. Buildkite retry/create permissions were unavailable from this environment, so the branch was refreshed with latest `origin/main` and pushed to trigger a fresh presubmit.

Fresh Buildkite build `482724` passed:

```bash
gh pr checks 102690 --watch=false
```

Result: `buildkite/presubmit` passed in 38m55s, with all Buildkite suites green including lint, static-check, cpu, gpu, integration, result-summary, and coverage. No additional CI-fix commit was needed after the fresh run.

## PR Description Refresh

Updated PR 102690 description after CI passed to reflect the current branch state:

- train-time parking route shortening instead of route-map blackout
- explicit `PARKING_STATE`, `PARKED_STATE`, and `UNPARKING_STATE` semantics
- no parking stop-route jitter on unparking route shortening
- D26.3 parking config updates for `allow_short_path=True` and `odometry_source="wheel_imu"`
- removal of the `wayve.ai.zoo` data-key dependency from the AI lib route pipe
- current focused Bazel verification and passing Buildkite presubmit `482724`

## Zoo Parking Revert

Removed the PR-side route-shortening changes from `wayve/ai/zoo/data/parking.py` so the legacy zoo parking datapipe stays at the `origin/main` implementation while it is slated for later deprecation.

Follow-up edits:

- stopped the SI wrapper from forwarding `distance_threshold_jitter_m` and `store_entry_index` into the zoo parking path
- removed zoo parking tests that only covered the deleted route-shortening entry-index/stop-route helpers
- kept the SI-local parking stop route-position implementation and route-map consumer tests intact

Verification:

```bash
git diff --check
bazel test //wayve/ai/zoo/data:test_zoo_data_py_test --test_arg=wayve/ai/zoo/data/test/test_parking.py
bazel test //wayve/ai/si/datamodules:py_test --test_arg=wayve/ai/si/datamodules/test/test_parking_unit.py --test_arg=wayve/ai/si/datamodules/test/test_otf.py --test_arg=--no-cov
```

Results: all passed. A prior run of the same SI test selection without `--no-cov` executed all selected tests successfully but failed the target-level coverage gate because it did not run the full coverage-enforced target.

## Route Context Variant Prototype

Implemented, tested, and then reverted without committing an SI-only weighted route-context variant mechanism for parking augmentation because the approach was too complicated for the current PR.

Shape:

- added `ParkingRouteContextVariant`
- added optional `ParkingDataConfig.route_context_variants`
- when variants are configured, one variant is sampled per sample and controls:
  - model-facing `PARKING_MODE` emission for parking / parked state
  - parking route shortening
  - end-of-route blackout
  - end-of-route navigation cleanup
- kept existing scalar booleans as the backwards-compatible behavior when variants are unset
- kept variants unsupported on the legacy zoo dataloader path

Verification:

```bash
git diff --check
bazel test //wayve/ai/si/datamodules:py_test --test_arg=wayve/ai/si/datamodules/test/test_parking_unit.py --test_arg=wayve/ai/si/datamodules/test/test_otf.py --test_arg=--no-cov
bazel test //wayve/ai/si/datamodules:py_lint_ruff //wayve/ai/si/datamodules:py_lint_flake8
bazel test //wayve/ai/si:test_config_py_test_test_configs_utils_load_config_works_after_full_registration
bazel test //wayve/ai/si/datamodules:ty
```

Results: all passed.

Final state: reverted from the workspace. No committed code changes remain from this prototype.

## Fixed Park-Mode Blackout Sampling

Implemented a simpler fixed two-arm config knob on `ParkingDataConfig`:

- `park_mode_blackout_probability=None` keeps the existing scalar booleans unchanged
- `park_mode_blackout_probability=p` samples per training sample:
  - probability `p`: emit park mode and allow end-of-route blackout, while disabling route shortening for that sample
  - probability `1-p`: suppress park mode and use route shortening, while disabling blackout for that sample
- `p=1.0` is supported and avoids wiring route-shortening entry-index storage
- validation keeps the value finite and in `[0, 1]`
- non-train datapipes reset the probability to `None` alongside the existing val-time route-end disablement
- the legacy zoo parking dataloader rejects this SI-only option

Verification:

```bash
git diff --check
bazel test //wayve/ai/si/datamodules:py_test --test_arg=wayve/ai/si/datamodules/test/test_parking_unit.py --test_arg=wayve/ai/si/datamodules/test/test_otf.py --test_arg=--no-cov
bazel test //wayve/ai/si/datamodules:py_lint_ruff //wayve/ai/si/datamodules:py_lint_flake8
bazel test //wayve/ai/si:test_config_py_test_test_configs_utils_load_config_works_after_full_registration
bazel test //wayve/ai/si/datamodules:ty
```

Results: all passed.
