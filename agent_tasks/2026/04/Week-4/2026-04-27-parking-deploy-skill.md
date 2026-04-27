# Parking Deploy Skill

## Summary
- Added a new local Codex skill at `~/.codex/skills/parking-deploy/SKILL.md`.
- The skill defines the post-training Parking/PUDO deployment flow that starts from a finished trained model and ends with a deployed interleave-control model plus the standard Console follow-ups.
- The workflow uses `exotic-jellyfish-silver` as the concrete reference deployment and points back to source model `fiery-aardvark-copper`.

## What Changed
- Created skill:
  - `/home/borisindelman/git/ParkingSkills/skills/parking-deploy/SKILL.md`
- Updated agent metadata:
  - `/home/borisindelman/git/ParkingSkills/skills/parking-deploy/agents/openai.yaml`

## Workflow Encoded In The Skill
- Resolve the trained model nickname or session id.
- Default to the latest checkpoint in Model Catalogue when the user does not specify one.
- Call `$parking-interleave-deploy` to create the interleave-control deployment with group `parking`.
- Resolve the actual deployed nickname and `gen2` artefact id after upload.
- Add the standard `model_change_note` in Console:
  - `PUDO model`
  - `- deployed with interleave control group Parking`
  - `- based on <trained-model-nickname>`
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
python /home/borisindelman/git/ParkingSkills/skills/.system/skill-creator/scripts/quick_validate.py /home/borisindelman/git/ParkingSkills/skills/parking-deploy
```

- Result: `Skill is valid!`
