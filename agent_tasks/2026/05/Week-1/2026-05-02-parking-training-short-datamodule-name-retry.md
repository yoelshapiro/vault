# Parking Training Short Datamodule Name Retry

## Context

The parking train run `butterfly-fuchsia-outgoing` failed twice after adding the May 1 PUDO/UNPUDO/unparking datamodule override.

## Diagnosis

- `precocious-scarlet-raccoon` / job `157805` failed due Hydra override syntax: `datamodule=...` instead of `+datamodule=...`.
- `butterfly-fuchsia-outgoing` / jobs `157814`, `157951` used the corrected override but failed before training startup.
- Job `157951` rank0 logs showed W&B validation failure: the datamodule override value was 82 characters and W&B tags must be 1-64 characters.
- Root cause: `wayve/ai/si/training/train.py:get_console_tags` adds the full `+datamodule=` value as a W&B tag.

## Change

In branch `boris/training/kangaroo_new_pudo_unpudo_unpark_root`, shortened the Hydra datastore key in `wayve/ai/si/configs/parking/parking_config.py`:

- from `parking_bc_new_driving_2026_05_01_directional_unpudo_unpark_gear_change_datamodule`
- to `parking_bc_may01_dir_unpudo_unpark_gc_datamodule`

The config object and data mix were not changed.

## Retry

Submitted train with the shortened datamodule name:

- job: `157988`
- nickname: `dexterous-sapphire-crane`
- session: `session_2026_05_02_19_14_15_si_parking_bc_train_release_2026_5_11_may01_pudo_gc_shortdm`
- image: `wayvetraining.azurecr.io/scaled-intelligence:2026-05-02.190935`
- status at last check: `Running`
- branch metadata: `boris/training/kangaroo_new_pudo_unpudo_unpark_root`
- commit metadata: `e74bc4067860367bb3e106a97180b88d3ecbb406`
- dirty metadata: `true`, due the one-line uncommitted config-name change

## Notes

The change was made in a temporary worktree at `/tmp/wayvecode-train-kangaroo-short-name.FfzHJv` to avoid disturbing uncommitted generic-materialization changes in `/workspace/WayveCode`.
