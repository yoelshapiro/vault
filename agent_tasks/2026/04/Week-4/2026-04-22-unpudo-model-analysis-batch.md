# UNPUDO Model Analysis Batch

Source cohort:
- release-page top `14` rows from the Parking PUDO model release page
- expanded nickname set stored in [[agent_tasks/2026/04/Week-4/2026-04-22-release-page-top14-unpudo-cohort]]

Workflow:
- use `unpudo-unpark-model-analysis`
- use `unpudo-unpark-segment-investigation` per event card
- write run-level report cards under `vault/model_analysis/report_cards/YYYY/MM/Week-N/`
- write one index file per model under `vault/model_analysis/models/`

Processing policy:
- start from the most recent active models in the Notion release-table order
- process recent events first within each model
- keep the vault updated after each event card lands

## Ordered active-model queue

1. `blue-panther-solid`
2. `pink-manta-ray-smooth`
3. `harlequin-excited-greyhound`
4. `satisfied-amber-moose`
5. `armadillo-amethyst-squeaky`
6. `apricot-crocodile-uproarious`
7. `lively-orange-horse`
8. `plum-timeless-beaver`
9. `alpaca-chocolate-fearless`

## Cohort size

- total UNPUDO events: `3721`
- total runs: `669`
- active models with UNPUDO events: `9`

## Current worker assignments

### In progress

- `blue-panther-solid`
  - owner: worker pending
  - target: latest `5` UNPUDO events
  - expected run files:
    - `fme20009--2026-04-21--20-53-31--gen2-av-c485ff0d-599e-495f-bee7-17c4a854ab52.md`

- `pink-manta-ray-smooth`
  - owner: worker pending
  - target: latest `5` UNPUDO events
  - expected run files:
    - `fme20031--2026-04-21--20-55-03--gen2-av-6012f067-7eac-4c54-af80-fe1b295980aa.md`
    - `fme20012--2026-04-21--20-09-51--gen2-av-e0b70f5f-cb4d-4f8b-b0d7-af97a8834fb9.md`

### Pending

- `harlequin-excited-greyhound`
- `satisfied-amber-moose`
- `armadillo-amethyst-squeaky`
- `apricot-crocodile-uproarious`
- `lively-orange-horse`
- `plum-timeless-beaver`
- `alpaca-chocolate-fearless`

## Recent event packets

### `blue-panther-solid`

1. `2026-04-21 21:35:15 UTC` in `fme20009/2026-04-21--20-53-31--gen2-av-c485ff0d-599e-495f-bee7-17c4a854ab52`
2. `2026-04-21 21:22:03 UTC` in `fme20009/2026-04-21--20-53-31--gen2-av-c485ff0d-599e-495f-bee7-17c4a854ab52`
3. `2026-04-21 21:17:55 UTC` in `fme20009/2026-04-21--20-53-31--gen2-av-c485ff0d-599e-495f-bee7-17c4a854ab52`
4. `2026-04-21 21:11:22 UTC` in `fme20009/2026-04-21--20-53-31--gen2-av-c485ff0d-599e-495f-bee7-17c4a854ab52`
5. `2026-04-21 21:07:56 UTC` in `fme20009/2026-04-21--20-53-31--gen2-av-c485ff0d-599e-495f-bee7-17c4a854ab52`

### `pink-manta-ray-smooth`

1. `2026-04-21 21:19:28 UTC` in `fme20031/2026-04-21--20-55-03--gen2-av-6012f067-7eac-4c54-af80-fe1b295980aa`
2. `2026-04-21 21:15:58 UTC` in `fme20031/2026-04-21--20-55-03--gen2-av-6012f067-7eac-4c54-af80-fe1b295980aa`
3. `2026-04-21 21:13:03 UTC` in `fme20012/2026-04-21--20-09-51--gen2-av-e0b70f5f-cb4d-4f8b-b0d7-af97a8834fb9`
4. `2026-04-21 21:11:11 UTC` in `fme20012/2026-04-21--20-09-51--gen2-av-e0b70f5f-cb4d-4f8b-b0d7-af97a8834fb9`
5. `2026-04-21 21:08:39 UTC` in `fme20031/2026-04-21--20-55-03--gen2-av-6012f067-7eac-4c54-af80-fe1b295980aa`

### `harlequin-excited-greyhound`

1. `2026-04-14 12:37:44 UTC` in `fme20040/2026-04-14--11-58-50--gen2-av-90560185-3296-43ba-9ec3-6a1693f1514a`
2. `2026-04-14 12:35:47 UTC` in `fme20040/2026-04-14--11-58-50--gen2-av-90560185-3296-43ba-9ec3-6a1693f1514a`
3. `2026-04-14 12:29:04 UTC` in `fme20040/2026-04-14--11-58-50--gen2-av-90560185-3296-43ba-9ec3-6a1693f1514a`
4. `2026-04-14 12:24:05 UTC` in `fme20040/2026-04-14--11-58-50--gen2-av-90560185-3296-43ba-9ec3-6a1693f1514a`
5. `2026-04-14 12:21:47 UTC` in `fme20040/2026-04-14--11-58-50--gen2-av-90560185-3296-43ba-9ec3-6a1693f1514a`

### `satisfied-amber-moose`

1. `2026-04-20 04:54:01 UTC` in `fme10011/2026-04-20--03-53-04--gen2-av-850e5b7c-de73-4684-be82-3d23281dc919`
2. `2026-04-20 04:52:51 UTC` in `fme10011/2026-04-20--03-53-04--gen2-av-850e5b7c-de73-4684-be82-3d23281dc919`
3. `2026-04-20 04:46:46 UTC` in `fme10011/2026-04-20--03-53-04--gen2-av-850e5b7c-de73-4684-be82-3d23281dc919`
4. `2026-04-20 04:25:56 UTC` in `fme10011/2026-04-20--03-53-04--gen2-av-850e5b7c-de73-4684-be82-3d23281dc919`
5. `2026-04-20 04:17:55 UTC` in `fme10011/2026-04-20--03-53-04--gen2-av-850e5b7c-de73-4684-be82-3d23281dc919`

## Status ledger

- `2026-04-22 21:17 UTC`
  - built the ordered active-model queue from the release-page cohort
  - confirmed `9` active models with UNPUDO events
  - prepared the first `2` model packets for parallel event-card generation
- `2026-04-22 21:19 UTC`
  - staged the next packet for `harlequin-excited-greyhound` and `satisfied-amber-moose`
  - both models are currently single-run packets, which should make the next handoff cheaper
