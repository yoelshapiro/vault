# Fuchsia Velociraptor Parking Deploy

## Summary
- Requested `$parking-deploy` for `fuchsia-multicolored-velociraptor`.
- Resolved source session: `session_2026_05_20_17_05_40_si_parking_bc_train_release_2026_5_11_unpudo_moving_speed_intervention`.
- Resolved latest checkpoint: `10` (`100000` steps completed).
- Source session path: `/mnt/remote/azure_session_dir/Parking/parking/session_2026_05_20_17_05_40_si_parking_bc_train_release_2026_5_11_unpudo_moving_speed_intervention`.
- Source config did not contain `radar_features` or `max_radar_points_per_scan`.
- User clarified the deploy should use model branch `alon/unpudo-safety-fix-upsample-unpudo-speed-intervention`; that exact remote ref was not available, so the retry used the source model's training commit `1beb40334ef9cbaf8ac17a45299066570755171c`.

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

## Detached Training-Commit Retry
- Worktree: `/tmp/wayvecode-fuchsia-model-branch`.
- Commit: `1beb40334ef9cbaf8ac17a45299066570755171c`.
- Spawned a deploy sub-agent and ran the requested deploy command directly from the detached training-commit worktree.
- Result: failed with exit code `1` before an output session path, Console URL, or deployed nickname was printed.
- Blocker: Azure credential failure while downloading from `wayveprodmlexperiments.blob.core.windows.net/training-session-store`.
- Exact core error:
  - `pyarrow.lib.ArrowException: Unknown error: Check for Hierarchical Namespace support on 'https://wayveprodmlexperiments.blob.core.windows.net/training-session-store' failed: N5Azure4Core11Credentials23AuthenticationExceptionE: Failed to get token from DefaultAzureCredential.`
- Export verification was not run because no output session was produced.

## Successful Deploy
- Created a lightweight source-session overlay at `/tmp/fuchsia_velociraptor_deploy_overlay/session_2026_05_20_17_05_40_si_parking_bc_train_release_2026_5_11_unpudo_moving_speed_intervention` to avoid the older deploy code's AzureFileSystem credential path while still using the model commit.
- Spawned a deploy sub-agent and reran from `/tmp/wayvecode-fuchsia-model-branch`.
- Output session path: `/mnt/remote/azure_session_dir/Parking/parking/session_2026_05_20_17_05_40_si_parking_bc_train_release_2026_5_11_unpudo_moving_speed_intervention__fuchsia-multicolored-velociraptor_interleave_control_v2`.
- Output session id: `session_2026_05_20_17_05_40_si_parking_bc_train_release_2026_5_11_unpudo_moving_speed_intervention__fuchsia-multicolored-velociraptor_interleave_control_v2`.
- Deployed nickname: `circumspect-harlequin-elephant`.
- Deployed checkpoint: `1` (`100000` source steps).
- Gen2 artefact id: `636d5bca-3184-4b44-b8a8-b6820ac18f53`.
- Console URL: `https://console.sso.wayve.ai/model/session_2026_05_20_17_05_40_si_parking_bc_train_release_2026_5_11_unpudo_moving_speed_intervention__fuchsia-multicolored-velociraptor_interleave_control_v2`.
- Export verification passed:
  - `radar_data` contains `RADAR_FEATURE_X_M`, `RADAR_FEATURE_Y_M`, `RADAR_FEATURE_Z_M`, `RADAR_FEATURE_RANGE_RATE_MPS`, `RADAR_FEATURE_SNR_DB`.
  - `points_per_scan` is `800`.
  - `interleave_control` is present.
  - `interleave_group` is `INTERLEAVE_GROUP_PARKING`.
- Non-blocking deploy warnings:
  - ONNX upload validation warning for `OnnxExportAsset.path` with `path=None`.
  - Missing `provenance/all_ranks.snappy.parquet`.
  - `gen2_model_trace` already uploaded for the checkpoint.
  - `stride_sec 0.04 is not a multiple of 0.05s`.

## Model CI
- User requested "model ci for gen3"; the Model CI API currently exposes only `gen2-av-mache` and `gen2-av-mache-alpha3` target vehicle models for this artefact class.
- Triggered supported Alpha 3 Model CI against deployed gen2 artefact `636d5bca-3184-4b44-b8a8-b6820ac18f53`.
- Buildkite build: `72522`.
- Build URL: `https://buildkite.com/wayve-dot-ai/model-ci/builds/72522`.
- Last observed status:
  - `Model Deployment Archive Gen2`: passed.
  - `Eval Studio (Gen 2 Alpha 3)`: passed.
  - `Gen2 Alpha3 HiL Model Validation`: running.
  - `Gen 2 Alpha3 License`: blocked behind the pipeline gate.

## Pudo-Unpudo Eval Suite
- Requested Eval Studio suite history id: `86b2105d-3f72-4620-b020-0b10e445798d`.
- Canonical suite UUID: `ea663952-b914-47a3-8cc1-729db3683dce`.
- Title: `Pudo-Unpudo`.
- Triggered suite execution against gen2 artefact `636d5bca-3184-4b44-b8a8-b6820ac18f53`.
- Execution id: `1d643e3a-c123-4f1e-a434-2b2b52423bd3`.
- Results URL: `https://eval-studio.sso.wayve.ai/suite-results?reference=1d643e3a-c123-4f1e-a434-2b2b52423bd3`.
- Last observed status: `IN_PROGRESS`, with `0` completed, `0` errored, `2130` in progress, `2130` total.

## Blocker
- The standard Console `model_change_note` could not be added because the local Console SSO cookie redirected to OneLogin and the direct Model Catalogue API returned `401 User authorisation required`.
- Intended note:
  - `Parking/PUDO model`
  - `- deployed with interleave control group parking`
  - `- based on trained model fuchsia-multicolored-velociraptor`
