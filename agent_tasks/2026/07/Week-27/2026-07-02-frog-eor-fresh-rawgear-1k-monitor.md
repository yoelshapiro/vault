# 2026-07-02 Frog EOR Fresh Raw-Gear 1K Monitor

## Summary

Monitored Parking/PUDO training run 3 for the fresh frog EOR raw-gear variant until it passed the 1K-step gate.

## Run

- Worktree: `/tmp/wayvecode-frog-eor-fresh-rawgear`
- Branch: `boris/parking-frog-eor-fresh-rawgear`
- Commit: `bc7694510edc612d813017365dc51a6d8649cba3`
- Surfboard job: `187920`
- Nickname: `parrot-turquoise-earnest`
- Session: `session_2026_07_02_22_18_33_si_parking_bc_train_release_2026_5_21_frog-eor-raw`
- W&B: https://wandb.ai/wayve-ai/parking_bc/runs/session_2026_07_02_22_18_33_si_parking_bc_train_release_2026_5_21_frog-eor-raw

## Observations

- Job moved from `Dispatched` to `Running` at `2026-07-02 22:23 UTC`.
- W&B became visible at step `0`, then started training after dataloader startup.
- Recent logs showed data-loading warnings such as `radar_byte_range_invalid`, `intervention_exception`, and one path `DistanceOutOfRangeException`; no terminal failure occurred.
- The run crossed the requested gate at `2026-07-02 22:38:28 UTC` with W&B `trainer/global_step=1114`.
- Final read for this monitoring session: Surfboard `Running`, W&B `trainer/global_step=1201`, `trainer/samples_seen=76864`, `throughput/train_samples_per_sec_world=189.24000002819895`, MFU `14.62135186864926`.

## Updates

- Sent the monitoring-start Slack DM to Boris: https://wayve-ai.slack.com/archives/D09SNLZT7PA/p1783030770273539
- The 1K-passed Slack update could not be sent because the Slack connector returned `HTTP 401 token_expired`.
- The Parking/PUDO model-card update could not be performed because the Notion connector returned `HTTP 401 token_expired` before schema fetch.

## Retry Ledger

- Retry attempts: `0`
- Code changes: none
- Relaunches: none
