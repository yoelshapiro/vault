# 2026-06-29 PUDO Harsh Brake Pre-CA

## Summary

Added a separate `pre_ca_unpudo_harsh_brake_*` bucket to Parking/PUDO generic materialization.

## Changes

- Added a raw DBW brake report join for `raw__gen2.CAN_BUS_GEN2_DATASPEED_MACHE_V1_DBW__BrakeReport1Mache.override_active`.
- Aggregated override-active timestamps per run to avoid duplicating corpus frames during side-table joins.
- Added `select_intervention_near_departure_brake_override_event`, which selects UnPUDO pre-CA interventions near departure anchors when brake override is active within `[-1s, +1s]` of the intervention.
- Wired the new bucket into normal default materialization and anchors via existing country splitting.
- Kept `dc_pre_start_unpudo` at 2s before movement anchor.

## Validation

- `python3 -m py_compile` passed for the changed materialization modules.
- `git diff --check` passed.
- Scoped Bazel test attempt failed before running tests due the known local `WayveMeta --commit` metadata genrule issue.

## Flyte

- Branch: `boris/pudo_generic_materialization`
- Commit: `96c953d7650c`
- Execution: `ad2q8cwvq5t4dj59gt6g`
- Console: https://flyte.data.wayve.ai/console/projects/ai-services-sampling/domains/production/executions/ad2q8cwvq5t4dj59gt6g
- Dataset: `parking_pudo/default`
- Job name: `parking_pudo_default_harsh_brake_20260629`
- Partition size: `MAX_NUM_RUN_IDS_PER_PARTITION=700`

## 2026-06-30 Follow-up

- Found that the first run did not write `pre_ca_unpudo_harsh_brake_*` bucket files.
- Root cause: brake override preprocessing grouped only by `run_id`, while the side-table join was declared on `vehicle_platform`, `run_date_iso`, and `run_id`.
- Fixed `_preprocess_brake_override` and `_empty_brake_override_table` to preserve all declared join keys.
- Commit: `4b1e43c7e52a`
- Published image: `wayveacrprodflyte.azurecr.io/sampling@sha256:7556d2ebc080727b3476075ff8a62e45fe64b58e801b785937fe2ca51d06ce3b`
- Corrected execution: `avgcnlghmgkr2j4rjb4j`
- Console: https://flyte.data.wayve.ai/console/projects/ai-services-sampling/domains/production/executions/avgcnlghmgkr2j4rjb4j
- Stale-image execution `ad9hplxxfr7vw6cd82sf` was terminated after it resolved to the old image digest.

## 2026-06-30 OOM Follow-up

- Corrected execution `avgcnlghmgkr2j4rjb4j` picked up the brake override side table but failed in the Ray filter-and-bucket stage.
- Failure mode: the brake side table aggregated every raw override-active timestamp into a per-run list, then joined that large list onto every corpus frame in the run. One Ray task reached roughly `363GB` resident memory and was killed.
- Fixed `_preprocess_brake_override` to compress high-frequency brake override samples into active intervals split by gaps larger than `250ms`.
- Updated the UnPUDO harsh-brake pre-CA selector to test whether any active interval intersects the intervention `[-1s, +1s]` window.
- Commit: `5468b17c3d86`
- Published image: `wayveacrprodflyte.azurecr.io/sampling@sha256:7cb431a89b801ce70c06556949151dfefaaa875757f0dcdcbd27f41595b1227b`
- Rerun execution: `axrc88mcxtj47gj4wgwg`
- Console: https://flyte.data.wayve.ai/console/projects/ai-services-sampling/domains/production/executions/axrc88mcxtj47gj4wgwg
