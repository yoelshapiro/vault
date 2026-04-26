# zmurez/pudo Data Research

Branch: `boris/training/kangaroo_with_50_and_route_shorten`
Reference branch: `origin/zmurez/pudo`
PR: `#91997` (`zmurez/pudo`)
Change type: research
Areas: parking data, PUDO/UNPUDO, samplers, route augmentation, gear/indicator conditioning

## Summary

Investigated Zak's `zmurez/pudo` branch to understand why his models show good PUDO/UNPUDO behavior. The branch is mostly under `wayve/ai/experimental`, not `wayve/ai/si/datamodules`.

Key findings:
- Uses legacy experimental `Wayve`/Ipace data loading with heuristic samplers rather than SI OTF bucket configs.
- Parking/PUDO labels are derived from cleaned gear, hazard indicators, classifier predictions, and geofences.
- PUDO is separated into near/far pin-valid samplers using predicted valid pin distances.
- Unparking is sampled around gear-out-of-park then first motion, with 10s after-window.
- Route augmentation includes random end jitter and route blackout when `parking_request` is active.
- Gear and indicator heads are supervised per waypoint with strong change-point weighting.

## Important Code References

- `origin/zmurez/pudo:wayve/ai/experimental/configs/mcv_new_phase2.yml`
- `origin/zmurez/pudo:wayve/ai/experimental/configs/mcv_new_base0.yml`
- `origin/zmurez/pudo:wayve/ai/experimental/dataset/single_run.py`
- `origin/zmurez/pudo:wayve/ai/experimental/dataset/ipace.py`
- `origin/zmurez/pudo:wayve/ai/experimental/samplers/sampler.py`
