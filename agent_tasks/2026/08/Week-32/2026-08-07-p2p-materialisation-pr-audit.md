# 2026-08-07 P2P Materialisation PR Audit

- PR: `wayveai/WayveCode#129778`
- Branch: `yoel/p2p_odo_materialize`
- Scope verdict: Not minimal; P2P source/bucket changes are mixed with generic workflow plumbing and unused shared-filter parameterisation.
- Blocking finding: `select_timestamp_within_p2p_parking_window` changes its default pre-start margin from 8 seconds to 0. All six P2P park-in buckets call it without arguments, contradicting the PR statement that park-in/out buckets remain unchanged.
- Shared utility safety: Existing callers of `get_dataset_from_store` are behavior-preserving when `events_table_path` is omitted. The default sentinel returns the original dataset and preserves snapshots. Explicit overrides fail fast for non-P2P datasets, but introduce P2P-specific coupling into generic sampling APIs.
- Recommended minimisation: Restore the 8-second parking-window default; retain only the P2P source migration and targeted outdoor/street guard removals. Prefer the existing `delta_table_overrides_json` mechanism, or land a separately designed generic typed source override.
- Validation: Current CI passes, but the updated unit test encodes the unintended 0-second default instead of guarding the stated unchanged park-in behavior.
