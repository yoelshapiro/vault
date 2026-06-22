# 2026-06-22 PUDO Yellow Baseline Draft PR

## Summary

Created draft PR `#120214` from branch `boris/26-06-22-pudo-baseline` to `main`.

## Details

- Resolved `yellow-cheetah-sparkling` through Model Catalogue to session `session_2026_06_17_19_32_49_si_parking_bc_train_release_2026_5_21_ndpudo`.
- Confirmed the yellow model source commit is `b8703e56c2b7636b60da22e4d0d7e468f9f0217b`.
- Created `boris/26-06-22-pudo-baseline` at that commit, excluding the later 5.11 unified-LR training commits.
- Verified `parking_bc_release_2026_5_11_cfg.output_adaptor_lr` remains `1e-5` and no `output_adaptor_lr=None` diff is present.
- Pushed the branch and opened draft PR: https://github.com/wayveai/WayveCode/pull/120214

## Verification

- `gh pr view 120214` confirmed draft status, base `main`, and head `boris/26-06-22-pudo-baseline`.
- `git status --short --branch` showed the PR branch tracking origin with only pre-existing untracked `.ai/skills/obs-flyte-execution/`.
