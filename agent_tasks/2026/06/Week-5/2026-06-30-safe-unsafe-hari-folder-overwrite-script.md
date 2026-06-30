# Safe/Unsafe HARI Folder Overwrite Script

- Date: 2026-06-30
- Branch: `boris/parking-past30-no-standstill-gear-aug/scarlet_full_gear_root_jitter_g50`
- PR: none
- Change type: Tooling / Databricks upload refinement
- Areas:
  - `/workspace/WayveCode/wayve/ai/parking/classifiers/safe_unsafe_hari_annotations.py`
  - `/workspace/WayveCode/wayve/ai/parking/classifiers/test/test_safe_unsafe_hari_annotations.py`
  - `/workspace/WayveCode/wayve/ai/parking/BUILD`
  - `hive_metastore.parking.safe_unsafe_hari_annotations`

## Summary

Updated the HARI OpenLABEL parser/uploader so it can read a folder of JSON files directly and overwrite `hive_metastore.parking.safe_unsafe_hari_annotations` via a Databricks notebook run.

## Changes

- Added `--input-dir` to recursively read JSON files from an annotation folder.
- Changed the default upload mode to `replace` for overwrite semantics.
- Replaced the local SQL-warehouse upload path with a Databricks notebook-run backend, matching the successful prior upload route.
- The script imports a generated notebook into `/Users/boris.indelman@wayve.ai/safe_unsafe_hari_annotations_upload` and submits a one-off Databricks job on cluster `0624-170917-6yh5w7tu`.
- Kept a local CSV audit output at `/tmp/safe_unsafe_hari_annotations.csv`.
- Excluded the script from the broad `wayve/ai/parking:parking` library glob so it remains a standalone tool.

## Validation

Passed:

```bash
bazel test //wayve/ai/parking/classifiers/...
```

Smoke-tested parsing with the previous default zip:

```bash
bazel run //wayve/ai/parking/classifiers:safe_unsafe_hari_annotations -- --no-upload
```

Output:

- `Read 100 JSON files`
- `Wrote 100 rows to /tmp/safe_unsafe_hari_annotations.csv`

## Run Command

For the new annotation folder:

```bash
bazel run //wayve/ai/parking/classifiers:safe_unsafe_hari_annotations -- \
  --input-dir /path/to/annotation_folder \
  --mode replace
```

The folder path was not present under `~/Downloads`, so the overwrite upload was not run yet.
