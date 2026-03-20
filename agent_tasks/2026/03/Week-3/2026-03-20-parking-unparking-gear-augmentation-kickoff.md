# 2026-03-20 — Parking/unparking gear augmentation kickoff

## Summary
- Created and activated project page [[projects/parking-unparking-gear-augmentation]].
- Used thread context plus commit `97769ac4b44b378645646934b9e0f901bfa13400` as baseline reference.
- Extracted the historical augmentation stack and flagged high-risk components.
- Defined an ablation plan to isolate benefits vs safety regressions.

## Baseline Behavior (Historical)
- Gear reconstruction from speed sign with validated neutral segments (`_reconstruct_gear_from_speed`).
- Expansion of neutral (P/N) segments across adjacent stopped frames (`_build_expanded_gear`).
- Parking/unparking context detection + parked/unparking augmentation.
- `augment_unparking_gear`: in unparking standstill, either keep P or switch segment to next non-neutral gear.
- `strip_leading_standstill`: when D/R with delayed acceleration, removes initial standstill and resamples policy pose/speed/gear.
- `augment_standstill_gear`: randomizes standstill input gear in parking context.

## Risks Identified
- `strip_leading_standstill` can delete legitimate wait-for-safety behavior.
- Random input/output gear rewrites can conflict with camera-observable cues (reverse lights, etc.).
- Mixed real-world causes for waiting (unsafe vs driver delay) remain entangled without explicit labels.

## Suggested Ablation Set
1. Control: no gear augmentation.
2. Gear cleanup only.
3. Cleanup + unparking gear augmentation.
4. Cleanup + standstill input randomization.
5. Cleanup + conditional standstill stripping (strict safety gates).
6. Full historical stack.

## Suggested Keep/Drop Rule
- Keep only components that improve reverse-start/unparking completion while holding safety proxies flat or better.
- Remove unconditional standstill stripping if any blocked-scene or intervention metric regresses.

## Working Context
- Branch: `boris/train/pudo_route_augmentations`
- Key file reference: `wayve/ai/zoo/data/parking.py` (historical baseline in `97769ac...`)
