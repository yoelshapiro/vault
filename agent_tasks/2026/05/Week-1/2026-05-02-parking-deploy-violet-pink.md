# Parking Deploy: Violet/Pink

## Summary

Ran `$parking-deploy` for:
- `violet-happy-dolphin`
- `pink-owl-vociferous`

Both source models resolved in Model Catalogue and latest checkpoint resolved to checkpoint `10`, corresponding to `model-checkpoint-000100000.ckpt` and deploy `--step 100000`.

Training provenance for both models pointed to branch `boris/pudo_w_route_path_fixes_and_new_data`.
- `violet-happy-dolphin`: commit `572153f43429f9bf8a8841007bee2cbdf55c4d3f`
- `pink-owl-vociferous`: commit `da95609a7a4d9f74292c0d6e83976e97e5dd5be7`

The workspace was checked out to `boris/pudo_w_route_path_fixes_and_new_data`, which includes the deploy interleave-control flags.

## Deployments

Both deploys were run through spawned workers, as required by workspace protocol.

### violet-happy-dolphin

Source session:
`session_2026_04_30_19_28_13_si_parking_bc_train_gear_indicator_wonjoon_full_aug`

Deploy command:

```bash
bazel run //wayve/ai/si:deploy -- \
  --step 100000 \
  --suffix __violet-happy-dolphin_interleave_control_v1 \
  --with_temporal_caching True \
  --upload \
  --enable_interleave_control \
  --interleave_control_group parking \
  --session_path /mnt/remote/azure_session_dir/Parking/parking_bc/session_2026_04_30_19_28_13_si_parking_bc_train_gear_indicator_wonjoon_full_aug
```

Outcome:
- Deployed session: `session_2026_04_30_19_28_13_si_parking_bc_train_gear_indicator_wonjoon_full_aug__violet-happy-dolphin_interleave_control_v1`
- Output path: `/mnt/remote/azure_session_dir/Parking/parking_bc/session_2026_04_30_19_28_13_si_parking_bc_train_gear_indicator_wonjoon_full_aug__violet-happy-dolphin_interleave_control_v1`
- Console: `https://console.sso.wayve.ai/model/session_2026_04_30_19_28_13_si_parking_bc_train_gear_indicator_wonjoon_full_aug__violet-happy-dolphin_interleave_control_v1`
- Assigned nickname: `goose-fierce-crimson`
- Gen2 artefact: `d3ec2ab9-f058-4617-85a3-95379471ae98`
- Gen1 artefact: `d202b266-c9eb-4314-bef4-ecd64db01a8b`
- Deployed checkpoint in Catalogue: `1`, sourced from step `100000`
- Radar/interleave verification: passed; exported config contains `radar_data`, expected radar features, `points_per_scan: 800`, and `INTERLEAVE_GROUP_PARKING`

### pink-owl-vociferous

Source session:
`session_2026_04_30_19_00_22_si_parking_bc_train_gear_indicator_gi_parking_aug_retry`

Deploy command:

```bash
bazel run //wayve/ai/si:deploy -- \
  --step 100000 \
  --suffix __pink-owl-vociferous_interleave_control_v1 \
  --with_temporal_caching True \
  --upload \
  --enable_interleave_control \
  --interleave_control_group parking \
  --session_path /mnt/remote/azure_session_dir/Parking/parking_bc/session_2026_04_30_19_00_22_si_parking_bc_train_gear_indicator_gi_parking_aug_retry
```

Outcome:
- Deployed session: `session_2026_04_30_19_00_22_si_parking_bc_train_gear_indicator_gi_parking_aug_retry__pink-owl-vociferous_interleave_control_v1`
- Output path: `/mnt/remote/azure_session_dir/Parking/parking_bc/session_2026_04_30_19_00_22_si_parking_bc_train_gear_indicator_gi_parking_aug_retry__pink-owl-vociferous_interleave_control_v1`
- Console: `https://console.sso.wayve.ai/model/session_2026_04_30_19_00_22_si_parking_bc_train_gear_indicator_gi_parking_aug_retry__pink-owl-vociferous_interleave_control_v1`
- Assigned nickname: `observant-yak-silver`
- Gen2 artefact: `362f8b18-2477-4074-b4b1-4061987eb14a`
- Gen1 artefact: `2416b9ff-e095-439a-bbfc-01c6cfc130aa`
- Deployed checkpoint in Catalogue: `1`, sourced from step `100000`
- Radar/interleave verification: passed; exported config contains `radar_data`, expected radar features, `points_per_scan: 800`, and `INTERLEAVE_GROUP_PARKING`

## Console Notes

Added the standard Parking/PUDO note to both deployed sessions:
- `goose-fierce-crimson`: note id `12b21f7d-5976-4f65-9d23-646ef2facdc2`
- `observant-yak-silver`: note id `2abf09d6-0db9-4684-96db-3bfd6c26e618`

## Model CI

Triggered Gen2 AV Mache Alpha 3 Model CI for both Gen2 artefacts:
- `goose-fierce-crimson`: Buildkite `69720`, `https://buildkite.com/wayve-dot-ai/model-ci/builds/69720`
- `observant-yak-silver`: Buildkite `69721`, `https://buildkite.com/wayve-dot-ai/model-ci/builds/69721`

Latest observed state:
- Build `69720`: running; deployment archive passed, Eval Studio passed, Gen2 Alpha3 HiL validation running, license step blocked behind the manual gate.
- Build `69721`: failing; deployment archive passed, Gen2 Alpha3 HiL validation running, Eval Studio failed while triggering `Alpha3 Intervention Suite [Burndown]` due a `502` from Model Catalogue / AI Lab. Attempted Buildkite job retry, but the available API token lacks `write_builds`.

Compensating action:
- Manually triggered `Alpha3 Intervention Suite [Burndown]` for `observant-yak-silver`: execution `49f59f0f-f223-468f-84d6-0e0acbe45106`, `IN_PROGRESS`, `9226` segments.
- The corresponding suite for `goose-fierce-crimson` was already triggered by Model CI: execution `d0d81a19-71b1-4b0d-91c5-9d926240daef`, `IN_PROGRESS`.

## Parking Follow-Up Suites

Triggered the required parking follow-up AV test suites through AI Lab:

Suite `Failed to Unpudo Standstill(No Indicator)`:
- Suite UUID: `520e4718-afc6-4d46-9eea-57b850c06fad`
- `goose-fierce-crimson`: execution `826496d2-6440-4728-bd4f-61c068b24700`, `IN_PROGRESS`, `1274` segments
- `observant-yak-silver`: execution `6b50acbe-8ff3-40a7-bf3e-93848eb1288a`, `IN_PROGRESS`, `1274` segments

Suite `[MB] Failure to Accel from Stopped`:
- Suite UUID: `c693507e-a891-4cd7-9963-b4c08cdbecdf`
- `goose-fierce-crimson`: execution `8740cfea-6fb9-4b4e-9fd1-579c8a9b32df`, `IN_PROGRESS`, `696` segments
- `observant-yak-silver`: execution `2767e413-32fe-4750-ac78-54d703c7836d`, `IN_PROGRESS`, `696` segments

## Notes

Non-blocking deploy warnings observed:
- ONNX artefact upload validation reported a path `None`, but deploy continued.
- `stride_sec=0.04` warning is not a multiple of `0.05s`.
- `data_provenance` asset was missing.
- `gen2_model_trace` was already uploaded.

No UK licensing experiment was created because it was not requested.
