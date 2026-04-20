# Parking OTF Drop Audit

> Sampled audit: capped at 100 source samples per bucket.

## ca_long_pudo_uk

- Source samples seen: 100
- Output samples yielded: 100
- Dropped samples: 0

### Drop Reasons

- None

### Stages

- None

### Drop Flags

- None

### Example Dropped Samples

- None

## ca_long_pudo_usa

- Source samples seen: 100
- Output samples yielded: 100
- Dropped samples: 0

### Drop Reasons

- None

### Stages

- None

### Drop Flags

- None

### Example Dropped Samples

- None

## ca_long_unparking_uk

- Source samples seen: 100
- Output samples yielded: 100
- Dropped samples: 0

### Drop Reasons

- None

### Stages

- None

### Drop Flags

- None

### Example Dropped Samples

- None

## ca_long_unparking_usa

- Source samples seen: 100
- Output samples yielded: 100
- Dropped samples: 0

### Drop Reasons

- None

### Stages

- None

### Drop Flags

- None

### Example Dropped Samples

- None

## ca_long_unpudo_uk

- Source samples seen: 100
- Output samples yielded: 100
- Dropped samples: 0

### Drop Reasons

- None

### Stages

- None

### Drop Flags

- None

### Example Dropped Samples

- None

## ca_long_unpudo_usa

- Source samples seen: 100
- Output samples yielded: 100
- Dropped samples: 0

### Drop Reasons

- None

### Stages

- None

### Drop Flags

- None

### Example Dropped Samples

- None

## ca_short_pudo_uk

- Source samples seen: 100
- Output samples yielded: 84
- Dropped samples: 16

### Drop Reasons

- `parking_strip_leading_standstill_failed`: 16

### Stages

- `insert_parking_data:strip_leading_standstill`: 16

### Drop Flags

- `_parking_related_early=True`: 16
- `_parking_allow_short_path=True`: 16
- `short_path_clamp_active=True`: 16
- `filter_bad_paths_path_pose_mismatch`: 0
- `path_requested_distance_out_of_range` with `short_path_clamp_active=False`: 0

### Example Dropped Samples

- `fme20018/2026-03-09--06-57-12--gen2-av-c30f58da-e767-42d1-b6d8-7a261c91f56e` @ `1773041519883308` via `insert_parking_data:strip_leading_standstill` -> `parking_strip_leading_standstill_failed`
- `fme20018/2026-03-09--06-57-12--gen2-av-c30f58da-e767-42d1-b6d8-7a261c91f56e` @ `1773041519983309` via `insert_parking_data:strip_leading_standstill` -> `parking_strip_leading_standstill_failed`
- `fme20018/2026-03-09--06-57-12--gen2-av-c30f58da-e767-42d1-b6d8-7a261c91f56e` @ `1773041520033318` via `insert_parking_data:strip_leading_standstill` -> `parking_strip_leading_standstill_failed`
- `fme20018/2026-03-09--06-57-12--gen2-av-c30f58da-e767-42d1-b6d8-7a261c91f56e` @ `1773041520083304` via `insert_parking_data:strip_leading_standstill` -> `parking_strip_leading_standstill_failed`
- `fme20018/2026-03-09--06-57-12--gen2-av-c30f58da-e767-42d1-b6d8-7a261c91f56e` @ `1773041520183305` via `insert_parking_data:strip_leading_standstill` -> `parking_strip_leading_standstill_failed`
- `fme20018/2026-03-09--06-57-12--gen2-av-c30f58da-e767-42d1-b6d8-7a261c91f56e` @ `1773041520433307` via `insert_parking_data:strip_leading_standstill` -> `parking_strip_leading_standstill_failed`
- `fme20018/2026-03-09--06-57-12--gen2-av-c30f58da-e767-42d1-b6d8-7a261c91f56e` @ `1773041520483306` via `insert_parking_data:strip_leading_standstill` -> `parking_strip_leading_standstill_failed`
- `fme20018/2026-03-09--06-57-12--gen2-av-c30f58da-e767-42d1-b6d8-7a261c91f56e` @ `1773041520583307` via `insert_parking_data:strip_leading_standstill` -> `parking_strip_leading_standstill_failed`
- `fme20018/2026-03-09--06-57-12--gen2-av-c30f58da-e767-42d1-b6d8-7a261c91f56e` @ `1773041520733310` via `insert_parking_data:strip_leading_standstill` -> `parking_strip_leading_standstill_failed`
- `fme20018/2026-03-09--06-57-12--gen2-av-c30f58da-e767-42d1-b6d8-7a261c91f56e` @ `1773041520783308` via `insert_parking_data:strip_leading_standstill` -> `parking_strip_leading_standstill_failed`

## ca_short_pudo_usa

- Source samples seen: 100
- Output samples yielded: 100
- Dropped samples: 0

### Drop Reasons

- None

### Stages

- None

### Drop Flags

- None

### Example Dropped Samples

- None

## ca_short_unparking_uk

- Source samples seen: 100
- Output samples yielded: 80
- Dropped samples: 20

### Drop Reasons

- `filter_bad_paths_path_pose_mismatch`: 20

### Stages

- `filter_bad_paths`: 20

### Drop Flags

- `_parking_related_early=True`: 0
- `_parking_allow_short_path=True`: 20
- `short_path_clamp_active=True`: 20
- `filter_bad_paths_path_pose_mismatch`: 20
- `path_requested_distance_out_of_range` with `short_path_clamp_active=False`: 0

### Example Dropped Samples

- `colorado/2025-09-02--14-01-26--gen2-av-fc896330-3d5e-41be-9c12-fc53447ecc12` @ `1756821873733310` via `filter_bad_paths` -> `filter_bad_paths_path_pose_mismatch`
- `colorado/2025-09-02--14-01-26--gen2-av-fc896330-3d5e-41be-9c12-fc53447ecc12` @ `1756821873783310` via `filter_bad_paths` -> `filter_bad_paths_path_pose_mismatch`
- `colorado/2025-09-02--14-01-26--gen2-av-fc896330-3d5e-41be-9c12-fc53447ecc12` @ `1756821873833311` via `filter_bad_paths` -> `filter_bad_paths_path_pose_mismatch`
- `colorado/2025-09-02--14-01-26--gen2-av-fc896330-3d5e-41be-9c12-fc53447ecc12` @ `1756821873883313` via `filter_bad_paths` -> `filter_bad_paths_path_pose_mismatch`
- `colorado/2025-09-02--14-01-26--gen2-av-fc896330-3d5e-41be-9c12-fc53447ecc12` @ `1756821873933312` via `filter_bad_paths` -> `filter_bad_paths_path_pose_mismatch`
- `colorado/2025-09-02--14-01-26--gen2-av-fc896330-3d5e-41be-9c12-fc53447ecc12` @ `1756821873983314` via `filter_bad_paths` -> `filter_bad_paths_path_pose_mismatch`
- `colorado/2025-09-02--14-01-26--gen2-av-fc896330-3d5e-41be-9c12-fc53447ecc12` @ `1756821874033316` via `filter_bad_paths` -> `filter_bad_paths_path_pose_mismatch`
- `colorado/2025-09-02--14-01-26--gen2-av-fc896330-3d5e-41be-9c12-fc53447ecc12` @ `1756821874083306` via `filter_bad_paths` -> `filter_bad_paths_path_pose_mismatch`
- `colorado/2025-09-02--14-01-26--gen2-av-fc896330-3d5e-41be-9c12-fc53447ecc12` @ `1756821874133306` via `filter_bad_paths` -> `filter_bad_paths_path_pose_mismatch`
- `colorado/2025-09-02--14-01-26--gen2-av-fc896330-3d5e-41be-9c12-fc53447ecc12` @ `1756821874183307` via `filter_bad_paths` -> `filter_bad_paths_path_pose_mismatch`

## ca_short_unparking_usa

- Source samples seen: 100
- Output samples yielded: 78
- Dropped samples: 22

### Drop Reasons

- `filter_bad_paths_path_pose_mismatch`: 22

### Stages

- `filter_bad_paths`: 22

### Drop Flags

- `_parking_related_early=True`: 0
- `_parking_allow_short_path=True`: 22
- `short_path_clamp_active=True`: 22
- `filter_bad_paths_path_pose_mismatch`: 22
- `path_requested_distance_out_of_range` with `short_path_clamp_active=False`: 0

### Example Dropped Samples

- `fme10000/2025-11-21--14-42-52--gen2-av-0d64a74e-fae4-488d-a589-b64449a9d427` @ `1763737971483311` via `filter_bad_paths` -> `filter_bad_paths_path_pose_mismatch`
- `fme10000/2025-11-21--14-42-52--gen2-av-0d64a74e-fae4-488d-a589-b64449a9d427` @ `1763737971833315` via `filter_bad_paths` -> `filter_bad_paths_path_pose_mismatch`
- `fme10000/2025-11-21--14-42-52--gen2-av-0d64a74e-fae4-488d-a589-b64449a9d427` @ `1763737972283308` via `filter_bad_paths` -> `filter_bad_paths_path_pose_mismatch`
- `fme10000/2025-11-21--14-42-52--gen2-av-0d64a74e-fae4-488d-a589-b64449a9d427` @ `1763737972333310` via `filter_bad_paths` -> `filter_bad_paths_path_pose_mismatch`
- `fme10000/2025-11-21--14-42-52--gen2-av-0d64a74e-fae4-488d-a589-b64449a9d427` @ `1763737972383311` via `filter_bad_paths` -> `filter_bad_paths_path_pose_mismatch`
- `fme10000/2025-11-21--14-42-52--gen2-av-0d64a74e-fae4-488d-a589-b64449a9d427` @ `1763738243933330` via `filter_bad_paths` -> `filter_bad_paths_path_pose_mismatch`
- `fme10000/2025-11-21--14-42-52--gen2-av-0d64a74e-fae4-488d-a589-b64449a9d427` @ `1763738243983316` via `filter_bad_paths` -> `filter_bad_paths_path_pose_mismatch`
- `fme10000/2025-11-21--14-42-52--gen2-av-0d64a74e-fae4-488d-a589-b64449a9d427` @ `1763738244133308` via `filter_bad_paths` -> `filter_bad_paths_path_pose_mismatch`
- `fme10000/2025-11-21--14-42-52--gen2-av-0d64a74e-fae4-488d-a589-b64449a9d427` @ `1763738244183308` via `filter_bad_paths` -> `filter_bad_paths_path_pose_mismatch`
- `fme10000/2025-11-21--14-42-52--gen2-av-0d64a74e-fae4-488d-a589-b64449a9d427` @ `1763738244233308` via `filter_bad_paths` -> `filter_bad_paths_path_pose_mismatch`

## ca_short_unpudo_uk

- Source samples seen: 100
- Output samples yielded: 100
- Dropped samples: 0

### Drop Reasons

- None

### Stages

- None

### Drop Flags

- None

### Example Dropped Samples

- None

## ca_short_unpudo_usa

- Source samples seen: 100
- Output samples yielded: 93
- Dropped samples: 7

### Drop Reasons

- `filter_bad_paths_path_pose_mismatch`: 7

### Stages

- `filter_bad_paths`: 7

### Drop Flags

- `_parking_related_early=True`: 0
- `_parking_allow_short_path=True`: 7
- `short_path_clamp_active=True`: 7
- `filter_bad_paths_path_pose_mismatch`: 7
- `path_requested_distance_out_of_range` with `short_path_clamp_active=False`: 0

### Example Dropped Samples

- `fme10002/2025-12-29--03-43-47--gen2-av-4efec57c-e471-4cd2-8ca8-ca4f35b5a2ec` @ `1766980551683313` via `filter_bad_paths` -> `filter_bad_paths_path_pose_mismatch`
- `fme10002/2025-12-29--03-43-47--gen2-av-4efec57c-e471-4cd2-8ca8-ca4f35b5a2ec` @ `1766980551733319` via `filter_bad_paths` -> `filter_bad_paths_path_pose_mismatch`
- `fme10002/2025-12-29--03-43-47--gen2-av-4efec57c-e471-4cd2-8ca8-ca4f35b5a2ec` @ `1766980551783314` via `filter_bad_paths` -> `filter_bad_paths_path_pose_mismatch`
- `fme10002/2025-12-29--03-43-47--gen2-av-4efec57c-e471-4cd2-8ca8-ca4f35b5a2ec` @ `1766980551833312` via `filter_bad_paths` -> `filter_bad_paths_path_pose_mismatch`
- `fme10002/2025-12-29--03-43-47--gen2-av-4efec57c-e471-4cd2-8ca8-ca4f35b5a2ec` @ `1766980551883316` via `filter_bad_paths` -> `filter_bad_paths_path_pose_mismatch`
- `fme10002/2025-12-29--03-43-47--gen2-av-4efec57c-e471-4cd2-8ca8-ca4f35b5a2ec` @ `1766980551933314` via `filter_bad_paths` -> `filter_bad_paths_path_pose_mismatch`
- `fme10002/2025-12-29--03-43-47--gen2-av-4efec57c-e471-4cd2-8ca8-ca4f35b5a2ec` @ `1766980551983315` via `filter_bad_paths` -> `filter_bad_paths_path_pose_mismatch`

## dc_pudo_uk

- Source samples seen: 100
- Output samples yielded: 35
- Dropped samples: 65

### Drop Reasons

- `path_requested_distance_out_of_range`: 65

### Stages

- `load_paths`: 65

### Drop Flags

- `_parking_related_early=True`: 0
- `_parking_allow_short_path=True`: 65
- `short_path_clamp_active=True`: 65
- `filter_bad_paths_path_pose_mismatch`: 0
- `path_requested_distance_out_of_range` with `short_path_clamp_active=False`: 0

### Example Dropped Samples

- `colorado/2025-12-02--13-40-22--gen2-av-1c45d814-e154-461d-98b1-a6e30a20adaf` @ `1764686554983314` via `load_paths` -> `path_requested_distance_out_of_range`
- `colorado/2025-12-02--13-40-22--gen2-av-1c45d814-e154-461d-98b1-a6e30a20adaf` @ `1764686555083308` via `load_paths` -> `path_requested_distance_out_of_range`
- `colorado/2025-12-02--13-40-22--gen2-av-1c45d814-e154-461d-98b1-a6e30a20adaf` @ `1764686556033320` via `load_paths` -> `path_requested_distance_out_of_range`
- `colorado/2025-12-02--13-40-22--gen2-av-1c45d814-e154-461d-98b1-a6e30a20adaf` @ `1764686556133308` via `load_paths` -> `path_requested_distance_out_of_range`
- `colorado/2025-12-02--13-40-22--gen2-av-1c45d814-e154-461d-98b1-a6e30a20adaf` @ `1764686556933315` via `load_paths` -> `path_requested_distance_out_of_range`
- `colorado/2025-12-02--13-40-22--gen2-av-1c45d814-e154-461d-98b1-a6e30a20adaf` @ `1764686556983316` via `load_paths` -> `path_requested_distance_out_of_range`
- `colorado/2025-12-02--13-40-22--gen2-av-1c45d814-e154-461d-98b1-a6e30a20adaf` @ `1764686557233310` via `load_paths` -> `path_requested_distance_out_of_range`
- `colorado/2025-12-02--13-40-22--gen2-av-1c45d814-e154-461d-98b1-a6e30a20adaf` @ `1764686558083307` via `load_paths` -> `path_requested_distance_out_of_range`
- `colorado/2025-12-02--13-40-22--gen2-av-1c45d814-e154-461d-98b1-a6e30a20adaf` @ `1764686558983314` via `load_paths` -> `path_requested_distance_out_of_range`
- `colorado/2025-12-02--13-40-22--gen2-av-1c45d814-e154-461d-98b1-a6e30a20adaf` @ `1764686559133308` via `load_paths` -> `path_requested_distance_out_of_range`

## dc_pudo_usa

- Source samples seen: 100
- Output samples yielded: 87
- Dropped samples: 13

### Drop Reasons

- None

### Stages

- None

### Drop Flags

- None

### Example Dropped Samples

- None

## dc_unparking_uk

- Source samples seen: 100
- Output samples yielded: 61
- Dropped samples: 39

### Drop Reasons

- `path_requested_distance_out_of_range`: 22
- `load_frame_data_exception`: 16
- `filter_bad_paths_path_pose_mismatch`: 1

### Stages

- `load_paths`: 22
- `load_frame_data`: 16
- `filter_bad_paths`: 1

### Drop Flags

- `_parking_related_early=True`: 0
- `_parking_allow_short_path=True`: 23
- `short_path_clamp_active=True`: 23
- `filter_bad_paths_path_pose_mismatch`: 1
- `path_requested_distance_out_of_range` with `short_path_clamp_active=False`: 0

### Example Dropped Samples

- `colorado/2025-08-08--06-24-06--gen2-av-08b396f7-0b46-4688-8275-befe5a741c53` @ `1754638526883313` via `load_frame_data` -> `load_frame_data_exception`
- `colorado/2025-08-08--09-17-25--gen2-av-17f4edb9-aaa5-486c-8239-000fd410b811` @ `1754645684333310` via `load_frame_data` -> `load_frame_data_exception`
- `colorado/2025-08-08--09-17-25--gen2-av-17f4edb9-aaa5-486c-8239-000fd410b811` @ `1754645684383310` via `load_frame_data` -> `load_frame_data_exception`
- `colorado/2025-08-08--09-17-25--gen2-av-17f4edb9-aaa5-486c-8239-000fd410b811` @ `1754645685333310` via `load_frame_data` -> `load_frame_data_exception`
- `colorado/2025-08-08--09-17-25--gen2-av-17f4edb9-aaa5-486c-8239-000fd410b811` @ `1754645691233308` via `load_frame_data` -> `load_frame_data_exception`
- `colorado/2025-08-08--09-46-25--gen2-av-8dd383be-aaeb-4022-8c11-453237e5d1a8` @ `1754647301433309` via `filter_bad_paths` -> `filter_bad_paths_path_pose_mismatch`
- `colorado/2025-08-08--09-46-25--gen2-av-8dd383be-aaeb-4022-8c11-453237e5d1a8` @ `1754648607633312` via `load_paths` -> `path_requested_distance_out_of_range`
- `colorado/2025-08-08--09-46-25--gen2-av-8dd383be-aaeb-4022-8c11-453237e5d1a8` @ `1754648607683313` via `load_paths` -> `path_requested_distance_out_of_range`
- `colorado/2025-08-08--09-46-25--gen2-av-8dd383be-aaeb-4022-8c11-453237e5d1a8` @ `1754648607733313` via `load_paths` -> `path_requested_distance_out_of_range`
- `colorado/2025-08-08--09-46-25--gen2-av-8dd383be-aaeb-4022-8c11-453237e5d1a8` @ `1754648608533312` via `load_paths` -> `path_requested_distance_out_of_range`

## dc_unparking_usa

- Source samples seen: 100
- Output samples yielded: 94
- Dropped samples: 6

### Drop Reasons

- `filter_bad_paths_path_pose_mismatch`: 6

### Stages

- `filter_bad_paths`: 6

### Drop Flags

- `_parking_related_early=True`: 0
- `_parking_allow_short_path=True`: 6
- `short_path_clamp_active=True`: 6
- `filter_bad_paths_path_pose_mismatch`: 6
- `path_requested_distance_out_of_range` with `short_path_clamp_active=False`: 0

### Example Dropped Samples

- `fme10000/2025-08-07--01-03-20--gen2-av-a0d664c2-12ab-4c1c-beab-904da05b92f7` @ `1754529933883316` via `filter_bad_paths` -> `filter_bad_paths_path_pose_mismatch`
- `fme10000/2025-08-07--01-03-20--gen2-av-a0d664c2-12ab-4c1c-beab-904da05b92f7` @ `1754529933933317` via `filter_bad_paths` -> `filter_bad_paths_path_pose_mismatch`
- `fme10000/2025-08-07--06-05-09--gen2-dc-37294293-e8bf-44c3-ab2a-a8ef776bf3f3` @ `1754546740683316` via `filter_bad_paths` -> `filter_bad_paths_path_pose_mismatch`
- `fme10000/2025-08-09--03-33-37--gen2-av-ac5f4a0f-3266-44cf-bb69-490f1698c944` @ `1754714846333311` via `filter_bad_paths` -> `filter_bad_paths_path_pose_mismatch`
- `fme10000/2025-08-09--03-33-37--gen2-av-ac5f4a0f-3266-44cf-bb69-490f1698c944` @ `1754714846483313` via `filter_bad_paths` -> `filter_bad_paths_path_pose_mismatch`
- `fme10000/2025-08-09--03-33-37--gen2-av-ac5f4a0f-3266-44cf-bb69-490f1698c944` @ `1754714847433312` via `filter_bad_paths` -> `filter_bad_paths_path_pose_mismatch`

## dc_unpudo_uk

- Source samples seen: 100
- Output samples yielded: 99
- Dropped samples: 1

### Drop Reasons

- `filter_bad_paths_path_pose_mismatch`: 1

### Stages

- `filter_bad_paths`: 1

### Drop Flags

- `_parking_related_early=True`: 0
- `_parking_allow_short_path=True`: 1
- `short_path_clamp_active=True`: 1
- `filter_bad_paths_path_pose_mismatch`: 1
- `path_requested_distance_out_of_range` with `short_path_clamp_active=False`: 0

### Example Dropped Samples

- `colorado/2025-12-11--10-04-10--gen2-av-131b8f1b-6c6f-4ccc-86c0-cab161e97477` @ `1765447989733308` via `filter_bad_paths` -> `filter_bad_paths_path_pose_mismatch`

## dc_unpudo_usa

- Source samples seen: 100
- Output samples yielded: 89
- Dropped samples: 11

### Drop Reasons

- `filter_bad_paths_path_pose_mismatch`: 3

### Stages

- `filter_bad_paths`: 3

### Drop Flags

- `_parking_related_early=True`: 0
- `_parking_allow_short_path=True`: 3
- `short_path_clamp_active=True`: 3
- `filter_bad_paths_path_pose_mismatch`: 3
- `path_requested_distance_out_of_range` with `short_path_clamp_active=False`: 0

### Example Dropped Samples

- `fme10000/2025-12-17--16-04-22--gen2-dc-f9103556-cd6e-4c50-8e80-bd9998e12538` @ `1765987530883315` via `filter_bad_paths` -> `filter_bad_paths_path_pose_mismatch`
- `fme10000/2025-12-17--16-04-22--gen2-dc-f9103556-cd6e-4c50-8e80-bd9998e12538` @ `1765987535333310` via `filter_bad_paths` -> `filter_bad_paths_path_pose_mismatch`
- `fme10000/2026-01-04--19-21-19--gen2-av-9dbfffda-87ce-4693-b65d-55caeb8a5a45` @ `1767554708283307` via `filter_bad_paths` -> `filter_bad_paths_path_pose_mismatch`

## pre_ca_pudo_uk

- Source samples seen: 100
- Output samples yielded: 84
- Dropped samples: 16

### Drop Reasons

- None

### Stages

- None

### Drop Flags

- None

### Example Dropped Samples

- None

## pre_ca_pudo_usa

- Source samples seen: 100
- Output samples yielded: 100
- Dropped samples: 0

### Drop Reasons

- None

### Stages

- None

### Drop Flags

- None

### Example Dropped Samples

- None

## pre_ca_unparking_uk

- Source samples seen: 100
- Output samples yielded: 54
- Dropped samples: 46

### Drop Reasons

- `filter_bad_paths_path_pose_mismatch`: 46

### Stages

- `filter_bad_paths`: 46

### Drop Flags

- `_parking_related_early=True`: 0
- `_parking_allow_short_path=True`: 46
- `short_path_clamp_active=True`: 46
- `filter_bad_paths_path_pose_mismatch`: 46
- `path_requested_distance_out_of_range` with `short_path_clamp_active=False`: 0

### Example Dropped Samples

- `colorado/2025-09-02--14-01-26--gen2-av-fc896330-3d5e-41be-9c12-fc53447ecc12` @ `1756821872533308` via `filter_bad_paths` -> `filter_bad_paths_path_pose_mismatch`
- `colorado/2025-09-02--14-01-26--gen2-av-fc896330-3d5e-41be-9c12-fc53447ecc12` @ `1756821872583310` via `filter_bad_paths` -> `filter_bad_paths_path_pose_mismatch`
- `colorado/2025-09-02--14-01-26--gen2-av-fc896330-3d5e-41be-9c12-fc53447ecc12` @ `1756821872633310` via `filter_bad_paths` -> `filter_bad_paths_path_pose_mismatch`
- `colorado/2025-09-02--14-01-26--gen2-av-fc896330-3d5e-41be-9c12-fc53447ecc12` @ `1756821872683311` via `filter_bad_paths` -> `filter_bad_paths_path_pose_mismatch`
- `colorado/2025-09-02--14-01-26--gen2-av-fc896330-3d5e-41be-9c12-fc53447ecc12` @ `1756821872733311` via `filter_bad_paths` -> `filter_bad_paths_path_pose_mismatch`
- `colorado/2025-09-02--14-01-26--gen2-av-fc896330-3d5e-41be-9c12-fc53447ecc12` @ `1756821872783310` via `filter_bad_paths` -> `filter_bad_paths_path_pose_mismatch`
- `colorado/2025-09-02--14-01-26--gen2-av-fc896330-3d5e-41be-9c12-fc53447ecc12` @ `1756821872833311` via `filter_bad_paths` -> `filter_bad_paths_path_pose_mismatch`
- `colorado/2025-09-02--14-01-26--gen2-av-fc896330-3d5e-41be-9c12-fc53447ecc12` @ `1756821872883312` via `filter_bad_paths` -> `filter_bad_paths_path_pose_mismatch`
- `colorado/2025-09-02--14-01-26--gen2-av-fc896330-3d5e-41be-9c12-fc53447ecc12` @ `1756821872933312` via `filter_bad_paths` -> `filter_bad_paths_path_pose_mismatch`
- `colorado/2025-09-02--14-01-26--gen2-av-fc896330-3d5e-41be-9c12-fc53447ecc12` @ `1756821872983313` via `filter_bad_paths` -> `filter_bad_paths_path_pose_mismatch`

## pre_ca_unparking_usa

- Source samples seen: 100
- Output samples yielded: 83
- Dropped samples: 17

### Drop Reasons

- `filter_bad_paths_path_pose_mismatch`: 16

### Stages

- `filter_bad_paths`: 16

### Drop Flags

- `_parking_related_early=True`: 0
- `_parking_allow_short_path=True`: 16
- `short_path_clamp_active=True`: 16
- `filter_bad_paths_path_pose_mismatch`: 16
- `path_requested_distance_out_of_range` with `short_path_clamp_active=False`: 0

### Example Dropped Samples

- `fme10000/2025-11-21--14-42-52--gen2-av-0d64a74e-fae4-488d-a589-b64449a9d427` @ `1763737970933321` via `filter_bad_paths` -> `filter_bad_paths_path_pose_mismatch`
- `fme10000/2025-11-21--14-42-52--gen2-av-0d64a74e-fae4-488d-a589-b64449a9d427` @ `1763737971183308` via `filter_bad_paths` -> `filter_bad_paths_path_pose_mismatch`
- `fme10000/2025-11-21--14-42-52--gen2-av-0d64a74e-fae4-488d-a589-b64449a9d427` @ `1763738243233310` via `filter_bad_paths` -> `filter_bad_paths_path_pose_mismatch`
- `fme10000/2025-11-21--14-42-52--gen2-av-0d64a74e-fae4-488d-a589-b64449a9d427` @ `1763738243433311` via `filter_bad_paths` -> `filter_bad_paths_path_pose_mismatch`
- `fme10000/2025-11-21--14-42-52--gen2-av-0d64a74e-fae4-488d-a589-b64449a9d427` @ `1763738243483311` via `filter_bad_paths` -> `filter_bad_paths_path_pose_mismatch`
- `fme10000/2025-11-21--14-42-52--gen2-av-0d64a74e-fae4-488d-a589-b64449a9d427` @ `1763738243633315` via `filter_bad_paths` -> `filter_bad_paths_path_pose_mismatch`
- `fme10000/2025-11-21--14-42-52--gen2-av-0d64a74e-fae4-488d-a589-b64449a9d427` @ `1763738243683313` via `filter_bad_paths` -> `filter_bad_paths_path_pose_mismatch`
- `fme10000/2025-11-21--14-42-52--gen2-av-0d64a74e-fae4-488d-a589-b64449a9d427` @ `1763738243733313` via `filter_bad_paths` -> `filter_bad_paths_path_pose_mismatch`
- `fme10000/2025-11-21--14-42-52--gen2-av-0d64a74e-fae4-488d-a589-b64449a9d427` @ `1763738243833316` via `filter_bad_paths` -> `filter_bad_paths_path_pose_mismatch`
- `fme10000/2025-11-22--14-30-29--gen2-av-c2d30b1d-aa85-4f70-8a3e-088aeda46779` @ `1763824416683313` via `filter_bad_paths` -> `filter_bad_paths_path_pose_mismatch`

## pre_ca_unpudo_uk

- Source samples seen: 100
- Output samples yielded: 100
- Dropped samples: 0

### Drop Reasons

- None

### Stages

- None

### Drop Flags

- None

### Example Dropped Samples

- None

## pre_ca_unpudo_usa

- Source samples seen: 100
- Output samples yielded: 79
- Dropped samples: 21

### Drop Reasons

- `filter_bad_paths_path_pose_mismatch`: 21

### Stages

- `filter_bad_paths`: 21

### Drop Flags

- `_parking_related_early=True`: 0
- `_parking_allow_short_path=True`: 21
- `short_path_clamp_active=True`: 21
- `filter_bad_paths_path_pose_mismatch`: 21
- `path_requested_distance_out_of_range` with `short_path_clamp_active=False`: 0

### Example Dropped Samples

- `fme10002/2025-12-29--03-43-47--gen2-av-4efec57c-e471-4cd2-8ca8-ca4f35b5a2ec` @ `1766980550533310` via `filter_bad_paths` -> `filter_bad_paths_path_pose_mismatch`
- `fme10002/2025-12-29--03-43-47--gen2-av-4efec57c-e471-4cd2-8ca8-ca4f35b5a2ec` @ `1766980550583312` via `filter_bad_paths` -> `filter_bad_paths_path_pose_mismatch`
- `fme10002/2025-12-29--03-43-47--gen2-av-4efec57c-e471-4cd2-8ca8-ca4f35b5a2ec` @ `1766980550633311` via `filter_bad_paths` -> `filter_bad_paths_path_pose_mismatch`
- `fme10002/2025-12-29--03-43-47--gen2-av-4efec57c-e471-4cd2-8ca8-ca4f35b5a2ec` @ `1766980550683314` via `filter_bad_paths` -> `filter_bad_paths_path_pose_mismatch`
- `fme10002/2025-12-29--03-43-47--gen2-av-4efec57c-e471-4cd2-8ca8-ca4f35b5a2ec` @ `1766980550733316` via `filter_bad_paths` -> `filter_bad_paths_path_pose_mismatch`
- `fme10002/2025-12-29--03-43-47--gen2-av-4efec57c-e471-4cd2-8ca8-ca4f35b5a2ec` @ `1766980550783313` via `filter_bad_paths` -> `filter_bad_paths_path_pose_mismatch`
- `fme10002/2025-12-29--03-43-47--gen2-av-4efec57c-e471-4cd2-8ca8-ca4f35b5a2ec` @ `1766980550833313` via `filter_bad_paths` -> `filter_bad_paths_path_pose_mismatch`
- `fme10002/2025-12-29--03-43-47--gen2-av-4efec57c-e471-4cd2-8ca8-ca4f35b5a2ec` @ `1766980550883314` via `filter_bad_paths` -> `filter_bad_paths_path_pose_mismatch`
- `fme10002/2025-12-29--03-43-47--gen2-av-4efec57c-e471-4cd2-8ca8-ca4f35b5a2ec` @ `1766980550933319` via `filter_bad_paths` -> `filter_bad_paths_path_pose_mismatch`
- `fme10002/2025-12-29--03-43-47--gen2-av-4efec57c-e471-4cd2-8ca8-ca4f35b5a2ec` @ `1766980550983315` via `filter_bad_paths` -> `filter_bad_paths_path_pose_mismatch`
