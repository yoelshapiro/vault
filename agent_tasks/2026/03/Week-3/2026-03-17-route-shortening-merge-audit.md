# 2026-03-17 — Route-shortening merge audit (`boris/train/pudo_route_augmentations` -> `parking/training/pudo_170326`)

## Scope
Compared behavior-critical files across branches:
- `wayve/ai/si/datamodules/otf.py`
- `wayve/ai/zoo/data/parking.py`
- `wayve/ai/lib/data/pipes/routes.py`
- `wayve/ai/zoo/deployment/deployment_wrapper.py`

## Findings
- `parking.py`: route-shortening plumbing is preserved (entry-index storage, stop route index/fraction extraction, fallback to first lookahead when entry transition missing, blackout helper).
- `otf.py`: route-shortening wiring is preserved (`store_entry_index`, `insert_parking_stop_route_position`, `route_map_options["enable_route_shortening_for_parking"]`, blackout only when shortening disabled).
- `routes.py` (`ai/lib/data/pipes/routes.py`): shortening function is identical between branches.
- `deployment_wrapper.py`: merge regression in blackout logic.
  - Current branch blacks out `MAP_ROUTE` unconditionally whenever `enable_end_of_route_blackout=True`, not conditioned on `parking_mode` / end-of-route mask.
  - Blackout is applied in the per-control-key loop and depends on `map_route` local var assigned only in one branch, making it fragile with non-default control key ordering.
  - Previous branch had correct conditional mask + change logging semantics.

## Impact
- Training-time route shortening path appears merged correctly.
- Inference-side blackout behavior in `deployment_wrapper.py` does not match validated branch behavior and can over-blackout map input.
