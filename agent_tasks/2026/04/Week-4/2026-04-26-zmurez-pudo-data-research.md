# zmurez/pudo Data Research

I dug through `origin/zmurez/pudo` / PR `#91997`.

**Main Finding**
Zak’s PUDO behavior is not mainly from the SI OTF datamodule. His actual parking/PUDO path is the legacy `wayve/ai/experimental` `Wayve`/Ipace loader with heuristic samplers. The OTF adapter in that branch defaults parking fields to “not parking”, so it is not where the parking behavior is learned.

**Data Loading**
Relevant config stack:
- `origin/zmurez/pudo:wayve/ai/experimental/configs/mcv_new_base0.yml`
- `origin/zmurez/pudo:wayve/ai/experimental/configs/mcv_new_phase2.yml`
- `origin/zmurez/pudo:wayve/ai/experimental/configs/mcv_new_phase2x.yml`
- `origin/zmurez/pudo:wayve/ai/experimental/configs/mcv_new_phase2_otf.yml`

For parking/PUDO, the important one is the `Wayve` dataset path:
- `DATASET.WAYVE.TRAIN: wayve/ai/experimental/data/splits/train_gen2.txt`
- `ODOMETRY_SOURCE: Speed-IMU`
- `PARKING.ENABLED: True`
- `PARKING.PUDO_ENABLED: True`
- `GEAR.ENABLED: True`
- `GEAR.PER_WAYPOINT: True`
- `INDICATOR.PER_WAYPOINT: True`

The OTF path has:
- `DATASET.NAME: OTF`
- but `otf_dataset.py` sets parking defaults:
  - `parking_request = False`
  - `parking = False`
  - `stopping_type = 0`
  - only loads gear if `DataKeys.VEHICLE_GEAR_DIRECTION` exists

So Zak’s parking-specific learning is from the experimental Ipace loader, not OTF.

**Sampler Weights**
In `mcv_new_phase2.yml`, relevant parking/PUDO weights are:

Parking:
- `PARKING_LDN_OFFICE: 0.0025`
- `PARKING_LDN_NOSE/TAIL/SIDE/PARALLEL: 0.005` each
- `PARKING_USA_OFFICE: 0.0025`
- `PARKING_USA_NOSE/TAIL/SIDE/PARALLEL: 0.005` each
- `PARKING_ALPHA3_OFFICE: 0.0025`
- `PARKING_ALPHA3_OTHER: 0.005`
- `PARKING_MSC_OFFICE: 0.0025`
- `PARKING_MSC_OTHER: 0.005`
- `PARKING_MRM: 0.0025`
- `PARKING_MRM_TRACK: 0.0005`

PUDO:
- `PUDO_LDN_NEAR: 0.02`
- `PUDO_LDN_FAR: 0.02`
- `PUDO_USA_NEAR: 0.02`
- `PUDO_USA_FAR: 0.02`

Unparking:
- `UNPARKING_LDN_OTHER: 0.01`
- `UNPARKING_USA_OTHER: 0.01`
- `UNPARKING_ALPHA3_OTHER: 0.01`
- `UNPARKING_MSC_OTHER: 0.01`
- `UNPARKING_LDN_OFFICE: 0.005`
- `UNPARKING_USA_OFFICE: 0.005`
- `UNPARKING_ALPHA3_OFFICE: 0.0025`
- `UNPARKING_MSC_OFFICE: 0.0025`

He also heavily samples gear-related events:
- `START_GEAR_CHANGE_*`
- `GEAR_CHANGE_GEN2_*`
- `INTERVENTIONS_GEAR_CHANGE0: 0.05`
- `INTERVENTIONS_GEAR_CHANGE1: 0.05`

This looks important for UNPUDO/unpark because it targets exactly the shift/start decision boundary.

**Parking/PUDO Label Logic**
Core code is in `single_run.py` and `sampler.py`.

Zak derives parking/PUDO labels from:
- cleaned gear transitions into park
- hazards around park moments
- predicted park type / park quality / PUDO pin validity labels
- office geofences

Key behaviors:
- Cleans noisy gear where short park segments appear during D/R shifts.
- Pulls park gear earlier after the vehicle stops, so “shift to park” supervision is not delayed.
- Classifies stop type:
  - `stopping_type == 1`: park
  - `stopping_type == 2`: PUDO, based on hazard near park moment outside office geofence
- Builds `parking` masks around park events using distance before park, extended by PUDO pin-valid distances.
- Splits PUDO samplers into `near`/`far` using predicted pin validity distances.
- Unparking sampler finds gear-out-of-park and then first motion, with a 10s after-window.

**Parking-Specific Augmentations**
Most relevant augmentations:

Route end jitter:
- Config: `ROUTE.AUGMENTATION_END_JITTER: rand`
- Config: `ROUTE.AUGMENTATION_END_JITTER_BETA_SCALE: 1.0`
- Implementation samples route endpoint between per-park before/after valid PUDO distances.
- This means the model sees route endpoint at slightly different places around the stop/park point.

Route blackout:
- `ROUTE.AUGMENTATION_DROPOUT: 0.25`
- `ROUTE.AUGMENTATION_DROPOUT_BLACK: 0.9`
- If `parking_request` is active, the route map is zeroed.
- This matches the inference idea of “parking mode = no route map”.

Parking request:
- `ROUTE.AUGMENTATION_PARKING_REQUEST_PROB: 0.025` in `mcv_new_base0.yml`
- During parking frames, sometimes emits `parking_request=True`.
- If true, route is blacked out.

Parking position noise:
- For non-PUDO parking, 5% chance to perturb `parking_position_ui`.
- PUDO ignores noisy parking position conditioning.

Parking direction:
- For nose/tail parking, sometimes emits head-first/tail-first conditioning.
- Otherwise no preference.

Gear and indicator:
- Per-waypoint gear prediction is enabled.
- Gear future changes get high loss weight: `GEAR.LOSS_WEIGHT_CHANGE: 10.0`.
- Indicator future changes get weight: `INDICATOR.LOSS_WEIGHT_CHANGE: 5.0`.

**What Looks Portable To Our SI Parking Work**
The strongest candidates to port or mimic are:

1. PUDO near/far split  
   He does not treat all PUDO uniformly. He separates “near” vs “far” based on pin validity before/after distances.

2. Start/gear-change sampling  
   His UNPUDO/unpark signal is not just parking windows. He explicitly samples `START_GEAR_CHANGE_*`, `GEAR_CHANGE_*`, and `INTERVENTIONS_GEAR_CHANGE*`.

3. Gear cleanup before deriving labels  
   He aggressively cleans gear noise before building park/unpark masks. This may be as important as the bucket weights.

4. Route-end jitter with PUDO pin validity  
   His route endpoint augmentation is tied to PUDO valid before/after distances, not a fixed random jitter.

5. Route blackout under parking request  
   This is already aligned with what we’ve been doing, but Zak’s version uses it as a training augmentation on the actual route map.

6. Per-waypoint gear loss with strong change weighting  
   This directly targets the “model stays in park/drive too long” failure mode.

**Bottom Line**
Zak’s good UNPUDO/PUDO performance seems less about one magic bucket and more about a coupled setup:
- targeted PUDO/unparking/gear-change samplers,
- derived labels from cleaned gear + hazards + pin-valid classifiers,
- route-end jitter/blackout,
- strong gear-change supervision.

For our current branch, I’d prioritize porting the sampler concepts into `parking_config.py` / `datamodules/parking.py`: especially PUDO near/far, start-gear-change, and gear cleanup before parking-mode derivation.

---

## Follow-up: Blackout, Gear Sampling, Losses, and Data-Mix Details

This follow-up answers the detailed questions from the second pass over `origin/zmurez/pudo`, especially around map blackout, start/gear-change sampling, gear cleanup, per-waypoint gear loss, stopping mode, and how parking frames inside driving data are handled.

### 1. Is Map Blackout Always Used When Parking?

No. Zak is not always blacking out the map whenever a sample is parking.

Training behavior:
- Generic route dropout can black out routes for any sample.
- The relevant config values are:
  - `ROUTE.AUGMENTATION_DROPOUT = 0.25`
  - `ROUTE.AUGMENTATION_DROPOUT_BLACK = 0.9`
- That means roughly `22.5%` of all training samples can get black route dropout, independent of parking.
- Parking-specific blackout happens only when parking-request augmentation fires.
- The parking request probability in the checked config is:
  - `ROUTE.AUGMENTATION_PARKING_REQUEST_PROB = 0.025`
- If the sample is parking and this random event fires, he sets `parking_request=True` and zeroes the route map.

Inference behavior:
- In `wayve/ai/experimental/compile.py`, map blackout is tied to explicit parking request:
  - park-mode / auto-park button: `driving_controls[0, 0] == 1`
  - or selected finite parking pose
- It does not explicitly black out the route only because end-of-route is detected.
- In `wayve/ai/experimental/compile_with_baseline.py`, end-of-route can switch the interleave wrapper into the parking model, but the blackout itself still happens inside the experimental wrapper only from button/pose request.

So the practical interpretation is:
- parking maneuver: not always blacked out
- parked: not inherently blacked out
- unparking: not inherently blacked out
- end-of-route: used for model switching, not direct blackout
- park-mode button / selected parking pose: direct blackout

### 2. Start / Gear-Change Sampling

There are two related sampling mechanisms.

Gear-change sampling:
- Finds indices where `gear[t] != gear[t + 1]`.
- Optionally filters by country / platform constraints.
- Dilates the change-point mask using configured before/after windows.
- Defaults in the branch are:
  - `GEAR_CHANGE_BEFORE = 0.0s`
  - `GEAR_CHANGE_AFTER = 0.5s`
- Result: samples are drawn from the gear-change moment through roughly `0.5s` after the change.

Start-gear-change sampling:
- First finds gear-change events.
- Expands around gear changes by `gear_window = 30s` on both sides.
- Finds starts from standstill:
  - previous speed is zero
  - next speed is non-zero
- Keeps only starts that are within the gear-change-expanded region.
- Then samples a window around the start moment using:
  - `before = 0.9s`
  - `after = 0.0s`

This is targeted at the decision point before motion starts. For UNPUDO/unpark, this is likely important because the model must decide to shift gear and begin moving, not merely imitate already-moving frames.

### 3. Gear Cleanup

Zak cleans gear before deriving parking labels and before supervising gear prediction. The cleanup has several parts.

Short reverse cleanup:
- Removes tiny reverse segments.
- Reverse gear is `-1`.
- Segments shorter than about `0.05m` are considered noise and replaced by adjacent gear.

Short park/neutral cleanup:
- Park/neutral is represented as `0` in this path.
- Short `0` gear segments shorter than about `1s` are removed.
- This handles noisy telemetry where a D/R transition may briefly show P/N.

Parked annotation override:
- If `pred_park_intention` says the car is parked, Zak forcibly marks a small local region as park gear.
- This gives cleaner supervision around known parked moments.

Stopped-to-park cleanup:
- Finds transitions from non-park into park.
- Looks backward to find the last moving frame before the transition.
- Finds the first stationary frame after that movement.
- From `stop_index + 0.5s` until the actual park transition, rewrites gear as park.

Why this matters:
- The raw signal can say the car stopped first and only later selected park.
- Without cleanup, the model learns delayed park selection.
- With cleanup, once the car is stopped and the final outcome is park, supervision says it should shift to park soon after stopping.

This is probably one of the more important details for avoiding delayed or missing gear decisions.

### 4. Per-Waypoint Gear Loss

Zak does not train gear only as a single current-frame or next-frame classification. He trains gear per future waypoint/timestep.

Target construction:
- Uses future gear sequence after the present frame:
  - `gear[present + 1 : present + 1 + n_waypoints]`
- Original gear values are `-1, 0, 1`.
- They are shifted into class IDs `0, 1, 2` for cross entropy.

Loss behavior:
- Cross entropy is computed for each future waypoint.
- Gear-change targets are weighted more strongly than no-change targets.
- If the future target equals the current gear, weight is `1`.
- If the future target differs from the current gear, weight starts high and decays over the future horizon.
- Relevant config values:
  - `GEAR.LOSS_WEIGHT_CHANGE = 10.0`
  - `GEAR.LOSS_CHANGE_DECAY = 0.5`
  - `GEAR.PER_WAYPOINT = True`

In the WTA / multi-head loss path:
- The gear loss contributes to head scoring and not just to a side output.
- A head that predicts the geometric path but misses the gear sequence is penalized.

Interpretation:
- This directly trains when to shift gear over the future horizon.
- It targets the failure mode where the model stays in park/drive/reverse too long.

### 5. Is `zmurez/pudo` Actively Worked On?

Yes, it appears active.

Evidence checked:
- `origin/zmurez/pudo` has commits from `2026-04-25`.
- PR `#91997` is open.
- PR update timestamp was `2026-04-26T06:32:20Z` at the time of inspection.

Caveat:
- This proves the branch is active.
- It does not prove that every reported good model was trained from the current branch tip.
- To be certain, we need the model nickname or session ID and should inspect the model catalogue checkpoint metadata to get the exact training commit.

### 6. Data Weights

From `mcv_new_phase2.yml`, the active heuristic sampler weights sum to `1.0`.

| Group | Bucket | Weight |
|---|---:|---:|
| driving / other | all non-parking, non-PUDO, non-unparking, non-gear buckets | `0.6185` |
| parking | `PARKING_LDN_OFFICE` | `0.0025` |
| parking | `PARKING_LDN_NOSE` | `0.0050` |
| parking | `PARKING_LDN_TAIL` | `0.0050` |
| parking | `PARKING_LDN_SIDE` | `0.0050` |
| parking | `PARKING_LDN_PARALLEL` | `0.0050` |
| parking | `PARKING_USA_OFFICE` | `0.0025` |
| parking | `PARKING_USA_NOSE` | `0.0050` |
| parking | `PARKING_USA_TAIL` | `0.0050` |
| parking | `PARKING_USA_SIDE` | `0.0050` |
| parking | `PARKING_USA_PARALLEL` | `0.0050` |
| parking | `PARKING_ALPHA3_OFFICE` | `0.0025` |
| parking | `PARKING_ALPHA3_OTHER` | `0.0050` |
| parking | `PARKING_MSC_OFFICE` | `0.0025` |
| parking | `PARKING_MSC_OTHER` | `0.0050` |
| parking | `PARKING_MRM` | `0.0025` |
| parking | `PARKING_MRM_TRACK` | `0.0005` |
| PUDO | `PUDO_LDN_NEAR` | `0.0200` |
| PUDO | `PUDO_LDN_FAR` | `0.0200` |
| PUDO | `PUDO_USA_NEAR` | `0.0200` |
| PUDO | `PUDO_USA_FAR` | `0.0200` |
| unparking | `UNPARKING_LDN_OTHER` | `0.0100` |
| unparking | `UNPARKING_USA_OTHER` | `0.0100` |
| unparking | `UNPARKING_ALPHA3_OTHER` | `0.0100` |
| unparking | `UNPARKING_MSC_OTHER` | `0.0100` |
| unparking | `UNPARKING_LDN_OFFICE` | `0.0050` |
| unparking | `UNPARKING_USA_OFFICE` | `0.0050` |
| unparking | `UNPARKING_ALPHA3_OFFICE` | `0.0025` |
| unparking | `UNPARKING_MSC_OFFICE` | `0.0025` |
| gear decision | start/gear-change/intervention gear buckets | `0.1835` |

Group sums:

| Group | Sum |
|---|---:|
| driving / other | `0.6185` |
| parking | `0.0630` |
| PUDO | `0.0800` |
| unparking | `0.0550` |
| gear decision | `0.1835` |
| parking + PUDO + unparking | `0.1980` |
| parking + PUDO + unparking + gear decision | `0.3815` |

### 7. Stopping Mode

Yes, Zak uses stopping mode.

Training behavior:
- For parking samples:
  - `stopping_type = 0` means park.
  - `stopping_type = 1` means PUDO.
- For non-parking samples:
  - he randomizes stopping type between `0` and `1`.
  - the code comment says the default is random so the model ignores it outside parking context.

Inference behavior:
- `stopping_type` comes from `driving_controls[:, 2]`.
- The inference comment says:
  - `0 = park`
  - `1 = pudo`

Interpretation:
- Stopping mode is meaningful only with parking context.
- Outside parking, it is intentionally uninformative during training.

### 8. Parking Request Augmentation

Yes, this is the augmentation that simulates enabling the parking button / explicit parking request.

When the augmentation fires:
- `parking_request=True`
- the route map is blacked out
- the parking input adapter sees the request signal

Important distinction:
- `parking=True` means the current frame is inside a parking/PUDO/unparking-labeled region.
- `parking_request=True` means the model receives an explicit request-style signal.
- Most parking samples do not have `parking_request=True`, because the configured probability is only `2.5%`.

This teaches both modes:
- implicit route/end/parking-context behavior
- explicit button/request behavior

### 9. Parking / Unparking Frames Inside Driving Data

Zak does not appear to remove all parking or unparking frames from driving buckets.

Instead, his dataset path computes parking-aware fields at sample load time for every sample, regardless of which sampler picked it:
- cleaned gear is always used
- `data["parking"]` is computed for the current frame
- parking position and stopping type are available if the frame lands inside a parking region
- parking request augmentation can apply if the frame is parking

So if a nominal driving sampler lands inside a parking or unparking window, the sample is not completely silent noise. It still gets parking-aware labels/inputs.

He does use masks such as `bad_park` and `bad_stop`, but I did not see a blanket exclusion that removes every clean parking/unparking frame from driving buckets.

Implication for our SI model:
- If our driving buckets contain parking/unparking samples but the SI datamodule does not set parking context, cleaned gear, stopping mode, route shortening/blackout, and parking request consistently, those frames can become label noise.
- Zak's setup mitigates this by making the sample parking-aware at load time, even when the sampler bucket itself is not explicitly a parking bucket.

### Updated Interpretation

Zak's UNPUDO/PUDO behavior appears to come from a coupled training setup, not one isolated trick:
- route blackout is sparse and request-driven, not always-on
- end-of-route switches parking behavior but does not itself force blackout
- start and gear-change buckets focus supervision around decision points
- cleaned gear labels remove short noisy transitions and reduce delayed park supervision
- per-waypoint gear loss trains the full future gear sequence and upweights gear changes
- stopping mode distinguishes park vs PUDO, but is randomized outside parking
- parking-aware labels are computed for all samples, so parking frames inside driving data are less noisy

For our branch, the biggest risk is not only missing PUDO buckets. It is mixing parking/unparking frames through driving data without the same parking-aware sample construction and gear cleanup.
