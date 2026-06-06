# Zak PUDO and Generic Driving Bucket Notes

Date: 2026-06-05

Branch inspected: `origin/zmurez/pudo` at `22a4ac634eb3e88112059946f98e7c2ef7d3876f`.

## How to read this page

This page compares two different bucket systems:

| Label | Meaning | Where it lives |
|---|---|---|
| `DRIVING` | Generic materialized driving buckets. These write parquet partitions under `dataset_bucket=...`. | `wayve/ai/si/materialisation` and `wayve/ai/zoo/sampling` |
| `ZAK` | Zak's `zmurez/pudo` experimental training-time sampler. These buckets are built in memory by the dataloader/sampler and are not written as materialized tables. | `wayve/ai/experimental` |
| `COMPARISON` | Notes that connect the two systems for reimplementation. | This document |

Headings are prefixed with `DRIVING`, `ZAK`, or `COMPARISON` so the side navigation stays readable.

## Source files

Zak source files:
- `/workspace/materialization/wayve/ai/experimental/configs/mcv_new_phase2.yml`
- `/workspace/materialization/wayve/ai/experimental/configs/mcv_new_phase2x.yml`
- `/workspace/materialization/wayve/ai/experimental/configs/mcv_new_phase2x_wta.yml`
- `/workspace/materialization/wayve/ai/experimental/configs/mcv_new_phase2_otf.yml`
- `/workspace/materialization/wayve/ai/experimental/samplers/sampler.py`
- `/workspace/materialization/wayve/ai/experimental/dataset/datasets.py`
- `/workspace/materialization/wayve/ai/experimental/dataset/ipace.py`
- `/workspace/materialization/wayve/ai/experimental/transforms.py`

Generic driving source files:
- `/workspace/materialization/wayve/ai/si/materialisation/README.md`
- `/workspace/materialization/wayve/ai/si/materialisation/materialise.py`
- `/workspace/materialization/wayve/ai/zoo/sampling/bucket.py`
- `/workspace/materialization/wayve/ai/zoo/sampling/buckets.py`
- `/workspace/materialization/wayve/ai/zoo/sampling/constants.py`
- `/workspace/materialization/wayve/ai/zoo/sampling/filters.py`
- `/workspace/materialization/wayve/ai/zoo/sampling/masks.py`
- `/workspace/materialization/wayve/ai/drive/bc/configs/defaults/data/buckets.py`

## Executive summary

Zak has two different "bucket" mechanisms on `zmurez/pudo`.

1. `mcv_new_phase2.yml` / `mcv_new_phase2x_wta.yml`: training-time heuristic buckets. These do not write materialized tables. The sampler calculates frame indices per run using predicates over the single-run dataset arrays, then samples from named buckets by configured weights.
2. `mcv_new_phase2_otf.yml`: OTF materialized partition consumption. This reads existing materialized partitions with weights. It contains DC, CA, pre-CA, DILC partitions, but not Zak's heuristic parking/PUDO/unparking buckets.

For reimplementation of parking/PUDO/unPUDO, the useful logic is in the heuristic sampler path.

The generic driving materializer is a third mechanism. It creates persisted parquet partitions named by `dataset_split` and `dataset_bucket`. That path is not Zak's heuristic sampler, but it is the production pattern to copy when the framework needs materialized buckets instead of training-time in-memory buckets.

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

## DRIVING: Does DC include CA?

Short answer: DC and CA are not guaranteed disjoint in generic materialization.

The reason is mechanical:

- Generic DC buckets such as `dc_mache_usa` use `func=get_all_indices` plus `masks=DC_MASKS`.
- `DC_MASKS` excludes autonomous frames via the `autonomous` mask. It also excludes stopped segments, reverse/neutral, geofence, high speed, bad run windows, etc.
- `DC_MASKS` does not include a broad "exclude all corrective action windows" mask.
- CA buckets such as `ca_short_usa` and `ca_long_usa` use intervention-anchored functions and also use `masks=DC_MASKS`.

So a corrective-action frame is DC in the physical/control sense: after the intervention the human is driving, and `AUTOMATION_ACTIVE` is off. Because the broad DC buckets do not explicitly subtract CA windows, a CA timestamp can also land in a normal DC bucket if it passes the generic DC masks.

What this means for training:

- CA is intentionally represented through separate `ca_short_*` and `ca_long_*` partitions, with explicit training weights.
- DC buckets may contain some CA overlap, but that overlap is incidental and uncontrolled.
- The materializer writes buckets independently. It does not globally deduplicate `(run_id, timestamp_unixus)` across bucket names.
- If a framework needs strict separation, add an explicit anti-CA mask to the broad DC buckets or subtract the CA windows when writing DC.

Pseudo-code for the current behavior:

```python
dc_mache_usa = all_indices(run) - DC_MASKS

ca_short_usa = intervention_window(
    start=intervention_t,
    end=intervention_t + 1.48s,
) - DC_MASKS

# These are separate outputs. The same timestamp can appear in both.
write("dataset_bucket=dc_mache_usa", dc_mache_usa)
write("dataset_bucket=ca_short_usa", ca_short_usa)
```

## DRIVING: Generic materialization

The generic driving materializer is the production path for turning corpus runs into persisted training partitions.

High-level flow:

```python
run_ids = load_run_list()
dfs = load_dataframes(run_ids)

for run_id, df in zip(run_ids, dfs):
    df = add_annotations(df, start=run_id.start, end=run_id.end)

    bucket_to_indices = get_bucket_indices(
        df,
        names=requested_bucket_names,
        ignore_distance_start=1.0,
        ignore_distance_end=50.0,
    )

    for bucket_name, indices in bucket_to_indices.items():
        rows = [(run_id.short_run_id, df.timestamp_unixus[i]) for i in indices]
        append(rows, key=f"dataset_split={split}/dataset_bucket={bucket_name}")

write_parquet_partitions()
```

The written parquet rows contain only the sample identity: `run_id` and `timestamp_unixus`. The full training data is resolved later by joining those sample identities back to corpus/video/tensor sources.

### DRIVING: Bucket definition model

Each bucket is a `Bucket` object:

```python
Bucket(
    name="dc_mache_usa",
    func=get_all_indices,
    masks=DC_MASKS,
    country_filter=("USA",),
    platform_filter=GEN2_MACHE_PLATFORM_FILTER,
)
```

The fields matter as follows:

| Field | Meaning |
|---|---|
| `name` | Partition name under `dataset_bucket=...` |
| `func` | Candidate-index generator |
| `masks` | Names of invalid masks to subtract from candidate indices |
| `country_filter` | Country include/exclude gate |
| `platform_filter` | Vehicle/platform gate |
| `include_autonomous_runs` | Whether the bucket is allowed to process runs with autonomy active |
| `extra_tables` | Extra delta tables needed for bucket predicates or balancing |
| `balancer` | Optional balancing metadata added before final sampling |

Inside `get_bucket_indices`, every requested bucket is evaluated independently:

```python
valid_masks = get_masks(df, ...)

for bucket in ALL_BUCKETS:
    if bucket.name not in requested_names:
        continue

    if is_autonomous_run(df) and not bucket.include_autonomous_runs:
        continue

    if not country_and_platform_match(bucket, df):
        continue

    candidates = bucket.func(df)
    invalid = logical_or([valid_masks[name] for name in bucket.masks])
    bucket_indices[bucket.name] = candidates[~invalid[candidates]]
```

This independence is the key conceptual difference from a mutually exclusive taxonomy. A frame can be in `dc_mache_usa`, `dc_indicator_on_usa`, and `ca_short_usa` at the same time if it satisfies all three recipes.

### DRIVING: Bucket families

The generic driving buckets are broad driving coverage plus targeted oversampling.

| Family | Example buckets | Candidate function | Masks |
|---|---|---|---|
| Broad DC | `dc_mache_uk`, `dc_mache_usa`, `dc_mache_deu`, `dc_mache_jpn`, `dc_mache_global` | `get_all_indices` | `DC_MASKS` |
| Valid DC legacy | `dc_valid_uk`, `dc_valid_usa` | `get_all_indices` | `DC_MASKS` |
| Night DC | `dc_night_uk`, `dc_night_usa` | `get_night_indices` | `DC_MASKS` |
| Curvature DC | `dc_high_curvature_*` | curvature threshold with time dilation | `DC_MASKS` |
| Lateral acceleration DC | `dc_high_lateral_acceleration_*` | lateral acceleration threshold | `DC_MASKS` |
| Jerk DC | `dc_high_jerk_*` | jerk threshold | `DC_MASKS` |
| Pre-start DC | `dc_pre_start_*` | last 0.2s before a detected start-from-stop | `DC_MASKS` |
| High-speed DC | `dc_mache_high_speed_*` | speed range | `DC_MASKS` |
| Indicator DC | `dc_indicator_on_*`, `dc_indicator_on_highway_*` | indicator state plus movement/highway filters | `DC_MASKS` |
| Highway DC | `dc_cruising_highway_*`, `dc_speed_change_highway_*`, `dc_on_off_highway_*` | highway, acceleration, speed-limit predicates | `DC_MASKS` |
| Speed-limit DC | `dc_reduce_speed_to_speed_limit_*` | over-limit plus deceleration predicate | `DC_MASKS` |
| Pre-CA | `pre_ca_*`, `pre_ca_highway_*`, `pre_ca_night_*` | intervention window before disengagement | `AV_MASKS` |
| CA short | `ca_short_*`, `ca_highway_*`, `ca_night_*` | intervention window immediately after disengagement | `DC_MASKS` |
| CA long | `ca_long_*` | later intervention window after short CA | `DC_MASKS` |
| DILC / route-specific | DILC buckets from driving configs | route/lane instruction predicates | bucket-specific AV/DC masks |
| Diversion CA | diversion pre-CA / CA buckets in training configs | intervention-label predicates | bucket-specific AV/DC masks |

The default time windows for generic intervention buckets are:

```python
PRE_INTERVENTION_WINDOW = -1.2
CA_SHORT_WINDOW = 1.48
CA_LONG_WINDOW = 5.0

pre_ca  = [intervention_t - 1.2s, intervention_t - 0.04s]
ca_short = [intervention_t, intervention_t + 1.48s]
ca_long  = [intervention_t + 1.52s, intervention_t + 5.0s]
```

Important nuance:

- `get_filtered_intervention_indices` anchors on the intervention frame and broadcasts the intervention label/validity to neighboring frames.
- For pre-CA (`after_intervention_sec < 0`), the function additionally intersects with `AUTOMATION_ACTIVE == True`.
- For CA short/long, there is no equivalent autonomy-on requirement. The downstream `DC_MASKS` then excludes frames where autonomy is still active.

### DRIVING: Pre-start DC

`dc_pre_start_*` is not an intervention bucket. It is a regular DC driving bucket that oversamples the moment just before the vehicle starts moving from a stop.

The actual generic Gen2 Mach-E buckets are:

```python
Bucket(
    name="dc_pre_start_uk",
    func=partial(get_start_stop_indices, which="start", before_sec=-0.2, after_sec=0.0),
    masks=DC_MASKS,
    country_filter=("GBR",),
    platform_filter=GEN2_MACHE_PLATFORM_FILTER,
)

Bucket(
    name="dc_pre_start_usa",
    func=partial(get_start_stop_indices, which="start", before_sec=-0.2, after_sec=0.0),
    masks=DC_MASKS,
    country_filter=("USA",),
    platform_filter=GEN2_MACHE_PLATFORM_FILTER,
)
```

`add_annotations()` creates the required start/stop columns before bucket generation:

```python
speed_mps = df.inferred__state__odometry__speed_kmh / 3.6

stopped_mask = speed_mps == 0
stop_offset, stop_index = offset_to_event(stopped_mask)
start_offset, start_index = offset_to_event(~stopped_mask)

df["stop_offset"] = stop_offset
df["start_offset"] = start_offset
df["stop_label"] = stop_label
df["start_label"] = start_label
```

Then `get_start_stop_indices(..., which="start")` selects frames by `start_offset`:

```python
offset = df["start_offset"]
mask = (offset >= seconds_to_frames(-0.2)) & (offset <= seconds_to_frames(0.0))
indices = np.nonzero(mask)[0]
```

So this bucket means: "frames from about 0.2 seconds before start-from-stop through the start frame." It does not use the generic `START_BEFORE_WINDOW=-1.0` / `START_AFTER_WINDOW=6.0` helper; these bucket definitions use the tighter `[-0.2s, 0.0s]` window.

After candidate selection, `DC_MASKS` are applied. That makes this a human-driving/DC sample bucket: autonomy-active frames, reverse/neutral, geofence, high speed, long stationary, invalid video, non-contiguous data, bad windows, etc. are removed.

### DRIVING: Pre-CA / CA calculation

For standard driving `pre_ca_*`, `ca_short_*`, and `ca_long_*`, the base anchor is the AV-to-DC transition:

```python
def get_intervention_mask(df):
    auto = df.ground_truth__state__vehicle__automation_active.to_numpy(dtype=int)
    return np.pad((auto[:-1] == 1) & (auto[1:] == 0), (0, 1))
```

In other words, the event is the disengagement frame where `AUTOMATION_ACTIVE` changes from `1` to `0`. The base anchor is not the disengagement type.

The standard driving functions are:

```python
get_pre_intervention_indices = partial(
    get_filtered_intervention_indices,
    before_intervention_sec=-1.2,
    after_intervention_sec=-0.04,
    additional_invalid_int_what=("early_turn",) + PARKING_INVALID_INT_WHATS,
)

get_corrective_action_indices_short = partial(
    get_filtered_intervention_indices,
    before_intervention_sec=0.0,
    after_intervention_sec=1.48,
    additional_invalid_int_what=PARKING_INVALID_INT_WHATS,
)

get_corrective_action_indices_long = partial(
    get_filtered_intervention_indices,
    before_intervention_sec=1.52,
    after_intervention_sec=5.0,
    additional_invalid_int_what=PARKING_INVALID_INT_WHATS,
)
```

The resulting windows are:

| Bucket | Window relative to AV -> DC transition | Extra autonomy condition |
|---|---:|---|
| `pre_ca_*` | `[-1.2s, -0.04s]` | frame must still be AV |
| `ca_short_*` | `[0.0s, +1.48s]` | no AV requirement; `DC_MASKS` later removes autonomy-active frames |
| `ca_long_*` | `[+1.52s, +5.0s]` | no AV requirement; `DC_MASKS` later removes autonomy-active frames |

Internally, `get_filtered_intervention_indices()` first builds a mask for valid intervention anchors, then broadcasts that anchor validity to neighboring frames:

```python
anchor_mask = (
    get_intervention_mask(df)
    & get_intervention_taxonomy_mask(df, taxonomy)
    & get_intervention_label_mask(df, int_type=(), int_reason=(), int_what=(), int_why=())
    & ~get_intervention_invalid_mask(df, additional_invalid_int_what=...)
)

offset, anchor_index = compute_offset_to_intervention(get_intervention_mask(df))

# Use the label/validity of the associated intervention anchor for each window frame.
valid_for_anchor = anchor_mask[anchor_index]
in_window = (offset >= before_frames) & (offset <= after_frames)
indices = np.nonzero(valid_for_anchor & in_window)[0]

if after_frames < 0:
    indices = intersect(indices, frames_where_AUTOMATION_ACTIVE_is_true)
```

The standard driving buckets pass empty label filters (`int_type`, `int_reason`, `int_detail`, `int_what`, `int_why`). In `get_intervention_label_mask`, empty filters mean "accept any intervention label." Therefore, standard driving `pre_ca`, `ca_short`, and `ca_long` are not filtered to one specific disengagement type.

What is filtered:

1. The anchor must be an AV-to-DC transition.
2. The intervention taxonomy version must be valid.
3. Empty label filters accept any label.
4. Invalid interventions are removed.
5. Parking/PUDO intervention `what` labels are removed for the generic driving variants.
6. Bucket-level masks are applied after candidate generation.

Specialized driving buckets can add label filters. For example, highway pre-CA variants can request labels such as `failed_to_follow_lane_position` or `failed_to_slow`. Those are narrower buckets layered on top of the same AV-to-DC intervention anchor logic.

### DRIVING: Parking invalid intervention whats

`PARKING_INVALID_INT_WHATS` is the list of parking/PUDO intervention labels excluded from generic driving intervention buckets:

```python
PARKING_INVALID_INT_WHATS = (
    "failed_to_park",
    "failed_to_unpark",
    "parking",
    "failed_to_pudo",
    "failed_to_unpudo",
)
```

For standard driving `pre_ca`, `ca_short`, and `ca_long`, these are passed into `additional_invalid_int_what`, so they are removed by `get_intervention_invalid_mask()`.

That means:

- Generic driving CA/pre-CA buckets are "all valid non-parking interventions around AV disengagement."
- They are not "all intervention types including parking."
- Parking-specific variants intentionally do not apply `PARKING_INVALID_INT_WHATS`, so parking/PUDO buckets can retain `failed_to_park`, `parking`, `failed_to_pudo`, etc.

### DRIVING: Masks

The core mask groups are:

```python
_DEFAULT_MASKS = (
    "known_bad_runs_and_timestamps",
    "quarantined_runs_and_timestamps",
    "geofence",
    "reverse_or_neutral",
    "high_speed",
    "long_stationary",
    "start_end_frames",
    "none_contiguous",
    "invalid_video_file_name",
    "constant_speed",
)

AV_MASKS = ("out_of_scope_interventions",) + _DEFAULT_MASKS

DC_MASKS = (
    "autonomous",
    "stopped_segment",
    "diversion_and_lens_obscured_interventions",
) + _DEFAULT_MASKS
```

Read this as:

- AV/pre-CA buckets remove out-of-scope intervention windows and the shared data-quality masks.
- DC/CA buckets remove autonomy-active frames and the shared data-quality masks.
- DC/CA buckets also remove long boring stopped segments and diversion/lens-obscured interventions.
- Neither `AV_MASKS` nor `DC_MASKS` enforces mutual exclusivity between bucket families.

### DRIVING: Training weights

The generic materializer creates partitions. Training decides what to consume and how much to sample from each partition.

The default driving data bucket configs in `/workspace/materialization/wayve/ai/drive/bc/configs/defaults/data/buckets.py` contain the training-time mix for materialized driving partitions. The families match the materialized names:

- Broad DC by country/platform.
- Targeted DC buckets for night, indicator, highway, speed-change, high curvature, high lateral acceleration, high jerk, and speed-limit behavior.
- CA short/long by country.
- Pre-CA by country and highway-specific intervention labels.
- DILC and diversion-related buckets where enabled by the selected config.

Conceptually:

```yaml
train_data:
  - dataset_bucket: dc_mache_usa
    weight: <dc_weight>
  - dataset_bucket: ca_short_usa
    weight: <ca_short_weight>
  - dataset_bucket: ca_long_usa
    weight: <ca_long_weight>
  - dataset_bucket: pre_ca_usa
    weight: <pre_ca_weight>
```

Those weights are consumption weights. They do not change how the materializer assigns a timestamp to bucket partitions.

### COMPARISON: Reimplementation guidance

For a parking/PUDO/unPUDO materialized framework, copy these principles:

1. Treat event detection as anchor creation.
2. Treat bucket generation as deterministic window expansion from anchors plus masks.
3. Write independent partitions by bucket name.
4. Keep training consumption weights in config, separate from materialization.
5. Decide explicitly whether bucket families may overlap.

For our unPUDO work, the overlap decision matters:

- General `ca_short_*` / `ca_long_*` should stay broad and unfiltered by moving/safety criteria.
- `unpudo_unsafe_ca_*` should be a separate CA subset where speed is already non-zero at CA.
- `unpudo_moving_ca_*` should be a separate CA subset where the vehicle is moving at CA or starts moving within the configured lookahead.
- If broad DC should not contain CA, subtract CA windows explicitly. Generic driving does not do that by default.

## ZAK: Core sampler algorithm

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

## ZAK: Shared validity masks

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

## ZAK: Active `mcv_new_phase2` bucket weights

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

## ZAK: Bucket generation recipes

### ZAK: DC not-stopped / stopped

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

Bucket-local augmentation/windowing:
- Not-stopped DC gets a 2s before/after dilation around moving frames.
- Stopped DC has no dilation.
- Both remove frames within 5s of automation transitions.

### ZAK: Large-error slow

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

### ZAK: Start

Bucket:
- `START`

Function: `get_start_stop_indices`.

```python
mask = annotations["start_offset"] >= -0.2s
mask &= annotations["start_offset"] <= 0s
mask &= ALL_VALID_MASKS with autonomous, geofence, reverse, uturn, high_speed, bad stop/park, not_ends, video, dropped frames
```

This is a generic start bucket, not specifically parking/unparking.

### ZAK: Start near gear change

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

In words:

1. Find any gear transition: `gear[t-1] != gear[t]`.
2. Optionally restrict that gear transition to a parking location group.
3. Expand those gear-transition frames by `+/-30s`.
4. Find movement-start frames: `speed[t-1] == 0` and `speed[t] != 0`.
5. Keep only movement-start frames that fall inside the `+/-30s` gear-change window.
6. Expand the selected movement-start frame by `before=0.9s`, `after=0.0s`.
7. Apply `ALL_VALID_MASKS2`.

Location coding:
- LDN office: `[0]`
- LDN other: `[-1]`
- USA office: `[1, 2]`
- USA other: `[-1]`
- MSC other: `[-1]`

Bucket-local augmentation/windowing:
- Detects a movement-start frame.
- Keeps the 0.9s before that movement-start frame.
- Requires the movement-start frame to be within 30s of a gear transition.

Gear is not raw if the normal config path is used. On `zmurez/pudo`, `DATASET.WAYVE.CLEAN_UP_SCALARS=True` by default, and the dataset cleans gear before these sampler buckets run:

```python
self.gear = clean_up_gear(self.gear, -1, self.cumdist, None, 0.05)
self.gear = clean_up_gear(self.gear, 0, self.cumdist, self.frame_rate, None)
self.gear = clean_up_gear_stopped(self.gear, self.speed, self.frame_rate)
```

That cleanup is not a generic rolling smoother. It is targeted gear cleanup:

- Short reverse segments under `0.05m` are replaced with the adjacent gear.
- Short park segments under about `1s` are replaced with the adjacent gear.
- If the car stops and then shifts to park, `clean_up_gear_stopped()` pulls park earlier over part of the stopped interval.

So `START_GEAR_CHANGE_*` uses cleaned gear, assuming `CLEAN_UP_SCALARS=True`.

### ZAK: Indicator and indicator-change

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

### ZAK: Gear change

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
- No additional smoothing inside `get_gear_change_indices`, but the sampler uses `dataset.gear`, and `dataset.gear` is cleaned first when `DATASET.WAYVE.CLEAN_UP_SCALARS=True`.
- In the normal `zmurez/pudo` config path, this means `GEAR_CHANGE_*` is based on cleaned gear, not raw gear.
- No park-only restriction; any gear value change is included.

### ZAK: Interventions / corrective actions

Buckets:
- `INTERVENTIONS_GEN2_{LDN,USA,JPN,DEU,MSC,NAR,ALPHA3}0`
- `INTERVENTIONS_GEN2_{LDN,USA,JPN,DEU,MSC,NAR,ALPHA3}1`
- torque and torque-curvature variants
- acceleration slow/fast variants are defined but weight `0.0` in phase2

Function: `get_intervention_indices`.

These are Zak's general driving intervention / CA buckets, not the parking/PUDO-specific buckets.

The bucket definitions pass empty label and correction filters:

```python
get_intervention_indices(
    labels=[],
    corrections=[],
    ...
)
```

That means they accept any annotated valid intervention label, then apply the generic invalid-label rules and masks. They are not filtered to `failed_to_park`, `failed_to_pudo`, `failed_to_unpudo`, etc. Parking and PUDO are handled by separate sampler functions later in this page:

- `PARKING_*` -> `get_parking_indices(..., stop_type="park", ...)`
- `PUDO_*` -> `get_parking_indices(..., stop_type="pudo", ...)`
- `UNPARKING_*` -> `get_unparking_indices(...)`

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

### ZAK: Interventions near gear change

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

### ZAK: Parking

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

Bucket-local augmentation/windowing:
- No explicit time dilation after the final mask.
- The long-stop removal uses a motion dilation around `speed != 0`.

### ZAK: PUDO

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

### ZAK: Unparking

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

Bucket-local augmentation/windowing:
- Anchor is first future non-zero-speed frame after gear leaves park.
- Window is `0s..+10s`.
- No pre-departure frames are included in these buckets.

## ZAK: Global training augmentations and label transformations

The sampler does not define image/route/state augmentation per bucket. Once a frame index is sampled, the dataset applies the same training-time data transforms regardless of which bucket produced the sample.

For `mcv_new_phase2` inherited from `mcv_new_base0.yml`:

### ZAK: Image augmentation

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

### ZAK: Route / navigation augmentation

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

### ZAK: Indicator state augmentation

Configured but disabled:

```python
INDICATOR_STATE.CHANGE_AUGMENTATION_PROB = 0.0
INDICATOR_STATE.WRONG_AUGMENTATION_PROB = 0.0
```

No active indicator-state corruption is applied in this config.

### ZAK: Gear state augmentation

`GEAR_STATE.ENABLED = True`, but there is no bucket-specific gear-state augmentation in this path. Gear state is a model input/loss target. Gear-change upsampling is done by the sampler buckets, not by mutating gear labels.

### ZAK: Ego-pose interpolation / pre-corrective action pseudo-labeling

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

## ZAK: Per-bucket "augmentation" summary

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

## ZAK: OTF config comparison

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

## COMPARISON: Reimplementation checklist

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
