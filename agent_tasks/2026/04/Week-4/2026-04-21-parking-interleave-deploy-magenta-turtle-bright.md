# Parking Interleave Deploy: magenta-turtle-bright

- Date: 2026-04-21
- Source model: `magenta-turtle-bright`
- Source session: `/mnt/remote/azure_session_dir/Parking/parking_bc/session_2026_04_20_11_08_37_si_parking_bc_train_release_2026_5_11_jitfix1`
- Output session: `/mnt/remote/azure_session_dir/Parking/parking_bc/session_2026_04_20_11_08_37_si_parking_bc_train_release_2026_5_11_jitfix1__magenta-turtle-bright_interleave_control_v1`
- Output session id: `session_2026_04_20_11_08_37_si_parking_bc_train_release_2026_5_11_jitfix1__magenta-turtle-bright_interleave_control_v1`
- Assigned nickname: `insightful-magenta-porcupine`
- Console URL: `https://console.sso.wayve.ai/model/session_2026_04_20_11_08_37_si_parking_bc_train_release_2026_5_11_jitfix1__magenta-turtle-bright_interleave_control_v1`

## What changed
- Deployed `magenta-turtle-bright` with parking interleave control enabled.
- Used temporal caching and uploaded the compiled session to console.
- Verified `gen2_model_inference_config.json` exports radar data with 5 expected features and `points_per_scan: 800`.

## Local deploy hotfix
- Restored `get_video_temporal_cache(...)` in `wayve/ai/si/models/deployment.py` so `wayve/ai/si/deploy.py` can import and run.
- This was required because the branch had a deploy-path import break.

## Notes
- ONNX artefact registration hit the known non-blocking `path=None` validation error, but the primary console upload succeeded.
- Notion update could not be completed because the Notion connector token is expired (`401 token_expired`).
