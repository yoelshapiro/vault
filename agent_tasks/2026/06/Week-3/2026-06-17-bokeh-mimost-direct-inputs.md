# 2026-06-17 Bokeh MIMOST Direct Inputs

## Summary

Fixed `visualise_bokeh` inference dispatch for ParkingPlotter sessions where the loaded top-level model is a research-style `MIMOSTTransformer` rather than a deployment wrapper. Extended the same path so OTF uses session / parking datamodule config fields while keeping the explicit run-id segment and timestamps as the source.

## Context

- Branch: `boris/training/main_cherrypick_generic_data`
- Repo: `/workspace/WayveCode`
- Reported command:
  - `bazel run //wayve/ai/si:visualise_bokeh -- ParkingPlotter --run_segment run_id=fme20032/2026-05-24--16-47-43--gen2-av-a074f8a0-8267-4645-89be-98999768b894,from_unixus=1779642939933302,to_unixus=1779642944083294 --output_path ~/bokeh-outputs/test --gap 10 --force --session_id session_2026_06_11_20_44_02_gp8n100k4`
- Failure:
  - `TypeError: MIMOSTTransformer.forward() missing 1 required positional argument: 'inputs'`
- Follow-up requirement:
  - Use OTF settings from the session datamodule config or `parking_config.py`, but do not use the training buckets; use the provided `run_id`, `from_unixus`, and `to_unixus`.

## Changes

- Added signature-based detection for top-level models whose `forward` accepts a training-style `inputs` dict.
- Updated `VisualisationModelWrapper` dispatch order:
  1. inner direct model if available,
  2. top-level direct `forward(inputs)` model,
  3. deployment-wrapper keyword-input path.
- Added helper coverage for direct-input vs deployment-style signatures.
- Added wrapper regression coverage for top-level MIMOST-style models receiving the original inputs dict.
- Packaged and loaded `cfg.datamodule` alongside the model/deployment config so `visualise_bokeh --session_id` and package mode can reuse training OTF settings.
- Extracted OTF-relevant datamodule config fields for run-id visualisation while filtering bucket/source fields and preserving segment-owned `run_id`, `start_timestamp`, `end_timestamp`, and `gap`.
- Added `--parking_datamodule` support to pull OTF fields from checked-in SI parking datamodule configs such as `pudo_bc_datamodule`.
- Updated run-id OTF to support multi-source odometry configs like `["wheel", "wheel_imu"]`.
- Fixed `load_paths` scalar normalization for numpy-array odometry-source table values.
- Preserved integer/bool tensor dtypes in the visualisation inference wrapper so categorical model inputs remain valid embedding indices.
- Detected Python/generated/scripted `ParkingDeploymentWrapperImpl` wrappers and forced the visualiser through the top-level wrapper call so parking visualisation represents actual deployment inference instead of bypassing wrapper preprocessing via `.model(inputs)`.
- Kept the parking deployment navigation path aligned with the wrapper signature: grouped navigation tensors (`lane_level_info_*`, `step_info_*`, `navigation_instructions_timestamp`) are passed through the deployment adapter.
- Added explicit visualisation adapter/default coverage for `PARKING_MODE` and `UNPARKING_MODE` tensors so direct/research-model paths can still receive the parking mode input when requested.

## Verification

- `bazel test //wayve/ai/si:inference_debugger_py_checks`
  - Passed: flake8, ruff, pytest, ty.
- `bazel test //wayve/ai/si:test_inference_model --test_arg='-k=top_level_direct_inputs_model'`
  - Passed.
- Re-ran the reported session against `~/bokeh-outputs/test-codex`.
  - Completed successfully and visualised 9 frames.
- `bazel test //wayve/ai/si:test_pack_model`
  - Passed.
- `bazel test //wayve/ai/si:test_bokeh_visualise`
  - Passed.
- `bazel test //wayve/ai/si:test_run_segment_picker`
  - Passed.
- `bazel test //wayve/ai/si:test_inference_model --test_arg='-k=cast_preserves_nonfloating_dtypes'`
  - Passed.
- `bazel test //wayve/ai/si/datamodules:py_test --test_arg='-k=test_make_driving_datapipe_for_run_id_accepts_multiple_odometry_sources' --test_arg='--no-cov'`
  - Passed. The same filtered target without `--no-cov` passed the selected test but failed the aggregate coverage threshold because only one test was selected.
- `bazel run //wayve/ai/lib:test_data_pipes_lib_py_test -- wayve/ai/lib/test/data/pipes/test_load_paths.py -k 'test_load_paths_data_async or test_load_paths_data_async_uses_numpy_array_odometry_source' --no-cov`
  - Passed 9 selected path-loader tests.
- Re-ran the session-config path against `~/bokeh-outputs/test-codex-config` with `--num_workers 0`.
  - Completed successfully and visualised 9 frames using the session datamodule config.
- Re-ran the original command shape with default dataloader workers against `~/bokeh-outputs/test-codex-config-default-workers`.
  - Completed successfully and visualised 9 frames using the session datamodule config.
- `bazel test //wayve/ai/si:test_inference_model --test_arg='-k=parking_deployment_wrapper or cast_preserves_nonfloating_dtypes'`
  - Passed after adding the actual parking-wrapper dispatch regression.
- Re-ran the original command shape with default dataloader workers against `~/bokeh-outputs/test-codex-parking-wrapper`.
  - Completed successfully and visualised 9 frames using the parking deployment wrapper dispatch.
