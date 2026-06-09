# 2026-06-09 Parking/PUDO Anchors Current Rerun

## Summary

Submitted a fresh full `parking_pudo/anchors` materialization sample run from the current `boris/pudo_generic_materialization` branch state.

## Run provenance

- Branch: `boris/pudo_generic_materialization`
- Commit: `d8d061a38992b97e6d63e3acfb38a93db0335fe5`
- Branch version: `2026-06-09-1`
- Job name: `parking_pudo_anchors_current_20260609`
- Flyte execution: `alfttk58xgtc5gdgwg7f`
- Console: https://flyte.data.wayve.ai/console/projects/ai-services-sampling/domains/production/executions/alfttk58xgtc5gdgwg7f
- Expected output root: `sampling_materialised/parking_pudo/anchors/boris-pudo-generic-materialization/2026-06-09-1`

## Notes

- Fast-forwarded local branch from `56d178c995c122208607b77290bd8ad88dc302d2` to `d8d061a38992b97e6d63e3acfb38a93db0335fe5` before submitting.
- Initial submission failed because ACR auth had expired for `wayveacrprodflyte.azurecr.io/sampling`; refreshed ACR logins.
- Second submission failed because sampling image `0.1.125` did not have the branch temporary tag in ACR yet.
- Published temporary sampling image tag `borisindel-tmp-build-0.1.125-boris-pudo_generic_materialization-59584`.
- Published image digest: `sha256:a190f1f5311d5b43b8725b077742dfa47b69d3bf5f572fbc1b2cd037a7fdaecb`.
