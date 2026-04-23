# Model Analysis: harlequin-excited-greyhound

| Field | Value |
|---|---|
| Model | `harlequin-excited-greyhound` |
| Authors | `boris.indelman` |
| Runs covered | `1` |
| Event count | `17` |
| Pass count | `12` |
| Fail count | `5` |
| Route-change found | `8` |
| Route-change not found | `0` |
| Route-change unclear | `9` |
| Top effective failure types | `parking` x4, `failed_to_accelerate` x1 |

## Analysis Summary

### Comparison Snapshot

| Metric | Value |
|---|---|
| Runs covered | `1` |
| Overall success rate | `70.6% (12/17)` |
| `unpudo` success rate | `60.0% (3/5)` |
| `unparking` success rate | `75.0% (9/12)` |
| Ownership / handover failures | `0.0% (0/5)` |
| Short AV-attempt failures | `0.0% (0/5)` |
| Successful events with no driver accel help | `100.0% (12/12)` |
| Successful events with route change found | `50.0% (6/12)` |
| Successful gear alignment at anchor | `100.0% (12/12)` |

### Failure Profile

- Failures make up `29.4% (5/17)` of the analyzed events. The dominant effective failure types are `parking` 80.0% (4/5), `failed_to_accelerate` 20.0% (1/5).
- Ownership loss and handover breakage are the main theme: `0` of `5` failures fall into `not_av_owned`, `completed_outside_av`, `driver_completed_maneuver`, or `interrupted_handover`.
- Route-change evidence inside failed events is `found` in `2`, `not found` in `0`, and `unclear` in `3` cases.
- Source disengagement labels inside failed events are `parking` 80.0% (4/5), `failed_to_accelerate` 20.0% (1/5); anything else is failing from DBW / ownership / gear evidence rather than an explicit source disengagement label.
- Event-type split: `unparking` is stronger than `unpudo` in this sample: 75.0% (9/12) versus 60.0% (3/5).

### Success Behavior

- Successful events are distributed as `3` `unpudo` and `9` `unparking`.
- On successful attempts, route change is recovered in `6` of `12` cases and driver accelerator help is absent in `12` of `12` cases.
- Gear state stays aligned at the anchor in `12` of `12` comparable passes. Planned-indicator alignment is `25.0% (3/12)`, and controller-indicator alignment is `25.0% (3/12)`.
- Typical successful timing is median `AV -> event start` `196.54s`, median `AV -> first motion` `196.74s`, and median AV-owned duration `566.56s`.
- Typical successful maneuver shape: common actual gear at the anchor is `DRIVE_POSITION_V2_DRIVE`, common actual indicator is `INDICATORS_STATE_V2_OFF`, and median max AV speed is `7.52 m/s`.

### Coverage Note

- This card currently reflects only `17` analyzed events across `1` runs, so the rates above are directional and may shift materially as more packets are refreshed.

## Event Cards

| Date | Event type | Outcome | Route change | Run ID | Disengagement | Event card |
|---|---|---|---|---|---|---|
| 2026-04-14 | `unpudo` | `pass` | `found` | `fme20040/2026-04-14--11-58-50--gen2-av-90560185-3296-43ba-9ec3-6a1693f1514a` | `none observed` | [[../report_cards/2026/04/Week-3/fme20040--2026-04-14--11-58-50--gen2-av-90560185-3296-43ba-9ec3-6a1693f1514a.md#unpudo 2026-04-14 12:21:47.383 UTC\|card]] |
| 2026-04-14 | `unpudo` | `fail` | `found` | `fme20040/2026-04-14--11-58-50--gen2-av-90560185-3296-43ba-9ec3-6a1693f1514a` | `parking` | [[../report_cards/2026/04/Week-3/fme20040--2026-04-14--11-58-50--gen2-av-90560185-3296-43ba-9ec3-6a1693f1514a.md#unpudo 2026-04-14 12:24:05.283 UTC\|card]] |
| 2026-04-14 | `unpudo` | `pass` | `found` | `fme20040/2026-04-14--11-58-50--gen2-av-90560185-3296-43ba-9ec3-6a1693f1514a` | `none observed` | [[../report_cards/2026/04/Week-3/fme20040--2026-04-14--11-58-50--gen2-av-90560185-3296-43ba-9ec3-6a1693f1514a.md#unpudo 2026-04-14 12:29:04.383 UTC\|card]] |
| 2026-04-14 | `unpudo` | `fail` | `found` | `fme20040/2026-04-14--11-58-50--gen2-av-90560185-3296-43ba-9ec3-6a1693f1514a` | `parking` | [[../report_cards/2026/04/Week-3/fme20040--2026-04-14--11-58-50--gen2-av-90560185-3296-43ba-9ec3-6a1693f1514a.md#unpudo 2026-04-14 12:35:47.383 UTC\|card]] |
| 2026-04-14 | `unpudo` | `pass` | `found` | `fme20040/2026-04-14--11-58-50--gen2-av-90560185-3296-43ba-9ec3-6a1693f1514a` | `none observed` | [[../report_cards/2026/04/Week-3/fme20040--2026-04-14--11-58-50--gen2-av-90560185-3296-43ba-9ec3-6a1693f1514a.md#unpudo 2026-04-14 12:37:44.483 UTC\|card]] |
| 2026-04-14 | `unparking` | `pass` | `found` | `fme20040/2026-04-14--11-58-50--gen2-av-90560185-3296-43ba-9ec3-6a1693f1514a` | `none observed` | [[../report_cards/2026/04/Week-3/fme20040--2026-04-14--11-58-50--gen2-av-90560185-3296-43ba-9ec3-6a1693f1514a.md#unparking 2026-04-14 12:40:39.683 UTC\|card]] |
| 2026-04-14 | `unparking` | `pass` | `found` | `fme20040/2026-04-14--11-58-50--gen2-av-90560185-3296-43ba-9ec3-6a1693f1514a` | `none observed` | [[../report_cards/2026/04/Week-3/fme20040--2026-04-14--11-58-50--gen2-av-90560185-3296-43ba-9ec3-6a1693f1514a.md#unparking 2026-04-14 12:42:34.583 UTC\|card]] |
| 2026-04-14 | `unparking` | `pass` | `unclear` | `fme20040/2026-04-14--11-58-50--gen2-av-90560185-3296-43ba-9ec3-6a1693f1514a` | `none observed` | [[../report_cards/2026/04/Week-3/fme20040--2026-04-14--11-58-50--gen2-av-90560185-3296-43ba-9ec3-6a1693f1514a.md#unparking 2026-04-14 12:44:36.433 UTC\|card]] |
| 2026-04-14 | `unparking` | `pass` | `unclear` | `fme20040/2026-04-14--11-58-50--gen2-av-90560185-3296-43ba-9ec3-6a1693f1514a` | `none observed` | [[../report_cards/2026/04/Week-3/fme20040--2026-04-14--11-58-50--gen2-av-90560185-3296-43ba-9ec3-6a1693f1514a.md#unparking 2026-04-14 12:45:50.983 UTC\|card]] |
| 2026-04-14 | `unparking` | `pass` | `unclear` | `fme20040/2026-04-14--11-58-50--gen2-av-90560185-3296-43ba-9ec3-6a1693f1514a` | `none observed` | [[../report_cards/2026/04/Week-3/fme20040--2026-04-14--11-58-50--gen2-av-90560185-3296-43ba-9ec3-6a1693f1514a.md#unparking 2026-04-14 12:47:03.183 UTC\|card]] |
| 2026-04-14 | `unparking` | `fail` | `unclear` | `fme20040/2026-04-14--11-58-50--gen2-av-90560185-3296-43ba-9ec3-6a1693f1514a` | `parking` | [[../report_cards/2026/04/Week-3/fme20040--2026-04-14--11-58-50--gen2-av-90560185-3296-43ba-9ec3-6a1693f1514a.md#unparking 2026-04-14 12:48:05.983 UTC\|card]] |
| 2026-04-14 | `unparking` | `pass` | `found` | `fme20040/2026-04-14--11-58-50--gen2-av-90560185-3296-43ba-9ec3-6a1693f1514a` | `none observed` | [[../report_cards/2026/04/Week-3/fme20040--2026-04-14--11-58-50--gen2-av-90560185-3296-43ba-9ec3-6a1693f1514a.md#unparking 2026-04-14 13:01:38.533 UTC\|card]] |
| 2026-04-14 | `unparking` | `fail` | `unclear` | `fme20040/2026-04-14--11-58-50--gen2-av-90560185-3296-43ba-9ec3-6a1693f1514a` | `parking` | [[../report_cards/2026/04/Week-3/fme20040--2026-04-14--11-58-50--gen2-av-90560185-3296-43ba-9ec3-6a1693f1514a.md#unparking 2026-04-14 13:08:50.583 UTC\|card]] |
| 2026-04-14 | `unparking` | `fail` | `unclear` | `fme20040/2026-04-14--11-58-50--gen2-av-90560185-3296-43ba-9ec3-6a1693f1514a` | `failed_to_accelerate` | [[../report_cards/2026/04/Week-3/fme20040--2026-04-14--11-58-50--gen2-av-90560185-3296-43ba-9ec3-6a1693f1514a.md#unparking 2026-04-14 13:11:36.183 UTC\|card]] |
| 2026-04-14 | `unparking` | `pass` | `unclear` | `fme20040/2026-04-14--11-58-50--gen2-av-90560185-3296-43ba-9ec3-6a1693f1514a` | `none observed` | [[../report_cards/2026/04/Week-3/fme20040--2026-04-14--11-58-50--gen2-av-90560185-3296-43ba-9ec3-6a1693f1514a.md#unparking 2026-04-14 13:13:20.933 UTC\|card]] |
| 2026-04-14 | `unparking` | `pass` | `unclear` | `fme20040/2026-04-14--11-58-50--gen2-av-90560185-3296-43ba-9ec3-6a1693f1514a` | `none observed` | [[../report_cards/2026/04/Week-3/fme20040--2026-04-14--11-58-50--gen2-av-90560185-3296-43ba-9ec3-6a1693f1514a.md#unparking 2026-04-14 13:14:19.683 UTC\|card]] |
| 2026-04-14 | `unparking` | `pass` | `unclear` | `fme20040/2026-04-14--11-58-50--gen2-av-90560185-3296-43ba-9ec3-6a1693f1514a` | `none observed` | [[../report_cards/2026/04/Week-3/fme20040--2026-04-14--11-58-50--gen2-av-90560185-3296-43ba-9ec3-6a1693f1514a.md#unparking 2026-04-14 13:15:12.033 UTC\|card]] |
