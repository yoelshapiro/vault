# 2026-08-07 P2P Materialisation PR Audit

- PR: `wayveai/WayveCode#129778`
- Branch: `yoel/p2p_odo_materialize`
- Scope verdict: The intentional P2P source and timing changes are coherent, but the PR is broader than necessary because it mixes generic workflow plumbing and production-unused tuning parameters into the same change.
- Intent clarification: The `select_timestamp_within_p2p_parking_window` default change from an 8-second pre-start margin to 0 is intentional, and the adapted unit test correctly records the new behavior.
- Shared utility safety: Existing callers of `get_dataset_from_store` are behavior-preserving when `events_table_path` is omitted. The default sentinel returns the original dataset and preserves snapshots. Explicit overrides fail fast for non-P2P datasets, but introduce P2P-specific coupling into generic sampling APIs.
- Recommended minimisation: Retain the P2P source migration and intentional timing changes. Prefer the existing `delta_table_overrides_json` mechanism if its JSON CLI ergonomics are acceptable; its string-path behavior is equivalent to `events_table_path` and avoids P2P-specific generic workflow plumbing.
- Validation: Current CI passes and the updated unit tests cover the intentional 0-second default and optional 8-second margin.
