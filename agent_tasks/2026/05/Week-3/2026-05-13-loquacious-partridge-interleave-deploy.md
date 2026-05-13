# Loquacious Partridge Lime Interleave Deploy

- Date: 2026-05-13
- Branch: `03-20-si-group-interleave-control-support`
- Source nickname: `loquacious-partridge-lime`
- Source session: `/mnt/remote/azure_session_dir/Parking/parking_bc/session_2026_05_06_09_06_03_si_parking_bc_train_release_2026_5_11_parking_past30_no_standstill_gear_aug`
- Deploy suffix: `__loquacious-partridge-lime_interleave_control_v2`
- Command log: `/tmp/loquacious-partridge-lime_interleave_control_v2_deploy.log`
- Retry command log: `/tmp/loquacious-partridge-lime_interleave_control_v2_deploy_retry.log`
- Overlay retry log: `/tmp/loquacious-partridge-lime_interleave_control_v2_deploy_overlay.log`
- Overlay session: `/tmp/session_2026_05_06_09_06_03_si_parking_bc_train_release_2026_5_11_parking_past30_no_standstill_gear_aug`
- Overlay3 log: `/tmp/loquacious-partridge-lime_interleave_control_v2_deploy_overlay3.log`
- Overlay3 session: `/tmp/session_2026_05_06_09_06_03_si_parking_bc_train_release_2026_5_11_parking_past30_no_standstill_gear_aug_overlay3`

## Summary

Running the Parking/PUDO interleave-control deploy workflow for `loquacious-partridge-lime`.

The source `full_config.yml` had no `radar_features` or `max_radar_points_per_scan` matches, so the source session is being deployed directly with no overlay.

## Command

```bash
bazel run //wayve/ai/si:deploy -- --suffix __loquacious-partridge-lime_interleave_control_v2 --with_temporal_caching True --upload --enable_interleave_control --interleave_control_group parking --session_path /mnt/remote/azure_session_dir/Parking/parking_bc/session_2026_05_06_09_06_03_si_parking_bc_train_release_2026_5_11_parking_past30_no_standstill_gear_aug
```

## Results

- Status: failed before export/upload
- Output session: not created by successful deploy
- Assigned nickname: none
- Console URL: none
- Radar verification: not run after deploy because deploy failed
- Non-blocking warnings observed so far:
  - External grpc BUILD targets warn that plugin targets are both rules and files.
  - `rules_jvm_external` debug warning about multiple bzlmod modules contributing to the Maven repository.
  - First exact requested deploy command failed before checkpoint load because current `deploy.py` requires `--output_dir` when converting a `/mnt/remote/azure_session_dir/...` source path to ABFSS while using a suffix.
  - First retry with `--output_dir` failed before checkpoint load because the source config had stale `model.model.output_adaptor.include_tele_lens_blockage`, which current `OutputAdaptor` no longer accepts.
- Overlay3 with `include_tele_lens_blockage` removed, WFM pretraining loader `strict: false`, and `--no-model-ci` reached trained checkpoint load, then failed because the trained checkpoint has 4-class indicator head weights while the current instantiated model has 3-class indicator heads.
- The source session was created at git commit `58366c91fefe1ddbee3a7840c3dcd9553c03c4f6` on `origin/guy/parking-past30-no-standstill-gear-aug`; the active checkout was `0c1c363c405ba6ffa1217c83e3d604dab4986092`, where `deploy.py`, `OutputAdaptor`, `IndicatorOutputHead`, and ST checkpoint loading have changed substantially.
- Existing uploaded interleave-control sessions were found:
  - `reassured-red-sea-turtle`: `session_2026_05_06_09_06_03_si_parking_bc_train_release_2026_5_11_parking_past30_no_standstill_gear_aug__loquacious-partridge-lime_interleave_control_v1`
  - `plum-spider-cosmic`: `session_2026_05_06_09_06_03_si_parking_bc_train_release_2026_5_11_parking_past30_no_standstill_gear_aug__loquacious-partridge-lime_interleave_control_ckpt7_v1`
- Gen3 Model CI was not triggered for these existing sessions: their artefacts are `gen1` and `gen2` only, and the `gen2` artefact options are `gen2-av-mache` and `gen2-av-mache-alpha3`.

## Retry

The retry adds:

```bash
--output_dir /mnt/remote/azure_session_dir/Parking/parking_bc
```

This keeps the output session beside the source session and preserves the requested suffix.

The second retry uses a lightweight `/tmp` overlay that symlinks source session contents and copies `full_config.yml` with only `include_tele_lens_blockage` removed.

Overlay3 additionally set `model.model.checkpoint_load_function.strict: false` for the WFM pretraining loader and disabled Model CI via `--no-model-ci`; no Notion update, Console note, or Model CI trigger was performed.
