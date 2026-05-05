# Parking gear label cleanup from PUDO experiments

## Summary
- Resolved `mollusk-teal-terrestrial` to source model `unflappable-azure-sea-cucumber`.
- Source training commit: `66a3f4878626a93bfd27126a2e2cd306afc0b95e`.
- Source branch used for implementation: `boris/training/kangaroo_with_50_and_route_shorten`.
- Added opt-in parking gear-label cleanup to `ParkingDataConfig` and enabled it for the BC parking datamodule used by the directional UNPUDO/unparking train.

## Zak gear cleanup behavior ported
- Remove short reverse gear blips by distance (`0.05m` default), replacing them with adjacent gear labels.
- Remove short neutral/P gear blips by duration (`1.0s` default), replacing them with adjacent gear labels.
- Shift neutral/P labels earlier after the car has stopped, with a configurable stop buffer (`0.5s`) and stationary speed threshold (`0.01m/s`).
- Did not port the manual `pred_park_intention` label override because SI `datamodules/parking.py` does not have that annotation source in the current OTF path.

## Implementation notes
- The new cleanup is implemented in `wayve/ai/si/datamodules/parking_gear_cleanup.py`.
- It is controlled by `enable_gear_label_cleanup` and parameterized with `gear_label_cleanup_*` fields.
- The cleanup is applied consistently in both:
  - `fill_parking_scratch_table`, which feeds training labels and parking-mode detection.
  - `add_parking_related_early_flag`, which feeds early path gating / short-path clamping decisions.
- When cleanup is enabled, it replaces the old broad `_build_expanded_gear` expansion for that sample path; when disabled, existing behavior is unchanged.

## Tests
- Passed: `bazel test //wayve/ai/si/datamodules:py_test --test_filter='test_replace_short_gear_segments_prefers_following_label|test_clean_parking_gear_labels_matches_stop_buffer_cleanup'`
- Passed: `bazel test //wayve/ai/si/datamodules:py_lint_flake8`
- Passed: `bazel test //wayve/ai/si/datamodules:py_lint_pylint`

## Training dispatch and checkpoint monitor
- Committed and pushed branch `boris/training/kangaroo_with_50_and_route_shorten` at `1878e808db5e47fdf7b9197517c62e67170615ee`.
- Submitted train job `158744` / `aqua-singing-cormorant` on AKS H100, 4 nodes, priority `P1`.
- Session: `session_2026_05_05_06_23_03_si_parking_bc_train_release_2026_5_11_dir_unpudo_unpark_gear_cleanup`.
- Command used:

```bash
bazel run //wayve/ai/si/cli:cli -- \
  --project Parking \
  -ex parking_bc \
  -st dir_unpudo_unpark_gear_cleanup \
  --platform AKS \
  -nn 4 \
  --cluster dgx-h100 \
  --no-verify \
  +mode=parking_bc_train_release_2026_5_11 \
  +datamodule=parking_bc_new_driving_directional_unpudo_unpark_datamodule \
  num_steps=100000 \
  --priority P1
```

- Monitoring evidence:
  - Job reached `Running` and progressed through training; live logs showed `Step 10000/100000` at `2026-05-05 08:05:28 UTC`.
  - Checkpoint save completed at `2026-05-05 08:06:43 UTC` for `model-checkpoint-000010000.ckpt`.
  - Checkpoint file observed at `/mnt/remote/azure_session_dir/Parking/parking_bc/session_2026_05_05_06_23_03_si_parking_bc_train_release_2026_5_11_dir_unpudo_unpark_gear_cleanup/checkpoints/model-checkpoint-000010000.ckpt` with size `7527523035` bytes.
  - Model Catalogue resolved `aqua-singing-cormorant` with latest checkpoint `1`, corresponding to the first training checkpoint.
- Operational note: a duplicate accidental job `158750` / `cheeky-tapir-amaranth` was also running with session tag `y`; it was not cancelled without explicit approval.

## Training stop requested
- Stop requested by Boris after checkpoint ingestion.
- Duplicate job `158750` / `cheeky-tapir-amaranth` was cancelled; final status `Canceled`.
- Original job `158744` / `aqua-singing-cormorant` had already received `SIGTERM` and saved checkpoint `model-checkpoint-000029019.ckpt`; Surfboard marked it `Resumed` rather than allowing direct cancellation.
- The active resumed successor was `158835` / `aqua-singing-cormorant`; cancellation was requested and final status is `Canceled`.
