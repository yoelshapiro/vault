# 2026-07-02 Frog EOR Fresh-Base 1K Monitor

## Summary

Monitored Parking/PUDO Surfboard job `187893` for the fresh frog commit baseline until it passed the 1K training-step gate.

## Run

- Worktree: `/tmp/wayvecode-frog-eor-fresh-base`
- Branch: `boris/parking-frog-eor-fresh-base`
- Commit: `339b8da8f88dca1d6d745112ddd536a6c6b38f9e`
- Commit date: `2026-07-02T21:15:36Z`
- Surfboard job: `187893`
- Surfboard nickname: `vigorous-lime-caterpillar`
- Session: `session_2026_07_02_21_48_15_si_parking_bc_train_release_2026_5_21_frog-eor-n8`
- W&B: https://wandb.ai/wayve-ai/parking_bc/runs/session_2026_07_02_21_48_15_si_parking_bc_train_release_2026_5_21_frog-eor-n8

## Result

- Last observed Surfboard status: `Running`
- Last observed W&B state: `running`
- Last observed step: `trainer/global_step=1210`, `trainer/train_step=1210`
- Last observed throughput: `throughput/train_samples_per_sec_world ~= 316.4`, `throughput/world_size=64`
- Retry attempts: none
- Startup notes: first iteration began at `2026-07-02 21:58:16 UTC`; training metrics reached step 1 by `22:00:33 UTC`.

## Updates

- Sent Slack start update to Boris: https://wayve-ai.slack.com/archives/D09SNLZT7PA/p1783028955457149
- Sent Slack 1K-passed update: https://wayve-ai.slack.com/archives/D09SNLZT7PA/p1783030199693599
- Sent Slack Notion-blocker update: https://wayve-ai.slack.com/archives/D09SNLZT7PA/p1783030223568129

## Blockers

- Parking/PUDO Notion model-page update was blocked by Notion connector reauthentication:
  - Error: `UNAUTHORIZED`
  - Reason: `oauth_token_invalid_grant`
  - Action: `TRIGGER_REAUTHENTICATION`
- Model Catalogue lookup by session returned no indexed nickname yet; use Surfboard nickname `vigorous-lime-caterpillar` until catalogue indexing catches up.
