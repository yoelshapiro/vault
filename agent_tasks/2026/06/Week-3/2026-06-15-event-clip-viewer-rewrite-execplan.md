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
- [x] (2026-06-15) Collected design decisions from the user: FastAPI + vanilla JS, local-only deploy, ExecPlan first. Follow-ups: drop `compile_event_videos.py`, cache under `/tmp`, branch `boris/event_clip_viewer_fastapi`, port 3006, pick ONE video source (research first).
- [x] (2026-06-15) Ran a 5-agent research workflow on video streaming across the repo. Clear conclusion: **media-handler** (not model-catalogue). Single streaming source implemented.
- [x] (2026-06-15) Created branch `boris/event_clip_viewer_fastapi` off `main`.
- [x] (2026-06-15) Scaffolded the FastAPI app (`app.py`, `run.py` on :3006, `templates/index.html`, `static/`) + BUILD with `py_library(imports=["."])` + `py_binary`, `js_checks` (+ `.eslintrc`), `py_checks`.
- [x] (2026-06-15) Ported the backend into `sources/` (`databricks_sql`, `materialization`, `compare`, shared `parquet_fs` + `base`), decoupled from `@st.cache_data`.
- [x] (2026-06-15) Implemented the durable `/tmp` disk cache (`cache.py`): parquet + JSON, sha256-keyed, TTL, in-process LRU.
- [x] (2026-06-15) Implemented the JSON API (`/api/config`, `/api/buckets`, `/api/event_types`, `/api/events`, `/api/compare`, `/api/cache/clear`). Clip URLs are built client-side (media-handler is deterministic), so no `/api/clip` round-trip is needed.
- [x] (2026-06-15) Built the front end: `api.js`, `filters.js`, `player.js` (master-clock sync, green segment/anchor box, prefetch pool, autoplay, keyboard, hash state), `styles.css`.
- [x] (2026-06-15) Backend unit tests (24) for cache, video URLs, base geometry, segmenting/normalisation, compare, payload — all pass. `js_checks` wired.
- [x] (2026-06-15) Verified: `bazel build :viewer`, `py_test` (24 pass), `py_lint` (flake8+ruff), `ty`, `static_checks_eslint` all green. Server boots on :3006; `/`, `/api/config`, all static assets 200; `/api/events` SQL returned real events end-to-end.
- [ ] User visual smoke test in a browser (video playback, autoplay/sync/prefetch/green box) — needs browser reach to media-handler.
- [ ] Log the work in the vault change log (entry added; will finalise after visual check). Streamlit tool lives on the old `boris/event_clip_viewer` branch; nothing to remove on this fresh branch.

## Surprises & Discoveries

- Observation: the "rewrite" is smaller than it looks because the player is *already* a JS app — it is just trapped in a Streamlit iframe as an untyped, untested f-string.
  Evidence: `components.py` reimplements autoplay, `<video>` preload of the next N clips, the green-box logic, prev/next/replay, and a stuck-clip skip timeout entirely in raw JS.
- Observation: there is a clean, deployed, Bazel-native FastAPI+vanilla-JS pattern to copy, so no Node/Vite toolchain is needed.
  Evidence: `wayve/ai/ori/data/dashboard/BUILD` uses `js_checks(srcs=glob(["static/*.js", ...]))` and `py_library(data=glob(["templates/*.html","static/**"]))`, launched by uvicorn from `main.py`.
- Observation: most of the Python backend carries over almost unchanged; only the Streamlit/caching seam is replaced.
  Evidence: `sql.py`, `video_urls.py`, `anchor_compare.py` segmenting/compare logic, and the pyarrow parquet readers are all framework-agnostic apart from the `@st.cache_data` decorators.
- Observation: the streaming choice is not a toss-up — media-handler is structurally better and model-catalogue's flakiness is INHERENT, not user misuse.
  Evidence (repo survey): media-handler `forward_catalogue_video` (`media_handler/core/pipelines/video.py:1090-1131`) server-cuts a faststart MP4 for `[start,end]` starting at 0 (no seek, no `video_start_us`), guarantees 206/Range (`http_range.py:57-84`), single-flights to Redis (2h TTL), maps clean error codes. model-catalogue (`run_video.py`) returns raw upstream signed blob URLs as-is (`:213`) with no faststart/Range guarantee, 24h SAS that can expire mid-download, 20s API timeout with no blob-download retry, gen2 all-or-nothing per-camera FAILURE gating (`:250-273`), region routing, and FrontForward-status-coupled `video_start_us` (`:87-98`). So `both_needed=false`; media-handler only.
- Observation: because media-handler URLs are deterministic, the client can build them with no API round-trip, which makes prefetch trivial and removes the need for the old background `warmer.py` thread and any `/api/clip` endpoint.
  Evidence: production URL builder confirmed at `wayve/ai/datasets/tools/wayve_fiftyone/fiftyone_utils/data_loader.py:907`.
- Observation: the custom `py_binary` macro (`py_shortpath_binary`) rejects the `imports` attribute; it must go on a `py_library` and propagate to the binary via deps.
  Evidence: bazel error "no such attribute 'imports' in 'py_shortpath_binary' rule"; fix mirrors `wayve/ai/inference/tools/roofline_profiling/BUILD` (lib carries `imports=["."]`).

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
- Decision: Single video streaming source = media-handler; drop model-catalogue and the generated-blob source entirely.
  Rationale: user asked for "just one that works" and to research what other apps use. The repo survey is conclusive (`both_needed=false`): media-handler is reliable by construction; model-catalogue's flakiness is inherent. Generated-blob was tied to `compile_event_videos.py`, which the user dropped.
  Date/Author: 2026-06-15 / Claude (research-backed, user-directed).
- Decision: Build media-handler clip URLs client-side from per-row `platform` + run identity; no `/api/clip` endpoint.
  Rationale: deterministic URLs need no round-trip, making prefetch and before/after/speed changes instant and keeping FastAPI a thin data/cache layer.
  Date/Author: 2026-06-15 / Claude.

## Outcomes & Retrospective

Implementation complete and verified headlessly on branch `boris/event_clip_viewer_fastapi`. The Streamlit app is fully replaced by a FastAPI + vanilla-JS app: a thin JSON API over the three event sources, a `/tmp` parquet/SQL disk cache, and a synced multi-camera player (green segment/anchor box, prefetch, autoplay, keyboard, hash state) streaming media-handler clips the browser builds itself. All Bazel checks pass (`py_test` 24, flake8, ruff, ty, eslint); the server boots on :3006 and `/api/events` returned real Databricks events end-to-end. Remaining: a human visual smoke test of actual video playback (requires browser reach to media-handler), which can't be done headlessly. Net win vs the old tool: the player is a real, testable SPA instead of an iframe f-string; sync/prefetch are first-class; caching is durable; and the streaming source is the reliable one, with the model-catalogue flakiness root-caused rather than worked around.

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
