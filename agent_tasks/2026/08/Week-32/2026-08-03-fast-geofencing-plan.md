# Fast Country-Aware Geofencing Plan

## Goal

Implement `yoel/fast_geofencing` so callers that know an ISO 3166-1 alpha-3
country code can evaluate only that country's geofences. Preserve the existing
flat geofence API and behavior for callers that do not provide a country.

Relevant implementation files:

- `wayve/services/data/pipelines/geofences.py`
- `wayve/services/data/lakehouse/transforms/common/geofilters.py`

Likely test/build files:

- `wayve/services/data/pipelines/test/test_geofences.py` (new)
- `wayve/services/data/pipelines/BUILD`
- `wayve/services/data/lakehouse/transforms/common/test/test_geofilters.py`

## Current state

- `custom_polygons` is one flat mapping from geofence name to coordinate lists.
- `geofences_to_polygons()` resolves names only through that flat mapping.
- Spark and pandas geofilters require an explicit iterable of geofence names or
  Shapely polygons and evaluate every selected polygon.
- Existing callers depend on the current positional argument order, the flat
  `custom_polygons` export, empty-list behavior, and arbitrary Shapely polygon
  support.
- There are no applicable ADRs or nested `AGENTS.md` rules for these paths.

## Proposed API contract

Treat `country_iso_code` as a scalar ISO-3 string such as `GBR`, `USA`, `DEU`,
or `JPN`. Country selection happens before the pandas UDF is constructed, so
the UDF captures and checks a smaller polygon collection.

| Country | Names/polygons | Behavior |
| --- | --- | --- |
| omitted | provided | Preserve current behavior exactly. |
| provided | `None` | Use every registered geofence for that country. |
| provided | provided | Use the explicit selection to narrow the country's defaults further. |
| omitted | `None` | Raise `ValueError`; an unbounded global search must be explicit. |

Additional semantics:

- Distinguish `None` from an explicit empty iterable. An empty iterable continues
  to match no points.
- Reject unsupported country codes with a useful error listing supported codes.
- Validate requested geofence names against `custom_polygons` first so typos
  still fail. When a valid name belongs to another country, remove it when
  intersecting with the requested country.
- Keep existing positional parameters in place and append
  `country_iso_code: str | None = None` to avoid breaking callers.
- For `is_in_any_polygon`, `country_iso_code` supplies the registered country
  polygons when `polygons is None`. If explicit arbitrary Shapely polygons are
  supplied, they are already the narrower caller-owned set; do not silently
  discard them by attempting coordinate equality against the registry.

## Country-indexed source of truth

In `geofences.py`, add
`custom_polygons_by_country: dict[str, dict[str, list[list]]]` while retaining
`custom_polygons` as the backward-compatible flat mapping.

Build the nested values from the existing flat mapping and explicit per-country
name tuples, rather than duplicating polygon coordinates. The initial grouping
is:

- `GBR`: all Cambridge/London geofences, Millbrook, Horiba MIRA, and the London
  lane-following/generalisation/test zones.
- `USA`: Sunnyvale, Mountain View, Bay Area, and San Francisco.
- `DEU`: Leonberg, Immendingen, Segula Technologies, TEA Test Event Area, and
  Central Stuttgart.
- `JPN`: Yokohama, Central Tokyo, TRC office, and both Tokyo Prince Hotel
  geofences.

Use `CountryCode` values (or the existing canonical country constants) rather
than ad-hoc spellings, and add the corresponding Bazel dependency if needed.

## Implementation steps

1. **Add and validate the country registry**
   - Define explicit immutable name groups per country next to the current
     geofence constants.
   - Construct `custom_polygons_by_country` by looking each name up in
     `custom_polygons`, preserving the current coordinate objects and flat API.
   - Keep the map free of an `unknown` bucket: unknown/null country data cannot
     safely select a country-specific polygon set.

2. **Centralize selection resolution in `geofilters.py`**
   - Add a small private resolver that handles the optionality matrix above.
   - For named geofences, resolve the chosen names with the existing
     `geofences_to_polygons()` helper.
   - For polygon calls with `polygons is None`, resolve all names from
     `custom_polygons_by_country[country_iso_code]` and convert them with the
     same helper.
   - Materialize iterables once so generators are not consumed by validation
     and then unexpectedly empty during execution.

3. **Expose the fast path without breaking callers**
   - Extend `is_in_any_geofence()` and `is_in_any_polygon()` with the trailing
     optional `country_iso_code` parameter.
   - Extend the pandas equivalents if country-default selection is intended on
     both execution paths; keep Spark and pandas resolution semantics identical.
   - Keep `geofence_polygons()` as a compatibility wrapper and forward the new
     option if it is exposed there.
   - Update docstrings with the ISO-3 requirement, the optionality rules, and
     examples for country-only and country-plus-name selection.

4. **Add exact registry parity coverage**
   - Add a unit test that flattens `custom_polygons_by_country` and asserts it is
     exactly equal to `custom_polygons` (same names and polygon coordinates).
   - Also assert the sum of the nested mapping sizes equals the flat mapping
     size. This prevents a duplicated name in two countries from being hidden
     by flattening.
   - This test is the guardrail for every future geofence addition: a new flat
     geofence must be assigned to exactly one country.

5. **Cover selection and compatibility behavior**
   - Country only: `GBR` includes a London point without passing names.
   - Country plus names: a smaller UK subset returns the same result as the
     current explicit-name path.
   - Mixed-country names plus `GBR`: valid US names are excluded from the
     selected set.
   - No country plus explicit names/polygons: existing tests remain unchanged.
   - Neither country nor selection: raises `ValueError`.
   - Explicit empty selection: returns an all-false mask.
   - Unsupported country and unknown geofence name: fail clearly.
   - Arbitrary explicit Shapely polygons remain supported even when a country
     argument is present.

6. **Verify the optimization structurally and run focused tests**
   - Add a non-timing assertion (or mock the NumPy predicate) showing the
     country-only path passes only that country's polygons into the UDF.
     Avoid a flaky wall-clock performance test.
   - Use `bazel query` to resolve the generated `py_checks` test labels, then
     run the focused pipelines and common-geofilters Bazel tests.
   - Run formatting, lint, and type checks generated by those same `py_checks`
     targets.

## Scope boundaries

- Do not remove or change the meaning of `custom_polygons`; it has callers in
  validation, visualization, bucketing, and conversion tools.
- Do not modify the newer sampling predicate AST/PyArrow path in the first
  change unless a concrete caller needs the new parameter there. That is a
  separate public API and serialization change.
- Do not add a timing benchmark to presubmit. The optimization should be
  demonstrated by the reduced polygon collection and protected by deterministic
  tests.

## Acceptance criteria

- Existing geofence callers and tests pass unchanged when no country is given.
- A caller can pass `country_iso_code` with `None` for names/polygons and search
  all registered geofences in that country.
- An explicit selection plus country searches only the requested country-local
  subset.
- `custom_polygons_by_country` contains every flat geofence exactly once and no
  extras, enforced by a unit test.
- The pandas UDF receives fewer polygons on the country-aware path, providing
  the intended speedup without changing point-in-polygon semantics.

## Implementation-time check

Approved on 2026-08-03: callers will pass a scalar country value for each
job/partition. A Spark country column containing multiple countries in one
DataFrame remains out of scope.

## Implementation result

Implemented on branch `yoel/fast_geofencing` in worktree
`/tmp/WayveCode-yoel-fast_geofencing`.

- Added `custom_polygons_by_country` for `GBR`, `USA`, `DEU`, and `JPN`, built
  from the existing flat polygon objects.
- Added the scalar `country_iso_code` fast path to Spark and pandas geofence and
  polygon filters while preserving existing positional calls.
- Enforced that names/polygons may be `None` only when a country is supplied;
  explicit empty selections continue to match nothing.
- Added exact flat/nested parity and duplicate-assignment coverage.
- Added tests for country defaults, country-plus-name narrowing, arbitrary
  explicit polygons, invalid country/name handling, and Spark forwarding.

### Verification

- Pipelines unit, Ruff, Flake8, and type targets passed.
- Common geofilter Ruff, Flake8, and type targets passed.
- All 63 common tests passed functionally, including all new geofilter tests.
- The aggregate common target reported failure only because its coverage wrapper
  collected no data in the `/tmp` worktree and therefore reported 0% coverage.
- A focused geofilter rerun with coverage disabled passed.
- `git diff --check` passed.

## Country-assignment audit

Audited all 38 entries on 2026-08-03 against the coordinates stored under
`wayve/core/data/geofences/`:

- `GBR`: 23 polygons; all coordinates are in the UK.
- `USA`: 5 polygons; all coordinates are in California.
- `DEU`: 5 polygons; all coordinates are in Germany.
- `JPN`: 5 polygons; all coordinates are in Japan.

No misclassified polygon was found. In particular,
`test_track_segula_technologies.json` spans approximately 8.903-8.935 E and
49.983-50.001 N, matching SEGULA Technologies' Rodgau-Dudenhofen test center
in Germany. It should remain under `DEU`; moving it to `ISR` would make the
country index disagree with the stored polygon. The apparent issue is likely a
name collision with Segula/Sgula in Israel rather than the SEGULA Technologies
test center represented by this geofence.
