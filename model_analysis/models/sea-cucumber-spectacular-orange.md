# Model Analysis: sea-cucumber-spectacular-orange

| Field | Value |
|---|---|
| Model | `sea-cucumber-spectacular-orange` |
| Authors | `guy.geva` |
| Runs covered | `1` |
| Event count | `5` |
| Scored event count | `5` |
| Pass count | `2` |
| Fail count | `3` |
| Accidental count | `0` |
| Route-change found | `4` |
| Route-change not found | `0` |
| Route-change unclear | `1` |
| Top effective failure types | `not_av_owned` x2, `completed_outside_av` x1 |

## Analysis Summary

### Comparison Snapshot

| Metric | Value |
|---|---|
| Runs covered | `1` |
| Scored events | `5` |
| Excluded `accidental` events | `0` |
| Overall success rate | `40.0% (2/5)` |
| `unpudo` success rate | `40.0% (2/5)` |
| `unparking` success rate | `n/a` |
| Ownership / handover failures | `100.0% (3/3)` |
| Short AV-attempt failures | `33.3% (1/3)` |
| Successful events with no driver accel help | `100.0% (2/2)` |
| Successful events with route change found | `100.0% (2/2)` |
| Successful gear alignment at anchor | `100.0% (2/2)` |

### Failure Profile

- The scored subset contains `3` failures out of `5` scored events. The dominant effective failure types are `not_av_owned` 66.7% (2/3), `completed_outside_av` 33.3% (1/3).
- Ownership loss and handover breakage are the main theme: `3` of `3` failures fall into `not_av_owned`, `completed_outside_av`, `driver_completed_maneuver`, or `interrupted_handover`.
- Route-change evidence inside failed events is `found` in `2`, `not found` in `0`, and `unclear` in `1` cases.
- Source disengagement labels inside failed events are `none`; anything else is failing from DBW / ownership / gear evidence rather than an explicit source disengagement label.
- Event-type split: Only `unpudo` events are currently covered, with a success rate of 40.0% (2/5).

### Success Behavior

- Successful events are distributed as `2` `unpudo` and `0` `unparking`.
- On successful attempts, route change is recovered in `2` of `2` cases and driver accelerator help is absent in `2` of `2` cases.
- Gear state stays aligned at the anchor in `2` of `2` comparable passes. Planned-indicator alignment is `50.0% (1/2)`, and controller-indicator alignment is `50.0% (1/2)`.
- Typical successful timing is median `success baseline -> event start` `4.09s`, median `success baseline -> first motion` `4.15s`, and median AV-owned duration `202.44s`.
- Typical successful maneuver shape: common actual gear at the anchor is `DRIVE_POSITION_V2_DRIVE`, common actual indicator is `INDICATORS_STATE_V2_OFF`, and median max AV speed is `4.12 m/s`.

### Written Assessment

This card covers `5` recorded events across `1` runs, but only `5` of them are scored AV-owned attempts. The remaining `0` `accidental` events are explicitly excluded from the success-rate denominator. Within the scored subset, the overall success rate is `40.0% (2/5)`. Only `unpudo` events are currently covered, with a success rate of 40.0% (2/5).

Across the scored failures, route-change evidence is `2` found / `0` not found / `1` unclear, so navigation context is usually present. The failure mix is led by `not_av_owned` 66.7% (2/3), `completed_outside_av` 33.3% (1/3), while the excluded portion is limited to sub-`2s` accidental AV contact rather than true scored failures.

When this model succeeds, the behavior is consistent: route change is recovered in `2` of `2` successful events, driver accelerator help is absent in `2` of `2`, and gear alignment holds in `2` of `2` comparable passes. The typical successful event starts moving about `4.15s` after the earlier of route change and AV start, reaches a median max AV speed of `4.12 m/s`, and most often begins in gear `DRIVE_POSITION_V2_DRIVE` with indicator state `INDICATORS_STATE_V2_OFF`.

### Coverage Note

- This card currently reflects only `5` analyzed events across `1` runs, so the rates above are directional and may shift materially as more packets are refreshed.

## Event Cards

| Event time (UTC) | Event type | Outcome | Route change | Disengagement | Console | Foxglove | Event card |
|---|---|---|---|---|---|---|---|
| `2026-04-22 16:28:49.783 UTC` | `unpudo` | `fail` | `found` | `none observed` | [console](https://console.sso.wayve.ai/run/fme10010/2026-04-22--16-09-57--gen2-av-97310301-a8d4-4bb7-87aa-6bf157ad09e8?id=&time-unixus=1776875329783318) | [foxglove](https://app.foxglove.dev/wayve-on-prem/p/prj_0dX18KZdVHg1fmmI/view?ds=foxglove-stream&ds.deviceName=fme10010&ds.start=2026-04-22T16%3A26%3A42.418245Z&ds.end=2026-04-22T16%3A29%3A06.033307Z&layoutId=lay_0e7VD4WIKDQGU73Y&time=2026-04-22T16%3A28%3A49.783318Z) | [card](../report_cards/2026/04/Week-4/fme10010--2026-04-22--16-09-57--gen2-av-97310301-a8d4-4bb7-87aa-6bf157ad09e8.md#unpudo-2026-04-22-162849783-utc) |
| `2026-04-22 16:32:54.833 UTC` | `unpudo` | `fail` | `found` | `none observed` | [console](https://console.sso.wayve.ai/run/fme10010/2026-04-22--16-09-57--gen2-av-97310301-a8d4-4bb7-87aa-6bf157ad09e8?id=&time-unixus=1776875574833310) | [foxglove](https://app.foxglove.dev/wayve-on-prem/p/prj_0dX18KZdVHg1fmmI/view?ds=foxglove-stream&ds.deviceName=fme10010&ds.start=2026-04-22T16%3A32%3A39.218238Z&ds.end=2026-04-22T16%3A33%3A25.533327Z&layoutId=lay_0e7VD4WIKDQGU73Y&time=2026-04-22T16%3A32%3A54.833310Z) | [card](../report_cards/2026/04/Week-4/fme10010--2026-04-22--16-09-57--gen2-av-97310301-a8d4-4bb7-87aa-6bf157ad09e8.md#unpudo-2026-04-22-163254833-utc) |
| `2026-04-22 16:39:23.283 UTC` | `unpudo` | `pass` | `found` | `none observed` | [console](https://console.sso.wayve.ai/run/fme10010/2026-04-22--16-09-57--gen2-av-97310301-a8d4-4bb7-87aa-6bf157ad09e8?id=&time-unixus=1776875963283290) | [foxglove](https://app.foxglove.dev/wayve-on-prem/p/prj_0dX18KZdVHg1fmmI/view?ds=foxglove-stream&ds.deviceName=fme10010&ds.start=2026-04-22T16%3A39%3A09.018269Z&ds.end=2026-04-22T16%3A41%3A32.673117Z&layoutId=lay_0e7VD4WIKDQGU73Y&time=2026-04-22T16%3A39%3A23.283290Z) | [card](../report_cards/2026/04/Week-4/fme10010--2026-04-22--16-09-57--gen2-av-97310301-a8d4-4bb7-87aa-6bf157ad09e8.md#unpudo-2026-04-22-163923283-utc) |
| `2026-04-22 16:46:21.533 UTC` | `unpudo` | `pass` | `found` | `none observed` | [console](https://console.sso.wayve.ai/run/fme10010/2026-04-22--16-09-57--gen2-av-97310301-a8d4-4bb7-87aa-6bf157ad09e8?id=&time-unixus=1776876381533306) | [foxglove](https://app.foxglove.dev/wayve-on-prem/p/prj_0dX18KZdVHg1fmmI/view?ds=foxglove-stream&ds.deviceName=fme10010&ds.start=2026-04-22T16%3A46%3A07.618280Z&ds.end=2026-04-22T16%3A51%3A08.852988Z&layoutId=lay_0e7VD4WIKDQGU73Y&time=2026-04-22T16%3A46%3A21.533306Z) | [card](../report_cards/2026/04/Week-4/fme10010--2026-04-22--16-09-57--gen2-av-97310301-a8d4-4bb7-87aa-6bf157ad09e8.md#unpudo-2026-04-22-164621533-utc) |
| `2026-04-22 17:01:12.283 UTC` | `unpudo` | `fail` | `unclear` | `none observed` | [console](https://console.sso.wayve.ai/run/fme10010/2026-04-22--16-09-57--gen2-av-97310301-a8d4-4bb7-87aa-6bf157ad09e8?id=&time-unixus=1776877272283300) | [foxglove](https://app.foxglove.dev/wayve-on-prem/p/prj_0dX18KZdVHg1fmmI/view?ds=foxglove-stream&ds.deviceName=fme10010&ds.start=2026-04-22T16%3A59%3A02.292356Z&ds.end=2026-04-22T17%3A01%3A28.533312Z&layoutId=lay_0e7VD4WIKDQGU73Y&time=2026-04-22T17%3A01%3A12.283300Z) | [card](../report_cards/2026/04/Week-4/fme10010--2026-04-22--16-09-57--gen2-av-97310301-a8d4-4bb7-87aa-6bf157ad09e8.md#unpudo-2026-04-22-170112283-utc) |
