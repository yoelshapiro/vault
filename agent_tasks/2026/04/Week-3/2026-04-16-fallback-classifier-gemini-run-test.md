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

## 2026-04-16 update: image + temporal clip multimodal query (`-5s/+5s`)

### Code changes
- Extended `manual_gemini_from_run.py` with mode:
  - `image_with_temporal_clip`
- Added centered temporal clip support around query timestamp:
  - `context_seconds_each_side` (default `5.0`), producing ~10s clip
  - clip seek starts at `(timestamp_offset - context_seconds_each_side)`
- Added single Gemini multimodal request path that sends:
  - still image at query timestamp
  - temporal clip around that same timestamp
- Added output keys:
  - `combined_image_path`, `combined_image_camera`
  - `classification_from_image_with_temporal_clip`

### Validation command
```bash
bazel run //wayve/ai/fallback/classifiers/slow_lane_classifier:manual_gemini_from_run -- \
  --run-id fme10010/2026-04-15--19-10-20--gen2-av-cd9496c5-ad6e-4dc5-a227-8d9a06b3e089 \
  --timestamp-unixus 1776280230000000 \
  --mode image_with_temporal_clip \
  --video-camera left-forward \
  --context-seconds-each-side 5 \
  --output-dir /tmp/manual_gemini_fme10010_image_temporal
```

### Validation outcome
- Generated clip:
  - `/tmp/manual_gemini_fme10010_image_temporal/clip_left-forward_1776280230000000.mp4`
  - duration verified: `10.000000` seconds
- Gemini multimodal output:
  - `classification_from_image_with_temporal_clip.label = parking`
  - `confidence = 0.99`
  - key temporal cue indicates the vehicle remained stationary in the clip.

## 2026-04-16 update: relocated standalone utility to parking/classifiers

### Code move
- Moved standalone utility from fallback slow-lane package to parking package:
  - from: `wayve/ai/fallback/classifiers/slow_lane_classifier/manual_gemini_from_run.py`
  - to: `wayve/ai/parking/classifiers/manual_gemini_from_run.py`
- Added new BUILD package:
  - `wayve/ai/parking/classifiers/BUILD`
- Removed temporary target wiring from:
  - `wayve/ai/fallback/classifiers/slow_lane_classifier/BUILD`

### New target
```bash
//wayve/ai/parking/classifiers:manual_gemini_from_run
```

### Validation command
```bash
bazel run //wayve/ai/parking/classifiers:manual_gemini_from_run -- \
  --run-id fme10010/2026-04-15--19-10-20--gen2-av-cd9496c5-ad6e-4dc5-a227-8d9a06b3e089 \
  --timestamp-unixus 1776280230000000 \
  --mode image_with_temporal_clip \
  --video-camera left-forward \
  --context-seconds-each-side 5 \
  --output-dir /tmp/manual_gemini_fme10010_image_temporal_parking_pkg
```

### Validation outcome
- Output JSON:
  - `/tmp/manual_gemini_fme10010_image_temporal_parking_pkg/classification_result.json`
- Clip duration:
  - `10.000000` seconds
- Combined label:
  - `parking` (`confidence=0.95`)

## 2026-04-16 update: exported standalone skill bundle to ParingSkills

### Export location
- `/home/borisindelman/git/ParingSkills/skills/parking-gemini-run-classifier/`

### Exported files
- `manual_gemini_from_run.py` (copied from `wayve/ai/parking/classifiers/`)
- `SKILL.md` (usage, prerequisites, timed command)

### Timing snapshot (end-to-end)
- Timed command: `//wayve/ai/parking/classifiers:manual_gemini_from_run` with `mode=image_with_temporal_clip`.
- Result: `real_seconds=63.00`, `user_seconds=25.71`, `sys_seconds=12.17`, `max_rss_kb=1422416`.

## 2026-04-16 update: exact-timestamp media fetch fix (no run-start fallback)

### Root cause
- Previous path depended on console-style blob directory discovery (`fetch_video_approximate`) and fallback image fetches.
- For run `fme10003/...96f7e596...` at timestamp `1776196459133289`, that path failed with:
  - `No video directory found in []`
  - `cv2_read_failed`

### Fix implemented
- Updated `wayve/ai/parking/classifiers/manual_gemini_from_run.py` for `mode=image_with_temporal_clip` to:
  - fetch clip bytes using `fetch_video_between_timestamps(...)` across `[timestamp-5s, timestamp+5s]`
  - write local MP4 clip from MCAP frame ranges
  - extract midpoint frame from the clip as the still image input
- This avoids the run-start video URL approximation path for this mode.

### Validation on exact user timestamp
Command:
```bash
bazel run //wayve/ai/parking/classifiers:manual_gemini_from_run -- \
  --run-id fme10003/2026-04-14--19-28-09--gen2-av-96f7e596-4cac-4da1-b3b0-a9c02a595444 \
  --timestamp-unixus 1776196459133289 \
  --mode image_with_temporal_clip \
  --video-camera left-forward \
  --context-seconds-each-side 5 \
  --output-dir /tmp/manual_gemini_fme10003_1776196459133289_exact_mcap
```

Outcome:
- Clip: `/tmp/manual_gemini_fme10003_1776196459133289_exact_mcap/clip_left-forward_1776196459133289.mp4`
- Clip duration: `10.000000`
- Image: `/tmp/manual_gemini_fme10003_1776196459133289_exact_mcap/fme10003__2026-04-14--19-28-09--gen2-av-96f7e596-4cac-4da1-b3b0-a9c02a595444_1776196459133289_left-forward_from_clip_mid.png`
- Classification: `driving_other` (`confidence=0.9`)

## 2026-04-16 update: closest-frame fallback within threshold (replacing midpoint fallback)

### Code update
- `image_with_temporal_clip` fallback changed from clip-midpoint image to closest available frame within threshold.
- New CLI arg:
  - `--closest-image-threshold-ms` (default `300`)
- New output metadata:
  - `combined_image_source`
  - `combined_image_timestamp_unixus`
  - `combined_image_delta_ms`
  - `exact_image_available`

### Validation on requested timestamp
Run:
- `run_id`: `fme10003/2026-04-14--19-28-09--gen2-av-96f7e596-4cac-4da1-b3b0-a9c02a595444`
- `timestamp_unixus`: `1776196452713317`
- `closest_image_threshold_ms`: `300`

Result:
- exact frame unavailable at target timestamp
- closest frame selected at `1776196452733293` (`delta_ms=19.976`)
- clip + closest image classification succeeded (`driving_other`, confidence `0.9`)
- output: `/tmp/manual_gemini_fme10003_1776196452713317_exact_mcap_v3/classification_result.json`

## 2026-04-16 update: frame-anchored unparking prompt variant

### Code update
- Added a dedicated `unparking` prompt variant to `wayve/ai/parking/classifiers/manual_gemini_from_run.py` for `mode=image_with_temporal_clip`.
- New CLI arg:
  - `--image-with-clip-prompt-variant general|unparking`
- The `unparking` prompt now explicitly instructs Gemini to:
  - classify the still image timestamp, not a later state in the clip
  - state whether motion occurs `before|at|after|none` relative to the frame in question
  - avoid collapsing “starts moving later” into `driving_other` at the queried frame
- Synced the updated script copy and usage docs into `/home/borisindelman/git/ParingSkills/skills/parking-gemini-run-classifier/`.

### Validation on exact user timestamp
Command:
```bash
bazel run //wayve/ai/parking/classifiers:manual_gemini_from_run -- \
  --run-id fme10003/2026-04-14--19-28-09--gen2-av-96f7e596-4cac-4da1-b3b0-a9c02a595444 \
  --timestamp-unixus 1776196452713317 \
  --mode image_with_temporal_clip \
  --image-with-clip-prompt-variant unparking \
  --video-camera left-forward \
  --context-seconds-each-side 5 \
  --output-dir /tmp/manual_gemini_fme10003_1776196452713317_unparking_prompt
```

Outcome:
- Camera: `left-forward`
- Output: `/tmp/manual_gemini_fme10003_1776196452713317_unparking_prompt/classification_result.json`
- Label changed from `driving_other` to `parking`
- Returned temporal reasoning correctly anchored motion after the frame:
  - `motion_relative_to_frame`: `after`
  - `temporal_timeline`: vehicle stationary before and at the still image, starts moving after
  - `reasoning`: the queried frame was still parked/stationary
