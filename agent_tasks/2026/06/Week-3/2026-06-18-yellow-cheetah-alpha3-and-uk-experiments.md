# 2026-06-18 Yellow Cheetah Alpha3 and UK Experiments

## Summary

Added a model note, triggered Alpha3 Model CI, and created UK PUDO licensing plus UK Drift/PUDO experiments for `yellow-cheetah-sparkling`.

## Model

- Nickname: `yellow-cheetah-sparkling`
- Session: `session_2026_06_17_19_32_49_si_parking_bc_train_release_2026_5_21_ndpudo`
- Checkpoint: `10`
- Steps: `100000`
- Gen2 artefact: `d47f07fc-4ac3-4ab3-a693-8629000fdc00`
- Console: https://console.sso.wayve.ai/model/session_2026_06_17_19_32_49_si_parking_bc_train_release_2026_5_21_ndpudo

## Model CI

- Buildkite build: `76550`
- Buildkite id: `019edae6-952d-4dde-9eb1-9c46aee9e353`
- Buildkite URL: https://buildkite.com/wayve-dot-ai/model-ci/builds/76550
- Triggered target vehicle model: `gen2-av-mache-alpha3`
- Status at last check:
  - `Model Deployment Archive Gen2`: `success`
  - `Eval Studio (Gen 2 Alpha 3)`: `in_progress`
  - `Gen2 Alpha3 HiL Model Validation`: `in_progress`

## Console Note

- Note id: `c777d26a-ad27-4d73-afab-d9e8f218b94c`

## Follow-up Experiments

- UK PUDO licensing experiment: https://console.sso.wayve.ai/on-road-experiments/bb5b0076-4d81-4546-b335-b557b66299fd
  - Reference: https://console.sso.wayve.ai/on-road-experiments/f01a70c9-a7ea-4bed-82fa-c8f081ef3ec6
  - Status at creation: `pending_approval`
  - Control: `green-stegosaurus-brave`
  - Variant: `yellow-cheetah-sparkling`
  - Theme: `Licensing` (`4582f9bb-00c5-494e-9734-de96ba924823`)
- UK Drift/PUDO experiment: https://console.sso.wayve.ai/on-road-experiments/9765b6cf-11cf-4164-9b23-54760fff764e
  - Reference: https://console.sso.wayve.ai/on-road-experiments/23b1ddec-f725-4a8f-9561-0e06b7e78476
  - Status at creation: `pending_approval`
  - Control: `green-stegosaurus-brave`
  - Variant: `yellow-cheetah-sparkling`
  - Controller: default/no explicit controller
  - PUDO/SBW driving feature config copied from the reference experiment
  - Theme: `P1 - Robotaxi + PUDO` (`2fad6b3d-2fc4-4c3a-87c8-be03d76b5119`)
