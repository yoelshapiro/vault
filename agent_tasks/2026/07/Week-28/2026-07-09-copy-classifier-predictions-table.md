# Copy Classifier Predictions Table

## Summary

Copied:

- Source: `prod_user.users__tomboehling.classifier_studio_unpudo_safety_predictions`
- Destination: `hive_metastore.parking.safe_unsafe_classifier_predictions`

Final verification:

- Source rows: `621542`
- Destination rows: `621542`
- Destination format: Delta
- Destination location: `abfss://databricks-users@wayveproddataset.dfs.core.windows.net/parking/safe_unsafe_classifier_predictions`
- Created at: `2026-07-09T10:46:28.381Z`

## Execution

The Databricks SQL warehouse read path worked for validation, but write attempts through the SQL Statements API failed:

- Default Hive CTAS failed with `[DBFS_DISABLED] Public DBFS root is disabled`.
- Explicit external-location CTAS failed with `[INSUFFICIENT_PERMISSIONS] User does not have permission SELECT on any file`.

The successful path was a one-off Databricks notebook run on existing cluster `0708-170632-ven4cr6q` (`shared_2.3.257`):

- Imported notebook: `/Users/boris.indelman@wayve.ai/copy_safe_unsafe_classifier_predictions`
- Submit run: `385190844997028`
- Task run: `973781485320106`
- Run URL: `https://adb-7835963732836817.17.azuredatabricks.net/?o=7835963732836817#job/431438579292105/run/385190844997028`

The notebook created the destination with:

```sql
CREATE TABLE hive_metastore.parking.safe_unsafe_classifier_predictions
USING DELTA
LOCATION 'abfss://databricks-users@wayveproddataset.dfs.core.windows.net/parking/safe_unsafe_classifier_predictions'
AS SELECT * FROM prod_user.users__tomboehling.classifier_studio_unpudo_safety_predictions
```

## Follow-Up Notes

The old cluster from the previous HARI table upload, `0630-110905-ztaxoake`, no longer exists. For similar future table writes into the parking Hive metastore, use a live cluster with access to the parking storage location rather than the SQL warehouse CTAS path.
