# Model Analysis: mallard-plum-mysterious

| Field | Value |
|---|---|
| Model | `mallard-plum-mysterious` |
| Authors | `guy.geva` |
| Runs covered | `2` |
| Event count | `12` |
| Scored event count | `12` |
| Pass count | `3` |
| Fail count | `9` |
| Accidental count | `0` |
| Route-change found | `6` |
| Route-change not found | `0` |
| Route-change unclear | `6` |
| Top effective failure types | `completed_outside_av` x5, `not_av_owned` x4 |

## Analysis Summary

### Comparison Snapshot

| Metric | Value |
|---|---|
| Runs covered | `2` |
| Scored events | `12` |
| Excluded `accidental` events | `0` |
| Overall success rate | `25.0% (3/12)` |
| `unpudo` success rate | `25.0% (3/12)` |
| `unparking` success rate | `n/a` |
| Ownership / handover failures | `100.0% (9/9)` |
| Short AV-attempt failures | `22.2% (2/9)` |
| Successful events with no driver accel help | `100.0% (3/3)` |
| Successful events with route change found | `100.0% (3/3)` |
| Successful gear alignment at anchor | `100.0% (3/3)` |

### Failure Profile

- The scored subset contains `9` failures out of `12` scored events. The dominant effective failure types are `completed_outside_av` 55.6% (5/9), `not_av_owned` 44.4% (4/9).
- Ownership loss and handover breakage are the main theme: `9` of `9` failures fall into `not_av_owned`, `completed_outside_av`, `driver_completed_maneuver`, or `interrupted_handover`.
- Route-change evidence inside failed events is `found` in `3`, `not found` in `0`, and `unclear` in `6` cases.
- Source disengagement labels inside failed events are `none`; anything else is failing from DBW / ownership / gear evidence rather than an explicit source disengagement label.
- Event-type split: Only `unpudo` events are currently covered, with a success rate of 25.0% (3/12).

### Success Behavior

- Successful events are distributed as `3` `unpudo` and `0` `unparking`.
- On successful attempts, route change is recovered in `3` of `3` cases and driver accelerator help is absent in `3` of `3` cases.
- Gear state stays aligned at the anchor in `3` of `3` comparable passes. Planned-indicator alignment is `33.3% (1/3)`, and controller-indicator alignment is `33.3% (1/3)`.
- Typical successful timing is median `success baseline -> event start` `10.87s`, median `success baseline -> first motion` `7.55s`, and median AV-owned duration `82.44s`.
- Typical successful maneuver shape: common actual gear at the anchor is `DRIVE_POSITION_V2_DRIVE`, common actual indicator is `INDICATORS_STATE_V2_OFF`, and median max AV speed is `5.15 m/s`.

### Written Assessment

This card covers `12` recorded events across `2` runs, but only `12` of them are scored AV-owned attempts. The remaining `0` `accidental` events are explicitly excluded from the success-rate denominator. Within the scored subset, the overall success rate is `25.0% (3/12)`. Only `unpudo` events are currently covered, with a success rate of 25.0% (3/12).

Across the scored failures, route-change evidence is `3` found / `0` not found / `6` unclear, so navigation context is often ambiguous. The failure mix is led by `completed_outside_av` 55.6% (5/9), `not_av_owned` 44.4% (4/9), while the excluded portion is limited to sub-`2s` accidental AV contact rather than true scored failures.

When this model succeeds, the behavior is consistent: route change is recovered in `3` of `3` successful events, driver accelerator help is absent in `3` of `3`, and gear alignment holds in `3` of `3` comparable passes. The typical successful event starts moving about `7.55s` after the earlier of route change and AV start, reaches a median max AV speed of `5.15 m/s`, and most often begins in gear `DRIVE_POSITION_V2_DRIVE` with indicator state `INDICATORS_STATE_V2_OFF`.

### Coverage Note

- This card currently reflects only `12` analyzed events across `2` runs, so the rates above are directional and may shift materially as more packets are refreshed.

## Event Cards

| Event time (UTC) | Event type | Outcome | Route change | Disengagement | Console | Foxglove | Event card |
|---|---|---|---|---|---|---|---|
| `2026-04-22 15:16:09.783 UTC` | `unpudo` | `fail` | `found` | `none observed` | [console](https://console.sso.wayve.ai/run/fme10010/2026-04-22--13-54-22--gen2-av-776e6413-6cfd-4985-8a89-a423678c808d?id=&time-unixus=1776870969783316) | [foxglove](https://app.foxglove.dev/wayve-on-prem/p/prj_0dX18KZdVHg1fmmI/view?ds=foxglove-stream&ds.deviceName=fme10010&ds.start=2026-04-22T15%3A14%3A57.918254Z&ds.end=2026-04-22T15%3A16%3A24.033302Z&layoutId=lay_0e7VD4WIKDQGU73Y&time=2026-04-22T15%3A16%3A09.783316Z) | [card](../report_cards/2026/04/Week-4/fme10010--2026-04-22--13-54-22--gen2-av-776e6413-6cfd-4985-8a89-a423678c808d.md#unpudo-2026-04-22-151609783-utc) |
| `2026-04-22 15:21:05.683 UTC` | `unpudo` | `fail` | `unclear` | `none observed` | [console](https://console.sso.wayve.ai/run/fme10010/2026-04-22--13-54-22--gen2-av-776e6413-6cfd-4985-8a89-a423678c808d?id=&time-unixus=1776871265683296) | [foxglove](https://app.foxglove.dev/wayve-on-prem/p/prj_0dX18KZdVHg1fmmI/view?ds=foxglove-stream&ds.deviceName=fme10010&ds.start=2026-04-22T15%3A18%3A55.690500Z&ds.end=2026-04-22T15%3A21%3A19.933312Z&layoutId=lay_0e7VD4WIKDQGU73Y&time=2026-04-22T15%3A21%3A05.683296Z) | [card](../report_cards/2026/04/Week-4/fme10010--2026-04-22--13-54-22--gen2-av-776e6413-6cfd-4985-8a89-a423678c808d.md#unpudo-2026-04-22-152105683-utc) |
| `2026-04-22 15:24:12.583 UTC` | `unpudo` | `fail` | `unclear` | `none observed` | [console](https://console.sso.wayve.ai/run/fme10010/2026-04-22--13-54-22--gen2-av-776e6413-6cfd-4985-8a89-a423678c808d?id=&time-unixus=1776871452583305) | [foxglove](https://app.foxglove.dev/wayve-on-prem/p/prj_0dX18KZdVHg1fmmI/view?ds=foxglove-stream&ds.deviceName=fme10010&ds.start=2026-04-22T15%3A22%3A03.930556Z&ds.end=2026-04-22T15%3A24%3A26.283322Z&layoutId=lay_0e7VD4WIKDQGU73Y&time=2026-04-22T15%3A24%3A12.583305Z) | [card](../report_cards/2026/04/Week-4/fme10010--2026-04-22--13-54-22--gen2-av-776e6413-6cfd-4985-8a89-a423678c808d.md#unpudo-2026-04-22-152412583-utc) |
| `2026-04-22 15:24:27.083 UTC` | `unpudo` | `fail` | `unclear` | `none observed` | [console](https://console.sso.wayve.ai/run/fme10010/2026-04-22--13-54-22--gen2-av-776e6413-6cfd-4985-8a89-a423678c808d?id=&time-unixus=1776871467083314) | [foxglove](https://app.foxglove.dev/wayve-on-prem/p/prj_0dX18KZdVHg1fmmI/view?ds=foxglove-stream&ds.deviceName=fme10010&ds.start=2026-04-22T15%3A22%3A17.091587Z&ds.end=2026-04-22T15%3A24%3A37.083314Z&layoutId=lay_0e7VD4WIKDQGU73Y&time=2026-04-22T15%3A24%3A27.083314Z) | [card](../report_cards/2026/04/Week-4/fme10010--2026-04-22--13-54-22--gen2-av-776e6413-6cfd-4985-8a89-a423678c808d.md#unpudo-2026-04-22-152427083-utc) |
| `2026-04-22 15:34:50.933 UTC` | `unpudo` | `pass` | `found` | `none observed` | [console](https://console.sso.wayve.ai/run/fme10010/2026-04-22--13-54-22--gen2-av-776e6413-6cfd-4985-8a89-a423678c808d?id=&time-unixus=1776872090933306) | [foxglove](https://app.foxglove.dev/wayve-on-prem/p/prj_0dX18KZdVHg1fmmI/view?ds=foxglove-stream&ds.deviceName=fme10010&ds.start=2026-04-22T15%3A34%3A33.233299Z&ds.end=2026-04-22T15%3A35%3A15.649378Z&layoutId=lay_0e7VD4WIKDQGU73Y&time=2026-04-22T15%3A34%3A50.933306Z) | [card](../report_cards/2026/04/Week-4/fme10010--2026-04-22--13-54-22--gen2-av-776e6413-6cfd-4985-8a89-a423678c808d.md#unpudo-2026-04-22-153450933-utc) |
| `2026-04-22 15:35:32.183 UTC` | `unpudo` | `fail` | `found` | `none observed` | [console](https://console.sso.wayve.ai/run/fme10010/2026-04-22--13-54-22--gen2-av-776e6413-6cfd-4985-8a89-a423678c808d?id=&time-unixus=1776872132183291) | [foxglove](https://app.foxglove.dev/wayve-on-prem/p/prj_0dX18KZdVHg1fmmI/view?ds=foxglove-stream&ds.deviceName=fme10010&ds.start=2026-04-22T15%3A34%3A33.418255Z&ds.end=2026-04-22T15%3A36%3A29.333291Z&layoutId=lay_0e7VD4WIKDQGU73Y&time=2026-04-22T15%3A35%3A32.183291Z) | [card](../report_cards/2026/04/Week-4/fme10010--2026-04-22--13-54-22--gen2-av-776e6413-6cfd-4985-8a89-a423678c808d.md#unpudo-2026-04-22-153532183-utc) |
| `2026-04-22 15:39:14.733 UTC` | `unpudo` | `fail` | `found` | `none observed` | [console](https://console.sso.wayve.ai/run/fme10010/2026-04-22--13-54-22--gen2-av-776e6413-6cfd-4985-8a89-a423678c808d?id=&time-unixus=1776872354733317) | [foxglove](https://app.foxglove.dev/wayve-on-prem/p/prj_0dX18KZdVHg1fmmI/view?ds=foxglove-stream&ds.deviceName=fme10010&ds.start=2026-04-22T15%3A38%3A54.568258Z&ds.end=2026-04-22T15%3A39%3A30.433299Z&layoutId=lay_0e7VD4WIKDQGU73Y&time=2026-04-22T15%3A39%3A14.733317Z) | [card](../report_cards/2026/04/Week-4/fme10010--2026-04-22--13-54-22--gen2-av-776e6413-6cfd-4985-8a89-a423678c808d.md#unpudo-2026-04-22-153914733-utc) |
| `2026-04-22 15:41:44.733 UTC` | `unpudo` | `pass` | `found` | `none observed` | [console](https://console.sso.wayve.ai/run/fme10010/2026-04-22--13-54-22--gen2-av-776e6413-6cfd-4985-8a89-a423678c808d?id=&time-unixus=1776872504733298) | [foxglove](https://app.foxglove.dev/wayve-on-prem/p/prj_0dX18KZdVHg1fmmI/view?ds=foxglove-stream&ds.deviceName=fme10010&ds.start=2026-04-22T15%3A41%3A23.868228Z&ds.end=2026-04-22T15%3A43%3A06.309372Z&layoutId=lay_0e7VD4WIKDQGU73Y&time=2026-04-22T15%3A41%3A44.733298Z) | [card](../report_cards/2026/04/Week-4/fme10010--2026-04-22--13-54-22--gen2-av-776e6413-6cfd-4985-8a89-a423678c808d.md#unpudo-2026-04-22-154144733-utc) |
| `2026-04-22 15:43:34.233 UTC` | `unpudo` | `fail` | `unclear` | `none observed` | [console](https://console.sso.wayve.ai/run/fme10010/2026-04-22--13-54-22--gen2-av-776e6413-6cfd-4985-8a89-a423678c808d?id=&time-unixus=1776872614233299) | [foxglove](https://app.foxglove.dev/wayve-on-prem/p/prj_0dX18KZdVHg1fmmI/view?ds=foxglove-stream&ds.deviceName=fme10010&ds.start=2026-04-22T15%3A41%3A24.240178Z&ds.end=2026-04-22T15%3A44%3A00.333295Z&layoutId=lay_0e7VD4WIKDQGU73Y&time=2026-04-22T15%3A43%3A34.233299Z) | [card](../report_cards/2026/04/Week-4/fme10010--2026-04-22--13-54-22--gen2-av-776e6413-6cfd-4985-8a89-a423678c808d.md#unpudo-2026-04-22-154334233-utc) |
| `2026-04-22 20:38:15.333 UTC` | `unpudo` | `fail` | `unclear` | `none observed` | [console](https://console.sso.wayve.ai/run/fme10003/2026-04-22--20-12-43--gen2-av-3e0a8cb2-409e-4489-9145-f4a94365bc6c?id=&time-unixus=1776890295333302) | [foxglove](https://app.foxglove.dev/wayve-on-prem/p/prj_0dX18KZdVHg1fmmI/view?ds=foxglove-stream&ds.deviceName=fme10003&ds.start=2026-04-22T20%3A37%3A55.905486Z&ds.end=2026-04-22T20%3A38%3A30.883299Z&layoutId=lay_0e7VD4WIKDQGU73Y&time=2026-04-22T20%3A38%3A15.333302Z) | [card](../report_cards/2026/04/Week-4/fme10003--2026-04-22--20-12-43--gen2-av-3e0a8cb2-409e-4489-9145-f4a94365bc6c.md#unpudo-2026-04-22-203815333-utc) |
| `2026-04-22 20:42:12.083 UTC` | `unpudo` | `pass` | `found` | `none observed` | [console](https://console.sso.wayve.ai/run/fme10003/2026-04-22--20-12-43--gen2-av-3e0a8cb2-409e-4489-9145-f4a94365bc6c?id=&time-unixus=1776890532083311) | [foxglove](https://app.foxglove.dev/wayve-on-prem/p/prj_0dX18KZdVHg1fmmI/view?ds=foxglove-stream&ds.deviceName=fme10003&ds.start=2026-04-22T20%3A40%3A15.218274Z&ds.end=2026-04-22T20%3A45%3A40.626846Z&layoutId=lay_0e7VD4WIKDQGU73Y&time=2026-04-22T20%3A42%3A12.083311Z) | [card](../report_cards/2026/04/Week-4/fme10003--2026-04-22--20-12-43--gen2-av-3e0a8cb2-409e-4489-9145-f4a94365bc6c.md#unpudo-2026-04-22-204212083-utc) |
| `2026-04-22 20:46:16.383 UTC` | `unpudo` | `fail` | `unclear` | `none observed` | [console](https://console.sso.wayve.ai/run/fme10003/2026-04-22--20-12-43--gen2-av-3e0a8cb2-409e-4489-9145-f4a94365bc6c?id=&time-unixus=1776890776383304) | [foxglove](https://app.foxglove.dev/wayve-on-prem/p/prj_0dX18KZdVHg1fmmI/view?ds=foxglove-stream&ds.deviceName=fme10003&ds.start=2026-04-22T20%3A45%3A49.183292Z&ds.end=2026-04-22T20%3A46%3A56.183316Z&layoutId=lay_0e7VD4WIKDQGU73Y&time=2026-04-22T20%3A46%3A16.383304Z) | [card](../report_cards/2026/04/Week-4/fme10003--2026-04-22--20-12-43--gen2-av-3e0a8cb2-409e-4489-9145-f4a94365bc6c.md#unpudo-2026-04-22-204616383-utc) |
