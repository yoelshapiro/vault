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
- Split joined AV outputs so general, unsafe UnPUDO, and moving UnPUDO buckets are explicit in `all_joined_tables`.
- Preserved future gear annotation for DC directional buckets while disabling future-speed filtering.
- Fixed unsafe bucket generation to produce only CA short/long buckets, not pre-CA unsafe buckets.
- Split unsafe and moving UnPUDO feature flags so the bucket families are independently controlled.
- Scoped the CA+1s moving-speed lookup to failed-to-UnPUDO candidate runs instead of all candidate runs.
- Wired the concrete future-speed filter settings to the top-level future-speed flag to avoid drift.
- Added runtime guards against duplicate bucket overwrites and accidental pre-CA unsafe buckets.
- Updated parking training consumption so `dc_unpudo_move_*` is under `unpudo_dc`, old broad DC is `unpudo_dc_long` at zero weight, unsafe CA consumes `*_unsafe_*`, and general CA remains zero-weight.
- Removed the materialization-side GPS/10m/acceleration movement-start recomputation and used the event notebook timestamp as the movement-start anchor.

## Verification

- Ran `python -m json.tool` on the notebook.
- Parsed all notebook code cells with Python `ast`.
- Ran `git diff --check`.

## 2026-06-01 Update

- Added concise notebook comments for fixed DC UnPUDO, unsafe/moving UnPUDO, and forward/reverse derivation; renamed DC departure output to `dc_unpudo_pre_departure_*`.
- Added `pre_ca_unpudo_unsafe_*` materialization using the same unsafe raw anchors as unsafe CA short/long.
- Replaced the separate `dc_unpudo_move_*` materialization path with a `USE_FIXED_UNPUDO_DC_EVENT_WINDOW` flag on the base `dc_unpudo_*` buckets.
- With the flag enabled, base `dc_unpudo_usa` / `dc_unpudo_uk` use `timestamp_unixus` through `timestamp_unixus + 10s`.
- Removed `joined_dc_move_tables` from final bucket merging, so no `dc_unpudo_move_*` buckets are emitted.

## 2026-06-01 Verification

- Ran `python3 -m json.tool` on the notebook.
- Parsed all notebook code cells with Python `ast`.
- Ran `git diff --check`.
- Verified literal `dc_unpudo_move_*` / `joined_dc_move_tables` references are gone.

## 2026-06-01 Deep Review

- Re-traced DC, AV unsafe/moving, directional, gear-change, departure, and final merge paths.
- Verified base `dc_unpudo_*` now owns the fixed 10s window and `dc_unpudo_move_*` is gone.
- Verified forward/reverse variants still come from `joined_dc_tables` using `future_gear_direction`.
- Verified unsafe now includes `pre_ca`, `ca_short`, and `ca_long`, and remains split from general and moving UnPUDO buckets.
- Residual: current parking training config still references `dc_unpudo_*_very_short` for train, while the notebook fix targets base `dc_unpudo_*`; update config before using this materialization for training consumption.
- Could not run Spark locally because `pyspark` is not installed in the local environment.
