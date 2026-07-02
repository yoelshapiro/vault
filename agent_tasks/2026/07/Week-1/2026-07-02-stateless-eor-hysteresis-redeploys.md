# 2026-07-02 Stateless EOR Hysteresis Redeploys

## Summary

Redeployed the Parking/PUDO interleave-control models with stateless end-of-route hysteresis:

- Driving to parking uses `END_OF_ROUTE_THRESHOLD = 3.75e4`.
- Parking back to driving uses `END_OF_ROUTE_EXIT_THRESHOLD = 4.5e4` and the existing speed gate.
- No persistent interleave-control state buffer is used for the hysteresis decision.
- `enable_end_of_route_hazard_lights` defaults to `True`.
- `enable_end_of_route_gear_latch` defaults to `True`.

The initial `v1` redeploy used incorrect thresholds (`2.5e4` / `3e4`) and was superseded by the `v2` redeploy below.

## Branches

- `boris/parking-stateless-eor-hysteresis-redeploy`
  - Commit: `2d4c8876d14cc6f4d6fe0ac0c734901ef24e1230`
  - Used for fuchsia/mallard, teal/beige, frog, and harlequin redeploys.
- `boris/parking-stateless-eor-hysteresis-magenta-redeploy`
  - Commit: `597d8f97f8f8b0150d3387b8fc844f5f2f5296c0`
  - Used for magenta because the newer branch failed to load its older training config due `lr_anneal_strategy`.

## Corrected V2 Redeploy Ledger

| Source model | New nickname | Gen2 artefact id | New session |
| --- | --- | --- | --- |
| `fuchsia-vampire-bat-jubilant` / previous `mallard-erudite-turquoise` | `scarlet-dreaming-hamster` | `1485507c-d1d2-481f-a298-7f1e9301a56a` | `session_2026_06_27_21_58_32_nostaug0__fuchsia-vampire-bat-jubilant_interleave_control_stateless_eor_latches_v2` |
| `teal-ecstatic-magpie` / previous `beige-massive-ram` | `earnest-brown-catfish` | `0791b71b-d74a-4983-9b19-4744525c3aa4` | `session_2026_06_27_21_39_49_noaug75c05__teal-ecstatic-magpie_interleave_control_stateless_eor_latches_v2` |
| `frog-bronze-tessellated` | `snowy-owl-lavender-spotless` | `9afcd9c5-c5e9-4d6e-996a-d2ec35215cb8` | `session_2026_06_30_10_46_01_harqolr81wb2__frog-bronze-tessellated_interleave_control_stateless_eor_latches_v2` |
| `harlequin-parrot-energetic` | `seahorse-orange-rigorous` | `02c02c09-7048-4508-9c42-491d8c1f7bba` | `session_2026_06_28_21_38_07_marwfm50p2__harlequin-parrot-energetic_interleave_control_stateless_eor_latches_v2` |
| `magenta-watchful-ostrich` | `peach-cautious-kangaroo` | `37f4badd-6ec8-42c8-99f3-6bb7191afd21` | `session_2026_06_29_05_23_16_mzwarm50p1__magenta-watchful-ostrich_interleave_control_stateless_eor_latches_v2` |

## Superseded V1 Redeploy Ledger

| Source model | New nickname | New session |
| --- | --- | --- |
| `fuchsia-vampire-bat-jubilant` / previous `mallard-erudite-turquoise` | `sandpiper-spotless-beige` | `session_2026_06_27_21_58_32_nostaug0__fuchsia-vampire-bat-jubilant_interleave_control_stateless_eor_latches_v1` |
| `teal-ecstatic-magpie` / previous `beige-massive-ram` | `wren-agile-amber` | `session_2026_06_27_21_39_49_noaug75c05__teal-ecstatic-magpie_interleave_control_stateless_eor_latches_v1` |
| `frog-bronze-tessellated` | `amber-porpoise-precise` | `session_2026_06_30_10_46_01_harqolr81wb2__frog-bronze-tessellated_interleave_control_stateless_eor_latches_v1` |
| `harlequin-parrot-energetic` | `thoughtful-silver-nautilus` | `session_2026_06_28_21_38_07_marwfm50p2__harlequin-parrot-energetic_interleave_control_stateless_eor_latches_v1` |
| `magenta-watchful-ostrich` | `azure-gnu-outspoken` | `session_2026_06_29_05_23_16_mzwarm50p1__magenta-watchful-ostrich_interleave_control_stateless_eor_latches_v1` |

## Validation

- All five `v2` deployments completed TorchScript/export/upload successfully.
- All five generated inference configs use `INTERLEAVE_GROUP_PARKING`.
- All five generated inference configs use radar features and `points_per_scan = 800`.
- All five uploaded models had effectively empty `git.diff` files, so the deployed source state was committed.
- Model CI was enabled by deployment config for the Gen2 alpha3 vehicle target.
- Focused Bazel pytest target passed:
  - `bazel test //wayve/ai/zoo/deployment:test_deployment_py_test --test_arg='-k=test_interleave_control_uses_stateless_end_of_route_thresholds'`
- Running the full `py_checks` target with `--test_arg=-k...` failed because lint/typecheck wrapper targets do not accept pytest `-k`; the pytest target itself passed.
- Each deploy printed the known non-blocking ONNX artefact pydantic warning because ONNX export was disabled, then still reported successful Console upload.
