# Parking OTF Drop-Risk Review

## Scope
Reviewed the parking BC training datapipe wiring in:
- `wayve/ai/si/datamodules/otf.py`
- `wayve/ai/zoo/data/parking.py`
- `wayve/ai/zoo/data/driving.py`
- `wayve/ai/si/configs/parking/parking_config.py`

Goal: identify train-time augmentations and filters that can drop or weaken parking / PUDO / UNPUDO / unparking samples.

## Active training augmentations in `parking_bc_datamodule_cfg`
- `pre_corrective_action_interpolation=True`
- `augment_gear_direction=True`
- `reconstruct_gear_from_speed=True`
- `parking_config.enable_strip_leading_standstill=True`
- `parking_config.enable_augment_standstill_gear=True`
- `parking_config.parked_unparking_prob=0.5`
- `parking_config.unparking_gear_augment_prob=0.5`
- `route_dropout_rate=0.0`
- `indicator_dropout_rate=0.0`

Inactive / effectively off in this config:
- parking goal dropout
- stopping mode generation
- policy-path generation
- route/indicator dropout effect (rates are zero)
- navigation indicator dropout
- cruise-control / set-speed augmentation

## Actual sample-drop points
### Generic upstream filters
1. `filter_too_small_tables` in `otf.py` before parking insertion.
2. `_filter_no_video` for Gen2 samples.
3. `filter_bad_paths(thresh=0.2)` after path loading.
4. `filter_bad_timestamps` after camera decoding.

### Parking-specific drops
1. `fill_parking_scratch_table` drops sample when `_reconstruct_gear_from_speed` fails and reconstructed gear is entirely unknown.
2. `strip_leading_standstill` drops parking/unparking samples when shifted supervision cannot be rebuilt, including:
   - all post-origin speeds near zero
   - non-monotonic / insufficient timestamps after strip
   - shifted time grid shorter than policy horizon
   - shifted policy distance exceeding all available path lengths

## Important non-drop gates
- `distance_threshold_m=30m` is not a drop. It only controls whether a sample gets `parking_mode=True` if entry is not also within `time_threshold_sec=20s`.
- `_compute_parking_mode` only detects reverse-out unparking; forward-out unparking is currently missed and remains unlabeled rather than dropped.
- `_augment_parked_mode` converts some parked origins to `unparking_mode=True` only when enough future path exists; otherwise they stay as parking.

## Likely risk ranking
1. `filter_bad_paths`: highest risk of dropping valid parking / reverse maneuver samples because path-vs-odometry consistency is harder around reversals and maneuvering.
2. `strip_leading_standstill`: medium/high risk for parking-origin samples with long idle prefixes or limited future path coverage.
3. `filter_bad_timestamps` / `_filter_no_video`: generic quality drops, not parking-specific but still remove examples.
4. gear reconstruction failure: probably lower volume, but it hits exactly the standstill-heavy cases parking relies on.

## Main conclusion
The most plausible places where we lose useful parking/PUDO/unparking training examples are not the parking distance threshold itself, but:
- generic `filter_bad_paths`
- parking `strip_leading_standstill`
- missed forward-unparking labeling
