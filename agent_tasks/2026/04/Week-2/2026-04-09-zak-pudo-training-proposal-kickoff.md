# Zak PUDO Training Proposal Kickoff

## Context
User requested:
- create a new project from a specific Slack thread
- summarize what Zak proposed and implemented
- draft an initial proposal on top of branch `parking/training/pudo`, following parking/PUDO training code in `parking_config.py`

Thread URL:
- `https://wayve-ai.slack.com/archives/C0A75MMDC1M/p1774801827799209`

## What was done
- Created and activated new vault project:
  - `projects/zak-pudo-training-proposal.md`
- Updated project registry/index:
  - `projects/projects.json`
  - `projects/active-project.txt`
  - `projects.md`
- Drafted an initial proposal in the project page anchored to:
  - `pudo_bc_D26_3_3_datamodule_cfg`
  - `parking_bc_release_2026_5_11_cfg`
  - `ParkingBcTrainRelease2026_5_11Cfg`

## Constraints / blockers
- Slack MCP read failed with `invalid_auth_token` when trying to read the requested thread.
- Added a clearly marked placeholder/provisional Zak summary in the project page and flagged it for update once Slack access is restored (or thread text is provided).

## Proposal baseline captured
- Keep first iteration on top of `parking/training/pudo` release config path.
- Start with minimal-change ablation:
  - adjust only non-driving mixture (`pudo/unpudo/unpark`) **or**
  - keep weights fixed and change only dataset root if thread dictates data refresh.
- Preserve current model/loss structure for first pass to reduce confounders.

## Result
Project scaffolding is complete and active; proposal v1 skeleton is ready pending exact Slack thread extraction for the final Zak summary.
