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
- User provided full thread text directly; project note has been updated to use this as source of truth.

## Proposal baseline captured
- Keep first iteration on top of `parking/training/pudo` release config path.
- Start with minimal-change ablation:
  - adjust only non-driving mixture (`pudo/unpudo/unpark`) **or**
  - keep weights fixed and change only dataset root if thread dictates data refresh.
- Preserve current model/loss structure for first pass to reduce confounders.

## Zak thread summary captured (from user-provided text)
- First classifier-based PUDO pin-validity labels were integrated and run over recent PUDO runs.
- Artifacts:
  - `pudo_pin_valid_before.npz`
  - `pudo_pin_valid_after.npz`
- Experimental integration pointers captured from thread:
  - `wayve/ai/experimental/dataset/annotations.py`
  - `wayve/ai/experimental/dataset/single_run.py`
  - `wayve/ai/experimental/configs/mcv_new_phase2.yml`
- Key concerns identified by Zak:
  - Event count initially looked too low (~10.8k) and might miss PUDO events.
  - Distribution too concentrated in short windows (<20m), uncertain if data/label/model issue.
- After new QM labels and classifier retrain:
  - total events increased to 13,272
  - "after" distribution became less skewed (more 25m samples)
- Additional thread note: hazard-light signal cleanup likely helps and should be considered as a separate ablation.

## Result
Project scaffolding is complete and active; proposal v1 now includes exact thread-derived Zak summary and a concrete SI port plan.
