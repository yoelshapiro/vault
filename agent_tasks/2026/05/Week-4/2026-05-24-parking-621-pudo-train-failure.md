# Parking 2026.6.21 PUDO Train Failure

Branch: `boris/05-21-updated-pudo-config`
Change type: fix, training debug
Areas: `wayve/ai/si/configs/parking/parking_config.py`, `wayve/ai/si/test/configs/test_config.py`

## Summary
- Job `168369` / `wren-vivid-cyan` failed at startup while saving the resolved Hydra config.
- Failure: `InterpolationKeyError: Interpolation key 'token_size' not found`.
- Root cause: `ParkingModelRelease2026_6_21Cfg` uses `WFMFeb2026EarlyFusionCFG`, where `output_adaptor` is passed inside `load_pretrained_backbone(overrides=...)`. In that nesting, `ParkingOutputAdaptorCfg` cannot resolve relative fields like `${..token_size}`.
- Fix: set explicit WFM Feb dimensions and explicit output adaptor flags for the 2026.6.21 parking override.

## Validation
- Passed targeted pytest via `//wayve/ai/si:test_config_py_test_core`: `test_parking_2026_6_21_pudo_datamodule_config_resolves`.
- Passed lint/type targets: `//wayve/ai/si:test_config_py_lint_ruff`, `//wayve/ai/si:test_config_py_lint_flake8`, `//wayve/ai/si:test_config_ty`.
- One attempted `bazel test //wayve/ai/si:test_config --test_arg=-k ...` failed because pytest args were forwarded to lint/type targets; not a code failure.
