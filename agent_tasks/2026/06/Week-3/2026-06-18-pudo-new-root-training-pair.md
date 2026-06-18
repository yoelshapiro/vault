# 2026-06-18 PUDO New Root Training Pair

## Summary

Submitted and monitored two Parking/PUDO training jobs comparing the updated PUDO materialization root across the two active branches.

## Runs

- `lionfish-copper-cautious`
  - Branch: `boris/parking-past30-no-standstill-gear-aug/main_cherrypick_generic_data`
  - Commit: `e8a255960739b1311da8dc651d2148e8ad5fc751`
  - Job: `181482`
  - Session: `session_2026_06_18_22_46_32_mcgroot`
  - Command mode: `parking_bc_train_release_2026_5_21`
  - Status: running; passed 1K monitor at `trainer/global_step=1664`.
  - Notion row: https://app.notion.com/p/38303da5d69a81a3af32efa206e2e7da

- `lavender-centipede-strategic`
  - Branch: `boris/training/main_cherrypick_generic_data`
  - Commit: `c32e30ec367ad137101b5ffdab8400087a12a763`
  - Job: `181488`
  - Session: `session_2026_06_18_22_52_44_tgenroot`
  - Command mode: `parking_bc_train_release_2026_5_21`
  - Status: running; passed 1K monitor at `trainer/global_step=1081`.
  - Notion row: https://app.notion.com/p/38303da5d69a8192beddf69beea02cd0

## Notes

- Both jobs used 4 H100 nodes, `P1`, `parking_bc` experiment, and short session tags to avoid W&B artifact-name length issues.
- Startup logs showed sample-level radar/path/intervention warnings, but no terminal failure before 1K.
