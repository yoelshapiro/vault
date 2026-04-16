# 2026-04-16 — Fallback classifier Gemini run test (repo-native)

## Context
User wanted Gemini image classification to reuse existing tooling under:
- `wayve/ai/fallback/classifiers`

Target run:
- `fme10010/2026-04-15--19-10-20--gen2-av-cd9496c5-ad6e-4dc5-a227-8d9a06b3e089`

## Changes made
- Added a repo-native utility:
  - `wayve/ai/fallback/classifiers/slow_lane_classifier/manual_gemini_from_run.py`
- Added Bazel targets:
  - `manual_gemini_from_run_lib`
  - `manual_gemini_from_run`
- Updated py_checks deps in:
  - `wayve/ai/fallback/classifiers/slow_lane_classifier/BUILD`

## What the utility does
- Reuses `fetch_camera_images(...)` from `auto_labeler/load_images.py`
- Enables existing `use_approximated_fallback=True` path to recover images when Databricks auth is unavailable
- Sends fetched images to Gemini (`gemini-2.0-flash`) with a JSON-output classification prompt

## Execution
Command run:
```bash
bazel run //wayve/ai/fallback/classifiers/slow_lane_classifier:manual_gemini_from_run -- \
  --run-id fme10010/2026-04-15--19-10-20--gen2-av-cd9496c5-ad6e-4dc5-a227-8d9a06b3e089 \
  --output-dir /tmp/manual_gemini_fme10010
```

Additional test run:
```bash
bazel run //wayve/ai/fallback/classifiers/slow_lane_classifier:manual_gemini_from_run -- \
  --run-id fme10010/2026-04-15--19-10-20--gen2-av-cd9496c5-ad6e-4dc5-a227-8d9a06b3e089 \
  --timestamp-unixus 1776280230000000 \
  --output-dir /tmp/manual_gemini_fme10010_t10
```

## Results
- Databricks U2M auth still unavailable in this shell (`get_session_without_pat` fails, then SP env vars missing)
- Existing console-video fallback recovered side-camera images (`left-forward`, `right-forward`)
- `front-forward` image was unavailable for both tested timestamps
- Gemini call succeeded and returned:
  - `label: parking`
  - `confidence: 0.95`

Saved outputs:
- `/tmp/manual_gemini_fme10010/classification_result.json`
- `/tmp/manual_gemini_fme10010_t10/classification_result.json`

## Notes
- This path now provides a direct, repo-local way to classify by run ID without needing external Gemini CLI wrappers.
- If needed, prompt/model can be overridden via CLI flags in this new utility.

## 2026-04-16 update: video clip classification support

### Code changes
- Extended `manual_gemini_from_run.py` to support:
  - `mode`: `images`, `video`, or `both`
  - 5-second MP4 clip generation from run video stream
  - Gemini classification from video (`video/mp4`) in addition to image inputs
- Added build dependency updates for new video path imports.

### Validation command
```bash
bazel run //wayve/ai/fallback/classifiers/slow_lane_classifier:manual_gemini_from_run -- \
  --run-id fme10010/2026-04-15--19-10-20--gen2-av-cd9496c5-ad6e-4dc5-a227-8d9a06b3e089 \
  --timestamp-unixus 1776280230000000 \
  --mode both \
  --video-camera left-forward \
  --video-duration-seconds 5 \
  --output-dir /tmp/manual_gemini_fme10010_both
```

### Validation outcome
- Generated clip:
  - `/tmp/manual_gemini_fme10010_both/clip_left-forward_1776280230000000.mp4`
  - duration verified: `5.000000` seconds
- Classification outputs:
  - `classification_from_images.label = parking` (`confidence=0.95`)
  - `classification_from_video.label = parking` (`confidence=0.99`)
