# 2026-07-02 Stateless EOR Hysteresis Redeploys

## Summary

Redeployed the Parking/PUDO interleave-control models with stateless end-of-route hysteresis:

- Driving to parking uses `END_OF_ROUTE_THRESHOLD = 2.5e4`.
- Parking back to driving uses `END_OF_ROUTE_EXIT_THRESHOLD = 3e4` and the existing speed gate.
- No persistent interleave-control state buffer is used for the hysteresis decision.
- `enable_end_of_route_hazard_lights` defaults to `True`.
- `enable_end_of_route_gear_latch` defaults to `True`.

## Branches

- `boris/parking-stateless-eor-hysteresis-redeploy`
  - Commit: `0ffd8b8d565250f42b54f67fa8bcd85bdec58d32`
  - Used for fuchsia/mallard, teal/beige, frog, and harlequin redeploys.
- `boris/parking-stateless-eor-hysteresis-magenta-redeploy`
  - Commit: `548c18d3af07df2b94f9c8b17c71da3f2ec3888f`
  - Used for magenta because the newer branch failed to load its older training config due `lr_anneal_strategy`.

## Redeploy Ledger

| Source model | New nickname | New session |
| --- | --- | --- |
| `fuchsia-vampire-bat-jubilant` / previous `mallard-erudite-turquoise` | `sandpiper-spotless-beige` | `session_2026_06_27_21_58_32_nostaug0__fuchsia-vampire-bat-jubilant_interleave_control_stateless_eor_latches_v1` |
| `teal-ecstatic-magpie` / previous `beige-massive-ram` | `wren-agile-amber` | `session_2026_06_27_21_39_49_noaug75c05__teal-ecstatic-magpie_interleave_control_stateless_eor_latches_v1` |
| `frog-bronze-tessellated` | `amber-porpoise-precise` | `session_2026_06_30_10_46_01_harqolr81wb2__frog-bronze-tessellated_interleave_control_stateless_eor_latches_v1` |
| `harlequin-parrot-energetic` | `thoughtful-silver-nautilus` | `session_2026_06_28_21_38_07_marwfm50p2__harlequin-parrot-energetic_interleave_control_stateless_eor_latches_v1` |
| `magenta-watchful-ostrich` | `azure-gnu-outspoken` | `session_2026_06_29_05_23_16_mzwarm50p1__magenta-watchful-ostrich_interleave_control_stateless_eor_latches_v1` |

## Validation

- All five deployments completed TorchScript/export/upload successfully.
- All five generated inference configs use `INTERLEAVE_GROUP_PARKING`.
- All five uploaded models had effectively empty `git.diff` files, so the deployed source state was committed.
- Model CI was enabled by deployment config for the Gen2 alpha3 vehicle target.
- A focused Bazel regression test was added for the stateless hysteresis decision, but the local Bazel run did not complete because WayveMeta/service-info resolution was slow. The deploy path still validated scriptability and export.

