---
title: Vault Parking Newsletters
type: source
owner: Boris Indelman
created: 2026-05-23
updated: 2026-07-27
status: active
tags:
  - llm-wiki
  - vault
  - parking
source_type: vault
source_ref: ${HOME}/git/vault/newsletters
---

# Vault Parking Newsletters

## Source Metadata

- Source type: existing vault newsletters.
- Retrieved: 2026-05-23.
- Inspected files:
  - `${HOME}/git/vault/newsletters/newsletter_generic-parking-pudo-materialisation.md`
  - `${HOME}/git/vault/newsletters/newsletter_parking-stopping-mode-dilc.md`
  - `${HOME}/git/vault/newsletters/newsletter_pudo-update-january-driving-release-2026-5-4.md`
  - `${HOME}/git/vault/newsletters/newsletter_parking-maneuver-filters.md`

## Why This Matters

These newsletters capture Boris's prior parking work in a more readable form than raw PR diffs. They give the wiki historical context for PUDO materialisation, stopping-mode conditioning, parking model deltas from release BC, and sampling filter risks.

## Key Facts

- Generic parking/PUDO materialisation moves PUDO, park, UNPUDO, and unparking bucket logic into `wayve/ai/services/sampling` so it can be versioned, tested, launched through Flyte, and consumed through the generic sampling platform.
- The generic dataset emits event types `pudo`, `park`, `unpudo`, and `unparking`, with UK and USA buckets on Gen2 Mache data using `wayve_corpus.all_data` as the base table.
- Generic materialisation uses gear reconstruction/smoothing, long `gear == 0` segments, and hazard presence in the parked segment to split PUDO/UNPUDO from park/unparking.
- Park/PUDO windows are approach-to-stop windows. UNPUDO/unparking windows include a pre-exit standstill buffer and a forward departure window clipped by progress.
- DC buckets get progress checks: approach progress for park/PUDO and departure progress for UNPUDO/unparking. AV/pre-CA/CA buckets keep awkward, stuck, and aborted cases because those may be exactly the failures.
- Bucket families include DC all-direction, DC forward/reverse, DC gear-change, pre-CA, CA short, and CA long variants.
- A key known difference from notebook-generated event tables is that the generic path currently uses hazard presence rather than richer trip table or destination context for PUDO classification.
- Stopping-mode conditioning introduced a `stopping_mode` input so the model can distinguish PARK from PUDO. On board, intent can come from a DILC toggle; in training and tests, it can be injected directly.
- Parking/PUDO release update notes describe a release-aligned model path with data mix changes and parking/PUDO-specific `gear_direction`, `parking_mode`, and gear-direction output additions.

## Workflow Knowledge

- Treat sampling changes as model changes: they change what the policy learns even if architecture is unchanged.
- For parking sampling changes, update filter logic, bucket inventory, and tests together.
- When validating generic materialisation against notebooks, compare event counts, unique `(run_id, timestamp_unixus)` counts, directional split ratios, CA/pre-CA density, and examples against `parking.pudo_unpudo_unpark_events`.
- Route shortening and stopping-mode conditioning should be validated visually; empty or near-empty polylines can create invalid map inputs.

## Affected Wiki Pages

- [[llm_wiki/systems/parking-data-and-labels|Parking data and labels]]
- [[llm_wiki/systems/parking-model-architecture|Parking model architecture]]
- [[llm_wiki/workflows/parking-development-workflow|Parking development workflow]]

## Contradictions or Changes

- The older naive stopping-mode newsletter uses a legacy enum. Current code uses `0=UNAVAILABLE`, `1=PUDO`, `2=PARK`; cite code for enum facts.
- Generic materialisation and notebook/event-table paths can disagree because they use different PUDO signals.

## Open Questions

- Which generic materialisation dataset version should replace notebook-derived event tables for release workflows?
- Which stop-intent source should be trusted when hazard, DILC, trip destination, and route context disagree?
