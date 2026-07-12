# 2026-07-12 Parking/PUDO Generic Events Databricks Upload

## Summary

Uploaded the new `parking_pudo/events` materialisation root to the Databricks table `hive_metastore.parking.parking_pudo_generic_events`.

## Inputs

- Materialisation root: `abfss://datasets@wayveproddatasetflat.dfs.core.windows.net/sampling_materialised/parking_pudo/events/dev/parking_pudo_events_20260712_0904_codex__2026-07-12-09-11/`
- Target table: `hive_metastore.parking.parking_pudo_generic_events`
- Target Delta path: `abfss://databricks-users@wayveproddataset.dfs.core.windows.net/parking/parking_pudo_generic_events_20260712_0904_codex.table`

## Runs

- Failed run `1111704788611224`: Spark could not read the `buckets/` root because split-level `summary.yaml` files caused mixed partition-depth inference.
- Successful run `586836937110969`: re-imported the notebook after changing bucket reads to target `dataset_split=*/dataset_bucket=*` parquet leaves with `basePath`.

## Verification

- Verified table row count: `523876`.
- Verified exactly one `materialization_root`, matching the requested root.
- Ran `python -m py_compile wayve/ai/services/sampling/datasets/parking_pudo/events/upload_generic_events_to_databricks.py`.

