# Parking Deploy: aquamarine-angelfish-mercurial

## Summary
- Source model: `aquamarine-angelfish-mercurial`
- Source session: `session_2026_05_02_20_07_40_si_parking_bc_train_release_2026_5_11_may01_pudo_gc_shortdm_rootfix`
- Source path: `/mnt/remote/azure_session_dir/Parking/parking_bc/session_2026_05_02_20_07_40_si_parking_bc_train_release_2026_5_11_may01_pudo_gc_shortdm_rootfix`
- Source checkpoint: latest checkpoint index `8`, deployed with `--step 80000`
- Deploy suffix: `__aquamarine-angelfish-mercurial_interleave_control_v1`
- Output session: `session_2026_05_02_20_07_40_si_parking_bc_train_release_2026_5_11_may01_pudo_gc_shortdm_rootfix__aquamarine-angelfish-mercurial_interleave_control_v1`
- Deployed nickname: `stork-magenta-mysterious`
- Console URL: `https://console.sso.wayve.ai/model/session_2026_05_02_20_07_40_si_parking_bc_train_release_2026_5_11_may01_pudo_gc_shortdm_rootfix__aquamarine-angelfish-mercurial_interleave_control_v1`

## Deploy Command
```bash
bazel run //wayve/ai/si:deploy -- \
  --step 80000 \
  --suffix __aquamarine-angelfish-mercurial_interleave_control_v1 \
  --with_temporal_caching True \
  --upload \
  --enable_interleave_control \
  --interleave_control_group parking \
  --session_path /mnt/remote/azure_session_dir/Parking/parking_bc/session_2026_05_02_20_07_40_si_parking_bc_train_release_2026_5_11_may01_pudo_gc_shortdm_rootfix
```

## Results
- Deploy exit code: `0`
- Radar config verification: passed (`radar_data`, five radar features, `points_per_scan=800`)
- Gen2 artefact id: `1752b39d-fde1-4bd6-a589-32ab55d84d8f`
- Checkpoint hash: `d70c1cc1c1078695191ac634d1f2de47`
- Added standard Parking/PUDO Console note: `35a5b7a6-ba9d-4df4-8329-ccebab06aef5`
- Triggered Model CI build: `69816`
- Buildkite: `https://buildkite.com/wayve-dot-ai/model-ci/builds/69816`

## Latest Model CI Status
- Build state: `running`
- Pipeline trigger: `passed`
- Model Deployment Archive Gen2: `passed`
- Gen2 Alpha3 HiL Model Validation: `running`
- Eval Studio (Gen 2 Alpha 3): `running`
- Gen 2 Alpha3 License: `blocked`

## Notes
- Deploy used the clean training worktree branch `boris/training/kangaroo_new_pudo_unpudo_unpark_root` at commit `de06dae0999`.
- Source training job `158000` was completed before deployment.
- The known non-blocking ONNX artefact upload validation warning appeared after ONNX export was skipped; main console upload succeeded.

## UK Licensing Experiment
- Experiment id: `2634bafc-7bae-4816-9e73-641447b9f573`
- Experiment index: `25901`
- Name: `:robot: PUDO licensing [UK] stork-magenta-mysterious 2026-05-03`
- Status: `pending_approval`
- Template: `[UK] PUDO Licensing` (`1faea8e5-b080-43b8-ab41-0ef364d57236`)
- Vehicle model: `gen2-av-mache-alpha3`
- Control artefact: `1752b39d-fde1-4bd6-a589-32ab55d84d8f`
