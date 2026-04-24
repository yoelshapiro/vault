# Remove Early UNPUDO Model Cards

Scope:
- remove selected early model cards and only the run reports that are no longer referenced by any remaining model card

Models removed:
- `harlequin-excited-greyhound`
- `blue-panther-solid`
- `alpaca-chocolate-fearless`
- `apricot-crocodile-uproarious`
- `armadillo-amethyst-squeaky`
- `lively-orange-horse`
- `plum-timeless-beaver`
- `satisfied-amber-moose`

Safety rule:
- keep any run report file that is still linked from a remaining model card

Result:
- removed `8` model cards
- removed `288` run report files that were exclusive to those model cards
- kept `28` shared run report files because they are still referenced by remaining model cards

Verification:
- remaining model cards: `5`
- remaining run report files: `277`
- remaining model-card links pointing at missing run reports: `0`

Remaining model cards:
- `eel-teal-outspoken`
- `insightful-magenta-porcupine`
- `mallard-plum-mysterious`
- `pink-manta-ray-smooth`
- `sea-cucumber-spectacular-orange`

Notes:
- this was a vault-only cleanup; `parking.model_analysis` was not modified
