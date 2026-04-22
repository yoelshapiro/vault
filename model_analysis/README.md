# Model Analysis

This folder stores durable model-level parking analysis artifacts.

## Structure

- `models/`
  - one file per model nickname
  - acts as an index of event-card links
- `report_cards/YYYY/MM/Week-N/`
  - one file per run id
  - each run file contains one or more event cards under stable headers

## Intended workflow

Use the `unpudo-unpark-model-analysis` skill to:
- analyze one or many models
- generate run-level event cards
- update model-level index cards with links to those cards
