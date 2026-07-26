# Parking Model Migration — Implementation Plan (SI → drive/bc + data factory)

**Scope (agreed):** BC parking model only (no diffusion output adaptor). Full augmentation parity
with SI (incl. the diffusion/off-by-default ones). New `HeadKeys.PARKING` + dedicated
`ParkingArbiter`.

**Two recipes (agreed):** unlike MRM (which folds into `baseline_bc` + a head only), parking gets
**two** full recipes:
1. **`parking_bc`** — parking model trained from a **WFM checkpoint** (trunk trainable; mirrors
   `baseline_bc.py`). Phase 4.
2. **`parking_head`** — parking model trained from a **mid-training checkpoint** (frozen trunk head
   recipe; mirrors `driving_head.py` via `MidTrainingV1SeedCfg` + `MID_TRAINING_V1_CHECKPOINT`).
   Phase 5. This resolves decision #2 → mid-training seed.

## Strategy / thesis
The parking model = the driving/MRM model + gear input, park-mode input, stopping-mode input, and a
gear-policy output. **Almost all of those model internals already exist in `drive` and are on (or
available) in the baseline BC model:**
- gear input adaptor (`GearDirectionSTAdaptor`), park-mode adaptor (`ParkingModeSTAdaptor`),
  stopping-mode adaptor (`StoppingModeSTAdaptor`) — all declared in the WFM backbone
  ([wfm.py:154](wayve/ai/drive/common/configs/backbone/wfm.py)); baseline disables only `parking_mode`.
- gear-policy output (`GearDirectionOutputHead`, `enable_gear_direction=True`) — on by default.
- gear-direction loss (`w_gear_direction=1.0`) — on by default
  ([losses.py:15](wayve/ai/drive/bc/configs/components/losses.py)).
- factory tensors `vehicle_gear_direction` (input) + `policy_gear_direction` (target) — added by
  default; `parking_mode`/`stopping_mode` tensors + `ParkingDataLoader` exist.

**So the migration is mostly: (1) a parking model-config that turns the parking inputs on; (2) the
real work — porting the parking DATA augmentations into the factory; (3) two recipes; (4) a new
PARKING head key + arbiter; (5) tests.** No new model architecture is required.

---

## Phase 0 — Prerequisites / decisions (do first)
- **P0.1 Data materialisation (dependency, likely separate workstream).** The factory trains from a
  *materialised* bucket root (`materialised_buckets(..., root=<abfss>)`). The SI PUDO/unpudo/GC
  parking buckets must be sampled + materialised through the drive sampling pipeline to a new
  `bc/parking/...` root. Config + unit tests can land without it; real training needs it.
- **P0.2 ADRs.** Per repo `AGENTS.md`, architectural changes need an ADR + approval before code.
  Recommend two: (a) *new factory proto augmentations/tensors for parking*; (b) *new `PARKING` head
  key + `ParkingArbiter`*. Create with `./tools/decisions new "<title>"`.
- **P0.3 Schema-version reconciliation.** `config/schema/autopublish.yaml` = **7.1.1** but
  `CHANGELOG.md` top = **7.2.0**. Reconcile this gap as part of the proto bump.
- **Decisions to confirm** (see end): radar early-vs-late fusion; parking-head seed
  (MidTrainingV1 vs BaselineRLFull); whether to emit policy-path/goal-pose tensors the BC model
  won't consume; extend `ParkingDataLoader` vs new augmentor for parked/unparking.

---

## Phase 1 — Data factory: input tensors

### Data model (RESOLVED) — split the overloaded `parking_mode`
SI overloads `parking_mode`: `ParkingModeResult` uses parking/parked/unparking as the **stage** of the
anchor (mutually exclusive, [parking.py:182-184](wayve/ai/si/datamodules/parking.py)), but
`add_parking_mode` then writes the model-input key `data[PARKING_MODE] = result.parking_mode`
([parking.py:1365](wayve/ai/si/datamodules/parking.py)). The factory loader has the same overload
([tensor_loaders/parking.py:108](wayve/ai/lib/data/factory/tensors/tensor_loaders/parking.py)). Split them:
- **`parking_stage` ∈ {driving, parking, parked, unparking}** — NEW categorical tensor; the detection
  state. Drives ALL augmentations (standstill-gear, clamp, strip, route-shortening, goal-pose).
  Formalizes SI's 3 bools + `_parking_stage_label_from_result` ([parking.py:1273](wayve/ai/si/datamodules/parking.py)).
- **`parking_mode`** — the model INPUT only (auto-park intent = INITIATE_AUTO_PARK / `DrivingControlKey.nING`;
  read by `ParkingModeSTAdaptor`). At train time **derived** as `parking_stage ∈ {parking, parked}`
  (documented as provisional — may change). Keep the name `parking_mode` for now (rename to
  `initiate_auto_park` is a deferred, separate refactor: proto MAJOR bump + checkpoint-key migration).
- **`unparking_mode` is DROPPED** — route-shortening reads `parking_stage == unparking` directly.

Turn the parking inputs on in the BC factory.

| File | Change |
|---|---|
| [tensor_loaders/parking.py](wayve/ai/lib/data/factory/tensors/tensor_loaders/parking.py) | Extend `ParkingDataLoader` to (a) fold gear-label cleanup in **before** detection (it overwrites `vehicle_gear_direction`/`policy_gear_direction`, keeps an `original/` snapshot; see Phase 2 #1), (b) emit **`parking_stage`** (NEW), (c) emit `parking_mode` derived from `parking_stage ∈ {parking, parked}`, (d) keep `stopping_mode`. Deterministic detection here; the stochastic parked→parking/unparking flip is a small augmentor (Phase 2 #5). |
| [bc/data/factory/schema.py](wayve/ai/drive/bc/data/factory/schema.py) | `create_base_config`: today `parking_mode` is added only under `include_mrm` (`_add_mrm_pipeline_extensions`) and `stopping_mode` is never added. Add parking-specific gating on new flags `enable_parking_mode`/`enable_stopping_mode` so the parking model gets both independent of `include_mrm`. |
| [bc/data/factory/spec.py](wayve/ai/drive/bc/data/factory/spec.py) | Add `enable_parking_mode`, `enable_stopping_mode` + parking-augmentation fields to `PipelineSpec`; thread through `resolve_pipeline_spec` + `resolve_default_pipeline_spec`. |
| [bc/data/factory/inputs.py](wayve/ai/drive/bc/data/factory/inputs.py) | Add a `ParkingSettings` dataclass grouping parking knobs (buckets, probs, flags), mirroring `MrmGearParkingSettings`. |
| [bc/data/factory/constants.py](wayve/ai/drive/bc/data/factory/constants.py) | Parking augmentation default constants (mirror SI `ParkingDataConfig` defaults). |
| [datamodules/shared.py](wayve/ai/drive/bc/configs/components/data/datamodules/shared.py) | Add `${...}` interpolations for the new parking knobs to `PIPELINE_SPEC_KW`. |

`stopping_mode` compute already exists in `ParkingDataLoader._compute_stopping_mode` — enabling it is
just the flag above.

---

## Phase 2 — Data factory: augmentation ports (the bulk of the work)
Each augmentation follows the factory pattern: **proto oneof arm (MINOR bump) + augmentor/tensor
loader + runtime `IterDataPipe`**, force-imported in
[tensors/__init__.py](wayve/ai/lib/data/factory/tensors/__init__.py) (import + `__all__`).
Templates: [gear_parking.py loader](wayve/ai/lib/data/factory/tensors/augmentor_loaders/gear_parking.py)
+ [gear_parking.py pipe](wayve/ai/lib/data/pipes/augmentations/gear_parking.py) (in-place rewrite);
[set_speed](wayve/ai/lib/data/factory/tensors/augmentor_loaders/set_speed.py) (emits new tensors).
Ordering is by dependency: augmentors that read `parking_stage` declare it in `read_only_fields`, so
they run **after** `ParkingDataLoader` automatically.

Proto tags to assign (avoid historical `AugmentationRequest` tag 4): `AugmentationRequest` →
**10** standstill_gear, **11** clamp_policy_at_neutral, **12** strip_leading_standstill,
**13** parking_stage_flip. `TensorRequest` → **118** `parking_stage` (+ 119+ for policy-path/goal
tensors); gaps 69–72 also free. MINOR bump → no migration needed; update `autopublish.yaml`,
`CHANGELOG.md`, `config/tests/test_schema*.py`; regenerate via `make_protos.sh`.

### 2A — In-place policy/gear rewrites (template: gear_parking)
| # | SI source | New proto arm | Loader / pipe | `augmented_fields` |
|---|---|---|---|---|
| 1 | gear label cleanup `clean_parking_gear_labels` ([parking.py:594](wayve/ai/si/datamodules/parking.py)) | — (NOT a separate arm) | **RESOLVED: fold into `ParkingDataLoader`** (Phase 1) — cleanup must precede detection (detection reads cleaned gear), and factory loaders run before augmentors, so it can't be a downstream peer. Overwrites `vehicle_gear_direction`/`policy_gear_direction`, keeps `original/` snapshot. | vehicle_gear_direction, policy_gear_direction |
| 2 | advanced standstill gear aug `augment_standstill_gear` ([parking.py:1161](wayve/ai/si/datamodules/parking.py)) | `standstill_gear` (tag 10) — fields: prob, use_main_augmentation | new loader + pipe | augments `vehicle_gear_direction`; `read_only_fields=[policy_gear_direction, parking_stage]` |
| 3 | clamp at first neutral `clamp_policy_at_first_neutral` ([parking.py:845](wayve/ai/si/datamodules/parking.py)) | `clamp_policy_at_neutral` (tag 11) | new loader + pipe; `read_only_fields=[parking_stage]` | policy_pose, policy_waypoints, policy_curvature, policy_speed, policy_gear_direction |
| 4 | strip leading standstill `strip_leading_standstill` ([parking.py:697](wayve/ai/si/datamodules/parking.py)) | `strip_leading_standstill` (tag 12) | new loader + pipe (may DROP sample → filter stage); `read_only_fields=[parking_stage]` | policy_* (pose/waypoints/curvature/speed/gear). SI already has a TODO to make this a standalone augmentor. |

### 2B — New-tensor producers (template: parking loader / set_speed)
| # | SI source | Approach | Emits |
|---|---|---|---|
| 5 | parked→(un)parking flip `_augment_parked_mode` ([parking.py:629](wayve/ai/si/datamodules/parking.py)) | `parking_stage_flip` (tag 13) — stochastic: `read_only_fields=[]`, `augmented_fields=[parking_stage]`; with `parked_unparking_prob` rewrites `parked` → `parking`\|`unparking`. Kept OUT of the (deterministic) detection loader for reproducibility. | rewrites `parking_stage` (no `unparking_mode`) |
| 6 | policy path / goal pose `_sample_policy_path_from_poses` ([parking.py:402](wayve/ai/si/datamodules/parking.py)) | New tensor loader(s) + `TensorRequest` arm(s) (tags 118+); `read_only_fields=[parking_stage]`. ⚠️ The **BC** model won't consume these (they're diffusion inputs); we emit them for parity/future diffusion — see decision #3. | PARKING_POSE, PARKING_GOAL_DISTANCE, ORIGINAL_PARKING_GOAL_POSE, POLICY_PATH ([keys.py:257-270](wayve/ai/zoo/data/keys.py)) |
| 7 | route shortening `_shorten_route_polyline_to/from_stop` ([routes.py:167](wayve/ai/lib/data/pipes/routes.py)) | (a) parking loader emits `parking_stop_route_index`/`parking_stop_route_fraction`; (b) pass `enable_route_shortening_for_parking` + jitter into `RouteMapFetcher` from [tensor_loaders/map.py](wayve/ai/lib/data/factory/tensors/tensor_loaders/map.py); **reads `parking_stage` directly** (`==parking` → shorten-to-stop, `==unparking` → shorten-from-stop) — no `unparking_mode` tensor. | route_map (shortened); stop-index tensors |

---

## Phase 3 — Model config (turn on parking inputs)
| File | Change |
|---|---|
| [backbone/wfm.py](wayve/ai/drive/common/configs/backbone/wfm.py) (or new `backbone/parking.py`) | Define `PARKING_BC_WFM_OVERRIDES = deepcopy(BASELINE_BC_WFM_OVERRIDES)` then: re-enable `parking_mode` adaptor (remove the `= None`), `always_dropout_parking_mode=False`; `gear_direction.always_dropout_gear_direction=False`; `stopping_mode.always_dropout_stopping_mode=False`; set `dropout_token_probability≈0.5` on each (mirrors SI `_PARKING_RELEASE_2026_5_21_INPUT_ADAPTORS`). Keep `enable_gear_direction=True` output. Build `ParkingBcWFMEarlyFusionCFG` (+ a `DeferLoad` variant for the head seed). Radar: keep drive early-fusion unless parity requires late (decision #1). |
| [components/training.py](wayve/ai/drive/bc/configs/components/training.py) | `ExperimentSpec` TypedDict: add parking knobs — `use_parking_mode`, `enable_stopping_mode`, parking-aug flags/probs, parking bucket allowlists. Auto-propagate to `MultiHeadExperimentSpec`. |

---

## Phase 4 — BC parking model recipe (deliverable 1; archetype A — from WFM)
| File | Change |
|---|---|
| [recipes/parking.py](wayve/ai/drive/bc/configs/recipes/parking.py) *(new)* | `ParkingExperimentSpec = ExperimentSpec(**{**DefaultExperimentSpec, "model": ParkingBcWFMEarlyFusionCFG, <parking data knobs>, "version": ...})`; `MainCfg = builds(main, training_job=<LightningJobCfg w/ parking datamodule>, zen_meta=ParkingExperimentSpec)`; `store(MainCfg, name="parking_bc")`. |
| `configs/components/data/buckets/parking.py` *(new)* | PUDO/unpudo/GC bucket tuples + weights ported from [parking_config.py](wayve/ai/si/configs/parking/parking_config.py). |
| `configs/components/data/datamodules/parking.py` *(new)* | Parking datamodule via `pipeline_config` with the parking spec + parking buckets + materialised root. |

Run: `--config-name=parking_bc`. This is a full model, trunk trainable, seeded from the WFM release
(mirrors `baseline_bc.py`), with parking data + parking inputs on.

---

## Phase 5 — Parking head recipe (deliverable 2; archetype B) + arbiter
| File | Change |
|---|---|
| [common/head_keys.py](wayve/ai/drive/common/head_keys.py) | Add `PARKING = "parking"`. |
| [bc/configs/recipes/parking_head.py](wayve/ai/drive/bc/configs/recipes/parking_head.py) *(new)* | `head_recipe(baseline=DefaultExperimentSpec, head_key=HeadKeys.PARKING, seed_backbone=MidTrainingV1SeedCfg, seed_checkpoint=MID_TRAINING_V1_CHECKPOINT, datamodule=parking_datamodule, composite_submit=bc_composite_submit_cfg(HeadKeys.PARKING, arbiter=ParkingArbiterCfg), overrides={"version": ..., parking knobs})`; `store(name="parking_head")`. Mirrors [driving_head.py](wayve/ai/drive/bc/configs/recipes/driving_head.py)/[set_speed.py](wayve/ai/drive/bc/configs/recipes/set_speed.py). |
| [zoo/st/arbiters/parking.py](wayve/ai/zoo/st/arbiters/parking.py) *(new)* + BUILD | `ParkingArbiter(Arbiter)`: `HEAD_KEYS=(DEFAULT_HEAD_KEY, "parking")`, `INPUT_KEYS=(DataKeys.PARKING_MODE,)` (and/or STOPPING_MODE), `forward()` routes to parking head when parking/stopping-mode active. TorchScript-safe. Template: [mrm.py](wayve/ai/zoo/st/arbiters/mrm.py). |
| [drive/composite/arbiters.py](wayve/ai/drive/composite/arbiters.py) | `V4Arbiter`: add `"parking"` to `HEAD_KEYS`/`PRIORITY`, compose `self._parking = ParkingArbiter()`, add predicate in `forward` + a `routing_probe_inputs` case; extend `INPUT_KEYS`/`REQUIRED_DRIVING_CONTROL_KEYS`. |
| [drive/composite/configs/recipes/v4_composite.py](wayve/ai/drive/composite/configs/recipes/v4_composite.py) | Add `"parking"` to `_HEADS`, `head_postprocess`, `_HEAD_CHECKPOINT_NUMS`. |

Note: `HeadKeys` is coupled to arbiters only by string value; the arbiter is always passed
explicitly (no head_key→arbiter registry), so the sites above are the complete set.

---

## Phase 6 — Tests + docs
| File | Change |
|---|---|
| `config/tests/test_schema.py`, `test_schema_version.py`, `test_migrations.py` | Cover the new proto arms + version bump. |
| new augmentor loader + pipe unit tests | Mirror the `gear_parking` tests for each ported augmentation. |
| [test/test_mrm_factory_config.py](wayve/ai/drive/bc/test/test_mrm_factory_config.py) → `test_parking_factory_config.py` *(new)* | Build the parking pipe; assert parking_mode/stopping_mode tensors + each augmentation present with expected fields. |
| [test/configs/recipes/test_bc_mrm_head.py](wayve/ai/drive/bc/test/configs/recipes/test_bc_mrm_head.py) → `test_parking.py` + `test_parking_head.py` *(new)* | Instantiate recipes; assert model overrides (parking_mode on), head_key, seed, bucket weights. |
| [configs/reproducibility/parking_bc_check.py](wayve/ai/drive/bc/configs/reproducibility/parking_bc_check.py) *(new)* + BUILD `release_configs` | `ReleaseConfig` + `TestingHashesTraining`; generate hashes (skill `debug-training-reproducibility-test`). |
| `configs/smoke/parking_bc_smoke.py` *(new)* | Hermetic smoke recipe (mirror `baseline_bc_smoke.py`). |
| composite/arbiter tests + `test_heads.py` | Cover `HeadKeys.PARKING` + `ParkingArbiter` + V4 wiring. |
| README | Parking recipe usage (mirror the SI parking README + MRM docs). |

---

## Suggested PR breakdown
1. **PR1 — factory data layer** (Phase 1 + 2): proto arms, loaders, pipes, spec plumbing, schema
   tests. Self-contained, testable without training. Biggest PR; consider splitting 2A vs 2B.
2. **PR2 — model + BC recipe** (Phase 3 + 4): backbone overrides, ExperimentSpec knobs,
   `recipes/parking.py`, buckets/datamodule, recipe + factory tests.
3. **PR3 — parking head + arbiter** (Phase 5): head_key, head recipe, `ParkingArbiter`, V4/composite
   wiring, arbiter tests.
4. **PR4 — reproducibility/smoke + docs** (Phase 6 remainder).

---

## Open decisions to confirm
1. **Radar fusion:** SI parking used late-fusion radar + `RadarInputAdaptorCfg`; drive baseline uses
   early-fusion radar. Keep drive early-fusion (recommended) or replicate SI late-fusion?
2. **Parking-head seed:** ✅ RESOLVED — `MidTrainingV1SeedCfg` + `MID_TRAINING_V1_CHECKPOINT`
   (matches `driving_head.py`, the true "multi-driving-head from mid-train ckpt").
3. **Policy-path / goal-pose tensors (aug #6):** emit them now for parity/future diffusion even
   though the BC model won't consume them, or defer until the diffusion model is migrated?
4. **Parking detection / data model:** ✅ RESOLVED — extend `ParkingDataLoader` for deterministic
   detection (`parking_stage`, stop-index, gear-cleanup folded in) + separate augmentors for the
   stochastic flip and policy rewrites. `parking_mode` is input-only (derived `parking_stage ∈
   {parking, parked}`, provisional); `unparking_mode` dropped (route-shortening reads `parking_stage`).
   `parking_mode`→`initiate_auto_park` rename deferred to a separate refactor.
5. **Data materialisation** ownership + timeline (P0.1).

---
---

# Appendix A — MRM code guide (how the reference stack works)

The MRM recipes are the closest existing analog. Understanding them is the fastest way to know what
to build for parking.

## The three MRM files — all head recipes, differing only in seed + data
All are **head recipes** (register `store(cfg, name=...)`, run with `--config-name=<name>`). They're
a progression:

| File | `--config-name` | Seed | Data | Purpose |
|---|---|---|---|---|
| `recipes/mrm/mrm_head_v0.py` | `mrm_head_v0` | `BaselineRLTrunkOnlySeedCfg` (RL trunk, **fresh** output head) | baseline (5% MRM overlay) | simplest: head trains from scratch; default optimizer gives head LR 1e-4 vs trunk 1e-5 |
| `recipes/mrm/mrm_head_v1.py` | `mrm_head_v1` | `BaselineRLFullSeedCfg` (full RL→BC **warm-start**) | baseline (5% MRM overlay) | warm-started head + NaN safeguards (head LR=1e-5, grad-clip 1.0, `use_fused_adamw=False`) |
| `recipes/mrm/bc_mrm_head.py` | `bc_mrm_head` | `BaselineRLFullSeedCfg` | **dedicated MRM mix (18.9%)** from a materialised MRM dataset | production recipe: v1 + custom data + MRM tensor/aug overrides + bucket-loss tracker |

v0/v1 don't define their own data — they inherit the baseline datamodule (already 5% MRM).
`bc_mrm_head` has a bespoke data pipe; shared machinery lives in `recipes/mrm/bc_mrm_common.py`.

## How the MRM head is defined — and why it's "the same arch as the driving head"
There is **no MRM-specific model class or head module.** The MRM head is architecturally identical
to the driving head — same WFM early-fusion backbone, same `BehaviorControlOutputAdaptor`. What makes
it "the MRM head" is three non-architectural things, supplied through `head_recipe(...)`:

```python
# mrm_head_v1.py
MrmHeadV1Cfg = head_recipe(
    DefaultExperimentSpec,               # ← the BASELINE DRIVING spec (same arch)
    head_key=HeadKeys.MRM,               # ← routing/dispatch tag (not architecture)
    seed_backbone=BaselineRLFullSeedCfg, # ← which checkpoint the trunk starts from
    training_job=MrmHeadV1LightningJobCfg,
    overrides={"version": ..., "gradient_clip_val": 1.0, "job": ...},
)
```

"Same arch as the driving head" is referenced by `baseline=DefaultExperimentSpec`. Inside
`head_recipe` → `build_head_spec`, it forks the baseline spec and does `spec["model"] = seed_backbone`.
Every seed backbone (`BaselineRLSeedCfg`, `…TrunkOnly…`, `…Full…` in `mid_training.py`) is built on the
**same skeleton** as the driving model — `BaselineBcWFMEarlyFusionDeferLoadCFG`; only the checkpoint
loaded differs. `head_recipe` then **freezes the trunk** (`frozen_trunk_layers=TRUNK_DEPTH`), so only
the output head trains. The actual driving head uses the same builder:

```python
# driving_head.py
DrivingHeadCfg = head_recipe(
    baseline=DefaultExperimentSpec, head_key=HeadKeys.DEFAULT,
    seed_backbone=MidTrainingV1SeedCfg, seed_checkpoint=MID_TRAINING_V1_CHECKPOINT)
```

So driving-head vs MRM-head = same `head_recipe`, same arch; they differ in `head_key` + seed + data.
**Nuance:** `bc_mrm_head` seeds from a **Baseline RL** checkpoint; `driving_head` is the one that uses
the genuine **mid-training-v1** checkpoint. The parking head mirrors `driving_head` (mid-training).

## How MRM data is defined (bc_mrm_head)
In `bc_mrm_common.py`: a **weighted bucket mix over a materialised dataset**, assembled into a factory
pipe:
- `BC_MRM_HEAD_MRM_BUCKETS` — 7 MRM buckets, relative weights scaled by
  `BC_MRM_HEAD_MRM_TOTAL_WEIGHT = 0.189`; baseline driving buckets rescaled to fill 81.1%.
- `bc_mrm_pipeline_config(spec, split)` → `materialised_buckets(_bc_mrm_head_buckets(), split, ROOT)`
  → `create_pipe(..., base_config=create_bc_mrm_base_config, normalize_bucket_weights=True)`.
- `FactoryDataModule(train_config=builds(bc_mrm_pipeline_config, spec=BC_MRM_PIPELINE_SPEC, split="train"), …)`.
- `BC_MRM_PIPELINE_SPEC = builds(resolve_default_pipeline_spec, **{**PIPELINE_SPEC_KW, binary_version, materialisation_version})`.
- Root: `bc/mrm/initial-release/2026-07-18-2`.

Pattern = **buckets (names + weights) + a materialised root + a pipeline spec → a `FactoryDataModule`.**

## MRM augmentations used (bc_mrm_head)
Set in `create_bc_mrm_base_config(spec)` (overrides on the standard BC base config):
- **`A.MRM_TRAJECTORY`** — the core MRM aug: overlays a target pull-over trajectory onto the policy for
  MRM/synthetic buckets (sets trajectory-binary path + synthetic buckets).
- **`A.VALID_PATH`** — allow short paths for the slow-lane bucket.
- **`K.MITIGATION_REQUEST`** (tensor) — marks `forced_pull_over_buckets`; drives the mitigation-request
  input the `MrmArbiter` routes on.
- (+ clears `camera_time_delta.coordinate_frames`.)

**Important:** the "basic gear augmentation" (`A.GEAR_PARKING`) is **NOT enabled** for MRM — nor
anywhere in drive/bc. The proto + loader + runtime pipe all exist (built to port the SI OTF gear
augmentation), but it's gated on `mrm_gear_parking_buckets`, which is `()` in `DefaultExperimentSpec`
and never overridden. So it's **dormant machinery**: a proven *template* but not a live *wiring*
example. For parking you'll both **enable** `gear_parking` and **add** the richer SI augmentations.

---

# Appendix B — MRM file footprint (what to mirror for parking)

Split into **new MRM-dedicated files** (created fresh) vs **shared files MRM edited** (few lines added).
Parking will be larger: 2 model recipes (WFM + mid-training) and 7 augmentations vs MRM's 1.

## 1. Recipes / config (`drive/bc/configs`)
**New:** `recipes/mrm/bc_mrm_common.py`, `bc_mrm_head.py`, `mrm_head_v0.py`, `mrm_head_v1.py`, `__init__.py`
**Edited:** `components/data/buckets/baseline.py` (MRM buckets, `MRM_WEIGHT`), `components/data/datamodules/shared.py` (`include_mrm`, `mrm_gear_parking_buckets` in `PIPELINE_SPEC_KW`), `components/data/pipeline_defaults.py`, `components/training.py` (`ExperimentSpec.mrm_gear_parking_buckets`), `recipes/baseline_bc.py`, `configs/multi_task_api.py`, `configs/smoke/baseline_bc_smoke.py`, `components/data/README.md`

## 2. Data factory — model-facing spec (`drive/bc/data/factory`)
**Edited:** `schema.py` (`_add_mrm_pipeline_extensions`, `_add_gear_parking_augmentation`), `spec.py` (`include_mrm`, `mrm_parking_lookahead_sec`, `mrm_gear_parking_*`), `inputs.py` (`MrmSettings`, `MrmGearParkingSettings`), `constants.py` (`MRM_GEAR_PARKING_*`)

## 3. Data factory core — augmentation implementation (`wayve/ai/lib/data`)
**New:** `factory/tensors/augmentor_loaders/mrm.py` (MRM_TRAJECTORY loader), `pipes/augmentations/mrm.py` (runtime pipe), `pipes/mrm.py`, `pipes/mrm_frames.py` (trajectory helpers)
**Edited:** `factory/tensors/__init__.py` (force-import + `__all__`), `config/schema/augmentations.proto` (`mrm_trajectory` tag 5, `gear_parking` tag 9), `config/schema/tensors/modes.proto` (`parking_mode`/`stopping_mode`), `config/schema/CHANGELOG.md`, `config/migrations.py`, `tables.py`, `pipes/source_pipes.py`, `factory/BUILD`, `factory/README.md`

## 4. Model inputs/outputs (`zoo`)
`zoo/data/keys.py` — MRM-related keys (`mitigation_request`, …). (Gear/park/stopping input adaptors + gear output head are shared, not MRM-specific.)

## 5. Deployment / arbiter routing
**New:** `zoo/st/arbiters/mrm.py` (`MrmArbiter`)
**Edited:** `common/head_keys.py` (`HeadKeys.MRM`), `composite/arbiters.py` (`V4Arbiter` composes `MrmArbiter`), `composite/configs/recipes/v4_composite.py` (`_HEADS`/`head_postprocess`), `composite/configs/components.py`, `composite/runner.py`, `composite/wrappers.py`, `common/deployment/config.py`, `common/deployment/submit/submitter.py`, BUILD files (`zoo/st/arbiters`, `composite`, `common`)

## 6. Tests
- Factory augmentor: `lib/data/factory/test/test_mrm_augmentor.py`, `test_gear_parking_augmentor.py`, `test_valid_path_augmentor.py`
- drive/bc: `test/test_mrm_factory_config.py`, `test/configs/recipes/test_bc_mrm_head.py`, `test/data/factory/test_schema.py`, `test_spec.py`, sample configs `v1–v4.yaml`
- Arbiter/composite: `zoo/st/arbiters/test/test_mrm.py`, `composite/test/test_arbiters.py`, `test_composite_deploy.py`
- Seed/deployment: `common/test/test_seed.py`, `common/test/test_deployment/`

**Summary:** MRM footprint ≈ 4 new dedicated files (recipe common, augmentor loader, runtime pipe,
arbiter) + edits across ~20 shared files.
