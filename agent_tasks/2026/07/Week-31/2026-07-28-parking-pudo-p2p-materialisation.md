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
checks passed. The changes remain uncommitted for review.

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
