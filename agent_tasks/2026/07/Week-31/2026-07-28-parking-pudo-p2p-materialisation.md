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

