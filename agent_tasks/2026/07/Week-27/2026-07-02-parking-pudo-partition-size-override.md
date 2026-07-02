# 2026-07-02 Parking PUDO Partition Size Override

## Summary

Made the generic sampler partition chunk size configurable per `BucketedDataset`, keeping the framework default at 1000 run IDs while setting Parking/PUDO datasets to 700.

## Changes

- Added `MAX_NUM_RUN_IDS_PER_PARTITION = 1000` to the dataset API as the shared default.
- Added `BucketedDataset.max_num_run_ids_per_partition` with positive-value validation.
- Updated Spark partition planning to use the dataset value instead of a hard-coded module constant.
- Added `PARKING_PUDO_MAX_NUM_RUN_IDS_PER_PARTITION = 700` and wired it into Parking/PUDO default, anchors, events, parking-only, and pudo-only datasets.
- Added tests for the dataset default/validation and for forwarding the dataset-specific override into Spark partition planning.
- Reworded Parking/PUDO README, docstrings, comments, and PR body to describe the generic materialisation logic directly instead of framing it as notebook parity.
- Refreshed the README and PR body with newer branch details: registered dataset variants, binary versions, 700 run-ID partitioning, release metadata, and event-row metadata/disengagement semantics.

## Validation

- `git diff --check` passed.
- `WAYVECODE_MAIN_COMMIT_META_OVERRIDE=3790cc0b1cea bazel test //wayve/ai/services/sampling:test_spark_tasks //wayve/ai/services/sampling:test_api`
  - `test_spark_tasks` passed.
  - `test_api_py_test` timed out in existing `test_random_balancer_spark_reproducible`; lint/type targets passed.
- `WAYVECODE_MAIN_COMMIT_META_OVERRIDE=3790cc0b1cea bazel test //wayve/ai/services/sampling:test_api_py_test --test_arg='--no-cov' --test_arg='-k' --test_arg='bucketed_dataset_creation or partition_size'` passed.

## Branch

- Branch: `boris/pudo_generic_materialization`
- Worktree: `/workspace/pudo_materialization_buckets`
