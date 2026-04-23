# Model Analysis: alpaca-chocolate-fearless

| Field | Value |
|---|---|
| Model | `alpaca-chocolate-fearless` |
| Authors | `boris.indelman` |
| Runs covered | `3` |
| Event count | `13` |
| Scored event count | `0` |
| Pass count | `0` |
| Fail count | `0` |
| Non-AV count | `4` |
| Accidental count | `9` |
| Route-change found | `11` |
| Route-change not found | `0` |
| Route-change unclear | `2` |
| Top effective failure types | `none` |

## Analysis Summary

### Comparison Snapshot

| Metric | Value |
|---|---|
| Runs covered | `3` |
| Scored events | `0` |
| Excluded `non-AV` events | `4` |
| Excluded `accidental` events | `9` |
| Overall success rate | `n/a` |
| `unpudo` success rate | `n/a` |
| `unparking` success rate | `n/a` |
| Ownership / handover failures | `n/a` |
| Short AV-attempt failures | `n/a` |
| Successful events with no driver accel help | `n/a` |
| Successful events with route change found | `n/a` |
| Successful gear alignment at anchor | `n/a` |

### Failure Profile

- The scored subset contains `0` failures out of `0` scored events. The dominant effective failure types are `none`.
- Ownership loss and handover breakage are the main theme: `0` of `0` failures fall into `not_av_owned`, `completed_outside_av`, `driver_completed_maneuver`, or `interrupted_handover`.
- Route-change evidence inside failed events is `found` in `0`, `not found` in `0`, and `unclear` in `0` cases.
- Source disengagement labels inside failed events are `none`; anything else is failing from DBW / ownership / gear evidence rather than an explicit source disengagement label.
- Event-type split: No scored AV-owned events are currently available for event-type comparison.

### Excluded Events

- `4` events are labelled `non-AV`: the detected maneuver starts outside AV ownership, so they are mentioned for coverage but excluded from model scoring.
- `9` events are labelled `accidental`: AV participates for less than `2s`, so they are treated as accidental contact rather than a meaningful model attempt.

### Success Behavior

- No successful events are currently analyzed for this model, so the comparison baseline is entirely failure-side.

### Written Assessment

This card covers `13` detected events across `3` runs, with `4` labelled `non-AV` and `9` labelled `accidental`, so only `0` events remain in the scored subset.

There are no successful scored events in the current sample. The scored failures are led by `none`, while the excluded events capture detections that either begin outside AV ownership or contain less than `2s` of AV participation.

### Coverage Note

- This card currently reflects only `13` analyzed events across `3` runs, so the rates above are directional and may shift materially as more packets are refreshed.

## Event Cards

| Event time (UTC) | Event type | Outcome | Route change | Disengagement | Console | Foxglove | Event card |
|---|---|---|---|---|---|---|---|
| `2026-04-19 17:20:41.433 UTC` | `unpudo` | `accidental` | `unclear` | `none observed` | [console](https://console.sso.wayve.ai/run/fme20007/2026-04-19--17-11-32--gen2-av-ce73c67b-2bac-4bfa-bb30-7cd7f6654a1d?id=&time-unixus=1776619241433308) | [foxglove](https://app.foxglove.dev/wayve-on-prem/p/prj_0dX18KZdVHg1fmmI/view?ds=foxglove-stream&ds.deviceName=fme20007&ds.start=2026-04-19T17%3A20%3A27.483301Z&ds.end=2026-04-19T17%3A21%3A08.862115Z&layoutId=lay_0e7VD4WIKDQGU73Y&time=2026-04-19T17%3A20%3A41.433308Z) | [[../report_cards/2026/04/Week-3/fme20007--2026-04-19--17-11-32--gen2-av-ce73c67b-2bac-4bfa-bb30-7cd7f6654a1d.md#unpudo 2026-04-19 17:20:41.433 UTC\|card]] |
| `2026-04-19 17:28:16.633 UTC` | `unpudo` | `accidental` | `found` | `none observed` | [console](https://console.sso.wayve.ai/run/fme20007/2026-04-19--17-11-32--gen2-av-ce73c67b-2bac-4bfa-bb30-7cd7f6654a1d?id=&time-unixus=1776619696633292) | [foxglove](https://app.foxglove.dev/wayve-on-prem/p/prj_0dX18KZdVHg1fmmI/view?ds=foxglove-stream&ds.deviceName=fme20007&ds.start=2026-04-19T17%3A27%3A58.768296Z&ds.end=2026-04-19T17%3A32%3A16.080238Z&layoutId=lay_0e7VD4WIKDQGU73Y&time=2026-04-19T17%3A28%3A16.633292Z) | [[../report_cards/2026/04/Week-3/fme20007--2026-04-19--17-11-32--gen2-av-ce73c67b-2bac-4bfa-bb30-7cd7f6654a1d.md#unpudo 2026-04-19 17:28:16.633 UTC\|card]] |
| `2026-04-19 17:35:07.183 UTC` | `unpudo` | `non-AV` | `found` | `none observed` | [console](https://console.sso.wayve.ai/run/fme20007/2026-04-19--17-11-32--gen2-av-ce73c67b-2bac-4bfa-bb30-7cd7f6654a1d?id=&time-unixus=1776620107183292) | [foxglove](https://app.foxglove.dev/wayve-on-prem/p/prj_0dX18KZdVHg1fmmI/view?ds=foxglove-stream&ds.deviceName=fme20007&ds.start=2026-04-19T17%3A34%3A35.983317Z&ds.end=2026-04-19T17%3A35%3A20.733302Z&layoutId=lay_0e7VD4WIKDQGU73Y&time=2026-04-19T17%3A35%3A07.183292Z) | [[../report_cards/2026/04/Week-3/fme20007--2026-04-19--17-11-32--gen2-av-ce73c67b-2bac-4bfa-bb30-7cd7f6654a1d.md#unpudo 2026-04-19 17:35:07.183 UTC\|card]] |
| `2026-04-19 18:03:59.783 UTC` | `unpudo` | `accidental` | `found` | `none observed` | [console](https://console.sso.wayve.ai/run/fme20007/2026-04-19--17-11-32--gen2-av-ce73c67b-2bac-4bfa-bb30-7cd7f6654a1d?id=&time-unixus=1776621839783307) | [foxglove](https://app.foxglove.dev/wayve-on-prem/p/prj_0dX18KZdVHg1fmmI/view?ds=foxglove-stream&ds.deviceName=fme20007&ds.start=2026-04-19T18%3A03%3A47.433306Z&ds.end=2026-04-19T18%3A06%3A35.200203Z&layoutId=lay_0e7VD4WIKDQGU73Y&time=2026-04-19T18%3A03%3A59.783307Z) | [[../report_cards/2026/04/Week-3/fme20007--2026-04-19--17-11-32--gen2-av-ce73c67b-2bac-4bfa-bb30-7cd7f6654a1d.md#unpudo 2026-04-19 18:03:59.783 UTC\|card]] |
| `2026-04-19 18:09:17.133 UTC` | `unpudo` | `accidental` | `found` | `none observed` | [console](https://console.sso.wayve.ai/run/fme20007/2026-04-19--17-11-32--gen2-av-ce73c67b-2bac-4bfa-bb30-7cd7f6654a1d?id=&time-unixus=1776622157133294) | [foxglove](https://app.foxglove.dev/wayve-on-prem/p/prj_0dX18KZdVHg1fmmI/view?ds=foxglove-stream&ds.deviceName=fme20007&ds.start=2026-04-19T18%3A08%3A38.618270Z&ds.end=2026-04-19T18%3A09%3A31.283317Z&layoutId=lay_0e7VD4WIKDQGU73Y&time=2026-04-19T18%3A09%3A17.133294Z) | [[../report_cards/2026/04/Week-3/fme20007--2026-04-19--17-11-32--gen2-av-ce73c67b-2bac-4bfa-bb30-7cd7f6654a1d.md#unpudo 2026-04-19 18:09:17.133 UTC\|card]] |
| `2026-04-19 18:57:13.983 UTC` | `unpudo` | `non-AV` | `found` | `none observed` | [console](https://console.sso.wayve.ai/run/fme20007/2026-04-19--18-53-22--gen2-av-ddd40ec5-0a42-467c-90ca-157a762e45c5?id=&time-unixus=1776625033983307) | [foxglove](https://app.foxglove.dev/wayve-on-prem/p/prj_0dX18KZdVHg1fmmI/view?ds=foxglove-stream&ds.deviceName=fme20007&ds.start=2026-04-19T18%3A55%3A46.118253Z&ds.end=2026-04-19T18%3A59%3A03.939817Z&layoutId=lay_0e7VD4WIKDQGU73Y&time=2026-04-19T18%3A57%3A13.983307Z) | [[../report_cards/2026/04/Week-3/fme20007--2026-04-19--18-53-22--gen2-av-ddd40ec5-0a42-467c-90ca-157a762e45c5.md#unpudo 2026-04-19 18:57:13.983 UTC\|card]] |
| `2026-04-19 18:59:18.783 UTC` | `unpudo` | `non-AV` | `found` | `none observed` | [console](https://console.sso.wayve.ai/run/fme20007/2026-04-19--18-53-22--gen2-av-ddd40ec5-0a42-467c-90ca-157a762e45c5?id=&time-unixus=1776625158783310) | [foxglove](https://app.foxglove.dev/wayve-on-prem/p/prj_0dX18KZdVHg1fmmI/view?ds=foxglove-stream&ds.deviceName=fme20007&ds.start=2026-04-19T18%3A58%3A54.718251Z&ds.end=2026-04-19T18%3A59%3A36.733299Z&layoutId=lay_0e7VD4WIKDQGU73Y&time=2026-04-19T18%3A59%3A18.783310Z) | [[../report_cards/2026/04/Week-3/fme20007--2026-04-19--18-53-22--gen2-av-ddd40ec5-0a42-467c-90ca-157a762e45c5.md#unpudo 2026-04-19 18:59:18.783 UTC\|card]] |
| `2026-04-19 19:02:05.683 UTC` | `unpudo` | `accidental` | `found` | `none observed` | [console](https://console.sso.wayve.ai/run/fme20007/2026-04-19--18-53-22--gen2-av-ddd40ec5-0a42-467c-90ca-157a762e45c5?id=&time-unixus=1776625325683309) | [foxglove](https://app.foxglove.dev/wayve-on-prem/p/prj_0dX18KZdVHg1fmmI/view?ds=foxglove-stream&ds.deviceName=fme20007&ds.start=2026-04-19T19%3A01%3A50.318256Z&ds.end=2026-04-19T19%3A04%3A30.259854Z&layoutId=lay_0e7VD4WIKDQGU73Y&time=2026-04-19T19%3A02%3A05.683309Z) | [[../report_cards/2026/04/Week-3/fme20007--2026-04-19--18-53-22--gen2-av-ddd40ec5-0a42-467c-90ca-157a762e45c5.md#unpudo 2026-04-19 19:02:05.683 UTC\|card]] |
| `2026-04-19 19:05:24.083 UTC` | `unpudo` | `non-AV` | `found` | `none observed` | [console](https://console.sso.wayve.ai/run/fme20007/2026-04-19--18-53-22--gen2-av-ddd40ec5-0a42-467c-90ca-157a762e45c5?id=&time-unixus=1776625524083310) | [foxglove](https://app.foxglove.dev/wayve-on-prem/p/prj_0dX18KZdVHg1fmmI/view?ds=foxglove-stream&ds.deviceName=fme20007&ds.start=2026-04-19T19%3A04%3A55.268266Z&ds.end=2026-04-19T19%3A05%3A38.483305Z&layoutId=lay_0e7VD4WIKDQGU73Y&time=2026-04-19T19%3A05%3A24.083310Z) | [[../report_cards/2026/04/Week-3/fme20007--2026-04-19--18-53-22--gen2-av-ddd40ec5-0a42-467c-90ca-157a762e45c5.md#unpudo 2026-04-19 19:05:24.083 UTC\|card]] |
| `2026-04-19 21:30:04.883 UTC` | `unpudo` | `accidental` | `found` | `none observed` | [console](https://console.sso.wayve.ai/run/fme20007/2026-04-19--21-22-24--gen2-av-b9dcf6f2-899e-4787-bf0d-316d419103cb?id=&time-unixus=1776634204883318) | [foxglove](https://app.foxglove.dev/wayve-on-prem/p/prj_0dX18KZdVHg1fmmI/view?ds=foxglove-stream&ds.deviceName=fme20007&ds.start=2026-04-19T21%3A29%3A49.018285Z&ds.end=2026-04-19T21%3A33%3A32.505014Z&layoutId=lay_0e7VD4WIKDQGU73Y&time=2026-04-19T21%3A30%3A04.883318Z) | [[../report_cards/2026/04/Week-3/fme20007--2026-04-19--21-22-24--gen2-av-b9dcf6f2-899e-4787-bf0d-316d419103cb.md#unpudo 2026-04-19 21:30:04.883 UTC\|card]] |
| `2026-04-19 21:35:13.933 UTC` | `unpudo` | `accidental` | `found` | `none observed` | [console](https://console.sso.wayve.ai/run/fme20007/2026-04-19--21-22-24--gen2-av-b9dcf6f2-899e-4787-bf0d-316d419103cb?id=&time-unixus=1776634513933318) | [foxglove](https://app.foxglove.dev/wayve-on-prem/p/prj_0dX18KZdVHg1fmmI/view?ds=foxglove-stream&ds.deviceName=fme20007&ds.start=2026-04-19T21%3A33%3A07.268267Z&ds.end=2026-04-19T21%3A38%3A07.464166Z&layoutId=lay_0e7VD4WIKDQGU73Y&time=2026-04-19T21%3A35%3A13.933318Z) | [[../report_cards/2026/04/Week-3/fme20007--2026-04-19--21-22-24--gen2-av-b9dcf6f2-899e-4787-bf0d-316d419103cb.md#unpudo 2026-04-19 21:35:13.933 UTC\|card]] |
| `2026-04-19 21:42:30.783 UTC` | `unpudo` | `accidental` | `unclear` | `uncategorised` | [console](https://console.sso.wayve.ai/run/fme20007/2026-04-19--21-22-24--gen2-av-b9dcf6f2-899e-4787-bf0d-316d419103cb?id=&time-unixus=1776634950783323) | [foxglove](https://app.foxglove.dev/wayve-on-prem/p/prj_0dX18KZdVHg1fmmI/view?ds=foxglove-stream&ds.deviceName=fme20007&ds.start=2026-04-19T21%3A42%3A14.983319Z&ds.end=2026-04-19T21%3A45%3A10.665086Z&layoutId=lay_0e7VD4WIKDQGU73Y&time=2026-04-19T21%3A42%3A30.783323Z) | [[../report_cards/2026/04/Week-3/fme20007--2026-04-19--21-22-24--gen2-av-b9dcf6f2-899e-4787-bf0d-316d419103cb.md#unpudo 2026-04-19 21:42:30.783 UTC\|card]] |
| `2026-04-19 21:45:05.783 UTC` | `unpudo` | `accidental` | `found` | `none observed` | [console](https://console.sso.wayve.ai/run/fme20007/2026-04-19--21-22-24--gen2-av-b9dcf6f2-899e-4787-bf0d-316d419103cb?id=&time-unixus=1776635105783314) | [foxglove](https://app.foxglove.dev/wayve-on-prem/p/prj_0dX18KZdVHg1fmmI/view?ds=foxglove-stream&ds.deviceName=fme20007&ds.start=2026-04-19T21%3A44%3A47.318291Z&ds.end=2026-04-19T21%3A45%3A29.083295Z&layoutId=lay_0e7VD4WIKDQGU73Y&time=2026-04-19T21%3A45%3A05.783314Z) | [[../report_cards/2026/04/Week-3/fme20007--2026-04-19--21-22-24--gen2-av-b9dcf6f2-899e-4787-bf0d-316d419103cb.md#unpudo 2026-04-19 21:45:05.783 UTC\|card]] |
