# Zak PUDO Bucket Reimplementation Notes

Date: 2026-06-05

Branch inspected: `origin/zmurez/pudo` at `22a4ac634eb3e88112059946f98e7c2ef7d3876f`.

Primary source files:
- `/workspace/materialization/wayve/ai/experimental/configs/mcv_new_phase2.yml`
- `/workspace/materialization/wayve/ai/experimental/configs/mcv_new_phase2x.yml`
- `/workspace/materialization/wayve/ai/experimental/configs/mcv_new_phase2x_wta.yml`
- `/workspace/materialization/wayve/ai/experimental/configs/mcv_new_phase2_otf.yml`
- `/workspace/materialization/wayve/ai/experimental/samplers/sampler.py`
- `/workspace/materialization/wayve/ai/experimental/dataset/datasets.py`
- `/workspace/materialization/wayve/ai/experimental/dataset/ipace.py`
- `/workspace/materialization/wayve/ai/experimental/transforms.py`

## Executive summary

Zak has two different "bucket" mechanisms on `zmurez/pudo`.

1. `mcv_new_phase2.yml` / `mcv_new_phase2x_wta.yml`: training-time heuristic buckets. These do not write materialized tables. The sampler calculates frame indices per run using predicates over the single-run dataset arrays, then samples from named buckets by configured weights.
2. `mcv_new_phase2_otf.yml`: OTF materialized partition consumption. This reads existing materialized partitions with weights. It contains DC, CA, pre-CA, DILC partitions, but not Zak's heuristic parking/PUDO/unparking buckets.

For reimplementation of parking/PUDO/unPUDO, the useful logic is in the heuristic sampler path.

`mcv_new_phase2.yml` active weights sum exactly to `1.0`. The active weight split is:

| Bucket family | Weight | Percent |
|---|---:|---:|
| DC/start | 0.1735 | 17.35% |
| Large error | 0.0500 | 5.00% |
| Start near gear change | 0.0465 | 4.65% |
| Indicator / indicator change | 0.0600 | 6.00% |
| Gear change | 0.0370 | 3.70% |
| Interventions / CA | 0.3350 | 33.50% |
| Interventions near gear change | 0.1000 | 10.00% |
| Parking | 0.0630 | 6.30% |
| PUDO | 0.0800 | 8.00% |
| Unparking | 0.0550 | 5.50% |

`mcv_new_phase2x_wta.yml` is the more current inherited config. It keeps the same total weight and keeps parking/PUDO/unparking unchanged, but changes the mix:
- `LARGE_ERROR_1_{LDN,USA,JPN,DEU}_SLOW` becomes `0.0`, removing 5%.
- `INTERVENTIONS_GEN2_ALPHA30` changes `0.05 -> 0.075`.
- `INTERVENTIONS_GEN2_ALPHA31` changes `0.04 -> 0.065`.
- Net effect: the 5% large-error weight moves to alpha3 intervention windows.

## Core sampler algorithm

Zak's heuristic sampler is equivalent to:

```python
weights = {bucket_name: configured_weight for bucket_name in config if configured_weight > 0}

for run in dataset.runs:
    valid_masks = get_valid_masks(run)

    for bucket_name in weights:
        func, mask_names, args = BUCKET_FUNCTIONS[bucket_name]

        indices = func(run, *args)
        indices = unique(indices)
        indices = indices[(indices >= index_present) & (indices < index_present + len(run))]

        # Each bucket has bucket-specific mask_names. "segments" is always added.
        valid = logical_and([valid_masks[name] for name in ["segments"] + mask_names])
        indices = indices[valid[indices]]

        global_indices[bucket_name].append(indices + run_global_offset - index_present)

sample_counts = round(total_train_samples * weights / sum(weights))
for bucket_name:
    shuffle(bucket_indices)
    repeat_if_needed_to_hit_count()
concat_all_bucket_samples()
shuffle_final_epoch_indices()
```

There is no one-to-one materialized output table. A bucket is a set of sampled frame indices inside the dataloader.

## Shared validity masks

The most important shared masks:

```python
ALL_VALID_MASKS = [
    "autonomous",
    "autonomous_engage",
    "geofence",
    "reverse",
    "uturn",
    "high_speed",
    "bad_park",
    "bad_park1",
    "bad_stop",
    "not_ends",
    "has_video",
    "dropped_frames",
    "perturbed",
]

ALL_VALID_MASKS1 = [
    "autonomous_engage",
    "geofence",
    "reverse",
    "uturn",
    "bad_park",
    "bad_park1",
    "bad_stop",
    "not_ends",
    "has_video",
    "dropped_frames",
]

ALL_VALID_MASKS2 = [
    "autonomous",
    "autonomous_engage",
    "bad_park",
    "bad_park1",
    "bad_stop",
    "has_video",
    "dropped_frames",
]
```

Important: parking, PUDO, unparking, and start-gear-change use `ALL_VALID_MASKS2`. That means they do **not** filter geofence, reverse, u-turn, high-speed, or run ends through the shared mask set. They do still apply the autonomous/future-autonomous, bad-park/stop, video, and dropped-frame masks.

Mask meanings:

```python
autonomous:
    keep non-autonomous frames, but allow the immediate intervention moment

autonomous_engage:
    remove frames before an autonomous re-engagement, because future labels would be autonomous

geofence:
    remove configured excluded boxes

reverse:
    remove distance-padded reverse-gear frames and time-padded negative-speed frames

uturn:
    remove distance-padded route-command u-turn frames

high_speed:
    speed < 80 mph

bad_park:
    remove distance-padded frames around predicted bad parking

bad_stop:
    remove distance-padded frames around predicted park/bad stop not near gear park/unpark

not_ends:
    cumdist > 1m and cumdist < final_cumdist - 200m, plus last 200 frames removed

has_video:
    for gen2 / partner MB, require non-null front-forward video file

dropped_frames:
    remove frames around timestamp gaps > 5 * 1e6 / frame_rate
```

## Active `mcv_new_phase2` bucket weights

These weights already sum to 1.0, so raw weight equals sampling percent.

| Bucket | Weight | Percent |
|---|---:|---:|
| `NOT_STOPPED_DC_GEN2_MACHE_LDN` | 0.0205 | 2.05% |
| `NOT_STOPPED_DC_GEN2_MACHE_USA` | 0.0205 | 2.05% |
| `NOT_STOPPED_DC_GEN2_MACHE_JPN` | 0.0150 | 1.50% |
| `NOT_STOPPED_DC_GEN2_MACHE_DEU` | 0.0150 | 1.50% |
| `NOT_STOPPED_DC_GEN2_MSC` | 0.0150 | 1.50% |
| `NOT_STOPPED_DC_GEN2_NAR` | 0.0150 | 1.50% |
| `NOT_STOPPED_DC_GEN2_ALPHA3` | 0.0505 | 5.05% |
| `STOPPED_DC_GEN2_MACHE_LDN` | 0.0020 | 0.20% |
| `STOPPED_DC_GEN2_MACHE_USA` | 0.0020 | 0.20% |
| `STOPPED_DC_GEN2_MACHE_JPN` | 0.0010 | 0.10% |
| `STOPPED_DC_GEN2_MACHE_DEU` | 0.0010 | 0.10% |
| `STOPPED_DC_GEN2_MSC` | 0.0020 | 0.20% |
| `STOPPED_DC_GEN2_NAR` | 0.0020 | 0.20% |
| `STOPPED_DC_GEN2_ALPHA3` | 0.0020 | 0.20% |
| `LARGE_ERROR_1_LDN_SLOW` | 0.0200 | 2.00% |
| `LARGE_ERROR_1_USA_SLOW` | 0.0200 | 2.00% |
| `LARGE_ERROR_1_JPN_SLOW` | 0.0050 | 0.50% |
| `LARGE_ERROR_1_DEU_SLOW` | 0.0050 | 0.50% |
| `START` | 0.0100 | 1.00% |
| `START_GEAR_CHANGE_LDN_OFFICE` | 0.0025 | 0.25% |
| `START_GEAR_CHANGE_LDN_OTHER` | 0.0200 | 2.00% |
| `START_GEAR_CHANGE_USA_OFFICE` | 0.0025 | 0.25% |
| `START_GEAR_CHANGE_USA_OTHER` | 0.0200 | 2.00% |
| `START_GEAR_CHANGE_MSC_OTHER` | 0.0015 | 0.15% |
| `INDICATOR_LDN` | 0.0100 | 1.00% |
| `INDICATOR_USA` | 0.0100 | 1.00% |
| `INDICATOR_JPN` | 0.0050 | 0.50% |
| `INDICATOR_DEU` | 0.0050 | 0.50% |
| `INDICATOR_CHANGE_LDN` | 0.0100 | 1.00% |
| `INDICATOR_CHANGE_USA` | 0.0100 | 1.00% |
| `INDICATOR_CHANGE_JPN` | 0.0050 | 0.50% |
| `INDICATOR_CHANGE_DEU` | 0.0050 | 0.50% |
| `GEAR_CHANGE_GEN2_MACHE_LDN` | 0.0100 | 1.00% |
| `GEAR_CHANGE_GEN2_MACHE_USA` | 0.0100 | 1.00% |
| `GEAR_CHANGE_GEN2_MACHE_DEU` | 0.0050 | 0.50% |
| `GEAR_CHANGE_GEN2_MACHE_JPN` | 0.0050 | 0.50% |
| `GEAR_CHANGE_GEN2_ALPHA3` | 0.0050 | 0.50% |
| `GEAR_CHANGE_GEN2_MSC` | 0.0020 | 0.20% |
| `INTERVENTIONS_GEN2_LDN0` | 0.0500 | 5.00% |
| `INTERVENTIONS_GEN2_USA0` | 0.0500 | 5.00% |
| `INTERVENTIONS_GEN2_JPN0` | 0.0100 | 1.00% |
| `INTERVENTIONS_GEN2_DEU0` | 0.0100 | 1.00% |
| `INTERVENTIONS_GEN2_MSC0` | 0.0100 | 1.00% |
| `INTERVENTIONS_GEN2_NAR0` | 0.0025 | 0.25% |
| `INTERVENTIONS_GEN2_ALPHA30` | 0.0500 | 5.00% |
| `INTERVENTIONS_GEN2_LDN0_TORQUE` | 0.0100 | 1.00% |
| `INTERVENTIONS_GEN2_USA0_TORQUE` | 0.0100 | 1.00% |
| `INTERVENTIONS_GEN2_LDN0_TORQUE_CURVATURE` | 0.0100 | 1.00% |
| `INTERVENTIONS_GEN2_USA0_TORQUE_CURVATURE` | 0.0100 | 1.00% |
| `INTERVENTIONS_GEN2_LDN1` | 0.0200 | 2.00% |
| `INTERVENTIONS_GEN2_USA1` | 0.0200 | 2.00% |
| `INTERVENTIONS_GEN2_JPN1` | 0.0100 | 1.00% |
| `INTERVENTIONS_GEN2_DEU1` | 0.0100 | 1.00% |
| `INTERVENTIONS_GEN2_MSC1` | 0.0100 | 1.00% |
| `INTERVENTIONS_GEN2_NAR1` | 0.0025 | 0.25% |
| `INTERVENTIONS_GEN2_ALPHA31` | 0.0400 | 4.00% |
| `INTERVENTIONS_GEAR_CHANGE0` | 0.0500 | 5.00% |
| `INTERVENTIONS_GEAR_CHANGE1` | 0.0500 | 5.00% |
| `PARKING_LDN_OFFICE` | 0.0025 | 0.25% |
| `PARKING_LDN_NOSE` | 0.0050 | 0.50% |
| `PARKING_LDN_TAIL` | 0.0050 | 0.50% |
| `PARKING_LDN_SIDE` | 0.0050 | 0.50% |
| `PARKING_LDN_PARALLEL` | 0.0050 | 0.50% |
| `PARKING_USA_OFFICE` | 0.0025 | 0.25% |
| `PARKING_USA_NOSE` | 0.0050 | 0.50% |
| `PARKING_USA_TAIL` | 0.0050 | 0.50% |
| `PARKING_USA_SIDE` | 0.0050 | 0.50% |
| `PARKING_USA_PARALLEL` | 0.0050 | 0.50% |
| `PARKING_ALPHA3_OFFICE` | 0.0025 | 0.25% |
| `PARKING_ALPHA3_OTHER` | 0.0050 | 0.50% |
| `PARKING_MSC_OFFICE` | 0.0025 | 0.25% |
| `PARKING_MSC_OTHER` | 0.0050 | 0.50% |
| `PARKING_MRM` | 0.0025 | 0.25% |
| `PARKING_MRM_TRACK` | 0.0005 | 0.05% |
| `PUDO_LDN_NEAR` | 0.0200 | 2.00% |
| `PUDO_LDN_FAR` | 0.0200 | 2.00% |
| `PUDO_USA_NEAR` | 0.0200 | 2.00% |
| `PUDO_USA_FAR` | 0.0200 | 2.00% |
| `UNPARKING_LDN_OTHER` | 0.0100 | 1.00% |
| `UNPARKING_USA_OTHER` | 0.0100 | 1.00% |
| `UNPARKING_ALPHA3_OTHER` | 0.0100 | 1.00% |
| `UNPARKING_MSC_OTHER` | 0.0100 | 1.00% |
| `UNPARKING_LDN_OFFICE` | 0.0050 | 0.50% |
| `UNPARKING_USA_OFFICE` | 0.0050 | 0.50% |
| `UNPARKING_ALPHA3_OFFICE` | 0.0025 | 0.25% |
| `UNPARKING_MSC_OFFICE` | 0.0025 | 0.25% |

## Bucket generation recipes

### DC not-stopped / stopped

Buckets:
- `NOT_STOPPED_DC_GEN2_MACHE_{LDN,USA,JPN,DEU}`
- `NOT_STOPPED_DC_GEN2_{MSC,NAR,ALPHA3}`
- `STOPPED_DC_GEN2_MACHE_{LDN,USA,JPN,DEU}`
- `STOPPED_DC_GEN2_{MSC,NAR,ALPHA3}`

Function: `get_not_stopped_indices`.

Not-stopped:

```python
mask = abs(speed) > 0.01
mask = country_or_platform_filter(mask)
mask = dilate(mask, before=2s, after=2s)   # phase2 regional/platform DC buckets
mask = remove_near_auto_transitions(mask, margin=5s)
mask &= ALL_VALID_MASKS2
```

Stopped:

```python
mask = abs(speed) <= 0.01
mask = country_or_platform_filter(mask)
mask = dilate(mask, before=0s, after=0s)
mask = remove_near_auto_transitions(mask, margin=5s)
mask &= ALL_VALID_MASKS2
```

SQL-ish version:

```sql
WITH base AS (
  SELECT *,
         ABS(speed) > 0.01 AS is_not_stopped,
         ABS(speed) <= 0.01 AS is_stopped
  FROM run_frames
),
auto_transitions AS (
  SELECT run_id, timestamp_unixus
  FROM base
  WHERE auto != LAG(auto) OVER (PARTITION BY run_id ORDER BY timestamp_unixus)
),
not_stopped AS (
  SELECT b.*
  FROM base b
  WHERE b.is_not_stopped
    AND b.country = 'USA'
    AND NOT EXISTS (
      SELECT 1 FROM auto_transitions t
      WHERE t.run_id = b.run_id
        AND ABS(t.timestamp_unixus - b.timestamp_unixus) <= 5 * 1000000
    )
)
SELECT * FROM dilate_by_time(not_stopped, before_s => 2, after_s => 2);
```

Bucket-local augmentation/windowing:
- Not-stopped DC gets a 2s before/after dilation around moving frames.
- Stopped DC has no dilation.
- Both remove frames within 5s of automation transitions.

### Large-error slow

Buckets:
- `LARGE_ERROR_1_{LDN,USA,JPN,DEU}_SLOW`

Function: `get_annotations_indices`.

```python
mask = annotations["large_error_1_slow"] == True
mask &= country_filter
mask = dilate(mask, before=2_frames, after=2_frames)
mask &= ALL_VALID_MASKS2
```

In `mcv_new_phase2x_wta`, these are disabled and their 5% goes into alpha3 CA buckets.

### Start

Bucket:
- `START`

Function: `get_start_stop_indices`.

```python
mask = annotations["start_offset"] >= -0.2s
mask &= annotations["start_offset"] <= 0s
mask &= ALL_VALID_MASKS with autonomous, geofence, reverse, uturn, high_speed, bad stop/park, not_ends, video, dropped frames
```

This is a generic start bucket, not specifically parking/unparking.

### Start near gear change

Buckets:
- `START_GEAR_CHANGE_LDN_OFFICE`
- `START_GEAR_CHANGE_LDN_OTHER`
- `START_GEAR_CHANGE_USA_OFFICE`
- `START_GEAR_CHANGE_USA_OTHER`
- `START_GEAR_CHANGE_MSC_OTHER`

Function: `get_start_gear_change_indices`.

This is the closest heuristic to a pre-departure bucket.

```python
if vehicle not in configured_vehicle_group:
    return []

gear_change = pad(gear[:-1] != gear[1:], right=1)

if locations:
    gear_change &= parking_location in locations

near_gear_change = dilate(gear_change, before=30s, after=30s)

start_moment = pad((speed[:-1] == 0) & (speed[1:] != 0), right=1)

mask = near_gear_change & start_moment
mask = dilate(mask, before=0.9s, after=0s)
mask &= ALL_VALID_MASKS2
```

Location coding:
- LDN office: `[0]`
- LDN other: `[-1]`
- USA office: `[1, 2]`
- USA other: `[-1]`
- MSC other: `[-1]`

SQL-ish:

```sql
WITH transitions AS (
  SELECT *,
         gear != LAG(gear) OVER w AS gear_changed,
         LAG(speed) OVER w = 0 AND speed != 0 AS started_moving
  FROM frames
  WINDOW w AS (PARTITION BY run_id ORDER BY timestamp_unixus)
),
gear_windows AS (
  SELECT f.*
  FROM transitions f
  WHERE EXISTS (
    SELECT 1 FROM transitions g
    WHERE g.run_id = f.run_id
      AND g.gear_changed
      AND ABS(g.timestamp_unixus - f.timestamp_unixus) <= 30 * 1000000
  )
)
SELECT *
FROM dilate_by_time(
  (SELECT * FROM gear_windows WHERE started_moving),
  before_s => 0.9,
  after_s => 0.0
);
```

Bucket-local augmentation/windowing:
- Detects a movement-start frame.
- Keeps the 0.9s before that movement-start frame.
- Requires the movement-start frame to be within 30s of a gear transition.

### Indicator and indicator-change

Buckets:
- `INDICATOR_{LDN,USA,JPN,DEU}`
- `INDICATOR_CHANGE_{LDN,USA,JPN,DEU}`

Functions:
- `get_indicator_indices`
- `get_indicator_change_indices`

Indicator-on:

```python
mask = indicator in (1, 2)   # left/right only; hazard=3 excluded
mask &= country_filter
mask = dilate(mask, before=8s, after=2s)
mask &= speed > 0
mask &= ~post_handover_indicator_invalid
mask &= ALL_VALID_MASKS2
```

Indicator-change:

```python
mask = indicator[:-1] != indicator[1:]
mask &= both old and new indicator are known
mask &= neither old nor new indicator is hazard
mask &= country_filter
mask = dilate(mask, before=1s, after=1s)
mask &= ~post_handover_indicator_invalid
mask &= ALL_VALID_MASKS2
```

Bucket-local augmentation/windowing:
- Indicator-on gets a wide `-8s..+2s` window.
- Indicator-change gets a narrow `-1s..+1s` window.
- Hazard is deliberately excluded from these buckets; hazard is treated elsewhere.

### Gear change

Buckets:
- `GEAR_CHANGE_GEN2_MACHE_LDN`
- `GEAR_CHANGE_GEN2_MACHE_USA`
- `GEAR_CHANGE_GEN2_MACHE_DEU`
- `GEAR_CHANGE_GEN2_MACHE_JPN`
- `GEAR_CHANGE_GEN2_ALPHA3`
- `GEAR_CHANGE_GEN2_MSC`

Function: `get_gear_change_indices`.

```python
if vehicle_model is configured and run platform/model does not match:
    return []

mask = gear[:-1] != gear[1:]
mask &= country_filter_if_configured
mask = dilate(mask, before=1s, after=1s)
mask &= ALL_VALID_MASKS2
```

Note: `config.py` default has `GEAR_CHANGE_AFTER=0.5`, but the `mcv_new_phase2` inheritance path sets `GEAR_CHANGE_BEFORE=1.0` and `GEAR_CHANGE_AFTER=1.0` in `mcv_new_base0.yml`.

Bucket-local augmentation/windowing:
- Dilation around any raw gear transition.
- No smoothing in this sampler.
- No park-only restriction; any gear value change is included.

### Interventions / corrective actions

Buckets:
- `INTERVENTIONS_GEN2_{LDN,USA,JPN,DEU,MSC,NAR,ALPHA3}0`
- `INTERVENTIONS_GEN2_{LDN,USA,JPN,DEU,MSC,NAR,ALPHA3}1`
- torque and torque-curvature variants
- acceleration slow/fast variants are defined but weight `0.0` in phase2

Function: `get_intervention_indices`.

The intervention anchor is an autonomous disengagement:

```python
intervention_indices = where((auto[:-1] == 1) & (auto[1:] == 0)) + 1
```

General filtering:

```python
if torque_thresh > 0:
    keep abs(steering_torque[anchor]) > torque_thresh
    keep speed[anchor] > torque_speed_thresh

if acceleration_thresh != 0:
    acceleration = (speed[t + 2s] - speed[t]) / 2s
    keep acceleration sign / threshold

if curvature_thresh > 0:
    keep abs(curvature[anchor]) > curvature_thresh

if gear_window > 0:
    keep anchors within gear_window seconds of any gear change

if remove_remain_stopped:
    remove anchors where speed[anchor] == 0 and speed[anchor + 1s] == 0

remove abort-lane-change interventions by default

filter annotation labels:
    interventions_label != 0 and != 255
filter corrections if corrections list is non-empty
filter country/platform
```

Window creation:

```python
if start_offset < 0:
    # pre-intervention frames
    mask[anchor + start_offset : anchor + min(0, end_offset)] = True

if end_offset > 0:
    # post-intervention DC-only frames
    mask[anchor + max(0, start_offset) : anchor + end_offset] = auto == 0
```

Important offsets from `mcv_new_base0.yml`:
- `INTERVENTIONS_BEFORE = 1.2`
- `INTERVENTIONS_AFTER1 = 1.0`
- `INTERVENTIONS_AFTER2 = 5.0`

So:
- suffix `0` buckets use `-1.2s..0s` before intervention.
- suffix `1` buckets use `0s..+1.0s` after intervention, only while expert/DC (`auto == 0`).
- suffix `2` buckets are defined as `+1.0s..+5.0s`, but all phase2 weights are `0.0`.

Torque variants:

```python
INTERVENTIONS_GEN2_LDN0_TORQUE:
    same as LDN0
    plus abs(steering_torque) > 1.6
    plus speed > 5 mph

INTERVENTIONS_GEN2_LDN0_TORQUE_CURVATURE:
    same torque filter
    plus abs(curvature) > 0.01
```

`mcv_new_phase2x_wta` changes:
- `INTERVENTIONS_GEN2_ALPHA30 = 0.075`
- `INTERVENTIONS_GEN2_ALPHA31 = 0.065`

### Interventions near gear change

Buckets:
- `INTERVENTIONS_GEAR_CHANGE0`
- `INTERVENTIONS_GEAR_CHANGE1`

Function: `get_intervention_indices` with `gear_window=30.0`.

```python
anchor = autonomous disengagement
keep anchor if within 30s of any gear change
remove remain-stopped anchors where speed at anchor and speed at anchor + 1s are both 0
require intervention label != 0 and != 255

bucket 0:
    window = -1.2s..0s
    masks = ["autonomous_engage", "not_ends", "has_video", "dropped_frames"]

bucket 1:
    window = 0s..+1.0s
    keep only auto == 0 after intervention
    masks = ["autonomous", "autonomous_engage", "not_ends", "has_video", "dropped_frames"]
```

This is not a PUDO/unPUDO bucket by itself, but it deliberately upweights CA around gear transitions.

### Parking

Buckets:
- `PARKING_LDN_OFFICE`
- `PARKING_LDN_{NOSE,TAIL,SIDE,PARALLEL}`
- `PARKING_USA_OFFICE`
- `PARKING_USA_{NOSE,TAIL,SIDE,PARALLEL}`
- `PARKING_ALPHA3_OFFICE`
- `PARKING_ALPHA3_OTHER`
- `PARKING_MSC_OFFICE`
- `PARKING_MSC_OTHER`
- `PARKING_MRM`
- `PARKING_MRM_TRACK`

Function: `get_parking_indices(stop_type="park")`.

```python
if vehicle / vehicle_model filter does not match:
    return []

mask = dataset.parking

if locations is configured:
    mask &= parking_location in locations

# remove long stops; keep only frames with non-zero speed within a +/-40-frame window
mask &= dilate_mask(speed != 0, before=40_frames, after=40_frames)

if park_type is configured:
    mask &= parking_type in requested types

mask &= stopping_type == 1
mask &= ALL_VALID_MASKS2
```

Location / type mapping used by active buckets:

| Bucket pattern | Vehicle / platform | Location filter | Park type filter |
|---|---|---|---|
| `PARKING_LDN_OFFICE` | Mache Euro | `[0]` | nose/tail/side/parallel |
| `PARKING_LDN_NOSE` | Mache Euro | `[-1]` | nose |
| `PARKING_LDN_TAIL` | Mache Euro | `[-1]` | tail |
| `PARKING_LDN_SIDE` | Mache Euro | `[-1]` | side |
| `PARKING_LDN_PARALLEL` | Mache Euro | `[-1]` | parallel |
| `PARKING_USA_OFFICE` | Mache USA | `[1, 2]` | nose/tail/side/parallel |
| `PARKING_USA_NOSE` | Mache USA | `[-1]` | nose |
| `PARKING_USA_TAIL` | Mache USA | `[-1]` | tail |
| `PARKING_USA_SIDE` | Mache USA | `[-1]` | side |
| `PARKING_USA_PARALLEL` | Mache USA | `[-1]` | parallel |
| `PARKING_ALPHA3_OFFICE` | alpha3 | `[0, 1, 2]` | none |
| `PARKING_ALPHA3_OTHER` | alpha3 | `[-1]` | none |
| `PARKING_MSC_OFFICE` | msc | `[0, 1, 2]` | none |
| `PARKING_MSC_OTHER` | msc | `[-1]` | none |
| `PARKING_MRM` | any | `[-1]` | mrm |
| `PARKING_MRM_TRACK` | any | `[3]` | mrm |

SQL-ish:

```sql
WITH non_long_stop AS (
  SELECT *,
         EXISTS (
           SELECT 1
           FROM frames n
           WHERE n.run_id = f.run_id
             AND ABS(n.frame_idx - f.frame_idx) <= 40
             AND n.speed != 0
         ) AS has_nearby_motion
  FROM frames f
)
SELECT *
FROM non_long_stop
WHERE parking
  AND has_nearby_motion
  AND stopping_type = 1
  AND parking_location IN (-1)
  AND parking_type = 'nose'
  AND all_valid_masks2;
```

Bucket-local augmentation/windowing:
- No explicit time dilation after the final mask.
- The long-stop removal uses a motion dilation around `speed != 0`.

### PUDO

Buckets:
- `PUDO_LDN_NEAR`
- `PUDO_LDN_FAR`
- `PUDO_USA_NEAR`
- `PUDO_USA_FAR`

Function: `get_parking_indices(stop_type="pudo")`.

```python
mask = dataset.parking
mask &= parking_location == -1
mask &= stopping_type == 2
mask &= dilate_mask(speed != 0, before=40_frames, after=40_frames)

before = dataset.pudo_pin_valid_before[indices]
after = dataset.pudo_pin_valid_after[indices]
is_near = (before <= 2) & (after <= 1)

if near bucket:
    keep is_near
else:
    keep ~is_near

mask &= ALL_VALID_MASKS2
```

Notes:
- PUDO here is a stopping bucket, not an unPUDO/departure bucket.
- Near/far is based on predicted/propagated PUDO-pin-valid fields at the sampled frames.
- It does not use a movement-start anchor.

### Unparking

Buckets:
- `UNPARKING_LDN_OFFICE`
- `UNPARKING_LDN_OTHER`
- `UNPARKING_USA_OFFICE`
- `UNPARKING_USA_OTHER`
- `UNPARKING_ALPHA3_OFFICE`
- `UNPARKING_ALPHA3_OTHER`
- `UNPARKING_MSC_OFFICE`
- `UNPARKING_MSC_OTHER`

Function: `get_unparking_indices`.

This is the closest Zak bucket to unPUDO movement-start sampling.

```python
if vehicle / vehicle_model filter does not match:
    return []

moving_indices = flatnonzero(abs(speed) > 0)
gear_out_of_park_indices = flatnonzero((gear[:-1] == 0) & (gear[1:] != 0))

# For each gear-out-of-park transition, take first future moving frame.
pos = searchsorted(moving_indices, gear_out_of_park_indices, side="left")
valid = pos < len(moving_indices)
anchors = moving_indices[pos[valid]]

mask = zeros_like(speed)
mask[anchors] = True

if locations:
    mask &= parking_location_raw in locations

mask = dilate(mask, before=0s, after=10s)
mask &= ALL_VALID_MASKS2
```

SQL-ish:

```sql
WITH gear_out AS (
  SELECT run_id, frame_idx, timestamp_unixus
  FROM frames
  WHERE LAG(gear) OVER (PARTITION BY run_id ORDER BY frame_idx) = 0
    AND gear != 0
),
moving AS (
  SELECT run_id, frame_idx, timestamp_unixus
  FROM frames
  WHERE ABS(speed) > 0
),
anchors AS (
  SELECT g.run_id, MIN(m.frame_idx) AS anchor_frame_idx
  FROM gear_out g
  JOIN moving m
    ON m.run_id = g.run_id
   AND m.frame_idx >= g.frame_idx
  GROUP BY g.run_id, g.frame_idx
)
SELECT f.*
FROM frames f
JOIN anchors a
  ON f.run_id = a.run_id
 AND f.frame_idx BETWEEN a.anchor_frame_idx AND a.anchor_frame_idx + 10 * frame_rate
WHERE f.parking_location_raw IN (-1)
  AND all_valid_masks2;
```

Bucket-local augmentation/windowing:
- Anchor is first future non-zero-speed frame after gear leaves park.
- Window is `0s..+10s`.
- No pre-departure frames are included in these buckets.

## Global training augmentations and label transformations

The sampler does not define image/route/state augmentation per bucket. Once a frame index is sampled, the dataset applies the same training-time data transforms regardless of which bucket produced the sample.

For `mcv_new_phase2` inherited from `mcv_new_base0.yml`:

### Image augmentation

Applies to all sampled buckets during training.

| Config | Value |
|---|---:|
| `IMAGE.AUGMENTATION.CONSISTENT_ACROSS_TIME` | `True` |
| `IMAGE.AUGMENTATION.BLUR_PROB` | `0.2` |
| `IMAGE.AUGMENTATION.SHARPEN_PROB` | `0.2` |
| `IMAGE.AUGMENTATION.COLOR_PROB` | `0.2` |
| `IMAGE.AUGMENTATION.INTRINSICS_PROB` | `0.0` in `mcv_new_phase2`; base value was `0.2` |
| `IMAGE.AUGMENTATION.ROTATION_PROB` | `0.0` |
| `IMAGE.TEMPORAL_DROPOUT` | `0.1` |
| `IMAGE.DECODE_JPEG_HALF_RES_PROB` | `0.9` |

Interpretation:
- Blur/sharpen/color are random image augmentations.
- Intrinsics augmentation is explicitly disabled in `mcv_new_phase2`.
- Temporal dropout randomly drops past/context frames.
- Half-res JPEG decode is mostly an efficiency/robustness choice, applied probabilistically.

### Route / navigation augmentation

Applies to all sampled buckets where route context is loaded, with behavior depending on whether the sampled frame is considered parking.

| Config | Value |
|---|---:|
| `ROUTE.AUGMENTATION_PROB` | `0.0` |
| `ROUTE.AUGMENTATION_DROPOUT` | `0.25` |
| `ROUTE.AUGMENTATION_DROPOUT_BLACK` | `0.9` |
| `ROUTE.AUGMENTATION_PARKING_REQUEST_PROB` | `0.025` |
| `ROUTE.AUGMENTATION_END_JITTER` | `rand` |
| `ROUTE.AUGMENTATION_END_JITTER_BETA_SCALE` | `1.0` |
| `INDICATOR_STICK.AUGMENTATION_DROPOUT` | `0.7` |

Behavior:

```python
route_end_jitter:
    randomly jitter route endpoint using run segment jitter bounds

route_dropout:
    with p=0.25, drop route conditioning
    with p=0.9 inside that dropout, black route map completely
    otherwise zero route while keeping lane network visible

indicator_stick_dropout:
    when route is not dropped, with p=0.7 zero indicator stick

parking_request:
    if sample is parking and rand < 0.025:
        parking_request = True
        route_map = black
```

### Indicator state augmentation

Configured but disabled:

```python
INDICATOR_STATE.CHANGE_AUGMENTATION_PROB = 0.0
INDICATOR_STATE.WRONG_AUGMENTATION_PROB = 0.0
```

No active indicator-state corruption is applied in this config.

### Gear state augmentation

`GEAR_STATE.ENABLED = True`, but there is no bucket-specific gear-state augmentation in this path. Gear state is a model input/loss target. Gear-change upsampling is done by the sampler buckets, not by mutating gear labels.

### Ego-pose interpolation / pre-corrective action pseudo-labeling

`EGO_POSE_INTERPOLATION.ENABLED = True`.

For `mcv_new_phase2`, `LEGACY=True`, so `TrajectoryInterpolation` is used. For `mcv_new_phase2x_wta`, `LEGACY=False`, so `TrajectoryInterpolationV2` is used.

This transformation is not selected by bucket name directly, but it matters for intervention/pre-intervention samples because it rewrites future speed/path labels before an intervention.

Legacy interpolation core:

```python
start2 = round((-time_till_int + offset + -time_till_int) / tick_time)

if current_speed > 0 and any future speed until start2 is zero:
    start1 = first zero-speed index
    start2 = start1
    new_acceleration = -current_speed / start1 / tick_time
else:
    start1 = round((-time_till_int + offset) / tick_time)
    new_acceleration = (speed[start2] - speed[0]) / start1 / tick_time

new_speed[0:start1] = speed[0] + new_acceleration * arange(start1) * tick_time
new_speed[start1:] = original_speed[start2 : start2 + future + 1 - start1]

if do_path:
    if path_speed_factor:
        target_distance = 2 * -dist_till_int + path_base_offset + speed_term
    else:
        target_distance = 2 * -dist_till_int + path_base_offset

    fit clothoid from current pose to target path point
    if steering torque is large and speed is high:
        laterally offset start point by torque_offset * sign(torque)

unroll new_speed over path to produce future egoposition, yaw, curvature
```

Important config values:
- `INTERVENTIONS_BEFORE = 1.2s`
- `SPEED_TIME_OFFSET = 1.0` in `mcv_new_base0.yml`
- `PATH_BASE_OFFSET = 4.0`
- `PATH_SPEED_FACTOR = True`
- `TORQUE_OFFSET = 0.2`
- `TORQUE_THRESH = 1.6`
- `TORQUE_SPEED_THRESH = 2.23 m/s` (5 mph)

`EGO_POSE_AUGMENTATION.ENABLED = False` in `mcv_new_base0.yml`, so the separate trajectory augmentation object is disabled.

## Per-bucket "augmentation" summary

This table separates bucket-local time/window augmentation from global training augmentation.

| Bucket family | Bucket-local augmentation/window | Global augmentations |
|---|---|---|
| Not-stopped DC | Dilation around moving frames, usually `-2s..+2s`; remove frames near auto transitions | image, route, temporal dropout, ego-pose interpolation if applicable |
| Stopped DC | No dilation; stopped predicate only; remove frames near auto transitions | same global transforms |
| Large-error slow | Annotation mask dilated by 2 frames each side | same global transforms |
| Start | Annotation start offset `-0.2s..0s` | same global transforms |
| Start gear change | movement-start frame within 30s of gear change, dilated `-0.9s..0s` | same global transforms |
| Indicator | indicator-on mask, excluding hazard, dilated `-8s..+2s` | same global transforms |
| Indicator change | non-hazard indicator transition, dilated `-1s..+1s` | same global transforms |
| Gear change | any gear transition, dilated `-1s..+1s` | same global transforms |
| Intervention suffix `0` | pre-intervention `-1.2s..0s` | same global transforms; ego-pose interpolation most relevant here |
| Intervention suffix `1` | post-intervention `0s..+1s`, expert/DC only | same global transforms |
| Intervention gear-change `0/1` | same as intervention `0/1`, plus CA anchor within 30s of gear change | same global transforms |
| Parking | no final dilation; uses nearby-motion requirement to remove long stops | same global transforms; parking request may activate with p=0.025 |
| PUDO | no final dilation; stopping_type=2 and near/far pin split | same global transforms; parking request can apply if sample is marked parking |
| Unparking | first moving frame after gear leaves park, dilated `0s..+10s` | same global transforms |

## OTF config comparison

`mcv_new_phase2_otf.yml` is not the same mechanism. It reads materialized partitions:

```yaml
DATASET:
  NAME: OTF
  OTF:
    PATH: sampling_materialised/bc/split_alpha2_alpha3/release/0.0.17/dataset
    PRE_CORRECTIVE_ACTION_INTERPOLATION: True
    USE_PATHS: True
    TRAIN_PARTITIONS: [...]
```

Train partition group weights in the config sum to `1.01264` before any runtime normalization:

| OTF family | Raw weight | Approx normalized percent |
|---|---:|---:|
| DC | 0.379818 | 37.51% |
| CA | 0.199940 | 19.74% |
| CA diversion | 0.010000 | 0.99% |
| Pre-CA | 0.399900 | 39.49% |
| Pre-CA diversion | 0.003000 | 0.30% |
| DILC | 0.019982 | 1.97% |

The OTF path includes `PRE_CORRECTIVE_ACTION_INTERPOLATION=True`; the lower-level OTF dataset receives this flag and emits `is_pre_intervention_corrected`. This is comparable in spirit to the heuristic pre-intervention interpolation, but it applies in the OTF materialized data reader rather than through the heuristic sampler bucket functions.

There are no explicit parking/PUDO/unparking partitions in `mcv_new_phase2_otf.yml`.

## Reimplementation checklist

For a Spark/materialization-style implementation:

1. Decide whether to reproduce heuristic buckets or OTF partitions. For PUDO/unPUDO behavior, reproduce heuristic buckets.
2. Build a common frame table with `run_id`, frame index, timestamp, speed, gear, country, vehicle/platform, auto, parking labels, PUDO pin labels, intervention labels, indicator, video availability, dropped-frame markers.
3. Implement shared valid masks first. Be careful that PUDO/unparking use `ALL_VALID_MASKS2`, not the stricter mask set.
4. Implement each bucket as `(anchors -> optional dilation -> valid masks -> output bucket name)`.
5. Keep bucket weights separate from bucket creation. Zak creates all candidate indices, then samples by weight at train time.
6. For materialized output, choose whether to store all candidate frames per bucket or to downsample to the target mix. Zak does the latter lazily every epoch.
7. For unPUDO:
   - `unparking_*` is first non-zero-speed frame after gear leaves park, window `0..10s`.
   - `start_gear_change_*` is first `0 -> nonzero` speed start within 30s of gear change, window `-0.9..0s`.
8. For CA near gear:
   - `INTERVENTIONS_GEAR_CHANGE0/1` anchors at autonomous disengagement and requires gear change within 30s.
   - It removes interventions where speed is zero at intervention and still zero 1s later.
9. Apply global augmentation/label transforms in the dataloader/training adapter, not in bucket materialization, unless your framework materializes corrected labels.

