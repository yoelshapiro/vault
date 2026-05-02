# Parking Deploy Attempt: Violet/Pink

## Summary

Attempted `$parking-deploy` for:
- `violet-happy-dolphin`
- `pink-owl-vociferous`

Both source models resolved in Model Catalogue and latest checkpoint resolved to checkpoint `10`, corresponding to `model-checkpoint-000100000.ckpt` and deploy `--step 100000`.

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

Outcome: failed before deployment.

Error:

```text
deploy.py: error: unrecognized arguments: --enable_interleave_control --interleave_control_group parking
```

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

Outcome: failed before deployment.

Error:

```text
deploy.py: error: unrecognized arguments: --enable_interleave_control --interleave_control_group parking
```

## Investigation

The reference model `exotic-jellyfish-silver` was created with the old `//wayve/ai/si:deploy` command and the same interleave-control flags.

Current checkout does not expose those flags in `wayve/ai/si/deploy.py`. PR `102398` (`03-20-si-group-interleave-control-support`) adds:
- `--enable_interleave_control`
- `--interleave_control_group`
- wrapper support for `interleave_control`
- parking group behavior

No downstream notes, Model CI, Eval Studio runs, or licensing experiments were started because neither deployed interleave model exists.

## Next Step

Checkout or otherwise apply PR `102398`, then rerun the two deploy commands through spawned workers.
