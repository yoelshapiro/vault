# 2026-07-28 Parking/PUDO P2P Materialisation

## Summary

Added P2P-phase-based rejection of gear-derived false-positive `park` events,
strengthened materialisation validation, and completed a full
`parking_pudo/parking` materialisation.

## Code Outcome

- Branch: `yoel/generic_w_p2p_qa`
- Commits:
  - `cd3a4c0b483b` — veto `park` anchors when the aligned P2P prediction is
    `other` with score `>= 0.9`.
  - `ee659895b584` — fix configured run-tag filter bindings, use the correct
    two-part P2P table name, add runtime-route regression coverage, and update
    documentation.
- P2P source: `inferred__scenario.embeddings_head_p2p_phase`
- Join contract:
  - exact `run_id`;
  - nearest timestamp in either direction;
  - maximum timestamp distance of 2 seconds;
  - `max_label_name` becomes `p2p_phase`;
  - `max_value` becomes `p2p_phase_score`.
- The P2P veto applies only to `event_type="park"`; PUDO selection is unchanged.

## Validation Lessons

- Test the effective configured callable, not only its symbol or membership in
  a filter list. A bare `select_allowed_run_tags` reference passed identity
  checks but failed remotely because its required `allowed_tags` argument was
  unbound. Binding every configured filter against the runtime's single
  dataframe argument catches this class of failure locally.
- For joined side tables, declaration assertions are necessary but insufficient.
  Minimal tests should execute `resolve_wayve_delta_table`, preprocessing,
  as-of joining, and the downstream filter route.
- A two-part Wayve Delta table name is the correct input to the resolver here.
  The three-part `prod_data_pipeline...` name does not match the resolver's
  database/table contract.
- Keep a feature-specific canary registry and revalidate the candidate before
  reuse. The P2P false-positive canary is
  `fme10010/2026-06-07--22-04-42--gen2-av-c1c185e6-31f7-42dd-8ef1-0a02779e53d0`;
  it had 22,101 confident `other` frames when checked on 2026-07-27.

## Flyte And Grafana Lessons

- Driver completion is not workflow completion. Always confirm node and
  execution phases through Flyte before concluding that a stage succeeded.
- Execution `abj9b2jsx526lznvdhsf` exposed a Spark/Flyte reconciliation
  inconsistency: the Spark driver completed `get_partitions` successfully in
  64 seconds and exited with code 0, but the Spark application and Flyte `n0`
  remained `RUNNING`, so `n1` could not start. There was no reliable ETA; a
  fresh execution was required.
- Flyte `Reason` text can also be stale in the opposite direction. During the
  successful rerun, `n1` continued to say `cluster is creating` while Grafana
  showed sustained Ray work. Use node phase together with recent meaningful
  logs, autoscaler state, and task completions.
- `RuntimeError: Loop is not running` from fsspec weakref cleanup is a teardown
  artifact when it appears after outputs or success logs. It is not causal
  unless the task or workflow also records failure.
- For these production sampling pods, `wayve-loki` contained the useful Flyte,
  Spark, and Ray logs. When `execution_id` is not populated as a stream label,
  locate the execution by content/pod prefix and then narrow to exact pods.
- High RSS and occasional object spilling are pressure signals, not failures by
  themselves. The successful rerun reached roughly 184 GiB peak RSS on some
  partition tasks and spilled 2.5 GiB once, while continuing without OOM,
  preemption, node loss, or Ray task errors.

## Materialisation Result

- Command:

```bash
bazel run //wayve/ai/services/sampling:workflow -- remote run filter_and_bucket_stage \
  --dataset_name parking_pudo/parking \
  --job_name p2p_park_full_20260727_rerun_2303
```

- Image digest:
  `sampling@sha256:39fe112e6b9a5cc9e875e203417726f46dd899eea3ad71e1f83e176bfa77fe21`
- Flyte execution:
  `amjcnj4d246qw9m9pfzk`
- Result: `SUCCEEDED`
- Spark `n0`: 6m20s
- Ray `n1`: 1h33m51s
- Partitions: 309/309 completed, 0 failures
- Output:
  `abfss://datasets@wayveproddatasetflat.dfs.core.windows.net/sampling_materialised/parking_pudo/parking/dev/p2p_park_full_20260727_rerun_2303__2026-07-27-23-19`

## Anchors-Only Commit Comparison

Ran the full `parking_pudo/anchors` workflow for 2026-06-01 through
2026-06-30 from the fixed branch and from the pre-branch main commit. Images
were built from detached worktrees and explicitly pinned using short immutable
ACR tags because Flyte copies image tags into a Kubernetes label with a
63-character value limit.

- Fixed commit `ee659895b584`:
  - Flyte execution: `a55622hqp282swsdrs95`
  - Result: `SUCCEEDED` in 51m52s
  - Get partitions: 3m07s
  - Ray filter/bucket: 40m05s
  - Spark balance: 5m00s
  - Final materialisation/comparison: 3m24s
  - The two-part P2P table
    `inferred__scenario.embeddings_head_p2p_phase` was exercised on every
    partition.
  - Output:
    `abfss://datasets@wayveproddatasetflat.dfs.core.windows.net/sampling_materialised/parking_pudo/anchors/dev/anchors_june_2026_ee659895_exact__2026-07-28-12-08`
- Pre-branch commit `b1b5b86ffd7e`:
  - Flyte execution: `aqmh84pgmzzr2wkrtc9r`
  - Result: `FAILED` in 35m17s
  - All six partitions deterministically failed with
    `TypeError: select_allowed_run_tags() missing 1 required positional argument: 'allowed_tags'`.
  - Flyte and Grafana showed a user-code failure with no infrastructure cause.
  - Partial output:
    `abfss://datasets@wayveproddatasetflat.dfs.core.windows.net/sampling_materialised/parking_pudo/anchors/dev/anchors_june_2026_b1b5b86_exact__2026-07-28-12-17`

This A/B run confirms that the configured run-tag binding fix removes the
historical runtime blocker. The fixed branch was slower during mask processing,
as expected from the additional P2P as-of join, but it made steady progress.

### P2P-Disabled Baseline

Commit `6e3ab999424d` temporarily disabled both the P2P join and confident
`other` veto while retaining the configured run-tag binding fix.

- Flyte execution: `a7s5pp2zqtlzqj5b6hkr`
- Image digest:
  `sampling@sha256:514d5853731da9a885307993dd36accc23ffa02289f0f6fe64d5461047ae922a`
- Result: `SUCCEEDED` in 43m18s, 8m34s faster than the P2P-enabled run
- Get partitions: 5m15s
- Ray filter/bucket: 31m08s, 8m57s faster than the P2P-enabled run
- Spark balance/materialise: 3m04s
- Final validation/comparison: 3m32s
- Six partitions completed with 4,874 run IDs and 246,969,445 rows in total.
- A Grafana search across 607,637 log lines found zero occurrences of
  `inferred__scenario.embeddings_head_p2p_phase`, confirming that the disabled
  baseline did not read the P2P table.
- Output:
  `abfss://datasets@wayveproddatasetflat.dfs.core.windows.net/sampling_materialised/parking_pudo/anchors/dev/anchors_june_2026_6e3ab999_p2p_disabled__2026-07-28-13-21`

## Training Configuration Port

Recreated `yoel/23-07-pudo-parking_w_p2p_qa` from the P2P-enabled
`yoel/generic_w_p2p_qa` tip `ee659895b584`, instead of basing it on the much
older `boris/23-07-pudo-parking-varient` history. This preserves the current
sampling implementation and avoids importing hundreds of unrelated SI
configuration changes.

Ported only Boris's multi-source Parking BC mechanism:

- added the P2P materialised root and six `p2p_bc_park_in/out` buckets;
- selected non-driving partitions by membership in the configured root tuple;
- assigned P2P data weight `0.06` and rebalanced the existing non-driving
  groups so the complete driving/non-driving training mix remains `1.0`;
- added a regression test proving that both PUDO and P2P roots survive the
  new-driving datamodule rebuild.

Focused multi-source, existing parking-release resolution, Ruff, and Flake8
checks passed. The port was committed as `ca5832ebc45a` and pushed to
`origin/yoel/23-07-pudo-parking_w_p2p_qa`.

### New Park Materialisation Training Root

Verified that the P2P-filtered parking-only run has both `train` and
`validation` partitions under:

`abfss://datasets@wayveproddatasetflat.dfs.core.windows.net/sampling_materialised/parking_pudo/parking/dev/p2p_park_full_20260727_rerun_2303__2026-07-27-23-19/dataset`

The training configuration now treats this as a separate park source rather
than replacing the existing PUDO root: park/unpark-named partitions use the
new root, PUDO/UnPUDO partitions retain the old `parking_pudo/default` root,
and the root-aware non-driving allowlist includes both plus the standalone P2P
training source. The output contains the expected `dc_park`, `dc_unpark`,
gear-change, CA, and pre-CA parking buckets for both splits.

Exact train/validation bucket-set tests verify the park and UnPUDO families,
their separate roots, their `park_unpark`/`pudo_unpudo` tracking groups, the
P2P source, and the total training weight of `1.0`. The focused test, existing
Parking 2026-05-21 config-resolution test, Ruff, and Flake8 all passed.

## Training Validation Ladder

Prepared to train `parking_bc_train_release_2026_5_21` on eight H100 nodes, but
stopped before submission because the data-access canary found a real
configuration blocker.

### Stage 1: Configuration and Unit Checks

- Added a Hydra-resolved regression check proving the final training mode maps:
  - park/unpark buckets to the new P2P-filtered parking root;
  - UnPUDO buckets to the retained `parking_pudo/default` root;
  - standalone P2P buckets to the retained `bc/p2p` root.
- Exact bucket-set tests, release-mode resolution, Ruff, and Flake8 passed.
- Committed and pushed the guard as:
  `582c4f6d6f0d Validate resolved parking bucket roots`.

### Stage 2: Real Data Canaries

All five representative bucket directories contained parquet manifests.
Real decoded batches were successfully produced for:

- train `dc_park_usa` from the new parking root;
- train `dc_unpudo_usa` from the retained PUDO root;
- validation `dc_park_usa`;
- validation `dc_unpudo_usa`.

The unmodified release mode failed to produce a P2P batch from
`p2p_bc_park_in_usa`. It requests an 800-point path (about 200 m), while
sampled P2P rows frequently have much shorter available paths. Fifteen
`DistanceOutOfRangeException`s exhausted the path loader's error budget.

The repository's official `parking_bc_train_p2p` recipe uses the same P2P root
with `allow_short_path=True`. A temporary canary proved that this setting alone
is sufficient: with the existing strict `filter_bad_paths_thresh` unchanged,
the P2P source produced a complete 97-key batch with six-camera tensors, an
800-point padded path, and parking/unparking labels.

The correction was deliberately scoped to the P2P source rather than enabling
short paths for the complete datamodule. `OtfDrivingDataModule._initialise_pipe`
now pads short paths when the resolved root contains
`/sampling_materialised/bc/p2p/`; non-P2P sources retain their existing
behavior. A parametrized test covers implicit P2P enablement, an unchanged
non-P2P source, and the existing explicit override.

The real P2P canary then produced a complete 97-key batch without a temporary
configuration override. The focused unit test, resolved configuration tests,
Ruff, and Flake8 passed. The monolithic datamodule suite's new cases also
passed; its remaining failures were unrelated read-only `/home/nobody` and
external binary/SARSA fixture failures.

### Additional Baseline Defects Found by the Ladder

The local training gates found three independent defects already present in
the ported Parking release configuration:

- `GearDirectionSTAdaptor` was passed the stale keyword
  `dropout_token_probability`; corrected to `dropout_probability` and covered
  by resolved-config assertions.
- `ParkingDataConfig` was constructed eagerly, so Hydra `_convert_: all`
  converted it into a dictionary before OTF setup; changed to a Hydra
  `builds(ParkingDataConfig)` target and asserted the instantiated runtime
  type.
- the generated scripted Parking deployment wrapper could not see inherited
  gear constants; `REVERSE_DRIVE_POSITION` and `NEUTRAL_DRIVE_POSITION` are
  now redeclared alongside `PARK_DRIVE_POSITION` as `torch.jit.Final[int]`,
  with the Parking wrapper forward-pass test exercising TorchScript.

The fixes were committed and pushed through
`f0e72c0f0d88 Make parking wrapper gear constants scriptable`.

### Stage 3: One-Batch Local Overfit

Passed 10/10 optimizer steps. The run resolved the intended mixed roots, read
the P2P source using only source-specific padding, exported TorchScript at
steps 0 and 10, saved the checkpoint, and exited successfully. The low unique
sample warning was expected because this gate intentionally repeated one
fixed batch.

### Stage 4: Short Normal Local Run

Passed 100/100 optimizer steps with four OTF data workers and real mixed
samples. The pipeline continuously replenished data while rejecting malformed
individual source samples as designed, saved the final checkpoint, exported
TorchScript, and exited successfully.

### Stage 5: One-Node AKS Canary

Submitted a 100-step canary to one DGX-H100 node (eight GPUs), P1, with zero
automatic restarts:

- Surfboard job: `200168`
- Job name: `indigo-proficient-bear-200168`
- Session:
  `session_2026_07_28_22_52_51_si_parking_bc_train_release_2026_5_21_p521canary`
- Image:
  `wayvetraining.azurecr.io/scaled-intelligence:f0e72c0f0d8807ce3696560d0788cdceb4fe998b`
- Result: `Completed`, 100/100 steps
- Runtime: 22:58–23:10 UTC
- All eight NCCL ranks initialized and saved their compile caches.
- Rank 0 stderr was empty; the final communicator teardown completed normally.

### Stage 6: Full Eight-Node Training

After the canary passed terminally, launched the requested full release
training on eight DGX-H100 nodes (64 GPUs), P1, with zero automatic restarts:

- Surfboard job: `200175`
- Job name: `aardvark-amaranth-luminescent-200175`
- Session:
  `session_2026_07_28_23_13_21_si_parking_bc_train_release_2026_5_21_p521`
- Image:
  `wayvetraining.azurecr.io/scaled-intelligence:f0e72c0f0d8807ce3696560d0788cdceb4fe998b`
- State at handoff: `Running` from 23:18 UTC on
  `aks-prod-training-2-swe.nd96h100c`
- Rank 0 logs show successful resolved-root setup, OTF initialization, managed
  identity authentication, and WFM checkpoint loading with no immediate launch
  failure.

#### Full-training failure post-mortem

Job `200175` failed at step 42,656 after roughly 4 h 42 min of active training.
The first application error occurred on global rank 22 at 03:59:57 UTC:

- `VehiclePreInterventionAugementor` rejected more than its configured
  `max_errors=15` consecutive samples. The same node logged many short-path
  `DistanceOutOfRangeException`s immediately beforehand, alongside frequent
  `more_than_one_intervention` rejections.
- There is a control-flow trap in the existing augmentor: the
  `DistanceOutOfRangeException` handler increments `consecutive_errors` and
  then `continue`s before the max-error check. The counter can therefore grow
  beyond 15 silently; the next `InterventionException` reaches the check and
  raises, even though it is only the final member of the accumulated streak.
- That raised `RuntimeError: Too many consecutive errors raised` inside
  DataLoader worker 4.
- The GPU-video prefetch thread propagated it as
  `RuntimeError: Prefetch thread exited with an error`.
- Rank 22 stopped participating in distributed collectives. The remaining
  ranks subsequently emitted 30-minute NCCL `BROADCAST`/`ALLREDUCE` watchdog
  timeouts around sequence 2,102,086 at 04:30 UTC. Those NCCL errors were
  teardown fallout, not the initiating failure.

The evidence points to the pre-existing generic intervention augmentation
stream rather than the new P2P parking materialisation: the warnings are
present from startup and reference a broad mix of historical AV/interleaved
runs from 2021–2026. The changed parking source did resolve correctly to the
P2P-filtered root. A 100-step, one-node canary did not exercise enough samples
to encounter the rare 16-error streak.

Recommended next action: retry once because the failing streak depends on
randomly sampled data. If it recurs, investigate the intervention bucket's
multi-intervention rate and make the augmentor skip malformed samples without
terminating a long distributed run, rather than changing the P2P parking
source.

## Cursor transition

Added and pushed a portable Cursor bootstrap to the personal `assets`
repository at commit `c456d2f`:

- installs all ParkingSkills globally through symlinks;
- exposes the existing Codex prompts as Cursor commands;
- configures the same Wayve MCP endpoints using environment-variable
  credentials;
- documents that WayveCode project rules, skills, hooks, `AGENTS.md`, and MCPs
  are already generated from `.ai/` by `lnai`.

The bootstrap was applied and validated on the remote VM: Cursor Agent
discovered 17 global skills, eight commands, and 14 MCP servers. The laptop can
apply the same setup after updating `~/git/assets` and `~/git/ParkingSkills`
with `~/git/assets/cursor/setup.sh`.

## Standalone Event Backfill PR

- Branch: `yoel/p2p_event_backfill`
- PR: `wayveai/WayveCode#129802`
- Latest validation commit: `24a19f7275d4`
- Default output:
  `abfss://datasets@wayveproddatasetflat.dfs.core.windows.net/sampling_materialised/parking_pudo/default/dev/p2p_events_backfill`
- A complete-day canary for 2026-07-27 passed 406/406 unique output runs in
  about 4m16s, including 110s of odometry and a 4.7s atomic Delta write. It had
  exact date coverage, zero invalid clusters/orderings, and zero null countries.
- The routine validation ladder is one complete day. Use one complete week only
  for material performance changes or the pre-backfill scale gate.
- If the daily gate fails, add a deterministic 10-run diagnostic smoke tier
  biased toward known edge cases; do not treat 10 runs as a replacement for the
  full-day correctness gate. The known P2P false-positive canary run already
  recorded above is one candidate for that set.
