# 2026-03-29 — Foxglove interleaved-model visibility + Databricks timeline source

## Summary
Investigated how Console infers active model for interleaved runs, mapped the ingestion path, verified Foxglove behavior, and added a gen2 foxglove-adaptor patch so transformed MCAPs preserve interleaved model switch events.

## Findings
- Console active-model display is backed by Databricks API endpoint `/api/databricks/v1/run/{run_id}/interleaved`.
- Endpoint reads `prod_data_pipeline.raw__inference.model_episodes` (intervals by model).
- Console resolves model-at-time by matching `start <= ts < end`.
- Inference publishes model switch events on `/robot/inference/interleaved_event` with `active_artefact_id`.
- Foxglove transformed MCAP pipeline previously dropped this message type.

## Code changes
- Added `InterleavedEventTransformer` to preserve `/robot/inference/interleaved_event` in transformed MCAPs.
- Wired transformer into `ALL_TRANSFORMERS` and `TransformerConfig.build_transformers`.
- Added regression tests for transform + topic filtering.

## Validation
- Ran: `bazel test //wayve/services/foxglove_adaptor/gen2:py_test`
- Result: passed.

## Files
- `wayve/services/foxglove_adaptor/gen2/transformers/interleaved_event.py`
- `wayve/services/foxglove_adaptor/gen2/generate_mcap.py`
- `wayve/services/foxglove_adaptor/gen2/BUILD`
- `wayve/services/foxglove_adaptor/gen2/test/transformers/test_interleaved_event.py`

## Notes
For existing recordings, model timeline can be reconstructed from `raw__inference.model_episodes` and joined to `inferred__state.run_trace` or intervention tables by timestamp.
