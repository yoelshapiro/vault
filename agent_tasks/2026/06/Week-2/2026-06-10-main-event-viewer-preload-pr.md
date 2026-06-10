# 2026-06-10 Main Event Viewer Preload PR

- Branch/worktree: `/workspace/event_viewer_preload_pr` on `codex/event-viewer-browser-preload`.
- Base: `main`.
- PR: #117834.
- Change type: Tool UI/runtime fix.
- Areas: `/workspace/event_viewer_preload_pr/wayve/ai/parking/tools/event_clip_viewer`.

## Changes

- Created a clean worktree from current `origin/main`.
- Removed selected-clip use of the Python `VideoUrlWarmer` thread.
- Reused the existing `Preload next autoplay clips` slider for selected-clip preloading.
- Added browser-side hidden `<video preload="auto" muted playsinline>` elements for nearby selected clips.
- Supports live media-handler URLs, model-catalogue MP4 URLs, and generated blob MP4 URLs.
- Opened draft PR #117834.

## Verification

- `git diff --check -- wayve/ai/parking/tools/event_clip_viewer`
- `python -m py_compile wayve/ai/parking/tools/event_clip_viewer/app.py wayve/ai/parking/tools/event_clip_viewer/components.py`
- `bazel test //wayve/ai/parking/tools/event_clip_viewer:py_checks`
