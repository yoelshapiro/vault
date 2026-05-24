# 2026-05-24 Wayve LLM Wiki Deep Dive

## Topic

Extended the Wayve MLE LLM wiki with Notion and Google Drive knowledge for Parking/PUDO, navigation conditioning, latent actions, multitask post-training, and multiple driving heads.

## Labels

- llm_wiki
- parking
- pudo
- navigation
- latent-actions
- multitask
- model-architecture

## Change Type

Documentation / knowledge-base ingest.

## Sources Reviewed

- Team Parking and parking subpages.
- Parking/PUDO model development and deployment guide.
- Parking/PUDO newsletters.
- Parking/PUDO event detection and materialization pages.
- Parking evaluation and less-wrong labeling pages.
- Parking interventions and taxonomy sources.
- ML Guild.
- Latent Action Models.
- ORI Behaviour Optimisation.
- Navigation Instructions and Navigation Models.
- Multiple-driving-head Google docs/slides.
- Post-training multitask strategy Google doc.
- Parking/PUDO product/system-design and SOP Google docs.

## Changes

- Added source summaries for multitask/multi-heads, latent actions/navigation, parking product/data/eval, and parking newsletters/release tracking.
- Added system pages for multi-driving heads, latent actions, navigation conditioning, parking product/taxonomy, PUDO event pipeline, and parking/PUDO deployment/release.
- Added parking/PUDO open questions to capture unresolved architecture, data, evaluation, deployment, and product decisions.
- Created/updated the `llm_wiki/index.md` and `llm_wiki/log.md` entries for this ingest.

## Critical Findings

- PUDO should be treated as a distinct product behavior from parking.
- Event-time model attribution is required for interleaved runs.
- Navigation conditioning must be aligned across WFM/BC/RL stages.
- Multiple driving heads are useful design direction but still proposal/prototype status in the reviewed sources.
- Current taxonomy spreadsheet is more authoritative than the older Notion V10 request page, which is marked outdated.

