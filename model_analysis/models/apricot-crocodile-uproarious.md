# Model Analysis: apricot-crocodile-uproarious

| Field | Value |
|---|---|
| Model | `apricot-crocodile-uproarious` |
| Authors | `guy.geva` |
| Event count | `5` |
| Pass count | `0` |
| Fail count | `5` |
| Scope | `AV-only scoring for the apricot-crocodile-uproarious packet on 2026-04-19` |

## Event Cards

| Date | Event type | Outcome | Run ID | Disengagement | Event card |
|---|---|---|---|---|---|
| 2026-04-19 | `unpudo` | fail | `fme10003/2026-04-19--19-01-24--gen2-av-d03ace5e-a7f3-4575-b52f-a52764f5c68b` | `failed_to_unpudo` | [card](../report_cards/2026/04/Week-3/fme10003--2026-04-19--19-01-24--gen2-av-d03ace5e-a7f3-4575-b52f-a52764f5c68b.md#unpudo-2026-04-19-193627733-utc) |
| 2026-04-19 | `unpudo` | fail | `fme10003/2026-04-19--19-01-24--gen2-av-d03ace5e-a7f3-4575-b52f-a52764f5c68b` | `none` | [card](../report_cards/2026/04/Week-3/fme10003--2026-04-19--19-01-24--gen2-av-d03ace5e-a7f3-4575-b52f-a52764f5c68b.md#unpudo-2026-04-19-193956033-utc) |
| 2026-04-19 | `unpudo` | fail | `fme10003/2026-04-19--19-01-24--gen2-av-d03ace5e-a7f3-4575-b52f-a52764f5c68b` | `failed_to_unpudo` | [card](../report_cards/2026/04/Week-3/fme10003--2026-04-19--19-01-24--gen2-av-d03ace5e-a7f3-4575-b52f-a52764f5c68b.md#unpudo-2026-04-19-194815533-utc) |
| 2026-04-19 | `unpudo` | fail | `fme10003/2026-04-19--19-01-24--gen2-av-d03ace5e-a7f3-4575-b52f-a52764f5c68b` | `failed_to_accelerate` | [card](../report_cards/2026/04/Week-3/fme10003--2026-04-19--19-01-24--gen2-av-d03ace5e-a7f3-4575-b52f-a52764f5c68b.md#unpudo-2026-04-19-195329683-utc) |
| 2026-04-19 | `unparking` | fail | `fme10003/2026-04-19--19-01-24--gen2-av-d03ace5e-a7f3-4575-b52f-a52764f5c68b` | `none` | [card](../report_cards/2026/04/Week-3/fme10003--2026-04-19--19-01-24--gen2-av-d03ace5e-a7f3-4575-b52f-a52764f5c68b.md#unparking-2026-04-19-195428383-utc) |

All five packet events fail under the AV-only rule. The stopped pre-event route search was not recovered in any of the five segments, and each credited maneuver starts outside DBW ownership or never recovers an analyzable AV-owned end.
