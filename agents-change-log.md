# Agents Change Log

### Parking/PUDO anchor mismatch debug
- Labels: parking, pudo, generic-materialization, debugging
- Branch: `boris/pudo_generic_materialization`
- PR: draft PR in progress
- Change type: fix/debug
- Areas: `wayve/ai/services/sampling/datasets/parking_pudo/signals.py`, event viewer comparison
- Changes:
  - Investigated `dc_pudo_uk` mismatches between event-table rows and generic anchor output.
  - Found stale Streamlit comparison root versus the still-running `3.0.68` Flyte execution.
  - Removed backward stop-snapping from generic park/PUDO anchors so anchors stay at smoothed gear-to-park.
  - Verified representative shifted and generic-extra samples with `debug_sampling`.
  - Notes: [[agent_tasks/2026/06/Week-2/2026-06-09-parking-pudo-anchor-mismatch-debug]]

## 2026-06-09 - Parking PUDO Anchors Driving 3.0.68 Rerun

- Topic: Rerun generic parking/PUDO anchors with driving binary `3.0.68`.
- Labels: parking, pudo, generic-materialization, anchors, flyte, binary-data.
- Branch: `boris/pudo_generic_materialization`.
- PR: Draft PR branch context; not pushed in this task.
- Change type: Code config change / image publish / Flyte run.
- Areas: `/workspace/WayveCode/wayve/ai/services/sampling/datasets/parking_pudo`.
- Changes:
  - Updated `parking_pudo/default` and `parking_pudo/anchors` to `binary_version="3.0.68"`.
  - Updated both dataset configs to `start_date="2025-12-01"` and `end_date="2026-06-07"`.
  - Published sampling image `wayveacrprodflyte.azurecr.io/sampling:bpudo3068-20260609`.
  - Submitted full `sample` workflow for `parking_pudo/anchors`, execution `ax4kdrxxjztvzvcxqxp2`.
- Task note: [[agent_tasks/2026/06/Week-2/2026-06-09-parking-pudo-anchors-driving-3068-rerun|2026-06-09 Parking/PUDO Anchors Driving 3.0.68 Rerun]]

## 2026-06-09 - Event Viewer Date Range

- Topic: Filter parking event-viewer tables and anchor materialization rows to `2025-12-01 <= run_date < 2026-05-17`.
- Labels: parking, pudo, streamlit, anchors, event-table.
- Branch: `boris/pudo_generic_materialization`.
- PR: Draft PR branch context; not pushed in this task.
- Change type: Tool code change.
- Areas: `/workspace/WayveCode/wayve/ai/parking/tools/event_clip_viewer`.
- Changes:
  - Added `MIN_EVENT_RUN_DATE = "2025-12-01"` and `MAX_EVENT_RUN_DATE_EXCLUSIVE = "2026-05-17"` to the viewer config.
  - Applied the cutoff to event-table SQL, materialization anchor parquet loading, and app-level normalization.
  - Bumped the local anchor cache key version so older cached anchor reads are not reused.
  - Verified `git diff --check`, viewer `py_checks`, and HTTP 200 on port 3001.
- Task note: [[agent_tasks/2026/06/Week-2/2026-06-08-event-clip-viewer-anchor-comparison|2026-06-08 Event Clip Viewer Anchor Comparison]]

## 2026-06-09 - Parking PUDO Anchor Comparison Rerun

- Topic: Rerun generic parking/PUDO anchors with temporary event-table comparison filters.
- Labels: parking, pudo, generic-materialization, anchors, trip-events, flyte.
- Branch: `boris/pudo_generic_materialization`.
- PR: Draft PR branch context.
- Change type: Code implementation / data rerun.
- Areas: `/workspace/WayveCode/wayve/ai/services/sampling/datasets/parking_pudo`.
- Changes:
  - Documented that event-notebook-only geofences and relaxed DC `inferred__intervention__what` filtering are temporary comparison choices.
  - Changed trip-table matching to 100m and synthesized hazard context over matched parked segments for forgotten-hazard PUDO cases.
  - Kept trip-only overlap buckets for debugging and CA/pre-CA out-of-scope filtering unchanged.
  - Verified sampling py_checks, published sampling image `wayveacrprodflyte.azurecr.io/sampling:borisindel-tmp-build-0.1.125-boris-pudo_generic_materialization-59584`, and submitted full anchors `sample` execution `a6vp6f5srkrncnt8k4g7`.
- Task note: [[agent_tasks/2026/06/Week-2/2026-06-09-parking-pudo-anchor-comparison-rerun|2026-06-09 Parking PUDO Anchor Comparison Rerun]]

## 2026-06-09 - Event Viewer Debug Runner Removal

- Topic: Remove the slow inline `debug_sampling` runner from the parking event viewer.
- Labels: parking, pudo, streamlit, anchors, debug-sampling.
- Branch: `boris/pudo_generic_materialization`.
- PR: Draft PR branch context; not pushed in this task.
- Change type: Tool/UI code change.
- Areas: `/workspace/WayveCode/wayve/ai/parking/tools/event_clip_viewer`.
- Changes:
  - Removed missing-anchor `debug_sampling` buttons and subprocess execution from the Streamlit app.
  - Kept anchor comparison tables and clip-player browsing.
  - Verified viewer py_checks and restarted Streamlit on `http://127.0.0.1:3001`.
- Task note: [[agent_tasks/2026/06/Week-2/2026-06-08-event-clip-viewer-anchor-comparison|2026-06-08 Event Clip Viewer Anchor Comparison]]

## 2026-06-08 - Parking PUDO Trip Context Anchors

- Topic: Add trip-table PUDO context to generic parking/PUDO anchors and rerun full anchors materialisation.
- Labels: parking, pudo, generic-materialization, anchors, trip-events, flyte.
- Branch: `boris/pudo_generic_materialization`.
- PR: Draft PR branch context; not pushed in this task.
- Change type: Code implementation / data rerun.
- Areas: `/workspace/WayveCode/wayve/ai/services/sampling/datasets/parking_pudo`.
- Changes:
  - Removed the temporary `parking_pudo/anchors_dc_pudo_uk` debug-only dataset and registration.
  - Confirmed missing sample `fme20014/2026-05-29--05-57-48...` is a DC UK gear-to-park stop with indicator off and completed dropoff trip events at the same location.
  - Added trip-table context from `inferred__robotaxi.trip_events`, aggregated per run before joining to avoid duplicating corpus frames.
  - Main PUDO/UnPUDO selectors now use cleaned hazard OR completed pickup/dropoff trip context; trip-only debug overlap buckets were added for `dc_pudo`, `dc_unpudo`, and `dc_pre_unpudo`.
  - Verified formatting and scoped parking/PUDO sampling tests, published sampling image `sha256:640f413f20cb9b46b7e59b35f42342ff08c0edecfd4950e3294765dc9bc444b6`, and submitted full anchors `sample` execution `a4hm2jqk2m4ntvrjjggb`.
- Task note: [[agent_tasks/2026/06/Week-2/2026-06-08-parking-pudo-anchor-gap-debug|2026-06-08 Parking PUDO Anchor Gap Debug]]

## 2026-06-08 - PUDO Generic Materialization Viewer Port

- Topic: Rebase `boris/pudo_generic_materialization` to main and port anchor comparison/debug viewer support.
- Labels: parking, pudo, generic-materialization, streamlit, anchors, debug-sampling.
- Branch: `boris/pudo_generic_materialization`.
- PR: Draft PR branch context; not pushed in this task.
- Change type: Branch maintenance / tool UI code change.
- Areas: `/workspace/WayveCode/wayve/ai/parking/tools/event_clip_viewer`, `/workspace/WayveCode/wayve/ai/services/sampling/datasets/debug_sampling.py`.
- Changes:
  - Rebasing skipped generated autopublish `bump-versions` conflicts and preserved the `700` run-id partition cap.
  - Added the event-table vs anchor comparison source to the main-folder viewer, defaulting to `dc_pudo_uk`.
  - Ported missing-event `debug_sampling` controls so Streamlit can run single-run/timestamp sampling diagnostics.
  - Verified `py_compile`, `git diff --check`, `bazel test //wayve/ai/parking/tools/event_clip_viewer:py_checks`, and HTTP 200 on port 3001.
- Task note: [[agent_tasks/2026/06/Week-2/2026-06-08-event-clip-viewer-anchor-comparison|2026-06-08 Event Clip Viewer Anchor Comparison]]

## 2026-06-08 - Parking PUDO Anchor Gap Debug

- Topic: Investigate why generic `dc_pudo_uk` anchors are much lower than the event notebook table.
- Labels: parking, pudo, generic-materialization, anchors, databricks.
- Branch: `boris/pudo_generic_materialization`.
- PR: N/A.
- Change type: Debugging / data analysis.
- Areas: `/workspace/WayveCode/wayve/ai/services/sampling/datasets/parking_pudo`.
- Changes:
  - Compared `51,355` deduped UK PUDO event-table rows against `13,219` local generic `dc_pudo_uk` anchors.
  - Split missing rows into `30,827` from runs with no generic anchor and `12,906` from runs with a different generic anchor timestamp.
  - Sampled missing rows against Databricks quality inputs and found active `low_steering_bias_confidence` and allowed-run-tag filters explain many no-anchor misses.
  - Computed nearest-anchor deltas showing many same-run misses are small timestamp offsets rather than missing events.
  - Replayed generic signal logic on quality-passing examples and found true PUDO/park classification differences where `park_start - 1` hazard context is false.
- Task note: [[agent_tasks/2026/06/Week-2/2026-06-08-parking-pudo-anchor-gap-debug|2026-06-08 Parking PUDO Anchor Gap Debug]]

## 2026-06-07 - Bazel Cache Cleanup Script

- Topic: Add a safe helper for deleting unused Bazel cache folders across multiple worktrees.
- Labels: bazel, cleanup, tooling, worktrees.
- Branch: `boris/pudo_generic_materialization`.
- PR: N/A.
- Change type: Tooling script.
- Areas: `/workspace/WayveCode/tools/delete_unused_bazel_caches.sh`.
- Changes:
  - Added a standalone script that maps current Git worktrees to exact Bazel output bases with `bazel info output_base`.
  - Keeps output-base directories used by current worktrees or referenced by live process command lines.
  - Prints a deletion plan and requires typing `DELETE` before running `sudo rm -rf`.
  - Leaves the shared repository cache alone by default, with an explicit `--include-repository-cache` option.
  - Verified help output, Bash syntax, and an aborting dry run; `shellcheck` was unavailable locally.
- Task note: [[agent_tasks/2026/06/Week-1/2026-06-07-bazel-cache-cleanup-script|2026-06-07 Bazel Cache Cleanup Script]]

## 2026-06-07 - Event Clip Viewer Rebase Reset

- Topic: Rebase `boris/event_clip_viewer` onto main and reset the event viewer subtree to main.
- Labels: parking, pudo, streamlit, git, rebase.
- Branch: `boris/event_clip_viewer`.
- PR: `#116721` branch context; not pushed in this task.
- Change type: Branch maintenance.
- Areas: `/workspace/event_clip_viewer/wayve/ai/parking/tools/event_clip_viewer`.
- Changes:
  - Rebased the existing `/workspace/event_clip_viewer` worktree branch onto `origin/main`.
  - Resolved event viewer add/add conflicts by restoring `wayve/ai/parking/tools/event_clip_viewer` from `origin/main`.
  - Added local commit `39c5f4c3814d` (`fix: restore event clip viewer from main`) so the event viewer path has no net diff against `origin/main`.
  - Verified `origin/main` is an ancestor of `HEAD` and both branch-level and path-specific diffs against `origin/main` are empty.
- Task note: [[agent_tasks/2026/06/Week-1/2026-06-07-event-clip-viewer-rebase-reset|2026-06-07 Event Clip Viewer Rebase Reset]]

## 2026-06-07 - Gear-Aware Controller X Validation

- Topic: Clarify controller agent-input x-position validation using predicted gear and controller-frame x convention.
- Labels: parking, pudo, controller, validation, reverse-gear.
- Branch: `codex/gear-aware-controller-x-validation`.
- PR: `#117112`.
- Change type: Controller validation fix.
- Areas: `/workspace/codex_gear_aware_controller_x_validation/wayve/robot/core/controller`.
- Changes:
  - Forked from `origin/main` in a clean worktree.
  - Confirmed `checkAgentToControllerXPositions` runs on controller-frame waypoints after reverse preprocessing, so x-position validation remains forward/non-negative for all predicted gears.
  - Kept `UNKNOWN` drive position rejected before x-position validation.
  - Added regression coverage for reverse predicted gear passing with controller-frame forward x and failing with negative controller-frame x.
  - Updated the x-position violation message to include the predicted drive position and expected controller-frame x-position convention.
  - Verified `bazel test //wayve/robot/core/controller:test_trajectory_validation` and `bazel test //wayve/robot/controller:controller_prod_reverse_integration_tests`.
- Task note: [[agent_tasks/2026/06/Week-1/2026-06-07-gear-aware-controller-x-validation|2026-06-07 Gear-Aware Controller X Validation]]

## 2026-06-07 - Mercurial Interleave Redeploy

- Topic: Redeploy the Guy-recipe gear-root Parking/PUDO model with interleave control group parking.
- Labels: parking, pudo, deployment, interleave-control, model-card.
- Branch: `boris/parking-past30-no-standstill-gear-aug/guy_recipe_gear_root`.
- PR: N/A.
- Change type: Model redeploy.
- Areas: `/workspace/guy_recipe_gear_root`, Parking/PUDO model-card Notion table.
- Changes:
  - Resolved `mercurial-sapphire-jellyfish` to `session_2026_06_06_22_07_21_guyroot`.
  - Deployed latest/100K checkpoint with `--enable_interleave_control --interleave_control_group parking`.
  - Retried after `/mnt/remote` trace write I/O failure and `/tmp` space failure; successful output used `/workspace/parking_deploy_output`.
  - Uploaded deployed model `contemplative-gold-lion`, session `session_2026_06_06_22_07_21_guyroot__mercurial-sapphire-jellyfish_interleave_control_v3`.
  - Verified Gen2 radar config includes X/Y/Z/range-rate/SNR and `points_per_scan=800`.
  - Updated the Parking/PUDO Notion model-card row/page for the deployed model.
- Task note: [[agent_tasks/2026/06/Week-1/2026-06-07-mercurial-interleave-redeploy|2026-06-07 Mercurial Interleave Redeploy]]

## 2026-06-07 - Event Viewer Materialization Anchors

- Topic: Extend the parking event clip viewer to load generic materialisation anchor buckets.
- Labels: parking, pudo, unpudo, streamlit, materialization, anchors, video.
- Branch: `boris/event_clip_viewer`.
- PR: `#116721` branch context; viewer changes local/unpushed.
- Change type: Tool/UI code change.
- Areas: `/workspace/WayveCode/wayve/ai/parking/tools/event_clip_viewer`.
- Changes:
  - Added a sidebar data-source toggle between the existing Databricks event table and a generic materialisation anchors path.
  - Added materialisation split and bucket selection by listing `dataset/dataset_split=<split>/dataset_bucket=<bucket>/` Parquet outputs.
  - Loaded anchor rows from Parquet using `runID`/`run_id` and `timestamp_unixus`, exposing the selected bucket as `event_type` for the existing clip-player UI.
  - Preserved the improved `boris/event_clip_viewer` SQL editor, model-catalogue video source, URL warmer, and `back_backward` camera support.
  - Added the default current `parking_pudo/anchors` path, the `pyarrow` Bazel dependency, README documentation, and a small `materialization.py` UI/source helper.
  - Reapplied the previously fixed video containment pattern to selected-clip single/multi-player views so they use iframe scrolling, fixed 16:9 video boxes, `object-fit: contain`, and larger height budgets.
  - Verified syntax, diff whitespace, viewer Ruff/Flake8/type Bazel targets, and a running Streamlit endpoint on `http://127.0.0.1:3001`.
- Task note: [[agent_tasks/2026/06/Week-1/2026-06-07-event-viewer-materialization-anchors|2026-06-07 Event Viewer Materialization Anchors]]

## 2026-06-07 - Parking Interleave Clamp Redeploy

- Topic: Align parking interleave-control waypoint clamping with the 03-20 reference branch and redeploy the trained model.
- Labels: parking, pudo, deployment, interleave-control, waypoint-clamping.
- Branch: `boris/parking-past30-no-standstill-gear-aug/main_cherrypick_new_driving`.
- PR: N/A.
- Change type: Deployment-wrapper fix / model redeploy.
- Areas: `/workspace/main_cherrypick_new_driving/wayve/ai/zoo/deployment/deployment_wrapper.py`, Parking/PUDO model-card Notion table.
- Changes:
  - Ported the 03-20-style parking interleave-control waypoint clamping so policy waypoints are clamped from the effective predicted/postprocessed gear.
  - Removed the extra `POLICY_PATH_POSITION_FORWARD` clamp from this branch.
  - Verified `bazel test //wayve/ai/zoo/deployment:test_deployment_py_test`.
  - Committed and pushed `c39bd6c4d494`.
  - Redeployed `gorilla-tan-splendid` latest/100K checkpoint with interleave control group `parking`; deployed nickname is `crane-indigo-sleepy`.
  - Verified exported Gen2 radar config includes X/Y/Z/range-rate/SNR and `points_per_scan=800`.
  - Updated the Parking/PUDO Notion model-card row/page for the deployed model.
- Task note: [[agent_tasks/2026/06/Week-1/2026-06-07-parking-interleave-clamp-redeploy|2026-06-07 Parking Interleave Clamp Redeploy]]

## 2026-06-06 - Guy Recipe PUDO Root Train

- Topic: Fork Guy's parking/PUDO recipe, update only the PUDO materialized root, and submit training.
- Labels: parking, pudo, training, data-root.
- Branch: `boris/parking-past30-no-standstill-gear-aug/guy_recipe_gear_root`.
- PR: N/A.
- Change type: Config change / training run.
- Areas: `/workspace/guy_recipe_gear_root/wayve/ai/si/configs/parking/parking_config.py`.
- Changes:
  - Forked from `origin/guy/parking-past30-no-standstill-gear-aug`.
  - Changed only `PUDO_BUCKETS_ROOT` to `parking/dev/2026_06_04_11_13_51_root_parking_pudo_unpudo_unparking_gear_fix`.
  - Preserved the existing Guy recipe, including its existing `unpudo_moving` group, without adding unsafe/pre-departure bucket groups from the newer branch.
  - Committed and pushed `1b18c018e301`.
  - Submitted job `175628` / `mercurial-sapphire-jellyfish` with session `session_2026_06_06_22_07_21_guyroot`; final observed state was `Dispatched`.
  - Freed `/workspace` disk space by removing an inactive Bazel output root and the shared Bazel disk cache after local config validation hit `No space left on device`.
- Task note: [[agent_tasks/2026/06/Week-1/2026-06-06-guy-recipe-pudo-root-train|2026-06-06 Guy Recipe PUDO Root Train]]

## 2026-06-06 - Parking PUDO Generic Materialization

- Topic: Add Parking/PUDO/Unpark/UnPUDO buckets using the official generic materialisation framework.
- Labels: parking, pudo, unpudo, unpark, materialization, generic-materialisation, buckets.
- Branch: `boris/pudo_generic_materialization`.
- PR: `#117075`.
- Change type: Code implementation.
- Areas: `/workspace/materialization/wayve/ai/services/sampling/datasets/parking_pudo`, `/workspace/materialization/wayve/ai/services/sampling/datasets/store.py`, `/workspace/materialization/wayve/ai/services/sampling/BUILD`.
- Changes:
  - Added the `parking_pudo/default` dataset and registered it in the services/sampling dataset store.
  - Implemented corpus-derived `park`, `pudo`, `unpark`, `unpudo`, `pre_unpark`, `pre_unpudo`, parking/PUDO gear-change, parking/PUDO pre-CA, and parking/PUDO short/long CA buckets split by country.
  - Removed the generic all-context gear-change/CA selectors in favor of explicit parking and PUDO selector names.
  - Added programmable gear smoothing, hazard cleanup, hazard-based PUDO/UnPUDO splitting over the parked/pre-movement departure interval, movement anchors after gear leaves park, and near-gear-change CA filters with the remain-stopped speed filter.
  - Replaced inherited `datasets.parking` exclusions with a local `parking_pudo` exclusion policy; removed global stopped-segment, geofence, first/last-index, and run-level autonomous exclusions while keeping per-frame `exclude_autonomous` for DC/post-CA.
  - Kept office-geofence handling inside PUDO context classification by ignoring geofenced hazard evidence, matching Zak's stop-type logic instead of dropping every geofenced frame globally.
  - Pushed commit `39f906b30c2d`, published sampling image `sha256:696f65cfde1d549bace850cd416eb3822543b44835b13136fd7bba6ac4b09928`, and submitted full reruns for `parking_pudo/default` (`arjghbl5t57t24hmk8nb`) and `parking_pudo/anchors` (`arv78r4gprwflcv2wsdv`).
  - Diagnosed those reruns failing because partition 0 had `49,044,708` rows and requested `200.0 GiB`, above the Ray worker half-memory cap of `179.5 GiB`; reduced the Spark partition planner run-id cap from `1000` to `700`.
  - Pushed commit `6a64024b1f3a`, published sampling image `sha256:7f7836ccd4a15e2f4eecc6d88a25399566be666e4fd5f0b47dee5dd3d416906d`, and submitted full 700-cap reruns for `parking_pudo/default` (`a7pb56zxxprtxdxqftsr`) and `parking_pudo/anchors` (`afxkknqm2p7rn79sx2t8`).
  - The first 700-cap submissions failed before materialisation because `branch_name` was passed without `branch_version`; resubmitted without branch metadata as `parking_pudo/default` (`an6qkxt4x5bd252b8wk6`) and `parking_pudo/anchors` (`ahz6slkd8llpl4649rzk`), both initially `RUNNING`.
  - Added explanatory selector/helper docstrings and split the internal signal derivation helpers into `parking_pudo/signals.py`.
  - Aligned park/PUDO and unpark/UnPUDO context classification to Zak's `index_of_park - 1` convention and matched `make_park_masks` first-assignment behavior for overlapping approach windows.
  - Added separate `unpark` and `unpudo` pre/short/long CA buckets around first-movement departure anchors, with UnPUDO classification using the same parked/pre-departure hazard scan as the event buckets.
  - Added failed-to pre/short/long CA buckets for `failed_to_park`, `failed_to_pudo`, `failed_to_unpark`, and `failed_to_unpudo`; these skip nearby-gear filtering but keep the 1s remain-stopped speed filter.
  - Split parking/PUDO intervention selectors into `parking_pudo/intervention_filters.py` and added focused tests for departure CA and failed-to CA behavior.
  - Added `parking_pudo/anchors`, an anchor-only companion dataset that mirrors every default bucket name/country split and collapses each bucket to its detected anchor frame using the same filtering logic.
  - Guarded anchor-only selectors so they emit an anchor only when the corresponding expanded bucket window would contain frames.
  - Updated public bucket names to follow BC naming conventions: `dc_*` for DC windows, `pre_ca_*` for pre-CA, and scenario-specific `ca_<scenario>_short/long_*` names for CA buckets.
  - Removed the internal `PARKING_PUDO_*_BUCKET_NAMES` conversion maps; filter dictionaries now use the final emitted bucket stem directly, with no bucket-name behavior change.
  - Published BC-name sampling image `sha256:6cdf613116fd4ea5af9e44988a6f449c35dd8d05e798536f3710f6198b8d1123`, terminated the initial filter-only reruns, and submitted full `sample` workflows for `parking_pudo/default` (`altdzx8gtggm4dpfdr97`) and `parking_pudo/anchors` (`ad59w7rlsf2x8r269755`).
  - Validated both full `sample` workflows finished successfully: `parking_pudo/default` produced `130` train buckets / `67,773,809` samples and `124` validation buckets / `10,212,496` samples; `parking_pudo/anchors` produced `130` train buckets / `782,562` anchor samples and `124` validation buckets / `115,107` anchor samples.
  - Published the sampling workflow image and started Flyte `filter_and_bucket_stage` for `parking_pudo/default` as execution `a4x7v7qkfsg4hk9b52sr`.
  - Added focused pandas filter tests and verified the full `//wayve/ai/services/sampling:test_datasets` target.
- Task note: [[agent_tasks/2026/06/Week-1/2026-06-06-parking-pudo-generic-materialization|2026-06-06 Parking PUDO Generic Materialization]]

## 2026-06-05 - Zak PUDO Bucket Reimplementation Notes

- Topic: Document Zak Murez's `zmurez/pudo` bucket generation and augmentation behavior for reimplementation.
- Labels: parking, pudo, unpudo, data-mix, sampler, documentation.
- Branch: `boris/event_creation_gear_fix` local worktree; inspected `origin/zmurez/pudo`.
- PR: N/A.
- Change type: Vault documentation.
- Areas: `/home/borisindelman/git/vault/agent_tasks/2026/06/Week-1/2026-06-05-zak-pudo-bucket-reimplementation-notes.md`, `wayve/ai/experimental/configs`, `wayve/ai/experimental/samplers/sampler.py`.
- Changes:
  - Summarized heuristic bucket generation for DC, large-error, start, indicator, gear-change, CA, parking, PUDO, and unparking buckets.
  - Recorded active `mcv_new_phase2` weights and the `mcv_new_phase2x_wta` override that moves large-error weight into alpha3 CA buckets.
  - Documented shared validity masks, per-bucket temporal windows, pseudocode/SQL-style recipes, and global image/route/state/ego-pose augmentations.
  - Compared the heuristic bucket path with `mcv_new_phase2_otf.yml` materialized partitions.
- Task note: [[agent_tasks/2026/06/Week-1/2026-06-05-zak-pudo-bucket-reimplementation-notes|2026-06-05 Zak PUDO Bucket Reimplementation Notes]]

## 2026-06-04 - PUDO Gear-Fix Root Training

- Topic: Update parking PUDO config to the gear-fixed materialized root and submit training.
- Labels: parking, pudo, unpudo, training, data-root.
- Branch: `boris/parking-past30-no-standstill-gear-aug/main_cherrypick_new_driving`.
- PR: N/A.
- Change type: Config change / training run.
- Areas: `/workspace/WayveCode/wayve/ai/si/configs/parking/parking_config.py`, Parking/PUDO model-card Notion table.
- Changes:
  - Updated `PUDO_BUCKETS_ROOT` to `parking/dev/2026_06_04_11_13_51_root_parking_pudo_unpudo_unparking_gear_fix`.
  - Committed and pushed `fae5fe152e52`.
  - Submitted corrected training job `174503` / `immense-peach-jackal` with `parking_bc_train_release_2026_5_21` after the initial 5.11 attempt failed on the tele-camera mode mismatch.
  - Monitored the corrected job; it failed before 1K at `trainer/global_step=0` because the new root is missing expected UNPUDO bucket parquet lists such as `dc_unpudo_move_uk` and `dc_unpudo_departure_uk`.
  - Created Notion model-card row `immense-peach-jackal (not interleaved)` with the failure diagnosis in the page body.
  - Updated config bucket names to match the actual gear-fixed root: `dc_unpudo_move_*` -> `dc_unpudo_*`, and departure -> pre-departure.
  - Verified `bazel test //wayve/ai/si:test_config_py_test_test_configs_utils_parking_release_2026_5_21_config_resolves`.
- Task note: [[agent_tasks/2026/06/Week-1/2026-06-04-pudo-gear-fix-root-training|2026-06-04 PUDO Gear-Fix Root Training]]

## 2026-06-04 - UnPUDO Event Streamlit Viewer

- Topic: Build a local viewer for UnPUDO gear-fix table events and camera clips.
- Labels: parking, pudo, unpudo, streamlit, databricks, video.
- Branch: `boris/hari_pudo`; promoted PR branch `boris/event_clip_viewer`.
- PR: `https://github.com/wayveai/WayveCode/pull/116721` (draft).
- Change type: Local tool / viewer.
- Areas: `/workspace/classifiers/tools/databricks_queries/unpudo_event_viewer`, `/workspace/event_clip_viewer/wayve/ai/parking/tools/event_clip_viewer`, `/home/borisindelman/git/vault/projects/hari-pudo-classifiers.md`.
- Changes:
  - Added a Bazel-run Streamlit app for `hive_metastore.parking.pudo_unpudo_unpark_events_gear_fix`.
  - Added event-type filtering, run ID substring filtering, row limits, event selection, and metadata display.
  - Built media-handler URLs centered on the selected event timestamp with configurable before/after seconds.
  - Rendered the five camera videos by default with a shared jump-to-event-timestamp control.
  - Added generated-blob MP4 playback for exact event matches in the Flyte output prefix, signed with a one-day SAS.
  - Kept live media-handler playback as fallback for rows without precomputed blob clips.
  - Added playlist autoplay over the loaded event rows, with looping and Play/Pause/Stop/Prev/Next controls.
  - Changed the default live-camera selection to `front_forward`.
  - Added a playback-speed sidebar control, defaulting to `3x`.
  - Updated the event-loading query to dedupe source rows by `(runID, timestamp_unixus)`.
  - Added pending viewer changes, not restarted yet: dedupe toggle, start playback at beginning, green event-timestamp border, live-source default, autoplay on single-event selection, and random-sample loading.
  - Moved the viewer into `wayve/ai/parking/tools/event_clip_viewer` on clean branch `boris/event_clip_viewer`, split modules below line-count guidance, added a README, and opened draft PR #116721.
  - Removed the `tools/databricks_queries/lib/BUILD` visibility change from the PR; final PR diff only adds the viewer package.
  - Added `compile_event_videos` CLI for concatenated per-event-type review videos, defaulting to 100 random deduped events per type, `front_forward`, `-15s/+15s`, `10x`, and a green event-time border.
  - Verified the PR branch with `bazel test //wayve/ai/parking/tools/event_clip_viewer:py_checks` and a temporary Streamlit run on port `3002`.
  - Verified `bazel test //tools/databricks_queries/unpudo_event_viewer:py_checks` and started the app on `http://127.0.0.1:3001/` in tmux session `unpudo-event-viewer`.
- Task note: [[agent_tasks/2026/06/Week-1/2026-06-04-unpudo-event-streamlit-viewer|2026-06-04 UnPUDO Event Streamlit Viewer]]

## 2026-06-03 - Zak Datamodule Parking Training

- Topic: Run Parking SI training with Zak Murez's experimental PUDO datamodule approach.
- Labels: parking, pudo, training, datamodule, experimental.
- Branch: `boris/zak_datamodule_parking_cherrypick` from `boris/parking-past30-no-standstill-gear-aug/main_cherrypick_new_driving`; supersedes scratch branch `boris/zak_datamodule`.
- PR: N/A.
- Change type: Scratch code integration / local training smoke.
- Areas: `/workspace/default/wayve/ai/experimental`, `/workspace/default/wayve/ai/si/datamodules`, `/workspace/default/wayve/ai/si/configs/parking/parking_config.py`.
- Changes:
  - Imported Zak's selected `mcv_new_phase2` experimental config, dataset, sampler, transform, annotation, prediction, split, and utility files into the branch.
  - Added `ZakExperimentalDataModule` to adapt Zak batches into SI `DataKeys` while preserving Zak's dataloader, sampler, and augmentations.
  - Rebased the integration onto the working parking branch and wired `parking_bc_train_zak_mcv_new_phase2_release_2026_5_21` through the branch's `parking_config.py`.
  - Fixed missing experimental dependencies/assets (`nuscenes-devkit`, LFS `.npz` files, blank `signs_gemini.txt`) and avoided the SI/experimental Bazel dependency cycle.
  - Verified `bazel build //wayve/ai/si:train`, `bazel test //wayve/ai/si/datamodules:test_zak_experimental`, and a one-step local train from `/workspace/default` with release `WFM_v1.4.0.550M(1.5.0)`.
  - Recorded that the interrupted scratch-branch dispatch did not produce a job id and left no local submit process running.
  - Submitted Surfboard job `174118` / `proactive-mallard-jade` with session `session_2026_06_03_20_13_31_zak521`; final observed state was `Running` on AKS.
- 2026-06-04 update:
  - Investigated the failed follow-up batch without starting another remote run.
  - Identified job `174286` as failing on agent-added diagnostic logging (`WayveLogger.warn()` received duplicate `rows` kwargs), so it did not prove the underlying Zak loader state.
  - Tested local no-dev behavior: full no-dev on one local GPU attempts to construct all `263,601` train entries and is not representative of the 64-rank remote shard; bounded no-dev via parquet fractions is the practical local smoke path.
  - Reproduced and fixed the real local loader bug in bounded no-dev: `SingleRunDataset._post_init()` still needed per-frame `dist` after the cumulative-distance fix.
  - Verified `bazel test //wayve/ai/experimental:test_single_run`; bounded no-dev now constructs the Zak train dataset and sampler, then fails on the first SI model forward with a CUDA index assert likely caused by adapter categorical/shape mapping, not Zak dataloader construction.
  - Recommendation before the next dispatch: add pre-forward validation for the Zak-to-SI adapter fields (`camera_extrinsics`, `vehicle_indicator_state`, `vehicle_country`, `vehicle_model`, `vehicle_gear_direction`, `stopping_mode`, `parking_mode`) and rerun bounded no-dev locally with stricter CUDA diagnostics.
  - Confirmed from Zak's latest W&B/Surfboard runs that he uses `TRAIN_PARQUET_FRACTION=1` with `mcv_new_phase2x_wta.yml` on 16 H100 nodes; the 4-node SI run had roughly 4x more eager-loaded run parquets per rank.
  - Added cache-only parquet wiring: `DataModule` now forwards `parquet_fallback_delta_table`, the Zak SI adapter exposes `parquet_cache_only`, and parking's Zak datamodule config sets it true.
  - Verified the cache-only wiring with `bazel test //wayve/ai/si/datamodules:test_zak_experimental` and `bazel test //wayve/ai/si:test_config_py_test_test_configs_utils_parking_release_2026_5_21_config_resolves`.
  - Disabled optional parking visualization metrics only for the Zak datamodule mode after job `174492` failed on singleton Zak `POLICY_TIME_DELTA` shape `[1, 11]`.
  - Locally validated bounded non-dev Zak training for 2 steps after the metric bypass, then pushed `96a6a0e741c3` and dispatched 4-node P1 job `174514` / `perpetual-anteater-crimson` with cached parquets and `train_parquet_fraction=0.25`.
- Task note: [[agent_tasks/2026/06/Week-1/2026-06-03-zak-datamodule-parking-training|2026-06-03 Zak Datamodule Parking Training]]

## 2026-06-05 - Event Viewer Model-Catalogue Video Source

- Topic: Improve parking event Streamlit video loading with model-catalogue camera URLs.
- Labels: parking, pudo, unpudo, streamlit, model-catalogue.
- Branch: `boris/event_clip_viewer`.
- PR: `https://github.com/wayveai/WayveCode/pull/116721`.
- Change type: Code change, local.
- Areas: `/workspace/event_clip_viewer/wayve/ai/parking/tools/event_clip_viewer`.
- Changes:
  - Added model-catalogue API resolution for camera MP4 URLs and event seek offsets, with run-level Streamlit caching.
  - Added a `Model catalogue camera videos` source alongside existing media-handler and generated blob modes.
  - Updated video components to start catalogue playback at `event - before_seconds`, mark the event with the existing green border, and stop/advance at `event + after_seconds`.
  - Added `back_backward` camera support, a SQL text area as the source of loaded rows, event-type filtering derived from the query result, and multi-camera autoplay with current event metadata/source URL inside the player.
  - Restarted the local viewer on `http://127.0.0.1:3001/`.
  - Verified Ruff, Flake8, type checks, Streamlit health, and a direct catalogue API sample.
- Task note: [[projects/hari-pudo-classifiers#2026-06-05 Event Viewer Model-Catalogue Video Source|Hari PUDO classifiers project note]]

## 2026-06-05 - Anchor-Expanded UnPUDO Flyte Clips

- Topic: Dispatch anchor-expanded UnPUDO run clips with Flyte.
- Labels: parking, pudo, unpudo, flyte, video-generation.
- Branch: `boris/hari_pudo`.
- PR: N/A.
- Change type: Local code change and Flyte execution.
- Areas: `/workspace/classifiers/wayve/ai/datasets/annotation_operations_tools/scripts/generate_run_clips_input.py`, `/workspace/classifiers/wayve/ai/datasets/flyte`.
- Changes:
  - Preserved exact source anchor timestamps as output `timestamp_unixus` after nearest corpus matching in `generate_run_clips_input.py`.
  - Generated `2030` run-clips input rows from `hive_metastore.parking.pudo_unpudo_unpark_events_gear_fix`, expanding each selected UnPUDO event from `gearchange_timestamp` to `timestamp_unixus` every 5s plus exact end.
  - Input parquet: `abfss://databricks-users@wayveproddataset.dfs.core.windows.net/borisindelman/unpudo_standstill/anchors_20260605_201515_UTC/run_clips_input.parquet`.
  - Published/reused `datasets_flyte_workflow` image digest `sha256:74479ab9e03b6d604a5a7ea126f81615289f740d9946c6063c58f715e9e037da`.
  - Dispatched Flyte execution `anfr26csqwll76rf9m54` with 20s clips, 3x speed, green event marker, `drop_rows_with_missing_camera_video_files=true`, `chunk_size=1`, and `num_concurrent_tasks=50`.
  - Output prefix: `az://wayveprodperceptiondata/qualitymatch-data/flyte_remote/videos/borisindelman/unpudo_standstill/anchors_20260605_201515_UTC/gen2/`.
- Task note: [[projects/hari-pudo-classifiers|HARI PUDO Classifiers]]

## 2026-06-04 - PR 115840 LR Scheduler Test Comment

- Topic: Clarify LR scheduler test cases after PR review feedback.
- Labels: training, tests, pr-review.
- Branch: `boris/lr-scheduler-num-steps`.
- PR: `https://github.com/wayveai/WayveCode/pull/115840`.
- Change type: Test clarification, uncommitted.
- Areas: `/workspace/pr-115840/wayve/ai/si/test/models/test_training.py`.
- Changes:
  - Made `trainer_max_steps` explicit in the `test_configure_optimizers_uses_lr_scheduler_num_steps` parametrization.
  - Updated the `100 > 30` one-cycle and plateau cases to pass `100` as the override and `30` as trainer max steps.
  - Kept expected scheduler `total_steps` derived from the override when set, otherwise trainer max steps.
  - `git diff --check` passed; focused Bazel validation was blocked during analysis by Azure ACR `401 Unauthorized` for `wayve.azurecr.io/azure-storage/azurite`.
- Task note: [[agent_tasks/2026/06/Week-1/2026-06-04-pr-115840-lr-scheduler-test-comment|2026-06-04 PR 115840 LR Scheduler Test Comment]]

## 2026-06-08 - Event Creation Gear Dedup

- Topic: Deduplicate final PUDO/UnPUDO event keys after gear smoothing.
- Labels: parking, event-creation, gear-smoothing, notebook.
- Branch: `boris/event_creation_gear_fix`.
- PR: N/A.
- Change type: Notebook code change, uncommitted.
- Areas: `/workspace/WayveCode/wayve/ai/parking/notebooks/pudo_unpudo_event_detection.ipynb`.
- Changes:
  - Added one final event-key dedupe stage after event-type union and date filtering.
  - Dedupe key is `(runID, timestamp_unixus, event_type)`.
  - Tie-breaks prefer rows with coordinates, then gear-change metadata, then closest transition distance.
  - Removed the `ENABLE_GEAR_SMOOTHING` flag so gear smoothing is always applied.
  - Reviewed PR comments and added post-cast gear validation, leading-short-segment smoothing to next stable gear, trip-table candidate progress metrics, and a final event-key uniqueness guard.
  - Updated disengagement blacklist behavior so blacklisted PUDO/park main-window disengagements remove the event row; UnPUDO blacklist semantics remain separate.
  - Validated notebook JSON, extracted-code AST parse, and `git diff --check`.
- Task note: [[agent_tasks/2026/06/Week-2/2026-06-08-event-creation-gear-dedup|2026-06-08 Event Creation Gear Dedup]]

## 2026-06-03 - Zmurez PUDO Data Loading Investigation

- Topic: Inspect Zak Murez's `zmurez/pudo` experimental data loading and compare it with SI parking data modules.
- Labels: parking, pudo, data-loading, experimental, investigation.
- Branch: detached `origin/zmurez/pudo` in `/workspace/zak` at `563c88427a65`.
- PR: N/A.
- Change type: Worktree setup / investigation note.
- Areas: `/workspace/zak/wayve/ai/experimental`, `/workspace/WayveCode/wayve/ai/si/configs/parking/parking_config.py`.
- Changes:
  - Created `/workspace/zak` as a detached worktree on the latest fetched `origin/zmurez/pudo`.
  - Identified `mcv_new_phase2.yml -> mcv_new_base.yml -> mcv_new_base0.yml` as the relevant experimental training config chain.
  - Traced data loading through ExpAI `DataModule`, `IpaceDataset`, raw run-list splits, JSON/NPZ PUDO annotations, and heuristic sampler bins.
  - Compared against SI `BcDataModuleCfg` / materialized bucket usage in `parking_config.py`.
  - Concluded the experimental datamodule is not directly reusable as-is for SI training; the reproducible path is to port the selection predicates into SI-compatible buckets or datapipe filters.
- Task note: [[agent_tasks/2026/06/Week-1/2026-06-03-zmurez-pudo-data-loading-investigation|2026-06-03 Zmurez PUDO Data Loading Investigation]]

## 2026-06-01 - HARI PUDO Classifiers

- Topic: Create worktree and initial vault project page for Tom Boehling's HARI PUDO classifier workflow.
- Labels: parking, pudo, hari, classifiers, video-generation.
- Branch: `tomboehling/hari_pudo`.
- PR: N/A.
- Change type: Worktree setup / investigation note.
- Areas: `/workspace/classifiers`, `/home/borisindelman/git/vault/projects/hari-pudo-classifiers.md`.
- Changes:
  - Created `/workspace/classifiers` as a git worktree on `tomboehling/hari_pudo`.
  - Fast-forwarded the local branch to `origin/tomboehling/hari_pudo` at `09109967f05c`.
  - Read the linked video generation README and summarized the Spark, Flyte, HARI upload, annotation download, sampled-frame, train, and infer workflow.
  - Recorded Tom's HARI dataset and pipeline links plus initial risks before starting implementation work.
- Project note: [[projects/hari-pudo-classifiers|HARI PUDO classifiers]]

## 2026-06-01 - Parking PUDO Data Mix Train

- Topic: Rebalance parking PUDO/UNPUDO data mix and submit 30K training.
- Labels: parking, pudo, unpudo, training, data-mix.
- Branch: `boris/parking-past30-no-standstill-gear-aug/main_cherrypick`.
- PR: N/A.
- Change type: Config change / training run.
- Areas: `/workspace/default/wayve/ai/si/configs/parking/parking_config.py`.
- Changes:
  - Updated parking config to use the 2026-05-31 PUDO/UNPUDO materialized root.
  - Rebalanced weights to 50% driving, 20% PUDO, 22% UNPUDO, 8% gear shift, and 0% unparking.
  - Split active UNPUDO as 10% short DC, 6% CA moving, and 6% departure; kept long DC, general CA, unsafe CA, and unparking at 0%.
  - Committed `21bd35f8a9bf` and submitted job `172591` / `purple-steady-toucan` for 30k steps with a 100k LR scheduler horizon.
  - Monitored W&B to `trainer/global_step=5505` with state `running`; created Notion row `purple-steady-toucan (not interleaved)`.
- Task note: [[agent_tasks/2026/06/Week-1/2026-06-01-parking-pudo-data-mix-train|2026-06-01 Parking PUDO Data Mix Train]]

## 2026-05-31 - UnPUDO Materialization Buckets

- Topic: Update parking PUDO/UnPUDO materialization notebook bucket definitions.
- Labels: parking, pudo, unpudo, materialization, notebook.
- Branch: `alon/unpudo_unsafe_fix`.
- PR: N/A.
- Change type: Notebook code change.
- Areas: `/workspace/materialization/wayve/ai/parking/notebooks/pudo_unpudo_materialization.ipynb`.
- Changes:
  - Disabled future-speed filtering and long-UnPUDO event-length filtering.
  - Kept base UnPUDO CA buckets general, without unsafe/moving filters.
  - Added separate UnPUDO unsafe CA buckets using speed at CA and moving CA buckets using speed at CA or around CA+1s.
  - Split joined AV bucket dictionaries explicitly and preserved DC future gear annotation while disabling the speed filter.
  - Split unsafe/moving feature flags and scoped the moving-speed lookup to failed-to-UnPUDO candidate runs.
  - Wired future-speed flags together and added runtime guards for duplicate buckets plus unsafe pre-CA buckets.
  - Updated parking config consumption with `unpudo_dc`, zero-weight `unpudo_dc_long`, unsafe CA, moving pre-CA, and zero-weight general CA groups.
  - Added DC UnPUDO departure buckets from -1s to movement start and move buckets from movement start to +10s.
  - Changed DC gear-change bucket window to 0s through +0.5s.
  - Removed materialization-side GPS/10m/acceleration movement-start recomputation in favor of the event timestamp.
- Task note: [[agent_tasks/2026/05/Week-5/2026-05-31-unpudo-materialization-buckets|2026-05-31 UnPUDO Materialization Buckets]]

## 2026-05-31 - LR Scheduler Horizon

- Topic: Decouple BC LR scheduler horizon from trainer stop steps.
- Labels: parking, training, lr-schedule, bc.
- Branch: `boris/parking-past30-no-standstill-gear-aug/merge_main`.
- PR: N/A.
- Change type: Code change / regression test.
- Areas: `/workspace/WayveCode/wayve/ai/si/config.py`, `/workspace/WayveCode/wayve/ai/si/models/training.py`, `/workspace/WayveCode/wayve/ai/si/test/models/test_training.py`.
- Changes:
  - Added `lr_scheduler_num_steps` to configure scheduler `total_steps` independently of training `num_steps`.
  - Kept fallback behavior unchanged by using `trainer.max_steps` when the override is not set.
  - Added a focused regression test for the scheduler horizon override.
  - Pushed commit `7b291aee4b2e` and submitted job `172180` / `taciturn-gecko-peach` for 30k steps with a 100k LR scheduler horizon.
- Task note: [[agent_tasks/2026/05/Week-5/2026-05-31-lr-scheduler-horizon|2026-05-31 LR Scheduler Horizon]]

## 2026-05-30 - Parking Past30 Port

- Topic: Port selected parking PUDO route-shortening and deployment interleave changes onto main.
- Labels: parking, pudo, datamodule, deployment, route-shortening.
- Branch: `codex/parking-port-past30`.
- PR: N/A.
- Change type: Code port / merge.
- Areas: `/workspace/default/wayve/ai/si`, `/workspace/default/wayve/ai/zoo`, `/workspace/default/wayve/ai/lib/data/pipes`.
- Changes:
  - Copied parking datamodule and config content from `origin/guy/parking-past30-no-standstill-gear-aug` while excluding `allow_short_path` and `enable_early_path_gating`.
  - Added route-shortening data keys, parking helpers, OTF wiring, and route-map shortening.
  - Added parking deployment interleave control while preserving main deployment kwargs and checkpoint backfills.
  - Verified focused parking data, datamodule, deployment wrapper checks; route and parent SI checks blocked by ACR auth.
- Task note: [[agent_tasks/2026/05/Week-5/2026-05-30-parking-past30-port|2026-05-30 Parking Past30 Port]]

## 2026-05-28 - PUDO Buffer0 Parkmode 80k Training

- Topic: Submit PUDO BC 80k training after park-mode and gear-cleanup changes.
- Labels: parking, pudo, training, surfboard.
- Branch: `boris/05-21-updated-pudo-config`.
- PR: N/A.
- Change type: Training run.
- Areas: `/workspace/WayveCode/wayve/ai/si/configs/parking`, Surfboard job `170655`.
- Changes:
  - Submitted `parking_bc_train_release_2026_6_21` with `pudo_bc_datamodule` for 80k steps.
  - Used image `wayvetraining.azurecr.io/scaled-intelligence:3987649fd43c7d0fc47c1ce594c087f883674972`.
  - Monitored job `170655` / `eagle-feisty-aqua` until `Running` on AKS.
- Task note: [[agent_tasks/2026/05/Week-5/2026-05-28-pudo-buffer0-parkmode-80k-train|2026-05-28 PUDO Buffer0 Parkmode 80k Train]]

## 2026-05-28 - Parking Park-Mode Blackout Semantics

- Topic: Fix `park_mode_blackout_probability=0.0` to respect explicit park-mode enable flags.
- Labels: parking, datamodule, park-mode, tests.
- Branch: `boris/05-21-updated-pudo-config`.
- PR: N/A.
- Change type: Code fix / regression test.
- Areas: `/workspace/WayveCode/wayve/ai/si/datamodules/parking.py`, `/workspace/WayveCode/wayve/ai/si/datamodules/test/test_parking_unit.py`.
- Changes:
  - Preserved explicit parking/parked park-mode flags when blackout probability is 0.
  - Kept sampled park-mode+blackout versus route-shortening override for probabilities greater than 0.
  - Updated the unit test and verified the parking unit file plus package ruff lint.
  - Removed deployment emission of `PARKED_STATE`; deployment now keeps only derived `PARKING_MODE` for end-of-route parking.
  - Changed parking gear cleanup to release-style neutral shifting with `gear_label_cleanup_stop_buffer_sec=0.0` instead of symmetric standstill expansion.
- Task note: [[agent_tasks/2026/05/Week-5/2026-05-28-park-mode-blackout-semantics|2026-05-28 Park Mode Blackout Semantics]]

## 2026-05-27 - Parking PUDO 2026.6.21 Training Restart

- Topic: Push parking 2026.6.21 startup fixes and restart PUDO BC training.
- Labels: parking, pudo, training, surfboard, config.
- Branch: `boris/05-21-updated-pudo-config`.
- PR: N/A.
- Change type: Code fix / training run.
- Areas: `/workspace/WayveCode/wayve/ai/si/models`, `/workspace/WayveCode/wayve/ai/si/configs/parking`, Surfboard job `170265`, `/home/borisindelman/git/vault/agent_tasks`.
- Changes:
  - Pushed fixes for parking navigation plus indicator memory, deployment driving parameter keys, and 2026.6.21 behavior-control output heads.
  - Submitted `parking_bc_train_release_2026_6_21` with `pudo_bc_datamodule` for 80k steps.
  - Monitored W&B history until `trainer/global_step=5154` while the run remained `running`.
  - Followed up after completion: created the Notion model-card row and recorded Alpha3 `71.1%` plus current-latest PUDO/UNPUDO `7.0%`.
- Task note: [[agent_tasks/2026/05/Week-4/2026-05-27-parking-pudo-621-training-restart|2026-05-27 Parking PUDO 2026.6.21 Training Restart]]

## 2026-05-26 - Eval Studio Suite Scores Skill

- Topic: Create `eval-studio-suite-scores` ParkingSkills skill.
- Labels: eval-studio, codex-skill, model-scorecard, parking.
- Branch: `agents_day`.
- PR: N/A.
- Change type: Skill / helper script.
- Areas: `/home/borisindelman/git/ParkingSkills/skills/eval-studio-suite-scores`, `/home/borisindelman/git/vault/agent_tasks`.
- Changes:
  - Added a token-efficient skill for resolving model artefact IDs and fetching Eval Studio suite scores.
  - Added `scripts/get_scores.sh` to resolve executions by suite version or suite UUID and batch score lookups to match Scorecard semantics.
  - Validated the skill and helper against `armadillo-adaptable-maroon`.
  - Updated the helper to expose the Suite Results `less_wrong_score` category value separately from `scorecard_score`.
- Task note: [[agent_tasks/2026/05/Week-5/2026-05-26-eval-studio-suite-scores-skill|2026-05-26 Eval Studio Suite Scores Skill]]

## 2026-05-24 - Parking BC New Driving Training

- Topic: Submit Parking BC training with `parking_bc_new_driving_datamodule` and trimmed moving UnPUDO buckets.
- Labels: parking, training, surfboard, pudo, unpudo.
- Branch: `boris/parking-moving-buckets-config`.
- PR: N/A.
- Change type: Training run.
- Areas: `/workspace/.codex-borisindelman/worktrees/7992/WayveCode/wayve/ai/si/configs/parking`, Surfboard job `168353`.
- Changes:
  - Submitted training with `+mode=parking_bc_train_release_2026_5_11` and `+datamodule=parking_bc_new_driving_datamodule`.
  - Published image `wayvetraining.azurecr.io/scaled-intelligence:6e97857c4e9b3cebadfa432042deeb7a513ee23f`.
  - Monitored job `168353` until `Running`.
- Task note: [[agent_tasks/2026/05/Week-4/2026-05-24-parking-bc-new-driving-training|2026-05-24 Parking BC New Driving Training]]

## 2026-05-24 - Parking Moving Buckets Config

- Topic: Update parking BC config to consume moving UnPUDO buckets.
- Labels: parking, pudo, unpudo, config, training-data.
- Branch: `boris/parking-moving-buckets-config`.
- PR: N/A.
- Change type: Config change.
- Areas: `/workspace/.codex-borisindelman/worktrees/7992/WayveCode/wayve/ai/si/configs/parking`, `/home/borisindelman/git/vault/agent_tasks`.
- Changes:
  - Created branch from `origin/guy/parking-past30-no-standstill-gear-aug`.
  - Updated `PUDO_BUCKETS_ROOT` to the `2026_05_19_20_07_34` materialization with moving UnPUDO buckets.
  - Split UnPUDO weight into base and moving child budgets and added six `*_unpudo_moving_*` train buckets.
  - Verified with `git diff --check` and `bazel build //wayve/ai/si:si`.
- Task note: [[agent_tasks/2026/05/Week-4/2026-05-24-parking-moving-buckets-config|2026-05-24 Parking Moving Buckets Config]]

## 2026-05-24 - Parking Indicator Memory Validation

- Topic: Keep indicator memory enabled for parking without re-enabling behavioral control.
- Labels: parking, deployment, indicator-memory, behavior-control.
- Branch: `boris/parking-past30-no-standstill-gear-aug/no_behave`.
- PR: N/A.
- Change type: Code fix / deployment validation.
- Areas: `/workspace/WayveCode/wayve/ai/si/configs/parking`, `/workspace/WayveCode/wayve/ai/si/models`, `/workspace/WayveCode/wayve/ai/si/test/models`.
- Changes:
  - Restored `use_indicator_memory=True` in parking training configs while leaving behavior control disabled.
  - Allowed the parking deployment wrapper to use navigation input and indicator memory together.
  - Added a regression test for parking deployment with navigation and indicator memory enabled.
- Task note: [[agent_tasks/2026/05/Week-4/2026-05-24-parking-indicator-memory-validation|2026-05-24 Parking Indicator Memory Validation]]

## 2026-05-24 - Checkout PUDO/UNPUDO Materialization Notebook

- Topic: Check out the parking PUDO/UNPUDO materialization notebook from `origin/alon/unpudo_unsafe_fix`.
- Labels: parking, pudo, unpudo, notebook, git-checkout.
- Branch: detached `HEAD`; source `origin/alon/unpudo_unsafe_fix`.
- PR: N/A.
- Change type: Notebook checkout.
- Areas: `/workspace/.codex-borisindelman/worktrees/7992/WayveCode/wayve/ai/parking/notebooks`, `/home/borisindelman/git/vault/agent_tasks`.
- Changes:
  - Checked out `wayve/ai/parking/notebooks/pudo_unpudo_materialization.ipynb` from `origin/alon/unpudo_unsafe_fix`.
  - Verified the notebook matches the source branch.
  - Left the notebook staged as a result of the path checkout.
- Task note: [[agent_tasks/2026/05/Week-4/2026-05-24-checkout-pudo-unpudo-materialization-notebook|2026-05-24 Checkout PUDO/UNPUDO Materialization Notebook]]

## 2026-05-24 - Wayve LLM Wiki Deep Dive

- Topic: Wayve MLE LLM wiki extension for parking/PUDO, navigation, latent actions, and multitask/multi-head model development.
- Labels: llm_wiki, parking, pudo, navigation, latent-actions, multitask, model-architecture.
- Branch: N/A.
- PR: N/A.
- Change type: Documentation / knowledge-base ingest.
- Areas: `/home/borisindelman/git/vault/llm_wiki`, `/home/borisindelman/git/vault/agent_tasks`.
- Changes:
  - Added source summaries for Notion and Google Drive ingests.
  - Added system pages for parking/PUDO product, event pipeline, deployment/release, navigation conditioning, latent actions, and multi-driving heads.
  - Added parking/PUDO open questions.
  - Created wiki index/log entries for the ingest.
- Task note: [[agent_tasks/2026/05/Week-4/2026-05-24-wayve-llm-wiki-deep-dive|2026-05-24 Wayve LLM Wiki Deep Dive]]

## 2026-05-24 - LLM Wiki Newcomer Readiness

- Topic: Make the Wayve MLE LLM wiki ready and useful for a newcomer.
- Labels: llm_wiki, onboarding, parking, pudo, mle.
- Branch: N/A.
- PR: N/A.
- Change type: Documentation / knowledge-base maintenance.
- Areas: `/home/borisindelman/git/vault/llm_wiki`, `/home/borisindelman/git/vault/agent_tasks`.
- Changes:
  - Added newcomer onboarding path, MLE role map, and first parking/PUDO change checklist.
  - Reworked README and index around reading paths.
  - Expanded glossary and refreshed parking hub caveats.
- Task note: [[agent_tasks/2026/05/Week-4/2026-05-24-llm-wiki-newcomer-readiness|2026-05-24 LLM Wiki Newcomer Readiness]]

- Topic: Parking 2026.6.21 PUDO train startup failure
  - Labels: parking, training, config
  - Branch: `boris/05-21-updated-pudo-config`
  - PR: n/a
  - Change type: fix
  - Areas: `wayve/ai/si/configs/parking/parking_config.py`, `wayve/ai/si/test/configs/test_config.py`
  - Changes:
    - Fixed `ParkingModelRelease2026_6_21Cfg` output adaptor interpolation by setting explicit WFM Feb dimensions and output flags.
    - Added config regression coverage for `parking_bc_train_release_2026_6_21` with `pudo_bc_datamodule`.
    - Documented in [[agent_tasks/2026/05/Week-4/2026-05-24-parking-621-pudo-train-failure]].

## 2026-05-24 - Condor Fearless Ivory PUDO Licensing

- Topic: Add Parking/PUDO model note and create UK licensing experiment for `condor-fearless-ivory`.
- Labels: parking, pudo, licensing, on-road-experiment, model-catalogue.
- Branch: `boris/parking-past30-no-standstill-gear-aug/no_behave`.
- PR: N/A.
- Change type: Model Catalogue / Console operation.
- Areas: `https://console.sso.wayve.ai/model/session_2026_05_22_08_40_39_si_parking_bc_train_release_2026_5_11_no_behave_no_imem_params_80k__lavender-ferret-ubiquitous_interleave_control_v1`, `https://console.sso.wayve.ai/on-road-experiments/29332a9a-f91b-478d-83cd-e1bc58e9a2d6`, `/home/borisindelman/git/vault/agent_tasks`.
- Changes:
  - Checked out `/tmp/wayvecode-fuchsia-model-branch` to `boris/parking-past30-no-standstill-gear-aug/no_behave`.
  - Added the standard Parking/PUDO `model_change_note` to deployed model `condor-fearless-ivory`.
  - Created UK PUDO licensing on-road experiment `29332a9a-f91b-478d-83cd-e1bc58e9a2d6` in `pending_approval`.
- Task note: [[agent_tasks/2026/05/Week-4/2026-05-24-condor-fearless-ivory-pudo-licensing|2026-05-24 Condor Fearless Ivory PUDO Licensing]]

## 2026-05-24 - Condor / Unofficial Drift PUDO Interleave Experiment

- Topic: Create US Drift/PUDO interleave experiment for `unofficial-cyan-pigeon` vs `condor-fearless-ivory`.
- Labels: parking, pudo, drift, on-road-experiment, interleave, model-catalogue.
- Branch: `/tmp/wayvecode-fuchsia-model-branch` reported `binariser-autobump-driving-3.0.62` at final status check; branch changed outside this experiment creation step.
- PR: N/A.
- Change type: Model Catalogue / Console operation.
- Areas: `https://console.sso.wayve.ai/on-road-experiments/6b6dc929-76a1-48c4-a69d-7b2118d7dfbb`, `/home/borisindelman/git/vault/agent_tasks`.
- Changes:
  - Resolved both models' gen2 artefacts and verified `gen2_mache_alpha3` licences.
  - Reused the controller, route template, SBW-on driving feature config, tags, and theme from reference experiment `8685ed72-b127-456d-b272-7f6cf0a5dfa3`.
  - Created interleave experiment `6b6dc929-76a1-48c4-a69d-7b2118d7dfbb` in `pending_approval` with `unofficial-cyan-pigeon` as control and `condor-fearless-ivory` as variant.
- Task note: [[agent_tasks/2026/05/Week-4/2026-05-24-condor-unofficial-interleave-experiment|2026-05-24 Condor / Unofficial Drift PUDO Interleave Experiment]]


- Topic: Parking input adaptor LR fix
  - Labels: parking, training, optimizer, learning-rate
  - Branch: `boris/parking-past30-no-standstill-gear-aug/no_behave_lr_fix`
  - PR: N/A
  - Change type: fix
  - Areas: `wayve/ai/si/models/training.py`, `wayve/ai/si/configs/parking/parking_config.py`, `wayve/ai/si/test/models/test_training.py`
  - Changes:
    - Added dedicated optimizer LR groups for gear direction and parking mode input adaptors.
    - Set parking configs to train those fresh input adaptors at `1e-4` while keeping base LR at `1e-5`.
    - Documented validation and the current unrelated Bazel analysis blocker in [[agent_tasks/2026/05/Week-4/2026-05-24-parking-input-adaptor-lr-fix]].

- Topic: Parking WFM warmup freeze
  - Labels: parking, training, optimizer, warmup
  - Branch: boris/parking-past30-no-standstill-gear-aug/no_behave_lr_fix
  - PR: n/a
  - Change type: follow-up fix
  - Areas: wayve/ai/si/models/training.py, wayve/ai/si/configs/parking/parking_config.py, wayve/ai/zoo/lr_schedulers/one_cycle_lambda.py
  - Changes:
    - Added delayed OneCycle LR support for staged training.
    - Configured parking BC modes to hold WFM encoder/input adaptor LR at zero for 5000 steps.
    - Kept fresh gear and parking-mode input adaptors active from step 0.

- Topic: Parking no-behave LR warmup training run
  - Labels: parking, training, surfboard
  - Branch: boris/parking-past30-no-standstill-gear-aug/no_behave_lr_fix
  - PR: n/a
  - Change type: training run
  - Areas: Parking training, Notion release tracking
  - Changes:
    - Submitted 80k-step parking BC training job 168436 on 4x H100 nodes.
    - Created Notion release row for green-badger-sophisticated.
    - Observed job reach Running on AKS.

## 2026-05-25 - Parking Onboarding Skill

- Topic: Create `parking-onboarding` Codex skill for newcomer setup and Parking education.
- Labels: parking, onboarding, codex-skill, coder.
- Branch: N/A.
- PR: N/A.
- Change type: Skill / documentation.
- Areas: `/home/borisindelman/git/ParkingSkills/skills/parking-onboarding`, `/home/borisindelman/git/vault/agent_tasks`.
- Changes:
  - Added a Mac-to-Coder bootstrap flow that avoids local Mac Git setup.
  - Added Coder workspace bring-up, GitHub auth, WayveCode verification, ParkingSkills clone/update, and Codex symlink guidance.
  - Added Phase 5 general WayveCode onboarding and Phase 6 MLE/Parking walkthroughs for model config, data materialisation, OTF loading, deployment wrapper, Eval Studio, Console, Foxglove, and VSO context.
- Task note: [[agent_tasks/2026/05/Week-5/2026-05-25-parking-onboarding-skill|2026-05-25 Parking Onboarding Skill]]

## 2026-05-25 - Parking Onboarding Skill Follow-Up

- Topic: Remove `llm_wiki` dependency and copy `parking-onboarding` onto `main`.
- Labels: parking, onboarding, codex-skill, main-branch.
- Branch: `main` in `/tmp/ParkingSkills-main`; source checkout remained on `agents_day` due unrelated dirty files.
- PR: N/A.
- Change type: Skill maintenance.
- Areas: `/tmp/ParkingSkills-main/skills/parking-onboarding`, `/home/borisindelman/git/ParkingSkills/skills/parking-onboarding`, `/home/borisindelman/git/vault/agent_tasks`.
- Changes:
  - Removed all `llm_wiki` references from `parking-onboarding`.
  - Copied the skill into a clean `main` worktree because the original checkout could not switch branches without overwriting unrelated local edits.
  - Revalidated the skill in the `main` worktree.
- Task note: [[agent_tasks/2026/05/Week-5/2026-05-25-parking-onboarding-skill|2026-05-25 Parking Onboarding Skill]]

## 2026-05-26 - Parking Branch Signing Push Repair

- Topic: Repair origin tracking and pushes for signed parking branches.
- Labels: parking, git, signing, branch-tracking, push.
- Branch: Multiple; see task note.
- PR: N/A.
- Change type: Git branch maintenance.
- Areas: `origin/boris/parking-moving-buckets-config`, `origin/boris/parking-past30-no-standstill-gear-aug/no_behave`, `origin/boris/parking-past30-no-standstill-gear-aug/no_behave_lr_fix`, `origin/boris/parking-past30-no-standstill-gear-aug/no_park_mode_nv_behav`.
- Changes:
  - Fixed `boris/parking-moving-buckets-config` upstream to track `origin/boris/parking-moving-buckets-config`.
  - Created/pushed `origin/boris/parking-moving-buckets-config`.
  - Verified the three `parking-past30-no-standstill-gear-aug` branches were already current on matching origin refs.
  - Verified requested branch tips are SSH-signed.
- Task note: [[agent_tasks/2026/05/Week-5/2026-05-26-parking-branch-signing-push-repair|2026-05-26 Parking Branch Signing Push Repair]]

## 2026-05-26 - PR 102690 Open Review Code Fixes

- Topic: Fix open code-review comments for parking route shortening PR.
- Labels: parking, pudo, pr-review, route-shortening.
- Branch: `boris/03-23-park-route-shortening-v2`.
- PR: `wayveai/WayveCode#102690`.
- Change type: Review fixes.
- Areas: `wayve/ai/lib/data/pipes/routes.py`, `wayve/ai/zoo/deployment/deployment_wrapper.py`, `wayve/ai/zoo/data/keys.py`.
- Changes:
  - Replaced production `assert` with early `ValueError` validation.
  - Removed redundant clipping and over-defensive fallback code in parking route shortening.
  - Centralized repeated scalar extraction with `_first_value`.
  - Renamed the end-of-route map blackout helper to a deterministic action name.
- Task note: [[agent_tasks/2026/05/Week-5/2026-05-26-pr102690-open-review-code-fixes|2026-05-26 PR 102690 Open Review Code Fixes]]

## 2026-05-26 - Parking Model Card Suite Scores

- Topic: Fill Eval Studio score columns in the Parking/PUDO model cards Notion database.
- Labels: parking, eval-studio, notion, model-cards.
- Branch: N/A.
- PR: N/A.
- Change type: Notion content update.
- Areas: `Parking/PUDO Model Development` Notion page, `Parking/PUDO model cards` database.
- Changes:
  - Queried Pudo-Unpudo and Alpha3 LessWrong suite scores using only each row's `Model ` title column.
  - Filled `PUDO/UNPUDO Suite` and `Alpha3 Intervention Suite` where exact suite-version executions existed.
  - Left rows blank when Eval Studio had no execution for the exact model and suite version.
- Task note: [[agent_tasks/2026/05/Week-5/2026-05-26-parking-model-card-suite-scores|2026-05-26 Parking Model Card Suite Scores]]

## 2026-05-26 - Parking Model Card Suite Scores Follow-Up

- Topic: Fill remaining available Eval Studio scores from any suite version.
- Labels: parking, eval-studio, notion, model-cards.
- Branch: N/A.
- PR: N/A.
- Change type: Notion content update.
- Areas: `Parking/PUDO Model Development` Notion page, `Parking/PUDO model cards` database.
- Changes:
  - Resolved `proficient-centipede-indigo` via Model Catalogue gen2 artefact because license lookup had no rows.
  - Filled `proficient-centipede-indigo` with PUDO/UNPUDO `7.0%` and Alpha3 `72.0%`.
  - Swept remaining blanks against the Pudo-Unpudo and Alpha3 suite UUIDs; no other exact-model executions were found.
- Task note: [[agent_tasks/2026/05/Week-5/2026-05-26-parking-model-card-suite-scores|2026-05-26 Parking Model Card Suite Scores]]

## 2026-05-26 - Parking Model Card Lineage Fill

- Topic: Fill missing lineage values in the Parking/PUDO model cards Notion database.
- Labels: parking, notion, model-cards, lineage.
- Branch: N/A.
- PR: N/A.
- Change type: Notion content update.
- Areas: `Parking/PUDO Model Development` Notion page, `Parking/PUDO model cards` database.
- Changes:
  - Used direct edges from the Mermaid lineage graph to fill 13 blank `Lineage` cells.
  - Preserved existing lineage values.
  - Left roots and rows absent from the graph blank.
- Task note: [[agent_tasks/2026/05/Week-5/2026-05-26-parking-model-card-suite-scores|2026-05-26 Parking Model Card Suite Scores]]

## 2026-05-26 - Parking Eval Studio Score Skill Rename

- Topic: Rename and scope Eval Studio score skill for Parking/PUDO suite scores.
- Labels: parking, codex-skill, eval-studio.
- Branch: N/A.
- PR: N/A.
- Change type: Skill maintenance.
- Areas: `/home/borisindelman/git/ParkingSkills/skills/parking-eval-studio-suite-scores`.
- Changes:
  - Renamed `eval-studio-suite-scores` to `parking-eval-studio-suite-scores`.
  - Baked in the Pudo-Unpudo and Alpha3 Intervention suite/version IDs.
  - Removed user-specific fallback script paths by resolving sibling skills relative to the installed skills root.
  - Verified the script with `armadillo-adaptable-maroon`.
- Task note: [[agent_tasks/2026/05/Week-5/2026-05-26-parking-model-card-suite-scores|2026-05-26 Parking Model Card Suite Scores]]

## 2026-05-26 - ParkingSkills README Setup

- Topic: Add initial ParkingSkills setup instructions.
- Labels: parking, docs, codex-skill, claude-skill.
- Branch: N/A.
- PR: N/A.
- Change type: Documentation.
- Areas: `/home/borisindelman/git/ParkingSkills/README.md`.
- Changes:
  - Added a short setup section with `git clone` and symlink commands for `~/.codex/skills` and `~/.claude/skills`.
- Task note: [[agent_tasks/2026/05/Week-5/2026-05-26-parking-model-card-suite-scores|2026-05-26 Parking Model Card Suite Scores]]

- [[agent_tasks/2026/05/Week-5/2026-05-26-fold-parking-deploy-skills|Fold Parking Deploy Skills]]
  - Topic: ParkingSkills lifecycle simplification
  - Labels: parking, skills, lifecycle
  - Branch: main
  - PR: n/a
  - Change type: docs/skill refactor
  - Areas: ParkingSkills
  - Changes:
    - Folded interleave deployment and Console updates into parking-deploy.

- [[agent_tasks/2026/05/Week-5/2026-05-26-parking-deploy-console-pudo-experiments|Parking Deploy Console Auth And PUDO Experiments]]
  - Topic: ParkingSkills deploy skill update
  - Labels: parking, skills, console, on-road
  - Branch: main
  - PR: n/a
  - Change type: docs/skill update
  - Areas: ParkingSkills
  - Changes:
    - Added Console auth-cookie fallback instructions and PUDO experiment templates/controller rules.

## 2026-05-27 - Parking Lifecycle Pudo-Unpudo Suite Version

- Topic: Update Parking model lifecycle routing for the fixed Pudo-Unpudo Eval Studio suite/version.
- Labels: parking, pudo, eval-studio, skill, lifecycle.
- Branch: `main` in `/home/borisindelman/git/ParkingSkills`.
- PR: N/A.
- Change type: Skill documentation / routing update.
- Areas: `/home/borisindelman/git/ParkingSkills/skills/parking_model_lifecycle`, `/home/borisindelman/git/vault/agent_tasks`.
- Changes:
  - Added explicit Pudo-Unpudo suite id `ea663952-b914-47a3-8cc1-729db3683dce` and version id `86b2105d-3f72-4620-b020-0b10e445798d` to lifecycle eval routing.
  - Clarified suite id versus version id in `$parking-eval-studio-suite-scores` defaults.
  - Verified `get_scores.sh` already uses the requested IDs.
- Task note: [[agent_tasks/2026/05/Week-5/2026-05-27-parking-lifecycle-pudo-suite-version|2026-05-27 Parking Lifecycle Pudo-Unpudo Suite Version]]

## 2026-05-27 - Pudo-Unpudo Suite for May Models

- Topic: Run/query the latest Pudo-Unpudo Eval Studio suite version for Parking/PUDO model-card rows dated since 2026-05-06.
- Labels: parking, pudo, eval-studio, notion, model-cards.
- Branch: N/A.
- PR: N/A.
- Change type: Eval Studio execution/query.
- Areas: `Parking/PUDO Model Development` Notion page, Eval Studio Pudo-Unpudo suite.
- Changes:
  - Filtered the Notion model-card database to nine rows with `Date >= 2026-05-06`.
  - Targeted latest Pudo-Unpudo version `adf04489-bc65-492d-92e6-02bfff979c49`.
  - Found `reassured-red-sea-turtle` already completed on the latest version with score `0.7515`.
  - Launched missing latest-version executions for the remaining eight models.
  - Follow-up check updated Notion scores for completed latest-version rows: chocolate `46.9%`, reassured `75.2%`, circumspect `74.7%`, noncommittal `76.4%`.
  - Later check found the five remaining executions completed and updated Notion: armadillo `78.3%`, condor `77.6%`, dalmatian `8.6%`, fuchsia `10.8%`, proficient `7.5%`.
  - Resolved `proficient-centipede-indigo` via model-catalogue gen2 artefact because the licence helper had no rows.
- Task note: [[agent_tasks/2026/05/Week-5/2026-05-27-pudo-unpudo-suite-may-models|2026-05-27 Pudo-Unpudo Suite for May Models]]

## 2026-05-27 - Lime Leopard Interleave V2 Deploy

- Topic: Redeploy `lime-leopard-dreaming` with parking interleave control.
- Labels: parking, pudo, deploy, model-ci, notion.
- Branch: `boris/05-21-updated-pudo-config`.
- PR: N/A.
- Change type: Model deployment.
- Areas: Model Catalogue, Buildkite Model CI, Notion model cards.
- Changes:
  - Deployed checkpoint 80k with suffix `__lime-leopard-dreaming_interleave_control_v2`.
  - Produced deployed nickname `lavender-elegant-gerbil` and gen2 artefact `96a5914c-7edf-46e1-b7b4-618f155137ac`.
  - Added the standard Parking/PUDO Console note and created a Notion model-card row.
  - Triggered Model CI build `73445`; job-level status could not be read with the local token.
- Task note: [[agent_tasks/2026/05/Week-5/2026-05-27-lime-leopard-interleave-v2-deploy|2026-05-27 Lime Leopard Interleave V2 Deploy]]


- Topic: Parking checkpoint interleave upload
  - Labels: parking, deployment, training
  - Branch: `boris/05-21-updated-pudo-config`
  - PR: n/a
  - Change type: fix/test
  - Areas: `wayve/ai/si/models/training.py`, `wayve/ai/si/test/models/test_training.py`
  - Changes:
    - Set parking `DeploymentConfig.interleave_group` during training checkpoint upload config construction.
    - Added a regression test for parking vs non-parking interleave group config.
    - Verification blocked by ACR 401 during Bazel analysis.
  - Note: [[agent_tasks/2026/05/Week-5/2026-05-27-parking-checkpoint-interleave-upload]]

## 2026-05-28 - PUDO 2026.6.21 Beige Train Monitor

- Topic: Submit and monitor the PUDO BC 80k retry after disabling behavior-control loss.
- Labels: parking, pudo, training, notion, wandb.
- Branch: `boris/05-21-updated-pudo-config`.
- PR: N/A.
- Change type: Training run / monitoring.
- Areas: Surfboard, W&B, Loki, Parking/PUDO Notion model cards.
- Changes:
  - Submitted short-tag retry `beige-hornet-striped` / Surfboard job `170708`.
  - Updated the Notion model-card row to the new nickname.
  - Monitored W&B until `trainer/train_step=5069` with state `running`.
  - Confirmed no matching fatal/artifact-name errors in Loki around the 5k crossing.
- Task note: [[agent_tasks/2026/05/Week-5/2026-05-28-pudo-621-beige-train-monitor|2026-05-28 PUDO 2026.6.21 Beige Train Monitor]]

## 2026-05-28 - Parking Skills Session Tags And Notes

- Topic: Tighten Parking/PUDO lifecycle skill instructions for training session tags and Notion notes.
- Labels: parking, pudo, skills, notion, training.
- Branch: `main` in `/home/borisindelman/git/ParkingSkills`.
- PR: N/A.
- Change type: Skill documentation update.
- Areas: ParkingSkills lifecycle skills.
- Changes:
  - Required train submissions to use an explicit short session tag under 128 characters, normally under ~45 characters.
  - Instructed the training skill to override long generated/default CLI tags.
  - Made the model-card update skill leave any `Notes` table property untouched.
  - Clarified that detailed notes belong in the model-card page body.
- Task note: [[agent_tasks/2026/05/Week-5/2026-05-28-parking-skills-session-tags-notes|2026-05-28 Parking Skills Session Tags And Notes]]

- Topic: Parking merge test fixes
  - Labels: parking, merge, tests
  - Branch: `boris/parking-past30-no-standstill-gear-aug/merge_main`
  - PR: n/a
  - Change type: fix
  - Areas: `wayve/ai/si`, `wayve/ai/zoo`, parking datamodules, deployment wrapper
  - Changes:
    - [[agent_tasks/2026/05/Week-5/2026-05-30-parking-merge-test-fixes|Parking merge test fixes]]
    - Fixed parking/datamodule and deployment wrapper regressions surfaced by focused Bazel tests.

## 2026-05-31 - Merge Main Parking Retry Export Fix

- Topic: Retry merge-main parking training after fixing parking interleave TorchScript export.
- Labels: parking, training, deployment, interleave, torchscript.
- Branch: `boris/parking-past30-no-standstill-gear-aug/merge_main`.
- PR: N/A.
- Change type: Code fix / training run / monitoring.
- Areas: `/workspace/WayveCode/wayve/ai/zoo/deployment/deployment_wrapper.py`, `/workspace/WayveCode/wayve/ai/zoo/deployment/deployment_wrapper_codegen.py`, Parking/PUDO Notion model card.
- Changes:
  - Fixed parking interleave wrapper scripting by passing common output tensors field-by-field instead of a model-output NamedTuple.
  - Corrected parking deployment wrapper return annotation for `DrivingOutputWithGearOutput`.
  - Pushed commit `097878727cee8db9d5598872ffe194fa95b4192c`.
  - Submitted training job `172255` / `raven-orange-rejoicing`, session `session_2026_05_31_10_52_33_mmturtle4`.
  - Monitored to W&B `trainer/global_step=5102` with state `running`; updated Notion page body without touching the `Notes` property.
- Task note: [[agent_tasks/2026/05/Week-5/2026-05-31-lr-scheduler-horizon|2026-05-31 LR Scheduler Horizon]]

## 2026-05-31 - Parking Upload Interleave Group Fix

- Topic: Restore parking interleave group metadata on checkpoint upload config.
- Labels: parking, training, deployment, interleave.
- Branch: `boris/parking-past30-no-standstill-gear-aug/merge_main`.
- PR: N/A.
- Change type: Code fix / regression test.
- Areas: `/workspace/WayveCode/wayve/ai/si/models/training.py`, `/workspace/WayveCode/wayve/ai/si/test/models/test_training.py`.
- Changes:
  - Added `interleave_group="parking" if self.use_parking_mode else ""` to `BcTrainingModule.get_deployment_config()` so `CheckpointAndSubmit` upload metadata carries the parking group.
  - Added a focused regression test for parking and non-parking deployment config interleave groups.
  - Pushed commit `446463339cb0`.
  - Bazel verification remained blocked by existing missing target `//wayve/ai/si:run_inference`; syntax and whitespace checks passed.
- Task note: [[agent_tasks/2026/05/Week-5/2026-05-31-lr-scheduler-horizon|2026-05-31 LR Scheduler Horizon]]

## 2026-05-31 - Parking Deployment X Clamp Fix

- Topic: Fix parking deployment wrapper X-vector clamping for interleave and path outputs.
- Labels: parking, deployment, interleave, simulation.
- Branch: `boris/parking-past30-no-standstill-gear-aug/merge_main`.
- PR: N/A.
- Change type: Code fix / regression tests.
- Areas: `/workspace/WayveCode/wayve/ai/zoo/deployment/deployment_wrapper.py`, `/workspace/WayveCode/wayve/ai/zoo/deployment/deployment_wrapper_codegen.py`, deployment wrapper tests.
- Changes:
  - Restored generated interleave policy-gear source detection from `03-20-si-group-interleave-control-support` while preserving field-by-field output wrapping.
  - Enforced gear-conditioned waypoint clamping for parking interleave group as well as driving group.
  - Clamped `POLICY_PATH_POSITION_FORWARD` using predicted gear before returning parking deployment path outputs.
  - Added regression tests and verified focused deployment tests, ruff, and type checks.
- Task note: [[agent_tasks/2026/05/Week-5/2026-05-31-lr-scheduler-horizon|2026-05-31 LR Scheduler Horizon]]
  - Pushed commit `3ee09c365baf` (`fix: clamp parking deployment x outputs`).

## 2026-05-31 - Raven 30k X-Clamp Redeploy And 80k Continuation

- Topic: Redeploy promising 30k Parking checkpoint with X-clamp fix, then continue original model to 80k.
- Labels: parking, deployment, training, interleave.
- Branch: `boris/parking-past30-no-standstill-gear-aug/merge_main`.
- PR: N/A.
- Change type: Model deployment / training continuation.
- Areas: Model Catalogue, Surfboard, Parking/PUDO lifecycle.
- Changes:
  - Redeployed `raven-orange-rejoicing` checkpoint 30k with local deployment-wrapper X clamp fix and interleave group `parking`.
  - Produced deployed nickname `horse-tomato-magnificent`, session `session_2026_05_31_10_52_33_mmturtle4__raven-orange-rejoicing_interleave_control_xclamp_v1`.
  - Submitted continuation job `172394` / `distinctive-crocodile-azure` from original checkpoint 30k to 80k using the original training image and 100k LR schedule.
  - Final observed train status: `Dispatched` on `aks-prod-training-2-swe.nd96h100c`.
- Task note: [[agent_tasks/2026/05/Week-5/2026-05-31-lr-scheduler-horizon|2026-05-31 LR Scheduler Horizon]]

- [[agent_tasks/2026/05/Week-5/2026-05-31-parking-2026-5-21-baseline-config|Parking 2026.5.21 baseline config]]
  - Labels: parking, config, training
  - Branch: codex/parking-port-past30
  - PR: none
  - Change type: config
  - Areas: wayve/ai/si/configs/parking
  - Changes: binary_version 3.0.65; added parking_bc_train_release_2026_5_21.

## 2026-05-31 - Parking 2026.5.21 Copy Tele Retry

- Topic: Fix and retry Parking 2026.5.21 30K training after missing tele-camera startup failure.
- Labels: parking, config, training, notion
- Branch: `boris/parking-past30-no-standstill-gear-aug/main_cherrypick`
- PR: N/A
- Change type: Code fix / training run / monitoring / Notion update
- Areas: `/workspace/default/wayve/ai/si/configs/parking/parking_config.py`, `/workspace/default/wayve/ai/si/test/configs/test_configs_utils.py`, Parking/PUDO Notion model card
- Changes:
  - [[agent_tasks/2026/05/Week-5/2026-05-31-parking-2026-5-21-baseline-config|Parking 2026.5.21 baseline config]]
  - Pushed commit `99eaa3f4361e` to enable `copy_tele_camera=True` for six-camera parking release training and assert it in config resolution.
  - Submitted job `172457` / `hedgehog-modest-amaranth`, session `session_2026_05_31_21_12_58_p521tele30k`.
  - Monitored to `trainer/global_step=5074` with Surfboard and W&B still running.
  - Created Notion model-card row `hedgehog-modest-amaranth (not interleaved)`.

## 2026-06-01 - UnPUDO DC Fixed Window Buckets

- Topic: Fold DC UnPUDO move-window materialization into the base DC UnPUDO buckets.
- Labels: parking, pudo, unpudo, materialization, notebook.
- Branch: `boris/materialization_unsafe_moving_buckets`.
- PR: N/A.
- Change type: Notebook code change.
- Areas: `/workspace/materialization/wayve/ai/parking/notebooks/pudo_unpudo_materialization.ipynb`.
- Changes:
  - Added `USE_FIXED_UNPUDO_DC_EVENT_WINDOW` and `UNPUDO_DC_FIXED_WINDOW_AFTER_START_US`.
  - Made base `dc_unpudo_*` buckets use `timestamp_unixus..timestamp_unixus+10s` when the flag is enabled.
  - Removed separate `dc_unpudo_move_*` bucket generation and merge wiring.
  - Added unsafe pre-CA UnPUDO buckets from the same unsafe raw anchors.
  - Added comments for fixed DC UnPUDO, unsafe/moving UnPUDO, and forward/reverse derivation; renamed departure output to `dc_unpudo_pre_departure_*`.
  - Stripped stale notebook execution errors and a temporary test comment before PR creation.
- Task note: [[agent_tasks/2026/05/Week-5/2026-05-31-unpudo-materialization-buckets|2026-05-31 UnPUDO Materialization Buckets]]

## 2026-06-01 - LR Scheduler Num Steps PR

- Topic: Isolate BC LR scheduler horizon override from parking branch onto main.
- Labels: parking, training, lr-schedule, pull-request.
- Branch: `boris/lr-scheduler-num-steps`.
- PR: https://github.com/wayveai/WayveCode/pull/115840
- Change type: Code change / regression test / draft PR.
- Areas: `/workspace/WayveCode/wayve/ai/si/config.py`, `/workspace/WayveCode/wayve/ai/si/models/training.py`, `/workspace/WayveCode/wayve/ai/si/test/models/test_training.py`.
- Changes:
  - Added `lr_scheduler_num_steps` config and training-module plumbing.
  - Used the override as scheduler `total_steps` when set, preserving `trainer.max_steps` fallback.
  - Added focused regression coverage and opened draft PR #115840.
- Task note: [[agent_tasks/2026/06/Week-1/2026-06-01-lr-scheduler-num-steps-pr|2026-06-01 LR Scheduler Num Steps PR]]

## 2026-06-01 - UnPUDO Materialization Deep Review

- Topic: Review UnPUDO materialization notebook changes after fixed DC bucket and unsafe pre-CA updates.
- Labels: parking, pudo, unpudo, materialization, review.
- Branch: `boris/materialization_unsafe_moving_buckets`.
- PR: N/A.
- Change type: Review / validation.
- Areas: `/workspace/materialization/wayve/ai/parking/notebooks/pudo_unpudo_materialization.ipynb`, `/workspace/materialization/wayve/ai/si/configs/parking/parking_config.py`.
- Changes:
  - Confirmed notebook invariants for fixed base DC UnPUDO, removed `dc_unpudo_move_*`, directional forward/reverse, unsafe pre-CA, and final merge groups.
  - Noted downstream config still consumes `dc_unpudo_*_very_short` for train, not base `dc_unpudo_*`.
- Task note: [[agent_tasks/2026/05/Week-5/2026-05-31-unpudo-materialization-buckets|2026-05-31 UnPUDO Materialization Buckets]]

## 2026-06-01 - Parking PUDO Bucket Loss Tags

- Topic: Add grouped loss tracking metadata to Parking PUDO/UNPUDO train buckets.
- Labels: parking, pudo, unpudo, training, config.
- Branch: `boris/parking-past30-no-standstill-gear-aug/main_cherrypick`.
- PR: N/A.
- Change type: Config change.
- Areas: `/workspace/WayveCode/wayve/ai/si/configs/parking/parking_config.py`.
- Changes:
  - Added inline `track_tag=True` and `track_tag_group="pudo_unpudo"` to PUDO and UNPUDO train bucket definitions.
  - Left driving, unparking, gear-shift, and validation buckets unchanged.
- Task note: [[agent_tasks/2026/06/Week-1/2026-06-01-parking-pudo-data-mix-train|Parking PUDO Data Mix Train]]

## 2026-06-01 - LR Scheduler Num Steps PR CI Fix

- Topic: Fix PR #115840 baseline config snapshot CI failure.
- Labels: training, lr-schedule, ci, config-snapshot.
- Branch: `boris/lr-scheduler-num-steps`.
- PR: https://github.com/wayveai/WayveCode/pull/115840
- Change type: Test snapshot update.
- Areas: `/workspace/WayveCode/wayve/ai/si/test/test_config_inputs/reference_bc.yaml`.
- Changes:
  - Added `lr_scheduler_num_steps: null` to the BC baseline config reference snapshot.
  - Verified `test_regression` via `//wayve/ai/si:test_config_py_test_core`.
  - Pushed follow-up commit `8159e1b607d6`.
- Task note: [[agent_tasks/2026/06/Week-1/2026-06-01-lr-scheduler-num-steps-pr|2026-06-01 LR Scheduler Num Steps PR]]

## 2026-06-01 - LR Scheduler Num Steps PR Review Fixes

- Topic: Address PR #115840 agentic review comments.
- Labels: training, lr-schedule, ci, pull-request.
- Branch: `boris/lr-scheduler-num-steps`.
- PR: https://github.com/wayveai/WayveCode/pull/115840
- Change type: Code fix / regression tests.
- Areas: `/workspace/WayveCode/wayve/ai/si/models/training.py`, `/workspace/WayveCode/wayve/ai/si/test/models/test_training.py`.
- Changes:
  - Made `lr_scheduler_num_steps` fallback explicit and reject non-positive values.
  - Expanded regression coverage to `one-cycle`, `plateau`, and invalid override values.
  - Pushed commit `d908a40c3558`.
- Task note: [[agent_tasks/2026/06/Week-1/2026-06-01-lr-scheduler-num-steps-pr|2026-06-01 LR Scheduler Num Steps PR]]

## 2026-06-03 - LR Scheduler Num Steps Review Edge Cases

- Topic: Address PR #115840 human review comment on scheduler horizon edge cases.
- Labels: training, lr-schedule, review, pull-request.
- Branch: `boris/lr-scheduler-num-steps`.
- PR: https://github.com/wayveai/WayveCode/pull/115840
- Change type: Code fix / regression tests.
- Areas: `/workspace/WayveCode/wayve/ai/si/models/training.py`, `/workspace/WayveCode/wayve/ai/si/test/models/test_training.py`.
- Changes:
  - Accepted explicit scheduler horizons equal to or greater than `trainer.max_steps`.
  - Rejected positive `lr_scheduler_num_steps` values shorter than `trainer.max_steps` to avoid scheduler overrun during training.
  - Expanded optimizer scheduler regression coverage for equal, longer, and shorter-than-trainer cases across `one-cycle` and `plateau`.
  - Verified focused optimizer tests with coverage disabled for the pytest filter, plus package ruff and flake8 lint.
- Task note: [[agent_tasks/2026/06/Week-1/2026-06-01-lr-scheduler-num-steps-pr|2026-06-01 LR Scheduler Num Steps PR]]


## 2026-06-01 - HARI PUDO One-Sample Clip Input

- Topic: Allow one-sample UnPUDO standstill clip input generation directly from the event table.
- Labels: parking, pudo, unpudo, hari, run-clips.
- Branch: `tomboehling/hari_pudo`.
- PR: N/A.
- Change type: Script change / workflow prep.
- Areas: `/workspace/classifiers/wayve/ai/datasets/annotation_operations_tools/scripts/generate_run_clips_input.py`.
- Changes:
  - Added `--source-filter-expr`, `--limit`, and `--vehicle-platform-id` to avoid creating a separate one-row source table for smoke tests.
  - Parsed `--match-tolerance-seconds` as a float for CLI-specified tolerances.
  - Avoided eager imports of the full inference task registry and Databricks Connect during CLI startup.
  - Verified the script help via Bazel and recorded the one-sample command pattern.
- Task note: [[projects/hari-pudo-classifiers|HARI PUDO classifiers]]

## 2026-06-01 - HARI UnPUDO Smoke Clip

- Topic: Generate one UnPUDO standstill run_clips smoke video from the parking event table.
- Labels: parking, pudo, unpudo, hari, run-clips, flyte.
- Branch: `boris/hari_pudo`.
- PR: N/A.
- Change type: Script change / workflow run / smoke validation.
- Areas: `/workspace/classifiers/wayve/ai/datasets/annotation_operations_tools/scripts/generate_run_clips_input.py`, `/workspace/classifiers/wayve/ai/datasets/flyte/inference_tasks/__init__.py`, `/workspace/classifiers/wayve/ai/lib/calibration.py`.
- Changes:
  - Generated a one-row `run_clips` input parquet from `hive_metastore.parking.pudo_unpudo_unpark_events` using an exact `gen2` UnPUDO standstill event.
  - Ran remote Flyte execution `ac5pcvl8wsx79fj499f2`; setup succeeded but Spark node failed with a system error after scheduling latency.
  - Ran the documented local workflow, fixed an old-branch calibration API mismatch, encoded a 1920x1080 smoke MP4, and uploaded it to `wayveproddataset/databricks-users`.
- Task note: [[projects/hari-pudo-classifiers|HARI PUDO classifiers]]

## 2026-06-01 - HARI UnPUDO Mixed Source Query

- Topic: Support SQL source selection for mixed UnPUDO clip batches.
- Labels: parking, pudo, unpudo, hari, run-clips, databricks.
- Branch: `boris/hari_pudo`.
- PR: N/A.
- Change type: Script change.
- Areas: `/workspace/classifiers/wayve/ai/datasets/annotation_operations_tools/scripts/generate_run_clips_input.py`.
- Changes:
  - Added `--source-sql` so source rows can be generated by SQL unions and random sampling before the nearest-corpus join.
  - Verified the CLI help through Bazel.
- Task note: [[projects/hari-pudo-classifiers|HARI PUDO classifiers]]

## 2026-06-01 - HARI UnPUDO Mixed Flyte Batch

- Topic: Launch timestamped mixed UnPUDO clip generation batch in Flyte.
- Labels: parking, pudo, unpudo, hari, run-clips, flyte.
- Branch: `boris/hari_pudo`.
- PR: N/A.
- Change type: Workflow run.
- Areas: `/workspace/classifiers/wayve/ai/datasets/annotation_operations_tools/scripts/generate_run_clips_input.py`, Flyte `run_clips` workflow.
- Changes:
  - Generated 492 matched `run_clips` input rows from all moving UnPUDO events plus 250 random standstill rows.
  - Launched Flyte execution `a9n8glpdgt859n4l5kpz` with timestamped output prefix and `chunk_size=1`, `num_concurrent_tasks=50`.
- Task note: [[projects/hari-pudo-classifiers|HARI PUDO classifiers]]

## 2026-06-02 - Parking PUDO Baseline PR

- Topic: Create clean Parking PUDO baseline PR from current main.
- Labels: parking, pudo, baseline, pr, config, deployment.
- Branch: `06-02-pudo-baseline`.
- PR: https://github.com/wayveai/WayveCode/pull/116069.
- Change type: Code change / PR.
- Areas: `/tmp/pudo-baseline-pr/wayve/ai/si`, `/tmp/pudo-baseline-pr/wayve/ai/zoo/deployment`, `/tmp/pudo-baseline-pr/wayve/ai/lib`.
- Changes:
  - Added the active Parking PUDO datamodule config for the new root and release `2026_5_21` mode.
  - Removed the interleave-control wrapper/training plumbing from the PR scope.
  - Preserved `wayve/ai/zoo/data/parking.py` and kept the final diff to 17 intended files.
  - Verified config resolution plus focused deployment, training, and behavior-customization tests.
- Task note: [[agent_tasks/2026/06/Week-1/2026-06-02-pudo-baseline-pr|2026-06-02 PUDO Baseline PR]]

## 2026-06-02 - HARI UnPUDO Flyte Interface Fix

- Topic: Fix Flyte input-schema mismatch and rerun mixed UnPUDO clip generation.
- Labels: parking, pudo, unpudo, hari, run-clips, flyte.
- Branch: `boris/hari_pudo`.
- PR: N/A.
- Change type: Code fix / image publish / workflow run.
- Areas: `/workspace/classifiers/wayve/ai/datasets/flyte/workflow.py`, `/workspace/classifiers/wayve/ai/datasets/flyte/common/infra/orchestration.py`, Flyte `run_clips` workflow.
- Changes:
  - Diagnosed failed execution `a9n8glpdgt859n4l5kpz` as a FlyteKit input decoding mismatch, not a source query problem.
  - Removed stale `dataset_delta` from the workflow/task interface so the launched workflow matches the remote task input schema.
  - Built `//wayve/ai/datasets/flyte/...`, published a test workflow image, and relaunched execution `a9lgsnpj2mjz7ctlr6kl` with a fresh timestamped output prefix.
- Task note: [[projects/hari-pudo-classifiers|HARI PUDO classifiers]]

## 2026-06-02 - UnPUDO Run Clips Camera-Present Rerun

- Topic: Filter UnPUDO run_clips inputs for five-camera video availability and relaunch the Flyte batch.
- Labels: parking, unpudo, hari, flyte, video-generation.
- Branch: `boris/hari_pudo`.
- PR: N/A.
- Change type: Code change / Flyte experiment.
- Areas: `/workspace/classifiers/wayve/ai/datasets/annotation_operations_tools/scripts/generate_run_clips_input.py`, `/workspace/classifiers/wayve/ai/datasets/flyte`, `/home/borisindelman/git/vault/projects/hari-pudo-classifiers.md`.
- Changes:
  - Diagnosed latest worker failures as missing camera video data (`right_backward`, `video_path=None`) rather than a Flyte/query parallelization issue.
  - Added exact-row camera `video_file_name` validation to `generate_run_clips_input.py` via `--require-camera-video-files`; kept stricter full-window validation plumbing for future use.
  - Generated `camera_present_20260602_092236_UTC/run_clips_input.parquet` with 497 rows from all moving UnPUDO plus 250 random standstill UnPUDO candidates.
  - Launched Flyte execution `askdlss5f75w6tszggdr` with `chunk_size=1`, `num_concurrent_tasks=50`, 32s clips, 1s highlight, and 3x playback.
- Project note: [[projects/hari-pudo-classifiers|HARI PUDO classifiers]]

## 2026-06-02 - UnPUDO Run Clips Segment Cleanup Rerun

- Topic: Fix full-window missing-camera failures in UnPUDO run_clips and launch corrected Flyte batch.
- Labels: parking, unpudo, hari, flyte, video-generation, run-clips.
- Branch: `boris/hari_pudo`.
- PR: N/A.
- Change type: Code change / image publish / workflow run.
- Areas: `/workspace/classifiers/wayve/ai/datasets/flyte/inference_tasks/run_clips/run_clips.py`, Flyte `run_clips` workflow, `/home/borisindelman/git/vault/projects/hari-pudo-classifiers.md`.
- Changes:
  - Diagnosed remaining failures as full-window missing camera metadata despite valid center-row camera filenames.
  - Added guarded `drop_rows_with_missing_camera_video_files` support to filter unusable segment rows before dataloader decoding.
  - Verified with Flyte subtree build, Flyte lint, and direct `test_run_clips.py`; documented unrelated embedding-head collection failure in the project note.
  - Published corrected image digest `sha256:74479ab9e03b6d604a5a7ea126f81615289f740d9946c6063c58f715e9e037da` and launched execution `a97nqrpw2gb6rd2ljrn9` to `camera_present_drop_missing_20260602_095509_UTC`.
- Project note: [[projects/hari-pudo-classifiers|HARI PUDO classifiers]]

## 2026-06-02 - UnPUDO Run Clips Completion and Blob Viewer

- Topic: Confirm completed UnPUDO clip batch and serve blob-backed video browser.
- Labels: parking, unpudo, hari, flyte, video-generation.
- Branch: `boris/hari_pudo`.
- PR: N/A.
- Change type: Workflow status / local viewing setup.
- Areas: Flyte `run_clips` execution `a97nqrpw2gb6rd2ljrn9`, `/tmp/unpudo_clip_serve/index.html`.
- Changes:
  - Confirmed Flyte execution `a97nqrpw2gb6rd2ljrn9` succeeded, with `end-node` complete at 2026-06-02 12:55:24 UTC.
  - Counted 496 generated MP4 blobs in `camera_present_drop_missing_20260602_095509_UTC/gen2`.
  - Reused the existing port `3000` server and replaced the served index with a blob-backed viewer using signed Azure Blob URLs, avoiding local MP4 downloads.
- Project note: [[projects/hari-pudo-classifiers|HARI PUDO classifiers]]

## 2026-06-03 - Driving Interleave-Control Deploys

- Topic: Deploy driving models with interleave control and empty interleave group.
- Labels: parking, deployment, interleave-control, driving-models.
- Branch: `03-20-si-group-interleave-control-support`.
- PR: N/A.
- Change type: Deployment run.
- Areas: `/workspace/WayveCode`, `/workspace/parking-deploy-outputs`.
- Changes:
  - Deployed `wallaby-compact-moccasin` to `zebra-aquamarine-reclusive` with Gen2 artefact `53f815b3-7014-4d3c-9715-bfc69f5d5add`.
  - Deployed `ibex-lime-meritorious` to `anteater-harlequin-colorful` with Gen2 artefact `5d651f7b-93b0-44f4-93f9-32dab0b8553c`.
  - Used `--enable_interleave_control` with empty `--interleave_control_group` and local output under `/workspace/parking-deploy-outputs`.
  - Verified generated Gen2 configs include `interleave_control`, radar X/Y/Z/range-rate/SNR, and `points_per_scan: 800`.
- Task note: [[agent_tasks/2026/06/Week-1/2026-06-03-driving-interleave-control-deploys|2026-06-03 Driving Interleave-Control Deploys]]

## 2026-06-03 - Interleave-Control Main Merge

- Topic: Merge latest `origin/main` into the interleave-control deployment branch.
- Labels: parking, deployment, interleave-control, merge.
- Branch: `03-20-si-group-interleave-control-support`.
- PR: N/A.
- Change type: Merge / conflict resolution.
- Areas: `/workspace/WayveCode/wayve/ai/si`, `/workspace/WayveCode/wayve/ai/zoo/deployment`.
- Changes:
  - Resolved conflicts in deploy, deployment preparation, training deployment config, behavior customization, deployment wrapper, deployment tests, and RL reference config.
  - Kept branch interleave-control behavior while preserving main's `dynamo_export`, kinematic output, shift-by-wire fail-fast guard, mitigation request behavior, and shape-[1] understeer LUT indexing.
  - Completed merge commit `d7b14ed5a32d`.
  - Verified `git diff --check`, no conflict markers, and `//wayve/ai/zoo/deployment:test_deployment_py_test`; SI deployment test was blocked by ACR auth for `azure-storage/azurite`.
- Task note: [[agent_tasks/2026/06/Week-1/2026-06-03-interleave-control-main-merge|2026-06-03 Interleave Control Main Merge]]

## 2026-06-04 - PR 116069 Driving Data Update

- Topic: Port updated driving data config into PR 116069.
- Labels: parking, pudo, config, pr-116069.
- Branch: `06-02-pudo-baseline`.
- PR: `https://github.com/wayveai/WayveCode/pull/116069`.
- Change type: Code change, uncommitted.
- Areas: `/workspace/WayveCode/wayve/ai/si/configs/parking/parking_config.py`.
- Changes:
  - Restored D26_3_6 datamodule aliases/ratio variants on top of the updated `parking_pudo_bc_datamodule_cfg`.
  - Added `parking_pudo_bc_D26_3_6_datamodule`, `parking_bc_D26_3_6_datamodule`, and `pudo_bc_D26_3_6_datamodule`.
  - Adapted old aggregate `unpudo`/`unpark` ratio controls to the current granular `unpudo_*`, `unparking`, and `gear_shift` groups.
  - Kept diffusion config unchanged and did not keep unsupported `max_augmentation_errors=1000`.
  - Verified `git diff --check` and `//wayve/ai/si:py_lint_ruff`.
- Task note: [[agent_tasks/2026/06/Week-1/2026-06-04-pr116069-driving-data|2026-06-04 PR 116069 Driving Data Update]]

## 2026-06-03 - Vampire Bat Driving Redeploy

- Topic: Redeploy `vampire-bat-ardent-emerald` as a driving model with interleave control.
- Labels: parking, deployment, interleave-control, driving-models.
- Branch: `03-20-si-group-interleave-control-support`.
- PR: N/A.
- Change type: Code fix / deployment run.
- Areas: `/workspace/WayveCode/wayve/ai/si/deploy.py`, `/workspace/WayveCode/wayve/ai/si/test/test_deploy.py`, `/workspace/parking-deploy-outputs`.
- Changes:
  - Pushed merge branch and two deploy compatibility fixes: `ff51c2e0fab9`, `70dfa77a6f3c`.
  - Fixed temporal-cache config mutation for old TD3 checkpoint-loader configs and release-loader override configs.
  - Redeployed source session `session_2026_05_22_08_58_12_baseline_rl_rmf` at step `150000` with empty interleave group.
  - New deployed nickname is `falcon-orange-creative`; Gen2 artefact id is `c28dd87d-d3c5-4131-8d55-4e955949eb24`.
  - Verified Gen2 config has radar X/Y/Z/range-rate/SNR, `points_per_scan: 800`, and `interleave_control`.
- Task note: [[agent_tasks/2026/06/Week-1/2026-06-03-vampire-bat-driving-redeploy|2026-06-03 Vampire Bat Driving Redeploy]]

## 2026-06-03 - Vampire Bat No Temporal Override Redeploy

- Topic: Redeploy `vampire-bat-ardent-emerald` without forcing temporal caching.
- Labels: parking, deployment, interleave-control, driving-models.
- Branch: `03-20-si-group-interleave-control-support`.
- PR: N/A.
- Change type: Revert / deployment run.
- Areas: `/workspace/WayveCode/wayve/ai/si/deploy.py`, `/workspace/WayveCode/wayve/ai/si/test/test_deploy.py`, `/workspace/parking-deploy-outputs`.
- Changes:
  - Reverted local temporal-cache compatibility commits with `8c5c4fb3d23d` and `394436d805a7`; branch is ahead of origin by these commits and not pushed.
  - Redeployed source session `session_2026_05_22_08_58_12_baseline_rl_rmf` at step `150000` without `--with_temporal_caching True`.
  - New deployed nickname is `cheeky-amethyst-caribou`; Gen2 artefact id is `e98d65d3-b1a6-4896-a5e0-80e5b50f000f`.
  - Deploy summary showed temporal caching `Same as trained model`; runtime still enabled cache on radar/video adaptors from the trained config.
  - Verified Gen2 config has radar X/Y/Z/range-rate/SNR, `points_per_scan: 800`, and `interleave_control`.
- Task note: [[agent_tasks/2026/06/Week-1/2026-06-03-vampire-bat-no-temporal-override-redeploy|2026-06-03 Vampire Bat No Temporal Override Redeploy]]

## 2026-06-03 - Event Gear Smoothing

- Topic: Add configurable smoothed-gear transition columns to PUDO / UnPUDO event detection.
- Labels: parking, pudo, unpudo, materialization, notebook.
- Branch: `boris/materialization_unsafe_moving_buckets`.
- PR: `https://github.com/wayveai/WayveCode/pull/115845`; isolated event PR `https://github.com/wayveai/WayveCode/pull/116673`.
- Change type: Notebook code change, uncommitted.
- Areas: `/workspace/materialization/wayve/ai/parking/notebooks/pudo_unpudo_event_detection.ipynb`.
- Changes:
  - Added `ENABLE_GEAR_SMOOTHING`, `GEAR_SMOOTHING_MIN_SEGMENT_US`, and `SMOOTHED_GEAR_COL` config knobs.
  - Built `gear_change_to_park` and `gear_change_from_park` from smoothed per-frame gear context.
  - Switched PUDO and UnPUDO gear transition seeding to use the new booleans while preserving raw gear and output table schema.
  - Removed a stale trip-table helper join to `prod_analytics.analytics.robotaxi_disengagement` after a runtime failure on unavailable `episode_start_lat` / `episode_start_lon` columns; the join's `event_success` output was not consumed downstream.
  - Added deterministic event-key canonicalization after location dedup, after office-geofence filtering, and before final enrichment/write to prevent duplicate event rows introduced by smoothed-gear candidate paths.
  - Marked trip-summary PUDO candidates as `source = "trip_summary"` instead of inheriting the raw hazard source label.
  - Isolated the event notebook changes onto `boris/event_creation_gear_fix` from latest `main` and opened draft PR #116673.
  - Removed unused `prev2_gear_direction` and `next_gear_direction` context columns from the isolated PR branch.
  - Validated notebook JSON, code-cell AST parse, `git diff --check`, and static invariants.
- Task note: [[agent_tasks/2026/06/Week-1/2026-06-03-event-gear-smoothing|2026-06-03 Event Gear Smoothing]]

## 2026-06-03 - Zak Datamodule Parking Training

- Topic: Wire Zak Murez's experimental PUDO datamodule into SI parking training.
- Labels: parking, pudo, datamodule, training, experiment.
- Branch: `boris/zak_datamodule`.
- PR: N/A.
- Change type: Code change, local experiment.
- Areas: `/workspace/default/wayve/ai/si/datamodules`, `/workspace/default/wayve/ai/si/configs/parking`, `/workspace/zak/wayve/ai/experimental`.
- Changes:
  - Pushed experiment commit `ce48bec9325d` to `origin/boris/zak_datamodule`.
  - Added a local SI datamodule adapter that imports Zak's `wayve.ai.experimental` package from `/workspace/zak`, builds `mcv_new_phase2.yml`, and maps post-transform experimental batches into SI `DataKeys`.
  - Registered `parking_bc_train_zak_mcv_new_phase2` as an experiment mode using the June parking model family, with radar, behavior-control auxiliary losses, and checkpoint/export callbacks disabled for local scratch compatibility.
  - Added a focused unit test for the Zak-to-SI batch shape/key mapping.
  - Added dev-only Zak parquet fractioning so local `dev=true` smoke runs build 0.1% of the parquet list instead of the full dataset.
  - Fixed local smoke-run blockers: Zak package namespace import, local `mcap` dependency lookup, `nuscenes-devkit` dependency, Zak Git LFS data pointer, and missing blank `signs_gemini.txt` annotation file.
  - Ported the updated `WFM_v1.4.0.550M(1.5.0)` release model path from `boris/parking-past30-no-standstill-gear-aug/main_cherrypick_new_driving`, adding `parking_bc_train_release_2026_5_21` and Zak-specific `parking_bc_train_zak_mcv_new_phase2_release_2026_5_21`.
  - Verified `//wayve/ai/si/datamodules:test_zak_experimental`, `//wayve/ai/si:train`, and a one-step local train with Zak data/augmentations reaching `max_steps=1`.
  - Verified the updated release-WFM Zak mode with a one-step local train reaching `max_steps=1`.
- 2026-06-04 update:
  - Pushed parking-based branch through `9be51ff18772` with remote-train robustness fixes and bounded diagnostics for Zak loader/constructor startup.
  - Fixed non-finite cumulative-distance handling and frame-to-frame odometry distance computation, with focused regressions in `//wayve/ai/experimental:test_single_run`.
  - Monitored remote runs through job `174286`; it failed on agent-added diagnostic logging before proving the underlying constructor behavior.
  - Continued without starting a new remote run: fixed the diagnostic logger crash, added Zak-to-SI adapter validation, mapped Zak unknown indicator `-1` to SI unknown `4`, and preserved Zak's `indicator_stick` augmentation for vehicle conditioning.
  - Verified bounded local `dev=false` training reaches `max_steps=1` with Zak data/augmentations and the release WFM path at batch size 1; batch size 4 reaches first iteration but OOMs locally.
  - Ran bounded local `dev=false` training for 1000 steps at batch size 1; Zak dataset loaded 264/264 runs, sampler built, first iteration completed, and Lightning stopped at `max_steps=1000` with exit code 0.
  - Recorded repeated tolerated object-store warnings for sampled camera paths ending in `/nan`; they did not stop local training.
  - Committed and pushed `bab774dcb5cd` (`fix: validate Zak parking datamodule batches`) to `origin/boris/zak_datamodule_parking_cherrypick`.
  - Published image `wayvetraining.azurecr.io/scaled-intelligence:bab774dcb5cd1391d30f9af9b7315a048e5b8489` and submitted Surfboard job `174358` / session `session_2026_06_04_07_41_45_z521v` on 4 H100 AKS nodes; final observed state was `Running`.
  - Re-polled job `174358` at `2026-06-04 07:58 UTC`: still `Running`, no termination reason, empty downloaded error logs, and actively constructing Zak datasets, but not yet at `loading_runs_done` or first training iteration. Full Zak data loading is slow, with progress in the tens of runs out of roughly `8238` per rank after several minutes.
  - Stopped job `174358` on user request before first training step; terminal state became `Failed` with status reason `CancelRequested by user`, final logs still had empty downloaded error files and showed eager Zak data loading around `5200-6400` of `8237/8238` runs per rank.
  - Added cache-only parquet wiring for Zak's experimental parquet loader path, committed and pushed `fd04bc5c9ed5` (`fix: use cached Zak parquets for parking training`), then dispatched cached-parquet 0.25-fraction training.
  - Cancelled accidental P3 job `174468` before start and resubmitted as P1 job `174469` / session `session_2026_06_04_12_29_17_zcache25`; final observed state was `Running`.
  - Monitored job `174514` / session `session_2026_06_04_14_16_56_si_parking_bc_train_zak_mcv_new_phase2_release_2026_5_21_zcm25fix` through the requested 5K-sample threshold; W&B reached `trainer/samples_seen=5248`, `trainer/global_step=41`, and Surfboard still reported `Running` with no termination reason.
  - Investigated job `174514` after it later failed; rank logs pointed to CUDA/NCCL peer GPU memory over NVLink or hardware error, not data loading.
  - Resubmitted retry job `174548` / session `session_2026_06_04_15_55_54_zakzcm25r2` with the same config and `--max_restarts 0`; monitored through `trainer/samples_seen=10368`, `trainer/global_step=81`, with run state still `running`.
  - Investigated job `174548` after terminal failure; root cause was non-finite Zak `egopose` mapped to SI `VEHICLE_POSE`, then patched the Zak-to-SI adapter to repair non-finite pose, waypoint, scalar control, and camera-calibration fields with focused regression tests.
  - Reduced Zak datamodule non-dev per-rank batch size from `4` to `2` for the parking release mode, keeping dev at `1`; config and adapter tests pass.
  - Committed and pushed `9c4cee467c46`, published the matching scaled-intelligence image, and dispatched batch-2 cached-parquet retry job `174665` / session `session_2026_06_04_20_56_25_si_parking_bc_train_zak_mcv_new_phase2_release_2026_5_21_zcm25b2` at priority `P1`.
  - Monitored job `174665` to `Running`; logs showed cached-parquet `Load runs` completed at `2060/2060` and sampler construction started, while W&B still reported `trainer/global_step=0` / `trainer/samples_seen=0` at last check.
  - Cancelled job `174665` after confirming it trained too slowly versus Zak's latest native W&B runs; terminal Surfboard state `Canceled`, final W&B summary `trainer/global_step=496`, `trainer/samples_seen=31744`, throughput `5.92` samples/sec world.
  - Notion update remains pending unless requested for this experimental branch.
- Task note: [[agent_tasks/2026/06/Week-1/2026-06-03-zak-datamodule-parking-training|2026-06-03 Zak Datamodule Parking Training]]

## 2026-06-07 - Parking/PUDO Strict Filter Disable

- Topic: Disable overly aggressive strict data-quality filters from generic parking/PUDO materialisation.
- Labels: parking, pudo, materialization, generic-materialisation, filters.
- Branch: `boris/pudo_generic_materialization`.
- PR: Draft PR to main exists for the branch.
- Change type: Code change, local.
- Areas: `/workspace/WayveCode/wayve/ai/services/sampling/datasets/parking_pudo/common.py`.
- Changes:
  - Removed missing-wheel-odometry, diversion/lens-obscured, and broad out-of-scope filters from active parking/PUDO bucket exclusions.
  - Preserved those filters in `PARKING_PUDO_DISABLED_DATA_QUALITY_EXCLUSIONS` for a future stricter variant.
  - Added regression assertions for the disabled filters and verified the focused parking_pudo test slice with Bazel.
  - Pushed commit `916300d7c11c` and submitted full branch-release reruns:
    - `parking_pudo/default`: Flyte `ajknvcp7szpbd79b9672`.
    - `parking_pudo/anchors`: Flyte `agrhccqmg2dvtgmcjd88`.
- Task note: [[agent_tasks/2026/06/Week-1/2026-06-06-parking-pudo-generic-materialization|2026-06-06 Parking PUDO Generic Materialization]]

## 2026-06-08 - Parking/PUDO Anchor Gap Follow-Up

- Topic: Relax remaining generic Parking/PUDO strict filters and continue event-table vs anchor-gap diagnosis.
- Labels: parking, pudo, materialization, generic-materialisation, filters, anchors.
- Branch: `boris/pudo_generic_materialization`.
- PR: Draft PR to main exists for the branch.
- Change type: Code change, Flyte runs, data investigation.
- Areas: `/workspace/WayveCode/wayve/ai/services/sampling/datasets/parking_pudo`.
- Changes:
  - Removed `select_allowed_run_tags` and `exclude_low_steering_bias_confidence` from active Parking/PUDO bucket exclusions.
  - Preserved both filters in `PARKING_PUDO_DISABLED_DATA_QUALITY_EXCLUSIONS` for a stricter future dataset variant.
  - Updated README and regression assertions for the relaxed exclusion policy.
  - Pushed commit `a0fc5caa4984` and submitted full branch-release reruns:
    - `parking_pudo/default`: Flyte `a7v5p9b8vwfpdc74b8nx`.
    - `parking_pudo/anchors`: Flyte `ashhhp9w5wlvcg2gv9r8`.
  - Found additional non-filter root causes for missing `dc_pudo_uk` anchors: excluded-geofence hazard suppression and empty approach windows at some gear-to-park anchors.
- Task note: [[agent_tasks/2026/06/Week-2/2026-06-08-parking-pudo-anchor-gap-debug|2026-06-08 Parking PUDO Anchor Gap Debug]]

## 2026-06-08 - Parking/PUDO Global Geofence Exclusion

- Topic: Reintroduce global geofence exclusion for generic Parking/PUDO buckets.
- Labels: parking, pudo, materialization, generic-materialisation, geofence, filters.
- Branch: `boris/pudo_generic_materialization`.
- PR: Draft PR to main exists for the branch.
- Change type: Code change.
- Areas: `/workspace/WayveCode/wayve/ai/services/sampling/datasets/parking_pudo`.
- Changes:
  - Added `exclude_geofenced` back to `PARKING_PUDO_BASE_EXCLUSIONS`.
  - This applies to every default and anchor bucket so no samples are emitted from excluded offices/test tracks.
  - Kept PUDO hazard geofence suppression in `signals.py`.
  - Updated README and regression assertions; focused parking_pudo Bazel test passed.
- Task note: [[agent_tasks/2026/06/Week-2/2026-06-08-parking-pudo-anchor-gap-debug|2026-06-08 Parking PUDO Anchor Gap Debug]]

## 2026-06-08 - Parking/PUDO Out-of-Scope Filter Narrowing

- Topic: Keep out-of-scope intervention filtering except for diversion and lens-obscured.
- Labels: parking, pudo, materialization, generic-materialisation, filters, interventions.
- Branch: `boris/pudo_generic_materialization`.
- PR: Draft PR to main exists for the branch.
- Change type: Code change.
- Areas: `/workspace/WayveCode/wayve/ai/services/sampling/datasets/parking_pudo`.
- Changes:
  - Added a parking/PUDO-specific active filter that excludes `OUT_OF_SCOPE_INTERVENTION_WHATS` except `diversion` and `lens_obscured`.
  - Kept `exclude_diversion_and_lens_obscured_interventions` disabled.
  - Updated README and regression assertions; focused parking_pudo pytest and ruff lint passed.
- Task note: [[agent_tasks/2026/06/Week-2/2026-06-08-parking-pudo-anchor-gap-debug|2026-06-08 Parking PUDO Anchor Gap Debug]]

## 2026-06-08 - Parking/PUDO Event-vs-Anchor Recheck

- Topic: Recheck missing PUDO/UnPUDO event-table rows against completed generic anchor parquet.
- Labels: parking, pudo, materialization, anchors, databricks.
- Branch: `boris/pudo_generic_materialization`.
- PR: Draft PR to main exists for the branch.
- Change type: Data investigation.
- Areas: `parking.pudo_unpudo_unpark_events_gear_fix`, `sampling_materialised/parking_pudo/anchors`.
- Changes:
  - Exported deduped PUDO/UnPUDO event-table rows and compared them with local copies of `dc_pudo_*` and `dc_unpudo_*` anchor parquet.
  - Found exact timestamp matching overstates the UnPUDO gap because many generic movement anchors are within `~0.05s` to `1s` of the notebook timestamp.
  - Confirmed the remaining UK/USA event-vs-anchor gap is still large after tolerance checks.
  - Inspected a concrete missing `dc_pudo_uk` example and confirmed raw gear, hazard, speed, autonomy, skip-reason, and filtered-corpus signals are valid, leaving generic window/assignment or another base exclusion as the next trace target.
- Task note: [[agent_tasks/2026/06/Week-2/2026-06-08-parking-pudo-anchor-gap-debug|2026-06-08 Parking PUDO Anchor Gap Debug]]

## 2026-06-08 - Event Clip Viewer Anchor Comparison

- Topic: Add event-table vs materialization-anchor comparison to the Parking event clip viewer.
- Labels: parking, pudo, event-viewer, anchors, materialization.
- Branch: `boris/event_clip_viewer`.
- PR: n/a.
- Change type: Code change, local server.
- Areas: `/workspace/event_clip_viewer/wayve/ai/parking/tools/event_clip_viewer`.
- Changes:
  - Added an anchor-comparison mode defaulting to `dc_pudo_uk` and the latest parking/PUDO anchors root.
  - Loaded selected bucket anchors from parquet and matched them to event-table rows by nearest same-run timestamp within 30 seconds.
  - Added matched, missing-in-anchors, event rows, and anchor rows tables while preserving clip playback.
  - Verified scoped `py_checks`, ran a small matcher smoke check, and served the app on port 3001.
- Task note: [[agent_tasks/2026/06/Week-2/2026-06-08-event-clip-viewer-anchor-comparison|2026-06-08 Event Clip Viewer Anchor Comparison]]

## 2026-06-08 - Event Clip Viewer Anchor Cache Fix

- Topic: Correct event-viewer anchor root and avoid slow full-root scans.
- Labels: parking, pudo, event-viewer, anchors, materialization, cache.
- Branch: `boris/event_clip_viewer`.
- PR: n/a.
- Change type: Code change, local server.
- Areas: `/workspace/event_clip_viewer/wayve/ai/parking/tools/event_clip_viewer`.
- Changes:
  - Restored the default anchor root to `parking_pudo/anchors/boris-pudo-generic-materialization/2026-06-08-1`.
  - Replaced remote recursive bucket discovery with the known parking/PUDO bucket list.
  - Added selected-bucket local parquet caching under `/tmp/event_clip_viewer_anchor_cache`.
  - Added an `all` split default and fixed split-specific loading so absent splits no longer fall back to train.
  - Verified corrected `dc_pudo_uk` counts: `28,658` all-split anchors, `26,362` matched events within 30s, `24,993` missing events.
- Task note: [[agent_tasks/2026/06/Week-2/2026-06-08-event-clip-viewer-anchor-comparison|2026-06-08 Event Clip Viewer Anchor Comparison]]

## 2026-06-08 - Parking/PUDO Anchor Geofence Rerun

- Topic: Dispatch anchor materialization after global geofence reintroduction.
- Labels: parking, pudo, materialization, anchors, flyte, geofence.
- Branch: `boris/pudo_generic_materialization`.
- PR: Draft PR to main exists for the branch.
- Change type: Flyte run.
- Areas: `wayve/ai/services/sampling/datasets/parking_pudo`.
- Changes:
  - Published sampling image `wayveacrprodflyte.azurecr.io/sampling@sha256:b8d0012d96d563423fc346ba82e7f1fc32a81462b5d7b025b9a443a37a8b46d7`.
  - Pushed branch-release tag `sampling/parking_pudo/anchors/boris-pudo-generic-materialization/2026-06-08-2`.
  - Submitted `parking_pudo/anchors` Flyte execution `a6jn55f87zptzqkkdsv7`.
  - Expected output root: `sampling_materialised/parking_pudo/anchors/boris-pudo-generic-materialization/2026-06-08-2`.
- Task note: [[agent_tasks/2026/06/Week-2/2026-06-08-parking-pudo-anchor-gap-debug|2026-06-08 Parking PUDO Anchor Gap Debug]]

## 2026-06-09 - Parking/PUDO Anchors Current Rerun

- Topic: Dispatch full anchors materialization from current branch state.
- Labels: parking, pudo, materialization, anchors, flyte.
- Branch: `boris/pudo_generic_materialization`.
- PR: Draft PR to main exists for the branch.
- Change type: Flyte run.
- Areas: `wayve/ai/services/sampling/datasets/parking_pudo`.
- Changes:
  - Fast-forwarded local branch to `d8d061a38992b97e6d63e3acfb38a93db0335fe5`.
  - Refreshed ACR auth and published missing sampling image tag `borisindel-tmp-build-0.1.125-boris-pudo_generic_materialization-59584`.
  - Submitted full `parking_pudo/anchors` sample workflow execution `alfttk58xgtc5gdgwg7f`.
  - Expected output root: `sampling_materialised/parking_pudo/anchors/boris-pudo-generic-materialization/2026-06-09-1`.
- Task note: [[agent_tasks/2026/06/Week-2/2026-06-09-parking-pudo-anchors-current-rerun|2026-06-09 Parking/PUDO Anchors Current Rerun]]

## 2026-06-09 - Parking/PUDO Anchor 120s Mismatch Audit

- Topic: Audit `dc_pudo_uk` notebook/generic anchor mismatches with a 120s threshold and temporary no-snap code.
- Labels: parking, pudo, materialization, anchors, databricks, flyte.
- Branch: `boris/pudo_generic_materialization`.
- PR: Draft PR to main exists for the branch.
- Change type: Flyte run, data investigation.
- Areas: `wayve/ai/services/sampling/datasets/parking_pudo`, `wayve/ai/parking/tools/event_clip_viewer`.
- Changes:
  - Published sampling image digest `sha256:cb913f28e91c8ff258de411d040a9fef1b712ea5b7fefdf4dc7a443989dcf6e5` with `_snap_park_to_stop` temporarily removed.
  - Submitted full anchors sample workflow execution `amspk7tzzcgd9ds4tjvm`.
  - Recomputed cached `dc_pudo_uk` event-vs-anchor comparison at 120s: `30,061` matched, `2,075` missing in anchors, `4,524` missing in event table.
  - Debugged five March-May rows from each mismatch type with `debug_sampling`.
  - Found four of five sampled missing-in-anchor rows are selected by current code and are stale-root issues; one remains a real generic-vs-notebook PUDO context mismatch.
  - Found sampled missing-in-event-table rows are current generic PUDO anchors, while notebook rows are absent, shifted outside 120s, or classified as another event type.
- Task note: [[agent_tasks/2026/06/Week-2/2026-06-09-parking-pudo-anchor-mismatch-debug|2026-06-09 Parking/PUDO Anchor Mismatch Debug]]

## 2026-06-09 - Event Viewer Reverse Anchor Mismatches

- Topic: Make event-viewer anchor rows missing from the event table visible and inspect one missing PUDO example.
- Labels: parking, pudo, event-viewer, anchors, databricks.
- Branch: `boris/pudo_generic_materialization`.
- PR: Draft PR to main exists for the branch.
- Change type: Code change, data investigation, local server.
- Areas: `wayve/ai/parking/tools/event_clip_viewer`.
- Changes:
  - Added a default-visible `Missing in event table` metric/table and clip-player row source.
  - Added raw-buckets vs balanced-dataset anchor parquet selection, defaulting to raw bucket semantics for event comparison.
  - Updated the default anchor root to the latest dev root.
  - Investigated `fme20036/... · 1774544581333311`: event-table PUDO/GBR/non-AV, but corpus has no hazard around the stop and trip events are empty, so generic has no PUDO context to emit `dc_pudo_uk`.
- Task note: [[agent_tasks/2026/06/Week-2/2026-06-08-event-clip-viewer-anchor-comparison|2026-06-08 Event Clip Viewer Anchor Comparison]]

## 2026-06-10 - Parking/PUDO Duplicate Anchor Gate

- Topic: Temporarily relax run-length filtering and add approach-displacement gate for park/PUDO anchors.
- Labels: parking, pudo, materialization, anchors, duplicate-filtering.
- Branch: `boris/pudo_generic_materialization`.
- PR: Draft PR to main exists for the branch.
- Change type: Code change, investigation.
- Areas: `wayve/ai/services/sampling/datasets/parking_pudo`.
- Changes:
  - Moved `exclude_runs_that_are_too_short` from active base exclusions to the disabled comparison-only exclusions list.
  - Added a programmable 30s lookback / 5m point-to-point displacement gate before the park-vs-PUDO split.
  - Added a matching 30s lookahead / 5m max-displacement gate for unpark/UnPUDO departure anchors.
  - Documented the temporary filter state in the Parking/PUDO materialization README and mismatch-debug note.
  - Published test sampling image `wayveacrprodflyte.azurecr.io/sampling:bpudo-gates-20260610` and submitted full anchors sample execution `anlhtrggbm92jdvp5jd7`.
- Task note: [[agent_tasks/2026/06/Week-2/2026-06-09-parking-pudo-anchor-mismatch-debug|2026-06-09 Parking/PUDO Anchor Mismatch Debug]]

## 2026-06-09 - Parking Interleave Route-End Hazard

- Topic: Add parking deployment wrapper behavior for route-end hazards and park gear latching.
- Labels: parking, pudo, deployment, interleave-control, gear, hazards.
- Branch: `boris/parking-past30-no-standstill-gear-aug/main_cherrypick_new_driving`.
- PR: n/a.
- Change type: Code change, tests.
- Areas: `wayve/ai/zoo/deployment/deployment_wrapper.py`, `wayve/ai/si/test/interfaces/test_deployment_wrapper.py`.
- Changes:
  - Added the persistent parking route-end latch to `ParkingDeploymentWrapperImpl` so once policy gear reaches `PARK` under the close-to-route-end gate, later non-park gears are blocked until the gate clears.
  - Forced parking output indicator weights from `ParkingDeploymentWrapperImpl` to expose a hazard channel and select it when the route-end gate is true.
  - Added default-on flags `enable_end_of_route_hazard_lights` and `enable_end_of_route_gear_latch` to control these behaviors independently.
  - Reused parking's `_end_of_route_mask` for the hazard/latch gate instead of the base `_is_end_of_route`.
  - Kept `DeploymentWrapperBase` on the generic pre-existing interleave control behavior and avoided a parking `_wrap_with_interleave_control` override.
  - Added focused tests for hazard forcing, latch reset behavior, and disabled-flag behavior, plus ran deployment wrapper lint/type checks.
  - Fixed SI deploy temporal-cache config rewriting for release-loader backed BC models and added a focused regression test.
  - Aligned the Python deployment output validator with the DMI 4-channel indicator contract so hazard indicator weights can compile.
  - Moved the generic interleave end-of-route threshold to a base-wrapper instance attribute so generated TorchScript wrapper classes resolve it.
  - Moved the remaining generic interleave constants used by scripted methods to initialized attributes/buffers, covering handover speed, forward-drive position, and valid drive-position values.
  - Deployed `gorilla-tan-splendid` as `teal-elk-amused` with parking interleave control, verified Gen2 radar config, added Console lifecycle note, created the Notion model-card row, and triggered Model CI build `75365`.
- Task note: [[agent_tasks/2026/06/Week-2/2026-06-09-parking-interleave-route-end-hazard|2026-06-09 Parking Interleave Route-End Hazard]]
