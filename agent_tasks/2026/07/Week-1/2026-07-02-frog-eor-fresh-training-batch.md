# 2026-07-02 Frog EOR Fresh Training Batch

## Summary

Started three fresh Parking/PUDO training runs from the `frog-bronze-tessellated` commit code, without checkpoint weight restart. All runs use:

- `+mode=parking_bc_train_release_2026_5_21`
- `+datamodule=parking_bc_datamodule`
- `num_steps=100000`
- stateless EOR hysteresis: `END_OF_ROUTE_THRESHOLD = 3.75e4`, `END_OF_ROUTE_EXIT_THRESHOLD = 4.5e4`
- `enable_end_of_route_hazard_lights = True`
- `enable_end_of_route_gear_latch = True`

Source frog commit: `a7be3baacc633e5d407f95227266537c41974e3b`.

## Runs

| Variant | Branch | Commit | Nodes | Job | W&B |
| --- | --- | --- | --- | --- | --- |
| Baseline original data | `boris/parking-frog-eor-fresh-base` | `339b8da8f88dca1d6d745112ddd536a6c6b38f9e` | 8 | `187893` | `session_2026_07_02_21_48_15_si_parking_bc_train_release_2026_5_21_frog-eor-n8` |
| 70% driving data mix | `boris/parking-frog-eor-fresh-driving70` | `75d6d379dabcf62dfc4a2b9f88235120f748d350` | 4 | `187902` | `session_2026_07_02_22_01_25_si_parking_bc_train_release_2026_5_21_frog-eor-d70` |
| Raw-gear PUDO/UNPUDO data root | `boris/parking-frog-eor-fresh-rawgear` | `bc7694510edc612d813017365dc51a6d8649cba3` | 4 | `187920` | `session_2026_07_02_22_18_33_si_parking_bc_train_release_2026_5_21_frog-eor-raw` |

## Monitoring

Spawned one monitor subagent per job to watch to 1K steps, retry/fix up to three times on failure, update Boris on Slack, and update the Parking PUDO Notion page if the run passes 1K.

- Run 1 passed the 1K gate at W&B global step `1210`; no retries.
- Run 1 Notion update was blocked by connector reauth: `UNAUTHORIZED`, `oauth_token_invalid_grant`, `TRIGGER_REAUTHENTICATION`.
- Run 2 and run 3 monitors were spawned after their jobs were queued.

## Slack

- Run 1 queued: https://wayve-ai.slack.com/archives/D09SNLZT7PA/p1783028922609479
- Run 2 queued: https://wayve-ai.slack.com/archives/D09SNLZT7PA/p1783029707968999
- Run 3 queued: https://wayve-ai.slack.com/archives/D09SNLZT7PA/p1783030739262309
