# 2026-06-10 Parking/PUDO Context Signal Flyte Runs

- Branch: `boris/pudo_generic_materialization`
- Clean worktree: `/workspace/pudo_flyte_clean`
- Commit: `b2f7351b05892e1f899e9b53554e05ae2bb5959a`
- Published image: `wayveacrprodflyte.azurecr.io/sampling:borisindel-tmp-build-0.1.125-b2f7351b05892e1f899e9b53554e05ae2bb5959a`
- Dataset config: driving binary `3.0.68`, `2025-12-01` to `2026-06-07`

## Run Ledger

- `parking_pudo_anchors_context_signals_20260610`
  - Dataset: `parking_pudo/anchors`
  - Workflow: `sample`
  - Execution: `a9wgjls2rgpc4wx96d8v`
  - Purpose: regenerate anchor-only materialisation after context signal updates and restored PUDO filters.

- `parking_pudo_default_context_signals_20260610`
  - Dataset: `parking_pudo/default`
  - Workflow: `sample`
  - Execution: `anfd4jj2d4d9ztjdxq8q`
  - Purpose: regenerate full materialised training dataset with the same context signal updates.

## Notes

- Published from the clean detached worktree to avoid including unrelated dirty event-viewer/debug files from `/workspace/WayveCode`.
- `make publish-test` initially blocked waiting for a WayveMeta branch for the merge-base metadata. Retried with `IN_WAYVE_META_UPDATE=1` to use placeholder service metadata and unblock image publication.
