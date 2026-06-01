# HARI PUDO classifiers

## Overview
- **What it is:** Follow Tom Boehling's `tomboehling/hari_pudo` branch and HARI video workflow to create or recover PUDO classifier datasets, annotations, sampled frames, and embedding model runs.
- **Why it matters:** The workflow connects Spark source rows, Flyte-generated video clips, HARI annotation tasks, sampled training frames, and classifier train/infer jobs.
- **Primary users:** Parking/PUDO model owners and annotation/data pipeline maintainers.

## Status
- **Phase:** Initial investigation
- **Status:** active
- **Last updated:** 2026-06-01
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
