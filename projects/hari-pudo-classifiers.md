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
- **Branch:** `tomboehling/hari_pudo`
- **HEAD:** `09109967f05c` (`Merge branch 'main' into tomboehling/classifier_studio`)
- **Branch state vs `origin/main`:** 23 commits behind, 91 commits ahead as of 2026-06-01.

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
