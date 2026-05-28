# 2026-05-28 PUDO 2026.6.21 Beige Train Monitor

## Summary
- Submitted the PUDO BC 80k retry from `boris/05-21-updated-pudo-config` after `w_behavior_control=0.0` was pushed.
- First retry, `aquamarine-glamorous-anteater`, reached `trainer/train_step=5000` and failed on a W&B artifact-name length limit.
- Resubmitted with short manual session tag `p621bc0`, producing `beige-hornet-striped`.
- Updated the Parking/PUDO Notion model-card row to point at `beige-hornet-striped`.
- Monitored until W&B showed `trainer/train_step=5069` and state `running`.
- Checked Loki around the crossing; no fatal, artifact-name, or incompatible-input errors matched.

## Run
- Nickname: `beige-hornet-striped`
- Surfboard job: `170708` (`beige-hornet-striped-170708`)
- W&B run: `session_2026_05_28_14_41_21_p621bc0`
- Branch: `boris/05-21-updated-pudo-config`
- Commit: `b2b48ca39e8e9ecb92e422f9c530ebf342bda5a7`
- Config: `+mode=parking_bc_train_release_2026_6_21 +datamodule=pudo_bc_datamodule num_steps=80000`
- Cluster: AKS `dgx-h100`, 4 nodes, P1

## Outcome
- Passed the requested 5k monitor point.
- At 2026-05-28 15:24 UTC, W&B showed `trainer/train_step=5069`, `trainer/global_step=5069`, and state `running`.
- Notion row `beige-hornet-striped (not interleaved)` was updated with the nickname and 5k monitor result.
