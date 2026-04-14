# SI parking route-shortening entry index wiring

## Summary
Added route-shortening compatibility to the SI parking datamodule path (`use_zoo_dataloader=False`) by storing the parking entry lookahead index in the same data key contract used by zoo parking.

## What changed
- `wayve/ai/si/datamodules/parking.py`
  - Added `_PARKING_ENTRY_LOOKAHEAD_INDEX_KEY = "_parking_entry_lookahead_index"`.
  - Extended `add_parking_mode(..., store_entry_index: bool = False)`.
  - When `store_entry_index=True`, computes entry lookahead index from:
    - `result.segment_start`
    - `origin`
    - `scratch_table["additional_table_indices"]`
  - Stores encoded index (`-1` when unavailable) into data under `_parking_entry_lookahead_index`.
  - Wired `insert_parking_data(..., store_entry_index=...)` to pass through into `add_parking_mode` for SI path.

- `wayve/ai/si/datamodules/test/test_parking_unit.py`
  - Added tests:
    - `test_add_parking_mode_store_entry_index_forward_entry`
    - `test_add_parking_mode_store_entry_index_before_window`

## Validation
- `python -m py_compile` passed for changed files.
- Could not run pytest in this shell environment (`No module named pytest`).
