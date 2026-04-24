# Model Analysis: alpaca-chocolate-fearless

| Field | Value |
|---|---|
| Model | `alpaca-chocolate-fearless` |
| Authors | `boris.indelman` |
| Runs covered | `3` |
| Event count | `13` |
| Scored event count | `1` |
| Pass count | `1` |
| Fail count | `0` |
| Non-AV count | `12` |
| Accidental count | `0` |
| Route-change found | `11` |
| Route-change not found | `0` |
| Route-change unclear | `2` |
| Top effective failure types | `none` |

## Analysis Summary

### Comparison Snapshot

| Metric | Value |
|---|---|
| Runs covered | `3` |
| Scored events | `1` |
| Excluded `non-AV` events | `12` |
| Excluded `accidental` events | `0` |
| Overall success rate | `100.0% (1/1)` |
| `unpudo` success rate | `100.0% (1/1)` |
| `unparking` success rate | `n/a` |
| Ownership / handover failures | `n/a` |
| Short AV-attempt failures | `n/a` |
| Successful events with no driver accel help | `100.0% (1/1)` |
| Successful events with route change found | `100.0% (1/1)` |
| Successful gear alignment at anchor | `100.0% (1/1)` |

### Failure Profile

- The scored subset contains `0` failures out of `1` scored events. The dominant effective failure types are `none`.
- Ownership loss and handover breakage are the main theme: `0` of `0` failures fall into `not_av_owned`, `completed_outside_av`, `driver_completed_maneuver`, or `interrupted_handover`.
- Route-change evidence inside failed events is `found` in `0`, `not found` in `0`, and `unclear` in `0` cases.
- Source disengagement labels inside failed events are `none`; anything else is failing from DBW / ownership / gear evidence rather than an explicit source disengagement label.
- Event-type split: Only `unpudo` events are currently covered, with a success rate of 100.0% (1/1).

### Excluded Events

- `12` events are labelled `non-AV`: there is no AV-owned portion anywhere inside the detected event timeline, so they are mentioned for coverage but excluded from model scoring.
- `0` events are labelled `accidental`: AV participates for less than `2s`, so they are treated as accidental contact rather than a meaningful model attempt.

### Success Behavior

- Successful events are distributed as `1` `unpudo` and `0` `unparking`.
- On successful attempts, route change is recovered in `1` of `1` cases and driver accelerator help is absent in `1` of `1` cases.
- Gear state stays aligned at the anchor in `1` of `1` comparable passes. Planned-indicator alignment is `100.0% (1/1)`, and controller-indicator alignment is `100.0% (1/1)`.
- Typical successful timing is median `AV -> event start` `-1.54s`, median `AV -> first motion` `-1.48s`, and median AV-owned duration `98.42s`.
- Typical successful maneuver shape: common actual gear at the anchor is `DRIVE_POSITION_V2_DRIVE`, common actual indicator is `INDICATORS_STATE_V2_RIGHT_ON`, and median max AV speed is `4.04 m/s`.

### Written Assessment

This card covers `13` detected events across `3` runs, but only `1` of them are scored AV-owned attempts. The remaining `12` `non-AV` and `0` `accidental` events are explicitly excluded from the success-rate denominator. Within the scored subset, the overall success rate is `100.0% (1/1)`. Only `unpudo` events are currently covered, with a success rate of 100.0% (1/1).

Across the scored failures, route-change evidence is `0` found / `0` not found / `0` unclear, so navigation context is usually present. The failure mix is led by `none`, while the excluded portion is mostly events with no AV-owned overlap or only sub-`2s` accidental AV contact rather than true scored failures.

When this model succeeds, the behavior is consistent: route change is recovered in `1` of `1` successful events, driver accelerator help is absent in `1` of `1`, and gear alignment holds in `1` of `1` comparable passes. The typical successful event starts moving about `-1.48s` after AV engagement, reaches a median max AV speed of `4.04 m/s`, and most often begins in gear `DRIVE_POSITION_V2_DRIVE` with indicator state `INDICATORS_STATE_V2_RIGHT_ON`.

### Coverage Note

- This card currently reflects only `13` analyzed events across `3` runs, so the rates above are directional and may shift materially as more packets are refreshed.

## Event Cards

| Event time (UTC) | Event type | Outcome | Route change | Disengagement | Console | Foxglove | Event card |
|---|---|---|---|---|---|---|---|
| `2026-04-19 17:20:41.433 UTC` | `unpudo` | `non-AV` | `unclear` | `none observed` | [console](https://console.sso.wayve.ai/run/fme20007/2026-04-19--17-11-32--gen2-av-ce73c67b-2bac-4bfa-bb30-7cd7f6654a1d?id=&time-unixus=1776619241433308) | [foxglove](https://app.foxglove.dev/wayve-on-prem/p/prj_0dX18KZdVHg1fmmI/view?ds=foxglove-stream&ds.deviceName=fme20007&ds.start=2026-04-19T17%3A20%3A27.483301Z&ds.end=2026-04-19T17%3A21%3A08.862115Z&layoutId=lay_0e7VD4WIKDQGU73Y&time=2026-04-19T17%3A20%3A41.433308Z) | [card](../report_cards/2026/04/Week-3/fme20007--2026-04-19--17-11-32--gen2-av-ce73c67b-2bac-4bfa-bb30-7cd7f6654a1d.md#unpudo-2026-04-19-172041433-utc) |
| `2026-04-19 17:28:16.633 UTC` | `unpudo` | `non-AV` | `found` | `none observed` | [console](https://console.sso.wayve.ai/run/fme20007/2026-04-19--17-11-32--gen2-av-ce73c67b-2bac-4bfa-bb30-7cd7f6654a1d?id=&time-unixus=1776619696633292) | [foxglove](https://app.foxglove.dev/wayve-on-prem/p/prj_0dX18KZdVHg1fmmI/view?ds=foxglove-stream&ds.deviceName=fme20007&ds.start=2026-04-19T17%3A27%3A58.768296Z&ds.end=2026-04-19T17%3A32%3A16.080238Z&layoutId=lay_0e7VD4WIKDQGU73Y&time=2026-04-19T17%3A28%3A16.633292Z) | [card](../report_cards/2026/04/Week-3/fme20007--2026-04-19--17-11-32--gen2-av-ce73c67b-2bac-4bfa-bb30-7cd7f6654a1d.md#unpudo-2026-04-19-172816633-utc) |
| `2026-04-19 17:35:07.183 UTC` | `unpudo` | `non-AV` | `found` | `none observed` | [console](https://console.sso.wayve.ai/run/fme20007/2026-04-19--17-11-32--gen2-av-ce73c67b-2bac-4bfa-bb30-7cd7f6654a1d?id=&time-unixus=1776620107183292) | [foxglove](https://app.foxglove.dev/wayve-on-prem/p/prj_0dX18KZdVHg1fmmI/view?ds=foxglove-stream&ds.deviceName=fme20007&ds.start=2026-04-19T17%3A34%3A35.983317Z&ds.end=2026-04-19T17%3A35%3A20.733302Z&layoutId=lay_0e7VD4WIKDQGU73Y&time=2026-04-19T17%3A35%3A07.183292Z) | [card](../report_cards/2026/04/Week-3/fme20007--2026-04-19--17-11-32--gen2-av-ce73c67b-2bac-4bfa-bb30-7cd7f6654a1d.md#unpudo-2026-04-19-173507183-utc) |
| `2026-04-19 18:03:59.783 UTC` | `unpudo` | `non-AV` | `found` | `none observed` | [console](https://console.sso.wayve.ai/run/fme20007/2026-04-19--17-11-32--gen2-av-ce73c67b-2bac-4bfa-bb30-7cd7f6654a1d?id=&time-unixus=1776621839783307) | [foxglove](https://app.foxglove.dev/wayve-on-prem/p/prj_0dX18KZdVHg1fmmI/view?ds=foxglove-stream&ds.deviceName=fme20007&ds.start=2026-04-19T18%3A03%3A47.433306Z&ds.end=2026-04-19T18%3A06%3A35.200203Z&layoutId=lay_0e7VD4WIKDQGU73Y&time=2026-04-19T18%3A03%3A59.783307Z) | [card](../report_cards/2026/04/Week-3/fme20007--2026-04-19--17-11-32--gen2-av-ce73c67b-2bac-4bfa-bb30-7cd7f6654a1d.md#unpudo-2026-04-19-180359783-utc) |
| `2026-04-19 18:09:17.133 UTC` | `unpudo` | `non-AV` | `found` | `none observed` | [console](https://console.sso.wayve.ai/run/fme20007/2026-04-19--17-11-32--gen2-av-ce73c67b-2bac-4bfa-bb30-7cd7f6654a1d?id=&time-unixus=1776622157133294) | [foxglove](https://app.foxglove.dev/wayve-on-prem/p/prj_0dX18KZdVHg1fmmI/view?ds=foxglove-stream&ds.deviceName=fme20007&ds.start=2026-04-19T18%3A08%3A38.618270Z&ds.end=2026-04-19T18%3A09%3A31.283317Z&layoutId=lay_0e7VD4WIKDQGU73Y&time=2026-04-19T18%3A09%3A17.133294Z) | [card](../report_cards/2026/04/Week-3/fme20007--2026-04-19--17-11-32--gen2-av-ce73c67b-2bac-4bfa-bb30-7cd7f6654a1d.md#unpudo-2026-04-19-180917133-utc) |
| `2026-04-19 18:57:13.983 UTC` | `unpudo` | `pass` | `found` | `none observed` | [console](https://console.sso.wayve.ai/run/fme20007/2026-04-19--18-53-22--gen2-av-ddd40ec5-0a42-467c-90ca-157a762e45c5?id=&time-unixus=1776625033983307) | [foxglove](https://app.foxglove.dev/wayve-on-prem/p/prj_0dX18KZdVHg1fmmI/view?ds=foxglove-stream&ds.deviceName=fme20007&ds.start=2026-04-19T18%3A55%3A46.118253Z&ds.end=2026-04-19T18%3A59%3A03.939817Z&layoutId=lay_0e7VD4WIKDQGU73Y&time=2026-04-19T18%3A57%3A13.983307Z) | [card](../report_cards/2026/04/Week-3/fme20007--2026-04-19--18-53-22--gen2-av-ddd40ec5-0a42-467c-90ca-157a762e45c5.md#unpudo-2026-04-19-185713983-utc) |
| `2026-04-19 18:59:18.783 UTC` | `unpudo` | `non-AV` | `found` | `none observed` | [console](https://console.sso.wayve.ai/run/fme20007/2026-04-19--18-53-22--gen2-av-ddd40ec5-0a42-467c-90ca-157a762e45c5?id=&time-unixus=1776625158783310) | [foxglove](https://app.foxglove.dev/wayve-on-prem/p/prj_0dX18KZdVHg1fmmI/view?ds=foxglove-stream&ds.deviceName=fme20007&ds.start=2026-04-19T18%3A58%3A54.718251Z&ds.end=2026-04-19T18%3A59%3A36.733299Z&layoutId=lay_0e7VD4WIKDQGU73Y&time=2026-04-19T18%3A59%3A18.783310Z) | [card](../report_cards/2026/04/Week-3/fme20007--2026-04-19--18-53-22--gen2-av-ddd40ec5-0a42-467c-90ca-157a762e45c5.md#unpudo-2026-04-19-185918783-utc) |
| `2026-04-19 19:02:05.683 UTC` | `unpudo` | `non-AV` | `found` | `none observed` | [console](https://console.sso.wayve.ai/run/fme20007/2026-04-19--18-53-22--gen2-av-ddd40ec5-0a42-467c-90ca-157a762e45c5?id=&time-unixus=1776625325683309) | [foxglove](https://app.foxglove.dev/wayve-on-prem/p/prj_0dX18KZdVHg1fmmI/view?ds=foxglove-stream&ds.deviceName=fme20007&ds.start=2026-04-19T19%3A01%3A50.318256Z&ds.end=2026-04-19T19%3A04%3A30.259854Z&layoutId=lay_0e7VD4WIKDQGU73Y&time=2026-04-19T19%3A02%3A05.683309Z) | [card](../report_cards/2026/04/Week-3/fme20007--2026-04-19--18-53-22--gen2-av-ddd40ec5-0a42-467c-90ca-157a762e45c5.md#unpudo-2026-04-19-190205683-utc) |
| `2026-04-19 19:05:24.083 UTC` | `unpudo` | `non-AV` | `found` | `none observed` | [console](https://console.sso.wayve.ai/run/fme20007/2026-04-19--18-53-22--gen2-av-ddd40ec5-0a42-467c-90ca-157a762e45c5?id=&time-unixus=1776625524083310) | [foxglove](https://app.foxglove.dev/wayve-on-prem/p/prj_0dX18KZdVHg1fmmI/view?ds=foxglove-stream&ds.deviceName=fme20007&ds.start=2026-04-19T19%3A04%3A55.268266Z&ds.end=2026-04-19T19%3A05%3A38.483305Z&layoutId=lay_0e7VD4WIKDQGU73Y&time=2026-04-19T19%3A05%3A24.083310Z) | [card](../report_cards/2026/04/Week-3/fme20007--2026-04-19--18-53-22--gen2-av-ddd40ec5-0a42-467c-90ca-157a762e45c5.md#unpudo-2026-04-19-190524083-utc) |
| `2026-04-19 21:30:04.883 UTC` | `unpudo` | `non-AV` | `found` | `none observed` | [console](https://console.sso.wayve.ai/run/fme20007/2026-04-19--21-22-24--gen2-av-b9dcf6f2-899e-4787-bf0d-316d419103cb?id=&time-unixus=1776634204883318) | [foxglove](https://app.foxglove.dev/wayve-on-prem/p/prj_0dX18KZdVHg1fmmI/view?ds=foxglove-stream&ds.deviceName=fme20007&ds.start=2026-04-19T21%3A29%3A49.018285Z&ds.end=2026-04-19T21%3A33%3A32.505014Z&layoutId=lay_0e7VD4WIKDQGU73Y&time=2026-04-19T21%3A30%3A04.883318Z) | [card](../report_cards/2026/04/Week-3/fme20007--2026-04-19--21-22-24--gen2-av-b9dcf6f2-899e-4787-bf0d-316d419103cb.md#unpudo-2026-04-19-213004883-utc) |
| `2026-04-19 21:35:13.933 UTC` | `unpudo` | `non-AV` | `found` | `none observed` | [console](https://console.sso.wayve.ai/run/fme20007/2026-04-19--21-22-24--gen2-av-b9dcf6f2-899e-4787-bf0d-316d419103cb?id=&time-unixus=1776634513933318) | [foxglove](https://app.foxglove.dev/wayve-on-prem/p/prj_0dX18KZdVHg1fmmI/view?ds=foxglove-stream&ds.deviceName=fme20007&ds.start=2026-04-19T21%3A33%3A07.268267Z&ds.end=2026-04-19T21%3A38%3A07.464166Z&layoutId=lay_0e7VD4WIKDQGU73Y&time=2026-04-19T21%3A35%3A13.933318Z) | [card](../report_cards/2026/04/Week-3/fme20007--2026-04-19--21-22-24--gen2-av-b9dcf6f2-899e-4787-bf0d-316d419103cb.md#unpudo-2026-04-19-213513933-utc) |
| `2026-04-19 21:42:30.783 UTC` | `unpudo` | `non-AV` | `unclear` | `uncategorised` | [console](https://console.sso.wayve.ai/run/fme20007/2026-04-19--21-22-24--gen2-av-b9dcf6f2-899e-4787-bf0d-316d419103cb?id=&time-unixus=1776634950783323) | [foxglove](https://app.foxglove.dev/wayve-on-prem/p/prj_0dX18KZdVHg1fmmI/view?ds=foxglove-stream&ds.deviceName=fme20007&ds.start=2026-04-19T21%3A42%3A14.983319Z&ds.end=2026-04-19T21%3A45%3A10.665086Z&layoutId=lay_0e7VD4WIKDQGU73Y&time=2026-04-19T21%3A42%3A30.783323Z) | [card](../report_cards/2026/04/Week-3/fme20007--2026-04-19--21-22-24--gen2-av-b9dcf6f2-899e-4787-bf0d-316d419103cb.md#unpudo-2026-04-19-214230783-utc) |
| `2026-04-19 21:45:05.783 UTC` | `unpudo` | `non-AV` | `found` | `none observed` | [console](https://console.sso.wayve.ai/run/fme20007/2026-04-19--21-22-24--gen2-av-b9dcf6f2-899e-4787-bf0d-316d419103cb?id=&time-unixus=1776635105783314) | [foxglove](https://app.foxglove.dev/wayve-on-prem/p/prj_0dX18KZdVHg1fmmI/view?ds=foxglove-stream&ds.deviceName=fme20007&ds.start=2026-04-19T21%3A44%3A47.318291Z&ds.end=2026-04-19T21%3A45%3A29.083295Z&layoutId=lay_0e7VD4WIKDQGU73Y&time=2026-04-19T21%3A45%3A05.783314Z) | [card](../report_cards/2026/04/Week-3/fme20007--2026-04-19--21-22-24--gen2-av-b9dcf6f2-899e-4787-bf0d-316d419103cb.md#unpudo-2026-04-19-214505783-utc) |
