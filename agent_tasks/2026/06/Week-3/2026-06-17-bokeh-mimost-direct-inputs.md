# 2026-06-17 Bokeh MIMOST Direct Inputs

## Summary

Fixed `visualise_bokeh` inference dispatch for ParkingPlotter sessions where the loaded top-level model is a research-style `MIMOSTTransformer` rather than a deployment wrapper.

## Context

- Branch: `boris/training/main_cherrypick_generic_data`
- Repo: `/workspace/WayveCode`
- Reported command:
  - `bazel run //wayve/ai/si:visualise_bokeh -- ParkingPlotter --run_segment run_id=fme20032/2026-05-24--16-47-43--gen2-av-a074f8a0-8267-4645-89be-98999768b894,from_unixus=1779642939933302,to_unixus=1779642944083294 --output_path ~/bokeh-outputs/test --gap 10 --force --session_id session_2026_06_11_20_44_02_gp8n100k4`
- Failure:
  - `TypeError: MIMOSTTransformer.forward() missing 1 required positional argument: 'inputs'`

## Changes

- Added signature-based detection for top-level models whose `forward` accepts a training-style `inputs` dict.
- Updated `VisualisationModelWrapper` dispatch order:
  1. inner direct model if available,
  2. top-level direct `forward(inputs)` model,
  3. deployment-wrapper keyword-input path.
- Added helper coverage for direct-input vs deployment-style signatures.
- Added wrapper regression coverage for top-level MIMOST-style models receiving the original inputs dict.

## Verification

- `bazel test //wayve/ai/si:inference_debugger_py_checks`
  - Passed: flake8, ruff, pytest, ty.
- `bazel test //wayve/ai/si:test_inference_model --test_arg='-k=top_level_direct_inputs_model'`
  - Passed.
- Re-ran the reported session against `~/bokeh-outputs/test-codex`.
  - Completed successfully and visualised 9 frames.
