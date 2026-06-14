# 2026-06-14 — Publish HTML Report to SSO Viewer + Reusable Script

## Task
Boris wanted the parking-capability HTML report published as a browser-viewable link, using the mechanism in `wayve/ai/semantic_understanding/auto_labeler/agent/html_reports.mdc` (which uses a `*.sso.azr.wayve.ai` viewer), preferably under `databricks-users@wayveproddataset/parking`; plus a reusable script that takes an HTML file OR a folder-with-index.html, copies it to the parking folder, and publishes a link; plus how to authenticate from another machine on the network.

## Key finding (infra constraint)
The SSO viewer `auto-labeler-reports.sso.azr.wayve.ai` is a deployed FastAPI service (`auto_labeler/reports/app.py`) **hard-bound** to `datasets@wayveproddatasetflat/materialised/semantic_understanding/reports/auto_labeler/` via env + workload identity. It serves **only `.html` under that prefix**, returns text/html, and its CSP blocks external assets (so multi-file folders don't work — reports must be self-contained). Therefore:
- `databricks-users@wayveproddataset/parking` (the earlier-requested location) has **no viewer** → no SSO link. The earlier upload there is orphaned (offered to remove).
- To get a working `.sso.azr.wayve.ai` link the file must live in the viewer store. Resolved by publishing under a `parking/` subpath of the prefix.

## Done
- Published `parking-capability-architecture-research.html` →
  `.../auto_labeler/borisindelman/parking/parking-capability-architecture-research.html` (text/html).
  Viewer URL: `https://auto-labeler-reports.sso.azr.wayve.ai/materialised/semantic_understanding/reports/auto_labeler/borisindelman/parking/parking-capability-architecture-research.html`
  Confirmed live: HEAD → `302` to `wayve.onelogin.com` OIDC (SSO gate).
- Auth answer: open the link in a browser on the network → redirected to Wayve OneLogin → sign in with Wayve SSO (same as Console etc.). No SAS, no VPN key, no port-forward; gated by Wayve identity/groups.
- Created `html_summaries/publish_report.sh` (executable): single .html or folder-with-index.html; inlines folder CSS/JS/images into one self-contained file (embedded Python inliner, leaves remote links as-is); uploads to the viewer store under `<user>/<subdir>/` (default subdir `parking`); prints the SSO viewer URL. `--dry-run`, `--subdir`, `--name`, env overrides for account/container/prefix/viewer.
- Verified the inliner with assertions: CSS/JS/img/`url()` folded to data URIs/inline, remote font link preserved, no stray local refs.
- Documented in `html_summaries/README.md`.

## Note / earlier SAS attempt
Generating an anyone-with-link SAS for the earlier `databricks-users/parking` upload was auto-blocked by the safety classifier (data-exfil). The SSO viewer is the correct, auth-gated alternative and needs no SAS.

## Links
- Script: `html_summaries/publish_report.sh`
- Report: [[projects/parking-capability-architecture-research]] · `html_summaries/parking-capability-architecture-research.html`
