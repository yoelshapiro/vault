# Stork Aquamarine PUDO UK Licensing Experiment

## Summary
- Created a UK PUDO licensing on-road experiment for deployed model `stork-aquamarine-astonishing`.
- Used the `$parking-deploy` UK licensing experiment flow without starting a new deploy.

## Model
- Nickname: `stork-aquamarine-astonishing`
- Session id: `session_2026_04_28_10_58_16_si_parking_bc_train_release_2026_5_11_exotic_jellyfish_weights_70_15_10_5_80k_d26_3_9__apricot-mongoose-cognizant_interleave_control_v1`
- Checkpoint: `1`
- Gen2 artefact id: `1f1b0ccc-0050-409c-8f5d-beb222304ead`
- Vehicle model options verified for the artefact: `gen2-av-mache`, `gen2-av-mache-alpha3`
- Existing model change notes found before experiment creation.

## Experiment
- Name: `PUDO licensing [UK] stork-aquamarine-astonishing 2026-04-29`
- Experiment id: `d2210a1b-eba9-4154-ab1d-afafe1222e39`
- Template: `[UK] PUDO Licensing`
- Template id: `1faea8e5-b080-43b8-ab41-0ef364d57236`
- Vehicle model: `gen2-av-mache-alpha3`
- Status: `pending_approval`
- Fleet usage request theme id: `4582f9bb-00c5-494e-9734-de96ba924823`
- Run assignment batch id: `a4a1694d-efbb-4e5e-86c6-f353b5ae9068`
- Run assignment id: `492b7bf0-7184-4063-92af-7f9a1064e925`
- Run assignment status: `pending_approval`

## Notes
- The create response did not echo the fleet usage theme field, but a direct experiment GET returned `fleet_usage_request_theme_id=4582f9bb-00c5-494e-9734-de96ba924823`.
- The experiment was not approved and no assignments were started.
