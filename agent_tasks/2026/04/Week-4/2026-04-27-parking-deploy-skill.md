# Parking Deploy Skill

## Summary
- Added a new local Codex skill at `~/.codex/skills/parking-deploy/SKILL.md`.
- The skill defines the post-training Parking/PUDO deployment flow that starts from a finished trained model and ends with a deployed interleave-control model plus the standard Console follow-ups.
- The workflow uses `exotic-jellyfish-silver` as the concrete reference deployment and points back to source model `fiery-aardvark-copper`.

## What Changed
- Created skill:
  - `${HOME}/git/ParkingSkills/skills/parking-deploy/SKILL.md`
- Updated agent metadata:
  - `${HOME}/git/ParkingSkills/skills/parking-deploy/agents/openai.yaml`
- Refined the skill after creation to match the requested post-training flow exactly:
  - latest source checkpoint means max trained-model `checkpoint_num`
  - deploy is delegated to `$parking-interleave-deploy`
  - model lookup/checkpoint/CI routing goes through `$model-info-finder`
  - deploy commands from `/workspace/WayveCode` must run through a spawned sub-agent

## Workflow Encoded In The Skill
- Resolve the trained model nickname or session id.
- Default to the latest checkpoint in Model Catalogue when the user does not specify one.
- Call `$parking-interleave-deploy` to create the interleave-control deployment with group `parking`.
- Resolve the actual deployed nickname and `gen2` artefact id after upload.
- Add the standard `model_change_note` in Console:
  - `Parking/PUDO model`
  - `- deployed with interleave control group parking`
  - `- based on trained model <trained-model-nickname>`
- Trigger Gen2 AV Mache Alpha 3 Model CI for the deployed `gen2` artefact.
- Document the preferred trigger path for:
  - `Failed to Unpudo Standstill(No Indicator)`
  - accelerate-from-stopped evaluation
- Optionally create a UK licensing experiment using the same template shape as the `exotic-jellyfish-silver` reference flow.

## Important Operational Notes Captured
- Console POST mutations should use the Console proxy path `https://console.sso.wayve.ai/api/model-catalogue/...` plus the `_oauth2_proxy` cookie, not direct POSTs to the internal Model Catalogue API.
- The skill uses shared helper scripts from `model-lookup-basic` and `model-catalogue-core` so latest-checkpoint resolution stays consistent.
- For the two extra parking follow-up evals, the skill explicitly avoids fabricating suite ids or unstable trigger commands when only suite names are known.

## Validation
- Ran the skill validator:

```bash
python ${HOME}/git/ParkingSkills/skills/.system/skill-creator/scripts/quick_validate.py ${HOME}/git/ParkingSkills/skills/parking-deploy
```

- Result: `Skill is valid!`

## Live Test Follow-Up
- During the `precious-peach-panda` live test, the UK licensing experiment endpoint accepted the current nested `experiment_details` payload shape rather than the older flattened example.
- Updated the skill's licensing experiment section to use the working Console `/v2/on_road_experiments` payload shape and note that created experiments remain `pending_approval` unless explicitly approved.
- Re-ran the skill validator after the update: `Skill is valid!`

## AV Test Stats Follow-Up
- Replaced the remaining `$train-parking-model` dependency with `$av-test-multi-model-stats` for parking-specific follow-up evaluations.
- Updated the skill to resolve `Failed to Unpudo Standstill(No Indicator)` and accelerate-from-stopped to scenario collection version ids, run the deployed interleave nickname through `$av-test-multi-model-stats`, and report the per-collection plus aggregate result tables.
- Updated the skill metadata prompt to mention AV test stats and re-ran validation: `Skill is valid!`
