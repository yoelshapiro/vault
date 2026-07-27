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

## Status (2026-07-26)
**PR1 (data-factory layer) in progress** — branch `boris/parking_migration/factory-data-layer`,
draft PR [#127389](https://github.com/wayveai/WayveCode/pull/127389).
- ✅ Commit 1: ADR 001 (`wayve/ai/lib/data/factory/.decisions/001-…md`), revised to address the 8 agentic-review comments.
- ✅ Spike done — all factory-internals unknowns resolved (see Readiness).
- ✅ Commit `cf2f6d18`: `enable_parking_mode` / `enable_stopping_mode` factory flags (no proto change;
  defaults preserve baseline/MRM byte-identically). `//wayve/ai/drive/bc:py_checks_data` green.
- ✅ Commit `95a1e063` + `4b9fb01f`: gate parking inputs on `enable_parking_mode` (master switch);
  validate `enable_stopping_mode` requires it (review comment).
- ✅ Commit `4cbc2f00`: `parking_stage` proto tensor — `ParkingStageRequest` + oneof arm (field 118),
  int8 {0=driving,1=parking,2=parked,3=unparking}; schema MINOR bump 7.1.1→**7.3.0** (reconciled with
  CHANGELOG). Verified bazel regenerates `_pb2` (no manual `make_protos.sh`).
- ✅ Commit `eb5339e6`: **`ParkingDataLoader` emits `parking_stage`** — 4-stage `_compute_parking_stage`
  ported from SI `_compute_parking_mode` (parked > parking-forward > unparking reverse/standstill scan),
  computed on the full **past+future** series (unparking needs the preceding segment) *before* the
  forward-only window used by `parking_mode` (so `parking_mode` is byte-identical). Wired into
  `create_base_config` under `enable_parking_mode` (+ frame-table lookahead), with loader validation,
  int8 output spec (range 0..4), and `_compute_parking_stage` unit tests. Both factory test targets green.
- ✅ Commit `ceae55e3`: **`lazy_past` best-effort backward frame-window extension** (the R-D past-window
  gap). `frames.py` gains `lazy_past`/`lazy_past_sec` (symmetric to `lazy_future`; clamped, never drops;
  `ORIGIN_INDEX` uses a shared `_effective_past`, so existing pipes are byte-identical);
  `TableRequest.lookbehind_sec` (field 10, schema MINOR 7.3.0→**7.4.0**) wired through `tables.py`; the
  drive/bc parking path sets `lookbehind_sec=30s` (matching SI) so `parking_stage` can see the exit's
  preceding segment. frames `lazy_past`/`effective_past` unit tests + all touched lint/ty green.
  (Kept `_get_row_slice_offsets`' offsets-only return to avoid breaking its other callers/tools.)
- ⏭️ Next: augmentor arms. **`gear_label_cleanup` DECISION (agreed):** apply cleanup **uniformly (no
  stage gate) on the parking pipeline only** (option b, parking-data-scoped; baseline untouched).
  Correction to earlier framing — cleanup is NOT a pure downstream augmentor; it belongs partly upstream:
  - **Part 1 (detection): ✅ DONE — commit `45078400`.** Ported SI `clean_parking_gear_labels` into
    `ParkingDataLoader` (dense→dense); `parking_stage` is now detected on the smoothed gear.
    Bucket-gated: `ParkingStageRequest.gear_label_cleanup_buckets` (DATASET_BUCKET allowlist), uniform
    within those buckets. Config threaded via `ParkingSettings`/`PipelineSpec.gear_label_cleanup_buckets`
    (thresholds from constants); schema MINOR 7.4.0→**7.5.0**. Unit tests for the cleanup + schema config;
    all lib-factory/config/drive-bc checks green. (min-duration filter kept as a guard for non-cleanup buckets.)
  - **Part 2 (model tensors): ✅ DONE — commit `bfef1c21`.** New `gear_label_cleanup` augmentor
    (proto arm tag 10 + `GearLabelCleanupAugmentor` msg; schema MINOR 7.5.0→**7.6.0**) overwrites
    `vehicle_gear_direction` (required) + `policy_gear_direction` (optional) with cleaned gear, bucket-gated
    on `gear_label_cleanup_buckets`. Re-gather is provably index-aligned: the factory loader builds the
    SAME `IndicesFromTimeDeltas(get_time_deltas(gear_request))` generators the gear loaders use and passes
    them to the pipe, which re-samples the cleaned dense series via `resolve_indices` (identical to the
    loaders' `Gatherer` path — no off-by-one). Pure cleanup helpers moved to `pipes/parking_gear.py`
    (shared by `ParkingDataLoader` + the augmentor pipe; advances the parking.py "move to ai lib pipe"
    TODO). Config resolved: params live on `GearLabelCleanupAugmentor` set by `create_base_config` from
    the SAME spec+constants as `ParkingStageRequest` (one source, can't drift — no shared proto needed).
    Alignment tests (loader-index reproduction, spike smoothing, bucket gating, policy-absent) + schema
    tests; tensor_loaders/validation/config-schema/drive-bc-data checks + `lib_no_triton_rt` all green.
  - **`standstill_gear`: ✅ DONE — commit `9d6e74d6` (schema 7.7.0).** Pipe + loader + spec plumbing +
    tests. Bucket+stage-gated, runs after `gear_label_cleanup`. Positional `[-1]`/`[1]` conventions
    (current gear = last vehicle offset 0; loss step = policy offset[1]) verified against drive's
    `uniform_past`/`uniform_future` offset construction.
  Then `clamp_policy_at_neutral`, `strip_leading_standstill`, `parking_stage_flip`; then route shortening.
  **DESIGN NOTE for the remaining 3 augmentors:** they all consume SI's shared scratch (cleaned dense
  gear + `speed_kmh` + `cumulative_dist` + the `ParkingModeResult`), computed ONCE per sample. The factory
  currently re-derives per augmentor (gear cleanup re-run, stage re-read). `clamp`/`strip` operate on the
  policy_* tensors relative to the first-neutral / first-moving index in the DENSE cleaned gear — so
  consider persisting the cleaned dense gear (+ maybe origin-relative stage indices) into the table from
  `ParkingDataLoader` (a "parking scratch" column) so all parking augmentors share one source, mirroring
  SI's scratch table. Fork to weigh before building clamp/strip: per-augmentor re-derivation (simple, some
  duplicated cleanup cost) vs. shared table scratch (matches SI, one source of truth, small loader change).

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
- **P0.1 Data materialisation — ✅ largely DONE (not a new workstream).** The parking data already
  exists: `parking_pudo` `BucketedDataset` in
  [sampling/datasets/parking_pudo/default/dataset.py](wayve/ai/services/sampling/datasets/parking_pudo/default/dataset.py)
  (`binary_version="3.0.81"`, same as drive baseline/MRM; buckets `dc_park`/`dc_pudo`/`dc_unpark`/
  `dc_unpudo`[+forward/reverse]/`dc_pre_start_*`/`*_gear_change`/`ca_*`/`pre_ca_*`, split by country;
  publishes as `ai_services_sampling_parking_pudo_default`). It generic-materialises to a
  `sampling_materialised/parking_pudo/...` root (SI read `.../parking_pudo/default/dev/parking_pudo_default_raw_gear_window_...`).
  **Remaining work is wiring, not sampling:** (1) get the current published `sampling_materialised/parking_pudo/...`
  root + version and point the drive parking datamodule at it; (2) port the bucket **names + weights**
  into `configs/components/data/buckets/parking.py`; (3) **verify schema/columns** — the materialised
  output must carry what the factory tensor loaders read (gear direction, speed, indicator for
  stopping_mode, route). Binary 3.0.81 matches drive so base driving columns line up; only re-materialise
  if a needed column is missing. Factory detection (`parking_stage`, gear-cleanup) is computed on-the-fly
  from raw gear+speed, so no pre-materialised parking labels are required.
- **P0.2 ADRs.** Per repo `AGENTS.md`, architectural changes need an ADR + approval before code.
  Recommend two: (a) *new factory proto augmentations/tensors for parking*; (b) *new `PARKING` head
  key + `ParkingArbiter`*. Create with `./tools/decisions new "<title>"`.
- **P0.3 Schema-version reconciliation.** `config/schema/autopublish.yaml` = **7.1.1** but
  `CHANGELOG.md` top = **7.2.0**. Reconcile this gap as part of the proto bump.
- **Decisions (all resolved — see end):** radar → early fusion; parking-head seed → MidTrainingV1;
  policy-path/goal-pose → deferred; parking detection/data model → `parking_stage` split; data
  materialisation → already sampled (P0.1).

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
  int8, **mapping `driving=0, parking=1, parked=2, unparking=3`**, `TensorSpec range=(0,4)` (exclusive
  upper → values 0–3; `driving=0` = default/none). ⚠️ **Detection needs a PAST window:** current
  `ParkingDataLoader` scans `gear[origin:end]` (forward only) → can't see the preceding neutral segment,
  so `unparking` would be misclassified as `driving`. The parking `frame_data` table must carry a
  **past horizon** (SI `past_sec=30`), and the loader reads `[origin-past, origin+lookahead]`.
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

### Provenance & monitoring (RESOLVED approach)
SI logged domain provenance in `add_parking_mode`: `PROVENANCE_PARKING_STAGE` (stage label),
`PROVENANCE_CURRENT_GEAR_DIRECTION`, `PROVENANCE_NEXT_GEAR_DIRECTION` ([keys.py:345-347](wayve/ai/zoo/data/keys.py)).
In SI these served two roles: (a) input rules auto-**exclude** `provenance_*` from the model encoder, and
(b) offline analysis + curr/next split rules. Consumers: `lib/provenance.py`, SI
`state_encoder_input_rules` / `curr_and_next_split_rules` / `reward_encoder_input_rules` — **not** the
parking lifecycle dashboard.

Drive-idiomatic approach — **don't blindly re-log gear/stage as provenance**:
- The domain signals are already **tensors in the batch** (`parking_stage`, `parking_mode`,
  `vehicle_gear_direction`, `policy_gear_direction`). Eval / offline analysis read them directly.
- Drive model inputs are **explicit** (the adaptor list names what's consumed), so there's no need for
  the SI "wrap as provenance so the encoder ignores it" trick — a logged tensor can't leak into the model.
- **Training monitoring:** the parking **buckets** already encode maneuver type
  (`dc_park`/`dc_pudo`/`dc_unpark`/`dc_unpudo`/…), so a `BucketLossTracker` over parking buckets gives
  per-maneuver loss/counts for free (same as MRM's `bc_mrm_head`, keyed on `PROVENANCE_PIPE_NAME`). Add
  it to both parking recipes' callbacks. For **augmentation-aware** monitoring (the stochastic
  parked→(un)parking flip makes `parking_stage` diverge from the source bucket), track loss by
  `parking_stage` — needs a stage-aware tracker or exposing `parking_stage` to the metrics callback.
- **RESOLVED — DO log it (for investigation/debugging):** no code reads these actively, but they're
  wanted for offline investigation, so emit them. Emit `parking_stage` as a first-class factory tensor
  (needed by augmentations anyway; carried in the batch/dumps) plus the SI debug snapshots
  `provenance_current_gear_direction` / `provenance_next_gear_direction` (origin gear + next step) as
  lightweight provenance tensors. (`parking_stage` itself replaces `provenance_parking_stage`; keep the
  name `parking_stage`.) These are pure logging fields — not model inputs (the adaptor list excludes them).
- **Monitoring:** add a `BucketLossTracker` over the parking buckets to both parking recipes (per-maneuver
  loss curves, MRM pattern). Optionally add a **stage-keyed** tracker for per-`parking_stage` loss curves
  (see below) — decide for v1.

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
**10** gear_label_cleanup, **11** standstill_gear, **12** clamp_policy_at_neutral,
**13** strip_leading_standstill, **14** parking_stage_flip. `TensorRequest` → **118** `parking_stage`
(+ 119+ for the deferred policy-path/goal tensors); gaps 69–72 also free. MINOR bump → no migration
needed; update `autopublish.yaml`, `CHANGELOG.md`, `config/tests/test_schema*.py`; regenerate via
`make_protos.sh`.

### 2A — In-place policy/gear rewrites (template: gear_parking)
| # | SI source | New proto arm | Loader / pipe | `augmented_fields` |
|---|---|---|---|---|
| 1 | gear label cleanup `clean_parking_gear_labels` ([parking.py:594](wayve/ai/si/datamodules/parking.py)) | `gear_label_cleanup` (tag 10) — ✅ **DONE** (`bfef1c21`) | Augmentor re-gathers cleaned dense gear (shared `pipes/parking_gear.clean_parking_gear_labels`) at the gear loaders' exact indices (loader passes their `IndicesFromTimeDeltas` gens; pipe uses `resolve_indices`). Detection (Part 1) cleans the dense column internally in `ParkingDataLoader` (same helper). `keep_original` supported (off by default). | vehicle_gear_direction (req), policy_gear_direction (optional) |
| 2 | advanced standstill gear aug `augment_standstill_gear` ([parking.py:1161](wayve/ai/si/datamodules/parking.py)) | `standstill_gear` (tag 11) — ✅ **DONE** (`9d6e74d6`; legacy `use_main_augmentation` dropped per user) | Pipe randomises `vehicle_gear_direction[-1]` (current) at standstill for PARKING/UNPARKING samples — target-aware only (switch-into-park: target N → previous moving gear; switch-out-of-park: target D/R → N). Bucket+stage-gated; runs AFTER `gear_label_cleanup` (`ordering_dependency_kinds`). `[-1]`/`[1]` layout verified vs drive's `uniform_past`/`uniform_future` offsets; short policy skipped. | augments `vehicle_gear_direction`; `read_only_fields=[policy_gear_direction, parking_stage]` |
| 3 | clamp at first neutral `clamp_policy_at_first_neutral` ([parking.py:845](wayve/ai/si/datamodules/parking.py)) | `clamp_policy_at_neutral` (tag 12) | new loader + pipe; `read_only_fields=[parking_stage]` | policy_pose, policy_waypoints, policy_curvature, policy_speed, policy_gear_direction |
| 4 | strip leading standstill `strip_leading_standstill` ([parking.py:697](wayve/ai/si/datamodules/parking.py)) | `strip_leading_standstill` (tag 13) | new loader + pipe (may DROP sample → filter stage); `read_only_fields=[parking_stage]` | policy_* (pose/waypoints/curvature/speed/gear). SI already has a TODO to make this a standalone augmentor. |

### 2B — New-tensor producers (template: parking loader / set_speed)
| # | SI source | Approach | Emits |
|---|---|---|---|
| 5 | parked→(un)parking flip `_augment_parked_mode` ([parking.py:629](wayve/ai/si/datamodules/parking.py)) | `parking_stage_flip` (tag 14) — stochastic: `read_only_fields=[path_pose, path_valid]`, `augmented_fields=[parking_stage]`; with `parked_unparking_prob` rewrites `parked` → `parking`\|`unparking`. Kept OUT of the (deterministic) detection loader for reproducibility. **Note:** SI gated `can_unpark` on future-path availability derived from policy_path/goal (aug #6, now deferred) — instead use `path_pose` cumulative distance for the path-length check. | rewrites `parking_stage` (no `unparking_mode`) |
| 6 | policy path / goal pose `_sample_policy_path_from_poses` ([parking.py:402](wayve/ai/si/datamodules/parking.py)) | ⏸️ **DEFERRED (decision #3)** — these are diffusion inputs the BC model doesn't consume. Skip until the diffusion model is migrated. When added: new tensor loader(s) + `TensorRequest` arm(s) (tags 118+); `read_only_fields=[parking_stage]`. | (deferred) PARKING_POSE, PARKING_GOAL_DISTANCE, ORIGINAL_PARKING_GOAL_POSE, POLICY_PATH ([keys.py:257-270](wayve/ai/zoo/data/keys.py)) |
| 7 | route shortening `_shorten_route_polyline_to/from_stop` ([routes.py:167](wayve/ai/lib/data/pipes/routes.py)) | (a) parking loader emits `parking_stop_route_index`/`parking_stop_route_fraction`; (b) pass `enable_route_shortening_for_parking` + jitter into `RouteMapFetcher` from [tensor_loaders/map.py](wayve/ai/lib/data/factory/tensors/tensor_loaders/map.py); **reads `parking_stage` directly** (`==parking` → shorten-to-stop, `==unparking` → shorten-from-stop) — no `unparking_mode` tensor. | route_map (shortened); stop-index tensors |

---

## Phase 3 — Model config (turn on parking inputs)
| File | Change |
|---|---|
| [backbone/wfm.py](wayve/ai/drive/common/configs/backbone/wfm.py) (or new `backbone/parking.py`) | Define `PARKING_BC_WFM_OVERRIDES = deepcopy(BASELINE_BC_WFM_OVERRIDES)` then: re-enable `parking_mode` adaptor (remove the `= None`), `always_dropout_parking_mode=False`; `gear_direction.always_dropout_gear_direction=False`; `stopping_mode.always_dropout_stopping_mode=False`; set `dropout_token_probability≈0.5` on each (mirrors SI `_PARKING_RELEASE_2026_5_21_INPUT_ADAPTORS`). Keep `enable_gear_direction=True` output. Build `ParkingBcWFMEarlyFusionCFG` (+ a `DeferLoad` variant for the head seed). Radar: **early fusion** (drive's latest — RESOLVED); reuse the baseline early-fusion radar adaptor, do NOT replicate SI late-fusion. |
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
| [zoo/st/arbiters/parking.py](wayve/ai/zoo/st/arbiters/parking.py) *(new)* + BUILD | `ParkingArbiter(Arbiter)`: `HEAD_KEYS=(DEFAULT_HEAD_KEY, "parking")`, `INPUT_KEYS=(DataKeys.PARKING_MODE, DataKeys.VEHICLE_GEAR_DIRECTION)`. **v0 `forward` (stateless, per-step, like `MrmArbiter`):** route to parking head (index 1) if `parking_mode` input active **OR** `vehicle_gear_direction[-1] ∈ {NEUTRAL(0), REVERSE(-1)}`, else default (index 0). Switch-back is implicit (predicate false → default). TorchScript-safe. Template: [mrm.py](wayve/ai/zoo/st/arbiters/mrm.py). **Extend later** for maneuver-lifecycle / latching / stopping-mode. |

| [drive/composite/arbiters.py](wayve/ai/drive/composite/arbiters.py) | `V4Arbiter`: add `"parking"` to `HEAD_KEYS`/`PRIORITY`, compose `self._parking = ParkingArbiter()`, add predicate in `forward` + a `routing_probe_inputs` case; extend `INPUT_KEYS`/`REQUIRED_DRIVING_CONTROL_KEYS`. |
| [drive/composite/configs/recipes/v4_composite.py](wayve/ai/drive/composite/configs/recipes/v4_composite.py) | Add `"parking"` to `_HEADS`, `head_postprocess`, `_HEAD_CHECKPOINT_NUMS`. |

> **Gear-signal note (RESOLVED):** use `vehicle_gear_direction` — the same signal SI `parking.py` used
> (`VehicleGearDirection`, R=−1/N=0/D=1), added by default in the drive factory. There is **no
> independent PARK signal**: both `VehicleGearDirectionLoader` and `VehicleGearPositionLoader` derive
> from the same `F.GEAR_DIRECTION` column; `gear_position` just relabels `neutral(0)→PARK(1)`. So
> "parked" ≡ `NEUTRAL(0)` throughout the stack (SI never distinguished P from N). Arbiter: parked =
> `NEUTRAL(0)`, reverse = `REVERSE(-1)`. No new tensor needed.

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

## Readiness — spike ✅ DONE (all factory-internals unknowns resolved)
Spike ran as the first step of PR1 (draft [#127389](https://github.com/wayveai/WayveCode/pull/127389)):
- **R-A — gear-label cleanup → ✅ AUGMENTOR.** A loader's `Gatherer.process_fn` only sees *sampled*
  values (`gather.py:143`), so cleanup can't live in the gear loaders. Do it as an augmentor that reads
  the dense `table[F.GEAR_DIRECTION]` and writes cleaned values into
  `data[vehicle_gear_direction]`/`data[policy_gear_direction]` — the shipped `GearParkingAugmentor`
  pattern. Detection cleans the dense column internally in `ParkingDataLoader` (same helper).
- **R-B — route shortening → ✅ scoped.** Fully un-wired today: `RouteMapFetcher` shortening flags are
  never set and its stop-index inputs (`parking_stop_route_index/fraction`) are never produced. Work:
  add flags to `MapRouteRequest` + thread through `MapRouteLoader`→`RouteMapFetcher`; new stop-index
  producer (port SI `_add_parking_stop_route_position`, incl. the parking-entry index the factory
  loader doesn't expose); request the polyline location columns; `MapRouteLoader.ordering_dependency_kinds`
  on the parking loader (pattern: `mitigation.py:52`). Heaviest item. NOTE: `RouteMapFetcher` reads
  `UNPARKING_MODE` — since we dropped that tensor, either update the fetcher to read `parking_stage` or
  emit `unparking_mode` just for this consumer (decide during R-B impl).
- **R-C — `parking_stage` → ✅ int8, range (0,4).** New `ParkingStageRequest` oneof arm + extend
  `ParkingDataLoader`, exactly like `stopping_mode`. `parking_stage_flip` augmentor rewrites it
  (precedent: gear_parking rewrites `policy_gear_direction`).
- **R-D — materialised columns (still OPEN, verify against real data).** Confirm the published
  `sampling_materialised/parking_pudo/...` carries indicator (stopping_mode), gear, route/polyline +
  arc-length columns. Check when wiring the datamodule (PR2).
- **Small confirmations:** `head_recipe(datamodule=…, composite_submit=…)` together is supported (only
  `training_job`+`datamodule` together raises); `stopping_mode` wanted as a model **input** (user
  listed it; enabled in Phase 3); per-**stage** loss tracker deferred, bucket tracker in v1.

## Suggested PR breakdown
1. **PR1 — factory data layer** (Phase 1 + 2): proto arms, loaders, pipes, spec plumbing, schema
   tests. Self-contained, testable without training. Biggest PR; consider splitting 2A vs 2B.
2. **PR2 — model + BC recipe** (Phase 3 + 4): backbone overrides, ExperimentSpec knobs,
   `recipes/parking.py`, buckets/datamodule, recipe + factory tests.
3. **PR3 — parking head + arbiter** (Phase 5): head_key, head recipe, `ParkingArbiter`, V4/composite
   wiring, arbiter tests.
4. **PR4 — reproducibility/smoke + docs** (Phase 6 remainder).

---

## Decisions (all resolved)
1. **Radar fusion:** ✅ RESOLVED — **early fusion** (drive's latest). Reuse the baseline early-fusion
   radar adaptor; do NOT replicate SI late-fusion.
2. **Parking-head seed:** ✅ RESOLVED — `MidTrainingV1SeedCfg` + `MID_TRAINING_V1_CHECKPOINT`
   (matches `driving_head.py`, the true "multi-driving-head from mid-train ckpt").
3. **Policy-path / goal-pose tensors (aug #6):** ✅ RESOLVED — **deferred**. Diffusion inputs the BC
   model doesn't consume; add when the diffusion model is migrated. The parked→(un)parking flip (#5)
   uses `path_pose` cumulative distance for its path-availability gate instead.
4. **Parking detection / data model:** ✅ RESOLVED — extend `ParkingDataLoader` for deterministic
   detection (`parking_stage`, stop-index, gear-cleanup folded in) + separate augmentors for the
   stochastic flip and policy rewrites. `parking_mode` is input-only (derived `parking_stage ∈
   {parking, parked}`, provisional); `unparking_mode` dropped (route-shortening reads `parking_stage`).
   `parking_mode`→`initiate_auto_park` rename deferred to a separate refactor.
5. **Data materialisation:** ✅ RESOLVED — parking data already sampled/materialised via the
   `parking_pudo` `BucketedDataset`; remaining work is wiring (point at the `sampling_materialised/parking_pudo/...`
   root, port bucket names/weights, verify columns) — see P0.1. Not a separate workstream.

### Arbiter switching (v0, agreed)
`ParkingArbiter` routes to the parking head when the `parking_mode` input is active **OR**
`vehicle_gear_direction ∈ {NEUTRAL(0), REVERSE(-1)}`; stateless per-step (switch-back implicit).
Extend later for maneuver-lifecycle / latching. Gear signal RESOLVED: use `vehicle_gear_direction`
(same as SI; there is no independent PARK signal — "parked" ≡ NEUTRAL(0) throughout the stack).

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
