# Model Analysis: satisfied-amber-moose

| Field | Value |
|---|---|
| Model | `satisfied-amber-moose` |
| Authors | `guy.geva` |
| Event count | `5` |
| Pass count | `0` |
| Fail count | `5` |
| Scope | `AV-only scoring for the satisfied-amber-moose packet on 2026-04-20` |

## Event Cards

| Date | Event type | Outcome | Run ID | Disengagement | Event card |
|---|---|---|---|---|---|
| 2026-04-20 | `unparking` | fail | `fme10011/2026-04-20--03-53-04--gen2-av-850e5b7c-de73-4684-be82-3d23281dc919` | `none` | [card](../report_cards/2026/04/Week-4/fme10011--2026-04-20--03-53-04--gen2-av-850e5b7c-de73-4684-be82-3d23281dc919.md#unparking-2026-04-20-050148133-utc) |
| 2026-04-20 | `unpudo` | fail | `fme10011/2026-04-20--03-53-04--gen2-av-850e5b7c-de73-4684-be82-3d23281dc919` | `none` | [card](../report_cards/2026/04/Week-4/fme10011--2026-04-20--03-53-04--gen2-av-850e5b7c-de73-4684-be82-3d23281dc919.md#unpudo-2026-04-20-045401633-utc) |
| 2026-04-20 | `unpudo` | fail | `fme10011/2026-04-20--03-53-04--gen2-av-850e5b7c-de73-4684-be82-3d23281dc919` | `none` | [card](../report_cards/2026/04/Week-4/fme10011--2026-04-20--03-53-04--gen2-av-850e5b7c-de73-4684-be82-3d23281dc919.md#unpudo-2026-04-20-045251233-utc) |
| 2026-04-20 | `unpudo` | fail | `fme10011/2026-04-20--03-53-04--gen2-av-850e5b7c-de73-4684-be82-3d23281dc919` | `failed_to_unpudo` | [card](../report_cards/2026/04/Week-4/fme10011--2026-04-20--03-53-04--gen2-av-850e5b7c-de73-4684-be82-3d23281dc919.md#unpudo-2026-04-20-044646583-utc) |
| 2026-04-20 | `unpudo` | fail | `fme10011/2026-04-20--03-53-04--gen2-av-850e5b7c-de73-4684-be82-3d23281dc919` | `failed_to_pudo` | [card](../report_cards/2026/04/Week-4/fme10011--2026-04-20--03-53-04--gen2-av-850e5b7c-de73-4684-be82-3d23281dc919.md#unpudo-2026-04-20-042556633-utc) |

All five packet events fail under the updated AV-only rule because the credited maneuver is outside DBW at the official start. The stopped pre-event segment still yields the expected route reassignment in every case, so the failures are ownership failures rather than missing-route artifacts.
