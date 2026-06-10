# 2026-06-10 — Parking Hub static landing page

## Goal
Create a single home page to discover and open parking **HTML reports** and **tools**
(Streamlit apps), hosted behind the `*.sso.azr.wayve.ai` ingress like `data_insights`.

## Decisions
- **Hub = lightweight FastAPI + uvicorn static server** (not Streamlit — overkill for HTML).
  Drop an `*.html` file or a subfolder with `index.html` into `content/` → it becomes a card and
  is served at `/r/<path>`. Apps are declared in `registry.yaml`.
- **Streamlit relationship = link-out (Option 1).** Each Streamlit app stays its own deployment;
  the hub links to its URL. A unified-domain reverse proxy (Option 2) was rejected for now because
  proxying `data-insights` (owned by another team in `ai--datasets`) would need *their* deployment
  to set `--server.baseUrlPath` — cross-team. A `proxy:` block is reserved in the registry schema
  as a code-only future hook for parking-owned apps.
- **Location/host:** `wayve/ai/parking/tools/parking_hub` → `parking-hub.sso.azr.wayve.{dev,ai}`,
  namespace `ai--parking`.
- **Brand:** Wayve press-kit palette (navy `#1a1730`, purple `#4a338a`, lavender `#b3abdc`,
  cyan `#03b5d1`, paper `#f6f6f2`) + fonts Karla (primary) / Work Sans (secondary); white wordmark
  SVG in the hero. Extracted from `Wayve_Brand_Guidelines_June_2026.pdf` + logo package.

## Seeded content
- First report: `pre_intervention_augmentation.html` (copied from vault `html_summaries`).
- First tool: `event_clip_viewer` — local `py_binary`, so the card shows
  `bazel run //wayve/ai/parking/tools/event_clip_viewer:viewer` + source link (no hosted URL).
- Also linked: `data-insights` (hosted).

## Implementation
- `hub_app.py` — FastAPI app: `scan_content()`, `load_registry()`, Jinja index, `/r` + `/static`
  mounts, `/healthz`. Uses `wayve.core.common.logger`.
- `main.py` thin entrypoint; `templates/index.html` branded card grid + client-side search.
- `BUILD` — `py_library` + `py_docker_binary` (`base_image_from_autopublish_yaml`),
  `wv_container_push`, `py_checks` with `test/test_hub_app.py`. Deps: pip-svc fastapi/uvicorn/pyyaml,
  pip-core jinja2, `//wayve/core/common:logger`.
- Deploy scaffold mirrors `data_insights` but **static-only**: no service account / workload identity /
  Key Vault secrets. `Makefile`, `autopublish.yaml` (publish_type: bazel), `__autodeploy_aks.bash`,
  `deployment/base` + `overlays/{dev,prod}`.

## Verification
- `bazel test //wayve/ai/parking/tools/parking_hub:py_checks` → flake8, ruff, ty, pytest all PASS (4/4).
- Ran the server locally (`bazel run … -- --port 8599`): `/healthz` 200; landing page shows
  Reports=1 (title auto-extracted), Apps=2 (event_clip_viewer command + data-insights link), brand
  fonts/wordmark present; `/r/pre_intervention_augmentation.html` 200; static SVGs 200; missing 404.
- `kubectl kustomize` dev/prod overlays render correct hosts, namespace `ai--parking`, port 8501,
  `traefik-external` + `letsencrypt-cloudflare`.

## Branch / PR
- `boris/parking-hub` (forked from `origin/main`, isolated git worktree at `/workspace/parking_hub`).
- Pushed; draft PR #117733 — https://github.com/wayveai/WayveCode/pull/117733.

## External file touched (only one)
- `build_support/docker/autopublish_yaml_image_dirs.bzl`: added `wayve/ai/parking/tools/parking_hub`.
  Required because the BUILD uses `base_image_from_autopublish_yaml()` (a static check enforces the list).
  Verified `@wayve__ai__parking__tools__parking_hub__base_image//:base_image` resolves.
  Everything else (autopublish.yaml + __autodeploy_aks.bash) is auto-discovered by CI glob — no other
  central file needed. Note: CODEOWNERS routes `wayve/ai/parking` review to `@wayveai/parking-owners`.

## Gating follow-up (infra)
- `ai--parking` namespace does not exist in the repo and parking has no AKS services yet. Before
  `make deploy-*`: platform/Terraform must create the namespace + DNS/TLS + SSO for
  `parking-hub.sso.azr.wayve.{dev,ai}`. Fallback: deploy into `ai--datasets` to unblock.

## How to add more later (no code change)
- New report: drop `*.html` / folder into `content/` and merge.
- New tool: add a row to `registry.yaml` (`url:` hosted, or `run:`+`source:` local).
