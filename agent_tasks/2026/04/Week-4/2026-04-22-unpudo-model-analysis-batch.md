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

### Completed / already written

- `harlequin-excited-greyhound`
  - run file:
    - `fme20040--2026-04-14--11-58-50--gen2-av-90560185-3296-43ba-9ec3-6a1693f1514a.md`
- `blue-panther-solid`
  - run file:
    - `fme20009--2026-04-21--20-53-31--gen2-av-c485ff0d-599e-495f-bee7-17c4a854ab52.md`
- `pink-manta-ray-smooth`
  - run files:
    - `fme20031--2026-04-21--20-55-03--gen2-av-6012f067-7eac-4c54-af80-fe1b295980aa.md`
    - `fme20012--2026-04-21--20-09-51--gen2-av-e0b70f5f-cb4d-4f8b-b0d7-af97a8834fb9.md`
- `satisfied-amber-moose`
  - run file:
    - `fme10011--2026-04-20--03-53-04--gen2-av-850e5b7c-de73-4684-be82-3d23281dc919.md`

### In progress

- `armadillo-amethyst-squeaky`
  - owner: worker `Darwin` (`019db759-9df7-7bf2-a9e4-3318e5b77893`)
  - cached packet:
    - `vault/model_analysis/event_packets/armadillo-amethyst-squeaky/manifest.json`
  - target run file:
    - `fme10011--2026-04-19--19-12-09--gen2-av-a2ff7adf-b899-4426-b9cb-3bdff0ea9636.md`

- `apricot-crocodile-uproarious`
  - owner: worker `Galileo` (`019db75c-badb-7b82-b0e3-501c98340776`)
  - cached packet:
    - `vault/model_analysis/event_packets/apricot-crocodile-uproarious/manifest.json`
  - target run file:
    - `fme10003--2026-04-19--19-01-24--gen2-av-d03ace5e-a7f3-4575-b52f-a52764f5c68b.md`

- `plum-timeless-beaver`
  - owner: worker `Faraday` (`019db75c-c1c3-7c22-a15c-5dd00bfdb69d`)
  - cached packet:
    - `vault/model_analysis/event_packets/plum-timeless-beaver/manifest.json`
  - target run file:
    - `fme20032--2026-04-20--12-50-45--gen2-av-4433efa2-b85f-49b5-b5ca-0d6e9c3de929.md`

### Exporting packets

- `alpaca-chocolate-fearless`
- `lively-orange-horse`

### Pending after current exports

- none beyond the active queue above

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
- `2026-04-22 21:21 UTC`
  - found a Databricks helper concurrency issue under parallel workers: `~/.cache/databricks-queries/cache.db` can throw `sqlite3.OperationalError: disk I/O error`
  - mitigation is to run worker Databricks commands with isolated `HOME` directories so each worker gets its own cache DB
  - because Databricks auth uses Azure CLI state, the isolated `HOME` also needs a symlinked `.azure` directory from `/home/borisindelman/.azure`
- `2026-04-22 21:32 UTC`
  - wrote the first real event card locally for `harlequin-excited-greyhound`
  - created run file `model_analysis/report_cards/2026/04/Week-2/fme20040--2026-04-14--11-58-50--gen2-av-90560185-3296-43ba-9ec3-6a1693f1514a.md`
  - created model card `model_analysis/models/harlequin-excited-greyhound.md`
- `2026-04-22 21:44 UTC`
  - corrected the first event card after review
  - fixed Console link to deep-link on the event timestamp
  - fixed Foxglove to anchor on the event timestamp instead of a guessed route timestamp
  - removed the incorrect route-change claim and replaced it with `no validated route reassignment`
  - updated the segment-investigation skill so it also handles runs with no navigation change or no `"Arrived at destination"` step without fabricating a route-change story
- `2026-04-22 22:20 UTC`
  - closed the stalled first-generation workers and switched the batch to a cache-first flow
  - added JSON export support to `tools/databricks_queries:execute_query`
  - added `export_model_event_packets.py` to materialize per-model event packets locally before card generation
- `2026-04-22 22:33 UTC`
  - completed the first packet export for `satisfied-amber-moose`
  - spawned worker `Dirac` to write the run card and model card from cached JSON rather than live Databricks joins
- `2026-04-22 22:36 UTC`
  - completed the packet export for `armadillo-amethyst-squeaky`
  - spawned worker `Darwin` on the cached packet with disjoint write scope
- `2026-04-22 22:37 UTC`
  - tightened both UNPUDO analysis skills again:
    - route-change status is now mandatory for every card: `found`, `not found`, or `unclear`
    - the event table and Mermaid timeline must make the route-search outcome explicit in the first row/item
    - model-card links must match the exact run-file H2 anchor, including milliseconds when present
- `2026-04-22 22:40 UTC`
  - started concurrent packet exports for:
    - `apricot-crocodile-uproarious`
    - `alpaca-chocolate-fearless`
    - `plum-timeless-beaver`
    - `lively-orange-horse`
  - first packet stages completed:
    - `apricot-crocodile-uproarious/events.json`
    - `plum-timeless-beaver/events.json`
- `2026-04-22 22:44 UTC`
  - `satisfied-amber-moose` report landed:
    - model card `model_analysis/models/satisfied-amber-moose.md`
    - run report `model_analysis/report_cards/2026/04/Week-4/fme10011--2026-04-20--03-53-04--gen2-av-850e5b7c-de73-4684-be82-3d23281dc919.md`
  - all `5` packet events fail under AV-only scoring
  - route reassignment was recovered for all `5` events in the stopped pre-event segment
  - none of the credited maneuvers remained AV-owned at the official start
- `2026-04-22 22:46 UTC`
  - packet manifests for `apricot-crocodile-uproarious` and `plum-timeless-beaver` became ready
  - spawned workers `Galileo` and `Faraday` on those cached packets with disjoint write scopes
- `2026-04-22 22:50 UTC`
  - moved Databricks cache files out of the vault and into:
    - `/home/borisindelman/tmp/model_analysis_databricks_cache`
  - patched `export_model_event_packets.py` so future packet exports keep cache state in `~/tmp` rather than under `vault/model_analysis/event_packets`
  - verified that `vault/model_analysis` no longer contains `cache.db` files
- `2026-04-22 23:22 UTC`
  - added `generate_model_reports.py` under the model-analysis skill
  - the new analyzer reads cached packet JSON and deterministically rewrites:
    - per-run report cards under `model_analysis/report_cards/...`
    - per-model index cards under `model_analysis/models/...`
  - validated the analyzer on the cached `satisfied-amber-moose` packet and refreshed its model card links against the exact run-file anchors
- `2026-04-22 23:27 UTC`
  - validated the end-to-end uncached path on `harlequin-excited-greyhound`
  - exported the full packet with `17` events instead of the earlier single-card partial state
  - regenerated:
    - `model_analysis/models/harlequin-excited-greyhound.md`
    - `model_analysis/report_cards/2026/04/Week-3/fme20040--2026-04-14--11-58-50--gen2-av-90560185-3296-43ba-9ec3-6a1693f1514a.md`
- `2026-04-22 23:30 UTC`
  - replaced the exporter's per-run source fetching with per-model windowed source queries
  - new exporter behavior:
    - still writes per-run JSON files under `event_packets/<model>/runs/...`
    - but fetches each telemetry source once per model and splits locally by run
  - this cuts the Databricks round trips for large models from hundreds of per-run source queries down to one source query per model
- `2026-04-22 23:33 UTC`
  - relaunched the active queue with four new workers and isolated `HOME` directories:
    - `Erdos` on `blue-panther-solid`
    - `Rawls` on `pink-manta-ray-smooth`
    - `Banach` on `harlequin-excited-greyhound`
    - `Anscombe` on `satisfied-amber-moose`
  - the plan is to feed those same workers the remaining queue in order as each one finishes:
    - `armadillo-amethyst-squeaky`
    - `apricot-crocodile-uproarious`
    - `lively-orange-horse`
    - `plum-timeless-beaver`
    - `alpaca-chocolate-fearless`
- `2026-04-23 01:29 UTC`
  - `blue-panther-solid` completed:
    - `188` events
    - `30` runs
    - refreshed model card `model_analysis/models/blue-panther-solid.md`
    - refreshed or created `30` run reports under `model_analysis/report_cards/2026/04/Week-4/`
- `2026-04-23 01:31 UTC`
  - `satisfied-amber-moose` completed full-batch refresh:
    - `270` events
    - `44` runs
    - refreshed model card `model_analysis/models/satisfied-amber-moose.md`
    - refreshed `44` run reports across `Week-3` and `Week-4`
- `2026-04-23 01:33 UTC`
  - `pink-manta-ray-smooth` failed on the first full-batch attempt
  - root cause:
    - the model-level `trajectory_controller_state` query was too large as a single export over `90` runs
  - partial packet artifacts exist:
    - `387` events
    - `90` runs
    - `events`, `navigation`, `controller_state`, `vehicle_state`, and `driving_plan` landed
    - `trajectory_controller_state.json` and `manifest.json` did not land
- `2026-04-23 01:37 UTC`
  - patched `export_model_event_packets.py` again so model-level source exports are chunked by run windows:
    - new flag: `--source-chunk-size-runs`
    - intended to keep large models like `pink-manta-ray-smooth`, `plum-timeless-beaver`, and `alpaca-chocolate-fearless` from hanging on one oversized source query
  - started a local chunked retry for `pink-manta-ray-smooth`
- `2026-04-23 01:40 UTC`
  - `armadillo-amethyst-squeaky` completed:
    - `302` events

- `2026-04-23 05:05 UTC`
  - fixed model-card event links so the display text is `card` while still targeting the exact per-event section anchor inside each run report
  - patched the generator and repair script to emit escaped Obsidian alias links inside markdown tables

- `2026-04-23 05:12 UTC`
  - extended `generate_model_reports.py` to add a durable per-model `Analysis Summary` section
  - the model card now includes:
    - comparison metrics
    - failure profile
    - success-behavior bullets
    - a written assessment section for cross-event behavior
  - event tables now show:
    - exact event timestamp in UTC
    - direct `console` and `foxglove` links
    - `card` link to the exact vault section

- `2026-04-23 05:22 UTC`
  - changed the model-card scoring logic so detected events that do not start in AV are excluded from pass/fail scoring:
    - outcome `non-AV` when there is no AV-owned overlap anywhere inside the detected event timeline
    - outcome `accidental` when there is some AV-owned overlap but it is shorter than `2s`
  - only `pass` and `fail` now contribute to model success-rate summaries
  - model cards explicitly report excluded-event counts alongside scored-event counts

- `2026-04-23 05:39 UTC`
  - refreshed under the new scoring logic:
    - `alpaca-chocolate-fearless`: `13` events, `0` scored, `4` `non-AV`, `9` `accidental`
    - `pink-manta-ray-smooth`: `387` events, `70` scored, `64` pass, `6` fail, `113` `non-AV`, `204` `accidental`
    - `blue-panther-solid`: `188` events, `17` scored, `15` pass, `2` fail, `54` `non-AV`, `117` `accidental`
    - `harlequin-excited-greyhound`: `17` events, `16` scored, `12` pass, `4` fail, `0` `non-AV`, `1` `accidental`
    - `satisfied-amber-moose`: `270` events, `17` scored, `13` pass, `4` fail, `95` `non-AV`, `158` `accidental`
  - `parking.model_analysis` has still not been updated by this cache-first vault workflow; current writes remain vault-only

- `2026-04-23 10:31 UTC`
  - corrected `unpudo` scoring after finding late-anchor omissions in `armadillo-amethyst-squeaky`
  - the previous logic only looked for AV ownership inside or after the official `unpudo` event timestamp, which caused late-anchor `unpudo` failures to be misclassified as `non-AV` and dropped
  - updated the generator and skill instructions so `unpudo` now:
    - starts its ownership lookback from the most recent route change
    - scores successful cases across the official `unpudo` window
    - cuts the scored window at disengagement when AV drops earlier
    - marks those cases `fail` instead of `non-AV`
  - reran `armadillo-amethyst-squeaky` from cache under the new `unpudo` rule
  - concrete fix verified on run `fme20015/2026-04-15--14-16-31--gen2-av-28d171b6-80a7-4e64-8aa8-b306a6530d69`:
    - `unpudo 2026-04-15 14:23:48.383 UTC` now present as `fail`
    - `unpudo 2026-04-15 14:32:20.083 UTC` now present as `fail`
    - `unpudo 2026-04-15 14:30:02.233 UTC` remains `pass`
  - refreshed totals for `armadillo-amethyst-squeaky`:
    - `302` raw events
    - `68` skipped `non-AV`
    - `234` recorded events
    - `231` scored
    - `65` pass
    - `166` fail
    - `3` `accidental`

- `2026-04-23 08:42 UTC`
  - reran `armadillo-amethyst-squeaky` in cache-first mode and rewrote all generated event cards and run reports from the existing packet cache
  - this was a full local regeneration under the latest rules:
    - non-AV events skipped entirely from vault output
    - accidental events kept as excluded events
    - success timing measured from the earlier of route change and AV start
    - timelines include chronological DBW and actual-indicator transitions
  - refreshed outputs:
    - model card `model_analysis/models/armadillo-amethyst-squeaky.md`
    - `31` regenerated run reports under `model_analysis/report_cards/2026/04/Week-3/`
  - refreshed totals:
    - `302` raw events
    - `208` skipped `non-AV`
    - `94` recorded events
    - `85` scored
    - `68` pass
    - `17` fail
    - `9` `accidental`

- `2026-04-23 08:12 UTC`
  - updated the `unpudo-unpark-model-analysis` skill instructions to match the current workflow instead of the original manual flow
  - documented:
    - cache-first execution via `scripts/export_model_event_packets.py` and `scripts/generate_model_reports.py`
    - packet cache location: `model_analysis/event_packets/<model>/`
    - Databricks query cache location: `/home/borisindelman/tmp/model_analysis_databricks_cache/<model>/`
    - exporter chunking with `--source-chunk-size-runs`
    - ordered multi-worker execution with up to `4` workers
    - retrying only failed models instead of restarting a whole queue
    - the success-timing baseline rule: use the earlier of route change and AV start
  - generated one-off analysis for `insightful-magenta-porcupine`
  - queried the event table first and found `7` relevant events, all on `2026-04-22`
  - exported that exact day and regenerated the vault outputs with the new timing baseline and non-AV skip rule
  - outputs:
    - model card `model_analysis/models/insightful-magenta-porcupine.md`
    - run report `model_analysis/report_cards/2026/04/Week-4/fme10011--2026-04-22--13-38-11--gen2-av-c6787608-2377-49a2-8db2-eb353c1251f9.md`
  - counts after filtering:
    - `7` raw events
    - `5` skipped as `non-AV`
    - `2` recorded events
    - `1` scored fail
    - `1` `accidental`

- `2026-04-23 05:52 UTC`
  - completed the remaining regenerated model cards under the new scoring logic:
    - `armadillo-amethyst-squeaky`: `302` events, `73` scored, `66` pass, `7` fail, `88` `non-AV`, `141` `accidental`
    - `apricot-crocodile-uproarious`: `228` events, `3` scored, `2` pass, `1` fail, `68` `non-AV`, `157` `accidental`
    - `lively-orange-horse`: `545` events, `46` scored, `41` pass, `5` fail, `139` `non-AV`, `360` `accidental`
    - `plum-timeless-beaver`: `403` events, `30` scored, `23` pass, `7` fail, `119` `non-AV`, `254` `accidental`
  - all `9` model cards now share the same structure:
    - top metadata table with scored / excluded counts
    - `Analysis Summary` section with comparison metrics, failure profile, excluded-event explanation, success behavior, and written assessment
    - event table with exact UTC timestamp plus `console`, `foxglove`, and `card` links
  - `plum-timeless-beaver` required the long export retry before regeneration; the refreshed manifest now covers `64` runs and `403` events

- `2026-04-23 06:59 UTC`
  - corrected the `non-AV` interpretation after review:
    - `non-AV` no longer means “event does not start in AV”
    - it now means there is no AV-owned overlap anywhere inside the detected event timeline
    - `accidental` remains the bucket for events with some AV overlap but less than `2s` of AV-owned duration
  - reran the full cached corpus so every model card and linked run report uses the corrected rule
  - refreshed model-card totals after the rule correction:
    - `blue-panther-solid`: `188` events, `27` scored, `18` pass, `9` fail, `151` `non-AV`, `10` `accidental`
    - `pink-manta-ray-smooth`: `387` events, `80` scored, `69` pass, `11` fail, `290` `non-AV`, `17` `accidental`
    - `harlequin-excited-greyhound`: `17` events, `13` scored, `11` pass, `2` fail, `2` `non-AV`, `2` `accidental`
    - `satisfied-amber-moose`: `270` events, `17` scored, `13` pass, `4` fail, `95` `non-AV`, `158` `accidental`
    - `armadillo-amethyst-squeaky`: `302` events, `73` scored, `66` pass, `7` fail, `88` `non-AV`, `141` `accidental`
    - `apricot-crocodile-uproarious`: `228` events, `3` scored, `2` pass, `1` fail, `68` `non-AV`, `157` `accidental`
    - `lively-orange-horse`: `545` events, `46` scored, `41` pass, `5` fail, `139` `non-AV`, `360` `accidental`
    - `plum-timeless-beaver`: `403` events, `59` scored, `31` pass, `28` fail, `333` `non-AV`, `11` `accidental`
    - `alpaca-chocolate-fearless`: `13` events, `1` scored, `1` pass, `0` fail, `12` `non-AV`, `0` `accidental`

- `2026-04-23 07:13 UTC`
  - added one-off analysis for `sea-cucumber-spectacular-orange`
  - first checked the previous batch comparison window (`2026-04-15` to `2026-04-21`) and confirmed there were no UNPUDO / unparking events there
  - queried the event table by date and found the model has `5` relevant events on `2026-04-22`
  - exported that exact day and generated:
    - model card `model_analysis/models/sea-cucumber-spectacular-orange.md`
    - run report `model_analysis/report_cards/2026/04/Week-4/fme10010--2026-04-22--16-09-57--gen2-av-97310301-a8d4-4bb7-87aa-6bf157ad09e8.md`
  - counts for this model:
    - `5` total events
    - `2` scored
    - `2` pass
    - `0` fail
    - `3` `non-AV`
    - `0` `accidental`
  - patched the generator so event tables and Mermaid timelines are sorted strictly by timestamp
  - the run card now explicitly shows:
    - `DBW at event start (...)`
    - `DBW at event end (...)`
    - any `DBW -> true` / `DBW -> false` transitions in chronological order

- `2026-04-23 07:59 UTC`
  - added one-off analysis for `mallard-plum-mysterious`
  - queried the event table first and found `15` relevant events, all on `2026-04-22`
  - exported that exact day and generated:
    - model card `model_analysis/models/mallard-plum-mysterious.md`
    - run report `model_analysis/report_cards/2026/04/Week-4/fme10010--2026-04-22--13-54-22--gen2-av-776e6413-6cfd-4985-8a89-a423678c808d.md`
    - run report `model_analysis/report_cards/2026/04/Week-4/fme10003--2026-04-22--20-12-43--gen2-av-3e0a8cb2-409e-4489-9145-f4a94365bc6c.md`
  - counts for this model:
    - `15` total events
    - `4` scored
    - `3` pass
    - `1` fail
    - `11` `non-AV`
    - `0` `accidental`
  - the generated run cards include:
    - `DBW at event start (...)`
    - `DBW at event end (...)`
    - chronological `DBW -> true / false` transitions
    - actual indicator transition rows such as `Actual indicator -> left on` and `Actual indicator -> off`
    - `42` runs
    - refreshed model card `model_analysis/models/armadillo-amethyst-squeaky.md`
    - refreshed `42` run reports across `Week-2` and `Week-3`
  - rolled the worker queue forward:
    - `Erdos` -> `apricot-crocodile-uproarious`
    - `Anscombe` -> `lively-orange-horse`
    - `Banach` -> `plum-timeless-beaver`
    - `Rawls` -> `alpaca-chocolate-fearless`
- `2026-04-23 02:25 UTC`
  - fixed model-card event links across all current model cards
  - converted markdown file links with slug fragments into Obsidian section links with the exact H2 text from the run report
  - patched `generate_model_reports.py` so future regenerated model cards also use exact section links by default

- `2026-04-23 10:56 UTC`
  - applied the corrected `unpudo` lookback rule to `pink-manta-ray-smooth` using the cached packet export
  - regenerated model card `model_analysis/models/pink-manta-ray-smooth.md` and its linked run reports with the same route-change-to-event / route-change-to-disengagement logic used for the `armadillo-amethyst-squeaky` fix
  - refreshed totals for `pink-manta-ray-smooth`:
    - `387` raw events
    - `78` skipped `non-AV`
    - `309` recorded events
    - `304` scored
    - `65` pass
    - `239` fail
    - `5` `accidental`

- `2026-04-23 10:56 UTC`
  - patched `scripts/export_model_event_packets.py` to reuse the already-built `//tools/databricks_queries:execute_query` binary when available, instead of invoking `bazel run` on every source chunk
  - this avoids repeated Bazel startup overhead and bypasses the mid-export repo-mapping failure that interrupted `eel-teal-outspoken`
  - updated `skills/unpudo-unpark-model-analysis/SKILL.md` so the cache-first instructions include this optimization

- `2026-04-23 10:57 UTC`
  - resumed `eel-teal-outspoken` from the partial packet cache after the exporter patch
  - existing source chunks in `model_analysis/event_packets/eel-teal-outspoken/` are being reused; only the missing work should continue

- `2026-04-23 11:15 UTC`
  - stopped the full-corpus `eel-teal-outspoken` export because the raw packet scope was too large for a useful model comparison pass
  - added exporter-side sampling for deterministic `unpudo` subsets:
    - most-recent events with disengagement
    - most-recent events without disengagement
  - widened the disengagement bucket to include any of the source-table disengagement signals, not only `has_disengagement`
  - restarted `eel-teal-outspoken` on the sampled subset only
  - current effective sample size in the requested window:
    - `93` `unpudo` events with disengagement
    - `150` `unpudo` events without disengagement
    - `243` sampled events across `76` runs

- `2026-04-23 11:46 UTC`
  - completed the sampled packet export for `eel-teal-outspoken`
  - final sampled export size:
    - `243` `unpudo` events
    - `76` runs
    - packet manifest: `model_analysis/event_packets/eel-teal-outspoken/manifest.json`
  - no run cards were generated for `eel-teal-outspoken` yet in this step; only the sampled packet cache was completed

- `2026-04-23 11:46 UTC`
  - added a Bazel-runnable writer utility at `tools/parking_model_analysis_writer/` to persist cached UNPUDO / unparking model-analysis rows into `parking.model_analysis` using Databricks Connect
  - the first writer attempt proved that stale run-report sections can overcount `non-av` / outdated events, so the writer was tightened to use the model-card event table as the authoritative filter and only use run reports for row content
  - wrote `pink-manta-ray-smooth` and `armadillo-amethyst-squeaky` into `parking.model_analysis`
  - staged payload for audit at `model_analysis/staged_rows/pink-and-armadillo-2026-04-23.json`
  - validated pre-write and post-write grouped counts on the Databricks-backed table
  - final table counts written:
    - `pink-manta-ray-smooth`
      - `unpudo`: `56` pass, `239` fail, `2` accidental
      - `unparking`: `9` pass, `3` accidental
      - total rows: `309`
    - `armadillo-amethyst-squeaky`
      - `unpudo`: `60` pass, `165` fail, `3` accidental
      - `unparking`: `5` pass, `1` fail
      - total rows: `234`

- `2026-04-23 12:19 UTC`
  - user requested a fairer `eel-teal-outspoken` comparison based on run IDs rather than event-outcome sampling
  - measured the full event population on the already-selected `76` runs:
    - `519` events total
    - `493` `unpudo`
    - `26` `unparking`
  - patched `export_model_event_packets.py` to accept a `--run-ids-file` allowlist so one model can be refreshed on an exact run cohort
  - started a run-complete refresh for `eel-teal-outspoken` on those same `76` runs to analyze the `276` events that were missing from the earlier event-sampled pass
