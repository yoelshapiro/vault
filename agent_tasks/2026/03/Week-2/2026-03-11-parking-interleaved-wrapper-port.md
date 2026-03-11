# 2026-03-11 — Parking interleaved wrapper/code port onto soham branch

## Context
- User request: fork from `soham/parking-training`, add only the latest interleaved deployment code from `boris/interleaved/updated_pudo_15_02_26`, commit, and push upstream without opening a PR.
- New branch: `03-11-parking-interleaved-wrapper` (from `origin/soham/parking-training`).
- Source branch for port: `origin/boris/interleaved/updated_pudo_15_02_26`.
- Commit: `28c7a01c0cf`.
- PR: none.

## What changed
- Added interleaved deploy entrypoint:
  - `wayve/ai/si/deploy_interleaved_models.py`
- Added route-based interleaving wrapper:
  - `wayve/ai/zoo/deployment/interleaving_stopping_wrapper.py`
- Wired BUILD targets minimally for the above:
  - `wayve/ai/si/BUILD` (added `py_binary(name = "deploy_interleaved_models")`)
  - `wayve/ai/zoo/deployment/BUILD` (added `interleaving_stopping_wrapper.py` to `deployment` library srcs)

## Validation
- `bazel build //wayve/ai/si:deploy_interleaved_models //wayve/ai/zoo/deployment:deployment` ✅
- Branch pushed: `origin/03-11-parking-interleaved-wrapper` ✅

## Notes
- Intentionally did not add/create `deploy_interleaved.py` target/file; only the interleaved models path was ported.
- Existing untracked workspace files were left untouched.
