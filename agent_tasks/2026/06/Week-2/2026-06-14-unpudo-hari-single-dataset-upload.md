# 2026-06-14 UnPUDO HARI Single Dataset Upload

## Summary
- Uploaded the corrected train/validation-native UnPUDO standstill clips to new HARI as a single dataset so annotators do not see train/validation split.
- HARI dataset: `194350e6-1506-40e4-83c4-59a2d1593459`
- URL: https://hari.azr.internal.wayve.ai/main/media/194350e6-1506-40e4-83c4-59a2d1593459/main_dataset
- Dataset name: `UnPUDO Standstill Clips 2026-06-14`
- Created HARI `all_videos` subset: `d6c665e0-7fb5-461e-b70e-2f1f80bacacd`

## Inputs
- Train MP4 prefix: `az://wayveprodperceptiondata/qualitymatch-data/flyte_remote/videos/borisindelman/unpudo_standstill/trainval_splitnative_20260611_194255_UTC/train/gen2/`
- Validation MP4 prefix: `az://wayveprodperceptiondata/qualitymatch-data/flyte_remote/videos/borisindelman/unpudo_standstill/trainval_splitnative_20260611_194255_UTC/val/gen2/`
- Train videos found: 3167
- Validation videos found: 795
- Total videos uploaded: 3962

## Manifest
- Local JSON manifest: `/tmp/unpudo_trainval_splitnative_20260611_194255_UTC_manifest.json`
- Manifest fields: `video_file_path`, `split`, `run_id`, `timestamp_unixus`.
- The split is private in the manifest only; no train/validation subsets were created in HARI.
- Attempted to upload the manifest to `qualitymatch-data` next to the videos, but Azure denied write/list-key permissions for this account from the current identity.

## Upload Details
- Used new-HARI prod Auth0 config with `HARI_PASSWORD` unset.
- Used HARI file-key mode with keys of the form `blob/wayveprodperceptiondata/qualitymatch-data/<blob-path>`.
- Device-code auth succeeded on retry with code `CDMK-HTSJ`.
- Temporary Bazel uploader target was removed after upload; `/workspace/classifiers` was left clean.
