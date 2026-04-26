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
