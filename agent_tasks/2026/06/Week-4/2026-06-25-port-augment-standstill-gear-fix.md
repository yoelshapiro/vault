# Port Augment Standstill Gear Fix

- Branch/worktree: `boris/parking-past30-no-standstill-gear-aug/scarlet_full_gear_root_jitter_g50` at `/tmp/scarlet_root_jitter_g50`
- Source fix: commit `92b6a52f4f5f` (`fix: gate parking standstill gear augmentation`)
- Files changed:
  - `wayve/ai/si/datamodules/parking.py`
  - `wayve/ai/si/datamodules/test/test_parking_unit.py`
- Summary:
  - Replaced random standstill gear augmentation with a 50% gated change that only applies when the policy gear target is changing.
  - For parking-to-neutral targets, the current gear is set to the previous moving gear.
  - For unparking-from-neutral targets, the current gear is set to neutral.
  - Added focused unit coverage for the new behavior.
- Validation:
  - `git diff --check`: passed.
  - Filtered `bazel test //wayve/ai/si/datamodules:py_test --test_arg=-k --test_arg=augment_standstill_gear`: selected 5 tests and all 5 passed, but Bazel target failed coverage because filtered runs collect 0% coverage.
  - Full `bazel test //wayve/ai/si/datamodules:py_test`: new standstill gear tests passed; target failed on unrelated existing failures in parking lazy-future, parking goal dropout key names, restore parquet fixtures, and SARSA datapipes.

