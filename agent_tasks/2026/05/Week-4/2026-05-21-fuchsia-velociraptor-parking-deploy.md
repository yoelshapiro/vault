# Fuchsia Velociraptor Parking Deploy

## Summary
- Requested `$parking-deploy` for `fuchsia-multicolored-velociraptor`.
- Resolved source session: `session_2026_05_20_17_05_40_si_parking_bc_train_release_2026_5_11_unpudo_moving_speed_intervention`.
- Resolved latest checkpoint: `10` (`100000` steps completed).
- Source session path: `/mnt/remote/azure_session_dir/Parking/parking/session_2026_05_20_17_05_40_si_parking_bc_train_release_2026_5_11_unpudo_moving_speed_intervention`.
- Source config did not contain `radar_features` or `max_radar_points_per_scan`, so no deploy overlay was needed.

## Attempt
- Spawned a deploy sub-agent as required by repo instructions.
- Attempted:
  - `bazel run //wayve/ai/si:deploy -- --step 100000 --suffix __fuchsia-multicolored-velociraptor_interleave_control_v1 --with_temporal_caching True --upload --enable_interleave_control --interleave_control_group parking --session_path ...`
- Result: failed before checkpoint load with exit code `2`.
- Error: `deploy.py: error: unrecognized arguments: --enable_interleave_control --interleave_control_group parking`.

## Findings
- Current branch: `boris/03-23-park-route-shortening-v2`.
- Current branch's `wayve/ai/si/deploy.py` does not expose interleave-control deploy flags.
- `git grep` found the required flags on `03-20-si-group-interleave-control-support` and `boris/exotic-zak-gear-augmentations`.
- The provided Eval Studio page is suite history id `86b2105d-3f72-4620-b020-0b10e445798d`; canonical suite UUID is `ea663952-b914-47a3-8cc1-729db3683dce`, title `Pudo-Unpudo`, valid from `2026-05-20T08:49:57.145Z`.

## Blocker
- Repo instructions require consent for branch changes.
- Need user approval to switch workspace to `03-20-si-group-interleave-control-support` or run a separate worktree from that branch before retrying the interleave-control deployment.

## Not Done Yet
- No deployed interleave-control session was created.
- No Console note was added.
- No Model CI was triggered.
- No Pudo-Unpudo Eval Studio execution was triggered.

## Detached Training-Commit Retry
- Worktree: `/tmp/wayvecode-fuchsia-model-branch`.
- Commit: `1beb40334ef9cbaf8ac17a45299066570755171c`.
- Spawned a deploy sub-agent and ran the requested deploy command directly from the detached training-commit worktree.
- Result: failed with exit code `1` before an output session path, Console URL, or deployed nickname was printed.
- Blocker: Azure credential failure while downloading from `wayveprodmlexperiments.blob.core.windows.net/training-session-store`.
- Exact core error:
  - `pyarrow.lib.ArrowException: Unknown error: Check for Hierarchical Namespace support on 'https://wayveprodmlexperiments.blob.core.windows.net/training-session-store' failed: N5Azure4Core11Credentials23AuthenticationExceptionE: Failed to get token from DefaultAzureCredential.`
- Export verification was not run because no output session was produced.
