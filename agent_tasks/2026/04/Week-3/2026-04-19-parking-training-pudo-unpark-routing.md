# Port unpark route shortening and early path gating onto parking/training/pudo

This ExecPlan is a living document. The sections `Progress`, `Surprises & Discoveries`, `Decision Log`, and `Outcomes & Retrospective` must be kept up to date as work proceeds.

This document follows `/home/borisindelman/.codex/PLANS.md`.

## Purpose / Big Picture

The goal is to create a new branch from `parking/training/pudo` that keeps the SI parking datamodule path, enables the newer parking defaults from Boris's current branch, preserves route shortening, extends route shortening to unparking, and ports the early path gating fix that avoids dropping path data for parking-related samples. After this change, the parking training config on the new branch should use the non-zoo parking datamodule with the requested defaults, route shortening should apply for both parking and unparking, and path loading should avoid discarding parking-related samples when early gating is enabled.

## Progress

- [x] (2026-04-19 00:00Z) Inspected the source branch `parking/training/pudo`, the current branch `guy/training/pudo_only_bc_3.0.26_aug_cutoff_boris_unpudo_route_clamping`, and the relevant config/datapipe/route files.
- [x] (2026-04-19 00:00Z) Created branch `boris/parking-training-pudo-unpark-routing` from `parking/training/pudo`.
- [x] (2026-04-19 21:00Z) Ported the full bucketed `parking_bc_datamodule_cfg` from `guy/training/pudo_only_bc_3.0.26_aug_cutoff_boris_unpudo_route_clamping` into `wayve/ai/si/configs/parking/parking_config.py`, adapted to `ParkingDataConfig` with `use_zoo_dataloader=False` and the requested defaults, and pointed the parking train modes at the migrated config.
- [x] (2026-04-19 21:00Z) Ported early path gating into the SI parking path and the OTF datapipe, including path clamping support and bad-path skip support.
- [x] (2026-04-19 21:00Z) Extended route shortening in `wayve/ai/lib/data/pipes/routes.py` to prefix-clip the route for `UNPARKING_MODE` using the existing stop anchor.
- [x] (2026-04-19 21:00Z) Added and updated focused regression tests for route prefix clipping, path clamping, early path gating wiring, SI parking anchor emission, and bad-path skip behavior.
- [x] (2026-04-19 21:00Z) Ran targeted Bazel tests for route clipping, path loading, SI parking behavior, OTF route/early-gating wiring, and zoo bad-path filtering.
- [x] (2026-04-19 21:48Z) Submitted parking training job `151595` with `+mode=parking_bc_train_release_2026_5_11 +datamodule=parking_bc_datamodule` and monitored it through platform dispatch.
- [x] (2026-04-19 21:50Z) Recorded the failed run on the Parking/PUDO release page after the job terminated immediately with `healthcheck_failure`.
- [x] (2026-04-20 00:00Z) Committed the branch changes as `9cb57bbc352 feat(parking): port pudo datamodule routing changes` and pushed `boris/parking-training-pudo-unpark-routing` to origin.
- [x] (2026-04-20 00:00Z) Downloaded Surfboard job `151595` logs and root-caused the startup failure to an invalid top-level datamodule kwarg in `parking_bc_datamodule_cfg`.
- [x] (2026-04-20 04:00Z) Removed the invalid top-level `reconstruct_gear_from_speed` kwarg from `parking_bc_datamodule_cfg`, added a config-load regression test, and validated the exact parking config composition path.
- [x] (2026-04-20 05:00Z) Submitted retry job `151669` from fix commit `1940697ea1a` and monitored it until it reached `Running`.
- [x] (2026-04-20 05:00Z) Created a new Parking/PUDO release row for the retry run with status `In training`.

## Surprises & Discoveries

- Observation: `parking/training/pudo` already carries a non-zoo SI parking datamodule and already forces `route_map_options["enable_route_shortening_for_parking"] = True` when the parking config asks for it.
  Evidence: `wayve/ai/si/datamodules/otf.py` on `parking/training/pudo` sets that option before `insert_map_data(...)`.
- Observation: the current Boris branch removed the SI parking datamodule file entirely and uses the zoo `ParkingConfig`, so the early path gating fix has to be transplanted from `otf.py` plus the zoo helper into the non-zoo path.
  Evidence: current branch has `wayve/ai/si/datamodules/otf.py` importing zoo parking helpers, while `parking/training/pudo` still has `wayve/ai/si/datamodules/parking.py`.

## Decision Log

- Decision: keep the target branch on `ParkingDataConfig` and disable the zoo dataloader explicitly in config rather than converting the branch to the newer zoo-only path.
  Rationale: the user asked to make sure the branch uses the non-zoo parking implementation selected by the parking data config.
  Date/Author: 2026-04-19 / Codex
- Decision: port only the behavior requested from the Boris branch: config defaults, early path gating, and unparking route clipping.
  Rationale: this limits divergence from `parking/training/pudo` and keeps the branch reviewable.
  Date/Author: 2026-04-19 / Codex

## Outcomes & Retrospective

Completed on branch `boris/parking-training-pudo-unpark-routing`.

Key outcomes:
- Added a migrated `parking_bc_datamodule_cfg` that keeps the full bucket/weight layout from Boris's current branch while adapting the parking backend to the non-zoo `ParkingDataConfig`.
- Enabled and wired route shortening for both parking and unparking. Parking still suffix-clips to the stop anchor; unparking now prefix-clips from that same anchor.
- Ported the early path gating fix into the SI parking path so parking-related samples can clamp out-of-range paths and skip bad-path rejection when the temporary early flag is set.

Validation run:
- `bazel test //wayve/ai/lib:test_data_pipes_lib_py_test --test_arg=wayve/ai/lib/test/data/pipes/test_generate_route_map.py --test_arg=-k --test_arg=shorten_route_polyline --test_arg=--cov-fail-under=0`
- `bazel test //wayve/ai/lib:test_data_pipes_lib_py_test --test_arg=wayve/ai/lib/test/data/pipes/test_load_paths.py --test_arg=-k='''process_path or load_paths''' --test_arg=--cov-fail-under=0`
- `bazel test //wayve/ai/si/datamodules:py_test --test_arg=wayve/ai/si/datamodules/test/test_parking_unit.py --test_arg=-k='''entry_index or augment_unparking_gear or strip_leading_standstill''' --test_arg=--cov-fail-under=0`
- `bazel test //wayve/ai/si/datamodules:py_test --test_arg=wayve/ai/si/datamodules/test/test_otf.py --test_arg=-k='''early_path_gating_hook or route_shortening_hook''' --test_arg=--cov-fail-under=0`
- `bazel test //wayve/ai/zoo:test_data_py_test --test_arg=wayve/ai/zoo/test/data/test_driving.py --test_arg=-k=filter_bad_paths --test_arg=--cov-fail-under=0`

Residual risk:
- The repo does not expose a dedicated lightweight Bazel target that only imports `wayve/ai/si/configs/parking/parking_config.py`, so the migrated config block is covered indirectly through code-path tests rather than a config-only import test.
- The first training submission on this branch failed before reaching steady-state training due to platform `healthcheck_failure`, so the config has not yet been validated in a live run.

Training run:
- Job id: `151595`
- Session id: `session_2026_04_19_21_48_18_si_parking_bc_train_release_2026_5_11_parking_bc_cfg_port_unpark_clip_early_gate`
- Surfboard nickname: `grateful-tomato-scorpion`
- Final observed state: `Failed`
- Failure reason: `healthcheck_failure`
- Root cause: rank 0 crashed during config registration with `TypeError: Builds_OtfDrivingDataModule.__init__() got an unexpected keyword argument 'reconstruct_gear_from_speed'`. The bad kwarg was added at top level in `wayve/ai/si/configs/parking/parking_config.py` instead of only inside `parking_config=builds(ParkingDataConfig, ...)`.
- Fix commit: `1940697ea1a fix(parking): remove invalid datamodule kwarg`
- WandB: `https://wandb.ai/wayve-ai/parking_bc/runs/session_2026_04_19_21_48_18_si_parking_bc_train_release_2026_5_11_parking_bc_cfg_port_unpark_clip_early_gate`
- Datadog logs: `https://app.datadoghq.eu/logs?query=job_name%3Agrateful-tomato-scorpion-151595&from_ts=1775425978643&cols=job_name%2Cnode_rank&live=true`
- Release row: `https://www.notion.so/34703da5d69a810eaf4bf40872786311`

Follow-up validation:
- `python3 -m py_compile wayve/ai/si/configs/parking/parking_config.py wayve/ai/si/test/configs/test_config.py`
- `bazel test //wayve/ai/si:test_config_py_test_core --test_arg=-k=test_parking_release_config_loads`

Retry training run:
- Job id: `151669`
- Session id: `session_2026_04_20_04_59_22_si_parking_bc_train_release_2026_5_11_parking_bc_cfg_port_unpark_clip_fix_kwarg`
- Surfboard nickname: `scintillating-gold-crab`
- Final observed state: `Running`
- WandB: `https://wandb.ai/wayve-ai/parking_bc/runs/session_2026_04_20_04_59_22_si_parking_bc_train_release_2026_5_11_parking_bc_cfg_port_unpark_clip_fix_kwarg`
- Datadog logs: `https://app.datadoghq.eu/logs?query=job_name%3Ascintillating-gold-crab-151669&from_ts=1775451779880&cols=job_name%2Cnode_rank&live=true`
- Release row: `https://www.notion.so/34803da5d69a8109b62ad8546b8b3df8`

## Context and Orientation

The work spans four files.

`wayve/ai/si/configs/parking/parking_config.py` defines the parking training datamodule configs for this branch. On `parking/training/pudo` it uses `ParkingDataConfig` from `wayve/ai/si/datamodules/parking.py`, and currently that config sets `use_zoo_dataloader=True`, which bypasses the richer SI parking path.

`wayve/ai/si/datamodules/parking.py` is the non-zoo SI parking implementation. It performs parking/unparking detection, parked-to-unpark augmentation, gear augmentation, standstill stripping, and optional route-anchor emission. The switch is `ParkingDataConfig.use_zoo_dataloader`.

`wayve/ai/si/datamodules/otf.py` builds the training datapipe. It controls when path loading happens, when parking data is inserted, and whether route-map options are changed before `insert_map_data(...)`.

`wayve/ai/lib/data/pipes/routes.py` generates route maps. It already knows how to suffix-clip the route to a parking stop anchor. It must be extended to prefix-clip the route from that same anchor when `UNPARKING_MODE` is active.

Early path gating means a cheap, pre-path check that marks parking-related samples before `load_paths(...)`. The path loader and bad-path filter use that temporary flag to avoid throwing away parking samples whose future path is out of range.

## Plan of Work

First update the parking training config in `wayve/ai/si/configs/parking/parking_config.py` so the relevant datamodule config uses `ParkingDataConfig` with `use_zoo_dataloader=False`, `enable_route_shortening_for_parking=True`, `enable_strip_leading_standstill=True`, `enable_augment_standstill_gear=True`, `enable_early_path_gating=True`, `parked_unparking_prob=0.5`, and `unparking_gear_augment_prob=1.0`.

Next extend `ParkingDataConfig` in `wayve/ai/si/datamodules/parking.py` to carry `enable_early_path_gating`. Add a temporary early-flag helper and route-anchor changes so the SI path can emit the same stop anchor for both parking and unparking. Keep the existing anchor convention: parking uses the selected parking entry lookahead index, while unparking reuses the current lookahead anchor.

Then patch `wayve/ai/si/datamodules/otf.py` so when `use_paths` and `parking_config.enable_early_path_gating` are true, it computes the temporary parking-related flag before `load_paths(...)`, passes the flag into path loading and bad-path filtering, and drops the flag after `insert_parking_data(...)`.

Finally extend `wayve/ai/lib/data/pipes/routes.py` so route shortening handles both directions. `PARKING_MODE` keeps the existing suffix clip to the stop anchor. `UNPARKING_MODE` should drop the prefix before the stop anchor, reset the route cursor to the new beginning, and preserve speed-limit alignment.

## Concrete Steps

From `/workspace/WayveCode`:

  1. Edit `wayve/ai/si/configs/parking/parking_config.py` to move the parking config to the non-zoo SI path and set the requested defaults.
  2. Edit `wayve/ai/si/datamodules/parking.py` to add `enable_early_path_gating`, the early-flag helpers, and the unparking route-anchor behavior.
  3. Edit `wayve/ai/si/datamodules/otf.py` to wire early path gating around `load_paths(...)`.
  4. Edit `wayve/ai/lib/data/pipes/routes.py` and the related tests to add prefix clipping for `UNPARKING_MODE`.
  5. Run focused Bazel tests for route map clipping and parking datapipe behavior.

## Validation and Acceptance

Acceptance is:

- the new branch still uses `ParkingDataConfig` from `wayve/ai/si/datamodules/parking.py`, not the zoo-only `ParkingConfig`;
- the relevant training config explicitly requests `use_zoo_dataloader=False` and the requested defaults;
- route shortening is still enabled and now clips both for parking and unparking;
- enabling `enable_early_path_gating` prevents path loading or bad-path filtering from dropping parking-related samples due only to path range issues.

The initial validation commands will be:

  bazel test //wayve/ai/lib:test_data_lib_py_test --test_arg=wayve/ai/lib/test/data/pipes/test_generate_route_map.py --test_arg=-k --test_arg=shorten_route_polyline --test_arg=--cov-fail-under=0

  bazel test //wayve/ai/si/datamodules:test_parking_py_test --test_arg=-k --test_arg=parking

The second command may need adjustment after inspecting the available test target names on this branch.

## Idempotence and Recovery

All edits are additive and local to the new branch `boris/parking-training-pudo-unpark-routing`. Re-running the test commands is safe. If a test target name differs on this branch, discover the correct target with `bazel query` or `rg` rather than broad repo-wide test runs.

## Artifacts and Notes

Branch created:

  git switch -c boris/parking-training-pudo-unpark-routing parking/training/pudo

## Interfaces and Dependencies

The final implementation must preserve these interfaces:

- `wayve.ai.si.datamodules.parking.ParkingDataConfig` remains the config type used in `wayve/ai/si/configs/parking/parking_config.py`.
- `wayve.ai.si.datamodules.parking.insert_parking_data(...)` remains the SI entry point used by `wayve/ai/si/datamodules/otf.py`.
- `wayve.ai.lib.data.pipes.routes.RouteMapFetcher` continues to consume `parking_stop_route_index` and `parking_stop_route_fraction` from `data` and must now apply them for both `PARKING_MODE` and `UNPARKING_MODE`.

Revision note: created the initial plan after branch creation and branch/source inspection so the remaining work can proceed against a fixed scope.
