# Parking OTF Drop Audit

## Scope
Ran a sampled OTF audit for the parking/PUDO training buckets through the real `OtfDrivingDataModule` pipeline to see which samples are dropped and why.

Config used:
- Datamodule: `parking_bc_D26_3_6_datamodule`
- Mode: `parking_bc_train_release_2026_5_11`
- Groups audited: `pudo`, `unpudo`, `unpark`

Notes:
- `park` is defined in the source config but has `0.0` effective train weight in `parking_bc_D26_3_6_datamodule`, so it was not part of the active sampled train audit.
- The harness disables map/radar/lidar side inputs for speed and to focus on structured supervision drops. Camera/video remains enabled because OTF still depends on it.

## Repo changes for the audit harness
Temporary, uncommitted repo changes:
- `wayve/ai/si/scripts/parking_otf_drop_audit.py`
- `wayve/ai/si/scripts/BUILD`

What the harness does:
- uses the real OTF datamodule and real bucket config
- records source-sample count vs yielded-sample count per leaf bucket
- patches common drop points to attribute reasons:
  - `load_paths`
  - `filter_bad_paths`
  - `filter_bad_timestamps`
  - `filter_no_video`
  - `load_run_tables`
  - `load_frame_tables`
  - `fetch_videos`
  - `augment_vehicle_preintervention`
- writes:
  - JSONL ledger of dropped samples
  - Markdown summary, updated incrementally after each bucket

## Audit artifacts
Smoke pass (`1` source sample per leaf bucket):
- `/tmp/parking_otf_drop_audit_smoke2/parking_bc_D26_3_6_datamodule_20260420_130836/summary.md`
- `/tmp/parking_otf_drop_audit_smoke2/parking_bc_D26_3_6_datamodule_20260420_130836/drop_records.jsonl`

Larger sampled pass (`10` source samples per leaf bucket):
- `/tmp/parking_otf_drop_audit_10/parking_bc_D26_3_6_datamodule_20260420_131041/summary.md`
- `/tmp/parking_otf_drop_audit_10/parking_bc_D26_3_6_datamodule_20260420_131041/drop_records.jsonl`

## Key findings from the 10-sample pass
### PUDO
- `dc_pudo_uk`: `10 / 10` dropped at `load_paths`
  - reason: `path_requested_distance_out_of_range`
  - representative detail: requested `199.84m` path while only `49.11m` was available
  - several consecutive timestamps on the same run show the same failure pattern
- `dc_pudo_usa`: `0 / 10` dropped
- CA and Pre-CA PUDO leaf buckets in this sample: `0 / 10` dropped

### UNPUDO
- `dc_unpudo_usa_very_short`: `2 / 10` dropped at `filter_bad_paths`
  - reason: `path_pose_mismatch`
- `dc_unpudo_uk_very_short`: `0 / 10` dropped
- `ca_short_unpudo_usa`: `7 / 10` dropped at `filter_bad_paths`
  - reason: `path_pose_mismatch`
- `pre_ca_unpudo_usa`: `9 / 10` dropped at `filter_bad_paths`
  - reason: `path_pose_mismatch`
- `pre_ca_unpudo_uk`: `10 / 10` dropped, but the current harness still does not attribute a reason for this bucket
  - likely still an uninstrumented drop path upstream or inside a stage not yet patched

### UNPARK
- `dc_unparking_uk_very_short`: `3 / 10` dropped at `filter_bad_paths`
  - reason: `path_pose_mismatch`
- `dc_unparking_usa_very_short`: `0 / 10` dropped
- sampled CA and Pre-CA unparking leaf buckets in this pass: `0 / 10` dropped

## Interpretation
The strongest signals are:
1. **Short numeric path is a real hard drop in PUDO**
   - `dc_pudo_uk` is failing exactly on the `200m requested future path vs ~43–49m available path` issue.
2. **`filter_bad_paths` is removing a meaningful fraction of non-driving CA / pre-CA samples**
   - especially `ca_short_unpudo_usa` and `pre_ca_unpudo_usa`
   - also some `dc_unparking_uk_very_short` and `dc_unpudo_usa_very_short`
3. **There is still at least one unattributed silent drop path**
   - `pre_ca_unpudo_uk` is the clearest example
   - this needs one more instrumentation pass if we want a completely closed ledger

## Practical next steps
1. Run the same harness on the actual branch/config under investigation if it differs from `parking_bc_D26_3_6_datamodule`.
2. Decide whether `filter_bad_paths` should be bypassed for parking-related and/or pre-CA unparking buckets.
3. Extend instrumentation to close the remaining silent-drop path for `pre_ca_unpudo_uk`.
4. If needed, run a larger sampled pass (`50`) or a full pass (`0`) once the remaining silent drop is instrumented.

## Migrated bucket audit (`parking_bc_datamodule`)
Ran a separate sampled audit over the exact migrated bucket list in `parking_bc_datamodule`:

- Datamodule: `parking_bc_datamodule`
- Mode: `parking_bc_train_release_2026_5_11`
- Groups audited: `pudo`, `unpudo`, `unpark`
- Sampling cap: `100` source samples per bucket

Artifacts:
- Combined report: `/tmp/parking_otf_drop_audit_migrated_sampled_100_combined.md`
- PUDO summary source: `/tmp/parking_otf_drop_audit_allbuckets_100/parking_bc_datamodule_20260420_135411/summary.md`
- UNPUDO summary source: `/tmp/parking_otf_drop_audit_unpudo_100/parking_bc_datamodule_20260420_140207/summary.md`
- UNPARK summary source: `/tmp/parking_otf_drop_audit_unpark_100/parking_bc_datamodule_20260420_140744/summary.md`

Key findings:
- `dc_pudo_uk`: `72 / 100` dropped, all `path_requested_distance_out_of_range`
- `dc_pudo_usa`: `13 / 100` dropped, but the current ledger did not attribute a dominant reason
- `ca_short_pudo_uk`: `12 / 100` dropped, all `parking_strip_leading_standstill_failed`
- `pre_ca_pudo_uk`: `16 / 100` dropped, but the current ledger did not attribute a dominant reason
- `dc_unpudo_usa`: `11 / 100` dropped, visible attributed reason `path_pose_mismatch`
- `dc_unpudo_uk`: `1 / 100` dropped, `path_pose_mismatch`
- `ca_short_unpudo_usa`: `7 / 100` dropped, all `path_pose_mismatch`
- `pre_ca_unpudo_usa`: `21 / 100` dropped, all `path_pose_mismatch`
- `dc_unparking_uk`: `46 / 100` dropped, dominated by `path_requested_distance_out_of_range` with additional `load_frame_data_exception`
- `dc_unparking_usa`: `6 / 100` dropped, all `path_pose_mismatch`
- `ca_short_unparking_usa`: `22 / 100` dropped, all `path_pose_mismatch`
- `ca_short_unparking_uk`: `20 / 100` dropped, all `path_pose_mismatch`
- `pre_ca_unparking_usa`: `17 / 100` dropped, almost entirely `path_pose_mismatch`
- `pre_ca_unparking_uk`: `46 / 100` dropped, all `path_pose_mismatch`

Interpretation of the migrated audit:
1. The strongest recurring failure mode is still short future path (`path_requested_distance_out_of_range`) in UK driving PUDO and UK driving UNPARK.
2. The second strongest recurring failure mode is `filter_bad_paths` / `path_pose_mismatch`, concentrated in non-driving UNPUDO / UNPARK CA and pre-CA buckets.
3. `strip_leading_standstill` is visible, but localized rather than global in this sampled migrated pass.
4. A few buckets still show dropped counts without a fully attributed reason in the sampled ledger, so the harness is good enough for dominant patterns but not yet a mathematically closed accounting of every drop.


## 2026-04-20 19:20 UTC Update
- Added bucket-level parking short-path flagging (`_parking_allow_short_path`) and enabled `allow_short_path_for_parking_buckets=True` in parking configs.
- Improved audit harness attribution:
  - split `filter_bad_paths` into `bad_distance_request`, `interpolation_failed`, `path_pose_mismatch`
  - log `_parking_related_early`, `_parking_allow_short_path`, and `short_path_clamp_active`
  - added structured parking internal drop reasons for `strip_leading_standstill`, gear reconstruction / parking mode, and policy-path computation
- Focused datamodule tests passed under `//wayve/ai/si/datamodules:py_test` with filtered selection; Bazel target still fails coverage gate on filtered runs.
- Running sampled migrated-bucket audit (100 samples per bucket):
  - output root: `/tmp/parking_otf_drop_audit_migrated_100_v2/parking_bc_datamodule_20260420_191038`
  - status: still running
- Existing full migrated-bucket audit also running:
  - output root: `/tmp/parking_otf_drop_audit_full_migrated/parking_bc_datamodule_20260420_135013`
  - status: still running
- Current partial signal from sampled run:
  - `dc_pudo_uk` still drops on `path_requested_distance_out_of_range` even when `parking_allow_short_path=True` and `short_path_clamp_active=True`
  - `ca_short_pudo_uk` drops are now attributed to `parking_strip_leading_standstill_failed`
  - `dc_unpudo_usa` / `dc_unpudo_uk` now show attributed `filter_bad_paths_path_pose_mismatch`


## 2026-04-20 19:26 UTC Relocation Update
- Stopped the `/tmp` audit runs.
- Restarted the sequential audit runner with artifacts under `~/tmp`:
  - sampled root: `/home/borisindelman/tmp/parking_otf_drop_audit_migrated_100_v3`
  - full root: `/home/borisindelman/tmp/parking_otf_drop_audit_full_migrated_v3`
- The runner copies summaries into the vault on completion:
  - sampled summary target: `agent_tasks/2026/04/Week-4/2026-04-20-parking-otf-drop-audit-sampled-100.md`
  - full summary target: `agent_tasks/2026/04/Week-4/2026-04-20-parking-otf-drop-audit-full.md`
- Current sampled run session: `12779`


## 2026-04-21 Stop Update
- Stopped the exhaustive full-bucket audit run under `/home/borisindelman/tmp/parking_otf_drop_audit_full_migrated_v3`.
- Reason: the run was progressing extremely slowly and had still only persisted one completed bucket section while burning CPU for an extended period.
- Decision artifact remains the completed sampled run (`100` source samples per bucket) and its vault summary.


## 2026-04-21 speed-up pass
- Patched the Bazel audit harness at `/workspace/WayveCode/wayve/ai/si/scripts/parking_otf_drop_audit.py` to make the audit path intentionally cheaper.
- Changes:
  - `keep_ordered=False` in the audit datamodule override.
  - increased async `buffer_size` from `8` to `64`.
  - disabled partial flushes by default (`--flush-every-n-source-samples=0`).
  - default output root moved to `~/tmp/parking_otf_drop_audit`.
  - added `--bucket-workers` and bucket-level parallelism using `ProcessPoolExecutor` with `spawn` multiprocessing context.
- Verified with a Bazel smoke run:
  - `bazel run //wayve/ai/si/scripts:parking_otf_drop_audit -- --config-name parking_bc_datamodule --groups pudo --max-samples-per-bucket 1 --bucket-workers 2 --output-dir /home/borisindelman/tmp/parking_otf_drop_audit_smoke_fast2`
  - completed successfully and produced summary/jsonl outputs.
- Important note: the harness was already not loading map/radar/lidar and was already patching `insert_camera_data` to avoid image loading. The main new speedups are ordering/buffering, fewer rewrites, and cross-bucket parallelism.


## 2026-04-21 run-id sampling pass
- Added `--max-run-ids-per-bucket` and `--random-seed` to the audit harness.
- Implementation is source-stage only:
  - first pass over bucket metadata collects unique `run_id`s,
  - samples up to `N` run IDs deterministically,
  - rebuilds the source pipe filtered to those run IDs,
  - then runs the normal OTF audit on that reduced source set.
- Verified with a Bazel smoke run:
  - `bazel run //wayve/ai/si/scripts:parking_otf_drop_audit -- --config-name parking_bc_datamodule --groups pudo --max-run-ids-per-bucket 1 --max-samples-per-bucket 2 --bucket-workers 2 --output-dir /home/borisindelman/tmp/parking_otf_drop_audit_smoke_runids`
  - completed successfully and produced summary/jsonl outputs.
- Machine capacity check: `nproc` and `os.cpu_count()` both report `24` logical CPUs.
- Practical recommendation for this workload: start with `6-8` bucket workers rather than `24`, because the audit is mixed Azure IO + Python/serialization overhead, not pure CPU work.
