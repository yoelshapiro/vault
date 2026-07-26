# Parking Model Migration — Implementation Plan (SI → drive/bc + data factory)

**Scope (agreed):** BC parking model + parking head only (no diffusion output adaptor). Full
augmentation parity with SI (incl. the diffusion/off-by-default ones). New `HeadKeys.PARKING` +
dedicated `ParkingArbiter`.

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
Turn the parking inputs on in the BC factory.

| File | Change |
|---|---|
| [tensor_loaders/parking.py](wayve/ai/lib/data/factory/tensors/tensor_loaders/parking.py) | `ParkingDataLoader` already emits `parking_mode`+`stopping_mode`. **Reuse.** (Extend for `unparking_mode`/goal in Phase 2.) |
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
Ordering is by dependency: augmentors that read `parking_mode` declare it in `read_only_fields`, so
they run **after** `ParkingDataLoader` automatically.

Proto free tags: `AugmentationRequest` → **10, 11, 12, 13** (avoid historical 4);
`TensorRequest` → **118+** (gaps 69–72 also free). MINOR bump → no migration needed; update
`autopublish.yaml`, `CHANGELOG.md`, `config/tests/test_schema*.py`; regenerate via `make_protos.sh`.

### 2A — In-place policy/gear rewrites (template: gear_parking)
| # | SI source | New proto arm | Loader / pipe | `augmented_fields` |
|---|---|---|---|---|
| 1 | gear label cleanup `clean_parking_gear_labels` ([parking.py:594](wayve/ai/si/datamodules/parking.py)) | `gear_label_cleanup` (tag 10) — fields: reverse_max_distance_m, neutral_max_duration_sec, stop_buffer_sec, stop_speed_threshold_mps | `augmentor_loaders/gear_label_cleanup.py` + `pipes/augmentations/gear_label_cleanup.py` | vehicle_gear_direction, policy_gear_direction. **Ordering:** must precede parking detection → either a pre-detection augmentor or fold into `ParkingDataLoader` (recommend fold-in; SI does it inside detection). |
| 2 | advanced standstill gear aug `augment_standstill_gear` ([parking.py:1161](wayve/ai/si/datamodules/parking.py)) | `standstill_gear` (tag 11) — fields: prob, use_main_augmentation | new loader + pipe | augments `vehicle_gear_direction`; `read_only_fields=[policy_gear_direction, parking_mode, unparking_mode]` |
| 3 | clamp at first neutral `clamp_policy_at_first_neutral` ([parking.py:845](wayve/ai/si/datamodules/parking.py)) | `clamp_policy_at_neutral` (tag 12) | new loader + pipe | policy_pose, policy_waypoints, policy_curvature, policy_speed, policy_gear_direction |
| 4 | strip leading standstill `strip_leading_standstill` ([parking.py:697](wayve/ai/si/datamodules/parking.py)) | `strip_leading_standstill` (tag 13) | new loader + pipe (may DROP sample → filter stage) | policy_* (pose/waypoints/curvature/speed/gear). SI already has a TODO to make this a standalone augmentor. |

### 2B — New-tensor producers (template: parking loader / set_speed)
| # | SI source | Approach | Emits |
|---|---|---|---|
| 5 | parked→unparking flip `_augment_parked_mode` ([parking.py:629](wayve/ai/si/datamodules/parking.py)) | **Extend `ParkingDataLoader`** to return the richer `ParkingModeResult` (parking/unparking/parked) behind a flag + `parked_unparking_prob` — it already computes the neutral segments. | `unparking_mode` tensor (key exists in [keys.py:256](wayve/ai/zoo/data/keys.py)) |
| 6 | policy path / goal pose `_sample_policy_path_from_poses` ([parking.py:402](wayve/ai/si/datamodules/parking.py)) | New tensor loader(s) + `TensorRequest` arm(s) (tags 118+). ⚠️ The **BC** model won't consume these (they're diffusion inputs); we emit them for parity/future diffusion — see decision #3. | PARKING_POSE, PARKING_GOAL_DISTANCE, ORIGINAL_PARKING_GOAL_POSE, POLICY_PATH ([keys.py:257-270](wayve/ai/zoo/data/keys.py)) |
| 7 | route shortening `_shorten_route_polyline_to/from_stop` ([routes.py:167](wayve/ai/lib/data/pipes/routes.py)) | (a) parking loader emits `parking_stop_route_index`/`parking_stop_route_fraction`; (b) pass `enable_route_shortening_for_parking` + jitter into `RouteMapFetcher` from [tensor_loaders/map.py](wayve/ai/lib/data/factory/tensors/tensor_loaders/map.py) (shorten helpers already exist in `routes.py`). | route_map (shortened); stop-index tensors |

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
2. **Parking-head seed:** `MidTrainingV1SeedCfg` + `MID_TRAINING_V1_CHECKPOINT` (matches
   `driving_head.py`, the true "multi-driving-head from mid-train ckpt") — recommended — vs
   `BaselineRLFullSeedCfg` (matches `bc_mrm_head.py`).
3. **Policy-path / goal-pose tensors (aug #6):** emit them now for parity/future diffusion even
   though the BC model won't consume them, or defer until the diffusion model is migrated?
4. **Parking detection:** extend the existing `ParkingDataLoader` (add unparking/parked/goal) vs add
   separate augmentors. Recommend extending the loader for detection-coupled outputs
   (parked/unparking/stop-index) and separate augmentors for the policy rewrites.
5. **Data materialisation** ownership + timeline (P0.1).
