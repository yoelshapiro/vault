# Parking Deploy: Violet/Pink

## Summary

Running `$parking-deploy` for:
- `violet-happy-dolphin`
- `pink-owl-vociferous`

Both source models resolved in Model Catalogue and latest checkpoint resolved to checkpoint `10`, corresponding to `model-checkpoint-000100000.ckpt` and deploy `--step 100000`.

Training provenance for both models points to branch `boris/pudo_w_route_path_fixes_and_new_data`.
- `violet-happy-dolphin`: commit `572153f43429f9bf8a8841007bee2cbdf55c4d3f`
- `pink-owl-vociferous`: commit `da95609a7a4d9f74292c0d6e83976e97e5dd5be7`

The workspace has been checked out to `boris/pudo_w_route_path_fixes_and_new_data` at `572153f43429f9bf8a8841007bee2cbdf55c4d3f`, which includes the deploy interleave-control flags.

## Deploy Attempts

Both deploys were run through spawned workers, as required by workspace protocol.

### violet-happy-dolphin

Source session:
`session_2026_04_30_19_28_13_si_parking_bc_train_gear_indicator_wonjoon_full_aug`

Command attempted:

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

Outcome: rerun in progress after checking out the training/deploy branch.

### pink-owl-vociferous

Source session:
`session_2026_04_30_19_00_22_si_parking_bc_train_gear_indicator_gi_parking_aug_retry`

Command attempted:

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

Outcome: rerun in progress after checking out the training/deploy branch.

## Investigation

The reference model `exotic-jellyfish-silver` was created with the old `//wayve/ai/si:deploy` command and the same interleave-control flags.

The initial checkout did not expose those flags in `wayve/ai/si/deploy.py`, causing both first attempts to fail before upload.

The training branch `boris/pudo_w_route_path_fixes_and_new_data` does expose:
- `--enable_interleave_control`
- `--interleave_control_group`

No downstream notes, Model CI, Eval Studio runs, or parking follow-up evaluations should be started until the uploaded deployment sessions exist.

## Current Step

Two deploy workers are running:
- `violet-happy-dolphin` with suffix `__violet-happy-dolphin_interleave_control_v1`
- `pink-owl-vociferous` with suffix `__pink-owl-vociferous_interleave_control_v1`
