# 2026-06-12 — Parking Research: Doc Rewrite + Interactive HTML

## Task
Boris found the solutions section of [[projects/parking-capability-architecture-research]] too terse — brief sentences without explaining the full implementations. Two asks: (1) make the document readable with Mermaid/pseudo-code explaining how implementations look; (2) build an interactive HTML of the whole work under `html_summaries/`.

## What was done
1. **§8 fully rewritten** in the project doc — every solution now has "What it is / Why this design / How it works" prose, plus:
   - 8 Mermaid diagrams: system-at-a-glance composition, reverse-diagnostic decision tree (8.0.3), PRX propose→rank→execute flow (S1), leg-sequence worked example + two-loop sequence diagram (S2), PMS component diagram (S3), fleet-data-engine flow (S4), abort/recovery state machine (S5), 3DGS gym roles (S6), and a Gantt for §8.9 phasing.
   - 7 Python pseudo-code blocks: `LegCode` dataclass (the unified action vocabulary), `rank()` with listwise debiased loss, `execute()` anchored-truncated denoising, `decode_maneuver()` AR-over-legs, `ParkingMemoryService.tick()`, HER relabeling loop, `choose()` commitment hysteresis.
   - Tables for the dwell-semantics options, S2 data prerequisites, S1 implementation map, not-building-now reasons, and risks-with-mitigations.
2. **Interactive HTML report** at `html_summaries/parking-capability-architecture-research.html` (1,768 lines, self-contained, dark Space Grotesk/IBM Plex Mono house style with amber/teal accent coding): sticky scroll-spy nav, hero, TL;DR solution cards, hover-tooltip SVG of the release model, interactive R1–R6 requirements stepper cross-highlighting the coverage matrix, A1–A4 approach cards + Phase-1 addenda, 7 solution tabs with 10 hand-authored SVG diagrams + all pseudo-code, interactive coverage matrix, phasing timeline, 4-lens critique accordions, filterable 10-risk register, filterable 27-entry literature list. Built by a subagent against the three vault markdown sources; verified (tag balance, nav↔section ids, JS `node --check`). `html_summaries/README.md` updated with the new row.

## Links
- Project doc: [[projects/parking-capability-architecture-research]]
- HTML: `html_summaries/parking-capability-architecture-research.html`
- Prior task notes: [[2026-06-12-parking-capability-research-kickoff]] · [[2026-06-12-parking-capability-research-phases1-3]]
