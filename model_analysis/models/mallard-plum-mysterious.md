# Model Analysis: mallard-plum-mysterious

| Field | Value |
|---|---|
| Model | `mallard-plum-mysterious` |
| Authors | `guy.geva` |
| Runs covered | `2` |
| Event count | `15` |
| Scored event count | `4` |
| Pass count | `3` |
| Fail count | `1` |
| Non-AV count | `11` |
| Accidental count | `0` |
| Route-change found | `7` |
| Route-change not found | `0` |
| Route-change unclear | `8` |
| Top effective failure types | `not_av_owned` x1 |

## Analysis Summary

### Comparison Snapshot

| Metric | Value |
|---|---|
| Runs covered | `2` |
| Scored events | `4` |
| Excluded `non-AV` events | `11` |
| Excluded `accidental` events | `0` |
| Overall success rate | `75.0% (3/4)` |
| `unpudo` success rate | `75.0% (3/4)` |
| `unparking` success rate | `n/a` |
| Ownership / handover failures | `100.0% (1/1)` |
| Short AV-attempt failures | `0.0% (0/1)` |
| Successful events with no driver accel help | `100.0% (3/3)` |
| Successful events with route change found | `100.0% (3/3)` |
| Successful gear alignment at anchor | `100.0% (3/3)` |

### Failure Profile

- The scored subset contains `1` failures out of `4` scored events. The dominant effective failure types are `not_av_owned` 100.0% (1/1).
- Ownership loss and handover breakage are the main theme: `1` of `1` failures fall into `not_av_owned`, `completed_outside_av`, `driver_completed_maneuver`, or `interrupted_handover`.
- Route-change evidence inside failed events is `found` in `1`, `not found` in `0`, and `unclear` in `0` cases.
- Source disengagement labels inside failed events are `none`; anything else is failing from DBW / ownership / gear evidence rather than an explicit source disengagement label.
- Event-type split: Only `unpudo` events are currently covered, with a success rate of 75.0% (3/4).

### Excluded Events

- `11` events are labelled `non-AV`: there is no AV-owned portion anywhere inside the detected event timeline, so they are mentioned for coverage but excluded from model scoring.
- `0` events are labelled `accidental`: AV participates for less than `2s`, so they are treated as accidental contact rather than a meaningful model attempt.

### Success Behavior

- Successful events are distributed as `3` `unpudo` and `0` `unparking`.
- On successful attempts, route change is recovered in `3` of `3` cases and driver accelerator help is absent in `3` of `3` cases.
- Gear state stays aligned at the anchor in `3` of `3` comparable passes. Planned-indicator alignment is `33.3% (1/3)`, and controller-indicator alignment is `33.3% (1/3)`.
- Typical successful timing is median `AV -> event start` `161.84s`, median `AV -> first motion` `161.89s`, and median AV-owned duration `283.26s`.
- Typical successful maneuver shape: common actual gear at the anchor is `DRIVE_POSITION_V2_DRIVE`, common actual indicator is `INDICATORS_STATE_V2_OFF`, and median max AV speed is `4.09 m/s`.

### Written Assessment

This card covers `15` detected events across `2` runs, but only `4` of them are scored AV-owned attempts. The remaining `11` `non-AV` and `0` `accidental` events are explicitly excluded from the success-rate denominator. Within the scored subset, the overall success rate is `75.0% (3/4)`. Only `unpudo` events are currently covered, with a success rate of 75.0% (3/4).

Across the scored failures, route-change evidence is `1` found / `0` not found / `0` unclear, so navigation context is usually present. The failure mix is led by `not_av_owned` 100.0% (1/1), while the excluded portion is mostly events with no AV-owned overlap or only sub-`2s` accidental AV contact rather than true scored failures.

When this model succeeds, the behavior is consistent: route change is recovered in `3` of `3` successful events, driver accelerator help is absent in `3` of `3`, and gear alignment holds in `3` of `3` comparable passes. The typical successful event starts moving about `161.89s` after AV engagement, reaches a median max AV speed of `4.09 m/s`, and most often begins in gear `DRIVE_POSITION_V2_DRIVE` with indicator state `INDICATORS_STATE_V2_OFF`.

### Coverage Note

- This card currently reflects only `15` analyzed events across `2` runs, so the rates above are directional and may shift materially as more packets are refreshed.

## Event Cards

| Event time (UTC) | Event type | Outcome | Route change | Disengagement | Console | Foxglove | Event card |
|---|---|---|---|---|---|---|---|
| `2026-04-22 15:15:19.133 UTC` | `unpudo` | `non-AV` | `found` | `none observed` | [console](https://console.sso.wayve.ai/run/fme10010/2026-04-22--13-54-22--gen2-av-776e6413-6cfd-4985-8a89-a423678c808d?id=&time-unixus=1776870919133311) | [foxglove](https://app.foxglove.dev/wayve-on-prem/p/prj_0dX18KZdVHg1fmmI/view?ds=foxglove-stream&ds.deviceName=fme10010&ds.start=2026-04-22T15%3A14%3A57.918254Z&ds.end=2026-04-22T15%3A16%3A14.729456Z&layoutId=lay_0e7VD4WIKDQGU73Y&time=2026-04-22T15%3A15%3A19.133311Z) | [[../report_cards/2026/04/Week-4/fme10010--2026-04-22--13-54-22--gen2-av-776e6413-6cfd-4985-8a89-a423678c808d.md#unpudo 2026-04-22 15:15:19.133 UTC\|card]] |
| `2026-04-22 15:16:09.783 UTC` | `unpudo` | `non-AV` | `found` | `none observed` | [console](https://console.sso.wayve.ai/run/fme10010/2026-04-22--13-54-22--gen2-av-776e6413-6cfd-4985-8a89-a423678c808d?id=&time-unixus=1776870969783316) | [foxglove](https://app.foxglove.dev/wayve-on-prem/p/prj_0dX18KZdVHg1fmmI/view?ds=foxglove-stream&ds.deviceName=fme10010&ds.start=2026-04-22T15%3A14%3A57.918254Z&ds.end=2026-04-22T15%3A20%3A43.089419Z&layoutId=lay_0e7VD4WIKDQGU73Y&time=2026-04-22T15%3A16%3A09.783316Z) | [[../report_cards/2026/04/Week-4/fme10010--2026-04-22--13-54-22--gen2-av-776e6413-6cfd-4985-8a89-a423678c808d.md#unpudo 2026-04-22 15:16:09.783 UTC\|card]] |
| `2026-04-22 15:21:05.683 UTC` | `unpudo` | `non-AV` | `unclear` | `none observed` | [console](https://console.sso.wayve.ai/run/fme10010/2026-04-22--13-54-22--gen2-av-776e6413-6cfd-4985-8a89-a423678c808d?id=&time-unixus=1776871265683296) | [foxglove](https://app.foxglove.dev/wayve-on-prem/p/prj_0dX18KZdVHg1fmmI/view?ds=foxglove-stream&ds.deviceName=fme10010&ds.start=2026-04-22T15%3A20%3A54.233316Z&ds.end=2026-04-22T15%3A21%3A19.933312Z&layoutId=lay_0e7VD4WIKDQGU73Y&time=2026-04-22T15%3A21%3A05.683296Z) | [[../report_cards/2026/04/Week-4/fme10010--2026-04-22--13-54-22--gen2-av-776e6413-6cfd-4985-8a89-a423678c808d.md#unpudo 2026-04-22 15:21:05.683 UTC\|card]] |
| `2026-04-22 15:24:12.583 UTC` | `unpudo` | `non-AV` | `unclear` | `none observed` | [console](https://console.sso.wayve.ai/run/fme10010/2026-04-22--13-54-22--gen2-av-776e6413-6cfd-4985-8a89-a423678c808d?id=&time-unixus=1776871452583305) | [foxglove](https://app.foxglove.dev/wayve-on-prem/p/prj_0dX18KZdVHg1fmmI/view?ds=foxglove-stream&ds.deviceName=fme10010&ds.start=2026-04-22T15%3A24%3A01.183292Z&ds.end=2026-04-22T15%3A24%3A26.283322Z&layoutId=lay_0e7VD4WIKDQGU73Y&time=2026-04-22T15%3A24%3A12.583305Z) | [[../report_cards/2026/04/Week-4/fme10010--2026-04-22--13-54-22--gen2-av-776e6413-6cfd-4985-8a89-a423678c808d.md#unpudo 2026-04-22 15:24:12.583 UTC\|card]] |
| `2026-04-22 15:24:27.083 UTC` | `unpudo` | `non-AV` | `unclear` | `none observed` | [console](https://console.sso.wayve.ai/run/fme10010/2026-04-22--13-54-22--gen2-av-776e6413-6cfd-4985-8a89-a423678c808d?id=&time-unixus=1776871467083314) | [foxglove](https://app.foxglove.dev/wayve-on-prem/p/prj_0dX18KZdVHg1fmmI/view?ds=foxglove-stream&ds.deviceName=fme10010&ds.start=2026-04-22T15%3A24%3A12.833302Z&ds.end=2026-04-22T15%3A24%3A37.083314Z&layoutId=lay_0e7VD4WIKDQGU73Y&time=2026-04-22T15%3A24%3A27.083314Z) | [[../report_cards/2026/04/Week-4/fme10010--2026-04-22--13-54-22--gen2-av-776e6413-6cfd-4985-8a89-a423678c808d.md#unpudo 2026-04-22 15:24:27.083 UTC\|card]] |
| `2026-04-22 15:34:50.933 UTC` | `unpudo` | `pass` | `found` | `none observed` | [console](https://console.sso.wayve.ai/run/fme10010/2026-04-22--13-54-22--gen2-av-776e6413-6cfd-4985-8a89-a423678c808d?id=&time-unixus=1776872090933306) | [foxglove](https://app.foxglove.dev/wayve-on-prem/p/prj_0dX18KZdVHg1fmmI/view?ds=foxglove-stream&ds.deviceName=fme10010&ds.start=2026-04-22T15%3A30%3A12.389948Z&ds.end=2026-04-22T15%3A35%3A15.649378Z&layoutId=lay_0e7VD4WIKDQGU73Y&time=2026-04-22T15%3A34%3A50.933306Z) | [[../report_cards/2026/04/Week-4/fme10010--2026-04-22--13-54-22--gen2-av-776e6413-6cfd-4985-8a89-a423678c808d.md#unpudo 2026-04-22 15:34:50.933 UTC\|card]] |
| `2026-04-22 15:35:32.183 UTC` | `unpudo` | `fail` | `found` | `none observed` | [console](https://console.sso.wayve.ai/run/fme10010/2026-04-22--13-54-22--gen2-av-776e6413-6cfd-4985-8a89-a423678c808d?id=&time-unixus=1776872132183291) | [foxglove](https://app.foxglove.dev/wayve-on-prem/p/prj_0dX18KZdVHg1fmmI/view?ds=foxglove-stream&ds.deviceName=fme10010&ds.start=2026-04-22T15%3A34%3A33.418255Z&ds.end=2026-04-22T15%3A36%3A29.333291Z&layoutId=lay_0e7VD4WIKDQGU73Y&time=2026-04-22T15%3A35%3A32.183291Z) | [[../report_cards/2026/04/Week-4/fme10010--2026-04-22--13-54-22--gen2-av-776e6413-6cfd-4985-8a89-a423678c808d.md#unpudo 2026-04-22 15:35:32.183 UTC\|card]] |
| `2026-04-22 15:39:14.733 UTC` | `unpudo` | `non-AV` | `found` | `none observed` | [console](https://console.sso.wayve.ai/run/fme10010/2026-04-22--13-54-22--gen2-av-776e6413-6cfd-4985-8a89-a423678c808d?id=&time-unixus=1776872354733317) | [foxglove](https://app.foxglove.dev/wayve-on-prem/p/prj_0dX18KZdVHg1fmmI/view?ds=foxglove-stream&ds.deviceName=fme10010&ds.start=2026-04-22T15%3A38%3A54.568258Z&ds.end=2026-04-22T15%3A43%3A06.309372Z&layoutId=lay_0e7VD4WIKDQGU73Y&time=2026-04-22T15%3A39%3A14.733317Z) | [[../report_cards/2026/04/Week-4/fme10010--2026-04-22--13-54-22--gen2-av-776e6413-6cfd-4985-8a89-a423678c808d.md#unpudo 2026-04-22 15:39:14.733 UTC\|card]] |
| `2026-04-22 15:41:44.733 UTC` | `unpudo` | `pass` | `found` | `none observed` | [console](https://console.sso.wayve.ai/run/fme10010/2026-04-22--13-54-22--gen2-av-776e6413-6cfd-4985-8a89-a423678c808d?id=&time-unixus=1776872504733298) | [foxglove](https://app.foxglove.dev/wayve-on-prem/p/prj_0dX18KZdVHg1fmmI/view?ds=foxglove-stream&ds.deviceName=fme10010&ds.start=2026-04-22T15%3A39%3A16.850722Z&ds.end=2026-04-22T15%3A43%3A06.309372Z&layoutId=lay_0e7VD4WIKDQGU73Y&time=2026-04-22T15%3A41%3A44.733298Z) | [[../report_cards/2026/04/Week-4/fme10010--2026-04-22--13-54-22--gen2-av-776e6413-6cfd-4985-8a89-a423678c808d.md#unpudo 2026-04-22 15:41:44.733 UTC\|card]] |
| `2026-04-22 15:43:34.233 UTC` | `unpudo` | `non-AV` | `unclear` | `none observed` | [console](https://console.sso.wayve.ai/run/fme10010/2026-04-22--13-54-22--gen2-av-776e6413-6cfd-4985-8a89-a423678c808d?id=&time-unixus=1776872614233299) | [foxglove](https://app.foxglove.dev/wayve-on-prem/p/prj_0dX18KZdVHg1fmmI/view?ds=foxglove-stream&ds.deviceName=fme10010&ds.start=2026-04-22T15%3A43%3A20.983317Z&ds.end=2026-04-22T15%3A44%3A13.189420Z&layoutId=lay_0e7VD4WIKDQGU73Y&time=2026-04-22T15%3A43%3A34.233299Z) | [[../report_cards/2026/04/Week-4/fme10010--2026-04-22--13-54-22--gen2-av-776e6413-6cfd-4985-8a89-a423678c808d.md#unpudo 2026-04-22 15:43:34.233 UTC\|card]] |
| `2026-04-22 15:44:08.133 UTC` | `unparking` | `non-AV` | `unclear` | `none observed` | [console](https://console.sso.wayve.ai/run/fme10010/2026-04-22--13-54-22--gen2-av-776e6413-6cfd-4985-8a89-a423678c808d?id=&time-unixus=1776872648133318) | [foxglove](https://app.foxglove.dev/wayve-on-prem/p/prj_0dX18KZdVHg1fmmI/view?ds=foxglove-stream&ds.deviceName=fme10010&ds.start=2026-04-22T15%3A43%3A55.633311Z&ds.end=2026-04-22T15%3A44%3A31.929962Z&layoutId=lay_0e7VD4WIKDQGU73Y&time=2026-04-22T15%3A44%3A08.133318Z) | [[../report_cards/2026/04/Week-4/fme10010--2026-04-22--13-54-22--gen2-av-776e6413-6cfd-4985-8a89-a423678c808d.md#unparking 2026-04-22 15:44:08.133 UTC\|card]] |
| `2026-04-22 20:38:15.333 UTC` | `unpudo` | `non-AV` | `unclear` | `none observed` | [console](https://console.sso.wayve.ai/run/fme10003/2026-04-22--20-12-43--gen2-av-3e0a8cb2-409e-4489-9145-f4a94365bc6c?id=&time-unixus=1776890295333302) | [foxglove](https://app.foxglove.dev/wayve-on-prem/p/prj_0dX18KZdVHg1fmmI/view?ds=foxglove-stream&ds.deviceName=fme10003&ds.start=2026-04-22T20%3A38%3A02.633316Z&ds.end=2026-04-22T20%3A38%3A30.883299Z&layoutId=lay_0e7VD4WIKDQGU73Y&time=2026-04-22T20%3A38%3A15.333302Z) | [[../report_cards/2026/04/Week-4/fme10003--2026-04-22--20-12-43--gen2-av-3e0a8cb2-409e-4489-9145-f4a94365bc6c.md#unpudo 2026-04-22 20:38:15.333 UTC\|card]] |
| `2026-04-22 20:42:12.083 UTC` | `unpudo` | `pass` | `found` | `none observed` | [console](https://console.sso.wayve.ai/run/fme10003/2026-04-22--20-12-43--gen2-av-3e0a8cb2-409e-4489-9145-f4a94365bc6c?id=&time-unixus=1776890532083311) | [foxglove](https://app.foxglove.dev/wayve-on-prem/p/prj_0dX18KZdVHg1fmmI/view?ds=foxglove-stream&ds.deviceName=fme10003&ds.start=2026-04-22T20%3A39%3A20.246087Z&ds.end=2026-04-22T20%3A45%3A40.626846Z&layoutId=lay_0e7VD4WIKDQGU73Y&time=2026-04-22T20%3A42%3A12.083311Z) | [[../report_cards/2026/04/Week-4/fme10003--2026-04-22--20-12-43--gen2-av-3e0a8cb2-409e-4489-9145-f4a94365bc6c.md#unpudo 2026-04-22 20:42:12.083 UTC\|card]] |
| `2026-04-22 20:46:16.383 UTC` | `unpudo` | `non-AV` | `unclear` | `none observed` | [console](https://console.sso.wayve.ai/run/fme10003/2026-04-22--20-12-43--gen2-av-3e0a8cb2-409e-4489-9145-f4a94365bc6c?id=&time-unixus=1776890776383304) | [foxglove](https://app.foxglove.dev/wayve-on-prem/p/prj_0dX18KZdVHg1fmmI/view?ds=foxglove-stream&ds.deviceName=fme10003&ds.start=2026-04-22T20%3A45%3A49.183292Z&ds.end=2026-04-22T20%3A46%3A56.183316Z&layoutId=lay_0e7VD4WIKDQGU73Y&time=2026-04-22T20%3A46%3A16.383304Z) | [[../report_cards/2026/04/Week-4/fme10003--2026-04-22--20-12-43--gen2-av-3e0a8cb2-409e-4489-9145-f4a94365bc6c.md#unpudo 2026-04-22 20:46:16.383 UTC\|card]] |
| `2026-04-22 20:59:06.933 UTC` | `unparking` | `non-AV` | `unclear` | `none observed` | [console](https://console.sso.wayve.ai/run/fme10003/2026-04-22--20-12-43--gen2-av-3e0a8cb2-409e-4489-9145-f4a94365bc6c?id=&time-unixus=1776891546933314) | [foxglove](https://app.foxglove.dev/wayve-on-prem/p/prj_0dX18KZdVHg1fmmI/view?ds=foxglove-stream&ds.deviceName=fme10003&ds.start=2026-04-22T20%3A58%3A40.233290Z&ds.end=2026-04-22T20%3A59%3A35.833293Z&layoutId=lay_0e7VD4WIKDQGU73Y&time=2026-04-22T20%3A59%3A06.933314Z) | [[../report_cards/2026/04/Week-4/fme10003--2026-04-22--20-12-43--gen2-av-3e0a8cb2-409e-4489-9145-f4a94365bc6c.md#unparking 2026-04-22 20:59:06.933 UTC\|card]] |
