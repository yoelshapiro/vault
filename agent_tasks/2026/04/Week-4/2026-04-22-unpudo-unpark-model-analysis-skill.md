# UNPUDO / Unpark Model Analysis Skill

- Date: `2026-04-22`
- Skill path: `/home/borisindelman/git/ParkingSkills/skills/unpudo-unpark-model-analysis`
- Discovery path: `~/.codex/skills/unpudo-unpark-model-analysis`

## What I added

- Created a new Codex skill for model-level UNPUDO / unparking analysis.
- Created the vault root folder for this workflow:
  - `/home/borisindelman/git/vault/model_analysis`
- Added:
  - `models/` for per-model cards
  - `report_cards/` for dated per-run files

## Storage contract

- Per-model card:
  - `/home/borisindelman/git/vault/model_analysis/models/<model-nickname>.md`
- Per-run report file:
  - `/home/borisindelman/git/vault/model_analysis/report_cards/YYYY/MM/Week-N/<sanitized-run-id>.md`

Each run file is intended to contain all relevant event cards for that run under stable headers.

Each model card is intended to link to those event-card headers rather than duplicating the report body.

## Skill behavior

- Selects `unpudo` and `unparking` rows for one or many models from `parking.pudo_unpudo_unpark_events`
- Reuses the `unpudo-unpark-segment-investigation` workflow for the event-level analysis
- Persists the full event cards into run files
- Updates per-model index cards with links to the relevant event cards

## Notes

- The skill keeps event-card bodies in one place only: the per-run report file.
- The model card is a durable index for browsing a model’s analyzed events.
