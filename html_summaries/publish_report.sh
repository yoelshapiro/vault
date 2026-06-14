#!/usr/bin/env bash
# Publish an HTML report (single file OR a folder with index.html) to the Wayve
# SSO report viewer and print a browser link.
#
# Why this exists / how it works:
#   The viewer at *.sso.azr.wayve.ai (app: wayve/ai/semantic_understanding/
#   auto_labeler/reports/app.py) only serves blobs that
#     (1) live under datasets@wayveproddatasetflat/<REPORT_PREFIX>, and
#     (2) end in .html, and
#     (3) are SELF-CONTAINED — its CSP blocks external assets and it 404s any
#         non-.html sibling, so separate .css/.js/.png files do NOT work.
#   Therefore: a single-file report is uploaded as-is; a folder is first
#   INLINED into one self-contained .html (css/js/images folded in) and that is
#   uploaded. The viewer is gated by Wayve OneLogin SSO, so the printed link is
#   viewable in any browser on the network after SSO login (no SAS token).
#
#   NOTE: There is no SSO viewer bound to databricks-users@wayveproddataset, so
#   publishing there yields no browser link. This script targets the viewer store.
#
# Usage:
#   ./publish_report.sh path/to/report.html
#   ./publish_report.sh path/to/site_folder/          # must contain index.html
#   ./publish_report.sh --subdir parking --name my-report path/to/site/
#
# Options:
#   --subdir DIR     grouping folder under <prefix>/<user>/  (default: parking)
#   --name NAME      output html basename (default: file stem, or folder name for a dir)
#   --dry-run        inline + show destination, do not upload
#   -h | --help
#
# Env overrides (default to the auto-labeler report viewer):
#   REPORT_ACCOUNT=wayveproddatasetflat
#   REPORT_CONTAINER=datasets
#   REPORT_PREFIX=materialised/semantic_understanding/reports/auto_labeler
#   REPORT_VIEWER_BASE_URL=https://auto-labeler-reports.sso.azr.wayve.ai
#   AZ=./tools/az   (path to the az CLI; default: az on PATH)

set -euo pipefail

REPORT_ACCOUNT="${REPORT_ACCOUNT:-wayveproddatasetflat}"
REPORT_CONTAINER="${REPORT_CONTAINER:-datasets}"
REPORT_PREFIX="${REPORT_PREFIX:-materialised/semantic_understanding/reports/auto_labeler}"
REPORT_VIEWER_BASE_URL="${REPORT_VIEWER_BASE_URL:-https://auto-labeler-reports.sso.azr.wayve.ai}"
AZ="${AZ:-az}"

SUBDIR="parking"
NAME=""
DRY_RUN=false
INPUT=""

usage() { sed -n '2,40p' "$0"; }

slug() { printf '%s' "$1" | tr '[:upper:]' '[:lower:]' | tr -cs 'a-z0-9._-' '-' | sed 's/^-//; s/-$//'; }

while [[ $# -gt 0 ]]; do
  case "$1" in
    --subdir) SUBDIR="$2"; shift 2 ;;
    --name) NAME="$2"; shift 2 ;;
    --dry-run) DRY_RUN=true; shift ;;
    -h|--help) usage; exit 0 ;;
    -*) echo "Unknown option: $1" >&2; usage >&2; exit 2 ;;
    *) [[ -n "$INPUT" ]] && { echo "Only one input path is supported." >&2; exit 2; }; INPUT="$1"; shift ;;
  esac
done

[[ -z "$INPUT" ]] && { echo "Missing input (an .html file or a folder with index.html)." >&2; usage >&2; exit 2; }
[[ -e "$INPUT" ]] || { echo "Input does not exist: $INPUT" >&2; exit 1; }

# ---- Resolve input to a single self-contained HTML in a temp file ----------
TMP_HTML="$(mktemp --suffix=.html)"
trap 'rm -f "$TMP_HTML"' EXIT

if [[ -d "$INPUT" ]]; then
  SRC_INDEX="${INPUT%/}/index.html"
  [[ -f "$SRC_INDEX" ]] || { echo "Folder has no index.html: $SRC_INDEX" >&2; exit 1; }
  [[ -z "$NAME" ]] && NAME="$(basename "${INPUT%/}")"
  echo "Inlining folder assets into a single self-contained HTML ..."
  python3 - "$SRC_INDEX" "$TMP_HTML" <<'PY'
import base64, mimetypes, os, re, sys
src, out = sys.argv[1], sys.argv[2]
root = os.path.dirname(os.path.abspath(src))
html = open(src, encoding="utf-8", errors="replace").read()

def is_remote(u: str) -> bool:
    return u.strip().lower().startswith(("http://", "https://", "data:", "//", "#", "mailto:"))

def read_local(u: str):
    p = os.path.normpath(os.path.join(root, u.split("?", 1)[0].split("#", 1)[0]))
    if os.path.commonpath([root, p]) != root or not os.path.isfile(p):
        return None
    return p

def datauri(p: str) -> str:
    mt = mimetypes.guess_type(p)[0] or "application/octet-stream"
    return f"data:{mt};base64," + base64.b64encode(open(p, "rb").read()).decode()

def inline_css_urls(css: str, css_dir: str) -> str:
    def repl(m):
        raw = m.group(1).strip().strip("'\"")
        if is_remote(raw):
            return m.group(0)
        p = os.path.normpath(os.path.join(css_dir, raw.split("?",1)[0].split("#",1)[0]))
        if os.path.isfile(p):
            return f"url({datauri(p)})"
        return m.group(0)
    return re.sub(r"url\(([^)]+)\)", repl, css)

warnings = []

# <link rel=stylesheet href=...>  ->  <style>...</style>
def repl_link(m):
    tag = m.group(0)
    if "stylesheet" not in tag.lower():
        return tag
    hm = re.search(r'href\s*=\s*["\']([^"\']+)["\']', tag, re.I)
    if not hm or is_remote(hm.group(1)):
        return tag
    p = read_local(hm.group(1))
    if not p:
        warnings.append(f"missing css: {hm.group(1)}"); return tag
    css = inline_css_urls(open(p, encoding="utf-8", errors="replace").read(), os.path.dirname(p))
    return f"<style>\n{css}\n</style>"
html = re.sub(r"<link\b[^>]*>", repl_link, html, flags=re.I)

# <script src=...></script>  ->  inline
def repl_script(m):
    tag = m.group(0)
    sm = re.search(r'src\s*=\s*["\']([^"\']+)["\']', tag, re.I)
    if not sm or is_remote(sm.group(1)):
        return tag
    p = read_local(sm.group(1))
    if not p:
        warnings.append(f"missing js: {sm.group(1)}"); return tag
    js = open(p, encoding="utf-8", errors="replace").read()
    open_tag = re.sub(r'\ssrc\s*=\s*["\'][^"\']+["\']', "", m.group(1))
    return f"{open_tag}>\n{js}\n</script>"
html = re.sub(r"(<script\b[^>]*)>\s*</script>", repl_script, html, flags=re.I)

# <img src=...> / poster=... / source src=...  ->  data URI
def repl_attr(m):
    pre, url, post = m.group(1), m.group(2), m.group(3)
    if is_remote(url):
        return m.group(0)
    p = read_local(url)
    if not p:
        warnings.append(f"missing asset: {url}"); return m.group(0)
    return f"{pre}{datauri(p)}{post}"
html = re.sub(r'(<(?:img|source|video|audio)\b[^>]*?\s(?:src|poster)\s*=\s*["\'])([^"\']+)(["\'])',
              repl_attr, html, flags=re.I)

# inline <style> blocks: fold their url(...) too
def repl_styleblock(m):
    return f"<style{m.group(1)}>{inline_css_urls(m.group(2), root)}</style>"
html = re.sub(r"<style([^>]*)>(.*?)</style>", repl_styleblock, html, flags=re.I | re.S)

open(out, "w", encoding="utf-8").write(html)
for w in warnings:
    print(f"  WARN: {w}", file=sys.stderr)
print(f"  inlined OK ({len(html)} bytes)", file=sys.stderr)
PY
elif [[ "${INPUT##*.}" == "html" ]]; then
  cp "$INPUT" "$TMP_HTML"
  [[ -z "$NAME" ]] && NAME="$(basename "${INPUT%.html}")"
else
  echo "Input must be a .html file or a folder containing index.html: $INPUT" >&2; exit 1
fi

# ---- Build destination + viewer URL ----------------------------------------
USER_SLUG="$(slug "${USER:-unknown}")"; [[ -z "$USER_SLUG" ]] && USER_SLUG="unknown"
SUBDIR_SLUG="$(slug "$SUBDIR")"
NAME_SLUG="$(slug "$NAME")"; [[ -z "$NAME_SLUG" ]] && NAME_SLUG="report"
PREFIX="${REPORT_PREFIX#/}"; PREFIX="${PREFIX%/}"
BLOB="$PREFIX/$USER_SLUG${SUBDIR_SLUG:+/$SUBDIR_SLUG}/$NAME_SLUG.html"
ABFSS="abfss://$REPORT_CONTAINER@$REPORT_ACCOUNT.dfs.core.windows.net/$BLOB"
BLOB_HTTPS="https://$REPORT_ACCOUNT.blob.core.windows.net/$REPORT_CONTAINER/$BLOB"
VIEWER="${REPORT_VIEWER_BASE_URL%/}/$BLOB"

if [[ "$DRY_RUN" == true ]]; then
  echo "Dry run — would upload to:"; echo "  $ABFSS"
  echo "Viewer URL:"; echo "  $VIEWER"; exit 0
fi

command -v "${AZ%% *}" >/dev/null 2>&1 || { echo "az CLI not found (set AZ=...)." >&2; exit 1; }
$AZ account show >/dev/null 2>&1 || { echo "Not logged in. Run: $AZ login" >&2; exit 1; }

$AZ storage blob upload \
  --account-name "$REPORT_ACCOUNT" --container-name "$REPORT_CONTAINER" \
  --name "$BLOB" --file "$TMP_HTML" \
  --content-type "text/html; charset=utf-8" \
  --overwrite true --auth-mode login --output none

echo "Report published."
echo "Blob:       $ABFSS"
echo "Blob HTTPS: $BLOB_HTTPS"
echo
echo "Viewer URL (open in a browser; sign in via Wayve SSO):"
echo "  $VIEWER"
