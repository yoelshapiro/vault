# Wonjoon Parking Gear-Count Materialisation Research

Date: 2026-04-26
Branch: `boris/training/kangaroo_with_50_and_route_shorten`
PR: `#106341` (`wonjoongoo/parking-gc-materialisation-v2`, merged)
Type: research

## Goal

Investigate how Wonjoon's PR creates the many parking/unparking buckets, with an eye toward porting the useful event logic into the PUDO/UNPUDO materialization notebook.

## PR Entry Points

- `wayve/ai/services/sampling/datasets/parking/gc/dataset.py`
- `wayve/ai/services/sampling/datasets/parking/common.py`
- `wayve/ai/services/sampling/datasets/parking/filters.py`
- `wayve/ai/services/sampling/test/datasets/parking/test_parking_filters.py`

## Bucket Taxonomy

The dataset is `parking_gc`, backed by `DRIVING_BINARY` over `wayve_corpus.all_data`. Bucket names follow:

```text
{etype}_{method}_gc{N}_{filter_suffix}_{country}
```

Dimensions:

- `etype`: `parking`, `unparking`; `nopudo` buckets are parking-only.
- `method`: `window`, `timestamp`, `gc_boundary`.
- `gc`: windows use `1`, `2`, `3`, `3plus`; timestamps also include `0`.
- `filter_suffix`: `dc_ca`, `ca`, `nopudo` variants.
- `country`: `uk`, `usa`, `deu`, `jpn`, `global`, `all`.

Approximate bucket count from the Cartesian product is `372` buckets.

## Event Detection

Wonjoon's logic is gear-count based, not PUDO-table based.

- Reconstruct gear from signed speed on Gen2 Mache when speed is available.
- Treat `speed > 0.5 km/h` as drive and `speed < -0.5 km/h` as reverse.
- Preserve raw P/N segments only when they last at least `2.0s`.
- Extend P/N over adjacent standstill unknown frames so parked segments are not truncated.
- Smooth short gear dwell segments below `0.5s` to avoid counting mechanical pass-through states like `D -> R -> P` as extra maneuvers.
- Find long P/N segments and define parking/unparking anchors from them.

Anchor definitions:

- Parking event: first P/N frame of a long parked segment.
- Unparking event: last P/N frame of a long parked segment.

Window definitions:

- Parking window: from `25s` or `30m` before the first P/N frame, whichever gives the longer lookback, through the first P/N frame.
- Unparking window: from `0.5s` before the last P/N frame through `15s` after it.
- Windows are made disjoint around adjacent park/unpark events.

Gear-change count:

- Count changes inside the original maneuver window, before pre-event parked-buffer expansion.
- Parking includes gear changes up to and including the first P/N anchor.
- Unparking counts changes after the last P/N anchor, so the previous `D -> P` into the parked segment is not counted as unpark.

PUDO exclusion:

- `nopudo` is implemented by checking for hazard indicator during the P/N segment and excluding those events.
- This should be treated as a useful heuristic field, not a perfect PUDO label.

## What To Port To PUDO Notebook

- Gear reconstruction from speed before event extraction.
- Long P/N segment detection with minimum parked duration.
- Event windows based on both time and distance buffers.
- Gear-change counts and `gc_bucket` labels per event.
- Gear-change boundary windows around shift decisions.
- Hazard/PUDO-like flag as a column.
- Disjoint event-window clipping.
- Keep near-end run frames; parking often happens near the end and normal driving exclusions remove useful data.

## Caveats

- The PR code is a sampling-filter implementation, not a Databricks notebook. The right transfer is to port the algorithm into Spark/Pandas notebook logic, not import the filter code directly.
- The current checkout did not expose the old `PUDO and UNPUDO materilization.ipynb` path via `rg`, so no notebook edits were made in this pass.
