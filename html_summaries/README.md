# HTML Summaries

Interactive HTML reports served from the vault.

| Summary                  | Path                                                 | Local server             |
| ------------------------ | ---------------------------------------------------- | ------------------------ |
| Parking model comparison | `html_summaries/parking-model-comparison/index.html` | `http://localhost:3005/` |
| Parking/PUDO generic materialisation bucket groups | `html_summaries/parking-pudo-generic-buckets.html` | open file directly |
| Parking capability architecture research | `html_summaries/parking-capability-architecture-research.html` | open file directly · [SSO viewer](https://auto-labeler-reports.sso.azr.wayve.ai/materialised/semantic_understanding/reports/auto_labeler/borisindelman/parking/parking-capability-architecture-research.html) |

## Publishing to a shareable SSO link

`publish_report.sh` uploads a report to the Wayve SSO report viewer and prints a
`*.sso.azr.wayve.ai` link viewable in any browser after Wayve OneLogin SSO (no SAS token).

```bash
# single self-contained .html
AZ=/workspace/WayveCode/tools/az ./publish_report.sh parking-capability-architecture-research.html
# a folder with index.html + assets (assets are inlined into one file first)
AZ=/workspace/WayveCode/tools/az ./publish_report.sh --subdir parking --name my-report path/to/site/
```

Notes:
- Backed by `datasets@wayveproddatasetflat/materialised/semantic_understanding/reports/auto_labeler/<user>/<subdir>/`. The viewer (`wayve/ai/semantic_understanding/auto_labeler/reports/app.py`) only serves `.html` under that prefix, so reports must be self-contained — the script inlines folder CSS/JS/images automatically. Remote `<link>`/`<script>` are left as-is but are blocked by the viewer CSP, so prefer fully self-contained reports.
- `databricks-users@wayveproddataset/parking` has no SSO viewer, so it yields no browser link; use this script's default store instead.

