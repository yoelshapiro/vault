# HARI PUDO classifiers

## Overview
- **What it is:** Follow Tom Boehling's `tomboehling/hari_pudo` branch and HARI video workflow to create or recover PUDO classifier datasets, annotations, sampled frames, and embedding model runs.
- **Why it matters:** The workflow connects Spark source rows, Flyte-generated video clips, HARI annotation tasks, sampled training frames, and classifier train/infer jobs.
- **Primary users:** Parking/PUDO model owners and annotation/data pipeline maintainers.

## Status
- **Phase:** Initial investigation
- **Status:** active
- **Last updated:** 2026-06-04
- **Worktree:** `/workspace/classifiers`
- **Branch:** `boris/hari_pudo`
- **HEAD:** `09109967f05c` (`Merge branch 'main' into tomboehling/classifier_studio`)
- **Branch state:** local branch `boris/hari_pudo` from Tom branch; not pushed.

## Source Links
- Branch: `tomboehling/hari_pudo`
- Video creation README: https://github.com/wayveai/WayveCode/blob/f098e280d6b64ca81232bb400e6e1af7f0e74701/wayve/ai/datasets/annotation_operations_tools/scripts/README.md
- Local README: `/workspace/classifiers/wayve/ai/datasets/annotation_operations_tools/scripts/README.md`

## HARI Datasets
- PUDO start: https://hari.quality-match.com/main/media/e2a63225-10e6-4e46-9662-db250337bf1f/main_dataset
- Location: https://hari.quality-match.com/main/media/c7483295-67f8-405b-b4d7-5bc57d230ddb/main_dataset
- Rerouting: https://hari.quality-match.com/main/media/f70c699d-2868-4c4f-90fd-a6fe8fd465fb/main_dataset

## HARI Pipelines
- Good/bad: https://hari.quality-match.com/pipeline-designer/6dbac909-e7e5-4dee-9622-79acd6c4840a
- Location: https://hari.quality-match.com/pipeline-designer/14121630-a0e2-40df-95d9-1b116af2717b
- Rerouting: https://hari.quality-match.com/pipeline-designer/c1f9f3b7-a16f-49b0-8934-9b39f5905ca8

## README Workflow Summary
- Prerequisites are HARI access, Azure data read access, ACR login, and Flyte access.
- Build source rows from `prod_data_pipeline.wayve_corpus.all_data` with `run_id`, `run_date_iso`, `timestamp_unixus`, and `_pipeline__vehicle_platform_id`; `timestamp_unixus` is the clip center timestamp.
- Use Databricks Connect and `generate_run_clips_input` to turn source rows into the clip input parquet.
- Generate videos through `//wayve/ai/datasets/flyte:workflow` with `--inference_task run_clips`, usually on `elastic-swe`; `partner_uber` is the concrete vehicle platform used in Tom's notes.
- Upload generated videos with `hari_upload_videos upload`, or local `.mp4` files with `upload-local`; video file names are the later join key for matching annotations back to source rows.
- SAS tokens for external media sources can be rotated with `hari_upload_videos update-sas-token`, using either external media source id or dataset id.
- Download annotations with `hari_download_annotations_to_spark_df`; with `--source-table`, it joins HARI annotations back to source rows by `run_id`, `run_date_iso`, and a timestamp window around `reference_col_expr`.
- Convert matched annotations into sampled classifier frames with `process_matched_annotations_and_sample_frames`; presets include `pudo_start`, `pudo_end`, `pudo_general`, `other_standing`, and `other_standing_general`.

## Concrete Branch Notes
- The README includes a Tom-specific clip generation path using `prod_user.users__tomboehling.uber_pudo_video_start_2_2`, outputting run clip input parquet under `abfss://databricks-users@wayveproddataset.dfs.core.windows.net/tomboehling/uber_pudo/`.
- The concrete remote video generation example uses `--dataset_delta` pointing at a Unity Catalog delta path and writes to `flyte_remote/videos/tomboehling/uber_pudo_video_center_4_0`.
- Upload example uses folder prefix `flyte_remote/videos/tomboehling/uber_pudo_video_center_4_0/partner_uber/` and dataset name `Pudo Uber Start Fast`.
- Start annotation matching uses dataset id `d2c04178-0ca7-49eb-aa3e-78ecdf8f792c`, source table `prod_user.users__tomboehling.uber_pudo_events_train_4_0`, and reference expression `standing_start_us - 15 * 1000000`.
- End annotation matching uses dataset id `ca8ec4f5-644b-40b0-b954-8f833f56342b`, the same source table, and reference expression `standing_end_us + 15 * 1000000`.
- The general sampled-frame merge writes to `prod_user.users__tomboehling.pudo_events_train_5_0_annotaations_sampled_frames_general` with dataset UUID `35b0e94c-8af3-4219-b66e-ad486a06ef45`.
- Training example is `bazel run //wayve/ai/datasets/embeddings:train -- --config_name pudo --force_retrain --refresh_cache`.
- Inference examples exist for `pudo`, `pudo_map`, and `pudo_general` model hashes.

## Open Questions / Risks
- Tom warned the branch may be outdated and may need a merge from main; current branch is still 23 commits behind `origin/main`.
- The README explicitly calls out problems around Spark in `get_segment` and direct Delta usage in `make_drive_dataloader`.
- HARI pages have been recorded but not inspected in the UI yet; likely needs authenticated HARI access.
- Hidden workflow constraints are likely around credentials, data access, Flyte image freshness, dataset naming conventions, and video filename based joins.

## Next Steps
- Decide whether to merge or rebase current `origin/main` into `/workspace/classifiers` before running workflow commands.
- Inspect the relevant scripts and BUILD targets under `wayve/ai/datasets/annotation_operations_tools/scripts` and `wayve/ai/datasets/embeddings`.
- Verify auth prerequisites: HARI env vars, Databricks token, Azure/ACR login, Flyte access.
- Before running Bazel or workflow jobs, read any ADRs relevant to the exact code path being modified or executed.


## 2026-06-01 UnPUDO Standstill Clip Plan
- Goal: generate a smoke-test video clip for one Robotaxi UnPUDO standstill event before scaling to the full event table.
- Use `partner_uber` as the vehicle platform for Robotaxi/Uber data unless the event table proves otherwise; `run_clips` is configured for five cameras: `front-forward,left-forward,right-forward,left-backward,right-backward`.
- Recommended path is event table -> one-row smoke table/parquet -> `generate_run_clips_input` -> Flyte `run_clips` remote workflow.
- Do not feed the raw event table directly to `run_clips` unless `timestamp_unixus` is already an exact corpus timestamp. `generate_run_clips_input` nearest-joins to `prod_data_pipeline.wayve_corpus.all_data` within tolerance and selects the required camera columns.
- For the first clip, use a 32s window and 3x playback, matching Tom's concrete examples; the middle timestamp is highlighted in green.
- Need from user before running: fully qualified event table name, timestamp column name for the standstill center, and confirmation that rows are `partner_uber` / Robotaxi.


## 2026-06-01 One-Sample Source Filter Change
- Modified `/workspace/classifiers/wayve/ai/datasets/annotation_operations_tools/scripts/generate_run_clips_input.py` to support smoke-testing directly from a source table without materializing a separate one-row table.
- Added `--source-filter-expr` for Spark SQL filtering, `--limit` for selecting a small number of source rows, and `--vehicle-platform-id` as a fallback when the table lacks `_pipeline__vehicle_platform_id`.
- Kept the `run_clips` five-camera set local in the generator and switched camera-column selection to lightweight imports so the utility does not import the full Flyte inference task registry on startup.
- Deferred the Databricks Connect import until `main()` so `--help` works without a live Databricks Connect environment.
- Set `--match-tolerance-seconds` to parse as a float so wider tolerances like `0.2` work from the CLI.
- Verified with `bazel run //wayve/ai/datasets/annotation_operations_tools/scripts:generate_run_clips_input -- --help`; the CLI exposes the new flags.
- First smoke command should filter `hive_metastore.parking.pudo_unpudo_unpark_events` with `event_type = 'unpudo' AND speed_kmh < 0.1`, add `--limit 1`, and write one run_clips input parquet.
- Updated risk: `--limit` now applies after the nearest corpus join so smoke runs select one matched output row; for predictable debugging, use an exact `runID` and `timestamp_unixus` filter.


## 2026-06-01 Smoke Clip Run
- Branch:  at ; local changes are uncommitted and not pushed.
- Event source: , filtered with .
- Important finding: these sampled UnPUDO rows match corpus under , not . The smoke row used  and .
- Generated one-row run_clips input parquet: .
- Remote Flyte execution: https://flyte.data.wayve.ai/console/projects/datasets/domains/production/executions/ac5pcvl8wsx79fj499f2. Nodes  and  succeeded; Spark node  eventually failed with a  error after showing long driver scheduling latency.
- Local workflow succeeded at video encoding after compatibility fix in  (removed unsupported  on this old branch).
- Local workflow wrote 647 frames and found the center timestamp at frame 323. Source window was 32s with , producing a 10.8s H.264 MP4 at 1920x1080.
- Local qualitymatch upload failed with AzCopy 403 for ; uploaded the encoded MP4 instead to .
- Local file for inspection: .
- Code changes made for this smoke path:  filter/limit/platform/runID support, BUILD dep ordering, scoped inference task registry imports, and old-branch calibration compatibility.


## 2026-06-01 Mixed UnPUDO Source Query
- Added `--source-sql` to `generate_run_clips_input.py` so the source rows can be a Spark SQL query rather than only a table/parquet path.
- Motivation: select all moving UnPUDO events (`event_type = 'unpudo' AND speed_kmh > 0.1`) plus a random 250 standstill UnPUDO events (`event_type = 'unpudo' AND speed_kmh < 0.1`) in one input generation pass.
- Verified `bazel run //wayve/ai/datasets/annotation_operations_tools/scripts:generate_run_clips_input -- --help`; CLI now exposes `--source-sql`.
- Use `ORDER BY rand()` for fresh random samples, or `ORDER BY rand(<seed>)` for deterministic repeatability.


## 2026-06-01 Mixed UnPUDO Flyte Batch
- Batch timestamp: `20260601_204806_UTC`.
- Source selection: all `event_type = 'unpudo' AND speed_kmh > 0.1` plus 250 random `event_type = 'unpudo' AND speed_kmh < 0.1` rows.
- Generated run_clips input parquet: `abfss://databricks-users@wayveproddataset.dfs.core.windows.net/borisindelman/unpudo_standstill/mixed_20260601_204806_UTC/run_clips_input.parquet`.
- Matched clip rows generated: 492.
- Flyte execution: https://flyte.data.wayve.ai/console/projects/datasets/domains/production/executions/a9n8glpdgt859n4l5kpz.
- Output prefix: `az://wayveprodperceptiondata/qualitymatch-data/flyte_remote/videos/borisindelman/unpudo_standstill/mixed_20260601_204806_UTC/gen2/`.
- Parallelization config: `chunk_size=1`, `num_concurrent_tasks=50`, `overwrite_outputs=true`.
- Video args: `clip_length_sec=32`, `highlight_middle_seconds=1.0`, `video_speed=3`.
- Initial status at launch: running with nodes `n0` and `n1`; output prefix empty immediately after launch.


## 2026-06-02 Mixed Flyte Batch Fix and Rerun
- Root cause for failed execution `a9n8glpdgt859n4l5kpz`: the Spark driver failed before processing data with `ValueError: Received more input values 17 than allowed by the input spec 16`.
- Cause: Tom's branch added `dataset_delta` to `main_workflow` / `filter_and_chunk`, but the registered remote task image expected the 16-input main interface. This was not caused by the SQL query or by using parquet instead of a table.
- Fix: removed the stale `dataset_delta` Flyte interface from `/workspace/classifiers/wayve/ai/datasets/flyte/workflow.py` and `/workspace/classifiers/wayve/ai/datasets/flyte/common/infra/orchestration.py`; the run uses `dataset_parquet` only.
- Validation: `bazel build //wayve/ai/datasets/flyte/...` succeeded.
- Published test image via `make publish-test -C wayve/ai/datasets/flyte`: `wayveacrprodflyte.azurecr.io/datasets_flyte_workflow:borisindel-tmp-build-d4c00056fe02-boris-hari_pudo-9f693`, digest `sha256:c68e472a45260168c0faba9a2b97c3621999c4bf103f3cc7f252eaf242b1f351`.
- Relaunched Flyte execution: https://flyte.data.wayve.ai/console/projects/datasets/domains/production/executions/a9lgsnpj2mjz7ctlr6kl.
- Output prefix: `az://wayveprodperceptiondata/qualitymatch-data/flyte_remote/videos/borisindelman/unpudo_standstill/mixed_20260602_082145_UTC/gen2/`.
- Input parquet reused: `abfss://databricks-users@wayveproddataset.dfs.core.windows.net/borisindelman/unpudo_standstill/mixed_20260601_204806_UTC/run_clips_input.parquet` with 492 matched rows.
- Launcher confirmed local image mapping to the published digest. Initial status: `n0` and `n1` running, no errors yet.


## 2026-06-02 Follow-up Filter Dataset Fix
- Execution `a9lgsnpj2mjz7ctlr6kl` used the corrected 16-input Flyte interface and progressed into `n2`, proving the original `17 > 16` FlyteKit schema mismatch was fixed.
- It then failed inside `filter_and_chunk` with `TypeError: filter_dataset() missing 1 required positional argument: 'vehicle_platform'`.
- Cause: this branch's `filter_dataset` helper still accepts `(dataset_parquet, dataset_delta, vehicle_platform, ...)`; the compatibility patch had removed `dataset_delta` from the helper call as well as from the Flyte task interface.
- Fix: keep `dataset_delta` out of Flyte inputs, but pass `None` internally: `filter_dataset(dataset_parquet, None, vehicle_platform.value, columns_to_select=columns_to_select)`.
- Validation: `bazel build //wayve/ai/datasets/flyte:workflow_remote_docker` succeeded.
- Published corrected image digest: `sha256:9cb2f01978f01dee268d092399c40d6a3985c04af69171751cfe775a2af8e9c3`.
- Relaunched Flyte execution: https://flyte.data.wayve.ai/console/projects/datasets/domains/production/executions/a4mxf5wdrsvhgm5dv9st.
- Output prefix: `az://wayveprodperceptiondata/qualitymatch-data/flyte_remote/videos/borisindelman/unpudo_standstill/mixed_20260602_083706_UTC/gen2/`.
- Initial status: `n0` and `n1` running, no errors yet.


## 2026-06-02 Camera-Present Filter and Rerun
- Execution `a4mxf5wdrsvhgm5dv9st` reached parallel `dn0` workers, proving the Flyte launch/image/interface fixes worked, but workers started failing on missing camera video data. Primary log signal: `Video file is not available ... camera=right_backward, video_path=None`.
- Root cause classification: data validity, not Flyte parallelization or the SQL union itself. The original input generator selected nearest corpus rows but did not require camera `video_file_name` fields to be present.
- Added `--require-camera-video-files` to `/workspace/classifiers/wayve/ai/datasets/annotation_operations_tools/scripts/generate_run_clips_input.py`; it filters matched `all_data` rows to require all five run_clips camera `video_file_name` fields at the event timestamp.
- Also added `--clip-length-sec` and `--require-full-clip-window` plumbing for stricter future validation. A full-window Spark range join was attempted but was too slow for this interactive run, so the active rerun uses the cheap exact-row camera-present guard.
- Validation: `bazel build //wayve/ai/datasets/annotation_operations_tools/scripts:generate_run_clips_input` succeeded, and `bazel run //wayve/ai/datasets/annotation_operations_tools/scripts:generate_run_clips_input -- --help` exposed the new flags.
- New source selection: all `event_type = 'unpudo' AND speed_kmh > 0.1` plus 250 random `event_type = 'unpudo' AND speed_kmh < 0.1` rows.
- New input parquet: `abfss://databricks-users@wayveproddataset.dfs.core.windows.net/borisindelman/unpudo_standstill/camera_present_20260602_092236_UTC/run_clips_input.parquet`.
- Matched camera-present rows generated: 497.
- New Flyte execution: https://flyte.data.wayve.ai/console/projects/datasets/domains/production/executions/askdlss5f75w6tszggdr.
- Output prefix: `az://wayveprodperceptiondata/qualitymatch-data/flyte_remote/videos/borisindelman/unpudo_standstill/camera_present_20260602_092236_UTC/gen2/`.
- Parallelization config: `chunk_size=1`, `num_concurrent_tasks=50`, `overwrite_outputs=true`.
- Video args: `clip_length_sec=32`, `highlight_middle_seconds=1.0`, `video_speed=3`.
- Launch image mapping: `datasets_flyte_workflow@sha256:9cb2f01978f01dee268d092399c40d6a3985c04af69171751cfe775a2af8e9c3`.
- Current status at note update: execution `askdlss5f75w6tszggdr` is running in `n2` Spark filter/chunk; Loki shows active Parquet writes around 09:27 UTC.


## 2026-06-02 Segment Missing-Camera Cleanup Rerun
- Execution `askdlss5f75w6tszggdr` proved the exact-row camera-present input filter was insufficient: by 09:47 UTC it had generated 49 MP4s, but Loki still showed repeated full-window failures such as `Video file is not available ... camera=right_backward, video_path=None`.
- Root cause refinement: `run_clips` decodes a 32s window around each event, so center-row camera metadata can be valid while neighbouring sampled rows in the clip window have missing camera `video_file_name` values.
- Fix added in `/workspace/classifiers/wayve/ai/datasets/flyte/inference_tasks/run_clips/run_clips.py`: optional `extra_args.drop_rows_with_missing_camera_video_files` filters the loaded segment to rows where all selected camera `video_file_name` columns are present before creating the drive dataloader. It logs dropped/remaining rows and keeps clips with usable five-camera frames instead of failing the whole chunk on sparse missing rows.
- Verification: `bazel build //wayve/ai/datasets/flyte/...` passed; `bazel test //wayve/ai/datasets/flyte:py_lint` passed; direct run-clips test passed with `bazel test //wayve/ai/datasets/flyte:py_test --test_arg=wayve/ai/datasets/flyte/inference_tasks/test/test_run_clips.py`. The broader `py_test --test_arg=-k --test_arg=run_clips` failed during unrelated embedding-head collection on missing `wayve.ai.datasets.embeddings.configs.siamese`.
- Publish: first publish retry failed on ACR auth for `wayve.azurecr.io/spark_k8s_base` (`401 Unauthorized`); refreshed `az acr login` for `wayve`, `wayvetraining`, and `wayveacrprodflyte`, then published corrected image digest `sha256:74479ab9e03b6d604a5a7ea126f81615289f740d9946c6063c58f715e9e037da`.
- New Flyte execution: https://flyte.data.wayve.ai/console/projects/datasets/domains/production/executions/a97nqrpw2gb6rd2ljrn9.
- New output prefix: `az://wayveprodperceptiondata/qualitymatch-data/flyte_remote/videos/borisindelman/unpudo_standstill/camera_present_drop_missing_20260602_095509_UTC/gen2/`.
- Input parquet reused: `abfss://databricks-users@wayveproddataset.dfs.core.windows.net/borisindelman/unpudo_standstill/camera_present_20260602_092236_UTC/run_clips_input.parquet` with 497 rows.
- Launch args: `clip_length_sec=32`, `highlight_middle_seconds=1.0`, `video_speed=3`, `drop_rows_with_missing_camera_video_files=true`, `chunk_size=1`, `num_concurrent_tasks=50`, `overwrite_outputs=true`.
- Initial status at 09:56 UTC: `start-node` succeeded, `n0` and `n1` running; new output prefix count was 0 immediately after launch.

- Follow-up status at 09:59 UTC: `n0` and `n1` succeeded; `n2` Spark filter/chunk is running; output prefix still has 0 MP4s before map workers start.

- Final status at 15:36 UTC: execution `a97nqrpw2gb6rd2ljrn9` succeeded end-to-end; `end-node` completed at 2026-06-02 12:55:24 UTC.
- Output count: 496 MP4s under `az://wayveprodperceptiondata/qualitymatch-data/flyte_remote/videos/borisindelman/unpudo_standstill/camera_present_drop_missing_20260602_095509_UTC/gen2/`.
- Local viewing setup: port `3000` serves `/tmp/unpudo_clip_serve/index.html`, which references signed Azure Blob URLs directly instead of downloading the MP4s locally. The container SAS expires at 2026-06-03 23:59 UTC.


## 2026-06-04 UnPUDO Event Streamlit Viewer
- Added a local Streamlit event viewer under `/workspace/classifiers/tools/databricks_queries/unpudo_event_viewer`.
- Source table: `hive_metastore.parking.pudo_unpudo_unpark_events_gear_fix`.
- The app filters by `event_type`, optional run ID substring, and row limit, then lets the user choose one event.
- It shows event metadata including `runID`, `timestamp_unixus`, formatted event time, `event_type`, speed, gear-change timing, event duration, country, lat/lon, and source URL.
- It constructs media-handler URLs centered on the selected `timestamp_unixus`, with configurable seconds before/after the event.
- It displays all five cameras by default (`front_forward`, `left_forward`, `right_forward`, `left_backward`, `right_backward`) and includes a single control to jump all videos back to the event timestamp.
- Added a faster generated-blob mode for precomputed MP4 collages under `flyte_remote/videos/borisindelman/unpudo_standstill/camera_present_drop_missing_20260602_095509_UTC/gen2`.
- Blob mode exact-matches `runID + timestamp_unixus`, signs the MP4 with a one-day SAS, and jumps to `5.33s` because these MP4s came from 32-second clips encoded at 3x speed.
- Live media-handler camera mode remains available for arbitrary rows that do not have a generated MP4 in blob storage.
- Added playlist mode: the app can autoplay the currently loaded events sequentially, loop until stopped, and provides Play/Pause/Stop/Prev/Next controls.
- Live playlist mode defaults to `front_forward` and uses the first selected camera.
- Added playback-speed control, defaulting to `3x`.
- Event query now dedupes source rows by `(runID, timestamp_unixus)` after sidebar filters to hide repeated source-table rows in the viewer.
- Follow-up pending restart: dedupe is now a sidebar toggle, videos start from the beginning, and a green border marks playback when it reaches the event timestamp.
- Follow-up pending restart: live media-handler cameras are now the default source, and selecting another single event autoplays the new video from the beginning.
- Follow-up pending restart: random-sample toggle added with a `Resample` button that changes the SQL `rand(seed)` ordering.
- PR update: promoted the viewer into `wayve/ai/parking/tools/event_clip_viewer` on branch `boris/event_clip_viewer`; draft PR https://github.com/wayveai/WayveCode/pull/116721.
- PR update: removed the `tools/databricks_queries/lib/BUILD` visibility change from the PR; the final diff only adds the new viewer package.
- PR update: added `compile_event_videos` CLI for one concatenated MP4 per event type, defaulting to 100 random deduped events per type, `front_forward`, `-15s/+15s`, `10x`, and green event-time border.
- PR branch verification: `bazel test //wayve/ai/parking/tools/event_clip_viewer:py_checks` passed, and the Bazel-run Streamlit target served HTTP 200 on temporary port `3002`.
- Local server: `http://127.0.0.1:3001/`, tmux session `unpudo-event-viewer`.
- Verification: `bazel test //tools/databricks_queries/unpudo_event_viewer:py_checks` passed; `curl -sI http://127.0.0.1:3001/` returned HTTP 200.


## 2026-06-05 Anchor-Expanded UnPUDO Flyte Batch
- Goal: generate multiple 20s clips per UnPUDO event between exact `gearchange_timestamp` and exact `timestamp_unixus`, with anchors every 5s plus the exact final event timestamp.
- Source table: `hive_metastore.parking.pudo_unpudo_unpark_events_gear_fix`.
- Source selection: all `event_type = 'unpudo' AND speed_kmh > 0.1`, plus 250 random `event_type = 'unpudo' AND speed_kmh < 0.1`, plus 250 random rows where `timestamp_unixus - gearchange_timestamp > 10000000`.
- Generator change: `/workspace/classifiers/wayve/ai/datasets/annotation_operations_tools/scripts/generate_run_clips_input.py` now preserves the exact source anchor as output `timestamp_unixus` after nearest-corpus matching, while still using the matched corpus row for selected metadata/camera columns.
- Generator args: `--vehicle-platform-id gen2`, `--match-tolerance-seconds 0.2`, `--require-camera-video-files`, `--clip-length-sec 20`.
- Generated run_clips input parquet: `abfss://databricks-users@wayveproddataset.dfs.core.windows.net/borisindelman/unpudo_standstill/anchors_20260605_201515_UTC/run_clips_input.parquet`.
- Matched anchor rows generated: 2030.
- Image publish: reused/published `wayveacrprodflyte.azurecr.io/datasets_flyte_workflow:borisindel-tmp-build-d4c00056fe02-boris-hari_pudo-9f693`, digest `sha256:74479ab9e03b6d604a5a7ea126f81615289f740d9946c6063c58f715e9e037da`.
- Flyte execution: https://flyte.data.wayve.ai/console/projects/datasets/domains/production/executions/anfr26csqwll76rf9m54.
- Output prefix: `az://wayveprodperceptiondata/qualitymatch-data/flyte_remote/videos/borisindelman/unpudo_standstill/anchors_20260605_201515_UTC/gen2/`.
- Launch args: `clip_length_sec=20`, `highlight_middle_seconds=1.0`, `video_speed=3`, `drop_rows_with_missing_camera_video_files=true`, `chunk_size=1`, `num_concurrent_tasks=50`, `overwrite_outputs=true`.
- Initial status: Flyte dispatch succeeded and mapped the local build tag to digest `sha256:74479ab9e03b6d604a5a7ea126f81615289f740d9946c6063c58f715e9e037da`. Local `flytectl` is not installed in this shell, so status polling was deferred to the Flyte console.


## 2026-06-05 Event Viewer Model-Catalogue Video Source
- Worktree/branch: `/workspace/event_clip_viewer` on `boris/event_clip_viewer`.
- Added a model-catalogue-backed video source to `wayve/ai/parking/tools/event_clip_viewer`, based on Tom Boehling's `get_camera_video` helper from classifier studio.
- New helper calls `http://model-catalogue-api.azr.internal.wayve.ai/v2/run/real/{run_id}/video`, maps viewer camera names like `front_forward` to catalogue names like `front-forward`, and computes the event seek offset from `video_start_us`.
- Cached catalogue payloads per run for one hour in Streamlit, so multiple events/cameras from the same run reuse one API response.
- Updated the HTML video players to support `start_seconds` / `end_seconds`, allowing catalogue playback to start at `event - before_seconds`, keep the green event-time marker at the actual event offset, and stop/advance at `event + after_seconds`.
- Existing media-handler and generated-blob playback modes remain available; the previous default radio option remains `Live media-handler cameras`.
- Restarted local Streamlit session `unpudo-event-viewer` from the PR worktree on `http://127.0.0.1:3001/`.
- Verification: `bazel test //wayve/ai/parking/tools/event_clip_viewer:py_lint_ruff //wayve/ai/parking/tools/event_clip_viewer:py_lint_flake8 //wayve/ai/parking/tools/event_clip_viewer:ty` passed; Streamlit health endpoint returned `ok`; direct catalogue API probe returned `front-forward` status `success` and `video_start_us`.
- Follow-up update: added `back_backward` camera support mapped to catalogue `back-backward`.
- Follow-up update: replaced fixed filter controls with a SQL text area as the source of loaded rows; `event_type` filtering is derived from the returned query table, while random/dedupe/custom filters can live in SQL.
- Follow-up update: autoplay now uses all selected cameras per event and renders current event metadata plus the source URL inside the autoplay component, so these update as clips advance.
- Verification after follow-up: Ruff, Flake8, and type checks passed again; restarted `unpudo-event-viewer` on `http://127.0.0.1:3001/`; health endpoint returned `ok`.
