# Release Page Top-14 UNPUDO Cohort

Source Notion page:
- https://www.notion.so/wayve/Parking-PUDO-model-release-page-WIP-30303da5d69a80da92d5e0a7f8fa38bf?source=copy_link

Database:
- `collection://30803da5-d69a-80d9-9e10-000bd052b606`

Scope:
- first `14` rows from the top of the release-page table view
- include every model nickname mentioned in `Model` and `Related models`
- build an UNPUDO cohort from `parking.pudo_unpudo_unpark_events`

## Top 14 rows -> expanded nicknames

1. `insightful-magenta-porcupine`, `magenta-turtle-bright`
2. `purple-meticulous-crane`, `sea-cucumber-spectacular-orange`
3. `fierce-aardvark-amaranth`, `mallard-plum-mysterious`
4. `lime-cooperative-lobster`, `eel-benevolent-pink`, `colossal-caribou-indigo`
5. `newt-vivid-lavender`, `blue-panther-solid`
6. `colossal-caribou-indigo`, `pink-manta-ray-smooth`
7. `harlequin-excited-greyhound`, `tomato-dolphin-wandering`
8. `motionless-blush-wrasse`, `satisfied-amber-moose`
9. `eel-benevolent-pink`, `armadillo-amethyst-squeaky`
10. `loris-teal-ardent`, `apricot-crocodile-uproarious`
11. `wombat-yellow-stylis`, `sandpiper-tomato-proactive`
12. `lively-orange-horse`, `copper-butterfly-meritorious`
13. `plum-timeless-beaver`, `wren-chocolate-sparkling`
14. `alpaca-chocolate-fearless`, `symbolic-quail-violet`, `beagle-lime-exotic`

Unique nicknames in scope: `28`

## UNPUDO cohort summary

Source table:
- `parking.pudo_unpudo_unpark_events`

Filter:
- `event_type = 'unpudo'`
- `model_nickname` in the expanded nickname list above

Result:
- total UNPUDO events: `3721`
- distinct runs: `669`
- models with at least one UNPUDO event: `9`
- AV-at-event rows: `408`
- rows with a relevant failure signal: `1941`

Relevant failure signal definition used here:
- `has_disengagement = 1`
- or `has_disengagement_gear_to_start = 1`
- or `has_disengagement_before_gearchange_10s = 1`

## Active models in the cohort

| Model | Author | UNPUDO events | AV-at-event rows | Failure-signal rows | First run date | Last run date |
|---|---|---:|---:|---:|---|---|
| `alpaca-chocolate-fearless` | `boris.indelman` | 1001 | 137 | 617 | `2026-04-01` | `2026-04-19` |
| `plum-timeless-beaver` | `peng.tang` | 972 | 60 | 559 | `2026-04-07` | `2026-04-20` |
| `lively-orange-horse` | `guy.geva` | 490 | 42 | 349 | `2026-04-06` | `2026-04-14` |
| `pink-manta-ray-smooth` | `guy.geva` | 342 | 62 | 41 | `2026-04-15` | `2026-04-21` |
| `armadillo-amethyst-squeaky` | `guy.geva` | 278 | 66 | 99 | `2026-04-14` | `2026-04-19` |
| `satisfied-amber-moose` | `guy.geva` | 249 | 17 | 148 | `2026-04-15` | `2026-04-20` |
| `apricot-crocodile-uproarious` | `guy.geva` | 212 | 2 | 101 | `2026-04-14` | `2026-04-19` |
| `blue-panther-solid` | `guy.geva` | 172 | 17 | 25 | `2026-04-20` | `2026-04-21` |
| `harlequin-excited-greyhound` | `boris.indelman` | 5 | 5 | 2 | `2026-04-14` | `2026-04-14` |

## Nicknames from the first 14 rows with no UNPUDO events yet

- `insightful-magenta-porcupine`
- `magenta-turtle-bright`
- `purple-meticulous-crane`
- `sea-cucumber-spectacular-orange`
- `fierce-aardvark-amaranth`
- `mallard-plum-mysterious`
- `lime-cooperative-lobster`
- `eel-benevolent-pink`
- `colossal-caribou-indigo`
- `newt-vivid-lavender`
- `tomato-dolphin-wandering`
- `motionless-blush-wrasse`
- `loris-teal-ardent`
- `wombat-yellow-stylis`
- `sandpiper-tomato-proactive`
- `copper-butterfly-meritorious`
- `wren-chocolate-sparkling`
- `symbolic-quail-violet`
- `beagle-lime-exotic`

## Reusable SQL for the event-level UNPUDO table

```sql
WITH selected_models AS (
  SELECT explode(array(
    'insightful-magenta-porcupine',
    'magenta-turtle-bright',
    'purple-meticulous-crane',
    'sea-cucumber-spectacular-orange',
    'fierce-aardvark-amaranth',
    'mallard-plum-mysterious',
    'lime-cooperative-lobster',
    'eel-benevolent-pink',
    'colossal-caribou-indigo',
    'newt-vivid-lavender',
    'blue-panther-solid',
    'pink-manta-ray-smooth',
    'harlequin-excited-greyhound',
    'tomato-dolphin-wandering',
    'motionless-blush-wrasse',
    'satisfied-amber-moose',
    'armadillo-amethyst-squeaky',
    'loris-teal-ardent',
    'apricot-crocodile-uproarious',
    'wombat-yellow-stylis',
    'sandpiper-tomato-proactive',
    'lively-orange-horse',
    'copper-butterfly-meritorious',
    'plum-timeless-beaver',
    'wren-chocolate-sparkling',
    'alpaca-chocolate-fearless',
    'symbolic-quail-violet',
    'beagle-lime-exotic'
  )) AS model_nickname
),
base AS (
  SELECT e.*
  FROM parking.pudo_unpudo_unpark_events e
  INNER JOIN selected_models sm
    ON lower(e.model_nickname) = lower(sm.model_nickname)
  WHERE e.event_type = 'unpudo'
)
SELECT
  model_nickname,
  author,
  runID,
  run_date_iso,
  from_unixtime(timestamp_unixus / 1000000.0) AS event_start_utc,
  from_unixtime(event_startOrEnd_timestampunixus / 1000000.0) AS event_end_utc,
  event_duration,
  av_mode_at_event,
  from_unixtime(gearchange_timestamp / 1000000.0) AS gearchange_utc,
  has_disengagement,
  has_disengagement_gear_to_start,
  has_disengagement_before_gearchange_10s,
  CASE
    WHEN COALESCE(has_disengagement, 0) = 1
      OR COALESCE(has_disengagement_gear_to_start, 0) = 1
      OR COALESCE(has_disengagement_before_gearchange_10s, 0) = 1
    THEN 'failure_signal'
    ELSE 'no_failure_signal'
  END AS event_status,
  COALESCE(
    disengagement_what,
    disengagement_what_gear_to_start,
    disengagement_what_before_gearchange_10s
  ) AS disengagement_what_selected,
  COALESCE(
    disengagement_why,
    disengagement_why_gear_to_start,
    disengagement_why_before_gearchange_10s
  ) AS disengagement_why_selected,
  URL AS console_url
FROM base
ORDER BY run_date_iso DESC, timestamp_unixus DESC;
```

## Notes

- The release page rows sometimes repeat the same nickname in both `Model` and `Related models`; the cohort above is deduplicated before querying Databricks.
- Some first-14 rows are newly trained or interleave-control-only entries, so it is expected that they do not yet appear in the materialized UNPUDO event table.
- This note is the cohort-selection step only. The next step is to sample or backfill event cards per active model using the UNPUDO / unpark investigation workflow.
