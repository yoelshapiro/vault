# Model Analysis: harlequin-excited-greyhound

| Field | Value |
|---|---|
| Model | `harlequin-excited-greyhound` |
| Authors | `boris.indelman` |
| Runs covered | `1` |
| Event count | `17` |
| Scored event count | `16` |
| Pass count | `12` |
| Fail count | `4` |
| Non-AV count | `0` |
| Accidental count | `1` |
| Route-change found | `8` |
| Route-change not found | `0` |
| Route-change unclear | `9` |
| Top effective failure types | `parking` x3, `failed_to_accelerate` x1 |

## Analysis Summary

### Comparison Snapshot

| Metric | Value |
|---|---|
| Runs covered | `1` |
| Scored events | `16` |
| Excluded `non-AV` events | `0` |
| Excluded `accidental` events | `1` |
| Overall success rate | `75.0% (12/16)` |
| `unpudo` success rate | `60.0% (3/5)` |
| `unparking` success rate | `81.8% (9/11)` |
| Ownership / handover failures | `0.0% (0/4)` |
| Short AV-attempt failures | `0.0% (0/4)` |
| Successful events with no driver accel help | `100.0% (12/12)` |
| Successful events with route change found | `50.0% (6/12)` |
| Successful gear alignment at anchor | `100.0% (12/12)` |

### Failure Profile

- The scored subset contains `4` failures out of `16` scored events. The dominant effective failure types are `parking` 75.0% (3/4), `failed_to_accelerate` 25.0% (1/4).
- Ownership loss and handover breakage are the main theme: `0` of `4` failures fall into `not_av_owned`, `completed_outside_av`, `driver_completed_maneuver`, or `interrupted_handover`.
- Route-change evidence inside failed events is `found` in `2`, `not found` in `0`, and `unclear` in `2` cases.
- Source disengagement labels inside failed events are `parking` 75.0% (3/4), `failed_to_accelerate` 25.0% (1/4); anything else is failing from DBW / ownership / gear evidence rather than an explicit source disengagement label.
- Event-type split: `unparking` is stronger than `unpudo` in this sample: 81.8% (9/11) versus 60.0% (3/5).

### Excluded Events

- `0` events are labelled `non-AV`: the detected maneuver starts outside AV ownership, so they are mentioned for coverage but excluded from model scoring.
- `1` events are labelled `accidental`: AV participates for less than `2s`, so they are treated as accidental contact rather than a meaningful model attempt.

### Success Behavior

- Successful events are distributed as `3` `unpudo` and `9` `unparking`.
- On successful attempts, route change is recovered in `6` of `12` cases and driver accelerator help is absent in `12` of `12` cases.
- Gear state stays aligned at the anchor in `12` of `12` comparable passes. Planned-indicator alignment is `25.0% (3/12)`, and controller-indicator alignment is `25.0% (3/12)`.
- Typical successful timing is median `AV -> event start` `196.54s`, median `AV -> first motion` `196.74s`, and median AV-owned duration `566.56s`.
- Typical successful maneuver shape: common actual gear at the anchor is `DRIVE_POSITION_V2_DRIVE`, common actual indicator is `INDICATORS_STATE_V2_OFF`, and median max AV speed is `7.52 m/s`.

### Written Assessment

This card covers `17` detected events across `1` runs, but only `16` of them are scored AV-owned attempts. The remaining `0` `non-AV` and `1` `accidental` events are explicitly excluded from the success-rate denominator. Within the scored subset, the overall success rate is `75.0% (12/16)`. `unparking` is stronger than `unpudo` in this sample: 81.8% (9/11) versus 60.0% (3/5).

Across the scored failures, route-change evidence is `2` found / `0` not found / `2` unclear, so navigation context is usually present. The failure mix is led by `parking` 75.0% (3/4), `failed_to_accelerate` 25.0% (1/4), while the excluded portion is mostly `non-AV` starts or sub-`2s` accidental AV contact rather than true scored failures.

When this model succeeds, the behavior is consistent: route change is recovered in `6` of `12` successful events, driver accelerator help is absent in `12` of `12`, and gear alignment holds in `12` of `12` comparable passes. The typical successful event starts moving about `196.74s` after AV engagement, reaches a median max AV speed of `7.52 m/s`, and most often begins in gear `DRIVE_POSITION_V2_DRIVE` with indicator state `INDICATORS_STATE_V2_OFF`.

### Coverage Note

- This card currently reflects only `17` analyzed events across `1` runs, so the rates above are directional and may shift materially as more packets are refreshed.

## Event Cards

| Event time (UTC) | Event type | Outcome | Route change | Disengagement | Console | Foxglove | Event card |
|---|---|---|---|---|---|---|---|
| `2026-04-14 12:21:47.383 UTC` | `unpudo` | `pass` | `found` | `none observed` | [console](https://console.sso.wayve.ai/run/fme20040/2026-04-14--11-58-50--gen2-av-90560185-3296-43ba-9ec3-6a1693f1514a?id=&time-unixus=1776169307383305) | [foxglove](https://app.foxglove.dev/wayve-on-prem/p/prj_0dX18KZdVHg1fmmI/view?ds=foxglove-stream&ds.deviceName=fme20040&ds.start=2026-04-14T12%3A20%3A44.568238Z&ds.end=2026-04-14T12%3A24%3A16.165508Z&layoutId=lay_0e7VD4WIKDQGU73Y&time=2026-04-14T12%3A21%3A47.383305Z) | [[../report_cards/2026/04/Week-3/fme20040--2026-04-14--11-58-50--gen2-av-90560185-3296-43ba-9ec3-6a1693f1514a.md#unpudo 2026-04-14 12:21:47.383 UTC\|card]] |
| `2026-04-14 12:24:05.283 UTC` | `unpudo` | `fail` | `found` | `parking` | [console](https://console.sso.wayve.ai/run/fme20040/2026-04-14--11-58-50--gen2-av-90560185-3296-43ba-9ec3-6a1693f1514a?id=&time-unixus=1776169445283308) | [foxglove](https://app.foxglove.dev/wayve-on-prem/p/prj_0dX18KZdVHg1fmmI/view?ds=foxglove-stream&ds.deviceName=fme20040&ds.start=2026-04-14T12%3A22%3A29.468722Z&ds.end=2026-04-14T12%3A24%3A21.383309Z&layoutId=lay_0e7VD4WIKDQGU73Y&time=2026-04-14T12%3A24%3A05.283308Z) | [[../report_cards/2026/04/Week-3/fme20040--2026-04-14--11-58-50--gen2-av-90560185-3296-43ba-9ec3-6a1693f1514a.md#unpudo 2026-04-14 12:24:05.283 UTC\|card]] |
| `2026-04-14 12:29:04.383 UTC` | `unpudo` | `pass` | `found` | `none observed` | [console](https://console.sso.wayve.ai/run/fme20040/2026-04-14--11-58-50--gen2-av-90560185-3296-43ba-9ec3-6a1693f1514a?id=&time-unixus=1776169744383301) | [foxglove](https://app.foxglove.dev/wayve-on-prem/p/prj_0dX18KZdVHg1fmmI/view?ds=foxglove-stream&ds.deviceName=fme20040&ds.start=2026-04-14T12%3A24%3A02.746772Z&ds.end=2026-04-14T12%3A35%3A57.565809Z&layoutId=lay_0e7VD4WIKDQGU73Y&time=2026-04-14T12%3A29%3A04.383301Z) | [[../report_cards/2026/04/Week-3/fme20040--2026-04-14--11-58-50--gen2-av-90560185-3296-43ba-9ec3-6a1693f1514a.md#unpudo 2026-04-14 12:29:04.383 UTC\|card]] |
| `2026-04-14 12:35:47.383 UTC` | `unpudo` | `fail` | `found` | `parking` | [console](https://console.sso.wayve.ai/run/fme20040/2026-04-14--11-58-50--gen2-av-90560185-3296-43ba-9ec3-6a1693f1514a?id=&time-unixus=1776170147383303) | [foxglove](https://app.foxglove.dev/wayve-on-prem/p/prj_0dX18KZdVHg1fmmI/view?ds=foxglove-stream&ds.deviceName=fme20040&ds.start=2026-04-14T12%3A24%3A02.746772Z&ds.end=2026-04-14T12%3A36%3A04.633320Z&layoutId=lay_0e7VD4WIKDQGU73Y&time=2026-04-14T12%3A35%3A47.383303Z) | [[../report_cards/2026/04/Week-3/fme20040--2026-04-14--11-58-50--gen2-av-90560185-3296-43ba-9ec3-6a1693f1514a.md#unpudo 2026-04-14 12:35:47.383 UTC\|card]] |
| `2026-04-14 12:37:44.483 UTC` | `unpudo` | `pass` | `found` | `none observed` | [console](https://console.sso.wayve.ai/run/fme20040/2026-04-14--11-58-50--gen2-av-90560185-3296-43ba-9ec3-6a1693f1514a?id=&time-unixus=1776170264483296) | [foxglove](https://app.foxglove.dev/wayve-on-prem/p/prj_0dX18KZdVHg1fmmI/view?ds=foxglove-stream&ds.deviceName=fme20040&ds.start=2026-04-14T12%3A35%3A57.205452Z&ds.end=2026-04-14T12%3A38%3A18.585696Z&layoutId=lay_0e7VD4WIKDQGU73Y&time=2026-04-14T12%3A37%3A44.483296Z) | [[../report_cards/2026/04/Week-3/fme20040--2026-04-14--11-58-50--gen2-av-90560185-3296-43ba-9ec3-6a1693f1514a.md#unpudo 2026-04-14 12:37:44.483 UTC\|card]] |
| `2026-04-14 12:40:39.683 UTC` | `unparking` | `pass` | `found` | `none observed` | [console](https://console.sso.wayve.ai/run/fme20040/2026-04-14--11-58-50--gen2-av-90560185-3296-43ba-9ec3-6a1693f1514a?id=&time-unixus=1776170439683316) | [foxglove](https://app.foxglove.dev/wayve-on-prem/p/prj_0dX18KZdVHg1fmmI/view?ds=foxglove-stream&ds.deviceName=fme20040&ds.start=2026-04-14T12%3A38%3A29.385681Z&ds.end=2026-04-14T12%3A48%3A15.946245Z&layoutId=lay_0e7VD4WIKDQGU73Y&time=2026-04-14T12%3A40%3A39.683316Z) | [[../report_cards/2026/04/Week-3/fme20040--2026-04-14--11-58-50--gen2-av-90560185-3296-43ba-9ec3-6a1693f1514a.md#unparking 2026-04-14 12:40:39.683 UTC\|card]] |
| `2026-04-14 12:42:34.583 UTC` | `unparking` | `pass` | `found` | `none observed` | [console](https://console.sso.wayve.ai/run/fme20040/2026-04-14--11-58-50--gen2-av-90560185-3296-43ba-9ec3-6a1693f1514a?id=&time-unixus=1776170554583321) | [foxglove](https://app.foxglove.dev/wayve-on-prem/p/prj_0dX18KZdVHg1fmmI/view?ds=foxglove-stream&ds.deviceName=fme20040&ds.start=2026-04-14T12%3A38%3A29.385681Z&ds.end=2026-04-14T12%3A48%3A15.946245Z&layoutId=lay_0e7VD4WIKDQGU73Y&time=2026-04-14T12%3A42%3A34.583321Z) | [[../report_cards/2026/04/Week-3/fme20040--2026-04-14--11-58-50--gen2-av-90560185-3296-43ba-9ec3-6a1693f1514a.md#unparking 2026-04-14 12:42:34.583 UTC\|card]] |
| `2026-04-14 12:44:36.433 UTC` | `unparking` | `pass` | `unclear` | `none observed` | [console](https://console.sso.wayve.ai/run/fme20040/2026-04-14--11-58-50--gen2-av-90560185-3296-43ba-9ec3-6a1693f1514a?id=&time-unixus=1776170676433301) | [foxglove](https://app.foxglove.dev/wayve-on-prem/p/prj_0dX18KZdVHg1fmmI/view?ds=foxglove-stream&ds.deviceName=fme20040&ds.start=2026-04-14T12%3A38%3A29.385681Z&ds.end=2026-04-14T12%3A48%3A15.946245Z&layoutId=lay_0e7VD4WIKDQGU73Y&time=2026-04-14T12%3A44%3A36.433301Z) | [[../report_cards/2026/04/Week-3/fme20040--2026-04-14--11-58-50--gen2-av-90560185-3296-43ba-9ec3-6a1693f1514a.md#unparking 2026-04-14 12:44:36.433 UTC\|card]] |
| `2026-04-14 12:45:50.983 UTC` | `unparking` | `pass` | `unclear` | `none observed` | [console](https://console.sso.wayve.ai/run/fme20040/2026-04-14--11-58-50--gen2-av-90560185-3296-43ba-9ec3-6a1693f1514a?id=&time-unixus=1776170750983321) | [foxglove](https://app.foxglove.dev/wayve-on-prem/p/prj_0dX18KZdVHg1fmmI/view?ds=foxglove-stream&ds.deviceName=fme20040&ds.start=2026-04-14T12%3A38%3A29.385681Z&ds.end=2026-04-14T12%3A48%3A15.946245Z&layoutId=lay_0e7VD4WIKDQGU73Y&time=2026-04-14T12%3A45%3A50.983321Z) | [[../report_cards/2026/04/Week-3/fme20040--2026-04-14--11-58-50--gen2-av-90560185-3296-43ba-9ec3-6a1693f1514a.md#unparking 2026-04-14 12:45:50.983 UTC\|card]] |
| `2026-04-14 12:47:03.183 UTC` | `unparking` | `pass` | `unclear` | `none observed` | [console](https://console.sso.wayve.ai/run/fme20040/2026-04-14--11-58-50--gen2-av-90560185-3296-43ba-9ec3-6a1693f1514a?id=&time-unixus=1776170823183299) | [foxglove](https://app.foxglove.dev/wayve-on-prem/p/prj_0dX18KZdVHg1fmmI/view?ds=foxglove-stream&ds.deviceName=fme20040&ds.start=2026-04-14T12%3A38%3A29.385681Z&ds.end=2026-04-14T12%3A48%3A15.946245Z&layoutId=lay_0e7VD4WIKDQGU73Y&time=2026-04-14T12%3A47%3A03.183299Z) | [[../report_cards/2026/04/Week-3/fme20040--2026-04-14--11-58-50--gen2-av-90560185-3296-43ba-9ec3-6a1693f1514a.md#unparking 2026-04-14 12:47:03.183 UTC\|card]] |
| `2026-04-14 12:48:05.983 UTC` | `unparking` | `accidental` | `unclear` | `parking` | [console](https://console.sso.wayve.ai/run/fme20040/2026-04-14--11-58-50--gen2-av-90560185-3296-43ba-9ec3-6a1693f1514a?id=&time-unixus=1776170885983303) | [foxglove](https://app.foxglove.dev/wayve-on-prem/p/prj_0dX18KZdVHg1fmmI/view?ds=foxglove-stream&ds.deviceName=fme20040&ds.start=2026-04-14T12%3A47%3A46.083290Z&ds.end=2026-04-14T13%3A03%3A19.345968Z&layoutId=lay_0e7VD4WIKDQGU73Y&time=2026-04-14T12%3A48%3A05.983303Z) | [[../report_cards/2026/04/Week-3/fme20040--2026-04-14--11-58-50--gen2-av-90560185-3296-43ba-9ec3-6a1693f1514a.md#unparking 2026-04-14 12:48:05.983 UTC\|card]] |
| `2026-04-14 13:01:38.533 UTC` | `unparking` | `pass` | `found` | `none observed` | [console](https://console.sso.wayve.ai/run/fme20040/2026-04-14--11-58-50--gen2-av-90560185-3296-43ba-9ec3-6a1693f1514a?id=&time-unixus=1776171698533295) | [foxglove](https://app.foxglove.dev/wayve-on-prem/p/prj_0dX18KZdVHg1fmmI/view?ds=foxglove-stream&ds.deviceName=fme20040&ds.start=2026-04-14T12%3A48%3A02.965518Z&ds.end=2026-04-14T13%3A03%3A19.345968Z&layoutId=lay_0e7VD4WIKDQGU73Y&time=2026-04-14T13%3A01%3A38.533295Z) | [[../report_cards/2026/04/Week-3/fme20040--2026-04-14--11-58-50--gen2-av-90560185-3296-43ba-9ec3-6a1693f1514a.md#unparking 2026-04-14 13:01:38.533 UTC\|card]] |
| `2026-04-14 13:08:50.583 UTC` | `unparking` | `fail` | `unclear` | `parking` | [console](https://console.sso.wayve.ai/run/fme20040/2026-04-14--11-58-50--gen2-av-90560185-3296-43ba-9ec3-6a1693f1514a?id=&time-unixus=1776172130583296) | [foxglove](https://app.foxglove.dev/wayve-on-prem/p/prj_0dX18KZdVHg1fmmI/view?ds=foxglove-stream&ds.deviceName=fme20040&ds.start=2026-04-14T13%3A08%3A31.885681Z&ds.end=2026-04-14T13%3A09%3A50.483296Z&layoutId=lay_0e7VD4WIKDQGU73Y&time=2026-04-14T13%3A08%3A50.583296Z) | [[../report_cards/2026/04/Week-3/fme20040--2026-04-14--11-58-50--gen2-av-90560185-3296-43ba-9ec3-6a1693f1514a.md#unparking 2026-04-14 13:08:50.583 UTC\|card]] |
| `2026-04-14 13:11:36.183 UTC` | `unparking` | `fail` | `unclear` | `failed_to_accelerate` | [console](https://console.sso.wayve.ai/run/fme20040/2026-04-14--11-58-50--gen2-av-90560185-3296-43ba-9ec3-6a1693f1514a?id=&time-unixus=1776172296183301) | [foxglove](https://app.foxglove.dev/wayve-on-prem/p/prj_0dX18KZdVHg1fmmI/view?ds=foxglove-stream&ds.deviceName=fme20040&ds.start=2026-04-14T13%3A09%3A32.186716Z&ds.end=2026-04-14T13%3A12%3A42.083292Z&layoutId=lay_0e7VD4WIKDQGU73Y&time=2026-04-14T13%3A11%3A36.183301Z) | [[../report_cards/2026/04/Week-3/fme20040--2026-04-14--11-58-50--gen2-av-90560185-3296-43ba-9ec3-6a1693f1514a.md#unparking 2026-04-14 13:11:36.183 UTC\|card]] |
| `2026-04-14 13:13:20.933 UTC` | `unparking` | `pass` | `unclear` | `none observed` | [console](https://console.sso.wayve.ai/run/fme20040/2026-04-14--11-58-50--gen2-av-90560185-3296-43ba-9ec3-6a1693f1514a?id=&time-unixus=1776172400933300) | [foxglove](https://app.foxglove.dev/wayve-on-prem/p/prj_0dX18KZdVHg1fmmI/view?ds=foxglove-stream&ds.deviceName=fme20040&ds.start=2026-04-14T13%3A12%3A24.146722Z&ds.end=2026-04-14T13%3A13%3A34.983319Z&layoutId=lay_0e7VD4WIKDQGU73Y&time=2026-04-14T13%3A13%3A20.933300Z) | [[../report_cards/2026/04/Week-3/fme20040--2026-04-14--11-58-50--gen2-av-90560185-3296-43ba-9ec3-6a1693f1514a.md#unparking 2026-04-14 13:13:20.933 UTC\|card]] |
| `2026-04-14 13:14:19.683 UTC` | `unparking` | `pass` | `unclear` | `none observed` | [console](https://console.sso.wayve.ai/run/fme20040/2026-04-14--11-58-50--gen2-av-90560185-3296-43ba-9ec3-6a1693f1514a?id=&time-unixus=1776172459683315) | [foxglove](https://app.foxglove.dev/wayve-on-prem/p/prj_0dX18KZdVHg1fmmI/view?ds=foxglove-stream&ds.deviceName=fme20040&ds.start=2026-04-14T13%3A12%3A24.146722Z&ds.end=2026-04-14T13%3A14%3A38.083297Z&layoutId=lay_0e7VD4WIKDQGU73Y&time=2026-04-14T13%3A14%3A19.683315Z) | [[../report_cards/2026/04/Week-3/fme20040--2026-04-14--11-58-50--gen2-av-90560185-3296-43ba-9ec3-6a1693f1514a.md#unparking 2026-04-14 13:14:19.683 UTC\|card]] |
| `2026-04-14 13:15:12.033 UTC` | `unparking` | `pass` | `unclear` | `none observed` | [console](https://console.sso.wayve.ai/run/fme20040/2026-04-14--11-58-50--gen2-av-90560185-3296-43ba-9ec3-6a1693f1514a?id=&time-unixus=1776172512033301) | [foxglove](https://app.foxglove.dev/wayve-on-prem/p/prj_0dX18KZdVHg1fmmI/view?ds=foxglove-stream&ds.deviceName=fme20040&ds.start=2026-04-14T13%3A12%3A24.146722Z&ds.end=2026-04-14T13%3A15%3A27.383313Z&layoutId=lay_0e7VD4WIKDQGU73Y&time=2026-04-14T13%3A15%3A12.033301Z) | [[../report_cards/2026/04/Week-3/fme20040--2026-04-14--11-58-50--gen2-av-90560185-3296-43ba-9ec3-6a1693f1514a.md#unparking 2026-04-14 13:15:12.033 UTC\|card]] |
