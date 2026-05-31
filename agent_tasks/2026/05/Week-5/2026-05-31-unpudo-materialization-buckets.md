# 2026-05-31 UnPUDO Materialization Buckets

- Topic: Update parking PUDO/UnPUDO materialization notebook bucket definitions.
- Labels: parking, pudo, unpudo, materialization, notebook.
- Branch: `alon/unpudo_unsafe_fix`.
- PR: N/A.
- Change type: Notebook code change.
- Areas: `/workspace/materialization/wayve/ai/parking/notebooks/pudo_unpudo_materialization.ipynb`.

## Changes

- Disabled future-speed filtering and long-UnPUDO event-length filtering in the materialization notebook.
- Kept base UnPUDO CA buckets general, without unsafe/moving filters.
- Added UnPUDO unsafe CA short/long buckets using speed at CA.
- Added UnPUDO moving CA buckets using speed at CA or around CA+1s.
- Added DC UnPUDO departure buckets from 1s before movement start to movement start.
- Added DC UnPUDO move buckets from movement start to 10s after movement start.
- Changed DC gear-change window to 0s through 0.5s after the gear-change anchor.
- Removed the materialization-side GPS/10m/acceleration movement-start recomputation and used the event notebook timestamp as the movement-start anchor.

## Verification

- Ran `python -m json.tool` on the notebook.
- Parsed all notebook code cells with Python `ast`.
- Ran `git diff --check`.
