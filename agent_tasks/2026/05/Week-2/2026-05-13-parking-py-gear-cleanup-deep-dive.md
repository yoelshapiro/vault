# Parking.py Gear Cleanup Deep Dive

- Date: 2026-05-13
- Branch inspected: `guy/parking-gear-label-cleanup`
- File: `wayve/ai/si/datamodules/parking.py`
- Local explainer: `http://localhost:3000/`
- Served from: `/home/borisindelman/.codex/pretty-html/index.html`

## Summary

Built an interactive local explainer for `parking.py` from `guy/parking-gear-label-cleanup`. The page maps the SI parking datapipe flow from `(Table, Data)` input through scratch-table enrichment, gear cleanup, parking/unparking mode detection, optional policy-path generation, standstill/gear augmentations, and final `Data` outputs.

## Key Takeaways

- `ParkingDataConfig.use_zoo_dataloader=True` delegates to the simpler zoo path; the full SI-specific pipeline runs only when this is `False`.
- The branch adds `enable_gear_label_cleanup` plus cleanup thresholds and wires them into both early path gating and the main scratch-table fill.
- Gear cleanup removes short reverse blips, removes short neutral segments, and shifts neutral labels earlier after the vehicle has stopped.
- Parking mode detection is neutral-segment centric: future neutral means parking, origin inside neutral means parked, prior neutral plus reverse/low-speed window means unparking.
- Current unparking detection is reverse-out focused; forward-out P/N to D is explicitly called out as a missed case in the file comments.
- Sample drops can occur on failed gear reconstruction, failed policy-path generation, or failed standstill stripping.
- Early parking flags and allow-short-path flags are temporary `Data` keys intended to reduce path-loader drops for parking-related buckets.

## Interactive Page Contents

- Mental map and suggested read order with approximate line numbers.
- Config field explanation.
- Gear cleanup before/after visualization.
- Parking/parked/unparking scenario visualization.
- Datapipe flow from `insert_parking_data`.
- Model-facing outputs table.
- Drop-point summary and watchouts.
