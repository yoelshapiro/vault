# LLM Wiki Index

This is the content-oriented catalog for the Wayve MLE LLM wiki. Read this first, then open the relevant pages and source summaries.

## Start Here

- [[llm_wiki/README|README]] - overview of the wiki structure and operating model.
- [[llm_wiki/glossary|Glossary]] - shared terms, acronyms, and Wayve-specific vocabulary.
- [[llm_wiki/questions/open-questions|Open Questions]] - broad unresolved questions.
- [[llm_wiki/questions/parking-pudo-open-questions|Parking PUDO Open Questions]] - parking/PUDO-specific follow-up questions.

## Maps

- [[llm_wiki/maps/knowledge-sources|Knowledge Sources]] - map of Notion, GitHub, Slack, Drive, skills, and local docs.
- [[llm_wiki/maps/codebase-map|Codebase Map]] - code areas relevant to model development and parking/PUDO work.

## Core Model Systems

- [[llm_wiki/systems/end-to-end-driving-stack|End-To-End Driving Stack]] - high-level model-to-vehicle stack.
- [[llm_wiki/systems/world-model-pretraining|World Model Pretraining]] - WFM/pretraining role in the lifecycle.
- [[llm_wiki/systems/bc-rl-training|BC And RL Training]] - behavior cloning and reinforcement learning stages.
- [[llm_wiki/systems/space-time-model-architecture|Space-Time Model Architecture]] - ST architecture and model components.
- [[llm_wiki/systems/model-vehicle-interface|Model Vehicle Interface]] - model inputs, outputs, and vehicle-facing integration.
- [[llm_wiki/systems/multi-task-and-multi-driving-heads|Multi-Task And Multi-Driving Heads]] - shared-trunk, mode-specific heads, and post-training integration strategy.
- [[llm_wiki/systems/latent-actions-and-behavior-control|Latent Actions And Behavior Control]] - latent-action pattern and behavior-control implications.
- [[llm_wiki/systems/navigation-conditioning|Navigation Conditioning]] - RouteMap/navigation instruction conditioning across WFM/BC/RL.

## Parking And PUDO Systems

- [[llm_wiki/systems/parking-and-pull-over|Parking And Pull-Over]] - parking, PUDO, pull-over, and related feature scope.
- [[llm_wiki/systems/parking-model-architecture|Parking Model Architecture]] - parking-specific model architecture notes.
- [[llm_wiki/systems/parking-data-and-labels|Parking Data And Labels]] - parking data, labels, and materialization.
- [[llm_wiki/systems/parking-product-and-taxonomy|Parking Product And Taxonomy]] - APA/P2P/PUDO/RMF scope, IO, and failure taxonomy.
- [[llm_wiki/systems/parking-pudo-event-pipeline|Parking PUDO Event Pipeline]] - event detection, materialization, dashboards, and event-time model attribution.
- [[llm_wiki/systems/parking-pudo-deployment-and-release|Parking PUDO Deployment And Release]] - release/deployment surfaces, interleaving risks, and model comparison checklist.

## Data, Evaluation, And Deployment

- [[llm_wiki/systems/data-and-materialisation|Data And Materialisation]] - data materialization concepts and SI data flow.
- [[llm_wiki/systems/evaluation-and-model-ci|Evaluation And Model CI]] - Shadow Gym, Model CI, and evaluation flow.
- [[llm_wiki/systems/deployment-and-model-catalogue|Deployment And Model Catalogue]] - deployment, model lookup, lineage, and catalogue usage.

## Workflows

- [[llm_wiki/workflows/wiki-ingest-workflow|Wiki Ingest Workflow]] - how to ingest new sources.
- [[llm_wiki/workflows/wiki-query-workflow|Wiki Query Workflow]] - how to answer questions from the wiki.
- [[llm_wiki/workflows/wiki-lint-workflow|Wiki Lint Workflow]] - how to health-check the wiki.
- [[llm_wiki/workflows/wiki-health-review-2026-05-23|Wiki Health Review 2026-05-23]] - previous lint/health pass.
- [[llm_wiki/workflows/model-development-cycle|Model Development Cycle]] - full model iteration path.
- [[llm_wiki/workflows/training-a-driving-model|Training A Driving Model]] - training workflow from source docs.
- [[llm_wiki/workflows/parking-development-workflow|Parking Development Workflow]] - parking/PUDO development workflow.
- [[llm_wiki/workflows/on-road-experiment-workflow|On-Road Experiment Workflow]] - on-road experiment creation and inspection.
- [[llm_wiki/workflows/agent-skill-map|Agent Skill Map]] - skills and workflows useful for agents.

## Source Summaries

- [[llm_wiki/sources/2026-05-24-drive-multitask-and-multi-heads|Drive - Multitask And Multiple Driving Heads]] - multi-head and post-training strategy docs.
- [[llm_wiki/sources/2026-05-24-notion-latent-actions-navigation-behavior|Notion - Latent Actions, Behavior Control, And Navigation]] - latent action, behavior optimization, navigation, and ML Guild source summary.
- [[llm_wiki/sources/2026-05-24-notion-parking-product-data-eval|Notion And Drive - Parking Product, Data, Evaluation]] - Team Parking, product/system design, data, evaluation, taxonomy, and SOP.
- [[llm_wiki/sources/2026-05-24-notion-parking-newsletters-release|Notion - Parking Newsletters And Release Tracking]] - interleaving, stopping mode, WFM alignment, augmentation, and release tracking.
- [[llm_wiki/sources/2026-05-23-notion-training-driving-model|Notion - Training Driving Model]] - training-driving-model source summary.
- [[llm_wiki/sources/2026-05-23-notion-discovery-parking-evaluation|Notion Discovery - Parking Evaluation]] - earlier parking/evaluation discovery.
- [[llm_wiki/sources/2026-05-23-code-model-interface-and-st-architecture|Code - Model Interface And ST Architecture]] - code-derived model/interface summary.
- [[llm_wiki/sources/2026-05-23-code-data-materialisation-and-parking|Code - Data Materialisation And Parking]] - code-derived data/materialization summary.
- [[llm_wiki/sources/2026-05-23-vault-parking-newsletters|Vault - Parking Newsletters]] - existing vault parking newsletter summary.
- [[llm_wiki/sources/2026-05-23-skill-workflows-parking-model-lifecycle|Skill Workflows - Parking Model Lifecycle]] - skill-derived model lifecycle summary.

## Raw Source Folders

- [[llm_wiki/raw/README|Raw Sources README]] - raw-source policy and folder purpose.
- [[llm_wiki/raw/notion/README|Raw Notion Sources]] - Notion source landing area.
- [[llm_wiki/raw/github/README|Raw GitHub Sources]] - GitHub/code source landing area.
- [[llm_wiki/raw/slack/README|Raw Slack Sources]] - Slack source landing area.
- [[llm_wiki/raw/skills/README|Raw Skills Sources]] - skill source landing area.
- [[llm_wiki/raw/assets/README|Raw Assets]] - local image/asset source area.

## Templates

- [[llm_wiki/templates/source-summary|Source Summary Template]]
- [[llm_wiki/templates/entity-page|Entity Page Template]]
- [[llm_wiki/templates/query-note|Query Note Template]]
- [[llm_wiki/templates/run-ledger|Run Ledger Template]]
