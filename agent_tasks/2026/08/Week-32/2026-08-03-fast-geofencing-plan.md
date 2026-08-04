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

Treat `iso_country_code` as a scalar ISO-3 string such as `GBR`, `USA`, `DEU`,
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
  `iso_country_code: str | None = None` to avoid breaking callers.
- For `is_in_any_polygon`, `iso_country_code` supplies the registered country
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
     `custom_polygons_by_country[iso_country_code]` and convert them with the
     same helper.
   - Materialize iterables once so generators are not consumed by validation
     and then unexpectedly empty during execution.

3. **Expose the fast path without breaking callers**
   - Extend `is_in_any_geofence()` and `is_in_any_polygon()` with the trailing
     optional `iso_country_code` parameter.
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
- A caller can pass `iso_country_code` with `None` for names/polygons and search
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
- Added the scalar `iso_country_code` fast path to Spark and pandas geofence and
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

The audit is now enforced by a unit test in commit `afb66722c8ff`. For every
polygon component in `custom_polygons_by_country`, the test computes a Shapely
representative point and resolves it through the repository's canonical
worldwide country lookup, failing with the geofence name, declared country,
resolved country, and coordinates on any mismatch. Pipelines unit, Ruff,
Flake8, type, BUILD-format, and Python-format checks passed, as did the focused
common geofilter regression suite. PR: `wayveai/WayveCode#129077`.

On 2026-08-03, merged `origin/main` at `eb7bb7f39226` into the feature branch
as commit `7a6bbb4b0c32` and pushed it. Post-merge uncached validation passed:
12/12 geofilter-related cases and 2/2 pipeline registry/country cases (all 12
new cases passed), plus Ruff, Flake8, type, Python-format, BUILD-format, and
dangling-symlink checks. The PR description was updated with these results.
Global lint-coverage, version-bump, and testcontainers helpers were unavailable
because of VM configuration (`/cache/disk/disk`, missing `CODER_PATH`, and a
missing static-check module), not feature failures.

On 2026-08-03, renamed the public and internal country parameter from the
mistyped `country_iso_code` to `iso_country_code` throughout the implementation,
tests, diagnostics, and PR description. Commit `e3e01e73239b` was pushed after
both focused Bazel unit targets, six Ruff/Flake8/type targets, and Python format
checks passed.

## Review feedback plan (2026-08-04)

PR review identified four unresolved issues in `geofilters.py`:

1. The materialisation caller has row-level country metadata, while the new API
   accepts only a driver-side scalar and is not wired into production.
2. The pandas empty-result path loses a non-default input index.
3. An empty Spark candidate set still constructs and evaluates a pandas UDF.
4. A valid ISO country with no registered custom polygons is treated as an
   invalid country.

Recommended implementation:

- Keep the scalar ISO-code path and additionally accept a Spark country
  `Column` for named-geofence filtering.
- Implement row-wise dispatch inside one pandas UDF: split each Arrow batch by
  country, run point-in-polygon only with that country's narrowed candidates,
  and scatter results back into batch order. Avoid separate UDFs under Spark
  `when` branches because Python UDF extraction can evaluate those branches
  eagerly.
- Resolve `StaticScenerySchema.iso_country_code` in the corpus conditions
  wrapper so dataset materialisation automatically uses the row-level path.
- Preserve legacy coordinate behavior for rows with missing country metadata by
  falling back to the explicit global candidate set; reject malformed non-null
  codes. Recognised `CountryCode` values with no candidates return `false`.
- Return `lit(False)` before UDF construction whenever scalar or row-wise
  candidate resolution is globally empty.
- Preserve `input_dataframe.index` when pandas filtering returns an all-false
  result.
- Add mixed-country Spark coverage, valid-country-without-polygons coverage,
  malformed-code coverage, empty-candidate short-circuit coverage, null-country
  fallback coverage, and non-default pandas-index coverage. Re-run the common,
  corpus, and pipelines Bazel tests plus Ruff, Flake8, type, and format checks.

### Review feedback implementation result

Implemented and pushed as commit `277a8c7d1c64` on 2026-08-04:

- Added Spark row-wise country dispatch using one pandas UDF, while preserving
  the existing scalar API and global fallback for missing country metadata.
- Wired the corpus condition to `StaticScenerySchema.iso_country_code`, which
  activates the fast path for dataset materialisation.
- Valid ISO codes without registered polygons now match no rows and emit one
  structured `no_registered_geofence_polygons_for_country` warning containing
  the country code; malformed codes still raise.
- Empty candidate sets now return a Spark literal `false`, and pandas empty
  results retain the input index.
- Full common and corpus test targets passed, as did the pipelines registry
  target, six Ruff/Flake8/type targets, Python and BUILD format checks, and the
  dangling-symlink check. Three global helpers remained unavailable because of
  VM configuration (Bazel cache permissions, missing `CODER_PATH`, and the
  missing testcontainers static-check module).
- Replied to all four PR review conversations with the commit and verification
  details. Per request, none of the conversations was resolved.

### VM helper remediation (2026-08-04)

- Configured login shells to discover the Coder CLI and export `CODER_PATH`,
  allowing `make check-versions-bumped` to pass in a fresh login shell.
- Created the CI-configured Bazel cache path `/cache/disk/disk` and assigned
  `/cache/disk` to the workspace user, unblocking repository helpers that use
  `--config=ci`.
- Confirmed `make check-testcontainers-depends` is stale on `main`: its Python
  module was removed upstream and replaced by the maintained
  `//build_support/suites/static_checks:integration_test_tagging` target.
- The cache-backed checks now start correctly, but full-repository Bazel
  queries stop on missing private `valeo-artifactory` credentials (and also
  report missing ACR credentials). Completing the Valeo login requires a
  manually generated identity reference token from the Artifactory profile.
- Kept the fast-geofencing feature worktree clean while validating these VM
  and repository-helper issues.

### Second review feedback analysis (2026-08-04)

Two new review concerns were both reproduced with focused Spark regression
probes:

- A DataFrame containing coordinates but no ISO-country column fails analysis
  with `UNRESOLVED_COLUMN`, because the corpus condition resolves the country
  field against the canonical table schema rather than the actual DataFrame.
- A row containing an unknown non-null country value raises `ValueError` inside
  the pandas UDF, surfaces as a Spark `PythonException`, and aborts the job.

Mitigation plan:

1. Restore the existing corpus condition helper's legacy, country-independent
   expression so projected DataFrames and alternate/old tables remain safe.
2. Activate country narrowing only in materialisation call sites that already
   own the input DataFrame: resolve the country field against `df.columns`, use
   the row-wise fast path when present, and fall back to the legacy global
   polygon set when absent. Keep existing public APIs unchanged.
3. In the row-wise UDF, reserve strict validation for caller-provided scalar
   country codes. Treat unknown/legacy row values like missing metadata: emit
   one structured warning and evaluate those rows against the explicit global
   fallback polygons, preventing executor failure while preserving previous
   matching semantics.
4. Add regression coverage for a DataFrame without the country column, mixed
   valid/null/unknown row values, fallback matching for unknown values, and the
   continued scalar-code validation contract. Run full common, corpus, and
   materialisation-focused Bazel test targets plus static checks.

The temporary probes were removed after validation; the feature worktree was
left clean. No new review conversations were replied to or resolved because
both concerns are valid and require changes.

### Second review feedback implementation result

Implemented and pushed as commit `457e062f8ac2` on 2026-08-04:

- Restored the public corpus condition helper's country-independent behavior.
- Dataset materialisation now inspects the actual DataFrame schema and uses the
  country-aware path only when a country column exists; older tables and
  projections without it retain global-geofence behavior.
- Added schema-aware confidence-level coalescing for latitude, longitude, and
  country so higher-priority null columns still fall through to populated
  lower-priority values.
- Row-wise null and unknown/legacy country values fall back to global candidate
  polygons. Unknown non-null values emit a `warn_once` event per Python worker
  process rather than aborting executor tasks.
- A registered country narrowed to no requested names returns no match without
  a misleading warning. A valid ISO country with no registered polygons emits
  the informative no-polygons warning and returns no match. Scalar invalid
  country-code validation remains strict.
- An independent subagent reviewed both the mitigation plan and the final
  seven-file diff. Its initial edge-case findings were incorporated; its final
  pass found no actionable issue.

Verification:

- Full common, corpus, and dataset-materialisation unit suites passed.
- The pipelines suite passed through the local patch-coverage runner.
- Relevant downstream canary
  `//wayve/services/data/lakehouse/jobs/cpu/filtered_corpus:py_test` passed.
- Patch coverage against `origin/main` at `a7cc14097fee` was **99.11%**
  (**111/112** changed executable lines), above the 80% threshold.
- Ruff, Flake8, and `ty` passed for pipelines, common, corpus, and dataset
  materialisation (12 static targets total); formatting and `git diff --check`
  also passed.
- PR #129077's description was updated. Both new reviewer conversations were
  answered with `[Agent generated]:` replies and deliberately left unresolved.
- The pushed PR head is `457e062f8ac273af0481e8d9b1c3192b3a7568d3`.
