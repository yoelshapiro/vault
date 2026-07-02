# 2026-07-02 PR 120390 Stateless EOR Hysteresis

## Summary

Updated PR `wayveai/WayveCode#120390` (`06-22-si-group-interleave-control-support`) to use stateless end-of-route hysteresis for SI interleave control.

## Change

- Added `END_OF_ROUTE_EXIT_THRESHOLD = 4.5e4`.
- Kept `END_OF_ROUTE_THRESHOLD = 3.75e4`.
- For driving/default interleave group, `interleave_control` is true when route signal is below the enter threshold.
- For parking interleave group, `interleave_control` is true only when route signal is above the exit threshold and speed is above `HANDOVER_SPEED_MS`.
- Removed the previous parking-group polarity of `end_of_route OR low_speed`.
- Updated regression coverage in `test_deployment_wrapper_codegen.py`.

## Branch

- PR: `#120390`
- Branch: `06-22-si-group-interleave-control-support`
- Commit: `1ed05d9ec195`

## Validation

Passed:

```bash
IN_WAYVE_META_UPDATE=1 WAYVECODE_MAIN_COMMIT_META_OVERRIDE=$(git rev-parse --short=12 HEAD) \
  bazel test //wayve/ai/zoo/deployment:test_deployment_py_test \
  --test_arg='-k=test_interleave_control_uses_stateless_end_of_route_hysteresis or test_make_wrapper_class_adds_interleave_control_output_and_preserves_fields'
```

Notes:

- The first Bazel attempt failed during repository setup with `OSError: [Errno 28] No space left on device` while extracting `pyspark`.
- Freed space by deleting task-owned old Bazel output bases from previous stateless EOR redeploy worktrees, then reran successfully.
- PR checks were queued after push.

## Frog Resume Training Batch

Started three resumed Parking/PUDO training runs from `frog-bronze-tessellated` using the same stateless EOR hysteresis behavior:

- `END_OF_ROUTE_THRESHOLD = 3.75e4`
- `END_OF_ROUTE_EXIT_THRESHOLD = 4.5e4`

### Branch

- Worktree: `/tmp/wayvecode-frog-eor-train`
- Branch: `boris/parking-frog-eor-hysteresis-trains`
- Commit: `3d579bdcb039736a2f21ae0de01f40384e5ee63a`
- Image: `wayvetraining.azurecr.io/scaled-intelligence:3d579bdcb039736a2f21ae0de01f40384e5ee63a`
- Source session: `session_2026_06_30_10_46_01_harqolr81wb2`
- Restart step: `100000`
- Target training limit: `200000`

### Training Ledger

| Variant | Job id | Session | Nodes | Data change | Monitor |
| --- | --- | --- | --- | --- | --- |
| `frog-eor-hyst-n8-100k` | `187862` | `session_2026_07_02_20_43_18_si_parking_bc_train_release_2026_5_21_frog-eor-hyst-n8-100k` | 8 | Original 50% driving / 50% parking | Mill |
| `frog-eor-hyst-driving70-100k` | `187863` | `session_2026_07_02_20_45_21_si_parking_bc_train_release_2026_5_21_frog-eor-hyst-driving70-100k` | 4 | 70% driving / 30% parking | Volta |
| `frog-eor-hyst-rawgear-100k` | `187864` | `session_2026_07_02_20_46_30_si_parking_bc_train_release_2026_5_21_frog-eor-hyst-rawgear-100k` | 4 | PUDO/UNPUDO root `abfss://datasets@wayveproddatasetflat.dfs.core.windows.net/sampling_materialised/parking_pudo/default/dev/parking_pudo_default_raw_gear_window_20260617__2026-06-17-08-18/dataset` | Lorentz |

### Monitor Plan

- Each monitor agent owns one job.
- Success gate: observe global training step `>=101000`.
- Failure handling: investigate and retry/fix up to three times for the assigned run.
- Slack updates go to Boris on monitor start, failure/retry/fix, and pass.
- After the success gate, update the Parking/PUDO Notion model-card table with branch and run details.

### Monitor Ledger - `frog-eor-hyst-driving70-100k`

- Owner agent: Volta.
- Job id: `187863`.
- Job log name: `lavender-omnivorous-butterfly-187863`.
- Session: `session_2026_07_02_20_45_21_si_parking_bc_train_release_2026_5_21_frog-eor-hyst-driving70-100k`.
- Purpose: restart from `frog-bronze-tessellated` checkpoint, 70% driving / 30% parking data, 4 H100 nodes, target 100K additional steps.
- Expected code behavior: stateless EOR hysteresis with `END_OF_ROUTE_THRESHOLD = 3.75e4` and `END_OF_ROUTE_EXIT_THRESHOLD = 4.5e4`.
- Expected datamodule: `parking_diffusion_driving70_datamodule` with train group ratios `driving=0.7`, `parking=0.3`.
- Success gate: observe W&B `trainer/global_step >= 101000`.
- Start update sent to Boris: https://wayve-ai.slack.com/archives/D09SNLZT7PA/p1783025353144009.

| Time UTC | Surfboard state | W&B step | Outcome / notes |
| --- | --- | ---: | --- |
| 2026-07-02 20:53 | `Running` | `0` | Started monitoring. Verified branch `boris/parking-frog-eor-hysteresis-trains`, commit `3d579bdcb039736a2f21ae0de01f40384e5ee63a`, expected job command, datamodule override, restart session dir, and restart step. |
