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
- Pylint target still has pre-existing failures unrelated to this change:
  - `wayve/ai/si/datamodules/otf.py`: unused legacy `reconstruct_gear_from_speed` argument.
  - `wayve/ai/si/datamodules/parking.py`: pylint confuses the aliased zoo `insert_parking_data` call signature.
