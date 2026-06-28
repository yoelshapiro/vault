# 2026-06-28 Parking Model Lifecycle Dashboard

- Topic: New web tool that, per user (email), shows all recent models and their parking lifecycle stage/status (training → trained → licensed → on-road).
- Labels: parking, pudo, tooling, dashboard, fastapi, model-catalogue, lifecycle.
- Branch: `boris/parking-lifecycle-dashboard` (worktree at `/workspace/parking-lifecycle-dashboard`, off `origin/main`).
- PR: none yet.
- Change type: New internal tool (read/monitor first; one future write action).
- Areas: `wayve/ai/parking/tools/lifecycle_dashboard/` (new).

## What & why

Tracking a parking model across training (Surfboard/W&B), the Console model page, Model CI,
licensing, and on-road experiments meant hopping between many surfaces. This tool gives a
single per-user view. It is **read/monitor first** — it does **not** redeploy models (that
needs a WayveCode env with the checkpoint); instead it surfaces commit id + branch. The one
planned write action (on-road experiment create with interleave/controller) is Phase 3.

Planned with `~/.claude/plans/structured-floating-minsky.md` (approved). Decisions confirmed
with Boris: standalone FastAPI app; background poller + SQLite cache; "note" = the **Console
model-page note** (not Notion), required before on-road licensing/experiments; show **all**
recent models for the user.

## Architecture

`FastAPI + Jinja2 + vanilla JS` (mirrors `wayve/ai/parking/tools/event_clip_viewer`). A
background asyncio **poller** refreshes each watched user's snapshot into **SQLite**; pages
read the snapshot so loads are instant. Per-source upstream errors are recorded on the card
and surfaced as badges (never faked). Reads hit the Model Catalogue REST API unauthenticated
from the internal network (same as Model Garage). Catalogue authors are handles, so
`boris.indelman@wayve.ai` → author `boris.indelman`.

Data sources (all confirmed live): `/v2/models/list` (list + author + tags),
`/v3/model/{id}` (checkpoints, steps, metadata), `/v2/model/{id}/notes`,
`/v2/model/{id}/{ckpt}/{licenses,license_logs,runs}`. Links: Console (model/run/experiment),
W&B (from `metadata.url_links`), Datadog logs, best-effort Foxglove.

## Changes

- Scaffolded the tool under `wayve/ai/parking/tools/lifecycle_dashboard/` (22 files, ~1.4k Py LOC):
  - `clients/model_catalogue.py` (thin I/O), `clients/links.py` (URL builders).
  - `lifecycle.py` (pure: stage derivation, license status missing/waiting/finished/revoked,
    commit/branch/W&B/BC-RL extraction, card assembly).
  - `store/` (SQLite snapshot: `model_cards` + `poll_state`), `poller.py` (asyncio refresh loop).
  - `app.py` (FastAPI: `/`, `/model/{id}`, `/api/{overview,model,refresh,health}`), `run.py`.
  - `templates/` (base/overview/model_detail) + `static/` (styles.css, app.js) — dark "ops" theme.
  - `BUILD` (py_library/py_binary/py_checks/js_checks), `.eslintrc`, `README.md`, `start_dashboard.sh`.
  - `test/` (test_lifecycle, test_store, test_clients) — hermetic.

## Resolved Phase-0 spikes

- Per-user list: `/v2/models/list` (no server-side author filter) + filter by handle.
- Training step: `checkpoints[].num_steps_completed`. W&B URL: `metadata.url_links[]`.
- BC/RL family: reused Model Garage inference. Note: `ModelLifecycleNote` purpose `model_change_note`.
- License statuses are only `success`/`revoked` → mapped to missing/waiting/finished/revoked via logs.

## Verification

- `bazel test //wayve/ai/parking/tools/lifecycle_dashboard:all` → green: `py_test`, `py_lint_ruff`,
  `py_lint_flake8`, `ty`, `static_checks_eslint`.
- Live smoke (server on :3011, poller against live Model Catalogue): health OK; refresh of
  `boris.indelman` fetched 6 models in ~8s with **zero source errors**; stages derived
  (5 trained, 1 licensed); commit ids matched the source branch commits (e.g.
  `acrobatic-rose-cobra` → `949bb24ae3`); branches/notes/license status correct; overview and
  detail pages return 200 with all sections rendering. Deployed model with different metadata
  shape degraded gracefully (no commit/branch, no error).

## Follow-ups (not in this milestone)

- Model CI status (Buildkite build per artefact) — Phase 2.
- On-road experiment create (interleave + controller) via `POST /v1/public/on_road_experiments` — Phase 3 (real write; needs Entra bearer).
- W&B live training state, `model_pipeline_progress` ingestion step, confirmed Foxglove URL.
