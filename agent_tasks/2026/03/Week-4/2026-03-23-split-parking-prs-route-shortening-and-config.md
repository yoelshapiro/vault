# Split parking work into 2 PRs

## Goal
Create two small PRs from `parking/training/pudo`:
1. route shortening logic
2. parking config updates

## Output

### PR 1 (route shortening)
- Branch: `boris/03-23-park-route-shortening-v2`
- Commit: `a8679b3939c`
- PR: https://github.com/wayveai/WayveCode/pull/102690
- Files:
  - `wayve/ai/lib/data/pipes/routes.py`
  - `wayve/ai/lib/test/data/pipes/test_generate_route_map.py`
  - `wayve/ai/si/datamodules/otf.py`
  - `wayve/ai/zoo/data/keys.py`
  - `wayve/ai/zoo/data/parking.py`
  - `wayve/ai/zoo/data/test/test_parking.py`

### PR 2 (parking config updates)
- Branch: `boris/03-23-parking-config-updates-v2`
- Commit: `b742f75dcce`
- PR: https://github.com/wayveai/WayveCode/pull/102691
- Files:
  - `wayve/ai/si/configs/parking/parking_config.py`

## Notes
- Both branches were created from latest `origin/main` and populated using targeted file-level checkout from `parking/training/pudo`.
- No local tests were run during this split.
