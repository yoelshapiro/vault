# 2026-07-02 Frog EOR Fresh Driving70 1K Monitor

## Summary

Monitored Parking/PUDO Surfboard job `187902` for the fresh frog commit 70% driving / 30% non-driving variant until it passed the 1K training-step gate.

## Run

- Worktree: `/tmp/wayvecode-frog-eor-fresh-driving70`
- Branch: `boris/parking-frog-eor-fresh-driving70`
- Commit: `75d6d379dabcf62dfc4a2b9f88235120f748d350`
- Commit date: `2026-07-02T21:15:46Z`
- Surfboard job: `187902`
- Surfboard nickname: `salmon-silver-prototypical`
- Session: `session_2026_07_02_22_01_25_si_parking_bc_train_release_2026_5_21_frog-eor-d70`
- W&B: https://wandb.ai/wayve-ai/parking_bc/runs/session_2026_07_02_22_01_25_si_parking_bc_train_release_2026_5_21_frog-eor-d70

## Variant

- Fresh frog commit.
- Parking datamodule code changed for 70% driving / 30% non-driving.
- Stateless EOR hysteresis.
- `END_OF_ROUTE_THRESHOLD=3.75e4`
- `END_OF_ROUTE_EXIT_THRESHOLD=4.5e4`
- `enable_end_of_route_hazard_lights=True`
- `enable_end_of_route_gear_latch=True`

## Result

- Last observed Surfboard status: `Running`
- Last observed W&B state: `running`
- Last observed step: `trainer/global_step=1173`
- Last observed samples: `trainer/samples_seen=75072`
- Last observed loss: `loss=3.356532096862793`
- Last observed throughput: `throughput/train_samples_per_sec_world ~= 200.8`
- Surfboard MFU: `14.810935235588953`
- Retry attempts: none
- Training metrics reached step 1 by `2026-07-02 22:11:08 UTC` and passed 1K by `2026-07-02 22:18:32 UTC`.

## Updates

- Sent Slack start update to Boris: https://wayve-ai.slack.com/archives/D09SNLZT7PA/p1783029724982739
- Sent Slack 1K-passed update: https://wayve-ai.slack.com/archives/D09SNLZT7PA/p1783030727000849
- Sent Slack Notion-blocker update: https://wayve-ai.slack.com/archives/D09SNLZT7PA/p1783030749055759

## Blockers

- Parking/PUDO Notion model-page update was blocked by Notion connector reauthentication:
  - Error: `UNAUTHORIZED`
  - Reason: `oauth_token_invalid_grant`
  - Action: `TRIGGER_REAUTHENTICATION`
- Model Catalogue lookup by session returned no indexed nickname yet; use Surfboard nickname `salmon-silver-prototypical` until catalogue indexing catches up.
