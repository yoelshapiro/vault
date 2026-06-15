# Rewrite the Parking Event Clip Viewer as a FastAPI + Vanilla-JS App

This ExecPlan is a living document. The sections `Progress`, `Surprises & Discoveries`, `Decision Log`, and `Outcomes & Retrospective` must be kept up to date as work proceeds.

This document is maintained in accordance with `/home/borisindelman/.codex/PLANS.md` (the referenced file is currently missing on disk; the structure here follows the established ExecPlan template used elsewhere in this vault, e.g. `2026-04-22-unpudo-batch-relaunch-execplan.md`).

## Purpose / Big Picture

Today the parking event clip viewer (`wayve/ai/parking/tools/event_clip_viewer/`, branch `boris/event_clip_viewer`) is a Streamlit app. The actual video player is already a hand-written HTML+JS single-page app injected as one ~400-line f-string through `streamlit.components.v1.html`. Streamlit only contributes sidebar forms, dataframes, and an iframe host — and it actively fights every feature we care about (autoplay, prefetch, camera sync, shareable links, durable caching) because of its rerun model and the one-way sandboxed iframe.

After this work I will have a from-scratch FastAPI app that serves a real vanilla-JS single-page front end. The Python backend exposes a small JSON API over the three existing event sources (Databricks SQL, materialisation/anchor parquet paths, and the table↔materialisation comparison), with a durable on-disk parquet/result cache. The front end is a proper player: synced multi-camera grid, autoplay with real prefetch, a green event-window box that distinguishes a segment range from a single anchor timestamp, dynamic per-source field filters, random sampling, full event info with a Console link, and keyboard controls.

The user-visible proof: `bazel run //wayve/ai/parking/tools/event_clip_viewer:viewer` serves the app on localhost; each of the three sources loads, autoplay prefetches and advances on the event window, all cameras can be expanded and synced, the green box marks segments vs anchors correctly, and parquet reads are served from a local cache on the second load.

## Progress

- [x] (2026-06-15) Read and characterised the existing Streamlit tool on `boris/event_clip_viewer` (app/components/data/sql/anchor_compare/materialization/model_catalogue/video_urls/warmer).
- [x] (2026-06-15) Confirmed the in-repo FastAPI precedent: `wayve/ai/ori/data/dashboard` is FastAPI + Jinja2 + vanilla JS in `static/`, Bazel-built via `js_checks` + `py_library(data=glob(...))`, no Node bundler.
- [x] (2026-06-15) Collected design decisions from the user: FastAPI + vanilla JS, local-only deploy, ExecPlan first.
- [ ] Sign-off on this ExecPlan.
- [ ] Create a fresh implementation branch off `main` (the current viewer branch is far behind main).
- [ ] Scaffold the FastAPI app skeleton (`server/app.py`, `run.py`, `templates/index.html`, `static/`) + BUILD with `js_checks` and `py_checks`.
- [ ] Port the backend data layer into `sources/` (SQL, materialisation, anchors, compare) decoupled from Streamlit `@st.cache_data`.
- [ ] Implement the durable disk cache (`cache.py`) for parquet bodies and SQL result sets, hash-keyed, with an in-process LRU.
- [ ] Implement the JSON API endpoints (`/api/sources`, `/api/schema`, `/api/events`, `/api/compare`, `/api/clip`, `/api/run_videos`).
- [ ] Build the front end: `api.js`, `filters.js`, `player.js` (sync clock, green box, prefetch pool, autoplay, keyboard, URL state), `styles.css`.
- [ ] Write backend unit tests (cache, sources, compare, video URL builders) and wire `js_checks`.
- [ ] Manual smoke test of all three sources + autoplay/sync/prefetch/green-box; update README.
- [ ] Log the work in the vault change log; remove the Streamlit entrypoint once parity is confirmed.

## Surprises & Discoveries

- Observation: the "rewrite" is smaller than it looks because the player is *already* a JS app — it is just trapped in a Streamlit iframe as an untyped, untested f-string.
  Evidence: `components.py` reimplements autoplay, `<video>` preload of the next N clips, the green-box logic, prev/next/replay, and a stuck-clip skip timeout entirely in raw JS.
- Observation: there is a clean, deployed, Bazel-native FastAPI+vanilla-JS pattern to copy, so no Node/Vite toolchain is needed.
  Evidence: `wayve/ai/ori/data/dashboard/BUILD` uses `js_checks(srcs=glob(["static/*.js", ...]))` and `py_library(data=glob(["templates/*.html","static/**"]))`, launched by uvicorn from `main.py`.
- Observation: most of the Python backend carries over almost unchanged; only the Streamlit/caching seam is replaced.
  Evidence: `sql.py`, `model_catalogue.py`, `video_urls.py`, `anchor_compare.py` segmenting/compare logic, and the pyarrow parquet readers are all framework-agnostic apart from the `@st.cache_data` decorators.

## Decision Log

- Decision: Replace Streamlit with FastAPI + Jinja2 + vanilla JS rather than refactoring the Streamlit app or adopting React/Vite.
  Rationale: the player is the product and already a JS app; Streamlit's rerun + one-way iframe block synced playback, real prefetch, and shareable URLs. The ori dashboard proves the FastAPI+vanilla-JS path is Bazel-native here with no JS bundler.
  Date/Author: 2026-06-15 / Claude (user-confirmed).
- Decision: Target local-dev deployment only (uvicorn on localhost), no autopublish/AKS machinery.
  Rationale: user-confirmed scope; matches how the current viewer is used. Keeps the surface small.
  Date/Author: 2026-06-15 / Claude (user-confirmed).
- Decision: Implement on a fresh branch cut from `main`, not on `boris/event_clip_viewer`.
  Rationale: the viewer branch is ~14k files behind main, so it is a poor base; a fresh branch lets us reuse the current files as a reference while building cleanly. (Branch creation pending user consent at implementation start.)
  Date/Author: 2026-06-15 / Claude.
- Decision: Rebuild in the same package path `wayve/ai/parking/tools/event_clip_viewer/` with a new internal structure, keeping the `:viewer` target name.
  Rationale: preserves the run command and discoverability; the Streamlit entrypoint is removed only after parity is confirmed.
  Date/Author: 2026-06-15 / Claude.

## Outcomes & Retrospective

Not complete yet. Current outcome: a design and decision set agreed with the user, plus a concrete architecture and step list ready for sign-off before implementation.

## Context and Orientation

The tool lives at `wayve/ai/parking/tools/event_clip_viewer/` on branch `boris/event_clip_viewer`. Prior vault notes: `agent_tasks/2026/06/Week-2/2026-06-08-event-clip-viewer-anchor-comparison.md` and `.../2026-06-10-event-clip-viewer-browser-preload.md`.

Current modules and what carries over:
- `app.py` — Streamlit UI, three event sources, playlist building. **Replaced** by FastAPI routes + the JS front end.
- `components.py` — the iframe HTML/JS player. **Replaced** by `static/player.js` (real SPA component).
- `data.py` — Databricks SQL exec, materialisation parquet reads, blob index, SAS tokens, `segment_materialization_events`. **Ported** into `sources/` + `cache.py`, minus `@st.cache_data`.
- `anchor_compare.py` — bucket discovery, country/DC filters, event↔anchor nearest-match compare. **Ported** into `sources/compare.py` + `sources/materialization.py`.
- `materialization.py` — materialisation anchors-path source sidebar loader. **Ported** into `sources/materialization.py`.
- `model_catalogue.py` — run video payload + per-camera URL/offset resolution. **Ported** nearly verbatim (drop `@st.cache_data`, use `cache.py`).
- `video_urls.py` — media-handler URL, console URL, blob signing, clip-blob parsing. **Ported** verbatim.
- `sql.py` — Databricks connection via `get_connection_details_with_azure_cli`. **Ported** verbatim.
- `warmer.py` — background thread warming model-catalogue lookups. **Replaced** by server-side `/api/clip` resolution + client prefetch.
- `compile_event_videos.py` — offline concatenated-video CLI. **Left as-is** (separate target, out of scope).

The in-repo template to copy is `wayve/ai/ori/data/dashboard` (FastAPI app `main.py`, `templates/`, `static/*.js`, `BUILD` with `js_checks`).

Definitions used below:
- "segment" = a continuous run of materialisation timestamps collapsed into `[start, end]` (green box spans the range).
- "anchor" = a single timestamp event (green box marks one instant with a small pad).
- "clip descriptor" = the per-event JSON the player needs: resolved camera URLs, `start_seconds`, `green_start_seconds`, `green_end_seconds`, `end_seconds`.

## Plan of Work

First, scaffold the FastAPI app following the ori dashboard: a `server/app.py` FastAPI instance mounting `static/` and `templates/`, a `run.py` uvicorn launcher (replacing the Streamlit launcher, keeping `EVENT_CLIP_VIEWER_PORT`/`_ADDRESS`), and an `index.html` shell that loads the JS modules. Update `BUILD` to a `py_library`/`py_binary` with `data=glob([templates, static])`, add `js_checks` over `static/*.js`, and keep `py_checks` for the Python tests. Target name stays `:viewer`.

Next, port the backend data layer into a `sources/` package with a small `EventSource` protocol (`schema()` → filterable fields; `query(filters, limit, random, seed, dedupe)` → normalised rows). Implement `databricks_sql.py`, `materialization.py` (with segmenting), `anchors.py` (single timestamps), and `compare.py` (nearest-anchor match → matched/missing/extra). Strip the `@st.cache_data` decorators and route caching through `cache.py`.

Then, implement `cache.py`: a disk cache (default under `~/.cache/event_clip_viewer/`) keyed by a sha256 of `(source, normalised query/filter spec, parquet blob path + size/etag)`, storing parquet bodies and SQL result sets as parquet, fronted by an in-process LRU, with TTL for SQL/model-catalogue payloads. This durably satisfies the parquet-caching requirement and removes the ad-hoc `/tmp` logic.

Then, implement the JSON API in `server/app.py`: `/api/sources`, `/api/schema?source=`, `/api/events` (filters, limit, random, seed, dedupe → rows + columns + clip descriptors), `/api/compare`, `/api/clip` (resolves per-camera URLs/offsets for live media-handler, model-catalogue, and generated blob, server-cached so prefetch is cheap), and `/api/run_videos` (cached model-catalogue payload).

Then, build the front end. `api.js` wraps fetches. `filters.js` renders the per-source filter panel from `/api/schema` (multi-select event_type, run-id contains, per-field filters, random + seed, limit, dedupe, compare match-threshold). `player.js` is the core: a synced multi-camera grid (default `front_forward`, expandable to all six), a single master clock so all cameras play/seek/pause together, the green-box highlight driven by `green_start/green_end` (equal ⇒ anchor point, range ⇒ segment), a prefetch pool of upcoming clips that also pre-resolves `/api/clip`, autoplay that advances on the event-window end and skips stuck/errored clips, keyboard controls (←/→ prev/next, space play/pause, r replay, j jump-to-event, f toggle all cameras, [ ] speed), an event-info panel with all row fields + Console link + source URL, and `?source=&i=&seed=` URL state for shareable deep links.

Finally, write hermetic backend unit tests (cache hit/miss + key stability; SQL filter builder; materialisation segmenting; compare matched/missing/extra; video URL builders; schema), wire `js_checks`, run the Bazel test target, smoke-test all three sources plus autoplay/sync/prefetch/green-box manually, update the README, log the work in `~/git/vault/agents-change-log.md`, and remove the Streamlit entrypoint once parity is confirmed.

## Concrete Steps

1. Cut branch `boris/event_clip_viewer_v2` (or user-preferred name) off `main`; copy the current package in as a read-only reference.
2. Add `server/`, `static/`, `templates/`, `run.py`; rewrite `BUILD` (`py_library` + `py_binary :viewer`, `js_checks`, `py_checks`).
3. Port `sql.py`, `video_urls.py`, `model_catalogue.py` verbatim; add `cache.py`.
4. Build `sources/{base,databricks_sql,materialization,anchors,compare}.py` from `data.py` + `anchor_compare.py` + `materialization.py`.
5. Implement API endpoints + pydantic schemas.
6. Implement `static/{api,filters,player}.js` + `styles.css` + `templates/index.html`.
7. Backend tests under `test/`; `js_checks`; run `bazel test //wayve/ai/parking/tools/event_clip_viewer/...`.
8. Manual smoke test via `bazel run //wayve/ai/parking/tools/event_clip_viewer:viewer`.
9. Update README; update the vault change log; remove Streamlit deps/entrypoint.

## Open Questions (non-blocking)

- Branch name preference for the implementation branch.
- Cache directory location (`~/.cache/event_clip_viewer/` proposed; `/tmp` alternative for ephemerality).
- Whether to keep `compile_event_videos.py` co-located (proposed: yes, untouched).
