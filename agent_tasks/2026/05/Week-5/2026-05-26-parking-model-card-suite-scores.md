# 2026-05-26 Parking Model Card Suite Scores

## Summary
Updated the Notion database `Parking/PUDO model cards` under `Parking/PUDO Model Development` with Eval Studio suite scores, using only the `Model ` title column.

## Suites
- `PUDO/UNPUDO Suite`: `Pudo-Unpudo`, version `86b2105d-3f72-4620-b020-0b10e445798d`; used `scorecard_score`.
- `Alpha3 Intervention Suite`: `Alpha3 Intervention Suite [2k] [Alpha3] [Interventions] [Burndown] [LessWrong]`, version `5601afa8-d13f-4b65-8ceb-ae0a89f56569`; used `less_wrong_score`.

## Rows filled
- `exotic-jellyfish-silver`: PUDO/UNPUDO `68.5%`.
- `reassured-red-sea-turtle`: PUDO/UNPUDO `75.9%`.
- `circumspect-harlequin-elephant`: PUDO/UNPUDO `75.2%`, Alpha3 `68.2%`.
- `dalmatian-scarlet-musical`: PUDO/UNPUDO `8.1%`, Alpha3 `72.5%`.
- `fuchsia-tiger-masked`: PUDO/UNPUDO `7.7%`, Alpha3 `67.7%`.
- `condor-fearless-ivory`: PUDO/UNPUDO `78.4%`, Alpha3 `64.8%`.
- `armadillo-adaptable-maroon`: PUDO/UNPUDO `79.2%`, Alpha3 `64.8%`.
- `noncommittal-yellow-stingray`: PUDO/UNPUDO `76.9%`, Alpha3 `69.7%`.

## Notes
Rows with no execution for the exact suite versions were left blank. Did not use `Lineage` or `Related nicknames` for fallback resolution.

## Follow-up: any-version sweep
After the initial fixed-version update, rechecked blank rows against the suite UUIDs for any version:
- Pudo-Unpudo suite UUID `ea663952-b914-47a3-8cc1-729db3683dce`.
- Alpha3 Intervention LessWrong suite UUID `47e111a7-804c-49ec-b60e-126f904d71fe`.

Additional row filled:
- `proficient-centipede-indigo`: PUDO/UNPUDO `7.0%`, Alpha3 `72.0%`.

All other blank rows returned `NO_EXECUTION` for both suite UUIDs using only the `Model ` title column.
