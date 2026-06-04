# 2026-06-04 PUDO Gear-Fix Root Training

- Branch: `boris/parking-past30-no-standstill-gear-aug/main_cherrypick_new_driving`
- Commit: `fae5fe152e5256914123febb3f80fe5a16121f35`
- Notion: `https://app.notion.com/p/37503da5d69a81039cf4d16137e0f1d6`

## Summary

Updated `wayve/ai/si/configs/parking/parking_config.py` to use the PUDO data root `parking/dev/2026_06_04_11_13_51_root_parking_pudo_unpudo_unparking_gear_fix`, committed, pushed, and submitted a training run.

## Training Runs

- `174499` / `quotable-lavender-coelacanth`: initial `parking_bc_train_release_2026_5_11` attempt failed because `copy_tele_camera=True` requires `front-forward-tele` in `cameras`.
- `174503` / `immense-peach-jackal`: corrected to `parking_bc_train_release_2026_5_21`, submitted as `session_2026_06_04_13_46_19_pgear521` for `100000` steps, but failed before 1K at `trainer/global_step=0`.

## Failure

The corrected run failed in the dataloader because the new root is missing expected bucket parquet lists, including:

- `dc_unpudo_move_uk`
- `dc_unpudo_move_usa`
- `dc_unpudo_departure_uk`
- `dc_unpudo_departure_usa`

Representative error:

```text
ValueError: No parquet files found in .../2026_06_04_11_13_51_root_parking_pudo_unpudo_unparking_gear_fix/dataset_split=train/dataset_bucket=dc_unpudo_move_uk
```
