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
- The script imports a generated notebook into `/Users/boris.indelman@wayve.ai/safe_unsafe_hari_annotations_upload` and submits a one-off Databricks job. The previously used cluster `0624-170917-6yh5w7tu` is no longer available; write access was verified on live shared cluster `0630-110905-ztaxoake`.
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

The new annotation folder was later provided at `/home/borisindelman/tmp/hari/safe_unsafe_standstill`.

## Databricks Write Verification

On 2026-06-30, imported a conservative write-probe notebook to `/Workspace/Users/boris.indelman@wayve.ai/safe_unsafe_hari_annotations_write_probe_20260630` and submitted it on cluster `0630-110905-ztaxoake`.

- Submit run: `144827625769`
- Task run: `263673491901967`
- Result: `SUCCESS`
- Probe behavior: read current rows from `hive_metastore.parking.safe_unsafe_hari_annotations`, refused to proceed if empty, overwrote the same table/location with the same rows, and verified the post-write count matched.

Readback via `databricks-queries`:

```sql
SELECT COUNT(*) AS row_count
FROM hive_metastore.parking.safe_unsafe_hari_annotations;
```

Result: `100`

```sql
SELECT category_str, COUNT(*) AS row_count
FROM hive_metastore.parking.safe_unsafe_hari_annotations
GROUP BY category_str
ORDER BY category_str;
```

Results:

- `['safe', 'unsafe']`: `1`
- `['safe']`: `68`
- `['unsafe']`: `31`

## New Annotation Upload

On 2026-06-30, parsed `/home/borisindelman/tmp/hari/safe_unsafe_standstill` and overwrote `hive_metastore.parking.safe_unsafe_hari_annotations`.

- Source JSON files: `3962`
- Parsed rows: `4062`
- Local CSV audit output: `/tmp/safe_unsafe_hari_annotations.csv`
- Submit run: `296524428244747`
- Task run: `999072434111556`
- Result: `SUCCESS`

Readback via `databricks-queries`:

```sql
SELECT COUNT(*) AS row_count
FROM hive_metastore.parking.safe_unsafe_hari_annotations;
```

Result: `4062`

```sql
SELECT category_str, COUNT(*) AS row_count
FROM hive_metastore.parking.safe_unsafe_hari_annotations
GROUP BY category_str
ORDER BY category_str;
```

Results:

- `['safe', 'unsafe']`: `268`
- `['safe']`: `2510`
- `['unsafe']`: `1284`

Also fixed the generated notebook source to emit Python boolean literals (`False`) instead of JSON literals (`false`) for `create_schema`, after the first upload attempt failed before writing with `NameError: name 'false' is not defined`.
