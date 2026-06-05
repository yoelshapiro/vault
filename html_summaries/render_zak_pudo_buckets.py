#!/usr/bin/env python3
"""Render the Zak PUDO bucket vault note as a standalone HTML page."""

from __future__ import annotations

import html
import re
from pathlib import Path


ROOT = Path("/home/borisindelman/git/vault")
SOURCE = ROOT / "agent_tasks/2026/06/Week-1/2026-06-05-zak-pudo-bucket-reimplementation-notes.md"
OUTPUT = ROOT / "html_summaries/zak-pudo-buckets.html"


def slugify(text: str) -> str:
    slug = re.sub(r"`([^`]*)`", r"\1", text)
    slug = re.sub(r"[^a-zA-Z0-9]+", "-", slug.lower()).strip("-")
    return slug or "section"


def inline(text: str) -> str:
    placeholders: list[str] = []

    def stash(match: re.Match[str]) -> str:
        placeholders.append(f"<code>{html.escape(match.group(1))}</code>")
        return f"\x00{len(placeholders) - 1}\x00"

    escaped = html.escape(text)
    escaped = re.sub(r"`([^`]*)`", stash, escaped)
    escaped = re.sub(r"\*\*([^*]+)\*\*", r"<strong>\1</strong>", escaped)
    escaped = re.sub(r"\[([^\]]+)\]\(([^)]+)\)", r'<a href="\2">\1</a>', escaped)

    for index, value in enumerate(placeholders):
        escaped = escaped.replace(f"\x00{index}\x00", value)
    return escaped


def table_to_html(lines: list[str]) -> str:
    rows: list[list[str]] = []
    for line in lines:
        cells = [cell.strip() for cell in line.strip().strip("|").split("|")]
        if all(re.fullmatch(r":?-{3,}:?", cell) for cell in cells):
            continue
        rows.append(cells)
    if not rows:
        return ""

    header, *body = rows
    out = ["<div class=\"table-wrap\"><table>"]
    out.append("<thead><tr>" + "".join(f"<th>{inline(cell)}</th>" for cell in header) + "</tr></thead>")
    out.append("<tbody>")
    for row in body:
        out.append("<tr>" + "".join(f"<td>{inline(cell)}</td>" for cell in row) + "</tr>")
    out.append("</tbody></table></div>")
    return "\n".join(out)


def collect_toc(markdown_text: str) -> list[tuple[int, str, str]]:
    toc: list[tuple[int, str, str]] = []
    seen: dict[str, int] = {}
    for line in markdown_text.splitlines():
        match = re.match(r"^(#{2,3})\s+(.+)$", line)
        if not match:
            continue
        level = len(match.group(1))
        title = match.group(2).strip()
        slug = slugify(title)
        count = seen.get(slug, 0)
        seen[slug] = count + 1
        if count:
            slug = f"{slug}-{count + 1}"
        toc.append((level, title, slug))
    return toc


def markdown_to_html(markdown_text: str) -> str:
    lines = markdown_text.splitlines()
    seen: dict[str, int] = {}
    out: list[str] = []
    in_code = False
    code_lang = ""
    code_lines: list[str] = []
    list_type: str | None = None
    paragraph: list[str] = []

    def close_paragraph() -> None:
        if paragraph:
            out.append("<p>" + inline(" ".join(paragraph)) + "</p>")
            paragraph.clear()

    def close_list() -> None:
        nonlocal list_type
        if list_type:
            out.append(f"</{list_type}>")
            list_type = None

    i = 0
    while i < len(lines):
        line = lines[i]

        if in_code:
            if line.startswith("```"):
                language_class = f" language-{html.escape(code_lang)}" if code_lang else ""
                out.append(
                    f'<pre><button class="copy" type="button">Copy</button><code class="{language_class.strip()}">'
                    + html.escape("\n".join(code_lines))
                    + "</code></pre>"
                )
                in_code = False
                code_lang = ""
                code_lines = []
            else:
                code_lines.append(line)
            i += 1
            continue

        if line.startswith("```"):
            close_paragraph()
            close_list()
            in_code = True
            code_lang = line.strip("`").strip()
            i += 1
            continue

        if not line.strip():
            close_paragraph()
            close_list()
            i += 1
            continue

        if line.startswith("|"):
            close_paragraph()
            close_list()
            table_lines = []
            while i < len(lines) and lines[i].startswith("|"):
                table_lines.append(lines[i])
                i += 1
            out.append(table_to_html(table_lines))
            continue

        heading = re.match(r"^(#{1,6})\s+(.+)$", line)
        if heading:
            close_paragraph()
            close_list()
            level = len(heading.group(1))
            title = heading.group(2).strip()
            slug = slugify(title)
            count = seen.get(slug, 0)
            seen[slug] = count + 1
            if count:
                slug = f"{slug}-{count + 1}"
            out.append(f'<h{level} id="{slug}">{inline(title)}</h{level}>')
            i += 1
            continue

        bullet = re.match(r"^-\s+(.+)$", line)
        if bullet:
            close_paragraph()
            if list_type != "ul":
                close_list()
                list_type = "ul"
                out.append("<ul>")
            out.append(f"<li>{inline(bullet.group(1))}</li>")
            i += 1
            continue

        numbered = re.match(r"^\d+\.\s+(.+)$", line)
        if numbered:
            close_paragraph()
            if list_type != "ol":
                close_list()
                list_type = "ol"
                out.append("<ol>")
            out.append(f"<li>{inline(numbered.group(1))}</li>")
            i += 1
            continue

        close_list()
        paragraph.append(line.strip())
        i += 1

    close_paragraph()
    close_list()
    return "\n".join(out)


def render() -> str:
    markdown_text = SOURCE.read_text()
    toc = collect_toc(markdown_text)
    body = markdown_to_html(markdown_text)

    toc_html = "\n".join(
        f'<a class="level-{level}" href="#{slug}">{inline(title)}</a>' for level, title, slug in toc
    )

    return f"""<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Zak PUDO Bucket Reimplementation Notes</title>
  <style>
    :root {{
      --ink: #18211f;
      --muted: #61716d;
      --line: #d7dfdc;
      --paper: #fbfaf6;
      --panel: #ffffff;
      --accent: #0f766e;
      --accent-dark: #124d46;
      --code-bg: #17211f;
      --code-ink: #eaf4ef;
      --warn: #a45b13;
    }}
    * {{ box-sizing: border-box; }}
    html {{ scroll-behavior: smooth; }}
    body {{
      margin: 0;
      background:
        radial-gradient(circle at 18% 10%, rgba(15, 118, 110, .10), transparent 28rem),
        linear-gradient(180deg, #f5f1e7 0, var(--paper) 18rem);
      color: var(--ink);
      font-family: "Aptos", "Segoe UI", sans-serif;
      line-height: 1.62;
    }}
    .shell {{
      display: grid;
      grid-template-columns: minmax(220px, 320px) minmax(0, 980px);
      gap: 2rem;
      width: min(1400px, calc(100% - 48px));
      margin: 0 auto;
      padding: 42px 0 72px;
    }}
    aside {{
      position: sticky;
      top: 24px;
      align-self: start;
      max-height: calc(100vh - 48px);
      overflow: auto;
      border: 1px solid var(--line);
      background: rgba(255, 255, 255, .78);
      backdrop-filter: blur(10px);
      border-radius: 14px;
      padding: 20px;
      box-shadow: 0 12px 40px rgba(32, 45, 41, .08);
    }}
    .eyebrow {{
      margin: 0 0 6px;
      color: var(--accent-dark);
      font-size: 12px;
      font-weight: 800;
      letter-spacing: .08em;
      text-transform: uppercase;
    }}
    aside h2 {{
      margin: 0 0 14px;
      font: 700 22px/1.15 Georgia, serif;
    }}
    nav a {{
      display: block;
      color: var(--muted);
      text-decoration: none;
      border-left: 2px solid transparent;
      padding: 5px 0 5px 10px;
      font-size: 14px;
    }}
    nav a:hover {{
      color: var(--accent-dark);
      border-left-color: var(--accent);
      background: rgba(15, 118, 110, .06);
    }}
    nav .level-3 {{
      padding-left: 24px;
      font-size: 13px;
    }}
    main {{
      min-width: 0;
      background: var(--panel);
      border: 1px solid var(--line);
      border-radius: 18px;
      padding: clamp(24px, 4vw, 56px);
      box-shadow: 0 24px 70px rgba(32, 45, 41, .10);
    }}
    h1 {{
      margin: 0 0 10px;
      color: #111c19;
      font: 800 clamp(34px, 5vw, 58px)/1.02 Georgia, serif;
      max-width: 11ch;
    }}
    h2 {{
      margin: 44px 0 16px;
      padding-top: 8px;
      border-top: 1px solid var(--line);
      color: #142420;
      font: 760 30px/1.15 Georgia, serif;
    }}
    h3 {{
      margin: 34px 0 12px;
      color: var(--accent-dark);
      font-size: 21px;
      line-height: 1.25;
    }}
    h4, h5, h6 {{ margin: 24px 0 8px; }}
    p, li {{ font-size: 16px; }}
    p {{ margin: 0 0 15px; }}
    ul, ol {{ padding-left: 1.35rem; margin: 0 0 18px; }}
    li + li {{ margin-top: 4px; }}
    a {{ color: var(--accent-dark); }}
    code {{
      font-family: "SFMono-Regular", Consolas, "Liberation Mono", monospace;
      font-size: .92em;
      background: #edf3ef;
      color: #173c35;
      padding: .12rem .32rem;
      border-radius: 6px;
    }}
    pre {{
      position: relative;
      overflow: auto;
      margin: 18px 0 24px;
      padding: 20px;
      background: var(--code-bg);
      color: var(--code-ink);
      border-radius: 14px;
      box-shadow: inset 0 0 0 1px rgba(255,255,255,.06);
    }}
    pre code {{
      display: block;
      background: transparent;
      color: inherit;
      padding: 0;
      border-radius: 0;
      font-size: 13px;
      line-height: 1.55;
      white-space: pre;
    }}
    .copy {{
      position: sticky;
      left: calc(100% - 58px);
      top: 0;
      float: right;
      border: 1px solid rgba(255,255,255,.18);
      background: rgba(255,255,255,.08);
      color: #d9eee8;
      border-radius: 8px;
      padding: 5px 9px;
      cursor: pointer;
    }}
    .table-wrap {{
      overflow-x: auto;
      margin: 18px 0 28px;
      border: 1px solid var(--line);
      border-radius: 12px;
    }}
    table {{
      width: 100%;
      border-collapse: collapse;
      font-size: 14px;
      min-width: 640px;
    }}
    th {{
      position: sticky;
      top: 0;
      background: #e9f1ed;
      color: #18342f;
      text-align: left;
      font-weight: 800;
    }}
    th, td {{
      border-bottom: 1px solid var(--line);
      padding: 9px 12px;
      vertical-align: top;
    }}
    tr:nth-child(even) td {{ background: #fbfcfa; }}
    tr:hover td {{ background: #eef7f3; }}
    main > p:first-of-type, main > p:nth-of-type(2) {{
      color: var(--muted);
      font-size: 17px;
    }}
    @media (max-width: 980px) {{
      .shell {{
        display: block;
        width: min(100% - 24px, 980px);
        padding-top: 16px;
      }}
      aside {{
        position: static;
        max-height: none;
        margin-bottom: 16px;
      }}
      main {{ padding: 24px 18px; }}
      h1 {{ max-width: none; }}
    }}
    @media print {{
      body {{ background: white; }}
      .shell {{ display: block; width: auto; padding: 0; }}
      aside {{ display: none; }}
      main {{ border: 0; box-shadow: none; }}
      pre, .table-wrap {{ break-inside: avoid; }}
    }}
  </style>
</head>
<body>
  <div class="shell">
    <aside>
      <p class="eyebrow">Parking / PUDO</p>
      <h2>Zak Buckets</h2>
      <nav>{toc_html}</nav>
    </aside>
    <main>{body}</main>
  </div>
  <script>
    document.querySelectorAll('.copy').forEach((button) => {{
      button.addEventListener('click', async () => {{
        const code = button.parentElement.querySelector('code').innerText;
        await navigator.clipboard.writeText(code);
        const original = button.innerText;
        button.innerText = 'Copied';
        setTimeout(() => button.innerText = original, 900);
      }});
    }});
  </script>
</body>
</html>
"""


if __name__ == "__main__":
    OUTPUT.write_text(render())
    print(OUTPUT)
