---
title: Code - Data Materialisation and Parking
type: source
owner: Boris Indelman
created: 2026-05-23
updated: 2026-05-23
status: active
tags:
  - llm-wiki
  - code
  - data
  - parking
source_type: code
source_ref: /workspace/WayveCode/wayve/ai/si/materialisation and parking datamodule/configs
---

# Code - Data Materialisation and Parking

## Source Metadata

- Source type: local code and README in `/workspace/WayveCode`.
- Retrieved: 2026-05-23.
- Inspected paths:
  - `/workspace/WayveCode/wayve/ai/si/materialisation/README.md`
  - `/workspace/WayveCode/wayve/ai/si/datamodules/otf.py`
  - `/workspace/WayveCode/wayve/ai/si/datamodules/parking.py`
  - `/workspace/WayveCode/wayve/ai/si/configs/parking/parking_config.py`
  - `/workspace/WayveCode/wayve/ai/zoo/st/input_adaptors/stopping_mode.py`
  - `/workspace/WayveCode/wayve/ai/zoo/st/input_adaptors/parking_mode.py`
  - `/workspace/WayveCode/wayve/ai/zoo/st/input_adaptors/gear_direction.py`

## Why This Matters

Parking and pull-over work depends on the exact semantics of data buckets, parking labels, gear reconstruction, stopping intent, route context, and training mix. This source summary backs the wiki's data and parking implementation pages.

## Key Facts

- SI materialisation selects training data points, pulls data for run IDs, applies filters, generates buckets, combines/shuffles, and writes parquet files partitioned by `dataset_split` and `dataset_bucket`.
- New bucket work generally means adding bucket logic, testing run IDs/filter behavior, adding bucket configs, testing local Flyte, running remote Flyte, and inspecting bucket stats.
- `OtfDrivingDataModule` performs on-the-fly loading from Azure Blob and has broad support for cameras, routes, maps, radar, lidar, navigation instructions, parking config, gear direction, intervention data, and many inserted data keys.
- `ParkingDataConfig` controls parking label generation and augmentation, including zoo-loader delegation, gear reconstruction, lookahead/past windows, distance/time thresholds, goal dropout, parked/unparking probabilities, stopping mode, leading-standstill stripping, and standstill gear augmentation.
- `_compute_parking_mode` detects parking entry and reverse-out unparking around long neutral/park segments. A code comment says forward unparking is deliberately not detected today because forward gear can be normal driving.
- `_reconstruct_gear_from_speed` derives drive/reverse from signed speed, preserves long P/N segments, fills unknown standstill regions, and errors if all gear states are unknown.
- `set_stopping_mode` currently uses `1=PUDO`, `2=PARK`, and `0=UNAVAILABLE reserved`. If parking mode is false, it randomizes PUDO/PARK to avoid making normal driving depend on the conditioning signal. If parking mode is true, hazard indicator means PUDO and no hazard means PARK.
- `StoppingModeSTAdaptor` enforces values in `{0, 1, 2}`, uses 0 as dropout/unavailable, and embeds PUDO/PARK as learned values.
- `ParkingModeSTAdaptor` embeds boolean parking mode. `GearDirectionSTAdaptor` embeds gear direction values with dropout handling.
- Parking release configs add parking/PUDO-specific inputs and outputs such as `gear_direction`, `parking_mode`, `stopping_mode`, and a gear-direction output head, depending on mode.

## Workflow Knowledge

Source-backed SI materialisation command shape:

```bash
bazel run //wayve/ai/si/materialisation:workflow -- remote run materialise_dataset_workflow ...
```

Parking example from the materialisation README:

```bash
bazel run //wayve/ai/si/materialisation:workflow -- remote run materialise_dataset_workflow --bucket_group parking_buckets_bc --vehicle_platforms partner_mb,gen2,ipace ...
```

When reviewing a parking config, check three layers together:

- Materialised root and bucket group.
- Datamodule group weights and `ParkingDataConfig`.
- Model input/output flags and losses.

## Affected Wiki Pages

- [[llm_wiki/systems/data-and-materialisation|Data and materialisation]]
- [[llm_wiki/systems/parking-data-and-labels|Parking data and labels]]
- [[llm_wiki/systems/parking-model-architecture|Parking model architecture]]
- [[llm_wiki/workflows/parking-development-workflow|Parking development workflow]]

## Contradictions or Changes

- Older vault newsletter text used a legacy stopping-mode enum. Current code should be treated as authoritative: `0=UNAVAILABLE`, `1=PUDO`, `2=PARK`.
- `ParkingDataConfig.use_zoo_dataloader=True` delegates to a simpler zoo insertion path, so not every SI augmentation path is necessarily active for every config. Check the config before assuming all parking insert logic is used.
- Some parking config comments and group weights appear worth rechecking against the actual numeric mix before using them in release notes.

## Open Questions

- Which materialised root is authoritative for the next parking/PUDO release candidate?
- Which path should own forward unparking detection if it becomes required?
- Should stopping-mode labels move from hazard-only proxy to destination/trip-aware labels?
