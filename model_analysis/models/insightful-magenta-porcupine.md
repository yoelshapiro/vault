# Model Analysis: insightful-magenta-porcupine

| Field | Value |
|---|---|
| Model | `insightful-magenta-porcupine` |
| Authors | `boris.indelman` |
| Runs covered | `1` |
| Event count | `2` |
| Scored event count | `1` |
| Pass count | `0` |
| Fail count | `1` |
| Accidental count | `1` |
| Route-change found | `1` |
| Route-change not found | `0` |
| Route-change unclear | `1` |
| Top effective failure types | `not_av_owned` x1 |

## Analysis Summary

### Comparison Snapshot

| Metric | Value |
|---|---|
| Runs covered | `1` |
| Scored events | `1` |
| Excluded `accidental` events | `1` |
| Overall success rate | `0.0% (0/1)` |
| `unpudo` success rate | `0.0% (0/1)` |
| `unparking` success rate | `n/a` |
| Ownership / handover failures | `100.0% (1/1)` |
| Short AV-attempt failures | `100.0% (1/1)` |
| Successful events with no driver accel help | `n/a` |
| Successful events with route change found | `n/a` |
| Successful gear alignment at anchor | `n/a` |

### Failure Profile

- The scored subset contains `1` failures out of `1` scored events. The dominant effective failure types are `not_av_owned` 100.0% (1/1).
- Ownership loss and handover breakage are the main theme: `1` of `1` failures fall into `not_av_owned`, `completed_outside_av`, `driver_completed_maneuver`, or `interrupted_handover`.
- Route-change evidence inside failed events is `found` in `0`, `not found` in `0`, and `unclear` in `1` cases.
- Source disengagement labels inside failed events are `none`; anything else is failing from DBW / ownership / gear evidence rather than an explicit source disengagement label.
- Event-type split: Only `unpudo` events are currently covered, with a success rate of 0.0% (0/1).

### Success Behavior

- No successful events are currently analyzed for this model, so the comparison baseline is entirely failure-side.

### Written Assessment

This card covers `2` recorded events across `1` runs, with `1` labelled `accidental`, so only `1` events remain in the scored subset.

There are no successful scored events in the current sample. The scored failures are led by `not_av_owned` 100.0% (1/1), while the excluded events capture only sub-`2s` accidental AV participation.

### Coverage Note

- This card currently reflects only `2` analyzed events across `1` runs, so the rates above are directional and may shift materially as more packets are refreshed.

## Event Cards

| Event time (UTC) | Event type | Outcome | Route change | Disengagement | Console | Foxglove | Event card |
|---|---|---|---|---|---|---|---|
| `2026-04-22 14:41:17.883 UTC` | `unpudo` | `fail` | `unclear` | `none observed` | [console](https://console.sso.wayve.ai/run/fme10011/2026-04-22--13-38-11--gen2-av-c6787608-2377-49a2-8db2-eb353c1251f9?id=&time-unixus=1776868877883327) | [foxglove](https://app.foxglove.dev/wayve-on-prem/p/prj_0dX18KZdVHg1fmmI/view?ds=foxglove-stream&ds.deviceName=fme10011&ds.start=2026-04-22T14%3A41%3A07.483317Z&ds.end=2026-04-22T14%3A42%3A03.283319Z&layoutId=lay_0e7VD4WIKDQGU73Y&time=2026-04-22T14%3A41%3A17.883327Z) | [[../report_cards/2026/04/Week-4/fme10011--2026-04-22--13-38-11--gen2-av-c6787608-2377-49a2-8db2-eb353c1251f9.md#unpudo 2026-04-22 14:41:17.883 UTC\|card]] |
| `2026-04-22 14:47:39.233 UTC` | `unpudo` | `accidental` | `found` | `none observed` | [console](https://console.sso.wayve.ai/run/fme10011/2026-04-22--13-38-11--gen2-av-c6787608-2377-49a2-8db2-eb353c1251f9?id=&time-unixus=1776869259233317) | [foxglove](https://app.foxglove.dev/wayve-on-prem/p/prj_0dX18KZdVHg1fmmI/view?ds=foxglove-stream&ds.deviceName=fme10011&ds.start=2026-04-22T14%3A47%3A17.668233Z&ds.end=2026-04-22T14%3A48%3A44.899444Z&layoutId=lay_0e7VD4WIKDQGU73Y&time=2026-04-22T14%3A47%3A39.233317Z) | [[../report_cards/2026/04/Week-4/fme10011--2026-04-22--13-38-11--gen2-av-c6787608-2377-49a2-8db2-eb353c1251f9.md#unpudo 2026-04-22 14:47:39.233 UTC\|card]] |
