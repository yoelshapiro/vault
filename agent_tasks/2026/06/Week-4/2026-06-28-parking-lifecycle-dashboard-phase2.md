# 2026-06-28 Parking Lifecycle Dashboard — Phase 2

- Topic: Extend the parking model lifecycle dashboard with date-range lookup, split Model-CI vs per-geo licensing, write actions, a runs calendar, and a lineage tab.
- Labels: parking, pudo, tooling, dashboard, model-catalogue, model-ci, on-road-experiments, lineage.
- Branch: `boris/parking-lifecycle-dashboard` (worktree off main). Commit `5879cf6afb2c`, pushed to origin. No PR yet.
- Change type: Feature expansion of an internal tool (reads + gated writes).
- Areas: `wayve/ai/parking/tools/lifecycle_dashboard/` (clients/, lifecycle.py, poller.py, store/, app.py, templates/, static/, tests).

## What & why

Phase 1 gave a per-user overview + per-model detail. Phase 2 adds the lifecycle gates the
team actually acts on and the navigation Boris asked for. Researched first via a parallel
workflow (Model CI trigger, per-geo licensing, on-road create payload, write-auth, runs-by-day)
plus a lineage-extraction agent; then implemented with the research's recommended defaults.

## Changes

- **Date-range lookup** (Overview): `date_from`/`date_to` pickers, default = today-21d..today;
  `model_date` parsed from the session id; filtered server-side.
- **Two split checks** (replacing the single license badge):
  - **Model CI** per gen2 artefact from `…/{ckpt}/modelci_builds` → passed/running/failed/missing/unknown.
  - **Per-geo licensing** (UK/US/JPN/DEU) from `…/on_road_experiments?model_session_id=&checkpoint_num=&artefact_id=`,
    filtered to 'licens' experiments, bucketed by geo (name/tag heuristic), completed=passed; chips link to the experiment.
- **Write actions** (each via confirm + exact-payload preview; `ENABLE_WRITES` flag; Entra bearer via az/DefaultAzureCredential):
  - Run Model CI (gen2 alpha3): `POST /v2/model/artefact/{id}/modelci` (anonymous).
  - Create run experiment (optional driving-model interleave) and per-geo licensing experiment
    (optional driving + extra parking): `POST /v1/public/on_road_experiments`.
  - Controller: public API forbids per-branch controller → UI shows it disabled with a "platform default" note (flagged).
- **Calendar tab**: runs per day across the user's models (aggregated from card runs), each labelled with model + experiment + Console/Foxglove/logs links.
- **Lineage tab**: merged trained-from DAG (WFM→BC→RL) via `/v2/model/{id}/lineage`, cached per session and **only resolved when a new session is discovered**; rendered as a layered SVG, user's own models highlighted.
- New: `clients/auth.py`, `clients/writes.py`, `static/lineage.js`, `templates/{calendar,lineage}.html`; extended `clients/model_catalogue.py`, `lifecycle.py`, `poller.py`, `store/`, `app.py`, `config.py`, tests.

## Verification

- `bazel test //wayve/ai/parking/tools/lifecycle_dashboard:all` → green (py_test, ruff, flake8, ty, eslint).
- Live smoke (server :3012, real Model Catalogue): pages 200 (overview/calendar/lineage/detail);
  `model_date` parsed; Model CI = passed for real gen2 artefacts; `plum-hatchetfish-satisfied`
  correctly shows UK licensing = passed; lineage merged 5 BC models onto one shared WFM ancestor;
  write **previews** for model-ci / run-experiment / licensing resolved live themes + templates
  ("P1 - Robotaxi + PUDO" + UK template; "Licensing" + "[UK] Licensing…" template) — no real writes performed.
- Deployed: server running on :3007 (poller watching boris.indelman@wayve.ai).

## Follow-ups

- Smarter run-experiment template selection (currently first London template; preview shows the name).
- W&B live training state, `model_pipeline_progress` ingestion step, confirmed Foxglove URL.
- Authoritative geo bucketing (GraphQL) if the name/tag heuristic mis-buckets.
