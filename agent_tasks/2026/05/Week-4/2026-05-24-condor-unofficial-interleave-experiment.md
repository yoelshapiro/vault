# Condor / Unofficial Drift PUDO Interleave Experiment

## Summary
- Created an on-road interleave experiment comparing `unofficial-cyan-pigeon` with `condor-fearless-ivory`.
- Used `$create-on-road-experiment` guidance and copied controller/template/driving feature configuration from reference experiment `8685ed72-b127-456d-b272-7f6cf0a5dfa3`.
- Kept `unofficial-cyan-pigeon` as control because the reference experiment uses it as the control branch.

## Reference
- Reference experiment: `8685ed72-b127-456d-b272-7f6cf0a5dfa3`.
- Reference template: `Tiny Sunnyvale Route (PUDO/Robotaxi)` (`80327ac7-ad76-4f26-ad40-1ffe4843f2ae`).
- Reference theme: `P1 - Robotaxi + PUDO` (`2fad6b3d-2fc4-4c3a-87c8-be03d76b5119`).
- Reference controller: `prod` / `denis-pudo-controller-73ff920e58d9-12.0.8`.
- Feature config: SBW enabled for parking, DILC on, driving mode disabled, collaborative driving disabled.

## Models
- Control: `unofficial-cyan-pigeon`.
  - Session: `session_2026_04_29_02_56_05_si_candidate_2026_6_19_combined_rl_tuned_driving_modes__ibex-lime-meritorious_interleave_control_v1_overlay__ibex-lime-meritorious_interleave_control_v1`.
  - Checkpoint: `1`.
  - Gen2 artefact: `e2357a18-605c-4cf9-862b-339b7fd97c6e`.
  - Licence: `gen2_mache_alpha3`.
- Variant: `condor-fearless-ivory`.
  - Session: `session_2026_05_22_08_40_39_si_parking_bc_train_release_2026_5_11_no_behave_no_imem_params_80k__lavender-ferret-ubiquitous_interleave_control_v1`.
  - Checkpoint: `1`.
  - Gen2 artefact: `7bebfac3-0f7f-49cd-baa4-ebe44593a77e`.
  - Licence: `gen2_mache_alpha3`.

## Created Experiment
- Experiment id: `6b6dc929-76a1-48c4-a69d-7b2118d7dfbb`.
- Experiment name: `:robot: [US] Drift/PUDO unofficial-cyan-pigeon vs condor-fearless-ivory 2026-05-24 (SBW on)`.
- Experiment URL: `https://console.sso.wayve.ai/on-road-experiments/6b6dc929-76a1-48c4-a69d-7b2118d7dfbb`.
- Status: `pending_approval`.
- Vehicle model: `gen2-av-mache-alpha3`.
- Tags: `drift`, `pudo`, `RUN_TAG_V2_DRIVING_FEATURE_DILC_TEST`, `[Run Tag] Robotaxi: Development`.
- Paused: `false`.
