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
  - Outcome: failed. Flyte fell back to released sampling image `0.1.125`, which did not contain `parking_pudo/anchors` in `DATASET_STORE`.
  - Purpose: regenerate anchor-only materialisation after context signal updates and restored PUDO filters.

- `parking_pudo_default_context_signals_20260610`
  - Dataset: `parking_pudo/default`
  - Workflow: `sample`
  - Execution: `anfd4jj2d4d9ztjdxq8q`
  - Outcome: submitted before the image-tag fix, so it likely used released image `0.1.125`; superseded by the v2 run below.
  - Purpose: regenerate full materialised training dataset with the same context signal updates.

- `parking_pudo_anchors_context_signals_20260610_v2`
  - Dataset: `parking_pudo/anchors`
  - Workflow: `sample`
  - Execution: `arxtjfq56rw2cpgdgpkc`
  - Outcome: submitted after retagging the branch image to the exact local-build tag expected by Flyte.

- `parking_pudo_default_context_signals_20260610_v2`
  - Dataset: `parking_pudo/default`
  - Workflow: `sample`
  - Execution: `avhqj2wjj7v9577tl5nx`
  - Outcome: submitted after retagging the branch image to the exact local-build tag expected by Flyte.

## Notes

- Published from the clean detached worktree to avoid including unrelated dirty event-viewer/debug files from `/workspace/WayveCode`.
- `make publish-test` initially blocked waiting for a WayveMeta branch for the merge-base metadata. Retried with `IN_WAYVE_META_UPDATE=1` to use placeholder service metadata and unblock image publication.
- Flyte's image resolver expected local tag `borisindel-tmp-build-0.1.125-b2f7351b05892e1f899e9b53554e05ae2bb5959a-72c03`, while `make publish-test` published the unsuffixed tag. Added the expected tag with `crane tag` against digest `sha256:0b29d511c77dddddfbbff37a6636f7cf035bb962ddcd0c5581ca7f21580d3bd0` before v2 submissions.
