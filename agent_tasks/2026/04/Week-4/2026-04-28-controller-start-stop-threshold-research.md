# Controller Start-Stop Threshold Research

Date: 2026-04-28
Branch: `boris/training/kangaroo_with_50_and_route_shorten`
PR: #98250

## Summary

PR #98250 was intended to help low-speed PUDO / UNPUDO "failed to start" behavior by lowering the MachE controller's future-speed stationary threshold from `0.25f` to `0.15f`.

The motivating Slack thread says Zak's robotaxi triage found repeated `failed to start - unpudo` interventions and that Tessa's low-speed parking controller would help. Tessa clarified that the helpful part was likely the lower stationary speed threshold, not primarily the pedal maps. Zak agreed, saying lower stationary thresholds were the main thing that helps, with pedal maps secondary.

## PR #98250

- Title: `[Controller] Change start-stop threshold to 0.15`
- State: merged on 2026-03-13
- Changed `wayve/robot/core/controller/src/controller_config.cpp`.
- Applied only to MachE variants in the old constructor:
  - `GEN2_AV_MACHE`
  - `GEN2_AV_MACHE_MULE`
  - `GEN2_AV_MACHE_ALPHA3_MULE`
  - `GEN2_AV_MACHE_ALPHA3`
  - `GEN2_AV_MACHE_ALPHA3_LIDAR`
- Diff:
  - `trajgen_config.future_speed_stationary_threshold_ms = 0.25f;`
  - became `trajgen_config.future_speed_stationary_threshold_ms = 0.15f;`

## Current Main State

Current `origin/main` has the controller config in `wayve/robot/core/controller/src/controller_config_factory_impl.cpp`.

For the MachE group, current `origin/main` still has:

```cpp
config.trajgen_config.current_speed_stationary_threshold_ms = 0.3f;
config.trajgen_config.future_speed_stationary_threshold_ms = 0.25f;
```

The `0.15f` value from PR #98250 appears to have been lost in the later controller-config refactor / migration. Commit `ff288a9ed708` removed the old `controller_config.cpp` constructor containing the `0.15f` MachE value and introduced `controller_config_factory_impl.cpp` with the MachE value back at `0.25f`.

## Controller Mechanism

`wayve/robot/core/controller/src/trajectory_generator.cpp` computes whether a planned trajectory should be treated as zero:

```cpp
float threshold_speed_ms = config_.trajgen_config.future_speed_stationary_threshold_ms * multiplier;
bool should_be_treated_as_zero = (future_speed_ms < threshold_speed_ms) &&
                                 (current_speed_ms < config_.trajgen_config.current_speed_stationary_threshold_ms);
```

Lowering the future-speed threshold means small-but-real planned motion is less likely to be collapsed into a stationary trajectory. That matches the UNPUDO failure mode: model predicts weak initial motion, but the controller may treat it as zero and hold still.

## Slack Evidence

Linked thread: `#robotaxi` / channel `C0A75MMDC1M`, message `1771234068.483419`.

Important points:

- Jon opened the thread because Zak's triage suggested fail-to-unpudo interventions could be caused by low-speed controller / dynamics behavior.
- Tessa said if the car does not move at all, the useful branch behavior is likely lower stationary speed thresholds, not pedal maps.
- Zak agreed the stationary thresholds are the main thing that helps.
- Zak said pedal maps are also useful but secondary, and noted the then-current low-speed pedal map had awkward acceleration/lurch behavior.
- Arvind tested `0.15` vs prod on baseline.
- Arvind later said no regressions were found and he would merge PR #98250.
- Mat caveated that the experiment was small and did not show significant differences between variants.

Upstream Zak triage thread: channel `C0A75MMDC1M`, parent `1770938582.409719`.

Zak's list included several failed-to-start cases:

- `failed to start - unpudo`
- `failed to start - clear road - close to pudo`
- `failed to start (reverse out)`
- repeated `failed to start (unpudo)`

## Implication

If we want the controller-side help described in the Slack thread, we likely need to re-apply the `0.15f` MachE future-speed stationary threshold in the current config factory, or confirm with controls that the later `0.25f` value is intentional.

